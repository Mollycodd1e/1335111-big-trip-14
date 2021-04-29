import {DESTINATION_POINTS_MOCKS} from '../const.js';
import EditView from '../view/edit.js';
import ListView from '../view/list.js';
import OfferView from '../view/offer.js';
import WaypointView from '../view/waypoint.js';
import NoWaypointView from '../view/nowaypoint.js';
import {render, renderPosition, replace, remove} from '../utils/render.js';

export default class Point {
  constructor(waypointContainer, changeData) {
    this._waypointContainer = waypointContainer;
    this._changeData = changeData;

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._noWaypointComponent = new NoWaypointView();
    this._listComponent = new ListView();
    this._waypointComponent = null;
    this._editComponent = null;
  }

  init(waypoint) {
    this._waypoint = waypoint;

    const prevWaypointComponent = this._waypointComponent;
    const prevEditComponent = this._editComponent;

    if (prevWaypointComponent === null || prevEditComponent === null) {
      this._renderPoint(waypoint);
      return;
    }

    if (this._waypointContainer.getElement().contains(prevWaypointComponent.getElement())) {
      replace(this._waypointComponent, prevWaypointComponent);
    }

    if (this._waypointContainer.getElement().contains(prevEditComponent.getElement())) {
      replace(this._editComponent, prevEditComponent);
    }

    this._waypointComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    remove(prevWaypointComponent);
    remove(prevEditComponent);
  }

  destroy() {
    remove(this._waypointComponent);
    remove(this._editComponent);
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._waypoint,
        {
          isFavorite: !this._waypoint.isFavorite,
        },
      ),
    );
  }

  _renderList() {
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    render(eventElement, this._listComponent, renderPosition.BEFOREEND);
  }

  _renderWaypoint(element, waypoint) {
    const waypointComponent = new WaypointView(waypoint);
    const editComponent = new EditView(waypoint);

    const replaceWaypointToForm = () => {
      replace(editComponent,waypointComponent);
    };

    const replaceFormToWaypoint = () => {
      replace(waypointComponent,editComponent);
    };

    const onEscKeyPress = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToWaypoint();
        document.removeEventListener('keydown', onEscKeyPress);
      }
    };

    waypointComponent.setFavoriteClickHandler(() => {

    });

    waypointComponent.setWaypointClickHandler(() => {
      replaceWaypointToForm();
      document.addEventListener('keydown', onEscKeyPress);
    });

    editComponent.setEditSubmitHandler(() => {
      replaceFormToWaypoint();
      document.removeEventListener('keydown', onEscKeyPress);
    });

    editComponent.setEditClickHandler(() => {
      replaceFormToWaypoint();
      document.removeEventListener('keydown', onEscKeyPress);
    });

    render(element, waypointComponent, renderPosition.BEFOREEND);
  }

  _renderWaypoints(waypoints) {
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    const listElement = eventElement.querySelector('.trip-events__list');
    if (DESTINATION_POINTS_MOCKS > 0) {
      for (let i = 0; i < DESTINATION_POINTS_MOCKS; i ++) {
        this._renderWaypoint(listElement, waypoints[i]);
      }
    }
  }

  _renderNoWaypoint() {
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    render(eventElement, this._noWaypointComponent, renderPosition.BEFOREEND);
  }

  _renderOffer(waypoint) {
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    const offerList = eventElement.querySelectorAll('.event__selected-offers');
    this._offerComponent = new OfferView();

    for (let i = 0; i < offerList.length; i++) {
      const orderOfferList = offerList[i];
      const orderOffer = waypoint[i].offer;
      orderOffer.forEach((element) => {
        render(orderOfferList, new OfferView(element), renderPosition.BEFOREEND);
      });
    }
  }

  _renderPoint(waypoint) {
    this._renderList();

    if (DESTINATION_POINTS_MOCKS > 0) {
      this._renderWaypoints(waypoint);
    } else {
      this._renderNoWaypoint();
    }

    this._renderOffer(waypoint);
  }
}
