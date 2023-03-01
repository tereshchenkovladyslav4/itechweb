import React, { ReactElement, useState, useRef, useEffect } from "react";
import {
  Button,
  Typography,
  Switch,
  Portal,
  Checkbox,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormHelperText,
} from "@mui/material";
import { FormLabel, FormControl, FormGroup, FormControlLabel, TextField } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { ITechDataSecurityObject } from "../Model/iTechRestApi/ITechDataSecurityObject";
import { caseService } from "../_services/caseService";
import { CaseModel } from "../Model/iTechRestApi/CaseModel";
import { CaseSummary } from "../Model/iTechRestApi/CaseSummary";
import { TinyButton } from "../_components/TinyButton";
import { ICaseData } from "../Model/iTechRestApi/ICaseData";
import { capitalize, toSentence } from "../_helpers/utilities";
import { iTechDataCaseEnum } from "../Model/iTechRestApi/iTechDataCaseEnum";
import { loggedInSecurityObject } from "../_helpers/helpers";
import { CaseUser } from "../Model/iTechRestApi/CaseUser";
import { QuerySet } from "../Model/Types/QuerySet";
import { iTechDataCaseSubEnum } from "../Model/iTechRestApi/iTechDataCaseSubEnum";
import { iTechDataCaseStatusEnum } from "../Model/iTechRestApi/iTechDataCaseStatusEnum";
import { useStyles } from "./AddToCaseDlg.styles";
import { trackPromise } from "react-promise-tracker";
import { RefreshTableEvent, trigger, UpdateMenusEvent } from "../_helpers/events";
import { TableEnum } from "../Model/iTechRestApi/TableEnum";
import UserSearch, { SearchDataType } from "../Filter/UserSearch";
import useErrors from "../_helpers/hooks/useErrors";
import BusyButton from "../_components/BusyButton";
import CaseSearch from "./CaseSearch";
import FormBuilder from "../Form/FormBuilder";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import clsx from "clsx";

type AddToCaseProps = {
  onCloseForm: () => void;
  rowIds: number[];
  allChecked: boolean;
  filter?: QuerySet;
  iTechControlTableRowId: number;
};

const AddToCase: React.FC<AddToCaseProps> = ({
  onCloseForm,
  rowIds,
  allChecked,
  filter,
  iTechControlTableRowId,
}) => {
  const [newSet, setNewSet] = useState(true);
  const { hasError, getErrors, setError, clearError, setErrors } = useErrors();
  const [formError, setFormError] = useState<string>("");
  const [caseTypes, setCaseTypes] = useState<number[]>([]);
  const [caseSubTypes, setCaseSubTypes] = useState<number[]>([]);
  const _defaultCaseModel = () => {
    const model = new CaseModel();
    // if (caseTypes.length > 0) model.iTechDataCaseTypeRowId = caseTypes[0];
    // else model.iTechDataCaseTypeRowId = iTechDataCaseEnum.gdpr;
    // if (caseSubTypes.length > 0) model.iTechDataCaseSubTypeRowId = caseSubTypes[0];
    // else model.iTechDataCaseSubTypeRowId = iTechDataCaseSubEnum.art15_Access;
    model.iTechDataCaseStatusTypeRowId = iTechDataCaseStatusEnum.notStarted;
    const investigator = loggedInSecurityObject();
    if (investigator) model.investigatorITechDataSecurityObject = investigator;
    return model;
  };
  const [selectedCase, setSelectedCase] = useState<CaseModel>(_defaultCaseModel());
  const [args, setArgs] = useState({});
  const [alterVal, setAlterVal] = useState({});
  const label = newSet ? "Create new case" : "Add to existing case";
  const classes = useStyles();
  const area = "addToCaseDlg";

  useEffect(() => {
    (async () => {
      await caseService.caseTypes().then((x) => setCaseTypes(x));
      await caseService.caseSubTypes().then((x) => setCaseSubTypes(x));
    })();
  }, []);

  useEffect(() => {
    setSelectedCase((prev) => ({
      ...prev,
      iTechDataCaseTypeRowId: caseTypes[0],
    }));
  }, [caseTypes]);

  useEffect(() => {
    setSelectedCase((prev) => ({
      ...prev,
      iTechDataCaseSubTypeRowId: caseSubTypes[0],
    }));
  }, [caseSubTypes]);

  const informationTypes = [
    { abb: "info.account", description: "Account notations" },
    { abb: "info.application", description: "Copy of application" },
    { abb: "info.statement", description: "Statements" },
    { abb: "info.terms", description: "Terms & Conditions" },
    { abb: "info.correspondence", description: "Written correspondence" },
  ];

  const productTypes = [
    { abb: "product.creditcard", description: "Credit Cards" },
    { abb: "product.storecard", description: "Store Cards" },
    { abb: "product.personalloans", description: "Personal Loans" },
    { abb: "product.currentaccount", description: "Current Account" },
  ];

  const _setSelectedCase = (selected: CaseSummary) => {
    (async () => {
      if (selected?.rowId) {
        const result = await trackPromise(caseService.get(selected.rowId), area);
        setSelectedCase(result);
      }
    })();
  };

  const saveToCase = () => {
    const myCase = selectedCase;
    myCase.args = JSON.stringify(args);

    const caseData = {
      techDataCase: myCase,
      files: {
        rowIds: rowIds,
        allChecked: allChecked,
        filter: filter,
        iTechControlTableRowId: iTechControlTableRowId,
      },
    } as ICaseData;

    function handleError(e: any) {
      if (typeof e === "object") {
        setErrors(e);
      } else {
        // handle simple string error
        setFormError(`An error occurred: (${e})`);
      }
    }

    if (!selectedCase.rowId) {
      (async () => {
        try {
          await trackPromise(caseService.add(caseData), area);
          setSelectedCase(_defaultCaseModel());
          trigger(UpdateMenusEvent);
          trigger(RefreshTableEvent, { dataSource: TableEnum[TableEnum.iTechWebCaseManagement] });
          setErrors({});
          onCloseForm();
        } catch (e) {
          handleError(e);
        }
      })();
    } else {
      (async () => {
        try {
          await trackPromise(caseService.update(selectedCase.rowId, caseData), area);
          setErrors({});
          onCloseForm();
        } catch (e) {
          handleError(e);
        }
      })();
    }
  };

  const _onSubmit = () => {
    let error = false;
    setFormError("");
    setErrors({});
    if (!selectedCase.investigatorITechDataSecurityObject) {
      setError("TechDataCase.InvestigatorITechDataSecurityObject", "Please set a supervisor");
      error = true;
    }
    if (!selectedCase?.name?.length) {
      setError("TechDataCase.Name", "Must enter a case name");
      error = true;
    }
    if (!selectedCase.iTechDataCaseTypeRowId) {
      setError("TechDataCase.ITechDataCaseTypeRowId", "Please set a case type");
      error = true;
    }
    if (!error) {
      saveToCase();
      //setNewSet(false);
    }
  };

  const setValue = (key: keyof CaseModel) => {
    return (e: any) => {
      const val = (
        e.target?.checked !== undefined && e.target.type === "checkbox"
          ? e.target.checked
          : e.target?.value !== undefined
          ? e.target.value
          : e
      ) as never;
      setSelectedCase((prev) => {
        const theCase = { ...prev };
        theCase[key] = val;
        return theCase;
      });
      // Model errors are keyed off the full model name from server..
      clearError("TechDataCase." + capitalize(key));
      setFormError("");
    };
  };

  const setCaseUser = (index: number) => {
    return (val: ITechDataSecurityObject) => {
      if (selectedCase.caseUsers.length > index) {
        setSelectedCase((prev) => {
          const theCase = { ...prev };
          theCase.caseUsers[index].iTechDataSecurityObject = val;
          delete (val as any).$id;
          return theCase;
        });
      }
    };
  };

  const onUserDeleteClick = (index: number) => {
    return () => {
      if (selectedCase.caseUsers.length > index) {
        setSelectedCase((prev) => {
          const theCase = { ...prev };
          theCase.caseUsers.splice(index, 1);
          return theCase;
        });
      }
    };
  };

  const onUserAddClick = () => {
    setSelectedCase((prev) => {
      const theCase = { ...prev };
      if (!theCase.caseUsers) {
        theCase.caseUsers = [];
      }
      const user = new CaseUser();
      user.rowId = 0;
      user.email = "";
      theCase.caseUsers.push(user);
      return theCase;
    });
  };

  const _renderSubjectInput = (
    propName: keyof CaseModel,
    display: string,
    type: string | undefined = undefined
  ) => {
    const caseProp = `TechDataCase.${capitalize(propName)}`;
    const labelProps = type === "date" ? { shrink: true } : undefined;
    return (
      <TextField
        type={type}
        InputLabelProps={labelProps}
        name={propName}
        label={display}
        value={selectedCase[propName] || ""}
        onChange={setValue(propName)}
        error={hasError(caseProp)}
        helperText={getErrors(caseProp)}
        fullWidth
        className={type === "date" ? classes.date : undefined}
        style={{ textTransform: "none" }}
      />
    );
  };

  const _updateArgs = (propName: string, value: any) => {
    setArgs((prev) => ({ ...prev, [propName]: value }));
  };

  const _renderCheckboxes = (types: { abb: string; description: string }[], display: string) => {
    return (
      <FormControl component="fieldset" key={display}>
        <FormLabel component="legend">{display}</FormLabel>
        <FormGroup>
          {types?.map((type) => (
            <FormControlLabel
              value={type.abb}
              control={<Checkbox />}
              label={type.description}
              key={type.abb}
              onChange={(e, checked) => _updateArgs(type.abb, checked)}
            />
          ))}
        </FormGroup>
      </FormControl>
    );
  };

  const _renderArgInput = (propName: keyof typeof alterVal, display: string, rows = 1) => {
    const caseProp = `TechDataCase.${capitalize(propName)}`;
    const _update = (val: string) => {
      _updateArgs(propName, val);
      setAlterVal((prev) => ({ ...prev, propName: val }));
    };
    return (
      <TextField
        name={propName}
        label={display}
        value={alterVal[propName]}
        onChange={(e) => _update(e.target.value)}
        error={hasError(caseProp)}
        helperText={getErrors(caseProp)}
        multiline={rows > 1}
        rows={rows}
        fullWidth
      />
    );
  };

  const CaseDetails = () => {
    return (
      <div className={classes.root}>
        <FormHelperText style={{ marginLeft: 30 }} error={formError?.length > 0}>
          {formError}
        </FormHelperText>
        <div className={clsx(classes.formSection, classes.displayArea, classes.horizontal)}>
          <TextField
            name="name"
            label="Case name"
            required
            value={selectedCase?.name || ""}
            disabled={!newSet}
            onChange={setValue("name")}
            helperText={getErrors("TechDataCase.Name")}
            error={hasError("TechDataCase.Name")}
            style={{ width: "calc(50% - 30px)" }}
          />
          <TextField
            name="casereference"
            label="Reference / Account Number"
            value={selectedCase?.caseReference || ""}
            onChange={setValue("caseReference")}
            style={{ width: "calc(50% - 30px)" }}
            helperText={getErrors("TechDataCase.CaseReference")}
            error={hasError("TechDataCase.CaseReference")}
          />
        </div>
        <div className={classes.formSection}>
          <TextField
            name="summary"
            label="Summary"
            value={selectedCase?.summary || ""}
            onChange={setValue("summary")}
            multiline
            rows={3}
            fullWidth
            helperText={getErrors("TechDataCase.Summary")}
            error={hasError("TechDataCase.Summary")}
          />
        </div>

        <div className={classes.formSection}>
          <div className={clsx(classes.displayArea, classes.horizontal)}>
            {/* <FormLabel component="legend">Status</FormLabel>
            <Select
              value={
                selectedCase.iTechDataCaseStatusTypeRowId?.toString() ??
                iTechDataCaseStatusEnum.notStarted.toString()
              }
              onChange={setValue("iTechDataCaseStatusTypeRowId")}
              style={{ minWidth: "100px" }}
            >
              {Object.keys(iTechDataCaseStatusEnum)
                .filter((x) => isNaN(Number(x)))
                .map((x, i) => (
                  <MenuItem key={i} value={i + 1}>
                    {capitalize(x)}
                  </MenuItem>
                ))}
            </Select> */}
            {caseTypes.length > 1 ||
              (caseSubTypes.length > 1 && <FormLabel component="legend">Type</FormLabel>)}
            {caseTypes.length > 1 && (
              <Select
                value={
                  selectedCase.iTechDataCaseTypeRowId?.toString() ??
                  iTechDataCaseEnum.gdpr.toString()
                }
                onChange={setValue("iTechDataCaseTypeRowId")}
                style={{ minWidth: "100px" }}
                readOnly={!newSet}
                error={hasError("TechDataCase.ITechDataCaseTypeRowId")}
              >
                {Object.keys(iTechDataCaseEnum)
                  .filter((x) => !isNaN(Number(x)))
                  .map((x) => parseInt(x))
                  .filter((x) => caseTypes.includes(x))
                  //.sort((a, b) => a.localeCompare(b)) // default value not working with this
                  .map((x, i) => (
                    <MenuItem key={i} value={x}>
                      {toSentence(iTechDataCaseEnum[x])}
                    </MenuItem>
                  ))}
              </Select>
            )}
            <FormHelperText error={hasError("TechDataCase.ITechDataCaseTypeRowId")}>
              {getErrors("TechDataCase.ITechDataCaseTypeRowId")}
            </FormHelperText>

            {(selectedCase.iTechDataCaseTypeRowId === iTechDataCaseEnum.gdpr ||
              selectedCase.iTechDataCaseTypeRowId === iTechDataCaseEnum.surveillance ||
              selectedCase.iTechDataCaseTypeRowId === iTechDataCaseEnum.internal) &&
            caseSubTypes.length > 1 ? (
              <>
                <FormLabel component="legend">Sub Type</FormLabel>
                <Select
                  value={
                    selectedCase.iTechDataCaseSubTypeRowId?.toString() ??
                    iTechDataCaseSubEnum.suspiciousTradeActivity.toString()
                  }
                  onChange={setValue("iTechDataCaseSubTypeRowId")}
                  style={{ minWidth: "100px" }}
                  readOnly={!newSet}
                  error={hasError("TechDataCase.ITechDataCaseTypeRowId")}
                >
                  {Object.keys(iTechDataCaseSubEnum)
                    .filter((x) => !isNaN(Number(x)))
                    .map((x) => parseInt(x))
                    .filter((x) => caseSubTypes.includes(x))
                    //.sort((a, b) => iTechDataCaseSubEnum[a].localeCompare(iTechDataCaseSubEnum[b]))
                    .map((x, i) => (
                      <MenuItem key={i} value={x}>
                        {toSentence(iTechDataCaseSubEnum[x])}
                      </MenuItem>
                    ))}
                </Select>
              </>
            ) : null}

            <FormControlLabel
              control={
                <Checkbox
                  name="legalHold"
                  checked={selectedCase.legalHold || false}
                  value={selectedCase.legalHold || false}
                  onChange={setValue("legalHold")}
                />
              }
              label="Legal Hold"
            />
          </div>
          {selectedCase?.iTechDataCaseSubTypeRowId !== iTechDataCaseSubEnum.dpia && (
            <div className={clsx(classes.leftPanel, classes.displayArea, classes.vertical)}>
              <FormLabel component="legend" style={{ width: "100%" }}>
                Subject Information
              </FormLabel>
              {_renderSubjectInput("subjectForename", "Forename")}
              {_renderSubjectInput("subjectSurname", "Surname")}
              {_renderSubjectInput("subjectPreviousSurname", "Previous Surname(s)")}
              {_renderSubjectInput("subjectDob", "Date of birth", "date")}
              {_renderSubjectInput("subjectEmail", "Email")}
              {_renderSubjectInput("subjectStreet", "Street")}
              {_renderSubjectInput("subjectCity", "City")}
              {_renderSubjectInput("subjectPostCode", "Postcode")}
              {_renderArgInput("alternativeAddress1" as never, "Alternative Address 1", 3)}
              {_renderArgInput("alternativeAddress2" as never, "Alternative Address 2", 3)}
              {_renderArgInput("alternativeAddress3" as never, "Alternative Address 3", 3)}
              {_renderSubjectInput("subjectPhone", "Main Phone Number")}
              {_renderSubjectInput("subjectMobile", "Mobile Number")}
              {_renderCheckboxes(productTypes, "Product Requests")}
              {_renderCheckboxes(informationTypes, "Information Requests")}
              {_renderArgInput("product.other" as never, "Other Products")}
            </div>
          )}
          <div className={clsx(classes.rightPanel, classes.displayArea)}>
            <FormLabel component="legend" required>
              Supervisor
            </FormLabel>
            <UserSearch
              datatype={SearchDataType.SecurityObject}
              value={
                selectedCase?.investigatorITechDataSecurityObject
                  ? selectedCase.investigatorITechDataSecurityObject
                  : ""
              }
              setValue={setValue("investigatorITechDataSecurityObject")}
              isLogin
              style={{ width: "100%" }}
            />
            <FormHelperText
              style={{ marginBottom: 5 }}
              error={hasError("TechDataCase.InvestigatorITechDataSecurityObject")}
            >
              {getErrors("TechDataCase.InvestigatorITechDataSecurityObject")}
            </FormHelperText>

            <FormLabel component="legend">Additional investigators</FormLabel>
            <div className={classes.caseUsers}>
              {selectedCase?.caseUsers?.map((u, i) => (
                <div key={i} className={classes.user}>
                  <UserSearch
                    key={i}
                    datatype={SearchDataType.SecurityObject}
                    value={u?.iTechDataSecurityObject ? u.iTechDataSecurityObject : ""}
                    setValue={setCaseUser(i)}
                    isLogin
                    style={{ width: "95%", marginTop: 10 }}
                  />
                  <Typography className={classes.buttonText}>Delete</Typography>
                  <TinyButton icon="Remove" onClick={onUserDeleteClick(i)} color="primary" />
                </div>
              ))}
            </div>
            <div>
              <Typography className={classes.buttonText}>Add</Typography>
              <TinyButton icon="Add" onClick={onUserAddClick} color="primary" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <form autoComplete="off">
      <div className={classes.header}>
        <Typography style={{ fontWeight: "bold" }}>Case</Typography>
      </div>
      <div className={classes.formSection}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Create new case or add to existing case?</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={newSet}
                  onChange={(e) => {
                    setNewSet(e.target.checked);
                    if (e.target.checked) setSelectedCase({} as CaseModel);
                  }}
                  name="newSet"
                />
              }
              label={label}
            />
          </FormGroup>
        </FormControl>
      </div>
      {newSet && CaseDetails()}

      {!newSet && (
        <>
          <div className={classes.formSection}>
            <CaseSearch caseService={caseService} setSelectedCase={_setSelectedCase} text="" />
          </div>
          {selectedCase?.name?.length > 0 && (
            <Accordion className={classes.caseDetails}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="case-content"
                id="case-header"
                classes={{ expanded: classes.expanded }}
              >
                <Typography className={classes.accordionHeading}>Case details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* Called this way as either need to define all props and make own component
                    or will cause re-render each time as new local function */}
                {CaseDetails()}
              </AccordionDetails>
            </Accordion>
          )}
        </>
      )}

      <div className={classes.clear}>
        <BusyButton
          className={classes.formButton}
          onClick={_onSubmit}
          area={area}
          startIcon={<CheckCircle />}
        >
          Confirm
        </BusyButton>
        <Button
          className={classes.formButton}
          onClick={() => {
            setErrors({});
            onCloseForm();
            setSelectedCase(_defaultCaseModel());
          }}
          startIcon={<Cancel />}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

type AddToCaseDlgProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  rowIds: number[];
  allChecked: boolean;
  filter?: QuerySet;
  iTechControlTableRowId: number;
};

const AddToCaseDlg: React.FC<AddToCaseDlgProps> = ({
  show,
  setShow,
  rowIds,
  allChecked,
  filter,
  iTechControlTableRowId,
}): ReactElement => {
  const container = useRef();

  return (
    <Portal container={container.current}>
      <FormBuilder propDisplay={show} onChange={setShow}>
        <AddToCase
          onCloseForm={() => setShow(false)}
          allChecked={allChecked}
          rowIds={rowIds}
          filter={filter}
          iTechControlTableRowId={iTechControlTableRowId}
        />
      </FormBuilder>
    </Portal>
  );
};

export default AddToCaseDlg;
