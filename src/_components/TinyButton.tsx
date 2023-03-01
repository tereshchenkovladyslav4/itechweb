import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import { Fab, FabProps, Theme } from "@mui/material";
import IconManager from "./IconManager";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "1.3em",
    height: "1.3em",
    minHeight: 0,
    boxShadow: "0 0",
    //backgroundColor: theme.palette.primary.main,
  },
  tinyIcon: {
    width: "0.5em",
    height: "0.5em",
    color: theme.palette.secondary.contrastText,
  },
}));

interface ITinyButtonProps {
  icon: string;
}

export const TinyButton: React.FC<
  ITinyButtonProps & Omit<FabProps, "children">
> = ({ icon, ...rest }) => {
  const classes = useStyles();
  return (
    <Fab className={classes.root} {...rest}>
      <IconManager icon={icon} className={classes.tinyIcon} />
    </Fab>
  );
};
