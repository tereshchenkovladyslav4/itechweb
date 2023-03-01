import React, { ReactElement, useState } from "react";
// import makeStyles from "@mui/styles/makeStyles";
import IconManager from "../_components/IconManager";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
// import TextField from "@mui/material/TextField";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import useErrors from "../_helpers/hooks/useErrors";
// import BusyButton from "../_components/BusyButton";
import { Add } from "@mui/icons-material";
import { Form, formFieldType, IFormField } from "../_components/Form";
// import { Button, formControlClasses } from "@mui/material";
// import moment from "moment";
import { length, required } from "../_components/form.validation";
// import { getEnumKeyValues } from "../_helpers/helpers";
// import { TimePeriodEnum } from "../Model/iTechRestApi/TimePeriodEnum";

// const useStyles = makeStyles((theme) => ({
//   error: {
//     "&.MuiFormHelperText-root.Mui-error": {
//       color: theme.palette.primary.contrastText,
//       marginTop: 0,
//     },
//   },
// }));

type EditTabProps = {
  onClose: () => void;
  onConfirm: (name: string) => Promise<void>;
  currentPage: any;
  title: string;
  area: string;
};

type EditTab = {
  name: string;
};

const EditTab: React.FC<EditTabProps> = ({
  onClose,
  onConfirm,
  currentPage,
  title,
  area,
}): ReactElement => {
  // const classes = useStyles();
  // const { hasError, getErrors, setErrors } = useErrors();

  // const [name, setName] = React.useState(currentPage !== undefined ? currentPage.name : "");

  // function _onConfirm(e: any) {
  //   e.preventDefault();
  //   return onConfirm(name)
  //     .then(onClose)
  //     .catch((err: any) => {
  //       if (typeof err === "string") {
  //         // only one field in this form - so use its name as key
  //         setErrors({ name: [err] });
  //       } else {
  //         setErrors(err);
  //       }
  //     });
  // }

  function _onSubmit() {
    return onConfirm(data.name);
  }

  function _handleTextClear() {
    // setName("");
    // setErrors({});
    setData((prev) => ({ ...prev, ...{ name: "" } }));
  }

  // test radio
  // const caseSubTypes = [
  //   { key: "1", description: "I’d like to see what data you hold on me - Subject access request" },
  //   {
  //     key: "2",
  //     description: "I’d like to correct the data you hold on me - Rectification of data",
  //   },
  //   {
  //     key: "3",
  //     description: "I’d like to be forgotten by your organisation - Deletion of records",
  //   },
  // ];
  // const tomorrow = moment().add(1, "days").toDate();
  // const minDate = moment().add(-6, "days").toDate();

  const model = {
    name: currentPage?.name ?? "",
    // radio: "1",
    // number: 1,
    // date: new Date(),
    // name2: "smith",
    // required: true,
    // switch: true,
  } as EditTab;

  // const testEnumValues =[{key:"-1", description:''} as IKeyValue].concat(getEnumKeyValuePairs(TimePeriodEnum));

  const fields = [
    {
      key: "name",
      label: "Name",
      type: formFieldType.text,
      validators: [required, length(50)],
      inputProps: {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={_handleTextClear} size="small">
              <IconManager icon="Clear" />
            </IconButton>
          </InputAdornment>
        ),
      },
    },
    // {
    //   key: "number",
    //   label: "numeric label",
    //   type: formFieldType.number,
    //   validators: [isRange(0, 100)],
    // },
    // {
    //   key: "date",
    //   label: "date label",
    //   type: formFieldType.date,
    //   extraProps: { maxDate: tomorrow, minDate: minDate },
    //   validators: [required],
    // },
    // {
    //   key: "radio",
    //   label: "options label",
    //   type: formFieldType.radioGroup,
    //   values: caseSubTypes,
    // },
    // {
    //   key: "name2",
    //   label: "Forename",
    //   type: formFieldType.text,
    //   validators: [required, length(50)],
    //   extraProps: { fullWidth: true },
    // },
    // {
    //   key: "required",
    //   label: "Is required",
    //   type: formFieldType.checkBox,
    //   validators: [required],
    // },
    // {
    //   key: "switch",
    //   label: "On",
    //   type: formFieldType.switch,
    // },
    // {
    //   key: "switch2",
    //   label: "Left",
    //   placeholder: "Right",
    //   type: formFieldType.switch,
    // },
    // {
    //   key: "dropdown",
    //   label: "values",
    //   type: formFieldType.dropdown,
    //   values:[{key:1, description:"one"}, {key:2, description:"two"}],
    //   extraProps:{sx:{minWidth:200}}
    // },
    // {
    //   key: "dropdownEnum",
    //   label: "enum values",
    //   type: formFieldType.dropdown,
    //   values: testEnumValues,
    //   extraProps:{sx:{minWidth:200}},
    //   validators: [required],
    // },
    // {
    //   key: "autocomplete",
    //   label: "autocomplete values",
    //   type: formFieldType.autocomplete,
    //   values: testEnumValues,
    //   extraProps:{sx:{width:200}},
    //   validators: [required],
    // },
    // {
    //   type: formFieldType.raw,
    //   raw: (
    //     <Typography variant="body1" style={{ marginBottom: 10 }}>
    //       raw text raw text raw text raw text raw text raw text raw text raw text raw text raw text raw text raw text raw text raw text raw text raw text raw text raw text raw text raw text
    //     </Typography>
    //   ),
    // },
  ] as Array<IFormField<EditTab>>;

  const [data, setData] = useState(model);

  return (
    <>
      {/* <form autoComplete="off" onSubmit={_onConfirm}>
      <Box p={3}>
        <div>
          <Typography variant="h4" style={{ marginBottom: 10 }}>
            {title}
          </Typography>
          <TextField
            label="Name"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={hasError("name")}
            helperText={getErrors("name")}
            FormHelperTextProps={{ classes: classes }}
            autoFocus={true}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={_handleTextClear} size="small">
                    <IconManager icon="Clear" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </Box>
      <BusyButton
        style={{ margin: "0 0 24px 24px" }}
        onClick={_onConfirm}
        startIcon={<Add />}
        area={area}
      >
        Submit
      </BusyButton>
    </form> */}

      <Form
        onSubmit={_onSubmit}
        model={data}
        setModel={setData}
        formFields={fields}
        area={area}
        submitBtnText="Submit"
        submitBtnIcon={<Add />}
        // title="Edit Tab"
        title=""
        description={title}
        onClose={onClose}
        isModal={true}
        // icon={<Add/>}
        showErrorSummary={false}
      >
        {/* <>
          <Box p={3}>
            <div>
              <Typography variant="h4" style={{ marginBottom: 10 }}>
                {title}
              </Typography>
              <TextField
                label="Name"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={hasError("name")}
                helperText={getErrors("name")}
                FormHelperTextProps={{ classes: classes }}
                autoFocus={true}
              />
            </div>
          </Box>
          <Button
            onClick={() => {
              onClose();
            }}
            startIcon={<Cancel />}
            style={{ marginRight: 10 }}
          >
            Cancel
          </Button>
        </> */}
      </Form>
    </>
  );
};

export default EditTab;
