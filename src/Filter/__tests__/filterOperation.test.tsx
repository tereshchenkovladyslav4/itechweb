import React from 'react'
import { act } from 'react-dom/test-utils'
import FilterOperation from '../FilterOperation'
import { render, screen } from '@testing-library/react'

describe('<FilterOperation/> component', () => {
  it('renders the filter operation dropdown', () => {
    const mock = jest.fn()
    act(() => {
      render(<FilterOperation value={''} types={['item1']} handleChange={mock} />)
    })
    expect(screen.getByLabelText('Operation')).toBeTruthy()
  })
})
