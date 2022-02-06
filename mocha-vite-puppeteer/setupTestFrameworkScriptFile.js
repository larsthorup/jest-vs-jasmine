import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import sinon from "sinon";
import deepEqual from "deep-equal";

Enzyme.configure({ adapter: new Adapter() });

// Polyfill unsupport jasmine utilities

global.expect = (actual) => ({
  not: {
    toHaveBeenCalled: () => {
      return !actual.called;
    },
    toThrow: () => {
      try {
        actual()
      } catch (err) {
        throw new Error(`Expected function not to throw but threw ${err}`)
      }
    }
  },
  toBe: (expected) => {
    if (actual !== expected) {
      throw new Error(`Expected value to be ${expected} but was ${actual}`);
    }
  },
  toBeDefined: () => {
    if (actual === undefined) {
      throw new Error(`Expected value to be defined, but was ${actual}`);
    }
  },
  toContain: (expected) => {
    if (!actual.includes(expected)) {
      throw new Error(`Expected value to contain ${expected} but was ${actual}`);
    }
  },
  toEqual: (expected) => {
    if (expected && expected.objectContaining) {
      Object.keys(expected.expected).forEach((key) => {
        expect(actual[key]).toEqual(expected.expected[key]);
      });
    } else {
      if (expected) {
        for (const key of Object.keys(expected)) {
          if (key === "onToggle") { // Note: hack for .toEqual({onToggle: jasmine.any(Function)})
            if (!(actual[key] instanceof Function)) {
              throw new Error(`Expected actual.${key} to be any Function but was ${JSON.stringify(actual[key])}`)
            }
            expected[key] = actual[key];
          }
        }
      }
      if (!deepEqual(actual, expected)) {
        throw new Error(`Expected value to equal ${JSON.stringify(expected)} but was ${JSON.stringify(actual)}`);
      }
    }
  },
  toHaveBeenCalled: () => {
    return actual.called;
  },
  toHaveBeenCalledWith: actual && actual.calledWith,
})

global.jasmine = {
  any: sinon.match.instanceOf,
  createSpy: () => sinon.spy(),
  objectContaining: (expected) => ({
    objectContaining: true,
    expected,
  })
};

global.beforeAll = global.before;

global.spyOn = (object, method) => sinon.spy(object, method);
