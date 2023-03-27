import classnames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { WizardStepState } from '../WizardStep';
import './WizardNavigation.scss';

export type WizardNavigationProps = {
  /** If `true`, the navigation is activated. */
  active?: boolean;
  /** If `true`, the navigation is completed. */
  completed?: boolean;
  /** If `true`, the navigation is disabled. */
  disabled?: boolean;
  /** The label of the step in the navigation links. */
  label: string;
  /**
   * The path of the navigation, a string representation of the location,
   * created by concatenating the location’s pathname, search, and hash
   * properties.
   * */
  path: string;
  /**
   * Set state for the navigation, it is used to highlight and clarify
   * wizard progress - completed, warnings, errors etc. By default
   * navigation will be marked as finished or completed when
   * you've passed them.
   * */
  state?: WizardStepState;
  /** Event triggered when navigation is click. */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

const WizardNavigation: React.FC<WizardNavigationProps> = (props) => {
  return (
    <NavLink
      className={classnames('list-group-item', 'wizard-navigation', {
        'wizard-navigation--active': props.active,
        'wizard-navigation--passed': props.completed,
        'wizard-navigation--disabled': props.disabled,
        'wizard-navigation--danger': props.state === 'danger',
        'wizard-navigation--info': props.state === 'info',
        'wizard-navigation--warning': props.state === 'warning',
        'wizard-navigation--success': props.state === 'success',
      })}
      to={props.path}
      onClick={props.onClick}
    >
      {props.label}
    </NavLink>
  );
};

export default React.memo(WizardNavigation);
