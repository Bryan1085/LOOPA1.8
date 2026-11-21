export const DEMO_MODE =
  typeof import.meta.env.VITE_DEMO_MODE === 'undefined'
    ? true
    : import.meta.env.VITE_DEMO_MODE !== 'false';
