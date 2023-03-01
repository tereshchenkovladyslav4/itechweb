import React, { ReactElement, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import { DateRange, AvTimer } from "@mui/icons-material";
import makeStyles from '@mui/styles/makeStyles';
import moment from "moment";
import * as chrono from "chrono-node";
import _ from "lodash";
import { Portal, Typography } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import "./DateRangePicker.css";
import Cron from "../react-js-cron-mui-5";  // local version of react-js-cron-mui package updated to mui v5
import InfoIcon from "@mui/icons-material/Info";
import TimePeriodDropdown from "../_components/TimePeriodDropdown";
import { TimePeriodEnum } from "../Model/iTechRestApi/TimePeriodEnum";
import { getEnumKeyValues } from "../_helpers/helpers";
import LabelSelect from "../_components/LabelSelect";

interface IDateRangePickerProps {
  value: any;
  setValue: (v: any) => void;
  name: string;
  preventSubmit: (b: boolean) => void;
  allowCron?: boolean;
}

enum DisplayType {
  date,
  timePeriod,
  cron,
}

export default function DateRangePicker({
  value,
  setValue,
  name,
  preventSubmit,
  allowCron = false,
}: IDateRangePickerProps): ReactElement {
  const dateTimeFormat = "YYYY-MM-DD HH:mm"; // submit format and moment parsing
  const valueSplits = value && value.split ? value.split(",") : [];

  const getDisplayType = () => {
    if (value === undefined || value === "") return DisplayType.date;

    const isCron: boolean =
      allowCron &&
      isNaN(Number(value)) &&
      value?.length &&
      (valueSplits.length === 1 || valueSplits.length > 2 || !value.includes(":"));

    if (isCron) return DisplayType.cron;

    if (!isNaN(Number(value))) return DisplayType.timePeriod;

    return DisplayType.date;
  };
  // would use moment(valueSplits[0], dateTimeFormat).isValid() but returns true for things like "* 5" ?!
  const [displayType, setDisplayType] = useState<DisplayType>(getDisplayType());
  const firstValue =
    valueSplits.length > 0 && displayType === DisplayType.date ? valueSplits[0] : "";
  const secondValue =
    valueSplits.length > 0 && displayType === DisplayType.date ? valueSplits[1] : "";
  const startId = `${name}-Start`;
  const endId = `${name}-End`;
  const startTimeId = `${name}-StartTime`;
  const endTimeId = `${name}-EndTime`;
  const dateFormat = "dd/MM/yyyy"; // display format
  const startD =
    firstValue === ""
      ? moment().subtract(1, "months").toDate()
      : moment(firstValue, dateTimeFormat).toDate();
  const tomorrow = moment().add(1, "days").toDate();
  const maxD = secondValue === "" ? tomorrow : moment(secondValue, dateTimeFormat).toDate();
  const [startDate, setStartDate] = useState(startD);
  const [endDate, setEndDate] = useState(maxD);
  const defaultTime = moment().startOf("days").toDate();
  const startT = firstValue === "" ? defaultTime : moment(firstValue, dateTimeFormat).toDate();
  const endT = secondValue === "" ? defaultTime : moment(secondValue, dateTimeFormat).toDate();
  const [startTime, setStartTime] = useState(startT);
  const [endTime, setEndTime] = useState(endT);
  const defaultInputText = {};
  const [inputText, setInputText] = useState<any>(defaultInputText);
  const defaultDateRange = 0;
  const [dateRange, setDateRange] = useState(defaultDateRange);
  const dateRanges = [
    { name: "Today", startDate: moment().toDate(), endDate: tomorrow },
    {
      name: "Yesterday",
      startDate: moment().subtract(1, "days").toDate(),
      endDate: moment().toDate(),
    },
    {
      name: "Last week",
      startDate: moment().subtract(1, "weeks").startOf("week").toDate(),
      endDate: moment().subtract(1, "weeks").endOf("week").add(1, "days").toDate(),
    },
    {
      name: "Last month",
      startDate: moment().subtract(1, "months").startOf("month").toDate(),
      endDate: moment().subtract(1, "months").endOf("month").add(1, "days").toDate(),
    },
    {
      name: "Last 7 days",
      startDate: moment().subtract(7, "days").toDate(),
      endDate: tomorrow,
    },
    {
      name: "Last 30 days",
      startDate: moment().subtract(30, "days").toDate(),
      endDate: tomorrow,
    },
  ];

  const classes = makeStyles(() => ({
    formControl: {
      margin: "16px 0 0 0",
      minWidth: 100,
    },
    cronControl: {
      // margin: "16px 0 0 0",
    },
    cronInfo: {
      width: "100%",
    },
  }))();

  const _parseDateTime = (date: Date, time: string) => {
    const d = date ? date : new Date();
    return moment(moment(d).toISOString().split("T").shift() + " " + time, dateTimeFormat);
  };

  const _getValue = (dates: Date[], times: Date[]) => {
    return dates
      .map((date, i) =>
        _parseDateTime(date, moment(times[i]).format("HH:mm")).format(dateTimeFormat)
      )
      .join(",");
  };

  // reset the value if not appropriate for current display type
  const currentValue =
    displayType === DisplayType.cron
      ? value
      : displayType === DisplayType.timePeriod
      ? isNaN(value)
        ? TimePeriodEnum.lastYear
        : value
      : _getValue([startDate, endDate], [startTime, endTime]);

  useEffect(() => {
    setValue(currentValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue]);

  const _onDateBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { id } = event.target;
    const input = inputText[id];
    if (input !== undefined) {
      let parse = chrono.de.parseDate(input); // parse international date format
      if (parse === null) {
        parse = chrono.en.parseDate(input); // parse English text
      }

      setInputText(defaultInputText);
      const momentDate = moment(parse);
      if (!momentDate.isValid()) {
        return;
      }

      const date = momentDate.toDate();
      if (id === startId) {
        setStartDate(date);
      } else if (id === endId) {
        setEndDate(date);
      }
      setDateRange(defaultDateRange);
    }
  };

  const _onTimeBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setDateRange(defaultDateRange);
    const { id } = event.target;
    const input = inputText[id];
    if (input === undefined) {
      return;
    }

    setInputText(defaultInputText);

    const time = _parseDateTime(new Date(), input);
    if (!time.isValid()) {
      return;
    }

    if (id === startTimeId) {
      setStartTime(time.toDate());
    } else if (id === endTimeId) {
      setEndTime(time.toDate());
    }
  };

  // const _onDateChange = (dates: [any, any]) => {
  //   if (!_.isEmpty(inputText)) {
  //     return;
  //   }

  //   const [start, end] = dates;
  //   setStartDate(start);
  //   setEndDate(end);
  //   setDateRange(defaultDateRange);
  // };

    const _onStartDateChange = (date:Date) =>{
        setStartDate(date);
    }

    const _onEndDateChange = (date:Date) =>{
        setEndDate(date);
    }

  const _onTimeChange = (
    date: Date | [Date | null, Date | null] | null,
    setFunc: {
      (value: React.SetStateAction<Date>): void;
      (value: React.SetStateAction<Date>): void;
      (arg0: any): void;
    }
  ) => {
    setFunc(date);
    setDateRange(defaultDateRange);
  };

  const _onTextChange = (event: any) => {
    const { id, value } = event.target;
    if (value !== undefined) {
      // currently typing
      setInputText({ [id]: value });
    }
  };

  const _handleSelectChange = (value: any) => {
    setDateRange(value);
    if (value === defaultDateRange) {
      return;
    }
    const range = dateRanges.find((r) => r.name === value);
    if (range) {
      setStartDate(range.startDate);
      setEndDate(range.endDate);
    }
    setStartTime(defaultTime);
    setEndTime(defaultTime);
  };

  const _onKeyDown = () => {
    preventSubmit(true);
  };

  const _onKeyUp = (event: any) => {
    if (event.keyCode === 13) {
      _onDateBlur(event);
    }
  };

  const _container = ({ children }: any) => {
    return <Portal>{children}</Portal>;
  };

  const dateOptions = getEnumKeyValues(
    DisplayType,
    (x: [string, any]) => allowCron || x[0] !== DisplayType[DisplayType.cron]
  );

  return (
    <>
      <div className="dateRangeContainer">
        {displayType === DisplayType.date && (
          <>
            <DatePicker
              selected={startDate}
              onChange={_onStartDateChange}
              onBlur={_onDateBlur}
              startDate={startDate}
              endDate={endDate}
              shouldCloseOnSelect={false}
              dateFormat={dateFormat}
              monthsShown={3}
              maxDate={tomorrow}
              // selectsRange
              selectsStart
              todayButton="Today"
              popperContainer={_container}
              customInput={
                <DateInput
                  newId={startId}
                  label="Start"
                  inputText={inputText[startId]}
                  icon={<DateRange />}
                  onTextChange={_onTextChange}
                  onKeyDown={_onKeyDown}
                  onKeyUp={_onKeyUp}
                  props={{ style: { width: 140 } }}
                />
              }
            />
            <DatePicker
              selected={startTime}
              onChange={(date) => _onTimeChange(date, setStartTime)}
              onBlur={_onTimeBlur}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="HH:mm"
              timeFormat="HH:mm"
              popperContainer={_container}
              customInput={
                <DateInput
                  newId={startTimeId}
                  inputText={inputText[startTimeId]}
                  label="Time"
                  icon={<AvTimer />}
                  props={{ style: { width: 105 } }}
                  onTextChange={_onTextChange}
                />
              }
            />
            <DatePicker
              selected={endDate}
              onChange={_onEndDateChange}
              onBlur={_onDateBlur}
              startDate={startDate}
              endDate={endDate}
              shouldCloseOnSelect={false}
              dateFormat={dateFormat}
              monthsShown={3}
              maxDate={tomorrow}
              // selectsRange
              selectsEnd
              todayButton="Today"
              popperContainer={_container}
              customInput={
                <DateInput
                  newId={endId}
                  label="End"
                  inputText={inputText[endId]}
                  icon={<DateRange />}
                  onTextChange={_onTextChange}
                  onKeyDown={_onKeyDown}
                  onKeyUp={_onKeyUp}
                  props={{ style: { width: 140 } }}
                />
              }
            />
            <DatePicker
              selected={endTime}
              onChange={(date) => _onTimeChange(date, setEndTime)}
              onBlur={_onTimeBlur}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="HH:mm"
              timeFormat="HH:mm"
              popperContainer={_container}
              customInput={
                <DateInput
                  newId={endTimeId}
                  inputText={inputText[endTimeId]}
                  label="Time"
                  icon={<AvTimer />}
                  props={{ style: { width: 105 } }}
                  onTextChange={_onTextChange}
                />
              }
            />
            <LabelSelect
              label="Range"
              id="dateSelect"
              onChange={(e) => _handleSelectChange(e.target.value)}
              value={dateRange}
            >
              <MenuItem key={defaultDateRange} value={defaultDateRange}>
                Custom
              </MenuItem>
              {dateRanges.map((date) => (
                <MenuItem key={date.name} value={date.name}>
                  {date.name}
                </MenuItem>
              ))}
            </LabelSelect>
          </>
        )}
        {displayType === DisplayType.cron && (
          <Cron
            value={displayType === DisplayType.cron ? value : ""}
            setValue={setValue}
            clockFormat="24-hour-clock"
            className={classes.cronControl}
            displayError={false}
            defaultPeriod="year"
          />
        )}

        {displayType === DisplayType.timePeriod && (
          <TimePeriodDropdown
            setValue={setValue}
            value={value}
            showAll={false}
            style={{ minWidth: 140 }}
          />
        )}

        <div style={{minWidth:5}}></div>
        <LabelSelect
          label="Type"
          value={displayType}
          onChange={(e) => setDisplayType(Number(e.target.value))}
          autoWidth
          // style={{ marginLeft: 5 }}
        >
          {dateOptions.map((x) => (
            <MenuItem key={x.value} value={x.value}>
              {x.name}
            </MenuItem>
          ))}
        </LabelSelect>
      </div>
      {displayType === DisplayType.cron && (
        <div className={classes.cronInfo}>
          <div style={{ width: "25%", display: "inline-block" }} />
          <InfoIcon style={{ marginRight: 5 }} />
          <Typography
            style={{ fontSize: 12, position: "absolute", marginTop: 3, display: "inline-block" }}
          >
            you can select multiple values in each of the drop downs
          </Typography>
        </div>
      )}
    </>
  );
}

interface IDateInputProps {
  newId?: string;
  label: string;
  value?: any;
  onClick?: any;
  onTextChange: any;
  onBlur?: any;
  inputText: any;
  onKeyDown?: any;
  onKeyUp?: any;
  icon: any;
  width?: number;
  props?: TextFieldProps;
}

// This needs to be a class
export class DateInput extends React.Component<IDateInputProps, any> {
  render() {
    const {
      newId,
      label,
      value,
      onClick,
      onTextChange,
      onBlur,
      inputText,
      onKeyDown,
      onKeyUp,
      icon,
      width,
      props,
    } = this.props;
    return (
      <TextField
        name={newId}
        onBlur={onBlur}
        id={newId}
        label={label}
        value={inputText ? inputText : value}
        onClick={onClick}
        onChange={onTextChange}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        style={{ width: width }}
        InputProps={{
          endAdornment: <InputAdornment position="end">{icon}</InputAdornment>,
        }}
        {...props}
      />
    );
  }
}
