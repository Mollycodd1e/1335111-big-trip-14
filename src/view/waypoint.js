import dayjs from 'dayjs';
import AbstractView from '../view/abstract.js';

const createWaypointTemplate = (waypoint) => {
  const {waypointType, town, upperTime, lowerTime, price, isFavorite} = waypoint;

  const lowerTimeFormated = dayjs(lowerTime).format('HH:mm');
  const upperTimeFormated = dayjs(upperTime).format('HH:mm');
  const dateFormat = dayjs(lowerTime).format('MMM DD');
  const dateYMD = dayjs(lowerTime).format('YYYY-MM-DD');
  const startEvent = dayjs(lowerTime).format('YYYY-MM-DDTHH:mm');
  const endEvent = dayjs(upperTime).format('YYYY-MM-DDTHH:mm');

  function convertMinutes(num) {
    const hours = Math.floor(num / 60);
    const days = Math.floor(hours / 24);
    const rhours = hours - days * 24;
    const minutes = Math.floor(num % 60);

    const dateObj = {
      D: days < 10 ? '0' + days : days,
      H: rhours < 10 ? '0' + rhours : rhours,
      M: minutes < 10 ? '0' + minutes : minutes,
    };

    return Object.keys(dateObj).map((item) =>
      dateObj[item] > 0 ? dateObj[item] + item : ' ').join(' ').trim();
  }

  const getTimeDifference = (arriveTime, departureTime) => {
    if (departureTime !== undefined && arriveTime !== undefined) {
      const tripInMinutes = dayjs(departureTime).diff(dayjs(arriveTime), 'minutes');
      return convertMinutes(tripInMinutes);
    }
  };

  const difference = getTimeDifference(lowerTime, upperTime);

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

  return `<li class="trip-events__item">
            <div class="event">
              <time class="event__date" datetime="${dateYMD}">${dateFormat}</time>
              <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${waypointType}.png" alt="Event type icon">
              </div>
              <h3 class="event__title">${waypointType} ${town}</h3>
              <div class="event__schedule">
                <p class="event__time">
                  <time class="event__start-time" datetime="${startEvent}">${lowerTimeFormated}</time>
                  &mdash;
                  <time class="event__end-time" datetime="${endEvent}">${upperTimeFormated}</time>
                </p>
                <p class="event__duration">${difference}</p>
              </div>
              <p class="event__price">
                &euro;&nbsp;<span class="event__price-value">${price}</span>
              </p>
              <h4 class="visually-hidden">Offers:</h4>
              <ul class="event__selected-offers">
              </ul>
              <button class="${favoriteClassName}" type="button">
                <span class="visually-hidden">Add to favorite</span>
                <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                  <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                </svg>
              </button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </div>
          </li>`;
};

export default class Waypoint extends AbstractView {
  constructor(waypoint) {
    super();
    this._waypoint = waypoint;

    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._waypointClickHandler = this._waypointClickHandler.bind(this);
  }

  getTemplate() {
    return createWaypointTemplate(this._waypoint);
  }

  _waypointClickHandler(evt) {
    evt.preventDefault();
    this._callback.waypointClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }

  setWaypointClickHandler(callback) {
    this._callback.waypointClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._waypointClickHandler);
  }
}
