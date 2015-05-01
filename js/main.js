(function() {
  var prefix = '/interpretation/'
  var files = [
    'basic_types',
    'interfaces',
    // 'classes',
    // 'modules',
    // 'functions',
    // 'generics',
    // 'common_errors',
    // 'mixins',
    // 'declaration_merging',
    // 'type_inference',
    // 'type_compatibility',
    // 'writing_.d.ts_files'
  ];

  var isOriginal = function(node) {
    if ($(node).text()[0] === '$') {
      return true;
    }
    return false;
  };

  var oriRegexp = /<p>\$.*<\/p>/g;
  var renderer = new marked.Renderer();
  var pRenderer = renderer.paragraph;
  var headingRenderer = renderer.heading;

  renderer.paragraph = function(text) {
    if (text[0] === '$' && text.indexOf('$$') > -1) {
      var arr = text.split('$$');
      var oriStr = arr[0].slice(1);
      var translationStr = arr[1];
      return '<div role="item">' +
        '<p>' + translationStr + '<span class="check-ori" role="check-ori">[查看此处原文]</span></p>' +
        '<p role="ori" class="hide">' + oriStr + '</p>' +
        '</div>';
    } else {
      return pRenderer(text);
    }
  };

  renderer.heading = function(text, lvl) {
    return '<h' + lvl + '>' +
      '<a name="' + text + '" class="anchor" href="#' + text + '">' +
      '<span class="header-link"></span></a>' +
      text + '</h' + lvl + '>';
  };

  var genDOM = function(markdown) {
    var html = marked(markdown, {
      renderer: renderer
    });
    return html;
  };

  var $container = $('[role="container"]'),
    $files = $container.find('[role="file-content"]');

  var getFile = function(name) {
    var $file = $('<div data-name="' + name + '"></div>');
    $.get(prefix + name + '.md').done(function(text) {
      $file.html(genDOM(text));
      $files.append($file);
      bindEvents($file);
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

  var bindEvents = function($e) {
    $e.find('[role="check-ori"]').click(function() {
      var $p = $(this).parents('div[role="item"]').find('p[role="ori"]');
      $p.toggleClass('hide');
    });
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