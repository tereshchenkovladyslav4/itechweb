import React, { useEffect, useState } from "react";
import { RouteProps } from "react-router-dom";
import { handleLogin } from "./authConfig";
import { authenticationService } from "./_services/authenticationService";
import { History } from "history";
import CircularProgress from "@mui/material/CircularProgress";
import { Avatar, Button, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Alert from '@mui/material/Alert';

type HomePageProps = {
  location: RouteProps["location"];
  history: History;
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  loadingAvatar: {
    position: "relative",
    "& .MuiCircularProgress-root": {
      position: "absolute",
      minHeight: 0,
      top: 7,
      left: 7,
      maxWidth: 41,
    },
  },
  signIn: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Saml: React.FC<HomePageProps> = ({ location, history }) => {
  const classes = useStyles();
  const [user, setUser] = useState<string>();
  const [error, setError] = useState<string>();

  const handleGoToSignIn = () => history.push("/login");

  useEffect(() => {
    handleLogin(setUser);
  }, []);

  useEffect(() => {
    if (user) {
      // this is loaded from the msal redirect
      const username = user;
      authenticationService
        .loginSSO(username)
        .then((rsp) => {
          const from =
            rsp.landingPage || ((location as any)?.state?.from?.pathname as string) || "/";

          history.push(from);
        })
        .catch((error) => {
          setUser(undefined);
          setError(error);
        });
    }
  }, [user]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {error && (
          <>
            <Alert severity="error">{error}</Alert>
            <Button variant="contained" color="primary" onClick={handleGoToSignIn} className={classes.signIn}>
              Go to Sign In
            </Button>
          </>
        )}
        {!error && (
          <div className={classes.loadingAvatar}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <CircularProgress size={42} style={{ color: "Orange" }} />
            <Typography>Loading...</Typography>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Saml;
