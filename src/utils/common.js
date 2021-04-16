export const generateNumber = (a = 0, b = 3) => {
  const lower = Math.ceil(a);
  const upper = Math.floor(b);

  return Math.floor(Math.random() * (upper - lower  + 1)) + lower;
};

export const filterByTitle = (array, title) => {
  return array.filter((item) => {
    return (item.title === title);
  });
};
