import {TYPES} from '../const.js';
import SmartView from '../view/smart.js';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const classOfStartDateInput = '.event__input--date-from';
const classOfEndDateInput = '.event__input--date-to';

const createEditTypeTemplate = (currentType) => {
  if (currentType === undefined) {
    currentType = 'flight';
  }

  return  TYPES.map((type) => `<div class="event__type-item">
                            <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''}>
                            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
                            </div>`).join('');
};

const createOptionTemplate = (array) => {
  return array.map((element) => `<option value="${element}"></option>`).join('');
};

const createEditTemplate = (waypoint = {}, destination, offer) => {

  const {waypointType = 'flight',
    description = '',
    town = '',
    upperTime = '',
    lowerTime = '',
    price = '',
  } = waypoint;

  if (waypoint.offer === undefined || waypoint.waypointType === undefined) {
    waypoint.waypointType = waypointType;
    offer.get().map((item) => {
      if(item.type === waypointType) {
        waypoint.offer = item.offers;
        waypoint.isChecked = false;
      }
    });
  }

  const towns = [];

  destination.getDestinations().map((item) => towns.push(item.name));

  const typesTemplate = createEditTypeTemplate(waypoint.waypointType);

  const listOfTown = createOptionTemplate(towns);

  const emptyOffers = [];

  if (waypoint.offer !== null) {
    emptyOffers.push(waypoint.offer);
  }
  if (waypoint.offer === null) {
    waypoint.offer = emptyOffers;
  }

  waypoint.offer.map((item) => {
    if (!Object.prototype.hasOwnProperty.call(item, 'isChecked')) {
      item.isChecked = false;
    }
  });

  const addPicture = (pictures) => {
    if (pictures) {
      return pictures.map((picture) => {
        return `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
      }).join(' ');
    } else {
      pictures = [];
      return pictures;
    }
  };

  const addAllPictures = addPicture(waypoint.picture);

  const addOption = () => {

    return waypoint.offer.map((option) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${option.title}-1" type="checkbox" name="event-offer-${option.title}"
      ${waypoint.isSaving === true || waypoint.isDeleting === true ? 'disabled' : ''} ${option.isChecked === true ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${option.title}-1">
      <span class="event__offer-title">${option.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${option.price}</span>
      </label>
      </div>`).join('');
  };

  const addCheckedOptions = addOption();

  return `<form class="event event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-1">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${waypointType}.png" alt="Event type icon">
                </label>
                <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${waypoint.isDisabled === true ? 'disabled' : ''}>

                <div class="event__type-list">
                  <fieldset class="event__type-group">
                    <legend class="visually-hidden">Event type</legend>
                    ${typesTemplate}
                  </fieldset>
                </div>
              </div>

              <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-1">
                  ${waypointType}
                </label>
                <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${town}" list="destination-list-1"
                ${waypoint.isDisabled === true ? 'disabled' : ''}>
                <datalist id="destination-list-1">
                  ${listOfTown}
                </datalist>
              </div>

              <div class="event__field-group  event__field-group--time">
                <label class="visually-hidden" for="event-start-time-1">From</label>
                <input class="event__input  event__input--time event__input--date-from" id="event-start-time-1" type="text" name="event-start-time" value="${lowerTime}"
                ${waypoint.isDisabled === true ? 'disabled' : ''}>
                &mdash;
                <label class="visually-hidden" for="event-end-time-1">To</label>
                <input class="event__input  event__input--time event__input--date-to" id="event-end-time-1" type="text" name="event-end-time" value="${upperTime}"
                ${waypoint.isDisabled === true ? 'disabled' : ''}>
              </div>

              <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-1">
                  <span class="visually-hidden">Price</span>
                  &euro;
                </label>
                <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}" ${waypoint.isDisabled === true ? 'disabled' : ''}>
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit" ${waypoint.isDeleting === true ? 'disabled' : ''}>${waypoint.isSaving === true ? 'Saving...' : 'Save'}</button>
              <button class="event__reset-btn" type="reset" ${waypoint.isSaving === true ? 'disabled' : ''}>${waypoint.isDeleting === true ? 'Deleting' : 'Delete'}</button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </header>
            <section class="event__details">
              <section class="${waypoint.offer.length === 0 ? 'visually-hidden' : ''} event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                <div class="event__available-offers">
                  ${addCheckedOptions}
                </div>
              </section>

              <section class="event__section  event__section--destination">
                <h3 class="${waypoint.description === undefined ? 'visually-hidden' : ''} event__section-title  event__section-title--destination">Destination</h3>
                <p class="event__destination-description">${description}</p>

                <div class="event__photos-container">
                      <div class="event__photos-tape">
                      ${addAllPictures}
                      </div>
                    </div>
              </section>
            </section>
          </form>`;
};

export default class Edit extends SmartView {
  constructor(waypointForm, destinationModel, offerModel) {
    super();
    this._data = Edit.parseWaypointToData(waypointForm);
    this._datepicker = null;
    this._endPicker = null;
    this._destinationModel = destinationModel;
    this._offerModel = offerModel;
    this._checkedOffers = this._data.offer;

    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._editSubmitHandler = this._editSubmitHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);
    this._routeTypeChangeHandler = this._routeTypeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._editDeleteClickHandler = this._editDeleteClickHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._destinationKeydownHandler = this._destinationKeydownHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
    this._setEndPicker();
  }

  getTemplate() {
    return createEditTemplate(this._data, this._destinationModel, this._offerModel);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._editDeleteClickHandler);
  }

  setEditSubmitHandler(callback) {
    this._callback.editSubmit = callback;
    this.getElement().addEventListener('submit', this._editSubmitHandler);
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  reset(waypointForm) {
    this._checkedOffers = this._data.offer;
    this.updateData(Edit.parseWaypointToData(waypointForm));
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this._setEndPicker();
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setEditSubmitHandler(this._callback.editSubmit);
    this.setEditClickHandler(this._callback.editClick);
  }

  removeElement() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }

    super.removeElement();
  }

  _setPicker(element, input, change) {
    if (element) {
      element.destroy();
      element = null;
    }

    element = flatpickr(this.getElement().querySelector(input), {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      'time_24hr': true,
      onChange: change,
    });
  }

  _setDatepicker() {
    this._setPicker(this._datepicker, classOfStartDateInput, this._dateFromChangeHandler);
  }

  _setEndPicker() {
    this._setPicker(this._endPicker, classOfEndDateInput, this._dateToChangeHandler);
  }

  _dateFromChangeHandler([userDate]) {
    this.updateData({lowerTime: userDate},true);
  }

  _dateToChangeHandler([userDate]) {
    this.updateData({upperTime: userDate},true);
  }

  _routeTypeChangeHandler(evt) {
    evt.preventDefault();

    let newOffers = [];

    const getOffersByType = (evt) => {
      this._offerModel.get().forEach((offer) => {
        if (offer.type === evt.target.value) {
          newOffers = offer.offers;
        }
      });
    };

    getOffersByType(evt);

    this.updateData({waypointType: evt.target.value, offer: newOffers});

    this._checkedOffers = this._data.offer;
  }

  _offersChangeHandler(evt) {
    if (this._checkedOffers === undefined) {
      this._checkedOffers = this._data.offer;
    }

    if (evt.target.checked) {
      evt.target.setAttribute('checked', '');
    } else {
      evt.target.removeAttribute('checked', '');
    }
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._destinationChangeHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('keydown', this._destinationKeydownHandler);
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._routeTypeChangeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('change', this._priceChangeHandler);
    this.getElement().querySelector('.event__details').addEventListener('change', this._offersChangeHandler);
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({price: evt.target.value}, true);
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();

    let newDestinations = [];

    const getDestinationByTown = (evt) => {
      this._destinationModel.get().forEach((destination) => {
        if (destination.name === evt.target.value) {
          newDestinations = destination;
        }
      });
    };

    getDestinationByTown(evt);

    this.updateData({town: evt.target.value , description: newDestinations.description, picture: newDestinations.pictures});
  }

  _destinationKeydownHandler(evt) {
    evt.preventDefault();

    if (evt.code === 'Backspace') {
      evt.target.value = '';
    }

    if (evt.code !== 'Backspace') {
      return false;
    }
  }

  _editSubmitHandler(evt) {
    evt.preventDefault();

    this._checkedOffers.map((item) => {
      item.isChecked = (document.querySelector('[id="event-offer-' + item.title + '-1"]').checked);
    });

    this.updateData({offer: this._checkedOffers});
    this._callback.editSubmit(Edit.parseDataToWaypoint(this._data));
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this.updateData({offer: this._data.offer});
    this._callback.editClick();
  }

  _editDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(Edit.parseDataToWaypoint(this._data));
  }

  static parseWaypointToData(waypointForm) {
    return Object.assign({}, waypointForm, {
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
  }

  static parseDataToWaypoint(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
