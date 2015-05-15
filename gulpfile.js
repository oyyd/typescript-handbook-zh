var fs = require('fs')
var gulp = require('gulp')
var marked = require('marked')

var mdFilesArr = [
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
    'writing_.d.ts_files',
    'typescript_1.5'
];
var prefix = 'interpretation/';

//config marked
var renderer = new marked.Renderer();
var pRenderer = renderer.paragraph;
var headingRenderer = renderer.heading;

renderer.listitem = renderer.paragraph = function(text) {
  if (text[0] === '$' && text.indexOf('$$') > -1) {
    var arr = text.split('$$');
    var oriStr = arr[0].slice(1);
    var translationStr = arr[1];
    return '<div role="item">' +
      '<p>' + translationStr + '<span class="check-ori" role="check-ori">[查看此处原文]</span></p>' +
      '<p role="ori" class="ori">' + oriStr + '</p>' +
      '</div>';
  } else {
    return pRenderer(text);
  }
};

renderer.heading = function(text, lvl) {
  return '<h' + lvl + ' class="section-title">' +
    '<a name="' + text + '" class="anchor" href="#' + text + '">' +
    '<span class="header-link"></span></a>' +
    text + '</h' + lvl + '>';
};

gulp.task('build', function(){
	var result = '';
	for(var index in mdFilesArr){
		var filePath = prefix + mdFilesArr[index] + '.md';
		result += fs.readFileSync(filePath, {encoding: 'utf8'}) + '\n---\n';	
	}
	
	result = marked(result, {
    renderer: renderer
  });
  
  fs.writeFileSync(prefix + 'dest/content.html', result);
});

gulp.task('watch', function(){
  gulp.watch(prefix + '*.md', ['build']);
});