import SortView from '../view/sort.js';
import InfoView from '../view/info.js';
import MenuView from '../view/menu.js';
import ListView from '../view/list.js';
import LoadingView from '../view/loading.js';
import OfferView from '../view/offer.js';
import {filter} from '../utils/filter.js';
import NoWaypointView from '../view/no-waypoint.js';
import PointPresenter, {State as PointPresenterViewState} from '../presenter/point.js';
import PointNewPresenter from '../presenter/point-new.js';
import {DESTINATION_POINTS_MOCKS, UserAction, UpdateType, FilterType, TypeOfSort} from '../const.js';
import {sortWaypointPrice, sortWaypointTime, sortWaypointDay} from '../utils/common.js';
import {render, renderPosition, remove} from '../utils/render.js';

export default class Trip {
  constructor(waypointsModel, filterModel, destinationModel, offerModel, api) {
    this._pointPresenter = {};
    this._waypointsModel = waypointsModel;
    this._filterModel = filterModel;
    this._destinationModel = destinationModel;
    this._offerModel = offerModel;
    this._currentSortType = TypeOfSort.DAY;
    this._isLoading = true;
    this._api = api;

    this._sortComponent = null;
    this._noWaypointComponent = new NoWaypointView();
    this._listComponent = new ListView();
    this._offerComponent = new OfferView();
    this._loadingComponent = new LoadingView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._listComponent, this._handleViewAction, this._destinationModel, this._offerModel);
  }

  _getWaypoints() {
    const filterType = this._filterModel.get();
    const waypoints = this._waypointsModel.get();
    const filteredWaypoints = filter[filterType](waypoints);

    switch (this._currentSortType) {
      case TypeOfSort.DAY:
        return filteredWaypoints.sort(sortWaypointDay);
      case TypeOfSort.PRICE:
        return filteredWaypoints.sort(sortWaypointPrice);
      case TypeOfSort.TIME:
        return filteredWaypoints.sort(sortWaypointTime);
    }

    return filteredWaypoints;
  }

  createWaypoint(callback) {
    this._currentSortType = TypeOfSort.DAY;
    this._filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init(callback);
  }

  init() {
    this._waypointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    if (this._infoComponent !== undefined) {
      remove(this._infoComponent);
    }

    this._renderBoard();
  }

  hide() {
    document.querySelector('.trip-events').classList.add('visually-hidden');
  }

  show() {
    document.querySelector('.trip-events').classList.remove('visually-hidden');
  }

  destroy() {
    this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});

    remove(this._listComponent);
    remove(this._sortComponent);

    this._waypointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    Object.values(this._pointPresenter).forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_WAYPOINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updateWaypoint(update).then((response) => {
          this._waypointsModel.update(updateType, response);
        }).catch(() => {
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;
      case UserAction.ADD_WAYPOINT:
        this._pointNewPresenter.setSaving();
        this._api.addWaypoint(update).then((response) => {
          this._waypointsModel.add(updateType, response);
        }).catch(() => {
          this._pointNewPresenter.setAborting();
        });
        break;
      case UserAction.DELETE_WAYPOINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deleteWaypoint(update).then(() => {
          this._waypointsModel.delete(updateType, update);
        }).catch(() => {
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        remove(this._infoComponent);
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedWaypoint: true, resetSortType: true});
        remove(this._infoComponent);
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
    }
  }

  _handleWaypointChange(updatedWaypoint) {
    this._pointPresenter[updatedWaypoint.id].init(updatedWaypoint);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType || sortType === undefined) {
      return;
    }

    remove(this._infoComponent);

    this._currentSortType = sortType;
    this._clearBoard({resetRenderedWaypoint: true});
    this._renderBoard(this._waypointsModel._waypoint);
  }

  _renderLoading() {
    const headerElement = document.querySelector('.page-header');
    const tripElement = headerElement.querySelector('.trip-main');

    render(tripElement, this._loadingComponent, renderPosition.AFTERBEGIN);
  }

  _renderMenu() {
    this._menuComponent = new MenuView();

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
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');

    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setTypeChangeHandler(this._handleSortTypeChange);

    render(eventElement, this._sortComponent, renderPosition.BEFOREEND);
  }

  _clearBoard({resetRenderedWaypoint = false, resetSortType = false} = {}) {
    const waypointCount = this._getWaypoints().length;

    this._pointNewPresenter.destroy();

    Object.values(this._pointPresenter).forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    remove(this._sortComponent);
    remove(this._noWaypointComponent);
    remove(this._loadingComponent);

    resetRenderedWaypoint ? this._renderedWaypoint = DESTINATION_POINTS_MOCKS : this._renderedWaypoint = Math.min(waypointCount, this._renderedWaypoint);

    if (resetSortType) {
      this._currentSortType = TypeOfSort.DAY;
    }
  }

  _renderList() {
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    render(eventElement, this._listComponent, renderPosition.BEFOREEND);
  }

  _renderWaypoint(waypoint) {
    const pointPresenter = new PointPresenter(this._listComponent, this._handleViewAction, this._handleModeChange, this._destinationModel, this._offerModel);
    pointPresenter.init(waypoint);
    this._pointPresenter[waypoint.id] = pointPresenter;
  }

  _renderWaypoints(waypoints) {
    waypoints.forEach((item) => this._renderWaypoint(item));
    this._renderOffer(waypoints);
  }

  _renderOffer(waypoints) {
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    const offerLists = eventElement.querySelectorAll('.event__selected-offers');

    for (const [index,list] of offerLists.entries()) {
      const orderOffer = waypoints[index].offer;

      if (orderOffer !== undefined) {
        orderOffer.forEach((element) => {
          this._offerComponent = new OfferView(element);
          render(list, this._offerComponent, renderPosition.BEFOREEND);
        });
      }
    }
  }

  _renderNoWaypoint() {
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    render(eventElement, this._noWaypointComponent, renderPosition.BEFOREEND);
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const waypoints = this._getWaypoints();

    this._renderInfo(waypoints);
    this._renderSort();

    if (waypoints.length <= 0) {
      this._renderNoWaypoint();
    }

    this._renderList();
    this._renderWaypoints(waypoints);
  }
}
