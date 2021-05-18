import AbstractView from '../view/abstract.js';

const createOfferTemplate = (offer) => {
  if (offer.isChecked === false) {
    return;
  }

  return `<li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
          </li>`;
};

export default class Offer extends AbstractView {
  constructor(offer) {
    super();
    this._offer = offer;
  }

  getTemplate() {
    return createOfferTemplate(this._offer);
  }
}
