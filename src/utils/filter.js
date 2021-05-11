import {FilterType} from '../const.js';

export const filter = {
  //[FilterType.EVERYTHING]: (waypoints) => waypoints.filter(waypoints),
  //[FilterType.PAST]: (waypoints) => waypoints.filter(() => isPast(waypoints.data)),
  //[FilterType.FUTURE]: (waypoints) => waypoints.filter(() => isFuture(waypoints.data)),

  [FilterType.EVERYTHING]: (waypoints) => waypoints.slice(),
  [FilterType.FUTURE]: (waypoints) => waypoints.filter(({lowerTime}) => new Date(lowerTime) >= new Date()),
  [FilterType.PAST]: (waypoints) => waypoints.filter(({upperTime}) => new Date(upperTime) < new Date()),
};
