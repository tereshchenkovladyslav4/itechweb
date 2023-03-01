import React, { ReactElement, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import MuiLink from "@mui/material/Link";
import { authenticationService } from "./_services/authenticationService";
import { trackPromise } from "react-promise-tracker";
import AnonymousForm from "./_components/AnonymousForm";
import { FormLabel } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  goBack: {
    margin: theme.spacing(3, 0, 2),
  },
  submit: {
    float: "right",
    margin: theme.spacing(3, 0, 2),
  },
  detail: {
    margin: "20px 0",
    fontStyle: "italic",
  },
}));

const ForgottenPasswordPage: React.FC = (): ReactElement => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e: any) => {
    e.preventDefault();

    if (email.length === 0) {
      setError("Please submit email or username");
      return Promise.resolve();
    }

    return trackPromise(
      authenticationService.forgottenPassword(email).then(
        (response) => {
          setResponse(response.message || "");
          setError("");
        },
        (error) => {
          setResponse("");
          setError(error);
        }
      )
    );
  };

  return (
    <AnonymousForm
      onSubmit={onSubmit}
      title="Forgotten Password"
      description="Enter your registered email address or login username"
    >
      <>
        <FormLabel component="legend" htmlFor="email">
          Username or email address
        </FormLabel>
        <TextField
          margin="normal"
          fullWidth
          id="email"
          name="email"
          placeholder="john.smith@mycompany.com OR john.smith"
          autoFocus
          onChange={(e) => setEmail(e.target.value)}
          error={error.length > 0}
          helperText={error || response}
          disabled={response.length > 0}
        />
        <Typography variant="body2" gutterBottom className={classes.detail}>
          Once your email address is submitted you will receive an email with a verification link.
          If you do not receive this email or you have not registered your contact information
          please contact our{" "}
          <MuiLink href="mailto:support@insightfultechnology.com" variant="body2">
            support team
          </MuiLink>
          .
        </Typography>
        <Button type="submit" className={classes.goBack} component={Link} to="/">
          Go Back
        </Button>
        <Button type="submit" className={classes.submit} disabled={response.length > 0}>
          Submit
        </Button>
      </>
    </AnonymousForm>
  );
};

export default ForgottenPasswordPage;
