import Observer from '../utils/observer.js';

export default class Offer extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  setOffers(offers) {
    this._offers = offers;
  }

  getOffers() {
    return this._offers;
  }

  static adaptToClient(offer) {
    const adaptedOffer = Object.assign(
      {},
      offer,
      {
        type: offer.type,
        offers: offer.offers,
      }
    );

    return adaptedOffer;
  }

  static adaptToServer(offer) {
    const adaptedOffer = Object.assign(
      {},
      offer,
      {
        type: offer.type,
        offers: offer.offers,
      }
    );

    return adaptedOffer;
  }
}
