import React from 'react';
import { act } from 'react-dom/test-utils';
import TableSearchBar from '../TableSearchBar';
import { screen } from '@testing-library/react'
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider

describe("<TableSearchBar/> component",  () => {
    it('renders the search bar', async () => {
        var searchMock = jest.fn();
        var loadDataMock = jest.fn();
        var mockToggleVisibility = jest.fn();
        var mockOnOptionsChange = jest.fn();
        var data = [{}];

        act(() => {
            render(<TableSearchBar                  
                onChange={searchMock}
                numberOfResultsFound={ 0 }
                numberOfResultsReturned={ data.length }
                onLoadResults={loadDataMock}
                toggleSearchVisibility={mockToggleVisibility}
                isSearchVisible={true}
                value={'searchText'}
                area={null} 
                isVisible={true}
                dataSource="test"
                onOptionsChange={mockOnOptionsChange} />);
        });

        expect(await screen.getByText('0 Results')).toBeTruthy();
    });
});
