export const uniqueId = (() => {
  let counter = 0;

  return (prefix = '') => `${prefix}-${++counter}`;
})()
