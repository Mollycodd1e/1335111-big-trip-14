import MenuView from './view/menu.js';
import InfoView from './view/info.js';
import FilterView from './view/filter.js';
import SortView from './view/sort.js';
import EditView from './view/edit.js';
import OfferView from './view/offer.js';
import ListView from './view/list.js';
import WaypointView from './view/waypoint.js';
import NoWaypointView from './view/nowaypoint.js';
import {generateWaypoint} from './mock/waipoint.js';
import {generateFilter} from './mock/filter.js';
import {render, renderPosition} from './utils.js';
import {DESTINATION_POINTS_MOCKS} from './const.js';

const waypoints = new Array(DESTINATION_POINTS_MOCKS).fill().map(generateWaypoint);
const filter = generateFilter(waypoints);

const headerElement = document.querySelector('.page-header');
const tripElement = headerElement.querySelector('.trip-main');
const navigationElement = tripElement.querySelector('.trip-controls__navigation');
const filterElement = tripElement.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.page-body__page-main');
const eventElement = mainElement.querySelector('.trip-events');

render(tripElement, new InfoView(waypoints).getElement(), renderPosition.AFTERBEGIN);
render(navigationElement, new MenuView().getElement(), renderPosition.BEFOREEND);
render(filterElement, new FilterView(filter).getElement(), renderPosition.BEFOREEND);
render(eventElement, new SortView().getElement(), renderPosition.BEFOREEND);
render(eventElement, new ListView().getElement(), renderPosition.BEFOREEND);

const renderWaypoint = (element, waypoint) => {

  const waypointComponent = new WaypointView(waypoint);
  const editComponent = new EditView(waypoint);

  const replaceWaypointToForm = () => {
    element.replaceChild(editComponent.getElement(),waypointComponent.getElement());
  };

  const replaceFormToWaypoint = () => {
    element.replaceChild(waypointComponent.getElement(),editComponent.getElement());
  };

  const onEscKeyPress = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToWaypoint();
      document.removeEventListener('keydown', onEscKeyPress);
    }
  };

  waypointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceWaypointToForm();
    document.addEventListener('keydown', onEscKeyPress);
  });

  editComponent.getElement().addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToWaypoint();
    document.removeEventListener('keydown', onEscKeyPress);
  });

  editComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceFormToWaypoint();
    document.removeEventListener('keydown', onEscKeyPress);
  });

  render(element, waypointComponent.getElement(), renderPosition.BEFOREEND);
};

const listElement = eventElement.querySelector('.trip-events__list');

if (DESTINATION_POINTS_MOCKS > 0) {
  for (let i = 0; i < DESTINATION_POINTS_MOCKS; i ++) {
    renderWaypoint(listElement, waypoints[i]);
  }
} else {
  render(eventElement, new NoWaypointView().getElement(), renderPosition.BEFOREEND);
}

const offerList = eventElement.querySelectorAll('.event__selected-offers');

for (let i = 0; i < offerList.length; i++) {
  const orderOfferList = offerList[i];
  const orderOffer = waypoints[i].offer;
  for (let j = 0; j < orderOffer.length; j++) {
    render(orderOfferList, new OfferView(orderOffer[j]).getElement(), renderPosition.BEFOREEND);
  }
}
