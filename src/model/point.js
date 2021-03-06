import Observer from '../utils/observer.js';

export default class Point extends Observer {
  constructor() {
    super();
    this._waypoints = [];
  }

  set(updateType, waypoints) {
    if (waypoints !== undefined) {
      this._waypoints = waypoints.slice();
    }

    this._notify(updateType);
  }

  get() {
    return this._waypoints;
  }

  update(updateType, update) {
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

  add(updateType, update) {
    this._waypoints = [
      update,
      ...this._waypoints,
    ];

    this._notify(updateType, update);
  }

  delete(updateType, update) {
    const index = this._waypoints.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting waypoint');
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
        lowerTime: point.date_from,
        upperTime: point.date_to,
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
        'base_price': Number(point.price),
        'date_from': point.lowerTime,
        'date_to': point.upperTime,
        'destination':
        {
          'description': point.description,
          'name': point.town,
          'pictures': point.picture,
        },
        'id': point.id,
        'is_favorite': point.isFavorite ? point.isFavorite : false,
        'type': point.waypointType,
        'offers': point.offer,
      },
    );

    delete adaptedWaypoint.price;
    delete adaptedWaypoint.isFavorite;
    delete adaptedWaypoint.lowerTime;
    delete adaptedWaypoint.upperTime;
    delete adaptedWaypoint.description;
    delete adaptedWaypoint.town;
    delete adaptedWaypoint.waypointType;
    delete adaptedWaypoint.offer;
    delete adaptedWaypoint.picture;

    return adaptedWaypoint;
  }
}
