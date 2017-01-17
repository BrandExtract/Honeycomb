jQuery(function($) {
  var $loader = $('#loader'), 
      $results = $('#results'),
      $mask = $('#mask');

  var honeycomb = new Honeycomb();

  $loader.on('submit.api', function() {
    var form = this, url = form.url.value || '';
    
    $.ajax({
      url: url.replace(/https?:/, ''),
      dataType: 'jsonp'
    }).done(function(data) {
      window.json = data;
      var mask = window.mask = honeycomb.parse(data);
      var tree = window.tree = honeycomb.toTree(mask, function(node) {
        node.icon = false;
      });

      $mask.html(JSON.stringify(mask, null, 2));
      
      $.jstree.destroy();
      $results.jstree({
        'core': {
          'check_callback' : true,
          'data': tree
        },
        'plugins' : [ 'checkbox', 'changed' ]
      })
    }).fail(function() {
      $.jstree.destroy();
    });

    return false;
  });
});