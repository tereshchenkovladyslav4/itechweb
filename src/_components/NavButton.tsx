import { IconButton } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

const NavButton = withStyles(
  () => ({
    root: {
      display: "flex",
      flexDirection: "row",
      padding: 3,
      borderRadius: 0,
      // "&:hover": {
      //   backgroundColor: theme.palette.primary.main,
      //   color: "white",
      //   "& .MuiButtonIcon-root": {
      //     color: "white",
      //   },
      // },
    },
  }),
  { withTheme: true }
)(IconButton);

export default NavButton;
