import {
  ComponentMeta as Meta,
  ComponentStory as Story,
} from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { NavigationProvider } from '../contexts/navigationContext';
import WizardNavigations from '../WizardSteps/components/WizardNavigations';

type WizardNavigationsType = typeof WizardNavigations;

export default {
  title: 'components/WizardNavigations',
  component: WizardNavigations,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <NavigationProvider strict={false}>{Story()}</NavigationProvider>
      </MemoryRouter>
    ),
  ],
} as Meta<WizardNavigationsType>;

const Template: Story<WizardNavigationsType> = (args) => (
  <WizardNavigations {...args} />
);

export const Default: Story<WizardNavigationsType> = Template.bind({});
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
