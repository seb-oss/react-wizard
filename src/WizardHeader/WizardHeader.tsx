import React from 'react';
import './WizardHeader.scss';

export type WizardHeaderProps = {
  /** Heading/text on the header. */
  heading: string;
  /** Controls/actions to be displayed on the right of the header. */
  actions?: React.ReactNodeArray;
};

const WizardHeader: React.FC<WizardHeaderProps> = ({ actions, heading }) => {
  return (
    <div className="wizard-header">
      <nav className="navbar navbar-light border-bottom bg-white">
        <span className="navbar-brand">{heading}</span>
        <div className="wizard-actions">
          <div className="d-flex align-items-center">
            {actions?.map((action: React.ReactNode, i: number) => (
              <React.Fragment key={i}>{action}</React.Fragment>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default React.memo(WizardHeader);
