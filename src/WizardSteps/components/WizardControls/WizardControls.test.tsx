import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import {
  NavigationInterface,
  useNavigationContext,
} from '../../../contexts/navigationContext';
import WizardControls, { WizardControl } from './WizardControls';

jest.mock('../../../contexts/navigationContext', () => ({
  useNavigationContext: jest.fn(),
}));

const mockedUseNavigationContext = useNavigationContext as jest.Mock<NavigationInterface>;

describe('Component: WizardControls', () => {
  let mockNextStep: jest.Mock;
  let mockPreviousStep: jest.Mock;

  beforeEach(() => {
    mockNextStep = jest.fn();
    mockPreviousStep = jest.fn();
    mockedUseNavigationContext.mockImplementation(() => ({
      activeStep: 0,
      activeState: undefined,
      isValidStep: jest.fn(),
      nextStep: mockNextStep,
      previousStep: mockPreviousStep,
      setActiveState: jest.fn(),
      setActiveStep: jest.fn(),
    }));
  });

  it('Should render correctly', () => {
    render(<WizardControls />);
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('Should render with default controls', async () => {
    render(<WizardControls />);
    expect(mockPreviousStep).not.toHaveBeenCalled();
    await waitFor(() => {
      fireEvent.click(screen.getByText('Back'));
    });
    expect(mockPreviousStep).toHaveBeenCalledTimes(1);
    expect(mockNextStep).not.toHaveBeenCalled();
    await waitFor(() => {
      fireEvent.click(screen.getByText('Next'));
    });
    expect(mockNextStep).toHaveBeenCalledTimes(1);
  });

  it('Should render with custom controls', async () => {
    const controls: Array<WizardControl> = [
      {
        type: 'prev',
        label: 'backward',
        onClick: jest.fn().mockReturnValue(true),
      },
      {
        type: 'cancel',
        label: 'cancel',
        onClick: jest.fn().mockReturnValue(true),
      },
      {
        type: 'next',
        label: 'forward',
        onClick: jest.fn().mockResolvedValue(true),
      },
    ];
    render(<WizardControls controls={controls} />);
    // back button assertion
    const backButton = screen.getByText('backward');
    expect(backButton).toBeInTheDocument();
    expect(mockPreviousStep).not.toHaveBeenCalled();
    expect(controls[0].onClick).not.toHaveBeenCalled();
    await waitFor(() => {
      fireEvent.click(backButton);
    });
    expect(controls[0].onClick).toHaveBeenCalledTimes(1);
    expect(mockPreviousStep).toHaveBeenCalledTimes(1);
    // cancel button assertion
    const cancelButton = screen.getByText('cancel');
    expect(cancelButton).toBeInTheDocument();
    expect(controls[1].onClick).not.toHaveBeenCalled();
    await waitFor(() => {
      fireEvent.click(cancelButton);
    });
    expect(controls[1].onClick).toHaveBeenCalledTimes(1);
    // next button assertion
    const nextButton = screen.getByText('forward');
    expect(nextButton).toBeInTheDocument();
    expect(mockNextStep).not.toHaveBeenCalled();
    expect(controls[2].onClick).not.toHaveBeenCalled();
    await waitFor(() => {
      fireEvent.click(nextButton);
    });
    expect(controls[2].onClick).toHaveBeenCalledTimes(1);
    expect(mockNextStep).toHaveBeenCalledTimes(1);
  });

  it('Should block navigation when custom controls handler return false', async () => {
    const controls: Array<WizardControl> = [
      {
        type: 'prev',
        label: 'backward',
        onClick: jest.fn().mockReturnValue(false),
      },
      {
        type: 'next',
        label: 'forward',
        onClick: jest.fn().mockResolvedValue(false),
      },
    ];
    render(<WizardControls controls={controls} />);
    // back button assertion
    const backButton = screen.getByText('backward');
    expect(mockPreviousStep).not.toHaveBeenCalled();
    expect(controls[0].onClick).not.toHaveBeenCalled();
    await waitFor(() => {
      fireEvent.click(backButton);
    });
    expect(controls[0].onClick).toHaveBeenCalledTimes(1);
    expect(mockPreviousStep).not.toHaveBeenCalled();
    // next button assertion
    const nextButton = screen.getByText('forward');
    expect(mockNextStep).not.toHaveBeenCalled();
    expect(controls[1].onClick).not.toHaveBeenCalled();
    await waitFor(() => {
      fireEvent.click(nextButton);
    });
    expect(controls[1].onClick).toHaveBeenCalledTimes(1);
    expect(mockNextStep).not.toHaveBeenCalled();
  });
});
