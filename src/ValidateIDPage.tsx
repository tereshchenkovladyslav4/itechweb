import React, { ReactElement, useState } from "react";
import { Container, Typography, Grid, TextField, Paper } from "@mui/material";
import { Alert } from '@mui/material';
import { useParams } from "react-router-dom";
import makeStyles from '@mui/styles/makeStyles';
import { trackPromise } from "react-promise-tracker";
import Avatar from "@mui/material/Avatar";
import VpnKey from "@mui/icons-material/VpnKey";
import { identityService } from "./_services/identityService";
import BusyButton from "./_components/BusyButton";

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
  },
  textField: {
    maxWidth: 120,
  },
  fieldContainer: {
    padding: "15px 0",
  },
  submitContainer: {
    padding: "20px 0",
  },
  alert: {
    marginTop: 20,
  },
}));

const ValidateIDPage: React.FC = (): ReactElement => {
  const classes = useStyles();
  const { urlCode } = useParams<{ urlCode: string }>();
  const [code, setCode] = useState(urlCode);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const area = "idver";

  function sendCode(code: string) {
    trackPromise(
      identityService.verifyUser(code).then(
        (result) => {
          if (!result) {
            setError("Failed to verify with given code");
          } else {
            setError("");
            setSuccess(true);
          }
        },
        (error) => {
          setError(error?.message || error);
          setSuccess(false);
        }
      ),
      area
    );
  }

  const onSubmit = (e: any) => {
    e.preventDefault();
    sendCode(code);
  };

  return (
    <Container maxWidth="md">
      <div className={classes.paper}>
        <div className={classes.heading}>
          <Avatar className={classes.avatar}>
            <VpnKey />
          </Avatar>
          <Typography component="h1" variant="h5">
            ID Verification
          </Typography>
        </div>
        {error && (
          <Grid item xs={12}>
            <Alert severity="error" className={classes.alert}>
              {error}
            </Alert>
          </Grid>
        )}
        {success && (
          <Alert severity="success" className={classes.alert}>
            Identity verified
          </Alert>
        )}
        {!success && (
          <form className={classes.form} onSubmit={onSubmit}>
            <Paper variant="outlined" className={classes.paper}>
              <Grid container spacing={3} className={classes.root}>
                <Grid container item xs={9} direction="row">
                  <>
                    <Grid item xs={3} className={classes.fieldContainer}>
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
                    <Grid item xs={8} className={classes.submitContainer}>
                      <BusyButton area={area} type="submit">
                        Submit Code
                      </BusyButton>
                    </Grid>
                  </>
                </Grid>
              </Grid>
            </Paper>
          </form>
        )}
      </div>
    </Container>
  );
};

export default ValidateIDPage;
