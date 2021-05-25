import EditView from '../view/edit.js';
import {render, renderPosition, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';
import {newEventButtonDisableOff} from '../utils/common.js';

export default class PointNew {
  constructor(listContainer, changeData, destinationModel, offerModel) {
    this._listContainer = listContainer;
    this._changeData = changeData;
    this._destinationModel = destinationModel;
    this._offerModel = offerModel;
    this._editComponent = null;
    this._destroyCallback = null;

    this._handleSubmitClick = this._handleSubmitClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;

    if (this._editComponent !== null) {
      return;
    }

    this._editComponent = new EditView(this._changeData, this._destinationModel, this._offerModel);
    this._editComponent.setEditSubmitHandler(this._handleSubmitClick);
    this._editComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._editComponent.setEditClickHandler(this._handleDeleteClick);

    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    const listElement = eventElement.querySelector('.trip-events__list');

    render(listElement, this._editComponent, renderPosition.AFTERBEGIN);
    document.querySelector('.trip-events__list .event__reset-btn').textContent = 'Cancel';

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._editComponent === null) {
      return;
    }

    remove(this._editComponent);
    this._editComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  setSaving() {
    this._editComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._editComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._editComponent.shake(resetFormState);
  }

  _handleSubmitClick(waypoint) {
    newEventButtonDisableOff();
    this._changeData(
      UserAction.ADD_WAYPOINT,
      UpdateType.MINOR,
      waypoint,
    );
  }

  _handleDeleteClick() {
    newEventButtonDisableOff();
    this.destroy();
  }

  _handleEditClick() {
    newEventButtonDisableOff();
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      newEventButtonDisableOff();
      this.destroy();
    }
  }
}
