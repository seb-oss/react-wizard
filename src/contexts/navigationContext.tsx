import React from 'react';
import { useHistory } from 'react-router-dom';

export interface NavigationInterface {
  activeStep: number;
  isValidStep: (step: number) => boolean;
  nextStep: (path?: string) => void;
  previousStep: (path?: string) => void;
  setStep: (step: number) => void;
}

export type NavigationProviderProps = {
  /** The list of routes path to be managed. */
  routes: Array<string>;
};

const NavigationContext = React.createContext<NavigationInterface | undefined>(
  undefined
);

const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  routes,
}) => {
  const history = useHistory();
  const [activeStep, setActiveStep] = React.useState<number>(0);

  const isValidStep = React.useCallback(
    (step: number) => step <= activeStep + 1,
    [activeStep]
  );

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

  const setStep = React.useCallback((step: number) => {
    setActiveStep(step);
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        activeStep,
        isValidStep,
        nextStep,
        previousStep,
        setStep,
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
