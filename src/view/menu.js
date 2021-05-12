import AbstractView from '../view/abstract.js';
import {MenuItem} from '../const.js';

const createMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
            <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">${MenuItem.TABLE}</a>
            <a class="trip-tabs__btn" href="#">${MenuItem.STATS}</a>
          </nav>`;
};

export default class Menu extends AbstractView {
  constructor() {
    super();

    this.menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuClickHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.menuChange(evt.target);
  }

  setMenuClickHandler(callback) {
    this._callback.menuChange = callback;
    this.getElement().addEventListener('change', this._menuClickHandler);
  }
}
