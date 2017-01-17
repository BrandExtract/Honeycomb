(function(window){
  function parse(honey) {
    if (Honeycomb.isPrimitive(honey)) {
      return true;
    }

    if (Honeycomb.isArray(honey)) {
      // Merges all possible properties into a single object.
      return honey.reduce(function(acc, obj) {
        var resultObject = acc[0];
        acc[0] = doParse(obj, resultObject);
        return acc;
      }, [{}]);
    }

    // Parses into an object.
    return doParse(honey, {});
  }

  function doParse(data, acc) {
    var self = this;
    return Object.keys(data).reduce(function(result, key) {
      var val = data[key];
      result[key] = parse(val);
      return result;
    }, acc);
  }

  function toTree(obj, callback) {
    if (Honeycomb.isArray(obj)) {
      // The filter for array only has one child.
      return toTree(obj[0], callback);
    }

    var branches = [];

    // For each property of the object, we create a node/branch.
    // An object will become an array of nodes/branches.
    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      var value = obj[key],
          // Checking primitive here is simpler, since there can only
          // be true/false value for each filter.
          isPrimitive = (value === true || value === false);
      
      var branch = {};
      branch.text = key;

      if (!isPrimitive) {
        branch.children = toTree(value, callback);
      }

      branch.state = {
        selected: value === true,
        opened: !isPrimitive
      }

      callback && callback(branch);
      branches.push(branch);
    }

    return branches;
  }

  /**
   * @typedef primitive
   * @type {string|number|boolean}
   */

  /**
   * @typedef honey
   * @type primitive|Object.<string, honey>
   */
  
  /**
   * Callback for constructing each tree node.
   *
   * @callback nodeCallback
   * @param {json} node - A node in the tree.
   */

  /**
   * Creates a new Honeycomb.
   * @constructor
   * @param {honey|honey[]} [honey] - The data to parse.
   */
  function Honeycomb(honey) {
    this.honey = honey;
    this.filter = this.parse(honey);
  }

  /**
   * Parses data into a filter object
   * @param {honey|honey[]} honey - The data to parse.
   * @returns {json} - The filter JSON object.
  */
  Honeycomb.prototype.parse = parse;

  /**
   * Constructs a filter object/array into a tree.
   * 
   * This tree can be used by `jstree`.
   * 
   * @param {json} filter - The filter object.
   * @param {nodeCallback} [callback] - A callback for each node to further process.
   * @returns {json} - The tree object.
  */
  Honeycomb.prototype.toTree = toTree;

  Honeycomb.isArray = Array.isArray;
  Honeycomb.isPrimitive = function(value) {
    return !value || [Number, Boolean, String].indexOf(value.constructor) > -1;
  }

  if (typeof module === "object" && module && typeof module.exports === "object") {
    module.exports = Honeycomb;
  } else {
    window.Honeycomb = Honeycomb;

    // Register as a named AMD module, since Honeycomb can be concatenated with 
    // other files that may use define, but not via a proper concatenation script 
    // that understands anonymous AMD modules. A named AMD is safest and most 
    // robust way to register. Lowercase honeycomb is used because AMD module names
    //  are derived from file names, and Honeycomb is normally delivered in a 
    // lowercase file name. Do this after creating the global so that if an AMD 
    // module wants to call noConflict to hide this version of Honeycomb, it will work.
    if (typeof define === "function" && define.amd) {
        define("honeycomb", [], function () { return Honeycomb; });
    }
  }
})(this);