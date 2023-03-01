import React from 'react';
import { act } from 'react-dom/test-utils';
import LoadingButton from '../LoadingButton';
// import { render } from '@testing-library/react'
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider

describe("<LoadingButton/> component", () => {
    it('renders the loading button', () => {
        var container;
        act(() => {
            container = render(<LoadingButton text='click me'/>).container;
        });
        expect(container.querySelector('button')).toBeTruthy();
    });
});
