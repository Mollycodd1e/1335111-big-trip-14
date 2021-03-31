import {createSiteMenuTemplate} from './view/site-menu.js';

const render = function(container, template, place) {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.trip-main');
const siteMenuElement = siteMainElement.querySelector('.trip-controls__navigation');

render(siteMenuElement, createSiteMenuTemplate(), 'beforeend');
