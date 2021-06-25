import { render, screen } from '@testing-library/react';
import React from 'react';
import WizardHeader from './WizardHeader';

describe('Component: WizardHeader', () => {
  it('Should render correctly', () => {
    render(<WizardHeader heading="Wizard Header" />);
    expect(screen.getByText('Wizard Header')).toBeInTheDocument();
  });

  it('Should render with actions', () => {
    render(
      <WizardHeader
        heading="Wizard Header"
        actions={[<button>action 1</button>, <button>action 2</button>]}
      />
    );
    expect(screen.getByText('action 1')).toBeInTheDocument();
    expect(screen.getByText('action 2')).toBeInTheDocument();
  });
});
