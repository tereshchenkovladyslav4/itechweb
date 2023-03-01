import React from 'react';
import { act } from 'react-dom/test-utils';
import MenuFunction from '../MenuFunction';
import { screen } from '@testing-library/react'
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider

describe("<MenuFunction/> component", () => {
    it('renders a menu button', () => {
        var action = {
            name: 'menu action name',
            icon: 'Weekend'
        };
        const setHideTooltips = jest.fn();

        act(() => {
            render(<MenuFunction 
                action={action} 
                isDragging={false}
                hideTooltips={true}
                setHideTooltips={setHideTooltips}
            />
            );
        });
        expect(screen.getByRole('menuitem')).toBeTruthy();
    });
});
