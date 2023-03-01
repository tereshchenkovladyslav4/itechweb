import React from 'react';
import { act } from 'react-dom/test-utils';
import AreYouSure from '../AreYouSure';
import { render, screen } from '@testing-library/react'

describe("<AreYouSure/> component", () => {
    it('renders the are you sure form', () => {
        act(() => {
            render(<AreYouSure />);
        });
        expect(screen.getByText('Are you sure?')).toBeTruthy();
    });
});
