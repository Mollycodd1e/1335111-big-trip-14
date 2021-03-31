import {createSiteMenuTemplate} from './view/site-menu.js';
import {createSiteInfoTemplate} from './view/site-info.js';
import {createSiteFilterTemplate} from './view/site-filter.js';
import {createSiteSortTemplate} from './view/site-sort.js';
import {createSiteListTemplate} from './view/site-list.js';
import {createSiteEventTemplate} from './view/site-event.js';

const EVENT_COUNT = 3;

const render = function(container, template, place) {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.page-header');
const siteTripElement = siteHeaderElement.querySelector('.trip-main');
const siteNavigationElement = siteTripElement.querySelector('.trip-controls__navigation');
const siteFilterElement = siteTripElement.querySelector('.trip-controls__filters');

render(siteTripElement, createSiteInfoTemplate(), 'afterbegin');
render(siteNavigationElement, createSiteMenuTemplate(), 'beforeend');
render(siteFilterElement, createSiteFilterTemplate(), 'beforeend');

const siteMainElement = document.querySelector('.page-body__page-main');
const siteEventElement = siteMainElement.querySelector('.trip-events');

render(siteEventElement, createSiteSortTemplate(), 'beforeend');
render(siteEventElement, createSiteListTemplate(), 'beforeend');

const siteListElement = siteEventElement.querySelector('.trip-events__list');

for (let i = 0; i < EVENT_COUNT; i ++) {
  render(siteListElement, createSiteEventTemplate(), 'beforeend');
}
