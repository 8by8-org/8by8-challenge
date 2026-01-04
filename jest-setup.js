/*
  Hide warning messages that are irrelevant to the testing environment, re:
  
  - The creation of multiple Supabase clients. Supabase prints a warning message 
    to the console because the existence of multiple Supabase clients in the 
    same browsing context could result in unexpected behavior.

  - Google Analytics not initialized.
*/
const { warn } = console;

const actualWarn = (message, ...optionalParams) => {
  warn.call(console, message, ...optionalParams);
};

const warningsToIgnore = [
  'Multiple GoTrueClient instances detected in the same browser context.',
  '@next/third-parties: GA has not been initialized',
];

console.warn = (message, ...optionalParams) => {
  if (message && warningsToIgnore.some(warning => message.includes(warning))) {
    return;
  }

  actualWarn(message, ...optionalParams);
};

/* Mock the ResizeObserver */
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
