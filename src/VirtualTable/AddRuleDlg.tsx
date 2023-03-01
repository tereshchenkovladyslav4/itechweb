import React, { ReactElement, useState, useRef, useEffect } from "react";
import {
  Button,
  Typography,
  Portal,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  List,
  ListItem,
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  FormLabel,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  TextField,
} from "@mui/material";
import { CheckCircle, Cancel, Delete, AccountCircle } from "@mui/icons-material";
import FormBuilder from "../Form/FormBuilder";
import { useStyles } from "./GeneralDlg.styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AdvancedFilterSub } from "../Filter/AdvancedFilter";
import { useStore } from "../_context/Store";
import { RuleTaskExtended } from "../Model/Extended/RuleTaskExtended";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import { ITechDataTask } from "../Model/iTechRestApi/ITechDataTask";
import { taskService } from "../_services/taskService";
import { removeIds } from "../_helpers/jsonref";
import { ruleService } from "../_services/ruleService";
import { iTechDataPriorityEnum } from "../Model/iTechRestApi/iTechDataPriorityEnum";
import Intellisense from "../Intelliesense/Intellisense";
import { lexiconService } from "../_services/lexiconService";
import { iTechDataRulePartEnum } from "../Model/iTechRestApi/iTechDataRulePartEnum";
import { capitalize, isJson } from "../_helpers/utilities";
import { ITechDataRulePartType } from "../Model/iTechRestApi/ITechDataRulePartType";
import { iTechDataRuleEnum } from "../Model/iTechRestApi/iTechDataRuleEnum";
import LabelSelect from "../_components/LabelSelect";
import UserTree from "../Tree/UserTree";
import { userService } from "../_services/userService";
import { TinyButton } from "../_components/TinyButton";
import { iTechDataSecurityObjectEnum } from "../Model/iTechRestApi/iTechDataSecurityObjectEnum";

type AddRuleProps = {
  onFormSave: (rule: RuleTaskExtended) => void;
  onCloseForm: () => void;
  show: boolean;
  gid?: string | number;
};

const AddRule: React.FC<AddRuleProps> = ({ onFormSave, onCloseForm, show, gid }) => {
  const classes = useStyles();
  //const { selectors } = useStore();
  const isMounted = useIsMounted();
  const _defaultRule = (): RuleTaskExtended => {
    const defaultTask = {
      rowId: 0,
      name: "",
      users: [],
      filterJSON: "",
      filterCount: 0,
      filters: {},
      json: "",
      workflow: [],
      ruleType: "",
      disabled: false,
      iTechDataRuleTypeRowId: iTechDataRuleEnum.indicator,
      priority: iTechDataPriorityEnum.urgent,
      parts: Object.values(iTechDataRulePartEnum)
        .filter((value) => typeof value !== "string")
        .map((x) => ({ rowId: x } as ITechDataRulePartType)),
    } as RuleTaskExtended;

    if (workflow.length > 0) defaultTask.workflow.push(workflow[0]);
    return defaultTask;
  };
  //const [currentUser, setCurrentUser] = useState<ITechDataUser | undefined>();
  //const [currentTerm, setCurrentTerm] = useState<ITechDataTerm | undefined>();
  //const [currentFilterSet, setCurrentFilterSet] = useState<any>({});
  const [workflow, setWorkflow] = useState<ITechDataTask[]>([]);
  const [rule, setRule] = useState<RuleTaskExtended>(_defaultRule());
  const [errorText, setErrorText] = useState("");

  const _onSubmit = () => {
    // if (_filterCount() == 0 && rule.users.length === 0 && rule.json.length === 0) {
    //   setErrorText("No rule criteria");
    //   return;
    // }

    if (rule.json?.length > 0) {
      const submitData = { ...rule };
      // if (_filterCount() == 0) submitData.filters = {};
      // else {
      //   submitData.filters = currentFilterSet;
      //   submitData.filterCount = _filterCount();
      // }

      removeIds(submitData);
      onFormSave(submitData);
      setRule(_defaultRule());
      setErrorText("");
    } else {
      setErrorText("Need valid name");
    }
  };

  useEffect(() => {
    if (!show) {
      setRule(_defaultRule());
      return;
    }

    if (gid === undefined) setRule(_defaultRule());
    else _load(gid);

    setErrorText("");
  }, [show]);

  useEffect(() => {
    if (gid === undefined) return;

    _load(gid);
  }, [gid]);

  const _load = (gid: string | number) => {
    (async () => {
      const ruleTask = (await ruleService.get(gid)) as RuleTaskExtended;
      // if (ruleTask.filterJSON != undefined && ruleTask.filterJSON.length > 2) {
      //   ruleTask.filters = JSON.parse(ruleTask.filterJSON);
      //   setCurrentFilterSet(ruleTask.filters);
      // }
      setRule(ruleTask);
    })();
  };

  useEffect(() => {
    if (!isMounted()) return;
    (async () => {
      const data = await taskService.getTemplates();

      if (data) {
        data.map((f) => (f.hierarchy = null)); // heirarchy object causes API JSON parsing errors
        setWorkflow(data);
        setRule((prev) => ({ ...prev, workflow: [data[0]] }));
      }
    })();
  }, []);

  const setValue = (key: keyof RuleTaskExtended) => {
    return (e: any) => {
      const val = (
        e.target?.checked !== undefined && e.target.type === "checkbox"
          ? e.target.checked
          : e.target?.value !== undefined
          ? e.target.value
          : e
      ) as never;
      setRule((prev) => {
        const surv = { ...prev };
        surv[key] = val;
        return surv;
      });
    };
  };

  // const _addTerm = () => {
  //   if (!currentTerm) return;
  //   const surv = rule;
  //   surv.terms.push(currentTerm);
  //   setRule(surv);
  //   setCurrentTerm(undefined);
  // };

  // const _updateWorkflow = (value: any) => {
  //   const task = workflow?.find((t) => t.rowId === value);
  //   if (task) setSurveillance((prev) => ({ ...prev, workflow: [task] }));
  // };

  // const _removeUser = (rowId: number) => {
  //   setRule((prev) => ({ ...prev, users: prev.users.filter((u) => u.rowId !== rowId) }));
  // };

  // const _removeTerm = (rowId: number) => {
  //   setRule((prev) => ({ ...prev, terms: prev.terms.filter((t) => t.rowId !== rowId) }));
  // };

  // const _addUser = () => {
  //   if (!currentUser) return;
  //   const surv = rule;
  //   surv.users.push(currentUser);
  //   setRule(surv);
  //   setCurrentUser(undefined);
  // };

  // const _onAddUser = (node: any) => {
  //   if (node.expressions?.length === 0 || node.expressions[0].filters?.length === 0) return;

  //   const expressions = node.expressions;
  //   const userId = expressions[expressions.length - 1].filters[0].value.rowId;
  //   userService.get(userId).then((user) => {
  //     setRule((prev) => ({ ...prev, users: [...prev.users, user] }));
  //   });
  // };

  // const _userButton = (node: any) => {
  //   if (node.expressions?.length === 0) return <></>;

  //   return (
  //     <TinyButton
  //       icon="Add"
  //       style={{ height: 16, width: 16, marginTop: -3 }}
  //       onClick={() => _onAddUser(node)}
  //     />
  //   );
  // };

  // const _renderUsers = () => {
  //   return (
  //     <>
  //       <UserSearch
  //       datatype={SearchDataType.User}
  //       value={currentUser ? currentUser : ""}
  //       setValue={setCurrentUser}
  //       isLogin
  //       style={{ width: "100%" }}
  //     />
  //     <Button className={classes.autocompleteButton} onClick={_addUser}>
  //       <Add /> Add
  //     </Button>
  //       <UserTree userButton={_userButton} />
  //       <Grid item xs={12} md={6}>
  //         <List dense>
  //           {rule.users?.map((user, i) => {
  //             const displayName =
  //               user.iTechDataSecurityObjectTypeRowId === iTechDataSecurityObjectEnum.group
  //                 ? user.displayName
  //                 : `${user.forename} ${user.surname}`;
  //             return (
  //               <ListItem key={i} classes={{ root: classes.listItem }}>
  //                 <ListItemAvatar>
  //                   <Avatar>
  //                     <AccountCircle />
  //                   </Avatar>
  //                 </ListItemAvatar>
  //                 <ListItemText primary={displayName} />
  //                 <ListItemSecondaryAction>
  //                   <IconButton
  //                     edge="end"
  //                     aria-label="delete"
  //                     onClick={() => _removeUser(user.rowId)}
  //                     size="large"
  //                   >
  //                     <Delete />
  //                   </IconButton>
  //                 </ListItemSecondaryAction>
  //               </ListItem>
  //             );
  //           })}
  //         </List>
  //       </Grid>
  //     </>
  //   );
  // };

  // const _renderTerms = () => {
  //   return (
  //     <>
  //       <UserSearch
  //         datatype={0}
  //         value={currentTerm ? currentTerm : ""}
  //         setValue={setCurrentTerm}
  //         isLogin
  //         style={{ width: "100%" }}
  //       />
  //       <Button variant="contained" color="primary" onClick={_addTerm}>
  //         <Add /> Add
  //       </Button>
  //       <Grid item xs={12} md={6}>
  //         <List dense>
  //           {rule.terms?.map((term) => {
  //             return (
  //               <ListItem key={term.rowId} classes={{ root: classes.listItem }}>
  //                 <ListItemAvatar>
  //                   <Avatar>
  //                     <FormatSize />
  //                   </Avatar>
  //                 </ListItemAvatar>
  //                 <ListItemText primary={term.term} />
  //                 <ListItemSecondaryAction>
  //                   <IconButton
  //                     edge="end"
  //                     aria-label="delete"
  //                     onClick={() => _removeTerm(term.rowId)}
  //                   >
  //                     <Delete />
  //                   </IconButton>
  //                 </ListItemSecondaryAction>
  //               </ListItem>
  //             );
  //           })}
  //         </List>
  //       </Grid>
  //     </>
  //   );
  // };

  // const _filterCount = () => {
  //   if (currentFilterSet?.dataSources == null) return 0;
  //   return currentFilterSet?.dataSources[0].filters.filter((f: any) => f.value).length;
  // };

  const _updatePart = (rowId: number) => () => {
    const existing = rule.parts.find((x) => x.rowId === rowId);
    const abb = iTechDataRulePartEnum[rowId as number].toString();
    setRule((prev) => ({
      ...rule,
      parts:
        existing !== undefined
          ? prev.parts.filter((x) => x.rowId !== existing.rowId)
          : [...prev.parts, { rowId: rowId, abb: abb } as ITechDataRulePartType],
    }));
  };

  return (
    <>
      <div className="formSection">
        <Typography variant="h4">Rule</Typography>
      </div>
      <div className="formSection">
        <div className={classes.displayArea}>
          {/* <div className={classes.horizontal}>
            <FormLabel component="legend">Rule</FormLabel>
            <TextField
              name="name"
              label="Name"
              value={rule.name ?? ""}
              onChange={setValue("name")}
              helperText={errorText}
              error={errorText.length > 0}
              className={classes.name}
            />
          </div> */}
          <div style={{ margin: 6 }}>
            <FormLabel>Create</FormLabel>
          </div>
          <div className={classes.horizontal}>
            {rule.json && !isJson(rule.json) && (
              <TextField
                name="json"
                label="Query"
                value={rule.json ?? ""}
                onChange={setValue("json")}
                helperText={errorText}
                error={errorText.length > 0}
                className={classes.name}
              />
            )}

            {/* only render this when actually showing the dialog - this way its dismounted and clears state when dialog closes */}
            {show && (!rule.json || isJson(rule.json)) && (
              <Intellisense
                autocompleteService={lexiconService}
                json={rule.json}
                setJson={setValue("json")}
                setName={setValue("name")}
              />
            )}
            <FormHelperText error={errorText?.length > 0}>{errorText}</FormHelperText>
          </div>
          <div className={classes.horizontal}>
            <FormGroup className={classes.horizontal}>
              <FormControlLabel
                key="disabled"
                control={<Checkbox checked={rule.disabled === true} />}
                label="Disabled"
                onChange={() => setRule((prev) => ({ ...rule, disabled: !prev.disabled }))}
                className={classes.disabled}
              />
              {Object.values(iTechDataRulePartEnum)
                .filter((value) => typeof value !== "string")
                .map((x) => (
                  <FormControlLabel
                    key={x}
                    control={<Checkbox checked={rule.parts.findIndex((e) => e.rowId === x) >= 0} />}
                    label={capitalize(iTechDataRulePartEnum[x as number].toString())}
                    onChange={_updatePart(x as number)}
                  />
                ))}
            </FormGroup>
            <LabelSelect
              value={rule.iTechDataRuleTypeRowId}
              onChange={setValue("iTechDataRuleTypeRowId")}
              style={{ minWidth: "100px" }}
              label="Rule Type"
            >
              {Object.values(iTechDataRuleEnum)
                .filter((value) => typeof value !== "string")
                .map((x) => (
                  <MenuItem value={x} key={x}>
                    {capitalize(iTechDataRuleEnum[x as number].toString())}
                  </MenuItem>
                ))}
            </LabelSelect>
          </div>
        </div>

        {/* <Accordion className={classes.accordion} defaultExpanded={false}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="accordion-content"
            id="accordion-header"
            classes={{ expanded: classes.expanded }}
          >
            <Typography
              className={classes.accordionHeading}
            >{`Manage Users (${rule.users.length})`}</Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.accordionDetails }}>
            {_renderUsers()}
          </AccordionDetails>
        </Accordion>

        <Accordion className={classes.accordion} defaultExpanded={false}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="accordion-content"
            id="accordion-header"
            classes={{ expanded: classes.expanded }}
          >
            <Typography
              className={classes.accordionHeading}
            >{`Manage Filters (${_filterCount()})`}</Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.accordionDetails }}>
            <AdvancedFilterSub
              data={{}}
              area={"surveillance"}
              tabId={selectors.getSelectedTabId() || 0}
              currentFilterSet={currentFilterSet}
              setCurrentFilterSet={setCurrentFilterSet}
              loaded={show}
            />
          </AccordionDetails>
        </Accordion> */}

        {/* <Accordion className={classes.accordion} defaultExpanded={false}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="accordion-content"
            id="accordion-header"
            classes={{ expanded: classes.expanded }}
          >
            <Typography className={classes.accordionHeading}>{`Lexicon (${
              rule.terms?.length || 0
            })`}</Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.accordionDetails }}>
            {_renderTerms()}
          </AccordionDetails>
        </Accordion> */}
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

type AddRuleDlgProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  onSave: (rule: RuleTaskExtended) => void;
  gid?: string | number;
};

const AddRuleDlg: React.FC<AddRuleDlgProps> = ({ show, setShow, onSave, gid }): ReactElement => {
  const container = useRef();

  return (
    <Portal container={container.current}>
      <FormBuilder propDisplay={show} onChange={setShow}>
        <AddRule onFormSave={onSave} onCloseForm={() => setShow(false)} show={show} gid={gid} />
      </FormBuilder>
    </Portal>
  );
};

export default AddRuleDlg;
