(function() {
  var prefix = 'interpretation/';

  var isOriginal = function(node) {
    if ($(node).text()[0] === '$') {
      return true;
    }
    return false;
  };

  var $container = $('[role="container"]'),
    $files = $container.find('[role="file-content"]'),
    $sideBar = $container.find('[role="side-bar"]'),
    $nav = $sideBar.find('[role="side-bar-nav"]');

  var getFiles = function(cb) {
    $.get(prefix + 'dest/content.html?20150507').done(function(html) {
      var $file = $('<div role="content" class="content"></div>');
      $file.html(html);
      $files.append($file);
      bindEvents($file);
      cb && cb();
    }).fail(function() {
      console.error('failed to load content');
    });
  };

  var bindEvents = function($e) {
    $e.find('[role="check-ori"]').click(function() {
      var $p = $(this).parents('div[role="item"]').find('p[role="ori"]');
      $p.is(':visible') ? $p.fadeOut() : $p.fadeIn();
    });
  };

  var initHighlight = function() {
    $files.find('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
  };

  var initSideNav = function() {
    var $titles = $files.find('.section-title');
    var navItems = [];
    var section = null;

    $titles.each(function() {
      var title = this;
      console.log(title);
      var nodeName = title.nodeName.toLowerCase();
      if (nodeName === 'h1') {
        if (section) {
          navItems.push(section);
        }
        section = {
          title: $(title).text(),
          subTitles: []
        };
      } else if (nodeName === 'h2') {
        section.subTitles.push($(title).text());
      }
    });
    if (section) {
      navItems.push(section);
    }

    for (var index in navItems) {
      var section = navItems[index];
      var $section = $('<div role="item" class="item"></div>');
      $section.append($('<h3><a href="#' + section.title + '">' + section.title + '</a></h3>'));
      var $list = $('<div role="list" class="list"></div>');
      $section.append($list);
      for (var index in section.subTitles) {
        var subTitle = section.subTitles[index];
        $list.append($('<h5><a href="#' + subTitle + '">' + subTitle + '</a></h5>'));
      }
      $nav.append($section);
    }

    var $items = $nav.find('[role="item"]');
    $items.click(function() {
      $items.removeClass('active');
      $(this).addClass('active');
    });

    $(window).scroll(function() {
      if ($(document).scrollTop() > 83) {
        $sideBar.addClass('scroll');
      } else {
        $sideBar.removeClass('scroll');
      }
    });
  };

  var init = function() {
    getFiles(function() {
      initHighlight();
      initSideNav();
    });
  };

  init();
})();
