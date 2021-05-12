import SortView from '../view/sort.js';
import InfoView from '../view/info.js';
import MenuView from '../view/menu.js';
import ListView from '../view/list.js';
import OfferView from '../view/offer.js';
import {filter} from '../utils/filter.js';
import NoWaypointView from '../view/nowaypoint.js';
import PointPresenter from '../presenter/point.js';
import PointNewPresenter from '../presenter/point-new.js';
import {DESTINATION_POINTS_MOCKS, SORT_TYPE, UserAction, UpdateType, FilterType} from '../const.js';
import {/*updateItem,*/ sortWaypointPrice, sortWaypointTime} from '../utils/common.js';
import {render, renderPosition, remove} from '../utils/render.js';

export default class Trip {
  constructor(waypointsModel, filterModel) {
    this._pointPresenter = {};
    this._waypointsModel = waypointsModel;
    this._filterModel = filterModel;
    this._currentSortType = SORT_TYPE.DAY;

    this._sortComponent = null;
    this._noWaypointComponent = new NoWaypointView();
    this._listComponent = new ListView();
    //this._menuComponent = new MenuView();
    this._offerComponent = new OfferView();
    //this._sortComponent = new SortView();

    this._handleModeChange = this._handleModeChange.bind(this);
    //this._handleWaypointChange = this._handleWaypointChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._waypointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter(this._listComponent, this._handleViewAction);
  }

  init() {
    //this._waypoint = waypoint.slice();
    //this._sourceWaypoint = waypoint.slice();
    //console.log(this._waypointsModel._waypoint)
    this._renderTrip(/*this._waypointsModel._waypoint*/);
  }

  createWaypoint(callback) {
    this._currentSorttype = SORT_TYPE.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init(callback);
  }

  _getWaypoints() {
    const filterType = this._filterModel.getFilter();
    const waypoints = this._waypointsModel.getWaypoints();
    const filteredWaypoints = filter[filterType](waypoints);

    switch (this._currentSortType) {
      case SORT_TYPE.PRICE:
        //return this._waypointsModel.getWaypoints().slice().sort(sortWaypointPrice);
        return filteredWaypoints.sort(sortWaypointPrice);
      case SORT_TYPE.TIME:
        //return this._waypointsModel.getWaypoints().slice().sort(sortWaypointTime);
        return filteredWaypoints.sort(sortWaypointTime);
    }

    //return this._waypointsModel.getWaypoints();
    //return this._waypointsModel._waypoint;
    return filteredWaypoints;
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    Object.values(this._pointPresenter).forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_WAYPOINT:
        this._waypointsModel.updateWaypoint(updateType, update);
        break;
      case UserAction.ADD_WAYPOINT:
        this._waypointsModel.addWaypoint(updateType, update);
        break;
      case UserAction.DELETE_WAYPOINT:
        this._waypointsModel.deleteWaypoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetRenderedWaypoint: true, resetSortType: true});
        this._renderTrip();
        break;
    }
  }

  _handleWaypointChange(updatedWaypoint) {
    //this._waypoint = updateItem(this._waypoint, updatedWaypoint);
    //this._sourceWaypoint = updateItem(this._sourceWaypoint, updatedWaypoint);
    this._pointPresenter[updatedWaypoint.id].init(updatedWaypoint);
  }

  //_sortWaypoint(sortType) {
  //  switch(sortType) {
  //    case SORT_TYPE.PRICE:
  //      this._waypoint.sort(sortWaypointPrice);
  //      break;
  //    case SORT_TYPE.TIME:
  //      this._waypoint.sort(sortWaypointTime);
  //      break;
  //    default:
  //      this._waypoint = this._sourceWaypoint.slice();
  //  }

  //  this._currentSortType = sortType;
  //}

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    //this._sortWaypoint(sortType);
    this._currentSortType = sortType;
    //this._clearWaypoint();
    //this._renderWaypoints(this._waypointsModel._waypoint);
    this._clearTrip({resetRenderedWaypoint: true});
    this._renderTrip(this._waypointsModel._waypoint);
  }

  _renderMenu() {
    this._menuComponent = new MenuView();

    const headerElement = document.querySelector('.page-header');
    const tripElement = headerElement.querySelector('.trip-main');
    const navigationElement = tripElement.querySelector('.trip-controls__navigation');

    render(navigationElement, this._menuComponent, renderPosition.BEFOREEND);
  }

  destroy() {
    this._clearTrip({resetRenderedTaskCount: true, resetSortType: true});

    remove(this._listComponent);
    remove(this._sortComponent);

    this._waypointModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _renderInfo(waypoint) {
    this._infoComponent = new InfoView(waypoint);
    const headerElement = document.querySelector('.page-header');
    const tripElement = headerElement.querySelector('.trip-main');
    render(tripElement, this._infoComponent, renderPosition.AFTERBEGIN);
  }

  _renderSort() {
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');

    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(eventElement, this._sortComponent, renderPosition.BEFOREEND);
  }

  _clearTrip({resetRenderedWaypoint = false, resetSortType = false} = {}) {
    const waypointCount = this._getWaypoints().length;

    this._pointNewPresenter.destroy();

    Object.values(this._pointPresenter).forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    remove(this._infoComponent);
    remove(this._menuComponent);
    remove(this._sortComponent);
    remove(this._noWaypointComponent);

    if (resetRenderedWaypoint) {
      this._renderedWaypoint = DESTINATION_POINTS_MOCKS;
    } else {
      this._renderedWaypoint = Math.min(waypointCount, this._renderedWaypoint);
    }

    if (resetSortType) {
      this._currentSortType = SORT_TYPE.DAY;
    }
  }

  _renderList() {
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    render(eventElement, this._listComponent, renderPosition.BEFOREEND);
  }

  //_clearWaypoint() {
  //  Object.values(this._pointPresenter).forEach((item) => item.destroy());
  //  this._pointPresenter = {};
  //}

  _renderWaypoint(waypoint) {
    //const pointPresenter = new PointPresenter(this._listComponent, this._handleWaypointChange, this._handleModeChange);
    const pointPresenter = new PointPresenter(this._listComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(waypoint);
    //this._renderOffer(waypoint);
    this._pointPresenter[waypoint.id] = pointPresenter;
  }

  _renderWaypoints(waypoints) {
    //waypoints.slice().forEach((item) => this._renderWaypoint(item));
    waypoints.forEach((item) => this._renderWaypoint(item));
    this._renderOffer(waypoints);
  }

  _renderOffer(waypoints) {
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    const offerList = eventElement.querySelectorAll('.event__selected-offers');

    for (let i = 0; i < offerList.length; i++) {
      const orderOfferList = offerList[i];
      const orderOffer = waypoints[i].offer;

      if (orderOffer !== undefined) {
        orderOffer.forEach((element) => {
          this._offerComponent = new OfferView(element);
          render(orderOfferList, this._offerComponent, renderPosition.BEFOREEND);
        });
      }
    }
  }

  _renderNoWaypoint() {
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    render(eventElement, this._noWaypointComponent, renderPosition.BEFOREEND);
  }

  _renderTrip() {
    const waypoints = this._getWaypoints();

    this._renderInfo(waypoints);
    this._renderMenu();
    this._renderSort();

    if (DESTINATION_POINTS_MOCKS < 1) {
      this._renderNoWaypoint();
    }

    this._renderList();
    this._renderWaypoints(waypoints);
  }
}
