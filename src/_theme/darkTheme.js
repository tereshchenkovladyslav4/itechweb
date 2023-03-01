import { createTheme, adaptV4Theme } from "@mui/material/styles";
// import green from "@mui/material/colors/green";
import baseTheme from "./baseTheme";
import merge from "lodash/merge";

// const accentGreen = green.A200;
// const darkGreen = green[900];

export const darkTheme = createTheme(
  adaptV4Theme(merge(baseTheme, {
    name: "Dark Theme",
    typography: {
      fontFamily: "Open Sans, Arial, Helvetica, sans-serif",
      fontSize: 12,
    },
    palette: {
      teams: {
        message: "#292929",
        paper: "#1f1f1f",
      },
      primary: {
        main: "#fc4605",
        contrastText: "#fff",
      },
      background: {
        paper: "#20242d",
        default: "#20242d",
        // default:"#22262F",
      },
      mode: "dark",
      secondary: {
        light: "#AAA",
        main: "#555", // was #111 ( but cant see back buttons text ! ) now #555 n.b. paper-root background color is what the components apart from tabbar use as background
        dark: "#585852",
        contrastText: "#fff",
      },
      text: {
        secondary: "#FFF",
      },
    },
    // TODO - themed scrollbars

    // overrides:{
    //   MuiCssBaseline: {
    //     "@global": {
    //       // body: {
    //       //   scrollbarColor: "#6b6b6b #2b2b2b",
    //       //   "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
    //       //     backgroundColor: "#2b2b2b",
    //       //   },
    //       //   "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
    //       //     borderRadius: 8,
    //       //     backgroundColor: "#6b6b6b",
    //       //     minHeight: 24,
    //       //     border: "3px solid #2b2b2b",
    //       //   },
    //       //   "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
    //       //     backgroundColor: "#959595",
    //       //   },
    //       //   "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
    //       //     backgroundColor: "#959595",
    //       //   },
    //       //   "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
    //       //     backgroundColor: "#959595",
    //       //   },
    //       //   "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
    //       //     backgroundColor: "#2b2b2b",
    //       //   },
    //       // },
    //       '*': {
    //         scrollbarWidth: 'thin',
    //         scrollbarColor: '#B7B7B7 transparent',
    //         '&::-webkit-scrollbar': {
    //           width: 6,
    //           height: 6,
    //           backgroundColor: 'transparent',
    //         },
    //         '&::-webkit-scrollbar-track': {
    //           backgroundColor: 'transparent',
    //         },
    //         '&::-webkit-scrollbar-thumb': {
    //           borderRadius: 6,
    //           backgroundColor: '#B7B7B7',
    //           minHeight: 24,
    //           minWidth: 24,
    //         },
    //         '&::-webkit-scrollbar-thumb:focus': {
    //           backgroundColor: '#adadad',
    //         },
    //         '&::-webkit-scrollbar-thumb:active': {
    //           backgroundColor: '#adadad',
    //         },
    //         '&::-webkit-scrollbar-thumb:hover': {
    //           backgroundColor: '#adadad',
    //         },
    //         '&::-webkit-scrollbar-corner': {
    //           backgroundColor: 'transparent',
    //         },
    //       },
    //     },
    //   },
    // }
  }))
);

// console.log("dark teams paper:", darkTheme.palette.teams.paper);
