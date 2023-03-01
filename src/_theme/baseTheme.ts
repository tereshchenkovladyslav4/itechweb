declare module "@mui/material/styles/createPalette" {
  export interface Teams {
    message: string;
    paper: string;
  }

  export interface TeamsOptions {
    message?: string;
    paper?: string;
  }

  export interface Palette {
    teams: Teams;
  }

  export interface PaletteOptions {
    teams?: TeamsOptions;
  }

  export interface TypeBackground {
    default: string;
    paper: string;
    component: string;
    menu: string;
  }

  interface Palette {
    button: Palette["primary"];
    disable: Palette["primary"];
    neutral: Palette["primary"];
    notification: Palette["primary"];
    warning: Palette["primary"];
    link: Palette["primary"];
  }

  interface PaletteOptions {
    button?: PaletteOptions["primary"];
    disable?: PaletteOptions["primary"];
    neutral?: PaletteOptions["primary"];
    notification?: PaletteOptions["primary"];
    warning?: PaletteOptions["primary"];
    link?: PaletteOptions["primary"];
  }

  interface PaletteColor {
    active?: string;
  }
}

export function container(): Element {
  // Use the fullscreen element if in fullscreen mode, otherwise just the document's body
  return document.fullscreenElement ?? document.body;
}

// all common theme properties
const baseTheme = {
  // provide function to set element so can see item when in fullscreen
  props: {
    MuiPopover: {
      container: container,
    },
    MuiMenu: {
      container: container,
    },
    MuiTooltip: {
      PopperProps: {
        container: container,
      },
    },
    MuiSelect: {
      MenuProps: {
        container: container,
      },
    },
    MuiInputBase: {
      autoComplete: "off",
    },
  },
  overrides: {
    MuiPaper: {
      root: {
        borderWidth: 0,
      },
    },
    MuiTab: {
      root: {
        textTransform: "none",
        minWidth: "100px!important",
        color: "#20242d",
      },
    },
    MuiLink: {
      root: {
        textDecoration: "none",
        "&:hover": {
          textDecoration: "underline",
        },
      },
    },
    MuiInputLabel: {
      root: {
        fontSize: 14,
      },
      outlined: {
        zIndex: 3,
        // transform: "translate(14px, 11px) scale(1)",
        transform: "translate(11px, -7px) scale(0.75)",
      },
      // shrink: {
      //   transform: "translate(0, 0) scale(0.75)",
      //   fontSize: 16,
      // },
    },
    MuiOutlinedInput: {
      input: {
        padding: "10px 14px",
        autocomplete: "off",
      },
      root: {
        "& legend": {
          maxWidth: "unset",
        },
      },
    },
    // MuiFormControl: {
    //   root: {
    //     "&:has(.MuiFormLabel-root) > .MuiInputBase-root": {
    //       marginTop: 14,
    //     },
    //     "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
    //       transform: "translate(10px, 8px) scale(0.75)",
    //       fontSize: 16,
    //     },
    //   },
    // },
    MuiFormLabel: {
      root: {
        zIndex: 3,
      },
    },
    // MuiToolbar: {
    //   root: {
    //     alignItems: "flex-end",
    //   },
    // },
    // For Notes component
    MUIRichTextEditor: {
      root: {
        height: "98%",
      },
      container: {
        display: "flex",
        flexDirection: "column",
        height: "80%",
        margin: 0,
        marginBottom: 4,
      },
      editor: {
        display: "flex",
        flexDirection: "column",
        // overflowY: "none",
        overflowY: "auto",
        maxHeight: 200,
        margin: "4px 12px",
        minHeight: "20px",
      },
      toolbar: {
        position: "sticky",
      },
      placeHolder: {
        marginLeft: 20,
        // width: "inherit",
        width: "100%",
        position: "unset",
        // position: "absolute",
        // height:40,
        // top: "32px",
      },
    },
  },
};

// FOR WHEN NOT USING adaptV4Theme
// // all common theme properties
// const baseTheme = {
//   // provide function to set element so can see item when in fullscreen
//   components: {
//     MuiPopover: {
//       defaultProps: {
//         container: container,
//       },
//     },
//     MuiMenu: {
//       defaultProps: {
//         container: container,
//       },
//     },
//     MuiTooltip: {
//       PopperProps: {
//         defaultProps: {
//           container: container,
//         },
//       },
//     },
//     MuiSelect: {
//       MenuProps: {
//         defaultProps: {
//           container: container,
//         },
//       },
//     },
//     MuiInputBase: {
//       defaultProps: {
//         autoComplete: "off",
//       },
//     },
//     MuiTab: {
//       styleOverrides: {
//         root: {
//           textTransform: "none",
//           minWidth: "100px!important",
//           color: "#20242d",
//         },
//       },
//     },
//     MuiInputLabel: {
//       styleOverrides: {
//         // root: {
//         //   fontSize: 14,
//         // },
//         outlined: {
//           zIndex: 3,
//           // transform: "translate(14px, 11px) scale(1)",
//           transform: "translate(8px, -7px) scale(0.75)",
//         },
//         // shrink: {
//         //   transform: "translate(0, 0) scale(0.75)",
//         //   fontSize: 16,
//         // },
//       },
//     },
//     MuiOutlinedInput: {
//       styleOverrides: {
//         input: {
//           padding: "10px 14px",
//           autocomplete: "off",
//         },
//       },
//     },
//     MuiFormLabel: {
//       styleOverrides: {
//         root: {
//           zIndex: 3,
//         },
//       },
//     },
//     // For Notes component
//     MUIRichTextEditor: {
//       styleOverrides: {
//         root: {
//           height: "98%",
//         },
//         container: {
//           display: "flex",
//           flexDirection: "column",
//           height: "80%",
//           paddingBottom: "8px",
//         },
//         editor: {
//           display: "flex",
//           flexDirection: "column",
//           overflowY: "auto",
//           padding: "12px",
//           minHeight: "20px",
//         },
//         toolbar: {
//           position: "sticky",
//         },
//         placeHolder: {
//           paddingLeft: 20,
//           width: "inherit",
//           position: "absolute",
//           top: "28px",
//         },
//       },
//     },
//   },
//   // overrides: {
//   //   MuiTab: {
//   //     root: {
//   //       textTransform: "none",
//   //       minWidth: "100px!important",
//   //       color: "#20242d",
//   //     },
//   //   },
//   //   MuiInputLabel: {
//   //     // root: {
//   //     //   fontSize: 14,
//   //     // },
//   //     outlined: {
//   //       zIndex: 3,
//   //       // transform: "translate(14px, 11px) scale(1)",
//   //       transform: "translate(8px, -7px) scale(0.75)",
//   //     },
//   //     // shrink: {
//   //     //   transform: "translate(0, 0) scale(0.75)",
//   //     //   fontSize: 16,
//   //     // },
//   //   },
//   //   MuiOutlinedInput: {
//   //     input: {
//   //       padding: "10px 14px",
//   //       autocomplete: "off",
//   //     },
//   //   },
//   //   // MuiFormControl: {
//   //   //   root: {
//   //   //     "&:has(.MuiFormLabel-root) > .MuiInputBase-root": {
//   //   //       marginTop: 14,
//   //   //     },
//   //   //     "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
//   //   //       transform: "translate(10px, 8px) scale(0.75)",
//   //   //       fontSize: 16,
//   //   //     },
//   //   //   },
//   //   // },
//   //   MuiFormLabel: {
//   //     root: {
//   //       zIndex: 3,
//   //     },
//   //   },
//   //   // MuiToolbar: {
//   //   //   root: {
//   //   //     alignItems: "flex-end",
//   //   //   },
//   //   // },
//   //   // For Notes component
//   //   MUIRichTextEditor: {
//   //     root: {
//   //       height: "98%",
//   //     },
//   //     container: {
//   //       display: "flex",
//   //       flexDirection: "column",
//   //       height: "80%",
//   //       paddingBottom: "8px",
//   //     },
//   //     editor: {
//   //       display: "flex",
//   //       flexDirection: "column",
//   //       overflowY: "auto",
//   //       padding: "12px",
//   //       minHeight: "20px",
//   //     },
//   //     toolbar: {
//   //       position: "sticky",
//   //     },
//   //     placeHolder: {
//   //       paddingLeft: 20,
//   //       width: "inherit",
//   //       position: "absolute",
//   //       top: "28px",
//   //     },
//   //   },
//   // },
// };

export default baseTheme;
