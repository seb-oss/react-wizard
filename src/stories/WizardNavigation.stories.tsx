import { action } from '@storybook/addon-actions';
import { ComponentMeta as Meta, ComponentStory as Story } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { NavigationProvider } from '../contexts/navigationContext';
import WizardNavigation from '../WizardSteps/components/WizardNavigation';

type WizardNavigationType = typeof WizardNavigation;

export default {
  title: 'components/WizardNavigation',
  component: WizardNavigation,
  argTypes: {
    state: {
      control: {
        type: 'select',
        options: ['info', 'warning', 'danger', 'success'],
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <NavigationProvider>{Story()}</NavigationProvider>
      </MemoryRouter>
    ),
  ],
} as Meta<WizardNavigationType>;

const Template: Story<WizardNavigationType> = (args) => <WizardNavigation {...args} />;

export const Default: Story<WizardNavigationType> = Template.bind({});
Default.args = {
  label: 'Step 1',
  path: '/',
  onClick: action('navigation-link-click'),
  disabled: false,
};
