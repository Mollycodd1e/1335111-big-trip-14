import {DESTINATION_POINTS_MOCKS} from '../const.js';
import EditView from '../view/edit.js';

import OfferView from '../view/offer.js';
import WaypointView from '../view/waypoint.js';
import NoWaypointView from '../view/nowaypoint.js';
import {render, renderPosition, replace, remove} from '../utils/render.js';

export default class Point {
  constructor(waypointContainer, changeData) {
    this._waypointContainer = waypointContainer;
    this._changeData = changeData;

    //this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._noWaypointComponent = new NoWaypointView();
    this._offerComponent = new OfferView();
    this._waypointComponent = null;
    this._editComponent = null;
    //this._handleEditClick = this._handleEditClick.bind(this);
    //this._handleSubmitClick = this._handleSubmitClick.bind(this);
    //this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(waypoint) {
    this._waypoint = waypoint;

    const prevWaypointComponent = this._waypointComponent;
    const prevEditComponent = this._editComponent;

    this._waypointComponent = new WaypointView(waypoint);
    this._editComponent = new EditView(waypoint);

    console.log('do')
    console.log(prevWaypointComponent)
    console.log(prevEditComponent)

    if (prevWaypointComponent === null || prevEditComponent === null) {
      console.log('null create')
      this._renderPoint(waypoint);
      return;
    }

    console.log('posle')
    console.log(prevWaypointComponent)
    console.log(prevEditComponent)

    if (prevWaypointComponent !== null) {
      console.log('zamena way')
      replace(this._waypointComponent, prevWaypointComponent);
      return;
    }

    if (prevEditComponent !== null) {
      console.log('zamena edit')
      replace(this._editComponent, prevEditComponent);
      return;
    }
    //if (this._waypointComponent.getElement().contains(prevWaypointComponent.getElement())) {
    //  console.log('zamena')
    //  replace(this._waypointComponent, prevWaypointComponent);
    //}
//
    //if (this._editComponent.getElement().contains(prevEditComponent.getElement())) {
    //  replace(this._editComponent, prevEditComponent);
    //}

    this._waypointComponent.setFavoriteClickHandler(this._handleFavoriteClick());

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

  //_replaceWaypointToForm() {
  //  replace(this._editComponent,this._waypointComponent);
  //  document.addEventListener('keydown', this._escKeyDownHandler);
  //}
//
  //_replaceFormToWaypoint() {
  //  replace(this._waypointComponent,this._editComponent);
  //  document.removeEventListener('keydown', this._escKeyDownHandler);
  //}
//
  //_escKeyDownHandler(evt) {
  //  if (evt.key === 'Escape' || evt.key === 'Esc') {
  //    evt.preventDefault();
  //    this._replaceFormToWaypoint();
  //  }
  //}
//
  //_handleEditClick() {
  //  this._replaceWaypointToForm();
  //}
//
  //_handleSubmitClick() {
  //  this._replaceFormToWaypoint();
  //}

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
      this._handleFavoriteClick();
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

  _renderWaypoints(waypoint) {
    const mainElement = document.querySelector('.page-body__page-main');
    const eventElement = mainElement.querySelector('.trip-events');
    const listElement = eventElement.querySelector('.trip-events__list');
    if (DESTINATION_POINTS_MOCKS > 0) {
      for (let i = 0; i < DESTINATION_POINTS_MOCKS; i ++) {
        this._renderWaypoint(listElement, waypoint[i]);
      }
    } else {
      this._renderNoWaypoint();
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


    for (let i = 0; i < offerList.length; i++) {
      const orderOfferList = offerList[i];
      const orderOffer = waypoint[i].offer;
      orderOffer.forEach((element) => {
        this._offerComponent = new OfferView(element);
        render(orderOfferList, this._offerComponent, renderPosition.BEFOREEND);
      });
    }
  }

  _renderPoint(waypoint) {

    this._renderWaypoints(waypoint);

    this._renderOffer(waypoint);
  }
}
