import React from 'react';
import { act } from 'react-dom/test-utils';
import EditTab from '../EditTab';
import { screen } from '@testing-library/react'
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider

describe("<EditTab/> component", () => {
    it('renders the edit tab form', () => {
        act(() => {
            render(<EditTab title="Edit Tab" />);
        });
        expect(screen.getByText('Edit Tab')).toBeTruthy();
    });
});
