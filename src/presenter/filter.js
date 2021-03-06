import FilterView from '../view/filter.js';
import {render, renderPosition, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';
import {newEventButtonDisableOff} from '../utils/common.js';

export default class Filter {
  constructor(filterContainer, filterModel, waypointModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._waypointModel = waypointModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleTypeChange = this._handleTypeChange.bind(this);

    this._waypointModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  _get() {
    const waypoints = this._waypointModel.get();

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'Everything',
        length: filter[FilterType.EVERYTHING](waypoints).length,
      },
      {
        type: FilterType.PAST,
        name: 'Past',
        length: filter[FilterType.PAST](waypoints).length,
      },
      {
        type: FilterType.FUTURE,
        name: 'Future',
        length: filter[FilterType.FUTURE](waypoints).length,
      },
    ];
  }

  init() {
    const filters = this._get();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.get());

    this._filterComponent.setTypeChangeHandler(this._handleTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, renderPosition.BEFOREEND);
    }

    if (prevFilterComponent !== null) {
      replace(this._filterComponent, prevFilterComponent);
    }

    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleTypeChange(filterType) {
    if (this._filterModel.get() === filterType) {
      return;
    }

    if (document.querySelector('.trip-tabs__btn[name="Table"]').classList.contains('trip-tabs__btn--active')) {
      newEventButtonDisableOff();
    }

    this._filterModel.set(UpdateType.MAJOR, filterType);
  }
}
