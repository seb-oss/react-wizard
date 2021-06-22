import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Wizard, WizardProps } from '../components/Wizard';

export default {
  title: 'components/Wizard',
  component: Wizard,
  argTypes: {},
} as Meta;

const Template: Story<WizardProps> = (args) => <Wizard {...args} />;

export const Default = Template.bind({});
Default.args = {};
