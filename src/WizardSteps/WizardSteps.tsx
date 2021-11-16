import React from 'react';
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import { useNavigationContext } from '../contexts/navigationContext';
import { WizardNavigationData } from './components/WizardNavigation';
import WizardNavigations from './components/WizardNavigations';
import WizardStep, { WizardStepData } from './components/WizardStep';
import './WizardSteps.scss';

export type WizardStepsProps = {
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
  navigationDescription: string;
  /**
   * A series of ordered steps to be managed by the wizard, it relies on
   * react router for navigations
   * */
  steps: Array<WizardStepConfig>;
  /**
   * @deprecated use `Wizard` component `strict` props instead
   * @see {@link Wizard.strict}
   */
  strict?: boolean;
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
  /** The additional data for Step component. */
  data: WizardStepData;
  /** If `true`, the navigation is disabled. */
  disabled?: boolean;
};

const WizardRoutes: React.FC<Pick<WizardStepsProps, 'steps'>> = ({ steps }) => {
  const {
    activeStep,
    isWizardCompleted,
    isNavigableStep,
  } = useNavigationContext();
  return (
    <>
      {steps.map(
        (
          { path, component: StepComponent, data }: WizardStepConfig,
          step: number,
          sourceSteps: Array<WizardStepConfig>
        ) => (
          <Route
            key={path}
            exact
            path={path}
            render={() => {
              const isFinalStep = activeStep === sourceSteps.length - 1;

              if (isNavigableStep(step) || (isFinalStep && isWizardCompleted)) {
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
  const { navigationDescription, steps: sourceSteps, strict = true } = props;
  const { pathname } = useLocation();
  const { setRoutes, setStrict } = useNavigationContext();
  const match = useRouteMatch();

  const isNestedRoute = React.useCallback((route: string) => {
    return route !== '/';
  }, []);

  const parentUrl: string = React.useMemo(
    () => (isNestedRoute(match.url) ? match.url : ''),
    [match.url, isNestedRoute]
  );

  const routes: Array<string> = React.useMemo(
    () =>
      sourceSteps.map<string>(
        ({ path }: WizardStepConfig) => `${parentUrl}${path}`
      ),
    [parentUrl, sourceSteps]
  );

  const navigations: Array<WizardNavigationData> = React.useMemo(
    () =>
      sourceSteps.map<WizardNavigationData>(
        ({ label, path, data: { state }, disabled }: WizardStepConfig) => ({
          label,
          path: `${parentUrl}${path}`,
          state,
          disabled,
        })
      ),
    [parentUrl, sourceSteps]
  );

  const parentPath: string = React.useMemo(
    () => (isNestedRoute(match.path) ? match.path : ''),
    [match.path, isNestedRoute]
  );

  // append parent path to step's path if current path is nested
  const steps: Array<WizardStepConfig> = React.useMemo(
    () =>
      sourceSteps.map<WizardStepConfig>((step) => ({
        ...step,
        path: `${parentPath}${step.path}`,
      })),
    [parentPath, sourceSteps]
  );

  React.useEffect(() => {
    setRoutes(routes);
  }, [routes, setRoutes]);

  React.useEffect(() => {
    setStrict(strict);
  }, [strict, setStrict]);

  return (
    <div className="row no-gutters wizard-steps">
      <div className="col-12 col-md-auto">
        <WizardNavigations
          navigationDescription={navigationDescription}
          navigations={navigations}
        />
      </div>
      <div className="col-12 col-md bg-white wizard-main-container">
        <Switch>
          <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
          <WizardRoutes steps={steps} />
        </Switch>
      </div>
    </div>
  );
};

export default React.memo(WizardSteps);
