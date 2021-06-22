import { render, screen } from '@testing-library/react';
import React from 'react';
import WizardHeader from './WizardHeader';

describe('Component: WizardHeader', () => {
  it('Should render correctly', () => {
    render(<WizardHeader heading="Wizard Header" />);
    expect(screen.getByText('Wizard Header')).toBeInTheDocument();
  });
});
