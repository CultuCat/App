export const transformDate = (date) => {
  const dateObj = new Date(date);
  const formatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat('en-US', formatOptions);
  return formatter.format(dateObj);
};
