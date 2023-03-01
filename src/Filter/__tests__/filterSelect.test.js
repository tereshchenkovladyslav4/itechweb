import React from 'react';
import { act } from 'react-dom/test-utils';
import FilterSelect from '../FilterSelect';
import { render, screen } from '@testing-library/react'


  describe("<FilterSelect/> component", () => {
    it('renders the filter select dropdown', () => {
        var mock = jest.fn();
        var types = [{rowId: '1', description: 'desc'}]
        act(() => {
            render(<FilterSelect types={types} handleChange={mock} label='filterselect'/>);
        });
        expect(screen.getByLabelText('filterselect')).toBeTruthy();
    });

});
