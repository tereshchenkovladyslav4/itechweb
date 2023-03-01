import React, { ReactElement, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import MuiLink from "@mui/material/Link";
import { authenticationService } from "./_services/authenticationService";
import { trackPromise } from "react-promise-tracker";
import { Form, formFieldType, IFormField } from "./_components/Form";
import { length, required } from "./_components/form.validation";

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

type ForgottenUsername = {
  email: string;
};

const ForgottenUsernamePage: React.FC = (): ReactElement => {
  const classes = useStyles();
  const [data, setData] = useState({ email: "" } as ForgottenUsername);
  const area = "ForgottenUsernamePage";

  const onSubmit = () => {
    return trackPromise(
      authenticationService.forgottenUsername(data.email),
      area
    );
  };

  const fields = [
    {
      key: "email",
      label: "Registered email address or mobile number",
      type: formFieldType.text,
      validators: [required, length(255)],
      placeholder: "myname@mydomain.com",
      extraProps: {
        autoFocus: true,
        fullWidth: true,
      },
    },
    {
      type: formFieldType.raw,
      raw: (
        <Typography variant="body2" gutterBottom className={classes.detail}>
          Once your email address is submitted you will receive an email with a list of available
          usernames you may use to log in with. If you do not receive this email or you have not
          registered your contact information please contact our{" "}
          <MuiLink href="mailto:support@insightfultechnology.com" variant="body2">
            support team
          </MuiLink>
          .
        </Typography>
      ),
    },
  ] as Array<IFormField<ForgottenUsername>>;

  return (
    <>
      <Form
        onSubmit={onSubmit}
        model={data}
        setModel={setData}
        formFields={fields}
        area={area}
        submitBtnText="Submit"
        submitBtnClass={classes.submit}
        title="Forgotten Username"
        description="You will receive an email with a list of registered usernames"
        showErrorSummary={false}
      >
        <>
          <Button type="submit" className={classes.goBack} component={Link} to="/">
            Go Back
          </Button>
        </>
      </Form>
    </>
  );
};

export default ForgottenUsernamePage;
