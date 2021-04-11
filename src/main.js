import MenuView from './view/menu.js';
import InfoView from './view/info.js';
import {createFilterTemplate} from './view/filter.js';
import {createSortTemplate} from './view/sort.js';
import {createListTemplate} from './view/list.js';
import {createWaypointTemplate} from './view/waypoint.js';
import {createEditTemplate} from './view/edit.js';
import {generateWaypoint} from './mock/waipoint.js';
import {createOfferTemplate} from './view/offer.js';
import {generateFilter} from './mock/filter.js';
import {renderTemplate, renderElement, renderPosition} from './utils.js';
import {DESTINATION_POINTS_MOCKS} from './const.js';

const waypoints = new Array(DESTINATION_POINTS_MOCKS).fill().map(generateWaypoint);
const filter = generateFilter(waypoints);

const headerElement = document.querySelector('.page-header');
const tripElement = headerElement.querySelector('.trip-main');
const navigationElement = tripElement.querySelector('.trip-controls__navigation');
const filterElement = tripElement.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.page-body__page-main');
const eventElement = mainElement.querySelector('.trip-events');

renderElement(tripElement, new InfoView(waypoints).getElement(), renderPosition.AFTERBEGIN);
renderElement(navigationElement, new MenuView().getElement(), renderPosition.BEFOREEND);
renderTemplate(filterElement, createFilterTemplate(filter), 'beforeend');
renderTemplate(eventElement, createSortTemplate(), 'beforeend');
renderTemplate(eventElement, createListTemplate(), 'beforeend');
renderTemplate(eventElement, createEditTemplate(), 'afterbegin');

const listElement = eventElement.querySelector('.trip-events__list');

for (let i = 0; i < DESTINATION_POINTS_MOCKS; i ++) {
  renderTemplate(listElement, createWaypointTemplate(waypoints[i]), 'beforeend');
}

const offerList = eventElement.querySelectorAll('.event__selected-offers');

for (let i = 0; i < offerList.length; i++) {
  const orderOfferList = offerList[i];
  const orderOffer = waypoints[i].offer;
  for (let j = 0; j < orderOffer.length; j++) {
    renderTemplate(orderOfferList, createOfferTemplate(orderOffer[j]), 'beforeend');
  }
}
