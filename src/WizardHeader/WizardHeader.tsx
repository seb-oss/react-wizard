import React from 'react';
import './WizardHeader.scss';

export type WizardHeaderProps = {
  heading: string;
};

const WizardHeader: React.FC<WizardHeaderProps> = ({ heading }) => {
  return <div className="wizard-header">{heading}</div>;
};

export default WizardHeader;
