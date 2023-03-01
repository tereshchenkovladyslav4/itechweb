import React, { CSSProperties } from "react";
import makeStyles from '@mui/styles/makeStyles';
import LinearProgress from "@mui/material/LinearProgress";
import { usePromiseTracker } from "react-promise-tracker";

interface ILinearLoadingProps {
  width: CSSProperties;
  area: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    bottom: "0",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    height: 6,
    width: (props: CSSProperties) => props.width,
    zIndex: 999999,
  },
  hide: {
    display: "none",
  },
}));

export const LinearLoading: React.FC<ILinearLoadingProps> = ({ width, area }) => {
  const { promiseInProgress } = usePromiseTracker({ area: area });
  const classes = useStyles(width);
  return (
    <>
      {promiseInProgress ? (
        <div className={classes.root}>
          <LinearProgress />
        </div>
      ) : null}
    </>
  );
};
