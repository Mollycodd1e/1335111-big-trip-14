import {FilterType} from '../const.js';
import dayjs from 'dayjs';

const isPast = (data) => {
  return dayjs().isAfter(data, 'D');
};

const isFuture = (data) => {
  return dayjs().isBefore(data, 'D');
};

export const filter = {
  //[FilterType.EVERYTHING]: (waypoints) => waypoints.filter(waypoints),
  //[FilterType.PAST]: (waypoints) => waypoints.filter(() => isPast(waypoints.data)),
  //[FilterType.FUTURE]: (waypoints) => waypoints.filter(() => isFuture(waypoints.data)),

  [FilterType.EVERYTHING]: (waypoints) => waypoints.slice(),
  [FilterType.FUTURE]: (waypoints) => waypoints.filter(() => isFuture(waypoints.data)),
  [FilterType.PAST]: (waypoints) => waypoints.filter(() => isPast(waypoints.data)),
};
