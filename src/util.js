export function mapIndex(pointer, mapping) {
  return mapping.indexOf(pointer);
}
export function mapArray(array, mapping) {
  return mapping.map(i => array[i]);
}
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pipe(...funcs) {
  return data =>
    funcs.reduce((val, next) => {
      return next(val);
    }, data);
}

export function mapFileListToArray(fileList) {
  let acc = [];
  for (let i = 0; i < fileList.length; i++) {
    acc.push(fileList.item(i));
  }
  return acc;
}