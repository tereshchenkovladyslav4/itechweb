import React, { ReactElement, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { History } from "history";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import makeStyles from '@mui/styles/makeStyles';
import PasswordRequirements from "./_components/PasswordRequirements";
import { authenticationService } from "./_services/authenticationService";
import { trackPromise } from "react-promise-tracker";
import AnonymousForm from "./_components/AnonymousForm";
import { RouteProps } from "react-router";
import ValidateReset from "./Model/Types/ValidateReset";
import ResetPasswordResponse from "./Model/Types/ResetPasswordResponse";
import { FormLabel } from "@mui/material";
import { Alert } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  goBack: {
    margin: theme.spacing(3, 0, 2),
  },
  submit: {
    float: "right",
    margin: theme.spacing(3, 0, 2),
  },
  secondPassword: {
    margin: "20px 0 10px 0",
    fontStyle: "italic",
  },
  error: {
    margin: "20px 0",
  },
}));

type ResetPasswordPageProps = {
  location: RouteProps["location"];
  history: History;
};

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  location,
  history,
}): ReactElement => {
  const classes = useStyles();
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [response, setResponse] = useState<ResetPasswordResponse>();
  const [validateReset, setValidateReset] = useState<ValidateReset>();
  const [answer, setAnswer] = useState("");
  const { token } = useParams<{ token: string }>();
  const [error, setError] = useState(!token || token.length <= 1 ? "Invalid token" : "");

  useEffect(() => {
    token &&
      trackPromise(
        authenticationService.validateReset(token).then((response) => {
          setValidateReset(response);
          setError(response.error);
        })
      );
  }, [token]);

  const onSubmit = (e: any) => {
    e.preventDefault();

    if (password1.length === 0) {
      setError("Please submit valid password");
      return Promise.resolve();
    }

    if (password1 !== password2) {
      setError("Passwords do not match");
      return Promise.resolve();
    }

    const { challengeGuid } = validateReset ? validateReset : { challengeGuid: "" };
    return trackPromise(
      authenticationService
        .resetPassword({
          token,
          password: password1,
          challenge: answer,
          challengeGuid,
        })
        .then(
          (response) => {
            setResponse(response);
            setError(response.error);
            if (response.error) return;
            const from: string = (location?.state as string) || "/";
            history.push(from);
          },
          (error) => {
            setError(error);
          }
        )
    );
  };

  return (
    <AnonymousForm
      onSubmit={onSubmit}
      title="Reset Password"
      description={!response ? "Please enter your new password" : ""}
    >
      <>
        {error && (
          <Alert severity="error" className={classes.error}>
            {error}
          </Alert>
        )}
        {!validateReset && !error && (
          <Typography variant="body2" gutterBottom>
            Loading...
          </Typography>
        )}
        {response?.response && (
          <Typography variant="body2" gutterBottom>
            Reset successful. Please log in
          </Typography>
        )}
        {validateReset && !response?.cancelRequest && !validateReset.error && (
          <>
            <PasswordRequirements />

            <FormLabel component="legend" htmlFor="password1">
              New password
            </FormLabel>
            <TextField
              type="password"
              margin="normal"
              fullWidth
              id="password1"
              name="password1"
              autoFocus
              onChange={(e) => setPassword1(e.target.value)}
            />

            <FormLabel component="legend" htmlFor="password2">
              Confirm Password
            </FormLabel>
            <TextField
              type="password"
              margin="normal"
              fullWidth
              id="password2"
              name="password2"
              onChange={(e) => setPassword2(e.target.value)}
            />
            {validateReset?.challengeQuestion && (
              <>
                <Typography variant="body2" gutterBottom className={classes.secondPassword}>
                  {validateReset.challengeQuestion}
                </Typography>
                <TextField
                  type="password"
                  margin="normal"
                  fullWidth
                  id="answer"
                  label="Answer challenge question"
                  name="answer"
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </>
            )}
            <Button type="submit" className={classes.submit}>
              Submit
            </Button>
          </>
        )}
        <Button type="submit" className={classes.goBack} component={Link} to="/">
          Login Page
        </Button>
      </>
    </AnonymousForm>
  );
};

export default ResetPasswordPage;
