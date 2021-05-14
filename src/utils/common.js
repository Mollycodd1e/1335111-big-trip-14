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

//export const updateItem = (items, update) => {
//  const index = items.findIndex((item) => item.id === update.id);
//
//  if (index === -1) {
//    return items;
//  }
//
//  return [
//    ...items.slice(0, index),
//    update,
//    ...items.slice(index + 1),
//  ];
//};

export const sortWaypointTime = (waypointA, waypointB) => {
  return dayjs(waypointB.upperTime).diff(dayjs(waypointA.upperTime)) - dayjs(waypointB.lowerTime).diff(dayjs(waypointA.lowerTime));
};

export const sortWaypointPrice = (priceA, priceB) => {
  return priceB.price - priceA.price;
};

export const arrayOfFilterType = (waypoints, type) => {
  return type.map((element) => waypoints.filter((waypoint) => waypoint.waypointType.toLowerCase() === element));
};
