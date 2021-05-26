import {NAMES_OF_SORTS} from '../const.js';
import {newEventButtonDisableOff} from '../utils/common.js';
import AbstractView from '../view/abstract.js';

const TARGET_TAG_NAME = 'LABEL';

const NotUseSort = {
  EVENT: 'event',
  OFFER: 'offer',
};

const createSortTemplate = (currentSortType) => {

  const createSortItemTemplate = (currentSortType) => {

    return  NAMES_OF_SORTS.map((sort) => `<div class="trip-sort__item  trip-sort__item--${sort}">
                                          <input id="sort-${sort}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sort}"
                                          ${currentSortType === sort ? 'checked' : ''} ${Object.values(NotUseSort).includes(sort) ? 'disabled' : ''}>
                                          <label class="trip-sort__btn" for="sort-${sort}" data-sort-type="${sort}">${sort}</label>
                                          </div>`).join('');
  };

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
    if (!Object.values(NotUseSort).includes(evt.target.dataset.sortType)) {
      newEventButtonDisableOff();
      this._callback.sortTypeChange(evt.target.dataset.sortType);
    }
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
