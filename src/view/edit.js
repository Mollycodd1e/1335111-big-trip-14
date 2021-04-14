import {createElement} from '../utils.js';
import {TYPES, TOWNS} from '../const.js';

const createEditTypeTemplate = (currentType) => {
  return  TYPES.map((type) => `<div class="event__type-item">
                            <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''}>
                            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
                            </div>`).join('');
};

const typesTemplate = createEditTypeTemplate();

const createOptionTemplate = () => {
  return TOWNS.map((town) => `<option value="${town}"></option>`).join('');
};

const listOfTown = createOptionTemplate();

const createEditTemplate = (waypoint = {}) => {

  const editOffer = () => {
    const {offer,
    } = waypoint;

    const ADD_OFFERS = [
      {
        name: 'uber',
        title: 'Order Uber',
        price: 20,
      },
      {
        name: 'luggage',
        title: 'Add luggage',
        price: 50,
      },
      {
        name: 'comfort',
        title: 'Switch to comfort',
        price: 80,
      },
      {
        name: 'meal',
        title: 'Add meal',
        price: 15,
      },
      {
        name: 'seats',
        title: 'Choose seats',
        price: 5,
      },
      {
        name: 'train',
        title: 'Travel by train',
        price: 40,
      },
    ];
    for (let i = 0; i < offer.length; i++) {
      for (let j = 0; j < ADD_OFFERS.length; j++) {
        if (offer[i].name === ADD_OFFERS[j].name) {
          ADD_OFFERS[j]['isChecked'] = 'true';
        }
      }
    }

    return ADD_OFFERS;
  }

  const checkedOptions = editOffer();

  const addOption = () => {
    return checkedOptions.map((option) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${option.name}-1" type="checkbox" name="event-offer-${option.name}" ${option.isChecked ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${option.name}-1">
      <span class="event__offer-title">${option.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${option.price}</span>
      </label>
      </div>`).join('');
  }

  const addCheckedOptions = addOption();

  const {waypointType = 'flight',
    description = '',
    town = '',
    upperTime = '',
    lowerTime ,
    price = '',
  } = waypoint;

  return `<form class="event event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-1">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${waypointType}.png" alt="Event type icon">
                </label>
                <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

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
                <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${town}" list="destination-list-1">
                <datalist id="destination-list-1">
                  ${listOfTown}
                </datalist>
              </div>

              <div class="event__field-group  event__field-group--time">
                <label class="visually-hidden" for="event-start-time-1">From</label>
                <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${lowerTime}">
                &mdash;
                <label class="visually-hidden" for="event-end-time-1">To</label>
                <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${upperTime}">
              </div>

              <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-1">
                  <span class="visually-hidden">Price</span>
                  &euro;
                </label>
                <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">Delete</button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </header>
            <section class="event__details">
              <section class="event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                <div class="event__available-offers">
                  ${addCheckedOptions}
                </div>
              </section>

              <section class="event__section  event__section--destination">
                <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                <p class="event__destination-description">${description}</p>
              </section>
            </section>
          </form>`;
};

export default class Edit {
  constructor(waypointForm) {
    this._waypointForm = waypointForm;
    this._element = null;
  }

  getTemplate() {
    return createEditTemplate(this._waypointForm);
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
}
