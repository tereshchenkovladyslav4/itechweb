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
  TextField,
} from "@mui/material";
import { CheckCircle, Cancel, Add, Delete, AccountCircle, HighlightOff } from "@mui/icons-material";
import FormBuilder from "../Form/FormBuilder";
import { useStyles } from "./GeneralDlg.styles";
import UserSearch, { SearchDataType } from "../Filter/UserSearch";
import { ITechDataUser } from "../Model/iTechRestApi/ITechDataUser";
import { userGroupService } from "../_services/userGroupService";
import { userService } from "../_services/userService";

type ManageGroupProps = {
  onFormSave: (
    groupId: string | number | undefined,
    name: string | undefined,
    gids: number[]
  ) => Promise<void | never>;
  onFormDelete: (groupId: string | number | undefined) => Promise<void | never>;
  onRemoveReference: (groupId: string | number, userId: string | number) => Promise<number | void>;
  onCloseForm: () => void;
  show: boolean;
  gid?: string | number | undefined;
};

const ManageGroup: React.FC<ManageGroupProps> = ({
  onFormSave,
  onFormDelete,
  onRemoveReference,
  onCloseForm,
  show,
  gid,
}) => {
  const classes = useStyles();
  const [currentUser, setCurrentUser] = useState<ITechDataUser | undefined>();
  const [userList, setUserList] = useState<ITechDataUser[]>([]);
  const [name, setName] = useState<string>("");
  const [errorText, setErrorText] = useState("");

  const _onSubmit = () => {
    if (name?.length > 0) {
      onFormSave(
        gid,
        name,
        userList.map((x) => x.rowId)
      ).then(
        () => {
          setName("");
          setUserList([]);
          setErrorText("");
        },
        (error) => setErrorText(error)
      );
    } else {
      setErrorText("Need valid name");
    }
  };

  const _onFormDelete = () => {
    onFormDelete(gid).then(
      () => {
        setName("");
        setUserList([]);
        setErrorText("");
      },
      (error) => setErrorText(error)
    );
  };

  const _removeUser = async (rowId: number) => {
    if (gid === undefined) return;

    await onRemoveReference(gid, rowId).then(
      () => {
        const newList = userList.filter((x) => x.rowId !== rowId);
        setUserList(newList);
      },
      (error) => setErrorText(error)
    );
  };

  const _setName = (val: string) => {
    setName(val);
    setErrorText("");
  };

  useEffect(() => {
    setErrorText("");

    if (!show || gid === undefined) {
      setName("");
      setUserList([]);
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
      await userGroupService.get(gid).then((group) => setName(group.displayName));
      await userService.group(gid).then((users) => setUserList(users));
    })();
  };

  const _addUser = () => {
    if (!currentUser) return;
    const list = userList;
    list.push(currentUser);
    setUserList(list);
    setCurrentUser(undefined);
  };

  const _renderUsers = () => {
    return <>
      <UserSearch
        datatype={SearchDataType.User}
        value={currentUser ? currentUser : ""}
        setValue={setCurrentUser}
        isLogin={false}
        style={{ width: "100%" }}
      />
      <Button className={classes.autocompleteButton} onClick={_addUser}>
        <Add /> Add
      </Button>
      <Grid item xs={12} md={6}>
        <List dense>
          {userList?.map((user) => {
            return (
              <ListItem key={user.rowId} classes={{ root: classes.listItem }}>
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircle />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${user.forename} ${user.surname}`} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => _removeUser(user.rowId)}
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
        <Typography variant="h4">User Group</Typography>
      </div>
      <div className="formSection">
        <TextField
          name="name"
          label="Group name"
          value={name ?? ""}
          onChange={(e) => _setName(e.target.value)}
          helperText={errorText}
          error={errorText.length > 0}
          className={classes.name}
          disabled={gid !== undefined}
        />
        <Typography className={classes.label}>User / Group Search</Typography>
        {_renderUsers()}
      </div>
      <Button className={classes.formButton} onClick={_onSubmit}>
        <CheckCircle /> Confirm
      </Button>
      {gid && (
        <Button className={classes.formButton} onClick={_onFormDelete}>
          <HighlightOff /> Delete Group
        </Button>
      )}
      <Button className={classes.formButton} onClick={() => onCloseForm()}>
        <Cancel /> Cancel
      </Button>
    </>
  );
};

type ManageGroupDlgProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  onSave: (
    groupId: string | number | undefined,
    name: string | undefined,
    gids: number[]
  ) => Promise<void | never>;
  onDelete: (groupId: string | number | undefined) => Promise<void | never>;
  onRemoveReference: (groupId: string | number, userId: string | number) => Promise<number | void>;
  gid?: string | number | undefined;
};

const ManageGroupDlg: React.FC<ManageGroupDlgProps> = ({
  show,
  setShow,
  onSave,
  onDelete,
  onRemoveReference,
  gid,
}): ReactElement => {
  const container = useRef();

  return (
    <Portal container={container.current}>
      <FormBuilder propDisplay={show} onChange={setShow}>
        <ManageGroup
          onFormSave={onSave}
          onFormDelete={onDelete}
          onRemoveReference={onRemoveReference}
          onCloseForm={() => setShow(false)}
          show={show}
          gid={gid}
        />
      </FormBuilder>
    </Portal>
  );
};

export default ManageGroupDlg;
