import React from 'react';
import { act } from 'react-dom/test-utils';
import DateRangePicker from '../DateRangePicker';
import { screen } from '@testing-library/react'
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider


  describe("<DateRangePicker/> component", () => {
    it('renders the filter form', () => {
        var mock = jest.fn();
        act(() => {
            render(<DateRangePicker name='testDate' setValue={mock}/>);
        });
        expect(screen.getByLabelText('Start')).toBeTruthy();
    });

});
