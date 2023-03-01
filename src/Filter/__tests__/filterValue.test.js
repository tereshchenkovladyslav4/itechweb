import React from 'react';
import { act } from 'react-dom/test-utils';
import FilterValue from '../FilterValue';
import { screen } from '@testing-library/react'
import { render} from '../../Test.helpers/test-utils'; // custom render that wraps with themeprovider


  describe("<FilterValue/> component", () => {
    it('renders the filter value for a datetime', () => {
        var mock = jest.fn();
        var types = [{rowId: '1', description: 'desc'}]
        act(() => {
            render(<FilterValue types={types} setValue={mock} datatype={8}/>);
        });
        expect(screen.getByLabelText('Start')).toBeTruthy();
    });

    it('renders the filter value for a boolean', () => {
        var mock = jest.fn();
        var types = [{rowId: '1', description: 'desc'}]
        act(() => {
            render(<FilterValue types={types} setValue={mock} name='filterselect' datatype={1}/>);
        });
        expect(screen.getByTestId('filterselect')).toBeTruthy();
    });

    it('renders the filter value for a string', () => {
        var mock = jest.fn();
        act(() => {
            render(<FilterValue  setValue={mock} name='filterselect' datatype={9}/>);
        });
        expect(screen.getByLabelText('Value')).toBeTruthy();
    });

    it('renders the filter value for a int or long', () => {
        var mock = jest.fn();
        act(() => {
            render(<FilterValue  setValue={mock} name='filterselect' datatype={4}/>);
        });
        expect(screen.getByLabelText('Value')).toBeTruthy();
    });

    it('renders the filter value for a type', () => {
        var mock = jest.fn();
        act(() => {
            render(<FilterValue  setValue={mock} name='filterselect' datatype={12}/>);
        });
        expect(screen.getByLabelText('Type')).toBeTruthy();
    });

    it('renders the filter value for a user', () => {
        var mock = jest.fn();
        act(() => {
            render(<FilterValue  setValue={mock} value='filterselect' datatype={13} fieldName="user"/>);
        });
        expect(screen.getByLabelText('Search...')).toBeTruthy();
    });

});
