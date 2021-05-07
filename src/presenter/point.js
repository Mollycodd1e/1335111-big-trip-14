import EditView from '../view/edit.js';
import WaypointView from '../view/waypoint.js';
import {render, renderPosition, replace, remove} from '../utils/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Point {
  constructor(waypointContainer, changeData, changeMode) {
    this._waypointContainer = waypointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._waypointComponent = null;
    this._editComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleSubmitClick = this._handleSubmitClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(waypoint) {
    this._waypoint = waypoint;

    const prevWaypointComponent = this._waypointComponent;
    const prevEditComponent = this._editComponent;

    this._waypointComponent = new WaypointView(waypoint);
    this._editComponent = new EditView(waypoint);

    this._waypointComponent.setWaypointClickHandler(this._handleEditClick);
    this._editComponent.setEditSubmitHandler(this._handleSubmitClick);
    this._editComponent.setEditClickHandler(this._handleSubmitClick);
    this._waypointComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevWaypointComponent === null || prevEditComponent === null) {
      const mainElement = document.querySelector('.page-body__page-main');
      const eventElement = mainElement.querySelector('.trip-events');
      const listElement = eventElement.querySelector('.trip-events__list');
      render(listElement, this._waypointComponent, renderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._waypointComponent, prevWaypointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editComponent, prevEditComponent);
    }

    remove(prevWaypointComponent);
    remove(prevEditComponent);
  }

  destroy() {
    remove(this._waypointComponent);
    remove(this._editComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToWaypoint();
    }
  }

  _handleFavoriteClick() {
    this._changeData(Object.assign({},this._waypoint,{isFavorite: !this._waypoint.isFavorite}));
  }

  _replaceWaypointToForm() {
    replace(this._editComponent,this._waypointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToWaypoint() {
    replace(this._waypointComponent,this._editComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._editComponent.reset(this._waypoint);
      this._replaceFormToWaypoint();
    }
  }

  _handleEditClick() {
    this._replaceWaypointToForm();
  }

  _handleSubmitClick() {
    this._replaceFormToWaypoint();
  }
}
