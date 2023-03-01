import React, { ReactElement, useState, useRef, useEffect } from "react";
import {
  Button,
  Typography,
  Portal,
  Grid,
  List,
  ListItem,
  IconButton,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  FormLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { CheckCircle, Cancel, Add, Delete, HighlightOff } from "@mui/icons-material";
import { useStyles } from "./GeneralDlg.styles";
import { LexiconGroup } from "../Model/iTechRestApi/LexiconGroup";
import { iTechDataRiskEnum } from "../Model/iTechRestApi/iTechDataRiskEnum";
import { ITechWebLexicon } from "../Model/iTechRestApi/ITechWebLexicon";
import { lexiconGroupService } from "../_services/lexiconGroupService";
import { Alert } from '@mui/material';
import { loggedInSecurityObject } from "../_helpers/helpers";
import UserSearch, { SearchDataType } from "../Filter/UserSearch";
import FormBuilder from "../Form/FormBuilder";
import { iTechDataRiskCategoryEnum } from "../Model/iTechRestApi/iTechDataRiskCategoryEnum";
import { toSentence } from "../_helpers/utilities";
import { iTechDataScenarioEnum } from "../Model/iTechRestApi/iTechDataScenarioEnum";

type ManageLexiconGroupProps = {
  onFormSave: (group: LexiconGroup) => Promise<void | never>;
  onFormDelete: (groupId: string | number) => Promise<void | never>;
  onRemoveReference: (
    groupId: string | number,
    lexiconId: string | number
  ) => Promise<number | void>;
  onCloseForm: () => void;
  show: boolean;
  gid?: string | number | undefined;
};

const ManageLexiconGroup: React.FC<ManageLexiconGroupProps> = ({
  onFormSave,
  onFormDelete,
  onRemoveReference,
  onCloseForm,
  show,
  gid,
}) => {
  const classes = useStyles();
  const [currentLexicon, setCurrentLexicon] = useState<ITechWebLexicon | undefined>();
  const [lexiconList, setLexiconList] = useState<ITechWebLexicon[]>([]);
  const _buildGroup = () => {
    const group = new LexiconGroup();
    group.iTechDataRiskTypeRowId = iTechDataRiskEnum.veryLow;
    group.name = "";
    group.lexicons = [];
    const owner = loggedInSecurityObject();
    if (owner) group.iTechDataSecurityObject = owner;
    return group;
  };
  const [group, setGroup] = useState<LexiconGroup | undefined>(_buildGroup());
  const [errorText, setErrorText] = useState("");

  const _onSubmit = () => {
    if (group && group?.name?.length > 0) {
      group.lexicons = lexiconList;
      //group.iTechDataSecurityObjectRowId = currentUser?.rowId ? currentUser.rowId : null;
      onFormSave(group).then(
        () => {
          setGroup(_buildGroup());
          setLexiconList([]);
          setErrorText("");
        },
        (error) => setErrorText(error)
      );
    } else {
      setErrorText("Need valid name");
    }
  };

  const _onFormDelete = () => {
    if (!gid) return;

    onFormDelete(gid).then(
      () => {
        setGroup(_buildGroup());
        setLexiconList([]);
        setErrorText("");
      },
      (error) => setErrorText(error)
    );
  };

  const _removeLexicon = async (rowId: number) => {
    if (gid === undefined) {
      const newList = lexiconList.filter((x) => x.rowId !== rowId);
      setLexiconList(newList);
      return;
    }

    await onRemoveReference(gid, rowId).then(
      () => {
        const newList = lexiconList.filter((x) => x.rowId !== rowId);
        setLexiconList(newList);
      },
      (error) => setErrorText(error)
    );
  };

  useEffect(() => {
    setErrorText("");

    if (!show || gid === undefined) {
      setGroup(_buildGroup());
      setLexiconList([]);
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
      await lexiconGroupService.getLexiconGroup(gid).then((result) => {
        setGroup(result);
        setLexiconList(result.lexicons);
      });
    })();
  };

  const _addLexicon = () => {
    if (!currentLexicon) return;
    const list = lexiconList;
    list.push(currentLexicon);
    setLexiconList(list);
    setCurrentLexicon(undefined);
  };

  const _setValue = (key: keyof LexiconGroup) => {
    return (e: any) => {
      const val = (
        e.target?.checked !== undefined && e.target.type === "checkbox"
          ? e.target.checked
          : e.target?.value !== undefined
          ? e.target.value
          : e
      ) as never;
      setGroup((prev) => ({ ...prev, [key]: val } as LexiconGroup));
    };
  };

  const _renderLexicons = () => {
    return (
      <>
        <FormLabel component="legend" className={classes.label}>
          Add Phrases
        </FormLabel>
        <UserSearch
          datatype={SearchDataType.Lexicon}
          value={currentLexicon ? currentLexicon : ""}
          setValue={setCurrentLexicon}
          isLogin={false}
          style={{ width: "100%" }}
        />
        <Button onClick={_addLexicon}>
          <Add /> Add
        </Button>
        <Grid item xs={12} md={10}>
          <List dense>
            {lexiconList?.map((lexicon) => {
              return (
                <ListItem key={lexicon.rowId} classes={{ root: classes.listItem }}>
                  <ListItemText
                    primary={lexicon.phrase}
                    secondary={lexicon.group}
                    className={classes.contrastText}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      size="small"
                      onClick={() => _removeLexicon(lexicon.rowId)}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Grid>
      </>
    );
  };

  return (
    <>
      <div className="formSection">
        <Typography variant="h4">{group?.gid === undefined ? "Create" : "Edit"} Lexicon</Typography>
        {errorText?.length > 0 && <Alert severity="error">{errorText}</Alert>}
      </div>
      <div className={classes.formSection}>
        <TextField
          name="name"
          label="Name"
          value={group?.name ?? ""}
          onChange={_setValue("name")}
          className={classes.name}
        />
        <FormLabel component="legend" className={classes.label}>
          Owner
        </FormLabel>
        <UserSearch
          datatype={SearchDataType.SecurityObject}
          value={group?.iTechDataSecurityObject ? group.iTechDataSecurityObject : ""}
          setValue={_setValue("iTechDataSecurityObject")}
          isLogin
          style={{ width: "100%" }}
        />
        <div className={classes.horizontal}>
          <div className={classes.vertical}>
            <FormLabel component="legend" className={classes.label}>
              Priority
            </FormLabel>
            <Select
              value={
                group?.iTechDataRiskTypeRowId?.toString() ?? iTechDataRiskEnum.veryLow.toString()
              }
              onChange={_setValue("iTechDataRiskTypeRowId")}
              style={{ minWidth: "100px" }}
            >
              {Object.keys(iTechDataRiskEnum)
                .filter((x) => isNaN(Number(x)))
                .map((x, i) => (
                  <MenuItem key={i} value={i + 1}>
                    {toSentence(x)}
                  </MenuItem>
                ))}
            </Select>
          </div>
          <div className={classes.vertical}>
            <FormLabel component="legend" className={classes.label}>
              Category
            </FormLabel>
            <Select
              value={
                group?.iTechDataRiskCategoryTypeRowId?.toString() ??
                iTechDataRiskCategoryEnum.businessConduct.toString()
              }
              onChange={_setValue("iTechDataRiskCategoryTypeRowId")}
              style={{ minWidth: "100px" }}
            >
              {Object.keys(iTechDataRiskCategoryEnum)
                .filter((x) => isNaN(Number(x)))
                .map((x, i) => (
                  <MenuItem key={i} value={i + 1}>
                    {toSentence(x)}
                  </MenuItem>
                ))}
            </Select>
          </div>
          <div className={classes.vertical}>
            <FormLabel component="legend" className={classes.label}>
              Scenario
            </FormLabel>
            <Select
              value={
                group?.iTechDataScenarioTypeRowId?.toString() ??
                iTechDataScenarioEnum.tradeData.toString()
              }
              onChange={_setValue("iTechDataScenarioTypeRowId")}
              style={{ minWidth: "100px" }}
            >
              {Object.keys(iTechDataScenarioEnum)
                .filter((x) => isNaN(Number(x)))
                .map((x, i) => (
                  <MenuItem key={i} value={i + 1}>
                    {toSentence(x)}
                  </MenuItem>
                ))}
            </Select>
          </div>
        </div>
        {_renderLexicons()}
      </div>
      <Button className={classes.formButton} onClick={_onSubmit}>
        <CheckCircle /> Confirm
      </Button>
      {gid && (
        <Button className={classes.formButton} onClick={_onFormDelete}>
          <HighlightOff /> Delete
        </Button>
      )}
      <Button className={classes.formButton} onClick={() => onCloseForm()}>
        <Cancel /> Cancel
      </Button>
    </>
  );
};

type ManageLexiconGroupDlgProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  onSave: (group: LexiconGroup) => Promise<void | never>;
  onDelete: (groupId: string | number) => Promise<void | never>;
  onRemoveReference: (
    groupId: string | number,
    lexiconId: string | number
  ) => Promise<number | void>;
  gid?: string | number | undefined;
};

const ManageLexiconGroupDlg: React.FC<ManageLexiconGroupDlgProps> = ({
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
        <ManageLexiconGroup
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

export default ManageLexiconGroupDlg;
