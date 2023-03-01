import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import { usePromiseTracker } from "react-promise-tracker";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  loadingAvatar: {
    position: "relative",
    "& .MuiCircularProgress-root": {
      position: "absolute",
      minHeight: 0,
      top: 7,
      left: 7,
      maxWidth: 41,
    },
  },
}));

interface ILoadingAvatarProps {
  icon: React.ReactElement;
  area?: string;
  style?: React.CSSProperties;
}

const LoadingAvatar: React.FC<ILoadingAvatarProps> = ({
  icon,
  area,
  style,
}: ILoadingAvatarProps) => {
  const classes = useStyles();
  const { promiseInProgress } = usePromiseTracker({ area: area });

  return (
    <div className={classes.loadingAvatar}>
      <Avatar className={classes.avatar} style={style}>
        {icon}
      </Avatar>
      {promiseInProgress === true ? (
        <CircularProgress size={42} style={{ color: "Orange" }} />
      ) : null}
    </div>
  );
};

export default LoadingAvatar;
