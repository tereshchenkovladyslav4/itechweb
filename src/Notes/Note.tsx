import React from "react";
import { noteService } from "../_services/noteService";
import { NoteModel } from "../Model/iTechRestApi/NoteModel";
import { trackPromise } from "react-promise-tracker";
import { dateUtcString } from "../_helpers/dateFormat";
import { NoteLinkType } from "../Model/iTechRestApi/NoteLinkType";
import NormalNote from "./NormalNote";
import SimpleNote from "./SimpleNote";
import AdvancedNote from "./AdvancedNote";
import SingleNote from "./SingleNote";

export enum NoteType {
  Simple,
  Normal,
  Advanced,
  Single, // no titles / single thread / can only add ?
}

interface INoteProps {
  note: NoteModel;
  setNote?: (d: any) => void; // if undefined the note is readonly
  deleteNote?: (id: number) => void;
  linkId?: number;
  linkType?: NoteLinkType;
  service: typeof noteService;
  area: string;
  noteType: NoteType;
  replying?: number;
  setReplying?: React.Dispatch<React.SetStateAction<number>>;
}

const Note: React.FC<INoteProps> = ({
  note,
  service,
  linkId,
  linkType,
  setNote,
  deleteNote,
  area,
  noteType = NoteType.Normal,
  replying = 0,
  setReplying = undefined,
}) => {
  const dateNowUTC = () => {
    const d = new Date();
    const dateTime = dateUtcString(d);

    return dateTime;
  };

  const onSave = (
    data: string,
    title: string,
    sendTo?: number[],
    htmlNote?: string,
    reply?: NoteModel
  ) => {
    if (!setNote) return; // readonly

    if (reply) {
      reply.text = data;
      reply.noteType = NoteType[noteType];
      reply.title = title;

      if (sendTo?.length) {
        reply.sendToSecurityIds = sendTo;
      }
      // always an add for a reply
      if (linkId !== undefined && linkType) {
        trackPromise(service.addLinkedNote(linkId, linkType, reply), area).then((result) => {
          setNote(result);
        });
      } else {
        trackPromise(service.add(reply), area).then((result) => {
          setNote(result);
        });
      }
      return;
    } else {
      note.text = data;
      note.title = title;
      note.noteType = NoteType[noteType];
      if (sendTo?.length) {
        note.sendToSecurityIds = sendTo;
        if (htmlNote) {
          note.htmlNote = htmlNote;
        }
      }
    }

    if (note.rowId) {
      trackPromise(service.update(note.rowId, note), area).then((updated) => {
        if (updated) {
          note.dateModified = dateNowUTC();
          setNote(note);
        }
      });
    } else {
      // LinkId can have a value of zero !
      if (linkId !== undefined && linkType) {
        trackPromise(service.addLinkedNote(linkId, linkType, note), area).then((result) => {
          setNote(result);
        });
      } else {
        trackPromise(service.add(note), area).then((result) => {
          setNote(result);
        });
      }
    }
  };

  if (!note) return null;

  return noteType == NoteType.Simple ? (
    <SimpleNote note={note} setNote={setNote} deleteNote={deleteNote} onSave={onSave} />
  ) : noteType == NoteType.Advanced ? (
    <AdvancedNote note={note} setNote={setNote} deleteNote={deleteNote} onSave={onSave} />
  ) : noteType == NoteType.Normal ? (
    <NormalNote note={note} setNote={setNote} deleteNote={deleteNote} onSave={onSave} />
  ) : (
    <SingleNote
      note={note}
      setNote={setNote}
      deleteNote={deleteNote}
      onSave={onSave}
      replying={replying}
      setReplying={setReplying}
    />
  );
};

export default Note;
