import React, { ReactElement } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import Container from "@mui/material/Container";
import Copyright from "../Copyright";

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
    marginBottom: theme.spacing(2),
    width: "max-content",
    color: theme.palette.secondary.contrastText,
    "& .MuiFormLabel-root": {
      color: theme.palette.secondary.contrastText,
    },
  },
  modal:{
    display: "flex",
    margin: theme.spacing(1),
    width:'95%',
  },
  title: {
    marginTop: theme.spacing(8),
  },
  modalPaper:{
    flexDirection: "column",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 690,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.contrastText,
  },
  form: {
    //width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  description: {
    marginTop: 30,
    marginBottom: 50,
  },
}));

type StyledAnonymousFormProps = {
  title: JSX.Element;
  description: JSX.Element;
  onSubmit: (e: any) => Promise<any>;
  children: JSX.Element;
  icon?: JSX.Element;
  isModal?:boolean;
};

export const StyledAnonymousForm: React.FC<StyledAnonymousFormProps> = ({
  title,
  description,
  onSubmit,
  children,
  icon,
  isModal = false,
}): ReactElement => {
  const classes = useStyles();

  return (
    <Container component="main" className={isModal? classes.modal : classes.container}>
      <CssBaseline />
      <div className={isModal? classes.modalPaper : classes.paper}>
        {icon && <Avatar className={classes.avatar}>{icon}</Avatar>}
        {title}
        {description}
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          {children}
        </form>
        {!isModal && (<Copyright />)}
      </div>
    </Container>
  );
};

export type AnonymousFormProps = {
  title: string;
  description: string;
  onSubmit: (e: any) => Promise<any>;
  // children: JSX.Element;
  icon?: JSX.Element;
  isModal?:boolean;
};

const AnonymousForm: React.FC<AnonymousFormProps & React.PropsWithChildren> = ({
  title,
  description,
  onSubmit,
  children,
  icon,
  isModal = false,
}): ReactElement => {
  const classes = useStyles();

  return (
    <StyledAnonymousForm
      title={
        title ? (
          <Typography component="h1" variant="h1" className={classes.title}>
            {title}
          </Typography>
        ) : (
          <></>
        )
      }
      description={
        description ? (
          <Typography variant="h4" className={isModal? undefined : classes.description}>
            {description}
          </Typography>
        ) : (
          <></>
        )
      }
      onSubmit={onSubmit}
      icon={icon}
      isModal={isModal}
    >
      <>{children}</>
    </StyledAnonymousForm>
  );
};

export default AnonymousForm;
