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
  };
  let mockSetStep: jest.Mock;

  beforeEach(() => {
    mockSetStep = jest.fn();
    mockedUseNavigationContext.mockImplementation(() => ({
      activeStep: 0,
      isValidStep: jest.fn(),
      nextStep: jest.fn(),
      previousStep: jest.fn(),
      setStep: mockSetStep,
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
    expect(mockSetStep).not.toHaveBeenCalled();
    render(<WizardStep {...wizardStepProps} />);
    expect(mockSetStep).toHaveBeenNthCalledWith(1, wizardStepProps.step);
  });
});
