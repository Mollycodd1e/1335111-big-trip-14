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

export const replace = (firstElement, secondElement) => {
  if (firstElement instanceof Abstract) {
    firstElement = firstElement.getElement();
  }

  if (secondElement instanceof Abstract) {
    secondElement = secondElement.getElement();
  }

  if (secondElement.parentElement === null || firstElement === null || secondElement === null) {
    throw new Error('Cannot replace unexisting elements');
  }

  secondElement.parentElement.replaceChild(firstElement, secondElement);
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};
