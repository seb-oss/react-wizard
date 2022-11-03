import { action } from '@storybook/addon-actions';
import {
  ComponentMeta as Meta,
  ComponentStory as Story,
} from '@storybook/react';
import React from 'react';
import { NavigationProvider } from '../contexts/navigationContext';
import WizardControls, {
  WizardControl,
} from '../WizardSteps/components/WizardControls';

type WizardControlsType = typeof WizardControls;

const CONTROL_OPTIONS = {
  'With Custom Controls': mapControls([
    {
      type: 'prev',
      label: 'backward',
    },
    {
      type: 'cancel',
      label: 'cancel',
    },
    {
      type: 'next',
      label: 'Forward',
    },
  ]),
  'With Single Back Control': mapControls([
    {
      type: 'prev',
      label: 'backward',
    },
  ]),
  'With Single Next Control': mapControls([
    {
      type: 'next',
      label: 'Forward',
    },
  ]),
};

export default {
  title: 'components/WizardControls',
  component: WizardControls,
  argTypes: {
    controls: {
      options: Object.keys(CONTROL_OPTIONS),
      mapping: CONTROL_OPTIONS,
    },
  },
  decorators: [(Story) => <NavigationProvider>{Story()}</NavigationProvider>],
} as Meta<WizardControlsType>;

const Template: Story<WizardControlsType> = (args) => (
  <WizardControls {...args} />
);

export const Default: Story<WizardControlsType> = Template.bind({});
Default.args = {};

function mapControls(controls: Array<Partial<WizardControl>>) {
  return controls.map(
    ({ type, label }: Partial<WizardControl>) =>
      ({
        type: type,
        label: label,
        onClick: action(`${type}-button-click`),
      } as WizardControl)
  );
}
