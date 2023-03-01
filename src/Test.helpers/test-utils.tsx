import React, { FC, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { createTheme } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider} from "@mui/material/styles";

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  // const theme = createTheme(adaptV4Theme({}));
  const theme = createTheme({});
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
