import IconList from '../iconList';
import React from 'react';
import { render } from '@testing-library/react'

describe("<IconList/>", () => {
    it('renders svg', () => {
        var container = render(<IconList iconName='Weekend'/>).container;
        expect(container.querySelector("svg")).toBeTruthy();
    });
});