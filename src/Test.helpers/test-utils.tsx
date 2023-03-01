import React, { FC, ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { StyledEngineProvider } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material/styles'
import { glLightTheme } from '../_theme/glLightTheme'

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={glLightTheme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
