import { createTheme, adaptV4Theme } from "@mui/material/styles";
import baseTheme from "./baseTheme";
import merge from "lodash/merge";

// if we are adding props to the default model.. model augmentation see https://mui.com/customization/theming/
export const lightTheme = createTheme(
  adaptV4Theme(merge(baseTheme, {
    typography: {
      fontFamily: "Open Sans, Arial, Helvetica, sans-serif",
      fontSize: 12,
    },
    palette: {
      teams: {
        message: "#ffffff",
        paper: "#f5f5f5",
      },
      primary: {
        main: "#4a7ab5",
        contrastText: "#000",
      },
      secondary: {
        light: "#8fa4bf",
        main: "#555",
        dark: "#adab87",
        color: "#ffffff",
      },
    },
    overrides: {
      MuiSpeedDialIcon: {
        root: {
          color: "#ffffff",
        },
      },
    },
  }))
);
