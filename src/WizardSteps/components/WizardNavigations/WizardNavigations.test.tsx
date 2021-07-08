import {
  fireEvent,
  render,
  RenderResult,
  screen,
} from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  NavigationInterface,
  useNavigationContext,
} from '../../../contexts/navigationContext';
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
    activeStep: 0,
    activeState: undefined,
    isValidStep: jest.fn(),
    nextStep: jest.fn(),
    previousStep: jest.fn(),
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
    expect(screen.getByText(navigationDescription)).toBeInTheDocument();
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

  it('Should collapse navigations when toggle is inactive', () => {
    const { container } = renderWithRouter();
    assertNavigationsVisibility(container, false);
  });

  it('Should expand navigations when toggle is active', () => {
    const { container } = renderWithRouter();
    toggleNavigations();
    assertNavigationsVisibility(container, true);
  });

  it('Should collapse navigations when valid navigation link is clicked', () => {
    mockedUseNavigationContext.mockImplementation(() => ({
      ...defaultNavigationContext,
      isValidStep: jest.fn().mockReturnValueOnce(true),
    }));
    const { container } = renderWithRouter();
    toggleNavigations();
    assertNavigationsVisibility(container, true);
    navigateTo(1);
    assertNavigationsVisibility(container, false);
  });

  it('Should retain navigations expansion when an invalid navigation link is clicked', () => {
    mockedUseNavigationContext.mockImplementation(() => ({
      ...defaultNavigationContext,
      isValidStep: jest.fn().mockReturnValueOnce(false),
    }));
    const { container } = renderWithRouter();
    toggleNavigations();
    assertNavigationsVisibility(container, true);
    navigateTo(2);
    assertNavigationsVisibility(container, true);
  });
});
