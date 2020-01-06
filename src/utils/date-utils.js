const toClockRange = ({ startTime, endTime }) =>
  `${toClockTime(startTime)} - ${toClockTime(endTime)}`;

const toClockTime = date =>
  date ? `${padWithZero(date.getHours())}:${padWithZero(date.getMinutes())}` : '--:--';

const padWithZero = num => (num <= 9 ? `0${num}` : num);

const formatDate = date =>
  `${date.getFullYear()}-${padWithZero(date.getMonth() + 1)}-${padWithZero(date.getDate())}`;

const formatYearAndMonth = date => `${date.getFullYear()}-${padWithZero(date.getMonth() + 1)}`;

const getDaysInMonth = ({ year, month }) => {
  const date = new Date(year, month - 1, 1);
  const days = [];
  while (date.getMonth() === month - 1) {
    days.push(formatDate(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const getDaysCountInMonth = date => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

const removeTime = date => {
  return new Date(date.setHours(0, 0, 0, 0));
};
const timeWithDay = (day, time) =>
  new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds()
  );

export {
  removeTime,
  formatDate,
  formatYearAndMonth,
  toClockTime,
  toClockRange,
  getDaysInMonth,
  getDaysCountInMonth,
  timeWithDay
};
