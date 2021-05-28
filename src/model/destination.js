import Observer from '../utils/observer.js';

export default class Destination extends Observer {
  constructor() {
    super();
    this._destinations = [];
  }

  set(destinations) {
    this._destinations = destinations;
  }

  get() {
    return this._destinations;
  }

  static adaptToClient(destination) {
    const adaptedDestination = Object.assign(
      {},
      destination,
      {
        description: destination.description,
        name: destination.name,
        pictures: destination.pictures,
      },
    );

    return adaptedDestination;
  }

  static adaptToServer(destination) {
    const adaptedDestination = Object.assign(
      {},
      destination,
      {
        description: destination.description,
        name: destination.name,
        pictures: [
          {
            src: destination.pictures.src,
            description: destination.pictures.description,
          },
        ],
      },
    );

    return adaptedDestination;
  }
}
