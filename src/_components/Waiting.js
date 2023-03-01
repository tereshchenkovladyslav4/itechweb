import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Skeleton from '@mui/material/Skeleton';

const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
    height: "100%",
    boxShadow: "none",
    backgroundColor: theme.palette.background.component,
  },
  media: {
    width: "90%",
    margin: "auto",
  },
}));

export default function Waiting() {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={<Skeleton animation="wave" variant="rectangular" width={40} height={40} />}
        title={<Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />}
        subheader={<Skeleton animation="wave" height={10} width="40%" />}
      />
      <Skeleton animation="wave" variant="rectangular" className={classes.media} />
      <CardContent>
        <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
        <Skeleton animation="wave" height={10} width="80%" />
      </CardContent>
    </Card>
  );
}
