const generateNumber = (a = 0, b = 3) => {
  const lower = Math.ceil(a);
  const upper = Math.floor(b);

  return Math.floor(Math.random() * (upper - lower  + 1)) + lower;
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
    'Sightseeng',
    'Restaurant',
  ];

  const randomType = generateNumber(0, waypointType.length -1);

  return waypointType[randomType];
}

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

  for (var i = 0; i < sentenceCount; i++) {
    const randomSentence = generateNumber(0, 10);
    descriptionText += description[randomSentence];
  }

  return descriptionText;
}

export const generateWaypoint = () => {
  return {
    //data: data,
    description: generateDescription(),
    waypointType: generateWaypointType(),
    town: generateTown(),
    //time: time,
    //price: price,
    //offer: offer
  };
};
