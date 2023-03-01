import React from 'react';
import { act } from 'react-dom/test-utils';
import StaticMenuItem from '../StaticMenuItem';
import { render, screen } from '@testing-library/react'

describe("<StaticMenuItem/> component", () => {
    it('renders a menu item', () => {
        const mockClickHandler = jest.fn();

        act(() => {
            render(<StaticMenuItem 
                name='item name'
                onClick={mockClickHandler}
                showTooltipTitle={false}
                icon='Weekend'
            />
            );
        });
        expect(screen.getByText('item name')).toBeTruthy();
    });
});
