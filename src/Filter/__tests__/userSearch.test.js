import React from 'react';
import { act } from 'react-dom/test-utils';
import UserSearch from '../UserSearch';
import { render, screen } from '@testing-library/react'


  describe("<UserSearch/> component", () => {
    it('renders the filter user autocomplete', () => {
        var mock = jest.fn();
        act(() => {
            render(<UserSearch  setValue={mock} value='' datatype={14}/>);
        });
        expect(screen.getByLabelText('Search...')).toBeTruthy();
    });

});
