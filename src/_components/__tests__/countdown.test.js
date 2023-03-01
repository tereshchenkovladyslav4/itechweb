import React from 'react';
import { act } from 'react-dom/test-utils';
import Countdown from '../Countdown';
import { render } from '@testing-library/react'


  describe("<Countdown/> component", () => {
    it('renders the countdown', () => {
        var container;
        act(() => {
            container = render(<Countdown  duration={2} timeLeft={1} completed={false}/>).container;
        });
        expect(container.querySelector('svg')).toBeTruthy();
    });

});
