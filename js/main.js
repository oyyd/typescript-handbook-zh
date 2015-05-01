(function() {
  var prefix = '/interpretation/'
  var files = [
    'basic_types',
    'interfaces',
    'classes',
    'modules',
    'functions',
    'generics',
    'common_errors',
    'mixins',
    'declaration_merging',
    'type_inference',
    'type_compatibility',
    'writing_.d.ts_files'
  ];

  var $container = $('[role="container"]'),
    $files = $container.find('[role="file-content"]');

  var getFile = function(name) {
    var $file = $('<div data-name="' + name + '"></div>');
    $files.append($file);
    $.get(prefix + name + '.md').done(function(text) {
      $file.html(marked(text));
    }).fail(function() {
      console.log('failed to load ' + name);
    });
  }

  var getFiles = function() {
    for (var index in files) {
      var name = files[index];
      getFile(name);
    }
  };

  var init = function() {
    marked.setOptions({
      highlight: function(code) {
        return hljs.highlightAuto(code).value;
      }
    })
    getFiles();
  };

  init();
})();