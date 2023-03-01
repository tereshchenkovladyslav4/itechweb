import React, { useEffect, useState } from "react";
import { useStore } from "../_context/Store";
import makeStyles from "@mui/styles/makeStyles";
import { trackPromise } from "react-promise-tracker";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import BusyButton from "../_components/BusyButton";
import { AccountCircle, Add, Cancel, Delete, Save } from "@mui/icons-material";
import { reportConfigurationService } from "../_services/reportConfigurationService";
import DatePicker from "react-datepicker";
import {
  Avatar,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Portal,
  Select,
  Typography,
} from "@mui/material";
import UserSearch, { SearchDataType } from "../Filter/UserSearch";
import { ITechDataSecurityObject } from "../Model/iTechRestApi/ITechDataSecurityObject";
import { IReportConfiguration } from "../Model/iTechRestApi/IReportConfiguration";
import { securityObjectService } from "../_services/securityObjectService";
import "../_components/DatePicker.css";

const useStyles = makeStyles(() => ({
  error: { color: "Red" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    minWidth: 500,
    margin: "20px 30px",
  },
  formControl: {
    margin: "16px 0 0 0",
    display: "flex",
    flexWrap: "nowrap",
  },
  listItem: {
    padding: 5,
    borderRadius: 5,
    cursor: "pointer",
  },
  add: {
    marginTop: 10,
    maxWidth: 100,
  },
}));

interface IAddReport {
  open: boolean;
  setOpen: (open: boolean) => void;
  gid?: string | number | undefined;
  submit: (submit: IReportConfiguration) => Promise<void>;
}

interface ISchedule {
  startDate: Date;
  dateRepeat: number;
}

const AddReport: React.FC<IAddReport> = ({ open, setOpen, gid, submit }: IAddReport) => {
  const classes = useStyles();
  const { selectors } = useStore();
  const [loadingArea] = useState("SaveReportLoadingArea");
  const [saveReportButtonText, setSaveReportButtonText] = useState("Save");
  const [error, setError] = useState("");
  const dateFormat = "dd/MM/yyyy"; // display format
  const defaultDateRepeat = 0;
  const _defaultSchedule = () => {
    return {
      startDate: new Date(),
      dateRepeat: defaultDateRepeat,
    } as ISchedule;
  };
  const [schedule, setSchedule] = useState<ISchedule>(_defaultSchedule());
  const [currentUser, setCurrentUser] = useState<ITechDataSecurityObject | undefined>();
  const _defaultConfiguration = (): IReportConfiguration => {
    return {
      schedule: "",
      iTechDataWebTabRowId: selectors.getSelectedTabId() || 0,
      recipients: [],
      json: "",
      gid: 0,
    } as IReportConfiguration;
  };
  const [configuration, setConfiguration] = useState<IReportConfiguration>(_defaultConfiguration());
  const dateRepeats = [
    { name: "Once", id: 0 },
    { name: "Daily", id: 1 },
    { name: "Weekly", id: 2 },
    { name: "Every fortnight", id: 3 },
    { name: "Monthly", id: 4 },
    { name: "Yearly", id: 5 },
  ];

  useEffect(() => {
    _setCurrentUser();
    setError("");
  }, []);

  const _setCurrentUser = () => {
    securityObjectService.current().then((x) => {
      setConfiguration((prev) => ({
        ...prev,
        recipients: [x],
      }));
    });
  };

  useEffect(() => {
    if (!gid) {
      setConfiguration(_defaultConfiguration());
      setSchedule(_defaultSchedule());
      _setCurrentUser();
    } else {
      reportConfigurationService.get(gid).then((x) => {
        const newSchedule = JSON.parse(x.json);
        setSchedule({
          startDate: new Date(newSchedule.startDate),
          dateRepeat: newSchedule.dateRepeat,
        });
        setConfiguration(x);
      });
    }
  }, [gid]);

  const handleSave = async () => {
    if (configuration.recipients.length === 0) {
      setError("Please select a recipient");
      return;
    }

    const config = {
      ...configuration,
      json: JSON.stringify(schedule),
      schedule: `From ${schedule.startDate.toISOString().split("T")[0]}, ${
        dateRepeats.find((x) => x.id === schedule.dateRepeat)?.name ?? "Once"
      }`,
    } as IReportConfiguration;
    trackPromise(
      submit(config).then(
        () => {
          setSaveReportButtonText("Saved!");
        },
        (error: any) => {
          if (typeof error === "string") {
            setError(error);
          }
          setSaveReportButtonText("Save");
          // ensure skip the next then chain
          return Promise.reject(error);
        }
      ),
      loadingArea
    )
      .then(() => {
        setOpen(false);
        setSaveReportButtonText("Save");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleClose = () => {
    open = false;
  };

  const _container = ({ children }: any) => {
    return <Portal>{children}</Portal>;
  };

  const _handleSelectChange = (val: number) => {
    setSchedule((prev) => ({ ...prev, dateRepeat: val }));
  };

  const _addUser = () => {
    if (!currentUser) return;
    setConfiguration((prev) => ({
      ...prev,
      recipients: [...configuration.recipients, currentUser],
    }));
    setCurrentUser(undefined);
  };

  const _removeUser = (rowId: number) => {
    setConfiguration((prev) => ({
      ...prev,
      recipients: prev.recipients.filter((u) => u.rowId !== rowId),
    }));
  };

  const _renderUsers = () => {
    return (
      <>
        <DialogContentText>Recipients</DialogContentText>
        <UserSearch
          datatype={SearchDataType.SecurityObject}
          value={currentUser ? currentUser : ""}
          setValue={setCurrentUser}
          isLogin
          style={{ width: "100%" }}
        />
        <Button onClick={_addUser} className={classes.add}>
          <Add /> Add
        </Button>
        <Grid item xs={12} md={6}>
          <List dense>
            {configuration.recipients?.map((user) => {
              return (
                <ListItem key={user.rowId} classes={{ root: classes.listItem }}>
                  <ListItemAvatar>
                    <Avatar>
                      <AccountCircle />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={`${user.forename} ${user.surname}`} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      size="small"
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

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <div className={classes.header}>
          <Typography variant="h4">Create Report Schedule</Typography>
        </div>
        <DialogContent>
          {error && <DialogContentText className={classes.error}>{error}</DialogContentText>}

          <DialogContentText>
            Start{" "}
            <DatePicker
              selected={schedule.startDate}
              onChange={(date) => setSchedule((prev) => ({ ...prev, startDate: date as Date }))}
              dateFormat={dateFormat}
              popperContainer={_container}
              todayButton="Today"
            />
          </DialogContentText>
          <FormControl className={classes.formControl}>
            <Select
              labelId="dateSelectLabel"
              id="dateSelect"
              onChange={(e) => _handleSelectChange(parseInt(e.target.value as string))}
              value={schedule.dateRepeat}
            >
              {dateRepeats.map((date) => (
                <MenuItem key={date.name} value={date.id}>
                  {date.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>{_renderUsers()}</FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setError("");
            }}
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <BusyButton onClick={handleSave} area={loadingArea} startIcon={<Save />}>
            {saveReportButtonText}
          </BusyButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddReport;
