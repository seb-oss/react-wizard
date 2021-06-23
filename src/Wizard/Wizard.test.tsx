import { render } from '@testing-library/react';
import React from 'react';
import Wizard from './Wizard';

describe('Component: Wizard', () => {
  it('Should render correctly', () => {
    const { container } = render(<Wizard />);
    expect(container.children[0]).toHaveClass('wizard');
  });
});
