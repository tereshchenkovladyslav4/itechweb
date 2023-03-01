import React from 'react';
import { act } from 'react-dom/test-utils';
import TabItem from '../TabItem';
import { screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom';
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider

describe("<TabItem/> component", () => {
    it('renders a tab item', () => {
        const mockClickHandler = jest.fn();

        var item = {
            name: 'tab item name',
            icon: 'Weekend',
            path: '/',
            selected: false
        };
        const mockEditHandler = jest.fn();
        const mockDeleteHandler = jest.fn();
        const mockSetCurrentTab = jest.fn();
        const mockSetTabIndex = jest.fn();
        const mockMenuRef = jest.fn();
        const mockElsRef = {current:[]};

        act(() => {
            render(<MemoryRouter>
            <TabItem 
                item ={item}
                label={item.name}
                value={item.path}
                onEdit ={mockEditHandler}
                onDelete={mockDeleteHandler}
                innerRef={mockElsRef}
                menuRef={mockMenuRef}
                elRefs={mockElsRef}
                onSetTabIndex={mockSetTabIndex}
                setCurrentTab={mockSetCurrentTab}
                onClick={mockClickHandler}
                showTooltipTitle={false}
                icon='Weekend'
            />
            </MemoryRouter>
            );
        });
        expect(screen.getByText(item.name)).toBeTruthy();
    });
});
