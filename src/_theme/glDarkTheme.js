import { createTheme, adaptV4Theme } from "@mui/material/styles";
import baseTheme from "./baseTheme";
import merge from "lodash/merge";

const mediumGrey = "#20242d"; // contrast text
const lightGrey = "#E6E7E8"; // background + option hover
const light = "#F6F6F6"; // object investigation - properties/preview..
const white = "#FFFFFF"; // form inputs
// const black = "#000000";
const grey = "#BCBEC0"; // disabled colour
const orange = "#EE9f41"; // notifications / table text
const darkOrange = "#fc4605"; // inputs / icons
const lightOrange = "#FFF7EE"; // table alt row background
const lime = "#8CE281"; // success text
// const green = "#34B025"; // success buttons
const red = "#AC2C2C"; // error / warning

const canary = "#F4D034"; // Overdue object
const teal = "#53BDBE"; // Closed object / information / neutral

const buttonColours = {
  backgroundColor: darkOrange,
  color: white,
  "&:hover": {
    backgroundColor: orange,
    color: white,
  },
};
const inputHeight = 36;
const inputFontSize = 14;
const fontFamily = "HelveticaNeueLTPro-Roman";
const subHeadingFont = "HelveticaNeueLTPro-Lt";

export const glDarkTheme = createTheme(
  adaptV4Theme(
    merge(baseTheme, {
      name: "Dark Theme",
      typography: {
        h1: {
          fontSize: 72,
          fontFamily: "HelveticaNeueLTPro-Th",
          fontWeight: 400,
        },
        h2: {
          fontSize: 60,
          fontFamily: subHeadingFont,
        },
        h3: {
          fontSize: 36,
          fontFamily: subHeadingFont,
        },
        h4: {
          fontSize: 26,
          fontFamily: subHeadingFont,
        },
        h5: {
          fontSize: 24,
          fontFamily: subHeadingFont,
        },
        h6: {
          // table headers
          fontSize: inputFontSize,
          fontFamily: subHeadingFont,
        },
        body1: {
          fontSize: 16,
        },
        body2: {
          fontSize: inputFontSize,
        },
        subtitle1: {
          fontSize: 14,
        },
        colorTextSecondary: {
          color: mediumGrey,
        },
        fontFamily: fontFamily,
        fontSize: 16,
        fontWeight: 400,
        fontStyle: "normal",
        letterSpacing: "-0.38px",
        textTransform: "none",
        color: mediumGrey,
      },
      palette: {
        // mode:'dark', // TODO this should be present when its a proper dark theme
        primary: {
          // Orange actions
          main: darkOrange,
          light: lightOrange,
          contrastText: mediumGrey,
          active: darkOrange,
        },
        secondary: {
          // Dark actions
          main: mediumGrey,
          light: lightGrey,
          contrastText: white,
          active: darkOrange,
        },
        background: {
          paper: lightGrey,
          default: white,
          component: light,
          menu: mediumGrey,
        },
        button: {
          main: darkOrange,
          light: lightOrange,
          contrastText: white,
        },
        success: {
          main: lime,
        },
        link: {
          main: orange,
          contrastText: white,
        },
        disable: {
          main: grey,
          light: lightGrey,
          dark: red,
          contrastText: lightGrey,
        },
        neutral: {
          main: teal,
          contrastText: mediumGrey,
        },
        notification: {
          main: canary,
          contrastText: mediumGrey,
        },
        warning: {
          main: red,
          contrastText: white,
        },
        teams: {
          message: "#292929",
          paper: "#1f1f1f",
        },
        text: {
          secondary: white,
        },
      },
      // Default MUI props
      props: {
        MuiTextField: {
          variant: "outlined", // force border on all text inputs
          color: "primary",
          fontSize: inputFontSize,
        },
        MuiSelect: {
          variant: "outlined",
          color: "primary",
          fontSize: inputFontSize,
        },
        MuiButton: {
          variant: "contained",
          color: "primary",
          fontSize: inputFontSize,
        },
        MuiFormControl: {
          root: {
            variant: "outlined",
          },
        },
      },
      // Style overrides
      overrides: {
        MuiChip: {
          root: {
            backgroundColor: lightGrey,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: darkOrange,
            "&&:hover": {
              backgroundColor: white + "!important",
            },
            "& .MuiChip-deleteIcon": {
              width: 17,
              height: 17,
              color: darkOrange,
            },
            "& .MuiChip-icon": {
              width: 20,
              height: 20,
            },
          },
        },
        MuiDivider: {
          root: {
            backgroundColor: white,
          },
        },
        MuiInputAdornment: {
          root: {
            margin: 0, // added - to stop the date picker icons taking up so much space - default in theme was 10px
          },
          // positionEnd: {
          //    margin: 10,
          // },
        },
        MuiAppBar: {
          colorPrimary: {
            backgroundColor: white,
          },
        },
        MuiGrid: {
          root: { fontFamily: fontFamily },
        },
        MuiDialogTitle: {
          root: {
            fontSize: 24,
            "& h2": {
              fontSize: 24,
            },
          },
        },
        MuiDialogContent: {
          root: {
            "& details": {
              fontFamily: fontFamily,
            },
          },
        },
        MuiDialogContentText: {
          root: {
            color: mediumGrey,
          },
        },
        MuiSpeedDialAction: {
          fab: buttonColours,
          staticTooltipLabel: {
            backgroundColor: mediumGrey,
            padding: 5,
            fontSize: inputFontSize,
            whiteSpace: "nowrap",
          },
        },
        MuiFab: {
          primary: buttonColours,
          root: buttonColours,
        },
        MuiMenu: {
          paper: {
            backgroundColor: white,
            borderStyle: "solid",
            borderWidth: 2,
            borderColor: mediumGrey,
            borderRadius: 2,
          },
        },
        MuiTreeItem: {
          content: {
            "&:hover": {
              color: darkOrange,
            },
          },
          iconContainer: {
            color: darkOrange, // tree expando
          },
        },
        MuiListItem: {
          root: {
            "&:hover": {
              backgroundColor: lightGrey,
              color: darkOrange,
            },
          },
        },
        MuiButton: {
          root: {
            ...buttonColours,
          },
          containedPrimary: {
            ...buttonColours,
            borderRadius: 2,
            fontSize: inputFontSize,
            height: inputHeight,
            textTransform: "none",
          },
          containedSecondary: {
            borderRadius: 2,
            fontSize: inputFontSize,
            height: inputHeight,
            textTransform: "none",
          },
          outlinedPrimary: {
            backgroundColor: white,
            "&:hover": {
              color: mediumGrey,
            },
          },
          textPrimary: {
            backgroundColor: white,
            color: mediumGrey,
            "&:hover": {
              backgroundColor: white,
              color: darkOrange,
            },
          },
        },
        MuiButtonBase: {
          root: {
            "&:hover": {
              color: darkOrange,
            },
          },
        },
        MuiCheckbox: {
          root: {
            color: mediumGrey,
            "&$checked": {
              color: darkOrange,
            },
          },
          colorSecondary: {
            "&$checked": {
              color: darkOrange,
            },
          },
        },
        MuiFormLabel: {
          root: {
            color: mediumGrey,
          },
        },
        MuiInputBase: {
          root: {
            backgroundColor: white,
          },
        },
        MuiMenuItem: {
          root: {
            fontSize: inputFontSize,
            backgroundColor: white,
          },
        },
        MuiAutocomplete: {
          paper: {
            backgroundColor: white,
          },
          option: {
            "&:hover": {
              color: darkOrange,
            },
          },
        },
        MuiOutlinedInput: {
          root: {
            fontSize: inputFontSize,
            borderRadius: 2,
            borderWidth: 1.5,
          },
        },
        MuiSwitch: {
          colorSecondary: {
            "&$checked": {
              // Controls checked color for the thumb
              color: darkOrange,
            },
          },
          track: {
            opacity: 0.2,
            backgroundColor: darkOrange,
            "$checked$checked + &": {
              opacity: 0.7,
              backgroundColor: darkOrange,
            },
          },
        },
        MUIRichTextEditor: {
          container: {
            backgroundColor: white,
          },
          root: {
            width: "100%",
          },
        },
      },
    })
  )
);
