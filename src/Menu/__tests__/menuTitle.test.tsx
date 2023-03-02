import React from 'react'
import MenuTitle from '../MenuTitle'
import { render } from '../../Test.helpers/test-utils'

describe('<MenuTitle/> component', () => {
  it('renders the menu title', () => {
    const mockCloseHandler = jest.fn()
    const { container } = render(<MenuTitle drawerCloseHandler={mockCloseHandler} />)
    expect(container.querySelector('img')).toBeTruthy()
  })
})
