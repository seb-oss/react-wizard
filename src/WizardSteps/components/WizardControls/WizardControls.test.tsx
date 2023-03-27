/* eslint-disable testing-library/no-node-access */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  NavigationInterface,
  useNavigationContext,
} from '../../../contexts/navigationContext';
import WizardControls, { WizardControl } from './WizardControls';

jest.mock('../../../contexts/navigationContext');

const { defaultNavigationInterface } = global;
const mockedUseNavigationContext = useNavigationContext as jest.Mock<NavigationInterface>;

describe('Component: WizardControls', () => {
  let mockNextStep: jest.Mock;
  let mockPreviousStep: jest.Mock;

  beforeEach(() => {
    mockNextStep = jest.fn();
    mockPreviousStep = jest.fn();
    mockedUseNavigationContext.mockImplementation(() => ({
      ...defaultNavigationInterface,
      nextStep: mockNextStep,
      previousStep: mockPreviousStep,
    }));
  });

  it('Should render correctly', () => {
    render(<WizardControls />);
    const backButton = screen.getByRole('button', { name: 'Back' });
    expect(backButton).toBeInTheDocument();
    expect(backButton.parentElement).toHaveClass('col-6');
    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton).toBeInTheDocument();
    expect(nextButton.parentElement).toHaveClass('col-6');
  });

  it('should render active controls when navigation context has active controls', () => {
    mockedUseNavigationContext.mockImplementation(() => ({
      ...defaultNavigationInterface,
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
    const { rerender } = render(
      <WizardControls
        controls={[
          {
            type: 'next',
            label: 'forward',
          },
        ]}
      />
    );
    expect(screen.getByRole('button', { name: 'forward' })?.parentElement).toHaveClass(
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
    expect(screen.getByRole('button', { name: 'backward' })?.parentElement).toHaveClass(
      'col-12'
    );
  });

  it('Should navigate to previous step when prev button is clicked', async () => {
    render(<WizardControls />);
    expect(mockPreviousStep).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Back'));
    await waitFor(() => expect(mockPreviousStep).toHaveBeenCalledTimes(1));
  });

  it('Should navigate to next step when next button is clicked', async () => {
    render(<WizardControls />);
    expect(mockNextStep).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Next'));
    await waitFor(() => expect(mockNextStep).toHaveBeenCalledTimes(1));
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
    fireEvent.click(backButton);
    await waitFor(() => expect(controls[0].onClick).toHaveBeenCalledTimes(1));
    expect(mockPreviousStep).toHaveBeenCalledTimes(1);
    // cancel button assertion
    const cancelButton = screen.getByText('cancel');
    expect(cancelButton).toBeInTheDocument();
    expect(controls[1].onClick).not.toHaveBeenCalled();
    fireEvent.click(cancelButton);
    await waitFor(() => expect(controls[1].onClick).toHaveBeenCalledTimes(1));
    // next button assertion
    const nextButton = screen.getByText('forward');
    expect(nextButton).toBeInTheDocument();
    expect(mockNextStep).not.toHaveBeenCalled();
    expect(controls[2].onClick).not.toHaveBeenCalled();
    fireEvent.click(nextButton);
    await waitFor(() => expect(controls[2].onClick).toHaveBeenCalledTimes(1));
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
    fireEvent.click(backButton);
    await waitFor(() => expect(controls[0].onClick).toHaveBeenCalledTimes(1));
    expect(mockPreviousStep).not.toHaveBeenCalled();
    // next button assertion
    const nextButton = screen.getByText('forward');
    expect(mockNextStep).not.toHaveBeenCalled();
    expect(controls[1].onClick).not.toHaveBeenCalled();
    fireEvent.click(nextButton);
    await waitFor(() => expect(controls[1].onClick).toHaveBeenCalledTimes(1));
    expect(mockNextStep).not.toHaveBeenCalled();
  });
});
