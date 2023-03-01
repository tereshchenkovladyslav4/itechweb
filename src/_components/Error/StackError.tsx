import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import CopyTextButton from "../CopyTextButton";
import { useStore } from "../../_context/Store";
import { closeErrorDialogAction } from "../../_context/actions/HandleErrorActions";
import config from "../../config";
import { errorService } from "../../_services/errorService";
import { trackPromise } from "react-promise-tracker";
import FrontendError from "../../Model/Types/FrontendError";
import LoadingAvatar from "../LoadingAvatar";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { IErrorData } from "../../_context/types/StoreContextState";
import { dateString } from "../../_helpers/dateFormat";
import { IErrorProps } from "./SystemError";
import WarningButton from "../WarningButton";

const useStyles = makeStyles(() => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

const StackError: React.FC<IErrorProps> = ({ componentId, onRemove }) => {
  const classes = useStyles();
  const { state, dispatch } = useStore();
  const [sendMessageButtonText, setSendMessageButtonText] = useState("Send Message");
  const [canSendMessage, setCanSendMessage] = useState<boolean>(true);
  const [showSendMessageButton, setShowSendMessageButton] = useState<boolean>(true);
  const [copyText, setCopyText] = useState("");
  const [template, setTemplate] = useState("");
  const [error, setError] = useState<FrontendError>({
    date: "",
    path: "",
    component: "",
    error: "",
    errorInfo: "",
    stack: "",
  });
  const [loadingArea] = useState("ErrorLoadingArea");
  const [canRemove, setCanRemove] = useState<boolean>(componentId !== undefined);

  const getErrorInfoString = (err: IErrorData): string => {
    return Object.entries(err.errorInfo).toString();
  };

  useEffect(() => {
    const current = new Date();
    const dateTime = dateString(current, true);
    const newError: FrontendError = {
      date: dateTime,
      path: "",
      component: state.errorData.componentName || "",
      error: state.errorData.error.message,
      errorInfo: getErrorInfoString(state.errorData),
      stack: state.errorData.error.stack,
    };

    setError(newError);
    setTemplate(
      `Hi There,\n\nI have had a problem using Soteria Grid and here is the error report\n\nDate: ${newError.date}\nError: ${newError.error}\nComponent Stack: ${newError.errorInfo}\nStack Trace: ${newError.stack}\n\nMany Thanks\n\n`
    );
    createCopyText(newError);
    setSendMessageButtonText("Send Message");
    setCanSendMessage(true);
    setShowSendMessageButton(true);
  }, [state.errorData.showDialog]);

  const createCopyText = (error: FrontendError) => {
    const copyText = `Date: ${error.date}\nError: ${error.error}\nComponent Stack: ${error.errorInfo}\nStack Trace: ${error.stack}`;
    setCopyText(copyText);
  };

  const handleClose = () => {
    dispatch(closeErrorDialogAction());
  };

  const handleSendToUs = () => {
    const to = encodeURIComponent(`${config.supportEmail}`);
    const subject = window.encodeURIComponent("Soteria - Error Occurred");
    const body = window.encodeURIComponent(template);
    window.open(`mailto:${to}?subject=${subject}&body=${body}`);
  };

  const handleSendEmail = () => {
    trackPromise(
      errorService.sendError(error).then(
        () => {
          setSendMessageButtonText("Sent!");
          setCanSendMessage(false);
        },
        () => {
          setShowSendMessageButton(false);
        }
      ),
      loadingArea
    );
  };

  const handleRemove = () => {
    if (componentId && onRemove) {
      onRemove(componentId).then(
        () => {
          setCanRemove(false);
          handleClose();
        },
        () => {
          // TODO - set text to retry?
        }
      );
    }
  };

  return (
    <Dialog open={state.errorData.showDialog}>
      <div className={classes.header}>
        <DialogTitle>System Error</DialogTitle>
        <LoadingAvatar icon={<ErrorOutlineIcon />} area={loadingArea} />
      </div>
      <DialogContent>
        <DialogContentText>A system error has occured.</DialogContentText>
        <DialogContentText>
          Click Send Message to send us a copy of the error report. you can also click copy to copy
          the error details to the clipboard, or click close to dismiss this error message.
        </DialogContentText>
        <DialogContentText>
          If sending fails, an Email Us button will show and launch your mail client so you can
          email us instead.
        </DialogContentText>
        <DialogContentText>Date: {error.date}</DialogContentText>
        {error.component && <DialogContentText>Component: {error.component}</DialogContentText>}
        <DialogContentText>Error: {error.error}</DialogContentText>
        <details>
          <summary>Click for error details</summary>
          <span>{error && error.errorInfo}</span>
        </details>
      </DialogContent>
      <DialogActions>
        {componentId && onRemove && (
          <WarningButton autoFocus variant="contained" onClick={handleRemove} disabled={!canRemove}>
            {canRemove ? "Remove Component" : "Removed!"}
          </WarningButton>
        )}
        {
          //Check if message failed
          showSendMessageButton ? (
            <Button
              color="primary"
              autoFocus
              variant="contained"
              onClick={handleSendEmail}
              disabled={!canSendMessage}
            >
              {sendMessageButtonText}
            </Button>
          ) : (
            <Button color="primary" autoFocus variant="contained" onClick={handleSendToUs}>
              Email us
            </Button>
          )
        }
        <CopyTextButton value={copyText} />
        <Button color="primary" variant="contained" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StackError;
