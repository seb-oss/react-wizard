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
    mobileHeading: 'Introduction',
    mobileDescription: 'Description',
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

  beforeEach(() => {
    mockedUseNavigationContext.mockImplementation(
      () => defaultNavigationContext
    );
  });

  it('Should render correctly', () => {
    const { container } = renderWithRouter();
    const {
      mobileHeading,
      mobileDescription,
      navigations,
    } = wizardNavigationsProps;
    expect(screen.getByText(mobileHeading)).toBeInTheDocument();
    expect(screen.getByText(mobileDescription)).toBeInTheDocument();
    expect(container.querySelectorAll('.wizard-navigation')).toHaveLength(
      navigations.length
    );
  });

  it('Should inject tokens into navigation description when placeholders exists', () => {
    const activeStep = 1;
    const totalSteps = wizardNavigationsProps.navigations.length;
    const mobileDescription = `Step {${PlaceholderTokens.ACTIVE_STEP}} of {${PlaceholderTokens.TOTAL_STEPS}}`;
    renderWithRouter({ mobileDescription });
    expect(
      screen.getByText(`Step ${activeStep} of ${totalSteps}`)
    ).toBeInTheDocument();
  });

  it('Should expand navigation header when toggle is active', () => {
    const { container } = renderWithRouter();
    expect(
      container.querySelector('.wizard-navigations__toggle--active')
    ).toBeInTheDocument();
  });

  it('Should collapse navigation header when toggle is inactive', () => {
    const { container } = renderWithRouter();
    fireEvent.click(screen.getByRole('button'));
    expect(
      container.querySelector('.wizard-navigations__toggle--active')
    ).not.toBeInTheDocument();
  });

  it('Should collapse navigation header when valid navigation link is clicked', () => {
    mockedUseNavigationContext.mockImplementation(() => ({
      ...defaultNavigationContext,
      isValidStep: jest.fn().mockReturnValueOnce(true),
    }));
    const { container } = renderWithRouter();
    expect(
      container.querySelector('.wizard-navigations__toggle--active')
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByText(wizardNavigationsProps.navigations[1].label)
    );
    expect(
      container.querySelector('.wizard-navigations__toggle--active')
    ).not.toBeInTheDocument();
  });

  it('Should retain navigation header expansion when an invalid navigation link is clicked', () => {
    mockedUseNavigationContext.mockImplementation(() => ({
      ...defaultNavigationContext,
      isValidStep: jest.fn().mockReturnValueOnce(false),
    }));
    const { container } = renderWithRouter();
    expect(
      container.querySelector('.wizard-navigations__toggle--active')
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByText(wizardNavigationsProps.navigations[2].label)
    );
    expect(
      container.querySelector('.wizard-navigations__toggle--active')
    ).toBeInTheDocument();
  });
});
