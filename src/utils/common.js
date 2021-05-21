import dayjs from 'dayjs';

export const generateNumber = (a = 0, b = 3) => {
  const lower = Math.ceil(a);
  const upper = Math.floor(b);

  return Math.floor(Math.random() * (upper - lower  + 1)) + lower;
};

export const filterByTitle = (array, title) => {
  return array.filter((item) => {
    return (item.title === title);
  });
};

export const sortWaypointTime = (waypointA, waypointB) => {
  return dayjs(waypointB.upperTime).diff(dayjs(waypointA.upperTime)) - dayjs(waypointB.lowerTime).diff(dayjs(waypointA.lowerTime));
};

export const sortWaypointPrice = (priceA, priceB) => {
  return priceB.price - priceA.price;
};

export const filterOfType = (waypoints, type) => {
  return type.map((element) => waypoints.filter((waypoint) => waypoint.waypointType.toLowerCase() === element));
};

export const newEventButtonDisableOff = () => {
  document.querySelector('.trip-main__event-add-btn').disabled = '';
};

export const newEventButtonDisableOn = () => {
  document.querySelector('.trip-main__event-add-btn').disabled = 'disabled';
};

export const convertMinutes = (num) => {
  const hours = Math.floor(num / 60);
  const days = Math.floor(hours / 24);
  const rhours = hours - days * 24;
  const minutes = Math.floor(num % 60);

  const dateObj = {
    D: days < 10 ? '0' + days : days,
    H: rhours < 10 ? '0' + rhours : rhours,
    M: minutes < 10 ? '0' + minutes : minutes,
  };

  if (num === 0) {
    return num;
  }

  return Object.keys(dateObj).map((item) =>
    dateObj[item] > 0 ? dateObj[item] + item : ' ').join(' ').trim();
};
