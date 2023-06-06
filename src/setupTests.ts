// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

global.scrollTo = jest.fn();

global.defaultNavigationInterface = {
  activeControls: undefined,
  activeState: undefined,
  activeStep: 0,
  isWizardCompleted: false,
  isStrict: false,
  routes: [],
  completeWizard: jest.fn(),
  isNavigableStep: jest.fn(),
  isValidStep: jest.fn(),
  nextStep: jest.fn(),
  previousStep: jest.fn(),
  setActiveControls: jest.fn(),
  setActiveState: jest.fn(),
  setActiveStep: jest.fn(),
  setRoutes: jest.fn(),
};
