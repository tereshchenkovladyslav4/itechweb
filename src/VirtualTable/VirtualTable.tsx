//https://codesandbox.io/s/my2902rzw9?file=/index.js
import React, { useState, useEffect, useRef, ReactElement } from "react";
import _ from "lodash";
import {
  // Column,
  // Table,
  SortDirection,
  SortIndicator,
  // AutoSizer,
  // InfiniteLoader,
  Index,
  TableHeaderProps,
  SortDirectionType,
} from "react-virtualized";
import "react-virtualized/styles.css";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import moment, { Moment } from "moment";
import Draggable, { ControlPosition } from "react-draggable";

//styles
import { Button, Tooltip, Checkbox, useTheme, Typography } from "@mui/material";
import { useStyles } from "./VirtualTable.styles";

//local components
import { Operations } from "../Filter/Operations";
import SearchBox from "./SearchBox";
import TableSearchBar from "./TableSearchBar";
import ItemMenu, { TableItemMenu } from "./ItemMenu";

//services
import { dataService, IDataService } from "../_services/dataService";
import { authenticationService } from "../_services/authenticationService";

//context
import { useStore } from "../_context/Store";
import { updateGridRowAction } from "../_context/actions/PageDataActions";

//Models
import { QuerySet } from "../Model/Types/QuerySet";
import { Filter } from "../Model/iTechRestApi/Filter";
import { DataSource } from "../Model/iTechRestApi/DataSource";
import { iTechControlSearchEnum } from "../Model/iTechRestApi/iTechControlSearchEnum";
import { Direction } from "../Model/Types/Direction";
import { SubItem } from "../Model/iTechRestApi/ITechDataWebFrontendComponent";

//helpers
import useAsyncError from "../_helpers/hooks/useAsyncError";
import ComponentError from "../_helpers/ComponentError";
import { ciEquals, closest, getTimePeriodDate, toSentence } from "../_helpers/utilities";
import {
  on,
  off,
  AddSearchTextEvent,
  ApplySavedResultSetEvent,
  MoveSelectedItemEvent,
  RefreshTableEvent,
} from "../_helpers/events";
import { useMergeState } from "../_helpers/hooks/useMergeState";
import {
  getDynamicDateDatasourceColumn,
  savedResultsDataSourceMap,
  tableReferenceURL,
} from "../_helpers/helpers";
import { TableEnum } from "../Model/iTechRestApi/TableEnum";
import { UserType } from "../Model/iTechRestApi/AuthenticateResponse";
import { iTechDataTaskStatusEnum } from "../Model/iTechRestApi/iTechDataTaskStatusEnum";
import { taskService } from "../_services/taskService";
import { useReferredState } from "../_helpers/hooks/useReferredState";
import { DialogType } from "./VirtualTable.actions";
import { iTechControlColumnEnum } from "../Model/iTechRestApi/iTechControlColumnEnum";
import { ticksToDate } from "../_helpers/dateConverter";
import { AdvancedFilterModel } from "../Model/iTechRestApi/AdvancedFilterModel";
import { iTechDataWebFilterEnum } from "../Model/iTechRestApi/iTechDataWebFilterEnum";
import { MapToDatasource } from "../Chart/IFilteredChart";
import { ITableFormProps } from "./Components/ITableFormProps";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import ITableConfig from "./TableConfig/ITableConfig";

// Hacks to get around incorrect typing with react v18
// https://github.com/bvaughn/react-virtualized/issues/1739
import {
  AutoSizer as _AutoSizer,
  AutoSizerProps,
  InfiniteLoader as _InfiniteLoader,
  InfiniteLoaderProps,
  Table as _Table,
  TableProps,
  Column as _Column,
  ColumnProps,
} from "react-virtualized";
import TableFooterBar from "./TableFooterBar";

const AutoSizer = _AutoSizer as unknown as React.FC<AutoSizerProps>;
const InfiniteLoader = _InfiniteLoader as unknown as React.FC<InfiniteLoaderProps>;
const Table = _Table as unknown as React.FC<TableProps>;
const Column = _Column as unknown as React.FC<ColumnProps>;

interface VirtualTableProps {
  setup: any;
  area: string;
  configUpdate(arg: any): any;
  updateData(arg: any): any;
  fixedFilters?: Filter[];
  config: ITableConfig;
  service?: IDataService;
}

export default function VirtualTable({
  setup,
  area,
  configUpdate,
  updateData,
  fixedFilters,
  config,
  service = dataService,
}: VirtualTableProps): ReactElement {
  const classes = useStyles();
  const theme = useTheme();
  const pagingCount = 100;
  const searchBarHeight = 40;
  const footerHeight = 48;
  const headerMinHeight = 40;
  const headerMaxHeight = 68;
  const rowHeight = 34;

  //const fileExportArea = "fileExport";
  // so it can be accessed in an event handler via the ref
  // if undefined when initally created - default to DESC
  const [sortDirectionState, sortDirectionRef, setSortDirection] = useReferredState(
    setup.sortDirection === "ASC" ? SortDirection.ASC : SortDirection.DESC
  );

  // so it can be accessed in an event handler via the ref
  const [sortByState, sortByRef, setSortBy] = useReferredState("");

  const [scrollToIndex, setScrollToIndex] = useState<number | undefined>(undefined);
  const [fullyLoaded, setFullyLoaded] = useState(false);

  const [resultData, _setResultData] = useMergeState({
    data: [] as any[],
    numberOfResultsFound: undefined,
    pagingState: { start: 0, end: pagingCount },
    cache: [],
  });
  // required so it can be accessed in an event handler
  const resultDataRef = useRef(resultData);
  const setResultData = (data: any) => {
    resultDataRef.current = data;
    _setResultData(data); // this should only be called directly here.
  };

  const [columns, setColumns] = useState<SubItem[]>([]);
  const [keyUpColumns, setKeyUpColumns] = useState<Filter[]>([]);
  const [preventSort, setPreventSort] = useState(false);
  const [searchText, searchTextRef, setSearchText] = useReferredState(setup.searchText || "");

  const [searchOptions, setSearchOptions] = useState<iTechControlSearchEnum[]>([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [showDialog, setShowDialog] = useState(DialogType.none);
  const [selected, setSelected] = useState(new Map()); // map for selected gids
  const [allChecked, setAllChecked] = useState(false);
  const [toggleUpdate, setToggleUpdate] = useState(false);
  const [dataSource, setDataSource] = useState<string>(setup.name);
  const [savedResultSetRowId, setSavedResultSetRowId] = useState<number>();
  const [savedResultSetName, setSavedResultSetName] = useState<string>(setup.resultSetName);
  const [localFilters, setLocalFilters] = useState<Filter[]>([]);
  const [prevFilters, setPrevFilters] = useState<string>("");

  const [timePeriod, setTimePeriod] = useState(0);
  const [appliedModels, setAppliedModels] = useState(
    setup.groupFilters
      ? new Map(
          Object.entries(setup.groupFilters).map((x) => [Number(x[0]), x[1] as AdvancedFilterModel])
        )
      : undefined
  );
  const controllerRef = useRef(new AbortController());
  const { promiseInProgress } = usePromiseTracker({ area: area });

  const throwError = useAsyncError();

  const isSwitchable = dataSource?.endsWith("Term");
  const isMounted = useIsMounted();

  const mounted = useRef<boolean>();
  const { dispatch, selectors } = useStore();

  const dynamicDateColumnName = getDynamicDateDatasourceColumn(
    dataSource,
    selectors.getDataSources()
  );

  const _handleAddSearchText = (e: CustomEvent) => {
    if (e.detail.dataSource === dataSource) {
      setSearchText(e.detail.searchText);
      setToggleUpdate((prev) => !prev);
    }
  };

  const _handleApplySavedResult = (e: CustomEvent) => {
    // only apply if the same original datasource
    if (columns[1].iTechControlTableRowId === e.detail.iTechControlTableRowId) {
      setSavedResultSetRowId(e.detail.rowId);
      setDataSource(e.detail.dataSource);
      const name = e.detail.resultSetName;
      setSavedResultSetName(name?.split("(")[0]?.trim());
      // trigger the _updateTableData through useEffect -> this calls configUpdate & reloads the table
      setToggleUpdate((prev) => !prev);
    }
  };

  const selectNextIncompleteTask = (currentIndex: number, currentGid: number): void => {
    // if not tasks table - return
    if (
      !(
        (
          ciEquals(dataSource, TableEnum[TableEnum.iTechWebTask]) ||
          columns[1]?.iTechControlTableRowId == TableEnum.iTechWebTask
        ) // in case tasks are allowed as a result set
      )
    ) {
      return;
    }

    const selectNextTask = (nextIncompleteItem: any) => {
      if (nextIncompleteItem) {
        const newIndex = resultDataRef.current.data.findIndex(
          (t) => t.rowId === nextIncompleteItem.rowId
        );
        setScrollToIndex(newIndex);
        _selectOnClick(nextIncompleteItem.gid);
      }
    };

    let tasks = resultDataRef.current.data.slice(currentIndex);

    if (tasks.length && (!tasks[0].taskTypeDescription || !tasks[0].taskStatusTypeDescription)) {
      // columns not configured in table - so use api to determine next task

      const expressions = getExpressions();

      let id: number | null = null;
      const sortDirection = sortDirectionRef.current;
      const sortBy = sortByRef.current;

      (async () => {
        // this appears to be for the next page request.. not current - so adjust
        const paging = { ...resultDataRef.current.pagingState };
        if (paging.start > 0) {
          paging.start -= pagingCount;
          paging.end -= pagingCount;
        }
        id = await taskService.nextTask(currentGid, {
          paging,
          sortBy,
          sortDirection,
          expressions,
          searchText: searchTextRef.current,
          searchOptions,
        } as QuerySet);
        const task = resultDataRef.current.data.find((t) => t.rowId === id);
        selectNextTask(task);
      })();

      return;
    }

    // filter on task types that are manual
    // N.B. keep these in sync with iTechWebTaskController::GetNextITechWebTask
    const validTaskType = [
      "Manual Review an item",
      "Supervisor Review",
      "Requestor Response",
      "ID Outcome",
      "Data Source Selection",
      "Selection of existing terms",
      "Addition of new terms",
      "Checkpoint review task of an agents own work",
    ];

    tasks = tasks.filter((t) => validTaskType.includes(t.taskTypeDescription?.trim()));

    // we only have the string values in the data.. and then only if configured
    // N.B. keep these in sync with iTechWebTaskController::GetNextITechWebTask
    const validStatus = [
      toSentence(iTechDataTaskStatusEnum[iTechDataTaskStatusEnum.notStarted]),
      toSentence(iTechDataTaskStatusEnum[iTechDataTaskStatusEnum.waitingForReview]),
      toSentence(iTechDataTaskStatusEnum[iTechDataTaskStatusEnum.workingOnIt]),
    ];

    const next = tasks
      .filter((t) => validStatus.includes(t.taskStatusTypeDescription))
      .find(() => true);

    // not found so - start from the top ( if not already! )
    if (!next && currentIndex !== 0) {
      selectNextIncompleteTask(0, currentGid);
      return;
    }

    selectNextTask(next);
  };

  const _handleMoveSelectedItem = (e: CustomEvent) => {
    const selectedItem = selectors.getSelectedGridRow();

    // ignore if not for our source
    if (dataSource !== selectedItem?.datasource) return;

    const index = resultDataRef.current.data?.findIndex((x) => x.gid === selectedItem?.gid);

    switch (e.detail.direction as Direction) {
      case Direction.Up:
        {
          if (index >= 1 && index < resultDataRef.current.data.length) {
            const nextItem = resultDataRef.current.data[index - 1];
            if (nextItem !== undefined) {
              _selectOnClick(nextItem.gid);
              setScrollToIndex(index - 1);
            }
          } else {
            const lastItem = resultDataRef.current.data.slice(-1)[0];
            if (lastItem !== undefined) {
              _selectOnClick(lastItem.gid);
              setScrollToIndex(resultDataRef.current.data.length - 1);
            }
          }
        }
        break;
      case Direction.Down:
        {
          if (index >= 0 && index < resultDataRef.current.data.length - 1) {
            const nextItem = resultDataRef.current.data[index + 1];
            if (nextItem !== undefined) {
              _selectOnClick(nextItem.gid);
              setScrollToIndex(index + 1);
            }
          } else if (resultDataRef.current.data !== undefined) {
            const firstItem = resultDataRef.current.data[0];
            if (firstItem !== undefined) {
              _selectOnClick(firstItem.gid);
              setScrollToIndex(0);
            }
          }
        }
        break;
      case Direction.Skip:
        {
          // N.B. This functionality is only appropriate to a datasource of iTechWebTask
          const startIndex =
            index >= 0 && index < resultDataRef.current.data.length - 1 ? index + 1 : 0;
          selectNextIncompleteTask(startIndex, Number(selectedItem?.gid || 0));
        }
        break;
      default:
        break;
    }
  };

  const _handleRefreshTable = (e?: CustomEvent) => {
    // ignore if datasource present and it doesnt match
    if (e?.detail?.dataSource && e.detail.dataSource !== dataSource) return;

    setToggleUpdate((prev) => !prev);
  };

  // temporary function to correct persisted component.localFilters where dateInserted added but not present on datasource
  const cleanLocalFilters = (filters: any[]) => {
    if (!filters) return filters;
    const dateInserted = filters.find((x) => x.name === "dateInserted");
    if (dateInserted) {
      const cols = selectors.getDataSources();
      if (cols) {
        const table = cols.find((x) => x.name === dataSource);
        if (table) {
          const col = table.iTechControlColumns.find((x) => x.name === "dateInserted");
          if (!col) {
            if (!dynamicDateColumnName) {
              return filters.filter((x) => x.name !== "dateInserted");
            }
            // change to be the dynamic col
            dateInserted.name = dynamicDateColumnName;
          }
        }
      }
    }
    // if table existed before this functionality - add the column
    if (dynamicDateColumnName && !filters.find((x) => x.name === dynamicDateColumnName)) {
      filters.push({
        value: timePeriod === 0 ? "" : timePeriod,
        name: dynamicDateColumnName,
        operation: "After",
        iTechControlColumnTypeRowId: iTechControlColumnEnum.dateTime,
      });
    }
    return filters;
  };

  useEffect(() => {
    on(AddSearchTextEvent, _handleAddSearchText);
    on(ApplySavedResultSetEvent, _handleApplySavedResult);
    on(MoveSelectedItemEvent, _handleMoveSelectedItem);
    on(RefreshTableEvent, _handleRefreshTable);

    if (!mounted.current) {
      if (setup.subItems && setup.subItems.length) {
        const cols = _columnSetup(setup.subItems);
        const sort = setup.sortBy ? setup.sortBy : cols[1].name;
        setSortBy(sort);

        setColumns(cols);
        const filters = cleanLocalFilters(setup.localFilters) || convertColsToLocalFilter(cols);
        setLocalFilters(filters);
        setKeyUpColumns([...filters]); // N.B. Dodgey... localfilters / keyupcolumns are the same objects.

        setIsSearchVisible(_filtersExist(filters));

        const timePeriodFilter = filters.find(
          (x: Filter) => x.name === dynamicDateColumnName && x.value
        );

        if (timePeriodFilter) {
          setTimePeriod(timePeriodFilter.value);
        }
      }

      mounted.current = true;
    } else {
      // if dragging columns wait until stopped to persist table
      if (!preventSort) {
        _updateTableData({
          scrollToTop: false,
          forceReload: true, // filters may be unchanged but the data could be different at from external RefreshTableEvent
        });
      }
    }
    return () => {
      off(AddSearchTextEvent, _handleAddSearchText);
      off(ApplySavedResultSetEvent, _handleApplySavedResult);
      off(MoveSelectedItemEvent, _handleMoveSelectedItem);
      off(RefreshTableEvent, _handleRefreshTable);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // TODO - test if need deep compare
    // JSON.stringify(Object.fromEntries(appliedModels||[])), // as its an array of arrays - provides deep equality test
    appliedModels,
    toggleUpdate,
    localFilters,
    columns,
    JSON.stringify(fixedFilters), // need as json as get in a re-render loop with object audit pane otherwise as its a new instance prop each time
  ]);

  useEffect(() => {
    const models = selectors.getAllFilterModelsForDataSource(dataSource, setup.filterGroupColor);
    if (models) {
      setAppliedModels((prev) =>
        prev ? new Map<iTechDataWebFilterEnum, AdvancedFilterModel>([...prev, ...models]) : models
      );
    }
  }, [
    JSON.stringify(
      Object.fromEntries(
        selectors.getAllFilterModelsForDataSource(dataSource, setup.filterGroupColor) || []
      )
    ),
  ]);

  useEffect(() => {
    //If we are loading from a template, the loaded component json may still have the rowID set from the data that was being used when the template was created.
    //This will override that if we are on a case tab.
    const caseId = selectors.getSelectedCaseId();
    if (caseId) {
      setSavedResultSetRowId(caseId);
      setSavedResultSetName("");
    } else if (setup.rowId) {
      setSavedResultSetRowId(setup.rowId);
    }
  }, [setup.rowId]);

  useEffect(() => {
    const _columns = [...keyUpColumns];
    const col = _columns.find((c) => c.name === dynamicDateColumnName);
    if (col) {
      col.value = timePeriod === 0 ? "" : timePeriod;
      setKeyUpColumns(_columns);
      _updateTableData({ sortBy: sortByState, sortDirection: sortDirectionState });
    }
  }, [timePeriod]);

  const _columnSetup = (columns: SubItem[]): SubItem[] => {
    const remainingWidth = columns.map((col) => col.width || 0).reduce((prev, next) => prev + next);

    const defaultWidth = (1 - remainingWidth) / columns.filter((col) => !col.width).length;

    columns.filter((col) => !col.width).forEach((x) => (x.width = defaultWidth));

    // length + 1 as adding checkbox col too
    const selectColumn =
      !config.preventSelection &&
      !columns.some((c) => c.name === "select") &&
      (!isSwitchable || selectors.getSelectedCaseId() !== undefined)
        ? [
            {
              index: columns.length + 1,
              name: "select",
              width: 0,
              minWidth: isSwitchable ? 70 : 50,
            } as SubItem,
          ]
        : [];

    const checkboxColumn =
      !config.hideCheckBox && !columns.some((c) => c.name === "checkbox")
        ? [{ index: 0, name: "checkbox", width: 0, minWidth: 40 } as SubItem]
        : [];

    // if columns already present (persisted) for items now configured to not show... remove them
    if (config.hideCheckBox) {
      columns = [...columns.filter((x) => x.name !== "checkbox")];
    }
    if (config.preventSelection) {
      columns = [...columns.filter((x) => x.name !== "select")];
    }

    const newColumns = [...checkboxColumn, ...columns, ...selectColumn];

    // re-order the column indexes -some current grids have duplicates for 1st or last cols ( effects column drag )
    newColumns.sort((x) => x.index).forEach((x, i) => (x.index = i));

    return newColumns;
  };

  // exclude the timeperiod filter in this check as its in the table search bar
  const _filtersExist = (filters = localFilters) => {
    return (
      filters.filter((x) => x.name !== dynamicDateColumnName).some((col) => col.value) ||
      searchText !== ""
    );
  };

  const _getDataSourceFilters = (): DataSource[] | undefined => {
    const appliedDS = MapToDatasource(appliedModels);
    const flatDs: DataSource[] = [];

    // flatten any nested tree filters...
    appliedDS?.forEach((v) => {
      v.filters.forEach((filter: any) => {
        if (filter.filters?.length) {
          flatDs.push({
            filters: filter.filters,
            rule: filter.rule,
            name: dataSource,
            rowId: 0,
            id: 0,
          });
        } else {
          flatDs.push({ rule: filter.rule, filters: [filter], name: dataSource, id: 0, rowId: 0 });
        }
      });
    });

    if (fixedFilters) {
      const ds = {
        filters: fixedFilters,
        rule: "AND",
      } as DataSource;
      if (flatDs) return [ds, ...flatDs];
      else return [ds];
    }
    return flatDs;
  };

  const _infiniteData = () => {
    return _loadMoreData(false);
  };

  const _loadAllData = () => {
    resultData.pagingState.end = resultData.numberOfResultsFound || 0;
    return _loadMoreData(false, undefined, undefined, resultData.pagingState).then(() =>
      setFullyLoaded(true)
    );
  };

  const getExpressions = () => {
    let expressions = [{ rule: "AND", filters: localFilters } as DataSource];

    const newPageData = _getDataSourceFilters();
    if (newPageData) {
      expressions = expressions?.concat(newPageData);
    }
    return expressions;
  };

  const _ops = (filter: any) =>
    Operations.find((op) => op.rowId === filter.iTechControlColumnTypeRowId);

  function convertColsToLocalFilter(cols: any[]): Filter[] {
    const filters: Filter[] = [];
    cols
      .filter((x: any) => !["checkbox", "select"].includes(x.name))
      .forEach((x: any) => {
        filters.push({
          value: x.value,
          name: x.name,
          operation: _ops(x)?.operations[0],
          iTechControlColumnTypeRowId: x.iTechControlColumnTypeRowId,
        } as Filter);
        delete x.value;
      });
    const timePeriodFilter = {
      value: timePeriod === 0 ? "" : timePeriod,
      name: dynamicDateColumnName,
      operation: "After",
      iTechControlColumnTypeRowId: iTechControlColumnEnum.dateTime,
    } as Filter;
    return [...filters, timePeriodFilter];
  }

  // const _exportData = () => {
  //   const expressions = getExpressions();
  //   return trackPromise(
  //     service.fileExport(dataSource, {
  //       sortBy: sortByState,
  //       sortDirection: sortDirectionState,
  //       expressions,
  //       searchText,
  //       searchOptions,
  //     } as unknown as QuerySet),
  //     fileExportArea
  //   );
  // };

  const _loadMoreData = (
    clearData: boolean,
    sortBy = sortByState,
    sortDirection = sortDirectionState,
    paging = resultData.pagingState
  ) => {
    const isExternalUser =
      authenticationService.currentUserValue == undefined ||
      authenticationService.currentUserValue.userType === UserType.external; // external or logged out

    // dont persist changes to table config currently for an external user as all users reference the same component DB entry
    // N.B.. if a signed in internal user visits the reviewpage url and amends table config - it will persist
    if (!isExternalUser) {
      const modelData = appliedModels ? Object.fromEntries(appliedModels) : undefined;

      configUpdate({
        paging,
        sortBy,
        sortDirection,
        columns,
        searchText,
        name: dataSource,
        rowId: savedResultSetRowId,
        localFilters: localFilters,
        resultSetName: savedResultSetName,
        groupFilters: modelData,
      });
    }
    const expressions = getExpressions();

    // for savedResultSets / Cases rowId will be set and needs to be part of query params
    const src =
      dataSource.endsWith("SavedResults") || dataSource.endsWith("WebSimCaseFile")
        ? dataSource + "/" + savedResultSetRowId
        : dataSource;

    if (controllerRef.current && promiseInProgress && !controllerRef.current.signal.aborted) {
      controllerRef.current.abort();
      // create a new instance for the next fetch
      controllerRef.current = new AbortController();
    }

    return trackPromise(
      service.query(
        src,
        {
          paging,
          sortBy,
          sortDirection,
          expressions,
          searchText,
          searchOptions,
        } as QuerySet,
        controllerRef.current.signal
      ),
      area
    ).then(
      (result) => {
        if (!isMounted()) return;

        const tempCache = clearData ? result.results : [...resultData.data, ...result.results];
        const tempData =
          result.Source === "mock"
            ? _dataTransform({ sortBy, sortDirection, data: tempCache })
            : tempCache;

        paging.start = result.startIndex + pagingCount;
        paging.end = paging.start + pagingCount;

        // clear out any selectedIndexes no longer in results
        if (clearData && selected.size) {
          setSelected((prev) => {
            const remainingKeys = [...prev.entries()].filter((item) =>
              tempData.some((res: any) => res.gid.toString() === item[0])
            );
            return new Map(remainingKeys);
          });
        }

        setResultData({
          data: tempData,
          numberOfResultsFound: result.numberOfResultsFound,
          pagingState: paging,
          cache: tempCache,
        });
      },
      (error) => {
        // dispatch(
        //   showErrorDialogAction(VirtualTable.displayName, error?.message)
        // );
        if (error.name === "AbortError") {
          return;
        }

        if (error !== "Unauthorized")
          // this is just here to stop error showing from review page when user logs out..
          throwError(new ComponentError(VirtualTable.displayName, error?.message || error));
      }
    );
  };

  const _isRowLoaded = ({ index }: Index) => {
    return !!resultData.data[index];
  };

  const _searchOnChange = (event: any) => {
    setSearchText(event.target.value);
  };

  const _searchOnOptionsChange = (opts: iTechControlSearchEnum[]) => {
    setSearchOptions(opts);
  };

  const _onSubmitSearch = () => {
    _updateTableData({ sortBy: sortByState, sortDirection: sortDirectionState });
  };

  const _onClear = () => {
    if (!_filtersExist()) return;
    setSearchText("");
    const cols = [...localFilters];
    cols.forEach((col) => (col.value = ""));
    setLocalFilters(cols);
  };

  const _cellRender = (col: any, data: any) => {
    return col.name === "checkbox"
      ? ({ rowData }: any) => _checkBoxRenderer({ item: rowData })
      : col.name === "select"
      ? ({ rowIndex }: any) =>
          config.rowActionComponent?.({
            rowData: data[rowIndex],
            refreshTable: _handleRefreshTable,
            selectOnClick: _selectOnClick,
            showDialog: (dialog: DialogType) => setShowDialog(dialog),
          }) //_selectRenderer({ rowData: data[rowIndex] })
      : config.cellComponent
      ? ({ rowIndex }: any) =>
          config.cellComponent?.({
            rowData: data[rowIndex],
            column: col,
          })
      : undefined;
  };

  const _checkBoxRenderer = ({ item }: any) => {
    const style = { paddingLeft: 0 };
    const datakey = item["gid"].toString();
    const checked = allChecked ? !selected.has(datakey) : selected.has(datakey); // selected is deselected list when allchecked
    return (
      <Checkbox
        name={String(datakey)}
        inputProps={{ "aria-label": "secondary checkbox" }}
        onChange={_checkBoxSelected}
        style={style}
        value={checked}
        checked={checked}
      />
    );
  };

  const _selectOnClick = (gid: any, rowData: any = undefined) => {
    //If the datasource is iTechWebSavedResults call for the datasource the item in the result set is from

    // N.B. this is using the rowId from iTechControlTable NOT iTechControlTableReferenceEnum as this doesnt seem present on columns.
    let ds =
      ciEquals(dataSource, "ITechWebSavedResults") && columns.length > 0
        ? savedResultsDataSourceMap[columns[1]?.iTechControlTableRowId ?? TableEnum.iTechWebSim]
        : dataSource;

    if (
      ciEquals(dataSource, "ITechWebAlert") &&
      rowData &&
      rowData["iTechControlTableReferenceTypeRowId"] !== undefined
    )
      ds = tableReferenceURL(parseInt(rowData["iTechControlTableReferenceTypeRowId"]));

    return trackPromise(service.gid(ds, gid.toString()), area).then(
      (result) => {
        result.datasource = dataSource;
        if (rowData) result.currentSelected = rowData; // allow row highlight to render correct row
        dispatch(updateGridRowAction({ ...result, filterGroupColor: setup.filterGroupColor }));
      },
      (error) => {
        throwError(new ComponentError(VirtualTable.displayName, error?.message || error));
      }
    );
  };

  const _checkBoxSelected = (e: any) => {
    const key = e.target.name; // gid as a string
    if (e.nativeEvent.shiftKey) {
      //get index of clicked item
      const clickedIndex = resultData.data.findIndex((item) => item.gid.toString() === key);
      //get the closest index
      const closestKey = closest(selected, clickedIndex);
      const closestIndex = resultData.data.findIndex((item) => item.gid.toString() === closestKey);

      let someResults: any[] = [];

      if (clickedIndex < closestIndex) {
        someResults = resultData.data.slice(clickedIndex, closestIndex);
      } else {
        someResults = resultData.data.slice(closestIndex, clickedIndex + 1);
      }

      const newMap = new Map(selected);
      someResults.forEach((row) => {
        newMap.set(row.gid.toString(), true);
      });
      setSelected(newMap);
    } else {
      const isChecked = allChecked ? !e.target.checked : e.target.checked;
      setSelected((prev) => {
        const newMap = new Map(prev);
        isChecked ? newMap.set(key, isChecked) : newMap.delete(key);
        return newMap;
      });
    }
  };

  const _toggleSearchVisibility = () => {
    setIsSearchVisible(!isSearchVisible);

    _onClear();
  };

  const _checkBoxAllSelected = (e: any) => {
    const isChecked = e.target.checked;

    setAllChecked(isChecked);
    setSelected(new Map()); // clear the selected / deselected list
  };

  const _headerRenderer = (
    width: number,
    { columnData, dataKey, disableSort, label, sortBy, sortDirection }: TableHeaderProps
  ) => {
    if (dataKey === "checkbox") {
      return (
        <Checkbox
          key={dataKey + allChecked}
          name={String(dataKey)}
          inputProps={{ "aria-label": "secondary checkbox" }}
          color="primary"
          onChange={_checkBoxAllSelected}
          value={allChecked}
          checked={allChecked}
        />
      );
    }
    const sort =
      dataKey === sortBy && !disableSort ? <SortIndicator sortDirection={sortDirection} /> : null;
    const column = columns.find((c) => c.name === dataKey);
    const columnFilter = localFilters.find((f) => f.name === column?.name);
    const drag = columnData.lastColumn ? null : (
      <Draggable
        axis="x"
        scale={1}
        defaultClassName="DragHandle"
        defaultClassNameDragging="DragHandleActive"
        onDrag={(_, { deltaX }) =>
          _resizeColumn({
            dataKey,
            deltaX,
            scale: 1.6, // applying just the delta seems to be out of position so apply a fiddle factor
            width,
          })
        }
        position={{ x: 0 } as unknown as ControlPosition} // stops the draghandle appearing off location
        onStop={() => {
          setTimeout(() => {
            setPreventSort(false);
            // just update the table config - no need to reload the data
            configUpdate({
              paging: resultData.pagingState,
              sortBy,
              sortDirection,
              columns,
              searchText,
              name: dataSource,
              rowId: savedResultSetRowId,
              localFilters: localFilters,
              resultSetName: savedResultSetName,
            });
          }, 200);
          return;
        }} // prevent sorting onmouseout
      >
        <span className="DragHandleIcon">⋮</span>
      </Draggable>
    );
    const filterInput = !["checkbox", "select"].includes(dataKey) && (
      <SearchBox
        value={columnFilter?.value}
        onFocus={() => setPreventSort(true)}
        onBlur={() => setPreventSort(false)}
        onKeyUp={(event) => _onKeyUp({ event, sortBy, sortDirection })}
        onChange={(event) => _onChange({ event, dataKey })}
        height={25}
        fullWidth={true}
        helperText={column?.helperText}
        isVisible={isSearchVisible}
      />
    );
    return (
      <React.Fragment key={dataKey}>
        <Typography variant="h6">{label?.toString()}</Typography>
        {dataKey !== "checkbox" && sort}
        {dataKey !== "checkbox" && drag}
        {filterInput}
      </React.Fragment>
    );
  };

  const _resizeColumn = ({
    dataKey,
    deltaX,
    scale,
    width,
  }: {
    dataKey: string;
    deltaX: number;
    scale: number;
    width: number;
  }) => {
    setPreventSort(true);

    const prevColumns = [...columns];
    const percentDelta = (deltaX * scale) / width;
    const currentCol = prevColumns.find((c) => c.name === dataKey);
    if (currentCol && percentDelta !== 0) {
      const nextDataKey = currentCol.index + 1;
      prevColumns[currentCol.index].width = Math.abs(
        prevColumns[currentCol.index].width + percentDelta
      );
      prevColumns[nextDataKey].width = Math.abs(prevColumns[nextDataKey].width - percentDelta);
      setColumns(prevColumns);
    }
  };

  const _onKeyUp = ({
    event,
    sortBy,
    sortDirection,
  }: {
    event: any;
    sortBy?: string;
    sortDirection?: SortDirectionType;
  }) => {
    if (event.keyCode === 13) {
      _updateTableData({ sortBy, sortDirection });
    }
  };

  const _onChange = ({ event, dataKey }: { event: any; dataKey: string }) => {
    const _columns = [...keyUpColumns];
    const col = _columns.find((c) => c.name === dataKey);
    if (col) {
      col.value = event.target.value;
      setKeyUpColumns(_columns);
    }
  };

  const getAllFiltersString = () => {
    // local filters + applied filters + search string
    const filters =
      MapToDatasource(appliedModels)
        ?.map((x) => x.filters)
        .flat() || [];
    const filterstring = localFilters
      .concat(filters)
      .map((x) => `${x.operation}${JSON.stringify(x.value)}`)
      .concat(searchText)
      .join(",");
    return filterstring;
  };

  const _updateTableData = ({
    sortBy = sortByState,
    sortDirection = sortDirectionState,
    scrollToTop = true,
    forceReload = false,
  }) => {
    if (sortBy === "checkbox") return;

    setScrollToIndex(scrollToTop ? 0 : undefined);
    setSortDirection(sortDirection);
    setSortBy(sortBy);

    const allFilters = getAllFiltersString();
    const filtersUnchanged = allFilters === prevFilters;

    // only call api if filter changes when got less than a page of results displaying
    if ((!fullyLoaded && !(allLoaded && filtersUnchanged)) || forceReload) {
      // TODO: load all results rather than reload 1st page if nearly complete
      const paging = { start: 0, end: pagingCount };
      _loadMoreData(true, sortBy, sortDirection, paging);
      setPrevFilters(allFilters);
    } else {
      const results = _dataTransform({
        sortBy,
        sortDirection,
        data: resultData.cache,
      });
      setSelected((prev) => {
        const remainingKeys = [...prev.entries()].filter((item) =>
          results.some((res: any) => res.gid.toString() === item[0])
        );
        return new Map(remainingKeys);
      });

      setResultData({ data: results, numberOfResultsFound: results.length });
    }
  };

  const _dataTransform = ({
    sortBy,
    sortDirection,
    data,
  }: {
    sortBy: string;
    sortDirection: SortDirectionType;
    data: any;
  }) => {
    const validColumns = localFilters.filter((c) => c.value);
    let filterDate: Moment | undefined = undefined;

    let newList =
      validColumns.length === 0
        ? data
        : _.filter(data, (row) => {
            return validColumns.every((c) => {
              const searchValue = c.value.toString().toLowerCase();
              const rowValue = String(row[c.name]).toLowerCase();
              // get equivalent "String" date column name
              const timeperiodCol = dynamicDateColumnName + "String";
              // apply time period filter
              if (timeperiodCol === c.name || c.name === dynamicDateColumnName) {
                if (!filterDate) {
                  filterDate = getTimePeriodDate(Number(c.value));
                }
                if (filterDate) {
                  const dt = moment(!isNaN(row[c.name]) ? ticksToDate(row[c.name]) : rowValue);
                  return dt >= filterDate;
                }
              }
              return rowValue.indexOf(searchValue) !== -1;
            });
          });

    newList = sortBy.includes("date")
      ? _.sortBy(newList, (obj) => moment(obj))
      : _.sortBy(newList, [sortBy]);
    sortDirection === SortDirection.DESC && newList.reverse();

    return newList;
  };

  // equivalent of fullyLoaded - but that controls other logic
  const allLoaded = resultData.numberOfResultsFound === resultData.data.length;

  const rowsSelected =
    (allChecked && !allLoaded) ||
    (allChecked && allLoaded && selected.size !== resultData.data.length) ||
    (!allChecked && selected.size > 0);

  const _backToChartClick = () => {
    updateData(setup.backToChart);
  };

  const getWidth = (tableWidth: number, columns: SubItem[], col: SubItem): number => {
    let w = columns.find((c) => c.name === col.name)?.width || 10;
    if (w !== 10) {
      w = w * tableWidth;
    }
    return w;
  };

  const _tableFormProps = {
    showDialog,
    setShowDialog: (dialog: DialogType) => setShowDialog(dialog),
    selectedRow: selectors.getSelectedGridRow(),
    checkedRows: [...selected.keys()],
    allChecked,
    searchText,
    expressions: getExpressions(),
    refreshTable: () => _handleRefreshTable(),
    iTechControlTableRowId: columns[1]?.iTechControlTableRowId || TableEnum.iTechWebSim,
    setupRowId: setup.rowId,
  } as ITableFormProps;

  const _tableButtonName =
    (setup.customName?.length > 0 ? setup.customName : setup?.description ?? dataSource) +
    (savedResultSetName ? ` (${savedResultSetName})` : "");

  return (
    <div className={classes.root}>
      {config.forms?.(_tableFormProps)}

      <InfiniteLoader
        isRowLoaded={_isRowLoaded}
        loadMoreRows={_infiniteData}
        rowCount={resultData.numberOfResultsFound}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer>
            {({ height, width }) => (
              <>
                <TableSearchBar
                  onChange={_searchOnChange}
                  onOptionsChange={_searchOnOptionsChange}
                  onSubmit={_onSubmitSearch}
                  onClear={_onClear}
                  numberOfResultsFound={resultData.numberOfResultsFound}
                  numberOfResultsReturned={resultData.data.length}
                  onLoadResults={_loadAllData}
                  toggleSearchVisibility={_toggleSearchVisibility}
                  isSearchVisible={isSearchVisible}
                  value={searchText}
                  area={area}
                  dataSource={dataSource}
                  icon={setup.icon}
                  iconText={setup.customName?.length > 0 ? setup.customName : setup.description}
                  resultSetName={savedResultSetName}
                  timePeriod={timePeriod}
                  setTimePeriod={setTimePeriod}
                  filterGroup={setup.filterGroupColor}
                  filterModels={appliedModels}
                  setFilterModels={setAppliedModels}
                />
                <Table
                  ref={registerChild}
                  width={width}
                  height={height - searchBarHeight - 10 - footerHeight}
                  headerHeight={isSearchVisible ? headerMaxHeight : headerMinHeight}
                  rowHeight={rowHeight}
                  sort={!preventSort ? _updateTableData : undefined}
                  sortBy={sortByState}
                  sortDirection={sortDirectionState}
                  rowCount={resultData.data.length}
                  rowGetter={({ index }) => resultData.data[index]}
                  onRowsRendered={onRowsRendered}
                  scrollToIndex={scrollToIndex}
                  overscanRowCount={30}
                  rowStyle={(i) =>
                    config.rowStyle({
                      row: i,
                      rowData: resultData?.data[i.index],
                      theme,
                      selectedRow: selectors.getSelectedGridRow(),
                    })
                  }
                  onRowClick={(e) => {
                    // ignore when a checkbox / switch table row ( terms ) / select button
                    if (
                      !(e.event.target instanceof HTMLInputElement) &&
                      !isSwitchable &&
                      !(e.event.target instanceof SVGElement)
                    ) {
                      config.onRowClick({
                        rowData: { ...e.rowData, filterGroupColor: setup.filterGroupColor },
                        dispatch,
                        selectOnClick: _selectOnClick,
                        showDialog: (dialog: DialogType) => setShowDialog(dialog),
                      });
                    }
                  }}
                >
                  {columns &&
                    columns.map((col, i, arr) => (
                      <Column
                        headerRenderer={(x) => _headerRenderer(width, x)}
                        cellRenderer={_cellRender(col, resultData.data)}
                        columnData={{ lastColumn: arr.length - 1 === i }}
                        width={getWidth(width, columns, col)}
                        label={col.description}
                        dataKey={col.name}
                        key={col.name}
                        minWidth={col.minWidth || 100}
                      />
                    ))}
                </Table>
                <TableFooterBar
                  numberOfResultsFound={resultData.numberOfResultsFound}
                  numberOfResultsReturned={resultData.data.length}
                  onLoadResults={_loadAllData}
                  area={area}
                >
                  {
                    <TableItemMenu
                      actions={config.tableActions({
                        ..._tableFormProps,
                        caseId: selectors.getSelectedCaseId(),
                        dispatch,
                      })}
                      gid=""
                      icon={setup.icon}
                      isEnabled={rowsSelected || !config.disableTableActionMenu}
                      className={classes.itemMenu}
                      text={_tableButtonName}
                    />
                  }
                  {setup.backToChart && (
                    <Tooltip title="Back to chart" placement="left">
                      <span>
                        <Button onClick={_backToChartClick} className={classes.backToChart}>
                          &lt; Back
                        </Button>
                      </span>
                    </Tooltip>
                  )}
                  {config.tableFunctions?.({
                    querySet: {
                      sortBy: sortByState,
                      sortDirection: sortDirectionState,
                      expressions: getExpressions(),
                      searchText,
                      searchOptions,
                    } as unknown as QuerySet,
                    numberOfResultsFound: resultData?.numberOfResultsFound,
                    setShowDialog: (dialog: DialogType) => setShowDialog(dialog),
                  })}
                </TableFooterBar>
              </>
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    </div>
  );
}

VirtualTable.displayName = "VirtualTable";
