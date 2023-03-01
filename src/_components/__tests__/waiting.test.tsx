import React from 'react';
import Waiting from '../Waiting'
// import { render } from '@testing-library/react';
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider

describe("<Waiting/> component", () =>{
    it('renders', () => {
        const container = render(<Waiting />)
        expect(container.container).not.toBeEmptyDOMElement();
    });
});
