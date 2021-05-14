import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {WAYPOINT_TYPE, TOWNS, DESCRIPTION, OFFERS} from '../const.js';
import {generateNumber, filterByTitle} from '../utils/common.js';

const generateDate = () => {
  const maxDaysGap = 5;
  const daysGap = generateNumber(-maxDaysGap, maxDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};

const generateTown = () => {
  const randomIndex = generateNumber(0, TOWNS.length -1);

  return TOWNS[randomIndex];
};

const generateWaypointType = () => {
  const randomType = generateNumber(0, WAYPOINT_TYPE.length -1);

  return WAYPOINT_TYPE[randomType];
};

const generatePrice = () => {
  const price = generateNumber(1, 100);

  return (price);
};

const generateLowerTime = () => {
  const timeLower = dayjs();

  return (timeLower);
};

const generateUpperTime = () => {
  const hoursGap = generateNumber(1, 5);
  const minutesGap = generateNumber(1, 59);
  const timeUpper = dayjs().add(hoursGap, 'hours').add(minutesGap, 'minutes');

  return (timeUpper);
};

export const generateOffer = () => {
  const offersCount = generateNumber(0, 5);

  const offerArray = [];

  for (let i = 0; i < offersCount; i++) {
    const randomOffer = generateNumber(0, 5);
    const checkArray = filterByTitle(offerArray, OFFERS[randomOffer].title);

    if (checkArray.length < 1) {
      offerArray.push(OFFERS[randomOffer]);
    }
  }

  return offerArray;
};

export const generateDescription = () => {
  const sentenceCount = generateNumber(1, 5);

  let descriptionText = '';

  for (let i = 0; i < sentenceCount; i++) {
    const randomSentence = generateNumber(0, 10);
    descriptionText += DESCRIPTION[randomSentence];
  }

  return descriptionText;
};

export const generatePicture = () => {
  const randomPicture = generateNumber(0, 10);

  return ('http://picsum.photos/248/152?r=' + randomPicture);
};

export const generateWaypoint = () => {
  return {
    id: nanoid(),
    data: generateDate(),
    description: generateDescription(),
    waypointType: generateWaypointType(),
    lowerTime: generateLowerTime(),
    town: generateTown(),
    picture: generatePicture(),
    upperTime: generateUpperTime(),
    price: generatePrice(),
    offer: generateOffer(),
    isFavorite: Boolean(generateNumber(0,1)),
  };
};
