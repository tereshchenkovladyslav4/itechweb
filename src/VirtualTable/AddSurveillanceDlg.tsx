import React, { ReactElement, useState, useRef, useEffect } from "react";
import {
  Button,
  Typography,
  Portal,
  FormLabel,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  IconButton,
  ListItemSecondaryAction,
  Avatar,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { TextField } from "@mui/material";
import { CheckCircle, Cancel, Add, AccountCircle, Delete } from "@mui/icons-material";
import { useStyles } from "./AddSurveillanceDlg.styles";
import { ITechDataTask } from "../Model/iTechRestApi/ITechDataTask";
import { taskService } from "../_services/taskService";
import { removeIds } from "../_helpers/jsonref";
import { SurveillanceRule, SurveillanceTask } from "../Model/iTechRestApi/SurveillanceTask";
import { surveillanceService } from "../_services/surveillanceService";
import { ITechWebSurveillance } from "../Model/iTechRestApi/ITechWebSurveillance";
import { iTechDataRiskEnum } from "../Model/iTechRestApi/iTechDataRiskEnum";
import { toSentence } from "../_helpers/utilities";
import UserSearch, { SearchDataType } from "../Filter/UserSearch";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import KeyTypeDrag from "../KeyType/KeyTypeDrag";
import RuleDisplay from "../KeyType/RuleDisplay";
import LabelSelect from "../_components/LabelSelect";
import FormBuilder from "../Form/FormBuilder";
import clsx from "clsx";
import { iTechDataRiskCategoryEnum } from "../Model/iTechRestApi/iTechDataRiskCategoryEnum";
import { iTechDataScenarioEnum } from "../Model/iTechRestApi/iTechDataScenarioEnum";
import { AdvancedFilterSub } from "../Filter/AdvancedFilter";
import { ITechDataUser } from "../Model/iTechRestApi/ITechDataUser";
import { TinyButton } from "../_components/TinyButton";
import { userService } from "../_services/userService";
import UserTree from "../Tree/UserTree";
import { iTechDataSecurityObjectEnum } from "../Model/iTechRestApi/iTechDataSecurityObjectEnum";
import { SurveillanceTaskExtended } from "../Model/Extended/SurveillanceTaskExtended";
import { useStore } from "../_context/Store";

type AddSurveillanceProps = {
  onFormSave: (surveillance: SurveillanceTaskExtended) => void;
  onCloseForm: () => void;
  show: boolean;
  gid?: string | number;
};

const AddSurveillance: React.FC<AddSurveillanceProps> = ({
  onFormSave,
  onCloseForm,
  show,
  gid,
}) => {
  const { selectors } = useStore();
  const classes = useStyles();
  const isMounted = useIsMounted();
  const _defaultSurveillance = (): SurveillanceTaskExtended => {
    const defaultTask = {
      rowId: 0,
      name: "",
      description: "",
      comments: "",
      threshold: 4,
      isOrdered: true,
      rules: [],
      workflow: [],
      users: [],
      filterJSON: "",
      filterCount: 0,
      filters: {},
      iTechDataRiskTypeRowId: 1,
      iTechDataRiskCategoryTypeRowId: 2,
      iTechDataScenarioTypeRowId: 102,
      disabled: false,
    } as SurveillanceTaskExtended;

    if (workflow.length > 0) defaultTask.workflow.push(workflow[0]);
    return defaultTask;
  };
  const workflowMock = [
    "Financial Crime",
    "Business Conduct",
    "Conflicts of Interest",
    "Customer Complaints",
    "Employee Conduct",
    "Human Resources",
    "Information Barrier",
    "Information Security",
    "Market Conduct",
    "Material Non-Public Info",
    "Other",
    "Risk Insight",
    "Sales Practice",
  ];
  const [workflow, setWorkflow] = useState<ITechDataTask[]>(
    workflowMock.map(
      (x, i) =>
        ({
          rowId: i,
          taskName: x,
        } as ITechDataTask)
    )
  );
  const [currentRule, setCurrentRule] = useState<ITechWebSurveillance | undefined>();
  const [surveillance, setSurveillance] = useState<SurveillanceTaskExtended>(
    _defaultSurveillance()
  );
  const [currentFilterSet, setCurrentFilterSet] = useState<any>({});
  const [currentUser, setCurrentUser] = useState<ITechDataUser | undefined>();
  const [errorText, setErrorText] = useState("");

  const _onSubmit = () => {
    if (surveillance.name?.length > 0) {
      // if (_filterCount() == 0 && surveillance.users.length === 0) {
      //   setErrorText("No rule criteria");
      //   return;
      // }

      const submitData = { ...surveillance };
      if (_filterCount() == 0) submitData.filters = {};
      else {
        submitData.filters = currentFilterSet;
        submitData.filterCount = _filterCount();
      }
      removeIds(submitData);
      //submitData.workflow = [];
      onFormSave(submitData);
      setSurveillance(_defaultSurveillance());
      setErrorText("");
    } else {
      setErrorText("Need valid name");
    }
  };

  useEffect(() => {
    if (!show) return;

    if (gid === undefined) setSurveillance(_defaultSurveillance());
    else _load(gid);

    setErrorText("");
  }, [show]);

  useEffect(() => {
    if (gid === undefined) return;

    _load(gid);
  }, [gid]);

  const _load = (gid: string | number) => {
    (async () => {
      const surv = (await surveillanceService.get(gid)) as SurveillanceTaskExtended;
      if (surv.filterJSON != undefined && surv.filterJSON.length > 2) {
        surv.filters = JSON.parse(surv.filterJSON);
        setCurrentFilterSet(surv.filters);
      }
      setSurveillance(surv);
    })();
  };

  useEffect(() => {
    if (!isMounted()) return;
    (async () => {
      const data = await taskService.getTemplates();

      if (data?.length > 0) {
        data.map((f) => (f.hierarchy = null)); // heirarchy object causes API JSON parsing errors
        setWorkflow(data);
        setSurveillance((prev) => ({ ...prev, workflow: [data[0]] }));
      }
    })();
  }, []);

  const setValue = (key: keyof SurveillanceTask) => {
    return (e: any) => {
      const val = (
        e.target?.checked !== undefined && e.target.type === "checkbox"
          ? e.target.checked
          : e.target?.value !== undefined
          ? e.target.value
          : e
      ) as never;

      setSurveillance((prev) => {
        const surv = { ...prev };
        surv[key] = val;
        return surv;
      });
    };
  };

  const _updateWorkflow = (value: any) => {
    const task = workflow?.find((t) => t.rowId === value);
    if (task) setSurveillance((prev) => ({ ...prev, workflow: [task] }));
  };

  const _addRule = () => {
    if (!currentRule) return;
    const surv = surveillance;
    const newRule = {
      ...currentRule,
      index: surv.rules?.length ?? 0,
      score: 0,
    } as unknown as SurveillanceRule;
    surv.rules.push(newRule);
    setSurveillance(surv);
    setCurrentRule(undefined);
  };

  const _setRules = (updates: any) => {
    setSurveillance((surv) => ({
      ...surv,
      rules: updates,
    }));
  };

  const _addUser = () => {
    if (!currentUser) return;
    const surv = surveillance;
    surv.users.push(currentUser);
    setSurveillance(surv);
    setCurrentUser(undefined);
  };

  const _removeUser = (rowId: number) => {
    setSurveillance((prev) => ({ ...prev, users: prev.users.filter((u) => u.rowId !== rowId) }));
  };

  const _onAddUser = (node: any) => {
    if (node.expressions?.length === 0 || node.expressions[0].filters?.length === 0) return;

    const expressions = node.expressions;
    const userId = expressions[expressions.length - 1].filters[0].value.rowId;
    userService.get(userId).then((user) => {
      setSurveillance((prev) => ({ ...prev, users: [...prev.users, user] }));
    });
  };

  const _userButton = (node: any) => {
    if (node.expressions?.length === 0) return <></>;

    return (
      <TinyButton
        icon="Add"
        style={{ height: 16, width: 16, marginTop: -3 }}
        onClick={() => _onAddUser(node)}
      />
    );
  };

  const _renderUsers = () => {
    return (
      <>
        {/* <UserSearch
          datatype={SearchDataType.User}
          value={currentUser ? currentUser : ""}
          setValue={setCurrentUser}
          isLogin
          style={{ width: "100%" }}
        />
        <Button className={classes.autocompleteButton} onClick={_addUser}>
          <Add /> Add
        </Button> */}
        <UserTree userButton={_userButton} />
        <Grid item xs={12} md={6}>
          <List dense>
            {surveillance.users?.map((user, i) => {
              const displayName =
                user.iTechDataSecurityObjectTypeRowId === iTechDataSecurityObjectEnum.group
                  ? user.displayName
                  : `${user.forename} ${user.surname}`;
              return (
                <ListItem key={i} classes={{ root: classes.listItem }}>
                  <ListItemAvatar>
                    <Avatar>
                      <AccountCircle />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={displayName} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => _removeUser(user.rowId)}
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

  const _renderCurrentRule = () => {
    return (
      <>
        <UserSearch
          datatype={SearchDataType.Rule}
          value={currentRule ? currentRule : ""}
          setValue={setCurrentRule}
          isLogin
          style={{ width: "100%" }}
        />
        <Button onClick={_addRule} className={classes.addUser}>
          <Add /> Add
        </Button>
      </>
    );
  };

  const _removeRule = (item: SurveillanceRule) => () => {
    setSurveillance((surv) => ({
      ...surv,
      rules: surv.rules.filter((r) => r !== item),
    }));
  };

  const _setScore = (index: number) => (value: number) => {
    setSurveillance((surv) => ({
      ...surv,
      rules: surv.rules.map((r, i) => ({ ...r, score: i === index ? value : r.score })),
    }));
  };

  const _ruleDisplay = (provided: any, snapshot: any, item: any, updateItem: any) => (
    <RuleDisplay provided={provided} snapshot={snapshot} item={item} updateItem={updateItem} />
  );

  const _filterCount = () => {
    if (currentFilterSet?.dataSources == null) return 0;
    return currentFilterSet?.dataSources[0].filters.filter((f: any) => f.value).length;
  };

  return (
    <>
      <div className="formSection">
        <Typography variant="h4">Create Surveillance</Typography>
      </div>
      <div className="formSection">
        <div className={clsx(classes.displayArea, classes.horizontal)}>
          <TextField
            name="name"
            label="Name"
            value={surveillance.name ?? ""}
            onChange={setValue("name")}
            helperText={errorText}
            error={errorText.length > 0}
            className={classes.name}
          />

          <LabelSelect
            value={surveillance?.workflow?.length > 0 ? surveillance?.workflow[0].rowId : ""}
            onChange={(e) => _updateWorkflow(e.target.value)}
            style={{ minWidth: "100px" }}
            className={classes.workflow}
            label="Workflow"
          >
            {workflow?.map((w) => (
              <MenuItem value={w.rowId} key={w.rowId}>
                {w.taskName}
              </MenuItem>
            ))}
          </LabelSelect>

          {surveillance.rowId !== 0 && (
            <FormControlLabel
              key="disabled"
              control={<Checkbox checked={surveillance.disabled === true} />}
              label="Disabled"
              onChange={() =>
                setSurveillance((prev) => ({ ...surveillance, disabled: !prev.disabled }))
              }
              className={classes.disabled}
            />
          )}
        </div>

        <div className={classes.horizontal}>
          <TextField
            name="name"
            label="Description"
            value={surveillance.description ?? ""}
            onChange={setValue("description")}
            className={classes.name}
            multiline
            rows={4}
          />

          <TextField
            name="name"
            label="Comments"
            value={surveillance.comments ?? ""}
            onChange={setValue("comments")}
            className={classes.name}
            multiline
            rows={4}
          />
        </div>

        <div className={clsx(classes.displayArea, classes.horizontal)}>
          <FormControlLabel
            control={
              <Checkbox
                name="isOrdered"
                checked={surveillance.isOrdered ?? undefined}
                value={surveillance.isOrdered ?? undefined}
                onChange={setValue("isOrdered")}
              />
            }
            label="Process rules in order?"
          />

          <FormLabel component="legend">Threshold</FormLabel>
          <TextField
            name="threshold"
            label="Score"
            type="number"
            value={surveillance.threshold ?? 4}
            onChange={(e) =>
              setSurveillance((prev) => ({ ...prev, threshold: parseInt(e.target.value) }))
            }
            className={classes.score}
          />

          <LabelSelect
            value={surveillance?.iTechDataRiskTypeRowId ?? 1}
            onChange={setValue("iTechDataRiskTypeRowId")}
            style={{ minWidth: "100px" }}
            className={classes.workflow}
            label="Risk Level"
          >
            {Object.values(iTechDataRiskEnum)
              .filter((value) => typeof value !== "string")
              .map((x) => (
                <MenuItem value={x} key={x}>
                  {toSentence(iTechDataRiskEnum[x as number].toString())}
                </MenuItem>
              ))}
          </LabelSelect>

          <LabelSelect
            value={surveillance?.iTechDataRiskCategoryTypeRowId ?? 1}
            onChange={setValue("iTechDataRiskCategoryTypeRowId")}
            style={{ minWidth: "100px" }}
            className={classes.workflow}
            label="Category"
          >
            {Object.values(iTechDataRiskCategoryEnum)
              .filter((value) => typeof value !== "string")
              .map((x) => (
                <MenuItem value={x} key={x}>
                  {toSentence(iTechDataRiskCategoryEnum[x as number].toString())}
                </MenuItem>
              ))}
          </LabelSelect>

          <LabelSelect
            value={surveillance?.iTechDataScenarioTypeRowId ?? 1}
            onChange={setValue("iTechDataScenarioTypeRowId")}
            style={{ minWidth: "100px" }}
            className={classes.workflow}
            label="Scenario"
          >
            {Object.values(iTechDataScenarioEnum)
              .filter((value) => typeof value !== "string")
              .map((x) => (
                <MenuItem value={x} key={x}>
                  {toSentence(iTechDataScenarioEnum[x as number].toString())}
                </MenuItem>
              ))}
          </LabelSelect>
        </div>

        <Accordion className={classes.accordion} defaultExpanded={false}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="accordion-content"
            id="accordion-header"
            classes={{ expanded: classes.expanded }}
          >
            <Typography
              className={classes.accordionHeading}
            >{`Manage Users (${surveillance.users.length})`}</Typography>
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
        </Accordion>

        <div className={clsx(classes.displayArea)}>{_renderCurrentRule()}</div>

        {surveillance?.rules?.length > 0 && (
          <div className={clsx(classes.displayArea)}>
            <KeyTypeDrag
              items={surveillance.rules.map((r, i) => ({
                ...r,
                id: r.rowId.toString(),
                index: r.index,
                description: `${r.name} [${r.filterCount} Filters ${r.userCount ?? 0} Users]`,
                score: r.score ?? 1,
                setScore: _setScore(i),
                display: _ruleDisplay,
                delete: _removeRule(r),
              }))}
              setItems={_setRules}
            />
          </div>
        )}
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

type AddSurveillanceDlgProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  onSave: (surveillance: SurveillanceTaskExtended) => void;
  gid?: string | number;
};

const AddSurveillanceDlg: React.FC<AddSurveillanceDlgProps> = ({
  show,
  setShow,
  onSave,
  gid,
}): ReactElement => {
  const container = useRef();

  return (
    <Portal container={container.current}>
      <FormBuilder propDisplay={show} onChange={setShow}>
        <AddSurveillance
          onFormSave={onSave}
          onCloseForm={() => setShow(false)}
          show={show}
          gid={gid}
        />
      </FormBuilder>
    </Portal>
  );
};

export default AddSurveillanceDlg;
