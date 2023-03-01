import React from 'react'
import { act } from 'react-dom/test-utils'
import ComponentDisplay from '../ComponentDisplay'
import { render, screen } from '@testing-library/react'
import { ComponentType } from '../componentType'
import { ThemeProvider } from '@mui/material/styles'
import { StyledEngineProvider } from '@mui/material/styles'
import { glLightTheme } from '../../_theme/glLightTheme'

// mock getAll for tableService module
jest.mock('../../_services/tableService', () => ({
  tableService: {
    getAll: () => {
      return Promise.resolve([])
    },
  },
}))

jest.mock('../../_services/dataService', () => ({
  dataService: {
    queryCount: () => {
      return Promise.resolve(1)
    },
  },
}))

describe('<ComponentDisplay/> component', () => {
  afterAll(() => {
    jest.resetModules()
  })

  it('renders Preview', async () => {
    const comp = {
      data: { componentType: 'Preview' },
    }
    var container
    await act(async () => {
      container = render(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={glLightTheme}>
            <ComponentDisplay component={comp} />
          </ThemeProvider>
        </StyledEngineProvider>,
      ).container
    })
    expect(container.querySelectorAll("[data-testid='preview-undefined']").length).toBe(1)
  })

  it('renders Wizard', () => {
    const comp = {
      data: { componentType: 'Wizard' },
    }
    var container
    act(() => {
      container = render(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={glLightTheme}>
            <ComponentDisplay component={comp} />
          </ThemeProvider>
        </StyledEngineProvider>,
      ).container
    })
    expect(container.querySelectorAll('div').length).toBeGreaterThan(1)
  })

  it('renders Wizard when null', () => {
    const comp = {
      data: null,
    }
    var container

    act(() => {
      container = render(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={glLightTheme}>
            <ComponentDisplay component={comp} />
          </ThemeProvider>
        </StyledEngineProvider>,
      ).container
    })
    expect(container.querySelectorAll('div').length).toBeGreaterThan(1)
  })

  it('renders data when no matching component type', () => {
    const comp = {
      data: { componentType: 'nomatch' },
    }
    var container

    act(() => {
      container = render(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={glLightTheme}>
            <ComponentDisplay component={comp} />
          </ThemeProvider>
        </StyledEngineProvider>,
      ).container
    })
    expect(container.querySelector('div div').textContent).toMatch(/nomatch/)
  })

  it('renders Tree Filter', async () => {
    const comp = {
      data: {
        componentType: 'Tree Filter',
        data: [],
      },
    }
    var container

    await act(async () => {
      container = render(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={glLightTheme}>
            <ComponentDisplay component={comp} />
          </ThemeProvider>
        </StyledEngineProvider>,
      ).container
    })
    expect(container.querySelectorAll('.treeView').length).toBe(1)
  })

  it('renders Advanced Filter', async () => {
    const comp = {
      data: { componentType: 'Advanced Filter' },
    }
    var container

    await act(async () => {
      container = render(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={glLightTheme}>
            <ComponentDisplay component={comp} />
          </ThemeProvider>
        </StyledEngineProvider>,
      ).container
    })
    expect(container.querySelectorAll('.filterControlBar').length).toBe(1)
  })

  it('renders Properties', async () => {
    const comp = {
      data: { componentType: 'Properties' },
    }
    var container

    await act(async () => {
      container = render(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={glLightTheme}>
            <ComponentDisplay component={comp} />
          </ThemeProvider>
        </StyledEngineProvider>,
      ).container
    })
    expect(container.querySelectorAll("[data-testid='properties-undefined']").length).toBe(1)
  })

  it('renders VirtualTable', async () => {
    const comp = {
      data: {
        componentType: ComponentType.VirtualTable,
        icon: '',
        subItems: [
          { width: 100, name: 'select' },
          { width: 200, name: 'checkbox' },
          { width: 50, name: 'ID' },
        ],
      },
    }

    await act(async () => {
      render(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={glLightTheme}>
            <ComponentDisplay component={comp} />
          </ThemeProvider>
        </StyledEngineProvider>,
      )
    })

    expect(await screen.getByText('Loading Results')).toBeTruthy()
  })
})
