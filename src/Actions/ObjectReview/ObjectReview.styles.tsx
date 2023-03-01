import { alpha } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

export const useStyles = makeStyles((theme) => ({
  button: {
    height: "100%",
    width: "100%",
    fontSize: 20,
    textAlign: "center",
    color: theme.palette.primary.contrastText,
    "& .MuiInputBase-multiline": {
      padding: 0,
    },
  },
  containerTall: {
    marginBottom: 10,
  },
  actionBox: {
    border: "1px solid #CCC",
    borderRadius: "4px",
  },
  checkbox: {
    marginLeft: 5,
  },
  approved: {
    backgroundColor: alpha(theme.palette.neutral.main, 0.4),
    color: theme.palette.neutral.contrastText,
  },
  denied: {
    backgroundColor: alpha(theme.palette.warning.main, 0.4),
    color: theme.palette.secondary.main,
  },
}));
