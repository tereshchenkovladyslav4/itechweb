import React, { useState, useEffect, ReactElement } from "react";
import CSSTransition from "react-transition-group/CSSTransition";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useStyles } from "./FormBuilder.styles";
import "./FormBuilder.css";
import clsx from "clsx";
import CircularProgress from "@mui/material/CircularProgress";

type FormBuilderProps = {
  propDisplay: boolean;
  onChange: (show: boolean) => void;
  style?: React.CSSProperties | undefined;
  children: any;
};

const FormBuilder: React.FC<FormBuilderProps> = ({
  propDisplay,
  onChange,
  style,
  children,
}): ReactElement => {
  const classes = useStyles();
  const [display, setDisplay] = useState(false);
  const formClass = "formClass";

  useEffect(() => {
    if (display !== propDisplay) {
      _toggleForm(propDisplay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display, propDisplay]);

  const _toggleForm = (show: any) => {
    setDisplay(show);
    onChange(show);
  };

  return (
    <CSSTransition in={display} classNames="Fade" timeout={1100}>
      {
        <div className={classes.root}>
          <CSSTransition in={display} classNames="Bounce" timeout={800}>
            <div className={clsx(classes.formContainer, formClass)} style={style}>
              <IconButton
                onClick={() => _toggleForm(false)}
                className={classes.closeButton}
                size="small"
              >
                <Close />
              </IconButton>
              {children !== undefined ? (
                children
              ) : (
                <span className="ProgressContainer">
                  <CircularProgress />
                </span>
              )}
            </div>
          </CSSTransition>
        </div>
      }
    </CSSTransition>
  );
};

export default FormBuilder;
