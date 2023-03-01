import React from "react";
import { Box, Button, List, Typography } from "@mui/material";
import IconManager from "../_components/IconManager";
import { WIZARD_STATE } from "../_components/wizardState";
import { NoteType } from "./Note";
import { useStyles } from "./ConfigureNotes.style";
import { IConfigureProps } from "../ComponentDisplay/Wizard";

const BackButton = (props: any) => {
  return (
    <Button {...props}>
      <IconManager icon="ArrowBackIos" /> Back
    </Button>
  );
};

// render a textfield and list of saved results
const ConfigureNotes: React.FC<IConfigureProps> = ({ updateComponent }) => {
  const classes = useStyles();

  const _onNoteTypeChange = (type: NoteType) => {
    updateComponent({
      name: "TabNotes",
      wizardType: undefined,
      data: { noteType: type },
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
            <Button variant="outlined" className={classes.formOutlinedButton} onClick={() => _onNoteTypeChange(NoteType.Simple)}>
              Simple
            </Button>
            <Typography variant="caption" display="block">
              Basic header / text boxes. Useful for FAQs
            </Typography>
          </div>
          <div className={classes.formSection}>
            <Button variant="outlined" className={classes.formOutlinedButton} onClick={() => _onNoteTypeChange(NoteType.Single)}>
              Single
            </Button>
            <Typography variant="caption" display="block">
              Conversational
            </Typography>
          </div>

          <div className={classes.formSection}>
            <Button variant="outlined" className={classes.formOutlinedButton} onClick={() => _onNoteTypeChange(NoteType.Normal)}>
              Normal
            </Button>
            <Typography variant="caption" display="block">
              Normal note taking. Create multiple notes
            </Typography>
          </div>
          <div className={classes.formSection}>
            <Button variant="outlined" className={classes.formOutlinedButton} onClick={() => _onNoteTypeChange(NoteType.Advanced)}>
              Advanced
            </Button>
            <Typography variant="caption" display="block">
              Full text editing. Useful for wikis
            </Typography>
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

ConfigureNotes.displayName = "ConfigureNotes";

export default ConfigureNotes;
