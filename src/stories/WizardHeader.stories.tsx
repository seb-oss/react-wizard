import { Meta, Story } from '@storybook/react';
import React from 'react';
import WizardHeader, { WizardHeaderProps } from '../WizardHeader';

const actionsOptions = {
  'Single action': [<button className="btn">x</button>],
  'Multiple actions': [
    <button className="btn">Save</button>,
    <button className="btn">x</button>,
  ],
};

export default {
  title: 'components/WizardHeader',
  component: WizardHeader,
  argTypes: {
    actions: {
      options: Object.keys(actionsOptions),
      mapping: actionsOptions,
    },
  },
} as Meta;

const Template: Story<WizardHeaderProps> = (args) => <WizardHeader {...args} />;

export const Default = Template.bind({});
Default.args = {
  heading: 'Wizard header',
};

export const WithActions = Template.bind({});
WithActions.args = {
  heading: 'Wizard header with actions',
  actions: [
    <button className="btn">Save</button>,
    <button className="btn">x</button>,
  ],
};
