import React from "react";
import { Grid, Paper, TextField, InputAdornment, IconButton } from "@mui/material";
import { CheckCircle, Visibility, VisibilityOff } from "@mui/icons-material";
import { Theme } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import PasswordRequirements from "../_components/PasswordRequirements";
import { settingsService } from "../_services/settingsService";
import { trackPromise } from "react-promise-tracker";
import SuccessMessage from "./SuccessMessage";
import BusyButton from "../_components/BusyButton";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiTextField-root": {
        margin: 4,
      },
      "& label": {
        color: theme.palette.primary.contrastText,
      },
    },
    form: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(2),
    },
    paper: {
      padding: 10,
      color: theme.palette.text.secondary,
    },
    label: {
      alignItems: "center",
      display: "flex",
      fontSize: theme.typography.fontSize,
    },
    submit: {
      display: "flex",
      flexDirection: "column-reverse",
    },
    textField: {
      margin: 5,
    },
  })
);

const ResetPassword: React.FC = () => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [passwordArea] = React.useState("settingsPasswordArea");

  const handleClickShowPassword = () => {
    setShowPassword((pwd) => !pwd);
  };

  const handleClickShowConfirmPassword = () => {
    setConfirmShowPassword((pwd) => !pwd);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit = (e: any) => {
    e.preventDefault();

    if (password.length === 0) {
      setError("Please enter a valid password");
      return;
    }

    if (password !== confirmPassword) {
      setError("passwords do not match");
      return;
    }

    trackPromise(settingsService.updatePassword(password), passwordArea).then(
      (response) => {
        setError(response.error || "");
        setSuccess(!response.error);
      },
      (error) => {
        setError(error);
        setSuccess(false);
      }
    );
  };

  return (
    <form className={classes.form} onSubmit={onSubmit}>
      <Paper variant="outlined" className={classes.paper}>
        <SuccessMessage show={success} message="Password updated!" setShow={setSuccess} />
        <Grid container spacing={3} className={classes.root}>
          <Grid item xs={12}>
            <PasswordRequirements />
          </Grid>
          <Grid container item xs={9} direction="row">
            <Grid item xs={3} className={classes.label}>
              <label htmlFor="pwd">New password:</label>
            </Grid>
            <Grid item xs={8}>
              <TextField
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                id="pwd"
                error={error.length > 0}
                helperText={error}
                className={classes.textField}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        size="large">
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  style: {
                    padding: 10,
                  },
                }}
              />
            </Grid>
            <Grid item xs={3} className={classes.label}>
              <label htmlFor="confirmPwd">Confirm password:</label>
            </Grid>
            <Grid item xs={8}>
              {/* <TextField type="password" id="confirmPwd" variant="outlined"></TextField> */}
              <TextField
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPwd"
                className={classes.textField}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        size="large">
                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  style: {
                    padding: 10,
                  },
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={3} className={classes.submit}>
            <BusyButton type="submit" area={passwordArea} startIcon={<CheckCircle />}>
              Update
            </BusyButton>
          </Grid>
        </Grid>
      </Paper>
    </form>
  );
};

export default ResetPassword;
