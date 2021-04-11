export const generateNumber = (a = 0, b = 3) => {
  const lower = Math.ceil(a);
  const upper = Math.floor(b);

  return Math.floor(Math.random() * (upper - lower  + 1)) + lower;
};

export const filterByTitle = (array, title) => {
  return array.filter((item) => {
    return (item.title == title);
  });
};

export const renderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const renderElement = (container, element, place) => {
  switch (place) {
    case renderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case renderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};
