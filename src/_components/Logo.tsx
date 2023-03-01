import makeStyles from '@mui/styles/makeStyles';
import React, { ReactElement } from "react";
import config from "../config";
import ecs from "../images/ecsLogo.png";
import gl from "../images/glLogo.png";
// import soteria from "../images/smallLogo.png";
import soteriaDark from "../images/smallLogoDarkMode.png";
// import { useDarkMode } from "../_helpers/hooks/useDarkMode";

const useStyles = makeStyles(() => ({
  logo: {
    height: "40px",
  },
}));

export const Logo: React.FC = (): ReactElement => {
  const classes = useStyles();
  // const [theme] = useDarkMode();

  const logo =
    config.display?.toLowerCase() === "ecs"
      ? ecs
      : config.display?.toLowerCase() === "gl"
      ? gl
      : soteriaDark; //: theme === "light" ? soteria : soteriaDark;

  return <img src={logo} alt="Logo" className={classes.logo} />;
};
