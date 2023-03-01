import React from 'react';
import { act } from 'react-dom/test-utils';
import SaveFilters from '../SaveFilters';
import { render, screen } from '@testing-library/react'

describe("<SaveFilter/> component", () => {
    it('renders the save filter form', () => {
        act(() => {
            render(<SaveFilters />);
        });
        expect(screen.getByText('Save Filters')).toBeTruthy();
    });
});
