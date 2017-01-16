(function(window){
  function parse(honey) {
    if (!honey || [Number, Boolean, String].indexOf(honey.constructor) > -1) {
      // Primitive types.
      return true;
    }

    if (Array.isArray(honey)) {
      // Array
      return honey.reduce(function(acc, obj) {
        var resultObject = acc[0];
        acc[0] = doParse(obj, resultObject);
        return acc;
      }, [{}]);
    }

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

  /**
   * @typedef primitive
   * @type {string|number|boolean}
   */

  /**
   * @typedef honey
   * @type primitive|Object.<string, honey>
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