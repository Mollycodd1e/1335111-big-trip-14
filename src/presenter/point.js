import EditView from '../view/edit.js';
import WaypointView from '../view/waypoint.js';
import {render, renderPosition, replace, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';
import {newEventButtonDisableOff} from '../utils/common.js';
import {isOnline} from '../utils/common.js';
import {toast} from '../utils/toast.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class Point {
  constructor(waypointContainer, changeData, changeMode, destinationModel, offerModel) {
    this._waypointContainer = waypointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._destinationModel = destinationModel;
    this._offerModel = offerModel;

    this._waypointComponent = null;
    this._editComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleSubmitClick = this._handleSubmitClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._editComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._editComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._editComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._waypointComponent.shake(resetFormState);
        this._editComponent.shake(resetFormState);
    }
  }

  init(waypoint) {
    this._waypoint = waypoint;

    const prevWaypointComponent = this._waypointComponent;
    const prevEditComponent = this._editComponent;

    this._waypointComponent = new WaypointView(waypoint);
    this._editComponent = new EditView(waypoint, this._destinationModel, this._offerModel);

    this._waypointComponent.setClickHandler(this._handleEditClick);
    this._editComponent.setFormSubmitHandler(this._handleSubmitClick);
    this._editComponent.setFormClickHandler(this._handleCloseClick);
    this._waypointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editComponent.setDeleteClickHandler(this._handleDeleteClick);

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
      this._replaceFormToCard();
    }
  }

  _handleFavoriteClick() {
    this._changeData(UserAction.UPDATE_WAYPOINT, UpdateType.MINOR, Object.assign({}, this._waypoint, {isFavorite: !this._waypoint.isFavorite}));
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._editComponent.reset(this._waypoint);
      this._replaceFormToCard();
    }
  }

  _handleEditClick() {
    if (!isOnline()) {
      toast('You can\'t edit waypoint offline');
      return;
    }

    newEventButtonDisableOff();
    this._replaceCardToForm();
  }

  _handleCloseClick() {
    this._editComponent.reset(this._waypoint);
    this._replaceFormToCard();
  }

  _handleSubmitClick(waypoint) {
    if (!isOnline()) {
      toast('You can\'t save waypoint offline');
      return;
    }

    this._changeData(UserAction.UPDATE_WAYPOINT, UpdateType.MINOR, waypoint);
  }

  _handleDeleteClick(waypoint) {
    if (!isOnline()) {
      toast('You can\'t delete waypoint offline');
      return;
    }

    this._changeData(UserAction.DELETE_WAYPOINT, UpdateType.MINOR, waypoint);
  }

  _replaceCardToForm() {
    replace(this._editComponent,this._waypointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._waypointComponent,this._editComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }
}
