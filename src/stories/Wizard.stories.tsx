import { Meta, Story } from '@storybook/react';
import React from 'react';
import Wizard, { WizardProps } from '../Wizard';

export default {
  title: 'components/Wizard',
  component: Wizard,
  argTypes: {},
} as Meta;

const Template: Story<WizardProps> = (args) => <Wizard {...args} />;

export const Default = Template.bind({});
Default.args = {};
