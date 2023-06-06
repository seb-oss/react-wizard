import classnames from 'classnames';
import pupa from 'pupa';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { useNavigationContext } from '../../../contexts/navigationContext';
import WizardNavigation, { WizardNavigationProps } from '../WizardNavigation';
import { WizardStepState } from '../WizardStep';
import './WizardNavigations.scss';

export enum PlaceholderTokens {
  ACTIVE_STEP = 'activeStep',
  TOTAL_STEPS = 'totalSteps',
}

export type WizardNavigationType = 'group' | 'intro' | 'step';

export type WizardNavigationData = Pick<
  WizardNavigationProps,
  'disabled' | 'label' | 'path' | 'state'
> & {
  /**
   * The step (index - zero-based) of the navigation, in the case where there is nested
   * naivations, the step number are flatten (i.e. [0, [1, 2], 3, [4, 5]]).
   */
  step: number;
  /**
   * Nested navigations under the current navigation.
   */
  subNavigations?: Array<WizardNavigationData>;
  /**
   * The navigation's type
   */
  type?: WizardNavigationType;
};

type WizardNavigationListProps = JSX.IntrinsicElements['ol'] &
  Pick<WizardNavigationsProps, 'navigations'> & {
    setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  };

export type WizardNavigationsProps = {
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
   * A series of ordered navigations to be managed by the wizard, it relies on
   * react router for navigations
   */
  navigations: Array<WizardNavigationData>;
};

const WizardNavigationList = React.forwardRef(
  (
    { navigations, setToggle, ...props }: WizardNavigationListProps,
    ref: React.ForwardedRef<HTMLOListElement>
  ) => {
    const { activeState, activeStep, isNavigableStep, isValidStep, nextStep } =
      useNavigationContext();
    return (
      <ol ref={ref} {...props}>
        {navigations.map((navigation) => {
          const { disabled, label, path, step, subNavigations, type } = navigation;
          const isActive: boolean = activeStep === step;
          const isCompleted: boolean = activeStep > step;
          const isDisabled: boolean = !!disabled;
          const isNavigable: boolean = isNavigableStep(step);
          const state: WizardStepState = isActive
            ? activeState || navigation.state
            : undefined;
          return (
            <li
              key={`${path}_${label}`}
              className={classnames({ introduction: type === 'intro' })}
            >
              <WizardNavigation
                active={isActive}
                completed={isCompleted}
                disabled={isDisabled || !isNavigable}
                label={label}
                path={path}
                state={state}
                onClick={(event) => {
                  if (!isDisabled && isNavigableStep(step)) {
                    const isForwardNavigation = step > activeStep;

                    if (isForwardNavigation) {
                      /**
                       * Stop react router default navigation if the user is
                       * navigating forward and verify if the current step
                       * has completed all the necessary checks. If completed,
                       * navigate to next step, else retain at current step.
                       */
                      event.preventDefault();
                      isValidStep().then((isValid) => {
                        if (isValid !== false) {
                          setToggle(false);
                          nextStep(path);
                        }
                      });
                    } else {
                      setToggle(false);
                    }
                  } else {
                    /**
                     * Prevent user from navigating to non navigable step.
                     */
                    event.preventDefault();
                  }
                }}
              />
              {Array.isArray(subNavigations) && (
                <WizardNavigationList
                  className={classnames('list-group list-group-ordered', {
                    'd-none': !(isActive || isCompleted),
                  })}
                  navigations={subNavigations}
                  setToggle={setToggle}
                />
              )}
            </li>
          );
        })}
      </ol>
    );
  }
);

const WizardNavigations: React.FC<WizardNavigationsProps> = ({
  navigationDescription,
  navigations,
}) => {
  const { activeStep } = useNavigationContext();
  const olRef = React.useRef<HTMLOListElement>(null);
  const [toggle, setToggle] = React.useState<boolean>(true);

  const flattenNavigations = React.useMemo(
    () =>
      navigations.flatMap((navigation) => [
        navigation,
        ...(navigation.subNavigations ?? []),
      ]),
    [navigations]
  );

  const mainNavigationLength = React.useMemo(() => {
    const introLength = navigations.filter(({ type }) => type === 'intro').length;
    return navigations.length - introLength;
  }, [navigations]);

  React.useEffect(() => {
    setToggle(false);
  }, [activeStep]);

  return (
    <nav className="wizard-navigations py-3">
      <div
        className={classnames(
          'd-md-none d-flex justify-content-between',
          'wizard-navigations__toggle',
          {
            'wizard-navigations__toggle--active': toggle,
          }
        )}
        role="button"
        onClick={() => setToggle(!toggle)}
      >
        <div className="pl-3 pl-md-0 toggle-content">
          <h2 className="mb-1">{flattenNavigations[activeStep]?.label}</h2>
          <span className="small">
            {pupa(navigationDescription, {
              [PlaceholderTokens.ACTIVE_STEP]: activeStep + 1,
              [PlaceholderTokens.TOTAL_STEPS]: mainNavigationLength,
            })}
          </span>
        </div>
      </div>
      <CSSTransition nodeRef={olRef} classNames="list-group" in={toggle} timeout={400}>
        <WizardNavigationList
          ref={olRef}
          className="list-group list-group-ordered d-md-flex mt-3"
          navigations={navigations}
          setToggle={setToggle}
        />
      </CSSTransition>
    </nav>
  );
};

export default React.memo(WizardNavigations);
