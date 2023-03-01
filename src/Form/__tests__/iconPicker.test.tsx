import React from 'react'
import IconPicker from '../IconPicker'
import { render } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material'
import { StyledEngineProvider } from '@mui/material/styles'

describe('<IconPicker/> component', () => {
  it('renders the icon picker', () => {
    const mock = jest.fn()
    const theme = createTheme({})
    theme.direction = 'ltr'
    const { container } = render(
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <IconPicker icon='Weekend' setIcon={mock} />
        </ThemeProvider>
      </StyledEngineProvider>,
    )
    expect(container.querySelector('button')).toBeTruthy()
  })
})
