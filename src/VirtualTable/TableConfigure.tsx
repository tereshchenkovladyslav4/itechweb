import React, { useState, useEffect, useRef, ReactElement } from "react";
import IconManager from "../_components/IconManager";
import {
  List,
  Box,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Button,
  FormLabel,
} from "@mui/material";
import KeyTypeDrag from "../KeyType/KeyTypeDrag";
import _ from "lodash";
import { WIZARD_STATE } from "../_components/wizardState";
import Autocomplete from "@mui/material/Autocomplete";
import { ITechResultSet } from "../Model/iTechRestApi/ITechResultSet";
import { resultsService } from "../_services/resultsService";
import { tableService } from "../_services/tableService";
import { caseService } from "../_services/caseService";
import { ComponentType } from "../ComponentDisplay/componentType";
import { useStore } from "../_context/Store";
import { CASE_DATA_SOURCES } from "../_context/constants/Constants";
import { useStyles } from "./TableConfigure.styles";
import { useDataSources } from "../_context/thunks/dataSources";

interface TableConfigureProps {
  tableService: typeof tableService;
  resultsService: typeof resultsService;
  caseService: typeof caseService;
  data: any;
  wizardState: string;
  updateData: (items: any) => void;
  updateComponent: (component: any) => void;
}

export default function TableConfigure({
  tableService,
  resultsService,
  // caseService,
  data,
  updateComponent,
  updateData,
  wizardState,
}: TableConfigureProps): ReactElement | null {
  const classes = useStyles();
  const [selectedTable, setSelectedTable] = useState<any>();
  const [customName, setCustomName] = useState<string>("");
  const [wizardStateVal, setWizardStateVal] = useState(wizardState);
  const [savedResults, setSavedResults] = useState<ITechResultSet[]>();
  // const [cases, setCases] = useState<ITechResultSet[]>();
  const mounted = useRef<boolean>();
  const { selectors } = useStore();
  const tableList = useDataSources(tableService.getAll);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;

      if (data?.data) setSelectedTable([data.data]);

      // caseService.getAll().then((x) => {
      //   if (mounted.current) setCases(x);
      // });
    }
    return () => {
      mounted.current = false;
    };
  }, [data, tableList]); // tablelist as if it was unloaded initially will re-render

  useEffect(() => {
    if (!savedResults?.length) {
      resultsService.getAll().then((x) => {
        if (mounted.current) setSavedResults(x);
      });
    }
  }, [mounted.current]);

  const _onResultSelect = (table: any) => {
    setWizardStateVal(WIZARD_STATE.CHOOSE_RESULTSET);

    updateData({
      componentType: "Wizard",
      wizardType: "Grid",
      data: table,
      wizardState: WIZARD_STATE.CHOOSE_RESULTSET,
    });
  };

  const _onSelect = (table: any) => {
    table.id = `${table.rowId}-parent`;
    table.subItems = table.iTechControlColumns;
    table.subItems = table.subItems.filter((i: any) => i.gridIndex !== null);
    table.subItems = _.orderBy(table.subItems, ["gridIndex"]);
    table.subItems.map((i: any, index: number) => {
      i.id = `${i.rowId}-child`;
      i.index = index;
      i.checked = i.gridSelected;
      return i;
    });
    table.type = table.abb;
    setSelectedTable([table]);
    setWizardStateVal(WIZARD_STATE.CONFIGURE_COLUMNS);
    updateData({
      componentType: "Wizard",
      wizardType: "Grid",
      data: table,
      wizardState: WIZARD_STATE.CONFIGURE_COLUMNS,
    });
  };

  const ListButton = (props: any) => {
    return (
      <ListItem button onClick={() => _onResultSelect(props.table)}>
        <ListItemIcon>
          <IconManager icon={props.table.icon} />
        </ListItemIcon>
        <ListItemText primary={props.table.description} />
      </ListItem>
    );
  };

  const _backToSource = () => {
    setSelectedTable(undefined);
    setWizardStateVal(WIZARD_STATE.CONFIGURE_GRID);
    updateData({
      componentType: "Wizard",
      wizardType: "Grid",
      wizardState: WIZARD_STATE.CONFIGURE_GRID,
    });
  };

  const ChooseAllORResultSetWizard = (props: any) => {
    if (!props.table) return null;
    const resultSetsForSource = savedResults?.filter(
      (x) => x.iTechControlTableRowId == props.table?.iTechControlColumns[1]?.iTechControlTableRowId
    );
    if (!resultSetsForSource?.length) {
      _onSelect(props.table);
      return null;
    }
    return (
      <div>
        <Box className={classes.display}>
          <Typography variant="h5" component="h5">
            Choose data
          </Typography>
          <List component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
            <ListItem button onClick={() => _onSelect(props.table)}>
              <ListItemIcon>
                <IconManager icon={props.table.icon} />
              </ListItemIcon>
              <ListItemText primary="All" />
            </ListItem>
          </List>

          <ResultSetAutoComplete
            results={resultSetsForSource}
            label="Saved Results"
            placeHolder="Find saved results set"
            icon="Storage"
            dataSource="ITechWebSavedResults"
          />

          <BackButton onClick={_backToSource} />
        </Box>
      </div>
    );
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    const data = _.cloneDeep(selectedTable[0]);
    data.configureColumns = selectedTable;
    data.componentType = ComponentType.VirtualTable;
    delete data.iTechControlColumns;
    data.subItems = _.filter(data.subItems, (s) => s.checked);
    data.subItems.map((s: any) => delete s.types);
    data.customName = customName;
    data.subItems.map((s: any, index: number) => (s.index = index));
    updateData(data);
  };

  const BackButton = (props: any) => {
    return (
      <Button className={classes.button} {...props}>
        <IconManager icon="ArrowBackIos" /> Back
      </Button>
    );
  };

  const ResultSetAutoComplete = (props: any) => {
    const { results, label, placeHolder, icon, dataSource } = props;

    if (results && results.length) {
      return (
        <ListItem>
          <ListItemIcon>
            <IconManager icon={icon} />
          </ListItemIcon>
          <Autocomplete
            fullWidth
            size="small"
            options={results}
            getOptionLabel={(opt: ITechResultSet) => opt.name}
            renderOption={(props, opt) => (
              <li {...props} >
                <div className={classes.mnuFilterItem}>
                  <span>{opt.name}</span>{" "}
                  <span> {opt.forename + (opt.surname ? " " + opt.surname : "")} </span>
                </div>
              </li>
            )}
            onChange={(e, newVal) =>
              _onSelect({
                icon: icon,
                name: dataSource,
                description: label,
                rowId: newVal?.rowId,
                iTechControlColumns: tableList?.filter(
                  (t) => t.rowId === newVal?.iTechControlTableRowId
                )[0]?.iTechControlColumns,
              })
            }
            renderInput={(params) => (
              <TextField {...params} label={label} placeholder={placeHolder} InputLabelProps={{shrink:true}} />
            )}
          />
        </ListItem>
      );
    } else return null;
  };

  const DataSourceWizard = () => {
    if (tableList.length === 0) return null;

    const caseId = selectors.getSelectedCaseId();
    return (
      <div>
        <Box className={classes.display}>
          <Typography variant="h4" component="h4">
            Choose data source
          </Typography>

          <List component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
            {tableList
              .filter(
                (t) =>
                  t.iTechControlColumns.length > 0 &&
                  ((caseId === undefined && !CASE_DATA_SOURCES.includes(t.name)) ||
                    caseId !== undefined)
              )
              .sort((a, b) => a.description.localeCompare(b.description))
              .map((t) => (
                <ListButton table={t} key={t.rowId} />
              ))}

            {/* <ResultSetAutoComplete
              results={savedResults}
              label="Saved Results"
              placeHolder="Find saved results set"
              icon="Storage"
              dataSource="ITechWebSavedResults"
            /> */}
            {/* <ResultSetAutoComplete 
                results={cases}
                label="Cases"
                placeHolder="Find case"
                icon="WorkOutline"
                dataSource="iTechWebSimCaseFile"
              /> */}
          </List>
          <BackButton
            onClick={() =>
              updateComponent({
                name: null,
                wizardType: null,
                data: null,
                config: true,
                state: WIZARD_STATE.CHOOSE_COMPONENT,
              })
            }
          />
        </Box>
      </div>
    );
  };

  const _clearTable = () => {
    const hasResultSetsForSource = savedResults?.some(
      (x) => x.iTechControlTableRowId == data?.data?.iTechControlColumns[1]?.iTechControlTableRowId
    );
    if (!hasResultSetsForSource) {
      // didn't have a choose all or result set step
      _backToSource();
      return;
    }
    setSelectedTable(undefined);
    setWizardStateVal(WIZARD_STATE.CHOOSE_RESULTSET);
    updateData({
      componentType: "Wizard",
      wizardType: "Grid",
      data: data?.data,
      wizardState: WIZARD_STATE.CHOOSE_RESULTSET,
    });
  };

  const _renderKeyTypeWizard = () => {
    return (
      <form onSubmit={onSubmit}>
        <Box className={classes.display}>
          <BackButton onClick={_clearTable} />
          <Button className={classes.button} type="submit">
            Submit <IconManager icon="ArrowForwardIos" />
          </Button>
          <Box>
            <Typography variant="h4" component="h4">
              Configure Table
            </Typography>
            <FormLabel component="legend" className={classes.customName}>
              Custom Name
            </FormLabel>
            <TextField
              name="customName"
              label="Optional"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
          </Box>
          <Box mb={2} mt={1}>
            <Typography>Drag columns into correct order</Typography>
          </Box>
          <KeyTypeDrag items={selectedTable} setItems={setSelectedTable} />
        </Box>
      </form>
    );
  };

  return wizardStateVal === WIZARD_STATE.CONFIGURE_GRID ? (
    <div data-testid="tableConfigure">
      <DataSourceWizard />
    </div>
  ) : wizardStateVal === WIZARD_STATE.CHOOSE_RESULTSET ? (
    <div data-testid="tableConfigure">{<ChooseAllORResultSetWizard table={data?.data} />}</div>
  ) : wizardStateVal === WIZARD_STATE.CONFIGURE_COLUMNS ? (
    <div data-testid="tableConfigure">{selectedTable && _renderKeyTypeWizard()}</div>
  ) : (
    <div>Error in TableConfigure</div>
  );
}
