export const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export const getCurrentTime = () => {
  return new Date().toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
};

export const getFormattedDateTime = (format = 'YYYY-MM-DD HH:mm:ss') => {
  const now = new Date();
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZone: 'UTC'
  };

  // Intl.DateTimeFormat can be used for more complex formatting
  const formattedDateTime = new Intl.DateTimeFormat('en-US', options).format(now);

  // Replace placeholders in the format string
  return format
    .replace(/YYYY/g, formattedDateTime.getFullYear())
    .replace(/MM/g, formattedDateTime.getMonth() + 1)
    .replace(/DD/g, formattedDateTime.getDate())
    .replace(/HH/g, formattedDateTime.getHours())
    .replace(/mm/g, formattedDateTime.getMinutes())
    .replace(/ss/g, formattedDateTime.getSeconds());
}