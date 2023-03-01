import React, { ReactElement, useState, useEffect } from "react";
import { Container, Button, Typography, Grid, TextField, Paper } from "@mui/material";
import { Alert } from "@mui/material";
import { Link } from "react-router-dom";
import makeStyles from "@mui/styles/makeStyles";
import { trackPromise } from "react-promise-tracker";
import { dualAuthService } from "./_services/dualAuthService";
import SuccessMessage from "./Settings/SuccessMessage";
import Avatar from "@mui/material/Avatar";
import VpnKey from "@mui/icons-material/VpnKey";
import { logOutUserAction } from "./_context/actions/UserActions";
import { useHistory } from "react-router-dom";
import { useStore } from "./_context/Store";
import Countdown from "./_components/Countdown";
import { authenticationService } from "./_services/authenticationService";
import { UserType } from "./Model/iTechRestApi/AuthenticateResponse";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    "& .MuiTextField-root": {
      margin: 4,
    },
    "& .MuiSelect-root": {
      padding: 11,
    },
  },
  container: {
    display: "flex",
    justifyContent: "center",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(5px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    marginTop: theme.spacing(4),
    width: "max-content",
  },
  paper: {
    padding: 10,
    margin: "10px 0",
  },
  heading: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    "& .MuiTypography-root": {
      color: theme.palette.secondary.contrastText,
    },
  },
  form: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  submit: {
    display: "flex",
    flexDirection: "column-reverse",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  label: {
    alignItems: "center",
    display: "flex",
    fontSize: 14,
    marginTop: 10,
  },
  title: {
    alignItems: "center",
    display: "flex",
    fontSize: 16,
    fontWeight: "bold",
  },
  textField: {
    width: 100,
  },
  fieldContainer: {
    padding: "10px 0",
  },
  submitContainer: {
    padding: 16,
  },
  countdown: {
    position: "absolute",
    right: 10,
    top: 10,
  },
}));

interface IDualAuthProps {
  mobileNo: string;
  emailAddress: string;
  submitted: string;
  error: string;
}

interface DualAuth {
  mobileNo: string;
  emailAddress: string;
  submitted: string;
  error: string;
}

const DualAuthPage: React.FC<IDualAuthProps> = (): ReactElement => {
  const classes = useStyles();
  const [response, setResponse] = useState<DualAuth>();
  const history = useHistory();
  const { dispatch } = useStore();
  const timeoutDuration = 600;
  const [counter, setCounter] = useState(0);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [mobile, setMobileNo] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [code, setCode] = useState("");

  const onSubmit = (e: any) => {
    e.preventDefault();
    trackPromise(
      dualAuthService.code(code).then(
        (response) => {
          setError(response.error || "");
          if (response.success) {
            if (authenticationService.currentUserValue) {
              authenticationService.currentUserValue.dualAuthenticated = true;
            }
            if (authenticationService.currentUserValue?.userType === UserType.external) {
              history.push({ pathname: (history as any)?.location?.state?.from?.pathname });
            } else {
              history.push({ pathname: "/" });
            }
          }
        },
        (error) => {
          setError(error?.message);
          setSuccess(false);
        }
      )
    );
  };

  useEffect(() => {
    !response &&
      error?.length === 0 &&
      trackPromise(
        dualAuthService
          .get()
          .then((response) => {
            setResponse(response);
            setError(response?.error || "");
            setEmail(response?.emailAddress || "");
            setMobileNo(response?.mobileNo || "");
            setSubmitted(response?.submitted || "");
            if (response.submitted) {
              setCounter(timeoutDuration);
            }
          })
          .catch((error) => setError(error?.message))
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    counter === 0 && setCounter(-1);
  }, [counter]);

  const _logout = () => {
    authenticationService.logout();
    dispatch(logOutUserAction());
    history.push("/login");
  };

  const _chooseSubmitted = (identifier: string) => {
    setSubmitted(identifier);
    setCode("");
    trackPromise(
      dualAuthService.identifier(identifier).then(
        (response) => {
          setError(response.error || "");
          setSuccess(!response.error);
          if (!response.error) {
            setCounter(timeoutDuration);
          }
        },
        (error) => {
          setError(error?.message);
          setSuccess(false);
        }
      )
    );
  };

  return (
    <Container maxWidth="md" className={classes.container}>
      <div className={classes.paper}>
        <div className={classes.heading}>
          <Avatar className={classes.avatar}>
            <VpnKey />
          </Avatar>
          <Typography component="h1" variant="h5">
            Dual Authentication
          </Typography>
        </div>
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
        <SuccessMessage
          show={success}
          message={`Dual auth submitted to ${submitted}`}
          setShow={setSuccess}
        />
        {!response && !error && (
          <Typography variant="body2" gutterBottom>
            Loading...
          </Typography>
        )}
        {response && (
          <Paper variant="outlined" className={classes.paper}>
            <Grid container spacing={3} className={classes.root}>
              <Grid container item xs={9} direction="row">
                {submitted && counter > 0 && (
                  <>
                    <div className={classes.countdown}>
                      <Countdown
                        duration={timeoutDuration}
                        timeLeft={counter}
                        completed={counter === 0}
                        completedText="EXPIRED"
                      />
                    </div>
                    <Grid item xs={2} className={classes.fieldContainer}>
                      <TextField
                        required
                        type="text"
                        id="code"
                        placeholder="Enter Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className={classes.textField}
                        inputProps={{
                          style: {
                            padding: 10,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={9} className={classes.submitContainer}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        onClick={onSubmit}
                      >
                        Submit Code
                      </Button>
                    </Grid>
                  </>
                )}
                {submitted && counter < 0 && (
                  <Grid item xs={11} className={classes.title}>
                    Code expired
                  </Grid>
                )}
                {(email || mobile) && (
                  <Grid item xs={11} className={classes.title}>
                    Send {submitted && "again"} to
                  </Grid>
                )}
                {email && (
                  <Grid item xs={11} className={classes.label}>
                    <Button onClick={() => _chooseSubmitted(email)}>{email}</Button>
                  </Grid>
                )}
                {mobile && (
                  <Grid item xs={11} className={classes.label}>
                    <Button onClick={() => _chooseSubmitted(mobile)}>{mobile}</Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Paper>
        )}
        <div>
          <Button type="submit" component={Link} to="/" onClick={_logout}>
            Go Back
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default DualAuthPage;
