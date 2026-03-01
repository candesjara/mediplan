// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';

// axios v1 (ESM) can break CRA/Jest resolution in some setups.
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: () => ({
      interceptors: { request: { use: jest.fn() } },
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    })
  }
}));

// Avoid SweetAlert2 CSS/runtime side effects in jsdom.
jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: jest.fn()
  }
}));
