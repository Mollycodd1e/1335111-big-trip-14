import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const createWaypointTemplate = (waypoint) => {
  const {waypointType, data, town, upperTime, lowerTime, price, isFavorite} = waypoint;

  const lowerTimeFormat = dayjs(lowerTime).format('HH:mm');
  const upperTimeFormat = dayjs(upperTime).format('HH:mm');
  const dateFormat = dayjs(data).format('MMM DD');
  const dateYMD = dayjs(data).format('YYYY-MM-DD');
  const startEvent = dayjs(lowerTime).format('YYYY-MM-DDTHH:mm');
  const endEvent = dayjs(upperTime).format('YYYY-MM-DDTHH:mm');

  const difference = (ariveTime, departureTime) => {
    let result;
    const compare = (departureTime.diff(ariveTime));

    if ((dayjs.duration((compare)).minutes() < 60) && (dayjs.duration((compare)).minutes() >= 10)) {
      result = dayjs.duration((compare)).minutes() + 'M';
    } else {
      result = '0' + dayjs.duration((compare)).minutes() + 'M';
    }

    if (((dayjs.duration((compare)).hours()) >= 10) && ((dayjs.duration((compare)).minutes()) < 24)) {
      result = dayjs.duration(compare).hours() + 'H' + ' ' + result;
    } else {
      result = '0' + dayjs.duration(compare).hours() + 'H' + ' ' + result;
    }

    if (((dayjs.duration((compare)).hours()) >= 24) && ((dayjs.duration((compare)).days()) < 10) && ((dayjs.duration((compare)).days()) > 0)) {
      result = '0' + dayjs.duration(compare).days() + 'D' + ' ' + result;
    } else if ((dayjs.duration((compare)).days()) > 10) {
      result = dayjs.duration(compare).days() + 'D' + ' ' + result;
    }

    return result;
  };

  const diff = difference(lowerTime, upperTime);

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
                  <time class="event__start-time" datetime="${startEvent}">${lowerTimeFormat}</time>
                  &mdash;
                  <time class="event__end-time" datetime="${endEvent}">${upperTimeFormat}</time>
                </p>
                <p class="event__duration">${diff}</p>
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
