import React from 'react'
import IconPicker from '../IconPicker'
import { render } from '../../Test.helpers/test-utils'

describe('<IconPicker/> component', () => {
  it('renders the icon picker', () => {
    const mock = jest.fn()
    const { container } = render(<IconPicker icon='Weekend' setIcon={mock} />)
    expect(container.querySelector('button')).toBeTruthy()
  })
})
