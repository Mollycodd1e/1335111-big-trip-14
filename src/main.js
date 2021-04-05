import {createMenuTemplate} from './view/menu.js';
import {createInfoTemplate} from './view/info.js';
import {createFilterTemplate} from './view/filter.js';
import {createSortTemplate} from './view/sort.js';
import {createListTemplate} from './view/list.js';
import {createWaypointTemplate} from './view/waypoint.js';
import {createEditTemplate} from './view/edit.js';
import {generateWaypoint} from './mock/waipoint.js';

//const DESTINATION_POINTS = 3;

const DESTINATION_POINTS_MOCKS = 15;

const waypoints = new Array(DESTINATION_POINTS_MOCKS).fill().map(generateWaypoint);

export const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector('.page-header');
const tripElement = headerElement.querySelector('.trip-main');
const navigationElement = tripElement.querySelector('.trip-controls__navigation');
const filterElement = tripElement.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.page-body__page-main');
const eventElement = mainElement.querySelector('.trip-events');

render(tripElement, createInfoTemplate(), 'afterbegin');
render(navigationElement, createMenuTemplate(), 'beforeend');
render(filterElement, createFilterTemplate(), 'beforeend');
render(eventElement, createSortTemplate(), 'beforeend');
render(eventElement, createListTemplate(), 'beforeend');
render(eventElement, createEditTemplate(), 'afterbegin');

const listElement = eventElement.querySelector('.trip-events__list');

for (let i = 0; i < DESTINATION_POINTS_MOCKS; i ++) {
  render(listElement, createWaypointTemplate(waypoints[i]), 'beforeend');
}

//const offerList = document.querySelector('.event__selected-offers');
//
//const createOfferElement = (x) => {
//  return `<li class="event__offer">
//          <span class="event__offer-title">${x.title}</span>
//          &plus;&euro;&nbsp;
//          <span class="event__offer-price">${x.price}</span>
//          </li>`
//}
//
//for (let i = 0; i < offer.length - 1; i++) {
//  render(offerList, createOfferElement(offer[i]), 'beforeend');
//};
