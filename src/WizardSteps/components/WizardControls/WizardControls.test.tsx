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
  const defaultNavigationContext: NavigationInterface = {
    activeControls: undefined,
    activeStep: 0,
    activeState: undefined,
    isNavigableStep: jest.fn(),
    isValidStep: jest.fn(),
    nextStep: jest.fn(),
    previousStep: jest.fn(),
    setActiveControls: jest.fn(),
    setActiveState: jest.fn(),
    setActiveStep: jest.fn(),
  };
  let mockNextStep: jest.Mock;
  let mockPreviousStep: jest.Mock;

  beforeEach(() => {
    mockNextStep = jest.fn();
    mockPreviousStep = jest.fn();
    mockedUseNavigationContext.mockImplementation(() => ({
      ...defaultNavigationContext,
      nextStep: mockNextStep,
      previousStep: mockPreviousStep,
    }));
  });

  it('Should render correctly', () => {
    const { container } = render(<WizardControls />);
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(container.querySelector('.btn-prev').parentElement).toHaveClass(
      'col-6'
    );
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(container.querySelector('.btn-next').parentElement).toHaveClass(
      'col-6'
    );
  });

  it('should render active controls when navigation context has active controls', () => {
    mockedUseNavigationContext.mockImplementation(() => ({
      ...defaultNavigationContext,
      activeControls: [{ type: 'cancel', label: 'custom' }],
    }));
    render(<WizardControls />);
    expect(screen.getByText('custom')).toBeInTheDocument();
  });

  it('Should render custom controls when provided', () => {
    const controls: Array<WizardControl> = [
      {
        type: 'prev',
        label: 'backward',
      },
      {
        type: 'cancel',
        label: 'cancel',
      },
      {
        type: 'next',
        label: 'forward',
      },
    ];
    render(<WizardControls controls={controls} />);
    expect(screen.getByText('backward')).toBeInTheDocument();
    expect(screen.getByText('cancel')).toBeInTheDocument();
    expect(screen.getByText('forward')).toBeInTheDocument();
  });

  it('Should render single navigation control', () => {
    const { container, rerender } = render(
      <WizardControls
        controls={[
          {
            type: 'next',
            label: 'forward',
          },
        ]}
      />
    );
    expect(container.querySelector('.btn-next').parentElement).toHaveClass(
      'col-12'
    );
    rerender(
      <WizardControls
        controls={[
          {
            type: 'prev',
            label: 'backward',
          },
        ]}
      />
    );
    expect(container.querySelector('.btn-prev').parentElement).toHaveClass(
      'col-12'
    );
  });

  it('Should navigate to previous step when prev button is clicked', async () => {
    render(<WizardControls />);
    expect(mockPreviousStep).not.toHaveBeenCalled();
    await waitFor(() => fireEvent.click(screen.getByText('Back')));
    expect(mockPreviousStep).toHaveBeenCalledTimes(1);
  });

  it('Should navigate to next step when next button is clicked', async () => {
    render(<WizardControls />);
    expect(mockNextStep).not.toHaveBeenCalled();
    await waitFor(() => fireEvent.click(screen.getByText('Next')));
    expect(mockNextStep).toHaveBeenCalledTimes(1);
  });

  it('Should trigger custom controls handlers when clicked', async () => {
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
