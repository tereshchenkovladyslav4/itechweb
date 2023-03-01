import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import Typography from "@mui/material/Typography";
import Slider, { SliderProps } from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import { Stack, TextField, Tooltip } from "@mui/material";

interface StyleProps {
  range: number;
}

const useStyles = (props: StyleProps) =>
  makeStyles((theme) => ({
    root: {
      width: "100%",
    },
    margin: {
      height: theme.spacing(3),
    },
    thumb: {
      background: "red",
      "&~&": {
        background: "green",
      },
    },
    thumbReverse: {
      background: "green",
      "&~&": {
        background: "red",
      },
    },
    mark: {
      background: "black",
    },
    rail: {
      background: `linear-gradient(to right, red, red ${props.range}%, green ${props.range}%, green);`,
    },
    railReverse: {
      background: `linear-gradient(to left, red, red ${100 - props.range}%, green ${
        100 - props.range
      }%, green);`,
    },
    track: {
      background: "#FFBF00", // amber #FFBF00
      border: "none",
    },
    rangeField: {
      maxWidth: "6em",
    },
    //   valueLabel: {
    //     "&>*": {
    //       background: "black",
    //     },
    //  },
  }));

interface IDiscreteSliderProps {
  greenToRed: boolean;
  setGreenToRed: (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  showMaxRange?: boolean;
  maxRange: number;
  setMaxRange: (max: number) => void;
  hint?:string;
}

const DiscreteSlider: React.FC<IDiscreteSliderProps & SliderProps> = ({
  value,
  onChange,
  title,
  greenToRed,
  setGreenToRed,
  showMaxRange = false,
  maxRange,
  setMaxRange,
  hint=''
}) => {
  const classes = useStyles({
    range: value && Array.isArray(value) ? (value[0] / maxRange) * 100 : 33,
  })();

  return (
    <div className={classes.root}>
      <Tooltip title={hint}>
      <Typography component="label" variant="body2" gutterBottom>
        {title}
      </Typography>
      </Tooltip>
      <Stack direction="row" spacing={2}>
        <Slider
          classes={{
            thumb: greenToRed ? classes.thumb : classes.thumbReverse,
            rail: greenToRed ? classes.rail : classes.railReverse,
            track: classes.track,
            //   valueLabel: classes.valueLabel,
            mark: classes.mark,
          }}
          valueLabelDisplay="auto"
          value={value}
          min={0}
          max={maxRange}
          onChange={onChange}
        />
        {showMaxRange && (
          <TextField
            type="number"
            label="Max range"
            className={classes.rangeField}
            value={maxRange}
            onChange={(e) => setMaxRange(Number(e.target.value))}
            InputProps={{
              inputProps:{
                min:0,
              }
            }}
          />
        )}
      </Stack>
      <div>
        <Typography component="label" variant="body2">
          Reverse Colours
        </Typography>

        <Switch checked={greenToRed} onChange={setGreenToRed} color="primary" />
      </div>
    </div>
  );
};
export default DiscreteSlider;
