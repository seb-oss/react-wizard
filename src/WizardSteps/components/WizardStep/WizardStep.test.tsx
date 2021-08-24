import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  NavigationInterface,
  useNavigationContext,
} from '../../../contexts/navigationContext';
import WizardStep, { WizardStepProps } from './WizardStep';

jest.mock('../../../contexts/navigationContext', () => ({
  useNavigationContext: jest.fn(),
}));

const mockedUseNavigationContext = useNavigationContext as jest.Mock<NavigationInterface>;

describe('Component: WizardStep', () => {
  const wizardStepProps: WizardStepProps = {
    step: 1,
    heading: 'Step heading',
    pageHeading: 'Step page heading',
    state: 'info',
  };
  const defaultNavigationContext: NavigationInterface = {
    activeControls: undefined,
    activeState: undefined,
    activeStep: 0,
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
  let mockSetActiveControls: jest.Mock;
  let mockSetActiveState: jest.Mock;
  let mockSetActiveStep: jest.Mock;

  beforeEach(() => {
    mockSetActiveControls = jest.fn();
    mockSetActiveState = jest.fn();
    mockSetActiveStep = jest.fn();
    mockedUseNavigationContext.mockImplementation(() => ({
      ...defaultNavigationContext,
      setActiveControls: mockSetActiveControls,
      setActiveState: mockSetActiveState,
      setActiveStep: mockSetActiveStep,
    }));
  });

  it('Should render correctly', () => {
    render(<WizardStep {...wizardStepProps}>Step main content</WizardStep>);
    expect(screen.getByText('Step heading')).toBeInTheDocument();
    expect(screen.getByText('Step page heading')).toBeInTheDocument();
    expect(screen.getByText('Step main content')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('Should render with secondary content', () => {
    render(
      <WizardStep
        {...wizardStepProps}
        secondaryContent={<div>Secondary content</div>}
      />
    );
    expect(screen.getByText('Secondary content')).toBeInTheDocument();
  });

  it('Should render heading as pageHeading when pageHeading is not provided', () => {
    render(<WizardStep {...wizardStepProps} pageHeading={undefined} />);
    expect(screen.getAllByText('Step heading')).toHaveLength(2);
  });

  it('Should configured current step as active step', () => {
    expect(mockSetActiveStep).not.toHaveBeenCalled();
    render(<WizardStep {...wizardStepProps} />);
    expect(mockSetActiveStep).toHaveBeenNthCalledWith(1, wizardStepProps.step);
  });

  it('Should configured current controls as active controls when active controls is not defined', () => {
    expect(mockSetActiveControls).not.toHaveBeenCalled();
    render(<WizardStep {...wizardStepProps} />);
    expect(mockSetActiveControls).toHaveBeenCalledTimes(1);
  });

  it('Should not override active controls with current controls when active controls is defined', () => {
    // TODO: assert functional updates for active controls
  });

  it('Should cleanup active controls when step is unmounted', () => {
    const { unmount } = render(<WizardStep {...wizardStepProps} />);
    unmount();
    expect(mockSetActiveControls).toHaveBeenLastCalledWith(undefined);
  });

  it('Should configured current state as active state when active state is not defined', () => {
    expect(mockSetActiveState).not.toHaveBeenCalled();
    render(<WizardStep {...wizardStepProps} />);
    expect(mockSetActiveState).toHaveBeenCalledTimes(1);
  });

  it('Should not override active state with current state when active state is defined', () => {
    // TODO: assert functional updates for active state
  });

  it('Should cleanup active state when step is unmounted', () => {
    const { unmount } = render(<WizardStep {...wizardStepProps} />);
    unmount();
    expect(mockSetActiveState).toHaveBeenLastCalledWith(undefined);
  });
});
