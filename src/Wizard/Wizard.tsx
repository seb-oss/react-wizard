import { Modal } from '@sebgroup/react-components';
import classnames from 'classnames';
import React from 'react';
import './Wizard.scss';

export type WizardProps = JSX.IntrinsicElements['div'] & {
  /** Wizard toggle. */
  toggle: boolean;
  /** Event triggered when Wizard is dimissed */
  onDismissed?: () => void;
};

const Wizard = React.forwardRef(
  (
    { children, toggle, onDismissed, ...props }: WizardProps,
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
          {children}
        </div>
      </Modal>
    );
  }
);

export default React.memo(Wizard);
