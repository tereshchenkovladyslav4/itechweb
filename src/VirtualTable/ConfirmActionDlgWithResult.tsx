import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Cancel, CheckCircle } from "@mui/icons-material";
import BusyButton from "../_components/BusyButton";

export type DlgContent = {
    text:string;
    content?:JSX.Element;
}
interface IConfirmDialogResultProps {
  title?: string;
  dialogContent?: DlgContent;
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  area: string;
  showingResults: boolean;
}

// Similar to ConfirmDialog but can show a second stage for any results from the action ( showingResults === true ) with just a close action
const ConfirmDialogWithResult: React.FC<IConfirmDialogResultProps> = ({
  title,
  dialogContent,
  show,
  onClose,
  onConfirm,
  area,
  showingResults,
}) => {
  return (
    <Dialog
      open={show}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      fullWidth={true}
      transitionDuration={800}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogContent?.text}</DialogContentText>
        <div className="MuiTypography-body1">
            {dialogContent?.content}
        </div>
        </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained" startIcon={<Cancel />}>
          {showingResults ? "Close" : "Cancel"}
        </Button>
        {!showingResults && (
          <BusyButton
            onClick={onConfirm}
            color="primary"
            autoFocus
            variant="contained"
            area={area}
            startIcon={<CheckCircle />}
          >
            Confirm
          </BusyButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialogWithResult;
