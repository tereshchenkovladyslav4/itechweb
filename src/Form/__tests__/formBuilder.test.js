import React from 'react';
import { act } from 'react-dom/test-utils';
import FormBuilder from '../FormBuilder';
import { screen } from '@testing-library/react'
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider

describe("<FormBuilder/> component", () => {
    it('renders the form builder', () => {
        const mockOnChange = jest.fn();
        act(() => {
            render(<FormBuilder  propDisplay={true} onChange={mockOnChange}><form data-testid='form'></form></FormBuilder>);
        });
        expect(screen.getByTestId('form')).toBeTruthy();
        expect(mockOnChange.mock.calls.length).toEqual(1);
    });

    it('renders waiting when no form',  () => {
        const mockOnChange = jest.fn();
        var container;
        act(() => {
            container = render(<FormBuilder  propDisplay={false} onChange={mockOnChange} />).container;
        });
        expect(container.querySelector(".ProgressContainer")).toBeTruthy();
        expect(mockOnChange.mock.calls.length).toEqual(0);
    });
});
