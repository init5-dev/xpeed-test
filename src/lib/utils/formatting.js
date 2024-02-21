export const Mbps = (bps, sufix = true) => {
  if (isNaN(bps)) {
    return 'N\\A';
  }
  return (bps / 1024 / 1024).toFixed(2) + (sufix ? ' Mbps' : '');
};

export const addUnitySufix = (value, unit = 'Mbps') => {
  if (value === 'N\\A') return value;

  return value + ` ${unit}`;
};