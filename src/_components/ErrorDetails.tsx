import { Button, Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { red } from "@mui/material/colors";
import { ErrorOutline } from "@mui/icons-material";
import React from "react";
import WarningButton from "./WarningButton";

interface IErrorDetailsProps {
  error: Error;
  onRemove?(): void;
  onClear(): void;
}

const useStyles = makeStyles({
  root: {
    minWidth: 180,
    margin: 20,
  },
});

const ErrorDetails: React.FC<IErrorDetailsProps> = ({ error, onRemove, onClear }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        title="Component Error"
        titleTypographyProps={{ variant: "h5", color: "error" }}
        avatar={<ErrorOutline fontSize="large" style={{ color: red[500] }} />}
      />
      <CardContent>
        <Typography variant="body2">{error?.message}</Typography>
        {error?.stack && (
          <div>
            {" "}
            <Typography variant="body2">
              <span>Click for error stack details</span>
              <span>{error?.stack}</span>
            </Typography>
          </div>
        )}
      </CardContent>
      <CardActions>
        <Button color="primary" variant="contained" onClick={onClear}>
          Reload
        </Button>
        {onRemove && (
          <WarningButton variant="contained" onClick={onRemove}>
            Remove
          </WarningButton>
        )}
      </CardActions>
    </Card>
  );
};

export default ErrorDetails;
