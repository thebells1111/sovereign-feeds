export default function encodeLink(str) {
  str = btoa(str);
  return str.replace(/={1,2}$/, '');
}
