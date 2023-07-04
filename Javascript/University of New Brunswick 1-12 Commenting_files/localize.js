/**
 * Creates a Lang localizer
 *
 * @author Jacob Rogaishio
 * @since Created 2020-01-23
 */

var Lang = {
  localeCode: null,
  localeSourceBase: '/static-asset/locales/',
  data: {},
}

window.Lang = Lang

Lang.load = function(locale) {
  // If the static path global is set use that instead of a reverse proxy
  if (typeof window.Atutor != 'undefined' && !!window.Atutor.static_cdn_path) {
    Lang.localeSourceBase = window.Atutor.static_cdn_path + '/locales/'
  }

  Lang.localeCode = locale
  $.getJSON(
    Lang.localeSourceBase + Lang.localeCode + '.json?cache=' + Math.random(),
    function(json) {
      Lang.data = json
      //Go find everything that wasn't ready and fill it in
      $.each($('.lang-not-ready'), function(key, value) {
        var ele = $(value)
        ele.html(Lang.get(ele.data('lang-key')))
        ele.removeClass('lang-not-ready')
        ele.addClass('lang-ready')
      })
    }
  )
}

Lang.get = function(key) {
  if (!Lang.isLoaded()) {
    return (
      "<span class='lang-not-ready' data-lang-key='" +
      key +
      "'>[" +
      key +
      ']</span>'
    )
  }
  //Return the localization or the key if it's missing
  return typeof Lang.data[key] != 'undefined' ? Lang.data[key] : '[' + key + ']'
}

Lang.has = function(key) {
  return typeof Lang.data[key] != 'undefined'
}

Lang.locale = function() {
  return this.localeCode
}

Lang.isLoaded = function() {
  return Object.keys(Lang.data).length > 0
}
