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
        if (!deepEqual(actual, expected)) {
            throw new Error(`Expected value to equal ${JSON.stringify(expected)} but was ${JSON.stringify(actual)}`);
        }
    },
    toHaveBeenCalled: () => {
        return actual.called;
    },
    toHaveBeenCalledWith: actual.calledWith,
})

global.jasmine = {
    // any: expect.any,
    createSpy: () => sinon.spy(),
    // objectContaining: expect.objectContaining
};

global.beforeAll = global.before;

// global.spyOn = vi.spyOn
