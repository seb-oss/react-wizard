import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';
import React from 'react';
import { NavigationProvider } from '../contexts/navigationContext';
import WizardControls, {
  WizardControlsProps,
} from '../WizardSteps/components/WizardControls';

export default {
  title: 'components/WizardControls',
  component: WizardControls,
  argTypes: {},
  decorators: [
    (Story) => (
      <NavigationProvider routes={['/']}>
        <Story />
      </NavigationProvider>
    ),
  ],
} as Meta;

const Template: Story<WizardControlsProps> = (args) => (
  <WizardControls {...args} />
);

export const Default: Story<WizardControlsProps> = Template.bind({});
Default.args = {};

export const WithCustomControls: Story<WizardControlsProps> = Template.bind({});
WithCustomControls.args = {
  controls: [
    {
      type: 'prev',
      label: 'backward',
      onClicked: action('previous-button-click'),
    },
    {
      type: 'cancel',
      label: 'cancel',
      onClicked: action('cancel-button-click'),
    },
    {
      type: 'next',
      label: 'Forward',
      onClicked: action('next-button-click'),
    },
  ],
};
