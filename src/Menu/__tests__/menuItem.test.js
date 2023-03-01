import React from 'react';
import { act } from 'react-dom/test-utils';
import Menuitem from '../MenuItem';
import { screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom';
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider

describe("<Menuitem/> component", () => {
    it('renders a menu item', () => {
        var item = {
            name: 'menu item name',
            icon: 'Weekend',
            path: '/',
            selected: false
        };
        const location = {pathname:'/'};
        const mockOpenHandler = jest.fn();
        const mockDeleteHandler = jest.fn();
        const mockSetCurrentMenu = jest.fn();
        const mockSetMenuIndex = jest.fn();
        const mockMenuRef = jest.fn();
        const mockElsRef = {current:[]};

        act(() => {
            render(<MemoryRouter><Menuitem 
                item={item} 
                disable={false}
                menuRef={mockMenuRef}
                elRefs={mockElsRef}
                innerRef={mockElsRef}
                key={item.position}
                location={location}
                onEdit={mockOpenHandler}
                onDelete={mockDeleteHandler}
                onSetCurrentMenu={mockSetCurrentMenu}
                onSetMenuIndex={mockSetMenuIndex}
            />
            </MemoryRouter>);
        });
        expect(screen.getByText('menu item name')).toBeTruthy();
    });
});
