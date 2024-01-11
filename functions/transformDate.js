import i18next from "i18next";

export const transformDate = (date) => {

  try {
    const dateObj = new Date(date);
    const formatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    const formatter = new Intl.DateTimeFormat(i18next.t('data'), formatOptions);
    return formatter.format(dateObj);
  } catch (error) {
    console.error('Error transforming date:', error);
  }
};
