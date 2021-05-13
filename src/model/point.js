import Observer from '../utils/observer.js';

export default class Point extends Observer {
  constructor() {
    super();
    this._waypoints = [];
  }

  setWaypoints(updateType, waypoints) {
    if (waypoints !== undefined) {
      this._waypoints = waypoints.slice();
    }

    this._notify(updateType);
  }

  getWaypoints() {
    return this._waypoints;
  }

  updateWaypoint(updateType, update) {
    const index = this._waypoints.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting waypoint');
    }

    this._waypoints = [
      ...this._waypoints.slice(0, index),
      update,
      ...this._waypoints.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addWaypoint(updateType, update) {
    this._waypoints = [
      update,
      ...this._waypoints,
    ];

    this._notify(updateType, update);
  }

  deleteWaypoint(updateType, update) {
    const index = this._waypoints.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this._waypoints = [
      ...this._waypoints.slice(0, index),
      ...this._waypoints.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedWaypoint = Object.assign(
      {},
      point,
      {
        price: point.base_price,
        isFavorite: point.is_favorite,
        lowerTime: new Date(point.date_from),
        upperTime: new Date(point.date_to),
        description: point.destination.description,
        town: point.destination.name,
        id: point.id,
        waypointType: point.type,
        offer: point.offers,
        picture: point.destination.pictures,
      },
    );

    delete adaptedWaypoint.base_price;
    delete adaptedWaypoint.is_favorite;
    delete adaptedWaypoint.date_from;
    delete adaptedWaypoint.date_to;
    delete adaptedWaypoint.destination;
    delete adaptedWaypoint.type;
    delete adaptedWaypoint.offers;

    return adaptedWaypoint;
  }

  static adaptToServer(point) {
    const adaptedWaypoint = Object.assign(
      {},
      point,
      {
        'base_price': point.price,
        'date_from': point.lowerTime ? point.lowerTime : new Date(),
        'date_to': point.upperTime ? point.upperTime : new Date(),
        'destination.description': point.description,
        'destination.name': point.town,
        'destination.pictures': point.picture,
        'id': point.id,
        'is_favorite': point.isFavorite,
        'type': point.waypointType,
        'offers': point.offer,
      },
    );

    delete adaptedWaypoint.price;
    delete adaptedWaypoint.isFavorite;
    delete adaptedWaypoint.point.lowerTime;
    delete adaptedWaypoint.point.upperTime;
    delete adaptedWaypoint.description;
    delete adaptedWaypoint.town;
    delete adaptedWaypoint.waypointType;
    delete adaptedWaypoint.offer;
    delete adaptedWaypoint.picture;

    return adaptedWaypoint;
  }
}
