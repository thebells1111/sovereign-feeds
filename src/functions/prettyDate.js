export default function prettyDate(date) {
  const months = [
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

  let d = new Date(date * 1000);
  const year = d.getFullYear();
  const day = d.getDate();
  const monthName = months[d.getMonth()];
  return `${monthName} ${day < 10 ? `0${day}` : day}, ${year}`;
}
