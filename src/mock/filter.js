import dayjs from 'dayjs';

const isPast = (data) => {
  return data = dayjs().isAfter(data, 'D');
};

const isFuture = (data) => {
  return data = dayjs().isBefore(data, 'D');
};

const waypointsMap = {
  everything: (waypoints) => waypoints.filter(waypoints).length,
  past: (waypoints) => waypoints.filter(() => isPast(waypoints.data)).length,
  future: (waypoints) => waypoints.filter(() => isFuture(waypoints.data)).length,
};

export const generateFilter = () => {
  return Object.entries(waypointsMap).map(([filterName]) => {
    return {
      name: filterName,
    };
  });
};
