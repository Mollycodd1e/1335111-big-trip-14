import FilterView from './view/filter.js';
import {generateWaypoint} from './mock/waipoint.js';
import {generateFilter} from './mock/filter.js';
import {render, renderPosition} from './utils/render.js';
import {DESTINATION_POINTS_MOCKS} from './const.js';
import TripPresenter from './presenter/trip.js';

const waypoints = new Array(DESTINATION_POINTS_MOCKS).fill().map(generateWaypoint);
const filter = generateFilter(waypoints);

const headerElement = document.querySelector('.page-header');
const tripElement = headerElement.querySelector('.trip-main');
const filterElement = tripElement.querySelector('.trip-controls__filters');

render(filterElement, new FilterView(filter), renderPosition.BEFOREEND);

const tripPresenter = new TripPresenter();
tripPresenter.init(waypoints);
