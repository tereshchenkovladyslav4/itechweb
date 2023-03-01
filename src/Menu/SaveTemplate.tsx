import React, { useState } from "react";
import { useStore } from "../_context/Store";
import makeStyles from "@mui/styles/makeStyles";
import { trackPromise } from "react-promise-tracker";
import { templateService } from "../_services/templateService";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { setTemplatesAction } from "../_context/actions/TemplateActions";
import { iTechDataWebTemplateEnum } from "../Model/iTechRestApi/iTechDataWebTemplateEnum";
import { NewTemplateRequest } from "../Model/iTechRestApi/NewTemplateRequest";
import { AdvancedFilterModel } from "../Model/iTechRestApi/AdvancedFilterModel";
import BusyButton from "../_components/BusyButton";
import { Cancel, Save } from "@mui/icons-material";
import { Typography } from "@mui/material";

const useStyles = makeStyles(() => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    margin: "20px 30px",
  },
}));

interface ISaveTemplateProps {
  templateType: iTechDataWebTemplateEnum;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SaveTemplate: React.FC<ISaveTemplateProps> = ({
  templateType,
  open,
  setOpen,
}: ISaveTemplateProps) => {
  const classes = useStyles();
  const { selectors, dispatch } = useStore();
  const [loadingArea] = useState("SaveTemplateLoadingArea");
  const [saveTemplateButtonText, setSaveTemplateButtonText] = useState("Save");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleNameChange = (e: any) => {
    setName(e.target.value);
    setError("");
  };

  const handleSave = () => {
    if (!name.length) {
      setError("The Name field is required.");
      return;
    }
    const template: NewTemplateRequest = {
      tabId: (selectors.getSelectedTabId() || "").toString(),
      name: name,
      type: templateType,
      appliedFilters: selectors.getAppliedFilters() as AdvancedFilterModel,
      appliedTreeFilters: selectors.getAppliedTreeFilters() as AdvancedFilterModel,
    };

    trackPromise(
      templateService.add(template).then(
        () => {
          setSaveTemplateButtonText("Saved!");
          setName("");
        },
        (error) => {
          if (typeof error === "string") {
            setError(error);
          } else if (typeof error === "object") {
            setError(error["Name"]);
          }
          setSaveTemplateButtonText("Save");
          // ensure skip the next then chain
          return Promise.reject(error);
        }
      ),
      loadingArea
    )
      .then(() => {
        trackPromise(templateService.getAll(), loadingArea).then((templates) => {
          dispatch(setTemplatesAction(templates));
          setOpen(false);
          setSaveTemplateButtonText("Save");
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClose = () => {
    open = false;
  };

  const type = templateType === iTechDataWebTemplateEnum.template ? "Template" : "View";

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <div className={classes.header}>
          <Typography variant="h4">Save {type}</Typography>
        </div>
        <DialogContent>
          <DialogContentText>Please enter a name for your {type.toLowerCase()}</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            onChange={handleNameChange}
            helperText={error}
            error={error?.length > 0}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setName("");
              setError("");
            }}
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <BusyButton onClick={handleSave} area={loadingArea} startIcon={<Save />}>
            {saveTemplateButtonText}
          </BusyButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SaveTemplate;
