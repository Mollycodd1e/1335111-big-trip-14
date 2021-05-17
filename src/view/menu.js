import AbstractView from '../view/abstract.js';
import {MenuItem} from '../const.js';
import {newEventButtonDisableOn, newEventButtonDisableOff} from '../utils/common.js';

const createMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
            <a class="trip-tabs__btn  trip-tabs__btn--active" name="${MenuItem.TABLE}" href="#">${MenuItem.TABLE}</a>
            <a class="trip-tabs__btn" name="${MenuItem.STATS}" href="#">${MenuItem.STATS}</a>
          </nav>`;
};

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuClickHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    const prevItem = document.querySelector('.trip-tabs__btn--active');
    prevItem.classList.remove('trip-tabs__btn--active');
    evt.target.classList.add('trip-tabs__btn--active');

    if (evt.target.name === MenuItem.STATS) {
      newEventButtonDisableOn();
    } else {
      newEventButtonDisableOff();
    }

    this._callback.menuChange(evt.target.name);
  }

  setMenuClickHandler(callback) {
    this._callback.menuChange = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }
}
