import MenuView from './view/menu.js';
import Api from './api.js';
import StatisticsView from './view/statistics.js';
import {MenuItem, UpdateType} from './const.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointModel from './model/point.js';
import DestinationModel from './model/destination.js';
import OfferModel from './model/offer.js';
import FilterModel from './model/filter.js';
import {render, renderPosition, remove} from './utils/render.js';
import {newEventButtonDisableOn} from './utils/common.js';

const AUTHORIZATION = 'Basic y012VANYA890';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const api = new Api(END_POINT, AUTHORIZATION);

const waypointsModel = new PointModel();
waypointsModel.setWaypoints();

const destinationModel = new DestinationModel();
destinationModel.setDestinations();

const offerModel = new OfferModel();
offerModel.setOffers();

const filterModel = new FilterModel();

const headerElement = document.querySelector('.page-header');
const tripElement = headerElement.querySelector('.trip-main');
const navigationElement = tripElement.querySelector('.trip-controls__navigation');
const mainElement = document.querySelector('.page-main');
const statisticsElement = mainElement.querySelector('.page-body__container');
const filterElement = tripElement.querySelector('.trip-controls__filters');

const menuComponent = new MenuView();

let statisticsComponent = null;

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.show();
      tripPresenter.destroy();
      tripPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATS:
      tripPresenter.hide();
      remove(statisticsComponent);
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(waypointsModel.getWaypoints());
      render(statisticsElement, statisticsComponent, renderPosition.BEFOREEND);
      break;
  }
};

const tripPresenter = new TripPresenter(waypointsModel, filterModel, destinationModel, offerModel, api);
const filterPresenter = new FilterPresenter(filterElement, filterModel, waypointsModel);

tripPresenter.init();
filterPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  newEventButtonDisableOn();
  tripPresenter.createWaypoint();
});

api.getOffers().then((offer) => {
  offerModel.setOffers(offer);
}).then(() => {
  api.getDestinations().then((destinations) => {
    destinationModel.setDestinations(destinations);
  });
}).then(() => {
  api.getWaypoints().then((waypoints) => {
    waypointsModel.setWaypoints(UpdateType.INIT, waypoints);
    render(navigationElement, menuComponent, renderPosition.BEFOREEND);
    menuComponent.setMenuClickHandler(handleMenuClick);
  });
}).catch(() => {
  waypointsModel.setWaypoints(UpdateType.INIT, []);
  render(navigationElement, menuComponent, renderPosition.BEFOREEND);
  menuComponent.setMenuClickHandler(handleMenuClick);
});

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});
