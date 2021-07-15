import {
  fireEvent,
  render,
  RenderResult,
  screen,
  waitFor,
} from '@testing-library/react';
import { createMemoryHistory, History } from 'history';
import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { WizardControl } from '../WizardSteps/components/WizardControls';
import { WizardStepState } from '../WizardSteps/components/WizardStep';
import { NavigationProvider, useNavigationContext } from './navigationContext';

type DummyComponentProps = {
  mockControls?: Array<WizardControl>;
  mockState?: WizardStepState;
  mockStep?: number;
  nextPath?: string;
  prevPath?: string;
};

function DummyComponent(props: DummyComponentProps) {
  const { mockControls, mockState, mockStep, nextPath, prevPath } = props;
  const {
    activeControls = [],
    activeState,
    activeStep,
    isNavigableStep,
    isValidStep,
    nextStep,
    previousStep,
    setActiveControls,
    setActiveState,
    setActiveStep,
  } = useNavigationContext();
  const [validStep, setValidStep] = React.useState<boolean>(true);

  React.useEffect(() => {
    async function fetchValidStep() {
      setValidStep(await isValidStep());
    }

    // use set timeout to ensure async sequence is respected
    setTimeout(() => {
      fetchValidStep();
    }, 0);
  }, [activeControls, isValidStep]);

  return (
    <div>
      <p data-testid="activeControls">{activeControls.length}</p>
      <p data-testid="activeState">{activeState}</p>
      <p data-testid="activeStep">{activeStep}</p>
      <p data-testid="isNavigableStep">
        {isNavigableStep(mockStep) ? 'valid-next-step' : 'invalid-next-step'}
      </p>
      <p data-testid="isValidStep">
        {validStep ? 'valid-active-step' : 'invalid-active-step'}
      </p>
      <button type="button" onClick={() => nextStep(nextPath)}>
        next step
      </button>
      <button type="button" onClick={() => previousStep(prevPath)}>
        previous step
      </button>
      <button type="button" onClick={() => setActiveControls(mockControls)}>
        set active controls
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

  function configureActiveControls() {
    fireEvent.click(screen.getByText('set active controls'));
  }

  function configureActiveState() {
    fireEvent.click(screen.getByText('set active state'));
  }

  function configureActiveStep() {
    fireEvent.click(screen.getByText('set active step'));
  }

  function assertActiveControlsLength(length: number) {
    expect(screen.getByTestId('activeControls')).toHaveTextContent(`${length}`);
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

  it('Should return active controls', () => {
    renderDummyComponent();
    assertActiveControlsLength(0);
  });

  it('Should return active state', () => {
    renderDummyComponent();
    assertActiveState(undefined);
  });

  it('Should return active step', () => {
    renderDummyComponent();
    assertActiveStep(0);
  });

  describe('isNavigableStep', () => {
    function assertIsNavigableStep(navigable: boolean): void {
      expect(screen.getByTestId('isNavigableStep').textContent).toEqual(
        navigable ? 'valid-next-step' : 'invalid-next-step'
      );
    }

    it('Should return true when step provided is the immediate next step', () => {
      renderDummyComponent({ mockStep: 1 });
      assertIsNavigableStep(true);
    });

    it('Should return false when step provided is two or more steps ahead of current step', () => {
      renderDummyComponent({ mockStep: 2 });
      assertIsNavigableStep(false);
    });

    it('Should return true when step provided is any of the previous steps', () => {
      renderDummyComponent({ mockStep: 0 });
      navigateForward();
      navigateForward();
      navigateForward();
      assertActiveStep(3);
      assertIsNavigableStep(true);
    });
  });

  describe('isValidStep', () => {
    async function assertIsValidStep(valid: boolean): Promise<void> {
      await waitFor(() => {
        expect(screen.getByTestId('isValidStep').textContent).toEqual(
          valid ? 'valid-active-step' : 'invalid-active-step'
        );
      });
    }

    it('Should return true when default controls is used in active step', async () => {
      renderDummyComponent();
      await assertIsValidStep(true);
    });

    it('Should return true when custom next step handler returns truthy value', async () => {
      renderDummyComponent({
        mockControls: [{ type: 'next', label: 'next', onClick: () => true }],
      });
      configureActiveControls();
      await assertIsValidStep(true);
    });

    it('Should return true when custom next step handler returns asynchronous truthy value', async () => {
      renderDummyComponent({
        mockControls: [
          { type: 'next', label: 'next', onClick: () => Promise.resolve(true) },
        ],
      });
      configureActiveControls();
      await assertIsValidStep(true);
    });

    it('Should return false when custom next step handler returns falsy value', async () => {
      renderDummyComponent({
        mockControls: [{ type: 'next', label: 'next', onClick: () => false }],
      });
      configureActiveControls();
      await assertIsValidStep(false);
    });

    it('Should return false when custom next step handler returns asynchronous falsy value', async () => {
      renderDummyComponent({
        mockControls: [
          {
            type: 'next',
            label: 'next',
            onClick: () => Promise.resolve(false),
          },
        ],
      });
      configureActiveControls();
      await assertIsValidStep(false);
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

  describe('setActiveControls', () => {
    it('Should configure controls provided as active controls', () => {
      renderDummyComponent({
        mockControls: [{ type: 'cancel', label: 'custom' }],
      });
      assertActiveControlsLength(0);
      configureActiveControls();
      assertActiveControlsLength(1);
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
