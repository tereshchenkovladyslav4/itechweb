import React, { useState } from "react";
import makeStyles from '@mui/styles/makeStyles';
import clsx from "clsx";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import EditIcon from "@mui/icons-material/Edit";
import { iTechDataWebTemplateEnum } from "../Model/iTechRestApi/iTechDataWebTemplateEnum";

const useStyles = makeStyles(() => ({
  root: {
    transform: "translateZ(0px)",
    flexGrow: 1,
  },
  speedDial: {
    //color: theme.palette.text.secondary,
    position: "absolute",
    bottom: 10,
    zIndex: 4,
    marginLeft: 10,
  },
  backDrop: {
    pointerEvents: "none",
    zIndex: 3,
  },
}));

interface IMenuAction {
  icon: JSX.Element;
  name: string;
  handler: () => void;
  visible: boolean | (() => boolean);
  operation?: iTechDataWebTemplateEnum;
}

interface ISpeedDialMenuProps {
  actions: IMenuAction[];
  setSelectedOperation: any;
  children: React.ReactNode;
}

const SpeedDialMenu: React.FC<ISpeedDialMenuProps> = ({
  actions,
  setSelectedOperation,
  children,
}: ISpeedDialMenuProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (e: any, action: IMenuAction) => {
    if (action.operation !== undefined) {
      setSelectedOperation(action.operation);
    }
    action.handler();
    handleClose();
  };

  return (
    <>
      <Backdrop className={classes.backDrop} open={open} />
      <SpeedDial
        ariaLabel="Select an option"
        className={clsx(classes.speedDial)}
        hidden={false}
        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) =>
          action &&
          (action.visible === true ||
            (typeof action.visible === "function" && action.visible() === true)) ? (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipPlacement="right"
              tooltipOpen
              onClick={(e) => {
                handleClick(e, action);
              }}
            />
          ) : null
        )}
      </SpeedDial>
      {children}
    </>
  );
};

export default SpeedDialMenu;
