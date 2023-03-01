import React from "react";
import { useStyles } from "./TextDisplay.styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

interface ITextDisplayProps {
  title?: string;
  text?: string;
}

const TextDisplay: React.FC<ITextDisplayProps> = ({ title, text }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Card className={classes.root}>
        <CardContent>
          {title && (
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              {title}
            </Typography>
          )}
          <Typography
            variant="body2"
            component="p"
            className={!text ? classes.unavailable : classes.default}
          >
            {text || "Text unavailable"}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextDisplay;
