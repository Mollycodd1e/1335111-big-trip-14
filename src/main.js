//import FilterView from './view/filter.js';
import MenuView from './view/menu.js';
import {generateWaypoint} from './mock/waypoint.js';
import Api from './api.js';
//import {generateFilter} from './mock/filter.js';
//import {render, renderPosition} from './utils/render.js';
import StatisticsView from './view/statistics.js';
import {DESTINATION_POINTS_MOCKS, MenuItem, UpdateType} from './const.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointModel from './model/point.js';
import FilterModel from './model/filter.js';
import {render, renderPosition, remove} from './utils/render.js';

const waypoints = new Array(DESTINATION_POINTS_MOCKS).fill().map(generateWaypoint);
const AUTHORIZATION = 'Basic y012VANYA890';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const api = new Api(END_POINT, AUTHORIZATION);
//const filter = generateFilter(waypoints);

const waypointsModel = new PointModel();
waypointsModel.setWaypoints(/*waypoints*/);

const filterModel = new FilterModel();

const headerElement = document.querySelector('.page-header');
const tripElement = headerElement.querySelector('.trip-main');
const navigationElement = tripElement.querySelector('.trip-controls__navigation');
const mainElement = document.querySelector('.page-main');
const statisticsElement = mainElement.querySelector('.page-body__container');
const filterElement = tripElement.querySelector('.trip-controls__filters');

//render(filterElement, new FilterView(filter, 'everything'), renderPosition.BEFOREEND);
const menuComponent = new MenuView();

render(navigationElement, menuComponent, renderPosition.BEFOREEND);

let statisticsComponent = null;

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(waypointsModel.getWaypoints());
      render(statisticsElement, statisticsComponent, renderPosition.BEFOREEND);
      break;
  }
};

menuComponent.setMenuClickHandler(handleMenuClick);

const tripPresenter = new TripPresenter(waypointsModel, filterModel);
const filterPresenter = new FilterPresenter(filterElement, filterModel, waypointsModel);

tripPresenter.init(/*waypoints*/);
filterPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createWaypoint();
});

api.getWaypoints().then((waypoints) => {
  waypointsModel.setWaypoints(UpdateType.INIT, waypoints);
}).catch(() => {
  waypointsModel.setWaypoints(UpdateType.INIT, []);
})
