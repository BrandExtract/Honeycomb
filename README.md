# Honeycomb

A set of functions to construct/tweak a filter mask for API response.

## Filter mask

A filter mask is a JSON object which provides the minimal structure of 
another JSON object, typically an API response. It provides all the 
possible keys in an object, and the general structure of all the objects
inside an array.

### Examples

For the following JSON:

```
{
  results: [
    {
      "foo": 1
    },
    {
      "bar": 2,
      "barz": 3
    }
  ],
  "status": 200
}
```

The mask for it would be:

```
{
  results: [
    {
      "foo": true,
      "bar": true,
      "barz": true
    }
  ],
  "status": true
}
```

## Installation

```bash
npm install honeycomb
```

In Node.js:

```
const Honeycomb = require('honeycomb');
```

In browser, add the script tag to `honeycomb.js` and the `Honeycomb` 
object will be available in the `window` object.

## Usage

```javascript
const honeycomb = new Honeycomb();

const api = {
  results: [
    {
      "foo": 1
    },
    {
      "bar": 2,
      "barz": 3
    }
  ],
  "status": 200
};

const mask = honeycomb.parse(api);
console.log(mask); 
// {"results":[{"foo":true,"bar":true,"barz":true}],"status":true}
```

## API

### parse/1

Parses the input into a mask.

### toTree/2

Constructs a tree object from a mask. This tree can be passed into 
libraries such as `jstree`. Besides taking a mask as the first param,
it can also take an optional callback function for each node in tree.