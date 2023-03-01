import React, { ReactElement, useState } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { StyledAnonymousForm } from "./_components/AnonymousForm";
import { validateEmail } from "./_helpers/helpers";
import { caseService } from "./_services/caseService";
import { trackPromise } from "react-promise-tracker";
import { ICaseData } from "./Model/iTechRestApi/ICaseData";
import { CaseModel } from "./Model/iTechRestApi/CaseModel";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  InputAdornment,
  Link,
  Radio,
  RadioGroup,
} from "@mui/material";
import useErrors from "./_helpers/hooks/useErrors";
import BusyButton from "./_components/BusyButton";
import { useStyles } from "./GdprPage.styles";
import { Warning } from "@mui/icons-material";
import { Alert } from "@mui/material";

interface formType {
  value: string;
  validation?: Validation[];

  display?: string;
  flavour?: string;
  rows?: number;
  radio?: any[];
  checkbox?: any[];
  isDate?: boolean;
}

enum Validation {
  stringLength = 0,
  isEmail = 1,
}

interface args {
  certify: boolean;
}

const caseSubTypes = [
  { rowId: "1", description: "I’d like to see what data you hold on me - Subject access request" },
  {
    rowId: "2",
    description: "I’d like to correct the data you hold on me - Rectification of data",
  },
  {
    rowId: "3",
    description: "I’d like to be forgotten by your organisation - Deletion of records",
  },
];

const verifyTypes = [
  { rowId: "VERIFY BY EMAIL", description: "Email (fastest)" },
  { rowId: "VERIFY BY TEXT", description: "Text (fast)" },
  { rowId: "VERIFY BY POST", description: "Post (slowest)" },
];

const booleanChoice = [
  { rowId: "1", description: "Yes" },
  { rowId: "0", description: "No" },
];

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

const argProps = [
  "product.other",
  "info.other",
  "alternativeAddress1",
  "alternativeAddress2",
  "alternativeAddress3",
  "verify",
  "certify",
];

const GdprPage: React.FC = (): ReactElement => {
  const classes = useStyles();
  const { hasError, getErrors, setError, clearError, setErrors, hasErrors, getAllErrors } =
    useErrors();

  const _defaultForm = () => {
    const formValues = new Map<string, formType>();
    // field names match server model naming ( server returns model state with these as keys too )
    formValues.set("TechDataCase.ITechDataCaseSubTypeRowId", {
      value: "1",
      validation: [],
    });
    formValues.set("TechDataCase.SubjectForename", {
      value: "",
      validation: [Validation.stringLength],
    });
    formValues.set("TechDataCase.SubjectSurname", {
      value: "",
      validation: [Validation.stringLength],
    });

    formValues.set("TechDataCase.SubjectStreet", {
      value: "",
      validation: [Validation.stringLength],
    });
    formValues.set("TechDataCase.SubjectCity", {
      value: "",
      validation: [Validation.stringLength],
    });
    formValues.set("TechDataCase.SubjectPostCode", {
      value: "",
      validation: [Validation.stringLength],
    });

    formValues.set("alternativeAddress1", {
      value: "",
      validation: [],
    });
    formValues.set("alternativeAddress2", {
      value: "",
      validation: [],
    });
    formValues.set("alternativeAddress3", {
      value: "",
      validation: [],
    });
    // formValues.set("TechDataCase.SubjectPreviousSurname", {
    //   display: "Previous Surname(s)",
    //   flavour: "Where relevant",
    //   value: "",
    //   rows: 1,
    //   validation: [],
    // });
    // formValues.set("TechDataCase.SubjectDob", {
    //   display: "Date of birth *",
    //   flavour: "Required",
    //   value: "",
    //   rows: 1,
    //   validation: [Validation.stringLength],
    //   isDate: true,
    // });
    // formValues.set("TechDataCase.SubjectEmailConfirm", {
    //   display: "Email address",
    //   flavour:
    //     "Where we are able to do so, the information you have requested will be sent to you by email",
    //   value: "1",
    //   validation: [],
    //   radio: booleanChoice,
    // });

    formValues.set("TechDataCase.SubjectEmail", {
      value: "",
      validation: [Validation.stringLength, Validation.isEmail],
    });
    formValues.set("TechDataCase.SubjectPhone", {
      value: "",
      validation: [Validation.stringLength],
    });
    formValues.set("TechDataCase.SubjectMobile", {
      value: "",
      validation: [],
    });

    // formValues.set("TechDataCase.SubjectCountry", {
    //   display: "Country *",
    //   value: "",
    //   rows: 1,
    //   validation: [Validation.stringLength],
    // });
    formValues.set("TechDataCase.CaseReference", {
      value: "",
      validation: [],
    });
    formValues.set("TechDataCase.productTypes", {
      value: "",
      validation: [],
    });
    formValues.set("info.other", {
      value: "",
      validation: [],
    });
    formValues.set("product.other", {
      value: "",
      validation: [],
    });

    formValues.set("verify", {
      value: "VERIFY BY EMAIL",
      validation: [],
    });

    formValues.set("certify", {
      value: "",
      validation: [],
    });
    return formValues;
  };
  const [form, setForm] = useState<Map<string, formType>>(_defaultForm());
  const [response, setResponse] = useState("");
  const [args, setArgs] = useState<args>({ certify: false });
  const [previousAddress, setPreviousAddress] = useState<number>(0);
  const [anotherPhone, setAnotherPhone] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState(""); // Form level error message
  const loadingArea = "gdpr";

  const _addPreviousAddress = () => {
    setPreviousAddress((prev) => (prev < 4 ? prev + 1 : prev));
  };

  const _anotherPhone = () => {
    setAnotherPhone(true);
  };

  const _renderText = (
    key: string,
    display: string,
    placeholder: string,
    flavour?: string,
    rows?: number | undefined,
    type: string | undefined = undefined
  ) => {
    const labelProps = type === "date" ? { shrink: true } : undefined;
    return (
      <Box>
        <FormLabel component="legend" className={classes.bottom}>
          {display}
        </FormLabel>
        <TextField
          id={key}
          value={form.get(key)?.value || ""}
          name={key}
          autoFocus={key === firstKey}
          placeholder={placeholder}
          onChange={(e) => _updateForm(key, e.target.value)}
          error={hasError(key)}
          helperText={getErrors(key) ?? flavour}
          className={type === "date" ? classes.date : classes.textField}
          key={key}
          multiline={(rows && rows > 1) || false}
          rows={rows}
          type={type}
          InputLabelProps={labelProps}
          InputProps={{
            endAdornment: hasError(key) ? (
              <InputAdornment position="end">
                <Warning />
              </InputAdornment>
            ) : null,
          }}
        />
      </Box>
    );
  };

  // const _renderDate = (key: string, formType: formType) => {
  //   return _renderText(key, formType, "date");
  // };

  const _renderRadio = (key: string, radio: any[], display?: string, flavour?: string) => {
    if (!form || radio.length === 0) return;
    return (
      <FormControl component="fieldset" key={key}>
        <FormLabel component="legend">{display}</FormLabel>
        {flavour && (
          <Typography variant="body2" gutterBottom className={classes.detail}>
            {flavour}
          </Typography>
        )}
        <RadioGroup
          row
          aria-label={key}
          name="row-radio-buttons-group"
          value={form.get(key)?.value ?? radio[0].toString()}
          onChange={(e) => _updateForm(key, e.target.value)}
        >
          {radio?.map((c) => (
            <FormControlLabel
              value={c.rowId.toString()}
              control={<Radio />}
              label={c.description}
              key={c.rowId}
            />
          ))}
        </RadioGroup>
        <FormHelperText error={hasError(key)}>{getErrors(key)}</FormHelperText>
      </FormControl>
    );
  };

  const _renderCheckbox = (key: string, checkbox: any[], display?: string, flavour?: string) => {
    return (
      <FormControl component="fieldset" key={key} className={classes.bottom}>
        <FormLabel component="legend">{display}</FormLabel>
        {flavour && (
          <Typography variant="body2" gutterBottom className={classes.detail}>
            {flavour}
          </Typography>
        )}
        <FormGroup style={{ display: "flex", flexDirection: "row" }}>
          {checkbox?.map((c) => (
            <FormControlLabel
              value={c.abb}
              control={<Checkbox />}
              label={c.description}
              key={c.abb}
              onChange={(e, checked) => _updateArgs(c.abb, checked)}
            />
          ))}
        </FormGroup>
        <FormHelperText error={hasError(key)}>{getErrors(key)}</FormHelperText>
      </FormControl>
    );
  };

  const _validate = (propName: string, formValue: formType, isFocused: boolean): boolean => {
    clearError(propName);
    let hasError = false;
    if (formValue?.validation?.includes(Validation.stringLength) && formValue.value.length === 0) {
      setError(propName, "Field cannot be empty");
      hasError = true;
    }
    if (
      formValue?.validation?.includes(Validation.isEmail) &&
      formValue.value.length > 0 &&
      !isFocused &&
      !validateEmail(formValue.value)
    ) {
      setError(propName, "Invalid email");
      hasError = true;
    }
    return hasError;
  };

  const _updateForm = (propName: string, value: any) => {
    if (!form.has(propName)) return;

    const update = form.get(propName) as formType;
    update.value = value;
    _validate(propName, update, true);
    const newForm = new Map(form);
    newForm.set(propName, update);
    setForm(newForm);
  };

  const _updateArgs = (propName: string, value: any) => {
    setArgs((prev) => ({ ...prev, [propName]: value }));
  };

  const Errors = () => {
    return hasErrors() ? (
      <>
        {getAllErrors().map((x, i) => (
          <Alert key={i} severity="error">
            {x}
          </Alert>
        ))}
      </>
    ) : (
      <></>
    );
  };

  const _onSubmit = (e: any) => {
    e.preventDefault();

    // const newForm = new Map(form);
    const newForm = form;
    let formError = false;
    Array.from(newForm).forEach(([key, value]) => {
      const isValid = _validate(key, value, false);
      formError = formError || isValid;
    });

    if (args.certify !== true) {
      setError("certify", "Please certify to submit");
      return Promise.resolve();
    }

    // setForm(newForm);

    // can't iterate as the setstate for errors not yet processed
    // if (Array.from(newForm).some(([key]) => hasError(key)))
    if (formError) return Promise.resolve();

    const caseData = new ICaseData();
    const caseModel = new CaseModel();
    const subType = newForm.get("TechDataCase.ITechDataCaseSubTypeRowId")?.value;
    caseModel.iTechDataCaseSubTypeRowId = subType ? parseInt(subType) : 1;
    caseModel.subjectForename = newForm.get("TechDataCase.SubjectForename")?.value || "";
    caseModel.subjectSurname = newForm.get("TechDataCase.SubjectSurname")?.value || "";
    // caseModel.subjectPreviousSurname =
    //   newForm.get("TechDataCase.SubjectPreviousSurname")?.value || "";
    // caseModel.subjectDob = newForm.get("TechDataCase.SubjectDob")?.value || "";
    // caseModel.subjectEmailConfirm =
    //   newForm.get("TechDataCase.SubjectEmailConfirm")?.value === "1" || false;
    caseModel.subjectEmail = newForm.get("TechDataCase.SubjectEmail")?.value || "";
    caseModel.subjectStreet = newForm.get("TechDataCase.SubjectStreet")?.value || "";
    caseModel.subjectCity = newForm.get("TechDataCase.SubjectCity")?.value || "";
    caseModel.subjectPostCode = newForm.get("TechDataCase.SubjectPostCode")?.value || "";
    //caseModel.subjectCountry = newForm.get("TechDataCase.SubjectCountry")?.value || "";
    caseModel.subjectMobile = newForm.get("TechDataCase.SubjectMobile")?.value || "";
    caseModel.subjectPhone = newForm.get("TechDataCase.SubjectPhone")?.value || "";
    caseModel.caseReference = newForm.get("TechDataCase.CaseReference")?.value || "";
    //caseModel.summary = newForm.get("TechDataCase.Summary")?.value || "";
    let newArgs = { ...args };
    argProps.forEach((prop) => {
      const arg = newForm.get(prop)?.value;
      if (arg) newArgs = { ...newArgs, [prop]: arg };
    });
    caseModel.args = JSON.stringify(newArgs);
    caseData.techDataCase = caseModel;

    return trackPromise(
      caseService.gdpr(caseData).then(
        (response) => {
          setResponse(response.message || "");
          setErrorMessage("");
        },
        (error) => {
          setResponse("");
          // const newForm = new Map(form);
          // setForm(newForm);

          if (typeof error === "string") {
            setErrorMessage(error);
          } else if (typeof error === "object") {
            setErrors(error);
          }
        }
      ),
      loadingArea
    );
  };

  const firstKey = form.keys().next().value;

  return (
    <div className={classes.gdprForm}>
      <StyledAnonymousForm
        onSubmit={_onSubmit}
        title={
          <Typography component="h2" variant="h2" className={classes.title}>
            Personal Data Request
          </Typography>
        }
        description={
          <Typography component="h4" variant="h4">
            {!response
              ? "Completing this form will allow you to request access to your personal data or request that your personal data is removed from our systems as per the Data Protection Act 2018.  "
              : ""}
          </Typography>
        }
      >
        <>
          {response ? (
            <Typography variant="body2" gutterBottom className={classes.response}>
              {response}
            </Typography>
          ) : null}
          {errorMessage ? (
            <Typography variant="body2" gutterBottom className={classes.error}>
              {errorMessage}
            </Typography>
          ) : null}

          <Errors />

          {!response ? (
            <>
              <Box className={classes.box}>
                <Typography variant="h4">What would you like to do?</Typography>
                {_renderRadio(
                  "TechDataCase.ITechDataCaseSubTypeRowId",
                  caseSubTypes,
                  "Please select what type of request you would like to perform."
                )}
              </Box>
              <Box className={classes.box}>
                <Typography variant="h4">Your details</Typography>
                {_renderText(
                  "TechDataCase.SubjectForename",
                  "Forename(s)",
                  "Enter here",
                  "Please capture all your forename(s)"
                )}
                {_renderText(
                  "TechDataCase.SubjectSurname",
                  "Last name",
                  "Enter here",
                  "Your current last name/surname"
                )}

                <Typography variant="body2" className={classes.bottom}>
                  We need your address history for the last 3 years to be able to complete your
                  request. Please provide it by capturing the fields below.
                </Typography>

                <Box className={classes.horizontal}>
                  {_renderText(
                    "TechDataCase.SubjectStreet",
                    "Current address",
                    "Street name",
                    "Your current street address"
                  )}

                  {_renderText(
                    "TechDataCase.SubjectCity",
                    "City",
                    "City name",
                    "Your current city address"
                  )}
                </Box>

                <Box className={classes.horizontal}>
                  {_renderText(
                    "TechDataCase.SubjectPostCode",
                    "Postcode",
                    "SW1A 1AA",
                    "Your current postcode"
                  )}

                  <Button
                    color="secondary"
                    onClick={_addPreviousAddress}
                    disabled={previousAddress > 2}
                  >
                    Add previous address
                  </Button>
                </Box>

                {previousAddress > 0 &&
                  _renderText(
                    "alternativeAddress1",
                    "Previous Address 1",
                    "Last address",
                    "Add street, city and postcode here",
                    3
                  )}

                {previousAddress > 1 &&
                  _renderText(
                    "alternativeAddress2",
                    "Previous Address 2",
                    "Second last address",
                    "Add street, city and postcode here",
                    3
                  )}

                {previousAddress > 2 &&
                  _renderText(
                    "alternativeAddress3",
                    "Previous Address 3",
                    "Third last address",
                    "Add street, city and postcode here",
                    3
                  )}

                {_renderText("TechDataCase.SubjectEmail", "Email Address", "myname@myemail.com")}

                <Box className={classes.horizontal}>
                  {_renderText(
                    "TechDataCase.SubjectPhone",
                    "Main phone",
                    "07000 111 222",
                    "Please capture your telephone number"
                  )}

                  {!anotherPhone && (
                    <Button color="secondary" onClick={_anotherPhone} disabled={anotherPhone}>
                      Add another phone
                    </Button>
                  )}

                  {anotherPhone &&
                    _renderText(
                      "TechDataCase.MobilePhone",
                      "Alternate phone",
                      "07000 111 222",
                      "Please capture your telephone number"
                    )}
                </Box>
              </Box>

              <Box className={classes.box}>
                <Typography variant="h4">Which data specifically</Typography>
                <Typography variant="h5" className={classes.bottom}>
                  Statements
                </Typography>

                <Box className={classes.horizontal}>
                  {_renderText(
                    "TechDataCase.CaseReference",
                    "Account number",
                    "1234-5647-9012-3456",
                    "Leave blank if not known, or you want all accounts"
                  )}
                  {_renderCheckbox("TechDataCase.productTypes", productTypes, "Account Type")}
                </Box>

                <Typography variant="h5" className={classes.bottom}>
                  Other information types
                </Typography>

                <Typography variant="body2" className={classes.bottom}>
                  This is a non-exhaustive list of common types of information we hold. Please
                  select as required.
                </Typography>

                {_renderCheckbox("TechDataCase.informationTypes", informationTypes)}

                {_renderText(
                  "product.other",
                  "Please describe the information you are looking for as well as you can.",
                  "Explain what you are looking for, including account numbers where possible.",
                  undefined,
                  3
                )}
              </Box>

              {/* <Box className={classes.box}>
                <Typography variant="h3">Your delivery options</Typography>
                <Typography variant="body2" className={classes.bottom}>
                  Please tell us how you would like your to recieve your information. As a
                  reminder, if you receive your data via post - it may not be in a format that you
                  can import it.
                </Typography>
              </Box> */}

              <Box className={classes.box}>
                <Typography variant="h4">Verify your identity</Typography>
                <Typography variant="body2" className={classes.bottom}>
                  On submission of this request, we will verifiy your identity. Please select your
                  preferred means of identification.
                </Typography>
                {_renderRadio("verify", verifyTypes)}
              </Box>

              <Box className={classes.box}>
                <Typography variant="h4">Send request</Typography>
                <Typography variant="body2" className={classes.bottom}>
                  For more details on how we use your personal information, please see our Privacy
                  Notice at{" "}
                  <Link href="https://www.globallogic.com/uk/privacy/" target="_blank">
                    https://www.globallogic.com/uk/privacy/
                  </Link>
                </Typography>
                <Box>
                  {_renderCheckbox("certify", [
                    { abb: "certify", description: "I certify I am the person named on this form" },
                  ])}
                </Box>
                <Errors />
                <BusyButton type="submit" className={classes.submit} area={loadingArea}>
                  Send Request
                </BusyButton>
              </Box>
            </>
          ) : null}

          <>
            {/* <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.goBack}
              component={Link}
              to="/"
            >
              Go Back
            </Button> */}
          </>
        </>
      </StyledAnonymousForm>
    </div>
  );
};

export default GdprPage;
