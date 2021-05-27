import dayjs from 'dayjs';
import AbstractView from '../view/abstract.js';

const MAX_NUMBER_OF_CITIES_ON_DISPLAY = 3;

const createInfoTemplate = (waypoint) => {

  const sortByTown = () => {
    const townList = [];

    for (let point of waypoint) {
      townList.push(point);
    }

    townList.sort((a, b) => dayjs(a.lowerTime).isAfter(dayjs(b.lowerTime)) ? 1 : -1);

    if (townList.length <= MAX_NUMBER_OF_CITIES_ON_DISPLAY) {
      return townList.map((item) => `${item.town}`).join(' - ');
    } else {
      return townList[0].town + ' - ... - ' + townList[townList.length - 1].town;
    }
  };

  const listOfTowns = sortByTown();

  const sortByDate = (waypoint) => {
    const result = [];

    waypoint.map((point) => {
      result.push(point.lowerTime)
    })

    result.sort((a, b) => {
      return dayjs(a).isAfter(dayjs(b)) ? 1 : -1;
    });

    return result;
  };

  const listOfDays = sortByDate(waypoint);
  const minDay = dayjs(listOfDays[0]).format('D');
  const maxDay = dayjs(listOfDays[listOfDays.length - 1]).format('D');
  const minMonth = dayjs(listOfDays[0]).format('MMM');
  const maxMonth = dayjs(listOfDays[listOfDays.length - 1]).format('MMM');

  const getTotalOfPrice = () => {
    let amount = 0;

    for (let point of waypoint) {
      const price = Number(point.price);

      for (let item of point.offer) {
        if (item.isChecked === true) {
          amount += item.price;
        }
      }

      amount += price;
    }

    return amount;
  };

  const totalPrice = getTotalOfPrice();

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${listOfTowns}</h1>
              <p class="trip-info__dates">${minMonth} ${minDay}&nbsp;&mdash;&nbsp;${maxMonth} ${maxDay}</p>
            </div>
            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
            </p>
          </section>`;
};

export default class Info extends AbstractView {
  constructor(waypointInfo) {
    super();
    this._waypointInfo = waypointInfo;
  }

  getTemplate() {
    return createInfoTemplate(this._waypointInfo);
  }
}
