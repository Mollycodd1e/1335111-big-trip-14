import {NAMES_OF_SORTS} from '../const.js';
import AbstractView from '../view/abstract.js';

const TARGET_TAG_NAME = 'LABEL';

const DISABLED_SORTS = {
  EVENT: 'event',
  OFFER: 'offer',
};

const disabledSorts = (sortType) => {
  if (Object.values(DISABLED_SORTS).indexOf(sortType) >= 0) {
    return Object.assign({}, DISABLED_SORTS, {
      isDisabled: true,
    });
  } else {
    return Object.assign({}, DISABLED_SORTS, {
      isDisabled: false,
    });
  }
};

const createSortItemTemplate = (currentSortType) => {

  return  NAMES_OF_SORTS.map((sort) => `<div class="trip-sort__item  trip-sort__item--${sort}">
                              <input id="sort-${sort}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sort}"
                              ${currentSortType === sort ? 'checked' : ''} ${disabledSorts(sort).isDisabled === true ? 'disabled' : ''}>
                              <label class="trip-sort__btn" for="sort-${sort}" data-sort-type="${sort}">${sort}</label>
                              </div>`).join('');
};

const createSortTemplate = (currentSortType) => {

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            ${createSortItemTemplate(currentSortType)}
          </form>`;
};

export default class Sort extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== TARGET_TAG_NAME) {
      return;
    }

    evt.preventDefault();
    if (Object.values(DISABLED_SORTS).indexOf(evt.target.dataset.sortType) < 0) {
      this._callback.sortTypeChange(evt.target.dataset.sortType);
    }
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
