import React from 'react';
import { act } from 'react-dom/test-utils';
import {AdvancedFilter} from '../AdvancedFilter';
import { screen } from '@testing-library/react'
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider


  describe("<AdvancedFilter/> component", () => {
    it('renders the filter form', () => {
      const mockUpdateData = jest.fn(() => "");
        act(() => {
            render(<AdvancedFilter area="area" data={{}} tabId={1} updateData={mockUpdateData} />);
        });
        expect(screen.getByText('Apply')).toBeTruthy();
    });

});
