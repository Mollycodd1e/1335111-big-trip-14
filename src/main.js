import {createMenuTemplate} from './view/menu.js';
import {createInfoTemplate} from './view/info.js';
import {createFilterTemplate} from './view/filter.js';
import {createSortTemplate} from './view/sort.js';
import {createListTemplate} from './view/list.js';
import {createEventTemplate} from './view/event.js';
import {createEditTemplate} from './view/edit.js';

const DESTINATION_POINTS = 3;

const render = (container, template, place) => {
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

for (let i = 0; i < DESTINATION_POINTS; i ++) {
  render(listElement, createEventTemplate(), 'beforeend');
}
