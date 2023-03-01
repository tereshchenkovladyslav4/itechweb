import React, { ReactElement, useEffect, useState } from "react";
import { RouteProps } from "react-router";
import { History } from "history";
import { trackPromise } from "react-promise-tracker";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import Container from "@mui/material/Container";
import { authenticationService } from "./_services/authenticationService";
import Copyright from "./Copyright";
import LoadingAvatar from "./_components/LoadingAvatar";
import { loginSaml } from "./authConfig";
import { myMsal } from "./authConfig";
import { iTechDataAuthEnum } from "./Model/iTechRestApi/iTechDataAuthEnum";
import { Divider, FormLabel } from "@mui/material";
import insightful from "./images/InsightLogoHD.png";
import soteria from "./images/soterialogoopaque.png";

const useStyles = makeStyles((theme) => ({
  container: {
    // background: "rgba(255, 255, 255, 0.2)",
    // borderRadius: 16,
    // boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    // backdropFilter: "blur(5px)",
    // border: "1px solid rgba(255, 255, 255, 0.3)",
    height: "100%",
    "& .MuiFormLabel-root": {
      color: theme.palette.secondary.contrastText,
    },
    display: "flex",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "auto",
    minWidth: 360,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(4),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  username: {
    float: "right",
  },
  textField: {
    "& input": {
      ...theme.typography.body1,
    },
  },
  passwordField: {
    "& input": {
      ...theme.typography.body1,
    },
  },
  icon: {
    width: 40,
    height: 40,
  },
  insightful: {
    margin: 20,
    width: "10vw",
  },
  soteria: {
    margin: "auto 0",
    height: "7vh",
  },
  flex: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  bottom: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    "& a:link": { textDecoration: "none" },
    "& a:visited ": { textDecoration: "none" },
    "& a:hover ": { textDecoration: "none" },
    "& a:active ": { textDecoration: "none" },
  },
  col: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "30%",
    "& img": {
      maxHeight: 100,
    },
  },
  highlight: {
    color: theme.palette.primary.active,
  },
  ad: {
    color: theme.palette.secondary.contrastText,
    textDecoration: "none",
    margin: 10,
  },
}));

type LoginPageProps = {
  location: RouteProps["location"];
  history: History;
};

const LoginPage2: React.FC<LoginPageProps> = ({ location, history }): ReactElement => {
  const classes = useStyles();
  let tenant = location?.pathname?.replaceAll("/", "");
  if (tenant === "login") tenant = undefined;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState("");
  const [loginLoadingArea] = useState("loginArea");
  const [showPassword, setShowPassword] = useState(false);

  const fromIdleTimeout = location?.search.includes("timedOut=true");
  const msal = myMsal;
  const isAuthenticated = (msal?.getAllAccounts()?.length || 0) > 0;

  useEffect(() => {
    if (tenant && !redirecting) {
      if (!isAuthenticated) {
        setRedirecting(true);
        (async () => {
          // get auth config based on tenant/company
          const url = location?.pathname;
          if (url) {
            authenticationService.getTenantConfig(window.location.href).then(
              (rsp) => {
                if (rsp && rsp.authConfigJson) {
                  doLogin(rsp.authConfigJson);
                } else {
                  // not found the company or has no authconfig -  redirect to /login
                  history.push("/");
                }
              },
              () => {
                // error
                history.push("/");
              }
            );
          }
        })();
      }
    }
  }, []);

  async function doLogin(configJson: string) {
    try {
      await loginSaml(configJson);
    } catch (error) {
      if (error instanceof Error) {
        const msg = error?.toString() || "An error has occurred";
        setError(msg);
      }
      console.log(error);
    }
  }

  if (authenticationService.currentUserValue) {
    history.push({ pathname: "/" });
  }

  const onUsernameSubmit = (e: any) => {
    e.preventDefault();
    trackPromise(authenticationService.getUserAuthType(username), loginLoadingArea).then(
      (rsp) => {
        if (rsp) {
          if (rsp.iTechDataAuthTypeRowId === iTechDataAuthEnum.msal) {
            setShowPassword(false);
            doLogin(rsp.authConfigJson);
          } else {
            setShowPassword(true);
          }
        } else {
          setShowPassword(true);
        }
        setError("");
      },
      (error) => {
        if (typeof error === "object") {
          setError(error?.message || error?.Username);
        } else {
          setError(error);
        }
      }
    );
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    trackPromise(authenticationService.login(username, password), loginLoadingArea).then(
      (rsp) => {
        const from = rsp.landingPage || ((location as any)?.state?.from?.pathname as string) || "/";
        history.push(from);
      },
      (error) => {
        if (typeof error === "object") {
          setError(error?.message || error?.Password);
        } else {
          setError(error);
        }
      }
    );
  };

  return (
    <Box className={classes.flex}>
      <img src={insightful} className={classes.insightful} />
      <Divider variant="middle" />
      <Container component="main" maxWidth="xs" className={classes.container}>
        {/* <CssBaseline /> */}
        <div className={classes.paper}>
          {fromIdleTimeout && <Alert severity="info">You were auto-logged out</Alert>}
          <LoadingAvatar
            icon={<LockOutlinedIcon className={classes.icon} />}
            area={loginLoadingArea}
          />
          {/* <Typography component="h1" variant="h5">
          Sign in
        </Typography> */}
          {!tenant && !showPassword && (
            <form className={classes.form} noValidate onSubmit={onUsernameSubmit}>
              <FormLabel component="legend" htmlFor="email">
                Username / email address
              </FormLabel>
              <TextField
                margin="normal"
                fullWidth
                id="email"
                //label="Username / email address"
                placeholder="forename.surname"
                name="username"
                autoFocus
                onChange={(e) => setUsername(e.target.value)}
                error={error.length > 0}
                helperText={error}
                className={classes.textField}
              />
              <Button type="submit" fullWidth className={classes.submit}>
                Next
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="forgottenUsername" variant="body2" className={classes.username}>
                    Forgot Username?
                  </Link>
                </Grid>
              </Grid>
            </form>
          )}

          {!tenant && showPassword && (
            <form className={classes.form} noValidate onSubmit={onSubmit}>
              <FormLabel component="legend" htmlFor="password">
                Password
              </FormLabel>
              <TextField
                margin="normal"
                fullWidth
                name="password"
                //label="Password"
                //placeholder="********"
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                className={classes.passwordField}
                error={error.length > 0}
                helperText={error}
              />

              <Button type="submit" fullWidth className={classes.submit}>
                Sign In
              </Button>

              <Grid container>
                <Grid item xs>
                  <Link href="forgottenPassword" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>

                <Grid container item xs alignContent="center" justifyContent="center">
                  <Button
                    onClick={() => {
                      setError("");
                      setShowPassword(false);
                    }}
                  >
                    &lt; Back
                  </Button>
                </Grid>

                <Grid item xs>
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
          )}
        </div>
      </Container>
      <Divider variant="middle" />
      <Box className={classes.bottom}>
        <img src={soteria} className={classes.soteria} />
        <Box className={classes.col}>
          <a href="https://insightfultechnology.com/fusion-grid/" target="_blank" rel="noreferrer">
            <Box className={classes.ad}>
              <Typography variant="h4">
                <span className={classes.highlight}>Secure</span> Capture
              </Typography>
              <Typography>
                We capture, process and store over 150 data feeds (including WhatsApp) into our
                secure archive solution
              </Typography>
            </Box>
          </a>
          <a
            href="https://insightfultechnology.com/compliant-teams-recording/"
            target="_blank"
            rel="noreferrer"
          >
            <Box className={classes.ad}>
              <Typography variant="h4">
                <span className={classes.highlight}>Teams</span> Certified
              </Typography>
              <Typography>
                Our resilient global network infrastructure of Microsoft Teams recorders is a
                Certified by Microsoft solution
              </Typography>
            </Box>
          </a>
        </Box>
        <Box className={classes.col}>
          <a
            href="https://insightfultechnology.com/soteria-Compliance/"
            target="_blank"
            rel="noreferrer"
          >
            <Box className={classes.ad}>
              <Typography variant="h4">
                <span className={classes.highlight}>Advanced</span> Surveillance
              </Typography>
              <Typography>
                We provide advanced compliance monitoring with our audio transcription combined with
                our surveillance engine
              </Typography>
            </Box>
          </a>
          <a href="https://insightfultechnology.com/audio-assure/" target="_blank" rel="noreferrer">
            <Box className={classes.ad}>
              <Typography variant="h4">
                <span className={classes.highlight}>Audio</span> Assure
              </Typography>
              <Typography>
                Our ASSURE solution provides automated voice infrastructure monitoring and recorder
                integrity checking
              </Typography>
            </Box>
          </a>
        </Box>
      </Box>
      <Divider variant="middle" />
      <Box m={6}>
        <Copyright />
      </Box>
    </Box>
  );
};

export default LoginPage2;
