let months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getDay = (timestamp) => {
  let date = new Date(timestamp);
  return `${date.getDate()} ${months[date.getMonth()]} 
  ${days[date.getDay()]}`;
};

export const Getfullday = (timestamp) => `${days[new Date(timestamp).getDay()]}`;

export default getDay;
