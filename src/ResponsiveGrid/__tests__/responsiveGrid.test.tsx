import React from 'react'
import { act } from 'react-dom/test-utils'
import ResponsiveGrid from '../ResponsiveGrid'
import { screen } from '@testing-library/react'
import { render } from '../../Test.helpers/test-utils'

describe('<ResponsiveGrid/> component', () => {
  it('renders the responsive grid', () => {
    act(() => {
      render(<ResponsiveGrid parent={{ rowId: '' }} service={null} />)
    })
    expect(screen.getByText('Add Item')).toBeTruthy()
  })
})
