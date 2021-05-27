import PointModel from '../model/point.js';
import {isOnline} from '../utils/common.js';

const getSyncedWaypoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.waypoint);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store, offersStore, destinationsStore) {
    this._api = api;
    this._store = store;
    this._offersStore = offersStore;
    this._destinationsStore = destinationsStore;
  }

  getWaypoints() {
    if (isOnline()) {
      return this._api.getWaypoints()
        .then((waypoints) => {
          const items = createStoreStructure(waypoints.map(PointModel.adaptToServer));
          this._store.setItems(items);
          return waypoints;
        });
    }

    const storeWaypoints = Object.values(this._store.getItems());

    return Promise.resolve(storeWaypoints.map(PointModel.adaptToClient));
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations().then((destinations) => {
        this._destinationsStore.setItems(destinations);
        return destinations;
      });
    }

    return Promise.resolve(this._destinationsStore.getItems());
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers().then((offers) => {
        this._offersStore.setItems(offers);
        return offers;
      });
    }

    return Promise.resolve(this._offersStore.getItems());
  }

  updateWaypoint(waypoint) {
    if (isOnline()) {
      return this._api.updateWaypoint(waypoint)
        .then((updatedWaypoint) => {
          this._store.setItem(updatedWaypoint.id, PointModel.adaptToServer(updatedWaypoint));
          return updatedWaypoint;
        });
    }

    this._store.setItem(waypoint.id, PointModel.adaptToServer(Object.assign({}, waypoint)));

    return Promise.resolve(waypoint);
  }

  addWaypoint(waypoint) {
    if (isOnline()) {
      return this._api.addWaypoint(waypoint)
        .then((newWaypoint) => {
          this._store.setItem(newWaypoint.id, PointModel.adaptToServer(newWaypoint));
          return newWaypoint;
        });
    }

    return Promise.reject(new Error('Add waypoint failed'));
  }

  deleteWaypoint(waypoint) {
    if (isOnline()) {
      return this._api.deleteWaypoint(waypoint)
        .then(() => this._store.removeItem(waypoint.id));
    }

    return Promise.reject(new Error('Delete waypoint failed'));
  }

  sync() {
    if (isOnline()) {
      const storeWaypoints = Object.values(this._store.getItems());

      return this._api.sync(storeWaypoints)
        .then((response) => {
          const createdWaypoints = getSyncedWaypoints(response.created);
          const updatedWaypoints = getSyncedWaypoints(response.updated);

          const items = createStoreStructure([...createdWaypoints, ...updatedWaypoints]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
