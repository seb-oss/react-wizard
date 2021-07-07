import {
  fireEvent,
  render,
  RenderResult,
  screen,
} from '@testing-library/react';
import { createMemoryHistory, History } from 'history';
import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { WizardStepState } from '../WizardSteps/components/WizardStep';
import { NavigationProvider, useNavigationContext } from './navigationContext';

type DummyComponentProps = {
  mockState?: WizardStepState;
  mockStep?: number;
  nextPath?: string;
  prevPath?: string;
};

function DummyComponent(props: DummyComponentProps) {
  const { mockState, mockStep, nextPath, prevPath } = props;
  const {
    activeState,
    activeStep,
    isValidStep,
    nextStep,
    previousStep,
    setActiveState,
    setActiveStep,
  } = useNavigationContext();
  return (
    <div>
      <p data-testid="activeState">{activeState}</p>
      <p data-testid="activeStep">{activeStep}</p>
      <p data-testid="isValidStep">
        {isValidStep(mockStep) ? 'valid-next-step' : 'invalid-next-step'}
      </p>
      <button type="button" onClick={() => nextStep(nextPath)}>
        next step
      </button>
      <button type="button" onClick={() => previousStep(prevPath)}>
        previous step
      </button>
      <button type="button" onClick={() => setActiveState(mockState)}>
        set active state
      </button>
      <button type="button" onClick={() => setActiveStep(mockStep)}>
        set active step
      </button>
    </div>
  );
}

describe('Context: NavigationContext', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error');
  const ROUTES_LENGTH: number = 5;
  // generates an array of routes '/step0', '/step1', '/step2' ...
  const DEFAULT_ROUTES: Array<string> = [...Array(ROUTES_LENGTH)].map(
    (value, i) => `/step${i}`
  );

  function renderDummyComponent(
    props?: DummyComponentProps,
    history?: History,
    routes: Array<string> = DEFAULT_ROUTES
  ): RenderResult {
    return render(
      <NavigationProvider routes={routes}>
        <DummyComponent {...props} />
      </NavigationProvider>,
      {
        wrapper: history
          ? ({ children }) => <Router history={history}>{children}</Router>
          : ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      }
    );
  }

  function navigateForward() {
    fireEvent.click(screen.getByText('next step'));
  }

  function navigateBackward() {
    fireEvent.click(screen.getByText('previous step'));
  }

  function configureActiveState() {
    fireEvent.click(screen.getByText('set active state'));
  }

  function configureActiveStep() {
    fireEvent.click(screen.getByText('set active step'));
  }

  function assertActiveState(state: WizardStepState) {
    if (state) {
      expect(screen.getByTestId('activeState')).toHaveTextContent(`${state}`);
    } else {
      expect(screen.getByTestId('activeState')).toBeEmptyDOMElement();
    }
  }

  function assertActiveStep(step: number) {
    expect(screen.getByTestId('activeStep')).toHaveTextContent(`${step}`);
  }

  function assertCurrentPath(history: History, path: string) {
    expect(history.location.pathname).toEqual(path);
  }

  beforeEach(() => {
    consoleErrorSpy.mockImplementation(jest.fn());
  });

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  it('Should throw exception if context used without provider', () => {
    expect(() => render(<DummyComponent />)).toThrowError(
      'useNavigationContext must be used within a NavigationProvider'
    );
  });

  it('Should return active state', () => {
    renderDummyComponent();
    assertActiveState(undefined);
  });

  it('Should return active step', () => {
    renderDummyComponent();
    assertActiveStep(0);
  });

  describe('isValidStep', () => {
    it('Should true when step provided is the immediate next step', () => {
      renderDummyComponent({ mockStep: 1 });
      expect(screen.getByTestId('isValidStep').textContent).toEqual(
        'valid-next-step'
      );
    });

    it('Should false when step provided is two or more steps ahead of current step', () => {
      renderDummyComponent({ mockStep: 2 });
      expect(screen.getByTestId('isValidStep').textContent).toEqual(
        'invalid-next-step'
      );
    });

    it('Should true when step provided is any of the previous steps', () => {
      renderDummyComponent({ mockStep: 0 });
      navigateForward();
      navigateForward();
      navigateForward();
      assertActiveStep(3);
      expect(screen.getByTestId('isValidStep').textContent).toEqual(
        'valid-next-step'
      );
    });
  });

  describe('nextStep', () => {
    it('Should navigate to next available route', () => {
      const history = createMemoryHistory({
        initialEntries: ['/first'],
      });
      renderDummyComponent({}, history, ['/first', '/second', '/third']);
      assertActiveStep(0);
      assertCurrentPath(history, '/first');
      navigateForward();
      assertActiveStep(1);
      assertCurrentPath(history, '/second');
      navigateForward();
      assertActiveStep(2);
      assertCurrentPath(history, '/third');
      // navigation should retain at final step when attempting to navigate forward from last step
      navigateForward();
      assertActiveStep(2);
      assertCurrentPath(history, '/third');
    });

    it('Should navigate to custom path when provided', () => {
      const history = createMemoryHistory({
        initialEntries: ['/signup'],
      });
      renderDummyComponent({ nextPath: '/complete' }, history);
      assertCurrentPath(history, '/signup');
      navigateForward();
      assertCurrentPath(history, '/complete');
    });
  });

  describe('previousStep', () => {
    it('Should navigate to previously available route', () => {
      const history = createMemoryHistory({
        initialEntries: ['/third'],
      });
      renderDummyComponent({ mockStep: 2 }, history, [
        '/first',
        '/second',
        '/third',
      ]);
      // configure active step to final step
      configureActiveStep();
      // assert current step is final step
      assertActiveStep(2);
      assertCurrentPath(history, '/third');
      navigateBackward();
      assertActiveStep(1);
      assertCurrentPath(history, '/second');
      navigateBackward();
      assertActiveStep(0);
      assertCurrentPath(history, '/first');
      // navigation should retain at initial step when attempting to navigate backward from first step
      navigateBackward();
      assertActiveStep(0);
      assertCurrentPath(history, '/first');
    });

    it('Should navigate to custom path when provided', () => {
      const history = createMemoryHistory({
        initialEntries: ['/signup'],
      });
      renderDummyComponent({ prevPath: '/home' }, history);
      assertCurrentPath(history, '/signup');
      navigateBackward();
      assertCurrentPath(history, '/home');
    });
  });

  describe('setActiveStep', () => {
    it('Should configure step provided as active step', () => {
      renderDummyComponent({ mockStep: 2 });
      assertActiveStep(0);
      configureActiveStep();
      assertActiveStep(2);
    });
  });

  describe('setActiveState', () => {
    it('Should configure state provided as active state', () => {
      renderDummyComponent({ mockState: 'danger' });
      assertActiveState(undefined);
      configureActiveState();
      assertActiveState('danger');
    });
  });
});
