import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Button, Grid, IconButton, Typography } from "@mui/material";
import { NoteModel } from "../Model/iTechRestApi/NoteModel";
import { AccountCircle, Delete, Replay, Edit, Reply } from "@mui/icons-material";
import { convertFromRaw, EditorState } from "draft-js";
import { useStyles } from "./Note.style";
import { authenticationService } from "../_services/authenticationService";
import { UserType } from "../Model/iTechRestApi/AuthenticateResponse";
import MUIRichTextEditor, { TMUIRichTextEditorRef } from "mui-rte";
import moment from "moment";
import ConfirmDialog from "../_components/ConfirmDialog";
import clsx from "clsx";
import { securityObjectService } from "../_services/securityObjectService";
import { SecurityObjectModel } from "../Model/iTechRestApi/SecurityObjectModel";
import { useReferredState } from "../_helpers/hooks/useReferredState";
import { NoteType } from "./Note";
import {stateToHTML} from 'draft-js-export-html';

interface ISingleNoteProps {
  note: NoteModel;
  setNote?: (d: any) => void; // if undefined the note is readonly
  deleteNote?: (id: number) => void;
  onSave: (data: string, title: string, sendTo?: number[], htmlNote?: string, reply?: NoteModel) => void;
  replying: number;
  setReplying?: React.Dispatch<React.SetStateAction<number>>;
}

interface IUser {
  keys: string[];
  value: string;
  content: string | ReactElement;
  id: number;
}

interface IUserProps {
  name: string;
  className: string;
}

const User: React.FC<IUserProps> = ({ name, className }) => (
  <Typography className={className}>{name}</Typography>
);

const SingleNote: React.FC<ISingleNoteProps> = ({
  note,
  setNote,
  deleteNote,
  onSave,
  replying,
  setReplying,
}) => {
  const classes = useStyles();
  const [showConfirm, setShowConfirm] = useState(false);
  const [editing, setEditing] = useState(setNote !== undefined && (note.dateModified ?? "") === "");
  const retRef = useRef<TMUIRichTextEditorRef>(null);
  const [users, usersRef, setUsers] = useReferredState<IUser[]>([]);
  const isExternalUser = authenticationService.currentUserValue?.userType === UserType.external;
  const [replyNote, setReplyNote] = useState<NoteModel>();

  const UserDecorator = (props: any) => {
    let className = undefined;
    const user = usersRef.current?.find((x) => x.value === props.decoratedText);
    if (user) {
      className = classes.user;
    }
    return <span className={className}>{props.children}</span>;
  };

  function createUser(u: SecurityObjectModel): IUser {
    return {
      keys: [
        `${u.forename} ${u.surname}`,
        `${u.forename?.toLowerCase()} ${u.surname?.toLowerCase()}`,
      ],
      value: `@${u.forename} ${u.surname}`,
      content: <User name={`${u.forename} ${u.surname}`} className={classes.user} />,
      id: u.rowId,
    };
  }

  useEffect(() => {
    securityObjectService.getAll().then((users) => {
      const userData = users.map((u) => createUser(u));

      // TODO - do this once and store in context i.e. make a thunk
      setUsers(userData);
    });
  }, []);

  useEffect(() => {
    setEditing((note.dateModified ?? "") === "");
  }, [note]);

  useEffect(() => {
    if (editing) {
      retRef.current?.focus();
    }
  }, [editing]);

  const _onCloseConfirm = () => {
    setShowConfirm(false);
  };

  const _onDelete = () => {
    if (!deleteNote) return;
    setShowConfirm(false);
    deleteNote(note.rowId);
  };

  const _onDeleteClick = () => {
    setShowConfirm(true);
  };

  const createSingleNote = () => {
    const note = new NoteModel();
    note.noteType = NoteType[NoteType.Single];

    return note;
  };

  const onReplyClick = () => {
    if (setReplying) {
      setReplying((p) => (p === 0 ? note.rowId : 0));
    }
    setReplyNote(createSingleNote());
  };

  const _onSave = (data: string) => {
    const [sendTo, html] = getSendToUserIds(data, users);

    onSave(data, "", sendTo, html);
    setEditing(false);
  };

  const _onSaveReply = (data: string) => {
    const [sendTo, html]  = getSendToUserIds(data, users);

    if(replyNote){
      replyNote.iTechDataNoteParentRowId = note.rowId;
      replyNote.htmlNote = html;
      onSave(data, "", sendTo, '', replyNote);
    }
    if (setReplying) {
      setReplying(0);
    }
  };

  const onAddSingleNote = () => {
    if (retRef.current) {
      retRef.current.save();
    }
  };

  const canEdit = true; // todo - add permission based logic
  const canDelete = !isExternalUser;

  const currentUser = authenticationService.currentUserValue;
  const userName = `${currentUser?.forename} ${currentUser?.surname}`;

  // dont't render until we have the users data
  if (!users.length) return null;

  return (
    <>
      <div
        className={clsx({
          [classes.editor]: editing,
          [classes.readOnly]: !editing,
          [classes.reply]: note.iTechDataNoteParentRowId ?? 0 > 0,
        })}
      >
        {showConfirm && (
          <ConfirmDialog
            title="Delete Note"
            text="Are you sure?"
            show={showConfirm}
            onClose={_onCloseConfirm}
            onConfirm={_onDelete}
          />
        )}

        <Grid container width={"100%"} className={classes.hiddenButtonContainer}>
          <Grid container item xs={12} direction="row" alignItems="center">
            {note.createdBy && (
              <>
                <Grid className={classes.userIcon}>
                  <AccountCircle />
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.right} variant="caption">
                    {note.createdBy}
                  </Typography>
                </Grid>
              </>
            )}
            {note.dateModified && (
              <Grid container item xs={7} justifyContent="flex-end" style={{ minHeight: 34 }}>
                <Typography className={classes.time} component="div" variant="caption">
                  {moment(note.dateModified, "DD/MM/YYYY HH:mm Z").fromNow()}
                </Typography>
                {canEdit && replying === 0 && (
                  <IconButton
                    size="small"
                    onClick={() => setEditing((prev) => !prev)}
                    className="hidden-button"
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                )}
                {canDelete && deleteNote && (
                  <IconButton size="small" onClick={_onDeleteClick} className="hidden-button">
                    <Delete fontSize="small" />
                  </IconButton>
                )}
                {!editing && (replying === 0 || replying === note.rowId) && (
                  <IconButton size="small" onClick={onReplyClick} className="hidden-button">
                    <Reply fontSize="small" />
                  </IconButton>
                )}
              </Grid>
            )}
          </Grid>
          <Grid container item xs={12} direction="row">
            <MUIRichTextEditor
              classes={{
                container: editing ? classes.muiEdtableContainer : classes.muiContainer,
                editorContainer: classes.muiEditorContainer,
                placeHolder: classes.muiEditorPlaceholder,
                toolbar: editing ? classes.toolbar : undefined,
              }} // override to make look like one pane
              ref={retRef}
              inlineToolbar={true}
              onSave={_onSave}
              inheritFontSize
              readOnly={!editing}
              defaultValue={note.text}
              toolbarButtonSize="small"
              customControls={[
                {
                  name: "reset",
                  icon: <Replay />,
                  type: "callback",
                  onClick: () => {
                    // set content back to when loaded / last saved
                    if (note.text) {
                      const original = JSON.parse(note.text);
                      return EditorState.createWithContent(convertFromRaw(original));
                    } else {
                      return EditorState.createEmpty();
                    }
                  },
                },
              ]}
              controls={
                !editing
                  ? []
                  : isExternalUser && note.rowId > 0
                  ? ["save"]
                  : [
                      "italic",
                      "underline",
                      "strikethrough",
                      "highlight",
                      "undo",
                      "redo",
                      "link",
                      "media",
                      "numberList",
                      "bulletList",
                      "quote",
                      "code",
                      "clear",
                      "reset",
                      note.rowId ?? 0 > 0 ? "save" : "", // dont show the save when its the instance for adding a new note
                    ]
              }
              autocomplete={{
                strategies: [
                  {
                    items: usersRef.current,
                    triggerChar: "@",
                  },
                ],
                suggestLimit: 20, // default is 5
              }}
              decorators={[{ component: UserDecorator, regex: /(@\w+ \w*)/g }]} // allow blank surname? \w* instead of \w+
            />
          </Grid>
          {replying === note.rowId && (
            <>
            <Grid container item xs={12} direction="row">
              <MUIRichTextEditor
                classes={{
                  container: classes.muiEdtableContainer,
                  editorContainer: classes.muiEditorContainer,
                  placeHolder: classes.muiEditorPlaceholder,
                  toolbar: classes.toolbar,
                }} // override to make look like one pane
                ref={retRef}
                inlineToolbar={true}
                onSave={_onSaveReply}
                inheritFontSize
                defaultValue={replyNote?.text || ""}
                toolbarButtonSize="small"
                customControls={[
                  {
                    name: "reset",
                    icon: <Replay />,
                    type: "callback",
                    onClick: () => {
                      // set content back to when loaded / last saved
                      if (replyNote?.text) {
                        const original = JSON.parse(replyNote.text);
                        return EditorState.createWithContent(convertFromRaw(original));
                      } else {
                        return EditorState.createEmpty();
                      }
                    },
                  },
                ]}
                controls={
                   (isExternalUser && replyNote?.rowId) || 0 > 0
                    ? ["save"]
                    : [
                        "italic",
                        "underline",
                        "strikethrough",
                        "highlight",
                        "undo",
                        "redo",
                        "link",
                        "media",
                        "numberList",
                        "bulletList",
                        "quote",
                        "code",
                        "clear",
                        "reset",
                        // note.rowId ?? 0 > 0 ? "save" : "", // dont show the save when its the instance for adding a new note
                      ]
                }
                autocomplete={{
                  strategies: [
                    {
                      items: usersRef.current,
                      triggerChar: "@",
                    },
                  ],
                  suggestLimit: 20, // default is 5
                }}
                decorators={[{ component: UserDecorator, regex: /(@\w+ \w*)/g }]} // allow blank surname? \w* instead of \w+
              />
            </Grid>
            <Grid container className={classes.submitContainer}>
            <Grid item xs={9} margin="auto">
              <Typography className={classes.username} variant="caption">
                {userName}
              </Typography>
            </Grid>
            <Grid item container xs={3} justifyContent="flex-end">
              <Button
                variant="contained"
                color="secondary"
                className={classes.btn}
                onClick={onAddSingleNote}
              >
                Send
              </Button>
            </Grid>
          </Grid>
          </>
            
          )}
        </Grid>
        {(note?.rowId ?? 0) === 0 && (
          <Grid container className={classes.submitContainer}>
            <Grid item xs={9} margin="auto">
              <Typography className={classes.username} variant="caption">
                {userName}
              </Typography>
            </Grid>
            <Grid item container xs={3} justifyContent="flex-end">
              <Button
                variant="contained"
                color="secondary"
                className={classes.btn}
                onClick={onAddSingleNote}
              >
                Send
              </Button>
            </Grid>
          </Grid>
        )}
      </div>
    </>
  );
};

export default SingleNote;

function getSendToUserIds(data: string, users: IUser[]): [number[], string] {
  const sendTo: number[] = [];

  // populate for new note or edits
  const userNames = data.match(/(@\w+ \w*)/g);
  userNames?.forEach((u) => {
    const match = users.find((user) => user.value === u);
    if (match) {
      sendTo.push(match.id);
    }
  });
  let html = '';
  if(sendTo.length){
    const original = JSON.parse(data);
    html = stateToHTML(convertFromRaw(original));
  }
  return [sendTo, html];
}
