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
  Switch,
  FormControlLabel,
  DialogContentText,
  Select,
  MenuItem,
  FormLabel,
} from "@mui/material";
import { CheckCircle, Cancel, Add } from "@mui/icons-material";
import { ITechDataUser } from "../Model/iTechRestApi/ITechDataUser";
import { userService } from "../_services/userService";
import { Alert } from "@mui/material";
import { useStyles } from "./GeneralDlg.styles";
import { ITechDataSecurityObject } from "../Model/iTechRestApi/ITechDataSecurityObject";
import FormBuilder from "../Form/FormBuilder";
import clsx from "clsx";
import { securityObjectService } from "../_services/securityObjectService";
import { ITechControlRetentionPolicy } from "../Model/iTechRestApi/ITechControlRetentionPolicy";
import { retentionPolicyService } from "../_services/retentionPolicyService";
import { ITechDataUserIdentifier } from "../Model/iTechRestApi/ITechDataUserIdentifier";
import { TinyButton } from "../_components/TinyButton";
import MultiSelectDropdown from "../Form/MultiSelectDropdown";
import { iTechControlCollectionEnum } from "../Model/iTechRestApi/iTechControlCollectionEnum";
import { getTicks, toSentence } from "../_helpers/utilities";
import { ITechDataUserIdentifierToCollectionType } from "../Model/iTechRestApi/ITechDataUserIdentifierToCollectionType";
import { ITechDataSecurityObjectToRetentionPolicy } from "../Model/iTechRestApi/ITechDataSecurityObjectToRetentionPolicy";
import { ITechDataMembership } from "../Model/iTechRestApi/ITechDataMembership";
import { trackPromise } from "react-promise-tracker";
import BusyButton from "../_components/BusyButton";
import { ITechWebLicensing } from "../Model/iTechRestApi/ITechWebLicensing";
import { licensingService } from "../_services/licensingService";
import { iTechDataLicensingAssociationEnum } from "../Model/iTechRestApi/iTechDataLicensingAssociationEnum";
// import moment, { Moment } from "moment";
// import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";

type AdminUserProps = {
  onFormSave: (user: ITechDataUser) => Promise<string[]>;
  onCloseForm: () => void;
  show: boolean;
  gid: string | number | undefined;
};

const AdminUser: React.FC<AdminUserProps> = ({ onFormSave, onCloseForm, show, gid }) => {
  const classes = useStyles();
  const area = "CollectionUser";
  const _defaultUser = () => {
    const user = new ITechDataUser();
    user.iTechDataUserIdentifiers = [];
    const retention = new ITechDataSecurityObjectToRetentionPolicy();
    retention.iTechControlRetentionPolicyRowId = 1;
    user.iTechDataSecurityObjectToRetentionPolicyRows = [retention];
    user.iTechDataUserIdentifierToCollectionTypeRows = [];
    return user;
  };
  const [user, setUser] = useState<ITechDataUser>(_defaultUser());
  const [groupList, setGroupList] = useState<ITechDataSecurityObject[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | undefined>();
  const [retentionList, setRetentionList] = useState<ITechControlRetentionPolicy[]>([]);
  const [licensing, setLicensing] = useState<ITechWebLicensing[]>([]);
  const [errorText, setErrorText] = useState("");
  const identifierList = user.iTechDataUserIdentifiers;
  //const collectionTypes = Object.keys(iTechControlCollectionEnum).filter((x) => isNaN(Number(x)));
  const userLicensing = licensing.filter(
    (x) =>
      x.iTechDataLicensingAssociationTypeRowId === iTechDataLicensingAssociationEnum.user &&
      !x.isExpired
  );
  const idLicensing = licensing.filter(
    (x) =>
      x.iTechDataLicensingAssociationTypeRowId === iTechDataLicensingAssociationEnum.identifier &&
      !x.isExpired
  );
  //const [schedule, setSchedule] = useState<Moment | null>(moment());

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
      user.iTechDataMembershipRows = [_membership(selectedGroup)];

    trackPromise(
      onFormSave(user).then(
        (results) => {
          if (results.length > 0) {
            setErrorText(results.join(" "));
          } else {
            setGroupList([]);
            setRetentionList([]);
            setErrorText("");
            onCloseForm();
          }
        },
        (error) => setErrorText(error)
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
      await retentionPolicyService
        .getAll()
        .then((results) => setRetentionList(results.filter((x) => x.name != null)));
      await licensingService.getAll().then((results) => setLicensing(results));
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
      await userService.get(parseInt(gid.toString())).then((user) => setUser(user));
    })();
  };

  const _addIdentifier = () => {
    const newId = new ITechDataUserIdentifier();
    newId.iTechDataUserIdentifierToCollectionTypes = [];

    setUser((prev) => ({
      ...prev,
      iTechDataUserIdentifiers: [newId, ...prev.iTechDataUserIdentifiers],
    }));
  };

  const _removeIdentifier = (index: number, remove: boolean) => {
    const id = identifierList[index];
    const archiveDate = remove ? getTicks() : null;
    setUser((prev) => ({
      ...prev,
      iTechDataUserIdentifiers:
        id.rowId != undefined
          ? prev.iTechDataUserIdentifiers.map((x, i) =>
              i === index ? { ...x, dateArchived: archiveDate } : { ...x }
            )
          : prev.iTechDataUserIdentifiers.filter((_, i) => i !== index),
    }));
  };

  const _setIdentifier = (index: number, value: string) => {
    setUser((prev) => ({
      ...prev,
      iTechDataUserIdentifiers: prev.iTechDataUserIdentifiers?.map((id, i) => ({
        ...id,
        identifier: i === index ? value : id.identifier,
      })),
    }));
  };

  // const _setCollectionTypes = (idIndex: number) => (selected: number[]) => {
  //   const types = Object.keys(iTechControlCollectionEnum)
  //     .filter((_, i) => selected.includes(i))
  //     .map((x) => parseInt(x));
  //   const identifier = identifierList[idIndex];
  //   const updatedTypes = [
  //     ...identifier.iTechDataUserIdentifierToCollectionTypes.filter((x) =>
  //       types.includes(x?.iTechControlCollectionTypeRowId ?? -1)
  //     ), // remove not in selected
  //     ...(types
  //       .filter(
  //         (x) =>
  //           !identifier.iTechDataUserIdentifierToCollectionTypes
  //             ?.map((x) => x.iTechControlCollectionTypeRowId)
  //             .includes(x)
  //       )
  //       ?.map(_collectionTypeMap) ?? []), // add missing types
  //   ];

  //   setUser((prev) => ({
  //     ...prev,
  //     iTechDataUserIdentifiers: identifierList.map((id, i) => ({
  //       ...id,
  //       iTechDataUserIdentifierToCollectionTypes:
  //         i === idIndex ? updatedTypes : id.iTechDataUserIdentifierToCollectionTypes,
  //     })),
  //   }));
  // };

  // const _collectionTypeMap = (rowId: number) => {
  //   const ref = new ITechDataUserIdentifierToCollectionType();
  //   ref.iTechControlCollectionTypeRowId = rowId;
  //   return ref;
  // };

  const _setProperty = (propName: keyof ITechDataUser, value: any) => {
    setUser((prev) => ({ ...prev, [propName]: value }));
  };

  const _retention = (retentionId: number): ITechDataSecurityObjectToRetentionPolicy => {
    const retention = new ITechDataSecurityObjectToRetentionPolicy();
    retention.iTechControlRetentionPolicyRowId = retentionId;
    if (user.iTechDataSecurityObjectParentRowId)
      retention.iTechDataSecurityObjectRowId = user.iTechDataSecurityObjectParentRowId;
    return retention;
  };

  const _setRetentionPolicy = (selected: number[]) => {
    const retentions = [...retentionList]
      .filter((_, i) => selected.includes(i))
      .map((x) => _retention(x.rowId));

    setUser((prev) => ({
      ...prev,
      iTechDataSecurityObjectToRetentionPolicyRows: retentions,
    }));
  };

  const _colType = (
    licensingRowId: number,
    idRowId: number | undefined = undefined
  ): ITechDataUserIdentifierToCollectionType => {
    const colType = new ITechDataUserIdentifierToCollectionType();
    colType.iTechDataLicensingRowId = licensingRowId;
    if (user.rowId) colType.iTechDataUserRowId = user.rowId;
    if (idRowId) colType.iTechDataUserIdentifierRowId = idRowId;
    return colType;
  };

  const _setUserLicense = (selected: number[]) => {
    const userLicenses = [...userLicensing]
      .filter((_, i) => selected.includes(i))
      ?.map(
        (x) =>
          user.iTechDataUserIdentifierToCollectionTypeRows.find(
            (y) => y.iTechDataLicensingRowId === x.rowId
          ) ?? _colType(x.rowId)
      );

    setUser((prev) => ({
      ...prev,
      iTechDataUserIdentifierToCollectionTypeRows: userLicenses,
    }));
  };

  const _setIdLicense = (idRowId: number) => (selected: number[]) => {
    const existing =
      user.iTechDataUserIdentifiers.find((x) => x.rowId === idRowId)
        ?.iTechDataUserIdentifierToCollectionTypes ?? [];

    const idLicenses = [...idLicensing]
      .filter((_, i) => selected.includes(i))
      ?.map(
        (x) =>
          existing.find((y) => y.iTechDataLicensingRowId === x.rowId) ?? _colType(x.rowId, idRowId)
      );

    setUser((prev) => ({
      ...prev,
      iTechDataUserIdentifiers: prev.iTechDataUserIdentifiers?.map((id, i) => ({
        ...id,
        iTechDataUserIdentifierToCollectionTypes:
          id.rowId === idRowId ? idLicenses : id.iTechDataUserIdentifierToCollectionTypes,
      })),
    }));
  };

  return (
    <>
      <div className="formSection">
        {errorText && <Alert severity="error">{errorText}</Alert>}
        <Typography variant="h4">{gid ? "Update" : "Create"} Collection User</Typography>
      </div>
      <div className="formSection">
        <Alert severity="info">Please allow some time for changes to take effect</Alert>
        <div className={classes.leftPanel}>
          <TextField
            name="forename"
            label="Forename"
            value={user.forename ?? ""}
            onChange={(e) => _setProperty("forename", e.target.value)}
            className={classes.textField}
            disabled={gid !== undefined}
          />
          <TextField
            name="surname"
            label="Surname"
            value={user.surname ?? ""}
            onChange={(e) => _setProperty("surname", e.target.value)}
            className={classes.textField}
            disabled={gid !== undefined}
          />

          {user.rowId && (
            <FormControlLabel
              control={
                <Switch
                  checked={user.onLegalHold ?? false}
                  onChange={(e) => _setProperty("onLegalHold", e.target.checked)}
                  name="onLegalHold"
                />
              }
              label="Legal Hold"
            />
          )}

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

          {retentionList?.length > 0 && (
            <>
              <FormLabel component="legend">Retention</FormLabel>
              <MultiSelectDropdown
                selected={user.iTechDataSecurityObjectToRetentionPolicyRows.map(
                  (x) => (x?.iTechControlRetentionPolicyRowId ?? 0) - 1
                )}
                setSelected={(x) => _setRetentionPolicy(x)}
                values={retentionList.map((x, i) => ({
                  key: i,
                  value: x?.name ?? "Retention",
                }))}
              />

              {/* <Select
                labelId="retention"
                onChange={(e) => _selectRetentionPolicy(e.target.value as number)}
                value={user.iTechControlRetentionPolicyRowId ?? retentionList[0].rowId}
              >
                {retentionList.map((x) => (
                  <MenuItem value={x.rowId} key={x.rowId}>
                    {x.name}
                  </MenuItem>
                ))}
              </Select> */}
            </>
          )}

          {userLicensing?.length > 0 && (
            <>
              <FormLabel component="legend">Licenses</FormLabel>
              <MultiSelectDropdown
                selected={userLicensing
                  .map((x, i) => ({ ...x, i: i }))
                  .filter((x) =>
                    user.iTechDataUserIdentifierToCollectionTypeRows?.some(
                      (y) => y.iTechDataLicensingRowId === x.rowId
                    )
                  )
                  .map((x) => x.i)}
                setSelected={(x) => _setUserLicense(x)}
                values={userLicensing?.map(
                  (x, i) =>
                    ({
                      key: i,
                      value: `${x?.partNumberDescription} [${x?.quantityPurchased}]`,
                    } ?? [])
                )}
                disabledSelection={userLicensing
                  .map((x, i) => ({ ...x, i: i }))
                  .filter(
                    (x) =>
                      user.iTechDataUserIdentifierToCollectionTypeRows
                        ?.filter((c) => c.rowId !== undefined)
                        .some((y) => y.iTechDataLicensingRowId === x.rowId) || x.isExpired
                  )
                  .map((x) => x.i)}
              />
            </>
          )}
        </div>

        <div className={classes.rightPanel}>
          <Button onClick={_addIdentifier}>
            <Add /> Identifier
          </Button>
          {identifierList?.map((id, i) => {
            return (
              <div
                className={clsx(
                  id.dateArchived ? classes.archived : classes.active,
                  classes.identifier
                )}
                key={i}
              >
                <div className={classes.idInner}>
                  <TextField
                    name="identifier"
                    label="Identifier"
                    value={id.identifier ?? ""}
                    onChange={(e) => _setIdentifier(i, e.target.value)}
                    className={classes.textField}
                    disabled={id.dateArchived != undefined}
                  />
                  {id.dateArchived != undefined ? (
                    <TinyButton icon="Add" onClick={() => _removeIdentifier(i, false)} />
                  ) : (
                    <TinyButton icon="Remove" onClick={() => _removeIdentifier(i, true)} />
                  )}
                </div>

                {idLicensing?.length > 0 && (
                  <>
                    <FormLabel component="legend">Licenses</FormLabel>
                    <MultiSelectDropdown
                      selected={idLicensing
                        .map((x, i) => ({ ...x, i: i }))
                        .filter((x) =>
                          id.iTechDataUserIdentifierToCollectionTypes?.some(
                            (y) => y.iTechDataLicensingRowId === x.rowId
                          )
                        )
                        .map((x) => x.i)}
                      setSelected={(x) => _setIdLicense(id.rowId)(x)}
                      values={idLicensing?.map(
                        (x, i) =>
                          ({
                            key: i,
                            value: `${x?.partNumberDescription} [${x?.quantityPurchased}]`,
                          } ?? [])
                      )}
                      disabledSelection={idLicensing
                        .map((x, i) => ({ ...x, i: i }))
                        .filter(
                          (x) =>
                            id.iTechDataUserIdentifierToCollectionTypes
                              ?.filter((c) => c.rowId !== undefined)
                              .some((y) => y.iTechDataLicensingRowId === x.rowId) || x.isExpired
                        )
                        .map((x) => x.i)}
                    />
                  </>
                )}
                {/* <MultiSelectDropdown
                  key={i}
                  selected={id.iTechDataUserIdentifierToCollectionTypes.map(
                    (x) => (x?.iTechControlCollectionTypeRowId ?? 0) - 1
                  )}
                  setSelected={_setCollectionTypes(i)}
                  values={collectionTypes.map((x, i) => ({ key: i, value: toSentence(x) }))}
                  disabled={id.dateArchived != undefined}
                /> */}
              </div>
            );
          })}
        </div>
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
      </div>
      <div className={classes.clear} style={{ paddingTop: 10 }}>
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

type AdminUserDlgProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  onSave: (user: ITechDataUser) => Promise<string[]>;
  gid: string | number | undefined;
};

const AdminUserDlg: React.FC<AdminUserDlgProps> = ({
  show,
  setShow,
  onSave,
  gid,
}): ReactElement => {
  const container = useRef();

  return (
    <Portal container={container.current}>
      <FormBuilder propDisplay={show} onChange={setShow} style={{ width: 780 }}>
        <AdminUser onFormSave={onSave} onCloseForm={() => setShow(false)} show={show} gid={gid} />
      </FormBuilder>
    </Portal>
  );
};

export default AdminUserDlg;
