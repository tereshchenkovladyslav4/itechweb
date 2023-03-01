import React, { ReactElement, useState, useRef, useEffect } from "react";
import {
  Typography,
  Portal,
  Grid,
  List,
  Button,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  FormLabel,
} from "@mui/material";
import { CheckCircle, Cancel, Add, AccountCircle, Delete } from "@mui/icons-material";
import FormBuilder from "../Form/FormBuilder";
import UserSearch, { SearchDataType } from "../Filter/UserSearch";
import { useStyles } from "./GeneralDlg.styles";
import { ITechDataUser } from "../Model/iTechRestApi/ITechDataUser";
import { Alert } from '@mui/material';

type MultiUserProps = {
  onCloseForm: () => void;
  rowIds: number[];
  addToGroup: boolean;
  onRemoveFromGroup: (groupIds: number[]) => Promise<number | void>;
  onAddToGroup: (groupIds: number[]) => Promise<number | void>;
};

const MultiUser: React.FC<MultiUserProps> = ({
  onCloseForm,
  rowIds,
  addToGroup,
  onRemoveFromGroup,
  onAddToGroup,
}) => {
  const [formError, setFormError] = useState<string>("");
  const [isAdd, setIsAdd] = useState<boolean>(addToGroup);
  const [currentGroup, setCurrentGroup] = useState<ITechDataUser | undefined>();
  const [groupList, setGroupList] = useState<ITechDataUser[]>([]);
  const classes = useStyles();

  useEffect(() => {
    if (rowIds?.length > 0) setFormError("");
    else setFormError("No users selected");
  }, [rowIds]);
  useEffect(() => {
    setIsAdd(addToGroup);
  }, [addToGroup]);

  const _onSubmit = () => {
    const service = isAdd ? onAddToGroup : onRemoveFromGroup;
    service(groupList.map((x) => x.rowId)).then(
      () => {
        setFormError("");
        setCurrentGroup(undefined);
        setGroupList([]);
      },
      (error) => setFormError(error)
    );
  };

  const _addGroup = () => {
    if (!currentGroup) return;
    const list = groupList;
    list.push(currentGroup);
    setGroupList(list);
    setCurrentGroup(undefined);
  };

  const _removeGroup = async (rowId: number) => {
    const newList = groupList.filter((x) => x.rowId !== rowId);
    setGroupList(newList);
  };

  const _renderGroups = () => {
    return <>
      <UserSearch
        datatype={SearchDataType.UserGroup}
        value={currentGroup ? currentGroup : ""}
        setValue={setCurrentGroup}
        isLogin={false}
        style={{ width: "100%" }}
      />
      <Button className={classes.autocompleteButton} onClick={_addGroup}>
        <Add /> Select Group
      </Button>
      <Grid item xs={12} md={6}>
        <List dense>
          {groupList?.map((user) => {
            return (
              <ListItem key={user.rowId} classes={{ root: classes.listItem }}>
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircle />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${user.displayName}`} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => _removeGroup(user.rowId)}
                    size="large">
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </Grid>
    </>;
  };

  const plural = rowIds.length > 1 ? "s" : "";
  return (
    <>
      <div className="formSection">
        {formError && <Alert severity="error">{formError}</Alert>}
        <Typography variant="h4">
          {isAdd
            ? `Add user${plural} to group${plural}`
            : `Remove user${plural} from group${plural}`}
        </Typography>
      </div>
      <div className="formSection">
        <FormControl>
          <FormLabel component="legend" className={classes.label}>
            Add/remove?
          </FormLabel>
          <Select value={isAdd?.toString()} onChange={(e) => setIsAdd(e.target.value === "true")}>
            <MenuItem value="true">{`Add to group${plural}`}</MenuItem>
            <MenuItem value="false">{`Remove from group${plural}`}</MenuItem>
          </Select>
        </FormControl>

        <FormLabel component="legend" className={classes.label}>
          Group Search
        </FormLabel>
        {_renderGroups()}
      </div>
      <Button className={classes.formButton} onClick={_onSubmit}>
        <CheckCircle /> Confirm
      </Button>
      <Button className={classes.formButton} onClick={() => onCloseForm()}>
        <Cancel /> Cancel
      </Button>
    </>
  );
};

type MultiUserDlgProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  rowIds: number[];
  addToGroup: boolean;
  onRemoveFromGroup: (groupIds: number[]) => Promise<number | void>;
  onAddToGroup: (groupIds: number[]) => Promise<number | void>;
};

const MultiUserDlg: React.FC<MultiUserDlgProps> = ({
  show,
  setShow,
  rowIds,
  addToGroup,
  onRemoveFromGroup,
  onAddToGroup,
}): ReactElement => {
  const container = useRef();

  return (
    <Portal container={container.current}>
      <FormBuilder propDisplay={show} onChange={setShow}>
        <MultiUser
          onCloseForm={() => setShow(false)}
          rowIds={rowIds}
          addToGroup={addToGroup}
          onRemoveFromGroup={onRemoveFromGroup}
          onAddToGroup={onAddToGroup}
        />
      </FormBuilder>
    </Portal>
  );
};

export default MultiUserDlg;
