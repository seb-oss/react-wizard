import { action } from '@storybook/addon-actions';
import { ComponentMeta as Meta, ComponentStory as Story } from '@storybook/react';
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
  decorators: [(Story) => <MemoryRouter initialEntries={['/']}>{Story()}</MemoryRouter>],
} as Meta<WizardType>;

const Template: Story<WizardType> = ({ ref, ...args }) => {
  return (
    <>
      <div className="w-100 text-center">
        Swipe <code>toggle</code> to <strong>true</strong> in the control below to see the
        Wizard component
      </div>
      <Wizard {...args}>
        <WizardHeader heading="Wizard Title" />
        <WizardSteps
          navigationDescription="Step {activeStep} of {totalSteps}"
          steps={[
            {
              path: '/introduction',
              label: 'Why do we need this?',
              component: () => <div>Intro</div>,
              data: {
                heading: 'Introduction',
                pageHeading: 'Introduction Header',
              },
              navigationType: 'intro',
            },
            ...WizardStepsStories.Default.args!.steps!,
            {
              path: '/xxx',
              label: 'Step X',
              component: () => <>'1111'</>,
              data: {
                heading: 'Step X heading',
              },
              steps: [
                {
                  path: '/xxx',
                  label: 'Step X.1',
                  component: () => <>'222'</>,
                  data: {
                    heading: 'Step X.1 heading',
                  },
                },
                {
                  path: '/yyyy',
                  label: 'Step X.2',
                  component: () => <>'333'</>,
                  data: {
                    heading: 'Step X.2 heading',
                  },
                },
              ],
            },
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
