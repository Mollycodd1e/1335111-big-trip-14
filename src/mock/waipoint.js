import dayjs from 'dayjs';

const generateNumber = (a = 0, b = 3) => {
  const lower = Math.ceil(a);
  const upper = Math.floor(b);

  return Math.floor(Math.random() * (upper - lower  + 1)) + lower;
};

const generateDate = () => {
  const maxDaysGap = 5;
  const daysGap = generateNumber(-maxDaysGap, maxDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};

const generateTown = () => {
  const towns = [
    'Amsterdam',
    'Chamonix',
    'Geneva',
  ];

  const randomIndex = generateNumber(0, towns.length -1);

  return towns[randomIndex];
};

const generateWaypointType = () => {
  const waypointType = [
    'Taxi',
    'Bus',
    'Train',
    'Ship',
    'Transport',
    'Drive',
    'Flight',
    'Check-in',
    'Sightseeing',
    'Restaurant',
  ];

  const randomType = generateNumber(0, waypointType.length -1);

  return waypointType[randomType];
};

const generateDescription = () => {
  const description = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ];

  const sentenceCount = generateNumber(1, 5);

  let descriptionText = '';

  for (let i = 0; i < sentenceCount; i++) {
    const randomSentence = generateNumber(0, 10);
    descriptionText += description[randomSentence];
  }

  return descriptionText;
};

const generatePrice = () => {
  const price = generateNumber(1, 100);

  return (price);
};

const generatePicture = () => {
  const randomPicture = generateNumber(0, 10);

  return ('http://picsum.photos/248/152?r=' + randomPicture);
};

const generateLowerTime = () => {
  const timeLower = dayjs();

  return (timeLower);
};

const generateUpperTime = () => {
  const timeGap = generateNumber(1, 5);
  const timeUpper = dayjs().add(timeGap, 'hours');

  return (timeUpper);
};

const generateOffer = () => {
  const offers = [
    {
      title: 'Order Uber',
      price: 20,
    },
    {
      title: 'Add luggage',
      price: 50,
    },
    {
      title: 'Switch to comfort',
      price: 80,
    },
    {
      title: 'Add meal',
      price: 15,
    },
    {
      title: 'Choose seats',
      price: 5,
    },
    {
      title: 'Travel by train',
      price: 40,
    },
  ];

  const offersCount = generateNumber(0, 5);

  const offerArray = [];

  for (let i = 0; i < offersCount; i++) {
    const randomOffer = generateNumber(0, 5);
    offerArray.push(offers[randomOffer]);
  }

  return offerArray;
};

export const generateWaypoint = () => {
  return {
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
