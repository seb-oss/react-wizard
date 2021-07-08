import { Meta, Story } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { NavigationProvider } from '../contexts/navigationContext';
import WizardNavigations, {
  WizardNavigationsProps,
} from '../WizardSteps/components/WizardNavigations';

export default {
  title: 'components/WizardNavigations',
  component: WizardNavigations,
  argTypes: {},
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <NavigationProvider routes={['/']}>{Story()}</NavigationProvider>
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: Story<WizardNavigationsProps> = (args) => (
  <WizardNavigations {...args} />
);

export const Default: Story<WizardNavigationsProps> = Template.bind({});
Default.args = {
  navigationDescription: 'Step {activeStep} of {totalSteps}',
  navigations: [
    {
      label: 'Step 1',
      path: '/',
    },
    {
      label: 'Step 2',
      path: '/step2',
    },
    {
      label: 'Step 3',
      path: '/step3',
    },
  ],
};
