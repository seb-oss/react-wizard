import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { NavigationProvider } from '../contexts/navigationContext';
import WizardNavigation, {
  WizardNavigationProps,
} from '../WizardSteps/components/WizardNavigation';

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
        <NavigationProvider routes={['/']}>
          <ul className="list-group list-group-ordered">{Story()}</ul>
        </NavigationProvider>
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: Story<WizardNavigationProps> = (args) => (
  <WizardNavigation {...args} />
);

export const Default: Story<WizardNavigationProps> = Template.bind({});
Default.args = {
  step: 0,
  label: 'Step 1',
  path: '/',
  onClick: action('navigation-link-click'),
};
