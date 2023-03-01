import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormHelperText,
  List,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { trackPromise } from "react-promise-tracker";
import { ITechDataWebFilterWithUser } from "../Model/iTechRestApi/ITechDataWebFilterWithUser";
import IconManager from "../_components/IconManager";
import { WIZARD_STATE } from "../_components/wizardState";
// import { useStore } from "../_context/Store";
import { filterService } from "../_services/filterService";
// import { getAdvancedFilterDataSource } from "../_helpers/filter";
import useAsyncError from "../_helpers/hooks/useAsyncError";
import useIsMounted from "../_helpers/hooks/useIsMounted";
import DiscreteSlider from "./DiscreteSlider";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    marginBottom: 20,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  display: {
    margin: "4vh",
  },
  menuFilterItem: {
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    height: theme.typography.fontSize + 8, // TODO.. improve this...(lineheight?) just setting height to not show username span when no room
    "& span:nth-of-type(2)": {
      float: "right",
      color: theme.palette.text.disabled, // was secondary but thats now white in glDarkTheme
    },
  },
  textField: {
    "& .Mui-focused legend": {
      paddingRight: 20,
    },
  },
  formSubmitBtn: {
    margin: "0 0 24px 0",
  },
  formBackBtn: {
    margin: "0 10px 24px 0",
  },
  formSection: {
    padding: theme.spacing(1),
  },
}));

const BackButton = (props: any) => {
  return (
    <Button {...props}>
      <IconManager icon="ArrowBackIos" /> Back
    </Button>
  );
};

interface ICounterProps {
  updateComponent: (component: any) => void;
  area?: string;
  filterService: typeof filterService;
  data: any;
}

// render a textfield and list of saved results
const ConfigureCounter: React.FC<ICounterProps> = ({
  updateComponent,
  area,
  filterService,
  data,
}) => {
  const classes = useStyles();
  // const { selectors } = useStore();
  const throwError = useAsyncError();
  const isMounted = useIsMounted();

  const [savedFilters, setSavedFilters] = useState<ITechDataWebFilterWithUser[]>([]);
  const [loadedFilterRowId, setLoadedFilterRowId] = useState(-1);
  const [loadedDivisorFilterRowId, setLoadedDivisorFilterRowId] = useState(-1);
  const [name, setName] = useState(data?.data?.name || "");
  const [error, setError] = useState("");
  const [filterError, setFilterError] = useState("");
  const [divisorFilterError, setDivisorFilterError] = useState("");
  const [percentage, setPercentage] = useState<boolean>(
    data?.data?.isPercentage !== undefined ? data?.data?.isPercentage : false
  );
  const [sliderValue, setSliderValue] = useState<number[]>(data?.data?.colorRange || [33, 66]);
  const [greenToRed, setGreenToRed] = useState<boolean>(
    data?.data?.greenToRed !== undefined ? data?.data?.greenToRed : true
  );
  const [maxRange, setMaxRange] = useState(data?.data?.maxRange || 100);

  const _onFilterSelectChange = (e: any) => {
    const rowId = e.target.value;
    if (rowId !== loadedDivisorFilterRowId && rowId !== -1) {
      setLoadedFilterRowId(rowId);
      setFilterError("");
    } else {
      setDivisorFilterError("Divisor can not be the same filter");
    }
  };

  const _onDivisorFilterSelectChange = (e: any) => {
    const rowId = e.target.value;
    if (rowId !== loadedFilterRowId || rowId === -1) {
      setLoadedDivisorFilterRowId(rowId);
      setDivisorFilterError("");
    } else {
      setDivisorFilterError("Divisor can not be the same filter");
    }
  };

  const _onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setError("");
  };

  const _onSubmit = () => {
    let canSubmit = validateName();
    if (!validateFilter()) canSubmit = false;

    if (canSubmit) {
      updateComponent({
        name: "Counter",
        wizardType: undefined,
        data: {
          name: name,
          filterId: loadedFilterRowId,
          isPercentage: percentage,
          divisorFilterId: loadedDivisorFilterRowId,
          colorRange: sliderValue,
          greenToRed: greenToRed,
          maxRange: maxRange,
        },
        config: false,
        state: null,
      });
    }
  };

  const validateName = () => {
    const isValid = name.length !== 0;
    if (!isValid) {
      setError("Please enter a name");
    }
    return isValid;
  };

  const validateFilter = () => {
    let isValid = loadedFilterRowId > 0;
    if (!isValid) {
      setFilterError("Please select a filter");
    }
    if (isValid && percentage && loadedFilterRowId === loadedDivisorFilterRowId) {
      setDivisorFilterError("Divisor can not be the same filter");
      isValid = false;
    }
    return isValid;
  };

  const onSliderChange = (e: Event, value: number | number[]) => {
    if (Array.isArray(value)) {
      const [min, max] = value;
      if (max > min) {
        setSliderValue(value);
      }
    }
  };

  function handleColorSwitchChange() {
    setGreenToRed((prev) => !prev);
  }

  useEffect(() => {
    trackPromise(filterService.getAll(), area).then(
      (filters) => {
        if (!isMounted()) return;

        // if (selectors.getSelectedCaseId()) {
        //   // filter by case datasource.
        //   filters = filters.filter(
        //     (x) => getAdvancedFilterDataSource(x.filter) === "iTechWebSimCaseFile"
        //   );
        //   setSavedFilters(filters);
        // } else {
          setSavedFilters(filters);
        // }
        if (data?.data) {
          if (filters.find((x) => x.filter.rowId === data.data.filterId)) {
            setLoadedFilterRowId(data.data.filterId);
          }
          if (filters.find((x) => x.filter.rowId === data.data.divisorFilterId)) {
            setLoadedDivisorFilterRowId(data.data.divisorFilterId);
          }
        }
      },
      (error) => {
        throwError(new Error(error?.message || error));
      }
    );
  }, []);

  function handleSwitchChange(_: any, checked: boolean) {
    setPercentage((prev) => !prev);
    if (checked) {
      // percentage - so reset max to 100, values to defaults
      setMaxRange(100);
      setSliderValue([33,66]);
    }else{
      // clear the divisor filter id
      setLoadedDivisorFilterRowId(-1);
    }
  }

  return (
    <div>
      <Box className={classes.display}>
        <Typography variant="h4" component="h4">
          Configure counter
        </Typography>
        <List component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
          <div className={classes.formSection}>
            <TextField
              value={name}
              margin="normal"
              required
              fullWidth
              id="name"
              label="Counter name"
              name="name"
              autoFocus
              onChange={_onNameChange}
              error={error.length > 0}
              helperText={error}
              className={classes.textField}
            />
          </div>
          <div className={classes.formSection}>
            <Tooltip title="Allows you to see the result as a percentage of all the records in the source or as the percentage of a 2nd filter ">
            <Typography component="label" variant="body2">
              Percentage
            </Typography>
            </Tooltip>
            <Switch checked={percentage} onChange={handleSwitchChange} color="primary" />
          </div>
          <div className={classes.formSection}>
            <Select
              labelId="savedFiltersLabel"
              id="savedFiltersSelect"
              onChange={_onFilterSelectChange}
              value={loadedFilterRowId}
              fullWidth
              error={filterError.length > 0}
            >
              <MenuItem key={-1} value={-1}>
                Select saved filter
              </MenuItem>
              {savedFilters.map &&
                savedFilters.map((f) => (
                  <MenuItem key={f.filter.rowId} value={f.filter.rowId}>
                    <div className={classes.menuFilterItem}>
                      <span>{f.filter.name}</span>
                      <span>{(f.forename ?? '') + " " + (f.surname ?? '')}</span>
                    </div>
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText error={filterError.length > 0}>{filterError}</FormHelperText>
          </div>
          {percentage && (
            <div className={classes.formSection}>
              <Select
                labelId="savedFiltersLabelDivisor"
                id="savedFiltersSelectDivisor"
                onChange={_onDivisorFilterSelectChange}
                value={loadedDivisorFilterRowId}
                fullWidth
                error={divisorFilterError.length > 0}
              >
                <MenuItem key={-1} value={-1}>
                  Select saved filter for divisor
                </MenuItem>
                {savedFilters.map &&
                  savedFilters.map((f) => (
                    <MenuItem key={f.filter.rowId} value={f.filter.rowId}>
                      <div className={classes.menuFilterItem}>
                        <span>{f.filter.name}</span>
                        <span>{(f.forename ?? '') + " " + (f.surname ?? '')}</span>
                      </div>
                    </MenuItem>
                  ))}
              </Select>
              <FormHelperText error={divisorFilterError.length > 0}>
                {divisorFilterError}
              </FormHelperText>
            </div>
          )}
          <div className={classes.formSection}>
            <DiscreteSlider
              title="Counter Colour"
              value={sliderValue}
              onChange={onSliderChange}
              greenToRed={!greenToRed}
              setGreenToRed={handleColorSwitchChange}
              showMaxRange={!percentage}
              maxRange={maxRange}
              setMaxRange={setMaxRange}
              hint="Drag the two markers to set the range for the display colour of the counter for the returned result"
            />
          </div>
        </List>

        <BackButton
          className={classes.formBackBtn}
          onClick={() =>
            updateComponent({
              name: null,
              wizardType: null,
              data: null,
              config: true,
              state: WIZARD_STATE.CHOOSE_COMPONENT,
            })
          }
        />
        <Button className={classes.formSubmitBtn} type="submit" onClick={_onSubmit}>
          <IconManager icon="ArrowForwardIos" /> Submit
        </Button>
      </Box>
    </div>
  );
};

ConfigureCounter.displayName = "ConfigureCounter";

export default ConfigureCounter;
