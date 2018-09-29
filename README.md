# atlas-random

A set of math utilities for working with random numbers/arrays.

[![Travis](https://img.shields.io/travis/[username]/[repo].svg)](https://travis-ci.org/[username]/[repo])

---

## install

```
npm install --save atlas-random
```

## why

I need functions which reliably generate uniformly random samples and shuffles of an array.

## examples

### get a random int

```javascript
const { int } = require("atlas-random");

// generates rand int in [0, 100)
const lessThan = 100;
const n = int(lessThan);
console.log(n)
// 38
```

### insert element into random position in array

The element will be inserted, uniformly, into a random index in constant time. If you build up an array from scratch via sequential `insert`s, its elements will be uniformly distributed along the indices. This method does not necessarily preserve the existing order of other elements in the array.

```javascript
const { insert } = require("atlas-random");

const arr = ["oh...", "i'm", "afraid", "the", "deflector", "shield", "will", "be"];
insert(arr, "quite")
console.log(arr);
// ["oh...", "i'm", "afraid", "the", "deflector", "quite", "will", "be", shield"]
```

### get a random sample from an array

This is done quickly in linear time. You will not get duplicates, and the resulting elements in the set will be uniformly chosen at random. Elements will not be favored based on their position. If you pass in a size which is greater or equal to the size of the array, you will get back a new array of all of the elements in their original order. For every other case, the order of elements in the returned array is not necessarily uniform. Use the `shuffle` method if you want to randomly sort an array in-place.

```javascript
const { sample } = require("atlas-random");

const arr = ["quite", "operational", "when", "your", "friends", "arrive..."];

// gives us a single element
const samp = sample(arr);
console.log(samp)
// "friends"

// gives us a subset with 3 elements
const samp = sample(arr, 3);
console.log(samp)
// ["quite", "your", "when"]

const samp = sample(arr, 66)
// ["quite", "operational", "when", "your", "friends", "arrive..."]

```

### shuffling an array

A uniform shuffle is when you sort the elements randomly and uniformly. You can do this two ways with this library.

#### using the `shuffle` method (in-place)

The `shuffle` method uses the Fisher-Yates shuffle algorithm to shuffle your array in-place, meaning your array will be mutated without creating a new array. It is very fast. If you don't want to damage the original array, you could create a copy of your array (e.g. `const copy = [...arr]`), then use the `shuffle` method on the copy.

```
const { shuffle } = require("atlas-random");

const arr = ["help", "me", "obi-wan", "kenobi", "you’re", "my", "only", "hope"];
shuffle(arr);
console.log(arr);
// ['only', 'kenobi', 'my', 'you’re', 'hope', 'me', 'help', 'obi-wan']
```

#### using the `insert` method

Unlike `shuffle`, the insert method can uniformly shuffle an array by inserting all of its elements into a new array. 

```
const { insert } = require("atlas-random");

const arr = ["help", "me", "obi-wan", "kenobi", "you’re", "my", "only", "hope"];
const shuffled = [];
for (let w of arr) insert(shuffled, w);
console.log(shuffled);
// [ 'you’re', 'only', 'hope', 'help', 'kenobi', 'my', 'me', 'obi-wan' ]
```

