(function(exports){
  function generate(json) {
    if (!json || [Number, Boolean, String].indexOf(json.constructor) > -1) {
      // Primitive types.
      return true;
    }
    
    if (Array.isArray(json)) {
      // Array
      return json.reduce(function(acc, obj) {
        var resultObject = acc[0];
        acc[0] = dogenerate(obj, resultObject);
        return acc;
      }, [{}]);
    }

    return dogenerate(json, {});
  }

  function dogenerate(data, acc) {
    return Object.keys(data).reduce(function(result, key) {
      var val = data[key];
      result[key] = generate(val);
      return result;
    }, acc);
  }

  exports.generate = generate;

})(typeof exports === 'undefined'? this['Honeycomb']={}: exports);