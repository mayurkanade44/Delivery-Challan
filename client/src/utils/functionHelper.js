export const dateFormat = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
};

export const dateTimeFormat = (date) => {
  const newDate = new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  const time = new Date(date).toLocaleTimeString("en-IN");

  return `${newDate} | ${time}`;
};
