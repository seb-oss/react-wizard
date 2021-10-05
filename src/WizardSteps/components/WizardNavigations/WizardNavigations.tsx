import classnames from 'classnames';
import pupa from 'pupa';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { useNavigationContext } from '../../../contexts/navigationContext';
import WizardNavigation, { WizardNavigationData } from '../WizardNavigation';
import './WizardNavigations.scss';

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

export enum PlaceholderTokens {
  ACTIVE_STEP = 'activeStep',
  TOTAL_STEPS = 'totalSteps',
}

const WizardNavigations: React.FC<WizardNavigationsProps> = ({
  navigationDescription,
  navigations,
}) => {
  const {
    activeStep,
    isNavigableStep,
    isValidStep,
    nextStep,
  } = useNavigationContext();
  const olRef = React.useRef<HTMLOListElement>(null);
  const [toggle, setToggle] = React.useState<boolean>(true);

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
        onClick={() => setToggle(!toggle)}
        role="button"
      >
        <div className="pl-3 pl-md-0 toggle-content">
          <h2 className="mb-1">{navigations[activeStep].label}</h2>
          <span className="small">
            {pupa(navigationDescription, {
              [PlaceholderTokens.ACTIVE_STEP]: activeStep + 1,
              [PlaceholderTokens.TOTAL_STEPS]: navigations.length,
            })}
          </span>
        </div>
      </div>
      {
        <CSSTransition
          nodeRef={olRef}
          classNames="list-group"
          in={toggle}
          timeout={400}
        >
          <ol
            ref={olRef}
            className="list-group list-group-ordered d-md-flex mt-3"
          >
            {navigations.map((props: WizardNavigationData, step: number) => {
              return (
                <WizardNavigation
                  key={`${props.path}_${props.label}`}
                  {...props}
                  step={step}
                  onClick={(event) => {
                    if (isNavigableStep(step)) {
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
                            nextStep(props.path);
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
              );
            })}
          </ol>
        </CSSTransition>
      }
    </nav>
  );
};

export default React.memo(WizardNavigations);
