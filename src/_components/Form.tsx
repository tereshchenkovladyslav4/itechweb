import React, { ReactElement, useState } from "react";
import AnonymousForm, { AnonymousFormProps } from "./AnonymousForm";
import useErrors from "../_helpers/hooks/useErrors";
import {
  Alert,
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  InputAdornment,
  InputProps,
  MenuItem,
  Portal,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import BusyButton from "./BusyButton";
import { Warning } from "@mui/icons-material";
import DatePicker from "react-datepicker";
import { toSentence } from "../_helpers/utilities";
import moment from "moment";
import { dateToTicks, ticksToDate } from "../_helpers/dateConverter";

// helper to convert enum into array of IKeyValue for dropdownsm
export function getEnumKeyValuePairs<T extends Record<string, unknown>>(
  enumeration: T,
  filter?: (s: [string, any]) => boolean // optional filter
): IKeyValue[] {
  const items = Object.entries(enumeration)
    .filter((x) => isNaN(Number(x[0])))
    .filter((x) => filter === undefined || filter(x))
    .map((x) => ({ key: String(x[1]), description: toSentence(x[0]) }));

  return items;
}

export enum formFieldType {
  text,
  number,
  date, // Date property is currently coded for bigint ( C# ticks )
  daterange,
  dropdown,
  radioGroup,
  checkBox, // boolean model property
  checkBoxGroup,
  switch, // boolean model property ( user placeholder if require 2 labels )
  raw, // pass in elements
  autocomplete,
}

export interface IFormField<TModel> {
  key: keyof TModel;
  label: string;
  placeholder?: string;
  type: formFieldType;
  validators: ((value: string) => string)[];
  inputProps?: Partial<InputProps>;
  raw?: ReactElement;
  values?: IKeyValue[];
  disabled?: boolean;
  extraProps?: any;
}

interface IFormProps<TModel> extends AnonymousFormProps {
  model: TModel;
  setModel: React.Dispatch<React.SetStateAction<TModel>>;
  area: string;
  submitBtnText: string;
  submitBtnClass?: string;
  submitBtnIcon?: React.ReactNode;
  formFields: IFormField<TModel>[];
  onClose?: () => void;
  isModal?: boolean;
  showErrorSummary?: boolean;
}

export function Form<TModel>(props: React.PropsWithChildren<IFormProps<TModel>>) {
  const {
    title,
    description,
    onSubmit,
    children,
    icon,
    model,
    area,
    submitBtnText,
    formFields,
    onClose,
    isModal = false,
    submitBtnIcon,
    submitBtnClass,
    setModel,
    showErrorSummary = true,
  } = props;

  const {
    hasError,
    getErrors,
    setError,
    clearError,
    setErrors,
    hasErrors,
    getAllErrors,
    clearErrors,
  } = useErrors();
  const [message, setMessage] = useState("");

  const Errors = () => {
    return showErrorSummary && hasErrors() ? (
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
    e?.preventDefault();
    setMessage("");
    if (validateAll()) {
      // return onSubmit(model)
      clearErrors();
      return onSubmit(e) // TODO - pass the event or model? calling form will laready have model.. but do modals expect this?
        .then((rsp) => {
          setMessage(rsp?.message);
        })
        .then(onClose) // can be undefined
        .catch((err: any) => {
          if (typeof err === "string") {
            // assume only one field in this form - so use its name as key and set error string array to message
            const error = { [Object.keys(model as any)[0]]: [err] };
            setErrors(error);
          } else {
            // api should be using model state validation & return an object of properties/errors
            setErrors(err);
          }
        });
    }
    return Promise.resolve();
  };

  const validateAll = () => {
    let valid = true;
    formFields.forEach((f) => {
      if (f.validators) {
        const err = validate(f.key, String(model[f.key]), f.validators, f.label);
        if (valid && !err) {
          valid = false;
        }
      }
    });

    return valid;
  };

  const validate = (
    field: keyof TModel,
    value: string,
    fn: ((value: string) => string)[],
    label: string
  ): boolean => {
    let isValid = true;
    const fieldName = field.toString();
    clearError(fieldName);

    fn.forEach((f) => {
      const error = f(value);
      if (error) {
        setError(fieldName, error.replace("{name}", label || fieldName));
        isValid = false;
      }
    });
    return isValid;
  };

  const updateData = (prop: keyof TModel, val: any) => {
    setModel((prev) => ({ ...prev, ...{ [prop]: val } }));
  };

  return (
    <AnonymousForm
      onSubmit={_onSubmit}
      title={title}
      description={description}
      icon={icon}
      isModal={isModal}
    >
      <>
        {formFields.map((field, i) => (
          <Box
            p={1}
            paddingLeft={isModal ? 0 : undefined}
            paddingTop={isModal && i > 0 ? 0 : undefined}
            key={i}
          >
            <Field<TModel>
              field={field}
              data={model}
              modelKey={field.key}
              updateData={updateData}
              hasError={hasError}
              getErrors={getErrors}
              {...field.extraProps}
            />
          </Box>
        ))}

        <Errors />
        {message && <Alert severity="success">{message}</Alert>}
        
        {children}

        <BusyButton
          type="submit"
          area={area}
          startIcon={submitBtnIcon}
          className={submitBtnClass}
          disabled={message?.length > 0}
        >
          {submitBtnText}
        </BusyButton>
      </>
    </AnonymousForm>
  );
}

// type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

interface IFromControlProps<T> {
  modelKey: keyof T;
  data: T;
  updateData: (prop: keyof T, val: string | Date | null | boolean | number) => void;
  display?: string; // TODO - required? duplicate of IFormField label
  hasError: (val: string) => boolean;
  getErrors: (val: string) => any;
  placeholder?: string;
  type?: string;
  inputProps?: Partial<InputProps>; // too generic to be able to do anything in a click handler...
  extraProps?: any;
  disabled?: boolean;
}

export interface IKeyValue {
  key: string;
  description: string;
}

interface IControlValuesProps<T> extends IFromControlProps<T> {
  values?: IKeyValue[];
}

interface IFieldProps<TModel> extends IFromControlProps<TModel> {
  field: IFormField<TModel>;
}

function Field<TModel>({
  field,
  data,
  modelKey,
  updateData,
  hasError,
  getErrors,
}: IFieldProps<TModel>) {
  return field.type === formFieldType.radioGroup ? (
    <FormRadioGroup<TModel>
      modelKey={modelKey}
      data={data}
      display={field.label}
      updateData={updateData}
      hasError={hasError}
      getErrors={getErrors}
      values={field.values}
      disabled={field.disabled}
    />
  ) : field.type === formFieldType.text ? (
    <FormText<TModel>
      modelKey={modelKey}
      data={data}
      display={field.label}
      updateData={updateData}
      hasError={hasError}
      getErrors={getErrors}
      inputProps={field.inputProps}
      extraProps={field.extraProps}
      placeholder={field.placeholder}
    />
  ) : field.type === formFieldType.raw ? (
    <>{field.raw}</>
  ) : field.type === formFieldType.number ? (
    <FormText<TModel>
      modelKey={modelKey}
      data={data}
      display={field.label}
      updateData={updateData}
      hasError={hasError}
      getErrors={getErrors}
      inputProps={field.inputProps}
      type="number"
    />
  ) : field.type === formFieldType.date ? (
    <FormDate<TModel>
      modelKey={modelKey}
      data={data}
      display={field.label}
      updateData={updateData}
      hasError={hasError}
      getErrors={getErrors}
      extraProps={field.extraProps}
    />
  ) : field.type === formFieldType.checkBox ? (
    <FormCheckbox<TModel>
      modelKey={modelKey}
      data={data}
      display={field.label}
      updateData={updateData}
      hasError={hasError}
      getErrors={getErrors}
    />
  ) : field.type === formFieldType.switch ? (
    <FormSwitch<TModel>
      modelKey={modelKey}
      data={data}
      display={field.label}
      updateData={updateData}
      hasError={hasError}
      getErrors={getErrors}
      placeholder={field.placeholder}
    />
  ) : field.type === formFieldType.dropdown ? (
    <FormSelect<TModel>
      modelKey={modelKey}
      data={data}
      values={field.values}
      display={field.label}
      updateData={updateData}
      hasError={hasError}
      getErrors={getErrors}
      extraProps={field.extraProps}
    />
  ) : field.type === formFieldType.autocomplete ? (
    <FormAutocomplete<TModel>
      modelKey={modelKey}
      data={data}
      values={field.values}
      display={field.label}
      updateData={updateData}
      hasError={hasError}
      getErrors={getErrors}
      placeholder={field.placeholder}
      extraProps={field.extraProps}
    />
  ) : (
    <div>unknown field type</div>
  );
}

// const FormRadio: React.FC<IRadioGroupProps<T> & RadioProps> = ({ key, display, data, values, updateData, hasError, getErrors }) => {
function FormRadioGroup<TModel>({
  modelKey,
  display,
  data,
  values,
  updateData,
  hasError,
  getErrors,
  disabled,
}: IControlValuesProps<TModel>) {
  const key = modelKey.toString();
  return (
    <FormControl component="fieldset" key={modelKey.toString()}>
      <FormLabel component="legend">{display}</FormLabel>
      {/* {flavour && (
        <Typography variant="body2" gutterBottom >
          {flavour}
        </Typography>
      )} */}
      <RadioGroup
        row
        aria-label={key}
        name="row-radio-buttons-group"
        value={data[modelKey]?.toString()}
        onChange={(e) => updateData(modelKey, e.target.value)}
      >
        {values?.map((c, i) => (
          <FormControlLabel
            control={<Radio value={c.key} />}
            label={c.description}
            key={i}
            disabled={disabled}
          />
        ))}
      </RadioGroup>
      <FormHelperText error={hasError(key)}>{getErrors(key)}</FormHelperText>
    </FormControl>
  );
}

function FormText<TModel>({
  modelKey,
  display,
  data,
  updateData,
  hasError,
  getErrors,
  placeholder,
  type,
  inputProps,
  extraProps,
  disabled,
}: IFromControlProps<TModel>) {
  const key = modelKey.toString();
  return (
    <Box padding={0}>
      <FormLabel component="legend" htmlFor={key}>
        {display}
      </FormLabel>
      <TextField
        id={key}
        value={data[modelKey] || ""}
        name={key}
        placeholder={placeholder}
        onChange={(e) => updateData(modelKey, e.target.value)}
        error={hasError(key)}
        // helperText={getErrors(key) ?? placeholder}
        helperText={getErrors(key)}
        // className={type === "date" ? classes.date : classes.textField}
        type={type}
        // InputLabelProps={labelProps}
        disabled={disabled}
        InputProps={
          inputProps ?? {
            endAdornment: hasError(key) ? (
              <InputAdornment position="end">
                <Warning />
              </InputAdornment>
            ) : undefined,
          }
        }
        {...extraProps}
      />
    </Box>
  );
}

function FormDate<TModel>({
  modelKey,
  display,
  data,
  updateData,
  extraProps,
  hasError,
  getErrors,
  disabled,
}: IFromControlProps<TModel>) {
  const dateFormat = "dd/MM/yyyy"; // display format
  const key = modelKey.toString();
  const val = data[modelKey]?.toString() || '';
  const dt = moment(!isNaN(Number(val)) ? ticksToDate(Number(val)) :val);
  const _container = ({ children }: any) => {
    return <Portal>{children}</Portal>;
  };

  return (
    <Box>
      <FormLabel component="legend">{display}</FormLabel>
      <DatePicker
        // selected={data[modelKey] as Date}
        selected={val && dt.isValid() ? dt.toDate() : undefined}
        onChange={(e) => updateData(modelKey, dateToTicks(moment(e).valueOf()))}
        dateFormat={dateFormat}
        popperContainer={_container}
        todayButton="Today"
        disabled={disabled}
        customInput={<TextField />}
        popperModifiers={[{name:'offset', options:{offset:[20,21]}}]}
        {...extraProps}
      />
      <FormHelperText error={hasError(key)}>{getErrors(key)}</FormHelperText>
    </Box>
  );
}

function FormCheckbox<TModel>({
  modelKey,
  display,
  data,
  updateData,
  disabled,
}: // extraProps,
IFromControlProps<TModel>) {
  return (
    <Box>
      <FormControlLabel
        control={<Checkbox checked={!!data[modelKey]} />}
        label={display}
        onChange={(e, checked) => updateData(modelKey, checked)}
        disabled={disabled}
      />
    </Box>
  );
}

// where want 2 labels - use placeholder as label2
function FormSwitch<TModel>({
  modelKey,
  display,
  data,
  updateData,
  placeholder,
  disabled,
}: // extraProps,
IFromControlProps<TModel>) {
  return (
    <Box>
      <>
        {placeholder && (
          <>
            <Typography component="label">{display}</Typography>
            <Switch
              checked={!!data[modelKey]}
              onChange={(e, checked) => updateData(modelKey, checked)}
              color="primary"
              disabled={disabled}
            />
            <Typography component="label">{placeholder}</Typography>
          </>
        )}
        {!placeholder && (
          <FormControlLabel
            control={
              <Switch
                checked={!!data[modelKey]}
                onChange={(e, checked) => updateData(modelKey, checked)}
                color="primary"
                disabled={disabled}
              />
            }
            label={display}
          />
        )}
      </>
    </Box>
  );
}

function FormSelect<TModel>({
  modelKey,
  display,
  data,
  values,
  updateData,
  hasError,
  getErrors,
  extraProps,
  disabled,
}: IControlValuesProps<TModel>) {
  const key = modelKey.toString();
  return (
    <Box>
      <FormLabel component="legend">{display}</FormLabel>

      <Select
        value={data[modelKey] || (values && values[0]?.key)}
        onChange={(e) => updateData(modelKey, String(e.target.value))}
        error={hasError(key)}
        disabled={disabled}
        {...extraProps}
      >
        {values?.map((v) => (
          <MenuItem key={v.key} value={v.key}>
            {v.description}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText error={hasError(key)}>{getErrors(key)}</FormHelperText>
    </Box>
  );
}

// TODO - legend above or input based label
function FormAutocomplete<TModel>({
  modelKey,
  display,
  data,
  values,
  updateData,
  hasError,
  getErrors,
  placeholder,
  extraProps,
  disabled,
}: IControlValuesProps<TModel>) {
  const key = modelKey.toString();
  return (
    <Box>
      {/* <FormLabel component="legend">{display}</FormLabel> */}
      <Autocomplete
        options={values || []}
        disabled={disabled}
        getOptionLabel={(opt: any) => opt.description}
        onChange={(e, newVal: IKeyValue) => updateData(modelKey, String(newVal?.key))}
        value={values?.find((x) => x.key === data[modelKey])}
        isOptionEqualToValue={(opt: IKeyValue, val: IKeyValue) => opt.key === val.key}
        renderInput={(params) => (
          <TextField label={display} placeholder={placeholder} {...params} />
        )}
        {...extraProps}
      />
      <FormHelperText error={hasError(key)}>{getErrors(key)}</FormHelperText>
    </Box>
  );
}

// is this needed?  TODO - setting of properties..array?
function FormCheckboxGroup<TModel>({
  modelKey,
  display,
  data,
  values,
  updateData,
  hasError,
  getErrors,
  disabled,
}: // extraProps,
IControlValuesProps<TModel>) {
  const key = modelKey.toString();
  return (
    <FormControl component="fieldset" key={key}>
      <FormLabel component="legend">{display}</FormLabel>
      <FormGroup
        row
        aria-label={key}
        // value={data[modelKey]}
        // onChange={(e) => updateData(modelKey, e.target.value)}
      >
        {values?.map((c, i) => (
          <FormControlLabel
            value={c.key}
            control={<Checkbox checked={data[modelKey] !== ""} />}
            label={c.description}
            key={i}
            disabled={disabled}
            onChange={(e, checked) => updateData(modelKey, checked ? c.description : "")}
          />
        ))}
      </FormGroup>
      <FormHelperText error={hasError(key)}>{getErrors(key)}</FormHelperText>
    </FormControl>
  );
}

// TODO Form:,
// autocomplete - as generic as poss, see  <UserSearch datatype={datatype} value={value} setValue={setValue} isLogin={isLogin} />
// daterange, ??

// checkBoxGroup, ? used? - TO TEST ( single prop as string value of the values[].description ? or .key OR array of selected .key)
