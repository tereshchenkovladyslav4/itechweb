import React from 'react'
import { act } from 'react-dom/test-utils'
import Wizard from '../Wizard'
import { render, screen } from '@testing-library/react'
import { WIZARD_STATE } from '../../_components/wizardState'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material'
import { StyledEngineProvider } from '@mui/material/styles'

describe('<Wizard/> component', () => {
  const theme = createTheme({})

  it('renders the defaulwizard', () => {
    const comp = {
      wizardType: undefined,
    }
    act(() => {
      render(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Wizard config={comp} updateData={() => {}} area={''} />
          </ThemeProvider>
        </StyledEngineProvider>,
      )
    })
    // "Choose component" text seems to have been removed...
    expect(screen.getByText('Grid')).toBeTruthy()
  })

  it('renders the grid', () => {
    const comp = {
      wizardState: WIZARD_STATE.CONFIGURE_GRID,
    }
    act(() => {
      render(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Wizard config={comp} updateData={() => {}} area={''} />
          </ThemeProvider>
        </StyledEngineProvider>,
      )
    })
    expect(screen.getByTestId('tableConfigure')).toBeTruthy()
  })

  it('renders the tree filter', () => {
    const comp = {
      wizardState: WIZARD_STATE.CONFIGURE_TREE,
    }
    act(() => {
      render(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Wizard config={comp} updateData={() => {}} area={''} />
          </ThemeProvider>
        </StyledEngineProvider>,
      )
    })
    expect(screen.getByText('Configure Tree')).toBeTruthy()
  })
})
