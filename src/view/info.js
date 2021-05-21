import dayjs from 'dayjs';
import AbstractView from '../view/abstract.js';

const createInfoTemplate = (waypoint) => {

  const sortByTown = () => {
    const townList = [];

    for (let i = 0; i < waypoint.length; i++ ) {
      townList.push(waypoint[i].town);
    }

    if (townList.length < 3) {
      return townList.map((town) => `${town}`).join(' - ');
    } else {
      return townList[0] + ' - ... - ' + townList[townList.length - 1];
    }
  };

  const listOfTowns = sortByTown();

  const sortByDate = (waypoint) => {
    const result = [];

    for (let i = 0; i < waypoint.length; i++ ) {
      result.push(waypoint[i].lowerTime);
    }

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

  const totalOfPrice = () => {
    let amount = 0;

    for (let i = 0; i < waypoint.length; i ++) {
      const price = Number(waypoint[i].price);

      for (let j = 0; j < waypoint[i].offer.length; j++) {
        amount += waypoint[i].offer[j].price;
      }

      amount += price;
    }

    return amount;
  };

  const totalPrice = totalOfPrice();

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
