export default function convertTime(time) {
  try {
    let formatTime = new Date(time * 1000).toISOString().substr(11, 8);
    if (formatTime.charAt(0) === '0') {
      return formatTime.substring(1);
    }

    return formatTime;
  } catch {
    (err) => console.log(err);
  }
}
