import React from 'react';
import { act } from 'react-dom/test-utils';
import Wizard from '../Wizard';
import { render, screen } from '@testing-library/react'
import { WIZARD_STATE } from "../../_components/wizardState";


  describe("<Wizard/> component", () => {
    it('renders the defaulwizard', () => {
        const comp = {
             wizardType: undefined
        }
        act(() => {
            render(<Wizard config={comp}/>);
        });
        // "Choose component" text seems to have been removed...
        expect(screen.getByText('Grid')).toBeTruthy();
    });

    it('renders the grid', () => {
        const comp = {
            wizardState: WIZARD_STATE.CONFIGURE_GRID
        }
        act(() => {
            render(<Wizard config={comp}/>);
        });
        expect(screen.getByTestId('tableConfigure')).toBeTruthy();
    });

    it('renders the tree filter', () => {
        const comp = {
            wizardState: WIZARD_STATE.CONFIGURE_TREE
        }
        act(() => {
            render(<Wizard config={comp}/>);
        });
        expect(screen.getByText('Configure Tree')).toBeTruthy();
    });
});
