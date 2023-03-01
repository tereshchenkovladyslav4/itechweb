import React from 'react';
import { act } from 'react-dom/test-utils';
import IconPicker from '../IconPicker';
import { render } from '@testing-library/react'

describe("<IconPicker/> component", () => {
    it('renders the icon picker', () => {

        var container;
        var mock = jest.fn();
        act(() => {
            container = render(<IconPicker  icon='Weekend' setIcon={mock}/>).container;
        });
        expect(container.querySelector('button')).toBeTruthy();
    });
});
