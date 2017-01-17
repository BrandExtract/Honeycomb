jQuery(function($) {
  var $loader = $('#loader'), $results = $('#results');
  var honeycomb = new Honeycomb();

  $loader.on('submit.api', function() {
    var form = this, url = form.url.value;
    
    $.ajax({
      url: url,
      dataType: 'jsonp'
    }).done(function(data) {
      var filter = honeycomb.parse(data);
      var tree = honeycomb.toTree(filter, function(node) {
        node.icon = false;
      });
      
      $.jstree.destroy();
      $results.jstree({
        'core': {
          'check_callback' : true,
          'data': tree
        },
        'plugins' : [ 'sort', 'checkbox', 'changed' ]
      })
    }).fail(function() {
      $.jstree.destroy();
    });

    return false;
  });
});