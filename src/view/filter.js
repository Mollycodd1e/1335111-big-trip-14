import AbstractView from '../view/abstract.js';

const createFilterItem = (filter, currentFilterType) => {
  const {type, name} = filter;

  return `<div class="trip-filters__filter">
          <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}"
          ${type === currentFilterType ? 'checked' : ''}>
          <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
          </div>`;
};

export const createFilterTemplate = function (filterItems, currentFilterType) {

  const filterItemsTemplate = filterItems.map((filter/*, index*/) => createFilterItem(filter, currentFilterType/*index === 0*/)).join('');

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

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filter, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }
}
