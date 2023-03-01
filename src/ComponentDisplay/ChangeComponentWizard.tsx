import React from "react";
import { ListButton } from "../ComponentDisplay/ListButton";
import { Box, List, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { WIZARD_STATE } from "../_components/wizardState";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  display: {
    margin: "4vh",
  },
}));

interface IWizardProps {
  componentType: string;
  data: any;
  updateData(t: any): void;
  area: string;
}

interface IUpdate {
  name: string | null;
  config: any;
  state: any;
}

const ChangeComponentWizard: React.FC<IWizardProps> = ({ componentType, data, updateData }) => {
  const _updateComponent = ({ name: wizardType, state }: IUpdate) => {
    // const componentType = !config ? wizardType : "Wizard";
    // updateData({
    //     componentType: componentType,
    //     wizardType: wizardType,
    //     wizardState: state,
    //     data: data?.data,
    // });
    const componentType = wizardType;
    if (componentType === "Grid") {
      // if coming from a chart data is  a level deeper
      const savedata = data?.data?.data || data?.data;
      updateData(savedata);
    } else {
      updateData({
        componentType: componentType,
        wizardType: wizardType,
        wizardState: state,
        data: data?.data,
      });
    }
  };

  const ConfigWizard = () => {
    const classes = useStyles();

    return (
      <div>
        <Box className={classes.display}>
          <Typography variant="h4" component="h4">
            Choose component
          </Typography>
          <List component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
            <ListButton icon="TableChart" name="Grid" clickHandler={_updateComponent} />
            <ListButton
              icon="InsertChart"
              name="Chart"
              state={WIZARD_STATE.CONFIGURE_CHART}
              clickHandler={_updateComponent}
            />
          </List>
        </Box>
      </div>
    );
  };

  return componentType === "ChangeComponent" ? <ConfigWizard /> : <div>Error</div>;
};

export default ChangeComponentWizard;
