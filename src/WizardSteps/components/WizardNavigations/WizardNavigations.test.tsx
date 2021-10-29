import {
  fireEvent,
  render,
  RenderResult,
  screen,
  waitFor,
} from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  NavigationInterface,
  useNavigationContext,
} from '../../../contexts/navigationContext';
import { WizardNavigationData } from '../WizardNavigation/WizardNavigation';
import WizardNavigations, {
  PlaceholderTokens,
  WizardNavigationsProps,
} from './WizardNavigations';

jest.mock('../../../contexts/navigationContext', () => ({
  useNavigationContext: jest.fn(),
}));

const mockedUseNavigationContext = useNavigationContext as jest.Mock<NavigationInterface>;

describe('Component: WizardNavigations', () => {
  const defaultNavigationContext: NavigationInterface = {
    activeControls: undefined,
    activeStep: 0,
    activeState: undefined,
    isWizardCompleted: false,
    completeWizard: jest.fn(),
    isNavigableStep: jest.fn(),
    isValidStep: jest.fn(),
    nextStep: jest.fn(),
    previousStep: jest.fn(),
    setActiveControls: jest.fn(),
    setActiveState: jest.fn(),
    setActiveStep: jest.fn(),
  };
  const wizardNavigationsProps: WizardNavigationsProps = {
    navigationDescription: 'Description',
    navigations: [
      {
        label: 'Step 1',
        path: '/step1',
      },
      {
        label: 'Step 2',
        path: '/step2',
      },
      {
        label: 'Step 3',
        path: '/step3',
      },
    ],
  };

  function renderWithRouter(
    props?: Partial<WizardNavigationsProps>
  ): RenderResult {
    return render(
      <MemoryRouter initialEntries={['/']}>
        <WizardNavigations {...{ ...wizardNavigationsProps, ...props }} />
      </MemoryRouter>
    );
  }

  function navigateTo(index: number) {
    const navLink = wizardNavigationsProps.navigations[index].label;
    fireEvent.click(screen.getByText(navLink));
  }

  function toggleNavigations() {
    fireEvent.click(screen.getByRole('button'));
  }

  function assertLinkExist(name: string): void {
    expect(screen.getByRole('link', { name })).toBeInTheDocument();
  }

  function assertNavigationsVisibility(
    container: HTMLElement,
    visible: boolean
  ) {
    const activeToggle = '.wizard-navigations__toggle--active';
    if (visible) {
      expect(container.querySelector(activeToggle)).toBeInTheDocument();
    } else {
      expect(container.querySelector(activeToggle)).not.toBeInTheDocument();
    }
  }

  beforeEach(() => {
    mockedUseNavigationContext.mockImplementation(
      () => defaultNavigationContext
    );
  });

  it('Should render correctly', () => {
    const { container } = renderWithRouter();
    const { navigationDescription, navigations } = wizardNavigationsProps;
    expect(
      screen.getByRole('heading', { name: navigations[0].label })
    ).toBeInTheDocument();
    navigations.forEach((navigation: WizardNavigationData) =>
      assertLinkExist(navigation.label)
    );
    expect(screen.getByText(navigationDescription)).toBeInTheDocument();
    assertNavigationsVisibility(container, false);
    expect(container.querySelectorAll('.wizard-navigation')).toHaveLength(
      navigations.length
    );
  });

  it('Should inject tokens into navigation description when placeholders exists', () => {
    const activeStep = 1;
    const totalSteps = wizardNavigationsProps.navigations.length;
    const navigationDescription = `Step {${PlaceholderTokens.ACTIVE_STEP}} of {${PlaceholderTokens.TOTAL_STEPS}}`;
    renderWithRouter({ navigationDescription });
    expect(
      screen.getByText(`Step ${activeStep} of ${totalSteps}`)
    ).toBeInTheDocument();
  });

  it('Should expand navigation list when toggle status is active', () => {
    const { container } = renderWithRouter();
    toggleNavigations();
    assertNavigationsVisibility(container, true);
  });

  it('Should collapse navigation list when toggle status is inactive', () => {
    const { container } = renderWithRouter();
    toggleNavigations();
    toggleNavigations();
    assertNavigationsVisibility(container, false);
  });

  it('Should navigate to selected step when navigation link clicked is navigable and step handler is valid', async () => {
    mockedUseNavigationContext.mockImplementation(() => ({
      ...defaultNavigationContext,
      isNavigableStep: jest.fn().mockReturnValueOnce(true),
      isValidStep: jest.fn().mockResolvedValueOnce(true),
    }));
    renderWithRouter();
    expect(defaultNavigationContext.nextStep).not.toHaveBeenCalled();
    await waitFor(() => {
      navigateTo(1);
    });
    expect(defaultNavigationContext.nextStep).toHaveBeenCalledTimes(1);
  });

  it('Should retain at current step when navigation link clicked is navigable but step handler is invalid', async () => {
    mockedUseNavigationContext.mockImplementation(() => ({
      ...defaultNavigationContext,
      isNavigableStep: jest.fn().mockReturnValueOnce(true),
      isValidStep: jest.fn().mockResolvedValueOnce(false),
    }));
    renderWithRouter();
    expect(defaultNavigationContext.nextStep).not.toHaveBeenCalled();
    await waitFor(() => {
      navigateTo(1);
    });
    expect(defaultNavigationContext.nextStep).not.toHaveBeenCalled();
  });

  it('Should retain at current step when navigation link clicked is navigable but step is disabled', async () => {
    mockedUseNavigationContext.mockImplementation(() => ({
      ...defaultNavigationContext,
      isNavigableStep: jest.fn().mockReturnValueOnce(true),
    }));
    renderWithRouter({
      navigations: [
        {
          label: 'Initial Step',
          path: '/initialstep',
        },
        {
          label: 'Disabled Step',
          path: '/disabledstep',
          disabled: true,
        },
      ],
    });
    expect(defaultNavigationContext.isValidStep).not.toHaveBeenCalled();
    expect(defaultNavigationContext.nextStep).not.toHaveBeenCalled();
    await waitFor(() => {
      fireEvent.click(screen.getByRole('link', { name: 'Disabled Step' }));
    });
    expect(defaultNavigationContext.nextStep).not.toHaveBeenCalled();
    expect(defaultNavigationContext.isValidStep).not.toHaveBeenCalled();
  });

  it('Should retain navigation list expansion when navigation link clicked is not navigable', async () => {
    mockedUseNavigationContext.mockImplementation(() => ({
      ...defaultNavigationContext,
      isNavigableStep: jest.fn().mockReturnValueOnce(false),
    }));
    const { container } = renderWithRouter();
    toggleNavigations();
    assertNavigationsVisibility(container, true);
    await waitFor(() => {
      navigateTo(2);
    });
    assertNavigationsVisibility(container, true);
  });

  it('Should collapse navigation list when navigate to previous step', async () => {
    mockedUseNavigationContext.mockImplementation(() => ({
      ...defaultNavigationContext,
      activeStep: 2,
      isNavigableStep: jest.fn().mockReturnValueOnce(true),
    }));
    const { container } = renderWithRouter();
    toggleNavigations();
    assertNavigationsVisibility(container, true);
    await waitFor(() => {
      navigateTo(1);
    });
    assertNavigationsVisibility(container, false);
  });
});
