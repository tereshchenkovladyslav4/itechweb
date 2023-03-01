import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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
import { ErrorOutline } from "@mui/icons-material";
import { red } from "@mui/material/colors";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
  error: {
    ...theme.typography.body2,
  },
}));

const FetchError: React.FC<IErrorProps> = () => {
  const classes = useStyles();
  const { state, dispatch } = useStore();
  const history = useHistory();
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

  const getErrorInfoString = (err: IErrorData): string => {
    return Object.entries(err.errorInfo).toString();
  };

  useEffect(() => {
    const current = new Date();
    const dateTime = dateString(current, true);
    const newError: FrontendError = {
      date: dateTime,
      path: history.location.pathname,
      component: state.errorData.componentName,
      error: state.errorData.error,
      errorInfo: getErrorInfoString(state.errorData),
      stack: "",
    };

    setError(newError);
    setTemplate(
      `Hi There,\n\nI have had a problem using Soteria Grid and here is the error report\n\nDate: ${newError.date}\nPath: ${newError.path}\nComponent: ${newError.component}\nError: ${newError.error}\n\nMany Thanks\n\n`
    );
    createCopyText(newError);
    setSendMessageButtonText("Send Message");
    setCanSendMessage(true);
    setShowSendMessageButton(true);
  }, [state.errorData.showDialog]);

  const createCopyText = (error: FrontendError) => {
    const copyText = `Date: ${error.date}\nPath: ${error.path}\nComponent: ${error.component}\nError: ${error.error}`;
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
          //Message sent
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

  return (
    <Dialog open={state.errorData.showDialog}>
      <div className={classes.header}>
        <CardHeader
          title="System Error"
          titleTypographyProps={{ variant: "h5", color: "error" }}
          avatar={<ErrorOutline fontSize="large" style={{ color: red[500] }} />}
        />
        <LoadingAvatar icon={<ErrorOutlineIcon />} area={loadingArea} />
      </div>
      <DialogContent className={classes.error}>
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
        <DialogContentText>Path: {error.path}</DialogContentText>
        <DialogContentText>Component: {error.component}</DialogContentText>
        <DialogContentText>Error: {error.error}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {
          //Check if message failed
          showSendMessageButton ? (
            <Button autoFocus onClick={handleSendEmail} disabled={!canSendMessage}>
              {sendMessageButtonText}
            </Button>
          ) : (
            <Button autoFocus onClick={handleSendToUs}>
              Email us
            </Button>
          )
        }
        <CopyTextButton value={copyText} />
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FetchError;
