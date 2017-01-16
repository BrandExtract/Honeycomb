var assert = require('assert');
var Honeycomb = require('../honeycomb'),
    honeycomb = new Honeycomb(),
    parse = honeycomb.parse.bind(honeycomb);
var fixture = require('./fixture/organizer_list_events.json');
var parsed_fixture = require('./fixture/organizer_list_events.parsed.json');

describe('Honeycomb', function() {
  describe('#parse()', function() {
    it('should return true for primitives', function() {
      assert.equal(true, parse(true));
      assert.equal(true, parse(false));
      assert.equal(true, parse(""));
      assert.equal(true, parse("foo"));
      assert.equal(true, parse(0));
      assert.equal(true, parse(1));
      assert.equal(true, parse(100));
      assert.equal(true, parse(null));
      assert.equal(true, parse(undefined));
    });

    it('should return the key with value `true` for simple object', function() {
      assert.deepEqual({"foo": true}, parse({"foo": "bar"}));
      assert.deepEqual({"foo": true, "bar": true}, parse({"foo": "bar", "bar": "barz"}));
    });

    it('should return an array of single filter for an array of simple objects', function() {
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
      
      assert.deepEqual(expected, parse(data));
    });

    it('should return an array of single filter with all possible keys for an array of simple objects', function() {
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

      assert.deepEqual(expected, parse(data));
    });

    it('should parse nested objects', function() {
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

      assert.deepEqual(expected, parse(data));
    });

    it('should handle complex data', function() {
      assert.deepEqual(parsed_fixture, parse(fixture));
    });
  });
});