import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import WizardSteps, { WizardStepsProps } from './WizardSteps';

describe('Component: WizardSteps', () => {
  const wizardStepsProps: WizardStepsProps = {
    navigationMobileHeading: 'Introduction',
    navigationMobileDescription: 'Step {activeStep} of {totalStep}',
    steps: [
      {
        path: '/',
        label: 'Step 1 link',
        component: () => <div>Step 1 content</div>,
        data: {
          heading: 'Step 1 heading',
        },
      },
      {
        path: '/step2',
        label: 'Step 2 link',
        component: () => <div>Step 2 content</div>,
        data: {
          heading: 'Step 2 heading',
        },
      },
      {
        path: '/step3',
        label: 'Step 3 link',
        component: () => <div>Step 3 content</div>,
        data: {
          heading: 'Step 3 heading',
        },
      },
    ],
  };

  function renderWithRouter(route: string = '/') {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <WizardSteps {...wizardStepsProps} />
      </MemoryRouter>
    );
  }

  it('Should render correctly', () => {
    renderWithRouter();
    expect(screen.getByText('Step 1 link')).toBeInTheDocument();
    expect(screen.getByText('Step 2 link')).toBeInTheDocument();
    expect(screen.getByText('Step 3 link')).toBeInTheDocument();
    expect(screen.getByText('Step 1 content')).toBeInTheDocument();
  });

  it('Should render step when step is in range', () => {
    renderWithRouter(wizardStepsProps.steps[1].path);
    expect(screen.getByText('Step 2 content')).toBeInTheDocument();
  });

  it('Should redirect user to previous active step when step is not in range', () => {
    renderWithRouter(wizardStepsProps.steps[2].path);
    expect(screen.getByText('Step 1 content')).toBeInTheDocument();
  });
});
