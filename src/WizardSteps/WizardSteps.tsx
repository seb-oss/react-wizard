import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  NavigationProvider,
  useNavigationContext,
} from '../contexts/navigationContext';
import { WizardNavigationData } from './components/WizardNavigation';
import WizardNavigations from './components/WizardNavigations';
import WizardStep, { WizardStepData } from './components/WizardStep';
import './WizardSteps.scss';

export type WizardStepsProps = {
  /**
   * Heading text for mobile navigations, it is only visible in mobile viewport.
   */
  navigationMobileHeading: string;
  /**
   * Description text for mobile navigations, it is only visible in mobile viewport.
   * It supports tokens injection, the list of placeholders available are as follow:
   * <table>
   *  <tr>
   *    <th>Placeholder</th>
   *    <th>Description</th>
   *  </tr>
   *  <tr>
   *    <td>activeStep</td>
   *    <td>the current active step number</td>
   *  </tr>
   *  <tr>
   *    <td>totalSteps</td>
   *    <td>the total number of steps available</td>
   *  </tr>
   * </table>
   * Example: `Step {activeStep} of {totalSteps}`, @see PlaceholderTokens
   */
  navigationMobileDescription: string;
  /**
   * A series of ordered steps to be managed by the wizard, it relies on
   * react router for navigations
   * */
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
  component: React.ComponentType<any>;
  /** Additional data for the Step component */
  data: WizardStepData;
};

const WizardRoutes: React.FC<Pick<WizardStepsProps, 'steps'>> = ({ steps }) => {
  const { activeStep, isValidStep } = useNavigationContext();
  return (
    <>
      {steps.map(
        (
          { path, component: StepComponent, data }: WizardStepConfig,
          step: number
        ) => (
          <Route
            key={path}
            exact
            path={path}
            render={() => {
              // step guard, user can only navigate to previous and immediate next step
              if (isValidStep(step)) {
                return (
                  <WizardStep {...{ ...data, step }}>
                    <StepComponent />
                  </WizardStep>
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

const WizardSteps: React.FC<WizardStepsProps> = (props) => {
  const { navigationMobileHeading, navigationMobileDescription, steps } = props;
  const navigations: Array<WizardNavigationData> = React.useMemo(
    () =>
      steps.map<WizardNavigationData>(
        ({ label, path, data: { state } }: WizardStepConfig) => ({
          label,
          path,
          state,
        })
      ),
    [steps]
  );
  const routes: Array<string> = React.useMemo(
    () => steps.map<string>(({ path }: WizardStepConfig) => path),
    [steps]
  );
  return (
    <NavigationProvider routes={routes}>
      <div className="row no-gutters wizard-steps">
        <div className="col-12 col-md-auto">
          <WizardNavigations
            mobileHeading={navigationMobileHeading}
            mobileDescription={navigationMobileDescription}
            navigations={navigations}
          />
        </div>
        <div className="col-12 col-md bg-white wizard-main-container">
          <Switch>
            <WizardRoutes steps={steps} />
          </Switch>
        </div>
      </div>
    </NavigationProvider>
  );
};

export default React.memo(WizardSteps);
