var assert = require('assert');
var Honeycomb = require('../honeycomb'), generate = Honeycomb.generate;
var fixture = require('./fixture/organizer_list_events.json');
var generated_fixture = require('./fixture/organizer_list_events.generated.json');

describe('Honeycomb', function() {
  describe('#generate()', function() {
    it('should return true for primitives', function() {
      assert.equal(true, generate(true));
      assert.equal(true, generate(false));
      assert.equal(true, generate(""));
      assert.equal(true, generate("foo"));
      assert.equal(true, generate(0));
      assert.equal(true, generate(1));
      assert.equal(true, generate(100));
      assert.equal(true, generate(null));
      assert.equal(true, generate(undefined));
    });

    it('should return the key with value `true` for simple object', function() {
      assert.deepEqual({"foo": true}, generate({"foo": "bar"}));
      assert.deepEqual({"foo": true, "bar": true}, generate({"foo": "bar", "bar": "barz"}));
    });

    it('should return an array of single generate for an array of simple objects', function() {
      var data = [{
        "foo": "1",
        "bar": "2"
      }, {
        "foo": "3",
        "bar": "4"
      }];

      var expected = [{
        "foo": true,
        "bar": true
      }];
      
      assert.deepEqual(expected, generate(data));
    });

    it('should return an array of single generate with all possible keys for an array of simple objects', function() {
      var data = [{
        "foo": "1"
      }, {
        "foo": "2",
        "bar": "3"
      }];

      var expected = [{
        "foo": true,
        "bar": true
      }];

      assert.deepEqual(expected, generate(data));
    });

    it('should generate nested objects', function() {
      var data = {
        "entries": [{
          "foo": "1"
        }, {
          "foo": "2",
          "bar": {
            "barz": "3"
          }
        }]
      };

      var expected = {
        "entries": [{
          "foo": true,
          "bar": {
            "barz": true
          }
        }]
      };

      assert.deepEqual(expected, generate(data));
    });

    it('should handle complex data', function() {
      assert.deepEqual(generated_fixture, generate(fixture));
    });
  });
});