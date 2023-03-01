import React, { useState, useEffect, useRef } from "react";
import makeStyles from '@mui/styles/makeStyles';
import { Link, Box, Button, Input, FormLabel, Typography } from "@mui/material";
// import {PDFViewer, OpenParams} from './PDFViewer';
import PdfTronViewer from "./PdfTronViewer";
import { trackPromise } from "react-promise-tracker";
import _uniqueId from "lodash/uniqueId";
import { fsiService, RedactionType } from "../_services/fsiService";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import { termService } from "../_services/termService";
import IconManager from "../_components/IconManager";
import { Attachment } from "../Model/iTechRestApi/Attachment";
import MediaPlayer from "./MediaPlayer";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
    backgroundColor: theme.palette.background.component,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  back: {
    top: 10,
    left: 10,
    padding: "4px 10px",
    float: "left",
    marginBottom: 15,
  },
}));

const useStylesText = makeStyles({
  headerRow: {
    //borderBottom: "1px solid darkgrey",
    margin: "5px 0",
    minHeight: "2em",
  },
  label: {
    minWidth: "92px",
    display: "inline-block",
  },
  input: {
    border: "none",
    width: "95%",
    padding: 5,
  },
  box: {
    margin: "0px 10px 10px 10px",
  },
});

const Attachments = (props: any) => {
  const { attachments, download, classes } = props;

  if (!attachments || attachments.length === 0) return null;

  return (
    <div className={classes.headerRow}>
      <label className={classes.label}>Attachments:</label>

      <div style={{ width: "80%", display: "inline-flex" }}>
        <Box mr="0.5rem" display="flex" flexDirection="row" flexWrap="wrap">
          {attachments &&
            attachments.map((attachment: Attachment) => (
              <Box key={attachment.filename} p={1} style={{ padding: "4px" }}>
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e: any) => {
                    e.preventDefault();
                    if(e.currentTarget.text !== "Loading..."){
                      download(attachment.filename);
                    }
                  }}
                >
                  {attachment.filename}
                </Link>
              </Box>
            ))}
        </Box>
      </div>
    </div>
  );
};

const EmailProperties = (props: any) => {
  const { fromAddress, toAddress, summary } = props.data;
  const { attachments, download } = props;
  const [summaryId] = useState(_uniqueId("prefix-"));
  const [toId] = useState(_uniqueId("prefix-"));
  const [fromId] = useState(_uniqueId("prefix-"));

  const classes = useStylesText();
  return (
    <Box className={classes.box}>
      <div className={classes.headerRow}>
        <FormLabel htmlFor={summaryId} className={classes.label}>
          Subject
        </FormLabel>
        <Input
          value={summary}
          className={classes.input}
          readOnly
          type="text"
          id={summaryId}
          data-testid="summaryInput"
          disableUnderline={true}
        />
      </div>
      <div className={classes.headerRow}>
        <FormLabel htmlFor={fromId} className={classes.label}>
          From
        </FormLabel>
        <Input
          value={fromAddress}
          className={classes.input}
          readOnly
          type="text"
          id={fromId}
          data-testid="fromInput"
          disableUnderline={true}
        />
      </div>
      <div className={classes.headerRow}>
        <FormLabel htmlFor={toId} className={classes.label}>
          To
        </FormLabel>
        <Input
          value={toAddress}
          className={classes.input}
          readOnly
          type="text"
          id={toId}
          data-testid="toInput"
          disableUnderline={true}
        />
      </div>
      <Attachments attachments={attachments} download={download} classes={classes} />
    </Box>
  );
};

interface IEMailProps {
  fsiGuid: string;
  value: any;
  service: typeof fsiService;
  area: string;
  redactionType: RedactionType;
  allowRedactions?: boolean;
  showRedactionToggle?: boolean;
  simRowId?: number;
  downloadLink?:string;
}

const EmailPreview: React.FC<IEMailProps> = ({
  value,
  service,
  fsiGuid,
  area,
  redactionType,
  simRowId,
  downloadLink,
  allowRedactions = false,
  showRedactionToggle = false,
}: IEMailProps) => {
  const classes = useStyles();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [fileType, setFileType] = useState("eml");
  const isMounted = useIsMounted();
  const [viewingAttachment, setViewingAttachment] = useState("");
  const fsiGuidRef = useRef(fsiGuid);
  // const [toggleUpdate, setToggleUpdate] = useState(false);

  // this doesnt actually want to be a download... just a url to pass into pdftronviewer as new document
  // so may want to have it set some state that is picked up in getEmailUrl
  // what to show for the email header fields / or do we trigger a whole preview component re-render.
  // will at least need to refresh the attachments ( from in this attachment )
  // also it will have to show a back button to return to original email / previous attachment
  const downloadFile2 = (filename: string) => {
    const parts = filename.split(".");
    const ext = parts[parts.length - 1];
    // need something in state to change that triggers effect in pdftronviewer
    setFileType(ext);
    setViewingAttachment(filename);
    // for when an eml attachmnet & setFileType not changing
    // setToggleUpdate((prev) => !prev);

    // trackPromise(service.getAttachment2(simRowId, filename, redactionType), area).then((result) => {
    //   const navigator: any = window.navigator;
    //   if (navigator && navigator.msSaveOrOpenBlob) {
    //     navigator.msSaveOrOpenBlob(result);
    //     return;
    //   }

    //   const href = window.URL.createObjectURL(result);
    //   const link = document.createElement("a");
    //   link.href = href;
    //   link.setAttribute("target", "_blank");
    //   link.setAttribute("rel", "noopener noreferrer");

    //   // if we set the filename it forces it to save
    //   // link.setAttribute('download', filename);

    //   document.body.appendChild(link);
    //   link.click();
    //   setTimeout(function () {
    //     // For Firefox it is necessary to delay revoking the ObjectURL
    //     window.URL.revokeObjectURL(href);
    //   }, 100);
    // });
  };

  useEffect(() => {
    fsiGuidRef.current = fsiGuid;
    if (!fsiGuid) return;

    setAttachments([{ filename: "Loading..." } as unknown as Attachment]);

    // pdfLoaded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fsiGuid]);

  const getEmailUrl = (
    fileExtension: string,
    fsiGuid: string,
    simRowId: number,
    redactiontype: RedactionType
  ) => {
    const url = !viewingAttachment
      ? service.email(fsiGuid, simRowId, redactiontype)
      : service.getAttachmentLink2(fsiGuid, simRowId, viewingAttachment, redactiontype);

    return url;
  };

  const pdfLoaded = () => {
    // we use the ref here as its called from another components eventlistener 
    // so using fsiGuid directly would give us the value when orignally mounted
    trackPromise(service.emailAttachments(fsiGuidRef.current), area).then((result: any) => {
      if (isMounted()) {
        setAttachments(result);
      }
    });
  };

  const attachmentType = () => attachments.find((x) => x.filename == viewingAttachment)?.type;

  const isEmlOrPdfAttachment = () => {
    if (viewingAttachment) {
      const type = attachmentType();
      return type === "pdf";
    }
    return true;
  };

  // const isEmlAttachment = () => {
  //   if (viewingAttachment) {
  //     const type = attachmentType();
  //     return type === "pdf" && type.endsWith("eml");
  //   }
  //   return true;
  // };

  // const openParams:OpenParams = { toolbar: '0', statusbar: '0', messages: '0', navpanes: '0', scrollbar: '0' } as OpenParams;
  return (
    <div className={classes.root}>
      {/* {!viewingAttachment && (
        <EmailProperties
          data={value}
          attachments={attachments}
          download={downloadFile2}
          service={service}
          area={area}
        />
      )} */}
      {!!viewingAttachment && (
        <div style={{height:0}}>
          <Button
            color="secondary"
            className={classes.back}
            onClick={() => {
              setViewingAttachment("");
              setFileType("eml");
            }}
          >
            <IconManager icon="ArrowBackIos" /> Back
          </Button>
        </div>
      )}
      {isEmlOrPdfAttachment() && (
        <PdfTronViewer
          simRowId={simRowId}
          urlBuilder={getEmailUrl}
          fileType={fileType}
          fsiGuid={fsiGuid}
          redactionType={redactionType}
          termsService={termService}
          allowRedactions={allowRedactions}
          showRedactionToggle={showRedactionToggle}
          loadComplete={pdfLoaded}
          downloadLink={downloadLink}
          header={!viewingAttachment ? (<EmailProperties
            data={value}
            attachments={attachments}
            download={downloadFile2}
            service={service}
            area={area}
          />) : <div><Typography variant="body1" style={{margin:4}}>File Name: {viewingAttachment}</Typography></div>}
        />
      )}
      {attachmentType() === "audio" && (
        <div>
          <MediaPlayer
            path={fsiService.audio(
              attachments.find((x) => x.filename == viewingAttachment)?.fsiGuid || ''
            )}
            rowId={simRowId}
          />
        </div>
      )}
    </div>
  );
};

export default EmailPreview;
