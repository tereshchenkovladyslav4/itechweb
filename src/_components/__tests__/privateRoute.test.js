import React from 'react';
import { act } from 'react-dom/test-utils';
import {PrivateRoute} from '../PrivateRoute'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserType } from '../../Model/iTechRestApi/AuthenticateResponse';


const Component = () => {
    return <div data-testid='test-div'></div>
}

  describe("<PrivateRoute/> component", () => {
    it('no current user shows login', () => {
        act(() => {
            render(<MemoryRouter><PrivateRoute component={Component} location={{}} user={{}} /></MemoryRouter>);
        });
        expect(screen.queryByTestId('test-div')).toBeFalsy();
    });

    it('has current external user shows login', () => {
        act(() => {
            render(<MemoryRouter><PrivateRoute component={Component} location={{}} user={{userType:UserType.external}} /></MemoryRouter>);
        });
        expect(screen.queryByTestId('test-div')).toBeFalsy();
    });

    it('has current user internal user shows component', () => {
        act(() => {
            render(<MemoryRouter><PrivateRoute component={Component} location={{}} user={{currentUserValue: {userType:UserType.internal}}}/></MemoryRouter>);
        });
        expect(screen.queryByTestId('test-div')).toBeTruthy();
    });
});
