import React, { useState, useEffect, ReactElement, ChangeEventHandler } from "react";
import TextField from "@mui/material/TextField";
import CSSTransition from "react-transition-group/CSSTransition";
import "./SearchBox.css";
import { KeyboardEventHandler } from "react";
import { useTheme } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";

// https://vispad.blogspot.com/2019/06/set-textfield-height-material-ui.html
const _defaultHeight = 34;
//const _labelOffset = -11;

type SearchBoxProps = {
  height?: number;
  fullWidth?: boolean;
  onKeyUp?: KeyboardEventHandler;
  onKeyDown?: KeyboardEventHandler;
  placeholder?: any;
  onFocus?: any;
  onBlur?: any;
  onChange: ChangeEventHandler;
  helperText?: string;
  isVisible: boolean;
  isHorizontalTransition?: boolean;
  value: string;
  onSubmit?: () => void;
};

const SearchBox: React.FC<SearchBoxProps> = ({
  height = _defaultHeight,
  fullWidth = false,
  onKeyUp,
  onKeyDown,
  placeholder,
  onFocus,
  onBlur,
  onChange,
  helperText,
  isVisible,
  isHorizontalTransition = false,
  value,
  onSubmit,
}): ReactElement => {
  const [focused, setFocused] = useState(!!value);
  const theme = useTheme();

  const defaultStyle = {
    transition:
      "opacity 500ms linear, color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
    opacity: isVisible ? 1 : 0,
  };

  const transitionName = isHorizontalTransition ? "horizontal_transition" : "flash";
  const timeout = isVisible && !isHorizontalTransition ? 500 : 1000;

  useEffect(() => {
    if (focused) {
      if (onFocus) onFocus();
    } else {
      if (onBlur) onBlur();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused]);

  const _onKeyUp = (event: any) => {
    onKeyUp?.(event);

    if (event.keyCode !== 13 || !onSubmit) return;

    onSubmit();
  };

  return (
    <CSSTransition
      in={isVisible}
      classNames={transitionName}
      timeout={timeout}
      mountOnEnter={true}
      unmountOnExit={true}
    >
      {
        <TextField
          helperText={helperText}
          label={placeholder}
          value={value || ""}
          style={{ height, margin: "auto 0" }}
          type="search"
          onKeyUp={_onKeyUp}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onClick={(e) => e.stopPropagation()}
          onChange={onChange}
          fullWidth={fullWidth}
          className="searchBox"
          InputLabelProps={{
            shrink: true,
            style: {
              height,
              //...(!focused && { top: `${_labelOffset}px` }),
              ...defaultStyle,
            },
          }}
          inputProps={{
            style: {
              height,
              padding: "0 10px",
              //color: "#000",
            },
          }}
          FormHelperTextProps={{
            style: {
              fontSize: 10.6,
              margin: "-3px 0 0 2px",
              color: theme.palette.secondary.main,
              ...(focused ? { display: "block" } : { display: "none" }),
            },
          }}
        />
      }
    </CSSTransition>
  );
};

export default SearchBox;
