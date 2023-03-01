import React from 'react'
import { act } from 'react-dom/test-utils'
import MenuFunction from '../MenuFunction'
import { screen } from '@testing-library/react'
import { render } from '../../Test.helpers/test-utils'
import IconManager from '../../_components/IconManager'

describe('<MenuFunction/> component', () => {
  it('renders a menu button', () => {
    const action = {
      id: 1,
      name: 'menu action name',
      icon: <IconManager icon='Weekend' />,
    }

    act(() => {
      render(<MenuFunction action={action} isDragging={false} />)
    })
    expect(screen.getByRole('menuitem')).toBeTruthy()
  })
})
