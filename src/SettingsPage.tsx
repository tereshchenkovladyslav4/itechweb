import React, { ReactElement, useState, useEffect } from "react";
import { Container, Button, Typography, Grid, TextField, Paper, MenuItem } from "@mui/material";
import { Alert } from '@mui/material';
import ResetPassword from "./Settings/ResetPassword";
import { Link } from "react-router-dom";
import { settingsService } from "./_services/settingsService";
import { trackPromise } from "react-promise-tracker";
import { validEmail, validPhoneNo } from "./Settings/validation";
import timezones from "./Settings/timezones";
import SuccessMessage from "./Settings/SuccessMessage";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LoadingAvatar from "./_components/LoadingAvatar";

import ToggleTheme from "./_theme/toggleTheme";
import { useDarkMode } from "./_helpers/hooks/useDarkMode";
import { UserSettings } from "./Model/iTechRestApi/UserSettings";
import { useStyles } from "./SettingsPage.styles";
import useErrors from "./_helpers/hooks/useErrors";
import { capitalize } from "./_helpers/utilities";
import BusyButton from "./_components/BusyButton";
import { ArrowBackIos, CheckCircle } from "@mui/icons-material";
import { authenticationService } from "./_services/authenticationService";
import { iTechDataAuthEnum } from "./Model/iTechRestApi/iTechDataAuthEnum";

const SettingsPage: React.FC = (): ReactElement => {
  const classes = useStyles();
  const [settings, setSettings] = useState<UserSettings>(new UserSettings());
  const { hasError, getErrors, setError, clearError, setErrors } = useErrors();

  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const [busyArea] = useState("settingsBusyArea");
  const [settingsArea] = useState("settingsArea");

  const [theme, toggleTheme] = useDarkMode();

  const userAuthType =
    authenticationService.currentUserValue?.authenticatedUser?.iTechDataAuthTypeRowId;
  const showUserDetail = userAuthType !== iTechDataAuthEnum.msal;

  const validateEmail = (value: string): boolean => {
    clearError("EmailAddress");

    if (!value) return true;

    if (!validEmail(value)) {
      setError("EmailAddress", "Invalid email address.");
      return false;
    } else {
      return true;
    }
  };

  const validateTelNo = (value: string): boolean => {
    clearError("MobileNo");
    if (!value) return true;

    if (!validPhoneNo(value)) {
      setError("MobileNo", "Invalid phone number format.");
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    trackPromise(
      settingsService.get().then((response) => {
        setSettings(response);
        setLoading(false);
      }),
      busyArea
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e: any) => {
    e.preventDefault();

    if (!validateTelNo(settings.mobileNo)) return;
    if (!validateEmail(settings.emailAddress)) return;

    trackPromise(settingsService.put(settings), settingsArea).then(
      (response) => {
        setFormError(response.error || "");
        setSuccess(!response.error);
      },
      (error) => {
        if (typeof error === "string") {
          setFormError(error);
        } else if (typeof error === "object") {
          setErrors(error);
        }
        setSuccess(false);
      }
    );
  };

  const handleTimezoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, timezone: event.target.value }));
  };

  const setValue = (key: keyof UserSettings) => {
    return (e: any) => {
      const val = (
        e.target?.checked !== undefined && e.target.type === "checkbox"
          ? e.target.checked
          : e.target?.value !== undefined
          ? e.target.value
          : e
      ) as never;
      setSettings((prev) => {
        const items = { ...prev };
        items[key] = val;
        return items;
      });
      // Model errors are keyed off the full model name from server.. ( uppercase prop )
      clearError(capitalize(key));
      setFormError("");
    };
  };
  return (
    <Container maxWidth="md">
      <div className={classes.paper}>
        <div className={classes.heading}>
          <LoadingAvatar icon={<AccountCircleOutlinedIcon />} area={busyArea} />
          <Typography component="h1" variant="h5">
            Change user settings
          </Typography>
        </div>
        {formError && (
          <Grid item xs={12}>
            <Alert severity="error">{formError}</Alert>
          </Grid>
        )}
        <SuccessMessage show={success} message="User settings updated!" setShow={setSuccess} />
        {showUserDetail && <ResetPassword />}
        {loading && !formError && (
          <Typography variant="body2" gutterBottom>
            Loading...
          </Typography>
        )}
        {!loading && (
          <>
            <form className={classes.form} onSubmit={onSubmit}>
              <Paper variant="outlined" className={classes.paper}>
                <Grid container spacing={3} className={classes.root}>
                  <Grid container item xs={9} direction="row">
                    {showUserDetail && (
                      <>
                        <Grid item xs={3} className={classes.label}>
                          <label htmlFor="email">Email address*:</label>
                        </Grid>
                        <Grid item xs={8}>
                          <TextField
                            required
                            fullWidth
                            type="email"
                            id="email"
                            onBlur={(e) => validateEmail(e.target.value)}
                            error={hasError("EmailAddress")}
                            helperText={getErrors("EmailAddress")}
                            value={settings.emailAddress || ""}
                            onChange={setValue("emailAddress")}
                            className={classes.textField}
                            inputProps={{
                              style: {
                                padding: 10,
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={3} className={classes.label}>
                          <label htmlFor="phoneNo">Mobile number:</label>
                        </Grid>
                        <Grid item xs={8}>
                          <TextField
                            placeholder="Optional"
                            fullWidth
                            type="tel"
                            id="phoneNo"
                            onBlur={(e) => validateTelNo(e.target.value)}
                            error={hasError("MobileNo")}
                            helperText={getErrors("MobileNo")}
                            value={settings?.mobileNo || ""}
                            onChange={setValue("mobileNo")}
                            className={classes.textField}
                            inputProps={{
                              style: {
                                padding: 10,
                              },
                            }}
                          />
                        </Grid>
                      </>
                    )}
                    <Grid item xs={3} className={classes.label}>
                      <label htmlFor="timezone">Timezone:</label>
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        select
                        id="timezone"
                        value={settings?.timezone || ""}
                        fullWidth
                        onChange={handleTimezoneChange}
                        classes={{ root: classes.root }}
                      >
                        {timezones.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.displayName}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                  <Grid item xs={3} className={classes.submit}>
                    <BusyButton area={settingsArea} type="submit" startIcon={<CheckCircle />}>
                      Update
                    </BusyButton>
                  </Grid>
                </Grid>
              </Paper>
            </form>
            <Paper variant="outlined" className={classes.paper}>
              <Grid container spacing={3} className={classes.root}>
                <Grid container item xs={9} direction="row">
                  <Grid item xs={3} className={classes.label}>
                    <ToggleTheme theme={theme} toggleTheme={toggleTheme} />
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
            <div className={classes.backBtn}>
              <Button type="submit" component={Link} to="/">
                <ArrowBackIos /> Go Back
              </Button>
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

export default SettingsPage;
