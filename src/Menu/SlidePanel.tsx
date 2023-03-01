import React, { ReactElement } from "react";
import clsx from "clsx";
import makeStyles from '@mui/styles/makeStyles';
import Drawer from "@mui/material/Drawer";
import LoadingFab from "../_components/LoadingFab";

const useStyles = makeStyles({
  container: {
    position: "absolute",
    right: 10,
    top: 2,
  },
  list: {
    width: 250,
    height: "100%",
  },
  fullList: {
    width: "auto",
  },
});

type Anchor = "top" | "left" | "bottom" | "right";

interface SlidePanelProps extends React.PropsWithChildren {
  icon: any;
  anchor: Anchor;
  area?: string;
}

const SlidePanel: React.FC<SlidePanelProps> = ({ icon, anchor, area, children }): ReactElement => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      {children}
    </div>
  );

  return (
    <div className={classes.container}>
      <LoadingFab icon={icon} onClick={toggleDrawer(anchor, !state[anchor])} area={area} />
      <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)} PaperProps={{style:{top:50}}}>
        {list(anchor)}
      </Drawer>
    </div>
  );
};

export default SlidePanel;
