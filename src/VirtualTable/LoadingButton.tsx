import React, { useState, useEffect, ReactElement } from "react";
import clsx from "clsx";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { useStyles } from "./LoadingButton.styles";

type LoadingButtonProps = {
  text: any;
  onClick: () => Promise<void>;
  isLoading: boolean;
  isLoaded: boolean;
  enabled: boolean;
};

const LoadingButton: React.FC<LoadingButtonProps> = ({
  text,
  onClick,
  isLoading,
  isLoaded,
  enabled,
}): ReactElement => {
  const classes = useStyles();
  const [success, setSuccess] = useState(isLoaded);
  const tooltipText = success ? "" : !enabled ? "Too many results to load all" : "Load all results";

  useEffect(() => {
    setSuccess(isLoaded);
  }, [isLoaded]);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  const _handleButtonClick = () => {
    if (success) return;

    onClick().then(() => setSuccess(true));
  };

  return (
    <>
      {!!text.includes("NaN") || (
        <div className={classes.root}>
          <div className={classes.wrapper}>
            <Tooltip title={tooltipText} placement="left">
              <span>
                <Button
                  variant="contained"
                  color="primary"
                  className={buttonClassname}
                  disabled={isLoading || !enabled}
                  onClick={_handleButtonClick}
                >
                  {text}
                </Button>
              </span>
            </Tooltip>
            {isLoading && <CircularProgress size={12} className={classes.buttonProgress} />}
          </div>
        </div>
      )}
    </>
  );
};

export default LoadingButton;
