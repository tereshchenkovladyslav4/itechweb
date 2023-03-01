import React, { useState, useEffect, useRef } from "react";

import makeStyles from "@mui/styles/makeStyles";
import { Alert } from "@mui/material";
import { ListButton } from "./ListButton";
import { tableService } from "../_services/tableService";
import { resultsService } from "../_services/resultsService";
import { caseService } from "../_services/caseService";
import { filterService } from "../_services/filterService";
import { WIZARD_STATE } from "../_components/wizardState";
import { useStore } from "../_context/Store";
import { ComponentType } from "./componentType";
import TableConfigure from "../VirtualTable/TableConfigure";
import TreeConfigure from "../Tree/TreeConfigure";
import ConfigureCounter from "./ConfigureCounter";
import ConfigureNotes from "../Notes/ConfigureNotes";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ConfigureHierarchy from "../VirtualTable/Hierarchy/ConfigureHierarchy";
import { useDataSources } from "../_context/thunks/dataSources";
import { TableEnum } from "../Model/iTechRestApi/TableEnum";
import { ciEquals } from "../_helpers/utilities";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 360,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  display: {
    margin: "3vh 0 0 3vh",
    backgroundColor: theme.palette.background.default,
    padding: "1vh",
    borderRadius: 4,
    width: "fit-content",
    minWidth: 225,
    height: "fit-content",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.primary.contrastText,
  },
  container: {
    display: "flex",
    padding: "0 3vh 3vh 0",
    flexWrap: "wrap",
  },
}));

export interface IConfigureProps {
  updateComponent: (component: any) => void;
}

interface IWizardProps {
  config: any;
  updateData: any;
  area: string;
}

interface IUpdateComponentProps {
  name: string;
  config: any;
  data: any;
  state: any;
}

export default function Wizard({
  config,
  updateData,
  area,
}: IWizardProps): JSX.Element {
  const classes = useStyles();
  const [wizardType, setWizardType] = useState<any>();
  const [wizardState, setWizardState] = useState(WIZARD_STATE.CHOOSE_COMPONENT);
  const mounted = useRef<boolean>();
  const dataSourceList = useDataSources(tableService.getAll);

  // determine if the datasource is "enabled" in this environment
  const isEnabled = (ds: string): boolean => {
    // case isnt the same with tableEnum and database values
    const dataSourceEnabled = dataSourceList?.some((s) => ciEquals(s.name, ds));

    return dataSourceEnabled;
  };

  const _updateComponent = ({ name: wizardType, data, config, state }: IUpdateComponentProps) => {
    setWizardType(wizardType);
    setWizardState(state);
    const componentType = !config ? wizardType : "Wizard";
    updateData({
      componentType: componentType,
      wizardType: wizardType,
      wizardState: state,
      data: data,
    });
  };

  useEffect(() => {
    if (!mounted.current) {
      if (config?.wizardState) {
        setWizardType(config?.wizardType);
        setWizardState(config?.wizardState);
      }
      mounted.current = true;
    } else {
      setWizardState(config?.wizardState);
    }
  }, [config]);

  const DefaultWizard = () => {
    const { selectors } = useStore();
    const caseId = selectors.getSelectedCaseId();

    return (
      <div className={classes.container}>
        <Box className={classes.display}>
          <Typography variant="h4" component="h4">
            Choose component
          </Typography>
          <Typography variant="subtitle1" component="h4">
            General Components
          </Typography>
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.root}
          >
            <ListButton
              icon="TableChart"
              name="Grid"
              state={WIZARD_STATE.CONFIGURE_GRID}
              clickHandler={_updateComponent}
              config={true}
            />
            <ListButton
              icon="InsertChart"
              name="Chart"
              state={WIZARD_STATE.CONFIGURE_CHART}
              clickHandler={_updateComponent}
              config={false}
            />
            <ListButton
              icon="Schedule"
              name={ComponentType.Counter}
              state={WIZARD_STATE.CONFIGURE_COUNTER}
              clickHandler={_updateComponent}
              config={true}
            />
            <ListButton
              icon="FilterList"
              name={ComponentType.AdvancedFilter}
              clickHandler={_updateComponent}
              config={false}
            />
            <ListButton
              icon="AccountTree"
              name={ComponentType.TreeFilter}
              state={WIZARD_STATE.CONFIGURE_TREE}
              clickHandler={_updateComponent}
              config={true}
            />
            <ListButton
              icon="Notes"
              name={ComponentType.TabNotes}
              displayName="Tab Notes"
              clickHandler={_updateComponent}
              state={WIZARD_STATE.CONFIGURE_NOTES}
              config={true}
            />
            <ListButton
              icon="Person"
              name={ComponentType.CaseUsers}
              clickHandler={_updateComponent}
              config={false}
            />
            <ListButton
              icon="Group"
              name={ComponentType.Hierarchy}
              displayName="Hierarchy"
              clickHandler={_updateComponent}
              state={WIZARD_STATE.CONFIGURE_HIERARCHY}
              config={true}
            />
            <ListButton
              icon="TableChart"
              name={ComponentType.CollectionTotalGrid}
              clickHandler={_updateComponent}
              config={false}
            />
            {caseId && (
              <ListButton
                icon="Notes"
                name={ComponentType.CaseNotes}
                clickHandler={_updateComponent}
                config={false}
              />
            )}
            {caseId && (
              <ListButton
                icon="ListAlt"
                name={ComponentType.CaseProperties}
                clickHandler={_updateComponent}
                config={false}
              />
            )}
            <ListButton
              icon="Fingerprint"
              name={ComponentType.IDVerification}
              clickHandler={_updateComponent}
              config={false}
            />
            {isEnabled(TableEnum[TableEnum.iTechWebReportingAssure]) && (
              <ListButton
                icon="Summarize"
                name={ComponentType.AssureReport}
                clickHandler={_updateComponent}
                config={false}
              />
            )}
          </List>
        </Box>
        <Box className={classes.display}>
          <Typography variant="subtitle1" component="h4">
            Object Components
          </Typography>
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.root}
          >
            {caseId && (
              <ListButton
                icon="Mouse"
                name={ComponentType.Actions}
                clickHandler={_updateComponent}
                config={false}
              />
            )}
            <ListButton
              icon="ListAlt"
              name={ComponentType.Properties}
              clickHandler={_updateComponent}
              config={false}
            />
            <ListButton
              icon="GraphicEq"
              name={ComponentType.Preview}
              clickHandler={_updateComponent}
              config={false}
            />
            {!caseId && (
              <ListButton
                icon="Notes"
                name={ComponentType.NoteList}
                displayName="Object Notes"
                clickHandler={_updateComponent}
                config={false}
              />
            )}
            <ListButton
              icon="Timeline"
              name={ComponentType.Versions}
              clickHandler={_updateComponent}
              config={false}
            />
            <ListButton
              icon="VerifiedUser"
              name={ComponentType.ObjectAudit}
              clickHandler={_updateComponent}
              config={false}
            />
          </List>
        </Box>
      </div>
    );
  };

  return wizardState === WIZARD_STATE.CHOOSE_COMPONENT ? (
    <DefaultWizard />
  ) : wizardState === WIZARD_STATE.CONFIGURE_GRID ||
    wizardState === WIZARD_STATE.CHOOSE_RESULTSET ||
    wizardState === WIZARD_STATE.CONFIGURE_COLUMNS ? (
    <TableConfigure
      updateComponent={_updateComponent}
      updateData={updateData}
      data={config}
      tableService={tableService}
      caseService={caseService}
      wizardState={wizardState}
      resultsService={resultsService}
    />
  ) : wizardState === WIZARD_STATE.CONFIGURE_TREE ? (
    <TreeConfigure
      updateComponent={_updateComponent}
      updateData={updateData}
      area={area}
    />
  ) : wizardState === WIZARD_STATE.CONFIGURE_COUNTER ? (
    <ConfigureCounter
      updateComponent={_updateComponent}
      filterService={filterService}
      data={config}
    />
  ) : wizardState === WIZARD_STATE.CONFIGURE_NOTES ? (
    <ConfigureNotes updateComponent={_updateComponent} />
  ) : wizardState === WIZARD_STATE.CONFIGURE_HIERARCHY ? (
    <ConfigureHierarchy updateComponent={_updateComponent} />
  ) : (
    <Alert severity="info">Loading...</Alert>
  );
}
