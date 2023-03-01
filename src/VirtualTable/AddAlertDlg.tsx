import React, { ReactElement, useState, useRef, useEffect } from "react";
import { Button, Typography, Portal, Select, MenuItem, FormHelperText } from "@mui/material";
import { FormLabel, TextField } from "@mui/material";
import clsx from "clsx";
import { CheckCircle, Cancel } from "@mui/icons-material";
import FormBuilder from "../Form/FormBuilder";
import UserSearch, { SearchDataType } from "../Filter/UserSearch";
import { ITechDataSecurityObject } from "../Model/iTechRestApi/ITechDataSecurityObject";
import { caseService } from "../_services/caseService";
import { CaseModel } from "../Model/iTechRestApi/CaseModel";
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
import useErrors from "../_helpers/hooks/useErrors";
import BusyButton from "../_components/BusyButton";
import { trackPromise } from "react-promise-tracker";
import { RefreshTableEvent, trigger, UpdateMenusEvent } from "../_helpers/events";
import { TableEnum } from "../Model/iTechRestApi/TableEnum";

type AddAlertProps = {
  onCloseForm: () => void;
  rowIds: number[];
  allChecked: boolean;
  filter?: QuerySet;
  iTechControlTableRowId: number;
};

const AddAlert: React.FC<AddAlertProps> = ({
  onCloseForm,
  rowIds,
  allChecked,
  filter,
  iTechControlTableRowId,
}) => {
  const { hasError, getErrors, setError, clearError, setErrors } = useErrors();
  const [formError, setFormError] = useState<string>("");
  const _defaultCaseType = iTechDataCaseEnum.surveillance;
  const _defaultCaseModel = () => {
    const model = new CaseModel();
    model.iTechDataCaseTypeRowId = _defaultCaseType;
    model.iTechDataCaseStatusTypeRowId = iTechDataCaseStatusEnum.notStarted;
    model.iTechDataCaseSubTypeRowId = iTechDataCaseSubEnum.businessConduct;
    const investigator = loggedInSecurityObject();
    if (investigator) model.investigatorITechDataSecurityObject = investigator;
    return model;
  };
  const _defaultCaseSubTypes: iTechDataCaseSubEnum[] = [];
  const [selectedCase, setSelectedCase] = useState<CaseModel>(_defaultCaseModel());
  const classes = useStyles();
  const area = "addAlertDlg";
  const [caseSubTypes, setCaseSubTypes] = useState<iTechDataCaseSubEnum[]>(_defaultCaseSubTypes);

  useEffect(() => {
    _setCaseSubTypes(_defaultCaseType);
  }, []);

  const saveToCase = () => {
    const caseData = {
      techDataCase: selectedCase,
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
          await trackPromise(caseService.alert(caseData), area);
          setSelectedCase(_defaultCaseModel());
          trigger(UpdateMenusEvent);
          trigger(RefreshTableEvent, { dataSource: TableEnum[TableEnum.iTechWebCaseManagement] });
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
    if (!selectedCase.iTechDataCaseTypeRowId) {
      setError("TechDataCase.ITechDataCaseTypeRowId", "Please set a case type");
      error = true;
    }
    if (!selectedCase.iTechDataCaseSubTypeRowId) {
      setError("TechDataCase.ITechDataCaseSubTypeRowId", "Please set a case subtype");
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

  const _setCaseSubTypes = (caseTypeRowId: number) => {
    (async () => {
      const result = await trackPromise(caseService.getSubTypes(caseTypeRowId), area);
      setCaseSubTypes(result);
    })();
  };

  const CaseDetails = () => {
    return (
      <div className={classes.root}>
        <FormHelperText style={{ marginLeft: 30 }} error={formError?.length > 0}>
          {formError}
        </FormHelperText>
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
          <div className={clsx(classes.displayArea, classes.leftPanel)}>
            <FormLabel component="legend">Type</FormLabel>
            <Select
              value={
                selectedCase.iTechDataCaseTypeRowId?.toString() ??
                iTechDataCaseEnum.surveillance.toString()
              }
              onChange={(e) => {
                setValue("iTechDataCaseTypeRowId")(e);
                _setCaseSubTypes(Number(e.target.value));
              }}
              style={{ minWidth: "100px" }}
              readOnly={false}
              error={hasError("TechDataCase.ITechDataCaseTypeRowId")}
            >
              {Object.keys(iTechDataCaseEnum)
                .filter((x) => isNaN(Number(x)))
                .map((x, i) => (
                  <MenuItem key={i} value={i + 1}>
                    {toSentence(x)}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText error={hasError("TechDataCase.ITechDataCaseTypeRowId")}>
              {getErrors("TechDataCase.ITechDataCaseTypeRowId")}
            </FormHelperText>

            {caseSubTypes.length > 0 ? (
              <>
                <FormLabel component="legend">Sub Type</FormLabel>
                <Select
                  value={
                    selectedCase.iTechDataCaseSubTypeRowId?.toString() ??
                    iTechDataCaseSubEnum.defaultSurveillance.toString()
                  }
                  onChange={setValue("iTechDataCaseSubTypeRowId")}
                  style={{ minWidth: "100px" }}
                  readOnly={false}
                  error={hasError("TechDataCase.ITechDataCaseTypeRowId")}
                >
                  {Object.values(caseSubTypes)
                    .filter((i) => i !== undefined)
                    .map((i) => (
                      <MenuItem key={i} value={i}>
                        {toSentence(iTechDataCaseSubEnum[i]?.toString() ?? "")}
                      </MenuItem>
                    ))}
                </Select>
              </>
            ) : null}
          </div>
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
                  <TinyButton icon="Remove" onClick={onUserDeleteClick(i)} />
                </div>
              ))}
            </div>
            <div>
              <Typography className={classes.buttonText}>Add</Typography>
              <TinyButton icon="Add" onClick={onUserAddClick} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <form autoComplete="off">
      <div className={classes.header}>
        <Typography style={{ fontWeight: "bold" }}>Alert</Typography>
      </div>
      {CaseDetails()}

      <div className={classes.right}>
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
        <BusyButton
          className={classes.formButton}
          onClick={_onSubmit}
          area={area}
          startIcon={<CheckCircle />}
        >
          Confirm
        </BusyButton>
      </div>
    </form>
  );
};

type AddAlertDlgProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  rowIds: number[];
  allChecked: boolean;
  filter?: QuerySet;
  iTechControlTableRowId: number;
};

const AddAlertDlg: React.FC<AddAlertDlgProps> = ({
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
        <AddAlert
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

export default AddAlertDlg;
