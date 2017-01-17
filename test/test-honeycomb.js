var assert = require('assert');
var Honeycomb = require('../honeycomb'),
    honeycomb = new Honeycomb(),
    parse = honeycomb.parse,
    toTree = honeycomb.toTree;
var fixture = require('./fixture/organizer_list_events.json');
var parsed_fixture = require('./fixture/organizer_list_events.parsed.json');

describe('Honeycomb', function() {
  describe('#parse()', function() {
    it('should return true for primitives', function() {
      assert.equal(parse(true), true);
      assert.equal(parse(false), true);
      assert.equal(parse(""), true);
      assert.equal(parse("foo"), true);
      assert.equal(parse(0), true);
      assert.equal(parse(1), true);
      assert.equal(parse(100), true);
      assert.equal(parse(null), true);
      assert.equal(parse(undefined), true);
    });

    it('should return the key with value `true` for simple object', function() {
      assert.deepStrictEqual(parse({"foo": "bar"}), {"foo": true});
      assert.deepStrictEqual(parse({"foo": "bar", "bar": "barz"}), {"foo": true, "bar": true});
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
      
      assert.deepStrictEqual(parse(data), expected);
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

      assert.deepStrictEqual(parse(data), expected);
    });

    it('should, however, return true for an array of primitives', function() {
      var data = {
        "foo": [1, "bar", false]
      };

      var expected = {
        "foo": true
      }

      assert.deepStrictEqual(parse(data), expected);
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

      assert.deepStrictEqual(parse(data), expected);
    });

    it('should handle complex data', function() {
      assert.deepStrictEqual(parse(fixture), parsed_fixture);
    });
  });

  describe('#toTree()', function() {
    it('should convert an object to branches', function() {
      var filter = parse({"foo": 1});
      var tree = toTree(filter);

      assert(Array.isArray(tree));
      assert(tree.length === 1);
    });

    it('should use object key as branch text', function() {
      var filter = parse({"foo": 1});
      var tree = toTree(filter);
      var branch = tree[0];
      assert.equal(branch.text, "foo");
    });

    it('should set branch state to selected if value is true', function() {
      var filter = parse({"foo": 1});
      var tree = toTree(filter);
      var branch = tree[0];
      assert(branch.state);
      assert(branch.state.selected);

      filter.foo = false;
      tree = toTree(filter);
      assert.equal(tree[0].state.selected, false);
    });

    it('should set branch state to not opened if value is primitive', function() {
      var filter = parse({"foo": 1});
      var tree = toTree(filter);
      var branch = tree[0];
      assert(branch.state);
      assert.equal(branch.state.opened, false);
    });

    it('should convert a multi-key object to branches', function() {
      var filter = parse({"foo": 1, "bar": 2});
      var expectedTree = [{
        "text": "foo",
        "state": {
          "selected": true, // Because the value is `true`.
          "opened": false // Because the value type is primitive, no children.
        }
      }, {
        "text": "bar",
        "state": {
          "selected": true, // Because the value is `true`.
          "opened": false // Because the value type is primitive.
        }
      }];
      assert.deepStrictEqual(toTree(filter), expectedTree);
    });

    it('should convert nested object as children', function() {
      var filter = parse({"foo": { "bar": 1 }});
      var expectedTree = [{
        "text": "foo",
        "state": {
          "selected": false, // Because the value is object.
          "opened": true // Because the value is object.
        },
        "children": [{
          "text": "bar",
          "state": {
            "selected": true,
            "opened": false // Because this value is primitive.
          }
        }]
      }];

      assert.deepStrictEqual(toTree(filter), expectedTree);
    });

    it('should convert an array to branches from the first child', function() {
      var filter = parse([
        {"foo": 1}, 
        {"bar": 2}
      ]); // returns [{"foo": 1, "bar": 2}]
      
      var expectedTree = [{
        "text": "foo",
        "state": {
          "selected": true,
          "opened": false
        }
      }, {
        "text": "bar",
        "state": {
          "selected": true,
          "opened": false
        }
      }];

      assert.deepStrictEqual(toTree(filter), expectedTree);
    });

    it('should convert a nested array to branches from the first child', function() {
      var filter = parse({
        "foo": [
          {"bar": 1}, 
          {"barz": 2}
        ]
      }); // returns {"foo": [{"bar": 1, "barz": 2}]}

      var expectedTree = [{
        "text": "foo",
        "state": {
          "selected": false,
          "opened": true
        },
        "children": [{
          "text": "bar",
          "state": {
            "selected": true,
            "opened": false
          }
        }, {
          "text": "barz",
          "state": {
            "selected": true,
            "opened": false
          }
        }]
      }];

      assert.deepStrictEqual(toTree(filter), expectedTree);
    });

    it('should take a callback for each node', function() {
      var filter = parse({"foo": { "bar": 1 }});
      var expectedTree = [{
        "text": "foo",
        "icon": false,
        "children": [{
          "text": "bar",
          "icon": false
        }]
      }];

      var actual = toTree(filter, function(node) {
        delete node.state;
        node.icon = false;
      });

      assert.deepStrictEqual(actual, expectedTree);
    });
  });
});