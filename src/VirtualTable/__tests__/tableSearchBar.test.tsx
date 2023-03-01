import React from 'react'
import { act } from 'react-dom/test-utils'
import TableSearchBar from '../TableSearchBar'
import { screen } from '@testing-library/react'
import { render } from '../../Test.helpers/test-utils' // custom render that wraps with themeprovider

describe('<TableSearchBar/> component', () => {
  it('renders the search bar', async () => {
    const searchMock = jest.fn()
    const loadDataMock = jest.fn()
    const mockToggleVisibility = jest.fn()
    const mockOnOptionsChange = jest.fn()
    const data = [{}]

    act(() => {
      render(
        <TableSearchBar
          onChange={searchMock}
          numberOfResultsFound={0}
          numberOfResultsReturned={data.length}
          onLoadResults={loadDataMock}
          toggleSearchVisibility={mockToggleVisibility}
          isSearchVisible={true}
          value={'searchText'}
          area={''}
          dataSource='test'
          onOptionsChange={mockOnOptionsChange}
          onClear={() => {}}
          onSubmit={() => {}}
          timePeriod={1}
          setTimePeriod={() => {}}
          setFilterModels={() => {}}
        />,
      )
    })

    expect(await screen.getByLabelText('Search...')).toBeTruthy()
  })
})
