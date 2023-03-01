import React from 'react';
import { act } from 'react-dom/test-utils';
import TabList from '../TabList';
import { screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom';
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider

describe("<TabList/> component", () => {
    it('renders a tab item', () => {

        const location = {pathname:'/'};
        
        var item = {
            name: 'tab item name',
            icon: 'Weekend',
            path: '/',
            selected: false,
            rowId:2,
            isHightlighted:true,
        };
        const mockOpenFormHandler = jest.fn();
        const mockSetCurrentTab = jest.fn();
        const mockSetTabList = jest.fn();

        const mockTabs = [item];
        const mockCurrentMenu = {rowId:1, path:"/"};
        const mockTabService = {
            selected: jest.fn(),
            add: jest.fn(),
            update: jest.fn()
        }; 

        act(() => {
            render(<MemoryRouter>
            <TabList 
                location={location}
                tabList={mockTabs}
                parentMenu={mockCurrentMenu}
                setTabList={mockSetTabList}
                setCurrentTab={mockSetCurrentTab}
                handleFormOpen={mockOpenFormHandler}
                tabService={mockTabService}
            />
            </MemoryRouter>
            );
        });
        expect(screen.getByText(item.name)).toBeTruthy();
    });
});
