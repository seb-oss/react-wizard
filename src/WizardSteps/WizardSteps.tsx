import React from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import {
  NavigationProvider,
  useNavigationContext,
} from '../contexts/navigationContext';
import WizardStep, { WizardStepData } from './components/WizardStep';
import './WizardSteps.scss';

export type WizardStepsProps = {
  /** A series of ordered steps to be managed by the wizard, it relies on react router for navigations */
  steps: Array<WizardStepConfig>;
};

export type WizardStepConfig = {
  /**
   * The path of the step, a string representation of the location, created by concatenating the
   * location’s pathname, search, and hash properties.
   * */
  path: string;
  /** The label of the step in the navigation links. */
  label: string;
  /** The component to be displayed when the route matches the step path. */
  component: React.ReactNode;
  /** Additional data for the Step component */
  data: WizardStepData;
};

const WizardRoutes: React.FC<WizardStepsProps> = ({ steps }) => {
  const { activeStep, isValidStep } = useNavigationContext();
  return (
    <>
      {steps.map(
        ({ path, component, data }: WizardStepConfig, step: number) => (
          <Route
            key={path}
            exact
            path={path}
            render={() => {
              // step guard, user can only navigate to previous and immediate next step
              if (isValidStep(step)) {
                return (
                  <WizardStep {...{ ...data, step }}>{component}</WizardStep>
                );
              }

              return <Redirect to={steps[activeStep].path} />;
            }}
          />
        )
      )}
    </>
  );
};

const WizardSteps: React.FC<WizardStepsProps> = ({ steps }) => {
  const routes: Array<string> = React.useMemo(
    () => steps.map(({ path }: WizardStepConfig) => path),
    [steps]
  );
  return (
    <NavigationProvider routes={routes}>
      <div className="row no-gutters">
        <div className="col-12 col-md-auto">
          {/* TODO: replace with WizardNavigations component */}
          <div className="wizard-navigations">
            {steps.map(({ path, label }) => (
              <p key={path}>
                <Link to={path}>{label}</Link>
              </p>
            ))}
          </div>
        </div>
        <div className="col-12 col-md bg-white">
          <Switch>
            <WizardRoutes steps={steps} />
          </Switch>
        </div>
      </div>
    </NavigationProvider>
  );
};

export default React.memo(WizardSteps);
