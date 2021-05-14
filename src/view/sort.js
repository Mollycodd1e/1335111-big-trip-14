import {/*NAMES_OF_SORTS,*/ SORT_TYPE} from '../const.js';
import AbstractView from '../view/abstract.js';

const TARGET_TAG_NAME = 'LABEL';
const createSortItemTemplate = (/*isChecked,*/ currentSortType) => {

  return `<div class="trip-sort__item  trip-sort__item--day">
            <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day"
            ${currentSortType === SORT_TYPE.DAY ? 'checked' : ''}>
            <label class="trip-sort__btn" for="sort-day" data-sort-type="day">DAY</label>
          </div>
          <div class="trip-sort__item  trip-sort__item--event">
            <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
            <label class="trip-sort__btn" for="sort-event">EVENT</label>
          </div>
          <div class="trip-sort__item  trip-sort__item--time">
            <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time"
            ${currentSortType === SORT_TYPE.TIME ? 'checked' : ''}>
            <label class="trip-sort__btn" for="sort-time" data-sort-type="time">TIME</label>
          </div>
          <div class="trip-sort__item  trip-sort__item--price">
            <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price"
            ${currentSortType === SORT_TYPE.PRICE ? 'checked' : ''}>
            <label class="trip-sort__btn" for="sort-price" data-sort-type="price">PRICE</label>
          </div>
          <div class="trip-sort__item  trip-sort__item--offer">
            <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
            <label class="trip-sort__btn" for="sort-offer">OFFER</label>
          </div>`;
  //return  NAMES_OF_SORTS.map((sort) => `<div class="trip-sort__item  trip-sort__item--${sort}">
  //                            <input id="sort-${sort}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sort}"
  //                            ${currentSortType === sort ? 'checked' : ''}>
  //                            <label class="trip-sort__btn" for="sort-${sort}" data-sort-type="${sort}">${sort}</label>
  //                            </div>`).join('');
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

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
