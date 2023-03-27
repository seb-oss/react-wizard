import { fireEvent, render, RenderResult, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WizardNavigation, { WizardNavigationProps } from './WizardNavigation';

describe('Component: WizardNavigation', () => {
  const wizardNavigationProps: WizardNavigationProps = {
    label: 'Step 1',
    path: '/step1',
  };

  function renderWithRouter(props?: Partial<WizardNavigationProps>): RenderResult {
    return render(
      <MemoryRouter initialEntries={['/']}>
        <WizardNavigation {...{ ...wizardNavigationProps, ...props }} />
      </MemoryRouter>
    );
  }

  it('Should render correctly', () => {
    renderWithRouter();
    expect(screen.getByText(wizardNavigationProps.label)).toBeInTheDocument();
  });

  it('Should render active state', () => {
    renderWithRouter({ active: true });
    expect(screen.getByRole('link')).toHaveClass('wizard-navigation--active');
  });

  it('Should render completed state', () => {
    renderWithRouter({ completed: true });
    expect(screen.getByRole('link')).toHaveClass('wizard-navigation--passed');
  });

  it('Should render disabled state', () => {
    renderWithRouter({ disabled: true });
    expect(screen.getByRole('link')).toHaveClass('wizard-navigation--disabled');
  });

  it('Should render danger state', () => {
    renderWithRouter({ state: 'danger' });
    expect(screen.getByRole('link')).toHaveClass('wizard-navigation--danger');
  });

  it('Should render info state', () => {
    renderWithRouter({ state: 'info' });
    expect(screen.getByRole('link')).toHaveClass('wizard-navigation--info');
  });

  it('Should render warning state', () => {
    renderWithRouter({ state: 'warning' });
    expect(screen.getByRole('link')).toHaveClass('wizard-navigation--warning');
  });

  it('Should render success state', () => {
    renderWithRouter({ state: 'success' });
    expect(screen.getByRole('link')).toHaveClass('wizard-navigation--success');
  });

  it('Should trigger navigation click handler when provided', () => {
    const mockedOnClick = jest.fn();
    renderWithRouter({ onClick: mockedOnClick });
    expect(mockedOnClick).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText(wizardNavigationProps.label));
    expect(mockedOnClick).toHaveBeenCalledTimes(1);
  });
});
