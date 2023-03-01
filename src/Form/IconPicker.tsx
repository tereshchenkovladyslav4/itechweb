import React, { ReactElement, useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconManager from "../_components/IconManager";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import makeStyles from "@mui/styles/makeStyles";
import { Button } from "@mui/material";
import { materialIcons } from "../_components/IconList";
import _ from "lodash";

const initialList = _shuffleArray(_iconKeys(materialIcons));

const useStyles = makeStyles((theme) => ({
  iconBox: {
    maxWidth: 500,
  },
  iconSearch: {
    marginTop: 10,
    "& .MuiFormHelperText-root": {
      color: theme.palette.secondary.main,
    },
  },
}));

type IconPickerProps = {
  icon: any;
  setIcon: (icon: any) => void;
};

const IconPicker: React.FC<IconPickerProps> = ({ icon, setIcon }): ReactElement => {
  const classes = useStyles();
  const page = 36;
  const [startIndex, setIndex] = useState(0);
  const [iconList, setIconList] = useState(initialList);

  function _onClickBack() {
    if (startIndex === 0) return;

    const newIndex = startIndex - page;
    setIndex(newIndex);
  }

  function _onClickForwards() {
    if (startIndex + page > iconList.length) return;

    const newIndex = startIndex + page;
    setIndex(newIndex);
  }

  function _onKeyUp(e: any) {
    const search = _.filter(initialList, (icon) => {
      const searchValue = e.target.value.toLowerCase();
      const rowValue = String(icon).toLowerCase();
      return rowValue.indexOf(searchValue) !== -1;
    });

    setIconList(search);
    setIndex(0);
  }

  return (
    <>
      <div>
        <Button variant="contained">
          <IconManager icon={icon} />
        </Button>
      </div>
      <div>
        <TextField
          onKeyUp={_onKeyUp}
          className={classes.iconSearch}
          helperText={`${iconList.length} icons found`}
          InputProps={{
            startAdornment: (
              <InputAdornment position="end">
                <IconManager icon="Search" />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div className={classes.iconBox}>
        {iconList.slice(startIndex, startIndex + page).map((icon: any) => (
          <Tooltip key={icon} title={icon}>
            <IconButton key={icon} onClick={() => setIcon(icon)} size="large">
              <IconManager icon={icon} key={icon} />
            </IconButton>
          </Tooltip>
        ))}
      </div>
      <div>
        <Button variant="contained" onClick={_onClickBack} size="small" disabled={startIndex === 0}>
          <IconManager icon="ArrowBackIos" />
        </Button>
        <Button
          variant="contained"
          onClick={_onClickForwards}
          size="small"
          disabled={startIndex + page > iconList.length}
        >
          <IconManager icon="ArrowForwardIos" />
        </Button>
      </div>
    </>
  );
};

export default IconPicker;

//TODO - Move these functions to a helper
function _iconKeys(listObject: any) {
  return Object.keys(listObject);
}

// function _preFilterIcons(list) {
//   return _.filter(list, icon => {
//     const ignore = ['Outlined', 'Rounded', 'Sharp', 'TwoTone'];
//     return !ignore.some(v => icon.includes(v));
//   });
// }

function _shuffleArray(array: any) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
