import React, { useEffect, useState } from "react";
import { Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import MUIRichTextEditor from "mui-rte";
import { NoteModel } from "../Model/iTechRestApi/NoteModel";
import { Delete, Edit, Notes } from "@mui/icons-material";
import ConfirmDialog from "../_components/ConfirmDialog";
import { useStyles } from "./Note.style";
import { authenticationService } from "../_services/authenticationService";
import { UserType } from "../Model/iTechRestApi/AuthenticateResponse";

interface ISimpleNoteProps {
  note: NoteModel;
  setNote?: (d: any) => void; // if undefined the note is readonly
  deleteNote?: (id: number) => void;
  onSave: (data: string, title: string) => void;
}

const SimpleNote: React.FC<ISimpleNoteProps> = ({ note, setNote, deleteNote, onSave }) => {
  const classes = useStyles();
  const [showConfirm, setShowConfirm] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [title, setTitle] = useState("");
  const [edit, setEdit] = useState(false);
  const _defaultTitle = "Title";
  const isExternalUser = authenticationService.currentUserValue?.userType === UserType.external;

  useEffect(() => {
    setTitleError("");
    setTitle(note?.title);
    setEdit(note.title == _defaultTitle);
  }, [note]);

  const _onCloseConfirm = () => {
    setShowConfirm(false);
  };

  const _onDelete = () => {
    if (!deleteNote) return;
    setShowConfirm(false);
    deleteNote(note.rowId);
  };

  const _validateTitle = (value: string): boolean => {
    if (!value) {
      setTitleError("Please enter a title.");
      return false;
    }
    setTitleError("");
    return true;
  };

  const _onSetTitle = (value: string) => {
    setTitle(value);
  };

  const _onDeleteClick = () => {
    setShowConfirm(true);
  };

  const _onSave = (data: string) => {
    if (!_validateTitle(title)) return;
    setEdit(false);
    onSave(data, title);
  };

  return (
    <Paper className={classes.editor} elevation={1}>
      {showConfirm && (
        <ConfirmDialog
          title="Delete section"
          text="Are you sure?"
          show={showConfirm}
          onClose={_onCloseConfirm}
          onConfirm={_onDelete}
        />
      )}

      <Grid container>
        <Grid container item xs={12} direction="row">
          <Grid item xs={9}>
            {edit ? (
              <TextField
                required
                fullWidth
                type="text"
                onBlur={(e) => _validateTitle(e.target.value)}
                error={titleError.length > 0}
                helperText={titleError}
                value={title}
                onChange={(e) => _onSetTitle(e.target.value)}
                className={classes.simpleTitle}
                placeholder="Title"
                inputProps={{
                  readOnly: !setNote,
                  style: {
                    padding: 5,
                    fontSize: "1.5em",
                  },
                }}
              />
            ) : (
              <Typography variant="h5" className={classes.simpleTitle}>
                {title}
              </Typography>
            )}
          </Grid>
          <Grid item container xs={3} justifyContent="flex-end" alignItems="center">
            {!isExternalUser && deleteNote && (
              <IconButton className={classes.expandIcon} size="small" onClick={_onDeleteClick}>
                <Delete fontSize="small"/>
              </IconButton>
            )}
            <IconButton className={classes.expandIcon} size="small" onClick={() => setEdit(!edit)}>
              {edit ? <Notes fontSize="small"/> : <Edit fontSize="small"/>}
            </IconButton>
          </Grid>
        </Grid>
        <Grid container item xs={12} direction="row" className={classes.simpleContent}>
          <MUIRichTextEditor
            classes={{
              toolbar: classes.toolbar,
            }} 
            label={edit ? "Enter text here..." : ""}
            inlineToolbar={edit}
            onSave={_onSave}
            readOnly={!edit || !setNote}
            defaultValue={note.text}
            toolbarButtonSize={"small"}
            controls={!setNote || !edit ? [] : ["link", "save"]}
          />
        </Grid>
        <Grid container item xs={12} direction="row">
          <Grid item xs={5}>
            <Typography className={classes.left} variant="caption">
              Last edited by: {note.createdBy}
            </Typography>
          </Grid>
          {note.dateModified && (
            <Grid item xs={6}>
              <Typography className={classes.right} component="div" variant="caption">
                Date last modified: {note.dateModified}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SimpleNote;
