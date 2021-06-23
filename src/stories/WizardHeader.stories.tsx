import { Meta, Story } from '@storybook/react';
import React from 'react';
import WizardHeader, { WizardHeaderProps } from '../WizardHeader';

export default {
  title: 'components/WizardHeader',
  component: WizardHeader,
  argTypes: {},
} as Meta;

const Template: Story<WizardHeaderProps> = (args) => <WizardHeader {...args} />;

export const Default = Template.bind({});
Default.args = {
  heading: 'Wizard Header',
};
