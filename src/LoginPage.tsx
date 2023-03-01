import React, { ReactElement, useState } from "react";
import { RouteProps } from "react-router";
import { History } from "history";
import { trackPromise } from "react-promise-tracker";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Alert from '@mui/material/Alert';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import makeStyles from '@mui/styles/makeStyles';
import Container from "@mui/material/Container";
import { authenticationService } from "./_services/authenticationService";
import Copyright from "./Copyright";
import LoadingAvatar from "./_components/LoadingAvatar";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  username: {
    float: "right",
  },
  textField: {
    "& .Mui-focused legend": {
      paddingRight: 20,
    },
  },
  passwordField: {
    "& .Mui-focused legend": {
      paddingRight: 10,
    },
  },
}));

type LoginPageProps = {
  location: RouteProps["location"];
  history: History;
};

const LoginPage: React.FC<LoginPageProps> = ({ location, history }): ReactElement => {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginLoadingArea] = useState("loginArea");
  const fromIdleTimeout = location?.search.includes("timedOut=true");

  if (authenticationService.currentUserValue) {
    history.push({ pathname: "/" });
  }

  const onSubmit = (e: any) => {
    e.preventDefault();
    trackPromise(authenticationService.login(username, password), loginLoadingArea).then(
      (rsp) => {
        const from = rsp.landingPage || ((location as any)?.state?.from?.pathname as string) || "/";
        history.push(from);
      },
      (error) => {
        setError(error?.message || error);
      }
    );
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {fromIdleTimeout && <Alert severity="info">You were auto-logged out</Alert>}
        <LoadingAvatar icon={<LockOutlinedIcon />} area={loginLoadingArea} />
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Username or email address"
            name="username"
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
            error={error.length > 0}
            helperText={error}
            className={classes.textField}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            className={classes.passwordField}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button type="submit" fullWidth className={classes.submit}>
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="forgottenPassword" variant="body2">
                Forgot password?
              </Link>
              <Link href="forgottenUsername" variant="body2" className={classes.username}>
                Forgot Username?
              </Link>
            </Grid>
            {/* <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid> */}
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default LoginPage;
