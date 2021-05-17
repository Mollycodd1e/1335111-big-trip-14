import {createElement} from '../utils/render.js';
import {SHAKE_ANIMATION_TIMEOUT} from '../const.js';

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error ('Cannot instantiate Abstract,use extends class');
    }

    this._callback = {};
    this._element = null;
  }

  getTemplate() {
    throw new Error ('This method not implemented in Abstract class');
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

  shake(callback) {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
