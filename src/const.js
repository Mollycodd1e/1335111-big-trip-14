export const WAYPOINT_TYPE = [
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

export const TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'transport',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

export const SHAKE_ANIMATION_TIMEOUT = 600;

export const DESTINATION_POINTS_MOCKS = 3;

export const TOWNS = [
  'Amsterdam',
  'Chamonix',
  'Geneva',
  'Paris',
];

export const DESCRIPTION = [
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

export const OFFERS = [
  {
    name: 'uber',
    title: 'Order Uber',
    price: 20,
  },
  {
    name: 'luggage',
    title: 'Add luggage',
    price: 50,
  },
  {
    name: 'comfort',
    title: 'Switch to comfort',
    price: 80,
  },
  {
    name: 'meal',
    title: 'Add meal',
    price: 15,
  },
  {
    name: 'seats',
    title: 'Choose seats',
    price: 5,
  },
  {
    name: 'train',
    title: 'Travel by train',
    price: 40,
  },
];

export const NAMES_OF_SORTS = [
  'day',
  'event',
  'time',
  'price',
  'offer',
];

export const MenuItem = {
  TABLE: 'Table',
  STATS: 'Stats',
};

export const UserAction = {
  UPDATE_WAYPOINT: 'UPDATE_WAYPOINT',
  ADD_WAYPOINT: 'ADD_WAYPOINT',
  DELETE_WAYPOINT: 'DELETE_WAYPOINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const SORT_TYPE = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

export const FilterType = {
  EVERYTHING: 'everything',
  PAST: 'past',
  FUTURE: 'future',
};

export const StorePrefix = {
  WAYPOINT: 'big-trip-waypoints-localstorage',
  DESTINATION: 'big-trip-destinations-localstorage',
  OFFER: 'big-trip-offers-localstorage',
};
