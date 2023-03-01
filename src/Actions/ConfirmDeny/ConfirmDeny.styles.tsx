import { alpha } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

export const useStyles = makeStyles((theme) => ({
  button: {
    height: "100%",
    width: "100%",
    fontSize: 20,
    textAlign: "center",
    marginBottom: "5px",
    color: theme.palette.primary.contrastText,
  },
  confirmed: {
    backgroundColor: alpha(theme.palette.neutral.main, 0.4),
  },
  denied: {
    backgroundColor: alpha(theme.palette.warning.main, 0.4),
  },
}));
