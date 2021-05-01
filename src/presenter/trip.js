import SortView from '../view/sort.js';
import InfoView from '../view/info.js';
import MenuView from '../view/menu.js';
import ListView from '../view/list.js';
import PointPresenter from '../presenter/point.js';
import {updateItem} from '../utils/common.js';
import {render, renderPosition} from '../utils/render.js';

export default class Trip {
  constructor() {
    this._pointPresenter = {};
    this._listComponent = new ListView();
    this._menuComponent = new MenuView();
    this._handleWaypointChange = this._handleWaypointChange.bind(this);
  }

  init(waypoint) {
    this._waypoint = waypoint.slice();

    this._renderTrip(waypoint);
    this._renderWaypoint(waypoint);
  }

  _handleWaypointChange(updatedWaypoint) {
    this._waypoint = updateItem(this._waypoint, updatedWaypoint);
    this._pointPresenter[updatedWaypoint.id].init(updatedWaypoint);
  }

  _renderMenu() {
    const headerElement = document.querySelector('.page-header');
    const tripElement = headerElement.querySelector('.trip-main');
    const navigationElement = tripElement.querySelector('.trip-controls__navigation');
    render(navigationElement, this._menuComponent, renderPosition.BEFOREEND);
  }

  _renderInfo(waypoint) {
    this._infoComponent = new InfoView(waypoint);
    const headerElement = document.querySelector('.page-header');
    const tripElement = headerElement.querySelector('.trip-main');
    render(tripElement, this._infoComponent, renderPosition.AFTERBEGIN);
  }

  _renderSort() {
    this._sortComponent = new SortView();
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    render(eventElement, this._sortComponent, renderPosition.BEFOREEND);
  }

  _renderList() {
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    render(eventElement, this._listComponent, renderPosition.BEFOREEND);
  }

  _renderWaypoint(waypoint) {
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    const pointPresenter = new PointPresenter(eventElement, this._handleWaypointChange);
    pointPresenter.init(this._waypoint);
    this._pointPresenter[waypoint.id] = pointPresenter;
  }

  _renderTrip(waypoint) {
    this._renderInfo(waypoint);
    this._renderMenu();
    this._renderSort();
    this._renderList();
  }
}