import React from 'react';
import { TinyButton } from '../TinyButton';
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider

describe("<TinyButton/> component", () => {
    it('renders', () => {
        const {container} = render(<TinyButton icon='Weekend'/>);
        expect(container.querySelector("button")).toBeTruthy();
    });
});
