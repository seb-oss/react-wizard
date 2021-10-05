import React from 'react';
import { useHistory } from 'react-router-dom';
import { WizardControl } from '../WizardSteps/components/WizardControls';
import { WizardStepState } from '../WizardSteps/components/WizardStep';

export interface NavigationInterface {
  /**
   * Controls/actions for the current active step.
   * */
  activeControls: Array<WizardControl> | undefined;
  /**
   * State for the active step.
   */
  activeState: WizardStepState;
  /**
   * Step number for the active step; based on zero-based numbering system.
   */
  activeStep: number;
  /**
   * Flag to indicate if the wizard is completed.
   */
  isWizardCompleted: boolean;
  /**
   * Update wizard status to complete.
   */
  completeWizard: () => void;
  /**
   * Verify if the active step's next step handler is valid, it returns a
   * promise based truthy value when it is valid, false otherwise.
   */
  isValidStep: () => Promise<boolean>;
  /**
   * When `strict` mode is enabled, this will verify if the step provided
   * is the immediate next step or any of the previous step and the wizard
   * has not complete. A step is considered navigable if it satisfy any of
   * the conditions mentioned above.
   */
  isNavigableStep: (step: number) => boolean;
  /**
   * A navigation helper to navigation to next step. If a path is provided,
   * it will navigate to the path provided, otherwise it will load the next
   * step in the route list.
   */
  nextStep: (path?: string) => void;
  /**
   * A navigation helper to navigation to previous step. If a path is provided
   * it will navigate to the path provided, otherwise it will load the previous
   * step in the route list
   */
  previousStep: (path?: string) => void;
  /**
   * Configure the controls/actions for the current active step.
   */
  setActiveControls: React.Dispatch<
    React.SetStateAction<Array<WizardControl> | undefined>
  >;
  /**
   * Configure the state for the active step.
   */
  setActiveState: React.Dispatch<React.SetStateAction<WizardStepState>>;
  /**
   * Configure the step number for the active step;
   * based on zero-based numbering system.
   */
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

export type NavigationProviderProps = {
  /**
   * The list of routes path to be managed.
   * */
  routes: Array<string>;
  /**
   * Strict navigations guard toggle. If configure to `true`, user can only navigate
   * to immediate next or previous step; when configure to `false`, user can navigate to any
   * steps at any time. *Default* to `true`.
   */
  strict?: boolean;
};

const NavigationContext = React.createContext<NavigationInterface | undefined>(
  undefined
);

const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  routes,
  strict = true,
}) => {
  const history = useHistory();
  const [activeControls, setActiveControls] = React.useState<
    Array<WizardControl>
  >();
  const [activeState, setActiveState] = React.useState<WizardStepState>();
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [isWizardCompleted, setWizardCompleted] = React.useState<boolean>(
    false
  );

  const completeWizard = React.useCallback(() => setWizardCompleted(true), []);

  const isNavigableStep = React.useCallback(
    (step: number) => (!strict || step <= activeStep + 1) && !isWizardCompleted,
    [activeStep, isWizardCompleted, strict]
  );

  const isValidStep = React.useCallback(async () => {
    const nextStepHandler = activeControls?.find(
      (control: WizardControl) => control.type === 'next'
    )?.onClick;

    if (typeof nextStepHandler === 'function') {
      return await nextStepHandler();
    }

    return Promise.resolve(true);
  }, [activeControls]);

  const nextStep = React.useCallback(
    (path?: string) => {
      const nextPath = path || routes[activeStep + 1];

      if (nextPath) {
        setActiveStep((previousActiveStep) => previousActiveStep + 1);
        history.push(nextPath);
      }
    },
    [activeStep, history, routes]
  );

  const previousStep = React.useCallback(
    (path?: string) => {
      const previousPath = path || routes[activeStep - 1];

      if (previousPath) {
        setActiveStep((previousActiveStep) => previousActiveStep - 1);
        history.push(previousPath);
      }
    },
    [activeStep, history, routes]
  );

  return (
    <NavigationContext.Provider
      value={{
        activeControls,
        activeState,
        activeStep,
        isWizardCompleted,
        completeWizard,
        isValidStep,
        isNavigableStep,
        nextStep,
        previousStep,
        setActiveControls,
        setActiveState,
        setActiveStep,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

function useNavigationContext() {
  const context = React.useContext(NavigationContext);

  if (context === undefined) {
    throw new Error(
      'useNavigationContext must be used within a NavigationProvider'
    );
  }

  return context;
}

export { NavigationProvider, useNavigationContext };
