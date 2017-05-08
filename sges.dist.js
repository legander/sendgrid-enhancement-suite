'use strict';

function getProjectNameAndLang(el) {
  var name = el.querySelector('#name').textContent;
  var parts = name.split(" ");
  var appName = parts[0];
  var lang = parts[1];
  return {
    name: name,
    app: appName,
    lang: lang,
    el: el
  };
}

function setClassNames(template) {
  template.el.classList.add('lang_' + template.lang);
  template.el.classList.add('type_' + template.app);
}

function getWidgetFilters(templates) {
  var apps = [];
  var languages = [];

  templates.forEach(function (template) {
    if (apps.indexOf(template.app) === -1) {
      apps.push(template.app);
    }

    if (languages.indexOf(template.lang) === -1) {
      languages.push(template.lang);
    }
  });

  return {
    apps: apps,
    languages: languages
  };
}

var filterRenderer = function filterRenderer(filter) {
  return '\n    <div>\n      <label>\n        <input value="' + filter + '" class="filter__value" type="checkbox" />\n        <span>' + filter + '</span>\n      </label>\n    </div>\n  ';
};

function renderWidget(filters) {
  var appNameFilters = filters.apps.map(filterRenderer).join('');
  var langFilters = filters.languages.map(filterRenderer).join('');

  var widget = document.createElement('div');
  widget.id = 'sges';
  widget.innerHTML = '\n    <div>\n      <div id="appname__filter">\n        <strong>App name</strong>\n        ' + appNameFilters + '\n      </div>\n      <div id="language__filter">\n        <strong>Language</strong>\n        ' + langFilters + '\n      </div>\n    </div>\n  ';

  document.body.appendChild(widget);
}

function getActiveFilters(elements) {
  return elements.filter(function (filter) {
    return filter.checked;
  }).map(function (filter) {
    return filter.value;
  });
}

function toArray(nodeList) {
  return [].slice.call(nodeList);
}

function init() {
  var attachFilterChangeListener = function attachFilterChangeListener(filter) {
    filter.addEventListener('change', onFilterChange);
  };
  var onFilterChange = function onFilterChange(e) {
    setTimeout(function () {
      var appnameFilters = getActiveFilters(toArray(document.querySelectorAll("#appname__filter .filter__value")));
      var languageFilters = getActiveFilters(toArray(document.querySelectorAll("#language__filter .filter__value")));

      if (appnameFilters.length === 0 && languageFilters.length === 0) {
        return templates.forEach(function (template) {
          template.el.dataset.visible = true;
        });
      }

      templates.forEach(function (template) {
        if (appnameFilters.indexOf(template.app) >= 0) {
          if (languageFilters.length === 0 || languageFilters.indexOf(template.lang) >= 0) {
            template.el.dataset.visible = true;
          } else {
            template.el.dataset.visible = false;
          }
        } else {
          template.el.dataset.visible = false;
        }
      });
    }, 0);
  };

  var templateElements = toArray(document.querySelectorAll('.template-version-list'));

  var templates = templateElements.map(getProjectNameAndLang);
  templates.forEach(setClassNames);

  renderWidget(getWidgetFilters(templates));

  var filterElements = toArray(document.querySelectorAll(".filter__value"));
  filterElements.forEach(attachFilterChangeListener);
}

function retry() {
  if (document.querySelectorAll('.template-version-list').length > 0) {
    console.clear();
    init();
  } else {
    setTimeout(function () {
      console.log('retry');
      retry();
    }, 250);
  }
}

retry();
