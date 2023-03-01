import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from "@mui/material";
import React, { ReactElement, useEffect, useState } from "react";
import { trackPromise } from "react-promise-tracker";
import { CaseNotes as CaseNotesType } from "../Model/iTechRestApi/CaseNotes";
import { NoteLinkType } from "../Model/iTechRestApi/NoteLinkType";
import { noteService } from "../_services/noteService";
import NoteList from "./NoteList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TinyButton } from "../_components/TinyButton";
import { dataService } from "../_services/dataService";
import { useStore } from "../_context/Store";
import { updateGridRowAction } from "../_context/actions/PageDataActions";
import { showErrorDialogAction } from "../_context/actions/HandleErrorActions";
import { useStyles } from "./CaseNotes.style";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import useAsyncError from "../_helpers/hooks/useAsyncError";
import { hasPreviewOrProperties } from "../_helpers/fileActions";
import { TableEnum } from "../Model/iTechRestApi/TableEnum";
import { NoteType } from "./Note";

interface ICaseNotesProps {
  caseId?: number;
  service: typeof noteService;
  area: string;
  dataService: typeof dataService;
}

const CaseNotes: React.FC<ICaseNotesProps> = ({ service, caseId, area, dataService }) => {
  const isMounted = useIsMounted();
  const classes = useStyles();
  const [caseNotes, setFiles] = useState<CaseNotesType[]>([]);
  const { dispatch } = useStore();
  const throwError = useAsyncError();
  const showLinkButton = hasPreviewOrProperties();

  useEffect(() => {
    if (caseId) {
      // get a list of the case file rowIds that have notes...
      trackPromise(service.getCaseFilesWithNotes(caseId), area)
        .then((result) => {
          if (isMounted()) {
            setFiles(result);
          }
        })
        .catch((error) => {
          throwError(new Error(error?.message || error));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  const mapLinkTioDataSource = (linkType: NoteLinkType): string | null => {
    switch (linkType) {
      case NoteLinkType.accident:
        return TableEnum[TableEnum.iTechWebSimAccident];
      case NoteLinkType.sim:
        return TableEnum[TableEnum.iTechWebSim];
      case NoteLinkType.salesForce:
        return TableEnum[TableEnum.iTechWebSimSalesForce];
      case NoteLinkType.task:
        return TableEnum[TableEnum.iTechWebTask];
    }
    return null;
  };

  const onFileSelected = (e: any, gid: number, linkType: NoteLinkType) => {
    e.stopPropagation();
    e.preventDefault();
    const dataSource = mapLinkTioDataSource(linkType);
    if (dataSource) {
      return trackPromise(dataService.gid(dataSource, String(gid)), area).then(
        (result) => {
          result.datasource = dataSource;
          dispatch(updateGridRowAction(result));
        },
        (error) => {
          dispatch(showErrorDialogAction(CaseNotes.displayName, error?.message));
        }
      );
    }
  };

  const Notes = ({ noteCategory }: { noteCategory: CaseNotesType }): ReactElement | null => {
    if (!noteCategory?.notes?.length) return null;

    return (
      <Accordion className={classes.accordion}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{noteCategory.type}</Typography>
        </AccordionSummary>
        {noteCategory.notes?.map((file, i) => (
          <Accordion
            key={i}
            TransitionProps={{ unmountOnExit: true }}
            className={classes.accordionInner}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Grid container item xs={12} className={classes.accordionSummary}>
                <Grid item xs={2}>
                  <Typography>Type:</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography>{file.type}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography>Date:</Typography>
                </Grid>
                <Grid item xs={5}>
                  <Typography>{file.fileDate}</Typography>
                </Grid>
                <Grid container item xs={1} justifyContent="center" alignItems="center">
                  {showLinkButton && (
                    <TinyButton
                      icon="Input"
                      onClick={(e) => onFileSelected(e, file.rowId, noteCategory.noteLinkType)}
                      color="primary"
                    />
                  )}
                </Grid>
                {file.detail1 && (
                  <>
                    <Grid item xs={2}>
                      <Typography>From:</Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <Typography>{file.detail1}</Typography>
                    </Grid>
                  </>
                )}
                {file.detail2 && (
                  <>
                    <Grid item xs={2}>
                      <Typography>To:</Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <Typography>{file.detail2}</Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </AccordionSummary>
            <AccordionDetails className={classes.root}>
              <NoteList
                service={service}
                linkId={file.rowId}
                linkType={noteCategory.noteLinkType}
                area={area}
                noteType={NoteType.Normal}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </Accordion>
    );
  };

  return (
    <>
      <NoteList
        area={area}
        linkId={caseId}
        linkType={NoteLinkType.case}
        service={service}
        noteType={NoteType.Normal}
      />
      {caseNotes?.map((n, i) => (
        <Notes key={i} noteCategory={n} />
      ))}
    </>
  );
};

CaseNotes.displayName = "CaseNotes";

export default CaseNotes;
