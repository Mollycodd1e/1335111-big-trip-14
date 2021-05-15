import {NAMES_OF_SORTS} from '../const.js';
import AbstractView from '../view/abstract.js';

const TARGET_TAG_NAME = 'LABEL';

const DISABLED_SORTS = {
  EVENT: 'event',
  OFFER: 'offer',
};

const createSortItemTemplate = (currentSortType) => {

  return  NAMES_OF_SORTS.map((sort) => `<div class="trip-sort__item  trip-sort__item--${sort}">
                              <input id="sort-${sort}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sort}"
                              ${currentSortType === sort ? 'checked' : ''}>
                              <label class="trip-sort__btn" for="sort-${sort}" data-sort-type="${sort}">${sort}</label>
                              </div>`).join('');
};

//const sortTemplate = createSortItemTemplate();

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
    if(evt.target.dataset.sortType !== DISABLED_SORTS.EVENT && evt.target.dataset.sortType !== DISABLED_SORTS.OFFER) {
      this._callback.sortTypeChange(evt.target.dataset.sortType);
    }
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
