import React, { ReactElement, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { RouteProps } from "react-router-dom";
import BusyButton from "./_components/BusyButton";
import { trackPromise } from "react-promise-tracker";
import { authenticationService } from "./_services/authenticationService";
import { History } from "history";
import { Alert } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { Logo } from "./_components/Logo";

const useStyles = makeStyles((theme) => ({
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
    color: theme.palette.secondary.contrastText,
  },
  logo: {
    height: "40px",
    marginTop: 3,
  },

  paper: {
    padding: 10,
  },

  heading: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  title: {
    padding: "4px 0px 0px 10px",
  },
  body: {
    margin: "10px 0",
  },
  button: {
    height: 24,
  },
}));

type RequestAccessPageProps = {
  location: RouteProps["location"];
  history: History;
};
const RequestAccessPage: React.FC<RequestAccessPageProps> = ({
  location,
  history,
}): ReactElement => {
  const classes = useStyles();
  const path = (location as any)?.state?.from?.pathname as string;
  const caseId = path?.substring(path?.lastIndexOf("/") + 1);
  const area = "RequestAccess";
  const [error, setError] = useState("");

  // need to set this: currentUserService.currentUserValue

  // useEffect(() => {

  // }, []);

  const _onClick = () => {
    trackPromise(authenticationService.authenticateByCase(Number(caseId)), area).then(
      () => {
        const from: string = ((location as any)?.state?.from?.pathname as string) || "/";
        history.push(from);
      },
      (error) => setError(error?.message || error)
    );
  };

  return (
    <Container maxWidth="md" className={classes.container}>
      <div className={classes.paper}>
        <div className={classes.heading}>
          <Logo />
          <Typography variant="h3" className={classes.title}>
            Request Access
          </Typography>
        </div>
        <Grid container>
          <Grid item xs={1} />
          <Grid item xs={6}>
            {error && (
              <Grid item xs={8}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
            <Grid item className={classes.body}>
              <Typography variant="body2">
                To request access to view your personal data, please click the button below.
              </Typography>
            </Grid>
            <BusyButton area={area} onClick={_onClick} startIcon={<CheckCircle />}>
              Request
            </BusyButton>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};
export default RequestAccessPage;
