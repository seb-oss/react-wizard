import React from 'react';
import './Wizard.scss';

export type WizardProps = JSX.IntrinsicElements['div'] & {};

const Wizard: React.FC<WizardProps> = (props) => {
  return (
    <div {...props} className="wizard">
      Wizard
    </div>
  );
};

export default Wizard;
