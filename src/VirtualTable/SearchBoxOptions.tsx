import React from "react";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  IconButtonProps,
  Popper,
  Switch,
} from "@mui/material";
import { iTechControlSearchEnum } from "../Model/iTechRestApi/iTechControlSearchEnum";
import { Close, MenuOpen } from "@mui/icons-material";
import { container } from "../_theme/baseTheme";
import Tooltip from "@mui/material/Tooltip";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      border: "1px solid",
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
    },
    group: {
      margin: "5px",
    },
  })
);

export type SearchOption = {
  label: string;
  searchType: iTechControlSearchEnum;
  enabled: boolean;
};

interface ISearchBoxOptions {
  values: SearchOption[];
  setValue(opt: SearchOption): void;
  iconProps: IconButtonProps;
}

const SearchBoxOptions: React.FC<ISearchBoxOptions> = ({ values, setValue, iconProps }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const classes = useStyles();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const optionChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValue({
      searchType: Number(event.target.name) as iTechControlSearchEnum,
      label:
        iTechControlSearchEnum[event.target.name as keyof typeof iTechControlSearchEnum].toString(),
      enabled: event.target.checked,
    });

  return (
    <div>
      <Tooltip title="Search options" placement="bottom">
        <IconButton aria-label="Search options" onClick={handleClick} {...iconProps} size="large">
          <MenuOpen />
        </IconButton>
      </Tooltip>
      <Popper open={open} anchorEl={anchorEl} container={container}>
        <Box className={classes.paper}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Search Fields</FormLabel>
            <IconButton
              aria-label="close"
              onClick={handleClick}
              color="primary"
              style={{
                position: "absolute",
                right: "-8px",
                top: "-22px",
              }}
              size="small"
            >
              <Close />
            </IconButton>
            <FormGroup className={classes.group}>
              {values &&
                values.map((opt) => (
                  <FormControlLabel
                    key={opt.searchType}
                    control={
                      <Switch
                        size="small"
                        checked={opt.enabled}
                        onChange={optionChange}
                        name={opt.searchType.toString()}
                        color="primary"
                      />
                    }
                    label={opt.label}
                  />
                ))}
            </FormGroup>
          </FormControl>
        </Box>
      </Popper>
    </div>
  );
};

export default SearchBoxOptions;
