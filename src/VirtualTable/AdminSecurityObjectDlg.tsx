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
  FormLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { CheckCircle, Cancel, Add, Delete, AccountCircle } from "@mui/icons-material";
import FormBuilder from "../Form/FormBuilder";
import UserSearch, { SearchDataType } from "../Filter/UserSearch";
import { ITechDataUser } from "../Model/iTechRestApi/ITechDataUser";
import { userService } from "../_services/userService";
import { Alert } from "@mui/material";
import { useStyles } from "./GeneralDlg.styles";
import clsx from "clsx";
import { ITechDataSecurityObject } from "../Model/iTechRestApi/ITechDataSecurityObject";
import { securityObjectService } from "../_services/securityObjectService";
import { iTechDataUserIdentifierEnum } from "../Model/iTechRestApi/iTechDataUserIdentifierEnum";
import { iTechDataSecurityObjectEnum } from "../Model/iTechRestApi/iTechDataSecurityObjectEnum";
import { ITechDataMembership } from "../Model/iTechRestApi/ITechDataMembership";
import { ITechDataUserIdentifier } from "../Model/iTechRestApi/ITechDataUserIdentifier";
import BusyButton from "../_components/BusyButton";
import { trackPromise } from "react-promise-tracker";
// import moment, { Moment } from "moment";
// import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";

type AdminSecurityObjectProps = {
  onFormSave: (user: ITechDataSecurityObject) => Promise<string[]>;
  onCloseForm: () => void;
  show: boolean;
  gid: string | number | undefined;
};

const AdminSecurityObject: React.FC<AdminSecurityObjectProps> = ({
  onFormSave,
  onCloseForm,
  show,
  gid,
}) => {
  const classes = useStyles();
  const area = "SecurityObject";
  const _id = (type: iTechDataUserIdentifierEnum) => {
    const id = new ITechDataUserIdentifier();
    id.iTechDataUserIdentifierTypeRowId = type;
    return id;
  };
  const _defaultUser = () => {
    const user = new ITechDataSecurityObject();
    user.iTechDataUserIdentifiers = [
      _id(iTechDataUserIdentifierEnum.perEmail),
      _id(iTechDataUserIdentifierEnum.perMobile),
    ];
    return user;
  };
  const [user, setUser] = useState<ITechDataSecurityObject>(_defaultUser());
  const [groupList, setGroupList] = useState<ITechDataSecurityObject[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | undefined>();
  const [errorText, setErrorText] = useState("");
  // const [schedule, setSchedule] = useState<Moment | null>(moment());

  // const scheduleChange = (newValue: Moment | null) => {
  //   setSchedule(newValue);
  // };

  const _membership = (groupId: number): ITechDataMembership => {
    const membership = new ITechDataMembership();
    membership.iTechDataSecurityObjectMemberOfRowId = groupId;
    if (user.iTechDataSecurityObjectParentRowId)
      membership.iTechDataSecurityObjectMemberRowId = user.iTechDataSecurityObjectParentRowId;
    return membership;
  };

  const _onSubmit = () => {
    if (selectedGroup != undefined && gid === undefined)
      user.iTechDataMembershipITechDataSecurityObjectMemberRows = [_membership(selectedGroup)];
    trackPromise(
      onFormSave(user).then(
        (results) => {
          if (results?.length > 0) {
            setErrorText(results.join(" "));
          } else {
            setGroupList([]);
            setErrorText("");
            onCloseForm();
          }
        },
        (error) => setErrorText(error.toString())
      ),
      area
    );
  };

  useEffect(() => {
    setErrorText("");

    if (!show) return;

    (async () => {
      if (gid === undefined)
        await securityObjectService.groups().then((groups) => {
          setGroupList(groups);
          if (groups.length > 0) setSelectedGroup(groups[0].rowId);
        });
    })();

    if (gid !== undefined) _load(gid);
    else setUser(_defaultUser());
  }, [show]);

  useEffect(() => {
    if (gid === undefined) {
      setUser(_defaultUser());
      return;
    }

    _load(gid);
  }, [gid]);

  const _load = (gid: string | number) => {
    (async () => {
      await securityObjectService.get(parseInt(gid.toString())).then((user) => setUser(user));
    })();
  };

  const _identifier = (type: iTechDataUserIdentifierEnum) => {
    return user.iTechDataUserIdentifiers?.find(
      (x) => x.iTechDataUserIdentifierTypeRowId === type && !x.dateArchived
    );
  };

  const _setProperty = (propName: keyof ITechDataSecurityObject, value: any) => {
    setUser((prev) => ({ ...prev, [propName]: value }));
  };

  const _setIdentifier = (type: iTechDataUserIdentifierEnum, value: string) => {
    const newIds = [...user.iTechDataUserIdentifiers].map((id) =>
      id.iTechDataUserIdentifierTypeRowId === type && !id.dateArchived
        ? { ...id, identifier: value }
        : { ...id }
    );
    setUser((prev) => ({ ...prev, iTechDataUserIdentifiers: newIds }));
  };

  return (
    <>
      <div className="formSection">
        {errorText && <Alert severity="error">{errorText}</Alert>}
        <Typography variant="h4">{gid ? "Update" : "Create"} Login</Typography>
      </div>

      <div className="formSection">
        <Alert severity="info">Please allow some time for changes to take effect</Alert>
        <TextField
          name="forename"
          label="Forename"
          placeholder="Required"
          value={user.forename ?? ""}
          onChange={(e) => _setProperty("forename", e.target.value)}
          className={classes.textField}
          disabled={gid !== undefined}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          name="surname"
          label="Surname"
          placeholder="Required"
          value={user.surname ?? ""}
          onChange={(e) => _setProperty("surname", e.target.value)}
          className={classes.textField}
          disabled={gid !== undefined}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          name="timeout"
          label="Timeout Seconds"
          value={user?.timeoutTicks ? user.timeoutTicks / 1000 : ""}
          onChange={(e) => _setProperty("timeoutTicks", parseInt(e.target.value) * 1000)}
          placeholder="Optional"
          className={classes.textField}
          InputLabelProps={{ shrink: true }}
          type="number"
        />

        <TextField
          name="email"
          label="Email"
          value={_identifier(iTechDataUserIdentifierEnum.perEmail)?.identifier ?? ""}
          onChange={(e) => _setIdentifier(iTechDataUserIdentifierEnum.perEmail, e.target.value)}
          placeholder="Required"
          className={classes.textField}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          name="mobile"
          label="Mobile"
          value={_identifier(iTechDataUserIdentifierEnum.perMobile)?.identifier ?? ""}
          onChange={(e) => _setIdentifier(iTechDataUserIdentifierEnum.perMobile, e.target.value)}
          placeholder="Optional"
          className={classes.textField}
          InputLabelProps={{ shrink: true }}
        />

        {user.rowId === undefined && groupList?.length > 0 && (
          <>
            <FormLabel component="legend">Security Group</FormLabel>
            <Select
              labelId="groups"
              onChange={(e) => setSelectedGroup(e.target.value as number)}
              value={selectedGroup ?? groupList[0].rowId}
            >
              {groupList.map((x) => (
                <MenuItem value={x.rowId} key={x.rowId}>
                  {x.forename}
                </MenuItem>
              ))}
            </Select>
          </>
        )}
      </div>

      {/* Schedule */}

      {/* <div className={classes.clear}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateTimePicker
            label="Schedule"
            value={schedule}
            onChange={scheduleChange}
            renderInput={(params: any) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div> */}
      <div className={classes.clear}>
        <BusyButton area={area} className={classes.formButton} onClick={_onSubmit}>
          <CheckCircle /> Confirm
        </BusyButton>
        <Button className={classes.formButton} onClick={() => onCloseForm()}>
          <Cancel /> Cancel
        </Button>
      </div>
    </>
  );
};

type AdminSecurityObjectDlgProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  onSave: (user: ITechDataSecurityObject) => Promise<string[]>;
  gid: string | number | undefined;
};

const AdminSecurityObjectDlg: React.FC<AdminSecurityObjectDlgProps> = ({
  show,
  setShow,
  onSave,
  gid,
}): ReactElement => {
  const container = useRef();

  return (
    <Portal container={container.current}>
      <FormBuilder propDisplay={show} onChange={setShow}>
        <AdminSecurityObject
          onFormSave={onSave}
          onCloseForm={() => setShow(false)}
          show={show}
          gid={gid}
        />
      </FormBuilder>
    </Portal>
  );
};

export default AdminSecurityObjectDlg;
