import classnames from 'classnames';
import React from 'react';
import { useNavigationContext } from '../../../contexts/navigationContext';
import './WizardControls.scss';

export type WizardControlsProps = {
  /**
   * Add controls/actions in the footer of the step, if no controls were provided,
   * controls for previous and next will be added by default.
   * */
  controls?: Array<WizardControl>;
};

export type WizardControl = {
  /**
   * Type of control. Both next and prev will add icons and by default as well as try to navigate
   * to next/previous step if no path is passed.
   * */
  type: WizardControlType;
  /** Text that will be added to the control. */
  label: string;
  /** Add a path to the control which will be used a path for the router link. */
  path?: string;
  /** Add a custom class to the control/button. */
  className?: string;
  /**
   * Event triggered when control is click. Steps navigation will be block when
   * the handler return a falsy value. This is useful when there's mandatory validation
   * on the step.
   * */
  onClick?: GenericHandler;
};

export type WizardControlType = 'next' | 'prev' | 'cancel';

export type GenericHandler = (...args: any[]) => any;

const DEFAULT_CONTROLS: Array<WizardControl> = [
  {
    type: 'prev',
    label: 'Back',
  },
  {
    type: 'next',
    label: 'Next',
  },
];

const WizardControls: React.FC<WizardControlsProps> = ({
  controls = DEFAULT_CONTROLS,
}) => {
  const { nextStep, previousStep } = useNavigationContext();

  const getControlHandler = React.useCallback(
    (type: WizardControlType) => {
      switch (type) {
        case 'prev':
          return previousStep;
        case 'next':
          return nextStep;
        default:
          return () => {};
      }
    },
    [previousStep, nextStep]
  );

  return (
    <div className="pb-3 px-md-4 px-xl-5 wizard-controls">
      <div className="form-row justify-content-between">
        {controls.map((control: WizardControl, i: number) => {
          const {
            className,
            label,
            path,
            type,
            onClick = () => true,
          } = control;
          const isNext = type === 'next';
          const isPrev = type === 'prev';
          const controlContainerClass: string = classnames(
            `col-sm-auto order-sm-${i}`,
            {
              'col-6': isNext || isPrev,
              'col-12 mt-3 mt-sm-0 mr-auto order-last': !isNext && !isPrev,
            }
          );
          const controlClass: string = classnames(
            'btn w-100',
            {
              'btn-primary': isNext,
              'btn-outline-primary': isPrev,
              'btn-secondary': !isNext && !isPrev,
            },
            className
          );
          const controlHandler: GenericHandler = getControlHandler(type);

          return (
            <div key={label} className={controlContainerClass}>
              <button
                type="button"
                className={controlClass}
                onClick={async (event) => {
                  /**
                   * custom control handler, blocks navigation if result is false
                   */
                  if ((await onClick(event)) !== false) {
                    controlHandler(path);
                  }
                }}
              >
                {label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(WizardControls);
