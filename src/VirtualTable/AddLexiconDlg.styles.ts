import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  groups: {
    overflowY: "auto",
    maxHeight: 339,
    minHeight: 50,
    marginBottom: 10,
    marginTop: 10,
  },
  group: {
    borderRadius: 5,
    borderColor: theme.palette.primary.main,
    border: "1px solid",
    color: theme.palette.primary.contrastText,
    padding: 5,
    margin: "10px 0",
    cursor: "pointer",
    width: "max-content",
    "&:hover": {
      background: theme.palette.primary.light,
    },
  },
  buttonText: {
    width: 40,
    display: "inline-block",
    marginRight: 5,
  },
  formButton: {
    margin: "0 0 24px 24px",
  },
}));
