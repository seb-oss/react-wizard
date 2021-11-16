import { Modal } from '@sebgroup/react-components';
import classnames from 'classnames';
import React from 'react';
import { NavigationProvider } from '../contexts/navigationContext';
import './Wizard.scss';

export type WizardProps = JSX.IntrinsicElements['div'] & {
  /**
   * Strict navigations guard toggle. If configure to true, user can only navigate
   * to immediate next or previous step; when configure to false, user can navigate to any
   * steps at any time. Default to true.
   */
  strict?: boolean;
  /** Wizard toggle. */
  toggle: boolean;
  /** Event triggered when Wizard is dimissed */
  onDismissed?: () => void;
};

const Wizard = React.forwardRef(
  (
    { children, strict, toggle, onDismissed, ...props }: WizardProps,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <Modal
        className={classnames({ hide: !toggle })}
        toggle={toggle}
        onBackdropDismiss={onDismissed}
        onEscape={onDismissed}
        fullscreen
      >
        <div
          {...props}
          ref={ref}
          className={classnames('wizard', props.className)}
        >
          <NavigationProvider strict={strict}>{children}</NavigationProvider>
        </div>
      </Modal>
    );
  }
);

export default React.memo(Wizard);
