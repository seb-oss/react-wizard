import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Wizard, { WizardProps } from '../Wizard';
import WizardHeader from '../WizardHeader';
import WizardSteps from '../WizardSteps';
import * as WizardStepsStories from './WizardSteps.stories';

export default {
  title: 'components/Wizard',
  component: Wizard,
  argTypes: {},
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: Story<WizardProps> = ({ ref, ...args }) => {
  const [toggle, setToggle] = React.useState<boolean>(args.toggle);

  React.useEffect(() => {
    setToggle(args.toggle);
  }, [args.toggle]);

  return (
    <>
      <div className="w-100 text-center">
        <button className="btn" onClick={() => setToggle(true)}>
          Show Wizard
        </button>
      </div>
      <Wizard {...args} toggle={toggle}>
        <WizardHeader
          heading="Wizard Title"
          actions={[
            <button className="btn" onClick={() => setToggle(false)}>
              X
            </button>,
          ]}
        />
        <WizardSteps
          steps={[
            ...WizardStepsStories.Default.args.steps,
            ...WizardStepsStories.WithSecondaryContent.args.steps,
            ...WizardStepsStories.WithCustomControls.args.steps,
          ]}
        />
      </Wizard>
    </>
  );
};

export const Default: Story<WizardProps> = Template.bind({});
Default.args = {
  toggle: false,
  onDismissed: action('dismissed'),
};
