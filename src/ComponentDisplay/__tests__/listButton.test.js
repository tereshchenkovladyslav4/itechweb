import React from 'react';
import { act } from 'react-dom/test-utils';
import { ListButton } from '../ListButton';
import { fireEvent, screen } from '@testing-library/react'
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider


  describe("<ListButton/> component", () => {
    it('renders', () => {
        act(() => {
            render(<ListButton icon='TableChart' name='listbutton'/>);
        });
        expect(screen.getByText('listbutton')).toBeTruthy();
    });

    it('click handler called', () => {
        const mockCallBack = jest.fn();
        act(() => {
            render(<ListButton icon='TableChart' name='listbutton' clickHandler={mockCallBack}/>);
        });
        fireEvent.click(screen.getByRole('button'))
        expect(mockCallBack.mock.calls.length).toEqual(1);
    });
});
