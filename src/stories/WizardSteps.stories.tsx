import { Meta, Story } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useNavigationContext } from '../contexts/navigationContext';
import WizardSteps, { WizardStepsProps } from '../WizardSteps';
import * as WizardControlsStories from './WizardControls.stories';

export default {
  title: 'components/WizardSteps',
  component: WizardSteps,
  argTypes: {},
  decorators: [
    (Story) => <MemoryRouter initialEntries={['/']}>{Story()}</MemoryRouter>,
  ],
} as Meta;

const Template: Story<WizardStepsProps> = (args) => <WizardSteps {...args} />;
const StepComponent: React.FC = () => {
  const { completeWizard, setActiveState } = useNavigationContext();
  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between mb-3">
        <button className="btn bg-info" onClick={() => setActiveState('info')}>
          Set info state
        </button>
        <button
          className="btn bg-warning text-black"
          onClick={() => setActiveState('warning')}
        >
          Set warning state
        </button>
        <button
          className="btn bg-danger text-white"
          onClick={() => setActiveState('danger')}
        >
          Set danger state
        </button>
        <button
          className="btn bg-success text-white"
          onClick={() => setActiveState('success')}
        >
          Set success state
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setActiveState(undefined)}
        >
          Clear state
        </button>
      </div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
        nulla enim, tincidunt vel mi vitae, tincidunt interdum orci. Ut suscipit
        nisi augue, a ultricies odio accumsan imperdiet. Lorem ipsum dolor sit
        amet, consectetur adipiscing elit. Aenean ac mi dui. Donec vehicula
        dapibus est, non consectetur velit dignissim nec. Quisque elit tellus,
        eleifend vitae justo id, tempus ultricies arcu. Etiam sit amet purus
        urna. Quisque urna enim, scelerisque quis accumsan quis, feugiat sed
        libero. Interdum et malesuada fames ac ante ipsum primis in faucibus.
        Sed tempor pretium quam, eu lobortis sapien placerat tincidunt. Aliquam
        elementum, nulla at congue pretium, magna nulla ultricies lectus, ut
        fermentum nibh metus sit amet arcu. Duis urna arcu, dictum at nulla et,
        tincidunt ultrices erat.
      </p>
      <p>
        Proin convallis molestie lorem eget molestie. Curabitur leo orci,
        hendrerit ut dignissim eu, aliquam ac tortor. Cras condimentum tortor
        quis mi scelerisque, nec feugiat ipsum sodales. Cras ac ipsum turpis.
        Nam nec arcu a enim interdum dictum ac eu dui. Mauris fringilla quam in
        viverra efficitur. Donec ut velit felis.
      </p>
      <p>
        Duis et eros sollicitudin, porta odio eget, imperdiet purus. Nulla ut
        pulvinar felis, ut volutpat diam. Nulla feugiat elit id lacus iaculis
        tempus. Curabitur ut placerat nisl. Aenean est lectus, iaculis eu ex sit
        amet, faucibus ultrices urna. Interdum et malesuada fames ac ante ipsum
        primis in faucibus. Maecenas dignissim vestibulum ligula eu vestibulum.
        Donec vitae eleifend diam. Pellentesque tellus dui, bibendum a metus
        non, placerat convallis purus. Suspendisse commodo commodo elit ut
        lacinia. Aenean at augue consectetur, posuere justo et, aliquet felis.
        Donec tempus justo at sem mattis egestas. Fusce quis aliquam dui. Proin
        ornare turpis dui, eget imperdiet arcu vestibulum sit amet. Aliquam at
        nunc quis tellus pharetra placerat.
      </p>
      <p>
        Nulla vel faucibus leo. Aenean pellentesque metus eget laoreet blandit.
        Nullam magna quam, vehicula ut eleifend vitae, blandit at nisl.
        Curabitur maximus id eros et faucibus. Maecenas fringilla est elit. Nunc
        sagittis non arcu sit amet pellentesque. Maecenas at commodo nisi.
      </p>
      <p>
        Nunc ut ligula eget diam tristique maximus non sed nunc. In congue,
        ipsum at ultrices malesuada, risus augue pulvinar libero, nec venenatis
        ipsum eros quis tortor. Sed quis accumsan diam, vitae porttitor elit.
        Vestibulum ornare imperdiet neque eu aliquet. Curabitur neque velit,
        lacinia ac diam eget, commodo consectetur purus. Nam vitae lorem
        pulvinar, vulputate ex ut, posuere massa. Maecenas non sagittis lorem,
        ut pellentesque magna. Vestibulum sit amet semper lorem. Fusce lacinia
        eget purus a dignissim. Vestibulum congue elit non leo auctor, egestas
        rhoncus purus eleifend. Aenean egestas dolor sit amet neque vulputate
        finibus. Nam consequat dui at nunc maximus ultricies. Quisque id risus
        tellus. Aenean pulvinar, metus at pellentesque varius, ante felis porta
        lacus, a egestas nulla orci nec mi. Sed et orci eleifend, elementum dui
        et, pharetra neque.
      </p>
      <p className="text-center">
        <button className="btn btn-primary m-auto" onClick={completeWizard}>
          Complete
        </button>
      </p>
    </div>
  );
};

export const Default: Story<WizardStepsProps> = Template.bind({});
Default.args = {
  navigationDescription: 'Step {activeStep} of {totalSteps}',
  steps: [
    {
      path: '/',
      label: 'Step 1',
      component: StepComponent,
      data: {
        heading: 'Step 1 heading',
      },
    },
    {
      path: '/step2',
      label: 'Step 2',
      component: StepComponent,
      data: {
        heading: 'Step 2 heading',
      },
    },
    {
      path: '/step3',
      label: 'Step 3',
      component: StepComponent,
      data: {
        heading: 'Step 3 heading',
      },
    },
    {
      path: '/step4',
      label: 'Step 4',
      component: StepComponent,
      data: {
        heading: 'Step 4 heading',
      },
    },
  ],
};

export const WithSecondaryContent: Story<WizardStepsProps> = Template.bind({});
WithSecondaryContent.args = {
  ...Default.args,
  steps: [
    {
      path: '/stepWithSecondaryContent',
      label: 'Step (Secondary Content)',
      component: StepComponent,
      data: {
        heading: 'Step (Secondary Content)',
        pageHeading: 'Step with secondary content',
        secondaryContent: <div>Secondary content</div>,
      },
    },
  ],
};

export const WithCustomControls: Story<WizardStepsProps> = Template.bind({});
WithCustomControls.args = {
  ...Default.args,
  steps: [
    {
      path: '/stepWithCustomControls',
      label: 'Step (Custom Controls)',
      component: StepComponent,
      data: {
        heading: 'Step (Custom Controls)',
        pageHeading: 'Step with custom controls',
        controls: WizardControlsStories.WithCustomControls.args.controls,
      },
    },
  ],
};
