const { describe, it } = require("mocha")
const { expect } = require("chai")
const { int, insert, sample, shuffle } = require("../src/index");

// prefer statistical tests over mocking stuff...
const NUM_ITER = 1e6
const ERROR = 2e3

const ix = (e, i) => i

describe("int", function(){
  it("should always return 0 if bound === 0", function(){
    const results = {};
    for (let i = 0; i < NUM_ITER; i++){
      const result = int(0);
      results[result] = (results[result] || 0)+1
    }
    expect(results[0]).to.equal(NUM_ITER)
  })
  it("should generate uniform integers in [0, bound) if bound > 0", function(){
    const results = {}, bound = 5
    for (let i = 0; i < NUM_ITER; i++){
      const result = int(bound);
      results[result] = (results[result] || 0)+1
    }
    expect(Object.keys(results)).to.have.lengthOf(bound)
    for (let i = 0; i < bound; i++){
      expect(results[i]).to.be.closeTo(NUM_ITER/bound, ERROR)
    }
  })
  it("should generate uniform integers in (bound, 0] if bound < 0", function(){
    const results = {}, bound = -5
    for (let i = 0; i < NUM_ITER; i++){
      const result = -int(bound);
      results[result] = (results[result] || 0)+1
    }
    expect(Object.keys(results)).to.have.lengthOf(-bound)
    for (let i = 0; i < -bound; i++){
      expect(results[i]).to.be.closeTo(NUM_ITER/-bound, ERROR)
    }
  })
})

describe("insert", function(){
  it("should insert an element uniformly across indices when adding it to an existing array", function(){
    const results = {}, el = 5, size = 4
    for (let i = 0; i < NUM_ITER; i++){
      const arr = Array(size).fill().map(ix)
      insert(arr, el);
      const i = arr.indexOf(el);
      results[i] = (results[i] || 0)+1
    }
    expect(Object.keys(results)).to.have.lengthOf(size+1);
    for (let i = 0; i < size; i++){
      expect(results[i]).to.be.closeTo(NUM_ITER/(size+1), ERROR)
    }
  })
  it("should result in a uniformly shuffled array when inserting sequentially into an empty array", function(){
    const results = {}, size = 5;
    for (let i = 0; i < size; i++) results[i] = {};
    for (let i = 0; i < NUM_ITER; i++){
      const arr = [];
      for (let i = 0; i < size; i++) insert(arr, i);
      for (let i = 0; i < size; i++) {
        const result = arr[i]
        results[i][result] = (results[i][result] || 0)+1
      }
    }
    for (let i = 0; i < size; i++){
      for (let j = 0; j < size; j++){
        const result = results[i][j];
        expect(result).to.be.closeTo(NUM_ITER/size, ERROR)
      }
    }
  })
})

describe("sample", function(){
  it("should select a single uniformly random element if no size given", function(){
    const results = {}, arr = [1,2,3,4,5];
    for (let i = 0; i < NUM_ITER; i++){
      const result = sample(arr);
      results[result] = (results[result] || 0)+1
    }
    expect(Object.keys(results)).to.have.lengthOf(arr.length)
    for (let i of arr){
      expect(results[i]).to.be.closeTo(NUM_ITER/arr.length, ERROR)
    }
  })
  it("should wrap a single element in an array if a size of 1 is given", function(){
    const result = sample([1,2,3,4,5], 1);
    expect(result).to.be.an("array");
  })
  it("should select a uniformly random proper subset of the given size", function(){
    const results = {}, arr = [1,2,3,4,5], size = 3
    for (let i = 0; i < NUM_ITER; i++){
      const result = sample(arr, size);
      for (let j of result) results[j] = (results[j] || 0)+1
    }
    expect(Object.keys(results)).to.have.lengthOf(arr.length);
    for (let i of arr){
      expect(results[i]).to.be.closeTo(NUM_ITER*size/arr.length, ERROR)
    }
  })
  it("should select the entire array if the given size === array's size", function(){
    const results = {}, arr = [1,2,3];
    for (let i = 0; i < NUM_ITER; i++){
      const result = sample(arr, arr.length);
      for (let j of result) results[j] = (results[j] || 0)+1
    }
    expect(Object.keys(results)).to.have.lengthOf(arr.length);
    for (let i of arr){
      expect(results[i]).to.equal(NUM_ITER)
    }
  })
  it("should select the entire array if the given size > array's size", function(){
    const results = {}, arr = [1,2,3];
    for (let i = 0; i < NUM_ITER; i++){
      const result = sample(arr, 2*arr.length);
      for (let j of result) results[j] = (results[j] || 0)+1
    }
    expect(Object.keys(results)).to.have.lengthOf(arr.length);
    for (let i of arr){
      expect(results[i]).to.equal(NUM_ITER)
    }
  })
  it("should always return an array in the original order if the sample is the entire array", function(){
    const results = {}, arr = [1,2,3,4,5];
    for (let i = 0; i < arr.length; i++) results[i] = {};
    for (let i = 0; i < NUM_ITER; i++){
      const result = sample(arr, arr.length);
      for (let j = 0; j < arr.length; j++){
        const el = result[j];
        results[j][el] = (results[j][el] || 0)+1
      }
    }
    for (let i = 0; i < arr.length; i++){
      expect(results[i][arr[i]]).to.equal(NUM_ITER)
    }
  })
  // for consistency
  it("should return a new array even if the sample is the entire array", function(){
    const arr = [1,2,3,4,5];
    const result = sample(arr, arr.length);
    expect(result).to.not.equal(arr)
  })
})

describe("shuffle", function(){
  it("should uniformly distribute the elements accross indices", function(){
    const results = {}, ix = (e, i) => i, size = 5
    for (let i = 0; i < size; i++) results[i] = {};
    for (let i = 0; i < NUM_ITER; i++){
      const arr = Array(size).fill().map(ix)
      shuffle(arr);
      for (let j = 0; j < size; j++){
        const el = arr[j];
        results[j][el] = (results[j][el] || 0)+1
      }
    }
    for (let i = 0; i < size; i++){
      for (let j = 0; j < size; j++){
        const result = results[i][j];
        expect(result).to.be.closeTo(NUM_ITER/size, ERROR)
      }
    }
  })
})
