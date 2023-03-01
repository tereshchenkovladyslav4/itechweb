import React, { ReactElement } from "react";
import { CircularProgress, Box } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { usePromiseTracker } from "react-promise-tracker";
import clsx from "clsx";

const useStyles = makeStyles(() => ({
  box: {
    // position: "absolute",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    zIndex: 99999,
  },
  fixed: {
    position: "absolute",
  },
}));

interface LoadingSpinnerProps {
  area?: any;
  fixed?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ area, fixed = true }): ReactElement => {
  const { promiseInProgress } = usePromiseTracker({ area: area });
  const classes = useStyles();
  const classNames = fixed ? clsx(classes.box, classes.fixed) : classes.box;
  return (
    <>
      {promiseInProgress === true ? (
        <Box className={classNames}>
          <CircularProgress />
        </Box>
      ) : null}
    </>
  );
};

export default LoadingSpinner;
