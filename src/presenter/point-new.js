import EditView from '../view/edit.js';
//import {nanoid} from 'nanoid';
import {render, renderPosition, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';

export default class PointNew {
  constructor(listContainer, changeData) {
    this._listContainer = listContainer;
    this._changeData = changeData;

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

    this._editComponent = new EditView(this._changeData);
    this._editComponent.setEditSubmitHandler(this._handleSubmitClick);
    this._editComponent.setDeleteClickHandler(this._handleDeleteClick);

    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    const listElement = eventElement.querySelector('.trip-events__list');

    render(listElement, this._editComponent, renderPosition.AFTERBEGIN);

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
    this._disableButton();
    this._changeData(
      UserAction.ADD_WAYPOINT,
      UpdateType.MINOR,
      //Object.assign({id: nanoid()}, waypoint),
      waypoint,
    );

    //this.destroy();
  }

  _disableButton() {
    document.querySelector('.trip-main__event-add-btn').disabled = '';
  }

  _handleDeleteClick() {
    this._disableButton();
    this.destroy();
  }

  _handleEditClick() {
    this._disableButton();
    this._replaceWaypointToForm();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._disableButton();
      this.destroy();
    }
  }
}
