jQuery(function($) {
  var $loader = $('#loader'), 
      $results = $('#results'),
      $mask = $('#mask');

  var honeycomb = new Honeycomb();

  var CACHE = {};

  function renderTree(tree, parent) {
    if (!parent) { parent = ''; }
    
    if (tree.map) {
      return '<ol>' + tree.map(function(node) {
        return renderTree(node, (parent? parent + '.' : '') + node.text);
      }).join('') + '</ol>';
    }

    return '<li>' +
      '<input type="checkbox"' + (tree.state.selected? ' checked': '') + ' id="' + parent + '"'  + ' />' +
      '<label for="' + parent + '">' + tree.text + '</label>' + 
      (tree.children? renderTree(tree.children, parent) : '') +
    '</li>';
  }

  function render() {
    if (!window.mask) {
      $mask.html('');
      $results.html('');
    } else {
      $mask.html(JSON.stringify(window.mask, null, 2));
      var tree = window.tree = honeycomb.toTree(window.mask, function(node) {
        node.icon = false;
      });
      $results.html(renderTree(tree));
    }
  }

  $loader.on('submit.api', function() {
    var form = this, url = form.url.value || '';
    url = url.replace(/https?:/, '');

    window.json = CACHE[url];
    if (window.json) {
      window.mask = honeycomb.parse(window.json);
      render();
      return false;
    }
    
    $.ajax({
      url: url,
      dataType: 'jsonp'
    }).done(function(data) {
      window.json = CACHE[url] = data;
      window.mask = honeycomb.parse(data);
      render();
    }).fail(function() {
      window.mask = null;
      window.tree = null;
      render();
    });

    return false;
  });

  // A very basic way to update values in mask through checkboxes.
  // We use `eval` here safely since we control the code.
  $results.on('change', 'input', function() {
    var id = this.id || '';
    // For array syntax, we need to set the 0 index in for looking up.
    id = id.replace('[]', '[0]')
    // However, when the array notation is at the end, meaning we are
    // setting the whole array to false, we just need to handle the 
    // array directly.
        .replace(/\[0\]$/, '');
    var key = 'window.mask.' + id;
    var toggle = this.checked;

    var currentMask = window.mask;

    try {
      if (!toggle) {
        // When we uncheck a checked key, we need to store current
        // value into cache, and set its value in mask to false so
        // the tree can render correctly.
        // The server side will need to filter out `false` key.
        var value = eval(key);
        CACHE[key] = value;
        eval(key + ' = false');
      } else {
        // When recheck a key, we use value from cache.
        var value = CACHE[key];
        eval(key + ' = ' + JSON.stringify(value));
      }
    } catch(ex) {
      window.mask = currentMask;
    }

    render();
  });
});