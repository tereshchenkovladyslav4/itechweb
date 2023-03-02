import React from 'react'
import { act } from 'react-dom/test-utils'
import Menu from '../Menu'
import { screen } from '@testing-library/react'
import { BehaviorSubject } from 'rxjs'
import { render } from '../../Test.helpers/test-utils'

describe('<Menu/> component', () => {
  it('renders the menu', async () => {
    const location = { pathname: '/' }

    const mockTabService = {
      selected: jest.fn(),
      add: jest.fn(),
      update: jest.fn(),
    }

    const mockMenuService = {
      getAll: jest.fn(() => Promise.resolve([])),
      selected: jest.fn(),
      add: jest.fn(),
      position: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      edit: jest.fn(),
    }

    const currentUserSubject = new BehaviorSubject(true)

    const mockAuthService = {
      currentUserValue: true,
      currentUser: currentUserSubject.asObservable(),
    }

    const mockComponentService = {}
    await act(async () => {
      render(
        <Menu
          menuService={mockMenuService}
          tabService={mockTabService}
          authenticationService={mockAuthService}
          componentService={mockComponentService}
          location={location}
        />,
      )
    })
    expect(screen.getByText('Log out')).toBeTruthy()
  })
})
