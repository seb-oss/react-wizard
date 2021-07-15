import React from 'react';
import { useNavigationContext } from '../../../contexts/navigationContext';
import WizardControls, { WizardControl } from '../WizardControls';
import './WizardStep.scss';

export type WizardStepData = {
  /**
   * Heading text in each step. If no page header is defined the heading will
   * be used as page heading too.
   * */
  heading: string;
  /**
   * Page heading for step. If no page heading is defined the wizard will
   * fall back to heading instead.
   * */
  pageHeading?: string;
  /**
   * Add controls/actions in the footer of the step, if no controls were
   * provided, controls for previous and next will be added by default.
   * */
  controls?: Array<WizardControl>;
  /**
   * Set state for a step (adds icon and highlights state in navigation),
   * it can be used to highlight and clarify wizard progress - completed
   * steps, errors etc. By default steps will be marked as finished or
   * completed when you've passed them.
   * */
  state?: WizardStepState;
  /** Add secondary content to the step. */
  secondaryContent?: React.ReactNode;
};

export type WizardStepProps = WizardStepData & {
  /** The step number of the current step; based on zero-based numbering system. */
  step: number;
};

export type WizardControlType = 'next' | 'prev' | 'cancel' | 'save' | 'close';

export type WizardStepState =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | undefined;

const WizardStep: React.FC<WizardStepProps> = ({
  children,
  heading,
  pageHeading,
  secondaryContent,
  state,
  step,
  controls,
}) => {
  const {
    setActiveControls,
    setActiveState,
    setActiveStep,
  } = useNavigationContext();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  React.useEffect(() => {
    setActiveStep(step);
  }, [step, setActiveStep]);

  React.useEffect(() => {
    // initialise active states with props state if it is not yet defined
    setActiveControls((prevControls) =>
      prevControls ? prevControls : controls
    );
    setActiveState((prevState) => (prevState ? prevState : state));

    // reset active states
    return () => {
      setActiveControls(undefined);
      setActiveState(undefined);
    };
  }, [controls, state, setActiveControls, setActiveState]);

  return (
    <>
      <div className="container-fluid p-3 p-md-4 wizard-step">
        <div className="row no-gutters">
          <div className="col-12 col-lg order-1 order-md-0 mr-lg-3 wizard-main">
            <h2 className="h5 font-weight-normal">{heading}</h2>
            <h3 className="h2">{pageHeading || heading}</h3>
            {children}
          </div>
          {secondaryContent && (
            <div className="col-12 col-lg-auto order-last mt-3 mt-md-0 ml-lg-3 wizard-secondary-content">
              {secondaryContent}
            </div>
          )}
          <div className="col-12 order-1 order-md-last">
            <WizardControls controls={controls} />
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(WizardStep);
