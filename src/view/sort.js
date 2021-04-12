import {NAMES_OF_SORTS} from '../const.js';
import {createElement} from '../utils.js';

const createSortItemTemplate = (isChecked) => {

  return  NAMES_OF_SORTS.map((sort) => `<div class="trip-sort__item  trip-sort__item--${sort}">
                              <input id="sort-${sort}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sort}" ${isChecked ? 'checked' : ''}>
                              <label class="trip-sort__btn" for="sort-${sort}">${sort}</label>
                              </div>`).join('');
};

const sortTemplate = createSortItemTemplate();

const createSortTemplate = () => {

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            ${sortTemplate}
          </form>`;
};

export default class Sort {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSortTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
