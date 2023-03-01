// import { green, grey, orange, purple, red, teal, yellow } from "@mui/material/colors";

// colors taken from:

// const filterGroupColors = [
  //   "", // none as default
  //   red[500],
  //   orange[500],
  //   purple[500],
  //   green[500],
  //   teal[500],
  //   yellow[500],
  //   grey[900], // "black"
  // ];

  // TODO - probably don't want to use a string enum with the color values as if change any of the colors it effects persisted value
export enum FilterGroup {
  None = "",
  Red = "#f44336", // i.e. red[500]
  Orange = "#ff9800",
  Purple = "#9c27b0",
  Green = "#4caf50",
  Teal = "#009688",
  Yellow = "#ffeb3b",
  Brown = "#8d6e63",
  Blue = "#2196f3",
}


export const filterGroupColors = Object.values(FilterGroup);