import SortView from '../view/sort.js';
import InfoView from '../view/info.js';
import MenuView from '../view/menu.js';
import ListView from '../view/list.js';
import OfferView from '../view/offer.js';
import NoWaypointView from '../view/nowaypoint.js';
import PointPresenter from '../presenter/point.js';
import {DESTINATION_POINTS_MOCKS} from '../const.js';
import {updateItem} from '../utils/common.js';
import {render, renderPosition} from '../utils/render.js';

export default class Trip {
  constructor() {
    this._pointPresenter = {};
    this._noWaypointComponent = new NoWaypointView();
    this._listComponent = new ListView();
    this._menuComponent = new MenuView();
    this._offerComponent = new OfferView();
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleWaypointChange = this._handleWaypointChange.bind(this);
  }

  init(waypoint) {
    this._waypoint = waypoint.slice();

    this._renderTrip(waypoint);
    this._renderWaypoints(waypoint);
    this._renderOffer(waypoint);
  }

  _handleModeChange() {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.resetView());
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
    const pointPresenter = new PointPresenter(this._listComponent, this._handleWaypointChange, this._handleModeChange);
    pointPresenter.init(waypoint);
    this._pointPresenter[waypoint.id] = pointPresenter;
  }

  _renderWaypoints(waypoint) {
    for (let i = 0; i < DESTINATION_POINTS_MOCKS; i ++) {
      this._renderWaypoint(waypoint[i]);
    }
  }

  _renderOffer(waypoint) {
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    const offerList = eventElement.querySelectorAll('.event__selected-offers');

    for (let i = 0; i < offerList.length; i++) {
      const orderOfferList = offerList[i];
      const orderOffer = waypoint[i].offer;
      orderOffer.forEach((element) => {
        this._offerComponent = new OfferView(element);
        render(orderOfferList, this._offerComponent, renderPosition.BEFOREEND);
      });
    }
  }

  _renderNoWaypoint() {
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    render(eventElement, this._noWaypointComponent, renderPosition.BEFOREEND);
  }

  _renderTrip(waypoint) {
    this._renderInfo(waypoint);
    this._renderMenu();
    this._renderSort();

    if (DESTINATION_POINTS_MOCKS < 1) {
      this._renderNoWaypoint();
    }

    this._renderList();
  }
}
