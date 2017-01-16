jQuery(function($) {
  var $loader = $('#loader'), $results = $('#results');
  var honeycomb = new Honeycomb();

  function toTree(obj) {
    if (Array.isArray(obj)) {
      // The filter for array only has one child.
      return toTree(obj[0]);
    }

    var branches = [];

    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      var value = obj[key], 
          isPrimitive = (value === true || value === false);
      
      var branch = {};
      branch.text = key;
      branch.icon = false;

      if (!isPrimitive) {
        branch.children = toTree(value);
      }

      branch.state = {
        selected: value === true,
        opened: !isPrimitive
      }

      branches.push(branch);
    }

    return branches;
  }

  $loader.on('submit.api', function() {
    var form = this, url = form.url.value;
    
    $.ajax({
      url: url,
      dataType: 'jsonp'
    }).done(function(data) {
      var filter = honeycomb.parse(data), 
          tree = toTree(filter);
      
      $.jstree.destroy();
      $results.jstree({
        'core': {
          'check_callback' : true,
          'data': tree
        },
        'plugins' : [ 'sort', 'checkbox', 'changed' ]
      })
    });

    return false;
  });
});