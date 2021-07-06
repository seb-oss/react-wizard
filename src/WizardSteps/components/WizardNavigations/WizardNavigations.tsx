import classnames from 'classnames';
import pupa from 'pupa';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { useNavigationContext } from '../../../contexts/navigationContext';
import WizardNavigation, { WizardNavigationData } from '../WizardNavigation';
import './WizardNavigations.scss';

export type WizardNavigationsProps = {
  /**
   * Heading text for mobile navigations, it is only visible in mobile viewport.
   */
  mobileHeading: string;
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
  mobileDescription: string;
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
  mobileHeading,
  mobileDescription,
  navigations,
}) => {
  const { activeStep, isValidStep } = useNavigationContext();
  const [toggle, setToggle] = React.useState<boolean>(true);
  return (
    <nav className="wizard-navigations bg-secondary py-3">
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
          <h2 className="mb-1">{mobileHeading}</h2>
          <span className="small">
            {pupa(mobileDescription, {
              [PlaceholderTokens.ACTIVE_STEP]: activeStep + 1,
              [PlaceholderTokens.TOTAL_STEPS]: navigations.length,
            })}
          </span>
        </div>
      </div>
      {
        <CSSTransition classNames="list-group" in={toggle} timeout={400}>
          <ol className="list-group list-group-ordered d-md-flex mt-3">
            {navigations.map((props: WizardNavigationData, step: number) => {
              return (
                <WizardNavigation
                  key={`${props.path}_${props.label}`}
                  {...props}
                  step={step}
                  onClick={() => isValidStep(step) && setToggle(false)}
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
