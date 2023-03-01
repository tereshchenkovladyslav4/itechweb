import React from "react";
import { Box, Button, List, Typography } from "@mui/material";
import { HierarchyType } from "./Hierarchy";
import IconManager from "../../_components/IconManager";
import { useStyles } from "./ConfigureHierarchy.style";
import { WIZARD_STATE } from "../../_components/wizardState";
import { IConfigureProps } from "../../ComponentDisplay/Wizard";

const BackButton = (props: any) => {
  return (
    <Button {...props}>
      <IconManager icon="ArrowBackIos" /> Back
    </Button>
  );
};

const ConfigureHierarchy: React.FC<IConfigureProps> = ({ updateComponent }) => {
  const classes = useStyles();

  const _onNoteTypeChange = (type: HierarchyType) => {
    updateComponent({
      name: "Hierarchy",
      wizardType: undefined,
      data: { hierarchyType: type },
      config: false,
      state: null,
    });
  };

  return (
    <div>
      <Box className={classes.display}>
        <Typography variant="h4">Configuration</Typography>
        <List component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
          <div className={classes.formSection}>
            <Typography variant="caption" display="block">
              See people above or below investigated role in the hierarchy?
            </Typography>
            <Button variant="outlined" onClick={() => _onNoteTypeChange(HierarchyType.Senior)}>
              Senior
            </Button>
          </div>
          <div className={classes.formSection}>
            <Button
              variant="outlined"
              onClick={() => _onNoteTypeChange(HierarchyType.Subordinate)}
            >
              Subordinate
            </Button>
          </div>
        </List>

        <BackButton
          className={classes.formBackBtn}
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

ConfigureHierarchy.displayName = "ConfigureHierarchy";

export default ConfigureHierarchy;
