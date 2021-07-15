import classnames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigationContext } from '../../../contexts/navigationContext';
import { WizardStepState } from '../WizardStep';
import './WizardNavigation.scss';

export type WizardNavigationData = {
  /**
   * The path of the navigation, a string representation of the location,
   * created by concatenating the location’s pathname, search, and hash
   * properties.
   * */
  path: string;
  /** The label of the step in the navigation links. */
  label: string;
  /**
   * Set state for the navigation, it is used to highlight and clarify
   * wizard progress - completed, warnings, errors etc. By default
   * navigation will be marked as finished or completed when
   * you've passed them.
   * */
  state?: WizardStepState;
};

export type WizardNavigationProps = WizardNavigationData & {
  /** The step number of the current step */
  step: number;
  /** Event triggered when navigation is click. */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

const WizardNavigation: React.FC<WizardNavigationProps> = (props) => {
  const { activeState, activeStep, isNavigableStep } = useNavigationContext();
  const { path, label, step, onClick } = props;
  const isActive: boolean = activeStep === step;
  const isCompleted: boolean = activeStep > step;
  const isNavigable: boolean = isNavigableStep(step);
  const state: WizardStepState = isActive
    ? activeState || props.state
    : undefined;
  return (
    <li
      className={classnames('list-group-item', 'wizard-navigation', {
        'wizard-navigation--active': isActive,
        'wizard-navigation--passed': isCompleted,
        'wizard-navigation--disabled': !isNavigable,
        'wizard-navigation--danger': state === 'danger',
        'wizard-navigation--info': state === 'info',
        'wizard-navigation--warning': state === 'warning',
        'wizard-navigation--success': state === 'success',
      })}
    >
      <NavLink to={path} onClick={onClick}>
        {label}
      </NavLink>
    </li>
  );
};

export default React.memo(WizardNavigation);
