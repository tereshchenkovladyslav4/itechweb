import React, { ReactElement, useState, useRef, useEffect } from "react";
import {
  Button,
  Typography,
  Portal,
  Grid,
  List,
  ListItem,
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { CheckCircle, Cancel, Add, Delete, AccountCircle } from "@mui/icons-material";
import FormBuilder from "../Form/FormBuilder";
import UserSearch, { SearchDataType } from "../Filter/UserSearch";
import { ITechDataUser } from "../Model/iTechRestApi/ITechDataUser";
import { userService } from "../_services/userService";
import { Alert } from '@mui/material';
import { useStyles } from "./GeneralDlg.styles";

type ManageUserProps = {
  onFormSave: (userId: string | number, gids: number[]) => Promise<void | never>;
  onRemoveReference: (groupId: string | number, userId: string | number) => Promise<number | void>;
  onCloseForm: () => void;
  show: boolean;
  gid: string | number;
};

const ManageUser: React.FC<ManageUserProps> = ({
  onFormSave,
  onRemoveReference,
  onCloseForm,
  show,
  gid,
}) => {
  const classes = useStyles();
  const [displayUser, setDisplayUser] = useState<ITechDataUser | undefined>();
  const [currentGroup, setCurrentGroup] = useState<ITechDataUser | undefined>();
  const [groupList, setGroupList] = useState<ITechDataUser[]>([]);
  const [errorText, setErrorText] = useState("");

  const _onSubmit = () => {
    onFormSave(
      gid,
      groupList.map((x) => x.rowId)
    ).then(
      () => {
        setGroupList([]);
        setErrorText("");
      },
      (error) => setErrorText(error)
    );
  };

  const _removeGroup = async (rowId: number) => {
    if (gid === undefined) return;

    await onRemoveReference(rowId, gid).then(
      () => {
        const newList = groupList.filter((x) => x.rowId !== rowId);
        setGroupList(newList);
      },
      (error) => setErrorText(error)
    );
  };

  useEffect(() => {
    setErrorText("");

    if (!show || gid === undefined) {
      setGroupList([]);
      return;
    }

    _load(gid);
  }, [show]);

  useEffect(() => {
    if (gid === undefined) return;

    _load(gid);
  }, [gid]);

  const _load = (gid: string | number) => {
    (async () => {
      await userService.get(parseInt(gid.toString())).then((user) => setDisplayUser(user));
      await userService.userGroups(gid).then((groups) => setGroupList(groups));
    })();
  };

  const _addGroup = () => {
    if (!currentGroup) return;
    const list = groupList;
    list.push(currentGroup);
    setGroupList(list);
    setCurrentGroup(undefined);
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
      <Button onClick={_addGroup} className={classes.autocompleteButton}>
        <Add /> Add Group
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

  return (
    <>
      <div className="formSection">
        {errorText && <Alert severity="error">{errorText}</Alert>}
        <Typography variant="h4">
          Add User {displayUser?.forename} {displayUser?.surname} To Group
        </Typography>
      </div>
      <div className="formSection">
        <Typography>Group Search</Typography>
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

type ManageUserDlgProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  onSave: (userId: string | number, gids: number[]) => Promise<void | never>;
  onRemoveReference: (groupId: string | number, userId: string | number) => Promise<number | void>;
  gid: string | number;
};

const ManageUserDlg: React.FC<ManageUserDlgProps> = ({
  show,
  setShow,
  onSave,
  onRemoveReference,
  gid,
}): ReactElement => {
  const container = useRef();

  return (
    <Portal container={container.current}>
      <FormBuilder propDisplay={show} onChange={setShow}>
        <ManageUser
          onFormSave={onSave}
          onRemoveReference={onRemoveReference}
          onCloseForm={() => setShow(false)}
          show={show}
          gid={gid}
        />
      </FormBuilder>
    </Portal>
  );
};

export default ManageUserDlg;
