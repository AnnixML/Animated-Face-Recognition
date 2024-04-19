import '@testing-library/jest-dom'
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
import 'jest-canvas-mock';
Object.defineProperty(global.self, 'crypto', {
    value: {
        subtle: {
            digest: jest.fn((algo, data) => Promise.resolve(new Uint8Array([1, 2, 3]))), // Sample output
        },
    },
});