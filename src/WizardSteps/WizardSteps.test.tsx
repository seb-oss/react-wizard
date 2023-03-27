import { fireEvent, render, screen } from '@testing-library/react';
import { match, MemoryRouter, useRouteMatch } from 'react-router-dom';
import { NavigationProvider, useNavigationContext } from '../contexts/navigationContext';
import WizardSteps, { WizardStepConfig, WizardStepsProps } from './WizardSteps';

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useRouteMatch: jest.fn(),
}));

const mockUseRouteMatch = useRouteMatch as jest.Mock<match>;

function FinalStep() {
  const { completeWizard } = useNavigationContext();
  return (
    <div>
      Final step content <button onClick={completeWizard}>complete wizard</button>
    </div>
  );
}

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
        label: 'Disabled step link',
        component: () => <div>Disabled step content</div>,
        data: {
          heading: 'Disabled step heading',
        },
        disabled: true,
      },
      {
        path: '/step4',
        label: 'Final Step link',
        component: FinalStep,
        data: {
          heading: 'Final step heading',
        },
      },
    ],
  };

  function renderWithRouter(
    route: string = '/',
    strict: boolean = true,
    props: WizardStepsProps = wizardStepsProps
  ) {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <NavigationProvider strict={strict}>
          <WizardSteps {...props} />
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

  it('Should render nested steps correctly', () => {
    renderWithRouter('/nested', false, {
      ...wizardStepsProps,
      steps: [
        {
          path: '/parent',
          label: 'Parent Step link',
          component: () => <div>Parent step content</div>,
          data: {
            heading: 'Parent step heading',
          },
          steps: [
            {
              path: '/nested',
              label: 'Nested Step link',
              component: () => <div>Nested step content</div>,
              data: {
                heading: 'Nested step heading',
              },
            },
          ],
        },
      ],
    });
    expect(screen.getByText('Nested step content')).toBeInTheDocument();
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

  it('Should render the next immediate step when the step is navigable', async () => {
    const nextStep: WizardStepConfig = wizardStepsProps.steps[1];
    renderWithRouter(nextStep.path, false);
    expect(screen.getByText('Step 2 content')).toBeInTheDocument();
  });

  it('Should render final step when the wizard has completed', async () => {
    const nextStep: WizardStepConfig = wizardStepsProps.steps[3];
    renderWithRouter(nextStep.path, false);
    expect(screen.getByText('Final step content')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'complete wizard' }));
    expect(screen.getByText('Final step content')).toBeInTheDocument();
  });

  it('Should redirect user to previous active step when step is not navigable', () => {
    const nextStep: WizardStepConfig = wizardStepsProps.steps[1];
    renderWithRouter(nextStep.path);
    expect(screen.queryByText('Step 2 content')).not.toBeInTheDocument();
  });

  it('Should redirect user to previous active step when step is disabled', () => {
    const disabledStep: WizardStepConfig = wizardStepsProps.steps[2];
    renderWithRouter(disabledStep.path);
    expect(screen.queryByText('Disabled step content')).not.toBeInTheDocument();
  });

  it('Should redirect user to previous active step when step is not in range', () => {
    const outOfRangeStep: WizardStepConfig = wizardStepsProps.steps[3];
    renderWithRouter(outOfRangeStep.path);
    expect(screen.queryByText('Final step content')).not.toBeInTheDocument();
  });
});
