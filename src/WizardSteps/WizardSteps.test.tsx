import { render, screen } from '@testing-library/react';
import React from 'react';
import { match, MemoryRouter, useRouteMatch } from 'react-router-dom';
import { NavigationProvider } from '../contexts/navigationContext';
import WizardSteps, { WizardStepConfig, WizardStepsProps } from './WizardSteps';

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useRouteMatch: jest.fn(),
}));

const mockUseRouteMatch = useRouteMatch as jest.Mock<match>;

describe('Component: WizardSteps', () => {
  const defaultRouteMatch: match = {
    isExact: true,
    params: {},
    path: '/',
    url: '/',
  };
  const wizardStepsProps: WizardStepsProps = {
    navigationDescription: 'Step {activeStep} of {totalSteps}',
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
        <NavigationProvider>
          <WizardSteps {...wizardStepsProps} />
        </NavigationProvider>
      </MemoryRouter>
    );
  }

  function assertLinkExist(name: string): void {
    expect(screen.getByRole('link', { name })).toBeInTheDocument();
  }

  beforeEach(() => {
    mockUseRouteMatch.mockReturnValue(defaultRouteMatch);
  });

  it('Should render correctly', () => {
    renderWithRouter();
    wizardStepsProps.steps.forEach((step: WizardStepConfig) =>
      assertLinkExist(step.label)
    );
    expect(screen.getByText('Step 1 content')).toBeInTheDocument();
  });

  it('Should render nested routes correctly', () => {
    const nestedPath = '/nested';
    mockUseRouteMatch.mockReturnValue({
      ...defaultRouteMatch,
      path: nestedPath,
      url: nestedPath,
    });
    renderWithRouter(nestedPath);
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
