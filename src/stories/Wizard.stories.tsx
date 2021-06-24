import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';
import React from 'react';
import Wizard, { WizardProps } from '../Wizard';

export default {
  title: 'components/Wizard',
  component: Wizard,
  argTypes: {},
} as Meta;

const Template: Story<WizardProps> = ({ ref, ...args }) => {
  const [toggle, setToggle] = React.useState<boolean>(args.toggle);

  React.useEffect(() => {
    setToggle(args.toggle);
  }, [args.toggle]);

  return (
    <>
      <div className="w-100 text-center">
        <button className="btn" onClick={() => setToggle(true)}>
          Show Wizard
        </button>
      </div>
      <Wizard {...args} toggle={toggle}>
        <div className="d-flex justify-content-between">
          <h2>Wizard Title</h2>
          <button className="btn" onClick={() => setToggle(false)}>
            X
          </button>
        </div>
        <div>Wizard content</div>
      </Wizard>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  toggle: false,
  onDismissed: action('dismissed'),
};
