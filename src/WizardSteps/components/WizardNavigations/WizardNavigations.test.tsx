import { fireEvent, render, RenderResult, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  NavigationInterface,
  useNavigationContext,
} from '../../../contexts/navigationContext';
import { WizardNavigationData } from '../WizardNavigations/WizardNavigations';
import WizardNavigations, {
  PlaceholderTokens,
  WizardNavigationsProps,
} from './WizardNavigations';

jest.mock('../../../contexts/navigationContext');

const { defaultNavigationInterface } = global;
const mockedUseNavigationContext = useNavigationContext as jest.Mock<NavigationInterface>;

describe('Component: WizardNavigations', () => {
  const wizardNavigationsProps: WizardNavigationsProps = {
    navigationDescription: 'Description',
    navigations: [
      {
        label: 'Step 1',
        path: '/step1',
        step: 0,
      },
      {
        label: 'Step 2',
        path: '/step2',
        step: 1,
      },
      {
        label: 'Step 3',
        path: '/step3',
        step: 2,
      },
    ],
  };

  function renderWithRouter(props?: Partial<WizardNavigationsProps>): RenderResult {
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

  function assertNavigationsVisibility(visible: boolean) {
    if (visible) {
      expect(screen.getByRole('button')).toHaveClass(
        'wizard-navigations__toggle--active'
      );
    } else {
      expect(screen.getByRole('button')).not.toHaveClass(
        'wizard-navigations__toggle--active'
      );
    }
  }

  beforeEach(() => {
    mockedUseNavigationContext.mockImplementation(() => defaultNavigationInterface);
  });

  it('Should render correctly', () => {
    renderWithRouter();
    const { navigationDescription, navigations } = wizardNavigationsProps;
    expect(
      screen.getByRole('heading', { name: navigations[0].label })
    ).toBeInTheDocument();
    navigations.forEach((navigation: WizardNavigationData) =>
      assertLinkExist(navigation.label)
    );
    expect(screen.getByText(navigationDescription)).toBeInTheDocument();
    assertNavigationsVisibility(false);
    expect(screen.getAllByRole('link')).toHaveLength(navigations.length);
  });

  it('Should render introduction correctly', () => {
    const navigations: Array<WizardNavigationData> = [
      {
        label: 'Step 1',
        path: '/step1',
        step: 0,
        type: 'intro',
      },
    ];
    renderWithRouter({ navigations });
    expect(screen.getByRole('listitem')).toHaveClass('introduction');
  });

  describe('sub navigations', () => {
    const navigations = [
      {
        label: 'Step 1',
        path: '/step1',
        step: 0,
      },
      {
        label: 'Step 2',
        path: '/step2',
        step: 1,
        subNavigations: [
          {
            label: 'Step 2.1',
            path: '/step2.1',
            step: 2,
          },
          {
            label: 'Step 2.2',
            path: '/step2.2',
            step: 3,
          },
        ],
      },
      {
        label: 'Step 3',
        path: '/step3',
        step: 4,
      },
    ];

    function assertSubNavigationsVisibility(visible: boolean) {
      const [, subNavigations] = screen.getAllByRole('list');

      if (visible) {
        expect(subNavigations).not.toHaveClass('d-none');
      } else {
        expect(subNavigations).toHaveClass('d-none');
      }
    }

    it('Should render sub navigations correctly', () => {
      renderWithRouter({ navigations });
      navigations.forEach((navigation: WizardNavigationData) => {
        assertLinkExist(navigation.label);
        navigation.subNavigations?.forEach((subNavigation) => {
          assertLinkExist(subNavigation.label);
        });
      });
      expect(screen.getAllByRole('link')).toHaveLength(
        navigations.flatMap((navigation) => [
          navigation,
          ...(navigation.subNavigations ?? []),
        ]).length
      );
    });

    it('Should hide sub navigations when not needed', async () => {
      renderWithRouter({ navigations });
      assertSubNavigationsVisibility(false);
    });

    it('Should show sub navigations when needed', async () => {
      mockedUseNavigationContext.mockImplementation(() => ({
        ...defaultNavigationInterface,
        activeStep: 1,
      }));
      renderWithRouter({ navigations });
      assertSubNavigationsVisibility(true);
    });
  });

  it('Should inject tokens into navigation description when placeholders exists', () => {
    const activeStep = 1;
    const totalSteps = wizardNavigationsProps.navigations.length;
    const navigationDescription = `Step {${PlaceholderTokens.ACTIVE_STEP}} of {${PlaceholderTokens.TOTAL_STEPS}}`;
    renderWithRouter({ navigationDescription });
    expect(screen.getByText(`Step ${activeStep} of ${totalSteps}`)).toBeInTheDocument();
  });

  it('Should expand navigation list when toggle status is active', () => {
    renderWithRouter();
    toggleNavigations();
    assertNavigationsVisibility(true);
  });

  it('Should collapse navigation list when toggle status is inactive', () => {
    renderWithRouter();
    toggleNavigations();
    toggleNavigations();
    assertNavigationsVisibility(false);
  });

  it('Should navigate to selected step when navigation link clicked is navigable and step handler is valid', async () => {
    mockedUseNavigationContext.mockImplementation(() => ({
      ...defaultNavigationInterface,
      isNavigableStep: jest.fn().mockReturnValue(true),
      isValidStep: jest.fn().mockResolvedValue(true),
    }));
    renderWithRouter();
    expect(defaultNavigationInterface.nextStep).not.toHaveBeenCalled();
    navigateTo(1);
    await waitFor(() => {
      expect(defaultNavigationInterface.nextStep).toHaveBeenCalledTimes(1);
    });
  });

  it('Should retain at current step when navigation link clicked is navigable but step handler is invalid', async () => {
    mockedUseNavigationContext.mockImplementation(() => ({
      ...defaultNavigationInterface,
      isNavigableStep: jest.fn().mockReturnValue(true),
      isValidStep: jest.fn().mockResolvedValue(false),
    }));
    renderWithRouter();
    expect(defaultNavigationInterface.nextStep).not.toHaveBeenCalled();
    navigateTo(1);
    await waitFor(() => {
      expect(defaultNavigationInterface.nextStep).not.toHaveBeenCalled();
    });
  });

  it('Should retain at current step when navigation link clicked is navigable but step is disabled', async () => {
    mockedUseNavigationContext.mockImplementation(() => ({
      ...defaultNavigationInterface,
      isNavigableStep: jest.fn().mockReturnValue(true),
    }));
    renderWithRouter({
      navigations: [
        {
          label: 'Initial Step',
          path: '/initialstep',
          step: 0,
        },
        {
          disabled: true,
          label: 'Disabled Step',
          path: '/disabledstep',
          step: 1,
        },
      ],
    });
    expect(defaultNavigationInterface.isValidStep).not.toHaveBeenCalled();
    expect(defaultNavigationInterface.nextStep).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('link', { name: 'Disabled Step' }));
    await waitFor(() => {
      expect(defaultNavigationInterface.nextStep).not.toHaveBeenCalled();
    });
    expect(defaultNavigationInterface.isValidStep).not.toHaveBeenCalled();
  });

  it('Should retain navigation list expansion when navigation link clicked is not navigable', async () => {
    mockedUseNavigationContext.mockImplementation(() => ({
      ...defaultNavigationInterface,
      isNavigableStep: jest.fn().mockReturnValue(false),
    }));
    renderWithRouter();
    toggleNavigations();
    assertNavigationsVisibility(true);
    navigateTo(2);
    await waitFor(() => {
      assertNavigationsVisibility(true);
    });
  });

  it('Should collapse navigation list when navigate to previous step', async () => {
    mockedUseNavigationContext.mockImplementation(() => ({
      ...defaultNavigationInterface,
      activeStep: 2,
      isNavigableStep: jest.fn().mockReturnValue(true),
    }));
    renderWithRouter();
    toggleNavigations();
    assertNavigationsVisibility(true);
    navigateTo(1);
    await waitFor(() => {
      assertNavigationsVisibility(false);
    });
  });
});
