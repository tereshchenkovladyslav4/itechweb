import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import Fab from "@mui/material/Fab";
import CircularProgress from "@mui/material/CircularProgress";
import { usePromiseTracker } from "react-promise-tracker";

const useStyles = makeStyles({
  loadingFab: {
    position: "relative",
    "& .MuiCircularProgress-root": {
      position: "absolute",
      minHeight: 0,
      top: 0,
      right: 6,
    },
    "& .MuiFab-sizeSmall": {
      position: "absolute",
      width: "2.5em",
      height: "2.5em",
      minHeight: 0,
      top: 2,
      right: 9,
    },
  },
});

interface ILoadingFabProps {
  icon: React.ReactElement;
  area?: string;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const LoadingFab: React.FC<ILoadingFabProps> = ({
  icon,
  onClick,
  area,
}: ILoadingFabProps) => {
  const classes = useStyles();
  const { promiseInProgress } = usePromiseTracker({ area: area });

  return (
    <div className={classes.loadingFab} onClick={onClick}>
      <Fab size="small">{icon}</Fab>
      {promiseInProgress === true ? <CircularProgress size={35} /> : null}
    </div>
  );
};

export default LoadingFab;
