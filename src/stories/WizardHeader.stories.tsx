import { action } from '@storybook/addon-actions';
import {
  ComponentMeta as Meta,
  ComponentStory as Story,
} from '@storybook/react';
import React from 'react';
import WizardHeader from '../WizardHeader';

type WizardHeaderType = typeof WizardHeader;

const ACTION_OPTIONS = {
  'Single action': mapActions(['x']),
  'Multiple actions': mapActions(['Save', 'x']),
};

export default {
  title: 'components/WizardHeader',
  component: WizardHeader,
  argTypes: {
    actions: {
      options: Object.keys(ACTION_OPTIONS),
      mapping: ACTION_OPTIONS,
    },
  },
} as Meta<WizardHeaderType>;

const Template: Story<WizardHeaderType> = (args) => <WizardHeader {...args} />;

export const Default: Story<WizardHeaderType> = Template.bind({});
Default.args = {
  heading: 'Wizard header',
};

function mapActions(actions: Array<string>) {
  return actions.map((text: string) => (
    <button className="btn" onClick={action(`${text}-button-click`)}>
      {text}
    </button>
  ));
}
