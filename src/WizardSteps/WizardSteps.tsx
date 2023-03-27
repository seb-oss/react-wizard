import React from 'react';
import { Redirect, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import { useNavigationContext } from '../contexts/navigationContext';
import WizardNavigations, { WizardNavigationData } from './components/WizardNavigations';
import WizardStep, { WizardStepData } from './components/WizardStep';
import './WizardSteps.scss';

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
  /**
   * A series of ordered sub steps to be managed by the wizard, it relies on
   * react router for navigations. Currently only two level of nested steps is supported.
   * */
  steps?: Array<WizardStepConfig>;
};

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
};

const WizardRoutes: React.FC<{ routes: Array<WizardStepConfig> }> = ({ routes }) => {
  const { activeStep, isWizardCompleted, isNavigableStep } = useNavigationContext();
  return (
    <>
      {routes.map(
        (
          { path, component: StepComponent, data, disabled }: WizardStepConfig,
          step: number
        ) => (
          <Route
            key={path}
            exact
            path={path}
            render={() => {
              const isFinalStep = activeStep === routes.length - 1;
              const isCompletedStep = isFinalStep && isWizardCompleted;
              const isRenderableStep = isNavigableStep(step) && !disabled;

              if (isRenderableStep || isCompletedStep) {
                return (
                  <WizardStep {...{ ...data, step }}>
                    <StepComponent />
                  </WizardStep>
                );
              }

              return <Redirect to={routes[activeStep].path} />;
            }}
          />
        )
      )}
    </>
  );
};

const WizardSteps: React.FC<WizardStepsProps> = (props) => {
  const { navigationDescription, steps: stepsConfigs } = props;
  const { pathname } = useLocation();
  const { setRoutes } = useNavigationContext();
  // https://v5.reactrouter.com/web/api/match
  const match = useRouteMatch();

  // The path pattern used to match. Useful for building nested <Route>s
  const parentPath: string = React.useMemo(
    () => (isNestedRoute(match.path) ? match.path : ''),
    [match.path]
  );

  // The matched portion of the URL. Useful for building nested <Link>s
  const parentUrl: string = React.useMemo(
    () => (isNestedRoute(match.url) ? match.url : ''),
    [match.url]
  );

  /**
   * Assign flatten index as step for each navigation
   */
  const navigations: Array<WizardNavigationData> = React.useMemo(() => {
    let step = 0;
    return stepsConfigs.map<WizardNavigationData>(
      ({ label, path, data: { state }, disabled, steps }: WizardStepConfig) => ({
        label,
        path: `${parentUrl}${path}`,
        state,
        step: step++,
        disabled,
        subNavigations: steps?.map(({ label, path, data: { state }, disabled }) => ({
          label,
          path: `${parentUrl}${path}`,
          state,
          step: step++,
          disabled,
        })),
      })
    );
  }, [parentUrl, stepsConfigs]);

  /**
   * flatten routes into single dimension for easier navigation manipulation
   */
  const routes = React.useMemo(
    () => stepsConfigs.flatMap((step) => [step, ...(step.steps ?? [])]),
    [stepsConfigs]
  );

  React.useEffect(() => {
    setRoutes(routes.map<string>(({ path }) => `${parentUrl}${path}`));
  }, [parentUrl, routes, setRoutes]);

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
          <WizardRoutes
            routes={routes.map<WizardStepConfig>((route) => ({
              ...route,
              // append parent path to step's path if current path is nested
              path: `${parentPath}${route.path}`,
            }))}
          />
        </Switch>
      </div>
    </div>
  );
};

function isNestedRoute(route: string): boolean {
  return route !== '/';
}

export default React.memo(WizardSteps);
