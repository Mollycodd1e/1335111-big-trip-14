//import FilterView from './view/filter.js';
import {generateWaypoint} from './mock/waypoint.js';
//import {generateFilter} from './mock/filter.js';
//import {render, renderPosition} from './utils/render.js';
import {DESTINATION_POINTS_MOCKS} from './const.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointModel from './model/point.js';
import FilterModel from './model/filter.js';

const waypoints = new Array(DESTINATION_POINTS_MOCKS).fill().map(generateWaypoint);
//const filter = generateFilter(waypoints);

const waypointsModel = new PointModel();
waypointsModel.setWaypoints(waypoints);

const filterModel = new FilterModel();

const headerElement = document.querySelector('.page-header');
const tripElement = headerElement.querySelector('.trip-main');
const filterElement = tripElement.querySelector('.trip-controls__filters');

//render(filterElement, new FilterView(filter, 'everything'), renderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(waypointsModel, filterModel);
const filterPresenter = new FilterPresenter(filterElement, filterModel, waypointsModel);

tripPresenter.init(/*waypoints*/);
filterPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createWaypoint();
});
