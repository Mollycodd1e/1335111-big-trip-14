import {NAMES_OF_SORTS} from '../const.js';
import AbstractView from '../view/abstract.js';

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

export default class Sort extends AbstractView {
  getTemplate() {
    return createSortTemplate();
  }
}
