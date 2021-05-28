import Observer from '../utils/observer.js';
import {FilterType} from '../const.js';

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeOption = FilterType.EVERYTHING;
  }

  set(updateType, filter) {
    this._activeOption = filter;
    this._notify(updateType, filter);
  }

  get() {
    return this._activeOption;
  }
}
