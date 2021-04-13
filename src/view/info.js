import dayjs from 'dayjs';
import {createElement} from '../utils.js';

const createInfoTemplate = (waypoint) => {

  const sortByTown = () => {
    const arrayOfTown = [];

    for (let i = 0; i < waypoint.length; i++ ) {
      arrayOfTown.push(waypoint[i].town);
    }

    return arrayOfTown.map((town) => `${town}`).join(' - ');
  };

  const listOfTowns = sortByTown();

  const sortByDate = () => {
    const result = [];

    for (let i = 0; i < waypoint.length; i++ ) {
      result.push(waypoint[i].data);
    }

    result.sort((a, b) => {
      return dayjs(a).isAfter(dayjs(b)) ? 1 : -1;
    });

    return result;
  };

  const arrayOfDays = sortByDate();
  const minDay = dayjs(arrayOfDays[0]).format('D');
  const maxDay = dayjs(arrayOfDays[arrayOfDays.length - 1]).format('D');
  const minMonth = dayjs(arrayOfDays[0]).format('MMM');

  const sumOfPrice = () => {
    let sum = 0;

    for (let i = 0; i < waypoint.length; i ++) {
      sum += waypoint[i].price;
    }

    return sum;
  };

  const finalSum = sumOfPrice();

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${listOfTowns}</h1>

              <p class="trip-info__dates">${minMonth} ${minDay}&nbsp;&mdash;&nbsp;${maxDay}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${finalSum}</span>
            </p>
          </section>`;
};

export default class Info {
  constructor(waypointInfo) {
    this._waypointInfo = waypointInfo;
    this._element = null;
  }

  getTemplate() {
    return createInfoTemplate(this._waypointInfo);
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
