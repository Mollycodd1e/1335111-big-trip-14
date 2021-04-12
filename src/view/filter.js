import {createElement} from '../utils.js';

const createFilterItem = (filter, isChecked) => {
  const {name} = filter;

  return `<div class="trip-filters__filter">
          <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked ? 'checked' : ''}>
          <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
          </div>`;
};

const createFilterTemplate = function (filterItems) {

  const filterItemsTemplate = filterItems.map((filter, index) => createFilterItem(filter, index === 0)).join('');

  return `<form class="trip-filters" action="#" method="get">
            ${filterItemsTemplate}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};

export default class Filter {
  constructor(filter) {
    this._filter = filter;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filter);
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
