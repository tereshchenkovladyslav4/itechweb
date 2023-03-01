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

interface IConfirmDialogProps {
  title?: string;
  text: string;
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// const Transition = React.forwardRef(function Transition(
//     props: TransitionProps & { children?: React.ReactElement<any, any> },
//     ref: React.Ref<unknown>,
//   ) {
//     return <Slide ref={ref} {...props} />;
//   });

const ConfirmDialog: React.FC<IConfirmDialogProps> = ({
  title,
  text,
  show,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={show}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      fullWidth={true}
      // TransitionComponent={Transition}
      transitionDuration={800}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<Cancel />}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
          autoFocus
          variant="contained"
          startIcon={<CheckCircle />}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
