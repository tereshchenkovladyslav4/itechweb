import React from 'react';
import { act } from 'react-dom/test-utils';
import TreeConfigure from '../TreeConfigure';
import { render, screen } from '@testing-library/react'

describe("<TreeConfigure/> component", () => {
    it('renders the tree configure', () => {
        act(() => {
            render(<TreeConfigure />);
        });
        expect(screen.getByText('Configure Tree')).toBeTruthy();
    });
});
