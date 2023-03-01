import React, { useState, useEffect } from "react";
import { useStore } from "../_context/Store";
import { trackPromise } from "react-promise-tracker";
import { dataService } from "../_services/dataService";
import { fsiService, RedactionType } from "../_services/fsiService";
import { TextResponse } from "../Model/iTechRestApi/TextResponse";
import { SimVersion } from "../Model/iTechRestApi/SimVersion";
import { iTechControlTableReferenceEnum } from "../Model/iTechRestApi/iTechControlTableReferenceEnum";
import { getInvestigationId, tableReferenceURL } from "../_helpers/helpers";
import { termService } from "../_services/termService";
import { iTechDataCaseSubEnum } from "../Model/iTechRestApi/iTechDataCaseSubEnum";
import { getCase } from "../_context/thunks/case";
import { caseService } from "../_services/caseService";
import { TableEnum } from "../Model/iTechRestApi/TableEnum";
import { authenticationService } from "../_services/authenticationService";
import { UserType } from "../Model/iTechRestApi/AuthenticateResponse";
import { MsGraphGetChatMsgResponse } from "../Model/iTechRestApi/MsGraphGetChatMsgResponse";
import TeamsIm from "./TeamsIm";
import VideoPlayer from "./VideoPlayer";
import PdfTronViewer from "./PdfTronViewer";
import EmailPreview from "./EmailPreview";
import MediaPlayer from "./MediaPlayer";
import TextDisplay from "./TextDisplay";
import Waiting from "../_components/Waiting";
import Button from "@mui/material/Button";
import { CloudDownload } from "@mui/icons-material";
import { useStyles } from "./Preview.styles";
import BloomBergIm from "./BloomBergIm";
import { isFilterGroupColor } from "../_helpers/utilities";

const types = [
  // TODO: move into API
  { type: "wma", display: "audio" },
  { type: "wav", display: "audio" },
  { type: "mp4", display: "audio" }, // todo: video ?
  { type: "iTechPbx", display: "audio" },
  { type: "iTechMVce", display: "audio" },
  { type: "iTechTurret", display: "audio" },
  { type: "TeleMessVoice", display: "audio" },
  { type: "TelewareRecallByod", display: "audio" },
  { type: "MoviusVoice", display: "audio" },
  { type: "webEx", display: "audio" },
  { type: "Cloud9Pbx", display: "audio" }, // TODO: zip & HTML parse
  { type: "iTechIm", display: "text", encoding: "Unicode" },
  { type: "goodChat", display: "text", encoding: "Unicode" },
  { type: "iTechSms", display: "text", encoding: "Unicode" },
  { type: "MoviusIm", display: "text", encoding: "UTF8" },
  { type: "iTechSlackIm", display: "text", encoding: "UTF8" },
  { type: "iTechSlackTeamMessage", display: "text", encoding: "UTF8" },
  { type: "TeleMessIm", display: "text", encoding: "UTF8", unzip: "True" },
  { type: "WhatsAppIm", display: "text", encoding: "UTF8", unzip: "True" },
  { type: "IceChat", display: "text", encoding: "UTF8" },
  { type: "MsTeamsIM", display: "teamsIm", encoding: "Unicode", unzip: "True" }, // TODO: mix of types!
  { type: "eml", display: "pdf" }, // TODO: EML -> PDF conversion
  { type: "MsTeamsVoice", display: "audio", unzip: "True" }, // TODO: Teams zip
  // { type: "MsTeamsVideo", display: "summary" }, // TODO: Teams zip
  { type: "MsTeamsVideo", display: "video" }, // TODO: Teams zip
  { type: "iTechSkypeIm", display: "summary" }, // TODO: HTML parse
  { type: "iTechSymphonyIm", display: "summary" }, // TODO: zip & HTML parse
  // TODO check all office extensions present
  { type: "docx", display: "pdf" },
  { type: "doc", display: "pdf" },
  { type: "xls", display: "pdf" },
  { type: "xlsx", display: "pdf" },
  { type: "ppt", display: "pdf" },
  { type: "pptx", display: "pdf" },
  { type: "pdf", display: "pdf" },
  { type: "csv", display: "pdf" },
  { type: "jpg", display: "pdf" },
  { type: "mht", display: "pdf" },
  // { type: "one", display: "pdf" }, fails
  // { type: "onetoc2", display: "pdf" }, fails
  { type: "png", display: "pdf" },
  // { type: "ps1", display: "pdf" }, fails
  { type: "txt", display: "pdf" },
  // { type: "aspx", display: "pdf" }, fails
  // { type: "cfg", display: "pdf" }, fails
  // { type: "dat", display: "pdf" }, fails
  // { type: "rdp", display: "pdf" }, fails

  { type: "BloomBergIm", display: "bloombergIm" }, // xml format
  { type: "OnSimSms", display: "text", encoding: "Unicode" },
  { type: "OnSimVoice", display: "audio" },
];

interface IPreviewProps {
  dataService: typeof dataService;
  fsiService: typeof fsiService;
  data: any;
  area: string;
  disableRedaction?: boolean;
  isFullScreenInstance?: boolean;
}

const Preview: React.FC<IPreviewProps> = ({
  dataService,
  fsiService,
  data,
  area,
  disableRedaction,
  isFullScreenInstance,
}) => {
  const classes = useStyles();
  const [text, setText] = useState<TextResponse>();
  const [teamsIm, setTeamsIm] = useState<MsGraphGetChatMsgResponse[]>([]);
  const { selectors, dispatch } = useStore();
  const componentData = data?.data;
  const [selectedGridRow, setSelectedGridRow] = useState(
    !componentData
      ? isFullScreenInstance || isFilterGroupColor(selectors.getSelectedGridRow(), data)
        ? selectors.getSelectedGridRow()
        : undefined
      : undefined
  );
  const [selectedVersion, setSelectedVersion] = useState<SimVersion | undefined>(undefined);

  const fileTypeAbb = selectedGridRow?.fileTypeAbb || selectedVersion?.fileTypeAbb;
  const fileTypeDescription =
    selectedGridRow?.fileTypeDescription || selectedVersion?.fileTypeDescription;
  const isReport = selectedGridRow?.datasource == TableEnum[TableEnum.iTechWebReport];
  const getTypeInfo = () => {
    if (isReport) return types.find((t) => t.type == "pdf"); // we're assuming all reports are PDFs for now

    if (!selectedGridRow?.fileTypeAbb && !selectedVersion?.fileTypeAbb) return undefined;

    if (!fileTypeAbb) return undefined;

    return types.find((t) =>
      t.type.toLowerCase().trim().includes(fileTypeAbb.toLowerCase().trim())
    );
  };
  const typeInfo = getTypeInfo();
  const fsiGuid = selectedGridRow?.fsiGuid?.GuidString || selectedVersion?.fsiGuid?.toString();

  useEffect(() => {
    if (componentData && componentData.FileId && !selectedGridRow) {
      if (componentData.datasource !== TableEnum[TableEnum.iTechWebTask]) {
        let ds = componentData.datasource || TableEnum[TableEnum.iTechWebSim];

        if (componentData.datasource === TableEnum[TableEnum.iTechWebSimUpload]) {
          // preview for the actual sim for file upload source
          ds = TableEnum[TableEnum.iTechWebSim];
        }
        setSelectedVersion(undefined);
        dataService.gid(ds, componentData.FileId).then((rsp) => {
          setSelectedGridRow(rsp);
        });
      } else {
        // need the underlying file source for the task
        dataService
          .gid(componentData.datasource || TableEnum[TableEnum.iTechWebSim], componentData.FileId)
          .then((rsp) => {
            const datasource = tableReferenceURL(rsp.iTechControlTableReferenceTypeChildRowId);
            dataService
              .reference(
                datasource,
                componentData.FileId.toString(),
                iTechControlTableReferenceEnum.iTechDataTask
              )
              .then((rsp) => {
                if (rsp[0]) {
                  rsp[0].datasource = datasource;
                  setSelectedGridRow(rsp[0]);
                }
              });
          });
      }
    } else if (
      selectedGridRow &&
      selectedGridRow.datasource === TableEnum[TableEnum.iTechWebTask]
    ) {
      //user has selected a task, so get the sim
      const datasource = tableReferenceURL(
        selectedGridRow.iTechControlTableReferenceTypeChildRowId
      );
      dataService
        .reference(
          datasource,
          selectedGridRow.gid.toString(),
          iTechControlTableReferenceEnum.iTechDataTask
        )
        .then((rsp) => {
          if (rsp[0]) {
            rsp[0].datasource = datasource;
            setSelectedGridRow(rsp[0]);
          }
        });
    } else if (
      selectedGridRow &&
      selectedGridRow.datasource === TableEnum[TableEnum.iTechWebSimUpload]
    ) {
      // load the sim entry
      const simRowId = (selectedGridRow as any)["iTechSimRowId"];
      if (simRowId) {
        dataService.gid(TableEnum[TableEnum.iTechWebSim], simRowId).then((res) => {
          res.datasource = TableEnum[TableEnum.iTechWebSim];
          setSelectedGridRow(res);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGridRow?.gid]);

  useEffect(() => {
    // get or clear selected case
    getCase(selectors, caseService.get, dispatch);
  }, [selectors.getSelectedCaseId()]);

  useEffect(() => {
    const selectedRow = selectors.getSelectedGridRow();
    if (selectedRow && (isFullScreenInstance || isFilterGroupColor(selectedRow, data))) {
      setSelectedVersion(undefined);
      setSelectedGridRow(selectedRow);
    } else if (!selectedRow) {
      // no row selected so use the investigation subject if present
      const investigationId = getInvestigationId();
      if (investigationId?.rowId !== undefined) {
        dataService
          .gid(investigationId.datasource, investigationId.rowId.toString())
          .then((rsp) => {
            if (!rsp.datasource) rsp.datasource = investigationId.datasource;
            setSelectedVersion(undefined);
            setSelectedGridRow(rsp);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectors.getSelectedGridRow()]);

  useEffect(() => {
    if (selectors.getSelectedVersion()) {
      setSelectedGridRow(undefined);
      setSelectedVersion(selectors.getSelectedVersion());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectors.getSelectedVersion()]);

  useEffect(() => {
    if (typeInfo?.display !== "text") return;

    setText({ text: "Loading..." } as TextResponse);

    if (fsiGuid === undefined) return;

    trackPromise(fsiService.text(fsiGuid, typeInfo?.encoding, typeInfo?.unzip), area).then(
      (result) => {
        setText(result);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGridRow, selectedVersion, area]);

  useEffect(() => {
    if (typeInfo?.display !== "teamsIm") return;

    setTeamsIm([{ body: { content: "Loading..." } } as MsGraphGetChatMsgResponse]);

    if (fsiGuid === undefined || !selectedGridRow?.gid) return;

    trackPromise(fsiService.teamsim(selectedGridRow.gid, fsiGuid), area).then((result) => {
      setTeamsIm(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGridRow, selectedVersion, area]);

  if (!selectedGridRow && !selectedVersion)
    return (
      <div data-testid={"preview-undefined"} className={classes.waiting}>
        <Waiting />
      </div>
    );

  const isStrikeoutEnabled = () => {
    return (
      !disableRedaction &&
      selectors.getSelectedCase()?.iTechDataCaseSubTypeRowId === iTechDataCaseSubEnum.art15_Access
    );
  };

  const isExternalUser = authenticationService.currentUserValue?.userType !== UserType.internal;

  const showRedactionToggle =
    selectors.getSelectedCase()?.iTechDataCaseSubTypeRowId === iTechDataCaseSubEnum.art15_Access &&
    authenticationService.currentUserValue?.userType === UserType.internal;

  // TODO - logic based on user role to determine view type for PDF.
  // If it's an external user ( i.e review page ) then set as redacted
  const redactionType = isStrikeoutEnabled()
    ? RedactionType.strikeout
    : isExternalUser
    ? RedactionType.redact
    : RedactionType.none;

  const allowRedactions = isStrikeoutEnabled() && !selectors.getCaseClosed();

  // version takes precedence as cant have a version selected without a row
  const selected = selectedVersion || selectedGridRow;

  // for these sources - render the properties in a PDF
  const nonPreviewDataSources = [
    TableEnum[TableEnum.iTechWebAudit],
    TableEnum[TableEnum.iTechWebUser],
    TableEnum[TableEnum.iTechWebSecurityObject],
    TableEnum[TableEnum.iTechWebSimAccident],
    TableEnum[TableEnum.iTechWebSimSalesForce],
    TableEnum[TableEnum.iTechStockHeader],
    TableEnum[TableEnum.iTechStockAimAudt],
    TableEnum[TableEnum.iTechStockOrderManagement],
    TableEnum[TableEnum.iTechWebReport],
    TableEnum[TableEnum.iTechWebEodhdNews],
    TableEnum[TableEnum.iTechWebStockOrder],
  ];

  const itemName = encodeURI(selectedGridRow?.name || selectedVersion?.name || "File")
    .replace(/\+:/g, "")
    .replace(/:\s*/g, "");

  // for now - only passing the rowid to the api for Teams IM - it switches on this in api assuming its teams currently
  const teamsImRowId = typeInfo && typeInfo.type === "MsTeamsIM" ? selected?.rowId : undefined;

  const downloadHref =
    fsiGuid &&
    (isReport && selectedGridRow?.gid
      ? fsiService.downloadReport(selectedGridRow?.gid)
      : !isExternalUser
      ? fsiService.download(fsiGuid, itemName, teamsImRowId)
      : fsiService.downloadPdf(itemName, fsiGuid, selected?.rowId || 0));

  return (
    <div data-testid={"preview-" + selected?.rowId} className={classes.container}>
      {typeInfo && typeInfo?.display !== "pdf" && (
        <>
          {fsiGuid && (
            <Button
              className={classes.downloadBtn}
              startIcon={<CloudDownload />}
              href={
                isReport && selectedGridRow?.gid
                  ? fsiService.downloadReport(selectedGridRow?.gid)
                  : !isExternalUser
                  ? fsiService.download(fsiGuid, itemName, teamsImRowId)
                  : fsiService.downloadPdf(itemName, fsiGuid, selected?.rowId || 0)
              }
            >
              Download
            </Button>
          )}
        </>
      )}
      {typeInfo?.display === "audio" && fsiGuid ? (
        <MediaPlayer path={fsiService.audio(fsiGuid, typeInfo?.unzip)} rowId={selected?.rowId} />
      ) : typeInfo?.display === "video" && fsiGuid ? (
        <VideoPlayer fsiGuid={fsiGuid} rowId={selected?.rowId} area={area} service={fsiService} />
      ) : typeInfo?.display === "teamsIm" && selectedGridRow?.gid ? (
        <TeamsIm messages={teamsIm} simRowId={selectedGridRow.gid} />
      ) : typeInfo?.display === "bloombergIm" && selectedGridRow?.gid && fsiGuid ? (
        <BloomBergIm
          service={fsiService}
          simRowId={selectedGridRow.gid}
          fsiGuid={fsiGuid}
          area={area}
        />
      ) : typeInfo?.display === "text" ? (
        <TextDisplay text={text?.text} title={fileTypeDescription} />
      ) : typeInfo?.display === "summary" ? (
        <TextDisplay text={selected?.summary} title={fileTypeDescription} />
      ) : typeInfo?.display === "pdf" && typeInfo?.type === "eml" && fsiGuid ? (
        <EmailPreview
          value={selected}
          area={area}
          service={fsiService}
          fsiGuid={fsiGuid}
          allowRedactions={allowRedactions}
          showRedactionToggle={showRedactionToggle}
          redactionType={redactionType}
          simRowId={selected?.rowId}
          downloadLink={downloadHref}
        />
      ) : fsiGuid && fileTypeAbb && typeInfo?.display === "pdf" && typeInfo?.type !== "eml" ? ( // TBD - type records for ms office docs or just try to convert all to pdf
        <PdfTronViewer
          simRowId={selected?.rowId}
          urlBuilder={fsiService.pdf}
          fileType={fileTypeAbb}
          fsiGuid={fsiGuid}
          redactionType={redactionType}
          termsService={termService}
          allowRedactions={allowRedactions}
          showRedactionToggle={showRedactionToggle}
          downloadLink={downloadHref}
        /> //TODO - logic for enableStrikeOut on user role
      ) : selectedGridRow && nonPreviewDataSources.includes(selectedGridRow.datasource) ? (
        <PdfTronViewer
          urlBuilder={(
            fileExtension: string,
            fsiGuid: string,
            simRowId: number,
            rt: RedactionType
          ) =>
            fsiService.properties(
              TableEnum[selectedGridRow.datasource as keyof typeof TableEnum],
              fsiGuid,
              rt
            )
          }
          fileType={selectedGridRow.datasource}
          fsiGuid={selectedGridRow.gid.toString()}
          redactionType={redactionType}
          termsService={termService}
          allowRedactions={allowRedactions}
          showRedactionToggle={showRedactionToggle}
          downloadLink={
            isReport && selectedGridRow?.gid
              ? fsiService.downloadReport(selectedGridRow?.gid)
              : fsiService.downloadProperties(
                  `${selectedGridRow.gid}.pdf`,
                  TableEnum[selectedGridRow.datasource as keyof typeof TableEnum],
                  selectedGridRow.gid.toString(),
                  redactionType
                )
          }
        />
      ) : (
        <Waiting />
      )}
    </div>
  );
};

export default Preview;
