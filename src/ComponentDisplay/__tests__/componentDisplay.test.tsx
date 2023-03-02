import React from 'react'
import { act } from 'react-dom/test-utils'
import ComponentDisplay from '../ComponentDisplay'
import { screen } from '@testing-library/react'
import { ComponentType } from '../componentType'
import { render } from '../../Test.helpers/test-utils'

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
    const { container } = await act(async () => render(<ComponentDisplay component={comp} dataIsSet={() => {}} />))
    expect(container.querySelectorAll("[data-testid='preview-undefined']").length).toBe(1)
  })

  it('renders Wizard', async () => {
    const comp = {
      data: { componentType: 'Wizard' },
    }
    const { container } = await act(async () => render(<ComponentDisplay component={comp} dataIsSet={() => {}} />))
    expect(container.querySelectorAll('div').length).toBeGreaterThan(1)
  })

  it('renders Wizard when null', async () => {
    const comp = {
      data: null,
    }
    const { container } = await act(async () => render(<ComponentDisplay component={comp} dataIsSet={() => {}} />))
    expect(container.querySelectorAll('div').length).toBeGreaterThan(1)
  })

  it('renders data when no matching component type', async () => {
    const comp = {
      data: { componentType: 'nomatch' },
    }
    const { container } = await act(async () => render(<ComponentDisplay component={comp} dataIsSet={() => {}} />))
    expect(container.querySelector('div div')?.textContent).toMatch(/nomatch/)
  })

  it('renders Tree Filter', async () => {
    const comp = {
      data: {
        componentType: 'Tree Filter',
        data: [],
      },
    }
    const { container } = await act(async () => render(<ComponentDisplay component={comp} dataIsSet={() => {}} />))
    expect(container.querySelectorAll('.treeView').length).toBe(1)
  })

  it('renders Advanced Filter', async () => {
    const comp = {
      data: { componentType: 'Advanced Filter' },
    }
    const { container } = await act(async () => render(<ComponentDisplay component={comp} dataIsSet={() => {}} />))
    expect(container.querySelectorAll('.filterControlBar').length).toBe(1)
  })

  it('renders Properties', async () => {
    const comp = {
      data: { componentType: 'Properties' },
    }
    const { container } = await act(async () => render(<ComponentDisplay component={comp} dataIsSet={() => {}} />))
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
      render(<ComponentDisplay component={comp} dataIsSet={() => {}} />)
    })

    expect(await screen.getByText('Loading Results')).toBeTruthy()
  })
})
