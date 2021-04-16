import Abstract from '../view/abstract.js';

export const renderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, element, place) => {

  if (element instanceof Abstract) {
    element = element.getElement();
  }

  switch (place) {
    case renderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case renderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const replace = (firstItem, secondItem) => {
  if (firstItem instanceof Abstract) {
    firstItem = firstItem.getElement();
  }

  if (secondItem instanceof Abstract) {
    secondItem = secondItem.getElement();
  }

  secondItem.parentElement.replaceChild(firstItem, secondItem);
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};
