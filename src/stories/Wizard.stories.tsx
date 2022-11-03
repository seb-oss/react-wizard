import { action } from '@storybook/addon-actions';
import {
  ComponentMeta as Meta,
  ComponentStory as Story,
} from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Wizard from '../Wizard';
import WizardHeader from '../WizardHeader';
import WizardSteps from '../WizardSteps';
import * as WizardStepsStories from './WizardSteps.stories';

type WizardType = typeof Wizard;

export default {
  title: 'components/Wizard',
  component: Wizard,
  subcomponents: {
    WizardHeader,
    WizardSteps,
  },
  decorators: [
    (Story) => <MemoryRouter initialEntries={['/']}>{Story()}</MemoryRouter>,
  ],
} as Meta<WizardType>;

const Template: Story<WizardType> = ({ ref, ...args }) => {
  return (
    <>
      <div className="w-100 text-center">
        Swipe <code>toggle</code> to <strong>true</strong> in the control below
        to see the Wizard component
      </div>
      <Wizard {...args}>
        <WizardHeader heading="Wizard Title" />
        <WizardSteps
          navigationDescription="Step {activeStep} of {totalSteps}"
          steps={[
            ...WizardStepsStories.Default.args!.steps!,
            {
              ...WizardStepsStories.WithSecondaryContent.args!.steps![0],
              path: '/withSecondaryContent',
            },
          ]}
        />
      </Wizard>
    </>
  );
};

export const Default: Story<WizardType> = Template.bind({});
Default.args = {
  strict: true,
  toggle: false,
  onDismissed: action('dismissed'),
};
