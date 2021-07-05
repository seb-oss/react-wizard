import { fireEvent, render, screen } from '@testing-library/react';
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
  let mockSetActiveState: jest.Mock;
  let mockSetActiveStep: jest.Mock;

  beforeEach(() => {
    mockSetActiveState = jest.fn();
    mockSetActiveStep = jest.fn();
    mockedUseNavigationContext.mockImplementation(() => ({
      activeState: undefined,
      activeStep: 0,
      isValidStep: jest.fn(),
      nextStep: jest.fn(),
      previousStep: jest.fn(),
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

  it('Should configured current state as active state', () => {
    expect(mockSetActiveState).not.toHaveBeenCalled();
    render(<WizardStep {...wizardStepProps} />);
    expect(mockSetActiveState).toHaveBeenNthCalledWith(
      1,
      wizardStepProps.state
    );
  });
});
