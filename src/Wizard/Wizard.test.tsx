import { render, screen } from '@testing-library/react';
import React from 'react';
import Wizard from './Wizard';

describe('Component: Wizard', () => {
  it('Should render correctly', () => {
    render(<Wizard toggle />);
    const wizardModal = screen.getByRole('dialog');
    expect(wizardModal).toBeInTheDocument();
    expect(wizardModal.querySelector('.wizard')).toBeInTheDocument();
  });

  it('Should be visibile when toggle flag is true', () => {
    render(<Wizard toggle={true} />);
    expect(screen.getByRole('dialog')).toHaveClass('show');
  });

  it('Should be hidden when toggle flag is false', () => {
    const { rerender } = render(<Wizard toggle={true} />);
    rerender(<Wizard toggle={false} />);
    expect(screen.getByRole('dialog')).not.toHaveClass('show');
    expect(screen.getByRole('dialog')).toHaveClass('hide');
  });
});
