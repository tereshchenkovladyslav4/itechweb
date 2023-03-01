import React, { ReactElement, useState, useEffect } from "react";
import { Container, Button, Typography, Grid, TextField, Paper } from "@mui/material";
import { Alert } from '@mui/material';
import { Link } from "react-router-dom";
import makeStyles from '@mui/styles/makeStyles';
import { trackPromise } from "react-promise-tracker";
import { logOutUserAction } from "./_context/actions/UserActions";
import { useHistory } from "react-router-dom";
import { useStore } from "./_context/Store";
import { authenticationService } from "./_services/authenticationService";
import { challengeService } from "./_services/challengeService";
import { validEmail, validPhoneNo } from "./Settings/validation";
import SuccessMessage from "./Settings/SuccessMessage";
import Avatar from "@mui/material/Avatar";
import Lock from "@mui/icons-material/Lock";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

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
  },

  heading: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
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
    marginBottom: 10,
  },
  textField: {
    width: 350,
  },
  fieldContainer: {
    padding: "10px 0",
  },
  select: {
    width: 350,
  },
}));

interface IChallengeProps {
  mobileNo: string;
  emailAddress: string;
  challengeQuestions: any;
  existingChallenge: boolean;
  error: string;
}

interface Challenge {
  mobileNo: string;
  emailAddress: string;
  challengeQuestions: any;
  existingChallenge: boolean;
  error: string;
}

const ChallengePage: React.FC<IChallengeProps> = (): ReactElement => {
  const classes = useStyles();
  const [response, setResponse] = useState<Challenge>();
  const history = useHistory();
  const { dispatch } = useStore();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [mobileNoError, setMobileNoError] = useState("");
  const [mobileNo, setMobileNo] = useState("");

  const [emailError, setEmailError] = useState("");
  const [email, setEmail] = useState("");

  const [challengeQuestions, setChallengeQuestions] = useState<any[]>([]);
  const [challengeQuestionValue, setChallengeQuestionValue] = useState("");
  const [challengeAnswer, setChallengeAnswer] = useState("");

  const validateEmail = (value: string): boolean => {
    if (!value) return true;

    if (!validEmail(value)) {
      setEmailError("Invalid email address.");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validateTelNo = (value: string): boolean => {
    if (!value) return true;

    if (!validPhoneNo(value)) {
      setMobileNoError("Invalid phone number format.");
      return false;
    } else {
      setMobileNoError("");
      return true;
    }
  };

  const onSubmit = (e: any) => {
    e.preventDefault();

    if (!validateTelNo(mobileNo)) return;
    if (!validateEmail(email) || !email) return;
    if (!challengeAnswer) return;

    const challengeRequest = {
      mobileNo: mobileNo,
      emailAddress: email,
      answer: challengeAnswer,
      challengeGuid: challengeQuestionValue,
    };

    trackPromise(
      challengeService.put(challengeRequest).then(
        (response) => {
          setError(response.error || "");
          setError(response.error || "");
          if (response.success) {
            if (authenticationService.currentUserValue) {
              authenticationService.currentUserValue.dateChallenged = new Date();
            }
            history.push({ pathname: "/" });
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
    // !response &&
    //   trackPromise(
    //     challengeService.get().then((response) => {
    //       setResponse(response);
    //       setError(response?.error || "");
    //       setChallengeQuestions(response?.challengeQuestions);
    //       if (response?.mobileNo) setMobileNo(response?.mobileNo);
    //       setEmail(response?.emailAddress);
    //       setChallengeQuestionValue(
    //         response?.challengeQuestions[0]?.values.find((c: any) => c.column.columnName === "guid")
    //           ?.value
    //       );
    //     })
    //   );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _logout = () => {
    authenticationService.logout();
    dispatch(logOutUserAction());
    history.push("/login");
  };

  const _getVal = (row: any, colName: string) => {
    return row.values.find((c: any) => c.column.columnName === colName)?.value;
  };

  return (
    <Container maxWidth="md" className={classes.container}>
      <div className={classes.paper}>
        <div className={classes.heading}>
          <Avatar className={classes.avatar}>
            <Lock />
          </Avatar>
          <Typography component="h1" variant="h5">
            Challenge Question
          </Typography>
        </div>
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
        <SuccessMessage show={success} message="Challenge answer submitted" setShow={setSuccess} />
        {!response && !error && (
          <Typography variant="body2" gutterBottom>
            Loading...
          </Typography>
        )}
        {response && (
          <form className={classes.form} onSubmit={onSubmit}>
            <Paper variant="outlined" className={classes.paper}>
              <Grid container spacing={3} className={classes.root}>
                <Grid container item xs={9} direction="row">
                  <Grid item xs={11} className={classes.title}>
                    We are making your account more secure. To help us identify you in the future
                    please select a challenge question and submit your answer.
                  </Grid>
                  <Grid item xs={3} className={classes.label}>
                    <label htmlFor="challengeLabel">Please choose:</label>
                  </Grid>
                  <Grid item xs={9}>
                    <Select
                      labelId="challengeLabel"
                      id="challengeSelect"
                      onChange={(e: any) => setChallengeQuestionValue(e.target.value)}
                      value={challengeQuestionValue}
                      displayEmpty
                      defaultValue=""
                      className={classes.select}
                    >
                      {challengeQuestions?.map((row) => {
                        return (
                          <MenuItem key={_getVal(row, "guid")} value={_getVal(row, "guid")}>
                            {_getVal(row, "question")}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </Grid>

                  <Grid item xs={11} className={classes.fieldContainer}>
                    <TextField
                      required
                      type="password"
                      id="challengeAnswer"
                      placeholder="Answer"
                      value={challengeAnswer}
                      onChange={(e) => setChallengeAnswer(e.target.value)}
                      className={classes.textField}
                      inputProps={{
                        style: {
                          padding: 10,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={11} className={classes.title}>
                    Please confirm your contact details.
                  </Grid>

                  <Grid item xs={3} className={classes.label}>
                    <label htmlFor="email">Email address:</label>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      placeholder="Required"
                      required
                      fullWidth
                      type="email"
                      id="email"
                      onBlur={(e) => validateEmail(e.target.value)}
                      error={emailError.length > 0}
                      helperText={emailError}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      error={mobileNoError.length > 0}
                      helperText={mobileNoError}
                      value={mobileNo}
                      onChange={(e) => setMobileNo(e.target.value)}
                      className={classes.textField}
                      inputProps={{
                        style: {
                          padding: 10,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Button type="submit" variant="contained" color="secondary">
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </form>
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

export default ChallengePage;
