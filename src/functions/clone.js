export default function clone(objectpassed) {
  if (objectpassed === null || typeof objectpassed !== 'object') {
    return objectpassed;
  }
  // give temporary-storage the original obj's constructor
  var temp = objectpassed.constructor();
  for (var key in objectpassed) {
    temp[key] = clone(objectpassed[key]);
  }
  return temp;
}
