import AbstractView from '../view/abstract.js';

const createFilterItem = (filter, currentFilterType) => {
  const {type, name, length} = filter;

  return `<div class="trip-filters__filter">
          <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}"
          ${type === currentFilterType ? 'checked' : ''} ${length < 1 ? 'disabled' : ''}>
          <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
          </div>`;
};

export const createFilterTemplate = (filterItems, currentFilterType) => {

  const filterItemsTemplate = filterItems.map((filter) => createFilterItem(filter, currentFilterType)).join('');

  return `<form class="trip-filters" action="#" method="get">
            ${filterItemsTemplate}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};

export default class Filter extends AbstractView {
  constructor(filter, currentFilterType) {
    super();
    this._filter = filter;
    this._currentFilter = currentFilterType;

    this._typeChangeHandler = this._typeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filter, this._currentFilter);
  }

  setTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._typeChangeHandler);
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
}
