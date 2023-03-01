import React from "react";
import MenuTitle from "../MenuTitle";
import { render } from "@testing-library/react";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { createTheme, adaptV4Theme } from "@mui/material";
import { StyledEngineProvider } from '@mui/material/styles';

describe("<MenuTitle/> component", () => {
  it("renders the menu title", () => {
    const mockCloseHandler = jest.fn();
    const theme = createTheme(adaptV4Theme({}));
    theme.direction = 'ltr';
    const { container } = render(
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <MenuTitle drawerCloseHandler={mockCloseHandler} />
        </ThemeProvider>
      </StyledEngineProvider>
    );
    expect(container.querySelector("img")).toBeTruthy();
  });
});
