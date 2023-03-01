import React, { ReactElement, useState, useEffect, useRef } from "react";
import { Add, ArrowForward, Save, Close } from "@mui/icons-material";
import {
  IconButton,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useStore } from "../_context/Store";
import { applyFiltersAction } from "../_context/actions/PageDataActions";
import { filterService } from "../_services/filterService";
import { authenticationService } from "../_services/authenticationService";
import { Portal } from "@mui/material";
import { trackPromise } from "react-promise-tracker";
import { showErrorDialogAction } from "../_context/actions/HandleErrorActions";
import { Operations } from "./Operations";
import { ITechControlTable } from "../Model/iTechRestApi/ITechControlTable";
import { ITechDataWebFilterWithUser } from "../Model/iTechRestApi/ITechDataWebFilterWithUser";
import { ITechControlColumn } from "../Model/iTechRestApi/ITechControlColumn";
import { DataSource } from "../Model/iTechRestApi/DataSource";
import { v4 as uuidv4 } from "uuid";
import { iTechDataWebFilterEnum } from "../Model/iTechRestApi/iTechDataWebFilterEnum";
import { ComponentType } from "../ComponentDisplay/componentType";
import { useDataSources } from "../_context/thunks/dataSources";
import { TableEnum } from "../Model/iTechRestApi/TableEnum";
import { ITechDataWebFilter } from "../Model/iTechRestApi/ITechDataWebFilter";
import { dataService } from "../_services/dataService";
import { FilterGroup } from "../Model/Types/FilterGroup";
import { tableService } from "../_services/tableService";
import { useStyles } from "./AdvancedFilter.styles";
import "./AdvancedFilter.css";
import _ from "lodash";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormBuilder from "../Form/FormBuilder";
import SaveFilters from "../Form/SaveFilters";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FilterValue from "./FilterValue";
import FilterSelect from "./FilterSelect";
import FilterOperation from "./FilterOperation";
import RecordCount from "./RecordCount";
import clsx from "clsx";

interface IAdvancedFilterSubProps {
  data: any;
  area: string;
  tabId: number;
  currentFilterSet: any;
  setCurrentFilterSet: React.Dispatch<React.SetStateAction<any>>;
  loaded: boolean;
  ignoreCaseForRowCount?: boolean;
  dataSource?: string; // set this as the datasoruce and dont allow it to be changed
}

const AdvancedFilterSub: React.FC<IAdvancedFilterSubProps> = ({
  data,
  area,
  tabId,
  currentFilterSet,
  setCurrentFilterSet,
  loaded,
  dataSource,
  ignoreCaseForRowCount = false,
}): ReactElement => {
  return (
    <AdvancedFilterComponent
      data={data}
      area={area}
      tabId={tabId}
      onSubmit={() => {}}
      controlBarDisplay={false}
      currentFilterSet={currentFilterSet}
      setCurrentFilterSet={setCurrentFilterSet}
      loaded={loaded}
      allowCron={true}
      ignoreCaseForRowCount={ignoreCaseForRowCount}
      dataService={dataService}
      dataSource={dataSource}
    />
  );
};

interface IAdvancedFilterProps {
  data: any;
  area: string;
  tabId: number;
  updateData(arg: any): any;
  dataService?: typeof dataService; // if undefined will not render Row Count
}

const AdvancedFilter: React.FC<IAdvancedFilterProps> = ({
  data,
  area,
  tabId,
  updateData,
  dataService,
}): ReactElement => {
  const [currentFilterSet, setCurrentFilterSet] = useState<any>({});
  const { dispatch } = useStore();

  const onSubmit = (event: any) => {
    event.preventDefault();

    updateData({
      componentType: ComponentType.AdvancedFilter,
      wizardType: "Advanced Filter",
      wizardState: undefined,
      data: currentFilterSet,
      filterGroupColor: data?.filterGroupColor,
    });

    const filterGroupColor = (data?.filterGroupColor || "") as FilterGroup;

    // ensure do a deep copy otherwise changes to a filter will be applied to other filtergroups
    const filter = _.cloneDeep(currentFilterSet);
    dispatch(applyFiltersAction(filter, filterGroupColor));
  };

  return (
    <AdvancedFilterComponent
      data={data}
      area={area}
      tabId={tabId}
      controlBarDisplay={true}
      currentFilterSet={currentFilterSet}
      setCurrentFilterSet={setCurrentFilterSet}
      onSubmit={onSubmit}
      dataService={dataService}
    />
  );
};

interface IAdvancedFilterComponentProps {
  data: any;
  area: string;
  tabId: number;
  controlBarDisplay?: boolean;
  currentFilterSet: any;
  setCurrentFilterSet: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (event: any) => void;
  loaded?: boolean;
  allowCron?: boolean;
  dataService?: typeof dataService;
  ignoreCaseForRowCount?: boolean;
  dataSource?: string; // set this as the datasource and dont allow it to be changed
}

const AdvancedFilterComponent: React.FC<IAdvancedFilterComponentProps> = ({
  data,
  area,
  tabId,
  controlBarDisplay = true,
  currentFilterSet,
  setCurrentFilterSet,
  onSubmit,
  loaded = true,
  allowCron = true,
  dataService,
  dataSource,
  ignoreCaseForRowCount = false,
}): ReactElement => {
  const classes = useStyles();

  const tables = useRef<ITechControlTable[]>([]);
  //const [currentFilterSet, setCurrentFilterSet] = useState<any>({});

  const [preventSubmit, setPreventSubmit] = useState(false);
  const [loadForm, setLoadForm] = useState(false);

  const [savedFilters, setSavedFilters] = useState<ITechDataWebFilterWithUser[]>([]);

  const loadedFilters = tables.current.find((f) => f.rowId);
  const [loadedFilterRowId, setLoadedFilterRowId] = useState(
    loadedFilters ? loadedFilters.rowId : -1
  );

  const [userId] = useState(authenticationService.currentUserId); // just the user rowid part

  const ops = (filter: any) =>
    Operations.find((op) => op.rowId === filter.iTechControlColumnTypeRowId);

  const { dispatch } = useStore();

  const savedFilterOption = loadedFilterRowId >= 0 ? "Clear filters" : "Load saved filter";

  const container = React.useRef();
  const isMounted = useIsMounted();
  const tableList = useDataSources(tableService.getAll);

  useEffect(() => {
    if (tableList.length) {
      if (!isMounted()) return;

      // must clonedeep to prevent changes to dataSources in context state
      const tableData = _.cloneDeep(
        _.filter(tableList, (i) => i.iTechControlColumns.length > 0)
      ) as ITechControlTable[];
      tableData.forEach(
        (t) =>
          (t.iTechControlColumns = t.iTechControlColumns?.filter(
            (c: ITechControlColumn) => c.advancedFilterSelected
          ))
      );
      tables.current = tableData.filter((t) => t.iTechControlColumns.length); // remove any sources that dont have advanced filter columns
      if (dataSource) {
        const fixedSource = tables.current.filter((x) => x.name === dataSource);
        if (fixedSource?.length === 1) {
          tables.current = fixedSource;
        }
      }
      const current = data?.data ? data.data : _newDataSource();
      loadSavedFilters().then((x) => {
        if (!isMounted()) return;

        if (data?.data?.rowId && x.find((y) => y.filter.rowId === data?.data?.rowId)) {
          setLoadedFilterRowId(data.data.rowId);
        }
      });
      setCurrentFilterSet(current);
    }
  }, [tableList]);

  const _newDataSource = () => {
    if (tables.current.length === 0) return;

    const table = tables.current[0];
    const column = table.iTechControlColumns[0];

    return {
      name: "Advanced",
      rowId: tables.current.length + 1,
      id: uuidv4(),
      dataSources: [
        {
          rowId: table.rowId,
          name: table.name,
          id: 1, // needed as _nextId bases new datasources off this
          filters: [
            {
              id: 0,
              rowId: column.rowId,
              name: column.name,
              iTechControlColumnTypeRowId: column.iTechControlColumnTypeRowId,
              columnName: `Column-${tables.current.length}-0`,
              operation: ops(column)?.operations[0] || "",
              operationName: `Operation-${tables.current.length}-0`,
              value: "",
              isLogin: false,
            },
          ],
          rule: "AND",
        },
      ],
    };
  };

  useEffect(() => {
    if (!isMounted()) return;
    if (!loaded) {
      setCurrentFilterSet(_newDataSource());
    }
  }, [loaded]);

  const loadSavedFilters = (): Promise<ITechDataWebFilterWithUser[]> => {
    return trackPromise(filterService.getAll(), area).then(
      (filters) => {
        setSavedFilters(filters);
        return filters;
      },
      (error) => {
        dispatch(showErrorDialogAction(AdvancedFilter.displayName, error?.message));
        return [];
      }
    );
  };

  const _nextId = (array: any, getId: any) => {
    return array.length === 0 ? 0 : Math.max(...array.map(getId)) + 1;
  };

  const _handleNewDataSource = () => {
    const current = { ...currentFilterSet };
    const unassigned = _unassignedDatasources();
    if (unassigned.length === 0) return;
    current?.dataSources?.push({
      id: _nextId(currentFilterSet?.dataSources, (d: any) => d.id),
      rowId: unassigned[0].rowId,
      name: unassigned[0].name,
      filters: [],
      rule: "AND",
    });
    setCurrentFilterSet(current);
  };

  const _unassignedDatasources = () => {
    return _.filter(
      tables.current,
      (t) => currentFilterSet?.dataSources.find((c: any) => c.rowId === t.rowId) === undefined
    );
  };

  const _handleRemoveDataSource = (dataSource: DataSource) => {
    const current = { ...currentFilterSet };
    current.dataSources = current?.dataSources?.filter((d: any) => d !== dataSource);
    setCurrentFilterSet(current);
  };

  const _handleDataSourceChange = (id: any, value: any) => {
    const current = { ...currentFilterSet };
    const dataSource = current.dataSources.find((source: any) => source.id === id);
    if (dataSource) {
      dataSource.rowId = value;
      const table = tables.current.find((t) => t.rowId === value);
      if (table) {
        dataSource.name = table.name;
        dataSource.filters = [_getDefaultFilter(dataSource, 0)];
        setCurrentFilterSet(current);
      }
    }
  };

  const _handleNewFilter = (dataSource: any) => {
    const current = { ...currentFilterSet };
    const newId = _nextId(
      current.dataSources.find((source: any) => source === dataSource)?.filters,
      (f: any) => f.id
    );
    current.dataSources
      .find((source: any) => source === dataSource)
      ?.filters.push(_getDefaultFilter(dataSource, newId));
    setCurrentFilterSet(current);
  };

  const _getDefaultFilter = (dataSource: any, newId: any) => {
    const col = tables.current.find((t) => t.rowId === dataSource.rowId)?.iTechControlColumns[0];
    if (col)
      return {
        id: newId,
        rowId: col.rowId,
        name: col.name,
        iTechControlColumnTypeRowId: col.iTechControlColumnTypeRowId,
        columnName: `Column-${dataSource.rowId}-${newId}`,
        operation: ops(col)?.operations[0] || "",
        value: "",
        iTechControlColumnType: null,
        isLogin: col.isLogin,
      };
  };

  const _handleRemoveFilter = (dataSource: any, filter: any) => {
    const current = { ...currentFilterSet };
    current.dataSources.find((d: any) => d === dataSource).filters = current.dataSources
      .find((d: any) => d === dataSource)
      ?.filters.filter((f: any) => f !== filter);
    setCurrentFilterSet(current);
  };

  const _handleFilterChange = (dataSource: any) => {
    return (id: any, value: any) => {
      const current = { ...currentFilterSet };
      const filter = current.dataSources
        .find((source: any) => source === dataSource)
        .filters.find((filter: any) => filter.id === id);

      const column = tables.current
        ?.find((d) => d.rowId === dataSource.rowId)
        ?.iTechControlColumns.find((c) => c.rowId === value);
      filter.iTechControlColumnTypeRowId = column?.iTechControlColumnTypeRowId;
      filter.operation = ops(column)?.operations[0] || "";
      filter.value = "";
      filter.rowId = value;
      filter.name = column?.name;
      filter.valueName = `Value-${dataSource.rowId}-${filter.rowId}`;
      filter.isLogin = column?.isLogin;
      setCurrentFilterSet(current);
    };
  };

  const _handleOperationChange = (dataSource: any, filter: any) => {
    return (value: any) => {
      const current = { ...currentFilterSet };
      current.dataSources
        .find((source: any) => source === dataSource)
        .filters.find((f: any) => f.id === filter.id).operation = value;
      setCurrentFilterSet(current);
    };
  };

  const _handlePreventSubmit = (event: any) => {
    if (preventSubmit) {
      event.preventDefault();
    }
  };

  const _setValue = (dataSource: DataSource, filter: any) => {
    return (value: any) => {
      const current = { ...currentFilterSet };
      current.dataSources
        .find((source: any) => source === dataSource)
        .filters.find((f: any) => f === filter).value = value;
      setCurrentFilterSet(current);
    };
  };

  const _onFilterSelectChange = (e: any) => {
    const rowId = e.target.value;
    setLoadedFilterRowId(rowId);
    if (rowId >= 0) {
      const f = JSON.parse(savedFilters.find((f) => f.filter.rowId === rowId)?.filter?.json || "");
      setCurrentFilterSet(f); // copy this way otherwise the const is updated on rerender
    } else {
      setCurrentFilterSet(_newDataSource());
    }
  };

  const _onFormChange = (display: any) => {
    setLoadForm(display);
  };

  const saveFilter = (filter: any, isNew: any) => {
    if (isNew) {
      const newFilter = {
        json: JSON.stringify(filter),
        rowId: 0,
        iTechDataWebTabRowId: tabId,
        name: filter.name,
        dateArchived: null,
        dateInserted: null,
        dateModified: null,
        guid: [],
        iTechDataWebFilterTypeRowId: iTechDataWebFilterEnum.advanced, // AdvancedFilter
        iTechDataWebTemplateRowId: null,
        signature: [],
        status: [],
        filterCount: null,
        iTechDataSurveillanceRowId: null,
        iTechDataRuleRowId: null,
      } as unknown as ITechDataWebFilter;

      trackPromise(filterService.add(newFilter), area).then(
        (x) => {
          // add to state with allocated rowId & user info
          setSavedFilters((prev) => [...prev, x]);
          setLoadedFilterRowId(x.filter.rowId);
        },
        (error) => {
          dispatch(showErrorDialogAction(AdvancedFilter.displayName, error?.message));
        }
      );
    } else {
      const saveFilter = savedFilters.find((x) => x.filter.rowId === loadedFilterRowId)?.filter;
      if (saveFilter) {
        saveFilter.json = JSON.stringify(filter);
        trackPromise(filterService.update(saveFilter.rowId, saveFilter), area).catch((error) => {
          dispatch(showErrorDialogAction(AdvancedFilter.displayName, error?.message));
        });
      }
    }
  };

  const _onFormSave = (newForm: any, name: any) => {
    const current = { ...currentFilterSet };
    current.name = name;
    // rowId is allocated by server for the filter... but this is for key on re-render of table of filters
    if (newForm) {
      const maxNo = Math.max(
        ...savedFilters.map(function (o) {
          return o.filter.rowId;
        })
      );
      current.rowId = maxNo !== -Infinity ? maxNo + 1 : 1;
    }
    saveFilter(current, newForm);
    // set as name now added property
    setCurrentFilterSet(current);
    setLoadForm(false);
  };

  const cronEnabled = (ds: DataSource) => {
    const allowedSources = [
      TableEnum[TableEnum.iTechWebSim],
      TableEnum[TableEnum.iTechWebSimAccident],
      TableEnum[TableEnum.iTechWebSimSalesForce],
      TableEnum[TableEnum.iTechWebCollectionTotals],
    ];

    return allowedSources.includes(ds.name);
  };

  const getSearchColumns = (rowId: number | null): ITechControlColumn[] => {
    const items = tables.current?.find((d) => d.rowId === rowId)?.iTechControlColumns || [];

    return [
      ...items,
      // { name: "Search all", rowId: -1, description: "Search all",  iTechControlColumnTypeRowId: -1 } as unknown as ITechControlColumn,
    ];
  };

  const canUpdateSavedFilters =
    currentFilterSet &&
    savedFilters.find((x) => x.filter.rowId === currentFilterSet.rowId)?.securityRowId === userId;

  return (
    <>
      <Portal container={container.current}>
        <FormBuilder propDisplay={loadForm} onChange={_onFormChange}>
          <SaveFilters
            onFormSave={_onFormSave}
            onCloseForm={() => {
              setLoadForm(false);
            }}
            filterName={canUpdateSavedFilters && currentFilterSet?.name}
            canUpdate={canUpdateSavedFilters}
          />
        </FormBuilder>
      </Portal>
      <form onSubmit={onSubmit} onKeyDown={_handlePreventSubmit} className={classes.formContainer}>
        {controlBarDisplay && (
          <div className="filterControlBar">
            <FormControl className={clsx(classes.formControl, classes.loadFilters)}>
              <Select
                labelId="savedFiltersLabel"
                id="savedFiltersSelect"
                onChange={_onFilterSelectChange}
                value={loadedFilterRowId}
              >
                <MenuItem key={-1} value={-1}>
                  {savedFilterOption}
                </MenuItem>
                {savedFilters?.map &&
                  savedFilters?.map((f) => (
                    <MenuItem key={f.filter.rowId} value={f.filter.rowId}>
                      <div className={classes.menuFilterItem}>
                        {/* <span>{`${f.filter.name} [${f.forename ?? ''} ${f.surname ?? ''}]`}</span> */}
                        <span>{f.filter.name}</span>
                        <span>{(f.forename ?? '') + " " + (f.surname ?? '')}</span>
                      </div>
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Button type="submit" startIcon={<ArrowForward />}>
              Apply
            </Button>
            <Button onClick={_handleNewDataSource} startIcon={<Add />}>
              Data Source
            </Button>
            <Button onClick={() => setLoadForm(true)} startIcon={<Save />}>
              Save Filters
            </Button>
          </div>
        )}

        {tables.current.length > 0 &&
          currentFilterSet?.dataSources?.map((dataSource: DataSource, i: number) => (
            // <div
            //   className="dataSourceContainer"
            //   key={currentFilterSet.rowId + "-" + dataSource.rowId}
            // >
            <div key={currentFilterSet.rowId + "-" + dataSource.rowId}>
              {/* The datasource row */}
              <Accordion
                key={i}
                TransitionProps={{ unmountOnExit: true }}
                defaultExpanded={true}
                className={classes.accordion}
                classes={{ expanded: classes.expanded }}
              >
                {/* <Accordion key={i} TransitionProps={{ unmountOnExit: true }} className={classes.accordion} > */}
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  className={classes.accordionSummary}
                  // id="panel1a-header"
                >
                  <div
                    className="dataSource filterContainer"
                    onClick={(event) => event.stopPropagation()}
                    onFocus={(event) => event.stopPropagation()}
                  >
                    <IconButton
                      onClick={() => _handleRemoveDataSource(dataSource)}
                      className={classes.closeButton}
                      size="small"
                    >
                      <Close />
                    </IconButton>
                    <FormControl className={classes.formControl}>
                      <FilterSelect
                        label="Data Source"
                        types={_.filter(
                          tables.current.sort((a, b) => a.description.localeCompare(b.description)),
                          (d) =>
                            currentFilterSet.dataSources.find(
                              (c: any) => c.rowId === d.rowId && c.rowId !== dataSource.rowId
                            ) === undefined
                        )}
                        handleChange={_handleDataSourceChange}
                        id={dataSource.id}
                        value={dataSource.rowId}
                      />
                    </FormControl>
                    {
                      <Button onClick={() => _handleNewFilter(dataSource)} startIcon={<Add />}>
                        Filter
                      </Button>
                    }
                    <FormControl
                      className={classes.formControl}
                      style={{ justifyContent: "center" }}
                    >
                      <RecordCount
                        dataSource={dataSource}
                        dataService={dataService}
                        notFilteredToCase={ignoreCaseForRowCount}
                      />
                    </FormControl>
                  </div>
                </AccordionSummary>
                <AccordionDetails className={classes.accordionDetails}>
                  {/* The filters for the current datasource */}

                  {dataSource.filters?.map((filter: any) => (
                    <div className="filterContainer" key={filter.columnName + dataSource.rowId}>
                      <IconButton
                        onClick={() => _handleRemoveFilter(dataSource, filter)}
                        className={classes.closeButton}
                        size="small"
                      >
                        <Close />
                      </IconButton>
                      <FormControl className={classes.formControl}>
                        <FilterSelect
                          label="Filter"
                          types={getSearchColumns(dataSource.rowId)}
                          handleChange={_handleFilterChange(dataSource)}
                          id={filter.id}
                          value={filter.rowId}
                        />
                      </FormControl>
                      {!!ops(filter) && filter.name !== "search_all" && (
                        <FormControl className={classes.formControl}>
                          <FilterOperation
                            handleChange={_handleOperationChange(dataSource, filter)}
                            value={filter.operation}
                            types={ops(filter)?.operations}
                          />
                        </FormControl>
                      )}
                      {
                        <FilterValue
                          name={filter.columnName}
                          fieldName={filter.name}
                          value={filter.value}
                          setValue={_setValue(dataSource, filter)}
                          datatype={filter.iTechControlColumnTypeRowId}
                          types={
                            tables.current
                              .find((d) => d.rowId === dataSource.rowId)
                              ?.iTechControlColumns.find((c) => c.rowId === filter.rowId)
                              ?.types?.filter((x) => !x.description?.startsWith("spare"))
                              ?.sort((a, b) =>
                                (a.description || a.abb || "").localeCompare(
                                  b.description || b.abb || ""
                                )
                              ) || []
                          }
                          preventSubmit={setPreventSubmit}
                          allowCron={allowCron && cronEnabled(dataSource)}
                          isLogin={filter.isLogin}
                        />
                      }
                    </div>
                  ))}
                </AccordionDetails>
              </Accordion>
            </div>
          ))}
      </form>
    </>
  );
};

AdvancedFilter.displayName = "AdvancedFilter";

export { AdvancedFilter, AdvancedFilterSub };
