import AbstractView from '../view/abstract.js';

const createListTemplate = () => {
  return `<ul class="trip-events__list">
          </ul>`;
};

export default class List extends AbstractView {
  constructor() {
    super();
    this._element = null;
  }

  getTemplate() {
    return createListTemplate();
  }
}
