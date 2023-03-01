import React from 'react'
import { act } from 'react-dom/test-utils'
import ResponsiveGrid from '../ResponsiveGrid'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { StyledEngineProvider } from '@mui/material/styles'
import { glLightTheme } from '../../_theme/glLightTheme'

describe('<ResponsiveGrid/> component', () => {
  it('renders the responsive grid', () => {
    act(() => {
      render(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={glLightTheme}>
            <ResponsiveGrid parent={{ rowId: '' }} service={null} />
          </ThemeProvider>
        </StyledEngineProvider>,
      )
    })
    expect(screen.getByText('Add Item')).toBeTruthy()
  })
})
