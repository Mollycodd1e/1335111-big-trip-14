import MenuView from './view/menu.js';
import Api from './api/api.js';
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
import {isOnline} from './utils/common.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import {toast} from './utils/toast.js';
import {StorePrefix} from './const.js';

const AUTHORIZATION = 'Basic y012VANYA890';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const STORE_VER = 'v14';
const STORE_NAME = `${StorePrefix.WAYPOINT}-${STORE_VER}`;
const OFFER_STORE_NAME = `${StorePrefix.OFFER}-${STORE_VER}`;
const DESTINATION_STORE_NAME = `${StorePrefix.DESTINATION}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);

const store = new Store(STORE_NAME, window.localStorage);
const offerStore = new Store(OFFER_STORE_NAME, window.localStorage);
const destinationStore = new Store(DESTINATION_STORE_NAME, window.localStorage);

const apiWithProvider = new Provider(api, store, offerStore, destinationStore);

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
  if (!isOnline()) {
    toast('You can\'t create new event offline');
    return;
  }
  evt.preventDefault();
  newEventButtonDisableOn();
  tripPresenter.createWaypoint();
});

apiWithProvider.getDestinations().then((destination) => {
  destinationModel.setDestinations(destination);
}).then(() => {
  apiWithProvider.getOffers().then((offer) => {
    offerModel.setOffers(offer);
  });
}).then(() => {
  apiWithProvider.getWaypoints().then((waypoints) => {
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

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
  toast('You are offline');
});
