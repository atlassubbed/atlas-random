const { random, min, floor, ceil } = Math;

const int = n => (n < 0 ? ceil : floor)(random()*n)

// this does not preserve array order between inserts
// but guarantees uniformity in the indices
const insert = (arr, el) => {
  const n = arr.length, i = int(n+1);
  if (i === n) arr.push(el);
  else arr.push(arr[i]), arr[i] = el;
  return arr;
}

// this does not also uniformly shuffle, use `shuffle` instead
const sample = (arr, size) => {
  let n = arr.length;
  if (!size) return arr[int(n)];
  size = min(size, n);
  const sample = [];
  for (let i = 0; i < n; i++){
    if (i < size) sample.push(arr[i]);
    else if (random() < size/(i+1))
      sample[int(size)] = arr[i];
  }
  return sample;
}

// fisher-yates algorithm
const shuffle = arr => {
  let n = arr.length, j, e;
  while(n > 1){
    e = arr[j = int(n--)]
    arr[j] = arr[n], arr[n] = e
  }
}

module.exports = { int, insert, sample, shuffle }
