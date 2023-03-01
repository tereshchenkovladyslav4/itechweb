import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { trackPromise } from "react-promise-tracker";
import { NoteModel } from "../Model/iTechRestApi/NoteModel";
import Waiting from "../_components/Waiting";
import { noteService } from "../_services/noteService";
import Note, { NoteType } from "./Note";
import { useStyles } from "./NoteList.style";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import { useStore } from "../_context/Store";
import { NoteLinkType } from "../Model/iTechRestApi/NoteLinkType";
import { getInvestigationId } from "../_helpers/helpers";

interface INoteListProps {
  linkId?: number;
  linkType?: NoteLinkType;
  service: typeof noteService;
  area: string;
  noteType: NoteType;
  offset?:number;  // to adjust height when used in preview with tab buttons
}


export interface StyleProps {
  offset: number;
}

const NoteList: React.FC<INoteListProps> = ({
  service,
  linkId,
  linkType = NoteLinkType.sim,
  area,
  noteType,
  offset = 0,
}) => {
  const props: StyleProps = {
    offset: offset,
  };
  const classes = useStyles(props);
  const [Notes, setNotes] = useState<NoteModel[]>();

  const createSingleNote = () => {
    const note = new NoteModel();
    note.noteType = NoteType[NoteType.Single];

    return note;
  };

  const [singleNote, setSingleNote] = useState<NoteModel>(createSingleNote());
  const isMounted = useIsMounted();
  const { selectors } = useStore();
  const [replying, setReplying] = useState(0);

  // if its a tab notelist but in an investigation page - link the note to the user
  if (linkType === NoteLinkType.tab) {
    const investigationId = getInvestigationId();
    if (
      investigationId?.rowId !== undefined &&
      investigationId.datasource?.toLowerCase() === "user"
    ) {
      linkType = NoteLinkType.user; // TBD... if other datasources for investigation may want to map the datasource to this
      linkId = investigationId.rowId;
    }
  }

  useEffect(() => {
    // zero is a valid linkId
    if (linkId !== undefined) {
      trackPromise(service.getLinkedNotes(linkId, linkType), area).then((rsp) => {
        if (isMounted()) {
          const apiNotes = rsp?.filter((x) => x.noteType == NoteType[noteType]);
          if (apiNotes?.length > 0) setNotes(apiNotes);
          else if (!apiNotes && noteType == NoteType.Advanced) onAddNote();
          else setNotes([]);
        }
      });
    } else {
      // setNotes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkId, linkType]);

  const saveNewNote = (note: NoteModel) => {
    if (linkId !== undefined) {
      return trackPromise(service.addLinkedNote(linkId, linkType, note), area).then((result) => {
        setNotes((prev) => [result, ...(prev || [])]);
      });
    } else {
      return trackPromise(service.add(note), area).then((result) => {
        setNotes((prev) => [result, ...(prev || [])]);
      });
    }
  };

  const onAddNote = () => {
    const note = new NoteModel();
    note.noteType = NoteType[noteType];
    note.title =
      noteType == NoteType.Simple ? "Title" : noteType == NoteType.Normal ? "Add note" : "Wiki";

    saveNewNote(note);
  };

  const updateNote = (note: NoteModel) => {
    const currentNotes = [...(Notes || [])];
    const i = currentNotes.findIndex((x) => x.rowId === note.rowId);
    if (i >= 0) {
      currentNotes[i] = note;
      setNotes(currentNotes);
    } else {
      // new instance
      if(note.iTechDataNoteParentRowId){
        // add below the note it is parented to
        const iParent = currentNotes.findIndex((x) => x.rowId === note.iTechDataNoteParentRowId);
        if(iParent >= 0 && iParent != currentNotes.length-1){
          const notes = [...currentNotes];
          // add after its parent
          notes.splice(iParent+1, 0, note);
          setNotes(notes);
        }else{
          setNotes([...currentNotes, note]);
        }
      }else {
        setNotes([note, ...currentNotes]);
      }
      // only called from single note - reset this instance 
      setSingleNote(createSingleNote());
    }
  };

  const removeNote = (id: number) => {
    trackPromise(service.remove(id), area).then(() => {
      const currentNotes = [...(Notes || [])];
      setNotes(currentNotes.filter((x) => x.rowId !== id));
    });
  };

  if (linkId === undefined && Notes === undefined)
    return (
      <div className={classes.component}>
        <Waiting />
      </div>
    );

  const readOnly = selectors.getCaseClosed();

  return (
    <div className={classes.container}>
      {!readOnly && noteType !== NoteType.Single && (
        <div>
          {/* <Button size="small" variant="contained" color="primary" className={classes.btn} onClick={onAddNote} startIcon={<NotesIcon />}>Add Note</Button> */}
          <Button variant="contained" color="primary" className={classes.btn} onClick={onAddNote}>
            {noteType == NoteType.Simple ? "Add section" : "Add note"}
          </Button>
        </div>
      )}
      {!readOnly && noteType === NoteType.Single && (
        <div>
          <Note
            note={singleNote}
            service={service}
            linkId={linkId}
            linkType={linkType}
            setNote={updateNote}
            area={area}
            deleteNote={undefined}
            noteType={noteType}
          />
        </div>
      )}
      {Notes?.map((note, i) => (
        <Note
          key={i}
          note={note}
          service={service}
          linkId={linkId}
          linkType={linkType}
          setNote={readOnly ? undefined : updateNote}
          area={area}
          deleteNote={readOnly ? undefined : removeNote}
          noteType={noteType}
          replying={replying}
          setReplying={setReplying}
        />
      ))}
    </div>
  );
};

export default NoteList;
