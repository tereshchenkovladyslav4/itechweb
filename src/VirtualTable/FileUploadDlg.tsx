import React, { useRef, useState } from "react";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { AlertType, DropzoneAreaBase, FileObject } from "mui-file-dropzone";
import { Button, Portal, Typography } from "@mui/material";
import { fileUploadService } from "../_services/fileUploadService";
import FormBuilder from "../Form/FormBuilder";
import BusyButton from "../_components/BusyButton";
import { Cancel, Publish } from "@mui/icons-material";
import { trackPromise } from "react-promise-tracker";
import { Alert } from '@mui/material';
import config from "../config";

const useStyles = makeStyles(() =>
  createStyles({
    previewChip: {
      minWidth: 120,
      maxWidth: 240,
    },
    clear: {
      float: "none",
      clear: "both",
    },
    formButton: {
      margin: "10px 0 24px 24px",
    },
    formSection: {
      margin: "5px 30px",
    },
    header: {
      margin: "20px 30px",
    },
  })
);

interface IFileUploadProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

const FileUploadDlg: React.FC<IFileUploadProps> = ({ show, setShow }) => {
  const classes = useStyles();
  const container = useRef();
  const [fileObjects, setFileObjects] = useState<FileObject[]>([]);
  const [error, setError] = useState<string>("");
  const area = "FileUploadBtn";

  //   // upload all in one call
  //   const uploadFiles = () => {
  //     return trackPromise(fileUploadService.upload(fileObjects.map((x) => x.file)), area).then(() => {
  //       setShow(false);
  //       setFileObjects([]);
  //     });
  //   };

  // upload a file per call - use browser parallelism
  const uploadFileByFile = () => {
    const apiCalls: Promise<any>[] = [];
    fileObjects.forEach((f) => apiCalls.push(fileUploadService.upload([f.file])));

    return trackPromise(Promise.all(apiCalls), area).then(() => {
      setShow(false);
      setFileObjects([]);
    });
  };

  const showError = (msg: string, variant: AlertType) => {
    if (variant === "error") {
      setError(msg);
    }
  };

  return (
    // our own styled dialog.. and use DropzoneAreaBase in it so have control of the fileobjects
    <Portal container={container.current}>
      <FormBuilder propDisplay={show} onChange={setShow}>
        <form autoComplete="off">
          <div className={classes.header}>
            <Typography variant="h4">Upload File(s) / Folder</Typography>
          </div>
          {error && <Alert severity="error">{error}</Alert>}
          <div className={classes.formSection}>
            <DropzoneAreaBase
              fileObjects={fileObjects}
              // acceptedFiles={['image/*']}
              clearOnUnmount={true}
              dropzoneText="Drag and drop File(s) / Folder here or Click"
              maxFileSize={config.fileUploadMaxFileSize}
              filesLimit={config.fileUploadMaxFiles}
              onAdd={(files) => {
                setFileObjects((prev) => [
                  ...files,
                  ...prev.filter(
                    (item) =>
                      !files.find((x) => x.file.name === item.file.name && x.data === item.data)
                  ),
                ]);
                setError("");
              }}
              onDelete={(file) => {
                const files = fileObjects.filter((x) => x !== file);
                setFileObjects(files);
                setError("");
              }}
              onAlert={showError}
              showPreviews={true}
              showPreviewsInDropzone={false}
              showFileNamesInPreview={true}
              useChipsForPreview
              previewChipProps={{ classes: { root: classes.previewChip } }}
              previewGridProps={{
                container: {
                  spacing: 1,
                  direction: "row",
                  style: { maxHeight: 200, overflowY: "auto" },
                },
              }}
              previewText="Selected Files"
              showAlerts={false}
            />
          </div>
          <div className={classes.clear}>
            <BusyButton
              className={classes.formButton}
              onClick={uploadFileByFile}
              area={area}
              disabled={fileObjects.length === 0}
              startIcon={<Publish />}
            >
              Upload
            </BusyButton>
            <Button
              className={classes.formButton}
              onClick={() => {
                setShow(false);
                setError("");
                setFileObjects([]);
              }}
              startIcon={<Cancel />}
            >
              Cancel
            </Button>
          </div>
        </form>
      </FormBuilder>
    </Portal>
  );
};
export default FileUploadDlg;
