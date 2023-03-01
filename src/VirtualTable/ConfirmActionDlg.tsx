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
import { DlgContent } from "./ConfirmActionDlgWithResult";

interface IConfirmDialogResultProps {
  title?: string;
  dialogContent?: DlgContent;
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  area: string;
}

// Similar to ConfirmDialog but can show a second stage for any results from the action ( showingResults === true ) with just a close action
const ConfirmActionDialog: React.FC<IConfirmDialogResultProps> = ({
  title,
  dialogContent,
  show,
  onClose,
  onConfirm,
  area,
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
        <div className="MuiTypography-body1">{dialogContent?.content}</div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained" startIcon={<Cancel />}>
          Close
        </Button>
        <BusyButton onClick={onConfirm} autoFocus area={area} startIcon={<CheckCircle />}>
          Confirm
        </BusyButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmActionDialog;
