/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.1.0
 */
(function( window, angular, undefined ){
"use strict";

(function(){
"use strict";

angular.module('ngMaterial', ["ng","ngAnimate","ngAria","material.core","material.core.gestures","material.core.layout","material.core.theming.palette","material.core.theming","material.core.animate","material.components.colors","material.components.button","material.components.dialog","material.components.autocomplete","material.components.gridList","material.components.content","material.components.icon","material.components.slider","material.components.switch","material.components.tabs","material.components.toast","material.components.toolbar","material.components.tooltip","material.components.virtualRepeat","material.components.checkbox","material.components.list","material.components.backdrop","material.components.showHide","material.components.input"]);
})();
(function(){
"use strict";

/**
 * Initialization function that validates environment
 * requirements.
 */
angular
  .module('material.core', [
    'ngAnimate',
    'material.core.animate',
    'material.core.layout',
    'material.core.gestures',
    'material.core.theming'
  ])
  .config(MdCoreConfigure)
  .run(DetectNgTouch);


/**
 * Detect if the ng-Touch module is also being used.
 * Warn if detected.
 * @ngInject
 */
function DetectNgTouch($log, $injector) {
  if ( $injector.has('$swipe') ) {
    var msg = "" +
      "You are using the ngTouch module. \n" +
      "Angular Material already has mobile click, tap, and swipe support... \n" +
      "ngTouch is not supported with Angular Material!";
    $log.warn(msg);
  }
}
DetectNgTouch.$inject = ["$log", "$injector"];

/**
 * @ngInject
 */
function MdCoreConfigure($provide, $mdThemingProvider) {

  $provide.decorator('$$rAF', ["$delegate", rAFDecorator]);

  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('pink')
    .warnPalette('deep-orange')
    .backgroundPalette('grey');
}
MdCoreConfigure.$inject = ["$provide", "$mdThemingProvider"];

/**
 * @ngInject
 */
function rAFDecorator($delegate) {
  /**
   * Use this to throttle events that come in often.
   * The throttled function will always use the *last* invocation before the
   * coming frame.
   *
   * For example, window resize events that fire many times a second:
   * If we set to use an raf-throttled callback on window resize, then
   * our callback will only be fired once per frame, with the last resize
   * event that happened before that frame.
   *
   * @param {function} callback function to debounce
   */
  $delegate.throttle = function(cb) {
    var queuedArgs, alreadyQueued, queueCb, context;
    return function debounced() {
      queuedArgs = arguments;
      context = this;
      queueCb = cb;
      if (!alreadyQueued) {
        alreadyQueued = true;
        $delegate(function() {
          queueCb.apply(context, Array.prototype.slice.call(queuedArgs));
          alreadyQueued = false;
        });
      }
    };
  };
  return $delegate;
}
rAFDecorator.$inject = ["$delegate"];

})();
(function(){
"use strict";

angular.module('material.core')
  .directive('mdAutofocus', MdAutofocusDirective)

  // Support the deprecated md-auto-focus and md-sidenav-focus as well
  .directive('mdAutoFocus', MdAutofocusDirective)
  .directive('mdSidenavFocus', MdAutofocusDirective);

/**
 * @ngdoc directive
 * @name mdAutofocus
 * @module material.core.util
 *
 * @description
 *
 * `[md-autofocus]` provides an optional way to identify the focused element when a `$mdDialog`,
 * `$mdBottomSheet`, `$mdMenu` or `$mdSidenav` opens or upon page load for input-like elements.
 *
 * When one of these opens, it will find the first nested element with the `[md-autofocus]`
 * attribute directive and optional expression. An expression may be specified as the directive
 * value to enable conditional activation of the autofocus.
 *
 * @usage
 *
 * ### Dialog
 * <hljs lang="html">
 * <md-dialog>
 *   <form>
 *     <md-input-container>
 *       <label for="testInput">Label</label>
 *       <input id="testInput" type="text" md-autofocus>
 *     </md-input-container>
 *   </form>
 * </md-dialog>
 * </hljs>
 *
 * ### Bottomsheet
 * <hljs lang="html">
 * <md-bottom-sheet class="md-list md-has-header">
 *  <md-subheader>Comment Actions</md-subheader>
 *  <md-list>
 *    <md-list-item ng-repeat="item in items">
 *
 *      <md-button md-autofocus="$index == 2">
 *        <md-icon md-svg-src="{{item.icon}}"></md-icon>
 *        <span class="md-inline-list-icon-label">{{ item.name }}</span>
 *      </md-button>
 *
 *    </md-list-item>
 *  </md-list>
 * </md-bottom-sheet>
 * </hljs>
 *
 * ### Autocomplete
 * <hljs lang="html">
 *   <md-autocomplete
 *       md-autofocus
 *       md-selected-item="selectedItem"
 *       md-search-text="searchText"
 *       md-items="item in getMatches(searchText)"
 *       md-item-text="item.display">
 *     <span md-highlight-text="searchText">{{item.display}}</span>
 *   </md-autocomplete>
 * </hljs>
 *
 * ### Sidenav
 * <hljs lang="html">
 * <div layout="row" ng-controller="MyController">
 *   <md-sidenav md-component-id="left" class="md-sidenav-left">
 *     Left Nav!
 *   </md-sidenav>
 *
 *   <md-content>
 *     Center Content
 *     <md-button ng-click="openLeftMenu()">
 *       Open Left Menu
 *     </md-button>
 *   </md-content>
 *
 *   <md-sidenav md-component-id="right"
 *     md-is-locked-open="$mdMedia('min-width: 333px')"
 *     class="md-sidenav-right">
 *     <form>
 *       <md-input-container>
 *         <label for="testInput">Test input</label>
 *         <input id="testInput" type="text"
 *                ng-model="data" md-autofocus>
 *       </md-input-container>
 *     </form>
 *   </md-sidenav>
 * </div>
 * </hljs>
 **/
function MdAutofocusDirective() {
  return {
    restrict: 'A',

    link: postLink
  }
}

function postLink(scope, element, attrs) {
  var attr = attrs.mdAutoFocus || attrs.mdAutofocus || attrs.mdSidenavFocus;

  // Setup a watcher on the proper attribute to update a class we can check for in $mdUtil
  scope.$watch(attr, function(canAutofocus) {
    element.toggleClass('md-autofocus', canAutofocus);
  });
}

})();
(function(){
"use strict";

/**
 * @ngdoc module
 * @name material.core.colorUtil
 * @description
 * Color Util
 */
angular
  .module('material.core')
  .factory('$mdColorUtil', ColorUtilFactory);

function ColorUtilFactory() {
  /**
   * Converts hex value to RGBA string
   * @param color {string}
   * @returns {string}
   */
  function hexToRgba (color) {
    var hex   = color[ 0 ] === '#' ? color.substr(1) : color,
      dig   = hex.length / 3,
      red   = hex.substr(0, dig),
      green = hex.substr(dig, dig),
      blue  = hex.substr(dig * 2);
    if (dig === 1) {
      red += red;
      green += green;
      blue += blue;
    }
    return 'rgba(' + parseInt(red, 16) + ',' + parseInt(green, 16) + ',' + parseInt(blue, 16) + ',0.1)';
  }

  /**
   * Converts rgba value to hex string
   * @param color {string}
   * @returns {string}
   */
  function rgbaToHex(color) {
    color = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);

    var hex = (color && color.length === 4) ? "#" +
    ("0" + parseInt(color[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(color[2],10).toString(16)).slice(-2) +
    ("0" + parseInt(color[3],10).toString(16)).slice(-2) : '';

    return hex.toUpperCase();
  }

  /**
   * Converts an RGB color to RGBA
   * @param color {string}
   * @returns {string}
   */
  function rgbToRgba (color) {
    return color.replace(')', ', 0.1)').replace('(', 'a(');
  }

  /**
   * Converts an RGBA color to RGB
   * @param color {string}
   * @returns {string}
   */
  function rgbaToRgb (color) {
    return color
      ? color.replace('rgba', 'rgb').replace(/,[^\),]+\)/, ')')
      : 'rgb(0,0,0)';
  }

  return {
    rgbaToHex: rgbaToHex,
    hexToRgba: hexToRgba,
    rgbToRgba: rgbToRgba,
    rgbaToRgb: rgbaToRgb
  }
}
})();
(function(){
"use strict";

angular.module('material.core')
.factory('$mdConstant', MdConstantFactory);

/**
 * Factory function that creates the grab-bag $mdConstant service.
 * @ngInject
 */
function MdConstantFactory($sniffer, $window, $document) {

  var vendorPrefix = $sniffer.vendorPrefix;
  var isWebkit = /webkit/i.test(vendorPrefix);
  var SPECIAL_CHARS_REGEXP = /([:\-_]+(.))/g;
  var prefixTestEl = document.createElement('div');

  function vendorProperty(name) {
    // Add a dash between the prefix and name, to be able to transform the string into camelcase.
    var prefixedName = vendorPrefix + '-' + name;
    var ucPrefix = camelCase(prefixedName);
    var lcPrefix = ucPrefix.charAt(0).toLowerCase() + ucPrefix.substring(1);

    return hasStyleProperty(name)     ? name     :       // The current browser supports the un-prefixed property
           hasStyleProperty(ucPrefix) ? ucPrefix :       // The current browser only supports the prefixed property.
           hasStyleProperty(lcPrefix) ? lcPrefix : name; // Some browsers are only supporting the prefix in lowercase.
  }

  function hasStyleProperty(property) {
    return angular.isDefined(prefixTestEl.style[property]);
  }

  function camelCase(input) {
    return input.replace(SPECIAL_CHARS_REGEXP, function(matches, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    });
  }

  var self = {
    isInputKey : function(e) { return (e.keyCode >= 31 && e.keyCode <= 90); },
    isNumPadKey : function (e){ return (3 === e.location && e.keyCode >= 97 && e.keyCode <= 105); },
    isNavigationKey : function(e) {
      var kc = self.KEY_CODE, NAVIGATION_KEYS =  [kc.SPACE, kc.ENTER, kc.UP_ARROW, kc.DOWN_ARROW];
      return (NAVIGATION_KEYS.indexOf(e.keyCode) != -1);    
    },

    KEY_CODE: {
      COMMA: 188,
      SEMICOLON : 186,
      ENTER: 13,
      ESCAPE: 27,
      SPACE: 32,
      PAGE_UP: 33,
      PAGE_DOWN: 34,
      END: 35,
      HOME: 36,
      LEFT_ARROW : 37,
      UP_ARROW : 38,
      RIGHT_ARROW : 39,
      DOWN_ARROW : 40,
      TAB : 9,
      BACKSPACE: 8,
      DELETE: 46
    },
    CSS: {
      /* Constants */
      TRANSITIONEND: 'transitionend' + (isWebkit ? ' webkitTransitionEnd' : ''),
      ANIMATIONEND: 'animationend' + (isWebkit ? ' webkitAnimationEnd' : ''),

      TRANSFORM: vendorProperty('transform'),
      TRANSFORM_ORIGIN: vendorProperty('transformOrigin'),
      TRANSITION: vendorProperty('transition'),
      TRANSITION_DURATION: vendorProperty('transitionDuration'),
      ANIMATION_PLAY_STATE: vendorProperty('animationPlayState'),
      ANIMATION_DURATION: vendorProperty('animationDuration'),
      ANIMATION_NAME: vendorProperty('animationName'),
      ANIMATION_TIMING: vendorProperty('animationTimingFunction'),
      ANIMATION_DIRECTION: vendorProperty('animationDirection')
    },
    /**
     * As defined in core/style/variables.scss
     *
     * $layout-breakpoint-xs:     600px !default;
     * $layout-breakpoint-sm:     960px !default;
     * $layout-breakpoint-md:     1280px !default;
     * $layout-breakpoint-lg:     1920px !default;
     *
     */
    MEDIA: {
      'xs'        : '(max-width: 599px)'                         ,
      'gt-xs'     : '(min-width: 600px)'                         ,
      'sm'        : '(min-width: 600px) and (max-width: 959px)'  ,
      'gt-sm'     : '(min-width: 960px)'                         ,
      'md'        : '(min-width: 960px) and (max-width: 1279px)' ,
      'gt-md'     : '(min-width: 1280px)'                        ,
      'lg'        : '(min-width: 1280px) and (max-width: 1919px)',
      'gt-lg'     : '(min-width: 1920px)'                        ,
      'xl'        : '(min-width: 1920px)'                        ,
      'landscape' : '(orientation: landscape)'                   ,
      'portrait'  : '(orientation: portrait)'                    ,
      'print' : 'print'
    },
    MEDIA_PRIORITY: [
      'xl',
      'gt-lg',
      'lg',
      'gt-md',
      'md',
      'gt-sm',
      'sm',
      'gt-xs',
      'xs',
      'landscape',
      'portrait',
      'print'
    ]
  };

  return self;
}
MdConstantFactory.$inject = ["$sniffer", "$window", "$document"];

})();
(function(){
"use strict";

  angular
    .module('material.core')
    .config( ["$provide", function($provide){
       $provide.decorator('$mdUtil', ['$delegate', function ($delegate){
           /**
            * Inject the iterator facade to easily support iteration and accessors
            * @see iterator below
            */
           $delegate.iterator = MdIterator;

           return $delegate;
         }
       ]);
     }]);

  /**
   * iterator is a list facade to easily support iteration and accessors
   *
   * @param items Array list which this iterator will enumerate
   * @param reloop Boolean enables iterator to consider the list as an endless reloop
   */
  function MdIterator(items, reloop) {
    var trueFn = function() { return true; };

    if (items && !angular.isArray(items)) {
      items = Array.prototype.slice.call(items);
    }

    reloop = !!reloop;
    var _items = items || [ ];

    // Published API
    return {
      items: getItems,
      count: count,

      inRange: inRange,
      contains: contains,
      indexOf: indexOf,
      itemAt: itemAt,

      findBy: findBy,

      add: add,
      remove: remove,

      first: first,
      last: last,
      next: angular.bind(null, findSubsequentItem, false),
      previous: angular.bind(null, findSubsequentItem, true),

      hasPrevious: hasPrevious,
      hasNext: hasNext

    };

    /**
     * Publish copy of the enumerable set
     * @returns {Array|*}
     */
    function getItems() {
      return [].concat(_items);
    }

    /**
     * Determine length of the list
     * @returns {Array.length|*|number}
     */
    function count() {
      return _items.length;
    }

    /**
     * Is the index specified valid
     * @param index
     * @returns {Array.length|*|number|boolean}
     */
    function inRange(index) {
      return _items.length && ( index > -1 ) && (index < _items.length );
    }

    /**
     * Can the iterator proceed to the next item in the list; relative to
     * the specified item.
     *
     * @param item
     * @returns {Array.length|*|number|boolean}
     */
    function hasNext(item) {
      return item ? inRange(indexOf(item) + 1) : false;
    }

    /**
     * Can the iterator proceed to the previous item in the list; relative to
     * the specified item.
     *
     * @param item
     * @returns {Array.length|*|number|boolean}
     */
    function hasPrevious(item) {
      return item ? inRange(indexOf(item) - 1) : false;
    }

    /**
     * Get item at specified index/position
     * @param index
     * @returns {*}
     */
    function itemAt(index) {
      return inRange(index) ? _items[index] : null;
    }

    /**
     * Find all elements matching the key/value pair
     * otherwise return null
     *
     * @param val
     * @param key
     *
     * @return array
     */
    function findBy(key, val) {
      return _items.filter(function(item) {
        return item[key] === val;
      });
    }

    /**
     * Add item to list
     * @param item
     * @param index
     * @returns {*}
     */
    function add(item, index) {
      if ( !item ) return -1;

      if (!angular.isNumber(index)) {
        index = _items.length;
      }

      _items.splice(index, 0, item);

      return indexOf(item);
    }

    /**
     * Remove item from list...
     * @param item
     */
    function remove(item) {
      if ( contains(item) ){
        _items.splice(indexOf(item), 1);
      }
    }

    /**
     * Get the zero-based index of the target item
     * @param item
     * @returns {*}
     */
    function indexOf(item) {
      return _items.indexOf(item);
    }

    /**
     * Boolean existence check
     * @param item
     * @returns {boolean}
     */
    function contains(item) {
      return item && (indexOf(item) > -1);
    }

    /**
     * Return first item in the list
     * @returns {*}
     */
    function first() {
      return _items.length ? _items[0] : null;
    }

    /**
     * Return last item in the list...
     * @returns {*}
     */
    function last() {
      return _items.length ? _items[_items.length - 1] : null;
    }

    /**
     * Find the next item. If reloop is true and at the end of the list, it will go back to the
     * first item. If given, the `validate` callback will be used to determine whether the next item
     * is valid. If not valid, it will try to find the next item again.
     *
     * @param {boolean} backwards Specifies the direction of searching (forwards/backwards)
     * @param {*} item The item whose subsequent item we are looking for
     * @param {Function=} validate The `validate` function
     * @param {integer=} limit The recursion limit
     *
     * @returns {*} The subsequent item or null
     */
    function findSubsequentItem(backwards, item, validate, limit) {
      validate = validate || trueFn;

      var curIndex = indexOf(item);
      while (true) {
        if (!inRange(curIndex)) return null;

        var nextIndex = curIndex + (backwards ? -1 : 1);
        var foundItem = null;
        if (inRange(nextIndex)) {
          foundItem = _items[nextIndex];
        } else if (reloop) {
          foundItem = backwards ? last() : first();
          nextIndex = indexOf(foundItem);
        }

        if ((foundItem === null) || (nextIndex === limit)) return null;
        if (validate(foundItem)) return foundItem;

        if (angular.isUndefined(limit)) limit = nextIndex;

        curIndex = nextIndex;
      }
    }
  }


})();
(function(){
"use strict";

angular.module('material.core')
.factory('$mdMedia', mdMediaFactory);

/**
 * @ngdoc service
 * @name $mdMedia
 * @module material.core
 *
 * @description
 * `$mdMedia` is used to evaluate whether a given media query is true or false given the
 * current device's screen / window size. The media query will be re-evaluated on resize, allowing
 * you to register a watch.
 *
 * `$mdMedia` also has pre-programmed support for media queries that match the layout breakpoints:
 *
 *  <table class="md-api-table">
 *    <thead>
 *    <tr>
 *      <th>Breakpoint</th>
 *      <th>mediaQuery</th>
 *    </tr>
 *    </thead>
 *    <tbody>
 *    <tr>
 *      <td>xs</td>
 *      <td>(max-width: 599px)</td>
 *    </tr>
 *    <tr>
 *      <td>gt-xs</td>
 *      <td>(min-width: 600px)</td>
 *    </tr>
 *    <tr>
 *      <td>sm</td>
 *      <td>(min-width: 600px) and (max-width: 959px)</td>
 *    </tr>
 *    <tr>
 *      <td>gt-sm</td>
 *      <td>(min-width: 960px)</td>
 *    </tr>
 *    <tr>
 *      <td>md</td>
 *      <td>(min-width: 960px) and (max-width: 1279px)</td>
 *    </tr>
 *    <tr>
 *      <td>gt-md</td>
 *      <td>(min-width: 1280px)</td>
 *    </tr>
 *    <tr>
 *      <td>lg</td>
 *      <td>(min-width: 1280px) and (max-width: 1919px)</td>
 *    </tr>
 *    <tr>
 *      <td>gt-lg</td>
 *      <td>(min-width: 1920px)</td>
 *    </tr>
 *    <tr>
 *      <td>xl</td>
 *      <td>(min-width: 1920px)</td>
 *    </tr>
 *    <tr>
 *      <td>landscape</td>
 *      <td>landscape</td>
 *    </tr>
 *    <tr>
 *      <td>portrait</td>
 *      <td>portrait</td>
 *    </tr>
 *    <tr>
 *      <td>print</td>
 *      <td>print</td>
 *    </tr>
 *    </tbody>
 *  </table>
 *
 *  See Material Design's <a href="https://www.google.com/design/spec/layout/adaptive-ui.html">Layout - Adaptive UI</a> for more details.
 *
 *  <a href="https://www.google.com/design/spec/layout/adaptive-ui.html">
 *  <img src="https://material-design.storage.googleapis.com/publish/material_v_4/material_ext_publish/0B8olV15J7abPSGFxemFiQVRtb1k/layout_adaptive_breakpoints_01.png" width="100%" height="100%"></img>
 *  </a>
 *
 * @returns {boolean} a boolean representing whether or not the given media query is true or false.
 *
 * @usage
 * <hljs lang="js">
 * app.controller('MyController', function($mdMedia, $scope) {
 *   $scope.$watch(function() { return $mdMedia('lg'); }, function(big) {
 *     $scope.bigScreen = big;
 *   });
 *
 *   $scope.screenIsSmall = $mdMedia('sm');
 *   $scope.customQuery = $mdMedia('(min-width: 1234px)');
 *   $scope.anotherCustom = $mdMedia('max-width: 300px');
 * });
 * </hljs>
 */

/* @ngInject */
function mdMediaFactory($mdConstant, $rootScope, $window) {
  var queries = {};
  var mqls = {};
  var results = {};
  var normalizeCache = {};

  $mdMedia.getResponsiveAttribute = getResponsiveAttribute;
  $mdMedia.getQuery = getQuery;
  $mdMedia.watchResponsiveAttributes = watchResponsiveAttributes;

  return $mdMedia;

  function $mdMedia(query) {
    var validated = queries[query];
    if (angular.isUndefined(validated)) {
      validated = queries[query] = validate(query);
    }

    var result = results[validated];
    if (angular.isUndefined(result)) {
      result = add(validated);
    }

    return result;
  }

  function validate(query) {
    return $mdConstant.MEDIA[query] ||
           ((query.charAt(0) !== '(') ? ('(' + query + ')') : query);
  }

  function add(query) {
    var result = mqls[query];
    if ( !result ) {
      result = mqls[query] = $window.matchMedia(query);
    }

    result.addListener(onQueryChange);
    return (results[result.media] = !!result.matches);
  }

  function onQueryChange(query) {
    $rootScope.$evalAsync(function() {
      results[query.media] = !!query.matches;
    });
  }

  function getQuery(name) {
    return mqls[name];
  }

  function getResponsiveAttribute(attrs, attrName) {
    for (var i = 0; i < $mdConstant.MEDIA_PRIORITY.length; i++) {
      var mediaName = $mdConstant.MEDIA_PRIORITY[i];
      if (!mqls[queries[mediaName]].matches) {
        continue;
      }

      var normalizedName = getNormalizedName(attrs, attrName + '-' + mediaName);
      if (attrs[normalizedName]) {
        return attrs[normalizedName];
      }
    }

    // fallback on unprefixed
    return attrs[getNormalizedName(attrs, attrName)];
  }

  function watchResponsiveAttributes(attrNames, attrs, watchFn) {
    var unwatchFns = [];
    attrNames.forEach(function(attrName) {
      var normalizedName = getNormalizedName(attrs, attrName);
      if (angular.isDefined(attrs[normalizedName])) {
        unwatchFns.push(
            attrs.$observe(normalizedName, angular.bind(void 0, watchFn, null)));
      }

      for (var mediaName in $mdConstant.MEDIA) {
        normalizedName = getNormalizedName(attrs, attrName + '-' + mediaName);
        if (angular.isDefined(attrs[normalizedName])) {
          unwatchFns.push(
              attrs.$observe(normalizedName, angular.bind(void 0, watchFn, mediaName)));
        }
      }
    });

    return function unwatch() {
      unwatchFns.forEach(function(fn) { fn(); })
    };
  }

  // Improves performance dramatically
  function getNormalizedName(attrs, attrName) {
    return normalizeCache[attrName] ||
        (normalizeCache[attrName] = attrs.$normalize(attrName));
  }
}
mdMediaFactory.$inject = ["$mdConstant", "$rootScope", "$window"];

})();
(function(){
"use strict";

angular
  .module('material.core')
  .config( ["$provide", function($provide) {
    $provide.decorator('$mdUtil', ['$delegate', function ($delegate) {

      // Inject the prefixer into our original $mdUtil service.
      $delegate.prefixer = MdPrefixer;

      return $delegate;
    }]);
  }]);

function MdPrefixer(initialAttributes, buildSelector) {
  var PREFIXES = ['data', 'x'];

  if (initialAttributes) {
    // The prefixer also accepts attributes as a parameter, and immediately builds a list or selector for
    // the specified attributes.
    return buildSelector ? _buildSelector(initialAttributes) : _buildList(initialAttributes);
  }

  return {
    buildList: _buildList,
    buildSelector: _buildSelector,
    hasAttribute: _hasAttribute,
    removeAttribute: _removeAttribute
  };

  function _buildList(attributes) {
    attributes = angular.isArray(attributes) ? attributes : [attributes];

    attributes.forEach(function(item) {
      PREFIXES.forEach(function(prefix) {
        attributes.push(prefix + '-' + item);
      });
    });

    return attributes;
  }

  function _buildSelector(attributes) {
    attributes = angular.isArray(attributes) ? attributes : [attributes];

    return _buildList(attributes)
      .map(function(item) {
        return '[' + item + ']'
      })
      .join(',');
  }

  function _hasAttribute(element, attribute) {
    element = element[0] || element;

    var prefixedAttrs = _buildList(attribute);

    for (var i = 0; i < prefixedAttrs.length; i++) {
      if (element.hasAttribute(prefixedAttrs[i])) {
        return true;
      }
    }

    return false;
  }

  function _removeAttribute(element, attribute) {
    element = element[0] || element;

    _buildList(attribute).forEach(function(prefixedAttribute) {
      element.removeAttribute(prefixedAttribute);
    });
  }
}
})();
(function(){
"use strict";

/*
 * This var has to be outside the angular factory, otherwise when
 * there are multiple material apps on the same page, each app
 * will create its own instance of this array and the app's IDs
 * will not be unique.
 */
var nextUniqueId = 0;

/**
 * @ngdoc module
 * @name material.core.util
 * @description
 * Util
 */
angular
  .module('material.core')
  .factory('$mdUtil', UtilFactory);

/**
 * @ngInject
 */
function UtilFactory($document, $timeout, $compile, $rootScope, $$mdAnimate, $interpolate, $log, $rootElement, $window, $$rAF) {
  // Setup some core variables for the processTemplate method
  var startSymbol = $interpolate.startSymbol(),
    endSymbol = $interpolate.endSymbol(),
    usesStandardSymbols = ((startSymbol === '{{') && (endSymbol === '}}'));

  /**
   * Checks if the target element has the requested style by key
   * @param {DOMElement|JQLite} target Target element
   * @param {string} key Style key
   * @param {string=} expectedVal Optional expected value
   * @returns {boolean} Whether the target element has the style or not
   */
  var hasComputedStyle = function (target, key, expectedVal) {
    var hasValue = false;

    if ( target && target.length  ) {
      var computedStyles = $window.getComputedStyle(target[0]);
      hasValue = angular.isDefined(computedStyles[key]) && (expectedVal ? computedStyles[key] == expectedVal : true);
    }

    return hasValue;
  };

  function validateCssValue(value) {
    return !value       ? '0'   :
      hasPx(value) || hasPercent(value) ? value : value + 'px';
  }

  function hasPx(value) {
    return String(value).indexOf('px') > -1;
  }

  function hasPercent(value) {
    return String(value).indexOf('%') > -1;

  }

  var $mdUtil = {
    dom: {},
    now: window.performance ?
      angular.bind(window.performance, window.performance.now) : Date.now || function() {
      return new Date().getTime();
    },

    /**
     * Bi-directional accessor/mutator used to easily update an element's
     * property based on the current 'dir'ectional value.
     */
    bidi : function(element, property, lValue, rValue) {
      var ltr = !($document[0].dir == 'rtl' || $document[0].body.dir == 'rtl');

      // If accessor
      if ( arguments.length == 0 ) return ltr ? 'ltr' : 'rtl';

      // If mutator
      var elem = angular.element(element);

      if ( ltr && angular.isDefined(lValue)) {
        elem.css(property, validateCssValue(lValue));
      }
      else if ( !ltr && angular.isDefined(rValue)) {
        elem.css(property, validateCssValue(rValue) );
      }
    },

    bidiProperty: function (element, lProperty, rProperty, value) {
      var ltr = !($document[0].dir == 'rtl' || $document[0].body.dir == 'rtl');

      var elem = angular.element(element);

      if ( ltr && angular.isDefined(lProperty)) {
        elem.css(lProperty, validateCssValue(value));
        elem.css(rProperty, '');
      }
      else if ( !ltr && angular.isDefined(rProperty)) {
        elem.css(rProperty, validateCssValue(value) );
        elem.css(lProperty, '');
      }
    },

    clientRect: function(element, offsetParent, isOffsetRect) {
      var node = getNode(element);
      offsetParent = getNode(offsetParent || node.offsetParent || document.body);
      var nodeRect = node.getBoundingClientRect();

      // The user can ask for an offsetRect: a rect relative to the offsetParent,
      // or a clientRect: a rect relative to the page
      var offsetRect = isOffsetRect ?
        offsetParent.getBoundingClientRect() :
      {left: 0, top: 0, width: 0, height: 0};
      return {
        left: nodeRect.left - offsetRect.left,
        top: nodeRect.top - offsetRect.top,
        width: nodeRect.width,
        height: nodeRect.height
      };
    },
    offsetRect: function(element, offsetParent) {
      return $mdUtil.clientRect(element, offsetParent, true);
    },

    // Annoying method to copy nodes to an array, thanks to IE
    nodesToArray: function(nodes) {
      nodes = nodes || [];

      var results = [];
      for (var i = 0; i < nodes.length; ++i) {
        results.push(nodes.item(i));
      }
      return results;
    },

    /**
     * Calculate the positive scroll offset
     * TODO: Check with pinch-zoom in IE/Chrome;
     *       https://code.google.com/p/chromium/issues/detail?id=496285
     */
    scrollTop: function(element) {
      element = angular.element(element || $document[0].body);

      var body = (element[0] == $document[0].body) ? $document[0].body : undefined;
      var scrollTop = body ? body.scrollTop + body.parentElement.scrollTop : 0;

      // Calculate the positive scroll offset
      return scrollTop || Math.abs(element[0].getBoundingClientRect().top);
    },

    /**
     * Finds the proper focus target by searching the DOM.
     *
     * @param containerEl
     * @param attributeVal
     * @returns {*}
     */
    findFocusTarget: function(containerEl, attributeVal) {
      var AUTO_FOCUS = this.prefixer('md-autofocus', true);
      var elToFocus;

      elToFocus = scanForFocusable(containerEl, attributeVal || AUTO_FOCUS);

      if ( !elToFocus && attributeVal != AUTO_FOCUS) {
        // Scan for deprecated attribute
        elToFocus = scanForFocusable(containerEl, this.prefixer('md-auto-focus', true));

        if ( !elToFocus ) {
          // Scan for fallback to 'universal' API
          elToFocus = scanForFocusable(containerEl, AUTO_FOCUS);
        }
      }

      return elToFocus;

      /**
       * Can target and nested children for specified Selector (attribute)
       * whose value may be an expression that evaluates to True/False.
       */
      function scanForFocusable(target, selector) {
        var elFound, items = target[0].querySelectorAll(selector);

        // Find the last child element with the focus attribute
        if ( items && items.length ){
          items.length && angular.forEach(items, function(it) {
            it = angular.element(it);

            // Check the element for the md-autofocus class to ensure any associated expression
            // evaluated to true.
            var isFocusable = it.hasClass('md-autofocus');
            if (isFocusable) elFound = it;
          });
        }
        return elFound;
      }
    },

    /**
     * Disables scroll around the passed parent element.
     * @param element Unused
     * @param {!Element|!angular.JQLite} parent Element to disable scrolling within.
     *   Defaults to body if none supplied.
     * @param options Object of options to modify functionality
     *   - disableScrollMask Boolean of whether or not to create a scroll mask element or
     *     use the passed parent element.
     */
    disableScrollAround: function(element, parent, options) {
      $mdUtil.disableScrollAround._count = $mdUtil.disableScrollAround._count || 0;
      ++$mdUtil.disableScrollAround._count;
      if ($mdUtil.disableScrollAround._enableScrolling) return $mdUtil.disableScrollAround._enableScrolling;
      var body = $document[0].body,
        restoreBody = disableBodyScroll(),
        restoreElement = disableElementScroll(parent);

      return $mdUtil.disableScrollAround._enableScrolling = function() {
        if (!--$mdUtil.disableScrollAround._count) {
          restoreBody();
          restoreElement();
          delete $mdUtil.disableScrollAround._enableScrolling;
        }
      };

      // Creates a virtual scrolling mask to absorb touchmove, keyboard, scrollbar clicking, and wheel events
      function disableElementScroll(element) {
        element = angular.element(element || body);
        var scrollMask;
        if (options && options.disableScrollMask) {
          scrollMask = element;
        } else {
          element = element[0];
          scrollMask = angular.element(
            '<div class="md-scroll-mask">' +
            '  <div class="md-scroll-mask-bar"></div>' +
            '</div>');
          element.appendChild(scrollMask[0]);
        }

        scrollMask.on('wheel', preventDefault);
        scrollMask.on('touchmove', preventDefault);

        return function restoreScroll() {
          scrollMask.off('wheel');
          scrollMask.off('touchmove');
          scrollMask[0].parentNode.removeChild(scrollMask[0]);
          delete $mdUtil.disableScrollAround._enableScrolling;
        };

        function preventDefault(e) {
          e.preventDefault();
        }
      }

      // Converts the body to a position fixed block and translate it to the proper scroll position
      function disableBodyScroll() {
        var htmlNode = body.parentNode;
        var restoreHtmlStyle = htmlNode.style.cssText || '';
        var restoreBodyStyle = body.style.cssText || '';
        var scrollOffset = $mdUtil.scrollTop(body);
        var clientWidth = body.clientWidth;

        if (body.scrollHeight > body.clientHeight + 1) {
          applyStyles(body, {
            position: 'fixed',
            width: '100%',
            top: -scrollOffset + 'px'
          });

          htmlNode.style.overflowY = 'scroll';
        }

        if (body.clientWidth < clientWidth) applyStyles(body, {overflow: 'hidden'});

        return function restoreScroll() {
          body.style.cssText = restoreBodyStyle;
          htmlNode.style.cssText = restoreHtmlStyle;
          body.scrollTop = scrollOffset;
          htmlNode.scrollTop = scrollOffset;
        };
      }

      function applyStyles(el, styles) {
        for (var key in styles) {
          el.style[key] = styles[key];
        }
      }
    },
    enableScrolling: function() {
      var method = this.disableScrollAround._enableScrolling;
      method && method();
    },
    floatingScrollbars: function() {
      if (this.floatingScrollbars.cached === undefined) {
        var tempNode = angular.element('<div><div></div></div>').css({
          width: '100%',
          'z-index': -1,
          position: 'absolute',
          height: '35px',
          'overflow-y': 'scroll'
        });
        tempNode.children().css('height', '60px');

        $document[0].body.appendChild(tempNode[0]);
        this.floatingScrollbars.cached = (tempNode[0].offsetWidth == tempNode[0].childNodes[0].offsetWidth);
        tempNode.remove();
      }
      return this.floatingScrollbars.cached;
    },

    // Mobile safari only allows you to set focus in click event listeners...
    forceFocus: function(element) {
      var node = element[0] || element;

      document.addEventListener('click', function focusOnClick(ev) {
        if (ev.target === node && ev.$focus) {
          node.focus();
          ev.stopImmediatePropagation();
          ev.preventDefault();
          node.removeEventListener('click', focusOnClick);
        }
      }, true);

      var newEvent = document.createEvent('MouseEvents');
      newEvent.initMouseEvent('click', false, true, window, {}, 0, 0, 0, 0,
        false, false, false, false, 0, null);
      newEvent.$material = true;
      newEvent.$focus = true;
      node.dispatchEvent(newEvent);
    },

    /**
     * facade to build md-backdrop element with desired styles
     * NOTE: Use $compile to trigger backdrop postLink function
     */
    createBackdrop: function(scope, addClass) {
      return $compile($mdUtil.supplant('<md-backdrop class="{0}">', [addClass]))(scope);
    },

    /**
     * supplant() method from Crockford's `Remedial Javascript`
     * Equivalent to use of $interpolate; without dependency on
     * interpolation symbols and scope. Note: the '{<token>}' can
     * be property names, property chains, or array indices.
     */
    supplant: function(template, values, pattern) {
      pattern = pattern || /\{([^\{\}]*)\}/g;
      return template.replace(pattern, function(a, b) {
        var p = b.split('.'),
          r = values;
        try {
          for (var s in p) {
            if (p.hasOwnProperty(s) ) {
              r = r[p[s]];
            }
          }
        } catch (e) {
          r = a;
        }
        return (typeof r === 'string' || typeof r === 'number') ? r : a;
      });
    },

    fakeNgModel: function() {
      return {
        $fake: true,
        $setTouched: angular.noop,
        $setViewValue: function(value) {
          this.$viewValue = value;
          this.$render(value);
          this.$viewChangeListeners.forEach(function(cb) {
            cb();
          });
        },
        $isEmpty: function(value) {
          return ('' + value).length === 0;
        },
        $parsers: [],
        $formatters: [],
        $viewChangeListeners: [],
        $render: angular.noop
      };
    },

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds.
    // @param wait Integer value of msecs to delay (since last debounce reset); default value 10 msecs
    // @param invokeApply should the $timeout trigger $digest() dirty checking
    debounce: function(func, wait, scope, invokeApply) {
      var timer;

      return function debounced() {
        var context = scope,
          args = Array.prototype.slice.call(arguments);

        $timeout.cancel(timer);
        timer = $timeout(function() {

          timer = undefined;
          func.apply(context, args);

        }, wait || 10, invokeApply);
      };
    },

    // Returns a function that can only be triggered every `delay` milliseconds.
    // In other words, the function will not be called unless it has been more
    // than `delay` milliseconds since the last call.
    throttle: function throttle(func, delay) {
      var recent;
      return function throttled() {
        var context = this;
        var args = arguments;
        var now = $mdUtil.now();

        if (!recent || (now - recent > delay)) {
          func.apply(context, args);
          recent = now;
        }
      };
    },

    /**
     * Measures the number of milliseconds taken to run the provided callback
     * function. Uses a high-precision timer if available.
     */
    time: function time(cb) {
      var start = $mdUtil.now();
      cb();
      return $mdUtil.now() - start;
    },

    /**
     * Create an implicit getter that caches its `getter()`
     * lookup value
     */
    valueOnUse : function (scope, key, getter) {
      var value = null, args = Array.prototype.slice.call(arguments);
      var params = (args.length > 3) ? args.slice(3) : [ ];

      Object.defineProperty(scope, key, {
        get: function () {
          if (value === null) value = getter.apply(scope, params);
          return value;
        }
      });
    },

    /**
     * Get a unique ID.
     *
     * @returns {string} an unique numeric string
     */
    nextUid: function() {
      return '' + nextUniqueId++;
    },

    // Stop watchers and events from firing on a scope without destroying it,
    // by disconnecting it from its parent and its siblings' linked lists.
    disconnectScope: function disconnectScope(scope) {
      if (!scope) return;

      // we can't destroy the root scope or a scope that has been already destroyed
      if (scope.$root === scope) return;
      if (scope.$$destroyed) return;

      var parent = scope.$parent;
      scope.$$disconnected = true;

      // See Scope.$destroy
      if (parent.$$childHead === scope) parent.$$childHead = scope.$$nextSibling;
      if (parent.$$childTail === scope) parent.$$childTail = scope.$$prevSibling;
      if (scope.$$prevSibling) scope.$$prevSibling.$$nextSibling = scope.$$nextSibling;
      if (scope.$$nextSibling) scope.$$nextSibling.$$prevSibling = scope.$$prevSibling;

      scope.$$nextSibling = scope.$$prevSibling = null;

    },

    // Undo the effects of disconnectScope above.
    reconnectScope: function reconnectScope(scope) {
      if (!scope) return;

      // we can't disconnect the root node or scope already disconnected
      if (scope.$root === scope) return;
      if (!scope.$$disconnected) return;

      var child = scope;

      var parent = child.$parent;
      child.$$disconnected = false;
      // See Scope.$new for this logic...
      child.$$prevSibling = parent.$$childTail;
      if (parent.$$childHead) {
        parent.$$childTail.$$nextSibling = child;
        parent.$$childTail = child;
      } else {
        parent.$$childHead = parent.$$childTail = child;
      }
    },

    /*
     * getClosest replicates jQuery.closest() to walk up the DOM tree until it finds a matching nodeName
     *
     * @param el Element to start walking the DOM from
     * @param check Either a string or a function. If a string is passed, it will be evaluated against
     * each of the parent nodes' tag name. If a function is passed, the loop will call it with each of
     * the parents and will use the return value to determine whether the node is a match.
     * @param onlyParent Only start checking from the parent element, not `el`.
     */
    getClosest: function getClosest(el, validateWith, onlyParent) {
      if ( angular.isString(validateWith) ) {
        var tagName = validateWith.toUpperCase();
        validateWith = function(el) {
          return el.nodeName === tagName;
        };
      }

      if (el instanceof angular.element) el = el[0];
      if (onlyParent) el = el.parentNode;
      if (!el) return null;

      do {
        if (validateWith(el)) {
          return el;
        }
      } while (el = el.parentNode);

      return null;
    },

    /**
     * Build polyfill for the Node.contains feature (if needed)
     */
    elementContains: function(node, child) {
      var hasContains = (window.Node && window.Node.prototype && Node.prototype.contains);
      var findFn = hasContains ? angular.bind(node, node.contains) : angular.bind(node, function(arg) {
        // compares the positions of two nodes and returns a bitmask
        return (node === child) || !!(this.compareDocumentPosition(arg) & 16)
      });

      return findFn(child);
    },

    /**
     * Functional equivalent for $element.filter(‘md-bottom-sheet’)
     * useful with interimElements where the element and its container are important...
     *
     * @param {[]} elements to scan
     * @param {string} name of node to find (e.g. 'md-dialog')
     * @param {boolean=} optional flag to allow deep scans; defaults to 'false'.
     * @param {boolean=} optional flag to enable log warnings; defaults to false
     */
    extractElementByName: function(element, nodeName, scanDeep, warnNotFound) {
      var found = scanTree(element);
      if (!found && !!warnNotFound) {
        $log.warn( $mdUtil.supplant("Unable to find node '{0}' in element '{1}'.",[nodeName, element[0].outerHTML]) );
      }

      return angular.element(found || element);

      /**
       * Breadth-First tree scan for element with matching `nodeName`
       */
      function scanTree(element) {
        return scanLevel(element) || (!!scanDeep ? scanChildren(element) : null);
      }

      /**
       * Case-insensitive scan of current elements only (do not descend).
       */
      function scanLevel(element) {
        if ( element ) {
          for (var i = 0, len = element.length; i < len; i++) {
            if (element[i].nodeName.toLowerCase() === nodeName) {
              return element[i];
            }
          }
        }
        return null;
      }

      /**
       * Scan children of specified node
       */
      function scanChildren(element) {
        var found;
        if ( element ) {
          for (var i = 0, len = element.length; i < len; i++) {
            var target = element[i];
            if ( !found ) {
              for (var j = 0, numChild = target.childNodes.length; j < numChild; j++) {
                found = found || scanTree([target.childNodes[j]]);
              }
            }
          }
        }
        return found;
      }

    },

    /**
     * Give optional properties with no value a boolean true if attr provided or false otherwise
     */
    initOptionalProperties: function(scope, attr, defaults) {
      defaults = defaults || {};
      angular.forEach(scope.$$isolateBindings, function(binding, key) {
        if (binding.optional && angular.isUndefined(scope[key])) {
          var attrIsDefined = angular.isDefined(attr[binding.attrName]);
          scope[key] = angular.isDefined(defaults[key]) ? defaults[key] : attrIsDefined;
        }
      });
    },

    /**
     * Alternative to $timeout calls with 0 delay.
     * nextTick() coalesces all calls within a single frame
     * to minimize $digest thrashing
     *
     * @param callback
     * @param digest
     * @returns {*}
     */
    nextTick: function(callback, digest, scope) {
      //-- grab function reference for storing state details
      var nextTick = $mdUtil.nextTick;
      var timeout = nextTick.timeout;
      var queue = nextTick.queue || [];

      //-- add callback to the queue
      queue.push({scope: scope, callback: callback});

      //-- set default value for digest
      if (digest == null) digest = true;

      //-- store updated digest/queue values
      nextTick.digest = nextTick.digest || digest;
      nextTick.queue = queue;

      //-- either return existing timeout or create a new one
      return timeout || (nextTick.timeout = $timeout(processQueue, 0, false));

      /**
       * Grab a copy of the current queue
       * Clear the queue for future use
       * Process the existing queue
       * Trigger digest if necessary
       */
      function processQueue() {
        var queue = nextTick.queue;
        var digest = nextTick.digest;

        nextTick.queue = [];
        nextTick.timeout = null;
        nextTick.digest = false;

        queue.forEach(function(queueItem) {
          var skip = queueItem.scope && queueItem.scope.$$destroyed;
          if (!skip) {
            queueItem.callback();
          }
        });

        if (digest) $rootScope.$digest();
      }
    },

    /**
     * Processes a template and replaces the start/end symbols if the application has
     * overriden them.
     *
     * @param template The template to process whose start/end tags may be replaced.
     * @returns {*}
     */
    processTemplate: function(template) {
      if (usesStandardSymbols) {
        return template;
      } else {
        if (!template || !angular.isString(template)) return template;
        return template.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol);
      }
    },

    /**
     * Scan up dom hierarchy for enabled parent;
     */
    getParentWithPointerEvents: function (element) {
      var parent = element.parent();

      // jqLite might return a non-null, but still empty, parent; so check for parent and length
      while (hasComputedStyle(parent, 'pointer-events', 'none')) {
        parent = parent.parent();
      }

      return parent;
    },

    getNearestContentElement: function (element) {
      var current = element.parent()[0];
      // Look for the nearest parent md-content, stopping at the rootElement.
      while (current && current !== $rootElement[0] && current !== document.body && current.nodeName.toUpperCase() !== 'MD-CONTENT') {
        current = current.parentNode;
      }
      return current;
    },

    /**
     * Checks if the current browser is natively supporting the `sticky` position.
     * @returns {string} supported sticky property name
     */
    checkStickySupport: function() {
      var stickyProp;
      var testEl = angular.element('<div>');
      $document[0].body.appendChild(testEl[0]);

      var stickyProps = ['sticky', '-webkit-sticky'];
      for (var i = 0; i < stickyProps.length; ++i) {
        testEl.css({
          position: stickyProps[i],
          top: 0,
          'z-index': 2
        });

        if (testEl.css('position') == stickyProps[i]) {
          stickyProp = stickyProps[i];
          break;
        }
      }

      testEl.remove();

      return stickyProp;
    },

    /**
     * Parses an attribute value, mostly a string.
     * By default checks for negated values and returns `false´ if present.
     * Negated values are: (native falsy) and negative strings like:
     * `false` or `0`.
     * @param value Attribute value which should be parsed.
     * @param negatedCheck When set to false, won't check for negated values.
     * @returns {boolean}
     */
    parseAttributeBoolean: function(value, negatedCheck) {
      return value === '' || !!value && (negatedCheck === false || value !== 'false' && value !== '0');
    },

    hasComputedStyle: hasComputedStyle,

    /**
     * Returns true if the parent form of the element has been submitted.
     *
     * @param element An Angular or HTML5 element.
     *
     * @returns {boolean}
     */
    isParentFormSubmitted: function(element) {
      var parent = $mdUtil.getClosest(element, 'form');
      var form = parent ? angular.element(parent).controller('form') : null;

      return form ? form.$submitted : false;
    },

    /**
     * Animate the requested element's scrollTop to the requested scrollPosition with basic easing.
     *
     * @param element The element to scroll.
     * @param scrollEnd The new/final scroll position.
     */
    animateScrollTo: function(element, scrollEnd) {
      var scrollStart = element.scrollTop;
      var scrollChange = scrollEnd - scrollStart;
      var scrollingDown = scrollStart < scrollEnd;
      var startTime = $mdUtil.now();

      $$rAF(scrollChunk);

      function scrollChunk() {
        var newPosition = calculateNewPosition();
        
        element.scrollTop = newPosition;
        
        if (scrollingDown ? newPosition < scrollEnd : newPosition > scrollEnd) {
          $$rAF(scrollChunk);
        }
      }
      
      function calculateNewPosition() {
        var duration = 1000;
        var currentTime = $mdUtil.now() - startTime;
        
        return ease(currentTime, scrollStart, scrollChange, duration);
      }

      function ease(currentTime, start, change, duration) {
        // If the duration has passed (which can occur if our app loses focus due to $$rAF), jump
        // straight to the proper position
        if (currentTime > duration) {
          return start + change;
        }
        
        var ts = (currentTime /= duration) * currentTime;
        var tc = ts * currentTime;

        return start + change * (-2 * tc + 3 * ts);
      }
    }
  };


// Instantiate other namespace utility methods

  $mdUtil.dom.animator = $$mdAnimate($mdUtil);

  return $mdUtil;

  function getNode(el) {
    return el[0] || el;
  }

}
UtilFactory.$inject = ["$document", "$timeout", "$compile", "$rootScope", "$$mdAnimate", "$interpolate", "$log", "$rootElement", "$window", "$$rAF"];

/*
 * Since removing jQuery from the demos, some code that uses `element.focus()` is broken.
 * We need to add `element.focus()`, because it's testable unlike `element[0].focus`.
 */

angular.element.prototype.focus = angular.element.prototype.focus || function() {
    if (this.length) {
      this[0].focus();
    }
    return this;
  };
angular.element.prototype.blur = angular.element.prototype.blur || function() {
    if (this.length) {
      this[0].blur();
    }
    return this;
  };

})();
(function(){
"use strict";

/**
 * @ngdoc module
 * @name material.core.aria
 * @description
 * Aria Expectations for ngMaterial components.
 */
angular
  .module('material.core')
  .provider('$mdAria', MdAriaProvider);

/**
 * @ngdoc service
 * @name $mdAriaProvider
 * @module material.core.aria
 *
 * @description
 *
 * Modify options of the `$mdAria` service, which will be used by most of the Angular Material components.
 **
 *
 * You are able to disable `$mdAria` warnings, by using the following markup.
 * <hljs lang="js">
 *   app.config(function($mdAriaProvider) {
 *     // Globally disables all ARIA warnings.
 *     $mdAriaProvider.disableWarnings();
 *   });
 * </hljs>
 *
 */
function MdAriaProvider() {

  var self = this;

  /**
   * Whether we should show ARIA warnings in the console, if labels are missing on the element
   * By default the warnings are enabled
   */
  self.showWarnings = true;

  return {
    disableWarnings: disableWarnings,
    $get: ["$$rAF", "$log", "$window", "$interpolate", function($$rAF, $log, $window, $interpolate) {
      return MdAriaService.apply(self, arguments);
    }]
  };

  /**
   * @ngdoc method
   * @name $mdAriaProvider#disableWarnings
   */
  function disableWarnings() {
    self.showWarnings = false;
  }
}

/*
 * @ngInject
 */
function MdAriaService($$rAF, $log, $window, $interpolate) {

  // Load the showWarnings option from the current context and store it inside of a scope variable,
  // because the context will be probably lost in some function calls.
  var showWarnings = this.showWarnings;

  return {
    expect: expect,
    expectAsync: expectAsync,
    expectWithText: expectWithText,
    expectWithoutText: expectWithoutText
  };

  /**
   * Check if expected attribute has been specified on the target element or child
   * @param element
   * @param attrName
   * @param {optional} defaultValue What to set the attr to if no value is found
   */
  function expect(element, attrName, defaultValue) {

    var node = angular.element(element)[0] || element;

    // if node exists and neither it nor its children have the attribute
    if (node &&
       ((!node.hasAttribute(attrName) ||
        node.getAttribute(attrName).length === 0) &&
        !childHasAttribute(node, attrName))) {

      defaultValue = angular.isString(defaultValue) ? defaultValue.trim() : '';
      if (defaultValue.length) {
        element.attr(attrName, defaultValue);
      } else if (showWarnings) {
        $log.warn('ARIA: Attribute "', attrName, '", required for accessibility, is missing on node:', node);
      }

    }
  }

  function expectAsync(element, attrName, defaultValueGetter) {
    // Problem: when retrieving the element's contents synchronously to find the label,
    // the text may not be defined yet in the case of a binding.
    // There is a higher chance that a binding will be defined if we wait one frame.
    $$rAF(function() {
        expect(element, attrName, defaultValueGetter());
    });
  }

  function expectWithText(element, attrName) {
    var content = getText(element) || "";
    var hasBinding = content.indexOf($interpolate.startSymbol()) > -1;

    if ( hasBinding ) {
      expectAsync(element, attrName, function() {
        return getText(element);
      });
    } else {
      expect(element, attrName, content);
    }
  }

  function expectWithoutText(element, attrName) {
    var content = getText(element);
    var hasBinding = content.indexOf($interpolate.startSymbol()) > -1;

    if ( !hasBinding && !content) {
      expect(element, attrName, content);
    }
  }

  function getText(element) {
    element = element[0] || element;
    var walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    var text = '';

    var node;
    while (node = walker.nextNode()) {
      if (!isAriaHiddenNode(node)) {
        text += node.textContent;
      }
    }

    return text.trim() || '';

    function isAriaHiddenNode(node) {
      while (node.parentNode && (node = node.parentNode) !== element) {
        if (node.getAttribute && node.getAttribute('aria-hidden') === 'true') {
          return true;
        }
      }
    }
  }

  function childHasAttribute(node, attrName) {
    var hasChildren = node.hasChildNodes(),
        hasAttr = false;

    function isHidden(el) {
      var style = el.currentStyle ? el.currentStyle : $window.getComputedStyle(el);
      return (style.display === 'none');
    }

    if (hasChildren) {
      var children = node.childNodes;
      for (var i=0; i < children.length; i++) {
        var child = children[i];
        if (child.nodeType === 1 && child.hasAttribute(attrName)) {
          if (!isHidden(child)) {
            hasAttr = true;
          }
        }
      }
    }

    return hasAttr;
  }
}
MdAriaService.$inject = ["$$rAF", "$log", "$window", "$interpolate"];

})();
(function(){
"use strict";

angular
  .module('material.core')
  .service('$mdCompiler', mdCompilerService);

function mdCompilerService($q, $templateRequest, $injector, $compile, $controller) {
  /* jshint validthis: true */

  /*
   * @ngdoc service
   * @name $mdCompiler
   * @module material.core
   * @description
   * The $mdCompiler service is an abstraction of angular's compiler, that allows the developer
   * to easily compile an element with a templateUrl, controller, and locals.
   *
   * @usage
   * <hljs lang="js">
   * $mdCompiler.compile({
   *   templateUrl: 'modal.html',
   *   controller: 'ModalCtrl',
   *   locals: {
   *     modal: myModalInstance;
   *   }
   * }).then(function(compileData) {
   *   compileData.element; // modal.html's template in an element
   *   compileData.link(myScope); //attach controller & scope to element
   * });
   * </hljs>
   */

   /*
    * @ngdoc method
    * @name $mdCompiler#compile
    * @description A helper to compile an HTML template/templateUrl with a given controller,
    * locals, and scope.
    * @param {object} options An options object, with the following properties:
    *
    *    - `controller` - `{(string=|function()=}` Controller fn that should be associated with
    *      newly created scope or the name of a registered controller if passed as a string.
    *    - `controllerAs` - `{string=}` A controller alias name. If present the controller will be
    *      published to scope under the `controllerAs` name.
    *    - `template` - `{string=}` An html template as a string.
    *    - `templateUrl` - `{string=}` A path to an html template.
    *    - `transformTemplate` - `{function(template)=}` A function which transforms the template after
    *      it is loaded. It will be given the template string as a parameter, and should
    *      return a a new string representing the transformed template.
    *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
    *      be injected into the controller. If any of these dependencies are promises, the compiler
    *      will wait for them all to be resolved, or if one is rejected before the controller is
    *      instantiated `compile()` will fail..
    *      * `key` - `{string}`: a name of a dependency to be injected into the controller.
    *      * `factory` - `{string|function}`: If `string` then it is an alias for a service.
    *        Otherwise if function, then it is injected and the return value is treated as the
    *        dependency. If the result is a promise, it is resolved before its value is
    *        injected into the controller.
    *
    * @returns {object=} promise A promise, which will be resolved with a `compileData` object.
    * `compileData` has the following properties:
    *
    *   - `element` - `{element}`: an uncompiled element matching the provided template.
    *   - `link` - `{function(scope)}`: A link function, which, when called, will compile
    *     the element and instantiate the provided controller (if given).
    *   - `locals` - `{object}`: The locals which will be passed into the controller once `link` is
    *     called. If `bindToController` is true, they will be coppied to the ctrl instead
    *   - `bindToController` - `bool`: bind the locals to the controller, instead of passing them in.
    */
  this.compile = function(options) {
    var templateUrl = options.templateUrl;
    var template = options.template || '';
    var controller = options.controller;
    var controllerAs = options.controllerAs;
    var resolve = angular.extend({}, options.resolve || {});
    var locals = angular.extend({}, options.locals || {});
    var transformTemplate = options.transformTemplate || angular.identity;
    var bindToController = options.bindToController;

    // Take resolve values and invoke them.
    // Resolves can either be a string (value: 'MyRegisteredAngularConst'),
    // or an invokable 'factory' of sorts: (value: function ValueGetter($dependency) {})
    angular.forEach(resolve, function(value, key) {
      if (angular.isString(value)) {
        resolve[key] = $injector.get(value);
      } else {
        resolve[key] = $injector.invoke(value);
      }
    });
    //Add the locals, which are just straight values to inject
    //eg locals: { three: 3 }, will inject three into the controller
    angular.extend(resolve, locals);

    if (templateUrl) {
      resolve.$template = $templateRequest(templateUrl)
        .then(function(response) {
          return response;
        });
    } else {
      resolve.$template = $q.when(template);
    }

    // Wait for all the resolves to finish if they are promises
    return $q.all(resolve).then(function(locals) {

      var compiledData;
      var template = transformTemplate(locals.$template, options);
      var element = options.element || angular.element('<div>').html(template.trim()).contents();
      var linkFn = $compile(element);

      // Return a linking function that can be used later when the element is ready
      return compiledData = {
        locals: locals,
        element: element,
        link: function link(scope) {
          locals.$scope = scope;

          //Instantiate controller if it exists, because we have scope
          if (controller) {
            var invokeCtrl = $controller(controller, locals, true);
            if (bindToController) {
              angular.extend(invokeCtrl.instance, locals);
            }
            var ctrl = invokeCtrl();
            //See angular-route source for this logic
            element.data('$ngControllerController', ctrl);
            element.children().data('$ngControllerController', ctrl);

            if (controllerAs) {
              scope[controllerAs] = ctrl;
            }

            // Publish reference to this controller
            compiledData.controller = ctrl;
          }
          return linkFn(scope);
        }
      };
    });

  };
}
mdCompilerService.$inject = ["$q", "$templateRequest", "$injector", "$compile", "$controller"];

})();
(function(){
"use strict";

var HANDLERS = {};

/* The state of the current 'pointer'
 * The pointer represents the state of the current touch.
 * It contains normalized x and y coordinates from DOM events,
 * as well as other information abstracted from the DOM.
 */

var pointer, lastPointer, forceSkipClickHijack = false;

/**
 * The position of the most recent click if that click was on a label element.
 * @type {{x: number, y: number}?}
 */
var lastLabelClickPos = null;

// Used to attach event listeners once when multiple ng-apps are running.
var isInitialized = false;

angular
  .module('material.core.gestures', [ ])
  .provider('$mdGesture', MdGestureProvider)
  .factory('$$MdGestureHandler', MdGestureHandler)
  .run( attachToDocument );

/**
   * @ngdoc service
   * @name $mdGestureProvider
   * @module material.core.gestures
   *
   * @description
   * In some scenarios on Mobile devices (without jQuery), the click events should NOT be hijacked.
   * `$mdGestureProvider` is used to configure the Gesture module to ignore or skip click hijacking on mobile
   * devices.
   *
   * <hljs lang="js">
   *   app.config(function($mdGestureProvider) {
   *
   *     // For mobile devices without jQuery loaded, do not
   *     // intercept click events during the capture phase.
   *     $mdGestureProvider.skipClickHijack();
   *
   *   });
   * </hljs>
   *
   */
function MdGestureProvider() { }

MdGestureProvider.prototype = {

  // Publish access to setter to configure a variable  BEFORE the
  // $mdGesture service is instantiated...
  skipClickHijack: function() {
    return forceSkipClickHijack = true;
  },

  /**
   * $get is used to build an instance of $mdGesture
   * @ngInject
   */
  $get : ["$$MdGestureHandler", "$$rAF", "$timeout", function($$MdGestureHandler, $$rAF, $timeout) {
       return new MdGesture($$MdGestureHandler, $$rAF, $timeout);
  }]
};



/**
 * MdGesture factory construction function
 * @ngInject
 */
function MdGesture($$MdGestureHandler, $$rAF, $timeout) {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  var isIos = userAgent.match(/ipad|iphone|ipod/i);
  var isAndroid = userAgent.match(/android/i);
  var touchActionProperty = getTouchAction();
  var hasJQuery =  (typeof window.jQuery !== 'undefined') && (angular.element === window.jQuery);

  var self = {
    handler: addHandler,
    register: register,
    isIos: isIos,
    isAndroid: isAndroid,
    // On mobile w/out jQuery, we normally intercept clicks. Should we skip that?
    isHijackingClicks: (isIos || isAndroid) && !hasJQuery && !forceSkipClickHijack
  };

  if (self.isHijackingClicks) {
    var maxClickDistance = 6;
    self.handler('click', {
      options: {
        maxDistance: maxClickDistance
      },
      onEnd: checkDistanceAndEmit('click')
    });

    self.handler('focus', {
      options: {
        maxDistance: maxClickDistance
      },
      onEnd: function(ev, pointer) {
        if (pointer.distance < this.state.options.maxDistance) {
          if (canFocus(ev.target)) {
            this.dispatchEvent(ev, 'focus', pointer);
            ev.target.focus();
          }
        }

        function canFocus(element) {
          var focusableElements = ['INPUT', 'SELECT', 'BUTTON', 'TEXTAREA', 'VIDEO', 'AUDIO'];

          return (element.getAttribute('tabindex') != '-1') &&
              !element.hasAttribute('DISABLED') &&
              (element.hasAttribute('tabindex') || element.hasAttribute('href') || element.isContentEditable ||
              (focusableElements.indexOf(element.nodeName) != -1));
        }
      }
    });

    self.handler('mouseup', {
      options: {
        maxDistance: maxClickDistance
      },
      onEnd: checkDistanceAndEmit('mouseup')
    });

    self.handler('mousedown', {
      onStart: function(ev) {
        this.dispatchEvent(ev, 'mousedown');
      }
    });
  }

  function checkDistanceAndEmit(eventName) {
    return function(ev, pointer) {
      if (pointer.distance < this.state.options.maxDistance) {
        this.dispatchEvent(ev, eventName, pointer);
      }
    };
  }

  /*
   * Register an element to listen for a handler.
   * This allows an element to override the default options for a handler.
   * Additionally, some handlers like drag and hold only dispatch events if
   * the domEvent happens inside an element that's registered to listen for these events.
   *
   * @see GestureHandler for how overriding of default options works.
   * @example $mdGesture.register(myElement, 'drag', { minDistance: 20, horziontal: false })
   */
  function register(element, handlerName, options) {
    var handler = HANDLERS[handlerName.replace(/^\$md./, '')];
    if (!handler) {
      throw new Error('Failed to register element with handler ' + handlerName + '. ' +
      'Available handlers: ' + Object.keys(HANDLERS).join(', '));
    }
    return handler.registerElement(element, options);
  }

  /*
   * add a handler to $mdGesture. see below.
   */
  function addHandler(name, definition) {
    var handler = new $$MdGestureHandler(name);
    angular.extend(handler, definition);
    HANDLERS[name] = handler;

    return self;
  }

  /*
   * Register handlers. These listen to touch/start/move events, interpret them,
   * and dispatch gesture events depending on options & conditions. These are all
   * instances of GestureHandler.
   * @see GestureHandler
   */
  return self
    /*
     * The press handler dispatches an event on touchdown/touchend.
     * It's a simple abstraction of touch/mouse/pointer start and end.
     */
    .handler('press', {
      onStart: function (ev, pointer) {
        this.dispatchEvent(ev, '$md.pressdown');
      },
      onEnd: function (ev, pointer) {
        this.dispatchEvent(ev, '$md.pressup');
      }
    })

    /*
     * The hold handler dispatches an event if the user keeps their finger within
     * the same <maxDistance> area for <delay> ms.
     * The hold handler will only run if a parent of the touch target is registered
     * to listen for hold events through $mdGesture.register()
     */
    .handler('hold', {
      options: {
        maxDistance: 6,
        delay: 500
      },
      onCancel: function () {
        $timeout.cancel(this.state.timeout);
      },
      onStart: function (ev, pointer) {
        // For hold, require a parent to be registered with $mdGesture.register()
        // Because we prevent scroll events, this is necessary.
        if (!this.state.registeredParent) return this.cancel();

        this.state.pos = {x: pointer.x, y: pointer.y};
        this.state.timeout = $timeout(angular.bind(this, function holdDelayFn() {
          this.dispatchEvent(ev, '$md.hold');
          this.cancel(); //we're done!
        }), this.state.options.delay, false);
      },
      onMove: function (ev, pointer) {
        // Don't scroll while waiting for hold.
        // If we don't preventDefault touchmove events here, Android will assume we don't
        // want to listen to anymore touch events. It will start scrolling and stop sending
        // touchmove events.
        if (!touchActionProperty && ev.type === 'touchmove') ev.preventDefault();

        // If the user moves greater than <maxDistance> pixels, stop the hold timer
        // set in onStart
        var dx = this.state.pos.x - pointer.x;
        var dy = this.state.pos.y - pointer.y;
        if (Math.sqrt(dx * dx + dy * dy) > this.options.maxDistance) {
          this.cancel();
        }
      },
      onEnd: function () {
        this.onCancel();
      }
    })

    /*
     * The drag handler dispatches a drag event if the user holds and moves his finger greater than
     * <minDistance> px in the x or y direction, depending on options.horizontal.
     * The drag will be cancelled if the user moves his finger greater than <minDistance>*<cancelMultiplier> in
     * the perpendicular direction. Eg if the drag is horizontal and the user moves his finger <minDistance>*<cancelMultiplier>
     * pixels vertically, this handler won't consider the move part of a drag.
     */
    .handler('drag', {
      options: {
        minDistance: 6,
        horizontal: true,
        cancelMultiplier: 1.5
      },
      onSetup: function(element, options) {
        if (touchActionProperty) {
          // We check for horizontal to be false, because otherwise we would overwrite the default opts.
          this.oldTouchAction = element[0].style[touchActionProperty];
          element[0].style[touchActionProperty] = options.horizontal === false ? 'pan-y' : 'pan-x';
        }
      },
      onCleanup: function(element) {
        if (this.oldTouchAction) {
          element[0].style[touchActionProperty] = this.oldTouchAction;
        }
      },
      onStart: function (ev) {
        // For drag, require a parent to be registered with $mdGesture.register()
        if (!this.state.registeredParent) this.cancel();
      },
      onMove: function (ev, pointer) {
        var shouldStartDrag, shouldCancel;
        // Don't scroll while deciding if this touchmove qualifies as a drag event.
        // If we don't preventDefault touchmove events here, Android will assume we don't
        // want to listen to anymore touch events. It will start scrolling and stop sending
        // touchmove events.
        if (!touchActionProperty && ev.type === 'touchmove') ev.preventDefault();

        if (!this.state.dragPointer) {
          if (this.state.options.horizontal) {
            shouldStartDrag = Math.abs(pointer.distanceX) > this.state.options.minDistance;
            shouldCancel = Math.abs(pointer.distanceY) > this.state.options.minDistance * this.state.options.cancelMultiplier;
          } else {
            shouldStartDrag = Math.abs(pointer.distanceY) > this.state.options.minDistance;
            shouldCancel = Math.abs(pointer.distanceX) > this.state.options.minDistance * this.state.options.cancelMultiplier;
          }

          if (shouldStartDrag) {
            // Create a new pointer representing this drag, starting at this point where the drag started.
            this.state.dragPointer = makeStartPointer(ev);
            updatePointerState(ev, this.state.dragPointer);
            this.dispatchEvent(ev, '$md.dragstart', this.state.dragPointer);

          } else if (shouldCancel) {
            this.cancel();
          }
        } else {
          this.dispatchDragMove(ev);
        }
      },
      // Only dispatch dragmove events every frame; any more is unnecessary
      dispatchDragMove: $$rAF.throttle(function (ev) {
        // Make sure the drag didn't stop while waiting for the next frame
        if (this.state.isRunning) {
          updatePointerState(ev, this.state.dragPointer);
          this.dispatchEvent(ev, '$md.drag', this.state.dragPointer);
        }
      }),
      onEnd: function (ev, pointer) {
        if (this.state.dragPointer) {
          updatePointerState(ev, this.state.dragPointer);
          this.dispatchEvent(ev, '$md.dragend', this.state.dragPointer);
        }
      }
    })

    /*
     * The swipe handler will dispatch a swipe event if, on the end of a touch,
     * the velocity and distance were high enough.
     */
    .handler('swipe', {
      options: {
        minVelocity: 0.65,
        minDistance: 10
      },
      onEnd: function (ev, pointer) {
        var eventType;

        if (Math.abs(pointer.velocityX) > this.state.options.minVelocity &&
          Math.abs(pointer.distanceX) > this.state.options.minDistance) {
          eventType = pointer.directionX == 'left' ? '$md.swipeleft' : '$md.swiperight';
          this.dispatchEvent(ev, eventType);
        }
        else if (Math.abs(pointer.velocityY) > this.state.options.minVelocity &&
          Math.abs(pointer.distanceY) > this.state.options.minDistance) {
          eventType = pointer.directionY == 'up' ? '$md.swipeup' : '$md.swipedown';
          this.dispatchEvent(ev, eventType);
        }
      }
    });

  function getTouchAction() {
    var testEl = document.createElement('div');
    var vendorPrefixes = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];

    for (var i = 0; i < vendorPrefixes.length; i++) {
      var prefix = vendorPrefixes[i];
      var property = prefix ? prefix + 'TouchAction' : 'touchAction';
      if (angular.isDefined(testEl.style[property])) {
        return property;
      }
    }
  }

}
MdGesture.$inject = ["$$MdGestureHandler", "$$rAF", "$timeout"];

/**
 * MdGestureHandler
 * A GestureHandler is an object which is able to dispatch custom dom events
 * based on native dom {touch,pointer,mouse}{start,move,end} events.
 *
 * A gesture will manage its lifecycle through the start,move,end, and cancel
 * functions, which are called by native dom events.
 *
 * A gesture has the concept of 'options' (eg a swipe's required velocity), which can be
 * overridden by elements registering through $mdGesture.register()
 */
function GestureHandler (name) {
  this.name = name;
  this.state = {};
}

function MdGestureHandler() {
  var hasJQuery =  (typeof window.jQuery !== 'undefined') && (angular.element === window.jQuery);

  GestureHandler.prototype = {
    options: {},
    // jQuery listeners don't work with custom DOMEvents, so we have to dispatch events
    // differently when jQuery is loaded
    dispatchEvent: hasJQuery ?  jQueryDispatchEvent : nativeDispatchEvent,

    // These are overridden by the registered handler
    onSetup: angular.noop,
    onCleanup: angular.noop,
    onStart: angular.noop,
    onMove: angular.noop,
    onEnd: angular.noop,
    onCancel: angular.noop,

    // onStart sets up a new state for the handler, which includes options from the
    // nearest registered parent element of ev.target.
    start: function (ev, pointer) {
      if (this.state.isRunning) return;
      var parentTarget = this.getNearestParent(ev.target);
      // Get the options from the nearest registered parent
      var parentTargetOptions = parentTarget && parentTarget.$mdGesture[this.name] || {};

      this.state = {
        isRunning: true,
        // Override the default options with the nearest registered parent's options
        options: angular.extend({}, this.options, parentTargetOptions),
        // Pass in the registered parent node to the state so the onStart listener can use
        registeredParent: parentTarget
      };
      this.onStart(ev, pointer);
    },
    move: function (ev, pointer) {
      if (!this.state.isRunning) return;
      this.onMove(ev, pointer);
    },
    end: function (ev, pointer) {
      if (!this.state.isRunning) return;
      this.onEnd(ev, pointer);
      this.state.isRunning = false;
    },
    cancel: function (ev, pointer) {
      this.onCancel(ev, pointer);
      this.state = {};
    },

    // Find and return the nearest parent element that has been registered to
    // listen for this handler via $mdGesture.register(element, 'handlerName').
    getNearestParent: function (node) {
      var current = node;
      while (current) {
        if ((current.$mdGesture || {})[this.name]) {
          return current;
        }
        current = current.parentNode;
      }
      return null;
    },

    // Called from $mdGesture.register when an element registers itself with a handler.
    // Store the options the user gave on the DOMElement itself. These options will
    // be retrieved with getNearestParent when the handler starts.
    registerElement: function (element, options) {
      var self = this;
      element[0].$mdGesture = element[0].$mdGesture || {};
      element[0].$mdGesture[this.name] = options || {};
      element.on('$destroy', onDestroy);

      self.onSetup(element, options || {});

      return onDestroy;

      function onDestroy() {
        delete element[0].$mdGesture[self.name];
        element.off('$destroy', onDestroy);

        self.onCleanup(element, options || {});
      }
    }
  };

  return GestureHandler;

  /*
   * Dispatch an event with jQuery
   * TODO: Make sure this sends bubbling events
   *
   * @param srcEvent the original DOM touch event that started this.
   * @param eventType the name of the custom event to send (eg 'click' or '$md.drag')
   * @param eventPointer the pointer object that matches this event.
   */
  function jQueryDispatchEvent(srcEvent, eventType, eventPointer) {
    eventPointer = eventPointer || pointer;
    var eventObj = new angular.element.Event(eventType);

    eventObj.$material = true;
    eventObj.pointer = eventPointer;
    eventObj.srcEvent = srcEvent;

    angular.extend(eventObj, {
      clientX: eventPointer.x,
      clientY: eventPointer.y,
      screenX: eventPointer.x,
      screenY: eventPointer.y,
      pageX: eventPointer.x,
      pageY: eventPointer.y,
      ctrlKey: srcEvent.ctrlKey,
      altKey: srcEvent.altKey,
      shiftKey: srcEvent.shiftKey,
      metaKey: srcEvent.metaKey
    });
    angular.element(eventPointer.target).trigger(eventObj);
  }

  /*
   * NOTE: nativeDispatchEvent is very performance sensitive.
   * @param srcEvent the original DOM touch event that started this.
   * @param eventType the name of the custom event to send (eg 'click' or '$md.drag')
   * @param eventPointer the pointer object that matches this event.
   */
  function nativeDispatchEvent(srcEvent, eventType, eventPointer) {
    eventPointer = eventPointer || pointer;
    var eventObj;

    if (eventType === 'click' || eventType == 'mouseup' || eventType == 'mousedown' ) {
      eventObj = document.createEvent('MouseEvents');
      eventObj.initMouseEvent(
        eventType, true, true, window, srcEvent.detail,
        eventPointer.x, eventPointer.y, eventPointer.x, eventPointer.y,
        srcEvent.ctrlKey, srcEvent.altKey, srcEvent.shiftKey, srcEvent.metaKey,
        srcEvent.button, srcEvent.relatedTarget || null
      );

    } else {
      eventObj = document.createEvent('CustomEvent');
      eventObj.initCustomEvent(eventType, true, true, {});
    }
    eventObj.$material = true;
    eventObj.pointer = eventPointer;
    eventObj.srcEvent = srcEvent;
    eventPointer.target.dispatchEvent(eventObj);
  }

}

/**
 * Attach Gestures: hook document and check shouldHijack clicks
 * @ngInject
 */
function attachToDocument( $mdGesture, $$MdGestureHandler ) {

  // Polyfill document.contains for IE11.
  // TODO: move to util
  document.contains || (document.contains = function (node) {
    return document.body.contains(node);
  });

  if (!isInitialized && $mdGesture.isHijackingClicks ) {
    /*
     * If hijack clicks is true, we preventDefault any click that wasn't
     * sent by ngMaterial. This is because on older Android & iOS, a false, or 'ghost',
     * click event will be sent ~400ms after a touchend event happens.
     * The only way to know if this click is real is to prevent any normal
     * click events, and add a flag to events sent by material so we know not to prevent those.
     *
     * Two exceptions to click events that should be prevented are:
     *  - click events sent by the keyboard (eg form submit)
     *  - events that originate from an Ionic app
     */
    document.addEventListener('click'    , clickHijacker     , true);
    document.addEventListener('mouseup'  , mouseInputHijacker, true);
    document.addEventListener('mousedown', mouseInputHijacker, true);
    document.addEventListener('focus'    , mouseInputHijacker, true);

    isInitialized = true;
  }

  function mouseInputHijacker(ev) {
    var isKeyClick = !ev.clientX && !ev.clientY;
    if (!isKeyClick && !ev.$material && !ev.isIonicTap
      && !isInputEventFromLabelClick(ev)) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  }

  function clickHijacker(ev) {
    var isKeyClick = ev.clientX === 0 && ev.clientY === 0;
    if (!isKeyClick && !ev.$material && !ev.isIonicTap
      && !isInputEventFromLabelClick(ev)) {
      ev.preventDefault();
      ev.stopPropagation();
      lastLabelClickPos = null;
    } else {
      lastLabelClickPos = null;
      if (ev.target.tagName.toLowerCase() == 'label') {
        lastLabelClickPos = {x: ev.x, y: ev.y};
      }
    }
  }


  // Listen to all events to cover all platforms.
  var START_EVENTS = 'mousedown touchstart pointerdown';
  var MOVE_EVENTS = 'mousemove touchmove pointermove';
  var END_EVENTS = 'mouseup mouseleave touchend touchcancel pointerup pointercancel';

  angular.element(document)
    .on(START_EVENTS, gestureStart)
    .on(MOVE_EVENTS, gestureMove)
    .on(END_EVENTS, gestureEnd)
    // For testing
    .on('$$mdGestureReset', function gestureClearCache () {
      lastPointer = pointer = null;
    });

  /*
   * When a DOM event happens, run all registered gesture handlers' lifecycle
   * methods which match the DOM event.
   * Eg when a 'touchstart' event happens, runHandlers('start') will call and
   * run `handler.cancel()` and `handler.start()` on all registered handlers.
   */
  function runHandlers(handlerEvent, event) {
    var handler;
    for (var name in HANDLERS) {
      handler = HANDLERS[name];
      if( handler instanceof $$MdGestureHandler ) {

        if (handlerEvent === 'start') {
          // Run cancel to reset any handlers' state
          handler.cancel();
        }
        handler[handlerEvent](event, pointer);

      }
    }
  }

  /*
   * gestureStart vets if a start event is legitimate (and not part of a 'ghost click' from iOS/Android)
   * If it is legitimate, we initiate the pointer state and mark the current pointer's type
   * For example, for a touchstart event, mark the current pointer as a 'touch' pointer, so mouse events
   * won't effect it.
   */
  function gestureStart(ev) {
    // If we're already touched down, abort
    if (pointer) return;

    var now = +Date.now();

    // iOS & old android bug: after a touch event, a click event is sent 350 ms later.
    // If <400ms have passed, don't allow an event of a different type than the previous event
    if (lastPointer && !typesMatch(ev, lastPointer) && (now - lastPointer.endTime < 1500)) {
      return;
    }

    pointer = makeStartPointer(ev);

    runHandlers('start', ev);
  }
  /*
   * If a move event happens of the right type, update the pointer and run all the move handlers.
   * "of the right type": if a mousemove happens but our pointer started with a touch event, do nothing.
   */
  function gestureMove(ev) {
    if (!pointer || !typesMatch(ev, pointer)) return;

    updatePointerState(ev, pointer);
    runHandlers('move', ev);
  }
  /*
   * If an end event happens of the right type, update the pointer, run endHandlers, and save the pointer as 'lastPointer'
   */
  function gestureEnd(ev) {
    if (!pointer || !typesMatch(ev, pointer)) return;

    updatePointerState(ev, pointer);
    pointer.endTime = +Date.now();

    runHandlers('end', ev);

    lastPointer = pointer;
    pointer = null;
  }

}
attachToDocument.$inject = ["$mdGesture", "$$MdGestureHandler"];

// ********************
// Module Functions
// ********************

/*
 * Initiate the pointer. x, y, and the pointer's type.
 */
function makeStartPointer(ev) {
  var point = getEventPoint(ev);
  var startPointer = {
    startTime: +Date.now(),
    target: ev.target,
    // 'p' for pointer events, 'm' for mouse, 't' for touch
    type: ev.type.charAt(0)
  };
  startPointer.startX = startPointer.x = point.pageX;
  startPointer.startY = startPointer.y = point.pageY;
  return startPointer;
}

/*
 * return whether the pointer's type matches the event's type.
 * Eg if a touch event happens but the pointer has a mouse type, return false.
 */
function typesMatch(ev, pointer) {
  return ev && pointer && ev.type.charAt(0) === pointer.type;
}

/**
 * Gets whether the given event is an input event that was caused by clicking on an
 * associated label element.
 *
 * This is necessary because the browser will, upon clicking on a label element, fire an
 * *extra* click event on its associated input (if any). mdGesture is able to flag the label
 * click as with `$material` correctly, but not the second input click.
 *
 * In order to determine whether an input event is from a label click, we compare the (x, y) for
 * the event to the (x, y) for the most recent label click (which is cleared whenever a non-label
 * click occurs). Unfortunately, there are no event properties that tie the input and the label
 * together (such as relatedTarget).
 *
 * @param {MouseEvent} event
 * @returns {boolean}
 */
function isInputEventFromLabelClick(event) {
  return lastLabelClickPos
      && lastLabelClickPos.x == event.x
      && lastLabelClickPos.y == event.y;
}

/*
 * Update the given pointer based upon the given DOMEvent.
 * Distance, velocity, direction, duration, etc
 */
function updatePointerState(ev, pointer) {
  var point = getEventPoint(ev);
  var x = pointer.x = point.pageX;
  var y = pointer.y = point.pageY;

  pointer.distanceX = x - pointer.startX;
  pointer.distanceY = y - pointer.startY;
  pointer.distance = Math.sqrt(
    pointer.distanceX * pointer.distanceX + pointer.distanceY * pointer.distanceY
  );

  pointer.directionX = pointer.distanceX > 0 ? 'right' : pointer.distanceX < 0 ? 'left' : '';
  pointer.directionY = pointer.distanceY > 0 ? 'down' : pointer.distanceY < 0 ? 'up' : '';

  pointer.duration = +Date.now() - pointer.startTime;
  pointer.velocityX = pointer.distanceX / pointer.duration;
  pointer.velocityY = pointer.distanceY / pointer.duration;
}

/*
 * Normalize the point where the DOM event happened whether it's touch or mouse.
 * @returns point event obj with pageX and pageY on it.
 */
function getEventPoint(ev) {
  ev = ev.originalEvent || ev; // support jQuery events
  return (ev.touches && ev.touches[0]) ||
    (ev.changedTouches && ev.changedTouches[0]) ||
    ev;
}

})();
(function(){
"use strict";

angular.module('material.core')
  .provider('$$interimElement', InterimElementProvider);

/*
 * @ngdoc service
 * @name $$interimElement
 * @module material.core
 *
 * @description
 *
 * Factory that contructs `$$interimElement.$service` services.
 * Used internally in material design for elements that appear on screen temporarily.
 * The service provides a promise-like API for interacting with the temporary
 * elements.
 *
 * ```js
 * app.service('$mdToast', function($$interimElement) {
 *   var $mdToast = $$interimElement(toastDefaultOptions);
 *   return $mdToast;
 * });
 * ```
 * @param {object=} defaultOptions Options used by default for the `show` method on the service.
 *
 * @returns {$$interimElement.$service}
 *
 */

function InterimElementProvider() {
  createInterimElementProvider.$get = InterimElementFactory;
  InterimElementFactory.$inject = ["$document", "$q", "$$q", "$rootScope", "$timeout", "$rootElement", "$animate", "$mdUtil", "$mdCompiler", "$mdTheming", "$injector"];
  return createInterimElementProvider;

  /**
   * Returns a new provider which allows configuration of a new interimElement
   * service. Allows configuration of default options & methods for options,
   * as well as configuration of 'preset' methods (eg dialog.basic(): basic is a preset method)
   */
  function createInterimElementProvider(interimFactoryName) {
    var EXPOSED_METHODS = ['onHide', 'onShow', 'onRemove'];

    var customMethods = {};
    var providerConfig = {
      presets: {}
    };

    var provider = {
      setDefaults: setDefaults,
      addPreset: addPreset,
      addMethod: addMethod,
      $get: factory
    };

    /**
     * all interim elements will come with the 'build' preset
     */
    provider.addPreset('build', {
      methods: ['controller', 'controllerAs', 'resolve',
        'template', 'templateUrl', 'themable', 'transformTemplate', 'parent']
    });

    factory.$inject = ["$$interimElement", "$injector"];
    return provider;

    /**
     * Save the configured defaults to be used when the factory is instantiated
     */
    function setDefaults(definition) {
      providerConfig.optionsFactory = definition.options;
      providerConfig.methods = (definition.methods || []).concat(EXPOSED_METHODS);
      return provider;
    }

    /**
     * Add a method to the factory that isn't specific to any interim element operations
     */

    function addMethod(name, fn) {
      customMethods[name] = fn;
      return provider;
    }

    /**
     * Save the configured preset to be used when the factory is instantiated
     */
    function addPreset(name, definition) {
      definition = definition || {};
      definition.methods = definition.methods || [];
      definition.options = definition.options || function() { return {}; };

      if (/^cancel|hide|show$/.test(name)) {
        throw new Error("Preset '" + name + "' in " + interimFactoryName + " is reserved!");
      }
      if (definition.methods.indexOf('_options') > -1) {
        throw new Error("Method '_options' in " + interimFactoryName + " is reserved!");
      }
      providerConfig.presets[name] = {
        methods: definition.methods.concat(EXPOSED_METHODS),
        optionsFactory: definition.options,
        argOption: definition.argOption
      };
      return provider;
    }

    function addPresetMethod(presetName, methodName, method) {
      providerConfig.presets[presetName][methodName] = method;
    }

    /**
     * Create a factory that has the given methods & defaults implementing interimElement
     */
    /* @ngInject */
    function factory($$interimElement, $injector) {
      var defaultMethods;
      var defaultOptions;
      var interimElementService = $$interimElement();

      /*
       * publicService is what the developer will be using.
       * It has methods hide(), cancel(), show(), build(), and any other
       * presets which were set during the config phase.
       */
      var publicService = {
        hide: interimElementService.hide,
        cancel: interimElementService.cancel,
        show: showInterimElement,

        // Special internal method to destroy an interim element without animations
        // used when navigation changes causes a $scope.$destroy() action
        destroy : destroyInterimElement
      };


      defaultMethods = providerConfig.methods || [];
      // This must be invoked after the publicService is initialized
      defaultOptions = invokeFactory(providerConfig.optionsFactory, {});

      // Copy over the simple custom methods
      angular.forEach(customMethods, function(fn, name) {
        publicService[name] = fn;
      });

      angular.forEach(providerConfig.presets, function(definition, name) {
        var presetDefaults = invokeFactory(definition.optionsFactory, {});
        var presetMethods = (definition.methods || []).concat(defaultMethods);

        // Every interimElement built with a preset has a field called `$type`,
        // which matches the name of the preset.
        // Eg in preset 'confirm', options.$type === 'confirm'
        angular.extend(presetDefaults, { $type: name });

        // This creates a preset class which has setter methods for every
        // method given in the `.addPreset()` function, as well as every
        // method given in the `.setDefaults()` function.
        //
        // @example
        // .setDefaults({
        //   methods: ['hasBackdrop', 'clickOutsideToClose', 'escapeToClose', 'targetEvent'],
        //   options: dialogDefaultOptions
        // })
        // .addPreset('alert', {
        //   methods: ['title', 'ok'],
        //   options: alertDialogOptions
        // })
        //
        // Set values will be passed to the options when interimElement.show() is called.
        function Preset(opts) {
          this._options = angular.extend({}, presetDefaults, opts);
        }
        angular.forEach(presetMethods, function(name) {
          Preset.prototype[name] = function(value) {
            this._options[name] = value;
            return this;
          };
        });

        // Create shortcut method for one-linear methods
        if (definition.argOption) {
          var methodName = 'show' + name.charAt(0).toUpperCase() + name.slice(1);
          publicService[methodName] = function(arg) {
            var config = publicService[name](arg);
            return publicService.show(config);
          };
        }

        // eg $mdDialog.alert() will return a new alert preset
        publicService[name] = function(arg) {
          // If argOption is supplied, eg `argOption: 'content'`, then we assume
          // if the argument is not an options object then it is the `argOption` option.
          //
          // @example `$mdToast.simple('hello')` // sets options.content to hello
          //                                     // because argOption === 'content'
          if (arguments.length && definition.argOption &&
              !angular.isObject(arg) && !angular.isArray(arg))  {

            return (new Preset())[definition.argOption](arg);

          } else {
            return new Preset(arg);
          }

        };
      });

      return publicService;

      /**
       *
       */
      function showInterimElement(opts) {
        // opts is either a preset which stores its options on an _options field,
        // or just an object made up of options
        opts = opts || { };
        if (opts._options) opts = opts._options;

        return interimElementService.show(
          angular.extend({}, defaultOptions, opts)
        );
      }

      /**
       *  Special method to hide and destroy an interimElement WITHOUT
       *  any 'leave` or hide animations ( an immediate force hide/remove )
       *
       *  NOTE: This calls the onRemove() subclass method for each component...
       *  which must have code to respond to `options.$destroy == true`
       */
      function destroyInterimElement(opts) {
          return interimElementService.destroy(opts);
      }

      /**
       * Helper to call $injector.invoke with a local of the factory name for
       * this provider.
       * If an $mdDialog is providing options for a dialog and tries to inject
       * $mdDialog, a circular dependency error will happen.
       * We get around that by manually injecting $mdDialog as a local.
       */
      function invokeFactory(factory, defaultVal) {
        var locals = {};
        locals[interimFactoryName] = publicService;
        return $injector.invoke(factory || function() { return defaultVal; }, {}, locals);
      }

    }

  }

  /* @ngInject */
  function InterimElementFactory($document, $q, $$q, $rootScope, $timeout, $rootElement, $animate,
                                 $mdUtil, $mdCompiler, $mdTheming, $injector ) {
    return function createInterimElementService() {
      var SHOW_CANCELLED = false;

      /*
       * @ngdoc service
       * @name $$interimElement.$service
       *
       * @description
       * A service used to control inserting and removing an element into the DOM.
       *
       */
      var service, stack = [];

      // Publish instance $$interimElement service;
      // ... used as $mdDialog, $mdToast, $mdMenu, and $mdSelect

      return service = {
        show: show,
        hide: hide,
        cancel: cancel,
        destroy : destroy,
        $injector_: $injector
      };

      /*
       * @ngdoc method
       * @name $$interimElement.$service#show
       * @kind function
       *
       * @description
       * Adds the `$interimElement` to the DOM and returns a special promise that will be resolved or rejected
       * with hide or cancel, respectively. To external cancel/hide, developers should use the
       *
       * @param {*} options is hashMap of settings
       * @returns a Promise
       *
       */
      function show(options) {
        options = options || {};
        var interimElement = new InterimElement(options || {});
        // When an interim element is currently showing, we have to cancel it.
        // Just hiding it, will resolve the InterimElement's promise, the promise should be
        // rejected instead.
        var hideExisting = !options.skipHide && stack.length ? service.cancel() : $q.when(true);

        // This hide()s only the current interim element before showing the next, new one
        // NOTE: this is not reversible (e.g. interim elements are not stackable)

        hideExisting.finally(function() {

          stack.push(interimElement);
          interimElement
            .show()
            .catch(function( reason ) {
              //$log.error("InterimElement.show() error: " + reason );
              return reason;
            });

        });

        // Return a promise that will be resolved when the interim
        // element is hidden or cancelled...

        return interimElement.deferred.promise;
      }

      /*
       * @ngdoc method
       * @name $$interimElement.$service#hide
       * @kind function
       *
       * @description
       * Removes the `$interimElement` from the DOM and resolves the promise returned from `show`
       *
       * @param {*} resolveParam Data to resolve the promise with
       * @returns a Promise that will be resolved after the element has been removed.
       *
       */
      function hide(reason, options) {
        if ( !stack.length ) return $q.when(reason);
        options = options || {};

        if (options.closeAll) {
          var promise = $q.all(stack.reverse().map(closeElement));
          stack = [];
          return promise;
        } else if (options.closeTo !== undefined) {
          return $q.all(stack.splice(options.closeTo).map(closeElement));
        } else {
          var interim = stack.pop();
          return closeElement(interim);
        }

        function closeElement(interim) {
          interim
            .remove(reason, false, options || { })
            .catch(function( reason ) {
              //$log.error("InterimElement.hide() error: " + reason );
              return reason;
            });
          return interim.deferred.promise;
        }
      }

      /*
       * @ngdoc method
       * @name $$interimElement.$service#cancel
       * @kind function
       *
       * @description
       * Removes the `$interimElement` from the DOM and rejects the promise returned from `show`
       *
       * @param {*} reason Data to reject the promise with
       * @returns Promise that will be resolved after the element has been removed.
       *
       */
      function cancel(reason, options) {
        var interim = stack.pop();
        if ( !interim ) return $q.when(reason);

        interim
          .remove(reason, true, options || { })
          .catch(function( reason ) {
            //$log.error("InterimElement.cancel() error: " + reason );
            return reason;
          });

        // Since Angular 1.6.7, promises will be logged to $exceptionHandler when the promise
        // is not handling the rejection. We create a pseudo catch handler, which will prevent the
        // promise from being logged to the $exceptionHandler.
        return interim.deferred.promise.catch(angular.noop);
      }

      /*
       * Special method to quick-remove the interim element without animations
       * Note: interim elements are in "interim containers"
       */
      function destroy(target) {
        var interim = !target ? stack.shift() : null;
        var cntr = angular.element(target).length ? angular.element(target)[0].parentNode : null;

        if (cntr) {
            // Try to find the interim element in the stack which corresponds to the supplied DOM element.
            var filtered = stack.filter(function(entry) {
                  var currNode = entry.options.element[0];
                  return  (currNode === cntr);
                });

            // Note: this function might be called when the element already has been removed, in which
            //       case we won't find any matches. That's ok.
            if (filtered.length > 0) {
              interim = filtered[0];
              stack.splice(stack.indexOf(interim), 1);
            }
        }

        return interim ? interim.remove(SHOW_CANCELLED, false, {'$destroy':true}) : $q.when(SHOW_CANCELLED);
      }

      /*
       * Internal Interim Element Object
       * Used internally to manage the DOM element and related data
       */
      function InterimElement(options) {
        var self, element, showAction = $q.when(true);

        options = configureScopeAndTransitions(options);

        return self = {
          options : options,
          deferred: $q.defer(),
          show    : createAndTransitionIn,
          remove  : transitionOutAndRemove
        };

        /**
         * Compile, link, and show this interim element
         * Use optional autoHided and transition-in effects
         */
        function createAndTransitionIn() {
          return $q(function(resolve, reject) {

            // Trigger onCompiling callback before the compilation starts.
            // This is useful, when modifying options, which can be influenced by developers.
            options.onCompiling && options.onCompiling(options);

            compileElement(options)
              .then(function( compiledData ) {
                element = linkElement( compiledData, options );

                showAction = showElement(element, options, compiledData.controller)
                  .then(resolve, rejectAll);

              }, rejectAll);

            function rejectAll(fault) {
              // Force the '$md<xxx>.show()' promise to reject
              self.deferred.reject(fault);

              // Continue rejection propagation
              reject(fault);
            }
          });
        }

        /**
         * After the show process has finished/rejected:
         * - announce 'removing',
         * - perform the transition-out, and
         * - perform optional clean up scope.
         */
        function transitionOutAndRemove(response, isCancelled, opts) {

          // abort if the show() and compile failed
          if ( !element ) return $q.when(false);

          options = angular.extend(options || {}, opts || {});
          options.cancelAutoHide && options.cancelAutoHide();
          options.element.triggerHandler('$mdInterimElementRemove');

          if ( options.$destroy === true ) {

            return hideElement(options.element, options).then(function(){
              (isCancelled && rejectAll(response)) || resolveAll(response);
            });

          } else {

            $q.when(showAction)
                .finally(function() {
                  hideElement(options.element, options).then(function() {

                    (isCancelled && rejectAll(response)) || resolveAll(response);

                  }, rejectAll);
                });

            return self.deferred.promise;
          }


          /**
           * The `show()` returns a promise that will be resolved when the interim
           * element is hidden or cancelled...
           */
          function resolveAll(response) {
            self.deferred.resolve(response);
          }

          /**
           * Force the '$md<xxx>.show()' promise to reject
           */
          function rejectAll(fault) {
            self.deferred.reject(fault);
          }
        }

        /**
         * Prepare optional isolated scope and prepare $animate with default enter and leave
         * transitions for the new element instance.
         */
        function configureScopeAndTransitions(options) {
          options = options || { };
          if ( options.template ) {
            options.template = $mdUtil.processTemplate(options.template);
          }

          return angular.extend({
            preserveScope: false,
            cancelAutoHide : angular.noop,
            scope: options.scope || $rootScope.$new(options.isolateScope),

            /**
             * Default usage to enable $animate to transition-in; can be easily overridden via 'options'
             */
            onShow: function transitionIn(scope, element, options) {
              return $animate.enter(element, options.parent);
            },

            /**
             * Default usage to enable $animate to transition-out; can be easily overridden via 'options'
             */
            onRemove: function transitionOut(scope, element) {
              // Element could be undefined if a new element is shown before
              // the old one finishes compiling.
              return element && $animate.leave(element) || $q.when();
            }
          }, options );

        }

        /**
         * Compile an element with a templateUrl, controller, and locals
         */
        function compileElement(options) {

          var compiled = !options.skipCompile ? $mdCompiler.compile(options) : null;

          return compiled || $q(function (resolve) {
              resolve({
                locals: {},
                link: function () {
                  return options.element;
                }
              });
            });
        }

        /**
         *  Link an element with compiled configuration
         */
        function linkElement(compileData, options){
          angular.extend(compileData.locals, options);

          var element = compileData.link(options.scope);

          // Search for parent at insertion time, if not specified
          options.element = element;
          options.parent = findParent(element, options);
          if (options.themable) $mdTheming(element);

          return element;
        }

        /**
         * Search for parent at insertion time, if not specified
         */
        function findParent(element, options) {
          var parent = options.parent;

          // Search for parent at insertion time, if not specified
          if (angular.isFunction(parent)) {
            parent = parent(options.scope, element, options);
          } else if (angular.isString(parent)) {
            parent = angular.element($document[0].querySelector(parent));
          } else {
            parent = angular.element(parent);
          }

          // If parent querySelector/getter function fails, or it's just null,
          // find a default.
          if (!(parent || {}).length) {
            var el;
            if ($rootElement[0] && $rootElement[0].querySelector) {
              el = $rootElement[0].querySelector(':not(svg) > body');
            }
            if (!el) el = $rootElement[0];
            if (el.nodeName == '#comment') {
              el = $document[0].body;
            }
            return angular.element(el);
          }

          return parent;
        }

        /**
         * If auto-hide is enabled, start timer and prepare cancel function
         */
        function startAutoHide() {
          var autoHideTimer, cancelAutoHide = angular.noop;

          if (options.hideDelay) {
            autoHideTimer = $timeout(service.hide, options.hideDelay) ;
            cancelAutoHide = function() {
              $timeout.cancel(autoHideTimer);
            }
          }

          // Cache for subsequent use
          options.cancelAutoHide = function() {
            cancelAutoHide();
            options.cancelAutoHide = undefined;
          }
        }

        /**
         * Show the element ( with transitions), notify complete and start
         * optional auto-Hide
         */
        function showElement(element, options, controller) {
          // Trigger onShowing callback before the `show()` starts
          var notifyShowing = options.onShowing || angular.noop;
          // Trigger onComplete callback when the `show()` finishes
          var notifyComplete = options.onComplete || angular.noop;

          notifyShowing(options.scope, element, options, controller);

          return $q(function (resolve, reject) {
            try {
              // Start transitionIn
              $q.when(options.onShow(options.scope, element, options, controller))
                .then(function () {
                  notifyComplete(options.scope, element, options);
                  startAutoHide();

                  resolve(element);

                }, reject );

            } catch(e) {
              reject(e.message);
            }
          });
        }

        function hideElement(element, options) {
          var announceRemoving = options.onRemoving || angular.noop;

          return $$q(function (resolve, reject) {
            try {
              // Start transitionIn
              var action = $$q.when( options.onRemove(options.scope, element, options) || true );

              // Trigger callback *before* the remove operation starts
              announceRemoving(element, action);

              if ( options.$destroy == true ) {

                // For $destroy, onRemove should be synchronous
                resolve(element);

              } else {

                // Wait until transition-out is done
                action.then(function () {

                  if (!options.preserveScope && options.scope ) {
                    options.scope.$destroy();
                  }

                  resolve(element);

                }, reject );
              }

            } catch(e) {
              reject(e);
            }
          });
        }

      }
    };

  }

}

})();
(function(){
"use strict";

(function() {
  'use strict';

  var $mdUtil, $interpolate, $log;

  var SUFFIXES = /(-gt)?-(sm|md|lg|print)/g;
  var WHITESPACE = /\s+/g;

  var FLEX_OPTIONS = ['grow', 'initial', 'auto', 'none', 'noshrink', 'nogrow' ];
  var LAYOUT_OPTIONS = ['row', 'column'];
  var ALIGNMENT_MAIN_AXIS= [ "", "start", "center", "end", "stretch", "space-around", "space-between" ];
  var ALIGNMENT_CROSS_AXIS= [ "", "start", "center", "end", "stretch" ];

  var config = {
    /**
     * Enable directive attribute-to-class conversions
     * Developers can use `<body md-layout-css />` to quickly
     * disable the Layout directives and prohibit the injection of Layout classNames
     */
    enabled: true,

    /**
     * List of mediaQuery breakpoints and associated suffixes
     *
     *   [
     *    { suffix: "sm", mediaQuery: "screen and (max-width: 599px)" },
     *    { suffix: "md", mediaQuery: "screen and (min-width: 600px) and (max-width: 959px)" }
     *   ]
     */
    breakpoints: []
  };

  registerLayoutAPI( angular.module('material.core.layout', ['ng']) );

  /**
   *   registerLayoutAPI()
   *
   *   The original ngMaterial Layout solution used attribute selectors and CSS.
   *
   *  ```html
   *  <div layout="column"> My Content </div>
   *  ```
   *
   *  ```css
   *  [layout] {
   *    box-sizing: border-box;
   *    display:flex;
   *  }
   *  [layout=column] {
   *    flex-direction : column
   *  }
   *  ```
   *
   *  Use of attribute selectors creates significant performance impacts in some
   *  browsers... mainly IE.
   *
   *  This module registers directives that allow the same layout attributes to be
   *  interpreted and converted to class selectors. The directive will add equivalent classes to each element that
   *  contains a Layout directive.
   *
   * ```html
   *   <div layout="column" class="layout layout-column"> My Content </div>
   *```
   *
   *  ```css
   *  .layout {
   *    box-sizing: border-box;
   *    display:flex;
   *  }
   *  .layout-column {
   *    flex-direction : column
   *  }
   *  ```
   */
  function registerLayoutAPI(module){
    var PREFIX_REGEXP = /^((?:x|data)[\:\-_])/i;
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;

    // NOTE: these are also defined in constants::MEDIA_PRIORITY and constants::MEDIA
    var BREAKPOINTS     = [ "", "xs", "gt-xs", "sm", "gt-sm", "md", "gt-md", "lg", "gt-lg", "xl", "print" ];
    var API_WITH_VALUES = [ "layout", "flex", "flex-order", "flex-offset", "layout-align" ];
    var API_NO_VALUES   = [ "show", "hide", "layout-padding", "layout-margin" ];


    // Build directive registration functions for the standard Layout API... for all breakpoints.
    angular.forEach(BREAKPOINTS, function(mqb) {

      // Attribute directives with expected, observable value(s)
      angular.forEach( API_WITH_VALUES, function(name){
        var fullName = mqb ? name + "-" + mqb : name;
        module.directive( directiveNormalize(fullName), attributeWithObserve(fullName));
      });

      // Attribute directives with no expected value(s)
      angular.forEach( API_NO_VALUES, function(name){
        var fullName = mqb ? name + "-" + mqb : name;
        module.directive( directiveNormalize(fullName), attributeWithoutValue(fullName));
      });

    });

    // Register other, special directive functions for the Layout features:
    module

      .provider('$$mdLayout'     , function() {
        // Publish internal service for Layouts
        return {
          $get : angular.noop,
          validateAttributeValue : validateAttributeValue,
          validateAttributeUsage : validateAttributeUsage,
          /**
           * Easy way to disable/enable the Layout API.
           * When disabled, this stops all attribute-to-classname generations
           */
          disableLayouts  : function(isDisabled) {
            config.enabled =  (isDisabled !== true);
          }
        };
      })

      .directive('mdLayoutCss'        , disableLayoutDirective )
      .directive('ngCloak'            , buildCloakInterceptor('ng-cloak'))

      .directive('layoutWrap'   , attributeWithoutValue('layout-wrap'))
      .directive('layoutNowrap' , attributeWithoutValue('layout-nowrap'))
      .directive('layoutNoWrap' , attributeWithoutValue('layout-no-wrap'))
      .directive('layoutFill'   , attributeWithoutValue('layout-fill'))

      // !! Deprecated attributes: use the `-lt` (aka less-than) notations

      .directive('layoutLtMd'     , warnAttrNotSupported('layout-lt-md', true))
      .directive('layoutLtLg'     , warnAttrNotSupported('layout-lt-lg', true))
      .directive('flexLtMd'       , warnAttrNotSupported('flex-lt-md', true))
      .directive('flexLtLg'       , warnAttrNotSupported('flex-lt-lg', true))

      .directive('layoutAlignLtMd', warnAttrNotSupported('layout-align-lt-md'))
      .directive('layoutAlignLtLg', warnAttrNotSupported('layout-align-lt-lg'))
      .directive('flexOrderLtMd'  , warnAttrNotSupported('flex-order-lt-md'))
      .directive('flexOrderLtLg'  , warnAttrNotSupported('flex-order-lt-lg'))
      .directive('offsetLtMd'     , warnAttrNotSupported('flex-offset-lt-md'))
      .directive('offsetLtLg'     , warnAttrNotSupported('flex-offset-lt-lg'))

      .directive('hideLtMd'       , warnAttrNotSupported('hide-lt-md'))
      .directive('hideLtLg'       , warnAttrNotSupported('hide-lt-lg'))
      .directive('showLtMd'       , warnAttrNotSupported('show-lt-md'))
      .directive('showLtLg'       , warnAttrNotSupported('show-lt-lg'))

      // Determine if
      .config( detectDisabledLayouts );

    /**
     * Converts snake_case to camelCase.
     * Also there is special case for Moz prefix starting with upper case letter.
     * @param name Name to normalize
     */
    function directiveNormalize(name) {
      return name
        .replace(PREFIX_REGEXP, '')
        .replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
          return offset ? letter.toUpperCase() : letter;
        });
    }

  }


  /**
    * Detect if any of the HTML tags has a [md-layouts-disabled] attribute;
    * If yes, then immediately disable all layout API features
    *
    * Note: this attribute should be specified on either the HTML or BODY tags
    */
   /**
    * @ngInject
    */
   function detectDisabledLayouts() {
     var isDisabled = !!document.querySelector('[md-layouts-disabled]');
     config.enabled = !isDisabled;
   }

  /**
   * Special directive that will disable ALL Layout conversions of layout
   * attribute(s) to classname(s).
   *
   * <link rel="stylesheet" href="angular-material.min.css">
   * <link rel="stylesheet" href="angular-material.layout.css">
   *
   * <body md-layout-css>
   *  ...
   * </body>
   *
   * Note: Using md-layout-css directive requires the developer to load the Material
   * Layout Attribute stylesheet (which only uses attribute selectors):
   *
   *       `angular-material.layout.css`
   *
   * Another option is to use the LayoutProvider to configure and disable the attribute
   * conversions; this would obviate the use of the `md-layout-css` directive
   *
   */
  function disableLayoutDirective() {
    // Return a 1x-only, first-match attribute directive
    config.enabled = false;

    return {
      restrict : 'A',
      priority : '900'
    };
  }

  /**
   * Tail-hook ngCloak to delay the uncloaking while Layout transformers
   * finish processing. Eliminates flicker with Material.Layoouts
   */
  function buildCloakInterceptor(className) {
    return [ '$timeout', function($timeout){
      return {
        restrict : 'A',
        priority : -10,   // run after normal ng-cloak
        compile  : function( element ) {
          if (!config.enabled) return angular.noop;

          // Re-add the cloak
          element.addClass(className);

          return function( scope, element ) {
            // Wait while layout injectors configure, then uncloak
            // NOTE: $rAF does not delay enough... and this is a 1x-only event,
            //       $timeout is acceptable.
            $timeout( function(){
              element.removeClass(className);
            }, 10, false);
          };
        }
      };
    }];
  }


  // *********************************************************************************
  //
  // These functions create registration functions for ngMaterial Layout attribute directives
  // This provides easy translation to switch ngMaterial attribute selectors to
  // CLASS selectors and directives; which has huge performance implications
  // for IE Browsers
  //
  // *********************************************************************************

  /**
   * Creates a directive registration function where a possible dynamic attribute
   * value will be observed/watched.
   * @param {string} className attribute name; eg `layout-gt-md` with value ="row"
   */
  function attributeWithObserve(className) {

    return ['$mdUtil', '$interpolate', "$log", function(_$mdUtil_, _$interpolate_, _$log_) {
      $mdUtil = _$mdUtil_;
      $interpolate = _$interpolate_;
      $log = _$log_;

      return {
        restrict: 'A',
        compile: function(element, attr) {
          var linkFn;
          if (config.enabled) {
            // immediately replace static (non-interpolated) invalid values...

            validateAttributeUsage(className, attr, element, $log);

            validateAttributeValue( className,
              getNormalizedAttrValue(className, attr, ""),
              buildUpdateFn(element, className, attr)
            );

            linkFn = translateWithValueToCssClass;
          }

          // Use for postLink to account for transforms after ng-transclude.
          return linkFn || angular.noop;
        }
      };
    }];

    /**
     * Add as transformed class selector(s), then
     * remove the deprecated attribute selector
     */
    function translateWithValueToCssClass(scope, element, attrs) {
      var updateFn = updateClassWithValue(element, className, attrs);
      var unwatch = attrs.$observe(attrs.$normalize(className), updateFn);

      updateFn(getNormalizedAttrValue(className, attrs, ""));
      scope.$on("$destroy", function() { unwatch() });
    }
  }

  /**
   * Creates a registration function for ngMaterial Layout attribute directive.
   * This is a `simple` transpose of attribute usage to class usage; where we ignore
   * any attribute value
   */
  function attributeWithoutValue(className) {
    return ['$mdUtil', '$interpolate', "$log", function(_$mdUtil_, _$interpolate_, _$log_) {
      $mdUtil = _$mdUtil_;
      $interpolate = _$interpolate_;
      $log = _$log_;

      return {
        restrict: 'A',
        compile: function(element, attr) {
          var linkFn;
          if (config.enabled) {
            // immediately replace static (non-interpolated) invalid values...

            validateAttributeValue( className,
              getNormalizedAttrValue(className, attr, ""),
              buildUpdateFn(element, className, attr)
            );

            translateToCssClass(null, element);

            // Use for postLink to account for transforms after ng-transclude.
            linkFn = translateToCssClass;
          }

          return linkFn || angular.noop;
        }
      };
    }];

    /**
     * Add as transformed class selector, then
     * remove the deprecated attribute selector
     */
    function translateToCssClass(scope, element) {
      element.addClass(className);
    }
  }



  /**
   * After link-phase, do NOT remove deprecated layout attribute selector.
   * Instead watch the attribute so interpolated data-bindings to layout
   * selectors will continue to be supported.
   *
   * $observe() the className and update with new class (after removing the last one)
   *
   * e.g. `layout="{{layoutDemo.direction}}"` will update...
   *
   * NOTE: The value must match one of the specified styles in the CSS.
   * For example `flex-gt-md="{{size}}`  where `scope.size == 47` will NOT work since
   * only breakpoints for 0, 5, 10, 15... 100, 33, 34, 66, 67 are defined.
   *
   */
  function updateClassWithValue(element, className) {
    var lastClass;

    return function updateClassFn(newValue) {
      var value = validateAttributeValue(className, newValue || "");
      if ( angular.isDefined(value) ) {
        if (lastClass) element.removeClass(lastClass);
        lastClass = !value ? className : className + "-" + value.replace(WHITESPACE, "-");
        element.addClass(lastClass);
      }
    };
  }

  /**
   * Provide console warning that this layout attribute has been deprecated
   *
   */
  function warnAttrNotSupported(className) {
    var parts = className.split("-");
    return ["$log", function($log) {
      $log.warn(className + "has been deprecated. Please use a `" + parts[0] + "-gt-<xxx>` variant.");
      return angular.noop;
    }];
  }

  /**
   * Centralize warnings for known flexbox issues (especially IE-related issues)
   */
  function validateAttributeUsage(className, attr, element, $log){
    var message, usage, url;
    var nodeName = element[0].nodeName.toLowerCase();

    switch(className.replace(SUFFIXES,"")) {
      case "flex":
        if ((nodeName == "md-button") || (nodeName == "fieldset")){
          // @see https://github.com/philipwalton/flexbugs#9-some-html-elements-cant-be-flex-containers
          // Use <div flex> wrapper inside (preferred) or outside

          usage = "<" + nodeName + " " + className + "></" + nodeName + ">";
          url = "https://github.com/philipwalton/flexbugs#9-some-html-elements-cant-be-flex-containers";
          message = "Markup '{0}' may not work as expected in IE Browsers. Consult '{1}' for details.";

          $log.warn( $mdUtil.supplant(message, [usage, url]) );
        }
    }

  }


  /**
   * For the Layout attribute value, validate or replace with default
   * fallback value
   */
  function validateAttributeValue(className, value, updateFn) {
    var origValue = value;

    if (!needsInterpolation(value)) {
      switch (className.replace(SUFFIXES,"")) {
        case 'layout'        :
          if ( !findIn(value, LAYOUT_OPTIONS) ) {
            value = LAYOUT_OPTIONS[0];    // 'row';
          }
          break;

        case 'flex'          :
          if (!findIn(value, FLEX_OPTIONS)) {
            if (isNaN(value)) {
              value = '';
            }
          }
          break;

        case 'flex-offset' :
        case 'flex-order'    :
          if (!value || isNaN(+value)) {
            value = '0';
          }
          break;

        case 'layout-align'  :
          var axis = extractAlignAxis(value);
          value = $mdUtil.supplant("{main}-{cross}",axis);
          break;

        case 'layout-padding' :
        case 'layout-margin'  :
        case 'layout-fill'    :
        case 'layout-wrap'    :
        case 'layout-nowrap'  :
        case 'layout-nowrap' :
          value = '';
          break;
      }

      if (value != origValue) {
        (updateFn || angular.noop)(value);
      }
    }

    return value;
  }

  /**
   * Replace current attribute value with fallback value
   */
  function buildUpdateFn(element, className, attrs) {
    return function updateAttrValue(fallback) {
      if (!needsInterpolation(fallback)) {
        // Do not modify the element's attribute value; so
        // uses '<ui-layout layout="/api/sidebar.html" />' will not
        // be affected. Just update the attrs value.
        attrs[attrs.$normalize(className)] = fallback;
      }
    };
  }

  /**
   * See if the original value has interpolation symbols:
   * e.g.  flex-gt-md="{{triggerPoint}}"
   */
  function needsInterpolation(value) {
    return (value || "").indexOf($interpolate.startSymbol()) > -1;
  }

  function getNormalizedAttrValue(className, attrs, defaultVal) {
    var normalizedAttr = attrs.$normalize(className);
    return attrs[normalizedAttr] ? attrs[normalizedAttr].replace(WHITESPACE, "-") : defaultVal || null;
  }

  function findIn(item, list, replaceWith) {
    item = replaceWith && item ? item.replace(WHITESPACE, replaceWith) : item;

    var found = false;
    if (item) {
      list.forEach(function(it) {
        it = replaceWith ? it.replace(WHITESPACE, replaceWith) : it;
        found = found || (it === item);
      });
    }
    return found;
  }

  function extractAlignAxis(attrValue) {
    var axis = {
      main : "start",
      cross: "stretch"
    }, values;

    attrValue = (attrValue || "");

    if ( attrValue.indexOf("-") == 0 || attrValue.indexOf(" ") == 0) {
      // For missing main-axis values
      attrValue = "none" + attrValue;
    }

    values = attrValue.toLowerCase().trim().replace(WHITESPACE, "-").split("-");
    if ( values.length && (values[0] === "space") ) {
      // for main-axis values of "space-around" or "space-between"
      values = [ values[0]+"-"+values[1],values[2] ];
    }

    if ( values.length > 0 ) axis.main  = values[0] || axis.main;
    if ( values.length > 1 ) axis.cross = values[1] || axis.cross;

    if ( ALIGNMENT_MAIN_AXIS.indexOf(axis.main) < 0 )   axis.main = "start";
    if ( ALIGNMENT_CROSS_AXIS.indexOf(axis.cross) < 0 ) axis.cross = "stretch";

    return axis;
  }


})();

})();
(function(){
"use strict";

  /**
   * @ngdoc module
   * @name material.core.componentRegistry
   *
   * @description
   * A component instance registration service.
   * Note: currently this as a private service in the SideNav component.
   */
  angular.module('material.core')
    .factory('$mdComponentRegistry', ComponentRegistry);

  /*
   * @private
   * @ngdoc factory
   * @name ComponentRegistry
   * @module material.core.componentRegistry
   *
   */
  function ComponentRegistry($log, $q) {

    var self;
    var instances = [ ];
    var pendings = { };

    return self = {
      /**
       * Used to print an error when an instance for a handle isn't found.
       */
      notFoundError: function(handle, msgContext) {
        $log.error( (msgContext || "") + 'No instance found for handle', handle);
      },
      /**
       * Return all registered instances as an array.
       */
      getInstances: function() {
        return instances;
      },

      /**
       * Get a registered instance.
       * @param handle the String handle to look up for a registered instance.
       */
      get: function(handle) {
        if ( !isValidID(handle) ) return null;

        var i, j, instance;
        for(i = 0, j = instances.length; i < j; i++) {
          instance = instances[i];
          if(instance.$$mdHandle === handle) {
            return instance;
          }
        }
        return null;
      },

      /**
       * Register an instance.
       * @param instance the instance to register
       * @param handle the handle to identify the instance under.
       */
      register: function(instance, handle) {
        if ( !handle ) return angular.noop;

        instance.$$mdHandle = handle;
        instances.push(instance);
        resolveWhen();

        return deregister;

        /**
         * Remove registration for an instance
         */
        function deregister() {
          var index = instances.indexOf(instance);
          if (index !== -1) {
            instances.splice(index, 1);
          }
        }

        /**
         * Resolve any pending promises for this instance
         */
        function resolveWhen() {
          var dfd = pendings[handle];
          if ( dfd ) {
            dfd.forEach(function (promise) {
              promise.resolve(instance);
            });
            delete pendings[handle];
          }
        }
      },

      /**
       * Async accessor to registered component instance
       * If not available then a promise is created to notify
       * all listeners when the instance is registered.
       */
      when : function(handle) {
        if ( isValidID(handle) ) {
          var deferred = $q.defer();
          var instance = self.get(handle);

          if ( instance )  {
            deferred.resolve( instance );
          } else {
            if (pendings[handle] === undefined) {
              pendings[handle] = [];
            }
            pendings[handle].push(deferred);
          }

          return deferred.promise;
        }
        return $q.reject("Invalid `md-component-id` value.");
      }

    };

    function isValidID(handle){
      return handle && (handle !== "");
    }

  }
  ComponentRegistry.$inject = ["$log", "$q"];

})();
(function(){
"use strict";

(function() {
  'use strict';

  /**
   * @ngdoc service
   * @name $mdButtonInkRipple
   * @module material.core
   *
   * @description
   * Provides ripple effects for md-button.  See $mdInkRipple service for all possible configuration options.
   *
   * @param {object=} scope Scope within the current context
   * @param {object=} element The element the ripple effect should be applied to
   * @param {object=} options (Optional) Configuration options to override the default ripple configuration
   */

  angular.module('material.core')
    .factory('$mdButtonInkRipple', MdButtonInkRipple);

  function MdButtonInkRipple($mdInkRipple) {
    return {
      attach: function attachRipple(scope, element, options) {
        options = angular.extend(optionsForElement(element), options);

        return $mdInkRipple.attach(scope, element, options);
      }
    };

    function optionsForElement(element) {
      if (element.hasClass('md-icon-button')) {
        return {
          isMenuItem: element.hasClass('md-menu-item'),
          fitRipple: true,
          center: true
        };
      } else {
        return {
          isMenuItem: element.hasClass('md-menu-item'),
          dimBackground: true
        }
      }
    };
  }
  MdButtonInkRipple.$inject = ["$mdInkRipple"];;
})();

})();
(function(){
"use strict";

(function() {
  'use strict';

    /**
   * @ngdoc service
   * @name $mdCheckboxInkRipple
   * @module material.core
   *
   * @description
   * Provides ripple effects for md-checkbox.  See $mdInkRipple service for all possible configuration options.
   *
   * @param {object=} scope Scope within the current context
   * @param {object=} element The element the ripple effect should be applied to
   * @param {object=} options (Optional) Configuration options to override the defaultripple configuration
   */

  angular.module('material.core')
    .factory('$mdCheckboxInkRipple', MdCheckboxInkRipple);

  function MdCheckboxInkRipple($mdInkRipple) {
    return {
      attach: attach
    };

    function attach(scope, element, options) {
      return $mdInkRipple.attach(scope, element, angular.extend({
        center: true,
        dimBackground: false,
        fitRipple: true
      }, options));
    };
  }
  MdCheckboxInkRipple.$inject = ["$mdInkRipple"];;
})();

})();
(function(){
"use strict";

(function() {
  'use strict';

  /**
   * @ngdoc service
   * @name $mdListInkRipple
   * @module material.core
   *
   * @description
   * Provides ripple effects for md-list.  See $mdInkRipple service for all possible configuration options.
   *
   * @param {object=} scope Scope within the current context
   * @param {object=} element The element the ripple effect should be applied to
   * @param {object=} options (Optional) Configuration options to override the defaultripple configuration
   */

  angular.module('material.core')
    .factory('$mdListInkRipple', MdListInkRipple);

  function MdListInkRipple($mdInkRipple) {
    return {
      attach: attach
    };

    function attach(scope, element, options) {
      return $mdInkRipple.attach(scope, element, angular.extend({
        center: false,
        dimBackground: true,
        outline: false,
        rippleSize: 'full'
      }, options));
    };
  }
  MdListInkRipple.$inject = ["$mdInkRipple"];;
})();

})();
(function(){
"use strict";

/**
 * @ngdoc module
 * @name material.core.ripple
 * @description
 * Ripple
 */
angular.module('material.core')
    .provider('$mdInkRipple', InkRippleProvider)
    .directive('mdInkRipple', InkRippleDirective)
    .directive('mdNoInk', attrNoDirective)
    .directive('mdNoBar', attrNoDirective)
    .directive('mdNoStretch', attrNoDirective);

var DURATION = 450;

/**
 * @ngdoc directive
 * @name mdInkRipple
 * @module material.core.ripple
 *
 * @description
 * The `md-ink-ripple` directive allows you to specify the ripple color or id a ripple is allowed.
 *
 * @param {string|boolean} md-ink-ripple A color string `#FF0000` or boolean (`false` or `0`) for preventing ripple
 *
 * @usage
 * ### String values
 * <hljs lang="html">
 *   <ANY md-ink-ripple="#FF0000">
 *     Ripples in red
 *   </ANY>
 *
 *   <ANY md-ink-ripple="false">
 *     Not rippling
 *   </ANY>
 * </hljs>
 *
 * ### Interpolated values
 * <hljs lang="html">
 *   <ANY md-ink-ripple="{{ randomColor() }}">
 *     Ripples with the return value of 'randomColor' function
 *   </ANY>
 *
 *   <ANY md-ink-ripple="{{ canRipple() }}">
 *     Ripples if 'canRipple' function return value is not 'false' or '0'
 *   </ANY>
 * </hljs>
 */
function InkRippleDirective ($mdButtonInkRipple, $mdCheckboxInkRipple) {
  return {
    controller: angular.noop,
    link:       function (scope, element, attr) {
      attr.hasOwnProperty('mdInkRippleCheckbox')
          ? $mdCheckboxInkRipple.attach(scope, element)
          : $mdButtonInkRipple.attach(scope, element);
    }
  };
}
InkRippleDirective.$inject = ["$mdButtonInkRipple", "$mdCheckboxInkRipple"];

/**
 * @ngdoc service
 * @name $mdInkRipple
 * @module material.core.ripple
 *
 * @description
 * `$mdInkRipple` is a service for adding ripples to any element
 *
 * @usage
 * <hljs lang="js">
 * app.factory('$myElementInkRipple', function($mdInkRipple) {
 *   return {
 *     attach: function (scope, element, options) {
 *       return $mdInkRipple.attach(scope, element, angular.extend({
 *         center: false,
 *         dimBackground: true
 *       }, options));
 *     }
 *   };
 * });
 *
 * app.controller('myController', function ($scope, $element, $myElementInkRipple) {
 *   $scope.onClick = function (ev) {
 *     $myElementInkRipple.attach($scope, angular.element(ev.target), { center: true });
 *   }
 * });
 * </hljs>
 *
 * ### Disabling ripples globally
 * If you want to disable ink ripples globally, for all components, you can call the
 * `disableInkRipple` method in your app's config.
 *
 * <hljs lang="js">
 * app.config(function ($mdInkRippleProvider) {
 *   $mdInkRippleProvider.disableInkRipple();
 * });
 */

function InkRippleProvider () {
  var isDisabledGlobally = false;

  return {
    disableInkRipple: disableInkRipple,
    $get: ["$injector", function($injector) {
      return { attach: attach };

      /**
       * @ngdoc method
       * @name $mdInkRipple#attach
       *
       * @description
       * Attaching given scope, element and options to inkRipple controller
       *
       * @param {object=} scope Scope within the current context
       * @param {object=} element The element the ripple effect should be applied to
       * @param {object=} options (Optional) Configuration options to override the defaultRipple configuration
       * * `center` -  Whether the ripple should start from the center of the container element
       * * `dimBackground` - Whether the background should be dimmed with the ripple color
       * * `colorElement` - The element the ripple should take its color from, defined by css property `color`
       * * `fitRipple` - Whether the ripple should fill the element
       */
      function attach (scope, element, options) {
        if (isDisabledGlobally || element.controller('mdNoInk')) return angular.noop;
        return $injector.instantiate(InkRippleCtrl, {
          $scope:        scope,
          $element:      element,
          rippleOptions: options
        });
      }
    }]
  };

  /**
   * @ngdoc method
   * @name $mdInkRipple#disableInkRipple
   *
   * @description
   * A config-time method that, when called, disables ripples globally.
   */
  function disableInkRipple () {
    isDisabledGlobally = true;
  }
}

/**
 * Controller used by the ripple service in order to apply ripples
 * @ngInject
 */
function InkRippleCtrl ($scope, $element, rippleOptions, $window, $timeout, $mdUtil, $mdColorUtil) {
  this.$window    = $window;
  this.$timeout   = $timeout;
  this.$mdUtil    = $mdUtil;
  this.$mdColorUtil    = $mdColorUtil;
  this.$scope     = $scope;
  this.$element   = $element;
  this.options    = rippleOptions;
  this.mousedown  = false;
  this.ripples    = [];
  this.timeout    = null; // Stores a reference to the most-recent ripple timeout
  this.lastRipple = null;

  $mdUtil.valueOnUse(this, 'container', this.createContainer);

  this.$element.addClass('md-ink-ripple');

  // attach method for unit tests
  ($element.controller('mdInkRipple') || {}).createRipple = angular.bind(this, this.createRipple);
  ($element.controller('mdInkRipple') || {}).setColor = angular.bind(this, this.color);

  this.bindEvents();
}
InkRippleCtrl.$inject = ["$scope", "$element", "rippleOptions", "$window", "$timeout", "$mdUtil", "$mdColorUtil"];


/**
 * Either remove or unlock any remaining ripples when the user mouses off of the element (either by
 * mouseup or mouseleave event)
 */
function autoCleanup (self, cleanupFn) {

  if ( self.mousedown || self.lastRipple ) {
    self.mousedown = false;
    self.$mdUtil.nextTick( angular.bind(self, cleanupFn), false);
  }

}


/**
 * Returns the color that the ripple should be (either based on CSS or hard-coded)
 * @returns {string}
 */
InkRippleCtrl.prototype.color = function (value) {
  var self = this;

  // If assigning a color value, apply it to background and the ripple color
  if (angular.isDefined(value)) {
    self._color = self._parseColor(value);
  }

  // If color lookup, use assigned, defined, or inherited
  return self._color || self._parseColor( self.inkRipple() ) || self._parseColor( getElementColor() );

  /**
   * Finds the color element and returns its text color for use as default ripple color
   * @returns {string}
   */
  function getElementColor () {
    var items = self.options && self.options.colorElement ? self.options.colorElement : [];
    var elem =  items.length ? items[ 0 ] : self.$element[ 0 ];

    return elem ? self.$window.getComputedStyle(elem).color : 'rgb(0,0,0)';
  }
};

/**
 * Updating the ripple colors based on the current inkRipple value
 * or the element's computed style color
 */
InkRippleCtrl.prototype.calculateColor = function () {
  return this.color();
};


/**
 * Takes a string color and converts it to RGBA format
 * @param color {string}
 * @param [multiplier] {int}
 * @returns {string}
 */

InkRippleCtrl.prototype._parseColor = function parseColor (color, multiplier) {
  multiplier = multiplier || 1;
  var colorUtil = this.$mdColorUtil;

  if (!color) return;
  if (color.indexOf('rgba') === 0) return color.replace(/\d?\.?\d*\s*\)\s*$/, (0.1 * multiplier).toString() + ')');
  if (color.indexOf('rgb') === 0) return colorUtil.rgbToRgba(color);
  if (color.indexOf('#') === 0) return colorUtil.hexToRgba(color);

};

/**
 * Binds events to the root element for
 */
InkRippleCtrl.prototype.bindEvents = function () {
  this.$element.on('mousedown', angular.bind(this, this.handleMousedown));
  this.$element.on('mouseup touchend', angular.bind(this, this.handleMouseup));
  this.$element.on('mouseleave', angular.bind(this, this.handleMouseup));
  this.$element.on('touchmove', angular.bind(this, this.handleTouchmove));
};

/**
 * Create a new ripple on every mousedown event from the root element
 * @param event {MouseEvent}
 */
InkRippleCtrl.prototype.handleMousedown = function (event) {
  if ( this.mousedown ) return;

  // When jQuery is loaded, we have to get the original event
  if (event.hasOwnProperty('originalEvent')) event = event.originalEvent;
  this.mousedown = true;
  if (this.options.center) {
    this.createRipple(this.container.prop('clientWidth') / 2, this.container.prop('clientWidth') / 2);
  } else {

    // We need to calculate the relative coordinates if the target is a sublayer of the ripple element
    if (event.srcElement !== this.$element[0]) {
      var layerRect = this.$element[0].getBoundingClientRect();
      var layerX = event.clientX - layerRect.left;
      var layerY = event.clientY - layerRect.top;

      this.createRipple(layerX, layerY);
    } else {
      this.createRipple(event.offsetX, event.offsetY);
    }
  }
};

/**
 * Either remove or unlock any remaining ripples when the user mouses off of the element (either by
 * mouseup, touchend or mouseleave event)
 */
InkRippleCtrl.prototype.handleMouseup = function () {
  autoCleanup(this, this.clearRipples);
};

/**
 * Either remove or unlock any remaining ripples when the user mouses off of the element (by
 * touchmove)
 */
InkRippleCtrl.prototype.handleTouchmove = function () {
  autoCleanup(this, this.deleteRipples);
};

/**
 * Cycles through all ripples and attempts to remove them.
 */
InkRippleCtrl.prototype.deleteRipples = function () {
  for (var i = 0; i < this.ripples.length; i++) {
    this.ripples[ i ].remove();
  }
};

/**
 * Cycles through all ripples and attempts to remove them with fade.
 * Depending on logic within `fadeInComplete`, some removals will be postponed.
 */
InkRippleCtrl.prototype.clearRipples = function () {
  for (var i = 0; i < this.ripples.length; i++) {
    this.fadeInComplete(this.ripples[ i ]);
  }
};

/**
 * Creates the ripple container element
 * @returns {*}
 */
InkRippleCtrl.prototype.createContainer = function () {
  var container = angular.element('<div class="md-ripple-container"></div>');
  this.$element.append(container);
  return container;
};

InkRippleCtrl.prototype.clearTimeout = function () {
  if (this.timeout) {
    this.$timeout.cancel(this.timeout);
    this.timeout = null;
  }
};

InkRippleCtrl.prototype.isRippleAllowed = function () {
  var element = this.$element[0];
  do {
    if (!element.tagName || element.tagName === 'BODY') break;

    if (element && angular.isFunction(element.hasAttribute)) {
      if (element.hasAttribute('disabled')) return false;
      if (this.inkRipple() === 'false' || this.inkRipple() === '0') return false;
    }

  } while (element = element.parentNode);
  return true;
};

/**
 * The attribute `md-ink-ripple` may be a static or interpolated
 * color value OR a boolean indicator (used to disable ripples)
 */
InkRippleCtrl.prototype.inkRipple = function () {
  return this.$element.attr('md-ink-ripple');
};

/**
 * Creates a new ripple and adds it to the container.  Also tracks ripple in `this.ripples`.
 * @param left
 * @param top
 */
InkRippleCtrl.prototype.createRipple = function (left, top) {
  if (!this.isRippleAllowed()) return;

  var ctrl        = this;
  var colorUtil   = ctrl.$mdColorUtil;
  var ripple      = angular.element('<div class="md-ripple"></div>');
  var width       = this.$element.prop('clientWidth');
  var height      = this.$element.prop('clientHeight');
  var x           = Math.max(Math.abs(width - left), left) * 2;
  var y           = Math.max(Math.abs(height - top), top) * 2;
  var size        = getSize(this.options.fitRipple, x, y);
  var color       = this.calculateColor();

  ripple.css({
    left:            left + 'px',
    top:             top + 'px',
    background:      'black',
    width:           size + 'px',
    height:          size + 'px',
    backgroundColor: colorUtil.rgbaToRgb(color),
    borderColor:     colorUtil.rgbaToRgb(color)
  });
  this.lastRipple = ripple;

  // we only want one timeout to be running at a time
  this.clearTimeout();
  this.timeout    = this.$timeout(function () {
    ctrl.clearTimeout();
    if (!ctrl.mousedown) ctrl.fadeInComplete(ripple);
  }, DURATION * 0.35, false);

  if (this.options.dimBackground) this.container.css({ backgroundColor: color });
  this.container.append(ripple);
  this.ripples.push(ripple);
  ripple.addClass('md-ripple-placed');

  this.$mdUtil.nextTick(function () {

    ripple.addClass('md-ripple-scaled md-ripple-active');
    ctrl.$timeout(function () {
      ctrl.clearRipples();
    }, DURATION, false);

  }, false);

  function getSize (fit, x, y) {
    return fit
        ? Math.max(x, y)
        : Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  }
};



/**
 * After fadeIn finishes, either kicks off the fade-out animation or queues the element for removal on mouseup
 * @param ripple
 */
InkRippleCtrl.prototype.fadeInComplete = function (ripple) {
  if (this.lastRipple === ripple) {
    if (!this.timeout && !this.mousedown) {
      this.removeRipple(ripple);
    }
  } else {
    this.removeRipple(ripple);
  }
};

/**
 * Kicks off the animation for removing a ripple
 * @param ripple {Element}
 */
InkRippleCtrl.prototype.removeRipple = function (ripple) {
  var ctrl  = this;
  var index = this.ripples.indexOf(ripple);
  if (index < 0) return;
  this.ripples.splice(this.ripples.indexOf(ripple), 1);
  ripple.removeClass('md-ripple-active');
  ripple.addClass('md-ripple-remove');
  if (this.ripples.length === 0) this.container.css({ backgroundColor: '' });
  // use a 2-second timeout in order to allow for the animation to finish
  // we don't actually care how long the animation takes
  this.$timeout(function () {
    ctrl.fadeOutComplete(ripple);
  }, DURATION, false);
};

/**
 * Removes the provided ripple from the DOM
 * @param ripple
 */
InkRippleCtrl.prototype.fadeOutComplete = function (ripple) {
  ripple.remove();
  this.lastRipple = null;
};

/**
 * Used to create an empty directive.  This is used to track flag-directives whose children may have
 * functionality based on them.
 *
 * Example: `md-no-ink` will potentially be used by all child directives.
 */
function attrNoDirective () {
  return { controller: angular.noop };
}

})();
(function(){
"use strict";

(function() {
  'use strict';

    /**
   * @ngdoc service
   * @name $mdTabInkRipple
   * @module material.core
   *
   * @description
   * Provides ripple effects for md-tabs.  See $mdInkRipple service for all possible configuration options.
   *
   * @param {object=} scope Scope within the current context
   * @param {object=} element The element the ripple effect should be applied to
   * @param {object=} options (Optional) Configuration options to override the defaultripple configuration
   */

  angular.module('material.core')
    .factory('$mdTabInkRipple', MdTabInkRipple);

  function MdTabInkRipple($mdInkRipple) {
    return {
      attach: attach
    };

    function attach(scope, element, options) {
      return $mdInkRipple.attach(scope, element, angular.extend({
        center: false,
        dimBackground: true,
        outline: false,
        rippleSize: 'full'
      }, options));
    };
  }
  MdTabInkRipple.$inject = ["$mdInkRipple"];;
})();

})();
(function(){
"use strict";

angular.module('material.core.theming.palette', [])
.constant('$mdColorPalette', {
  'red': {
    '50': '#ffebee',
    '100': '#ffcdd2',
    '200': '#ef9a9a',
    '300': '#e57373',
    '400': '#ef5350',
    '500': '#f44336',
    '600': '#e53935',
    '700': '#d32f2f',
    '800': '#c62828',
    '900': '#b71c1c',
    'A100': '#ff8a80',
    'A200': '#ff5252',
    'A400': '#ff1744',
    'A700': '#d50000',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 A100',
    'contrastStrongLightColors': '400 500 600 700 A200 A400 A700'
  },
  'pink': {
    '50': '#fce4ec',
    '100': '#f8bbd0',
    '200': '#f48fb1',
    '300': '#f06292',
    '400': '#ec407a',
    '500': '#e91e63',
    '600': '#d81b60',
    '700': '#c2185b',
    '800': '#ad1457',
    '900': '#880e4f',
    'A100': '#ff80ab',
    'A200': '#ff4081',
    'A400': '#f50057',
    'A700': '#c51162',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 A100',
    'contrastStrongLightColors': '500 600 A200 A400 A700'
  },
  'purple': {
    '50': '#f3e5f5',
    '100': '#e1bee7',
    '200': '#ce93d8',
    '300': '#ba68c8',
    '400': '#ab47bc',
    '500': '#9c27b0',
    '600': '#8e24aa',
    '700': '#7b1fa2',
    '800': '#6a1b9a',
    '900': '#4a148c',
    'A100': '#ea80fc',
    'A200': '#e040fb',
    'A400': '#d500f9',
    'A700': '#aa00ff',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 A100',
    'contrastStrongLightColors': '300 400 A200 A400 A700'
  },
  'deep-purple': {
    '50': '#ede7f6',
    '100': '#d1c4e9',
    '200': '#b39ddb',
    '300': '#9575cd',
    '400': '#7e57c2',
    '500': '#673ab7',
    '600': '#5e35b1',
    '700': '#512da8',
    '800': '#4527a0',
    '900': '#311b92',
    'A100': '#b388ff',
    'A200': '#7c4dff',
    'A400': '#651fff',
    'A700': '#6200ea',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 A100',
    'contrastStrongLightColors': '300 400 A200'
  },
  'indigo': {
    '50': '#e8eaf6',
    '100': '#c5cae9',
    '200': '#9fa8da',
    '300': '#7986cb',
    '400': '#5c6bc0',
    '500': '#3f51b5',
    '600': '#3949ab',
    '700': '#303f9f',
    '800': '#283593',
    '900': '#1a237e',
    'A100': '#8c9eff',
    'A200': '#536dfe',
    'A400': '#3d5afe',
    'A700': '#304ffe',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 A100',
    'contrastStrongLightColors': '300 400 A200 A400'
  },
  'blue': {
    '50': '#e3f2fd',
    '100': '#bbdefb',
    '200': '#90caf9',
    '300': '#64b5f6',
    '400': '#42a5f5',
    '500': '#2196f3',
    '600': '#1e88e5',
    '700': '#1976d2',
    '800': '#1565c0',
    '900': '#0d47a1',
    'A100': '#82b1ff',
    'A200': '#448aff',
    'A400': '#2979ff',
    'A700': '#2962ff',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 400 A100',
    'contrastStrongLightColors': '500 600 700 A200 A400 A700'
  },
  'light-blue': {
    '50': '#e1f5fe',
    '100': '#b3e5fc',
    '200': '#81d4fa',
    '300': '#4fc3f7',
    '400': '#29b6f6',
    '500': '#03a9f4',
    '600': '#039be5',
    '700': '#0288d1',
    '800': '#0277bd',
    '900': '#01579b',
    'A100': '#80d8ff',
    'A200': '#40c4ff',
    'A400': '#00b0ff',
    'A700': '#0091ea',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '600 700 800 900 A700',
    'contrastStrongLightColors': '600 700 800 A700'
  },
  'cyan': {
    '50': '#e0f7fa',
    '100': '#b2ebf2',
    '200': '#80deea',
    '300': '#4dd0e1',
    '400': '#26c6da',
    '500': '#00bcd4',
    '600': '#00acc1',
    '700': '#0097a7',
    '800': '#00838f',
    '900': '#006064',
    'A100': '#84ffff',
    'A200': '#18ffff',
    'A400': '#00e5ff',
    'A700': '#00b8d4',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '700 800 900',
    'contrastStrongLightColors': '700 800 900'
  },
  'teal': {
    '50': '#e0f2f1',
    '100': '#b2dfdb',
    '200': '#80cbc4',
    '300': '#4db6ac',
    '400': '#26a69a',
    '500': '#009688',
    '600': '#00897b',
    '700': '#00796b',
    '800': '#00695c',
    '900': '#004d40',
    'A100': '#a7ffeb',
    'A200': '#64ffda',
    'A400': '#1de9b6',
    'A700': '#00bfa5',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '500 600 700 800 900',
    'contrastStrongLightColors': '500 600 700'
  },
  'green': {
    '50': '#e8f5e9',
    '100': '#c8e6c9',
    '200': '#a5d6a7',
    '300': '#81c784',
    '400': '#66bb6a',
    '500': '#4caf50',
    '600': '#43a047',
    '700': '#388e3c',
    '800': '#2e7d32',
    '900': '#1b5e20',
    'A100': '#b9f6ca',
    'A200': '#69f0ae',
    'A400': '#00e676',
    'A700': '#00c853',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '500 600 700 800 900',
    'contrastStrongLightColors': '500 600 700'
  },
  'light-green': {
    '50': '#f1f8e9',
    '100': '#dcedc8',
    '200': '#c5e1a5',
    '300': '#aed581',
    '400': '#9ccc65',
    '500': '#8bc34a',
    '600': '#7cb342',
    '700': '#689f38',
    '800': '#558b2f',
    '900': '#33691e',
    'A100': '#ccff90',
    'A200': '#b2ff59',
    'A400': '#76ff03',
    'A700': '#64dd17',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '700 800 900',
    'contrastStrongLightColors': '700 800 900'
  },
  'lime': {
    '50': '#f9fbe7',
    '100': '#f0f4c3',
    '200': '#e6ee9c',
    '300': '#dce775',
    '400': '#d4e157',
    '500': '#cddc39',
    '600': '#c0ca33',
    '700': '#afb42b',
    '800': '#9e9d24',
    '900': '#827717',
    'A100': '#f4ff81',
    'A200': '#eeff41',
    'A400': '#c6ff00',
    'A700': '#aeea00',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '900',
    'contrastStrongLightColors': '900'
  },
  'yellow': {
    '50': '#fffde7',
    '100': '#fff9c4',
    '200': '#fff59d',
    '300': '#fff176',
    '400': '#ffee58',
    '500': '#ffeb3b',
    '600': '#fdd835',
    '700': '#fbc02d',
    '800': '#f9a825',
    '900': '#f57f17',
    'A100': '#ffff8d',
    'A200': '#ffff00',
    'A400': '#ffea00',
    'A700': '#ffd600',
    'contrastDefaultColor': 'dark'
  },
  'amber': {
    '50': '#fff8e1',
    '100': '#ffecb3',
    '200': '#ffe082',
    '300': '#ffd54f',
    '400': '#ffca28',
    '500': '#ffc107',
    '600': '#ffb300',
    '700': '#ffa000',
    '800': '#ff8f00',
    '900': '#ff6f00',
    'A100': '#ffe57f',
    'A200': '#ffd740',
    'A400': '#ffc400',
    'A700': '#ffab00',
    'contrastDefaultColor': 'dark'
  },
  'orange': {
    '50': '#fff3e0',
    '100': '#ffe0b2',
    '200': '#ffcc80',
    '300': '#ffb74d',
    '400': '#ffa726',
    '500': '#ff9800',
    '600': '#fb8c00',
    '700': '#f57c00',
    '800': '#ef6c00',
    '900': '#e65100',
    'A100': '#ffd180',
    'A200': '#ffab40',
    'A400': '#ff9100',
    'A700': '#ff6d00',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '800 900',
    'contrastStrongLightColors': '800 900'
  },
  'deep-orange': {
    '50': '#fbe9e7',
    '100': '#ffccbc',
    '200': '#ffab91',
    '300': '#ff8a65',
    '400': '#ff7043',
    '500': '#ff5722',
    '600': '#f4511e',
    '700': '#e64a19',
    '800': '#d84315',
    '900': '#bf360c',
    'A100': '#ff9e80',
    'A200': '#ff6e40',
    'A400': '#ff3d00',
    'A700': '#dd2c00',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 400 A100 A200',
    'contrastStrongLightColors': '500 600 700 800 900 A400 A700'
  },
  'brown': {
    '50': '#efebe9',
    '100': '#d7ccc8',
    '200': '#bcaaa4',
    '300': '#a1887f',
    '400': '#8d6e63',
    '500': '#795548',
    '600': '#6d4c41',
    '700': '#5d4037',
    '800': '#4e342e',
    '900': '#3e2723',
    'A100': '#d7ccc8',
    'A200': '#bcaaa4',
    'A400': '#8d6e63',
    'A700': '#5d4037',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 A100 A200',
    'contrastStrongLightColors': '300 400'
  },
  'grey': {
    '50': '#fafafa',
    '100': '#f5f5f5',
    '200': '#eeeeee',
    '300': '#e0e0e0',
    '400': '#bdbdbd',
    '500': '#9e9e9e',
    '600': '#757575',
    '700': '#616161',
    '800': '#424242',
    '900': '#212121',
    'A100': '#ffffff',
    'A200': '#000000',
    'A400': '#303030',
    'A700': '#616161',
    'contrastDefaultColor': 'dark',
    'contrastLightColors': '600 700 800 900 A200 A400 A700'
  },
  'blue-grey': {
    '50': '#eceff1',
    '100': '#cfd8dc',
    '200': '#b0bec5',
    '300': '#90a4ae',
    '400': '#78909c',
    '500': '#607d8b',
    '600': '#546e7a',
    '700': '#455a64',
    '800': '#37474f',
    '900': '#263238',
    'A100': '#cfd8dc',
    'A200': '#b0bec5',
    'A400': '#78909c',
    'A700': '#455a64',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 A100 A200',
    'contrastStrongLightColors': '400 500 700'
  }
});

})();
(function(){
"use strict";

(function(angular) {
  'use strict';
/**
 * @ngdoc module
 * @name material.core.theming
 * @description
 * Theming
 */
angular.module('material.core.theming', ['material.core.theming.palette'])
  .directive('mdTheme', ThemingDirective)
  .directive('mdThemable', ThemableDirective)
  .directive('mdThemesDisabled', disableThemesDirective )
  .provider('$mdTheming', ThemingProvider)
  .config( detectDisabledThemes )
  .run(generateAllThemes);

/**
 * Detect if the HTML or the BODY tags has a [md-themes-disabled] attribute
 * If yes, then immediately disable all theme stylesheet generation and DOM injection
 */
/**
 * @ngInject
 */
function detectDisabledThemes($mdThemingProvider) {
  var isDisabled = !!document.querySelector('[md-themes-disabled]');
  $mdThemingProvider.disableTheming(isDisabled);
}
detectDisabledThemes.$inject = ["$mdThemingProvider"];

/**
 * @ngdoc service
 * @name $mdThemingProvider
 * @module material.core.theming
 *
 * @description Provider to configure the `$mdTheming` service.
 *
 * ### Default Theme
 * The `$mdThemingProvider` uses by default the following theme configuration:
 *
 * - Primary Palette: `Primary`
 * - Accent Palette: `Pink`
 * - Warn Palette: `Deep-Orange`
 * - Background Palette: `Grey`
 *
 * If you don't want to use the `md-theme` directive on the elements itself, you may want to overwrite
 * the default theme.<br/>
 * This can be done by using the following markup.
 *
 * <hljs lang="js">
 *   myAppModule.config(function($mdThemingProvider) {
 *     $mdThemingProvider
 *       .theme('default')
 *       .primaryPalette('blue')
 *       .accentPalette('teal')
 *       .warnPalette('red')
 *       .backgroundPalette('grey');
 *   });
 * </hljs>
 *

 * ### Dynamic Themes
 *
 * By default, if you change a theme at runtime, the `$mdTheming` service will not detect those changes.<br/>
 * If you have an application, which changes its theme on runtime, you have to enable theme watching.
 *
 * <hljs lang="js">
 *   myAppModule.config(function($mdThemingProvider) {
 *     // Enable theme watching.
 *     $mdThemingProvider.alwaysWatchTheme(true);
 *   });
 * </hljs>
 *
 * ### Custom Theme Styles
 *
 * Sometimes you may want to use your own theme styles for some custom components.<br/>
 * You are able to register your own styles by using the following markup.
 *
 * <hljs lang="js">
 *   myAppModule.config(function($mdThemingProvider) {
 *     // Register our custom stylesheet into the theming provider.
 *     $mdThemingProvider.registerStyles(STYLESHEET);
 *   });
 * </hljs>
 *
 * The `registerStyles` method only accepts strings as value, so you're actually not able to load an external
 * stylesheet file into the `$mdThemingProvider`.
 *
 * If it's necessary to load an external stylesheet, we suggest using a bundler, which supports including raw content,
 * like [raw-loader](https://github.com/webpack/raw-loader) for `webpack`.
 *
 * <hljs lang="js">
 *   myAppModule.config(function($mdThemingProvider) {
 *     // Register your custom stylesheet into the theming provider.
 *     $mdThemingProvider.registerStyles(require('../styles/my-component.theme.css'));
 *   });
 * </hljs>
 */

/**
 * @ngdoc method
 * @name $mdThemingProvider#registerStyles
 * @param {string} styles The styles to be appended to Angular Material's built in theme css.
 */
/**
 * @ngdoc method
 * @name $mdThemingProvider#setNonce
 * @param {string} nonceValue The nonce to be added as an attribute to the theme style tags.
 * Setting a value allows the use of CSP policy without using the unsafe-inline directive.
 */

/**
 * @ngdoc method
 * @name $mdThemingProvider#setDefaultTheme
 * @param {string} themeName Default theme name to be applied to elements. Default value is `default`.
 */

/**
 * @ngdoc method
 * @name $mdThemingProvider#alwaysWatchTheme
 * @param {boolean} watch Whether or not to always watch themes for changes and re-apply
 * classes when they change. Default is `false`. Enabling can reduce performance.
 */

/* Some Example Valid Theming Expressions
 * =======================================
 *
 * Intention group expansion: (valid for primary, accent, warn, background)
 *
 * {{primary-100}} - grab shade 100 from the primary palette
 * {{primary-100-0.7}} - grab shade 100, apply opacity of 0.7
 * {{primary-100-contrast}} - grab shade 100's contrast color
 * {{primary-hue-1}} - grab the shade assigned to hue-1 from the primary palette
 * {{primary-hue-1-0.7}} - apply 0.7 opacity to primary-hue-1
 * {{primary-color}} - Generates .md-hue-1, .md-hue-2, .md-hue-3 with configured shades set for each hue
 * {{primary-color-0.7}} - Apply 0.7 opacity to each of the above rules
 * {{primary-contrast}} - Generates .md-hue-1, .md-hue-2, .md-hue-3 with configured contrast (ie. text) color shades set for each hue
 * {{primary-contrast-0.7}} - Apply 0.7 opacity to each of the above rules
 *
 * Foreground expansion: Applies rgba to black/white foreground text
 *
 * {{foreground-1}} - used for primary text
 * {{foreground-2}} - used for secondary text/divider
 * {{foreground-3}} - used for disabled text
 * {{foreground-4}} - used for dividers
 *
 */

// In memory generated CSS rules; registered by theme.name
var GENERATED = { };

// In memory storage of defined themes and color palettes (both loaded by CSS, and user specified)
var PALETTES;

// Text Colors on light and dark backgrounds
// @see https://www.google.com/design/spec/style/color.html#color-text-background-colors
var DARK_FOREGROUND = {
  name: 'dark',
  '1': 'rgba(0,0,0,0.87)',
  '2': 'rgba(0,0,0,0.54)',
  '3': 'rgba(0,0,0,0.38)',
  '4': 'rgba(0,0,0,0.12)'
};
var LIGHT_FOREGROUND = {
  name: 'light',
  '1': 'rgba(255,255,255,1.0)',
  '2': 'rgba(255,255,255,0.7)',
  '3': 'rgba(255,255,255,0.5)',
  '4': 'rgba(255,255,255,0.12)'
};

var DARK_SHADOW = '1px 1px 0px rgba(0,0,0,0.4), -1px -1px 0px rgba(0,0,0,0.4)';
var LIGHT_SHADOW = '';

var DARK_CONTRAST_COLOR = colorToRgbaArray('rgba(0,0,0,0.87)');
var LIGHT_CONTRAST_COLOR = colorToRgbaArray('rgba(255,255,255,0.87)');
var STRONG_LIGHT_CONTRAST_COLOR = colorToRgbaArray('rgb(255,255,255)');

var THEME_COLOR_TYPES = ['primary', 'accent', 'warn', 'background'];
var DEFAULT_COLOR_TYPE = 'primary';

// A color in a theme will use these hues by default, if not specified by user.
var LIGHT_DEFAULT_HUES = {
  'accent': {
    'default': 'A200',
    'hue-1': 'A100',
    'hue-2': 'A400',
    'hue-3': 'A700'
  },
  'background': {
    'default': '50',
    'hue-1': 'A100',
    'hue-2': '100',
    'hue-3': '300'
  }
};

var DARK_DEFAULT_HUES = {
  'background': {
    'default': 'A400',
    'hue-1': '800',
    'hue-2': '900',
    'hue-3': 'A200'
  }
};
THEME_COLOR_TYPES.forEach(function(colorType) {
  // Color types with unspecified default hues will use these default hue values
  var defaultDefaultHues = {
    'default': '500',
    'hue-1': '300',
    'hue-2': '800',
    'hue-3': 'A100'
  };
  if (!LIGHT_DEFAULT_HUES[colorType]) LIGHT_DEFAULT_HUES[colorType] = defaultDefaultHues;
  if (!DARK_DEFAULT_HUES[colorType]) DARK_DEFAULT_HUES[colorType] = defaultDefaultHues;
});

var VALID_HUE_VALUES = [
  '50', '100', '200', '300', '400', '500', '600',
  '700', '800', '900', 'A100', 'A200', 'A400', 'A700'
];

var themeConfig = {
  disableTheming : false,   // Generate our themes at run time; also disable stylesheet DOM injection
  generateOnDemand : false, // Whether or not themes are to be generated on-demand (vs. eagerly).
  registeredStyles : [],    // Custom styles registered to be used in the theming of custom components.
  nonce : null              // Nonce to be added as an attribute to the generated themes style tags.
};

/**
 *
 */
function ThemingProvider($mdColorPalette) {
  PALETTES = { };
  var THEMES = { };

  var themingProvider;

  var alwaysWatchTheme = false;
  var defaultTheme = 'default';

  // Load JS Defined Palettes
  angular.extend(PALETTES, $mdColorPalette);

  // Default theme defined in core.js

  ThemingService.$inject = ["$rootScope", "$log"];
  return themingProvider = {
    definePalette: definePalette,
    extendPalette: extendPalette,
    theme: registerTheme,

    configuration : function() {
      // return a read-only clone of the current configuration
      var locals = { defaultTheme : defaultTheme, alwaysWatchTheme : alwaysWatchTheme };
      return angular.extend( { }, config, locals );
    },

    /**
     * Easy way to disable theming without having to use
     * `.constant("$MD_THEME_CSS","");` This disables
     * all dynamic theme style sheet generations and injections...
     */
    disableTheming: function(isDisabled) {
      themeConfig.disableTheming = angular.isUndefined(isDisabled) || !!isDisabled;
    },

    registerStyles: function(styles) {
      themeConfig.registeredStyles.push(styles);
    },

    setNonce: function(nonceValue) {
      themeConfig.nonce = nonceValue;
    },

    generateThemesOnDemand: function(onDemand) {
      themeConfig.generateOnDemand = onDemand;
    },

    setDefaultTheme: function(theme) {
      defaultTheme = theme;
    },

    alwaysWatchTheme: function(alwaysWatch) {
      alwaysWatchTheme = alwaysWatch;
    },

    $get: ThemingService,
    _LIGHT_DEFAULT_HUES: LIGHT_DEFAULT_HUES,
    _DARK_DEFAULT_HUES: DARK_DEFAULT_HUES,
    _PALETTES: PALETTES,
    _THEMES: THEMES,
    _parseRules: parseRules,
    _rgba: rgba
  };

  // Example: $mdThemingProvider.definePalette('neonRed', { 50: '#f5fafa', ... });
  function definePalette(name, map) {
    map = map || {};
    PALETTES[name] = checkPaletteValid(name, map);
    return themingProvider;
  }

  // Returns an new object which is a copy of a given palette `name` with variables from
  // `map` overwritten
  // Example: var neonRedMap = $mdThemingProvider.extendPalette('red', { 50: '#f5fafafa' });
  function extendPalette(name, map) {
    return checkPaletteValid(name,  angular.extend({}, PALETTES[name] || {}, map) );
  }

  // Make sure that palette has all required hues
  function checkPaletteValid(name, map) {
    var missingColors = VALID_HUE_VALUES.filter(function(field) {
      return !map[field];
    });
    if (missingColors.length) {
      throw new Error("Missing colors %1 in palette %2!"
                      .replace('%1', missingColors.join(', '))
                      .replace('%2', name));
    }

    return map;
  }

  // Register a theme (which is a collection of color palettes to use with various states
  // ie. warn, accent, primary )
  // Optionally inherit from an existing theme
  // $mdThemingProvider.theme('custom-theme').primaryPalette('red');
  function registerTheme(name, inheritFrom) {
    if (THEMES[name]) return THEMES[name];

    inheritFrom = inheritFrom || 'default';

    var parentTheme = typeof inheritFrom === 'string' ? THEMES[inheritFrom] : inheritFrom;
    var theme = new Theme(name);

    if (parentTheme) {
      angular.forEach(parentTheme.colors, function(color, colorType) {
        theme.colors[colorType] = {
          name: color.name,
          // Make sure a COPY of the hues is given to the child color,
          // not the same reference.
          hues: angular.extend({}, color.hues)
        };
      });
    }
    THEMES[name] = theme;

    return theme;
  }

  function Theme(name) {
    var self = this;
    self.name = name;
    self.colors = {};

    self.dark = setDark;
    setDark(false);

    function setDark(isDark) {
      isDark = arguments.length === 0 ? true : !!isDark;

      // If no change, abort
      if (isDark === self.isDark) return;

      self.isDark = isDark;

      self.foregroundPalette = self.isDark ? LIGHT_FOREGROUND : DARK_FOREGROUND;
      self.foregroundShadow = self.isDark ? DARK_SHADOW : LIGHT_SHADOW;

      // Light and dark themes have different default hues.
      // Go through each existing color type for this theme, and for every
      // hue value that is still the default hue value from the previous light/dark setting,
      // set it to the default hue value from the new light/dark setting.
      var newDefaultHues = self.isDark ? DARK_DEFAULT_HUES : LIGHT_DEFAULT_HUES;
      var oldDefaultHues = self.isDark ? LIGHT_DEFAULT_HUES : DARK_DEFAULT_HUES;
      angular.forEach(newDefaultHues, function(newDefaults, colorType) {
        var color = self.colors[colorType];
        var oldDefaults = oldDefaultHues[colorType];
        if (color) {
          for (var hueName in color.hues) {
            if (color.hues[hueName] === oldDefaults[hueName]) {
              color.hues[hueName] = newDefaults[hueName];
            }
          }
        }
      });

      return self;
    }

    THEME_COLOR_TYPES.forEach(function(colorType) {
      var defaultHues = (self.isDark ? DARK_DEFAULT_HUES : LIGHT_DEFAULT_HUES)[colorType];
      self[colorType + 'Palette'] = function setPaletteType(paletteName, hues) {
        var color = self.colors[colorType] = {
          name: paletteName,
          hues: angular.extend({}, defaultHues, hues)
        };

        Object.keys(color.hues).forEach(function(name) {
          if (!defaultHues[name]) {
            throw new Error("Invalid hue name '%1' in theme %2's %3 color %4. Available hue names: %4"
              .replace('%1', name)
              .replace('%2', self.name)
              .replace('%3', paletteName)
              .replace('%4', Object.keys(defaultHues).join(', '))
            );
          }
        });
        Object.keys(color.hues).map(function(key) {
          return color.hues[key];
        }).forEach(function(hueValue) {
          if (VALID_HUE_VALUES.indexOf(hueValue) == -1) {
            throw new Error("Invalid hue value '%1' in theme %2's %3 color %4. Available hue values: %5"
              .replace('%1', hueValue)
              .replace('%2', self.name)
              .replace('%3', colorType)
              .replace('%4', paletteName)
              .replace('%5', VALID_HUE_VALUES.join(', '))
            );
          }
        });
        return self;
      };

      self[colorType + 'Color'] = function() {
        var args = Array.prototype.slice.call(arguments);
        console.warn('$mdThemingProviderTheme.' + colorType + 'Color() has been deprecated. ' +
                     'Use $mdThemingProviderTheme.' + colorType + 'Palette() instead.');
        return self[colorType + 'Palette'].apply(self, args);
      };
    });
  }

  /**
   * @ngdoc service
   * @name $mdTheming
   *
   * @description
   *
   * Service that makes an element apply theming related classes to itself.
   *
   * ```js
   * app.directive('myFancyDirective', function($mdTheming) {
   *   return {
   *     restrict: 'e',
   *     link: function(scope, el, attrs) {
   *       $mdTheming(el);
   *     }
   *   };
   * });
   * ```
   * @param {el=} element to apply theming to
   */
  /* @ngInject */
  function ThemingService($rootScope, $log) {
        // Allow us to be invoked via a linking function signature.
    var applyTheme = function (scope, el) {
          if (el === undefined) { el = scope; scope = undefined; }
          if (scope === undefined) { scope = $rootScope; }
          applyTheme.inherit(el, el);
        };

    applyTheme.THEMES = angular.extend({}, THEMES);
    applyTheme.PALETTES = angular.extend({}, PALETTES);
    applyTheme.inherit = inheritTheme;
    applyTheme.registered = registered;
    applyTheme.defaultTheme = function() { return defaultTheme; };
    applyTheme.generateTheme = function(name) { generateTheme(THEMES[name], name, themeConfig.nonce); };

    return applyTheme;

    /**
     * Determine is specified theme name is a valid, registered theme
     */
    function registered(themeName) {
      if (themeName === undefined || themeName === '') return true;
      return applyTheme.THEMES[themeName] !== undefined;
    }

    /**
     * Get theme name for the element, then update with Theme CSS class
     */
    function inheritTheme (el, parent) {
      var ctrl = parent.controller('mdTheme');
      var attrThemeValue = el.attr('md-theme-watch');
      var watchTheme = (alwaysWatchTheme || angular.isDefined(attrThemeValue)) && attrThemeValue != 'false';

      updateThemeClass(lookupThemeName());

      if ((alwaysWatchTheme && !registerChangeCallback()) || (!alwaysWatchTheme && watchTheme)) {
        el.on('$destroy', $rootScope.$watch(lookupThemeName, updateThemeClass) );
      }

      /**
       * Find the theme name from the parent controller or element data
       */
      function lookupThemeName() {
        // As a few components (dialog) add their controllers later, we should also watch for a controller init.
        ctrl = parent.controller('mdTheme') || el.data('$mdThemeController');
        return ctrl && ctrl.$mdTheme || (defaultTheme == 'default' ? '' : defaultTheme);
      }

      /**
       * Remove old theme class and apply a new one
       * NOTE: if not a valid theme name, then the current name is not changed
       */
      function updateThemeClass(theme) {
        if (!theme) return;
        if (!registered(theme)) {
          $log.warn('Attempted to use unregistered theme \'' + theme + '\'. ' +
                    'Register it with $mdThemingProvider.theme().');
        }

        var oldTheme = el.data('$mdThemeName');
        if (oldTheme) el.removeClass('md-' + oldTheme +'-theme');
        el.addClass('md-' + theme + '-theme');
        el.data('$mdThemeName', theme);
        if (ctrl) {
          el.data('$mdThemeController', ctrl);
        }
      }

      /**
       * Register change callback with parent mdTheme controller
       */
      function registerChangeCallback() {
        var parentController = parent.controller('mdTheme');
        if (!parentController) return false;
        el.on('$destroy', parentController.registerChanges( function() {
          updateThemeClass(lookupThemeName());
        }));
        return true;
      }
    }

  }
}
ThemingProvider.$inject = ["$mdColorPalette"];

function ThemingDirective($mdTheming, $interpolate, $log) {
  return {
    priority: 100,
    link: {
      pre: function(scope, el, attrs) {
        var registeredCallbacks = [];
        var ctrl = {
          registerChanges: function (cb, context) {
            if (context) {
              cb = angular.bind(context, cb);
            }

            registeredCallbacks.push(cb);

            return function () {
              var index = registeredCallbacks.indexOf(cb);

              if (index > -1) {
                registeredCallbacks.splice(index, 1);
              }
            }
          },
          $setTheme: function (theme) {
            if (!$mdTheming.registered(theme)) {
              $log.warn('attempted to use unregistered theme \'' + theme + '\'');
            }
            ctrl.$mdTheme = theme;

            registeredCallbacks.forEach(function (cb) {
              cb();
            })
          }
        };
        el.data('$mdThemeController', ctrl);
        ctrl.$setTheme($interpolate(attrs.mdTheme)(scope));
        attrs.$observe('mdTheme', ctrl.$setTheme);
      }
    }
  };
}
ThemingDirective.$inject = ["$mdTheming", "$interpolate", "$log"];

/**
 * Special directive that will disable ALL runtime Theme style generation and DOM injection
 *
 * <link rel="stylesheet" href="angular-material.min.css">
 * <link rel="stylesheet" href="angular-material.themes.css">
 *
 * <body md-themes-disabled>
 *  ...
 * </body>
 *
 * Note: Using md-themes-css directive requires the developer to load external
 * theme stylesheets; e.g. custom themes from Material-Tools:
 *
 *       `angular-material.themes.css`
 *
 * Another option is to use the ThemingProvider to configure and disable the attribute
 * conversions; this would obviate the use of the `md-themes-css` directive
 *
 */
function disableThemesDirective() {
  themeConfig.disableTheming = true;

  // Return a 1x-only, first-match attribute directive
  return {
    restrict : 'A',
    priority : '900'
  };
}

function ThemableDirective($mdTheming) {
  return $mdTheming;
}
ThemableDirective.$inject = ["$mdTheming"];

function parseRules(theme, colorType, rules) {
  checkValidPalette(theme, colorType);

  rules = rules.replace(/THEME_NAME/g, theme.name);
  var generatedRules = [];
  var color = theme.colors[colorType];

  var themeNameRegex = new RegExp('\\.md-' + theme.name + '-theme', 'g');
  // Matches '{{ primary-color }}', etc
  var hueRegex = new RegExp('(\'|")?{{\\s*(' + colorType + ')-(color|contrast)-?(\\d\\.?\\d*)?\\s*}}(\"|\')?','g');
  var simpleVariableRegex = /'?"?\{\{\s*([a-zA-Z]+)-(A?\d+|hue\-[0-3]|shadow|default)-?(\d\.?\d*)?(contrast)?\s*\}\}'?"?/g;
  var palette = PALETTES[color.name];

  // find and replace simple variables where we use a specific hue, not an entire palette
  // eg. "{{primary-100}}"
  //\(' + THEME_COLOR_TYPES.join('\|') + '\)'
  rules = rules.replace(simpleVariableRegex, function(match, colorType, hue, opacity, contrast) {
    if (colorType === 'foreground') {
      if (hue == 'shadow') {
        return theme.foregroundShadow;
      } else {
        return theme.foregroundPalette[hue] || theme.foregroundPalette['1'];
      }
    }

    // `default` is also accepted as a hue-value, because the background palettes are
    // using it as a name for the default hue.
    if (hue.indexOf('hue') === 0 || hue === 'default') {
      hue = theme.colors[colorType].hues[hue];
    }

    return rgba( (PALETTES[ theme.colors[colorType].name ][hue] || '')[contrast ? 'contrast' : 'value'], opacity );
  });

  // For each type, generate rules for each hue (ie. default, md-hue-1, md-hue-2, md-hue-3)
  angular.forEach(color.hues, function(hueValue, hueName) {
    var newRule = rules
      .replace(hueRegex, function(match, _, colorType, hueType, opacity) {
        return rgba(palette[hueValue][hueType === 'color' ? 'value' : 'contrast'], opacity);
      });
    if (hueName !== 'default') {
      newRule = newRule.replace(themeNameRegex, '.md-' + theme.name + '-theme.md-' + hueName);
    }

    // Don't apply a selector rule to the default theme, making it easier to override
    // styles of the base-component
    if (theme.name == 'default') {
      var themeRuleRegex = /((?:(?:(?: |>|\.|\w|-|:|\(|\)|\[|\]|"|'|=)+) )?)((?:(?:\w|\.|-)+)?)\.md-default-theme((?: |>|\.|\w|-|:|\(|\)|\[|\]|"|'|=)*)/g;
      newRule = newRule.replace(themeRuleRegex, function(match, prefix, target, suffix) {
        return match + ', ' + prefix + target + suffix;
      });
    }
    generatedRules.push(newRule);
  });

  return generatedRules;
}

var rulesByType = {};

// Generate our themes at run time given the state of THEMES and PALETTES
function generateAllThemes($injector, $mdTheming) {
  var head = document.head;
  var firstChild = head ? head.firstElementChild : null;
  var themeCss = !themeConfig.disableTheming && $injector.has('$MD_THEME_CSS') ? $injector.get('$MD_THEME_CSS') : '';

  // Append our custom registered styles to the theme stylesheet.
  themeCss += themeConfig.registeredStyles.join('');

  if ( !firstChild ) return;
  if (themeCss.length === 0) return; // no rules, so no point in running this expensive task

  // Expose contrast colors for palettes to ensure that text is always readable
  angular.forEach(PALETTES, sanitizePalette);

  // MD_THEME_CSS is a string generated by the build process that includes all the themable
  // components as templates

  // Break the CSS into individual rules
  var rules = themeCss
                  .split(/\}(?!(\}|'|"|;))/)
                  .filter(function(rule) { return rule && rule.trim().length; })
                  .map(function(rule) { return rule.trim() + '}'; });


  var ruleMatchRegex = new RegExp('md-(' + THEME_COLOR_TYPES.join('|') + ')', 'g');

  THEME_COLOR_TYPES.forEach(function(type) {
    rulesByType[type] = '';
  });


  // Sort the rules based on type, allowing us to do color substitution on a per-type basis
  rules.forEach(function(rule) {
    var match = rule.match(ruleMatchRegex);
    // First: test that if the rule has '.md-accent', it goes into the accent set of rules
    for (var i = 0, type; type = THEME_COLOR_TYPES[i]; i++) {
      if (rule.indexOf('.md-' + type) > -1) {
        return rulesByType[type] += rule;
      }
    }

    // If no eg 'md-accent' class is found, try to just find 'accent' in the rule and guess from
    // there
    for (i = 0; type = THEME_COLOR_TYPES[i]; i++) {
      if (rule.indexOf(type) > -1) {
        return rulesByType[type] += rule;
      }
    }

    // Default to the primary array
    return rulesByType[DEFAULT_COLOR_TYPE] += rule;
  });

  // If themes are being generated on-demand, quit here. The user will later manually
  // call generateTheme to do this on a theme-by-theme basis.
  if (themeConfig.generateOnDemand) return;

  angular.forEach($mdTheming.THEMES, function(theme) {
    if (!GENERATED[theme.name] && !($mdTheming.defaultTheme() !== 'default' && theme.name === 'default')) {
      generateTheme(theme, theme.name, themeConfig.nonce);
    }
  });


  // *************************
  // Internal functions
  // *************************

  // The user specifies a 'default' contrast color as either light or dark,
  // then explicitly lists which hues are the opposite contrast (eg. A100 has dark, A200 has light)
  function sanitizePalette(palette, name) {
    var defaultContrast = palette.contrastDefaultColor;
    var lightColors = palette.contrastLightColors || [];
    var strongLightColors = palette.contrastStrongLightColors || [];
    var darkColors = palette.contrastDarkColors || [];

    // These colors are provided as space-separated lists
    if (typeof lightColors === 'string') lightColors = lightColors.split(' ');
    if (typeof strongLightColors === 'string') strongLightColors = strongLightColors.split(' ');
    if (typeof darkColors === 'string') darkColors = darkColors.split(' ');

    // Cleanup after ourselves
    delete palette.contrastDefaultColor;
    delete palette.contrastLightColors;
    delete palette.contrastStrongLightColors;
    delete palette.contrastDarkColors;

    // Change { 'A100': '#fffeee' } to { 'A100': { value: '#fffeee', contrast:DARK_CONTRAST_COLOR }
    angular.forEach(palette, function(hueValue, hueName) {
      if (angular.isObject(hueValue)) return; // Already converted
      // Map everything to rgb colors
      var rgbValue = colorToRgbaArray(hueValue);
      if (!rgbValue) {
        throw new Error("Color %1, in palette %2's hue %3, is invalid. Hex or rgb(a) color expected."
                        .replace('%1', hueValue)
                        .replace('%2', palette.name)
                        .replace('%3', hueName));
      }

      palette[hueName] = {
        value: rgbValue,
        contrast: getContrastColor()
      };
      function getContrastColor() {
        if (defaultContrast === 'light') {
          if (darkColors.indexOf(hueName) > -1) {
            return DARK_CONTRAST_COLOR;
          } else {
            return strongLightColors.indexOf(hueName) > -1 ? STRONG_LIGHT_CONTRAST_COLOR
              : LIGHT_CONTRAST_COLOR;
          }
        } else {
          if (lightColors.indexOf(hueName) > -1) {
            return strongLightColors.indexOf(hueName) > -1 ? STRONG_LIGHT_CONTRAST_COLOR
              : LIGHT_CONTRAST_COLOR;
          } else {
            return DARK_CONTRAST_COLOR;
          }
        }
      }
    });
  }
}
generateAllThemes.$inject = ["$injector", "$mdTheming"];

function generateTheme(theme, name, nonce) {
  var head = document.head;
  var firstChild = head ? head.firstElementChild : null;

  if (!GENERATED[name]) {
    // For each theme, use the color palettes specified for
    // `primary`, `warn` and `accent` to generate CSS rules.
    THEME_COLOR_TYPES.forEach(function(colorType) {
      var styleStrings = parseRules(theme, colorType, rulesByType[colorType]);
      while (styleStrings.length) {
        var styleContent = styleStrings.shift();
        if (styleContent) {
          var style = document.createElement('style');
          style.setAttribute('md-theme-style', '');
          if (nonce) {
            style.setAttribute('nonce', nonce);
          }
          style.appendChild(document.createTextNode(styleContent));
          head.insertBefore(style, firstChild);
        }
      }
    });

    GENERATED[theme.name] = true;
  }

}


function checkValidPalette(theme, colorType) {
  // If theme attempts to use a palette that doesnt exist, throw error
  if (!PALETTES[ (theme.colors[colorType] || {}).name ]) {
    throw new Error(
      "You supplied an invalid color palette for theme %1's %2 palette. Available palettes: %3"
                    .replace('%1', theme.name)
                    .replace('%2', colorType)
                    .replace('%3', Object.keys(PALETTES).join(', '))
    );
  }
}

function colorToRgbaArray(clr) {
  if (angular.isArray(clr) && clr.length == 3) return clr;
  if (/^rgb/.test(clr)) {
    return clr.replace(/(^\s*rgba?\(|\)\s*$)/g, '').split(',').map(function(value, i) {
      return i == 3 ? parseFloat(value, 10) : parseInt(value, 10);
    });
  }
  if (clr.charAt(0) == '#') clr = clr.substring(1);
  if (!/^([a-fA-F0-9]{3}){1,2}$/g.test(clr)) return;

  var dig = clr.length / 3;
  var red = clr.substr(0, dig);
  var grn = clr.substr(dig, dig);
  var blu = clr.substr(dig * 2);
  if (dig === 1) {
    red += red;
    grn += grn;
    blu += blu;
  }
  return [parseInt(red, 16), parseInt(grn, 16), parseInt(blu, 16)];
}

function rgba(rgbArray, opacity) {
  if ( !rgbArray ) return "rgb('0,0,0')";

  if (rgbArray.length == 4) {
    rgbArray = angular.copy(rgbArray);
    opacity ? rgbArray.pop() : opacity = rgbArray.pop();
  }
  return opacity && (typeof opacity == 'number' || (typeof opacity == 'string' && opacity.length)) ?
    'rgba(' + rgbArray.join(',') + ',' + opacity + ')' :
    'rgb(' + rgbArray.join(',') + ')';
}


})(window.angular);

})();
(function(){
"use strict";

// Polyfill angular < 1.4 (provide $animateCss)
angular
  .module('material.core')
  .factory('$$mdAnimate', ["$q", "$timeout", "$mdConstant", "$animateCss", function($q, $timeout, $mdConstant, $animateCss){

     // Since $$mdAnimate is injected into $mdUtil... use a wrapper function
     // to subsequently inject $mdUtil as an argument to the AnimateDomUtils

     return function($mdUtil) {
       return AnimateDomUtils( $mdUtil, $q, $timeout, $mdConstant, $animateCss);
     };
   }]);

/**
 * Factory function that requires special injections
 */
function AnimateDomUtils($mdUtil, $q, $timeout, $mdConstant, $animateCss) {
  var self;
  return self = {
    /**
     *
     */
    translate3d : function( target, from, to, options ) {
      return $animateCss(target,{
        from:from,
        to:to,
        addClass:options.transitionInClass,
        removeClass:options.transitionOutClass
      })
      .start()
      .then(function(){
          // Resolve with reverser function...
          return reverseTranslate;
      });

      /**
       * Specific reversal of the request translate animation above...
       */
      function reverseTranslate (newFrom) {
        return $animateCss(target, {
           to: newFrom || from,
           addClass: options.transitionOutClass,
           removeClass: options.transitionInClass
        }).start();

      }
    },

    /**
     * Listen for transitionEnd event (with optional timeout)
     * Announce completion or failure via promise handlers
     */
    waitTransitionEnd: function (element, opts) {
      var TIMEOUT = 3000; // fallback is 3 secs

      return $q(function(resolve, reject){
        opts = opts || { };

        // If there is no transition is found, resolve immediately
        //
        // NOTE: using $mdUtil.nextTick() causes delays/issues
        if (noTransitionFound(opts.cachedTransitionStyles)) {
          TIMEOUT = 0;
        }

        var timer = $timeout(finished, opts.timeout || TIMEOUT);
        element.on($mdConstant.CSS.TRANSITIONEND, finished);

        /**
         * Upon timeout or transitionEnd, reject or resolve (respectively) this promise.
         * NOTE: Make sure this transitionEnd didn't bubble up from a child
         */
        function finished(ev) {
          if ( ev && ev.target !== element[0]) return;

          if ( ev  ) $timeout.cancel(timer);
          element.off($mdConstant.CSS.TRANSITIONEND, finished);

          // Never reject since ngAnimate may cause timeouts due missed transitionEnd events
          resolve();

        }

        /**
         * Checks whether or not there is a transition.
         *
         * @param styles The cached styles to use for the calculation. If null, getComputedStyle()
         * will be used.
         *
         * @returns {boolean} True if there is no transition/duration; false otherwise.
         */
        function noTransitionFound(styles) {
          styles = styles || window.getComputedStyle(element[0]);

          return styles.transitionDuration == '0s' || (!styles.transition && !styles.transitionProperty);
        }

      });
    },

    calculateTransformValues: function (element, originator) {
      var origin = originator.element;
      var bounds = originator.bounds;

      if (origin || bounds) {
        var originBnds = origin ? self.clientRect(origin) || currentBounds() : self.copyRect(bounds);
        var dialogRect = self.copyRect(element[0].getBoundingClientRect());
        var dialogCenterPt = self.centerPointFor(dialogRect);
        var originCenterPt = self.centerPointFor(originBnds);

        return {
          centerX: originCenterPt.x - dialogCenterPt.x,
          centerY: originCenterPt.y - dialogCenterPt.y,
          scaleX: Math.round(100 * Math.min(0.5, originBnds.width / dialogRect.width)) / 100,
          scaleY: Math.round(100 * Math.min(0.5, originBnds.height / dialogRect.height)) / 100
        };
      }
      return {centerX: 0, centerY: 0, scaleX: 0.5, scaleY: 0.5};

      /**
       * This is a fallback if the origin information is no longer valid, then the
       * origin bounds simply becomes the current bounds for the dialogContainer's parent
       */
      function currentBounds() {
        var cntr = element ? element.parent() : null;
        var parent = cntr ? cntr.parent() : null;

        return parent ? self.clientRect(parent) : null;
      }
    },

    /**
     * Calculate the zoom transform from dialog to origin.
     *
     * We use this to set the dialog position immediately;
     * then the md-transition-in actually translates back to
     * `translate3d(0,0,0) scale(1.0)`...
     *
     * NOTE: all values are rounded to the nearest integer
     */
    calculateZoomToOrigin: function (element, originator) {
      var zoomTemplate = "translate3d( {centerX}px, {centerY}px, 0 ) scale( {scaleX}, {scaleY} )";
      var buildZoom = angular.bind(null, $mdUtil.supplant, zoomTemplate);

      return buildZoom(self.calculateTransformValues(element, originator));
    },

    /**
     * Calculate the slide transform from panel to origin.
     * NOTE: all values are rounded to the nearest integer
     */
    calculateSlideToOrigin: function (element, originator) {
      var slideTemplate = "translate3d( {centerX}px, {centerY}px, 0 )";
      var buildSlide = angular.bind(null, $mdUtil.supplant, slideTemplate);

      return buildSlide(self.calculateTransformValues(element, originator));
    },

    /**
     * Enhance raw values to represent valid css stylings...
     */
    toCss : function( raw ) {
      var css = { };
      var lookups = 'left top right bottom width height x y min-width min-height max-width max-height';

      angular.forEach(raw, function(value,key) {
        if ( angular.isUndefined(value) ) return;

        if ( lookups.indexOf(key) >= 0 ) {
          css[key] = value + 'px';
        } else {
          switch (key) {
            case 'transition':
              convertToVendor(key, $mdConstant.CSS.TRANSITION, value);
              break;
            case 'transform':
              convertToVendor(key, $mdConstant.CSS.TRANSFORM, value);
              break;
            case 'transformOrigin':
              convertToVendor(key, $mdConstant.CSS.TRANSFORM_ORIGIN, value);
              break;
            case 'font-size':
              css['font-size'] = value; // font sizes aren't always in px
              break;
          }
        }
      });

      return css;

      function convertToVendor(key, vendor, value) {
        angular.forEach(vendor.split(' '), function (key) {
          css[key] = value;
        });
      }
    },

    /**
     * Convert the translate CSS value to key/value pair(s).
     */
    toTransformCss: function (transform, addTransition, transition) {
      var css = {};
      angular.forEach($mdConstant.CSS.TRANSFORM.split(' '), function (key) {
        css[key] = transform;
      });

      if (addTransition) {
        transition = transition || "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) !important";
        css['transition'] = transition;
      }

      return css;
    },

    /**
     *  Clone the Rect and calculate the height/width if needed
     */
    copyRect: function (source, destination) {
      if (!source) return null;

      destination = destination || {};

      angular.forEach('left top right bottom width height'.split(' '), function (key) {
        destination[key] = Math.round(source[key])
      });

      destination.width = destination.width || (destination.right - destination.left);
      destination.height = destination.height || (destination.bottom - destination.top);

      return destination;
    },

    /**
     * Calculate ClientRect of element; return null if hidden or zero size
     */
    clientRect: function (element) {
      var bounds = angular.element(element)[0].getBoundingClientRect();
      var isPositiveSizeClientRect = function (rect) {
        return rect && (rect.width > 0) && (rect.height > 0);
      };

      // If the event origin element has zero size, it has probably been hidden.
      return isPositiveSizeClientRect(bounds) ? self.copyRect(bounds) : null;
    },

    /**
     *  Calculate 'rounded' center point of Rect
     */
    centerPointFor: function (targetRect) {
      return targetRect ? {
        x: Math.round(targetRect.left + (targetRect.width / 2)),
        y: Math.round(targetRect.top + (targetRect.height / 2))
      } : { x : 0, y : 0 };
    }

  };
};


})();
(function(){
"use strict";

"use strict";

if (angular.version.minor >= 4) {
  angular.module('material.core.animate', []);
} else {
(function() {

  var forEach = angular.forEach;

  var WEBKIT = angular.isDefined(document.documentElement.style.WebkitAppearance);
  var TRANSITION_PROP = WEBKIT ? 'WebkitTransition' : 'transition';
  var ANIMATION_PROP = WEBKIT ? 'WebkitAnimation' : 'animation';
  var PREFIX = WEBKIT ? '-webkit-' : '';

  var TRANSITION_EVENTS = (WEBKIT ? 'webkitTransitionEnd ' : '') + 'transitionend';
  var ANIMATION_EVENTS = (WEBKIT ? 'webkitAnimationEnd ' : '') + 'animationend';

  var $$ForceReflowFactory = ['$document', function($document) {
    return function() {
      return $document[0].body.clientWidth + 1;
    }
  }];

  var $$rAFMutexFactory = ['$$rAF', function($$rAF) {
    return function() {
      var passed = false;
      $$rAF(function() {
        passed = true;
      });
      return function(fn) {
        passed ? fn() : $$rAF(fn);
      };
    };
  }];

  var $$AnimateRunnerFactory = ['$q', '$$rAFMutex', function($q, $$rAFMutex) {
    var INITIAL_STATE = 0;
    var DONE_PENDING_STATE = 1;
    var DONE_COMPLETE_STATE = 2;

    function AnimateRunner(host) {
      this.setHost(host);

      this._doneCallbacks = [];
      this._runInAnimationFrame = $$rAFMutex();
      this._state = 0;
    }

    AnimateRunner.prototype = {
      setHost: function(host) {
        this.host = host || {};
      },

      done: function(fn) {
        if (this._state === DONE_COMPLETE_STATE) {
          fn();
        } else {
          this._doneCallbacks.push(fn);
        }
      },

      progress: angular.noop,

      getPromise: function() {
        if (!this.promise) {
          var self = this;
          this.promise = $q(function(resolve, reject) {
            self.done(function(status) {
              status === false ? reject() : resolve();
            });
          });
        }
        return this.promise;
      },

      then: function(resolveHandler, rejectHandler) {
        return this.getPromise().then(resolveHandler, rejectHandler);
      },

      'catch': function(handler) {
        return this.getPromise()['catch'](handler);
      },

      'finally': function(handler) {
        return this.getPromise()['finally'](handler);
      },

      pause: function() {
        if (this.host.pause) {
          this.host.pause();
        }
      },

      resume: function() {
        if (this.host.resume) {
          this.host.resume();
        }
      },

      end: function() {
        if (this.host.end) {
          this.host.end();
        }
        this._resolve(true);
      },

      cancel: function() {
        if (this.host.cancel) {
          this.host.cancel();
        }
        this._resolve(false);
      },

      complete: function(response) {
        var self = this;
        if (self._state === INITIAL_STATE) {
          self._state = DONE_PENDING_STATE;
          self._runInAnimationFrame(function() {
            self._resolve(response);
          });
        }
      },

      _resolve: function(response) {
        if (this._state !== DONE_COMPLETE_STATE) {
          forEach(this._doneCallbacks, function(fn) {
            fn(response);
          });
          this._doneCallbacks.length = 0;
          this._state = DONE_COMPLETE_STATE;
        }
      }
    };

    // Polyfill AnimateRunner.all which is used by input animations
    AnimateRunner.all = function(runners, callback) {
      var count = 0;
      var status = true;
      forEach(runners, function(runner) {
        runner.done(onProgress);
      });

      function onProgress(response) {
        status = status && response;
        if (++count === runners.length) {
          callback(status);
        }
      }
    };

    return AnimateRunner;
  }];

  angular
    .module('material.core.animate', [])
    .factory('$$forceReflow', $$ForceReflowFactory)
    .factory('$$AnimateRunner', $$AnimateRunnerFactory)
    .factory('$$rAFMutex', $$rAFMutexFactory)
    .factory('$animateCss', ['$window', '$$rAF', '$$AnimateRunner', '$$forceReflow', '$$jqLite', '$timeout', '$animate',
                     function($window,   $$rAF,   $$AnimateRunner,   $$forceReflow,   $$jqLite,   $timeout, $animate) {

      function init(element, options) {

        var temporaryStyles = [];
        var node = getDomNode(element);
        var areAnimationsAllowed = node && $animate.enabled();

        var hasCompleteStyles = false;
        var hasCompleteClasses = false;

        if (areAnimationsAllowed) {
          if (options.transitionStyle) {
            temporaryStyles.push([PREFIX + 'transition', options.transitionStyle]);
          }

          if (options.keyframeStyle) {
            temporaryStyles.push([PREFIX + 'animation', options.keyframeStyle]);
          }

          if (options.delay) {
            temporaryStyles.push([PREFIX + 'transition-delay', options.delay + 's']);
          }

          if (options.duration) {
            temporaryStyles.push([PREFIX + 'transition-duration', options.duration + 's']);
          }

          hasCompleteStyles = options.keyframeStyle ||
              (options.to && (options.duration > 0 || options.transitionStyle));
          hasCompleteClasses = !!options.addClass || !!options.removeClass;

          blockTransition(element, true);
        }

        var hasCompleteAnimation = areAnimationsAllowed && (hasCompleteStyles || hasCompleteClasses);

        applyAnimationFromStyles(element, options);

        var animationClosed = false;
        var events, eventFn;

        return {
          close: $window.close,
          start: function() {
            var runner = new $$AnimateRunner();
            waitUntilQuiet(function() {
              blockTransition(element, false);
              if (!hasCompleteAnimation) {
                return close();
              }

              forEach(temporaryStyles, function(entry) {
                var key = entry[0];
                var value = entry[1];
                node.style[camelCase(key)] = value;
              });

              applyClasses(element, options);

              var timings = computeTimings(element);
              if (timings.duration === 0) {
                return close();
              }

              var moreStyles = [];

              if (options.easing) {
                if (timings.transitionDuration) {
                  moreStyles.push([PREFIX + 'transition-timing-function', options.easing]);
                }
                if (timings.animationDuration) {
                  moreStyles.push([PREFIX + 'animation-timing-function', options.easing]);
                }
              }

              if (options.delay && timings.animationDelay) {
                moreStyles.push([PREFIX + 'animation-delay', options.delay + 's']);
              }

              if (options.duration && timings.animationDuration) {
                moreStyles.push([PREFIX + 'animation-duration', options.duration + 's']);
              }

              forEach(moreStyles, function(entry) {
                var key = entry[0];
                var value = entry[1];
                node.style[camelCase(key)] = value;
                temporaryStyles.push(entry);
              });

              var maxDelay = timings.delay;
              var maxDelayTime = maxDelay * 1000;
              var maxDuration = timings.duration;
              var maxDurationTime = maxDuration * 1000;
              var startTime = Date.now();

              events = [];
              if (timings.transitionDuration) {
                events.push(TRANSITION_EVENTS);
              }
              if (timings.animationDuration) {
                events.push(ANIMATION_EVENTS);
              }
              events = events.join(' ');
              eventFn = function(event) {
                event.stopPropagation();
                var ev = event.originalEvent || event;
                var timeStamp = ev.timeStamp || Date.now();
                var elapsedTime = parseFloat(ev.elapsedTime.toFixed(3));
                if (Math.max(timeStamp - startTime, 0) >= maxDelayTime && elapsedTime >= maxDuration) {
                  close();
                }
              };
              element.on(events, eventFn);

              applyAnimationToStyles(element, options);

              $timeout(close, maxDelayTime + maxDurationTime * 1.5, false);
            });

            return runner;

            function close() {
              if (animationClosed) return;
              animationClosed = true;

              if (events && eventFn) {
                element.off(events, eventFn);
              }
              applyClasses(element, options);
              applyAnimationStyles(element, options);
              forEach(temporaryStyles, function(entry) {
                node.style[camelCase(entry[0])] = '';
              });
              runner.complete(true);
              return runner;
            }
          }
        }
      }

      function applyClasses(element, options) {
        if (options.addClass) {
          $$jqLite.addClass(element, options.addClass);
          options.addClass = null;
        }
        if (options.removeClass) {
          $$jqLite.removeClass(element, options.removeClass);
          options.removeClass = null;
        }
      }

      function computeTimings(element) {
        var node = getDomNode(element);
        var cs = $window.getComputedStyle(node)
        var tdr = parseMaxTime(cs[prop('transitionDuration')]);
        var adr = parseMaxTime(cs[prop('animationDuration')]);
        var tdy = parseMaxTime(cs[prop('transitionDelay')]);
        var ady = parseMaxTime(cs[prop('animationDelay')]);

        adr *= (parseInt(cs[prop('animationIterationCount')], 10) || 1);
        var duration = Math.max(adr, tdr);
        var delay = Math.max(ady, tdy);

        return {
          duration: duration,
          delay: delay,
          animationDuration: adr,
          transitionDuration: tdr,
          animationDelay: ady,
          transitionDelay: tdy
        };

        function prop(key) {
          return WEBKIT ? 'Webkit' + key.charAt(0).toUpperCase() + key.substr(1)
                        : key;
        }
      }

      function parseMaxTime(str) {
        var maxValue = 0;
        var values = (str || "").split(/\s*,\s*/);
        forEach(values, function(value) {
          // it's always safe to consider only second values and omit `ms` values since
          // getComputedStyle will always handle the conversion for us
          if (value.charAt(value.length - 1) == 's') {
            value = value.substring(0, value.length - 1);
          }
          value = parseFloat(value) || 0;
          maxValue = maxValue ? Math.max(value, maxValue) : value;
        });
        return maxValue;
      }

      var cancelLastRAFRequest;
      var rafWaitQueue = [];
      function waitUntilQuiet(callback) {
        if (cancelLastRAFRequest) {
          cancelLastRAFRequest(); //cancels the request
        }
        rafWaitQueue.push(callback);
        cancelLastRAFRequest = $$rAF(function() {
          cancelLastRAFRequest = null;

          // DO NOT REMOVE THIS LINE OR REFACTOR OUT THE `pageWidth` variable.
          // PLEASE EXAMINE THE `$$forceReflow` service to understand why.
          var pageWidth = $$forceReflow();

          // we use a for loop to ensure that if the queue is changed
          // during this looping then it will consider new requests
          for (var i = 0; i < rafWaitQueue.length; i++) {
            rafWaitQueue[i](pageWidth);
          }
          rafWaitQueue.length = 0;
        });
      }

      function applyAnimationStyles(element, options) {
        applyAnimationFromStyles(element, options);
        applyAnimationToStyles(element, options);
      }

      function applyAnimationFromStyles(element, options) {
        if (options.from) {
          element.css(options.from);
          options.from = null;
        }
      }

      function applyAnimationToStyles(element, options) {
        if (options.to) {
          element.css(options.to);
          options.to = null;
        }
      }

      function getDomNode(element) {
        for (var i = 0; i < element.length; i++) {
          if (element[i].nodeType === 1) return element[i];
        }
      }

      function blockTransition(element, bool) {
        var node = getDomNode(element);
        var key = camelCase(PREFIX + 'transition-delay');
        node.style[key] = bool ? '-9999s' : '';
      }

      return init;
    }]);

  /**
   * Older browsers [FF31] expect camelCase
   * property keys.
   * e.g.
   *  animation-duration --> animationDuration
   */
  function camelCase(str) {
    return str.replace(/-[a-z]/g, function(str) {
      return str.charAt(1).toUpperCase();
    });
  }

})();

}

})();
(function(){
"use strict";

(function () {
  "use strict";

  /**
   *  Use a RegExp to check if the `md-colors="<expression>"` is static string
   *  or one that should be observed and dynamically interpolated.
   */
  var STATIC_COLOR_EXPRESSION = /^{((\s|,)*?["'a-zA-Z-]+?\s*?:\s*?('|")[a-zA-Z0-9-.]*('|"))+\s*}$/;
  var colorPalettes = undefined;

  /**
   * @ngdoc module
   * @name material.components.colors
   *
   * @description
   * Define $mdColors service and a `md-colors=""` attribute directive
   */
  angular
    .module('material.components.colors', ['material.core'])
    .directive('mdColors', MdColorsDirective)
    .service('$mdColors', MdColorsService);

  /**
   * @ngdoc service
   * @name $mdColors
   * @module material.components.colors
   *
   * @description
   * With only defining themes, one couldn't get non ngMaterial elements colored with Material colors,
   * `$mdColors` service is used by the md-color directive to convert the 1..n color expressions to RGBA values and will apply
   * those values to element as CSS property values.
   *
   *  @usage
   *  <hljs lang="js">
   *    angular.controller('myCtrl', function ($mdColors) {
   *      var color = $mdColors.getThemeColor('myTheme-red-200-0.5');
   *      ...
   *    });
   *  </hljs>
   *
   */
  function MdColorsService($mdTheming, $mdUtil, $log) {
    colorPalettes = colorPalettes || Object.keys($mdTheming.PALETTES);

    // Publish service instance
    return {
      applyThemeColors: applyThemeColors,
      getThemeColor: getThemeColor,
      hasTheme: hasTheme
    };

    // ********************************************
    // Internal Methods
    // ********************************************

    /**
     * @ngdoc method
     * @name $mdColors#applyThemeColors
     *
     * @description
     * Gets a color json object, keys are css properties and values are string of the wanted color
     * Then calculate the rgba() values based on the theme color parts
     *
     * @param {DOMElement} element the element to apply the styles on.
     * @param {object} colorExpression json object, keys are css properties and values are string of the wanted color,
     * for example: `{color: 'red-A200-0.3'}`.
     *
     * @usage
     * <hljs lang="js">
     *   app.directive('myDirective', function($mdColors) {
     *     return {
     *       ...
     *       link: function (scope, elem) {
     *         $mdColors.applyThemeColors(elem, {color: 'red'});
     *       }
     *    }
     *   });
     * </hljs>
     */
    function applyThemeColors(element, colorExpression) {
      try {
        if (colorExpression) {
          // Assign the calculate RGBA color values directly as inline CSS
          element.css(interpolateColors(colorExpression));
        }
      } catch (e) {
        $log.error(e.message);
      }

    }

    /**
     * @ngdoc method
     * @name $mdColors#getThemeColor
     *
     * @description
     * Get parsed color from expression
     *
     * @param {string} expression string of a color expression (for instance `'red-700-0.8'`)
     *
     * @returns {string} a css color expression (for instance `rgba(211, 47, 47, 0.8)`)
     *
     * @usage
     *  <hljs lang="js">
     *    angular.controller('myCtrl', function ($mdColors) {
     *      var color = $mdColors.getThemeColor('myTheme-red-200-0.5');
     *      ...
     *    });
     *  </hljs>
     */
    function getThemeColor(expression) {
      var color = extractColorOptions(expression);

      return parseColor(color);
    }

    /**
     * Return the parsed color
     * @param color hashmap of color definitions
     * @param contrast whether use contrast color for foreground
     * @returns rgba color string
     */
    function parseColor(color, contrast) {
      contrast = contrast || false;
      var rgbValues = $mdTheming.PALETTES[color.palette][color.hue];

      rgbValues = contrast ? rgbValues.contrast : rgbValues.value;

      return $mdUtil.supplant('rgba({0}, {1}, {2}, {3})',
        [rgbValues[0], rgbValues[1], rgbValues[2], rgbValues[3] || color.opacity]
      );
    }

    /**
     * Convert the color expression into an object with scope-interpolated values
     * Then calculate the rgba() values based on the theme color parts
     *
     * @results Hashmap of CSS properties with associated `rgba( )` string vales
     *
     *
     */
    function interpolateColors(themeColors) {
      var rgbColors = {};

      var hasColorProperty = themeColors.hasOwnProperty('color');

      angular.forEach(themeColors, function (value, key) {
        var color = extractColorOptions(value);
        var hasBackground = key.indexOf('background') > -1;

        rgbColors[key] = parseColor(color);
        if (hasBackground && !hasColorProperty) {
          rgbColors['color'] = parseColor(color, true);
        }
      });

      return rgbColors;
    }

    /**
     * Check if expression has defined theme
     * e.g.
     * 'myTheme-primary' => true
     * 'red-800' => false
     */
    function hasTheme(expression) {
      return angular.isDefined($mdTheming.THEMES[expression.split('-')[0]]);
    }

    /**
     * For the evaluated expression, extract the color parts into a hash map
     */
    function extractColorOptions(expression) {
      var parts = expression.split('-');
      var hasTheme = angular.isDefined($mdTheming.THEMES[parts[0]]);
      var theme = hasTheme ? parts.splice(0, 1)[0] : $mdTheming.defaultTheme();

      return {
        theme: theme,
        palette: extractPalette(parts, theme),
        hue: extractHue(parts, theme),
        opacity: parts[2] || 1
      };
    }

    /**
     * Calculate the theme palette name
     */
    function extractPalette(parts, theme) {
      // If the next section is one of the palettes we assume it's a two word palette
      // Two word palette can be also written in camelCase, forming camelCase to dash-case

      var isTwoWord = parts.length > 1 && colorPalettes.indexOf(parts[1]) !== -1;
      var palette = parts[0].replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

      if (isTwoWord)  palette = parts[0] + '-' + parts.splice(1, 1);

      if (colorPalettes.indexOf(palette) === -1) {
        // If the palette is not in the palette list it's one of primary/accent/warn/background
        var scheme = $mdTheming.THEMES[theme].colors[palette];
        if (!scheme) {
          throw new Error($mdUtil.supplant('mdColors: couldn\'t find \'{palette}\' in the palettes.', {palette: palette}));
        }
        palette = scheme.name;
      }

      return palette;
    }

    function extractHue(parts, theme) {
      var themeColors = $mdTheming.THEMES[theme].colors;

      if (parts[1] === 'hue') {
        var hueNumber = parseInt(parts.splice(2, 1)[0], 10);

        if (hueNumber < 1 || hueNumber > 3) {
          throw new Error($mdUtil.supplant('mdColors: \'hue-{hueNumber}\' is not a valid hue, can be only \'hue-1\', \'hue-2\' and \'hue-3\'', {hueNumber: hueNumber}));
        }
        parts[1] = 'hue-' + hueNumber;

        if (!(parts[0] in themeColors)) {
          throw new Error($mdUtil.supplant('mdColors: \'hue-x\' can only be used with [{availableThemes}], but was used with \'{usedTheme}\'', {
            availableThemes: Object.keys(themeColors).join(', '),
            usedTheme: parts[0]
          }));
        }

        return themeColors[parts[0]].hues[parts[1]];
      }

      return parts[1] || themeColors[parts[0] in themeColors ? parts[0] : 'primary'].hues['default'];
    }
  }
  MdColorsService.$inject = ["$mdTheming", "$mdUtil", "$log"];

  /**
   * @ngdoc directive
   * @name mdColors
   * @module material.components.colors
   *
   * @restrict A
   *
   * @description
   * `mdColors` directive will apply the theme-based color expression as RGBA CSS style values.
   *
   *   The format will be similar to our color defining in the scss files:
   *
   *   ## `[?theme]-[palette]-[?hue]-[?opacity]`
   *   - [theme]    - default value is the default theme
   *   - [palette]  - can be either palette name or primary/accent/warn/background
   *   - [hue]      - default is 500 (hue-x can be used with primary/accent/warn/background)
   *   - [opacity]  - default is 1
   *
   *   > `?` indicates optional parameter
   *
   * @usage
   * <hljs lang="html">
   *   <div md-colors="{background: 'myTheme-accent-900-0.43'}">
   *     <div md-colors="{color: 'red-A100', border-color: 'primary-600'}">
   *       <span>Color demo</span>
   *     </div>
   *   </div>
   * </hljs>
   *
   * `mdColors` directive will automatically watch for changes in the expression if it recognizes an interpolation
   * expression or a function. For performance options, you can use `::` prefix to the `md-colors` expression
   * to indicate a one-time data binding.
   * <hljs lang="html">
   *   <md-card md-colors="::{background: '{{theme}}-primary-700'}">
   *   </md-card>
   * </hljs>
   *
   */
  function MdColorsDirective($mdColors, $mdUtil, $log, $parse) {
    return {
      restrict: 'A',
      require: ['^?mdTheme'],
      compile: function (tElem, tAttrs) {
        var shouldWatch = shouldColorsWatch();

        return function (scope, element, attrs, ctrl) {
          var mdThemeController = ctrl[0];

          var lastColors = {};

          var parseColors = function (theme) {
            if (typeof theme !== 'string') {
              theme = '';
            }

            if (!attrs.mdColors) {
              attrs.mdColors = '{}';
            }

            /**
             * Json.parse() does not work because the keys are not quoted;
             * use $parse to convert to a hash map
             */
            var colors = $parse(attrs.mdColors)(scope);

            /**
             * If mdTheme is defined up the DOM tree
             * we add mdTheme theme to colors who doesn't specified a theme
             *
             * # example
             * <hljs lang="html">
             *   <div md-theme="myTheme">
             *     <div md-colors="{background: 'primary-600'}">
             *       <span md-colors="{background: 'mySecondTheme-accent-200'}">Color demo</span>
             *     </div>
             *   </div>
             * </hljs>
             *
             * 'primary-600' will be 'myTheme-primary-600',
             * but 'mySecondTheme-accent-200' will stay the same cause it has a theme prefix
             */
            if (mdThemeController) {
              Object.keys(colors).forEach(function (prop) {
                var color = colors[prop];
                if (!$mdColors.hasTheme(color)) {
                  colors[prop] = (theme || mdThemeController.$mdTheme) + '-' + color;
                }
              });
            }

            cleanElement(colors);

            return colors;
          };

          var cleanElement = function (colors) {
            if (!angular.equals(colors, lastColors)) {
              var keys = Object.keys(lastColors);

              if (lastColors.background && !keys['color']) {
                keys.push('color');
              }

              keys.forEach(function (key) {
                element.css(key, '');
              });
            }

            lastColors = colors;
          };

          /**
           * Registering for mgTheme changes and asking mdTheme controller run our callback whenever a theme changes
           */
          var unregisterChanges = angular.noop;

          if (mdThemeController) {
            unregisterChanges = mdThemeController.registerChanges(function (theme) {
              $mdColors.applyThemeColors(element, parseColors(theme));
            });
          }

          scope.$on('$destroy', function () {
            unregisterChanges();
          });

          try {
            if (shouldWatch) {
              scope.$watch(parseColors, angular.bind(this,
                $mdColors.applyThemeColors, element
              ), true);
            }
            else {
              $mdColors.applyThemeColors(element, parseColors());
            }

          }
          catch (e) {
            $log.error(e.message);
          }

        };

        function shouldColorsWatch() {
          // Simulate 1x binding and mark mdColorsWatch == false
          var rawColorExpression = tAttrs.mdColors;
          var bindOnce = rawColorExpression.indexOf('::') > -1;
          var isStatic = bindOnce ? true : STATIC_COLOR_EXPRESSION.test(tAttrs.mdColors);

          // Remove it for the postLink...
          tAttrs.mdColors = rawColorExpression.replace('::', '');

          var hasWatchAttr = angular.isDefined(tAttrs.mdColorsWatch);

          return (bindOnce || isStatic) ? false :
            hasWatchAttr ? $mdUtil.parseAttributeBoolean(tAttrs.mdColorsWatch) : true;
        }
      }
    };

  }
  MdColorsDirective.$inject = ["$mdColors", "$mdUtil", "$log", "$parse"];


})();

})();
(function(){
"use strict";

/**
 * @ngdoc module
 * @name material.components.button
 * @description
 *
 * Button
 */
angular
    .module('material.components.button', [ 'material.core' ])
    .directive('mdButton', MdButtonDirective)
    .directive('a', MdAnchorDirective);


/**
 * @private
 * @restrict E
 *
 * @description
 * `a` is an anchor directive used to inherit theme colors for md-primary, md-accent, etc.
 *
 * @usage
 *
 * <hljs lang="html">
 *  <md-content md-theme="myTheme">
 *    <a href="#chapter1" class="md-accent"></a>
 *  </md-content>
 * </hljs>
 */
function MdAnchorDirective($mdTheming) {
  return {
    restrict : 'E',
    link : function postLink(scope, element) {
      // Make sure to inherit theme so stand-alone anchors
      // support theme colors for md-primary, md-accent, etc.
      $mdTheming(element);
    }
  };
}
MdAnchorDirective.$inject = ["$mdTheming"];


/**
 * @ngdoc directive
 * @name mdButton
 * @module material.components.button
 *
 * @restrict E
 *
 * @description
 * `<md-button>` is a button directive with optional ink ripples (default enabled).
 *
 * If you supply a `href` or `ng-href` attribute, it will become an `<a>` element. Otherwise, it will
 * become a `<button>` element. As per the [Material Design specifications](http://www.google.com/design/spec/style/color.html#color-ui-color-application)
 * the FAB button background is filled with the accent color [by default]. The primary color palette may be used with
 * the `md-primary` class.
 *
 * Developers can also change the color palette of the button, by using the following classes
 * - `md-primary`
 * - `md-accent`
 * - `md-warn`
 *
 * See for example
 *
 * <hljs lang="html">
 *   <md-button class="md-primary">Primary Button</md-button>
 * </hljs>
 *
 * Button can be also raised, which means that they will use the current color palette to fill the button.
 *
 * <hljs lang="html">
 *   <md-button class="md-accent md-raised">Raised and Accent Button</md-button>
 * </hljs>
 *
 * It is also possible to disable the focus effect on the button, by using the following markup.
 *
 * <hljs lang="html">
 *   <md-button class="md-no-focus">No Focus Style</md-button>
 * </hljs>
 *
 * @param {boolean=} md-no-ink If present, disable ripple ink effects.
 * @param {expression=} ng-disabled En/Disable based on the expression
 * @param {string=} md-ripple-size Overrides the default ripple size logic. Options: `full`, `partial`, `auto`
 * @param {string=} aria-label Adds alternative text to button for accessibility, useful for icon buttons.
 * If no default text is found, a warning will be logged.
 *
 * @usage
 *
 * Regular buttons:
 *
 * <hljs lang="html">
 *  <md-button> Flat Button </md-button>
 *  <md-button href="http://google.com"> Flat link </md-button>
 *  <md-button class="md-raised"> Raised Button </md-button>
 *  <md-button ng-disabled="true"> Disabled Button </md-button>
 *  <md-button>
 *    <md-icon md-svg-src="your/icon.svg"></md-icon>
 *    Register Now
 *  </md-button>
 * </hljs>
 *
 * FAB buttons:
 *
 * <hljs lang="html">
 *  <md-button class="md-fab" aria-label="FAB">
 *    <md-icon md-svg-src="your/icon.svg"></md-icon>
 *  </md-button>
 *  <!-- mini-FAB -->
 *  <md-button class="md-fab md-mini" aria-label="Mini FAB">
 *    <md-icon md-svg-src="your/icon.svg"></md-icon>
 *  </md-button>
 *  <!-- Button with SVG Icon -->
 *  <md-button class="md-icon-button" aria-label="Custom Icon Button">
 *    <md-icon md-svg-icon="path/to/your.svg"></md-icon>
 *  </md-button>
 * </hljs>
 */
function MdButtonDirective($mdButtonInkRipple, $mdTheming, $mdAria, $timeout) {

  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    template: getTemplate,
    link: postLink
  };

  function isAnchor(attr) {
    return angular.isDefined(attr.href) || angular.isDefined(attr.ngHref) || angular.isDefined(attr.ngLink) || angular.isDefined(attr.uiSref);
  }

  function getTemplate(element, attr) {
    if (isAnchor(attr)) {
      return '<a class="md-button" ng-transclude></a>';
    } else {
      //If buttons don't have type="button", they will submit forms automatically.
      var btnType = (typeof attr.type === 'undefined') ? 'button' : attr.type;
      return '<button class="md-button" type="' + btnType + '" ng-transclude></button>';
    }
  }

  function postLink(scope, element, attr) {
    $mdTheming(element);
    $mdButtonInkRipple.attach(scope, element);

    // Use async expect to support possible bindings in the button label
    $mdAria.expectWithoutText(element, 'aria-label');

    // For anchor elements, we have to set tabindex manually when the
    // element is disabled
    if (isAnchor(attr) && angular.isDefined(attr.ngDisabled) ) {
      scope.$watch(attr.ngDisabled, function(isDisabled) {
        element.attr('tabindex', isDisabled ? -1 : 0);
      });
    }

    // disabling click event when disabled is true
    element.on('click', function(e){
      if (attr.disabled === true) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    });

    if (!element.hasClass('md-no-focus')) {
      // restrict focus styles to the keyboard
      scope.mouseActive = false;
      element.on('mousedown', function() {
        scope.mouseActive = true;
        $timeout(function(){
          scope.mouseActive = false;
        }, 100);
      })
      .on('focus', function() {
        if (scope.mouseActive === false) {
          element.addClass('md-focused');
        }
      })
      .on('blur', function(ev) {
        element.removeClass('md-focused');
      });
    }

  }

}
MdButtonDirective.$inject = ["$mdButtonInkRipple", "$mdTheming", "$mdAria", "$timeout"];

})();
(function(){
"use strict";

/**
 * @ngdoc module
 * @name material.components.dialog
 */
angular
  .module('material.components.dialog', [
    'material.core',
    'material.components.backdrop'
  ])
  .directive('mdDialog', MdDialogDirective)
  .provider('$mdDialog', MdDialogProvider);

/**
 * @ngdoc directive
 * @name mdDialog
 * @module material.components.dialog
 *
 * @restrict E
 *
 * @description
 * `<md-dialog>` - The dialog's template must be inside this element.
 *
 * Inside, use an `<md-dialog-content>` element for the dialog's content, and use
 * an `<md-dialog-actions>` element for the dialog's actions.
 *
 * ## CSS
 * - `.md-dialog-content` - class that sets the padding on the content as the spec file
 *
 * ## Notes
 * - If you specify an `id` for the `<md-dialog>`, the `<md-dialog-content>` will have the same `id`
 * prefixed with `dialogContent_`.
 *
 * @usage
 * ### Dialog template
 * <hljs lang="html">
 * <md-dialog aria-label="List dialog">
 *   <md-dialog-content>
 *     <md-list>
 *       <md-list-item ng-repeat="item in items">
 *         <p>Number {{item}}</p>
 *       </md-list-item>
 *     </md-list>
 *   </md-dialog-content>
 *   <md-dialog-actions>
 *     <md-button ng-click="closeDialog()" class="md-primary">Close Dialog</md-button>
 *   </md-dialog-actions>
 * </md-dialog>
 * </hljs>
 */
function MdDialogDirective($$rAF, $mdTheming, $mdDialog) {
  return {
    restrict: 'E',
    link: function(scope, element) {
      element.addClass('_md');     // private md component indicator for styling

      $mdTheming(element);
      $$rAF(function() {
        var images;
        var content = element[0].querySelector('md-dialog-content');

        if (content) {
          images = content.getElementsByTagName('img');
          addOverflowClass();
          //-- delayed image loading may impact scroll height, check after images are loaded
          angular.element(images).on('load', addOverflowClass);
        }

        scope.$on('$destroy', function() {
          $mdDialog.destroy(element);
        });

        /**
         *
         */
        function addOverflowClass() {
          element.toggleClass('md-content-overflow', content.scrollHeight > content.clientHeight);
        }


      });
    }
  };
}
MdDialogDirective.$inject = ["$$rAF", "$mdTheming", "$mdDialog"];

/**
 * @ngdoc service
 * @name $mdDialog
 * @module material.components.dialog
 *
 * @description
 * `$mdDialog` opens a dialog over the app to inform users about critical information or require
 *  them to make decisions. There are two approaches for setup: a simple promise API
 *  and regular object syntax.
 *
 * ## Restrictions
 *
 * - The dialog is always given an isolate scope.
 * - The dialog's template must have an outer `<md-dialog>` element.
 *   Inside, use an `<md-dialog-content>` element for the dialog's content, and use
 *   an `<md-dialog-actions>` element for the dialog's actions.
 * - Dialogs must cover the entire application to keep interactions inside of them.
 * Use the `parent` option to change where dialogs are appended.
 *
 * ## Sizing
 * - Complex dialogs can be sized with `flex="percentage"`, i.e. `flex="66"`.
 * - Default max-width is 80% of the `rootElement` or `parent`.
 *
 * ## CSS
 * - `.md-dialog-content` - class that sets the padding on the content as the spec file
 *
 * @usage
 * <hljs lang="html">
 * <div  ng-app="demoApp" ng-controller="EmployeeController">
 *   <div>
 *     <md-button ng-click="showAlert()" class="md-raised md-warn">
 *       Employee Alert!
 *       </md-button>
 *   </div>
 *   <div>
 *     <md-button ng-click="showDialog($event)" class="md-raised">
 *       Custom Dialog
 *       </md-button>
 *   </div>
 *   <div>
 *     <md-button ng-click="closeAlert()" ng-disabled="!hasAlert()" class="md-raised">
 *       Close Alert
 *     </md-button>
 *   </div>
 *   <div>
 *     <md-button ng-click="showGreeting($event)" class="md-raised md-primary" >
 *       Greet Employee
 *       </md-button>
 *   </div>
 * </div>
 * </hljs>
 *
 * ### JavaScript: object syntax
 * <hljs lang="js">
 * (function(angular, undefined){
 *   "use strict";
 *
 *   angular
 *    .module('demoApp', ['ngMaterial'])
 *    .controller('AppCtrl', AppController);
 *
 *   function AppController($scope, $mdDialog) {
 *     var alert;
 *     $scope.showAlert = showAlert;
 *     $scope.showDialog = showDialog;
 *     $scope.items = [1, 2, 3];
 *
 *     // Internal method
 *     function showAlert() {
 *       alert = $mdDialog.alert({
 *         title: 'Attention',
 *         textContent: 'This is an example of how easy dialogs can be!',
 *         ok: 'Close'
 *       });
 *
 *       $mdDialog
 *         .show( alert )
 *         .finally(function() {
 *           alert = undefined;
 *         });
 *     }
 *
 *     function showDialog($event) {
 *        var parentEl = angular.element(document.body);
 *        $mdDialog.show({
 *          parent: parentEl,
 *          targetEvent: $event,
 *          template:
 *            '<md-dialog aria-label="List dialog">' +
 *            '  <md-dialog-content>'+
 *            '    <md-list>'+
 *            '      <md-list-item ng-repeat="item in items">'+
 *            '       <p>Number {{item}}</p>' +
 *            '      </md-item>'+
 *            '    </md-list>'+
 *            '  </md-dialog-content>' +
 *            '  <md-dialog-actions>' +
 *            '    <md-button ng-click="closeDialog()" class="md-primary">' +
 *            '      Close Dialog' +
 *            '    </md-button>' +
 *            '  </md-dialog-actions>' +
 *            '</md-dialog>',
 *          locals: {
 *            items: $scope.items
 *          },
 *          controller: DialogController
 *       });
 *       function DialogController($scope, $mdDialog, items) {
 *         $scope.items = items;
 *         $scope.closeDialog = function() {
 *           $mdDialog.hide();
 *         }
 *       }
 *     }
 *   }
 * })(angular);
 * </hljs>
 *
 * ### Pre-Rendered Dialogs
 * By using the `contentElement` option, it is possible to use an already existing element in the DOM.
 *
 * <hljs lang="js">
 *   $scope.showPrerenderedDialog = function() {
 *     $mdDialog.show({
 *       contentElement: '#myStaticDialog',
 *       parent: angular.element(document.body)
 *     });
 *   };
 * </hljs>
 *
 * When using a string as value, `$mdDialog` will automatically query the DOM for the specified CSS selector.
 *
 * <hljs lang="html">
 *   <div style="visibility: hidden">
 *     <div class="md-dialog-container" id="myStaticDialog">
 *       <md-dialog>
 *         This is a pre-rendered dialog.
 *       </md-dialog>
 *     </div>
 *   </div>
 * </hljs>
 *
 * **Notice**: It is important, to use the `.md-dialog-container` as the content element, otherwise the dialog
 * will not show up.
 *
 * It also possible to use a DOM element for the `contentElement` option.
 * - `contentElement: document.querySelector('#myStaticDialog')`
 * - `contentElement: angular.element(TEMPLATE)`
 *
 * When using a `template` as content element, it will be not compiled upon open.
 * This allows you to compile the element yourself and use it each time the dialog opens.
 *
 * ### Custom Presets
 * Developers are also able to create their own preset, which can be easily used without repeating
 * their options each time.
 *
 * <hljs lang="js">
 *   $mdDialogProvider.addPreset('testPreset', {
 *     options: function() {
 *       return {
 *         template:
 *           '<md-dialog>' +
 *             'This is a custom preset' +
 *           '</md-dialog>',
 *         controllerAs: 'dialog',
 *         bindToController: true,
 *         clickOutsideToClose: true,
 *         escapeToClose: true
 *       };
 *     }
 *   });
 * </hljs>
 *
 * After you created your preset at config phase, you can easily access it.
 *
 * <hljs lang="js">
 *   $mdDialog.show(
 *     $mdDialog.testPreset()
 *   );
 * </hljs>
 *
 * ### JavaScript: promise API syntax, custom dialog template
 * <hljs lang="js">
 * (function(angular, undefined){
 *   "use strict";
 *
 *   angular
 *     .module('demoApp', ['ngMaterial'])
 *     .controller('EmployeeController', EmployeeEditor)
 *     .controller('GreetingController', GreetingController);
 *
 *   // Fictitious Employee Editor to show how to use simple and complex dialogs.
 *
 *   function EmployeeEditor($scope, $mdDialog) {
 *     var alert;
 *
 *     $scope.showAlert = showAlert;
 *     $scope.closeAlert = closeAlert;
 *     $scope.showGreeting = showCustomGreeting;
 *
 *     $scope.hasAlert = function() { return !!alert };
 *     $scope.userName = $scope.userName || 'Bobby';
 *
 *     // Dialog #1 - Show simple alert dialog and cache
 *     // reference to dialog instance
 *
 *     function showAlert() {
 *       alert = $mdDialog.alert()
 *         .title('Attention, ' + $scope.userName)
 *         .textContent('This is an example of how easy dialogs can be!')
 *         .ok('Close');
 *
 *       $mdDialog
 *           .show( alert )
 *           .finally(function() {
 *             alert = undefined;
 *           });
 *     }
 *
 *     // Close the specified dialog instance and resolve with 'finished' flag
 *     // Normally this is not needed, just use '$mdDialog.hide()' to close
 *     // the most recent dialog popup.
 *
 *     function closeAlert() {
 *       $mdDialog.hide( alert, "finished" );
 *       alert = undefined;
 *     }
 *
 *     // Dialog #2 - Demonstrate more complex dialogs construction and popup.
 *
 *     function showCustomGreeting($event) {
 *         $mdDialog.show({
 *           targetEvent: $event,
 *           template:
 *             '<md-dialog>' +
 *
 *             '  <md-dialog-content>Hello {{ employee }}!</md-dialog-content>' +
 *
 *             '  <md-dialog-actions>' +
 *             '    <md-button ng-click="closeDialog()" class="md-primary">' +
 *             '      Close Greeting' +
 *             '    </md-button>' +
 *             '  </md-dialog-actions>' +
 *             '</md-dialog>',
 *           controller: 'GreetingController',
 *           onComplete: afterShowAnimation,
 *           locals: { employee: $scope.userName }
 *         });
 *
 *         // When the 'enter' animation finishes...
 *
 *         function afterShowAnimation(scope, element, options) {
 *            // post-show code here: DOM element focus, etc.
 *         }
 *     }
 *
 *     // Dialog #3 - Demonstrate use of ControllerAs and passing $scope to dialog
 *     //             Here we used ng-controller="GreetingController as vm" and
 *     //             $scope.vm === <controller instance>
 *
 *     function showCustomGreeting() {
 *
 *        $mdDialog.show({
 *           clickOutsideToClose: true,
 *
 *           scope: $scope,        // use parent scope in template
 *           preserveScope: true,  // do not forget this if use parent scope

 *           // Since GreetingController is instantiated with ControllerAs syntax
 *           // AND we are passing the parent '$scope' to the dialog, we MUST
 *           // use 'vm.<xxx>' in the template markup
 *
 *           template: '<md-dialog>' +
 *                     '  <md-dialog-content>' +
 *                     '     Hi There {{vm.employee}}' +
 *                     '  </md-dialog-content>' +
 *                     '</md-dialog>',
 *
 *           controller: function DialogController($scope, $mdDialog) {
 *             $scope.closeDialog = function() {
 *               $mdDialog.hide();
 *             }
 *           }
 *        });
 *     }
 *
 *   }
 *
 *   // Greeting controller used with the more complex 'showCustomGreeting()' custom dialog
 *
 *   function GreetingController($scope, $mdDialog, employee) {
 *     // Assigned from construction <code>locals</code> options...
 *     $scope.employee = employee;
 *
 *     $scope.closeDialog = function() {
 *       // Easily hides most recent dialog shown...
 *       // no specific instance reference is needed.
 *       $mdDialog.hide();
 *     };
 *   }
 *
 * })(angular);
 * </hljs>
 */

/**
 * @ngdoc method
 * @name $mdDialog#alert
 *
 * @description
 * Builds a preconfigured dialog with the specified message.
 *
 * @returns {obj} an `$mdDialogPreset` with the chainable configuration methods:
 *
 * - $mdDialogPreset#title(string) - Sets the alert title.
 * - $mdDialogPreset#textContent(string) - Sets the alert message.
 * - $mdDialogPreset#htmlContent(string) - Sets the alert message as HTML. Requires ngSanitize
 *     module to be loaded. HTML is not run through Angular's compiler.
 * - $mdDialogPreset#ok(string) - Sets the alert "Okay" button text.
 * - $mdDialogPreset#theme(string) - Sets the theme of the alert dialog.
 * - $mdDialogPreset#targetEvent(DOMClickEvent=) - A click's event object. When passed in as an option,
 *     the location of the click will be used as the starting point for the opening animation
 *     of the the dialog.
 *
 */

/**
 * @ngdoc method
 * @name $mdDialog#confirm
 *
 * @description
 * Builds a preconfigured dialog with the specified message. You can call show and the promise returned
 * will be resolved only if the user clicks the confirm action on the dialog.
 *
 * @returns {obj} an `$mdDialogPreset` with the chainable configuration methods:
 *
 * Additionally, it supports the following methods:
 *
 * - $mdDialogPreset#title(string) - Sets the confirm title.
 * - $mdDialogPreset#textContent(string) - Sets the confirm message.
 * - $mdDialogPreset#htmlContent(string) - Sets the confirm message as HTML. Requires ngSanitize
 *     module to be loaded. HTML is not run through Angular's compiler.
 * - $mdDialogPreset#ok(string) - Sets the confirm "Okay" button text.
 * - $mdDialogPreset#cancel(string) - Sets the confirm "Cancel" button text.
 * - $mdDialogPreset#theme(string) - Sets the theme of the confirm dialog.
 * - $mdDialogPreset#targetEvent(DOMClickEvent=) - A click's event object. When passed in as an option,
 *     the location of the click will be used as the starting point for the opening animation
 *     of the the dialog.
 *
 */

/**
 * @ngdoc method
 * @name $mdDialog#prompt
 *
 * @description
 * Builds a preconfigured dialog with the specified message and input box. You can call show and the promise returned
 * will be resolved only if the user clicks the prompt action on the dialog, passing the input value as the first argument.
 *
 * @returns {obj} an `$mdDialogPreset` with the chainable configuration methods:
 *
 * Additionally, it supports the following methods:
 *
 * - $mdDialogPreset#title(string) - Sets the prompt title.
 * - $mdDialogPreset#textContent(string) - Sets the prompt message.
 * - $mdDialogPreset#htmlContent(string) - Sets the prompt message as HTML. Requires ngSanitize
 *     module to be loaded. HTML is not run through Angular's compiler.
 * - $mdDialogPreset#placeholder(string) - Sets the placeholder text for the input.
 * - $mdDialogPreset#initialValue(string) - Sets the initial value for the prompt input.
 * - $mdDialogPreset#ok(string) - Sets the prompt "Okay" button text.
 * - $mdDialogPreset#cancel(string) - Sets the prompt "Cancel" button text.
 * - $mdDialogPreset#theme(string) - Sets the theme of the prompt dialog.
 * - $mdDialogPreset#targetEvent(DOMClickEvent=) - A click's event object. When passed in as an option,
 *     the location of the click will be used as the starting point for the opening animation
 *     of the the dialog.
 *
 */

/**
 * @ngdoc method
 * @name $mdDialog#show
 *
 * @description
 * Show a dialog with the specified options.
 *
 * @param {object} optionsOrPreset Either provide an `$mdDialogPreset` returned from `alert()`, and
 * `confirm()`, or an options object with the following properties:
 *   - `templateUrl` - `{string=}`: The url of a template that will be used as the content
 *   of the dialog.
 *   - `template` - `{string=}`: HTML template to show in the dialog. This **must** be trusted HTML
 *      with respect to Angular's [$sce service](https://docs.angularjs.org/api/ng/service/$sce).
 *      This template should **never** be constructed with any kind of user input or user data.
 *   - `contentElement` - `{string|Element}`: Instead of using a template, which will be compiled each time a
 *     dialog opens, you can also use a DOM element.<br/>
 *     * When specifying an element, which is present on the DOM, `$mdDialog` will temporary fetch the element into
 *       the dialog and restores it at the old DOM position upon close.
 *     * When specifying a string, the string be used as a CSS selector, to lookup for the element in the DOM.
 *   - `autoWrap` - `{boolean=}`: Whether or not to automatically wrap the template with a
 *     `<md-dialog>` tag if one is not provided. Defaults to true. Can be disabled if you provide a
 *     custom dialog directive.
 *   - `targetEvent` - `{DOMClickEvent=}`: A click's event object. When passed in as an option,
 *     the location of the click will be used as the starting point for the opening animation
 *     of the the dialog.
 *   - `openFrom` - `{string|Element|object}`: The query selector, DOM element or the Rect object
 *     that is used to determine the bounds (top, left, height, width) from which the Dialog will
 *     originate.
 *   - `closeTo` - `{string|Element|object}`: The query selector, DOM element or the Rect object
 *     that is used to determine the bounds (top, left, height, width) to which the Dialog will
 *     target.
 *   - `scope` - `{object=}`: the scope to link the template / controller to. If none is specified,
 *     it will create a new isolate scope.
 *     This scope will be destroyed when the dialog is removed unless `preserveScope` is set to true.
 *   - `preserveScope` - `{boolean=}`: whether to preserve the scope when the element is removed. Default is false
 *   - `disableParentScroll` - `{boolean=}`: Whether to disable scrolling while the dialog is open.
 *     Default true.
 *   - `hasBackdrop` - `{boolean=}`: Whether there should be an opaque backdrop behind the dialog.
 *     Default true.
 *   - `clickOutsideToClose` - `{boolean=}`: Whether the user can click outside the dialog to
 *     close it. Default false.
 *   - `escapeToClose` - `{boolean=}`: Whether the user can press escape to close the dialog.
 *     Default true.
 *   - `focusOnOpen` - `{boolean=}`: An option to override focus behavior on open. Only disable if
 *     focusing some other way, as focus management is required for dialogs to be accessible.
 *     Defaults to true.
 *   - `controller` - `{function|string=}`: The controller to associate with the dialog. The controller
 *     will be injected with the local `$mdDialog`, which passes along a scope for the dialog.
 *   - `locals` - `{object=}`: An object containing key/value pairs. The keys will be used as names
 *     of values to inject into the controller. For example, `locals: {three: 3}` would inject
 *     `three` into the controller, with the value 3. If `bindToController` is true, they will be
 *     copied to the controller instead.
 *   - `bindToController` - `bool`: bind the locals to the controller, instead of passing them in.
 *   - `resolve` - `{object=}`: Similar to locals, except it takes promises as values, and the
 *     dialog will not open until all of the promises resolve.
 *   - `controllerAs` - `{string=}`: An alias to assign the controller to on the scope.
 *   - `parent` - `{element=}`: The element to append the dialog to. Defaults to appending
 *     to the root element of the application.
 *   - `onShowing` - `function(scope, element)`: Callback function used to announce the show() action is
 *     starting.
 *   - `onComplete` - `function(scope, element)`: Callback function used to announce when the show() action is
 *     finished.
 *   - `onRemoving` - `function(element, removePromise)`: Callback function used to announce the
 *      close/hide() action is starting. This allows developers to run custom animations
 *      in parallel the close animations.
 *   - `fullscreen` `{boolean=}`: An option to apply `.md-dialog-fullscreen` class on open.
 * @returns {promise} A promise that can be resolved with `$mdDialog.hide()` or
 * rejected with `$mdDialog.cancel()`.
 */

/**
 * @ngdoc method
 * @name $mdDialog#hide
 *
 * @description
 * Hide an existing dialog and resolve the promise returned from `$mdDialog.show()`.
 *
 * @param {*=} response An argument for the resolved promise.
 *
 * @returns {promise} A promise that is resolved when the dialog has been closed.
 */

/**
 * @ngdoc method
 * @name $mdDialog#cancel
 *
 * @description
 * Hide an existing dialog and reject the promise returned from `$mdDialog.show()`.
 *
 * @param {*=} response An argument for the rejected promise.
 *
 * @returns {promise} A promise that is resolved when the dialog has been closed.
 */

function MdDialogProvider($$interimElementProvider) {
  // Elements to capture and redirect focus when the user presses tab at the dialog boundary.
  var topFocusTrap, bottomFocusTrap;

  advancedDialogOptions.$inject = ["$mdDialog", "$mdConstant"];
  dialogDefaultOptions.$inject = ["$mdDialog", "$mdAria", "$mdUtil", "$mdConstant", "$animate", "$document", "$window", "$rootElement", "$log", "$injector", "$mdTheming"];
  return $$interimElementProvider('$mdDialog')
    .setDefaults({
      methods: ['disableParentScroll', 'hasBackdrop', 'clickOutsideToClose', 'escapeToClose',
          'targetEvent', 'closeTo', 'openFrom', 'parent', 'fullscreen', 'contentElement'],
      options: dialogDefaultOptions
    })
    .addPreset('alert', {
      methods: ['title', 'htmlContent', 'textContent', 'content', 'ariaLabel', 'ok', 'theme',
          'css'],
      options: advancedDialogOptions
    })
    .addPreset('confirm', {
      methods: ['title', 'htmlContent', 'textContent', 'content', 'ariaLabel', 'ok', 'cancel',
          'theme', 'css'],
      options: advancedDialogOptions
    })
    .addPreset('prompt', {
      methods: ['title', 'htmlContent', 'textContent', 'initialValue', 'content', 'placeholder', 'ariaLabel',
          'ok', 'cancel', 'theme', 'css'],
      options: advancedDialogOptions
    });

  /* @ngInject */
  function advancedDialogOptions($mdDialog, $mdConstant) {
    return {
      template: [
        '<md-dialog md-theme="{{ dialog.theme }}" aria-label="{{ dialog.ariaLabel }}" ng-class="dialog.css">',
        '  <md-dialog-content class="md-dialog-content" role="document" tabIndex="-1">',
        '    <h2 class="md-title">{{ dialog.title }}</h2>',
        '    <div ng-if="::dialog.mdHtmlContent" class="md-dialog-content-body" ',
        '        ng-bind-html="::dialog.mdHtmlContent"></div>',
        '    <div ng-if="::!dialog.mdHtmlContent" class="md-dialog-content-body">',
        '      <p>{{::dialog.mdTextContent}}</p>',
        '    </div>',
        '    <md-input-container md-no-float ng-if="::dialog.$type == \'prompt\'" class="md-prompt-input-container">',
        '      <input ng-keypress="dialog.keypress($event)" md-autofocus ng-model="dialog.result" ' +
        '             placeholder="{{::dialog.placeholder}}">',
        '    </md-input-container>',
        '  </md-dialog-content>',
        '  <md-dialog-actions>',
        '    <md-button ng-if="dialog.$type === \'confirm\' || dialog.$type === \'prompt\'"' +
        '               ng-click="dialog.abort()" class="md-primary">',
        '      {{ dialog.cancel }}',
        '    </md-button>',
        '    <md-button ng-click="dialog.hide()" class="md-primary" md-autofocus="dialog.$type===\'alert\'">',
        '      {{ dialog.ok }}',
        '    </md-button>',
        '  </md-dialog-actions>',
        '</md-dialog>'
      ].join('').replace(/\s\s+/g, ''),
      controller: function mdDialogCtrl() {
        var isPrompt = this.$type == 'prompt';

        if (isPrompt && this.initialValue) {
          this.result = this.initialValue;
        }

        this.hide = function() {
          $mdDialog.hide(isPrompt ? this.result : true);
        };
        this.abort = function() {
          $mdDialog.cancel();
        };
        this.keypress = function($event) {
          if ($event.keyCode === $mdConstant.KEY_CODE.ENTER) {
            $mdDialog.hide(this.result)
          }
        }
      },
      controllerAs: 'dialog',
      bindToController: true,
    };
  }

  /* @ngInject */
  function dialogDefaultOptions($mdDialog, $mdAria, $mdUtil, $mdConstant, $animate, $document, $window, $rootElement,
                                $log, $injector, $mdTheming) {

    return {
      hasBackdrop: true,
      isolateScope: true,
      onCompiling: beforeCompile,
      onShow: onShow,
      onShowing: beforeShow,
      onRemove: onRemove,
      clickOutsideToClose: false,
      escapeToClose: true,
      targetEvent: null,
      contentElement: null,
      closeTo: null,
      openFrom: null,
      focusOnOpen: true,
      disableParentScroll: true,
      autoWrap: true,
      fullscreen: false,
      transformTemplate: function(template, options) {
        // Make the dialog container focusable, because otherwise the focus will be always redirected to
        // an element outside of the container, and the focus trap won't work probably..
        // Also the tabindex is needed for the `escapeToClose` functionality, because
        // the keyDown event can't be triggered when the focus is outside of the container.
        return '<div class="md-dialog-container" tabindex="-1">' + validatedTemplate(template) + '</div>';

        /**
         * The specified template should contain a <md-dialog> wrapper element....
         */
        function validatedTemplate(template) {
          if (options.autoWrap && !/<\/md-dialog>/g.test(template)) {
            return '<md-dialog>' + (template || '') + '</md-dialog>';
          } else {
            return template || '';
          }
        }
      }
    };

    function beforeCompile(options) {
      // Automatically apply the theme, if the user didn't specify a theme explicitly.
      // Those option changes need to be done, before the compilation has started, because otherwise
      // the option changes will be not available in the $mdCompilers locales.
      detectTheming(options);
    }

    function beforeShow(scope, element, options, controller) {

      if (controller) {
        controller.mdHtmlContent = controller.htmlContent || options.htmlContent || '';
        controller.mdTextContent = controller.textContent || options.textContent ||
            controller.content || options.content || '';

        if (controller.mdHtmlContent && !$injector.has('$sanitize')) {
          throw Error('The ngSanitize module must be loaded in order to use htmlContent.');
        }

        if (controller.mdHtmlContent && controller.mdTextContent) {
          throw Error('md-dialog cannot have both `htmlContent` and `textContent`');
        }
      }
    }

    /** Show method for dialogs */
    function onShow(scope, element, options, controller) {
      angular.element($document[0].body).addClass('md-dialog-is-showing');

      if (options.contentElement) {
        var contentEl = options.contentElement;

        if (angular.isString(contentEl)) {
          contentEl = document.querySelector(contentEl);
          options.elementInsertionSibling = contentEl.nextElementSibling;
          options.elementInsertionParent = contentEl.parentNode;
        } else {
          contentEl = contentEl[0] || contentEl;
          // When the element is not visible in the DOM, then we can treat is as same
          // as a normal dialog would do. Removing it at close etc.
          // ---
          // When the element is visible in the DOM, then we restore it at close of the dialog.
          if (document.contains(contentEl)) {
            options.elementInsertionSibling = contentEl.nextElementSibling;
            options.elementInsertionParent = contentEl.parentNode;
          }
        }

        options.elementInsertionEntry = contentEl;
        element = angular.element(contentEl);
      }

      var dialogElement = element.find('md-dialog');

      // Once a dialog has `ng-cloak` applied on his template the dialog animation will not work properly.
      // This is a very common problem, so we have to notify the developer about this.
      if (dialogElement.hasClass('ng-cloak')) {
        var message = '$mdDialog: using `<md-dialog ng-cloak >` will affect the dialog opening animations.';
        $log.warn( message, element[0] );
      }

      captureParentAndFromToElements(options);
      configureAria(dialogElement, options);
      showBackdrop(scope, element, options);
      activateListeners(element, options);

      return dialogPopIn(element, options)
        .then(function() {
          lockScreenReader(element, options);
          warnDeprecatedActions();
          focusOnOpen();
        });

      /**
       * Check to see if they used the deprecated .md-actions class and log a warning
       */
      function warnDeprecatedActions() {
        if (element[0].querySelector('.md-actions')) {
          $log.warn('Using a class of md-actions is deprecated, please use <md-dialog-actions>.');
        }
      }

      /**
       * For alerts, focus on content... otherwise focus on
       * the close button (or equivalent)
       */
      function focusOnOpen() {
        if (options.focusOnOpen) {
          var target = $mdUtil.findFocusTarget(element) || findCloseButton();
          target.focus();
        }

        /**
         * If no element with class dialog-close, try to find the last
         * button child in md-actions and assume it is a close button.
         *
         * If we find no actions at all, log a warning to the console.
         */
        function findCloseButton() {
          var closeButton = element[0].querySelector('.dialog-close');
          if (!closeButton) {
            var actionButtons = element[0].querySelectorAll('.md-actions button, md-dialog-actions button');
            closeButton = actionButtons[actionButtons.length - 1];
          }
          return angular.element(closeButton);
        }
      }
    }

    /**
     * Remove function for all dialogs
     */
    function onRemove(scope, element, options) {
      options.deactivateListeners();
      options.unlockScreenReader();
      options.hideBackdrop(options.$destroy);

      // Remove the focus traps that we added earlier for keeping focus within the dialog.
      if (topFocusTrap && topFocusTrap.parentNode) {
        topFocusTrap.parentNode.removeChild(topFocusTrap);
      }

      if (bottomFocusTrap && bottomFocusTrap.parentNode) {
        bottomFocusTrap.parentNode.removeChild(bottomFocusTrap);
      }

      // For navigation $destroy events, do a quick, non-animated removal,
      // but for normal closes (from clicks, etc) animate the removal
      return !!options.$destroy ? detachAndClean() : animateRemoval().then( detachAndClean );

      /**
       * For normal closes, animate the removal.
       * For forced closes (like $destroy events), skip the animations
       */
      function animateRemoval() {
        return dialogPopOut(element, options);
      }

      function removeContentElement() {
        if (!options.contentElement) return;

        options.reverseContainerStretch();

        if (!options.elementInsertionParent) {
          // When the contentElement has no parent, then it's a virtual DOM element, which should
          // be removed at close, as same as normal templates inside of a dialog.
          options.elementInsertionEntry.parentNode.removeChild(options.elementInsertionEntry);
        } else if (!options.elementInsertionSibling) {
          // When the contentElement doesn't have any sibling, then it can be simply appended to the
          // parent, because it plays no role, which index it had before.
          options.elementInsertionParent.appendChild(options.elementInsertionEntry);
        } else {
          // When the contentElement has a sibling, which marks the previous position of the contentElement
          // in the DOM, we insert it correctly before the sibling, to have the same index as before.
          options.elementInsertionParent.insertBefore(options.elementInsertionEntry, options.elementInsertionSibling);
        }
      }

      /**
       * Detach the element
       */
      function detachAndClean() {
        angular.element($document[0].body).removeClass('md-dialog-is-showing');
        // Only remove the element, if it's not provided through the contentElement option.
        if (!options.contentElement) {
          element.remove();
        } else {
          removeContentElement();
        }

        if (!options.$destroy) options.origin.focus();
      }
    }

    function detectTheming(options) {
      // Only detect the theming, if the developer didn't specify the theme specifically.
      if (options.theme) return;

      options.theme = $mdTheming.defaultTheme();

      if (options.targetEvent && options.targetEvent.target) {
        var targetEl = angular.element(options.targetEvent.target);

        // Once the user specifies a targetEvent, we will automatically try to find the correct
        // nested theme.
        options.theme = (targetEl.controller('mdTheme') || {}).$mdTheme || options.theme;
      }

    }

    /**
     * Capture originator/trigger/from/to element information (if available)
     * and the parent container for the dialog; defaults to the $rootElement
     * unless overridden in the options.parent
     */
    function captureParentAndFromToElements(options) {
          options.origin = angular.extend({
            element: null,
            bounds: null,
            focus: angular.noop
          }, options.origin || {});

          options.parent   = getDomElement(options.parent, $rootElement);
          options.closeTo  = getBoundingClientRect(getDomElement(options.closeTo));
          options.openFrom = getBoundingClientRect(getDomElement(options.openFrom));

          if ( options.targetEvent ) {
            options.origin   = getBoundingClientRect(options.targetEvent.target, options.origin);
          }


          /**
           * Identify the bounding RECT for the target element
           *
           */
          function getBoundingClientRect (element, orig) {
            var source = angular.element((element || {}));
            if (source && source.length) {
              // Compute and save the target element's bounding rect, so that if the
              // element is hidden when the dialog closes, we can shrink the dialog
              // back to the same position it expanded from.
              //
              // Checking if the source is a rect object or a DOM element
              var bounds = {top:0,left:0,height:0,width:0};
              var hasFn = angular.isFunction(source[0].getBoundingClientRect);

              return angular.extend(orig || {}, {
                  element : hasFn ? source : undefined,
                  bounds  : hasFn ? source[0].getBoundingClientRect() : angular.extend({}, bounds, source[0]),
                  focus   : angular.bind(source, source.focus),
              });
            }
          }

          /**
           * If the specifier is a simple string selector, then query for
           * the DOM element.
           */
          function getDomElement(element, defaultElement) {
            if (angular.isString(element)) {
              element = $document[0].querySelector(element);
            }

            // If we have a reference to a raw dom element, always wrap it in jqLite
            return angular.element(element || defaultElement);
          }

        }

    /**
     * Listen for escape keys and outside clicks to auto close
     */
    function activateListeners(element, options) {
      var window = angular.element($window);
      var onWindowResize = $mdUtil.debounce(function() {
        stretchDialogContainerToViewport(element, options);
      }, 60);

      var removeListeners = [];
      var smartClose = function() {
        // Only 'confirm' dialogs have a cancel button... escape/clickOutside will
        // cancel or fallback to hide.
        var closeFn = ( options.$type == 'alert' ) ? $mdDialog.hide : $mdDialog.cancel;
        $mdUtil.nextTick(closeFn, true);
      };

      if (options.escapeToClose) {
        var parentTarget = options.parent;
        var keyHandlerFn = function(ev) {
          if (ev.keyCode === $mdConstant.KEY_CODE.ESCAPE) {
            ev.stopPropagation();
            ev.preventDefault();

            smartClose();
          }
        };

        // Add keydown listeners
        element.on('keydown', keyHandlerFn);
        parentTarget.on('keydown', keyHandlerFn);

        // Queue remove listeners function
        removeListeners.push(function() {

          element.off('keydown', keyHandlerFn);
          parentTarget.off('keydown', keyHandlerFn);

        });
      }

      // Register listener to update dialog on window resize
      window.on('resize', onWindowResize);

      removeListeners.push(function() {
        window.off('resize', onWindowResize);
      });

      if (options.clickOutsideToClose) {
        var target = element;
        var sourceElem;

        // Keep track of the element on which the mouse originally went down
        // so that we can only close the backdrop when the 'click' started on it.
        // A simple 'click' handler does not work,
        // it sets the target object as the element the mouse went down on.
        var mousedownHandler = function(ev) {
          sourceElem = ev.target;
        };

        // We check if our original element and the target is the backdrop
        // because if the original was the backdrop and the target was inside the dialog
        // we don't want to dialog to close.
        var mouseupHandler = function(ev) {
          if (sourceElem === target[0] && ev.target === target[0]) {
            ev.stopPropagation();
            ev.preventDefault();

            smartClose();
          }
        };

        // Add listeners
        target.on('mousedown', mousedownHandler);
        target.on('mouseup', mouseupHandler);

        // Queue remove listeners function
        removeListeners.push(function() {
          target.off('mousedown', mousedownHandler);
          target.off('mouseup', mouseupHandler);
        });
      }

      // Attach specific `remove` listener handler
      options.deactivateListeners = function() {
        removeListeners.forEach(function(removeFn) {
          removeFn();
        });
        options.deactivateListeners = null;
      };
    }

    /**
     * Show modal backdrop element...
     */
    function showBackdrop(scope, element, options) {

      if (options.disableParentScroll) {
        // !! DO this before creating the backdrop; since disableScrollAround()
        //    configures the scroll offset; which is used by mdBackDrop postLink()
        options.restoreScroll = $mdUtil.disableScrollAround(element, options.parent);
      }

      if (options.hasBackdrop) {
        options.backdrop = $mdUtil.createBackdrop(scope, "md-dialog-backdrop md-opaque");
        $animate.enter(options.backdrop, options.parent);
      }

      /**
       * Hide modal backdrop element...
       */
      options.hideBackdrop = function hideBackdrop($destroy) {
        if (options.backdrop) {
          if ( !!$destroy ) options.backdrop.remove();
          else              $animate.leave(options.backdrop);
        }

        if (options.disableParentScroll) {
          options.restoreScroll();
          delete options.restoreScroll;
        }

        options.hideBackdrop = null;
      }
    }

    /**
     * Inject ARIA-specific attributes appropriate for Dialogs
     */
    function configureAria(element, options) {

      var role = (options.$type === 'alert') ? 'alertdialog' : 'dialog';
      var dialogContent = element.find('md-dialog-content');
      var existingDialogId = element.attr('id');
      var dialogContentId = 'dialogContent_' + (existingDialogId || $mdUtil.nextUid());

      element.attr({
        'role': role,
        'tabIndex': '-1'
      });

      if (dialogContent.length === 0) {
        dialogContent = element;
        // If the dialog element already had an ID, don't clobber it.
        if (existingDialogId) {
          dialogContentId = existingDialogId;
        }
      }

      dialogContent.attr('id', dialogContentId);
      element.attr('aria-describedby', dialogContentId);

      if (options.ariaLabel) {
        $mdAria.expect(element, 'aria-label', options.ariaLabel);
      }
      else {
        $mdAria.expectAsync(element, 'aria-label', function() {
          var words = dialogContent.text().split(/\s+/);
          if (words.length > 3) words = words.slice(0, 3).concat('...');
          return words.join(' ');
        });
      }

      // Set up elements before and after the dialog content to capture focus and
      // redirect back into the dialog.
      topFocusTrap = document.createElement('div');
      topFocusTrap.classList.add('md-dialog-focus-trap');
      topFocusTrap.tabIndex = 0;

      bottomFocusTrap = topFocusTrap.cloneNode(false);

      // When focus is about to move out of the dialog, we want to intercept it and redirect it
      // back to the dialog element.
      var focusHandler = function() {
        element.focus();
      };
      topFocusTrap.addEventListener('focus', focusHandler);
      bottomFocusTrap.addEventListener('focus', focusHandler);

      // The top focus trap inserted immeidately before the md-dialog element (as a sibling).
      // The bottom focus trap is inserted at the very end of the md-dialog element (as a child).
      element[0].parentNode.insertBefore(topFocusTrap, element[0]);
      element.after(bottomFocusTrap);
    }

    /**
     * Prevents screen reader interaction behind modal window
     * on swipe interfaces
     */
    function lockScreenReader(element, options) {
      var isHidden = true;

      // get raw DOM node
      walkDOM(element[0]);

      options.unlockScreenReader = function() {
        isHidden = false;
        walkDOM(element[0]);

        options.unlockScreenReader = null;
      };

      /**
       * Walk DOM to apply or remove aria-hidden on sibling nodes
       * and parent sibling nodes
       *
       */
      function walkDOM(element) {
        while (element.parentNode) {
          if (element === document.body) {
            return;
          }
          var children = element.parentNode.children;
          for (var i = 0; i < children.length; i++) {
            // skip over child if it is an ascendant of the dialog
            // or a script or style tag
            if (element !== children[i] && !isNodeOneOf(children[i], ['SCRIPT', 'STYLE'])) {
              children[i].setAttribute('aria-hidden', isHidden);
            }
          }

          walkDOM(element = element.parentNode);
        }
      }
    }

    /**
     * Ensure the dialog container fill-stretches to the viewport
     */
    function stretchDialogContainerToViewport(container, options) {
      var isFixed = $window.getComputedStyle($document[0].body).position == 'fixed';
      var backdrop = options.backdrop ? $window.getComputedStyle(options.backdrop[0]) : null;
      var height = backdrop ? Math.min($document[0].body.clientHeight, Math.ceil(Math.abs(parseInt(backdrop.height, 10)))) : 0;

      var previousStyles = {
        top: container.css('top'),
        height: container.css('height')
      };

      container.css({
        top: (isFixed ? $mdUtil.scrollTop(options.parent) : 0) + 'px',
        height: height ? height + 'px' : '100%'
      });

      return function() {
        // Reverts the modified styles back to the previous values.
        // This is needed for contentElements, which should have the same styles after close
        // as before.
        container.css(previousStyles);
      };
    }

    /**
     *  Dialog open and pop-in animation
     */
    function dialogPopIn(container, options) {
      // Add the `md-dialog-container` to the DOM
      options.parent.append(container);
      options.reverseContainerStretch = stretchDialogContainerToViewport(container, options);

      var dialogEl = container.find('md-dialog');
      var animator = $mdUtil.dom.animator;
      var buildTranslateToOrigin = animator.calculateZoomToOrigin;
      var translateOptions = {transitionInClass: 'md-transition-in', transitionOutClass: 'md-transition-out'};
      var from = animator.toTransformCss(buildTranslateToOrigin(dialogEl, options.openFrom || options.origin));
      var to = animator.toTransformCss("");  // defaults to center display (or parent or $rootElement)

      if (options.fullscreen) {
        dialogEl.addClass('md-dialog-fullscreen');
      }

      return animator
        .translate3d(dialogEl, from, to, translateOptions)
        .then(function(animateReversal) {
          // Build a reversal translate function synced to this translation...
          options.reverseAnimate = function() {
            delete options.reverseAnimate;

            if (options.closeTo) {
              // Using the opposite classes to create a close animation to the closeTo element
              translateOptions = {transitionInClass: 'md-transition-out', transitionOutClass: 'md-transition-in'};
              from = to;
              to = animator.toTransformCss(buildTranslateToOrigin(dialogEl, options.closeTo));

              return animator
                .translate3d(dialogEl, from, to,translateOptions);
            }

            return animateReversal(
              to = animator.toTransformCss(
                // in case the origin element has moved or is hidden,
                // let's recalculate the translateCSS
                buildTranslateToOrigin(dialogEl, options.origin)
              )
            );

          };

          // Builds a function, which clears the animations / transforms of the dialog element.
          // Required for contentElements, which should not have the the animation styling after
          // the dialog is closed.
          options.clearAnimate = function() {
            delete options.clearAnimate;
            return animator
              .translate3d(dialogEl, to, animator.toTransformCss(''), {});
          };

          return true;
        });
    }

    /**
     * Dialog close and pop-out animation
     */
    function dialogPopOut(container, options) {
      return options.reverseAnimate().then(function() {
        if (options.contentElement) {
          // When we use a contentElement, we want the element to be the same as before.
          // That means, that we have to clear all the animation properties, like transform.
          options.clearAnimate();
        }
      });
    }

    /**
     * Utility function to filter out raw DOM nodes
     */
    function isNodeOneOf(elem, nodeTypeArray) {
      if (nodeTypeArray.indexOf(elem.nodeName) !== -1) {
        return true;
      }
    }

  }
}
MdDialogProvider.$inject = ["$$interimElementProvider"];

})();
(function(){
"use strict";

/**
 * @ngdoc module
 * @name material.components.autocomplete
 */
/*
 * @see js folder for autocomplete implementation
 */
angular.module('material.components.autocomplete', [
  'material.core',
  'material.components.icon',
  'material.components.virtualRepeat'
]);

})();
(function(){
"use strict";

/**
 * @ngdoc module
 * @name material.components.gridList
 */
angular.module('material.components.gridList', ['material.core'])
       .directive('mdGridList', GridListDirective)
       .directive('mdGridTile', GridTileDirective)
       .directive('mdGridTileFooter', GridTileCaptionDirective)
       .directive('mdGridTileHeader', GridTileCaptionDirective)
       .factory('$mdGridLayout', GridLayoutFactory);

/**
 * @ngdoc directive
 * @name mdGridList
 * @module material.components.gridList
 * @restrict E
 * @description
 * Grid lists are an alternative to standard list views. Grid lists are distinct
 * from grids used for layouts and other visual presentations.
 *
 * A grid list is best suited to presenting a homogenous data type, typically
 * images, and is optimized for visual comprehension and differentiating between
 * like data types.
 *
 * A grid list is a continuous element consisting of tessellated, regular
 * subdivisions called cells that contain tiles (`md-grid-tile`).
 *
 * <img src="//material-design.storage.googleapis.com/publish/v_2/material_ext_publish/0Bx4BSt6jniD7OVlEaXZ5YmU1Xzg/components_grids_usage2.png"
 *    style="width: 300px; height: auto; margin-right: 16px;" alt="Concept of grid explained visually">
 * <img src="//material-design.storage.googleapis.com/publish/v_2/material_ext_publish/0Bx4BSt6jniD7VGhsOE5idWlJWXM/components_grids_usage3.png"
 *    style="width: 300px; height: auto;" alt="Grid concepts legend">
 *
 * Cells are arrayed vertically and horizontally within the grid.
 *
 * Tiles hold content and can span one or more cells vertically or horizontally.
 *
 * ### Responsive Attributes
 *
 * The `md-grid-list` directive supports "responsive" attributes, which allow
 * different `md-cols`, `md-gutter` and `md-row-height` values depending on the
 * currently matching media query.
 *
 * In order to set a responsive attribute, first define the fallback value with
 * the standard attribute name, then add additional attributes with the
 * following convention: `{base-attribute-name}-{media-query-name}="{value}"`
 * (ie. `md-cols-lg="8"`)
 *
 * @param {number} md-cols Number of columns in the grid.
 * @param {string} md-row-height One of
 * <ul>
 *   <li>CSS length - Fixed height rows (eg. `8px` or `1rem`)</li>
 *   <li>`{width}:{height}` - Ratio of width to height (eg.
 *   `md-row-height="16:9"`)</li>
 *   <li>`"fit"` - Height will be determined by subdividing the available
 *   height by the number of rows</li>
 * </ul>
 * @param {string=} md-gutter The amount of space between tiles in CSS units
 *     (default 1px)
 * @param {expression=} md-on-layout Expression to evaluate after layout. Event
 *     object is available as `$event`, and contains performance information.
 *
 * @usage
 * Basic:
 * <hljs lang="html">
 * <md-grid-list md-cols="5" md-gutter="1em" md-row-height="4:3">
 *   <md-grid-tile></md-grid-tile>
 * </md-grid-list>
 * </hljs>
 *
 * Fixed-height rows:
 * <hljs lang="html">
 * <md-grid-list md-cols="4" md-row-height="200px" ...>
 *   <md-grid-tile></md-grid-tile>
 * </md-grid-list>
 * </hljs>
 *
 * Fit rows:
 * <hljs lang="html">
 * <md-grid-list md-cols="4" md-row-height="fit" style="height: 400px;" ...>
 *   <md-grid-tile></md-grid-tile>
 * </md-grid-list>
 * </hljs>
 *
 * Using responsive attributes:
 * <hljs lang="html">
 * <md-grid-list
 *     md-cols-sm="2"
 *     md-cols-md="4"
 *     md-cols-lg="8"
 *     md-cols-gt-lg="12"
 *     ...>
 *   <md-grid-tile></md-grid-tile>
 * </md-grid-list>
 * </hljs>
 */
function GridListDirective($interpolate, $mdConstant, $mdGridLayout, $mdMedia) {
  return {
    restrict: 'E',
    controller: GridListController,
    scope: {
      mdOnLayout: '&'
    },
    link: postLink
  };

  function postLink(scope, element, attrs, ctrl) {
    element.addClass('_md');     // private md component indicator for styling
    
    // Apply semantics
    element.attr('role', 'list');

    // Provide the controller with a way to trigger layouts.
    ctrl.layoutDelegate = layoutDelegate;

    var invalidateLayout = angular.bind(ctrl, ctrl.invalidateLayout),
        unwatchAttrs = watchMedia();
      scope.$on('$destroy', unwatchMedia);

    /**
     * Watches for changes in media, invalidating layout as necessary.
     */
    function watchMedia() {
      for (var mediaName in $mdConstant.MEDIA) {
        $mdMedia(mediaName); // initialize
        $mdMedia.getQuery($mdConstant.MEDIA[mediaName])
            .addListener(invalidateLayout);
      }
      return $mdMedia.watchResponsiveAttributes(
          ['md-cols', 'md-row-height', 'md-gutter'], attrs, layoutIfMediaMatch);
    }

    function unwatchMedia() {
      ctrl.layoutDelegate = angular.noop;

      unwatchAttrs();
      for (var mediaName in $mdConstant.MEDIA) {
        $mdMedia.getQuery($mdConstant.MEDIA[mediaName])
            .removeListener(invalidateLayout);
      }
    }

    /**
     * Performs grid layout if the provided mediaName matches the currently
     * active media type.
     */
    function layoutIfMediaMatch(mediaName) {
      if (mediaName == null) {
        // TODO(shyndman): It would be nice to only layout if we have
        // instances of attributes using this media type
        ctrl.invalidateLayout();
      } else if ($mdMedia(mediaName)) {
        ctrl.invalidateLayout();
      }
    }

    var lastLayoutProps;

    /**
     * Invokes the layout engine, and uses its results to lay out our
     * tile elements.
     *
     * @param {boolean} tilesInvalidated Whether tiles have been
     *    added/removed/moved since the last layout. This is to avoid situations
     *    where tiles are replaced with properties identical to their removed
     *    counterparts.
     */
    function layoutDelegate(tilesInvalidated) {
      var tiles = getTileElements();
      var props = {
        tileSpans: getTileSpans(tiles),
        colCount: getColumnCount(),
        rowMode: getRowMode(),
        rowHeight: getRowHeight(),
        gutter: getGutter()
      };

      if (!tilesInvalidated && angular.equals(props, lastLayoutProps)) {
        return;
      }

      var performance =
        $mdGridLayout(props.colCount, props.tileSpans, tiles)
          .map(function(tilePositions, rowCount) {
            return {
              grid: {
                element: element,
                style: getGridStyle(props.colCount, rowCount,
                    props.gutter, props.rowMode, props.rowHeight)
              },
              tiles: tilePositions.map(function(ps, i) {
                return {
                  element: angular.element(tiles[i]),
                  style: getTileStyle(ps.position, ps.spans,
                      props.colCount, rowCount,
                      props.gutter, props.rowMode, props.rowHeight)
                }
              })
            }
          })
          .reflow()
          .performance();

      // Report layout
      scope.mdOnLayout({
        $event: {
          performance: performance
        }
      });

      lastLayoutProps = props;
    }

    // Use $interpolate to do some simple string interpolation as a convenience.

    var startSymbol = $interpolate.startSymbol();
    var endSymbol = $interpolate.endSymbol();

    // Returns an expression wrapped in the interpolator's start and end symbols.
    function expr(exprStr) {
      return startSymbol + exprStr + endSymbol;
    }

    // The amount of space a single 1x1 tile would take up (either width or height), used as
    // a basis for other calculations. This consists of taking the base size percent (as would be
    // if evenly dividing the size between cells), and then subtracting the size of one gutter.
    // However, since there are no gutters on the edges, each tile only uses a fration
    // (gutterShare = numGutters / numCells) of the gutter size. (Imagine having one gutter per
    // tile, and then breaking up the extra gutter on the edge evenly among the cells).
    var UNIT = $interpolate(expr('share') + '% - (' + expr('gutter') + ' * ' + expr('gutterShare') + ')');

    // The horizontal or vertical position of a tile, e.g., the 'top' or 'left' property value.
    // The position comes the size of a 1x1 tile plus gutter for each previous tile in the
    // row/column (offset).
    var POSITION  = $interpolate('calc((' + expr('unit') + ' + ' + expr('gutter') + ') * ' + expr('offset') + ')');

    // The actual size of a tile, e.g., width or height, taking rowSpan or colSpan into account.
    // This is computed by multiplying the base unit by the rowSpan/colSpan, and then adding back
    // in the space that the gutter would normally have used (which was already accounted for in
    // the base unit calculation).
    var DIMENSION = $interpolate('calc((' + expr('unit') + ') * ' + expr('span') + ' + (' + expr('span') + ' - 1) * ' + expr('gutter') + ')');

    /**
     * Gets the styles applied to a tile element described by the given parameters.
     * @param {{row: number, col: number}} position The row and column indices of the tile.
     * @param {{row: number, col: number}} spans The rowSpan and colSpan of the tile.
     * @param {number} colCount The number of columns.
     * @param {number} rowCount The number of rows.
     * @param {string} gutter The amount of space between tiles. This will be something like
     *     '5px' or '2em'.
     * @param {string} rowMode The row height mode. Can be one of:
     *     'fixed': all rows have a fixed size, given by rowHeight,
     *     'ratio': row height defined as a ratio to width, or
     *     'fit': fit to the grid-list element height, divinding evenly among rows.
     * @param {string|number} rowHeight The height of a row. This is only used for 'fixed' mode and
     *     for 'ratio' mode. For 'ratio' mode, this is the *ratio* of width-to-height (e.g., 0.75).
     * @returns {Object} Map of CSS properties to be applied to the style element. Will define
     *     values for top, left, width, height, marginTop, and paddingTop.
     */
    function getTileStyle(position, spans, colCount, rowCount, gutter, rowMode, rowHeight) {
      // TODO(shyndman): There are style caching opportunities here.

      // Percent of the available horizontal space that one column takes up.
      var hShare = (1 / colCount) * 100;

      // Fraction of the gutter size that each column takes up.
      var hGutterShare = (colCount - 1) / colCount;

      // Base horizontal size of a column.
      var hUnit = UNIT({share: hShare, gutterShare: hGutterShare, gutter: gutter});

      // The width and horizontal position of each tile is always calculated the same way, but the
      // height and vertical position depends on the rowMode.
      var style = {
        left: POSITION({ unit: hUnit, offset: position.col, gutter: gutter }),
        width: DIMENSION({ unit: hUnit, span: spans.col, gutter: gutter }),
        // resets
        paddingTop: '',
        marginTop: '',
        top: '',
        height: ''
      };

      switch (rowMode) {
        case 'fixed':
          // In fixed mode, simply use the given rowHeight.
          style.top = POSITION({ unit: rowHeight, offset: position.row, gutter: gutter });
          style.height = DIMENSION({ unit: rowHeight, span: spans.row, gutter: gutter });
          break;

        case 'ratio':
          // Percent of the available vertical space that one row takes up. Here, rowHeight holds
          // the ratio value. For example, if the width:height ratio is 4:3, rowHeight = 1.333.
          var vShare = hShare / rowHeight;

          // Base veritcal size of a row.
          var vUnit = UNIT({ share: vShare, gutterShare: hGutterShare, gutter: gutter });

          // padidngTop and marginTop are used to maintain the given aspect ratio, as
          // a percentage-based value for these properties is applied to the *width* of the
          // containing block. See http://www.w3.org/TR/CSS2/box.html#margin-properties
          style.paddingTop = DIMENSION({ unit: vUnit, span: spans.row, gutter: gutter});
          style.marginTop = POSITION({ unit: vUnit, offset: position.row, gutter: gutter });
          break;

        case 'fit':
          // Fraction of the gutter size that each column takes up.
          var vGutterShare = (rowCount - 1) / rowCount;

          // Percent of the available vertical space that one row takes up.
          var vShare = (1 / rowCount) * 100;

          // Base vertical size of a row.
          var vUnit = UNIT({share: vShare, gutterShare: vGutterShare, gutter: gutter});

          style.top = POSITION({unit: vUnit, offset: position.row, gutter: gutter});
          style.height = DIMENSION({unit: vUnit, span: spans.row, gutter: gutter});
          break;
      }

      return style;
    }

    function getGridStyle(colCount, rowCount, gutter, rowMode, rowHeight) {
      var style = {};

      switch(rowMode) {
        case 'fixed':
          style.height = DIMENSION({ unit: rowHeight, span: rowCount, gutter: gutter });
          style.paddingBottom = '';
          break;

        case 'ratio':
          // rowHeight is width / height
          var hGutterShare = colCount === 1 ? 0 : (colCount - 1) / colCount,
              hShare = (1 / colCount) * 100,
              vShare = hShare * (1 / rowHeight),
              vUnit = UNIT({ share: vShare, gutterShare: hGutterShare, gutter: gutter });

          style.height = '';
          style.paddingBottom = DIMENSION({ unit: vUnit, span: rowCount, gutter: gutter});
          break;

        case 'fit':
          // noop, as the height is user set
          break;
      }

      return style;
    }

    function getTileElements() {
      return [].filter.call(element.children(), function(ele) {
        return ele.tagName == 'MD-GRID-TILE' && !ele.$$mdDestroyed;
      });
    }

    /**
     * Gets an array of objects containing the rowspan and colspan for each tile.
     * @returns {Array<{row: number, col: number}>}
     */
    function getTileSpans(tileElements) {
      return [].map.call(tileElements, function(ele) {
        var ctrl = angular.element(ele).controller('mdGridTile');
        return {
          row: parseInt(
              $mdMedia.getResponsiveAttribute(ctrl.$attrs, 'md-rowspan'), 10) || 1,
          col: parseInt(
              $mdMedia.getResponsiveAttribute(ctrl.$attrs, 'md-colspan'), 10) || 1
        };
      });
    }

    function getColumnCount() {
      var colCount = parseInt($mdMedia.getResponsiveAttribute(attrs, 'md-cols'), 10);
      if (isNaN(colCount)) {
        throw 'md-grid-list: md-cols attribute was not found, or contained a non-numeric value';
      }
      return colCount;
    }

    function getGutter() {
      return applyDefaultUnit($mdMedia.getResponsiveAttribute(attrs, 'md-gutter') || 1);
    }

    function getRowHeight() {
      var rowHeight = $mdMedia.getResponsiveAttribute(attrs, 'md-row-height');
      if (!rowHeight) {
        throw 'md-grid-list: md-row-height attribute was not found';
      }

      switch (getRowMode()) {
        case 'fixed':
          return applyDefaultUnit(rowHeight);
        case 'ratio':
          var whRatio = rowHeight.split(':');
          return parseFloat(whRatio[0]) / parseFloat(whRatio[1]);
        case 'fit':
          return 0; // N/A
      }
    }

    function getRowMode() {
      var rowHeight = $mdMedia.getResponsiveAttribute(attrs, 'md-row-height');
      if (!rowHeight) {
        throw 'md-grid-list: md-row-height attribute was not found';
      }

      if (rowHeight == 'fit') {
        return 'fit';
      } else if (rowHeight.indexOf(':') !== -1) {
        return 'ratio';
      } else {
        return 'fixed';
      }
    }

    function applyDefaultUnit(val) {
      return /\D$/.test(val) ? val : val + 'px';
    }
  }
}
GridListDirective.$inject = ["$interpolate", "$mdConstant", "$mdGridLayout", "$mdMedia"];

/* @ngInject */
function GridListController($mdUtil) {
  this.layoutInvalidated = false;
  this.tilesInvalidated = false;
  this.$timeout_ = $mdUtil.nextTick;
  this.layoutDelegate = angular.noop;
}
GridListController.$inject = ["$mdUtil"];

GridListController.prototype = {
  invalidateTiles: function() {
    this.tilesInvalidated = true;
    this.invalidateLayout();
  },

  invalidateLayout: function() {
    if (this.layoutInvalidated) {
      return;
    }
    this.layoutInvalidated = true;
    this.$timeout_(angular.bind(this, this.layout));
  },

  layout: function() {
    try {
      this.layoutDelegate(this.tilesInvalidated);
    } finally {
      this.layoutInvalidated = false;
      this.tilesInvalidated = false;
    }
  }
};


/* @ngInject */
function GridLayoutFactory($mdUtil) {
  var defaultAnimator = GridTileAnimator;

  /**
   * Set the reflow animator callback
   */
  GridLayout.animateWith = function(customAnimator) {
    defaultAnimator = !angular.isFunction(customAnimator) ? GridTileAnimator : customAnimator;
  };

  return GridLayout;

  /**
   * Publish layout function
   */
  function GridLayout(colCount, tileSpans) {
      var self, layoutInfo, gridStyles, layoutTime, mapTime, reflowTime;

      layoutTime = $mdUtil.time(function() {
        layoutInfo = calculateGridFor(colCount, tileSpans);
      });

      return self = {

        /**
         * An array of objects describing each tile's position in the grid.
         */
        layoutInfo: function() {
          return layoutInfo;
        },

        /**
         * Maps grid positioning to an element and a set of styles using the
         * provided updateFn.
         */
        map: function(updateFn) {
          mapTime = $mdUtil.time(function() {
            var info = self.layoutInfo();
            gridStyles = updateFn(info.positioning, info.rowCount);
          });
          return self;
        },

        /**
         * Default animator simply sets the element.css( <styles> ). An alternate
         * animator can be provided as an argument. The function has the following
         * signature:
         *
         *    function({grid: {element: JQLite, style: Object}, tiles: Array<{element: JQLite, style: Object}>)
         */
        reflow: function(animatorFn) {
          reflowTime = $mdUtil.time(function() {
            var animator = animatorFn || defaultAnimator;
            animator(gridStyles.grid, gridStyles.tiles);
          });
          return self;
        },

        /**
         * Timing for the most recent layout run.
         */
        performance: function() {
          return {
            tileCount: tileSpans.length,
            layoutTime: layoutTime,
            mapTime: mapTime,
            reflowTime: reflowTime,
            totalTime: layoutTime + mapTime + reflowTime
          };
        }
      };
    }

  /**
   * Default Gridlist animator simple sets the css for each element;
   * NOTE: any transitions effects must be manually set in the CSS.
   * e.g.
   *
   *  md-grid-tile {
   *    transition: all 700ms ease-out 50ms;
   *  }
   *
   */
  function GridTileAnimator(grid, tiles) {
    grid.element.css(grid.style);
    tiles.forEach(function(t) {
      t.element.css(t.style);
    })
  }

  /**
   * Calculates the positions of tiles.
   *
   * The algorithm works as follows:
   *    An Array<Number> with length colCount (spaceTracker) keeps track of
   *    available tiling positions, where elements of value 0 represents an
   *    empty position. Space for a tile is reserved by finding a sequence of
   *    0s with length <= than the tile's colspan. When such a space has been
   *    found, the occupied tile positions are incremented by the tile's
   *    rowspan value, as these positions have become unavailable for that
   *    many rows.
   *
   *    If the end of a row has been reached without finding space for the
   *    tile, spaceTracker's elements are each decremented by 1 to a minimum
   *    of 0. Rows are searched in this fashion until space is found.
   */
  function calculateGridFor(colCount, tileSpans) {
    var curCol = 0,
        curRow = 0,
        spaceTracker = newSpaceTracker();

    return {
      positioning: tileSpans.map(function(spans, i) {
        return {
          spans: spans,
          position: reserveSpace(spans, i)
        };
      }),
      rowCount: curRow + Math.max.apply(Math, spaceTracker)
    };

    function reserveSpace(spans, i) {
      if (spans.col > colCount) {
        throw 'md-grid-list: Tile at position ' + i + ' has a colspan ' +
            '(' + spans.col + ') that exceeds the column count ' +
            '(' + colCount + ')';
      }

      var start = 0,
          end = 0;

      // TODO(shyndman): This loop isn't strictly necessary if you can
      // determine the minimum number of rows before a space opens up. To do
      // this, recognize that you've iterated across an entire row looking for
      // space, and if so fast-forward by the minimum rowSpan count. Repeat
      // until the required space opens up.
      while (end - start < spans.col) {
        if (curCol >= colCount) {
          nextRow();
          continue;
        }

        start = spaceTracker.indexOf(0, curCol);
        if (start === -1 || (end = findEnd(start + 1)) === -1) {
          start = end = 0;
          nextRow();
          continue;
        }

        curCol = end + 1;
      }

      adjustRow(start, spans.col, spans.row);
      curCol = start + spans.col;

      return {
        col: start,
        row: curRow
      };
    }

    function nextRow() {
      curCol = 0;
      curRow++;
      adjustRow(0, colCount, -1); // Decrement row spans by one
    }

    function adjustRow(from, cols, by) {
      for (var i = from; i < from + cols; i++) {
        spaceTracker[i] = Math.max(spaceTracker[i] + by, 0);
      }
    }

    function findEnd(start) {
      var i;
      for (i = start; i < spaceTracker.length; i++) {
        if (spaceTracker[i] !== 0) {
          return i;
        }
      }

      if (i === spaceTracker.length) {
        return i;
      }
    }

    function newSpaceTracker() {
      var tracker = [];
      for (var i = 0; i < colCount; i++) {
        tracker.push(0);
      }
      return tracker;
    }
  }
}
GridLayoutFactory.$inject = ["$mdUtil"];

/**
 * @ngdoc directive
 * @name mdGridTile
 * @module material.components.gridList
 * @restrict E
 * @description
 * Tiles contain the content of an `md-grid-list`. They span one or more grid
 * cells vertically or horizontally, and use `md-grid-tile-{footer,header}` to
 * display secondary content.
 *
 * ### Responsive Attributes
 *
 * The `md-grid-tile` directive supports "responsive" attributes, which allow
 * different `md-rowspan` and `md-colspan` values depending on the currently
 * matching media query.
 *
 * In order to set a responsive attribute, first define the fallback value with
 * the standard attribute name, then add additional attributes with the
 * following convention: `{base-attribute-name}-{media-query-name}="{value}"`
 * (ie. `md-colspan-sm="4"`)
 *
 * @param {number=} md-colspan The number of columns to span (default 1). Cannot
 *    exceed the number of columns in the grid. Supports interpolation.
 * @param {number=} md-rowspan The number of rows to span (default 1). Supports
 *     interpolation.
 *
 * @usage
 * With header:
 * <hljs lang="html">
 * <md-grid-tile>
 *   <md-grid-tile-header>
 *     <h3>This is a header</h3>
 *   </md-grid-tile-header>
 * </md-grid-tile>
 * </hljs>
 *
 * With footer:
 * <hljs lang="html">
 * <md-grid-tile>
 *   <md-grid-tile-footer>
 *     <h3>This is a footer</h3>
 *   </md-grid-tile-footer>
 * </md-grid-tile>
 * </hljs>
 *
 * Spanning multiple rows/columns:
 * <hljs lang="html">
 * <md-grid-tile md-colspan="2" md-rowspan="3">
 * </md-grid-tile>
 * </hljs>
 *
 * Responsive attributes:
 * <hljs lang="html">
 * <md-grid-tile md-colspan="1" md-colspan-sm="3" md-colspan-md="5">
 * </md-grid-tile>
 * </hljs>
 */
function GridTileDirective($mdMedia) {
  return {
    restrict: 'E',
    require: '^mdGridList',
    template: '<figure ng-transclude></figure>',
    transclude: true,
    scope: {},
    // Simple controller that exposes attributes to the grid directive
    controller: ["$attrs", function($attrs) {
      this.$attrs = $attrs;
    }],
    link: postLink
  };

  function postLink(scope, element, attrs, gridCtrl) {
    // Apply semantics
    element.attr('role', 'listitem');

    // If our colspan or rowspan changes, trigger a layout
    var unwatchAttrs = $mdMedia.watchResponsiveAttributes(['md-colspan', 'md-rowspan'],
        attrs, angular.bind(gridCtrl, gridCtrl.invalidateLayout));

    // Tile registration/deregistration
    gridCtrl.invalidateTiles();
    scope.$on('$destroy', function() {
      // Mark the tile as destroyed so it is no longer considered in layout,
      // even if the DOM element sticks around (like during a leave animation)
      element[0].$$mdDestroyed = true;
      unwatchAttrs();
      gridCtrl.invalidateLayout();
    });

    if (angular.isDefined(scope.$parent.$index)) {
      scope.$watch(function() { return scope.$parent.$index; },
        function indexChanged(newIdx, oldIdx) {
          if (newIdx === oldIdx) {
            return;
          }
          gridCtrl.invalidateTiles();
        });
    }
  }
}
GridTileDirective.$inject = ["$mdMedia"];


function GridTileCaptionDirective() {
  return {
    template: '<figcaption ng-transclude></figcaption>',
    transclude: true
  };
}

})();
(function(){
"use strict";

/**
 * @ngdoc module
 * @name material.components.content
 *
 * @description
 * Scrollable content
 */
angular.module('material.components.content', [
  'material.core'
])
  .directive('mdContent', mdContentDirective);

/**
 * @ngdoc directive
 * @name mdContent
 * @module material.components.content
 *
 * @restrict E
 *
 * @description
 *
 * The `<md-content>` directive is a container element useful for scrollable content. It achieves
 * this by setting the CSS `overflow` property to `auto` so that content can properly scroll.
 *
 * In general, `<md-content>` components are not designed to be nested inside one another. If
 * possible, it is better to make them siblings. This often results in a better user experience as
 * having nested scrollbars may confuse the user.
 *
 * ## Troubleshooting
 *
 * In some cases, you may wish to apply the `md-no-momentum` class to ensure that Safari's
 * momentum scrolling is disabled. Momentum scrolling can cause flickering issues while scrolling
 * SVG icons and some other components.
 *
 * Additionally, we now also offer the `md-no-flicker` class which can be applied to any element
 * and uses a Webkit-specific filter of `blur(0px)` that forces GPU rendering of all elements
 * inside (which eliminates the flicker on iOS devices).
 *
 * _<b>Note:</b> Forcing an element to render on the GPU can have unintended side-effects, especially
 * related to the z-index of elements. Please use with caution and only on the elements needed._
 *
 * @usage
 *
 * Add the `[layout-padding]` attribute to make the content padded.
 *
 * <hljs lang="html">
 *  <md-content layout-padding>
 *      Lorem ipsum dolor sit amet, ne quod novum mei.
 *  </md-content>
 * </hljs>
 */

function mdContentDirective($mdTheming) {
  return {
    restrict: 'E',
    controller: ['$scope', '$element', ContentController],
    link: function(scope, element) {
      element.addClass('_md');     // private md component indicator for styling

      $mdTheming(element);
      scope.$broadcast('$mdContentLoaded', element);

      iosScrollFix(element[0]);
    }
  };

  function ContentController($scope, $element) {
    this.$scope = $scope;
    this.$element = $element;
  }
}
mdContentDirective.$inject = ["$mdTheming"];

function iosScrollFix(node) {
  // IOS FIX:
  // If we scroll where there is no more room for the webview to scroll,
  // by default the webview itself will scroll up and down, this looks really
  // bad.  So if we are scrolling to the very top or bottom, add/subtract one
  angular.element(node).on('$md.pressdown', function(ev) {
    // Only touch events
    if (ev.pointer.type !== 't') return;
    // Don't let a child content's touchstart ruin it for us.
    if (ev.$materialScrollFixed) return;
    ev.$materialScrollFixed = true;

    if (node.scrollTop === 0) {
      node.scrollTop = 1;
    } else if (node.scrollHeight === node.scrollTop + node.offsetHeight) {
      node.scrollTop -= 1;
    }
  });
}

})();
(function(){
"use strict";

/**
 * @ngdoc module
 * @name material.components.icon
 * @description
 * Icon
 */
angular.module('material.components.icon', ['material.core']);

})();
(function(){
"use strict";

  /**
   * @ngdoc module
   * @name material.components.slider
   */
  angular.module('material.components.slider', [
    'material.core'
  ])
  .directive('mdSlider', SliderDirective)
  .directive('mdSliderContainer', SliderContainerDirective);

/**
 * @ngdoc directive
 * @name mdSliderContainer
 * @module material.components.slider
 * @restrict E
 * @description
 * The `<md-slider-container>` contains slider with two other elements.
 *
 *
 * @usage
 * <h4>Normal Mode</h4>
 * <hljs lang="html">
 * </hljs>
 */
function SliderContainerDirective() {
  return {
    controller: function () {},
    compile: function (elem) {
      var slider = elem.find('md-slider');

      if (!slider) {
        return;
      }

      var vertical = slider.attr('md-vertical');

      if (vertical !== undefined) {
        elem.attr('md-vertical', '');
      }

      if(!slider.attr('flex')) {
        slider.attr('flex', '');
      }

      return function postLink(scope, element, attr, ctrl) {
        element.addClass('_md');     // private md component indicator for styling

        // We have to manually stop the $watch on ngDisabled because it exists
        // on the parent scope, and won't be automatically destroyed when
        // the component is destroyed.
        function setDisable(value) {
          element.children().attr('disabled', value);
          element.find('input').attr('disabled', value);
        }

        var stopDisabledWatch = angular.noop;

        if (attr.disabled) {
          setDisable(true);
        }
        else if (attr.ngDisabled) {
          stopDisabledWatch = scope.$watch(attr.ngDisabled, function (value) {
            setDisable(value);
          });
        }

        scope.$on('$destroy', function () {
          stopDisabledWatch();
        });

        var initialMaxWidth;

        ctrl.fitInputWidthToTextLength = function (length) {
          var input = element[0].querySelector('md-input-container');

          if (input) {
            var computedStyle = getComputedStyle(input);
            var minWidth = parseInt(computedStyle.minWidth);
            var padding = parseInt(computedStyle.padding) * 2;

            initialMaxWidth = initialMaxWidth || parseInt(computedStyle.maxWidth);
            var newMaxWidth = Math.max(initialMaxWidth, minWidth + padding + (minWidth / 2 * length));

            input.style.maxWidth = newMaxWidth + 'px';
          }
        };
      };
    }
  };
}

/**
 * @ngdoc directive
 * @name mdSlider
 * @module material.components.slider
 * @restrict E
 * @description
 * The `<md-slider>` component allows the user to choose from a range of
 * values.
 *
 * As per the [material design spec](http://www.google.com/design/spec/style/color.html#color-ui-color-application)
 * the slider is in the accent color by default. The primary color palette may be used with
 * the `md-primary` class.
 *
 * It has two modes: 'normal' mode, where the user slides between a wide range
 * of values, and 'discrete' mode, where the user slides between only a few
 * select values.
 *
 * To enable discrete mode, add the `md-discrete` attribute to a slider,
 * and use the `step` attribute to change the distance between
 * values the user is allowed to pick.
 *
 * @usage
 * <h4>Normal Mode</h4>
 * <hljs lang="html">
 * <md-slider ng-model="myValue" min="5" max="500">
 * </md-slider>
 * </hljs>
 * <h4>Discrete Mode</h4>
 * <hljs lang="html">
 * <md-slider md-discrete ng-model="myDiscreteValue" step="10" min="10" max="130">
 * </md-slider>
 * </hljs>
 * <h4>Invert Mode</h4>
 * <hljs lang="html">
 * <md-slider md-invert ng-model="myValue" step="10" min="10" max="130">
 * </md-slider>
 * </hljs>
 *
 * @param {boolean=} md-discrete Whether to enable discrete mode.
 * @param {boolean=} md-invert Whether to enable invert mode.
 * @param {number=} step The distance between values the user is allowed to pick. Default 1.
 * @param {number=} min The minimum value the user is allowed to pick. Default 0.
 * @param {number=} max The maximum value the user is allowed to pick. Default 100.
 * @param {number=} round The amount of numbers after the decimal point, maximum is 6 to prevent scientific notation. Default 3.
 */
function SliderDirective($$rAF, $window, $mdAria, $mdUtil, $mdConstant, $mdTheming, $mdGesture, $parse, $log, $timeout) {
  return {
    scope: {},
    require: ['?ngModel', '?^mdSliderContainer'],
    template:
      '<div class="md-slider-wrapper">' +
        '<div class="md-slider-content">' +
          '<div class="md-track-container">' +
            '<div class="md-track"></div>' +
            '<div class="md-track md-track-fill"></div>' +
            '<div class="md-track-ticks"></div>' +
          '</div>' +
          '<div class="md-thumb-container">' +
            '<div class="md-thumb"></div>' +
            '<div class="md-focus-thumb"></div>' +
            '<div class="md-focus-ring"></div>' +
            '<div class="md-sign">' +
              '<span class="md-thumb-text"></span>' +
            '</div>' +
            '<div class="md-disabled-thumb"></div>' +
          '</div>' +
        '</div>' +
      '</div>',
    compile: compile
  };

  // **********************************************************
  // Private Methods
  // **********************************************************

  function compile (tElement, tAttrs) {
    var wrapper = angular.element(tElement[0].getElementsByClassName('md-slider-wrapper'));

    var tabIndex = tAttrs.tabindex || 0;
    wrapper.attr('tabindex', tabIndex);

    if (tAttrs.disabled || tAttrs.ngDisabled) wrapper.attr('tabindex', -1);

    wrapper.attr('role', 'slider');

    $mdAria.expect(tElement, 'aria-label');

    return postLink;
  }

  function postLink(scope, element, attr, ctrls) {
    $mdTheming(element);
    var ngModelCtrl = ctrls[0] || {
      // Mock ngModelController if it doesn't exist to give us
      // the minimum functionality needed
      $setViewValue: function(val) {
        this.$viewValue = val;
        this.$viewChangeListeners.forEach(function(cb) { cb(); });
      },
      $parsers: [],
      $formatters: [],
      $viewChangeListeners: []
    };

    var containerCtrl = ctrls[1];
    var container = angular.element($mdUtil.getClosest(element, '_md-slider-container', true));
    var isDisabled = attr.ngDisabled ? angular.bind(null, $parse(attr.ngDisabled), scope.$parent) : function () {
          return element[0].hasAttribute('disabled');
        };

    var thumb = angular.element(element[0].querySelector('.md-thumb'));
    var thumbText = angular.element(element[0].querySelector('.md-thumb-text'));
    var thumbContainer = thumb.parent();
    var trackContainer = angular.element(element[0].querySelector('.md-track-container'));
    var activeTrack = angular.element(element[0].querySelector('.md-track-fill'));
    var tickContainer = angular.element(element[0].querySelector('.md-track-ticks'));
    var wrapper = angular.element(element[0].getElementsByClassName('md-slider-wrapper'));
    var content = angular.element(element[0].getElementsByClassName('md-slider-content'));
    var throttledRefreshDimensions = $mdUtil.throttle(refreshSliderDimensions, 5000);

    // Default values, overridable by attrs
    var DEFAULT_ROUND = 3;
    var vertical = angular.isDefined(attr.mdVertical);
    var discrete = angular.isDefined(attr.mdDiscrete);
    var invert = angular.isDefined(attr.mdInvert);
    angular.isDefined(attr.min) ? attr.$observe('min', updateMin) : updateMin(0);
    angular.isDefined(attr.max) ? attr.$observe('max', updateMax) : updateMax(100);
    angular.isDefined(attr.step)? attr.$observe('step', updateStep) : updateStep(1);
    angular.isDefined(attr.round)? attr.$observe('round', updateRound) : updateRound(DEFAULT_ROUND);

    // We have to manually stop the $watch on ngDisabled because it exists
    // on the parent scope, and won't be automatically destroyed when
    // the component is destroyed.
    var stopDisabledWatch = angular.noop;
    if (attr.ngDisabled) {
      stopDisabledWatch = scope.$parent.$watch(attr.ngDisabled, updateAriaDisabled);
    }

    $mdGesture.register(wrapper, 'drag', { horizontal: !vertical });

    scope.mouseActive = false;

    wrapper
      .on('keydown', keydownListener)
      .on('mousedown', mouseDownListener)
      .on('focus', focusListener)
      .on('blur', blurListener)
      .on('$md.pressdown', onPressDown)
      .on('$md.pressup', onPressUp)
      .on('$md.dragstart', onDragStart)
      .on('$md.drag', onDrag)
      .on('$md.dragend', onDragEnd);

    // On resize, recalculate the slider's dimensions and re-render
    function updateAll() {
      refreshSliderDimensions();
      ngModelRender();
    }
    setTimeout(updateAll, 0);

    var debouncedUpdateAll = $$rAF.throttle(updateAll);
    angular.element($window).on('resize', debouncedUpdateAll);

    scope.$on('$destroy', function() {
      angular.element($window).off('resize', debouncedUpdateAll);
    });

    ngModelCtrl.$render = ngModelRender;
    ngModelCtrl.$viewChangeListeners.push(ngModelRender);
    ngModelCtrl.$formatters.push(minMaxValidator);
    ngModelCtrl.$formatters.push(stepValidator);

    /**
     * Attributes
     */
    var min;
    var max;
    var step;
    var round;
    function updateMin(value) {
      min = parseFloat(value);
      element.attr('aria-valuemin', value);
      updateAll();
    }
    function updateMax(value) {
      max = parseFloat(value);
      element.attr('aria-valuemax', value);
      updateAll();
    }
    function updateStep(value) {
      step = parseFloat(value);
    }
    function updateRound(value) {
      // Set max round digits to 6, after 6 the input uses scientific notation
      round = minMaxValidator(parseInt(value), 0, 6);
    }
    function updateAriaDisabled() {
      element.attr('aria-disabled', !!isDisabled());
    }

    // Draw the ticks with canvas.
    // The alternative to drawing ticks with canvas is to draw one element for each tick,
    // which could quickly become a performance bottleneck.
    var tickCanvas, tickCtx;
    function redrawTicks() {
      if (!discrete || isDisabled()) return;
      if ( angular.isUndefined(step) )         return;

      if ( step <= 0 ) {
        var msg = 'Slider step value must be greater than zero when in discrete mode';
        $log.error(msg);
        throw new Error(msg);
      }

      var numSteps = Math.floor( (max - min) / step );
      if (!tickCanvas) {
        tickCanvas = angular.element('<canvas>').css('position', 'absolute');
        tickContainer.append(tickCanvas);

        tickCtx = tickCanvas[0].getContext('2d');
      }

      var dimensions = getSliderDimensions();

      // If `dimensions` doesn't have height and width it might be the first attempt so we will refresh dimensions
      if (dimensions && !dimensions.height && !dimensions.width) {
        refreshSliderDimensions();
        dimensions = sliderDimensions;
      }

      tickCanvas[0].width = dimensions.width;
      tickCanvas[0].height = dimensions.height;

      var distance;
      for (var i = 0; i <= numSteps; i++) {
        var trackTicksStyle = $window.getComputedStyle(tickContainer[0]);
        tickCtx.fillStyle = trackTicksStyle.color || 'black';

        distance = Math.floor((vertical ? dimensions.height : dimensions.width) * (i / numSteps));

        tickCtx.fillRect(vertical ? 0 : distance - 1,
          vertical ? distance - 1 : 0,
          vertical ? dimensions.width : 2,
          vertical ? 2 : dimensions.height);
      }
    }

    function clearTicks() {
      if(tickCanvas && tickCtx) {
        var dimensions = getSliderDimensions();
        tickCtx.clearRect(0, 0, dimensions.width, dimensions.height);
      }
    }

    /**
     * Refreshing Dimensions
     */
    var sliderDimensions = {};
    refreshSliderDimensions();
    function refreshSliderDimensions() {
      sliderDimensions = trackContainer[0].getBoundingClientRect();
    }
    function getSliderDimensions() {
      throttledRefreshDimensions();
      return sliderDimensions;
    }

    /**
     * left/right/up/down arrow listener
     */
    function keydownListener(ev) {
      if (isDisabled()) return;

      var changeAmount;
      if (vertical ? ev.keyCode === $mdConstant.KEY_CODE.DOWN_ARROW : ev.keyCode === $mdConstant.KEY_CODE.LEFT_ARROW) {
        changeAmount = -step;
      } else if (vertical ? ev.keyCode === $mdConstant.KEY_CODE.UP_ARROW : ev.keyCode === $mdConstant.KEY_CODE.RIGHT_ARROW) {
        changeAmount = step;
      }
      changeAmount = invert ? -changeAmount : changeAmount;
      if (changeAmount) {
        if (ev.metaKey || ev.ctrlKey || ev.altKey) {
          changeAmount *= 4;
        }
        ev.preventDefault();
        ev.stopPropagation();
        scope.$evalAsync(function() {
          setModelValue(ngModelCtrl.$viewValue + changeAmount);
        });
      }
    }

    function mouseDownListener() {
      redrawTicks();

      scope.mouseActive = true;
      wrapper.removeClass('md-focused');

      $timeout(function() {
        scope.mouseActive = false;
      }, 100);
    }

    function focusListener() {
      if (scope.mouseActive === false) {
        wrapper.addClass('md-focused');
      }
    }

    function blurListener() {
      wrapper.removeClass('md-focused');
      element.removeClass('md-active');
      clearTicks();
    }

    /**
     * ngModel setters and validators
     */
    function setModelValue(value) {
      ngModelCtrl.$setViewValue( minMaxValidator(stepValidator(value)) );
    }
    function ngModelRender() {
      if (isNaN(ngModelCtrl.$viewValue)) {
        ngModelCtrl.$viewValue = ngModelCtrl.$modelValue;
      }

      ngModelCtrl.$viewValue = minMaxValidator(ngModelCtrl.$viewValue);

      var percent = valueToPercent(ngModelCtrl.$viewValue);
      scope.modelValue = ngModelCtrl.$viewValue;
      element.attr('aria-valuenow', ngModelCtrl.$viewValue);
      setSliderPercent(percent);
      thumbText.text( ngModelCtrl.$viewValue );
    }

    function minMaxValidator(value, minValue, maxValue) {
      if (angular.isNumber(value)) {
        minValue = angular.isNumber(minValue) ? minValue : min;
        maxValue = angular.isNumber(maxValue) ? maxValue : max;

        return Math.max(minValue, Math.min(maxValue, value));
      }
    }

    function stepValidator(value) {
      if (angular.isNumber(value)) {
        var formattedValue = (Math.round((value - min) / step) * step + min);
        formattedValue = (Math.round(formattedValue * Math.pow(10, round)) / Math.pow(10, round));

        if (containerCtrl && containerCtrl.fitInputWidthToTextLength){
          $mdUtil.debounce(function () {
            containerCtrl.fitInputWidthToTextLength(formattedValue.toString().length);
          }, 100)();
        }

        return formattedValue;
      }
    }

    /**
     * @param percent 0-1
     */
    function setSliderPercent(percent) {

      percent = clamp(percent);

      var thumbPosition = (percent * 100) + '%';
      var activeTrackPercent = invert ? (1 - percent) * 100 + '%' : thumbPosition;

      if (vertical) {
        thumbContainer.css('bottom', thumbPosition);
      }
      else {
        $mdUtil.bidiProperty(thumbContainer, 'left', 'right', thumbPosition);
      }

      
      activeTrack.css(vertical ? 'height' : 'width', activeTrackPercent);

      element.toggleClass((invert ? 'md-max' : 'md-min'), percent === 0);
      element.toggleClass((invert ? 'md-min' : 'md-max'), percent === 1);
    }

    /**
     * Slide listeners
     */
    var isDragging = false;

    function onPressDown(ev) {
      if (isDisabled()) return;

      element.addClass('md-active');
      element[0].focus();
      refreshSliderDimensions();

      var exactVal = percentToValue( positionToPercent( vertical ? ev.pointer.y : ev.pointer.x ));
      var closestVal = minMaxValidator( stepValidator(exactVal) );
      scope.$apply(function() {
        setModelValue( closestVal );
        setSliderPercent( valueToPercent(closestVal));
      });
    }
    function onPressUp(ev) {
      if (isDisabled()) return;

      element.removeClass('md-dragging');

      var exactVal = percentToValue( positionToPercent( vertical ? ev.pointer.y : ev.pointer.x ));
      var closestVal = minMaxValidator( stepValidator(exactVal) );
      scope.$apply(function() {
        setModelValue(closestVal);
        ngModelRender();
      });
    }
    function onDragStart(ev) {
      if (isDisabled()) return;
      isDragging = true;

      ev.stopPropagation();

      element.addClass('md-dragging');
      setSliderFromEvent(ev);
    }
    function onDrag(ev) {
      if (!isDragging) return;
      ev.stopPropagation();
      setSliderFromEvent(ev);
    }
    function onDragEnd(ev) {
      if (!isDragging) return;
      ev.stopPropagation();
      isDragging = false;
    }

    function setSliderFromEvent(ev) {
      // While panning discrete, update only the
      // visual positioning but not the model value.
      if ( discrete ) adjustThumbPosition( vertical ? ev.pointer.y : ev.pointer.x );
      else            doSlide( vertical ? ev.pointer.y : ev.pointer.x );
    }

    /**
     * Slide the UI by changing the model value
     * @param x
     */
    function doSlide( x ) {
      scope.$evalAsync( function() {
        setModelValue( percentToValue( positionToPercent(x) ));
      });
    }

    /**
     * Slide the UI without changing the model (while dragging/panning)
     * @param x
     */
    function adjustThumbPosition( x ) {
      var exactVal = percentToValue( positionToPercent( x ));
      var closestVal = minMaxValidator( stepValidator(exactVal) );
      setSliderPercent( positionToPercent(x) );
      thumbText.text( closestVal );
    }

    /**
    * Clamps the value to be between 0 and 1.
    * @param {number} value The value to clamp.
    * @returns {number}
    */
    function clamp(value) {
      return Math.max(0, Math.min(value || 0, 1));
    }

    /**
     * Convert position on slider to percentage value of offset from beginning...
     * @param position
     * @returns {number}
     */
    function positionToPercent( position ) {
      var offset = vertical ? sliderDimensions.top : sliderDimensions.left;
      var size = vertical ? sliderDimensions.height : sliderDimensions.width;
      var calc = (position - offset) / size;

      if (!vertical && $mdUtil.bidi() === 'rtl') {
        calc = 1 - calc;
      }

      return Math.max(0, Math.min(1, vertical ? 1 - calc : calc));
    }

    /**
     * Convert percentage offset on slide to equivalent model value
     * @param percent
     * @returns {*}
     */
    function percentToValue( percent ) {
      var adjustedPercent = invert ? (1 - percent) : percent;
      return (min + adjustedPercent * (max - min));
    }

    function valueToPercent( val ) {
      var percent = (val - min) / (max - min);
      return invert ? (1 - percent) : percent;
    }
  }
}
SliderDirective.$inject = ["$$rAF", "$window", "$mdAria", "$mdUtil", "$mdConstant", "$mdTheming", "$mdGesture", "$parse", "$log", "$timeout"];

})();
(function(){
"use strict";

/**
 * @ngdoc module
 * @name material.components.switch
 */

angular.module('material.components.switch', [
  'material.core',
  'material.components.checkbox'
])
  .directive('mdSwitch', MdSwitch);

/**
 * @ngdoc directive
 * @module material.components.switch
 * @name mdSwitch
 * @restrict E
 *
 * The switch directive is used very much like the normal [angular checkbox](https://docs.angularjs.org/api/ng/input/input%5Bcheckbox%5D).
 *
 * As per the [material design spec](http://www.google.com/design/spec/style/color.html#color-ui-color-application)
 * the switch is in the accent color by default. The primary color palette may be used with
 * the `md-primary` class.
 *
 * @param {string} ng-model Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {expression=} ng-true-value The value to which the expression should be set when selected.
 * @param {expression=} ng-false-value The value to which the expression should be set when not selected.
 * @param {string=} ng-change Angular expression to be executed when input changes due to user interaction with the input element.
 * @param {expression=} ng-disabled En/Disable based on the expression.
 * @param {boolean=} md-no-ink Use of attribute indicates use of ripple ink effects.
 * @param {string=} aria-label Publish the button label used by screen-readers for accessibility. Defaults to the switch's text.
 *
 * @usage
 * <hljs lang="html">
 * <md-switch ng-model="isActive" aria-label="Finished?">
 *   Finished ?
 * </md-switch>
 *
 * <md-switch md-no-ink ng-model="hasInk" aria-label="No Ink Effects">
 *   No Ink Effects
 * </md-switch>
 *
 * <md-switch ng-disabled="true" ng-model="isDisabled" aria-label="Disabled">
 *   Disabled
 * </md-switch>
 *
 * </hljs>
 */
function MdSwitch(mdCheckboxDirective, $mdUtil, $mdConstant, $parse, $$rAF, $mdGesture, $timeout) {
  var checkboxDirective = mdCheckboxDirective[0];

  return {
    restrict: 'E',
    priority: 210, // Run before ngAria
    transclude: true,
    template:
      '<div class="md-container">' +
        '<div class="md-bar"></div>' +
        '<div class="md-thumb-container">' +
          '<div class="md-thumb" md-ink-ripple md-ink-ripple-checkbox></div>' +
        '</div>'+
      '</div>' +
      '<div ng-transclude class="md-label"></div>',
    require: '?ngModel',
    compile: mdSwitchCompile
  };

  function mdSwitchCompile(element, attr) {
    var checkboxLink = checkboxDirective.compile(element, attr).post;
    // No transition on initial load.
    element.addClass('md-dragging');

    return function (scope, element, attr, ngModel) {
      ngModel = ngModel || $mdUtil.fakeNgModel();

      var disabledGetter = null;
      if (attr.disabled != null) {
        disabledGetter = function() { return true; };
      } else if (attr.ngDisabled) {
        disabledGetter = $parse(attr.ngDisabled);
      }

      var thumbContainer = angular.element(element[0].querySelector('.md-thumb-container'));
      var switchContainer = angular.element(element[0].querySelector('.md-container'));

      // no transition on initial load
      $$rAF(function() {
        element.removeClass('md-dragging');
      });

      checkboxLink(scope, element, attr, ngModel);

      if (disabledGetter) {
        scope.$watch(disabledGetter, function(isDisabled) {
          element.attr('tabindex', isDisabled ? -1 : 0);
        });
      }

      // These events are triggered by setup drag
      $mdGesture.register(switchContainer, 'drag');
      switchContainer
        .on('$md.dragstart', onDragStart)
        .on('$md.drag', onDrag)
        .on('$md.dragend', onDragEnd);

      var drag;
      function onDragStart(ev) {
        // Don't go if the switch is disabled.
        if (disabledGetter && disabledGetter(scope)) return;
        ev.stopPropagation();

        element.addClass('md-dragging');
        drag = {width: thumbContainer.prop('offsetWidth')};
      }

      function onDrag(ev) {
        if (!drag) return;
        ev.stopPropagation();
        ev.srcEvent && ev.srcEvent.preventDefault();

        var percent = ev.pointer.distanceX / drag.width;

        //if checked, start from right. else, start from left
        var translate = ngModel.$viewValue ?  1 + percent : percent;
        // Make sure the switch stays inside its bounds, 0-1%
        translate = Math.max(0, Math.min(1, translate));

        thumbContainer.css($mdConstant.CSS.TRANSFORM, 'translate3d(' + (100*translate) + '%,0,0)');
        drag.translate = translate;
      }

      function onDragEnd(ev) {
        if (!drag) return;
        ev.stopPropagation();

        element.removeClass('md-dragging');
        thumbContainer.css($mdConstant.CSS.TRANSFORM, '');

        // We changed if there is no distance (this is a click a click),
        // or if the drag distance is >50% of the total.
        var isChanged = ngModel.$viewValue ? drag.translate < 0.5 : drag.translate > 0.5;
        if (isChanged) {
          applyModelValue(!ngModel.$viewValue);
        }
        drag = null;

        // Wait for incoming mouse click
        scope.skipToggle = true;
        $timeout(function() {
          scope.skipToggle = false;
        }, 1);
      }

      function applyModelValue(newValue) {
        scope.$apply(function() {
          ngModel.$setViewValue(newValue);
          ngModel.$render();
        });
      }

    };
  }


}
MdSwitch.$inject = ["mdCheckboxDirective", "$mdUtil", "$mdConstant", "$parse", "$$rAF", "$mdGesture", "$timeout"];

})();
(function(){
"use strict";

/**
 * @ngdoc module
 * @name material.components.tabs
 * @description
 *
 *  Tabs, created with the `<md-tabs>` directive provide *tabbed* navigation with different styles.
 *  The Tabs component consists of clickable tabs that are aligned horizontally side-by-side.
 *
 *  Features include support for:
 *
 *  - static or dynamic tabs,
 *  - responsive designs,
 *  - accessibility support (ARIA),
 *  - tab pagination,
 *  - external or internal tab content,
 *  - focus indicators and arrow-key navigations,
 *  - programmatic lookup and access to tab controllers, and
 *  - dynamic transitions through different tab contents.
 *
 */
/*
 * @see js folder for tabs implementation
 */
angular.module('material.components.tabs', [
  'material.core',
  'material.components.icon'
]);

})();
(function(){
"use strict";

/**
  * @ngdoc module
  * @name material.components.toast
  * @description
  * Toast
  */
angular.module('material.components.toast', [
  'material.core',
  'material.components.button'
])
  .directive('mdToast', MdToastDirective)
  .provider('$mdToast', MdToastProvider);

/* @ngInject */
function MdToastDirective($mdToast) {
  return {
    restrict: 'E',
    link: function postLink(scope, element) {
      element.addClass('_md');     // private md component indicator for styling
      
      // When navigation force destroys an interimElement, then
      // listen and $destroy() that interim instance...
      scope.$on('$destroy', function() {
        $mdToast.destroy();
      });
    }
  };
}
MdToastDirective.$inject = ["$mdToast"];

/**
  * @ngdoc service
  * @name $mdToast
  * @module material.components.toast
  *
  * @description
  * `$mdToast` is a service to build a toast notification on any position
  * on the screen with an optional duration, and provides a simple promise API.
  *
  * The toast will be always positioned at the `bottom`, when the screen size is
  * between `600px` and `959px` (`sm` breakpoint)
  *
  * ## Restrictions on custom toasts
  * - The toast's template must have an outer `<md-toast>` element.
  * - For a toast action, use element with class `md-action`.
  * - Add the class `md-capsule` for curved corners.
  *
  * ### Custom Presets
  * Developers are also able to create their own preset, which can be easily used without repeating
  * their options each time.
  *
  * <hljs lang="js">
  *   $mdToastProvider.addPreset('testPreset', {
  *     options: function() {
  *       return {
  *         template:
  *           '<md-toast>' +
  *             '<div class="md-toast-content">' +
  *               'This is a custom preset' +
  *             '</div>' +
  *           '</md-toast>',
  *         controllerAs: 'toast',
  *         bindToController: true
  *       };
  *     }
  *   });
  * </hljs>
  *
  * After you created your preset at config phase, you can easily access it.
  *
  * <hljs lang="js">
  *   $mdToast.show(
  *     $mdToast.testPreset()
  *   );
  * </hljs>
  *
  * ## Parent container notes
  *
  * The toast is positioned using absolute positioning relative to its first non-static parent
  * container. Thus, if the requested parent container uses static positioning, we will temporarily
  * set its positioning to `relative` while the toast is visible and reset it when the toast is
  * hidden.
  *
  * Because of this, it is usually best to ensure that the parent container has a fixed height and
  * prevents scrolling by setting the `overflow: hidden;` style. Since the position is based off of
  * the parent's height, the toast may be mispositioned if you allow the parent to scroll.
  *
  * You can, however, have a scrollable element inside of the container; just make sure the
  * container itself does not scroll.
  *
  * <hljs lang="html">
  * <div layout-fill id="toast-container">
  *   <md-content>
  *     I can have lots of content and scroll!
  *   </md-content>
  * </div>
  * </hljs>
  *
  * @usage
  * <hljs lang="html">
  * <div ng-controller="MyController">
  *   <md-button ng-click="openToast()">
  *     Open a Toast!
  *   </md-button>
  * </div>
  * </hljs>
  *
  * <hljs lang="js">
  * var app = angular.module('app', ['ngMaterial']);
  * app.controller('MyController', function($scope, $mdToast) {
  *   $scope.openToast = function($event) {
  *     $mdToast.show($mdToast.simple().textContent('Hello!'));
  *     // Could also do $mdToast.showSimple('Hello');
  *   };
  * });
  * </hljs>
  */

/**
 * @ngdoc method
 * @name $mdToast#showSimple
 * 
 * @param {string} message The message to display inside the toast
 * @description
 * Convenience method which builds and shows a simple toast.
 *
 * @returns {promise} A promise that can be resolved with `$mdToast.hide()` or
 * rejected with `$mdToast.cancel()`.
 *
 */

 /**
  * @ngdoc method
  * @name $mdToast#simple
  *
  * @description
  * Builds a preconfigured toast.
  *
  * @returns {obj} a `$mdToastPreset` with the following chainable configuration methods.
  *
  * _**Note:** These configuration methods are provided in addition to the methods provided by
  * the `build()` and `show()` methods below._
  *
  * <table class="md-api-table methods">
  *    <thead>
  *      <tr>
  *        <th>Method</th>
  *        <th>Description</th>
  *      </tr>
  *    </thead>
  *    <tbody>
  *      <tr>
  *        <td>`.textContent(string)`</td>
  *        <td>Sets the toast content to the specified string</td>
  *      </tr>
  *      <tr>
  *        <td>`.action(string)`</td>
  *        <td>
  *          Adds an action button. <br/>
  *          If clicked, the promise (returned from `show()`)
  *          will resolve with the value `'ok'`; otherwise, it is resolved with `true` after a `hideDelay`
  *          timeout
  *        </td>
  *      </tr>
  *      <tr>
  *        <td>`.highlightAction(boolean)`</td>
  *        <td>
  *          Whether or not the action button will have an additional highlight class.<br/>
  *          By default the `accent` color will be applied to the action button.
  *        </td>
  *      </tr>
  *      <tr>
  *        <td>`.highlightClass(string)`</td>
  *        <td>
  *          If set, the given class will be applied to the highlighted action button.<br/>
  *          This allows you to specify the highlight color easily. Highlight classes are `md-primary`, `md-warn`
  *          and `md-accent`
  *        </td>
  *      </tr>
  *      <tr>
  *        <td>`.capsule(boolean)`</td>
  *        <td>Whether or not to add the `md-capsule` class to the toast to provide rounded corners</td>
  *      </tr>
  *      <tr>
  *        <td>`.theme(string)`</td>
  *        <td>Sets the theme on the toast to the requested theme. Default is `$mdThemingProvider`'s default.</td>
  *      </tr>
  *      <tr>
  *        <td>`.toastClass(string)`</td>
  *        <td>Sets a class on the toast element</td>
  *      </tr>
  *    </tbody>
  * </table>
  *
  */

/**
  * @ngdoc method
  * @name $mdToast#updateTextContent
  *
  * @description
  * Updates the content of an existing toast. Useful for updating things like counts, etc.
  *
  */

 /**
  * @ngdoc method
  * @name $mdToast#build
  *
  * @description
  * Creates a custom `$mdToastPreset` that you can configure.
  *
  * @returns {obj} a `$mdToastPreset` with the chainable configuration methods for shows' options (see below).
  */

 /**
  * @ngdoc method
  * @name $mdToast#show
  *
  * @description Shows the toast.
  *
  * @param {object} optionsOrPreset Either provide an `$mdToastPreset` returned from `simple()`
  * and `build()`, or an options object with the following properties:
  *
  *   - `templateUrl` - `{string=}`: The url of an html template file that will
  *     be used as the content of the toast. Restrictions: the template must
  *     have an outer `md-toast` element.
  *   - `template` - `{string=}`: Same as templateUrl, except this is an actual
  *     template string.
  *   - `autoWrap` - `{boolean=}`: Whether or not to automatically wrap the template content with a
  *     `<div class="md-toast-content">` if one is not provided. Defaults to true. Can be disabled if you provide a
  *     custom toast directive.
  *   - `scope` - `{object=}`: the scope to link the template / controller to. If none is specified, it will create a new child scope.
  *     This scope will be destroyed when the toast is removed unless `preserveScope` is set to true.
  *   - `preserveScope` - `{boolean=}`: whether to preserve the scope when the element is removed. Default is false
  *   - `hideDelay` - `{number=}`: How many milliseconds the toast should stay
  *     active before automatically closing.  Set to 0 or false to have the toast stay open until
  *     closed manually. Default: 3000.
  *   - `position` - `{string=}`: Sets the position of the toast. <br/>
  *     Available: any combination of `'bottom'`, `'left'`, `'top'`, `'right'`, `'end'` and `'start'`.
  *     The properties `'end'` and `'start'` are dynamic and can be used for RTL support.<br/>
  *     Default combination: `'bottom left'`.
  *   - `toastClass` - `{string=}`: A class to set on the toast element.
  *   - `controller` - `{string=}`: The controller to associate with this toast.
  *     The controller will be injected the local `$mdToast.hide( )`, which is a function
  *     used to hide the toast.
  *   - `locals` - `{string=}`: An object containing key/value pairs. The keys will
  *     be used as names of values to inject into the controller. For example,
  *     `locals: {three: 3}` would inject `three` into the controller with the value
  *     of 3.
  *   - `bindToController` - `bool`: bind the locals to the controller, instead of passing them in.
  *   - `resolve` - `{object=}`: Similar to locals, except it takes promises as values
  *     and the toast will not open until the promises resolve.
  *   - `controllerAs` - `{string=}`: An alias to assign the controller to on the scope.
  *   - `parent` - `{element=}`: The element to append the toast to. Defaults to appending
  *     to the root element of the application.
  *
  * @returns {promise} A promise that can be resolved with `$mdToast.hide()` or
  * rejected with `$mdToast.cancel()`. `$mdToast.hide()` will resolve either with a Boolean
  * value == 'true' or the value passed as an argument to `$mdToast.hide()`.
  * And `$mdToast.cancel()` will resolve the promise with a Boolean value == 'false'
  */

/**
  * @ngdoc method
  * @name $mdToast#hide
  *
  * @description
  * Hide an existing toast and resolve the promise returned from `$mdToast.show()`.
  *
  * @param {*=} response An argument for the resolved promise.
  *
  * @returns {promise} a promise that is called when the existing element is removed from the DOM.
  * The promise is resolved with either a Boolean value == 'true' or the value passed as the
  * argument to `.hide()`.
  *
  */

/**
  * @ngdoc method
  * @name $mdToast#cancel
  *
  * @description
  * `DEPRECATED` - The promise returned from opening a toast is used only to notify about the closing of the toast.
  * As such, there isn't any reason to also allow that promise to be rejected,
  * since it's not clear what the difference between resolve and reject would be.
  *
  * Hide the existing toast and reject the promise returned from
  * `$mdToast.show()`.
  *
  * @param {*=} response An argument for the rejected promise.
  *
  * @returns {promise} a promise that is called when the existing element is removed from the DOM
  * The promise is resolved with a Boolean value == 'false'.
  *
  */

function MdToastProvider($$interimElementProvider) {
  // Differentiate promise resolves: hide timeout (value == true) and hide action clicks (value == ok).
  var ACTION_RESOLVE = 'ok';

  var activeToastContent;
  var $mdToast = $$interimElementProvider('$mdToast')
    .setDefaults({
      methods: ['position', 'hideDelay', 'capsule', 'parent', 'position', 'toastClass'],
      options: toastDefaultOptions
    })
    .addPreset('simple', {
      argOption: 'textContent',
      methods: ['textContent', 'content', 'action', 'highlightAction', 'highlightClass', 'theme', 'parent' ],
      options: /* @ngInject */ ["$mdToast", "$mdTheming", function($mdToast, $mdTheming) {
        return {
          template:
            '<md-toast md-theme="{{ toast.theme }}" ng-class="{\'md-capsule\': toast.capsule}">' +
            '  <div class="md-toast-content">' +
            '    <span class="md-toast-text" role="alert" aria-relevant="all" aria-atomic="true">' +
            '      {{ toast.content }}' +
            '    </span>' +
            '    <md-button class="md-action" ng-if="toast.action" ng-click="toast.resolve()" ' +
            '        ng-class="highlightClasses">' +
            '      {{ toast.action }}' +
            '    </md-button>' +
            '  </div>' +
            '</md-toast>',
          controller: /* @ngInject */ ["$scope", function mdToastCtrl($scope) {
            var self = this;

            if (self.highlightAction) {
              $scope.highlightClasses = [
                'md-highlight',
                self.highlightClass
              ]
            }

            $scope.$watch(function() { return activeToastContent; }, function() {
              self.content = activeToastContent;
            });

            this.resolve = function() {
              $mdToast.hide( ACTION_RESOLVE );
            };
          }],
          theme: $mdTheming.defaultTheme(),
          controllerAs: 'toast',
          bindToController: true
        };
      }]
    })
    .addMethod('updateTextContent', updateTextContent)
    .addMethod('updateContent', updateTextContent);

    function updateTextContent(newContent) {
      activeToastContent = newContent;
    }

  toastDefaultOptions.$inject = ["$animate", "$mdToast", "$mdUtil", "$mdMedia"];
    return $mdToast;

  /* @ngInject */
  function toastDefaultOptions($animate, $mdToast, $mdUtil, $mdMedia) {
    var SWIPE_EVENTS = '$md.swipeleft $md.swiperight $md.swipeup $md.swipedown';
    return {
      onShow: onShow,
      onRemove: onRemove,
      toastClass: '',
      position: 'bottom left',
      themable: true,
      hideDelay: 3000,
      autoWrap: true,
      transformTemplate: function(template, options) {
        var shouldAddWrapper = options.autoWrap && template && !/md-toast-content/g.test(template);

        if (shouldAddWrapper) {
          // Root element of template will be <md-toast>. We need to wrap all of its content inside of
          // of <div class="md-toast-content">. All templates provided here should be static, developer-controlled
          // content (meaning we're not attempting to guard against XSS).
          var templateRoot = document.createElement('md-template');
          templateRoot.innerHTML = template;

          // Iterate through all root children, to detect possible md-toast directives.
          for (var i = 0; i < templateRoot.children.length; i++) {
            if (templateRoot.children[i].nodeName === 'MD-TOAST') {
              var wrapper = angular.element('<div class="md-toast-content">');

              // Wrap the children of the `md-toast` directive in jqLite, to be able to append multiple
              // nodes with the same execution.
              wrapper.append(angular.element(templateRoot.children[i].childNodes));

              // Append the new wrapped element to the `md-toast` directive.
              templateRoot.children[i].appendChild(wrapper[0]);
            }
          }

          // We have to return the innerHTMl, because we do not want to have the `md-template` element to be
          // the root element of our interimElement.
          return templateRoot.innerHTML;
        }

        return template || '';
      }
    };

    function onShow(scope, element, options) {
      activeToastContent = options.textContent || options.content; // support deprecated #content method

      var isSmScreen = !$mdMedia('gt-sm');

      element = $mdUtil.extractElementByName(element, 'md-toast', true);
      options.element = element;

      options.onSwipe = function(ev, gesture) {
        //Add the relevant swipe class to the element so it can animate correctly
        var swipe = ev.type.replace('$md.','');
        var direction = swipe.replace('swipe', '');

        // If the swipe direction is down/up but the toast came from top/bottom don't fade away
        // Unless the screen is small, then the toast always on bottom
        if ((direction === 'down' && options.position.indexOf('top') != -1 && !isSmScreen) ||
            (direction === 'up' && (options.position.indexOf('bottom') != -1 || isSmScreen))) {
          return;
        }

        if ((direction === 'left' || direction === 'right') && isSmScreen) {
          return;
        }

        element.addClass('md-' + swipe);
        $mdUtil.nextTick($mdToast.cancel);
      };
      options.openClass = toastOpenClass(options.position);

      element.addClass(options.toastClass);

      // 'top left' -> 'md-top md-left'
      options.parent.addClass(options.openClass);

      // static is the default position
      if ($mdUtil.hasComputedStyle(options.parent, 'position', 'static')) {
        options.parent.css('position', 'relative');
      }

      element.on(SWIPE_EVENTS, options.onSwipe);
      element.addClass(isSmScreen ? 'md-bottom' : options.position.split(' ').map(function(pos) {
        return 'md-' + pos;
      }).join(' '));

      if (options.parent) options.parent.addClass('md-toast-animating');
      return $animate.enter(element, options.parent).then(function() {
        if (options.parent) options.parent.removeClass('md-toast-animating');
      });
    }

    function onRemove(scope, element, options) {
      element.off(SWIPE_EVENTS, options.onSwipe);
      if (options.parent) options.parent.addClass('md-toast-animating');
      if (options.openClass) options.parent.removeClass(options.openClass);

      return ((options.$destroy == true) ? element.remove() : $animate.leave(element))
        .then(function () {
          if (options.parent) options.parent.removeClass('md-toast-animating');
          if ($mdUtil.hasComputedStyle(options.parent, 'position', 'static')) {
            options.parent.css('position', '');
          }
        });
    }

    function toastOpenClass(position) {
      // For mobile, always open full-width on bottom
      if (!$mdMedia('gt-xs')) {
        return 'md-toast-open-bottom';
      }

      return 'md-toast-open-' +
        (position.indexOf('top') > -1 ? 'top' : 'bottom');
    }
  }

}
MdToastProvider.$inject = ["$$interimElementProvider"];

})();
(function(){
"use strict";

/**
 * @ngdoc module
 * @name material.components.toolbar
 */
angular.module('material.components.toolbar', [
  'material.core',
  'material.components.content'
])
  .directive('mdToolbar', mdToolbarDirective);

/**
 * @ngdoc directive
 * @name mdToolbar
 * @module material.components.toolbar
 * @restrict E
 * @description
 * `md-toolbar` is used to place a toolbar in your app.
 *
 * Toolbars are usually used above a content area to display the title of the
 * current page, and show relevant action buttons for that page.
 *
 * You can change the height of the toolbar by adding either the
 * `md-medium-tall` or `md-tall` class to the toolbar.
 *
 * @usage
 * <hljs lang="html">
 * <div layout="column" layout-fill>
 *   <md-toolbar>
 *
 *     <div class="md-toolbar-tools">
 *       <span>My App's Title</span>
 *
 *       <!-- fill up the space between left and right area -->
 *       <span flex></span>
 *
 *       <md-button>
 *         Right Bar Button
 *       </md-button>
 *     </div>
 *
 *   </md-toolbar>
 *   <md-content>
 *     Hello!
 *   </md-content>
 * </div>
 * </hljs>
 *
 * @param {boolean=} md-scroll-shrink Whether the header should shrink away as
 * the user scrolls down, and reveal itself as the user scrolls up.
 *
 * _**Note (1):** for scrollShrink to work, the toolbar must be a sibling of a
 * `md-content` element, placed before it. See the scroll shrink demo._
 *
 * _**Note (2):** The `md-scroll-shrink` attribute is only parsed on component
 * initialization, it does not watch for scope changes._
 *
 *
 * @param {number=} md-shrink-speed-factor How much to change the speed of the toolbar's
 * shrinking by. For example, if 0.25 is given then the toolbar will shrink
 * at one fourth the rate at which the user scrolls down. Default 0.5.
 */

function mdToolbarDirective($$rAF, $mdConstant, $mdUtil, $mdTheming, $animate) {
  var translateY = angular.bind(null, $mdUtil.supplant, 'translate3d(0,{0}px,0)');

  return {
    template: '',
    restrict: 'E',

    link: function(scope, element, attr) {

      element.addClass('_md');     // private md component indicator for styling
      $mdTheming(element);

      $mdUtil.nextTick(function () {
        element.addClass('_md-toolbar-transitions');     // adding toolbar transitions after digest
      }, false);

      if (angular.isDefined(attr.mdScrollShrink)) {
        setupScrollShrink();
      }

      function setupScrollShrink() {

        var toolbarHeight;
        var contentElement;
        var disableScrollShrink = angular.noop;

        // Current "y" position of scroll
        // Store the last scroll top position
        var y = 0;
        var prevScrollTop = 0;
        var shrinkSpeedFactor = attr.mdShrinkSpeedFactor || 0.5;

        var debouncedContentScroll = $$rAF.throttle(onContentScroll);
        var debouncedUpdateHeight = $mdUtil.debounce(updateToolbarHeight, 5 * 1000);

        // Wait for $mdContentLoaded event from mdContent directive.
        // If the mdContent element is a sibling of our toolbar, hook it up
        // to scroll events.

        scope.$on('$mdContentLoaded', onMdContentLoad);

        // If the toolbar is used inside an ng-if statement, we may miss the
        // $mdContentLoaded event, so we attempt to fake it if we have a
        // md-content close enough.

        attr.$observe('mdScrollShrink', onChangeScrollShrink);

        // If the toolbar has ngShow or ngHide we need to update height immediately as it changed
        // and not wait for $mdUtil.debounce to happen

        if (attr.ngShow) { scope.$watch(attr.ngShow, updateToolbarHeight); }
        if (attr.ngHide) { scope.$watch(attr.ngHide, updateToolbarHeight); }

        // If the scope is destroyed (which could happen with ng-if), make sure
        // to disable scroll shrinking again

        scope.$on('$destroy', disableScrollShrink);

        /**
         *
         */
        function onChangeScrollShrink(shrinkWithScroll) {
          var closestContent = element.parent().find('md-content');

          // If we have a content element, fake the call; this might still fail
          // if the content element isn't a sibling of the toolbar

          if (!contentElement && closestContent.length) {
            onMdContentLoad(null, closestContent);
          }

          // Evaluate the expression
          shrinkWithScroll = scope.$eval(shrinkWithScroll);

          // Disable only if the attribute's expression evaluates to false
          if (shrinkWithScroll === false) {
            disableScrollShrink();
          } else {
            disableScrollShrink = enableScrollShrink();
          }
        }

        /**
         *
         */
        function onMdContentLoad($event, newContentEl) {
          // Toolbar and content must be siblings
          if (newContentEl && element.parent()[0] === newContentEl.parent()[0]) {
            // unhook old content event listener if exists
            if (contentElement) {
              contentElement.off('scroll', debouncedContentScroll);
            }

            contentElement = newContentEl;
            disableScrollShrink = enableScrollShrink();
          }
        }

        /**
         *
         */
        function onContentScroll(e) {
          var scrollTop = e ? e.target.scrollTop : prevScrollTop;

          debouncedUpdateHeight();

          y = Math.min(
            toolbarHeight / shrinkSpeedFactor,
            Math.max(0, y + scrollTop - prevScrollTop)
          );

          element.css($mdConstant.CSS.TRANSFORM, translateY([-y * shrinkSpeedFactor]));
          contentElement.css($mdConstant.CSS.TRANSFORM, translateY([(toolbarHeight - y) * shrinkSpeedFactor]));

          prevScrollTop = scrollTop;

          $mdUtil.nextTick(function() {
            var hasWhiteFrame = element.hasClass('md-whiteframe-z1');

            if (hasWhiteFrame && !y) {
              $animate.removeClass(element, 'md-whiteframe-z1');
            } else if (!hasWhiteFrame && y) {
              $animate.addClass(element, 'md-whiteframe-z1');
            }
          });

        }

        /**
         *
         */
        function enableScrollShrink() {
          if (!contentElement)     return angular.noop;           // no md-content

          contentElement.on('scroll', debouncedContentScroll);
          contentElement.attr('scroll-shrink', 'true');

          $mdUtil.nextTick(updateToolbarHeight, false);

          return function disableScrollShrink() {
            contentElement.off('scroll', debouncedContentScroll);
            contentElement.attr('scroll-shrink', 'false');

            updateToolbarHeight();
          };
        }

        /**
         *
         */
        function updateToolbarHeight() {
          toolbarHeight = element.prop('offsetHeight');
          // Add a negative margin-top the size of the toolbar to the content el.
          // The content will start transformed down the toolbarHeight amount,
          // so everything looks normal.
          //
          // As the user scrolls down, the content will be transformed up slowly
          // to put the content underneath where the toolbar was.
          var margin = (-toolbarHeight * shrinkSpeedFactor) + 'px';

          contentElement.css({
            "margin-top": margin,
            "margin-bottom": margin
          });

          onContentScroll();
        }

      }

    }
  };

}
mdToolbarDirective.$inject = ["$$rAF", "$mdConstant", "$mdUtil", "$mdTheming", "$animate"];

})();
(function(){
"use strict";

/**
 * @ngdoc module
 * @name material.components.tooltip
 */
angular
    .module('material.components.tooltip', [ 'material.core' ])
    .directive('mdTooltip', MdTooltipDirective);

/**
 * @ngdoc directive
 * @name mdTooltip
 * @module material.components.tooltip
 * @description
 * Tooltips are used to describe elements that are interactive and primarily graphical (not textual).
 *
 * Place a `<md-tooltip>` as a child of the element it describes.
 *
 * A tooltip will activate when the user focuses, hovers over, or touches the parent.
 *
 * @usage
 * <hljs lang="html">
 * <md-button class="md-fab md-accent" aria-label="Play">
 *   <md-tooltip>
 *     Play Music
 *   </md-tooltip>
 *   <md-icon icon="img/icons/ic_play_arrow_24px.svg"></md-icon>
 * </md-button>
 * </hljs>
 *
 * @param {expression=} md-visible Boolean bound to whether the tooltip is currently visible.
 * @param {number=} md-delay How many milliseconds to wait to show the tooltip after the user focuses, hovers, or touches the
 * parent. Defaults to 0ms on non-touch devices and 75ms on touch.
 * @param {boolean=} md-autohide If present or provided with a boolean value, the tooltip will hide on mouse leave, regardless of focus
 * @param {string=} md-direction Which direction would you like the tooltip to go?  Supports left, right, top, and bottom.  Defaults to bottom.
 */
function MdTooltipDirective($timeout, $window, $$rAF, $document, $mdUtil, $mdTheming, $rootElement,
                            $animate, $q, $interpolate) {

  var ENTER_EVENTS = 'focus touchstart mouseenter';
  var LEAVE_EVENTS = 'blur touchcancel mouseleave';
  var SHOW_CLASS = 'md-show';
  var TOOLTIP_SHOW_DELAY = 0;
  var TOOLTIP_WINDOW_EDGE_SPACE = 8;

  return {
    restrict: 'E',
    transclude: true,
    priority: 210, // Before ngAria
    template: '<div class="md-content _md" ng-transclude></div>',
    scope: {
      delay: '=?mdDelay',
      visible: '=?mdVisible',
      autohide: '=?mdAutohide',
      direction: '@?mdDirection'    // only expect raw or interpolated string value; not expression
    },
    compile: function(tElement, tAttr) {
      if (!tAttr.mdDirection) {
        tAttr.$set('mdDirection', 'bottom');
      }

      return postLink;
    }
  };

  function postLink(scope, element, attr) {

    $mdTheming(element);

    var parent        = $mdUtil.getParentWithPointerEvents(element),
        content       = angular.element(element[0].getElementsByClassName('md-content')[0]),
        tooltipParent = angular.element(document.body),
        showTimeout   = null,
        debouncedOnResize = $$rAF.throttle(function () { updatePosition(); });

    if ($animate.pin) $animate.pin(element, parent);

    // Initialize element

    setDefaults();
    manipulateElement();
    bindEvents();

    // Default origin transform point is 'center top'
    // positionTooltip() is always relative to center top
    updateContentOrigin();

    configureWatchers();
    addAriaLabel();


    function setDefaults () {
      scope.delay = scope.delay || TOOLTIP_SHOW_DELAY;
    }

    function updateContentOrigin() {
      var origin = 'center top';
      switch (scope.direction) {
        case 'left'  : origin =  'right center';  break;
        case 'right' : origin =  'left center';   break;
        case 'top'   : origin =  'center bottom'; break;
        case 'bottom': origin =  'center top';    break;
      }
      content.css('transform-origin', origin);
    }

    function onVisibleChanged (isVisible) {
      if (isVisible) showTooltip();
      else hideTooltip();
    }

    function configureWatchers () {
      if (element[0] && 'MutationObserver' in $window) {
        var attributeObserver = new MutationObserver(function(mutations) {
          mutations
            .forEach(function (mutation) {
              if (mutation.attributeName === 'md-visible') {
                if (!scope.visibleWatcher)
                  scope.visibleWatcher = scope.$watch('visible', onVisibleChanged );
              }
              if (mutation.attributeName === 'md-direction') {
                updatePosition(scope.direction);
              }
            });
        });

        attributeObserver.observe(element[0], { attributes: true });

        // build watcher only if mdVisible is being used
        if (attr.hasOwnProperty('mdVisible')) {
          scope.visibleWatcher = scope.$watch('visible', onVisibleChanged );
        }
      } else { // MutationObserver not supported
        scope.visibleWatcher = scope.$watch('visible', onVisibleChanged );
        scope.$watch('direction', updatePosition );
      }

      var onElementDestroy = function() {
        scope.$destroy();
      };

      // Clean up if the element or parent was removed via jqLite's .remove.
      // A couple of notes:
      // - In these cases the scope might not have been destroyed, which is why we
      // destroy it manually. An example of this can be having `md-visible="false"` and
      // adding tooltips while they're invisible. If `md-visible` becomes true, at some
      // point, you'd usually get a lot of inputs.
      // - We use `.one`, not `.on`, because this only needs to fire once. If we were
      // using `.on`, it would get thrown into an infinite loop.
      // - This kicks off the scope's `$destroy` event which finishes the cleanup.
      element.one('$destroy', onElementDestroy);
      parent.one('$destroy', onElementDestroy);
      scope.$on('$destroy', function() {
        setVisible(false);
        element.remove();
        attributeObserver && attributeObserver.disconnect();
      });

      // Updates the aria-label when the element text changes. This watch
      // doesn't need to be set up if the element doesn't have any data
      // bindings.
      if (element.text().indexOf($interpolate.startSymbol()) > -1) {
        scope.$watch(function() {
          return element.text().trim();
        }, addAriaLabel);
      }
    }

    function addAriaLabel (override) {
      if ((override || !parent.attr('aria-label')) && !parent.text().trim()) {
        var rawText = override || element.text().trim();
        var interpolatedText = $interpolate(rawText)(parent.scope());
        parent.attr('aria-label', interpolatedText);
      }
    }

    function manipulateElement () {
      element.detach();
      element.attr('role', 'tooltip');
    }

    function bindEvents () {
      var mouseActive = false;

      // add an mutationObserver when there is support for it
      // and the need for it in the form of viable host(parent[0])
      if (parent[0] && 'MutationObserver' in $window) {
        // use an mutationObserver to tackle #2602
        var attributeObserver = new MutationObserver(function(mutations) {
          if (mutations.some(function (mutation) {
              return (mutation.attributeName === 'disabled' && parent[0].disabled);
            })) {
              $mdUtil.nextTick(function() {
                setVisible(false);
              });
          }
        });

        attributeObserver.observe(parent[0], { attributes: true});
      }

      // Store whether the element was focused when the window loses focus.
      var windowBlurHandler = function() {
        elementFocusedOnWindowBlur = document.activeElement === parent[0];
      };
      var elementFocusedOnWindowBlur = false;

      function windowScrollHandler() {
        setVisible(false);
      }

      angular.element($window)
        .on('blur', windowBlurHandler)
        .on('resize', debouncedOnResize);

      document.addEventListener('scroll', windowScrollHandler, true);
      scope.$on('$destroy', function() {
        angular.element($window)
          .off('blur', windowBlurHandler)
          .off('resize', debouncedOnResize);

        parent
          .off(ENTER_EVENTS, enterHandler)
          .off(LEAVE_EVENTS, leaveHandler)
          .off('mousedown', mousedownHandler);

        // Trigger the handler in case any the tooltip was still visible.
        leaveHandler();
        document.removeEventListener('scroll', windowScrollHandler, true);
        attributeObserver && attributeObserver.disconnect();
      });

      var enterHandler = function(e) {
        // Prevent the tooltip from showing when the window is receiving focus.
        if (e.type === 'focus' && elementFocusedOnWindowBlur) {
          elementFocusedOnWindowBlur = false;
        } else if (!scope.visible) {
          parent.on(LEAVE_EVENTS, leaveHandler);
          setVisible(true);

          // If the user is on a touch device, we should bind the tap away after
          // the `touched` in order to prevent the tooltip being removed immediately.
          if (e.type === 'touchstart') {
            parent.one('touchend', function() {
              $mdUtil.nextTick(function() {
                $document.one('touchend', leaveHandler);
              }, false);
            });
          }
        }
      };
      var leaveHandler = function () {
        var autohide = scope.hasOwnProperty('autohide') ? scope.autohide : attr.hasOwnProperty('mdAutohide');

        if (autohide || mouseActive || $document[0].activeElement !== parent[0]) {
          // When a show timeout is currently in progress, then we have to cancel it.
          // Otherwise the tooltip will remain showing without focus or hover.
          if (showTimeout) {
            $timeout.cancel(showTimeout);
            setVisible.queued = false;
            showTimeout = null;
          }

          parent.off(LEAVE_EVENTS, leaveHandler);
          parent.triggerHandler('blur');
          setVisible(false);
        }
        mouseActive = false;
      };
      var mousedownHandler = function() {
        mouseActive = true;
      };

      // to avoid `synthetic clicks` we listen to mousedown instead of `click`
      parent.on('mousedown', mousedownHandler);
      parent.on(ENTER_EVENTS, enterHandler);
    }

    function setVisible (value) {
      // break if passed value is already in queue or there is no queue and passed value is current in the scope
      if (setVisible.queued && setVisible.value === !!value || !setVisible.queued && scope.visible === !!value) return;
      setVisible.value = !!value;

      if (!setVisible.queued) {
        if (value) {
          setVisible.queued = true;
          showTimeout = $timeout(function() {
            scope.visible = setVisible.value;
            setVisible.queued = false;
            showTimeout = null;

            if (!scope.visibleWatcher) {
              onVisibleChanged(scope.visible);
            }
          }, scope.delay);
        } else {
          $mdUtil.nextTick(function() {
            scope.visible = false;
            if (!scope.visibleWatcher)
              onVisibleChanged(false);
          });
        }
      }
    }

    function showTooltip() {
      //  Do not show the tooltip if the text is empty.
      if (!element[0].textContent.trim()) return;

      // Insert the element and position at top left, so we can get the position
      // and check if we should display it
      element.css({top: 0, left: 0});
      tooltipParent.append(element);

      // Check if we should display it or not.
      // This handles hide-* and show-* along with any user defined css
      if ( $mdUtil.hasComputedStyle(element, 'display', 'none')) {
        scope.visible = false;
        element.detach();
        return;
      }

      updatePosition();

      $animate.addClass(content, SHOW_CLASS).then(function() {
        element.addClass(SHOW_CLASS);
      });
    }

    function hideTooltip() {
      $animate.removeClass(content, SHOW_CLASS).then(function(){
        element.removeClass(SHOW_CLASS);
        if (!scope.visible) element.detach();
      });
    }

    function updatePosition() {
      if ( !scope.visible ) return;

      updateContentOrigin();
      positionTooltip();
    }

    function positionTooltip() {
      var tipRect = $mdUtil.offsetRect(element, tooltipParent);
      var parentRect = $mdUtil.offsetRect(parent, tooltipParent);
      var newPosition = getPosition(scope.direction);
      var offsetParent = element.prop('offsetParent');

      // If the user provided a direction, just nudge the tooltip onto the screen
      // Otherwise, recalculate based on 'top' since default is 'bottom'
      if (scope.direction) {
        newPosition = fitInParent(newPosition);
      } else if (offsetParent && newPosition.top > offsetParent.scrollHeight - tipRect.height - TOOLTIP_WINDOW_EDGE_SPACE) {
        newPosition = fitInParent(getPosition('top'));
      }

      element.css({
        left: newPosition.left + 'px',
        top: newPosition.top + 'px'
      });

      function fitInParent (pos) {
        var newPosition = { left: pos.left, top: pos.top };
        newPosition.left = Math.min( newPosition.left, tooltipParent.prop('scrollWidth') - tipRect.width - TOOLTIP_WINDOW_EDGE_SPACE );
        newPosition.left = Math.max( newPosition.left, TOOLTIP_WINDOW_EDGE_SPACE );
        newPosition.top  = Math.min( newPosition.top,  tooltipParent.prop('scrollHeight') - tipRect.height - TOOLTIP_WINDOW_EDGE_SPACE );
        newPosition.top  = Math.max( newPosition.top,  TOOLTIP_WINDOW_EDGE_SPACE );
        return newPosition;
      }

      function getPosition (dir) {
        return dir === 'left'
          ? { left: parentRect.left - tipRect.width - TOOLTIP_WINDOW_EDGE_SPACE,
              top: parentRect.top + parentRect.height / 2 - tipRect.height / 2 }
          : dir === 'right'
          ? { left: parentRect.left + parentRect.width + TOOLTIP_WINDOW_EDGE_SPACE,
              top: parentRect.top + parentRect.height / 2 - tipRect.height / 2 }
          : dir === 'top'
          ? { left: parentRect.left + parentRect.width / 2 - tipRect.width / 2,
              top: parentRect.top - tipRect.height - TOOLTIP_WINDOW_EDGE_SPACE }
          : { left: parentRect.left + parentRect.width / 2 - tipRect.width / 2,
              top: parentRect.top + parentRect.height + TOOLTIP_WINDOW_EDGE_SPACE };
      }
    }

  }

}
MdTooltipDirective.$inject = ["$timeout", "$window", "$$rAF", "$document", "$mdUtil", "$mdTheming", "$rootElement", "$animate", "$q", "$interpolate"];

})();
(function(){
"use strict";

/**
 * @ngdoc module
 * @name material.components.virtualRepeat
 */
angular.module('material.components.virtualRepeat', [
  'material.core',
  'material.components.showHide'
])
.directive('mdVirtualRepeatContainer', VirtualRepeatContainerDirective)
.directive('mdVirtualRepeat', VirtualRepeatDirective);


/**
 * @ngdoc directive
 * @name mdVirtualRepeatContainer
 * @module material.components.virtualRepeat
 * @restrict E
 * @description
 * `md-virtual-repeat-container` provides the scroll container for md-virtual-repeat.
 *
 * VirtualRepeat is a limited substitute for ng-repeat that renders only
 * enough DOM nodes to fill the container and recycling them as the user scrolls.
 *
 * Once an element is not visible anymore, the VirtualRepeat recycles it and will reuse it for
 * another visible item by replacing the previous dataset with the new one.
 *
 * **Common Issues**
 * > When having one-time bindings inside of the view template, the VirtualRepeat will not properly
 * > update the bindings for new items, since the view will be recycled.
 *
 * **Notes:**
 * > The VirtualRepeat is a similar implementation to the Android
 * [RecyclerView](https://developer.android.com/reference/android/support/v7/widget/RecyclerView.html)
 *
 *
 *
 * @usage
 * <hljs lang="html">
 *
 * <md-virtual-repeat-container md-top-index="topIndex">
 *   <div md-virtual-repeat="i in items" md-item-size="20">Hello {{i}}!</div>
 * </md-virtual-repeat-container>
 * </hljs>
 *
 * @param {number=} md-top-index Binds the index of the item that is at the top of the scroll
 *     container to $scope. It can both read and set the scroll position.
 * @param {boolean=} md-orient-horizontal Whether the container should scroll horizontally
 *     (defaults to orientation and scrolling vertically).
 * @param {boolean=} md-auto-shrink When present, the container will shrink to fit
 *     the number of items when that number is less than its original size.
 * @param {number=} md-auto-shrink-min Minimum number of items that md-auto-shrink
 *     will shrink to (default: 0).
 */
function VirtualRepeatContainerDirective() {
  return {
    controller: VirtualRepeatContainerController,
    template: virtualRepeatContainerTemplate,
    compile: function virtualRepeatContainerCompile($element, $attrs) {
      $element
          .addClass('md-virtual-repeat-container')
          .addClass($attrs.hasOwnProperty('mdOrientHorizontal')
              ? 'md-orient-horizontal'
              : 'md-orient-vertical');
    }
  };
}


function virtualRepeatContainerTemplate($element) {
  return '<div class="md-virtual-repeat-scroller">' +
    '<div class="md-virtual-repeat-sizer"></div>' +
    '<div class="md-virtual-repeat-offsetter">' +
      $element[0].innerHTML +
    '</div></div>';
}

/**
 * Maximum size, in pixels, that can be explicitly set to an element. The actual value varies
 * between browsers, but IE11 has the very lowest size at a mere 1,533,917px. Ideally we could
 * *compute* this value, but Firefox always reports an element to have a size of zero if it
 * goes over the max, meaning that we'd have to binary search for the value.
 * @const {number}
 */
var MAX_ELEMENT_SIZE = 1533917;

/**
 * Number of additional elements to render above and below the visible area inside
 * of the virtual repeat container. A higher number results in less flicker when scrolling
 * very quickly in Safari, but comes with a higher rendering and dirty-checking cost.
 * @const {number}
 */
var NUM_EXTRA = 3;

/** @ngInject */
function VirtualRepeatContainerController(
    $$rAF, $mdUtil, $parse, $rootScope, $window, $scope, $element, $attrs) {
  this.$rootScope = $rootScope;
  this.$scope = $scope;
  this.$element = $element;
  this.$attrs = $attrs;

  /** @type {number} The width or height of the container */
  this.size = 0;
  /** @type {number} The scroll width or height of the scroller */
  this.scrollSize = 0;
  /** @type {number} The scrollLeft or scrollTop of the scroller */
  this.scrollOffset = 0;
  /** @type {boolean} Whether the scroller is oriented horizontally */
  this.horizontal = this.$attrs.hasOwnProperty('mdOrientHorizontal');
  /** @type {!VirtualRepeatController} The repeater inside of this container */
  this.repeater = null;
  /** @type {boolean} Whether auto-shrink is enabled */
  this.autoShrink = this.$attrs.hasOwnProperty('mdAutoShrink');
  /** @type {number} Minimum number of items to auto-shrink to */
  this.autoShrinkMin = parseInt(this.$attrs.mdAutoShrinkMin, 10) || 0;
  /** @type {?number} Original container size when shrank */
  this.originalSize = null;
  /** @type {number} Amount to offset the total scroll size by. */
  this.offsetSize = parseInt(this.$attrs.mdOffsetSize, 10) || 0;
  /** @type {?string} height or width element style on the container prior to auto-shrinking. */
  this.oldElementSize = null;

  if (this.$attrs.mdTopIndex) {
    /** @type {function(angular.Scope): number} Binds to topIndex on Angular scope */
    this.bindTopIndex = $parse(this.$attrs.mdTopIndex);
    /** @type {number} The index of the item that is at the top of the scroll container */
    this.topIndex = this.bindTopIndex(this.$scope);

    if (!angular.isDefined(this.topIndex)) {
      this.topIndex = 0;
      this.bindTopIndex.assign(this.$scope, 0);
    }

    this.$scope.$watch(this.bindTopIndex, angular.bind(this, function(newIndex) {
      if (newIndex !== this.topIndex) {
        this.scrollToIndex(newIndex);
      }
    }));
  } else {
    this.topIndex = 0;
  }

  this.scroller = $element[0].querySelector('.md-virtual-repeat-scroller');
  this.sizer = this.scroller.querySelector('.md-virtual-repeat-sizer');
  this.offsetter = this.scroller.querySelector('.md-virtual-repeat-offsetter');

  // After the dom stablizes, measure the initial size of the container and
  // make a best effort at re-measuring as it changes.
  var boundUpdateSize = angular.bind(this, this.updateSize);

  $$rAF(angular.bind(this, function() {
    boundUpdateSize();

    var debouncedUpdateSize = $mdUtil.debounce(boundUpdateSize, 10, null, false);
    var jWindow = angular.element($window);

    // Make one more attempt to get the size if it is 0.
    // This is not by any means a perfect approach, but there's really no
    // silver bullet here.
    if (!this.size) {
      debouncedUpdateSize();
    }

    jWindow.on('resize', debouncedUpdateSize);
    $scope.$on('$destroy', function() {
      jWindow.off('resize', debouncedUpdateSize);
    });

    $scope.$emit('$md-resize-enable');
    $scope.$on('$md-resize', boundUpdateSize);
  }));
}
VirtualRepeatContainerController.$inject = ["$$rAF", "$mdUtil", "$parse", "$rootScope", "$window", "$scope", "$element", "$attrs"];


/** Called by the md-virtual-repeat inside of the container at startup. */
VirtualRepeatContainerController.prototype.register = function(repeaterCtrl) {
  this.repeater = repeaterCtrl;

  angular.element(this.scroller)
      .on('scroll wheel touchmove touchend', angular.bind(this, this.handleScroll_));
};


/** @return {boolean} Whether the container is configured for horizontal scrolling. */
VirtualRepeatContainerController.prototype.isHorizontal = function() {
  return this.horizontal;
};


/** @return {number} The size (width or height) of the container. */
VirtualRepeatContainerController.prototype.getSize = function() {
  return this.size;
};


/**
 * Resizes the container.
 * @private
 * @param {number} size The new size to set.
 */
VirtualRepeatContainerController.prototype.setSize_ = function(size) {
  var dimension = this.getDimensionName_();

  this.size = size;
  this.$element[0].style[dimension] = size + 'px';
};


VirtualRepeatContainerController.prototype.unsetSize_ = function() {
  this.$element[0].style[this.getDimensionName_()] = this.oldElementSize;
  this.oldElementSize = null;
};


/** Instructs the container to re-measure its size. */
VirtualRepeatContainerController.prototype.updateSize = function() {
  // If the original size is already determined, we can skip the update.
  if (this.originalSize) return;

  this.size = this.isHorizontal()
      ? this.$element[0].clientWidth
      : this.$element[0].clientHeight;

  // Recheck the scroll position after updating the size. This resolves
  // problems that can result if the scroll position was measured while the
  // element was display: none or detached from the document.
  this.handleScroll_();

  this.repeater && this.repeater.containerUpdated();
};


/** @return {number} The container's scrollHeight or scrollWidth. */
VirtualRepeatContainerController.prototype.getScrollSize = function() {
  return this.scrollSize;
};


VirtualRepeatContainerController.prototype.getDimensionName_ = function() {
  return this.isHorizontal() ? 'width' : 'height';
};


/**
 * Sets the scroller element to the specified size.
 * @private
 * @param {number} size The new size.
 */
VirtualRepeatContainerController.prototype.sizeScroller_ = function(size) {
  var dimension =  this.getDimensionName_();
  var crossDimension = this.isHorizontal() ? 'height' : 'width';

  // Clear any existing dimensions.
  this.sizer.innerHTML = '';

  // If the size falls within the browser's maximum explicit size for a single element, we can
  // set the size and be done. Otherwise, we have to create children that add up the the desired
  // size.
  if (size < MAX_ELEMENT_SIZE) {
    this.sizer.style[dimension] = size + 'px';
  } else {
    this.sizer.style[dimension] = 'auto';
    this.sizer.style[crossDimension] = 'auto';

    // Divide the total size we have to render into N max-size pieces.
    var numChildren = Math.floor(size / MAX_ELEMENT_SIZE);

    // Element template to clone for each max-size piece.
    var sizerChild = document.createElement('div');
    sizerChild.style[dimension] = MAX_ELEMENT_SIZE + 'px';
    sizerChild.style[crossDimension] = '1px';

    for (var i = 0; i < numChildren; i++) {
      this.sizer.appendChild(sizerChild.cloneNode(false));
    }

    // Re-use the element template for the remainder.
    sizerChild.style[dimension] = (size - (numChildren * MAX_ELEMENT_SIZE)) + 'px';
    this.sizer.appendChild(sizerChild);
  }
};


/**
 * If auto-shrinking is enabled, shrinks or unshrinks as appropriate.
 * @private
 * @param {number} size The new size.
 */
VirtualRepeatContainerController.prototype.autoShrink_ = function(size) {
  var shrinkSize = Math.max(size, this.autoShrinkMin * this.repeater.getItemSize());

  if (this.autoShrink && shrinkSize !== this.size) {
    if (this.oldElementSize === null) {
      this.oldElementSize = this.$element[0].style[this.getDimensionName_()];
    }

    var currentSize = this.originalSize || this.size;

    if (!currentSize || shrinkSize < currentSize) {
      if (!this.originalSize) {
        this.originalSize = this.size;
      }

      // Now we update the containers size, because shrinking is enabled.
      this.setSize_(shrinkSize);
    } else if (this.originalSize !== null) {
      // Set the size back to our initial size.
      this.unsetSize_();

      var _originalSize = this.originalSize;
      this.originalSize = null;

      // We determine the repeaters size again, if the original size was zero.
      // The originalSize needs to be null, to be able to determine the size.
      if (!_originalSize) this.updateSize();

      // Apply the original size or the determined size back to the container, because
      // it has been overwritten before, in the shrink block.
      this.setSize_(_originalSize || this.size);
    }

    this.repeater.containerUpdated();
  }
};


/**
 * Sets the scrollHeight or scrollWidth. Called by the repeater based on
 * its item count and item size.
 * @param {number} itemsSize The total size of the items.
 */
VirtualRepeatContainerController.prototype.setScrollSize = function(itemsSize) {
  var size = itemsSize + this.offsetSize;
  if (this.scrollSize === size) return;

  this.sizeScroller_(size);
  this.autoShrink_(size);
  this.scrollSize = size;
};


/** @return {number} The container's current scroll offset. */
VirtualRepeatContainerController.prototype.getScrollOffset = function() {
  return this.scrollOffset;
};

/**
 * Scrolls to a given scrollTop position.
 * @param {number} position
 */
VirtualRepeatContainerController.prototype.scrollTo = function(position) {
  this.scroller[this.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = position;
  this.handleScroll_();
};

/**
 * Scrolls the item with the given index to the top of the scroll container.
 * @param {number} index
 */
VirtualRepeatContainerController.prototype.scrollToIndex = function(index) {
  var itemSize = this.repeater.getItemSize();
  var itemsLength = this.repeater.itemsLength;
  if(index > itemsLength) {
    index = itemsLength - 1;
  }
  this.scrollTo(itemSize * index);
};

VirtualRepeatContainerController.prototype.resetScroll = function() {
  this.scrollTo(0);
};


VirtualRepeatContainerController.prototype.handleScroll_ = function() {
  var doc = angular.element(document)[0];
  var ltr = doc.dir != 'rtl' && doc.body.dir != 'rtl';
  if(!ltr && !this.maxSize) {
    this.scroller.scrollLeft = this.scrollSize;
    this.maxSize = this.scroller.scrollLeft;
  }
  var offset = this.isHorizontal() ?
      (ltr?this.scroller.scrollLeft : this.maxSize - this.scroller.scrollLeft)
      : this.scroller.scrollTop;
  if (offset === this.scrollOffset || offset > this.scrollSize - this.size) return;

  var itemSize = this.repeater.getItemSize();
  if (!itemSize) return;

  var numItems = Math.max(0, Math.floor(offset / itemSize) - NUM_EXTRA);

  var transform = (this.isHorizontal() ? 'translateX(' : 'translateY(') +
      (!this.isHorizontal() || ltr ? (numItems * itemSize) : - (numItems * itemSize))  + 'px)';

  this.scrollOffset = offset;
  this.offsetter.style.webkitTransform = transform;
  this.offsetter.style.transform = transform;

  if (this.bindTopIndex) {
    var topIndex = Math.floor(offset / itemSize);
    if (topIndex !== this.topIndex && topIndex < this.repeater.getItemCount()) {
      this.topIndex = topIndex;
      this.bindTopIndex.assign(this.$scope, topIndex);
      if (!this.$rootScope.$$phase) this.$scope.$digest();
    }
  }

  this.repeater.containerUpdated();
};


/**
 * @ngdoc directive
 * @name mdVirtualRepeat
 * @module material.components.virtualRepeat
 * @restrict A
 * @priority 1000
 * @description
 * `md-virtual-repeat` specifies an element to repeat using virtual scrolling.
 *
 * Virtual repeat is a limited substitute for ng-repeat that renders only
 * enough dom nodes to fill the container and recycling them as the user scrolls.
 * Arrays, but not objects are supported for iteration.
 * Track by, as alias, and (key, value) syntax are not supported.
 *
 * @usage
 * <hljs lang="html">
 * <md-virtual-repeat-container>
 *   <div md-virtual-repeat="i in items">Hello {{i}}!</div>
 * </md-virtual-repeat-container>
 *
 * <md-virtual-repeat-container md-orient-horizontal>
 *   <div md-virtual-repeat="i in items" md-item-size="20">Hello {{i}}!</div>
 * </md-virtual-repeat-container>
 * </hljs>
 *
 * @param {number=} md-item-size The height or width of the repeated elements (which must be
 *   identical for each element). Optional. Will attempt to read the size from the dom if missing,
 *   but still assumes that all repeated nodes have same height or width.
 * @param {string=} md-extra-name Evaluates to an additional name to which the current iterated item
 *   can be assigned on the repeated scope (needed for use in `md-autocomplete`).
 * @param {boolean=} md-on-demand When present, treats the md-virtual-repeat argument as an object
 *   that can fetch rows rather than an array.
 *
 *   **NOTE:** This object must implement the following interface with two (2) methods:
 *
 *   - `getItemAtIndex: function(index) [object]` The item at that index or null if it is not yet
 *     loaded (it should start downloading the item in that case).
 *   - `getLength: function() [number]` The data length to which the repeater container
 *     should be sized. Ideally, when the count is known, this method should return it.
 *     Otherwise, return a higher number than the currently loaded items to produce an
 *     infinite-scroll behavior.
 */
function VirtualRepeatDirective($parse) {
  return {
    controller: VirtualRepeatController,
    priority: 1000,
    require: ['mdVirtualRepeat', '^^mdVirtualRepeatContainer'],
    restrict: 'A',
    terminal: true,
    transclude: 'element',
    compile: function VirtualRepeatCompile($element, $attrs) {
      var expression = $attrs.mdVirtualRepeat;
      var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)\s*$/);
      var repeatName = match[1];
      var repeatListExpression = $parse(match[2]);
      var extraName = $attrs.mdExtraName && $parse($attrs.mdExtraName);

      return function VirtualRepeatLink($scope, $element, $attrs, ctrl, $transclude) {
        ctrl[0].link_(ctrl[1], $transclude, repeatName, repeatListExpression, extraName);
      };
    }
  };
}
VirtualRepeatDirective.$inject = ["$parse"];


/** @ngInject */
function VirtualRepeatController($scope, $element, $attrs, $browser, $document, $rootScope,
    $$rAF, $mdUtil) {
  this.$scope = $scope;
  this.$element = $element;
  this.$attrs = $attrs;
  this.$browser = $browser;
  this.$document = $document;
  this.$rootScope = $rootScope;
  this.$$rAF = $$rAF;

  /** @type {boolean} Whether we are in on-demand mode. */
  this.onDemand = $mdUtil.parseAttributeBoolean($attrs.mdOnDemand);
  /** @type {!Function} Backup reference to $browser.$$checkUrlChange */
  this.browserCheckUrlChange = $browser.$$checkUrlChange;
  /** @type {number} Most recent starting repeat index (based on scroll offset) */
  this.newStartIndex = 0;
  /** @type {number} Most recent ending repeat index (based on scroll offset) */
  this.newEndIndex = 0;
  /** @type {number} Most recent end visible index (based on scroll offset) */
  this.newVisibleEnd = 0;
  /** @type {number} Previous starting repeat index (based on scroll offset) */
  this.startIndex = 0;
  /** @type {number} Previous ending repeat index (based on scroll offset) */
  this.endIndex = 0;
  // TODO: measure width/height of first element from dom if not provided.
  // getComputedStyle?
  /** @type {?number} Height/width of repeated elements. */
  this.itemSize = $scope.$eval($attrs.mdItemSize) || null;

  /** @type {boolean} Whether this is the first time that items are rendered. */
  this.isFirstRender = true;

  /**
   * @private {boolean} Whether the items in the list are already being updated. Used to prevent
   *     nested calls to virtualRepeatUpdate_.
   */
  this.isVirtualRepeatUpdating_ = false;

  /** @type {number} Most recently seen length of items. */
  this.itemsLength = 0;

  /**
   * @type {!Function} Unwatch callback for item size (when md-items-size is
   *     not specified), or angular.noop otherwise.
   */
  this.unwatchItemSize_ = angular.noop;

  /**
   * Presently rendered blocks by repeat index.
   * @type {Object<number, !VirtualRepeatController.Block}
   */
  this.blocks = {};
  /** @type {Array<!VirtualRepeatController.Block>} A pool of presently unused blocks. */
  this.pooledBlocks = [];

  $scope.$on('$destroy', angular.bind(this, this.cleanupBlocks_));
}
VirtualRepeatController.$inject = ["$scope", "$element", "$attrs", "$browser", "$document", "$rootScope", "$$rAF", "$mdUtil"];


/**
 * An object representing a repeated item.
 * @typedef {{element: !jqLite, new: boolean, scope: !angular.Scope}}
 */
VirtualRepeatController.Block;


/**
 * Called at startup by the md-virtual-repeat postLink function.
 * @param {!VirtualRepeatContainerController} container The container's controller.
 * @param {!Function} transclude The repeated element's bound transclude function.
 * @param {string} repeatName The left hand side of the repeat expression, indicating
 *     the name for each item in the array.
 * @param {!Function} repeatListExpression A compiled expression based on the right hand side
 *     of the repeat expression. Points to the array to repeat over.
 * @param {string|undefined} extraName The optional extra repeatName.
 */
VirtualRepeatController.prototype.link_ =
    function(container, transclude, repeatName, repeatListExpression, extraName) {
  this.container = container;
  this.transclude = transclude;
  this.repeatName = repeatName;
  this.rawRepeatListExpression = repeatListExpression;
  this.extraName = extraName;
  this.sized = false;

  this.repeatListExpression = angular.bind(this, this.repeatListExpression_);

  this.container.register(this);
};


/** @private Cleans up unused blocks. */
VirtualRepeatController.prototype.cleanupBlocks_ = function() {
  angular.forEach(this.pooledBlocks, function cleanupBlock(block) {
    block.element.remove();
  });
};


/** @private Attempts to set itemSize by measuring a repeated element in the dom */
VirtualRepeatController.prototype.readItemSize_ = function() {
  if (this.itemSize) {
    // itemSize was successfully read in a different asynchronous call.
    return;
  }

  this.items = this.repeatListExpression(this.$scope);
  this.parentNode = this.$element[0].parentNode;
  var block = this.getBlock_(0);
  if (!block.element[0].parentNode) {
    this.parentNode.appendChild(block.element[0]);
  }

  this.itemSize = block.element[0][
      this.container.isHorizontal() ? 'offsetWidth' : 'offsetHeight'] || null;

  this.blocks[0] = block;
  this.poolBlock_(0);

  if (this.itemSize) {
    this.containerUpdated();
  }
};


/**
 * Returns the user-specified repeat list, transforming it into an array-like
 * object in the case of infinite scroll/dynamic load mode.
 * @param {!angular.Scope} The scope.
 * @return {!Array|!Object} An array or array-like object for iteration.
 */
VirtualRepeatController.prototype.repeatListExpression_ = function(scope) {
  var repeatList = this.rawRepeatListExpression(scope);

  if (this.onDemand && repeatList) {
    var virtualList = new VirtualRepeatModelArrayLike(repeatList);
    virtualList.$$includeIndexes(this.newStartIndex, this.newVisibleEnd);
    return virtualList;
  } else {
    return repeatList;
  }
};


/**
 * Called by the container. Informs us that the containers scroll or size has
 * changed.
 */
VirtualRepeatController.prototype.containerUpdated = function() {
  // If itemSize is unknown, attempt to measure it.
  if (!this.itemSize) {
    // Make sure to clean up watchers if we can (see #8178)
    if(this.unwatchItemSize_ && this.unwatchItemSize_ !== angular.noop){
      this.unwatchItemSize_();
    }
    this.unwatchItemSize_ = this.$scope.$watchCollection(
        this.repeatListExpression,
        angular.bind(this, function(items) {
          if (items && items.length) {
            this.readItemSize_();
          }
        }));
    if (!this.$rootScope.$$phase) this.$scope.$digest();

    return;
  } else if (!this.sized) {
    this.items = this.repeatListExpression(this.$scope);
  }

  if (!this.sized) {
    this.unwatchItemSize_();
    this.sized = true;
    this.$scope.$watchCollection(this.repeatListExpression,
        angular.bind(this, function(items, oldItems) {
          if (!this.isVirtualRepeatUpdating_) {
            this.virtualRepeatUpdate_(items, oldItems);
          }
        }));
  }

  this.updateIndexes_();

  if (this.newStartIndex !== this.startIndex ||
      this.newEndIndex !== this.endIndex ||
      this.container.getScrollOffset() > this.container.getScrollSize()) {
    if (this.items instanceof VirtualRepeatModelArrayLike) {
      this.items.$$includeIndexes(this.newStartIndex, this.newEndIndex);
    }
    this.virtualRepeatUpdate_(this.items, this.items);
  }
};


/**
 * Called by the container. Returns the size of a single repeated item.
 * @return {?number} Size of a repeated item.
 */
VirtualRepeatController.prototype.getItemSize = function() {
  return this.itemSize;
};


/**
 * Called by the container. Returns the size of a single repeated item.
 * @return {?number} Size of a repeated item.
 */
VirtualRepeatController.prototype.getItemCount = function() {
  return this.itemsLength;
};


/**
 * Updates the order and visible offset of repeated blocks in response to scrolling
 * or items updates.
 * @private
 */
VirtualRepeatController.prototype.virtualRepeatUpdate_ = function(items, oldItems) {
  this.isVirtualRepeatUpdating_ = true;

  var itemsLength = items && items.length || 0;
  var lengthChanged = false;

  // If the number of items shrank
  if (this.items && itemsLength < this.items.length && this.container.getScrollOffset() !== 0) {
    this.items = items;
    var previousScrollOffset = this.container.getScrollOffset();
    this.container.resetScroll();
    this.container.scrollTo(previousScrollOffset);
    return;
  }

  if (itemsLength !== this.itemsLength) {
    lengthChanged = true;
    this.itemsLength = itemsLength;
  }

  this.items = items;
  if (items !== oldItems || lengthChanged) {
    this.updateIndexes_();
  }

  this.parentNode = this.$element[0].parentNode;

  if (lengthChanged) {
    this.container.setScrollSize(itemsLength * this.itemSize);
  }

  if (this.isFirstRender) {
    this.isFirstRender = false;
    var startIndex = this.$attrs.mdStartIndex ?
      this.$scope.$eval(this.$attrs.mdStartIndex) :
      this.container.topIndex;
    this.container.scrollToIndex(startIndex);
  }

  // Detach and pool any blocks that are no longer in the viewport.
  Object.keys(this.blocks).forEach(function(blockIndex) {
    var index = parseInt(blockIndex, 10);
    if (index < this.newStartIndex || index >= this.newEndIndex) {
      this.poolBlock_(index);
    }
  }, this);

  // Add needed blocks.
  // For performance reasons, temporarily block browser url checks as we digest
  // the restored block scopes ($$checkUrlChange reads window.location to
  // check for changes and trigger route change, etc, which we don't need when
  // trying to scroll at 60fps).
  this.$browser.$$checkUrlChange = angular.noop;

  var i, block,
      newStartBlocks = [],
      newEndBlocks = [];

  // Collect blocks at the top.
  for (i = this.newStartIndex; i < this.newEndIndex && this.blocks[i] == null; i++) {
    block = this.getBlock_(i);
    this.updateBlock_(block, i);
    newStartBlocks.push(block);
  }

  // Update blocks that are already rendered.
  for (; this.blocks[i] != null; i++) {
    this.updateBlock_(this.blocks[i], i);
  }
  var maxIndex = i - 1;

  // Collect blocks at the end.
  for (; i < this.newEndIndex; i++) {
    block = this.getBlock_(i);
    this.updateBlock_(block, i);
    newEndBlocks.push(block);
  }

  // Attach collected blocks to the document.
  if (newStartBlocks.length) {
    this.parentNode.insertBefore(
        this.domFragmentFromBlocks_(newStartBlocks),
        this.$element[0].nextSibling);
  }
  if (newEndBlocks.length) {
    this.parentNode.insertBefore(
        this.domFragmentFromBlocks_(newEndBlocks),
        this.blocks[maxIndex] && this.blocks[maxIndex].element[0].nextSibling);
  }

  // Restore $$checkUrlChange.
  this.$browser.$$checkUrlChange = this.browserCheckUrlChange;

  this.startIndex = this.newStartIndex;
  this.endIndex = this.newEndIndex;

  this.isVirtualRepeatUpdating_ = false;
};


/**
 * @param {number} index Where the block is to be in the repeated list.
 * @return {!VirtualRepeatController.Block} A new or pooled block to place at the specified index.
 * @private
 */
VirtualRepeatController.prototype.getBlock_ = function(index) {
  if (this.pooledBlocks.length) {
    return this.pooledBlocks.pop();
  }

  var block;
  this.transclude(angular.bind(this, function(clone, scope) {
    block = {
      element: clone,
      new: true,
      scope: scope
    };

    this.updateScope_(scope, index);
    this.parentNode.appendChild(clone[0]);
  }));

  return block;
};


/**
 * Updates and if not in a digest cycle, digests the specified block's scope to the data
 * at the specified index.
 * @param {!VirtualRepeatController.Block} block The block whose scope should be updated.
 * @param {number} index The index to set.
 * @private
 */
VirtualRepeatController.prototype.updateBlock_ = function(block, index) {
  this.blocks[index] = block;

  if (!block.new &&
      (block.scope.$index === index && block.scope[this.repeatName] === this.items[index])) {
    return;
  }
  block.new = false;

  // Update and digest the block's scope.
  this.updateScope_(block.scope, index);

  // Perform digest before reattaching the block.
  // Any resulting synchronous dom mutations should be much faster as a result.
  // This might break some directives, but I'm going to try it for now.
  if (!this.$rootScope.$$phase) {
    block.scope.$digest();
  }
};


/**
 * Updates scope to the data at the specified index.
 * @param {!angular.Scope} scope The scope which should be updated.
 * @param {number} index The index to set.
 * @private
 */
VirtualRepeatController.prototype.updateScope_ = function(scope, index) {
  scope.$index = index;
  scope[this.repeatName] = this.items && this.items[index];
  if (this.extraName) scope[this.extraName(this.$scope)] = this.items[index];
};


/**
 * Pools the block at the specified index (Pulls its element out of the dom and stores it).
 * @param {number} index The index at which the block to pool is stored.
 * @private
 */
VirtualRepeatController.prototype.poolBlock_ = function(index) {
  this.pooledBlocks.push(this.blocks[index]);
  this.parentNode.removeChild(this.blocks[index].element[0]);
  delete this.blocks[index];
};


/**
 * Produces a dom fragment containing the elements from the list of blocks.
 * @param {!Array<!VirtualRepeatController.Block>} blocks The blocks whose elements
 *     should be added to the document fragment.
 * @return {DocumentFragment}
 * @private
 */
VirtualRepeatController.prototype.domFragmentFromBlocks_ = function(blocks) {
  var fragment = this.$document[0].createDocumentFragment();
  blocks.forEach(function(block) {
    fragment.appendChild(block.element[0]);
  });
  return fragment;
};


/**
 * Updates start and end indexes based on length of repeated items and container size.
 * @private
 */
VirtualRepeatController.prototype.updateIndexes_ = function() {
  var itemsLength = this.items ? this.items.length : 0;
  var containerLength = Math.ceil(this.container.getSize() / this.itemSize);

  this.newStartIndex = Math.max(0, Math.min(
      itemsLength - containerLength,
      Math.floor(this.container.getScrollOffset() / this.itemSize)));
  this.newVisibleEnd = this.newStartIndex + containerLength + NUM_EXTRA;
  this.newEndIndex = Math.min(itemsLength, this.newVisibleEnd);
  this.newStartIndex = Math.max(0, this.newStartIndex - NUM_EXTRA);
};

/**
 * This VirtualRepeatModelArrayLike class enforces the interface requirements
 * for infinite scrolling within a mdVirtualRepeatContainer. An object with this
 * interface must implement the following interface with two (2) methods:
 *
 * getItemAtIndex: function(index) -> item at that index or null if it is not yet
 *     loaded (It should start downloading the item in that case).
 *
 * getLength: function() -> number The data legnth to which the repeater container
 *     should be sized. Ideally, when the count is known, this method should return it.
 *     Otherwise, return a higher number than the currently loaded items to produce an
 *     infinite-scroll behavior.
 *
 * @usage
 * <hljs lang="html">
 *  <md-virtual-repeat-container md-orient-horizontal>
 *    <div md-virtual-repeat="i in items" md-on-demand>
 *      Hello {{i}}!
 *    </div>
 *  </md-virtual-repeat-container>
 * </hljs>
 *
 */
function VirtualRepeatModelArrayLike(model) {
  if (!angular.isFunction(model.getItemAtIndex) ||
      !angular.isFunction(model.getLength)) {
    throw Error('When md-on-demand is enabled, the Object passed to md-virtual-repeat must implement ' +
        'functions getItemAtIndex() and getLength() ');
  }

  this.model = model;
}


VirtualRepeatModelArrayLike.prototype.$$includeIndexes = function(start, end) {
  for (var i = start; i < end; i++) {
    if (!this.hasOwnProperty(i)) {
      this[i] = this.model.getItemAtIndex(i);
    }
  }
  this.length = this.model.getLength();
};


function abstractMethod() {
  throw Error('Non-overridden abstract method called.');
}

})();
(function(){
"use strict";

/**
 * @ngdoc module
 * @name material.components.checkbox
 * @description Checkbox module!
 */
angular
  .module('material.components.checkbox', ['material.core'])
  .directive('mdCheckbox', MdCheckboxDirective);

/**
 * @ngdoc directive
 * @name mdCheckbox
 * @module material.components.checkbox
 * @restrict E
 *
 * @description
 * The checkbox directive is used like the normal [angular checkbox](https://docs.angularjs.org/api/ng/input/input%5Bcheckbox%5D).
 *
 * As per the [material design spec](http://www.google.com/design/spec/style/color.html#color-ui-color-application)
 * the checkbox is in the accent color by default. The primary color palette may be used with
 * the `md-primary` class.
 *
 * @param {string} ng-model Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {expression=} ng-true-value The value to which the expression should be set when selected.
 * @param {expression=} ng-false-value The value to which the expression should be set when not selected.
 * @param {string=} ng-change Angular expression to be executed when input changes due to user interaction with the input element.
 * @param {boolean=} md-no-ink Use of attribute indicates use of ripple ink effects
 * @param {string=} aria-label Adds label to checkbox for accessibility.
 *     Defaults to checkbox's text. If no default text is found, a warning will be logged.
 * @param {expression=} md-indeterminate This determines when the checkbox should be rendered as 'indeterminate'.
 *     If a truthy expression or no value is passed in the checkbox renders in the md-indeterminate state.
 *     If falsy expression is passed in it just looks like a normal unchecked checkbox.
 *     The indeterminate, checked, and unchecked states are mutually exclusive. A box cannot be in any two states at the same time.
 *     Adding the 'md-indeterminate' attribute overrides any checked/unchecked rendering logic.
 *     When using the 'md-indeterminate' attribute use 'ng-checked' to define rendering logic instead of using 'ng-model'.
 * @param {expression=} ng-checked If this expression evaluates as truthy, the 'md-checked' css class is added to the checkbox and it
 *     will appear checked.
 *
 * @usage
 * <hljs lang="html">
 * <md-checkbox ng-model="isChecked" aria-label="Finished?">
 *   Finished ?
 * </md-checkbox>
 *
 * <md-checkbox md-no-ink ng-model="hasInk" aria-label="No Ink Effects">
 *   No Ink Effects
 * </md-checkbox>
 *
 * <md-checkbox ng-disabled="true" ng-model="isDisabled" aria-label="Disabled">
 *   Disabled
 * </md-checkbox>
 *
 * </hljs>
 *
 */
function MdCheckboxDirective(inputDirective, $mdAria, $mdConstant, $mdTheming, $mdUtil, $timeout) {
  inputDirective = inputDirective[0];

  return {
    restrict: 'E',
    transclude: true,
    require: '?ngModel',
    priority: 210, // Run before ngAria
    template:
      '<div class="md-container" md-ink-ripple md-ink-ripple-checkbox>' +
        '<div class="md-icon"></div>' +
      '</div>' +
      '<div ng-transclude class="md-label"></div>',
    compile: compile
  };

  // **********************************************************
  // Private Methods
  // **********************************************************

  function compile (tElement, tAttrs) {
    tAttrs.$set('tabindex', tAttrs.tabindex || '0');
    tAttrs.$set('type', 'checkbox');
    tAttrs.$set('role', tAttrs.type);

    return  {
      pre: function(scope, element) {
        // Attach a click handler during preLink, in order to immediately stop propagation
        // (especially for ng-click) when the checkbox is disabled.
        element.on('click', function(e) {
          if (this.hasAttribute('disabled')) {
            e.stopImmediatePropagation();
          }
        });
      },
      post: postLink
    };

    function postLink(scope, element, attr, ngModelCtrl) {
      var isIndeterminate;
      ngModelCtrl = ngModelCtrl || $mdUtil.fakeNgModel();
      $mdTheming(element);

      // Redirect focus events to the root element, because IE11 is always focusing the container element instead
      // of the md-checkbox element. This causes issues when using ngModelOptions: `updateOnBlur`
      element.children().on('focus', function() {
        element.focus();
      });

      if ($mdUtil.parseAttributeBoolean(attr.mdIndeterminate)) {
        setIndeterminateState();
        scope.$watch(attr.mdIndeterminate, setIndeterminateState);
      }

      if (attr.ngChecked) {
        scope.$watch(
          scope.$eval.bind(scope, attr.ngChecked),
          ngModelCtrl.$setViewValue.bind(ngModelCtrl)
        );
      }

      $$watchExpr('ngDisabled', 'tabindex', {
        true: '-1',
        false: attr.tabindex
      });

      $mdAria.expectWithText(element, 'aria-label');

      // Reuse the original input[type=checkbox] directive from Angular core.
      // This is a bit hacky as we need our own event listener and own render
      // function.
      inputDirective.link.pre(scope, {
        on: angular.noop,
        0: {}
      }, attr, [ngModelCtrl]);

      scope.mouseActive = false;
      element.on('click', listener)
        .on('keypress', keypressHandler)
        .on('mousedown', function() {
          scope.mouseActive = true;
          $timeout(function() {
            scope.mouseActive = false;
          }, 100);
        })
        .on('focus', function() {
          if (scope.mouseActive === false) {
            element.addClass('md-focused');
          }
        })
        .on('blur', function() {
          element.removeClass('md-focused');
        });

      ngModelCtrl.$render = render;

      function $$watchExpr(expr, htmlAttr, valueOpts) {
        if (attr[expr]) {
          scope.$watch(attr[expr], function(val) {
            if (valueOpts[val]) {
              element.attr(htmlAttr, valueOpts[val]);
            }
          });
        }
      }

      function keypressHandler(ev) {
        var keyCode = ev.which || ev.keyCode;
        if (keyCode === $mdConstant.KEY_CODE.SPACE || keyCode === $mdConstant.KEY_CODE.ENTER) {
          ev.preventDefault();
          element.addClass('md-focused');
          listener(ev);
        }
      }

      function listener(ev) {
        // skipToggle boolean is used by the switch directive to prevent the click event
        // when releasing the drag. There will be always a click if releasing the drag over the checkbox
        if (element[0].hasAttribute('disabled') || scope.skipToggle) {
          return;
        }

        scope.$apply(function() {
          // Toggle the checkbox value...
          var viewValue = attr.ngChecked ? attr.checked : !ngModelCtrl.$viewValue;

          ngModelCtrl.$setViewValue(viewValue, ev && ev.type);
          ngModelCtrl.$render();
        });
      }

      function render() {
        // Cast the $viewValue to a boolean since it could be undefined
        element.toggleClass('md-checked', !!ngModelCtrl.$viewValue && !isIndeterminate);
      }

      function setIndeterminateState(newValue) {
        isIndeterminate = newValue !== false;
        if (isIndeterminate) {
          element.attr('aria-checked', 'mixed');
        }
        element.toggleClass('md-indeterminate', isIndeterminate);
      }
    }
  }
}
MdCheckboxDirective.$inject = ["inputDirective", "$mdAria", "$mdConstant", "$mdTheming", "$mdUtil", "$timeout"];

})();
(function(){
"use strict";

/**
 * @ngdoc module
 * @name material.components.list
 * @description
 * List module
 */
angular.module('material.components.list', [
  'material.core'
])
  .controller('MdListController', MdListController)
  .directive('mdList', mdListDirective)
  .directive('mdListItem', mdListItemDirective);

/**
 * @ngdoc directive
 * @name mdList
 * @module material.components.list
 *
 * @restrict E
 *
 * @description
 * The `<md-list>` directive is a list container for 1..n `<md-list-item>` tags.
 *
 * @usage
 * <hljs lang="html">
 * <md-list>
 *   <md-list-item class="md-2-line" ng-repeat="item in todos">
 *     <md-checkbox ng-model="item.done"></md-checkbox>
 *     <div class="md-list-item-text">
 *       <h3>{{item.title}}</h3>
 *       <p>{{item.description}}</p>
 *     </div>
 *   </md-list-item>
 * </md-list>
 * </hljs>
 */

function mdListDirective($mdTheming) {
  return {
    restrict: 'E',
    compile: function(tEl) {
      tEl[0].setAttribute('role', 'list');
      return $mdTheming;
    }
  };
}
mdListDirective.$inject = ["$mdTheming"];
/**
 * @ngdoc directive
 * @name mdListItem
 * @module material.components.list
 *
 * @restrict E
 *
 * @description
 * A `md-list-item` element can be used to represent some information in a row.<br/>
 *
 * @usage
 * ### Single Row Item
 * <hljs lang="html">
 *   <md-list-item>
 *     <span>Single Row Item</span>
 *   </md-list-item>
 * </hljs>
 *
 * ### Multiple Lines
 * By using the following markup, you will be able to have two lines inside of one `md-list-item`.
 *
 * <hljs lang="html">
 *   <md-list-item class="md-2-line">
 *     <div class="md-list-item-text" layout="column">
 *       <p>First Line</p>
 *       <p>Second Line</p>
 *     </div>
 *   </md-list-item>
 * </hljs>
 *
 * It is also possible to have three lines inside of one list item.
 *
 * <hljs lang="html">
 *   <md-list-item class="md-3-line">
 *     <div class="md-list-item-text" layout="column">
 *       <p>First Line</p>
 *       <p>Second Line</p>
 *       <p>Third Line</p>
 *     </div>
 *   </md-list-item>
 * </hljs>
 *
 * ### Secondary Items
 * Secondary items are elements which will be aligned at the end of the `md-list-item`.
 *
 * <hljs lang="html">
 *   <md-list-item>
 *     <span>Single Row Item</span>
 *     <md-button class="md-secondary">
 *       Secondary Button
 *     </md-button>
 *   </md-list-item>
 * </hljs>
 *
 * It also possible to have multiple secondary items inside of one `md-list-item`.
 *
 * <hljs lang="html">
 *   <md-list-item>
 *     <span>Single Row Item</span>
 *     <md-button class="md-secondary">First Button</md-button>
 *     <md-button class="md-secondary">Second Button</md-button>
 *   </md-list-item>
 * </hljs>
 *
 * ### Proxy Item
 * Proxies are elements, which will execute their specific action on click<br/>
 * Currently supported proxy items are
 * - `md-checkbox` (Toggle)
 * - `md-switch` (Toggle)
 * - `md-menu` (Open)
 *
 * This means, when using a supported proxy item inside of `md-list-item`, the list item will
 * become clickable and executes the associated action of the proxy element on click.
 *
 * <hljs lang="html">
 *   <md-list-item>
 *     <span>First Line</span>
 *     <md-checkbox class="md-secondary"></md-checkbox>
 *   </md-list-item>
 * </hljs>
 *
 * The `md-checkbox` element will be automatically detected as a proxy element and will toggle on click.
 *
 * <hljs lang="html">
 *   <md-list-item>
 *     <span>First Line</span>
 *     <md-switch class="md-secondary"></md-switch>
 *   </md-list-item>
 * </hljs>
 *
 * The recognized `md-switch` will toggle its state, when the user clicks on the `md-list-item`.
 *
 * It is also possible to have a `md-menu` inside of a `md-list-item`.
 * <hljs lang="html">
 *   <md-list-item>
 *     <p>Click anywhere to fire the secondary action</p>
 *     <md-menu class="md-secondary">
 *       <md-button class="md-icon-button">
 *         <md-icon md-svg-icon="communication:message"></md-icon>
 *       </md-button>
 *       <md-menu-content width="4">
 *         <md-menu-item>
 *           <md-button>
 *             Redial
 *           </md-button>
 *         </md-menu-item>
 *         <md-menu-item>
 *           <md-button>
 *             Check voicemail
 *           </md-button>
 *         </md-menu-item>
 *         <md-menu-divider></md-menu-divider>
 *         <md-menu-item>
 *           <md-button>
 *             Notifications
 *           </md-button>
 *         </md-menu-item>
 *       </md-menu-content>
 *     </md-menu>
 *   </md-list-item>
 * </hljs>
 *
 * The menu will automatically open, when the users clicks on the `md-list-item`.<br/>
 *
 * If the developer didn't specify any position mode on the menu, the `md-list-item` will automatically detect the
 * position mode and applies it to the `md-menu`.
 *
 * ### Avatars
 * Sometimes you may want to have some avatars inside of the `md-list-item `.<br/>
 * You are able to create a optimized icon for the list item, by applying the `.md-avatar` class on the `<img>` element.
 *
 * <hljs lang="html">
 *   <md-list-item>
 *     <img src="my-avatar.png" class="md-avatar">
 *     <span>Alan Turing</span>
 * </hljs>
 *
 * When using `<md-icon>` for an avater, you have to use the `.md-avatar-icon` class.
 * <hljs lang="html">
 *   <md-list-item>
 *     <md-icon class="md-avatar-icon" md-svg-icon="avatars:timothy"></md-icon>
 *     <span>Timothy Kopra</span>
 *   </md-list-item>
 * </hljs>
 *
 * In cases, you have a `md-list-item`, which doesn't have any avatar,
 * but you want to align it with the other avatar items, you have to use the `.md-offset` class.
 *
 * <hljs lang="html">
 *   <md-list-item class="md-offset">
 *     <span>Jon Doe</span>
 *   </md-list-item>
 * </hljs>
 *
 * ### DOM modification
 * The `md-list-item` component automatically detects if the list item should be clickable.
 *
 * ---
 * If the `md-list-item` is clickable, we wrap all content inside of a `<div>` and create
 * an overlaying button, which will will execute the given actions (like `ng-href`, `ng-click`)
 *
 * We create an overlaying button, instead of wrapping all content inside of the button,
 * because otherwise some elements may not be clickable inside of the button.
 *
 * ---
 * When using a secondary item inside of your list item, the `md-list-item` component will automatically create
 * a secondary container at the end of the `md-list-item`, which contains all secondary items.
 *
 * The secondary item container is not static, because otherwise the overflow will not work properly on the
 * list item.
 *
 */
function mdListItemDirective($mdAria, $mdConstant, $mdUtil, $timeout) {
  var proxiedTypes = ['md-checkbox', 'md-switch', 'md-menu'];
  return {
    restrict: 'E',
    controller: 'MdListController',
    compile: function(tEl, tAttrs) {

      // Check for proxy controls (no ng-click on parent, and a control inside)
      var secondaryItems = tEl[0].querySelectorAll('.md-secondary');
      var hasProxiedElement;
      var proxyElement;
      var itemContainer = tEl;

      tEl[0].setAttribute('role', 'listitem');

      if (tAttrs.ngClick || tAttrs.ngDblclick ||  tAttrs.ngHref || tAttrs.href || tAttrs.uiSref || tAttrs.ngAttrUiSref) {
        wrapIn('button');
      } else {
        for (var i = 0, type; type = proxiedTypes[i]; ++i) {
          if (proxyElement = tEl[0].querySelector(type)) {
            hasProxiedElement = true;
            break;
          }
        }
        if (hasProxiedElement) {
          wrapIn('div');
        } else if (!tEl[0].querySelector('md-button:not(.md-secondary):not(.md-exclude)')) {
          tEl.addClass('md-no-proxy');
        }
      }

      wrapSecondaryItems();
      setupToggleAria();

      if (hasProxiedElement && proxyElement.nodeName === "MD-MENU") {
        setupProxiedMenu();
      }

      function setupToggleAria() {
        var toggleTypes = ['md-switch', 'md-checkbox'];
        var toggle;

        for (var i = 0, toggleType; toggleType = toggleTypes[i]; ++i) {
          if (toggle = tEl.find(toggleType)[0]) {
            if (!toggle.hasAttribute('aria-label')) {
              var p = tEl.find('p')[0];
              if (!p) return;
              toggle.setAttribute('aria-label', 'Toggle ' + p.textContent);
            }
          }
        }
      }

      function setupProxiedMenu() {
        var menuEl = angular.element(proxyElement);

        var isEndAligned = menuEl.parent().hasClass('md-secondary-container') ||
                           proxyElement.parentNode.firstElementChild !== proxyElement;

        var xAxisPosition = 'left';

        if (isEndAligned) {
          // When the proxy item is aligned at the end of the list, we have to set the origin to the end.
          xAxisPosition = 'right';
        }
        
        // Set the position mode / origin of the proxied menu.
        if (!menuEl.attr('md-position-mode')) {
          menuEl.attr('md-position-mode', xAxisPosition + ' target');
        }

        // Apply menu open binding to menu button
        var menuOpenButton = menuEl.children().eq(0);
        if (!hasClickEvent(menuOpenButton[0])) {
          menuOpenButton.attr('ng-click', '$mdOpenMenu($event)');
        }

        if (!menuOpenButton.attr('aria-label')) {
          menuOpenButton.attr('aria-label', 'Open List Menu');
        }
      }

      function wrapIn(type) {
        if (type == 'div') {
          itemContainer = angular.element('<div class="md-no-style md-list-item-inner">');
          itemContainer.append(tEl.contents());
          tEl.addClass('md-proxy-focus');
        } else {
          // Element which holds the default list-item content.
          itemContainer = angular.element(
            '<div class="md-button md-no-style">'+
            '   <div class="md-list-item-inner"></div>'+
            '</div>'
          );

          // Button which shows ripple and executes primary action.
          var buttonWrap = angular.element(
            '<md-button class="md-no-style"></md-button>'
          );

          buttonWrap[0].setAttribute('aria-label', tEl[0].textContent);

          copyAttributes(tEl[0], buttonWrap[0]);

          // We allow developers to specify the `md-no-focus` class, to disable the focus style
          // on the button executor. Once more classes should be forwarded, we should probably make the
          // class forward more generic.
          if (tEl.hasClass('md-no-focus')) {
            buttonWrap.addClass('md-no-focus');
          }

          // Append the button wrap before our list-item content, because it will overlay in relative.
          itemContainer.prepend(buttonWrap);
          itemContainer.children().eq(1).append(tEl.contents());

          tEl.addClass('_md-button-wrap');
        }

        tEl[0].setAttribute('tabindex', '-1');
        tEl.append(itemContainer);
      }

      function wrapSecondaryItems() {
        var secondaryItemsWrapper = angular.element('<div class="md-secondary-container">');

        angular.forEach(secondaryItems, function(secondaryItem) {
          wrapSecondaryItem(secondaryItem, secondaryItemsWrapper);
        });

        itemContainer.append(secondaryItemsWrapper);
      }

      function wrapSecondaryItem(secondaryItem, container) {
        // If the current secondary item is not a button, but contains a ng-click attribute,
        // the secondary item will be automatically wrapped inside of a button.
        if (secondaryItem && !isButton(secondaryItem) && secondaryItem.hasAttribute('ng-click')) {

          $mdAria.expect(secondaryItem, 'aria-label');
          var buttonWrapper = angular.element('<md-button class="md-secondary md-icon-button">');

          // Copy the attributes from the secondary item to the generated button.
          // We also support some additional attributes from the secondary item,
          // because some developers may use a ngIf, ngHide, ngShow on their item.
          copyAttributes(secondaryItem, buttonWrapper[0], ['ng-if', 'ng-hide', 'ng-show']);

          secondaryItem.setAttribute('tabindex', '-1');
          buttonWrapper.append(secondaryItem);

          secondaryItem = buttonWrapper[0];
        }

        if (secondaryItem && (!hasClickEvent(secondaryItem) || (!tAttrs.ngClick && isProxiedElement(secondaryItem)))) {
          // In this case we remove the secondary class, so we can identify it later, when we searching for the
          // proxy items.
          angular.element(secondaryItem).removeClass('md-secondary');
        }

        tEl.addClass('md-with-secondary');
        container.append(secondaryItem);
      }

      /**
       * Copies attributes from a source element to the destination element
       * By default the function will copy the most necessary attributes, supported
       * by the button executor for clickable list items.
       * @param source Element with the specified attributes
       * @param destination Element which will retrieve the attributes
       * @param extraAttrs Additional attributes, which will be copied over.
       */
      function copyAttributes(source, destination, extraAttrs) {
        var copiedAttrs = $mdUtil.prefixer([
          'ng-if', 'ng-click', 'ng-dblclick', 'aria-label', 'ng-disabled', 'ui-sref',
          'href', 'ng-href', 'target', 'ng-attr-ui-sref', 'ui-sref-opts'
        ]);

        if (extraAttrs) {
          copiedAttrs = copiedAttrs.concat($mdUtil.prefixer(extraAttrs));
        }

        angular.forEach(copiedAttrs, function(attr) {
          if (source.hasAttribute(attr)) {
            destination.setAttribute(attr, source.getAttribute(attr));
            source.removeAttribute(attr);
          }
        });
      }

      function isProxiedElement(el) {
        return proxiedTypes.indexOf(el.nodeName.toLowerCase()) != -1;
      }

      function isButton(el) {
        var nodeName = el.nodeName.toUpperCase();

        return nodeName == "MD-BUTTON" || nodeName == "BUTTON";
      }

      function hasClickEvent (element) {
        var attr = element.attributes;
        for (var i = 0; i < attr.length; i++) {
          if (tAttrs.$normalize(attr[i].name) === 'ngClick') return true;
        }
        return false;
      }

      return postLink;

      function postLink($scope, $element, $attr, ctrl) {
        $element.addClass('_md');     // private md component indicator for styling

        var proxies       = [],
            firstElement  = $element[0].firstElementChild,
            isButtonWrap  = $element.hasClass('_md-button-wrap'),
            clickChild    = isButtonWrap ? firstElement.firstElementChild : firstElement,
            hasClick      = clickChild && hasClickEvent(clickChild);

        computeProxies();
        computeClickable();

        if ($element.hasClass('md-proxy-focus') && proxies.length) {
          angular.forEach(proxies, function(proxy) {
            proxy = angular.element(proxy);

            $scope.mouseActive = false;
            proxy.on('mousedown', function() {
              $scope.mouseActive = true;
              $timeout(function(){
                $scope.mouseActive = false;
              }, 100);
            })
            .on('focus', function() {
              if ($scope.mouseActive === false) { $element.addClass('md-focused'); }
              proxy.on('blur', function proxyOnBlur() {
                $element.removeClass('md-focused');
                proxy.off('blur', proxyOnBlur);
              });
            });
          });
        }


        function computeProxies() {
          if (firstElement && firstElement.children && !hasClick) {

            angular.forEach(proxiedTypes, function(type) {

              // All elements which are not capable for being used a proxy have the .md-secondary class
              // applied. These items had been sorted out in the secondary wrap function.
              angular.forEach(firstElement.querySelectorAll(type + ':not(.md-secondary)'), function(child) {
                proxies.push(child);
              });
            });

          }
        }

        function computeClickable() {
          if (proxies.length == 1 || hasClick) {
            $element.addClass('md-clickable');

            if (!hasClick) {
              ctrl.attachRipple($scope, angular.element($element[0].querySelector('.md-no-style')));
            }
          }
        }

        function isEventFromControl(event) {
          var forbiddenControls = ['md-slider'];

          // If there is no path property in the event, then we can assume that the event was not bubbled.
          if (!event.path) {
            return forbiddenControls.indexOf(event.target.tagName.toLowerCase()) !== -1;
          }

          // We iterate the event path up and check for a possible component.
          // Our maximum index to search, is the list item root.
          var maxPath = event.path.indexOf($element.children()[0]);

          for (var i = 0; i < maxPath; i++) {
            if (forbiddenControls.indexOf(event.path[i].tagName.toLowerCase()) !== -1) {
              return true;
            }
          }
        }

        var clickChildKeypressListener = function(e) {
          if (e.target.nodeName != 'INPUT' && e.target.nodeName != 'TEXTAREA' && !e.target.isContentEditable) {
            var keyCode = e.which || e.keyCode;
            if (keyCode == $mdConstant.KEY_CODE.SPACE) {
              if (clickChild) {
                clickChild.click();
                e.preventDefault();
                e.stopPropagation();
              }
            }
          }
        };

        if (!hasClick && !proxies.length) {
          clickChild && clickChild.addEventListener('keypress', clickChildKeypressListener);
        }

        $element.off('click');
        $element.off('keypress');

        if (proxies.length == 1 && clickChild) {
          $element.children().eq(0).on('click', function(e) {
            // When the event is coming from an control and it should not trigger the proxied element
            // then we are skipping.
            if (isEventFromControl(e)) return;

            var parentButton = $mdUtil.getClosest(e.target, 'BUTTON');
            if (!parentButton && clickChild.contains(e.target)) {
              angular.forEach(proxies, function(proxy) {
                if (e.target !== proxy && !proxy.contains(e.target)) {
                  if (proxy.nodeName === 'MD-MENU') {
                    proxy = proxy.children[0];
                  }
                  angular.element(proxy).triggerHandler('click');
                }
              });
            }
          });
        }

        $scope.$on('$destroy', function () {
          clickChild && clickChild.removeEventListener('keypress', clickChildKeypressListener);
        });
      }
    }
  };
}
mdListItemDirective.$inject = ["$mdAria", "$mdConstant", "$mdUtil", "$timeout"];

/*
 * @private
 * @ngdoc controller
 * @name MdListController
 * @module material.components.list
 *
 */
function MdListController($scope, $element, $mdListInkRipple) {
  var ctrl = this;
  ctrl.attachRipple = attachRipple;

  function attachRipple (scope, element) {
    var options = {};
    $mdListInkRipple.attach(scope, element, options);
  }
}
MdListController.$inject = ["$scope", "$element", "$mdListInkRipple"];

})();
(function(){
"use strict";

/*
 * @ngdoc module
 * @name material.components.backdrop
 * @description Backdrop
 */

/**
 * @ngdoc directive
 * @name mdBackdrop
 * @module material.components.backdrop
 *
 * @restrict E
 *
 * @description
 * `<md-backdrop>` is a backdrop element used by other components, such as dialog and bottom sheet.
 * Apply class `opaque` to make the backdrop use the theme backdrop color.
 *
 */

angular
  .module('material.components.backdrop', ['material.core'])
  .directive('mdBackdrop', ["$mdTheming", "$mdUtil", "$animate", "$rootElement", "$window", "$log", "$$rAF", "$document", function BackdropDirective($mdTheming, $mdUtil, $animate, $rootElement, $window, $log, $$rAF, $document) {
    var ERROR_CSS_POSITION = '<md-backdrop> may not work properly in a scrolled, static-positioned parent container.';

    return {
      restrict: 'E',
      link: postLink
    };

    function postLink(scope, element, attrs) {
      // backdrop may be outside the $rootElement, tell ngAnimate to animate regardless
      if ($animate.pin) $animate.pin(element, $rootElement);

      var bodyStyles;

      $$rAF(function() {
        // If body scrolling has been disabled using mdUtil.disableBodyScroll(),
        // adjust the 'backdrop' height to account for the fixed 'body' top offset.
        // Note that this can be pretty expensive and is better done inside the $$rAF.
        bodyStyles = $window.getComputedStyle($document[0].body);

        if (bodyStyles.position === 'fixed') {
          var resizeHandler = $mdUtil.debounce(function(){
            bodyStyles = $window.getComputedStyle($document[0].body);
            resize();
          }, 60, null, false);

          resize();
          angular.element($window).on('resize', resizeHandler);

          scope.$on('$destroy', function() {
            angular.element($window).off('resize', resizeHandler);
          });
        }

        // Often $animate.enter() is used to append the backDrop element
        // so let's wait until $animate is done...
        var parent = element.parent();

        if (parent.length) {
          if (parent[0].nodeName === 'BODY') {
            element.css('position', 'fixed');
          }

          var styles = $window.getComputedStyle(parent[0]);

          if (styles.position === 'static') {
            // backdrop uses position:absolute and will not work properly with parent position:static (default)
            $log.warn(ERROR_CSS_POSITION);
          }

          // Only inherit the parent if the backdrop has a parent.
          $mdTheming.inherit(element, parent);
        }
      });

      function resize() {
        var viewportHeight = parseInt(bodyStyles.height, 10) + Math.abs(parseInt(bodyStyles.top, 10));
        element.css('height', viewportHeight + 'px');
      }
    }

  }]);

})();
(function(){
"use strict";

/**
 * @ngdoc module
 * @name material.components.showHide
 */

// Add additional handlers to ng-show and ng-hide that notify directives
// contained within that they should recompute their size.
// These run in addition to Angular's built-in ng-hide and ng-show directives.
angular.module('material.components.showHide', [
  'material.core'
])
  .directive('ngShow', createDirective('ngShow', true))
  .directive('ngHide', createDirective('ngHide', false));


function createDirective(name, targetValue) {
  return ['$mdUtil', '$window', function($mdUtil, $window) {
    return {
      restrict: 'A',
      multiElement: true,
      link: function($scope, $element, $attr) {
        var unregister = $scope.$on('$md-resize-enable', function() {
          unregister();

          var node = $element[0];
          var cachedTransitionStyles = node.nodeType === $window.Node.ELEMENT_NODE ?
            $window.getComputedStyle(node) : {};

          $scope.$watch($attr[name], function(value) {
            if (!!value === targetValue) {
              $mdUtil.nextTick(function() {
                $scope.$broadcast('$md-resize');
              });

              var opts = {
                cachedTransitionStyles: cachedTransitionStyles
              };

              $mdUtil.dom.animator.waitTransitionEnd($element, opts).then(function() {
                $scope.$broadcast('$md-resize');
              });
            }
          });
        });
      }
    };
  }];
}

})();
(function(){
"use strict";

/**
 * @ngdoc module
 * @name material.components.input
 */
angular.module('material.components.input', [
    'material.core'
  ])
  .directive('mdInputContainer', mdInputContainerDirective)
  .directive('label', labelDirective)
  .directive('input', inputTextareaDirective)
  .directive('textarea', inputTextareaDirective)
  .directive('mdMaxlength', mdMaxlengthDirective)
  .directive('placeholder', placeholderDirective)
  .directive('ngMessages', ngMessagesDirective)
  .directive('ngMessage', ngMessageDirective)
  .directive('ngMessageExp', ngMessageDirective)
  .directive('mdSelectOnFocus', mdSelectOnFocusDirective)

  .animation('.md-input-invalid', mdInputInvalidMessagesAnimation)
  .animation('.md-input-messages-animation', ngMessagesAnimation)
  .animation('.md-input-message-animation', ngMessageAnimation)

  // Register a service for each animation so that we can easily inject them into unit tests
  .service('mdInputInvalidAnimation', mdInputInvalidMessagesAnimation)
  .service('mdInputMessagesAnimation', ngMessagesAnimation)
  .service('mdInputMessageAnimation', ngMessageAnimation);

/**
 * @ngdoc directive
 * @name mdInputContainer
 * @module material.components.input
 *
 * @restrict E
 *
 * @description
 * `<md-input-container>` is the parent of any input or textarea element.
 *
 * Input and textarea elements will not behave properly unless the md-input-container
 * parent is provided.
 *
 * A single `<md-input-container>` should contain only one `<input>` element, otherwise it will throw an error.
 *
 * <b>Exception:</b> Hidden inputs (`<input type="hidden" />`) are ignored and will not throw an error, so
 * you may combine these with other inputs.
 *
 * <b>Note:</b> When using `ngMessages` with your input element, make sure the message and container elements
 * are *block* elements, otherwise animations applied to the messages will not look as intended. Either use a `div` and
 * apply the `ng-message` and `ng-messages` classes respectively, or use the `md-block` class on your element.
 *
 * @param md-is-error {expression=} When the given expression evaluates to true, the input container
 *   will go into error state. Defaults to erroring if the input has been touched and is invalid.
 * @param md-no-float {boolean=} When present, `placeholder` attributes on the input will not be converted to floating
 *   labels.
 *
 * @usage
 * <hljs lang="html">
 *
 * <md-input-container>
 *   <label>Username</label>
 *   <input type="text" ng-model="user.name">
 * </md-input-container>
 *
 * <md-input-container>
 *   <label>Description</label>
 *   <textarea ng-model="user.description"></textarea>
 * </md-input-container>
 *
 * </hljs>
 *
 * <h3>When disabling floating labels</h3>
 * <hljs lang="html">
 *
 * <md-input-container md-no-float>
 *   <input type="text" placeholder="Non-Floating Label">
 * </md-input-container>
 *
 * </hljs>
 */
function mdInputContainerDirective($mdTheming, $parse) {

  var INPUT_TAGS = ['INPUT', 'TEXTAREA', 'SELECT', 'MD-SELECT'];

  var LEFT_SELECTORS = INPUT_TAGS.reduce(function(selectors, isel) {
    return selectors.concat(['md-icon ~ ' + isel, '.md-icon ~ ' + isel]);
  }, []).join(",");

  var RIGHT_SELECTORS = INPUT_TAGS.reduce(function(selectors, isel) {
    return selectors.concat([isel + ' ~ md-icon', isel + ' ~ .md-icon']);
  }, []).join(",");

  ContainerCtrl.$inject = ["$scope", "$element", "$attrs", "$animate"];
  return {
    restrict: 'E',
    link: postLink,
    controller: ContainerCtrl
  };

  function postLink(scope, element) {
    $mdTheming(element);

    // Check for both a left & right icon
    var leftIcon = element[0].querySelector(LEFT_SELECTORS);
    var rightIcon = element[0].querySelector(RIGHT_SELECTORS);

    if (leftIcon) { element.addClass('md-icon-left'); }
    if (rightIcon) { element.addClass('md-icon-right'); }
  }

  function ContainerCtrl($scope, $element, $attrs, $animate) {
    var self = this;

    self.isErrorGetter = $attrs.mdIsError && $parse($attrs.mdIsError);

    self.delegateClick = function() {
      self.input.focus();
    };
    self.element = $element;
    self.setFocused = function(isFocused) {
      $element.toggleClass('md-input-focused', !!isFocused);
    };
    self.setHasValue = function(hasValue) {
      $element.toggleClass('md-input-has-value', !!hasValue);
    };
    self.setHasPlaceholder = function(hasPlaceholder) {
      $element.toggleClass('md-input-has-placeholder', !!hasPlaceholder);
    };
    self.setInvalid = function(isInvalid) {
      if (isInvalid) {
        $animate.addClass($element, 'md-input-invalid');
      } else {
        $animate.removeClass($element, 'md-input-invalid');
      }
    };
    $scope.$watch(function() {
      return self.label && self.input;
    }, function(hasLabelAndInput) {
      if (hasLabelAndInput && !self.label.attr('for')) {
        self.label.attr('for', self.input.attr('id'));
      }
    });
  }
}
mdInputContainerDirective.$inject = ["$mdTheming", "$parse"];

function labelDirective() {
  return {
    restrict: 'E',
    require: '^?mdInputContainer',
    link: function(scope, element, attr, containerCtrl) {
      if (!containerCtrl || attr.mdNoFloat || element.hasClass('md-container-ignore')) return;

      containerCtrl.label = element;
      scope.$on('$destroy', function() {
        containerCtrl.label = null;
      });
    }
  };
}

/**
 * @ngdoc directive
 * @name mdInput
 * @restrict E
 * @module material.components.input
 *
 * @description
 * You can use any `<input>` or `<textarea>` element as a child of an `<md-input-container>`. This
 * allows you to build complex forms for data entry.
 *
 * When the input is required and uses a floating label, then the label will automatically contain
 * an asterisk (`*`).<br/>
 * This behavior can be disabled by using the `md-no-asterisk` attribute.
 *
 * @param {number=} md-maxlength The maximum number of characters allowed in this input. If this is
 *   specified, a character counter will be shown underneath the input.<br/><br/>
 *   The purpose of **`md-maxlength`** is exactly to show the max length counter text. If you don't
 *   want the counter text and only need "plain" validation, you can use the "simple" `ng-maxlength`
 *   or maxlength attributes.<br/><br/>
 *   **Note:** Only valid for text/string inputs (not numeric).
 *
 * @param {string=} aria-label Aria-label is required when no label is present.  A warning message
 *   will be logged in the console if not present.
 * @param {string=} placeholder An alternative approach to using aria-label when the label is not
 *   PRESENT. The placeholder text is copied to the aria-label attribute.
 * @param md-no-autogrow {boolean=} When present, textareas will not grow automatically.
 * @param md-no-asterisk {boolean=} When present, an asterisk will not be appended to the inputs floating label
 * @param md-no-resize {boolean=} Disables the textarea resize handle.
 * @param {number=} max-rows The maximum amount of rows for a textarea.
 * @param md-detect-hidden {boolean=} When present, textareas will be sized properly when they are
 *   revealed after being hidden. This is off by default for performance reasons because it
 *   guarantees a reflow every digest cycle.
 *
 * @usage
 * <hljs lang="html">
 * <md-input-container>
 *   <label>Color</label>
 *   <input type="text" ng-model="color" required md-maxlength="10">
 * </md-input-container>
 * </hljs>
 *
 * <h3>With Errors</h3>
 *
 * `md-input-container` also supports errors using the standard `ng-messages` directives and
 * animates the messages when they become visible using from the `ngEnter`/`ngLeave` events or
 * the `ngShow`/`ngHide` events.
 *
 * By default, the messages will be hidden until the input is in an error state. This is based off
 * of the `md-is-error` expression of the `md-input-container`. This gives the user a chance to
 * fill out the form before the errors become visible.
 *
 * <hljs lang="html">
 * <form name="colorForm">
 *   <md-input-container>
 *     <label>Favorite Color</label>
 *     <input name="favoriteColor" ng-model="favoriteColor" required>
 *     <div ng-messages="colorForm.favoriteColor.$error">
 *       <div ng-message="required">This is required!</div>
 *     </div>
 *   </md-input-container>
 * </form>
 * </hljs>
 *
 * We automatically disable this auto-hiding functionality if you provide any of the following
 * visibility directives on the `ng-messages` container:
 *
 *  - `ng-if`
 *  - `ng-show`/`ng-hide`
 *  - `ng-switch-when`/`ng-switch-default`
 *
 * You can also disable this functionality manually by adding the `md-auto-hide="false"` expression
 * to the `ng-messages` container. This may be helpful if you always want to see the error messages
 * or if you are building your own visibilty directive.
 *
 * _<b>Note:</b> The `md-auto-hide` attribute is a static string that is  only checked upon
 * initialization of the `ng-messages` directive to see if it equals the string `false`._
 *
 * <hljs lang="html">
 * <form name="userForm">
 *   <md-input-container>
 *     <label>Last Name</label>
 *     <input name="lastName" ng-model="lastName" required md-maxlength="10" minlength="4">
 *     <div ng-messages="userForm.lastName.$error" ng-show="userForm.lastName.$dirty">
 *       <div ng-message="required">This is required!</div>
 *       <div ng-message="md-maxlength">That's too long!</div>
 *       <div ng-message="minlength">That's too short!</div>
 *     </div>
 *   </md-input-container>
 *   <md-input-container>
 *     <label>Biography</label>
 *     <textarea name="bio" ng-model="biography" required md-maxlength="150"></textarea>
 *     <div ng-messages="userForm.bio.$error" ng-show="userForm.bio.$dirty">
 *       <div ng-message="required">This is required!</div>
 *       <div ng-message="md-maxlength">That's too long!</div>
 *     </div>
 *   </md-input-container>
 *   <md-input-container>
 *     <input aria-label='title' ng-model='title'>
 *   </md-input-container>
 *   <md-input-container>
 *     <input placeholder='title' ng-model='title'>
 *   </md-input-container>
 * </form>
 * </hljs>
 *
 * <h3>Notes</h3>
 *
 * - Requires [ngMessages](https://docs.angularjs.org/api/ngMessages).
 * - Behaves like the [AngularJS input directive](https://docs.angularjs.org/api/ng/directive/input).
 *
 * The `md-input` and `md-input-container` directives use very specific positioning to achieve the
 * error animation effects. Therefore, it is *not* advised to use the Layout system inside of the
 * `<md-input-container>` tags. Instead, use relative or absolute positioning.
 *
 *
 * <h3>Textarea directive</h3>
 * The `textarea` element within a `md-input-container` has the following specific behavior:
 * - By default the `textarea` grows as the user types. This can be disabled via the `md-no-autogrow`
 * attribute.
 * - If a `textarea` has the `rows` attribute, it will treat the `rows` as the minimum height and will
 * continue growing as the user types. For example a textarea with `rows="3"` will be 3 lines of text
 * high initially. If no rows are specified, the directive defaults to 1.
 * - The textarea's height gets set on initialization, as well as while the user is typing. In certain situations
 * (e.g. while animating) the directive might have been initialized, before the element got it's final height. In
 * those cases, you can trigger a resize manually by broadcasting a `md-resize-textarea` event on the scope.
 * - If you wan't a `textarea` to stop growing at a certain point, you can specify the `max-rows` attribute.
 * - The textarea's bottom border acts as a handle which users can drag, in order to resize the element vertically.
 * Once the user has resized a `textarea`, the autogrowing functionality becomes disabled. If you don't want a
 * `textarea` to be resizeable by the user, you can add the `md-no-resize` attribute.
 */

function inputTextareaDirective($mdUtil, $window, $mdAria, $timeout, $mdGesture) {
  return {
    restrict: 'E',
    require: ['^?mdInputContainer', '?ngModel', '?^form'],
    link: postLink
  };

  function postLink(scope, element, attr, ctrls) {

    var containerCtrl = ctrls[0];
    var hasNgModel = !!ctrls[1];
    var ngModelCtrl = ctrls[1] || $mdUtil.fakeNgModel();
    var parentForm = ctrls[2];
    var isReadonly = angular.isDefined(attr.readonly);
    var mdNoAsterisk = $mdUtil.parseAttributeBoolean(attr.mdNoAsterisk);
    var tagName = element[0].tagName.toLowerCase();


    if (!containerCtrl) return;
    if (attr.type === 'hidden') {
      element.attr('aria-hidden', 'true');
      return;
    } else if (containerCtrl.input) {
      if (containerCtrl.input[0].contains(element[0])) {
        return;
      } else {
        throw new Error("<md-input-container> can only have *one* <input>, <textarea> or <md-select> child element!");
      }
    }
    containerCtrl.input = element;

    setupAttributeWatchers();

    // Add an error spacer div after our input to provide space for the char counter and any ng-messages
    var errorsSpacer = angular.element('<div class="md-errors-spacer">');
    element.after(errorsSpacer);

    if (!containerCtrl.label) {
      $mdAria.expect(element, 'aria-label', attr.placeholder);
    }

    element.addClass('md-input');
    if (!element.attr('id')) {
      element.attr('id', 'input_' + $mdUtil.nextUid());
    }

    // This works around a Webkit issue where number inputs, placed in a flexbox, that have
    // a `min` and `max` will collapse to about 1/3 of their proper width. Please check #7349
    // for more info. Also note that we don't override the `step` if the user has specified it,
    // in order to prevent some unexpected behaviour.
    if (tagName === 'input' && attr.type === 'number' && attr.min && attr.max && !attr.step) {
      element.attr('step', 'any');
    } else if (tagName === 'textarea') {
      setupTextarea();
    }

    // If the input doesn't have an ngModel, it may have a static value. For that case,
    // we have to do one initial check to determine if the container should be in the
    // "has a value" state.
    if (!hasNgModel) {
      inputCheckValue();
    }

    var isErrorGetter = containerCtrl.isErrorGetter || function() {
      return ngModelCtrl.$invalid && (ngModelCtrl.$touched || (parentForm && parentForm.$submitted));
    };

    scope.$watch(isErrorGetter, containerCtrl.setInvalid);

    // When the developer uses the ngValue directive for the input, we have to observe the attribute, because
    // Angular's ngValue directive is just setting the `value` attribute.
    if (attr.ngValue) {
      attr.$observe('value', inputCheckValue);
    }

    ngModelCtrl.$parsers.push(ngModelPipelineCheckValue);
    ngModelCtrl.$formatters.push(ngModelPipelineCheckValue);

    element.on('input', inputCheckValue);

    if (!isReadonly) {
      element
        .on('focus', function(ev) {
          $mdUtil.nextTick(function() {
            containerCtrl.setFocused(true);
          });
        })
        .on('blur', function(ev) {
          $mdUtil.nextTick(function() {
            containerCtrl.setFocused(false);
            inputCheckValue();
          });
        });
    }

    scope.$on('$destroy', function() {
      containerCtrl.setFocused(false);
      containerCtrl.setHasValue(false);
      containerCtrl.input = null;
    });

    /** Gets run through ngModel's pipeline and set the `has-value` class on the container. */
    function ngModelPipelineCheckValue(arg) {
      containerCtrl.setHasValue(!ngModelCtrl.$isEmpty(arg));
      return arg;
    }

    function setupAttributeWatchers() {
      if (containerCtrl.label) {
        attr.$observe('required', function (value) {
          // We don't need to parse the required value, it's always a boolean because of angular's
          // required directive.
          containerCtrl.label.toggleClass('md-required', value && !mdNoAsterisk);
        });
      }
    }

    function inputCheckValue() {
      // An input's value counts if its length > 0,
      // or if the input's validity state says it has bad input (eg string in a number input)
      containerCtrl.setHasValue(element.val().length > 0 || (element[0].validity || {}).badInput);
    }

    function setupTextarea() {
      var isAutogrowing = !attr.hasOwnProperty('mdNoAutogrow');

      attachResizeHandle();

      if (!isAutogrowing) return;

      // Can't check if height was or not explicity set,
      // so rows attribute will take precedence if present
      var minRows = attr.hasOwnProperty('rows') ? parseInt(attr.rows) : NaN;
      var maxRows = attr.hasOwnProperty('maxRows') ? parseInt(attr.maxRows) : NaN;
      var scopeResizeListener = scope.$on('md-resize-textarea', growTextarea);
      var lineHeight = null;
      var node = element[0];

      // This timeout is necessary, because the browser needs a little bit
      // of time to calculate the `clientHeight` and `scrollHeight`.
      $timeout(function() {
        $mdUtil.nextTick(growTextarea);
      }, 10, false);

      // We could leverage ngModel's $parsers here, however it
      // isn't reliable, because Angular trims the input by default,
      // which means that growTextarea won't fire when newlines and
      // spaces are added.
      element.on('input', growTextarea);

      // We should still use the $formatters, because they fire when
      // the value was changed from outside the textarea.
      if (hasNgModel) {
        ngModelCtrl.$formatters.push(formattersListener);
      }

      if (!minRows) {
        element.attr('rows', 1);
      }

      angular.element($window).on('resize', growTextarea);
      scope.$on('$destroy', disableAutogrow);

      function growTextarea() {
        // temporarily disables element's flex so its height 'runs free'
        element
          .attr('rows', 1)
          .css('height', 'auto')
          .addClass('md-no-flex');

        var height = getHeight();

        if (!lineHeight) {
          // offsetHeight includes padding which can throw off our value
          var originalPadding = element[0].style.padding || '';
          lineHeight = element.css('padding', 0).prop('offsetHeight');
          element[0].style.padding = originalPadding;
        }

        if (minRows && lineHeight) {
          height = Math.max(height, lineHeight * minRows);
        }

        if (maxRows && lineHeight) {
          var maxHeight = lineHeight * maxRows;

          if (maxHeight < height) {
            element.attr('md-no-autogrow', '');
            height = maxHeight;
          } else {
            element.removeAttr('md-no-autogrow');
          }
        }

        if (lineHeight) {
          element.attr('rows', Math.round(height / lineHeight));
        }

        element
          .css('height', height + 'px')
          .removeClass('md-no-flex');
      }

      function getHeight() {
        var offsetHeight = node.offsetHeight;
        var line = node.scrollHeight - offsetHeight;
        return offsetHeight + Math.max(line, 0);
      }

      function formattersListener(value) {
        $mdUtil.nextTick(growTextarea);
        return value;
      }

      function disableAutogrow() {
        if (!isAutogrowing) return;

        isAutogrowing = false;
        angular.element($window).off('resize', growTextarea);
        scopeResizeListener && scopeResizeListener();
        element
          .attr('md-no-autogrow', '')
          .off('input', growTextarea);

        if (hasNgModel) {
          var listenerIndex = ngModelCtrl.$formatters.indexOf(formattersListener);

          if (listenerIndex > -1) {
            ngModelCtrl.$formatters.splice(listenerIndex, 1);
          }
        }
      }

      function attachResizeHandle() {
        if (attr.hasOwnProperty('mdNoResize')) return;

        var handle = angular.element('<div class="md-resize-handle"></div>');
        var isDragging = false;
        var dragStart = null;
        var startHeight = 0;
        var container = containerCtrl.element;
        var dragGestureHandler = $mdGesture.register(handle, 'drag', { horizontal: false });

        element.after(handle);
        handle.on('mousedown', onMouseDown);

        container
          .on('$md.dragstart', onDragStart)
          .on('$md.drag', onDrag)
          .on('$md.dragend', onDragEnd);

        scope.$on('$destroy', function() {
          handle
            .off('mousedown', onMouseDown)
            .remove();

          container
            .off('$md.dragstart', onDragStart)
            .off('$md.drag', onDrag)
            .off('$md.dragend', onDragEnd);

          dragGestureHandler();
          handle = null;
          container = null;
          dragGestureHandler = null;
        });

        function onMouseDown(ev) {
          ev.preventDefault();
          isDragging = true;
          dragStart = ev.clientY;
          startHeight = parseFloat(element.css('height')) || element.prop('offsetHeight');
        }

        function onDragStart(ev) {
          if (!isDragging) return;
          ev.preventDefault();
          disableAutogrow();
          container.addClass('md-input-resized');
        }

        function onDrag(ev) {
          if (!isDragging) return;
          element.css('height', startHeight + (ev.pointer.y - dragStart) - $mdUtil.scrollTop() + 'px');
        }

        function onDragEnd(ev) {
          if (!isDragging) return;
          isDragging = false;
          container.removeClass('md-input-resized');
        }
      }

      // Attach a watcher to detect when the textarea gets shown.
      if (attr.hasOwnProperty('mdDetectHidden')) {

        var handleHiddenChange = function() {
          var wasHidden = false;

          return function() {
            var isHidden = node.offsetHeight === 0;

            if (isHidden === false && wasHidden === true) {
              growTextarea();
            }

            wasHidden = isHidden;
          };
        }();

        // Check every digest cycle whether the visibility of the textarea has changed.
        // Queue up to run after the digest cycle is complete.
        scope.$watch(function() {
          $mdUtil.nextTick(handleHiddenChange, false);
          return true;
        });
      }
    }
  }
}
inputTextareaDirective.$inject = ["$mdUtil", "$window", "$mdAria", "$timeout", "$mdGesture"];

function mdMaxlengthDirective($animate, $mdUtil) {
  return {
    restrict: 'A',
    require: ['ngModel', '^mdInputContainer'],
    link: postLink
  };

  function postLink(scope, element, attr, ctrls) {
    var maxlength;
    var ngModelCtrl = ctrls[0];
    var containerCtrl = ctrls[1];
    var charCountEl, errorsSpacer;

    // Wait until the next tick to ensure that the input has setup the errors spacer where we will
    // append our counter
    $mdUtil.nextTick(function() {
      errorsSpacer = angular.element(containerCtrl.element[0].querySelector('.md-errors-spacer'));
      charCountEl = angular.element('<div class="md-char-counter">');

      // Append our character counter inside the errors spacer
      errorsSpacer.append(charCountEl);

      // Stop model from trimming. This makes it so whitespace
      // over the maxlength still counts as invalid.
      attr.$set('ngTrim', 'false');

      ngModelCtrl.$formatters.push(renderCharCount);
      ngModelCtrl.$viewChangeListeners.push(renderCharCount);
      element.on('input keydown keyup', function() {
        renderCharCount(); //make sure it's called with no args
      });

      scope.$watch(attr.mdMaxlength, function(value) {
        maxlength = value;
        if (angular.isNumber(value) && value > 0) {
          if (!charCountEl.parent().length) {
            $animate.enter(charCountEl, errorsSpacer);
          }
          renderCharCount();
        } else {
          $animate.leave(charCountEl);
        }
      });

      ngModelCtrl.$validators['md-maxlength'] = function(modelValue, viewValue) {
        if (!angular.isNumber(maxlength) || maxlength < 0) {
          return true;
        }
        return ( modelValue || element.val() || viewValue || '' ).length <= maxlength;
      };
    });

    function renderCharCount(value) {
      // If we have not been appended to the body yet; do not render
      if (!charCountEl.parent) {
        return value;
      }

      // Force the value into a string since it may be a number,
      // which does not have a length property.
      charCountEl.text(String(element.val() || value || '').length + ' / ' + maxlength);
      return value;
    }
  }
}
mdMaxlengthDirective.$inject = ["$animate", "$mdUtil"];

function placeholderDirective($compile) {
  return {
    restrict: 'A',
    require: '^^?mdInputContainer',
    priority: 200,
    link: {
      // Note that we need to do this in the pre-link, as opposed to the post link, if we want to
      // support data bindings in the placeholder. This is necessary, because we have a case where
      // we transfer the placeholder value to the `<label>` and we remove it from the original `<input>`.
      // If we did this in the post-link, Angular would have set up the observers already and would be
      // re-adding the attribute, even though we removed it from the element.
      pre: preLink
    }
  };

  function preLink(scope, element, attr, inputContainer) {
    // If there is no input container, just return
    if (!inputContainer) return;

    var label = inputContainer.element.find('label');
    var noFloat = inputContainer.element.attr('md-no-float');

    // If we have a label, or they specify the md-no-float attribute, just return
    if ((label && label.length) || noFloat === '' || scope.$eval(noFloat)) {
      // Add a placeholder class so we can target it in the CSS
      inputContainer.setHasPlaceholder(true);
      return;
    }

    // md-select handles placeholders on it's own
    if (element[0].nodeName != 'MD-SELECT') {
      // Move the placeholder expression to the label
      var newLabel = angular.element('<label ng-click="delegateClick()" tabindex="-1">' + attr.placeholder + '</label>');

      // Note that we unset it via `attr`, in order to get Angular
      // to remove any observers that it might have set up. Otherwise
      // the attribute will be added on the next digest.
      attr.$set('placeholder', null);

      // We need to compile the label manually in case it has any bindings.
      // A gotcha here is that we first add the element to the DOM and we compile
      // it later. This is necessary, because if we compile the element beforehand,
      // it won't be able to find the `mdInputContainer` controller.
      inputContainer.element
        .addClass('md-icon-float')
        .prepend(newLabel);

      $compile(newLabel)(scope);
    }
  }
}
placeholderDirective.$inject = ["$compile"];

/**
 * @ngdoc directive
 * @name mdSelectOnFocus
 * @module material.components.input
 *
 * @restrict A
 *
 * @description
 * The `md-select-on-focus` directive allows you to automatically select the element's input text on focus.
 *
 * <h3>Notes</h3>
 * - The use of `md-select-on-focus` is restricted to `<input>` and `<textarea>` elements.
 *
 * @usage
 * <h3>Using with an Input</h3>
 * <hljs lang="html">
 *
 * <md-input-container>
 *   <label>Auto Select</label>
 *   <input type="text" md-select-on-focus>
 * </md-input-container>
 * </hljs>
 *
 * <h3>Using with a Textarea</h3>
 * <hljs lang="html">
 *
 * <md-input-container>
 *   <label>Auto Select</label>
 *   <textarea md-select-on-focus>This text will be selected on focus.</textarea>
 * </md-input-container>
 *
 * </hljs>
 */
function mdSelectOnFocusDirective($timeout) {

  return {
    restrict: 'A',
    link: postLink
  };

  function postLink(scope, element, attr) {
    if (element[0].nodeName !== 'INPUT' && element[0].nodeName !== "TEXTAREA") return;

    var preventMouseUp = false;

    element
      .on('focus', onFocus)
      .on('mouseup', onMouseUp);

    scope.$on('$destroy', function() {
      element
        .off('focus', onFocus)
        .off('mouseup', onMouseUp);
    });

    function onFocus() {
      preventMouseUp = true;

      $timeout(function() {
        // Use HTMLInputElement#select to fix firefox select issues.
        // The debounce is here for Edge's sake, otherwise the selection doesn't work.
        element[0].select();

        // This should be reset from inside the `focus`, because the event might
        // have originated from something different than a click, e.g. a keyboard event.
        preventMouseUp = false;
      }, 1, false);
    }

    // Prevents the default action of the first `mouseup` after a focus.
    // This is necessary, because browsers fire a `mouseup` right after the element
    // has been focused. In some browsers (Firefox in particular) this can clear the
    // selection. There are examples of the problem in issue #7487.
    function onMouseUp(event) {
      if (preventMouseUp) {
        event.preventDefault();
      }
    }
  }
}
mdSelectOnFocusDirective.$inject = ["$timeout"];

var visibilityDirectives = ['ngIf', 'ngShow', 'ngHide', 'ngSwitchWhen', 'ngSwitchDefault'];
function ngMessagesDirective() {
  return {
    restrict: 'EA',
    link: postLink,

    // This is optional because we don't want target *all* ngMessage instances, just those inside of
    // mdInputContainer.
    require: '^^?mdInputContainer'
  };

  function postLink(scope, element, attrs, inputContainer) {
    // If we are not a child of an input container, don't do anything
    if (!inputContainer) return;

    // Add our animation class
    element.toggleClass('md-input-messages-animation', true);

    // Add our md-auto-hide class to automatically hide/show messages when container is invalid
    element.toggleClass('md-auto-hide', true);

    // If we see some known visibility directives, remove the md-auto-hide class
    if (attrs.mdAutoHide == 'false' || hasVisibiltyDirective(attrs)) {
      element.toggleClass('md-auto-hide', false);
    }
  }

  function hasVisibiltyDirective(attrs) {
    return visibilityDirectives.some(function(attr) {
      return attrs[attr];
    });
  }
}

function ngMessageDirective($mdUtil) {
  return {
    restrict: 'EA',
    compile: compile,
    priority: 100
  };

  function compile(tElement) {
    if (!isInsideInputContainer(tElement)) {

      // When the current element is inside of a document fragment, then we need to check for an input-container
      // in the postLink, because the element will be later added to the DOM and is currently just in a temporary
      // fragment, which causes the input-container check to fail.
      if (isInsideFragment()) {
        return function (scope, element) {
          if (isInsideInputContainer(element)) {
            // Inside of the postLink function, a ngMessage directive will be a comment element, because it's
            // currently hidden. To access the shown element, we need to use the element from the compile function.
            initMessageElement(tElement);
          }
        };
      }
    } else {
      initMessageElement(tElement);
    }

    function isInsideFragment() {
      var nextNode = tElement[0];
      while (nextNode = nextNode.parentNode) {
        if (nextNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          return true;
        }
      }
      return false;
    }

    function isInsideInputContainer(element) {
      return !!$mdUtil.getClosest(element, "md-input-container");
    }

    function initMessageElement(element) {
      // Add our animation class
      element.toggleClass('md-input-message-animation', true);
    }
  }
}
ngMessageDirective.$inject = ["$mdUtil"];

var $$AnimateRunner, $animateCss, $mdUtil;

function mdInputInvalidMessagesAnimation($$AnimateRunner, $animateCss, $mdUtil) {
  saveSharedServices($$AnimateRunner, $animateCss, $mdUtil);

  return {
    addClass: function(element, className, done) {
      showInputMessages(element, done);
    }

    // NOTE: We do not need the removeClass method, because the message ng-leave animation will fire
  };
}
mdInputInvalidMessagesAnimation.$inject = ["$$AnimateRunner", "$animateCss", "$mdUtil"];

function ngMessagesAnimation($$AnimateRunner, $animateCss, $mdUtil) {
  saveSharedServices($$AnimateRunner, $animateCss, $mdUtil);

  return {
    enter: function(element, done) {
      showInputMessages(element, done);
    },

    leave: function(element, done) {
      hideInputMessages(element, done);
    },

    addClass: function(element, className, done) {
      if (className == "ng-hide") {
        hideInputMessages(element, done);
      } else {
        done();
      }
    },

    removeClass: function(element, className, done) {
      if (className == "ng-hide") {
        showInputMessages(element, done);
      } else {
        done();
      }
    }
  }
}
ngMessagesAnimation.$inject = ["$$AnimateRunner", "$animateCss", "$mdUtil"];

function ngMessageAnimation($$AnimateRunner, $animateCss, $mdUtil) {
  saveSharedServices($$AnimateRunner, $animateCss, $mdUtil);

  return {
    enter: function(element, done) {
      return showMessage(element);
    },

    leave: function(element, done) {
      return hideMessage(element);
    }
  }
}
ngMessageAnimation.$inject = ["$$AnimateRunner", "$animateCss", "$mdUtil"];

function showInputMessages(element, done) {
  var animators = [], animator;
  var messages = getMessagesElement(element);

  angular.forEach(messages.children(), function(child) {
    animator = showMessage(angular.element(child));

    animators.push(animator.start());
  });

  $$AnimateRunner.all(animators, done);
}

function hideInputMessages(element, done) {
  var animators = [], animator;
  var messages = getMessagesElement(element);

  angular.forEach(messages.children(), function(child) {
    animator = hideMessage(angular.element(child));

    animators.push(animator.start());
  });

  $$AnimateRunner.all(animators, done);
}

function showMessage(element) {
  var height = parseInt(window.getComputedStyle(element[0]).height);
  var topMargin = parseInt(window.getComputedStyle(element[0]).marginTop);

  var messages = getMessagesElement(element);
  var container = getInputElement(element);

  // Check to see if the message is already visible so we can skip
  var alreadyVisible = (topMargin > -height);

  // If we have the md-auto-hide class, the md-input-invalid animation will fire, so we can skip
  if (alreadyVisible || (messages.hasClass('md-auto-hide') && !container.hasClass('md-input-invalid'))) {
    return $animateCss(element, {});
  }

  return $animateCss(element, {
    event: 'enter',
    structural: true,
    from: {"opacity": 0, "margin-top": -height + "px"},
    to: {"opacity": 1, "margin-top": "0"},
    duration: 0.3
  });
}

function hideMessage(element) {
  var height = element[0].offsetHeight;
  var styles = window.getComputedStyle(element[0]);
  //var styles = { opacity: element.css('opacity') };

  // If we are already hidden, just return an empty animation
  if (styles.opacity == 0) {
    return $animateCss(element, {});
  }

  // Otherwise, animate
  return $animateCss(element, {
    event: 'leave',
    structural: true,
    from: {"opacity": 1, "margin-top": 0},
    to: {"opacity": 0, "margin-top": -height + "px"},
    duration: 0.3
  });
}

function getInputElement(element) {
  var inputContainer = element.controller('mdInputContainer');

  return inputContainer.element;
}

function getMessagesElement(element) {
  // If we are a ng-message element, we need to traverse up the DOM tree
  if (element.hasClass('md-input-message-animation')) {
    return angular.element($mdUtil.getClosest(element, function(node) {
      return node.classList.contains('md-input-messages-animation');
    }));
  }

  // Otherwise, we can traverse down
  return angular.element(element[0].querySelector('.md-input-messages-animation'));
}

function saveSharedServices(_$$AnimateRunner_, _$animateCss_, _$mdUtil_) {
  $$AnimateRunner = _$$AnimateRunner_;
  $animateCss = _$animateCss_;
  $mdUtil = _$mdUtil_;
}

})();
(function(){
"use strict";

angular
    .module('material.components.autocomplete')
    .controller('MdAutocompleteCtrl', MdAutocompleteCtrl);

var ITEM_HEIGHT   = 41,
    MAX_HEIGHT    = 5.5 * ITEM_HEIGHT,
    MENU_PADDING  = 8,
    INPUT_PADDING = 2; // Padding provided by `md-input-container`

function MdAutocompleteCtrl ($scope, $element, $mdUtil, $mdConstant, $mdTheming, $window,
                             $animate, $rootElement, $attrs, $q, $log) {

  // Internal Variables.
  var ctrl                 = this,
      itemParts            = $scope.itemsExpr.split(/ in /i),
      itemExpr             = itemParts[ 1 ],
      elements             = null,
      cache                = {},
      noBlur               = false,
      selectedItemWatchers = [],
      hasFocus             = false,
      lastCount            = 0,
      fetchesInProgress    = 0,
      enableWrapScroll     = null,
      inputModelCtrl       = null;

  // Public Exported Variables with handlers
  defineProperty('hidden', handleHiddenChange, true);

  // Public Exported Variables
  ctrl.scope      = $scope;
  ctrl.parent     = $scope.$parent;
  ctrl.itemName   = itemParts[ 0 ];
  ctrl.matches    = [];
  ctrl.loading    = false;
  ctrl.hidden     = true;
  ctrl.index      = null;
  ctrl.messages   = [];
  ctrl.id         = $mdUtil.nextUid();
  ctrl.isDisabled = null;
  ctrl.isRequired = null;
  ctrl.isReadonly = null;
  ctrl.hasNotFound = false;

  // Public Exported Methods
  ctrl.keydown                       = keydown;
  ctrl.blur                          = blur;
  ctrl.focus                         = focus;
  ctrl.clear                         = clearValue;
  ctrl.select                        = select;
  ctrl.listEnter                     = onListEnter;
  ctrl.listLeave                     = onListLeave;
  ctrl.mouseUp                       = onMouseup;
  ctrl.getCurrentDisplayValue        = getCurrentDisplayValue;
  ctrl.registerSelectedItemWatcher   = registerSelectedItemWatcher;
  ctrl.unregisterSelectedItemWatcher = unregisterSelectedItemWatcher;
  ctrl.notFoundVisible               = notFoundVisible;
  ctrl.loadingIsVisible              = loadingIsVisible;
  ctrl.positionDropdown              = positionDropdown;

  return init();

  //-- initialization methods

  /**
   * Initialize the controller, setup watchers, gather elements
   */
  function init () {
    $mdUtil.initOptionalProperties($scope, $attrs, { searchText: '', selectedItem: null });
    $mdTheming($element);
    configureWatchers();
    $mdUtil.nextTick(function () {
      gatherElements();
      moveDropdown();
      focusElement();
      $element.on('focus', focusElement);
    });
  }

  function updateModelValidators() {
    if (!$scope.requireMatch || !inputModelCtrl) return;

    inputModelCtrl.$setValidity('md-require-match', !!$scope.selectedItem);
  }

  /**
   * Calculates the dropdown's position and applies the new styles to the menu element
   * @returns {*}
   */
  function positionDropdown () {
    if (!elements) return $mdUtil.nextTick(positionDropdown, false, $scope);
    var hrect  = elements.wrap.getBoundingClientRect(),
        vrect  = elements.snap.getBoundingClientRect(),
        root   = elements.root.getBoundingClientRect(),
        top    = vrect.bottom - root.top,
        bot    = root.bottom - vrect.top,
        left   = hrect.left - root.left,
        width  = hrect.width,
        offset = getVerticalOffset(),
        styles;
    // Adjust the width to account for the padding provided by `md-input-container`
    if ($attrs.mdFloatingLabel) {
      left += INPUT_PADDING;
      width -= INPUT_PADDING * 2;
    }
    styles = {
      left:     left + 'px',
      minWidth: width + 'px',
      maxWidth: Math.max(hrect.right - root.left, root.right - hrect.left) - MENU_PADDING + 'px'
    };
    if (top > bot && root.height - hrect.bottom - MENU_PADDING < MAX_HEIGHT) {
      styles.top       = 'auto';
      styles.bottom    = bot + 'px';
      styles.maxHeight = Math.min(MAX_HEIGHT, hrect.top - root.top - MENU_PADDING) + 'px';
    } else {
      styles.top       = (top - offset) + 'px';
      styles.bottom    = 'auto';
      styles.maxHeight = Math.min(MAX_HEIGHT, root.bottom + $mdUtil.scrollTop() - hrect.bottom - MENU_PADDING) + 'px';
    }

    elements.$.scrollContainer.css(styles);
    $mdUtil.nextTick(correctHorizontalAlignment, false);

    /**
     * Calculates the vertical offset for floating label examples to account for ngMessages
     * @returns {number}
     */
    function getVerticalOffset () {
      var offset = 0;
      var inputContainer = $element.find('md-input-container');
      if (inputContainer.length) {
        var input = inputContainer.find('input');
        offset = inputContainer.prop('offsetHeight');
        offset -= input.prop('offsetTop');
        offset -= input.prop('offsetHeight');
        // add in the height left up top for the floating label text
        offset += inputContainer.prop('offsetTop');
      }
      return offset;
    }

    /**
     * Makes sure that the menu doesn't go off of the screen on either side.
     */
    function correctHorizontalAlignment () {
      var dropdown = elements.scrollContainer.getBoundingClientRect(),
          styles   = {};
      if (dropdown.right > root.right - MENU_PADDING) {
        styles.left = (hrect.right - dropdown.width) + 'px';
      }
      elements.$.scrollContainer.css(styles);
    }
  }

  /**
   * Moves the dropdown menu to the body tag in order to avoid z-index and overflow issues.
   */
  function moveDropdown () {
    if (!elements.$.root.length) return;
    $mdTheming(elements.$.scrollContainer);
    elements.$.scrollContainer.detach();
    elements.$.root.append(elements.$.scrollContainer);
    if ($animate.pin) $animate.pin(elements.$.scrollContainer, $rootElement);
  }

  /**
   * Sends focus to the input element.
   */
  function focusElement () {
    if ($scope.autofocus) elements.input.focus();
  }

  /**
   * Sets up any watchers used by autocomplete
   */
  function configureWatchers () {
    var wait = parseInt($scope.delay, 10) || 0;
    $attrs.$observe('disabled', function (value) { ctrl.isDisabled = $mdUtil.parseAttributeBoolean(value, false); });
    $attrs.$observe('required', function (value) { ctrl.isRequired = $mdUtil.parseAttributeBoolean(value, false); });
    $attrs.$observe('readonly', function (value) { ctrl.isReadonly = $mdUtil.parseAttributeBoolean(value, false); });
    $scope.$watch('searchText', wait ? $mdUtil.debounce(handleSearchText, wait) : handleSearchText);
    $scope.$watch('selectedItem', selectedItemChange);
    angular.element($window).on('resize', positionDropdown);
    $scope.$on('$destroy', cleanup);
  }

  /**
   * Removes any events or leftover elements created by this controller
   */
  function cleanup () {
    if (!ctrl.hidden) {
      $mdUtil.enableScrolling();
    }

    angular.element($window).off('resize', positionDropdown);
    if ( elements ){
      var items = ['ul', 'scroller', 'scrollContainer', 'input'];
      angular.forEach(items, function(key){
        elements.$[key].remove();
      });
    }
  }

  /**
   * Gathers all of the elements needed for this controller
   */
  function gatherElements () {
    elements = {
      main:  $element[0],
      scrollContainer: $element[0].querySelector('.md-virtual-repeat-container'),
      scroller: $element[0].querySelector('.md-virtual-repeat-scroller'),
      ul:    $element.find('ul')[0],
      input: $element.find('input')[0],
      wrap:  $element.find('md-autocomplete-wrap')[0],
      root:  document.body
    };

    elements.li   = elements.ul.getElementsByTagName('li');
    elements.snap = getSnapTarget();
    elements.$    = getAngularElements(elements);

    inputModelCtrl = elements.$.input.controller('ngModel');
  }

  /**
   * Finds the element that the menu will base its position on
   * @returns {*}
   */
  function getSnapTarget () {
    for (var element = $element; element.length; element = element.parent()) {
      if (angular.isDefined(element.attr('md-autocomplete-snap'))) return element[ 0 ];
    }
    return elements.wrap;
  }

  /**
   * Gathers angular-wrapped versions of each element
   * @param elements
   * @returns {{}}
   */
  function getAngularElements (elements) {
    var obj = {};
    for (var key in elements) {
      if (elements.hasOwnProperty(key)) obj[ key ] = angular.element(elements[ key ]);
    }
    return obj;
  }

  //-- event/change handlers

  /**
   * Handles changes to the `hidden` property.
   * @param hidden
   * @param oldHidden
   */
  function handleHiddenChange (hidden, oldHidden) {
    if (!hidden && oldHidden) {
      positionDropdown();

      if (elements) {
        $mdUtil.nextTick(function () {
          $mdUtil.disableScrollAround(elements.ul);
          enableWrapScroll = disableElementScrollEvents(angular.element(elements.wrap));
        }, false, $scope);
      }
    } else if (hidden && !oldHidden) {
      $mdUtil.nextTick(function () {
        $mdUtil.enableScrolling();

        if (enableWrapScroll) {
          enableWrapScroll();
          enableWrapScroll = null;
        }
      }, false, $scope);
    }
  }

  /**
   * Disables scrolling for a specific element
   */
  function disableElementScrollEvents(element) {

    function preventDefault(e) {
      e.preventDefault();
    }

    element.on('wheel', preventDefault);
    element.on('touchmove', preventDefault);

    return function() {
      element.off('wheel', preventDefault);
      element.off('touchmove', preventDefault);
    };
  }

  /**
   * When the user mouses over the dropdown menu, ignore blur events.
   */
  function onListEnter () {
    noBlur = true;
  }

  /**
   * When the user's mouse leaves the menu, blur events may hide the menu again.
   */
  function onListLeave () {
    if (!hasFocus && !ctrl.hidden) elements.input.focus();
    noBlur = false;
    ctrl.hidden = shouldHide();
  }

  /**
   * When the mouse button is released, send focus back to the input field.
   */
  function onMouseup () {
    elements.input.focus();
  }

  /**
   * Handles changes to the selected item.
   * @param selectedItem
   * @param previousSelectedItem
   */
  function selectedItemChange (selectedItem, previousSelectedItem) {

    updateModelValidators();

    if (selectedItem) {
      getDisplayValue(selectedItem).then(function (val) {
        $scope.searchText = val;
        handleSelectedItemChange(selectedItem, previousSelectedItem);
      });
    } else if (previousSelectedItem && $scope.searchText) {
      getDisplayValue(previousSelectedItem).then(function(displayValue) {
        // Clear the searchText, when the selectedItem is set to null.
        // Do not clear the searchText, when the searchText isn't matching with the previous
        // selected item.
        if (displayValue.toString().toLowerCase() === $scope.searchText.toLowerCase()) {
          $scope.searchText = '';
        }
      });
    }

    if (selectedItem !== previousSelectedItem) announceItemChange();
  }

  /**
   * Use the user-defined expression to announce changes each time a new item is selected
   */
  function announceItemChange () {
    angular.isFunction($scope.itemChange) && $scope.itemChange(getItemAsNameVal($scope.selectedItem));
  }

  /**
   * Use the user-defined expression to announce changes each time the search text is changed
   */
  function announceTextChange () {
    angular.isFunction($scope.textChange) && $scope.textChange();
  }

  /**
   * Calls any external watchers listening for the selected item.  Used in conjunction with
   * `registerSelectedItemWatcher`.
   * @param selectedItem
   * @param previousSelectedItem
   */
  function handleSelectedItemChange (selectedItem, previousSelectedItem) {
    selectedItemWatchers.forEach(function (watcher) { watcher(selectedItem, previousSelectedItem); });
  }

  /**
   * Register a function to be called when the selected item changes.
   * @param cb
   */
  function registerSelectedItemWatcher (cb) {
    if (selectedItemWatchers.indexOf(cb) == -1) {
      selectedItemWatchers.push(cb);
    }
  }

  /**
   * Unregister a function previously registered for selected item changes.
   * @param cb
   */
  function unregisterSelectedItemWatcher (cb) {
    var i = selectedItemWatchers.indexOf(cb);
    if (i != -1) {
      selectedItemWatchers.splice(i, 1);
    }
  }

  /**
   * Handles changes to the searchText property.
   * @param searchText
   * @param previousSearchText
   */
  function handleSearchText (searchText, previousSearchText) {
    ctrl.index = getDefaultIndex();

    // do nothing on init
    if (searchText === previousSearchText) return;

    updateModelValidators();

    getDisplayValue($scope.selectedItem).then(function (val) {
      // clear selected item if search text no longer matches it
      if (searchText !== val) {
        $scope.selectedItem = null;

        // trigger change event if available
        if (searchText !== previousSearchText) announceTextChange();

        // cancel results if search text is not long enough
        if (!isMinLengthMet()) {
          ctrl.matches = [];
          setLoading(false);
          updateMessages();
        } else {
          handleQuery();
        }
      }
    });

  }

  /**
   * Handles input blur event, determines if the dropdown should hide.
   */
  function blur () {
    hasFocus = false;
    if (!noBlur) {
      ctrl.hidden = shouldHide();
    }
  }

  /**
   * Force blur on input element
   * @param forceBlur
   */
  function doBlur(forceBlur) {
    if (forceBlur) {
      noBlur = false;
      hasFocus = false;
    }
    elements.input.blur();
  }

  /**
   * Handles input focus event, determines if the dropdown should show.
   */
  function focus($event) {
    hasFocus = true;
    //-- if searchText is null, let's force it to be a string
    if (!angular.isString($scope.searchText)) $scope.searchText = '';
    ctrl.hidden = shouldHide();
    if (!ctrl.hidden) handleQuery();
  }

  /**
   * Handles keyboard input.
   * @param event
   */
  function keydown (event) {
    switch (event.keyCode) {
      case $mdConstant.KEY_CODE.DOWN_ARROW:
        if (ctrl.loading) return;
        event.stopPropagation();
        event.preventDefault();
        ctrl.index   = Math.min(ctrl.index + 1, ctrl.matches.length - 1);
        updateScroll();
        updateMessages();
        break;
      case $mdConstant.KEY_CODE.UP_ARROW:
        if (ctrl.loading) return;
        event.stopPropagation();
        event.preventDefault();
        ctrl.index   = ctrl.index < 0 ? ctrl.matches.length - 1 : Math.max(0, ctrl.index - 1);
        updateScroll();
        updateMessages();
        break;
      case $mdConstant.KEY_CODE.TAB:
        // If we hit tab, assume that we've left the list so it will close
        onListLeave();

        if (ctrl.hidden || ctrl.loading || ctrl.index < 0 || ctrl.matches.length < 1) return;
        select(ctrl.index);
        break;
      case $mdConstant.KEY_CODE.ENTER:
        if (ctrl.hidden || ctrl.loading || ctrl.index < 0 || ctrl.matches.length < 1) return;
        if (hasSelection()) return;
        event.stopPropagation();
        event.preventDefault();
        select(ctrl.index);
        break;
      case $mdConstant.KEY_CODE.ESCAPE:
        event.preventDefault(); // Prevent browser from always clearing input
        if (!shouldProcessEscape()) return;
        event.stopPropagation();

        clearSelectedItem();
        if ($scope.searchText && hasEscapeOption('clear')) {
          clearSearchText();
        }

        // Manually hide (needed for mdNotFound support)
        ctrl.hidden = true;

        if (hasEscapeOption('blur')) {
          // Force the component to blur if they hit escape
          doBlur(true);
        }

        break;
      default:
    }
  }

  //-- getters

  /**
   * Returns the minimum length needed to display the dropdown.
   * @returns {*}
   */
  function getMinLength () {
    return angular.isNumber($scope.minLength) ? $scope.minLength : 1;
  }

  /**
   * Returns the display value for an item.
   * @param item
   * @returns {*}
   */
  function getDisplayValue (item) {
    return $q.when(getItemText(item) || item).then(function(itemText) {
      if (itemText && !angular.isString(itemText)) {
        $log.warn('md-autocomplete: Could not resolve display value to a string. ' +
          'Please check the `md-item-text` attribute.');
      }

      return itemText;
    });

    /**
     * Getter function to invoke user-defined expression (in the directive)
     * to convert your object to a single string.
     */
    function getItemText (item) {
      return (item && $scope.itemText) ? $scope.itemText(getItemAsNameVal(item)) : null;
    }
  }

  /**
   * Returns the locals object for compiling item templates.
   * @param item
   * @returns {{}}
   */
  function getItemAsNameVal (item) {
    if (!item) return undefined;

    var locals = {};
    if (ctrl.itemName) locals[ ctrl.itemName ] = item;

    return locals;
  }

  /**
   * Returns the default index based on whether or not autoselect is enabled.
   * @returns {number}
   */
  function getDefaultIndex () {
    return $scope.autoselect ? 0 : -1;
  }

  /**
   * Sets the loading parameter and updates the hidden state.
   * @param value {boolean} Whether or not the component is currently loading.
   */
  function setLoading(value) {
    if (ctrl.loading != value) {
      ctrl.loading = value;
    }

    // Always refresh the hidden variable as something else might have changed
    ctrl.hidden = shouldHide();
  }

  /**
   * Determines if the menu should be hidden.
   * @returns {boolean}
   */
  function shouldHide () {
    if (ctrl.loading && !hasMatches()) return true; // Hide while loading initial matches
    else if (hasSelection()) return true;           // Hide if there is already a selection
    else if (!hasFocus) return true;                // Hide if the input does not have focus
    else return !shouldShow();                      // Defer to standard show logic
  }

  /**
   * Determines if the escape keydown should be processed
   * @returns {boolean}
   */
  function shouldProcessEscape() {
    return hasEscapeOption('blur') || !ctrl.hidden || ctrl.loading || hasEscapeOption('clear') && $scope.searchText;
  }

  /**
   * Determines if an escape option is set
   * @returns {boolean}
   */
  function hasEscapeOption(option) {
    return !$scope.escapeOptions || $scope.escapeOptions.toLowerCase().indexOf(option) !== -1;
  }

  /**
   * Determines if the menu should be shown.
   * @returns {boolean}
   */
  function shouldShow() {
    return (isMinLengthMet() && hasMatches()) || notFoundVisible();
  }

  /**
   * Returns true if the search text has matches.
   * @returns {boolean}
   */
  function hasMatches() {
    return ctrl.matches.length ? true : false;
  }

  /**
   * Returns true if the autocomplete has a valid selection.
   * @returns {boolean}
   */
  function hasSelection() {
    return ctrl.scope.selectedItem ? true : false;
  }

  /**
   * Returns true if the loading indicator is, or should be, visible.
   * @returns {boolean}
   */
  function loadingIsVisible() {
    return ctrl.loading && !hasSelection();
  }

  /**
   * Returns the display value of the current item.
   * @returns {*}
   */
  function getCurrentDisplayValue () {
    return getDisplayValue(ctrl.matches[ ctrl.index ]);
  }

  /**
   * Determines if the minimum length is met by the search text.
   * @returns {*}
   */
  function isMinLengthMet () {
    return ($scope.searchText || '').length >= getMinLength();
  }

  //-- actions

  /**
   * Defines a public property with a handler and a default value.
   * @param key
   * @param handler
   * @param value
   */
  function defineProperty (key, handler, value) {
    Object.defineProperty(ctrl, key, {
      get: function () { return value; },
      set: function (newValue) {
        var oldValue = value;
        value        = newValue;
        handler(newValue, oldValue);
      }
    });
  }

  /**
   * Selects the item at the given index.
   * @param index
   */
  function select (index) {
    //-- force form to update state for validation
    $mdUtil.nextTick(function () {
      getDisplayValue(ctrl.matches[ index ]).then(function (val) {
        var ngModel = elements.$.input.controller('ngModel');
        ngModel.$setViewValue(val);
        ngModel.$render();
      }).finally(function () {
        $scope.selectedItem = ctrl.matches[ index ];
        setLoading(false);
      });
    }, false);
  }

  /**
   * Clears the searchText value and selected item.
   */
  function clearValue () {
    clearSelectedItem();
    clearSearchText();
  }

  /**
   * Clears the selected item
   */
  function clearSelectedItem () {
    // Reset our variables
    ctrl.index = 0;
    ctrl.matches = [];
  }

  /**
   * Clears the searchText value
   */
  function clearSearchText () {
    // Set the loading to true so we don't see flashes of content.
    // The flashing will only occur when an async request is running.
    // So the loading process will stop when the results had been retrieved.
    setLoading(true);

    $scope.searchText = '';

    // Normally, triggering the change / input event is unnecessary, because the browser detects it properly.
    // But some browsers are not detecting it properly, which means that we have to trigger the event.
    // Using the `input` is not working properly, because for example IE11 is not supporting the `input` event.
    // The `change` event is a good alternative and is supported by all supported browsers.
    var eventObj = document.createEvent('CustomEvent');
    eventObj.initCustomEvent('change', true, true, { value: '' });
    elements.input.dispatchEvent(eventObj);

    // For some reason, firing the above event resets the value of $scope.searchText if
    // $scope.searchText has a space character at the end, so we blank it one more time and then
    // focus.
    elements.input.blur();
    $scope.searchText = '';
    elements.input.focus();
  }

  /**
   * Fetches the results for the provided search text.
   * @param searchText
   */
  function fetchResults (searchText) {
    var items = $scope.$parent.$eval(itemExpr),
        term  = searchText.toLowerCase(),
        isList = angular.isArray(items),
        isPromise = !!items.then; // Every promise should contain a `then` property

    if (isList) onResultsRetrieved(items);
    else if (isPromise) handleAsyncResults(items);

    function handleAsyncResults(items) {
      if ( !items ) return;

      items = $q.when(items);
      fetchesInProgress++;
      setLoading(true);

      $mdUtil.nextTick(function () {
          items
            .then(onResultsRetrieved)
            .finally(function(){
              if (--fetchesInProgress === 0) {
                setLoading(false);
              }
            });
      },true, $scope);
    }

    function onResultsRetrieved(matches) {
      cache[term] = matches;

      // Just cache the results if the request is now outdated.
      // The request becomes outdated, when the new searchText has changed during the result fetching.
      if ((searchText || '') !== ($scope.searchText || '')) {
        return;
      }

      handleResults(matches);
    }
  }

  /**
   * Updates the ARIA messages
   */
  function updateMessages () {
    getCurrentDisplayValue().then(function (msg) {
      ctrl.messages = [ getCountMessage(), msg ];
    });
  }

  /**
   * Returns the ARIA message for how many results match the current query.
   * @returns {*}
   */
  function getCountMessage () {
    if (lastCount === ctrl.matches.length) return '';
    lastCount = ctrl.matches.length;
    switch (ctrl.matches.length) {
      case 0:
        return 'There are no matches available.';
      case 1:
        return 'There is 1 match available.';
      default:
        return 'There are ' + ctrl.matches.length + ' matches available.';
    }
  }

  /**
   * Makes sure that the focused element is within view.
   */
  function updateScroll () {
    if (!elements.li[0]) return;
    var height = elements.li[0].offsetHeight,
        top = height * ctrl.index,
        bot = top + height,
        hgt = elements.scroller.clientHeight,
        scrollTop = elements.scroller.scrollTop;
    if (top < scrollTop) {
      scrollTo(top);
    } else if (bot > scrollTop + hgt) {
      scrollTo(bot - hgt);
    }
  }

  function isPromiseFetching() {
    return fetchesInProgress !== 0;
  }

  function scrollTo (offset) {
    elements.$.scrollContainer.controller('mdVirtualRepeatContainer').scrollTo(offset);
  }

  function notFoundVisible () {
    var textLength = (ctrl.scope.searchText || '').length;

    return ctrl.hasNotFound && !hasMatches() && (!ctrl.loading || isPromiseFetching()) && textLength >= getMinLength() && (hasFocus || noBlur) && !hasSelection();
  }

  /**
   * Starts the query to gather the results for the current searchText.  Attempts to return cached
   * results first, then forwards the process to `fetchResults` if necessary.
   */
  function handleQuery () {
    var searchText = $scope.searchText || '';
    var term = searchText.toLowerCase();

    // If caching is enabled and the current searchText is stored in the cache
    if (!$scope.noCache && cache[term]) {
      // The results should be handled as same as a normal un-cached request does.
      handleResults(cache[term]);
    } else {
      fetchResults(searchText);
    }

    ctrl.hidden = shouldHide();
  }

  /**
   * Handles the retrieved results by showing them in the autocompletes dropdown.
   * @param results Retrieved results
   */
  function handleResults(results) {
    ctrl.matches = results;
    ctrl.hidden  = shouldHide();

    // If loading is in progress, then we'll end the progress. This is needed for example,
    // when the `clear` button was clicked, because there we always show the loading process, to prevent flashing.
    if (ctrl.loading) setLoading(false);

    if ($scope.selectOnMatch) selectItemOnMatch();

    updateMessages();
    positionDropdown();
  }

  /**
   * If there is only one matching item and the search text matches its display value exactly,
   * automatically select that item.  Note: This function is only called if the user uses the
   * `md-select-on-match` flag.
   */
  function selectItemOnMatch () {
    var searchText = $scope.searchText,
        matches    = ctrl.matches,
        item       = matches[ 0 ];
    if (matches.length === 1) getDisplayValue(item).then(function (displayValue) {
      var isMatching = searchText == displayValue;
      if ($scope.matchInsensitive && !isMatching) {
        isMatching = searchText.toLowerCase() == displayValue.toLowerCase();
      }

      if (isMatching) select(0);
    });
  }

}
MdAutocompleteCtrl.$inject = ["$scope", "$element", "$mdUtil", "$mdConstant", "$mdTheming", "$window", "$animate", "$rootElement", "$attrs", "$q", "$log"];

})();
(function(){
"use strict";

angular
    .module('material.components.autocomplete')
    .directive('mdAutocomplete', MdAutocomplete);

/**
 * @ngdoc directive
 * @name mdAutocomplete
 * @module material.components.autocomplete
 *
 * @description
 * `<md-autocomplete>` is a special input component with a drop-down of all possible matches to a
 *     custom query. This component allows you to provide real-time suggestions as the user types
 *     in the input area.
 *
 * To start, you will need to specify the required parameters and provide a template for your
 *     results. The content inside `md-autocomplete` will be treated as a template.
 *
 * In more complex cases, you may want to include other content such as a message to display when
 *     no matches were found.  You can do this by wrapping your template in `md-item-template` and
 *     adding a tag for `md-not-found`.  An example of this is shown below.
 *
 * To reset the displayed value you must clear both values for `md-search-text` and `md-selected-item`.
 *
 * ### Validation
 *
 * You can use `ng-messages` to include validation the same way that you would normally validate;
 *     however, if you want to replicate a standard input with a floating label, you will have to
 *     do the following:
 *
 * - Make sure that your template is wrapped in `md-item-template`
 * - Add your `ng-messages` code inside of `md-autocomplete`
 * - Add your validation properties to `md-autocomplete` (ie. `required`)
 * - Add a `name` to `md-autocomplete` (to be used on the generated `input`)
 *
 * There is an example below of how this should look.
 *
 * ### Notes
 * The `md-autocomplete` uses the the [VirtualRepeat](/api/directive/mdVirtualRepeatContainer)
 * directive for displaying the results inside of the dropdown.<br/>
 * > When encountering issues regarding the item template please take a look at the
 *   [VirtualRepeatContainer](/api/directive/mdVirtualRepeatContainer) documentation.
 *
 *
 * @param {expression} md-items An expression in the format of `item in items` to iterate over
 *     matches for your search.
 * @param {expression=} md-selected-item-change An expression to be run each time a new item is
 *     selected
 * @param {expression=} md-search-text-change An expression to be run each time the search text
 *     updates
 * @param {expression=} md-search-text A model to bind the search query text to
 * @param {object=} md-selected-item A model to bind the selected item to
 * @param {expression=} md-item-text An expression that will convert your object to a single string.
 * @param {string=} placeholder Placeholder text that will be forwarded to the input.
 * @param {boolean=} md-no-cache Disables the internal caching that happens in autocomplete
 * @param {boolean=} ng-disabled Determines whether or not to disable the input field
 * @param {boolean=} md-require-match When set to true, the autocomplete will add a validator,
 *     which will evaluate to false, when no item is currently selected.
 * @param {number=} md-min-length Specifies the minimum length of text before autocomplete will
 *     make suggestions
 * @param {number=} md-delay Specifies the amount of time (in milliseconds) to wait before looking
 *     for results
 * @param {boolean=} md-autofocus If true, the autocomplete will be automatically focused when a `$mdDialog`,
 *     `$mdBottomsheet` or `$mdSidenav`, which contains the autocomplete, is opening. <br/><br/>
 *     Also the autocomplete will immediately focus the input element.
 * @param {boolean=} md-no-asterisk When present, asterisk will not be appended to the floating label
 * @param {boolean=} md-autoselect If set to true, the first item will be automatically selected
 *     in the dropdown upon open.
 * @param {string=} md-menu-class This will be applied to the dropdown menu for styling
 * @param {string=} md-floating-label This will add a floating label to autocomplete and wrap it in
 *     `md-input-container`
 * @param {string=} md-input-name The name attribute given to the input element to be used with
 *     FormController
 * @param {string=} md-select-on-focus When present the inputs text will be automatically selected
 *     on focus.
 * @param {string=} md-input-id An ID to be added to the input element
 * @param {number=} md-input-minlength The minimum length for the input's value for validation
 * @param {number=} md-input-maxlength The maximum length for the input's value for validation
 * @param {boolean=} md-select-on-match When set, autocomplete will automatically select exact
 *     the item if the search text is an exact match. <br/><br/>
 *     Exact match means that there is only one match showing up.
 * @param {boolean=} md-match-case-insensitive When set and using `md-select-on-match`, autocomplete
 *     will select on case-insensitive match
 * @param {string=} md-escape-options Override escape key logic. Default is `blur clear`.<br/>
 *     Options: `blur | clear`, `none`
 *
 * @usage
 * ### Basic Example
 * <hljs lang="html">
 *   <md-autocomplete
 *       md-selected-item="selectedItem"
 *       md-search-text="searchText"
 *       md-items="item in getMatches(searchText)"
 *       md-item-text="item.display">
 *     <span md-highlight-text="searchText">{{item.display}}</span>
 *   </md-autocomplete>
 * </hljs>
 *
 * ### Example with "not found" message
 * <hljs lang="html">
 * <md-autocomplete
 *     md-selected-item="selectedItem"
 *     md-search-text="searchText"
 *     md-items="item in getMatches(searchText)"
 *     md-item-text="item.display">
 *   <md-item-template>
 *     <span md-highlight-text="searchText">{{item.display}}</span>
 *   </md-item-template>
 *   <md-not-found>
 *     No matches found.
 *   </md-not-found>
 * </md-autocomplete>
 * </hljs>
 *
 * In this example, our code utilizes `md-item-template` and `md-not-found` to specify the
 *     different parts that make up our component.
 *
 * ### Example with validation
 * <hljs lang="html">
 * <form name="autocompleteForm">
 *   <md-autocomplete
 *       required
 *       md-input-name="autocomplete"
 *       md-selected-item="selectedItem"
 *       md-search-text="searchText"
 *       md-items="item in getMatches(searchText)"
 *       md-item-text="item.display">
 *     <md-item-template>
 *       <span md-highlight-text="searchText">{{item.display}}</span>
 *     </md-item-template>
 *     <div ng-messages="autocompleteForm.autocomplete.$error">
 *       <div ng-message="required">This field is required</div>
 *     </div>
 *   </md-autocomplete>
 * </form>
 * </hljs>
 *
 * In this example, our code utilizes `md-item-template` and `ng-messages` to specify
 *     input validation for the field.
 */

function MdAutocomplete ($$mdSvgRegistry) {

  return {
    controller:   'MdAutocompleteCtrl',
    controllerAs: '$mdAutocompleteCtrl',
    scope:        {
      inputName:        '@mdInputName',
      inputMinlength:   '@mdInputMinlength',
      inputMaxlength:   '@mdInputMaxlength',
      searchText:       '=?mdSearchText',
      selectedItem:     '=?mdSelectedItem',
      itemsExpr:        '@mdItems',
      itemText:         '&mdItemText',
      placeholder:      '@placeholder',
      noCache:          '=?mdNoCache',
      requireMatch:     '=?mdRequireMatch',
      selectOnMatch:    '=?mdSelectOnMatch',
      matchInsensitive: '=?mdMatchCaseInsensitive',
      itemChange:       '&?mdSelectedItemChange',
      textChange:       '&?mdSearchTextChange',
      minLength:        '=?mdMinLength',
      delay:            '=?mdDelay',
      autofocus:        '=?mdAutofocus',
      floatingLabel:    '@?mdFloatingLabel',
      autoselect:       '=?mdAutoselect',
      menuClass:        '@?mdMenuClass',
      inputId:          '@?mdInputId',
      escapeOptions:    '@?mdEscapeOptions'
    },
    link: function(scope, element, attrs, controller) {
      // Retrieve the state of using a md-not-found template by using our attribute, which will
      // be added to the element in the template function.
      controller.hasNotFound = !!element.attr('md-has-not-found');
    },
    template:     function (element, attr) {
      var noItemsTemplate = getNoItemsTemplate(),
          itemTemplate    = getItemTemplate(),
          leftover        = element.html(),
          tabindex        = attr.tabindex;

      // Set our attribute for the link function above which runs later.
      // We will set an attribute, because otherwise the stored variables will be trashed when
      // removing the element is hidden while retrieving the template. For example when using ngIf.
      if (noItemsTemplate) element.attr('md-has-not-found', true);

      // Always set our tabindex of the autocomplete directive to -1, because our input
      // will hold the actual tabindex.
      element.attr('tabindex', '-1');

      return '\
        <md-autocomplete-wrap\
            ng-class="{ \'md-whiteframe-z1\': !floatingLabel, \'md-menu-showing\': !$mdAutocompleteCtrl.hidden }">\
          ' + getInputElement() + '\
          <md-progress-linear\
              class="' + (attr.mdFloatingLabel ? 'md-inline' : '') + '"\
              ng-if="$mdAutocompleteCtrl.loadingIsVisible()"\
              md-mode="indeterminate"></md-progress-linear>\
          <md-virtual-repeat-container\
              md-auto-shrink\
              md-auto-shrink-min="1"\
              ng-mouseenter="$mdAutocompleteCtrl.listEnter()"\
              ng-mouseleave="$mdAutocompleteCtrl.listLeave()"\
              ng-mouseup="$mdAutocompleteCtrl.mouseUp()"\
              ng-hide="$mdAutocompleteCtrl.hidden"\
              class="md-autocomplete-suggestions-container md-whiteframe-z1"\
              ng-class="{ \'md-not-found\': $mdAutocompleteCtrl.notFoundVisible() }"\
              role="presentation">\
            <ul class="md-autocomplete-suggestions"\
                ng-class="::menuClass"\
                id="ul-{{$mdAutocompleteCtrl.id}}">\
              <li md-virtual-repeat="item in $mdAutocompleteCtrl.matches"\
                  ng-class="{ selected: $index === $mdAutocompleteCtrl.index }"\
                  ng-click="$mdAutocompleteCtrl.select($index)"\
                  md-extra-name="$mdAutocompleteCtrl.itemName">\
                  ' + itemTemplate + '\
                  </li>' + noItemsTemplate + '\
            </ul>\
          </md-virtual-repeat-container>\
        </md-autocomplete-wrap>\
        <aria-status\
            class="md-visually-hidden"\
            role="status"\
            aria-live="assertive">\
          <p ng-repeat="message in $mdAutocompleteCtrl.messages track by $index" ng-if="message">{{message}}</p>\
        </aria-status>';

      function getItemTemplate() {
        var templateTag = element.find('md-item-template').detach(),
            html = templateTag.length ? templateTag.html() : element.html();
        if (!templateTag.length) element.empty();
        return '<md-autocomplete-parent-scope md-autocomplete-replace>' + html + '</md-autocomplete-parent-scope>';
      }

      function getNoItemsTemplate() {
        var templateTag = element.find('md-not-found').detach(),
            template = templateTag.length ? templateTag.html() : '';
        return template
            ? '<li ng-if="$mdAutocompleteCtrl.notFoundVisible()"\
                         md-autocomplete-parent-scope>' + template + '</li>'
            : '';

      }

      function getInputElement () {
        if (attr.mdFloatingLabel) {
          return '\
            <md-input-container ng-if="floatingLabel">\
              <label>{{floatingLabel}}</label>\
              <input type="search"\
                  ' + (tabindex != null ? 'tabindex="' + tabindex + '"' : '') + '\
                  id="{{ inputId || \'fl-input-\' + $mdAutocompleteCtrl.id }}"\
                  name="{{inputName}}"\
                  autocomplete="off"\
                  ng-required="$mdAutocompleteCtrl.isRequired"\
                  ng-readonly="$mdAutocompleteCtrl.isReadonly"\
                  ng-minlength="inputMinlength"\
                  ng-maxlength="inputMaxlength"\
                  ng-disabled="$mdAutocompleteCtrl.isDisabled"\
                  ng-model="$mdAutocompleteCtrl.scope.searchText"\
                  ng-model-options="{ allowInvalid: true }"\
                  ng-keydown="$mdAutocompleteCtrl.keydown($event)"\
                  ng-blur="$mdAutocompleteCtrl.blur()"\
                  ' + (attr.mdNoAsterisk != null ? 'md-no-asterisk="' + attr.mdNoAsterisk + '"' : '') + '\
                  ng-focus="$mdAutocompleteCtrl.focus($event)"\
                  aria-owns="ul-{{$mdAutocompleteCtrl.id}}"\
                  ' + (attr.mdSelectOnFocus != null ? 'md-select-on-focus=""' : '') + '\
                  aria-label="{{floatingLabel}}"\
                  aria-autocomplete="list"\
                  role="combobox"\
                  aria-haspopup="true"\
                  aria-activedescendant=""\
                  aria-expanded="{{!$mdAutocompleteCtrl.hidden}}"/>\
              <div md-autocomplete-parent-scope md-autocomplete-replace>' + leftover + '</div>\
            </md-input-container>';
        } else {
          return '\
            <input type="search"\
                ' + (tabindex != null ? 'tabindex="' + tabindex + '"' : '') + '\
                id="{{ inputId || \'input-\' + $mdAutocompleteCtrl.id }}"\
                name="{{inputName}}"\
                ng-if="!floatingLabel"\
                autocomplete="off"\
                ng-required="$mdAutocompleteCtrl.isRequired"\
                ng-disabled="$mdAutocompleteCtrl.isDisabled"\
                ng-readonly="$mdAutocompleteCtrl.isReadonly"\
                ng-model="$mdAutocompleteCtrl.scope.searchText"\
                ng-keydown="$mdAutocompleteCtrl.keydown($event)"\
                ng-blur="$mdAutocompleteCtrl.blur()"\
                ng-focus="$mdAutocompleteCtrl.focus($event)"\
                placeholder="{{placeholder}}"\
                aria-owns="ul-{{$mdAutocompleteCtrl.id}}"\
                ' + (attr.mdSelectOnFocus != null ? 'md-select-on-focus=""' : '') + '\
                aria-label="{{placeholder}}"\
                aria-autocomplete="list"\
                role="combobox"\
                aria-haspopup="true"\
                aria-activedescendant=""\
                aria-expanded="{{!$mdAutocompleteCtrl.hidden}}"/>\
            <button\
                type="button"\
                tabindex="-1"\
                ng-if="$mdAutocompleteCtrl.scope.searchText && !$mdAutocompleteCtrl.isDisabled"\
                ng-click="$mdAutocompleteCtrl.clear($event)">\
              <md-icon md-svg-src="' + $$mdSvgRegistry.mdClose + '"></md-icon>\
              <span class="md-visually-hidden">Clear</span>\
            </button>\
                ';
        }
      }
    }
  };
}
MdAutocomplete.$inject = ["$$mdSvgRegistry"];

})();
(function(){
"use strict";

angular
  .module('material.components.autocomplete')
  .directive('mdAutocompleteParentScope', MdAutocompleteItemScopeDirective);

function MdAutocompleteItemScopeDirective($compile, $mdUtil) {
  return {
    restrict: 'AE',
    compile: compile,
    terminal: true,
    transclude: 'element'
  };

  function compile(tElement, tAttr, transclude) {
    return function postLink(scope, element, attr) {
      var ctrl = scope.$mdAutocompleteCtrl;
      var newScope = ctrl.parent.$new();
      var itemName = ctrl.itemName;

      // Watch for changes to our scope's variables and copy them to the new scope
      watchVariable('$index', '$index');
      watchVariable('item', itemName);

      // Ensure that $digest calls on our scope trigger $digest on newScope.
      connectScopes();

      // Link the element against newScope.
      transclude(newScope, function(clone) {
        element.after(clone);
      });

      /**
       * Creates a watcher for variables that are copied from the parent scope
       * @param variable
       * @param alias
       */
      function watchVariable(variable, alias) {
        newScope[alias] = scope[variable];

        scope.$watch(variable, function(value) {
          $mdUtil.nextTick(function() {
            newScope[alias] = value;
          });
        });
      }

      /**
       * Creates watchers on scope and newScope that ensure that for any
       * $digest of scope, newScope is also $digested.
       */
      function connectScopes() {
        var scopeDigesting = false;
        var newScopeDigesting = false;

        scope.$watch(function() {
          if (newScopeDigesting || scopeDigesting) {
            return;
          }

          scopeDigesting = true;
          scope.$$postDigest(function() {
            if (!newScopeDigesting) {
              newScope.$digest();
            }

            scopeDigesting = newScopeDigesting = false;
          });
        });

        newScope.$watch(function() {
          newScopeDigesting = true;
        });
      }
    };
  }
}
MdAutocompleteItemScopeDirective.$inject = ["$compile", "$mdUtil"];
})();
(function(){
"use strict";

angular
    .module('material.components.autocomplete')
    .controller('MdHighlightCtrl', MdHighlightCtrl);

function MdHighlightCtrl ($scope, $element, $attrs) {
  this.init = init;

  function init (termExpr, unsafeTextExpr) {
    var text = null,
        regex = null,
        flags = $attrs.mdHighlightFlags || '',
        watcher = $scope.$watch(function($scope) {
          return {
            term: termExpr($scope),
            unsafeText: unsafeTextExpr($scope)
          };
        }, function (state, prevState) {
          if (text === null || state.unsafeText !== prevState.unsafeText) {
            text = angular.element('<div>').text(state.unsafeText).html();
          }
          if (regex === null || state.term !== prevState.term) {
            regex = getRegExp(state.term, flags);
          }

          $element.html(text.replace(regex, '<span class="highlight">$&</span>'));
        }, true);
    $element.on('$destroy', watcher);
  }

  function sanitize (term) {
    return term && term.toString().replace(/[\\\^\$\*\+\?\.\(\)\|\{}\[\]]/g, '\\$&');
  }

  function getRegExp (text, flags) {
    var startFlag = '', endFlag = '';
    if (flags.indexOf('^') >= 0) startFlag = '^';
    if (flags.indexOf('$') >= 0) endFlag = '$';
    return new RegExp(startFlag + sanitize(text) + endFlag, flags.replace(/[\$\^]/g, ''));
  }
}
MdHighlightCtrl.$inject = ["$scope", "$element", "$attrs"];

})();
(function(){
"use strict";

angular
    .module('material.components.autocomplete')
    .directive('mdHighlightText', MdHighlight);

/**
 * @ngdoc directive
 * @name mdHighlightText
 * @module material.components.autocomplete
 *
 * @description
 * The `md-highlight-text` directive allows you to specify text that should be highlighted within
 *     an element.  Highlighted text will be wrapped in `<span class="highlight"></span>` which can
 *     be styled through CSS.  Please note that child elements may not be used with this directive.
 *
 * @param {string} md-highlight-text A model to be searched for
 * @param {string=} md-highlight-flags A list of flags (loosely based on JavaScript RexExp flags).
 * #### **Supported flags**:
 * - `g`: Find all matches within the provided text
 * - `i`: Ignore case when searching for matches
 * - `$`: Only match if the text ends with the search term
 * - `^`: Only match if the text begins with the search term
 *
 * @usage
 * <hljs lang="html">
 * <input placeholder="Enter a search term..." ng-model="searchTerm" type="text" />
 * <ul>
 *   <li ng-repeat="result in results" md-highlight-text="searchTerm">
 *     {{result.text}}
 *   </li>
 * </ul>
 * </hljs>
 */

function MdHighlight ($interpolate, $parse) {
  return {
    terminal: true,
    controller: 'MdHighlightCtrl',
    compile: function mdHighlightCompile(tElement, tAttr) {
      var termExpr = $parse(tAttr.mdHighlightText);
      var unsafeTextExpr = $interpolate(tElement.html());

      return function mdHighlightLink(scope, element, attr, ctrl) {
        ctrl.init(termExpr, unsafeTextExpr);
      };
    }
  };
}
MdHighlight.$inject = ["$interpolate", "$parse"];

})();
(function(){
"use strict";

angular
  .module('material.components.icon')
  .directive('mdIcon', ['$mdIcon', '$mdTheming', '$mdAria', '$sce', mdIconDirective]);

/**
 * @ngdoc directive
 * @name mdIcon
 * @module material.components.icon
 *
 * @restrict E
 *
 * @description
 * The `md-icon` directive makes it easier to use vector-based icons in your app (as opposed to
 * raster-based icons types like PNG). The directive supports both icon fonts and SVG icons.
 *
 * Icons should be consider view-only elements that should not be used directly as buttons; instead nest a `<md-icon>`
 * inside a `md-button` to add hover and click features.
 *
 * ### Icon fonts
 * Icon fonts are a technique in which you use a font where the glyphs in the font are
 * your icons instead of text. Benefits include a straightforward way to bundle everything into a
 * single HTTP request, simple scaling, easy color changing, and more.
 *
 * `md-icon` lets you consume an icon font by letting you reference specific icons in that font
 * by name rather than character code.
 *
 * ### SVG
 * For SVGs, the problem with using `<img>` or a CSS `background-image` is that you can't take
 * advantage of some SVG features, such as styling specific parts of the icon with CSS or SVG
 * animation.
 *
 * `md-icon` makes it easier to use SVG icons by *inlining* the SVG into an `<svg>` element in the
 * document. The most straightforward way of referencing an SVG icon is via URL, just like a
 * traditional `<img>`. `$mdIconProvider`, as a convenience, lets you _name_ an icon so you can
 * reference it by name instead of URL throughout your templates.
 *
 * Additionally, you may not want to make separate HTTP requests for every icon, so you can bundle
 * your SVG icons together and pre-load them with $mdIconProvider as an icon set. An icon set can
 * also be given a name, which acts as a namespace for individual icons, so you can reference them
 * like `"social:cake"`.
 *
 * When using SVGs, both external SVGs (via URLs) or sets of SVGs [from icon sets] can be
 * easily loaded and used.When use font-icons, developers must following three (3) simple steps:
 *
 * <ol>
 * <li>Load the font library. e.g.<br/>
 *    `<link href="https://fonts.googleapis.com/icon?family=Material+Icons"
 *    rel="stylesheet">`
 * </li>
 * <li>
 *   Use either (a) font-icon class names or (b) font ligatures to render the font glyph by using
 *   its textual name
 * </li>
 * <li>
 *   Use `<md-icon md-font-icon="classname" />` or <br/>
 *   use `<md-icon md-font-set="font library classname or alias"> textual_name </md-icon>` or <br/>
 *   use `<md-icon md-font-set="font library classname or alias"> numerical_character_reference </md-icon>`
 * </li>
 * </ol>
 *
 * Full details for these steps can be found:
 *
 * <ul>
 * <li>http://google.github.io/material-design-icons/</li>
 * <li>http://google.github.io/material-design-icons/#icon-font-for-the-web</li>
 * </ul>
 *
 * The Material Design icon style <code>.material-icons</code> and the icon font references are published in
 * Material Design Icons:
 *
 * <ul>
 * <li>http://www.google.com/design/icons/</li>
 * <li>https://www.google.com/design/icons/#ic_accessibility</li>
 * </ul>
 *
 * <h2 id="material_design_icons">Material Design Icons</h2>
 * Using the Material Design Icon-Selector, developers can easily and quickly search for a Material Design font-icon and
 * determine its textual name and character reference code. Click on any icon to see the slide-up information
 * panel with details regarding a SVG download or information on the font-icon usage.
 *
 * <a href="https://www.google.com/design/icons/#ic_accessibility" target="_blank" style="border-bottom:none;">
 * <img src="https://cloud.githubusercontent.com/assets/210413/7902490/fe8dd14c-0780-11e5-98fb-c821cc6475e6.png"
 *      aria-label="Material Design Icon-Selector" style="max-width:75%;padding-left:10%">
 * </a>
 *
 * <span class="image_caption">
 *  Click on the image above to link to the
 *  <a href="https://www.google.com/design/icons/#ic_accessibility" target="_blank">Material Design Icon-Selector</a>.
 * </span>
 *
 * @param {string} md-font-icon String name of CSS icon associated with the font-face will be used
 * to render the icon. Requires the fonts and the named CSS styles to be preloaded.
 * @param {string} md-font-set CSS style name associated with the font library; which will be assigned as
 * the class for the font-icon ligature. This value may also be an alias that is used to lookup the classname;
 * internally use `$mdIconProvider.fontSet(<alias>)` to determine the style name.
 * @param {string} md-svg-src String URL (or expression) used to load, cache, and display an
 *     external SVG.
 * @param {string} md-svg-icon md-svg-icon String name used for lookup of the icon from the internal cache;
 *     interpolated strings or expressions may also be used. Specific set names can be used with
 *     the syntax `<set name>:<icon name>`.<br/><br/>
 * To use icon sets, developers are required to pre-register the sets using the `$mdIconProvider` service.
 * @param {string=} aria-label Labels icon for accessibility. If an empty string is provided, icon
 * will be hidden from accessibility layer with `aria-hidden="true"`. If there's no aria-label on the icon
 * nor a label on the parent element, a warning will be logged to the console.
 * @param {string=} alt Labels icon for accessibility. If an empty string is provided, icon
 * will be hidden from accessibility layer with `aria-hidden="true"`. If there's no alt on the icon
 * nor a label on the parent element, a warning will be logged to the console.
 *
 * @usage
 * When using SVGs:
 * <hljs lang="html">
 *
 *  <!-- Icon ID; may contain optional icon set prefix; icons must registered using $mdIconProvider -->
 *  <md-icon md-svg-icon="social:android"    aria-label="android " ></md-icon>
 *
 *  <!-- Icon urls; may be preloaded in templateCache -->
 *  <md-icon md-svg-src="/android.svg"       aria-label="android " ></md-icon>
 *  <md-icon md-svg-src="{{ getAndroid() }}" aria-label="android " ></md-icon>
 *
 * </hljs>
 *
 * Use the <code>$mdIconProvider</code> to configure your application with
 * svg iconsets.
 *
 * <hljs lang="js">
 *  angular.module('appSvgIconSets', ['ngMaterial'])
 *    .controller('DemoCtrl', function($scope) {})
 *    .config(function($mdIconProvider) {
 *      $mdIconProvider
 *         .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
 *         .defaultIconSet('img/icons/sets/core-icons.svg', 24);
 *     });
 * </hljs>
 *
 *
 * When using Font Icons with classnames:
 * <hljs lang="html">
 *
 *  <md-icon md-font-icon="android" aria-label="android" ></md-icon>
 *  <md-icon class="icon_home"      aria-label="Home"    ></md-icon>
 *
 * </hljs>
 *
 * When using Material Font Icons with ligatures:
 * <hljs lang="html">
 *  <!--
 *  For Material Design Icons
 *  The class '.material-icons' is auto-added if a style has NOT been specified
 *  since `material-icons` is the default fontset. So your markup:
 *  -->
 *  <md-icon> face </md-icon>
 *  <!-- becomes this at runtime: -->
 *  <md-icon md-font-set="material-icons"> face </md-icon>
 *  <!-- If the fontset does not support ligature names, then we need to use the ligature unicode.-->
 *  <md-icon> &#xE87C; </md-icon>
 *  <!-- The class '.material-icons' must be manually added if other styles are also specified-->
 *  <md-icon class="material-icons md-light md-48"> face </md-icon>
 * </hljs>
 *
 * When using other Font-Icon libraries:
 *
 * <hljs lang="js">
 *  // Specify a font-icon style alias
 *  angular.config(function($mdIconProvider) {
 *    $mdIconProvider.fontSet('md', 'material-icons');
 *  });
 * </hljs>
 *
 * <hljs lang="html">
 *  <md-icon md-font-set="md">favorite</md-icon>
 * </hljs>
 *
 */
function mdIconDirective($mdIcon, $mdTheming, $mdAria, $sce) {

  return {
    restrict: 'E',
    link : postLink
  };


  /**
   * Directive postLink
   * Supports embedded SVGs, font-icons, & external SVGs
   */
  function postLink(scope, element, attr) {
    $mdTheming(element);
    var lastFontIcon = attr.mdFontIcon;
    var lastFontSet = $mdIcon.fontSet(attr.mdFontSet);

    prepareForFontIcon();

    attr.$observe('mdFontIcon', fontIconChanged);
    attr.$observe('mdFontSet', fontIconChanged);

    // Keep track of the content of the svg src so we can compare against it later to see if the
    // attribute is static (and thus safe).
    var originalSvgSrc = element[0].getAttribute(attr.$attr.mdSvgSrc);

    // If using a font-icon, then the textual name of the icon itself
    // provides the aria-label.

    var label = attr.alt || attr.mdFontIcon || attr.mdSvgIcon || element.text();
    var attrName = attr.$normalize(attr.$attr.mdSvgIcon || attr.$attr.mdSvgSrc || '');

    if ( !attr['aria-label'] ) {

      if (label !== '' && !parentsHaveText() ) {

        $mdAria.expect(element, 'aria-label', label);
        $mdAria.expect(element, 'role', 'img');

      } else if ( !element.text() ) {
        // If not a font-icon with ligature, then
        // hide from the accessibility layer.

        $mdAria.expect(element, 'aria-hidden', 'true');
      }
    }

    if (attrName) {
      // Use either pre-configured SVG or URL source, respectively.
      attr.$observe(attrName, function(attrVal) {
        element.empty();
        if (attrVal) {
          $mdIcon(attrVal)
            .then(function(svg) {
            element.empty();
            element.append(svg);
          });
        }

      });
    }

    function parentsHaveText() {
      var parent = element.parent();
      if (parent.attr('aria-label') || parent.text()) {
        return true;
      }
      else if(parent.parent().attr('aria-label') || parent.parent().text()) {
        return true;
      }
      return false;
    }

    function prepareForFontIcon() {
      if (!attr.mdSvgIcon && !attr.mdSvgSrc) {
        if (attr.mdFontIcon) {
          element.addClass('md-font ' + attr.mdFontIcon);
        }

        element.addClass(lastFontSet);
      }
    }

    function fontIconChanged() {
      if (!attr.mdSvgIcon && !attr.mdSvgSrc) {
        if (attr.mdFontIcon) {
          element.removeClass(lastFontIcon);
          element.addClass(attr.mdFontIcon);

          lastFontIcon = attr.mdFontIcon;
        }

        var fontSet = $mdIcon.fontSet(attr.mdFontSet);

        if (lastFontSet !== fontSet) {
          element.removeClass(lastFontSet);
          element.addClass(fontSet);

          lastFontSet = fontSet;
        }
      }
    }
  }
}

})();
(function(){
"use strict";

  angular
    .module('material.components.icon')
    .constant('$$mdSvgRegistry', {
        'mdTabsArrow':   'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxnPjxwb2x5Z29uIHBvaW50cz0iMTUuNCw3LjQgMTQsNiA4LDEyIDE0LDE4IDE1LjQsMTYuNiAxMC44LDEyICIvPjwvZz48L3N2Zz4=',
        'mdClose':       'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxnPjxwYXRoIGQ9Ik0xOSA2LjQxbC0xLjQxLTEuNDEtNS41OSA1LjU5LTUuNTktNS41OS0xLjQxIDEuNDEgNS41OSA1LjU5LTUuNTkgNS41OSAxLjQxIDEuNDEgNS41OS01LjU5IDUuNTkgNS41OSAxLjQxLTEuNDEtNS41OS01LjU5eiIvPjwvZz48L3N2Zz4=',
        'mdCancel':      'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxnPjxwYXRoIGQ9Ik0xMiAyYy01LjUzIDAtMTAgNC40Ny0xMCAxMHM0LjQ3IDEwIDEwIDEwIDEwLTQuNDcgMTAtMTAtNC40Ny0xMC0xMC0xMHptNSAxMy41OWwtMS40MSAxLjQxLTMuNTktMy41OS0zLjU5IDMuNTktMS40MS0xLjQxIDMuNTktMy41OS0zLjU5LTMuNTkgMS40MS0xLjQxIDMuNTkgMy41OSAzLjU5LTMuNTkgMS40MSAxLjQxLTMuNTkgMy41OSAzLjU5IDMuNTl6Ii8+PC9nPjwvc3ZnPg==',
        'mdMenu':        'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGQ9Ik0zLDZIMjFWOEgzVjZNMywxMUgyMVYxM0gzVjExTTMsMTZIMjFWMThIM1YxNloiIC8+PC9zdmc+',
        'mdToggleArrow': 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNDggNDgiPjxwYXRoIGQ9Ik0yNCAxNmwtMTIgMTIgMi44MyAyLjgzIDkuMTctOS4xNyA5LjE3IDkuMTcgMi44My0yLjgzeiIvPjxwYXRoIGQ9Ik0wIDBoNDh2NDhoLTQ4eiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==',
        'mdCalendar':    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTkgM2gtMVYxaC0ydjJIOFYxSDZ2Mkg1Yy0xLjExIDAtMS45OS45LTEuOTkgMkwzIDE5YzAgMS4xLjg5IDIgMiAyaDE0YzEuMSAwIDItLjkgMi0yVjVjMC0xLjEtLjktMi0yLTJ6bTAgMTZINVY4aDE0djExek03IDEwaDV2NUg3eiIvPjwvc3ZnPg=='
    })
    .provider('$mdIcon', MdIconProvider);

/**
 * @ngdoc service
 * @name $mdIconProvider
 * @module material.components.icon
 *
 * @description
 * `$mdIconProvider` is used only to register icon IDs with URLs. These configuration features allow
 * icons and icon sets to be pre-registered and associated with source URLs **before** the `<md-icon />`
 * directives are compiled.
 *
 * If using font-icons, the developer is responsible for loading the fonts.
 *
 * If using SVGs, loading of the actual svg files are deferred to on-demand requests and are loaded
 * internally by the `$mdIcon` service using the `$templateRequest` service. When an SVG is
 * requested by name/ID, the `$mdIcon` service searches its registry for the associated source URL;
 * that URL is used to on-demand load and parse the SVG dynamically.
 *
 * The `$templateRequest` service expects the icons source to be loaded over trusted URLs.<br/>
 * This means, when loading icons from an external URL, you have to trust the URL in the `$sceDelegateProvider`.
 *
 * <hljs lang="js">
 *   app.config(function($sceDelegateProvider) {
 *     $sceDelegateProvider.resourceUrlWhitelist([
 *       // Adding 'self' to the whitelist, will allow requests from the current origin.
 *       'self',
 *       // Using double asterisks here, will allow all URLs to load.
 *       // We recommend to only specify the given domain you want to allow.
 *       '**'
 *     ]);
 *   });
 * </hljs>
 *
 * Read more about the [$sceDelegateProvider](https://docs.angularjs.org/api/ng/provider/$sceDelegateProvider).
 *
 * **Notice:** Most font-icons libraries do not support ligatures (for example `fontawesome`).<br/>
 *  In such cases you are not able to use the icon's ligature name - Like so:
 *
 *  <hljs lang="html">
 *    <md-icon md-font-set="fa">fa-bell</md-icon>
 *  </hljs>
 *
 * You should instead use the given unicode, instead of the ligature name.
 *
 * <p ng-hide="true"> ##// Notice we can't use a hljs element here, because the characters will be escaped.</p>
 *  ```html
 *    <md-icon md-font-set="fa">&#xf0f3</md-icon>
 *  ```
 *
 * All unicode ligatures are prefixed with the `&#x` string.
 *
 * @usage
 * <hljs lang="js">
 *   app.config(function($mdIconProvider) {
    *
    *     // Configure URLs for icons specified by [set:]id.
    *
    *     $mdIconProvider
    *          .defaultFontSet( 'fa' )                   // This sets our default fontset className.
    *          .defaultIconSet('my/app/icons.svg')       // Register a default set of SVG icons
    *          .iconSet('social', 'my/app/social.svg')   // Register a named icon set of SVGs
    *          .icon('android', 'my/app/android.svg')    // Register a specific icon (by name)
    *          .icon('work:chair', 'my/app/chair.svg');  // Register icon in a specific set
    *   });
 * </hljs>
 *
 * SVG icons and icon sets can be easily pre-loaded and cached using either (a) a build process or (b) a runtime
 * **startup** process (shown below):
 *
 * <hljs lang="js">
 *   app.config(function($mdIconProvider) {
    *
    *     // Register a default set of SVG icon definitions
    *     $mdIconProvider.defaultIconSet('my/app/icons.svg')
    *
    *   })
 *   .run(function($templateRequest){
    *
    *     // Pre-fetch icons sources by URL and cache in the $templateCache...
    *     // subsequent $templateRequest calls will look there first.
    *
    *     var urls = [ 'imy/app/icons.svg', 'img/icons/android.svg'];
    *
    *     angular.forEach(urls, function(url) {
    *       $templateRequest(url);
    *     });
    *
    *   });
 *
 * </hljs>
 *
 * NOTE: the loaded SVG data is subsequently cached internally for future requests.
 *
 */

/**
 * @ngdoc method
 * @name $mdIconProvider#icon
 *
 * @description
 * Register a source URL for a specific icon name; the name may include optional 'icon set' name prefix.
 * These icons  will later be retrieved from the cache using `$mdIcon( <icon name> )`
 *
 * @param {string} id Icon name/id used to register the icon
 * @param {string} url specifies the external location for the data file. Used internally by
 * `$templateRequest` to load the data or as part of the lookup in `$templateCache` if pre-loading
 * was configured.
 * @param {number=} viewBoxSize Sets the width and height the icon's viewBox.
 * It is ignored for icons with an existing viewBox. Default size is 24.
 *
 * @returns {obj} an `$mdIconProvider` reference; used to support method call chains for the API
 *
 * @usage
 * <hljs lang="js">
 *   app.config(function($mdIconProvider) {
    *
    *     // Configure URLs for icons specified by [set:]id.
    *
    *     $mdIconProvider
    *          .icon('android', 'my/app/android.svg')    // Register a specific icon (by name)
    *          .icon('work:chair', 'my/app/chair.svg');  // Register icon in a specific set
    *   });
 * </hljs>
 *
 */
/**
 * @ngdoc method
 * @name $mdIconProvider#iconSet
 *
 * @description
 * Register a source URL for a 'named' set of icons; group of SVG definitions where each definition
 * has an icon id. Individual icons can be subsequently retrieved from this cached set using
 * `$mdIcon(<icon set name>:<icon name>)`
 *
 * @param {string} id Icon name/id used to register the iconset
 * @param {string} url specifies the external location for the data file. Used internally by
 * `$templateRequest` to load the data or as part of the lookup in `$templateCache` if pre-loading
 * was configured.
 * @param {number=} viewBoxSize Sets the width and height of the viewBox of all icons in the set.
 * It is ignored for icons with an existing viewBox. All icons in the icon set should be the same size.
 * Default value is 24.
 *
 * @returns {obj} an `$mdIconProvider` reference; used to support method call chains for the API
 *
 *
 * @usage
 * <hljs lang="js">
 *   app.config(function($mdIconProvider) {
    *
    *     // Configure URLs for icons specified by [set:]id.
    *
    *     $mdIconProvider
    *          .iconSet('social', 'my/app/social.svg')   // Register a named icon set
    *   });
 * </hljs>
 *
 */
/**
 * @ngdoc method
 * @name $mdIconProvider#defaultIconSet
 *
 * @description
 * Register a source URL for the default 'named' set of icons. Unless explicitly registered,
 * subsequent lookups of icons will failover to search this 'default' icon set.
 * Icon can be retrieved from this cached, default set using `$mdIcon(<name>)`
 *
 * @param {string} url specifies the external location for the data file. Used internally by
 * `$templateRequest` to load the data or as part of the lookup in `$templateCache` if pre-loading
 * was configured.
 * @param {number=} viewBoxSize Sets the width and height of the viewBox of all icons in the set.
 * It is ignored for icons with an existing viewBox. All icons in the icon set should be the same size.
 * Default value is 24.
 *
 * @returns {obj} an `$mdIconProvider` reference; used to support method call chains for the API
 *
 * @usage
 * <hljs lang="js">
 *   app.config(function($mdIconProvider) {
    *
    *     // Configure URLs for icons specified by [set:]id.
    *
    *     $mdIconProvider
    *          .defaultIconSet( 'my/app/social.svg' )   // Register a default icon set
    *   });
 * </hljs>
 *
 */
/**
 * @ngdoc method
 * @name $mdIconProvider#defaultFontSet
 *
 * @description
 * When using Font-Icons, Angular Material assumes the the Material Design icons will be used and automatically
 * configures the default font-set == 'material-icons'. Note that the font-set references the font-icon library
 * class style that should be applied to the `<md-icon>`.
 *
 * Configuring the default means that the attributes
 * `md-font-set="material-icons"` or `class="material-icons"` do not need to be explicitly declared on the
 * `<md-icon>` markup. For example:
 *
 *  `<md-icon> face </md-icon>`
 *  will render as
 *  `<span class="material-icons"> face </span>`, and
 *
 *  `<md-icon md-font-set="fa"> face </md-icon>`
 *  will render as
 *  `<span class="fa"> face </span>`
 *
 * @param {string} name of the font-library style that should be applied to the md-icon DOM element
 *
 * @usage
 * <hljs lang="js">
 *   app.config(function($mdIconProvider) {
   *     $mdIconProvider.defaultFontSet( 'fa' );
   *   });
 * </hljs>
 *
 */

/**
 * @ngdoc method
 * @name $mdIconProvider#fontSet
 *
 * @description
 * When using a font set for `<md-icon>` you must specify the correct font classname in the `md-font-set`
 * attribute. If the fonset className is really long, your markup may become cluttered... an easy
 * solution is to define an `alias` for your fontset:
 *
 * @param {string} alias of the specified fontset.
 * @param {string} className of the fontset.
 *
 * @usage
 * <hljs lang="js">
 *   app.config(function($mdIconProvider) {
   *     // In this case, we set an alias for the `material-icons` fontset.
   *     $mdIconProvider.fontSet('md', 'material-icons');
   *   });
 * </hljs>
 *
 */

/**
 * @ngdoc method
 * @name $mdIconProvider#defaultViewBoxSize
 *
 * @description
 * While `<md-icon />` markup can also be style with sizing CSS, this method configures
 * the default width **and** height used for all icons; unless overridden by specific CSS.
 * The default sizing is (24px, 24px).
 * @param {number=} viewBoxSize Sets the width and height of the viewBox for an icon or an icon set.
 * All icons in a set should be the same size. The default value is 24.
 *
 * @returns {obj} an `$mdIconProvider` reference; used to support method call chains for the API
 *
 * @usage
 * <hljs lang="js">
 *   app.config(function($mdIconProvider) {
    *
    *     // Configure URLs for icons specified by [set:]id.
    *
    *     $mdIconProvider
    *          .defaultViewBoxSize(36)   // Register a default icon size (width == height)
    *   });
 * </hljs>
 *
 */

var config = {
  defaultViewBoxSize: 24,
  defaultFontSet: 'material-icons',
  fontSets: []
};

function MdIconProvider() {
}

MdIconProvider.prototype = {
  icon: function(id, url, viewBoxSize) {
    if (id.indexOf(':') == -1) id = '$default:' + id;

    config[id] = new ConfigurationItem(url, viewBoxSize);
    return this;
  },

  iconSet: function(id, url, viewBoxSize) {
    config[id] = new ConfigurationItem(url, viewBoxSize);
    return this;
  },

  defaultIconSet: function(url, viewBoxSize) {
    var setName = '$default';

    if (!config[setName]) {
      config[setName] = new ConfigurationItem(url, viewBoxSize);
    }

    config[setName].viewBoxSize = viewBoxSize || config.defaultViewBoxSize;

    return this;
  },

  defaultViewBoxSize: function(viewBoxSize) {
    config.defaultViewBoxSize = viewBoxSize;
    return this;
  },

  /**
   * Register an alias name associated with a font-icon library style ;
   */
  fontSet: function fontSet(alias, className) {
    config.fontSets.push({
      alias: alias,
      fontSet: className || alias
    });
    return this;
  },

  /**
   * Specify a default style name associated with a font-icon library
   * fallback to Material Icons.
   *
   */
  defaultFontSet: function defaultFontSet(className) {
    config.defaultFontSet = !className ? '' : className;
    return this;
  },

  defaultIconSize: function defaultIconSize(iconSize) {
    config.defaultIconSize = iconSize;
    return this;
  },

  $get: ['$templateRequest', '$q', '$log', '$mdUtil', '$sce', function($templateRequest, $q, $log, $mdUtil, $sce) {
    return MdIconService(config, $templateRequest, $q, $log, $mdUtil, $sce);
  }]
};

/**
 *  Configuration item stored in the Icon registry; used for lookups
 *  to load if not already cached in the `loaded` cache
 */
function ConfigurationItem(url, viewBoxSize) {
  this.url = url;
  this.viewBoxSize = viewBoxSize || config.defaultViewBoxSize;
}

/**
 * @ngdoc service
 * @name $mdIcon
 * @module material.components.icon
 *
 * @description
 * The `$mdIcon` service is a function used to lookup SVG icons.
 *
 * @param {string} id Query value for a unique Id or URL. If the argument is a URL, then the service will retrieve the icon element
 * from its internal cache or load the icon and cache it first. If the value is not a URL-type string, then an ID lookup is
 * performed. The Id may be a unique icon ID or may include an iconSet ID prefix.
 *
 * For the **id** query to work properly, this means that all id-to-URL mappings must have been previously configured
 * using the `$mdIconProvider`.
 *
 * @returns {angular.$q.Promise} A promise that gets resolved to a clone of the initial SVG DOM element; which was
 * created from the SVG markup in the SVG data file. If an error occurs (e.g. the icon cannot be found) the promise
 * will get rejected.
 *
 * @usage
 * <hljs lang="js">
 * function SomeDirective($mdIcon) {
  *
  *   // See if the icon has already been loaded, if not
  *   // then lookup the icon from the registry cache, load and cache
  *   // it for future requests.
  *   // NOTE: ID queries require configuration with $mdIconProvider
  *
  *   $mdIcon('android').then(function(iconEl)    { element.append(iconEl); });
  *   $mdIcon('work:chair').then(function(iconEl) { element.append(iconEl); });
  *
  *   // Load and cache the external SVG using a URL
  *
  *   $mdIcon('img/icons/android.svg').then(function(iconEl) {
  *     element.append(iconEl);
  *   });
  * };
 * </hljs>
 *
 * NOTE: The `<md-icon />  ` directive internally uses the `$mdIcon` service to query, loaded, and instantiate
 * SVG DOM elements.
 */

/* @ngInject */
function MdIconService(config, $templateRequest, $q, $log, $mdUtil, $sce) {
  var iconCache = {};
  var svgCache = {};
  var urlRegex = /[-\w@:%\+.~#?&//=]{2,}\.[a-z]{2,4}\b(\/[-\w@:%\+.~#?&//=]*)?/i;
  var dataUrlRegex = /^data:image\/svg\+xml[\s*;\w\-\=]*?(base64)?,(.*)$/i;

  Icon.prototype = {clone: cloneSVG, prepare: prepareAndStyle};
  getIcon.fontSet = findRegisteredFontSet;

  // Publish service...
  return getIcon;

  /**
   * Actual $mdIcon service is essentially a lookup function
   */
  function getIcon(id) {
    id = id || '';

    // If the "id" provided is not a string, the only other valid value is a $sce trust wrapper
    // over a URL string. If the value is not trusted, this will intentionally throw an error
    // because the user is attempted to use an unsafe URL, potentially opening themselves up
    // to an XSS attack.
    if (!angular.isString(id)) {
      id = $sce.getTrustedUrl(id);
    }

    // If already loaded and cached, use a clone of the cached icon.
    // Otherwise either load by URL, or lookup in the registry and then load by URL, and cache.

    if (iconCache[id]) {
      return $q.when(transformClone(iconCache[id]));
    }

    if (urlRegex.test(id) || dataUrlRegex.test(id)) {
      return loadByURL(id).then(cacheIcon(id));
    }

    if (id.indexOf(':') == -1) {
      id = '$default:' + id;
    }

    var load = config[id] ? loadByID : loadFromIconSet;
    return load(id)
      .then(cacheIcon(id));
  }

  /**
   * Lookup registered fontSet style using its alias...
   * If not found,
   */
  function findRegisteredFontSet(alias) {
    var useDefault = angular.isUndefined(alias) || !(alias && alias.length);
    if (useDefault) return config.defaultFontSet;

    var result = alias;
    angular.forEach(config.fontSets, function(it) {
      if (it.alias == alias) result = it.fontSet || result;
    });

    return result;
  }

  function transformClone(cacheElement) {
    var clone = cacheElement.clone();
    var cacheSuffix = '_cache' + $mdUtil.nextUid();

    // We need to modify for each cached icon the id attributes.
    // This is needed because SVG id's are treated as normal DOM ids
    // and should not have a duplicated id.
    if (clone.id) clone.id += cacheSuffix;
    angular.forEach(clone.querySelectorAll('[id]'), function(item) {
      item.id += cacheSuffix;
    });

    return clone;
  }

  /**
   * Prepare and cache the loaded icon for the specified `id`
   */
  function cacheIcon(id) {

    return function updateCache(icon) {
      iconCache[id] = isIcon(icon) ? icon : new Icon(icon, config[id]);

      return iconCache[id].clone();
    };
  }

  /**
   * Lookup the configuration in the registry, if !registered throw an error
   * otherwise load the icon [on-demand] using the registered URL.
   *
   */
  function loadByID(id) {
    var iconConfig = config[id];
    return loadByURL(iconConfig.url).then(function(icon) {
      return new Icon(icon, iconConfig);
    });
  }

  /**
   *    Loads the file as XML and uses querySelector( <id> ) to find
   *    the desired node...
   */
  function loadFromIconSet(id) {
    var setName = id.substring(0, id.lastIndexOf(':')) || '$default';
    var iconSetConfig = config[setName];

    return !iconSetConfig ? announceIdNotFound(id) : loadByURL(iconSetConfig.url).then(extractFromSet);

    function extractFromSet(set) {
      var iconName = id.slice(id.lastIndexOf(':') + 1);
      var icon = set.querySelector('#' + iconName);
      return icon ? new Icon(icon, iconSetConfig) : announceIdNotFound(id);
    }

    function announceIdNotFound(id) {
      var msg = 'icon ' + id + ' not found';
      $log.warn(msg);

      return $q.reject(msg || id);
    }
  }

  /**
   * Load the icon by URL (may use the $templateCache).
   * Extract the data for later conversion to Icon
   */
  function loadByURL(url) {
    /* Load the icon from embedded data URL. */
    function loadByDataUrl(url) {
      var results = dataUrlRegex.exec(url);
      var isBase64 = /base64/i.test(url);
      var data = isBase64 ? window.atob(results[2]) : results[2];

      return $q.when(angular.element(data)[0]);
    }

    /* Load the icon by URL using HTTP. */
    function loadByHttpUrl(url) {
      return $q(function(resolve, reject) {
        // Catch HTTP or generic errors not related to incorrect icon IDs.
        var announceAndReject = function(err) {
            var msg = angular.isString(err) ? err : (err.message || err.data || err.statusText);
            $log.warn(msg);
            reject(err);
          },
          extractSvg = function(response) {
            if (!svgCache[url]) {
              svgCache[url] = angular.element('<div>').append(response)[0].querySelector('svg');
            }
            resolve(svgCache[url]);
          };

        $templateRequest(url, true).then(extractSvg, announceAndReject);
      });
    }

    return dataUrlRegex.test(url)
      ? loadByDataUrl(url)
      : loadByHttpUrl(url);
  }

  /**
   * Check target signature to see if it is an Icon instance.
   */
  function isIcon(target) {
    return angular.isDefined(target.element) && angular.isDefined(target.config);
  }

  /**
   *  Define the Icon class
   */
  function Icon(el, config) {
    if (el && el.tagName != 'svg') {
      el = angular.element('<svg xmlns="http://www.w3.org/2000/svg">').append(el.cloneNode(true))[0];
    }

    // Inject the namespace if not available...
    if (!el.getAttribute('xmlns')) {
      el.setAttribute('xmlns', "http://www.w3.org/2000/svg");
    }

    this.element = el;
    this.config = config;
    this.prepare();
  }

  /**
   *  Prepare the DOM element that will be cached in the
   *  loaded iconCache store.
   */
  function prepareAndStyle() {
    var viewBoxSize = this.config ? this.config.viewBoxSize : config.defaultViewBoxSize;
    angular.forEach({
      'fit': '',
      'height': '100%',
      'width': '100%',
      'preserveAspectRatio': 'xMidYMid meet',
      'viewBox': this.element.getAttribute('viewBox') || ('0 0 ' + viewBoxSize + ' ' + viewBoxSize),
      'focusable': false // Disable IE11s default behavior to make SVGs focusable
    }, function(val, attr) {
      this.element.setAttribute(attr, val);
    }, this);
  }

  /**
   * Clone the Icon DOM element.
   */
  function cloneSVG() {
    // If the element or any of its children have a style attribute, then a CSP policy without
    // 'unsafe-inline' in the style-src directive, will result in a violation.
    return this.element.cloneNode(true);
  }

}
MdIconService.$inject = ["config", "$templateRequest", "$q", "$log", "$mdUtil", "$sce"];

})();
(function(){
"use strict";

/**
 * @ngdoc directive
 * @name mdTab
 * @module material.components.tabs
 *
 * @restrict E
 *
 * @description
 * Use the `<md-tab>` a nested directive used within `<md-tabs>` to specify a tab with a **label** and optional *view content*.
 *
 * If the `label` attribute is not specified, then an optional `<md-tab-label>` tag can be used to specify more
 * complex tab header markup. If neither the **label** nor the **md-tab-label** are specified, then the nested
 * markup of the `<md-tab>` is used as the tab header markup.
 *
 * Please note that if you use `<md-tab-label>`, your content **MUST** be wrapped in the `<md-tab-body>` tag.  This
 * is to define a clear separation between the tab content and the tab label.
 *
 * This container is used by the TabsController to show/hide the active tab's content view. This synchronization is
 * automatically managed by the internal TabsController whenever the tab selection changes. Selection changes can
 * be initiated via data binding changes, programmatic invocation, or user gestures.
 *
 * @param {string=} label Optional attribute to specify a simple string as the tab label
 * @param {boolean=} ng-disabled If present and expression evaluates to truthy, disabled tab selection.
 * @param {expression=} md-on-deselect Expression to be evaluated after the tab has been de-selected.
 * @param {expression=} md-on-select Expression to be evaluated after the tab has been selected.
 * @param {boolean=} md-active When true, sets the active tab.  Note: There can only be one active tab at a time.
 *
 *
 * @usage
 *
 * <hljs lang="html">
 * <md-tab label="" ng-disabled md-on-select="" md-on-deselect="" >
 *   <h3>My Tab content</h3>
 * </md-tab>
 *
 * <md-tab >
 *   <md-tab-label>
 *     <h3>My Tab content</h3>
 *   </md-tab-label>
 *   <md-tab-body>
 *     <p>
 *       Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
 *       totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
 *       dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
 *       sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
 *     </p>
 *   </md-tab-body>
 * </md-tab>
 * </hljs>
 *
 */
angular
    .module('material.components.tabs')
    .directive('mdTab', MdTab);

function MdTab () {
  return {
    require:  '^?mdTabs',
    terminal: true,
    compile:  function (element, attr) {
      var label = firstChild(element, 'md-tab-label'),
          body  = firstChild(element, 'md-tab-body');

      if (label.length == 0) {
        label = angular.element('<md-tab-label></md-tab-label>');
        if (attr.label) label.text(attr.label);
        else label.append(element.contents());

        if (body.length == 0) {
          var contents = element.contents().detach();
          body         = angular.element('<md-tab-body></md-tab-body>');
          body.append(contents);
        }
      }

      element.append(label);
      if (body.html()) element.append(body);

      return postLink;
    },
    scope:    {
      active:   '=?mdActive',
      disabled: '=?ngDisabled',
      select:   '&?mdOnSelect',
      deselect: '&?mdOnDeselect'
    }
  };

  function postLink (scope, element, attr, ctrl) {
    if (!ctrl) return;
    var index = ctrl.getTabElementIndex(element),
        body  = firstChild(element, 'md-tab-body').remove(),
        label = firstChild(element, 'md-tab-label').remove(),
        data  = ctrl.insertTab({
          scope:    scope,
          parent:   scope.$parent,
          index:    index,
          element:  element,
          template: body.html(),
          label:    label.html()
        }, index);

    scope.select   = scope.select || angular.noop;
    scope.deselect = scope.deselect || angular.noop;

    scope.$watch('active', function (active) { if (active) ctrl.select(data.getIndex(), true); });
    scope.$watch('disabled', function () { ctrl.refreshIndex(); });
    scope.$watch(
        function () {
          return ctrl.getTabElementIndex(element);
        },
        function (newIndex) {
          data.index = newIndex;
          ctrl.updateTabOrder();
        }
    );
    scope.$on('$destroy', function () { ctrl.removeTab(data); });
  }

  function firstChild (element, tagName) {
    var children = element[0].children;
    for (var i = 0, len = children.length; i < len; i++) {
      var child = children[i];
      if (child.tagName === tagName.toUpperCase()) return angular.element(child);
    }
    return angular.element();
  }
}

})();
(function(){
"use strict";

angular
    .module('material.components.tabs')
    .directive('mdTabItem', MdTabItem);

function MdTabItem () {
  return {
    require: '^?mdTabs',
    link:    function link (scope, element, attr, ctrl) {
      if (!ctrl) return;
      ctrl.attachRipple(scope, element);
    }
  };
}

})();
(function(){
"use strict";

angular
    .module('material.components.tabs')
    .directive('mdTabLabel', MdTabLabel);

function MdTabLabel () {
  return { terminal: true };
}


})();
(function(){
"use strict";

angular
    .module('material.components.tabs')
    .controller('MdTabsController', MdTabsController);

/**
 * @ngInject
 */
function MdTabsController ($scope, $element, $window, $mdConstant, $mdTabInkRipple,
                           $mdUtil, $animateCss, $attrs, $compile, $mdTheming) {
  // define private properties
  var ctrl      = this,
      locked    = false,
      elements  = getElements(),
      queue     = [],
      destroyed = false,
      loaded    = false;

  // define one-way bindings
  defineOneWayBinding('stretchTabs', handleStretchTabs);

  // define public properties with change handlers
  defineProperty('focusIndex', handleFocusIndexChange, ctrl.selectedIndex || 0);
  defineProperty('offsetLeft', handleOffsetChange, 0);
  defineProperty('hasContent', handleHasContent, false);
  defineProperty('maxTabWidth', handleMaxTabWidth, getMaxTabWidth());
  defineProperty('shouldPaginate', handleShouldPaginate, false);

  // define boolean attributes
  defineBooleanAttribute('noInkBar', handleInkBar);
  defineBooleanAttribute('dynamicHeight', handleDynamicHeight);
  defineBooleanAttribute('noPagination');
  defineBooleanAttribute('swipeContent');
  defineBooleanAttribute('noDisconnect');
  defineBooleanAttribute('autoselect');
  defineBooleanAttribute('noSelectClick');
  defineBooleanAttribute('centerTabs', handleCenterTabs, false);
  defineBooleanAttribute('enableDisconnect');

  // define public properties
  ctrl.scope             = $scope;
  ctrl.parent            = $scope.$parent;
  ctrl.tabs              = [];
  ctrl.lastSelectedIndex = null;
  ctrl.hasFocus          = false;
  ctrl.lastClick         = true;
  ctrl.shouldCenterTabs  = shouldCenterTabs();

  // define public methods
  ctrl.updatePagination   = $mdUtil.debounce(updatePagination, 100);
  ctrl.redirectFocus      = redirectFocus;
  ctrl.attachRipple       = attachRipple;
  ctrl.insertTab          = insertTab;
  ctrl.removeTab          = removeTab;
  ctrl.select             = select;
  ctrl.scroll             = scroll;
  ctrl.nextPage           = nextPage;
  ctrl.previousPage       = previousPage;
  ctrl.keydown            = keydown;
  ctrl.canPageForward     = canPageForward;
  ctrl.canPageBack        = canPageBack;
  ctrl.refreshIndex       = refreshIndex;
  ctrl.incrementIndex     = incrementIndex;
  ctrl.getTabElementIndex = getTabElementIndex;
  ctrl.updateInkBarStyles = $mdUtil.debounce(updateInkBarStyles, 100);
  ctrl.updateTabOrder     = $mdUtil.debounce(updateTabOrder, 100);

  init();

  /**
   * Perform initialization for the controller, setup events and watcher(s)
   */
  function init () {
    ctrl.selectedIndex = ctrl.selectedIndex || 0;
    compileTemplate();
    configureWatchers();
    bindEvents();
    $mdTheming($element);
    $mdUtil.nextTick(function () {
      // Note that the element references need to be updated, because certain "browsers"
      // (IE/Edge) lose them and start throwing "Invalid calling object" errors, when we
      // compile the element contents down in `compileElement`.
      elements = getElements();
      updateHeightFromContent();
      adjustOffset();
      updateInkBarStyles();
      ctrl.tabs[ ctrl.selectedIndex ] && ctrl.tabs[ ctrl.selectedIndex ].scope.select();
      loaded = true;
      updatePagination();
    });
  }

  /**
   * Compiles the template provided by the user.  This is passed as an attribute from the tabs
   * directive's template function.
   */
  function compileTemplate () {
    var template = $attrs.$mdTabsTemplate,
        element  = angular.element($element[0].querySelector('md-tab-data'));

    element.html(template);
    $compile(element.contents())(ctrl.parent);
    delete $attrs.$mdTabsTemplate;
  }

  /**
   * Binds events used by the tabs component.
   */
  function bindEvents () {
    angular.element($window).on('resize', handleWindowResize);
    $scope.$on('$destroy', cleanup);
  }

  /**
   * Configure watcher(s) used by Tabs
   */
  function configureWatchers () {
    $scope.$watch('$mdTabsCtrl.selectedIndex', handleSelectedIndexChange);
  }

  /**
   * Creates a one-way binding manually rather than relying on Angular's isolated scope
   * @param key
   * @param handler
   */
  function defineOneWayBinding (key, handler) {
    var attr = $attrs.$normalize('md-' + key);
    if (handler) defineProperty(key, handler);
    $attrs.$observe(attr, function (newValue) { ctrl[ key ] = newValue; });
  }

  /**
   * Defines boolean attributes with default value set to true.  (ie. md-stretch-tabs with no value
   * will be treated as being truthy)
   * @param key
   * @param handler
   */
  function defineBooleanAttribute (key, handler) {
    var attr = $attrs.$normalize('md-' + key);
    if (handler) defineProperty(key, handler);
    if ($attrs.hasOwnProperty(attr)) updateValue($attrs[attr]);
    $attrs.$observe(attr, updateValue);
    function updateValue (newValue) {
      ctrl[ key ] = newValue !== 'false';
    }
  }

  /**
   * Remove any events defined by this controller
   */
  function cleanup () {
    destroyed = true;
    angular.element($window).off('resize', handleWindowResize);
  }

  // Change handlers

  /**
   * Toggles stretch tabs class and updates inkbar when tab stretching changes
   * @param stretchTabs
   */
  function handleStretchTabs (stretchTabs) {
    var elements = getElements();
    angular.element(elements.wrapper).toggleClass('md-stretch-tabs', shouldStretchTabs());
    updateInkBarStyles();
  }

  function handleCenterTabs (newValue) {
    ctrl.shouldCenterTabs = shouldCenterTabs();
  }

  function handleMaxTabWidth (newWidth, oldWidth) {
    if (newWidth !== oldWidth) {
      var elements = getElements();

      angular.forEach(elements.tabs, function(tab) {
        tab.style.maxWidth = newWidth + 'px';
      });
      $mdUtil.nextTick(ctrl.updateInkBarStyles);
    }
  }

  function handleShouldPaginate (newValue, oldValue) {
    if (newValue !== oldValue) {
      ctrl.maxTabWidth      = getMaxTabWidth();
      ctrl.shouldCenterTabs = shouldCenterTabs();
      $mdUtil.nextTick(function () {
        ctrl.maxTabWidth = getMaxTabWidth();
        adjustOffset(ctrl.selectedIndex);
      });
    }
  }

  /**
   * Add/remove the `md-no-tab-content` class depending on `ctrl.hasContent`
   * @param hasContent
   */
  function handleHasContent (hasContent) {
    $element[ hasContent ? 'removeClass' : 'addClass' ]('md-no-tab-content');
  }

  /**
   * Apply ctrl.offsetLeft to the paging element when it changes
   * @param left
   */
  function handleOffsetChange (left) {
    var elements = getElements();
    var newValue = ctrl.shouldCenterTabs ? '' : '-' + left + 'px';

    angular.element(elements.paging).css($mdConstant.CSS.TRANSFORM, 'translate3d(' + newValue + ', 0, 0)');
    $scope.$broadcast('$mdTabsPaginationChanged');
  }

  /**
   * Update the UI whenever `ctrl.focusIndex` is updated
   * @param newIndex
   * @param oldIndex
   */
  function handleFocusIndexChange (newIndex, oldIndex) {
    if (newIndex === oldIndex) return;
    if (!getElements().tabs[ newIndex ]) return;
    adjustOffset();
    redirectFocus();
  }

  /**
   * Update the UI whenever the selected index changes. Calls user-defined select/deselect methods.
   * @param newValue
   * @param oldValue
   */
  function handleSelectedIndexChange (newValue, oldValue) {
    if (newValue === oldValue) return;

    ctrl.selectedIndex     = getNearestSafeIndex(newValue);
    ctrl.lastSelectedIndex = oldValue;
    ctrl.updateInkBarStyles();
    updateHeightFromContent();
    adjustOffset(newValue);
    $scope.$broadcast('$mdTabsChanged');
    ctrl.tabs[ oldValue ] && ctrl.tabs[ oldValue ].scope.deselect();
    ctrl.tabs[ newValue ] && ctrl.tabs[ newValue ].scope.select();
  }

  function getTabElementIndex(tabEl){
    var tabs = $element[0].getElementsByTagName('md-tab');
    return Array.prototype.indexOf.call(tabs, tabEl[0]);
  }

  /**
   * Queues up a call to `handleWindowResize` when a resize occurs while the tabs component is
   * hidden.
   */
  function handleResizeWhenVisible () {
    // if there is already a watcher waiting for resize, do nothing
    if (handleResizeWhenVisible.watcher) return;
    // otherwise, we will abuse the $watch function to check for visible
    handleResizeWhenVisible.watcher = $scope.$watch(function () {
      // since we are checking for DOM size, we use $mdUtil.nextTick() to wait for after the DOM updates
      $mdUtil.nextTick(function () {
        // if the watcher has already run (ie. multiple digests in one cycle), do nothing
        if (!handleResizeWhenVisible.watcher) return;

        if ($element.prop('offsetParent')) {
          handleResizeWhenVisible.watcher();
          handleResizeWhenVisible.watcher = null;

          handleWindowResize();
        }
      }, false);
    });
  }

  // Event handlers / actions

  /**
   * Handle user keyboard interactions
   * @param event
   */
  function keydown (event) {
    switch (event.keyCode) {
      case $mdConstant.KEY_CODE.LEFT_ARROW:
        event.preventDefault();
        incrementIndex(-1, true);
        break;
      case $mdConstant.KEY_CODE.RIGHT_ARROW:
        event.preventDefault();
        incrementIndex(1, true);
        break;
      case $mdConstant.KEY_CODE.SPACE:
      case $mdConstant.KEY_CODE.ENTER:
        event.preventDefault();
        if (!locked) select(ctrl.focusIndex);
        break;
    }
    ctrl.lastClick = false;
  }

  /**
   * Update the selected index. Triggers a click event on the original `md-tab` element in order
   * to fire user-added click events if canSkipClick or `md-no-select-click` are false.
   * @param index
   * @param canSkipClick Optionally allow not firing the click event if `md-no-select-click` is also true.
   */
  function select (index, canSkipClick) {
    if (!locked) ctrl.focusIndex = ctrl.selectedIndex = index;
    ctrl.lastClick = true;
    // skip the click event if noSelectClick is enabled
    if (canSkipClick && ctrl.noSelectClick) return;
    // nextTick is required to prevent errors in user-defined click events
    $mdUtil.nextTick(function () {
      ctrl.tabs[ index ].element.triggerHandler('click');
    }, false);
  }

  /**
   * When pagination is on, this makes sure the selected index is in view.
   * @param event
   */
  function scroll (event) {
    if (!ctrl.shouldPaginate) return;
    event.preventDefault();
    ctrl.offsetLeft = fixOffset(ctrl.offsetLeft - event.wheelDelta);
  }

  /**
   * Slides the tabs over approximately one page forward.
   */
  function nextPage () {
    var elements = getElements();
    var viewportWidth = elements.canvas.clientWidth,
        totalWidth    = viewportWidth + ctrl.offsetLeft,
        i, tab;
    for (i = 0; i < elements.tabs.length; i++) {
      tab = elements.tabs[ i ];
      if (tab.offsetLeft + tab.offsetWidth > totalWidth) break;
    }
    ctrl.offsetLeft = fixOffset(tab.offsetLeft);
  }

  /**
   * Slides the tabs over approximately one page backward.
   */
  function previousPage () {
    var i, tab, elements = getElements();

    for (i = 0; i < elements.tabs.length; i++) {
      tab = elements.tabs[ i ];
      if (tab.offsetLeft + tab.offsetWidth >= ctrl.offsetLeft) break;
    }
    ctrl.offsetLeft = fixOffset(tab.offsetLeft + tab.offsetWidth - elements.canvas.clientWidth);
  }

  /**
   * Update size calculations when the window is resized.
   */
  function handleWindowResize () {
    ctrl.lastSelectedIndex = ctrl.selectedIndex;
    ctrl.offsetLeft        = fixOffset(ctrl.offsetLeft);
    $mdUtil.nextTick(function () {
      ctrl.updateInkBarStyles();
      updatePagination();
    });
  }

  function handleInkBar (hide) {
    angular.element(getElements().inkBar).toggleClass('ng-hide', hide);
  }

  /**
   * Toggle dynamic height class when value changes
   * @param value
   */
  function handleDynamicHeight (value) {
    $element.toggleClass('md-dynamic-height', value);
  }

  /**
   * Remove a tab from the data and select the nearest valid tab.
   * @param tabData
   */
  function removeTab (tabData) {
    if (destroyed) return;
    var selectedIndex = ctrl.selectedIndex,
        tab           = ctrl.tabs.splice(tabData.getIndex(), 1)[ 0 ];
    refreshIndex();
    // when removing a tab, if the selected index did not change, we have to manually trigger the
    //   tab select/deselect events
    if (ctrl.selectedIndex === selectedIndex) {
      tab.scope.deselect();
      ctrl.tabs[ ctrl.selectedIndex ] && ctrl.tabs[ ctrl.selectedIndex ].scope.select();
    }
    $mdUtil.nextTick(function () {
      updatePagination();
      ctrl.offsetLeft = fixOffset(ctrl.offsetLeft);
    });
  }

  /**
   * Create an entry in the tabs array for a new tab at the specified index.
   * @param tabData
   * @param index
   * @returns {*}
   */
  function insertTab (tabData, index) {
    var hasLoaded = loaded;
    var proto     = {
          getIndex:     function () { return ctrl.tabs.indexOf(tab); },
          isActive:     function () { return this.getIndex() === ctrl.selectedIndex; },
          isLeft:       function () { return this.getIndex() < ctrl.selectedIndex; },
          isRight:      function () { return this.getIndex() > ctrl.selectedIndex; },
          shouldRender: function () { return !ctrl.noDisconnect || this.isActive(); },
          hasFocus:     function () {
            return !ctrl.lastClick
                && ctrl.hasFocus && this.getIndex() === ctrl.focusIndex;
          },
          id:           $mdUtil.nextUid()
        },
        tab       = angular.extend(proto, tabData);
    if (angular.isDefined(index)) {
      ctrl.tabs.splice(index, 0, tab);
    } else {
      ctrl.tabs.push(tab);
    }
    processQueue();
    updateHasContent();
    $mdUtil.nextTick(function () {
      updatePagination();
      // if autoselect is enabled, select the newly added tab
      if (hasLoaded && ctrl.autoselect) $mdUtil.nextTick(function () {
        $mdUtil.nextTick(function () { select(ctrl.tabs.indexOf(tab)); });
      });
    });
    return tab;
  }

  // Getter methods

  /**
   * Gathers references to all of the DOM elements used by this controller.
   * @returns {{}}
   */
  function getElements () {
    var elements = {};
    var node = $element[0];

    // gather tab bar elements
    elements.wrapper = node.querySelector('md-tabs-wrapper');
    elements.canvas  = elements.wrapper.querySelector('md-tabs-canvas');
    elements.paging  = elements.canvas.querySelector('md-pagination-wrapper');
    elements.inkBar  = elements.paging.querySelector('md-ink-bar');

    elements.contents = node.querySelectorAll('md-tabs-content-wrapper > md-tab-content');
    elements.tabs    = elements.paging.querySelectorAll('md-tab-item');
    elements.dummies = elements.canvas.querySelectorAll('md-dummy-tab');

    return elements;
  }

  /**
   * Determines whether or not the left pagination arrow should be enabled.
   * @returns {boolean}
   */
  function canPageBack () {
    return ctrl.offsetLeft > 0;
  }

  /**
   * Determines whether or not the right pagination arrow should be enabled.
   * @returns {*|boolean}
   */
  function canPageForward () {
    var elements = getElements();
    var lastTab = elements.tabs[ elements.tabs.length - 1 ];
    return lastTab && lastTab.offsetLeft + lastTab.offsetWidth > elements.canvas.clientWidth +
        ctrl.offsetLeft;
  }

  /**
   * Determines if the UI should stretch the tabs to fill the available space.
   * @returns {*}
   */
  function shouldStretchTabs () {
    switch (ctrl.stretchTabs) {
      case 'always':
        return true;
      case 'never':
        return false;
      default:
        return !ctrl.shouldPaginate
            && $window.matchMedia('(max-width: 600px)').matches;
    }
  }

  /**
   * Determines if the tabs should appear centered.
   * @returns {string|boolean}
   */
  function shouldCenterTabs () {
    return ctrl.centerTabs && !ctrl.shouldPaginate;
  }

  /**
   * Determines if pagination is necessary to display the tabs within the available space.
   * @returns {boolean}
   */
  function shouldPaginate () {
    if (ctrl.noPagination || !loaded) return false;
    var canvasWidth = $element.prop('clientWidth');

    angular.forEach(getElements().dummies, function (tab) {
      canvasWidth -= tab.offsetWidth;
    });

    return canvasWidth < 0;
  }

  /**
   * Finds the nearest tab index that is available.  This is primarily used for when the active
   * tab is removed.
   * @param newIndex
   * @returns {*}
   */
  function getNearestSafeIndex (newIndex) {
    if (newIndex === -1) return -1;
    var maxOffset = Math.max(ctrl.tabs.length - newIndex, newIndex),
        i, tab;
    for (i = 0; i <= maxOffset; i++) {
      tab = ctrl.tabs[ newIndex + i ];
      if (tab && (tab.scope.disabled !== true)) return tab.getIndex();
      tab = ctrl.tabs[ newIndex - i ];
      if (tab && (tab.scope.disabled !== true)) return tab.getIndex();
    }
    return newIndex;
  }

  // Utility methods

  /**
   * Defines a property using a getter and setter in order to trigger a change handler without
   * using `$watch` to observe changes.
   * @param key
   * @param handler
   * @param value
   */
  function defineProperty (key, handler, value) {
    Object.defineProperty(ctrl, key, {
      get: function () { return value; },
      set: function (newValue) {
        var oldValue = value;
        value        = newValue;
        handler && handler(newValue, oldValue);
      }
    });
  }

  /**
   * Updates whether or not pagination should be displayed.
   */
  function updatePagination () {
    updatePagingWidth();
    ctrl.maxTabWidth = getMaxTabWidth();
    ctrl.shouldPaginate = shouldPaginate();
  }

  /**
   * Sets or clears fixed width for md-pagination-wrapper depending on if tabs should stretch.
   */
  function updatePagingWidth() {
    var elements = getElements();
    if (shouldStretchTabs()) {
      angular.element(elements.paging).css('width', '');
    } else {
      angular.element(elements.paging).css('width', calcPagingWidth() + 'px');
    }
  }

  /**
   * Calculates the width of the pagination wrapper by summing the widths of the dummy tabs.
   * @returns {number}
   */
  function calcPagingWidth () {
    return calcTabsWidth(getElements().dummies);
  }

  function calcTabsWidth(tabs) {
    var width = 0;

    angular.forEach(tabs, function (tab) {
      //-- Uses the larger value between `getBoundingClientRect().width` and `offsetWidth`.  This
      //   prevents `offsetWidth` value from being rounded down and causing wrapping issues, but
      //   also handles scenarios where `getBoundingClientRect()` is inaccurate (ie. tabs inside
      //   of a dialog)
      width += Math.max(tab.offsetWidth, tab.getBoundingClientRect().width);
    });

    return Math.ceil(width);
  }

  function getMaxTabWidth () {
    return $element.prop('clientWidth');
  }

  /**
   * Re-orders the tabs and updates the selected and focus indexes to their new positions.
   * This is triggered by `tabDirective.js` when the user's tabs have been re-ordered.
   */
  function updateTabOrder () {
    var selectedItem   = ctrl.tabs[ ctrl.selectedIndex ],
        focusItem      = ctrl.tabs[ ctrl.focusIndex ];
    ctrl.tabs          = ctrl.tabs.sort(function (a, b) {
      return a.index - b.index;
    });
    ctrl.selectedIndex = ctrl.tabs.indexOf(selectedItem);
    ctrl.focusIndex    = ctrl.tabs.indexOf(focusItem);
  }

  /**
   * This moves the selected or focus index left or right.  This is used by the keydown handler.
   * @param inc
   */
  function incrementIndex (inc, focus) {
    var newIndex,
        key   = focus ? 'focusIndex' : 'selectedIndex',
        index = ctrl[ key ];
    for (newIndex = index + inc;
         ctrl.tabs[ newIndex ] && ctrl.tabs[ newIndex ].scope.disabled;
         newIndex += inc) {}
    if (ctrl.tabs[ newIndex ]) {
      ctrl[ key ] = newIndex;
    }
  }

  /**
   * This is used to forward focus to dummy elements.  This method is necessary to avoid animation
   * issues when attempting to focus an item that is out of view.
   */
  function redirectFocus () {
    getElements().dummies[ ctrl.focusIndex ].focus();
  }

  /**
   * Forces the pagination to move the focused tab into view.
   */
  function adjustOffset (index) {
    var elements = getElements();

    if (index == null) index = ctrl.focusIndex;
    if (!elements.tabs[ index ]) return;
    if (ctrl.shouldCenterTabs) return;
    var tab         = elements.tabs[ index ],
        left        = tab.offsetLeft,
        right       = tab.offsetWidth + left;
    ctrl.offsetLeft = Math.max(ctrl.offsetLeft, fixOffset(right - elements.canvas.clientWidth + 32 * 2));
    ctrl.offsetLeft = Math.min(ctrl.offsetLeft, fixOffset(left));
  }

  /**
   * Iterates through all queued functions and clears the queue.  This is used for functions that
   * are called before the UI is ready, such as size calculations.
   */
  function processQueue () {
    queue.forEach(function (func) { $mdUtil.nextTick(func); });
    queue = [];
  }

  /**
   * Determines if the tab content area is needed.
   */
  function updateHasContent () {
    var hasContent  = false;
    angular.forEach(ctrl.tabs, function (tab) {
      if (tab.template) hasContent = true;
    });
    ctrl.hasContent = hasContent;
  }

  /**
   * Moves the indexes to their nearest valid values.
   */
  function refreshIndex () {
    ctrl.selectedIndex = getNearestSafeIndex(ctrl.selectedIndex);
    ctrl.focusIndex    = getNearestSafeIndex(ctrl.focusIndex);
  }

  /**
   * Calculates the content height of the current tab.
   * @returns {*}
   */
  function updateHeightFromContent () {
    if (!ctrl.dynamicHeight) return $element.css('height', '');
    if (!ctrl.tabs.length) return queue.push(updateHeightFromContent);

    var elements = getElements();

    var tabContent    = elements.contents[ ctrl.selectedIndex ],
        contentHeight = tabContent ? tabContent.offsetHeight : 0,
        tabsHeight    = elements.wrapper.offsetHeight,
        newHeight     = contentHeight + tabsHeight,
        currentHeight = $element.prop('clientHeight');

    if (currentHeight === newHeight) return;

    // Adjusts calculations for when the buttons are bottom-aligned since this relies on absolute
    // positioning.  This should probably be cleaned up if a cleaner solution is possible.
    if ($element.attr('md-align-tabs') === 'bottom') {
      currentHeight -= tabsHeight;
      newHeight -= tabsHeight;
      // Need to include bottom border in these calculations
      if ($element.attr('md-border-bottom') !== undefined) ++currentHeight;
    }

    // Lock during animation so the user can't change tabs
    locked = true;

    var fromHeight = { height: currentHeight + 'px' },
        toHeight = { height: newHeight + 'px' };

    // Set the height to the current, specific pixel height to fix a bug on iOS where the height
    // first animates to 0, then back to the proper height causing a visual glitch
    $element.css(fromHeight);

    // Animate the height from the old to the new
    $animateCss($element, {
      from: fromHeight,
      to: toHeight,
      easing: 'cubic-bezier(0.35, 0, 0.25, 1)',
      duration: 0.5
    }).start().done(function () {
      // Then (to fix the same iOS issue as above), disable transitions and remove the specific
      // pixel height so the height can size with browser width/content changes, etc.
      $element.css({
        transition: 'none',
        height: ''
      });

      // In the next tick, re-allow transitions (if we do it all at once, $element.css is "smart"
      // enough to batch it for us instead of doing it immediately, which undoes the original
      // transition: none)
      $mdUtil.nextTick(function() {
        $element.css('transition', '');
      });

      // And unlock so tab changes can occur
      locked = false;
    });
  }

  /**
   * Repositions the ink bar to the selected tab.
   * @returns {*}
   */
  function updateInkBarStyles () {
    var elements = getElements();

    if (!elements.tabs[ ctrl.selectedIndex ]) {
      angular.element(elements.inkBar).css({ left: 'auto', right: 'auto' });
      return;
    }

    if (!ctrl.tabs.length) return queue.push(ctrl.updateInkBarStyles);
    // if the element is not visible, we will not be able to calculate sizes until it is
    // we should treat that as a resize event rather than just updating the ink bar
    if (!$element.prop('offsetParent')) return handleResizeWhenVisible();

    var index      = ctrl.selectedIndex,
        totalWidth = elements.paging.offsetWidth,
        tab        = elements.tabs[ index ],
        left       = tab.offsetLeft,
        right      = totalWidth - left - tab.offsetWidth;

    if (ctrl.shouldCenterTabs) {
      // We need to use the same calculate process as in the pagination wrapper, to avoid rounding deviations.
      var tabWidth = calcTabsWidth(elements.tabs);

      if (totalWidth > tabWidth) {
        $mdUtil.nextTick(updateInkBarStyles, false);
      }
    }
    updateInkBarClassName();
    angular.element(elements.inkBar).css({ left: left + 'px', right: right + 'px' });
  }

  /**
   * Adds left/right classes so that the ink bar will animate properly.
   */
  function updateInkBarClassName () {
    var elements = getElements();
    var newIndex = ctrl.selectedIndex,
        oldIndex = ctrl.lastSelectedIndex,
        ink      = angular.element(elements.inkBar);
    if (!angular.isNumber(oldIndex)) return;
    ink
        .toggleClass('md-left', newIndex < oldIndex)
        .toggleClass('md-right', newIndex > oldIndex);
  }

  /**
   * Takes an offset value and makes sure that it is within the min/max allowed values.
   * @param value
   * @returns {*}
   */
  function fixOffset (value) {
    var elements = getElements();

    if (!elements.tabs.length || !ctrl.shouldPaginate) return 0;
    var lastTab    = elements.tabs[ elements.tabs.length - 1 ],
        totalWidth = lastTab.offsetLeft + lastTab.offsetWidth;
    value          = Math.max(0, value);
    value          = Math.min(totalWidth - elements.canvas.clientWidth, value);
    return value;
  }

  /**
   * Attaches a ripple to the tab item element.
   * @param scope
   * @param element
   */
  function attachRipple (scope, element) {
    var elements = getElements();
    var options = { colorElement: angular.element(elements.inkBar) };
    $mdTabInkRipple.attach(scope, element, options);
  }
}
MdTabsController.$inject = ["$scope", "$element", "$window", "$mdConstant", "$mdTabInkRipple", "$mdUtil", "$animateCss", "$attrs", "$compile", "$mdTheming"];

})();
(function(){
"use strict";

angular.module('material.components.tabs')
    .directive('mdTabScroll', MdTabScroll);

function MdTabScroll ($parse) {
  return {
    restrict: 'A',
    compile: function ($element, attr) {
      var fn = $parse(attr.mdTabScroll, null, true);
      return function ngEventHandler (scope, element) {
        element.on('mousewheel', function (event) {
          scope.$apply(function () { fn(scope, { $event: event }); });
        });
      };
    }
  }
}
MdTabScroll.$inject = ["$parse"];

})();
(function(){
"use strict";

/**
 * @ngdoc directive
 * @name mdTabs
 * @module material.components.tabs
 *
 * @restrict E
 *
 * @description
 * The `<md-tabs>` directive serves as the container for 1..n `<md-tab>` child directives to produces a Tabs components.
 * In turn, the nested `<md-tab>` directive is used to specify a tab label for the **header button** and a [optional] tab view
 * content that will be associated with each tab button.
 *
 * Below is the markup for its simplest usage:
 *
 *  <hljs lang="html">
 *  <md-tabs>
 *    <md-tab label="Tab #1"></md-tab>
 *    <md-tab label="Tab #2"></md-tab>
 *    <md-tab label="Tab #3"></md-tab>
 *  </md-tabs>
 *  </hljs>
 *
 * Tabs supports three (3) usage scenarios:
 *
 *  1. Tabs (buttons only)
 *  2. Tabs with internal view content
 *  3. Tabs with external view content
 *
 * **Tab-only** support is useful when tab buttons are used for custom navigation regardless of any other components, content, or views.
 * **Tabs with internal views** are the traditional usages where each tab has associated view content and the view switching is managed internally by the Tabs component.
 * **Tabs with external view content** is often useful when content associated with each tab is independently managed and data-binding notifications announce tab selection changes.
 *
 * Additional features also include:
 *
 * *  Content can include any markup.
 * *  If a tab is disabled while active/selected, then the next tab will be auto-selected.
 *
 * ### Explanation of tab stretching
 *
 * Initially, tabs will have an inherent size.  This size will either be defined by how much space is needed to accommodate their text or set by the user through CSS.  Calculations will be based on this size.
 *
 * On mobile devices, tabs will be expanded to fill the available horizontal space.  When this happens, all tabs will become the same size.
 *
 * On desktops, by default, stretching will never occur.
 *
 * This default behavior can be overridden through the `md-stretch-tabs` attribute.  Here is a table showing when stretching will occur:
 *
 * `md-stretch-tabs` | mobile    | desktop
 * ------------------|-----------|--------
 * `auto`            | stretched | ---
 * `always`          | stretched | stretched
 * `never`           | ---       | ---
 *
 * @param {integer=} md-selected Index of the active/selected tab
 * @param {boolean=} md-no-ink If present, disables ink ripple effects.
 * @param {boolean=} md-no-ink-bar If present, disables the selection ink bar.
 * @param {string=}  md-align-tabs Attribute to indicate position of tab buttons: `bottom` or `top`; default is `top`
 * @param {string=} md-stretch-tabs Attribute to indicate whether or not to stretch tabs: `auto`, `always`, or `never`; default is `auto`
 * @param {boolean=} md-dynamic-height When enabled, the tab wrapper will resize based on the contents of the selected tab
 * @param {boolean=} md-border-bottom If present, shows a solid `1px` border between the tabs and their content
 * @param {boolean=} md-center-tabs When enabled, tabs will be centered provided there is no need for pagination
 * @param {boolean=} md-no-pagination When enabled, pagination will remain off
 * @param {boolean=} md-swipe-content When enabled, swipe gestures will be enabled for the content area to jump between tabs
 * @param {boolean=} md-enable-disconnect When enabled, scopes will be disconnected for tabs that are not being displayed.  This provides a performance boost, but may also cause unexpected issues and is not recommended for most users.
 * @param {boolean=} md-autoselect When present, any tabs added after the initial load will be automatically selected
 * @param {boolean=} md-no-select-click When enabled, click events will not be fired when selecting tabs
 *
 * @usage
 * <hljs lang="html">
 * <md-tabs md-selected="selectedIndex" >
 *   <img ng-src="img/angular.png" class="centered">
 *   <md-tab
 *       ng-repeat="tab in tabs | orderBy:predicate:reversed"
 *       md-on-select="onTabSelected(tab)"
 *       md-on-deselect="announceDeselected(tab)"
 *       ng-disabled="tab.disabled">
 *     <md-tab-label>
 *       {{tab.title}}
 *       <img src="img/removeTab.png" ng-click="removeTab(tab)" class="delete">
 *     </md-tab-label>
 *     <md-tab-body>
 *       {{tab.content}}
 *     </md-tab-body>
 *   </md-tab>
 * </md-tabs>
 * </hljs>
 *
 */
angular
    .module('material.components.tabs')
    .directive('mdTabs', MdTabs);

function MdTabs ($$mdSvgRegistry) {
  return {
    scope:            {
      selectedIndex: '=?mdSelected'
    },
    template:         function (element, attr) {
      attr[ "$mdTabsTemplate" ] = element.html();
      return '' +
        '<md-tabs-wrapper> ' +
          '<md-tab-data></md-tab-data> ' +
          '<md-prev-button ' +
              'tabindex="-1" ' +
              'role="button" ' +
              'aria-label="Previous Page" ' +
              'aria-disabled="{{!$mdTabsCtrl.canPageBack()}}" ' +
              'ng-class="{ \'md-disabled\': !$mdTabsCtrl.canPageBack() }" ' +
              'ng-if="$mdTabsCtrl.shouldPaginate" ' +
              'ng-click="$mdTabsCtrl.previousPage()"> ' +
            '<md-icon md-svg-src="'+ $$mdSvgRegistry.mdTabsArrow +'"></md-icon> ' +
          '</md-prev-button> ' +
          '<md-next-button ' +
              'tabindex="-1" ' +
              'role="button" ' +
              'aria-label="Next Page" ' +
              'aria-disabled="{{!$mdTabsCtrl.canPageForward()}}" ' +
              'ng-class="{ \'md-disabled\': !$mdTabsCtrl.canPageForward() }" ' +
              'ng-if="$mdTabsCtrl.shouldPaginate" ' +
              'ng-click="$mdTabsCtrl.nextPage()"> ' +
            '<md-icon md-svg-src="'+ $$mdSvgRegistry.mdTabsArrow +'"></md-icon> ' +
          '</md-next-button> ' +
          '<md-tabs-canvas ' +
              'tabindex="{{ $mdTabsCtrl.hasFocus ? -1 : 0 }}" ' +
              'aria-activedescendant="tab-item-{{$mdTabsCtrl.tabs[$mdTabsCtrl.focusIndex].id}}" ' +
              'ng-focus="$mdTabsCtrl.redirectFocus()" ' +
              'ng-class="{ ' +
                  '\'md-paginated\': $mdTabsCtrl.shouldPaginate, ' +
                  '\'md-center-tabs\': $mdTabsCtrl.shouldCenterTabs ' +
              '}" ' +
              'ng-keydown="$mdTabsCtrl.keydown($event)" ' +
              'role="tablist"> ' +
            '<md-pagination-wrapper ' +
                'ng-class="{ \'md-center-tabs\': $mdTabsCtrl.shouldCenterTabs }" ' +
                'md-tab-scroll="$mdTabsCtrl.scroll($event)"> ' +
              '<md-tab-item ' +
                  'tabindex="-1" ' +
                  'class="md-tab" ' +
                  'ng-repeat="tab in $mdTabsCtrl.tabs" ' +
                  'role="tab" ' +
                  'aria-controls="tab-content-{{::tab.id}}" ' +
                  'aria-selected="{{tab.isActive()}}" ' +
                  'aria-disabled="{{tab.scope.disabled || \'false\'}}" ' +
                  'ng-click="$mdTabsCtrl.select(tab.getIndex())" ' +
                  'ng-class="{ ' +
                      '\'md-active\':    tab.isActive(), ' +
                      '\'md-focused\':   tab.hasFocus(), ' +
                      '\'md-disabled\':  tab.scope.disabled ' +
                  '}" ' +
                  'ng-disabled="tab.scope.disabled" ' +
                  'md-swipe-left="$mdTabsCtrl.nextPage()" ' +
                  'md-swipe-right="$mdTabsCtrl.previousPage()" ' +
                  'md-tabs-template="::tab.label" ' +
                  'md-scope="::tab.parent"></md-tab-item> ' +
              '<md-ink-bar></md-ink-bar> ' +
            '</md-pagination-wrapper> ' +
            '<md-tabs-dummy-wrapper class="md-visually-hidden md-dummy-wrapper"> ' +
              '<md-dummy-tab ' +
                  'class="md-tab" ' +
                  'tabindex="-1" ' +
                  'id="tab-item-{{::tab.id}}" ' +
                  'role="tab" ' +
                  'aria-controls="tab-content-{{::tab.id}}" ' +
                  'aria-selected="{{tab.isActive()}}" ' +
                  'aria-disabled="{{tab.scope.disabled || \'false\'}}" ' +
                  'ng-focus="$mdTabsCtrl.hasFocus = true" ' +
                  'ng-blur="$mdTabsCtrl.hasFocus = false" ' +
                  'ng-repeat="tab in $mdTabsCtrl.tabs" ' +
                  'md-tabs-template="::tab.label" ' +
                  'md-scope="::tab.parent"></md-dummy-tab> ' +
            '</md-tabs-dummy-wrapper> ' +
          '</md-tabs-canvas> ' +
        '</md-tabs-wrapper> ' +
        '<md-tabs-content-wrapper ng-show="$mdTabsCtrl.hasContent && $mdTabsCtrl.selectedIndex >= 0" class="_md"> ' +
          '<md-tab-content ' +
              'id="tab-content-{{::tab.id}}" ' +
              'class="_md" ' +
              'role="tabpanel" ' +
              'aria-labelledby="tab-item-{{::tab.id}}" ' +
              'md-swipe-left="$mdTabsCtrl.swipeContent && $mdTabsCtrl.incrementIndex(1)" ' +
              'md-swipe-right="$mdTabsCtrl.swipeContent && $mdTabsCtrl.incrementIndex(-1)" ' +
              'ng-if="$mdTabsCtrl.hasContent" ' +
              'ng-repeat="(index, tab) in $mdTabsCtrl.tabs" ' +
              'ng-class="{ ' +
                '\'md-no-transition\': $mdTabsCtrl.lastSelectedIndex == null, ' +
                '\'md-active\':        tab.isActive(), ' +
                '\'md-left\':          tab.isLeft(), ' +
                '\'md-right\':         tab.isRight(), ' +
                '\'md-no-scroll\':     $mdTabsCtrl.dynamicHeight ' +
              '}"> ' +
            '<div ' +
                'md-tabs-template="::tab.template" ' +
                'md-connected-if="tab.isActive()" ' +
                'md-scope="::tab.parent" ' +
                'ng-if="$mdTabsCtrl.enableDisconnect || tab.shouldRender()"></div> ' +
          '</md-tab-content> ' +
        '</md-tabs-content-wrapper>';
    },
    controller:       'MdTabsController',
    controllerAs:     '$mdTabsCtrl',
    bindToController: true
  };
}
MdTabs.$inject = ["$$mdSvgRegistry"];

})();
(function(){
"use strict";

angular
  .module('material.components.tabs')
  .directive('mdTabsDummyWrapper', MdTabsDummyWrapper);

/**
 * @private
 *
 * @param $mdUtil
 * @returns {{require: string, link: link}}
 * @constructor
 * 
 * @ngInject
 */
function MdTabsDummyWrapper ($mdUtil) {
  return {
    require: '^?mdTabs',
    link:    function link (scope, element, attr, ctrl) {
      if (!ctrl) return;

      var observer = new MutationObserver(function(mutations) {
        ctrl.updatePagination();
        ctrl.updateInkBarStyles();
      });

      var config = {
        childList: true,
        subtree: true,
        // Per https://bugzilla.mozilla.org/show_bug.cgi?id=1138368, browsers will not fire
        // the childList mutation, once a <span> element's innerText changes.
        // The characterData of the <span> element will change.
        characterData: true
      };

      observer.observe(element[0], config);

      // Disconnect the observer
      scope.$on('$destroy', function() {
        if (observer) {
          observer.disconnect();
        }
      });
    }
  };
}
MdTabsDummyWrapper.$inject = ["$mdUtil"];

})();
(function(){
"use strict";

angular
    .module('material.components.tabs')
    .directive('mdTabsTemplate', MdTabsTemplate);

function MdTabsTemplate ($compile, $mdUtil) {
  return {
    restrict: 'A',
    link:     link,
    scope:    {
      template:     '=mdTabsTemplate',
      connected:    '=?mdConnectedIf',
      compileScope: '=mdScope'
    },
    require:  '^?mdTabs'
  };
  function link (scope, element, attr, ctrl) {
    if (!ctrl) return;

    var compileScope = ctrl.enableDisconnect ? scope.compileScope.$new() : scope.compileScope;

    element.html(scope.template);
    $compile(element.contents())(compileScope);

    return $mdUtil.nextTick(handleScope);

    function handleScope () {
      scope.$watch('connected', function (value) { value === false ? disconnect() : reconnect(); });
      scope.$on('$destroy', reconnect);
    }

    function disconnect () {
      if (ctrl.enableDisconnect) $mdUtil.disconnectScope(compileScope);
    }

    function reconnect () {
      if (ctrl.enableDisconnect) $mdUtil.reconnectScope(compileScope);
    }
  }
}
MdTabsTemplate.$inject = ["$compile", "$mdUtil"];

})();
(function(){ 
angular.module("material.core").constant("$MD_THEME_CSS", ".md-button.md-THEME_NAME-theme:not([disabled]):hover {  background-color: '{{background-500-0.2}}'; }.md-button.md-THEME_NAME-theme:not([disabled]).md-focused {  background-color: '{{background-500-0.2}}'; }.md-button.md-THEME_NAME-theme:not([disabled]).md-icon-button:hover {  background-color: transparent; }.md-button.md-THEME_NAME-theme.md-fab {  background-color: '{{accent-color}}';  color: '{{accent-contrast}}'; }  .md-button.md-THEME_NAME-theme.md-fab md-icon {    color: '{{accent-contrast}}'; }  .md-button.md-THEME_NAME-theme.md-fab:not([disabled]):hover {    background-color: '{{accent-A700}}'; }  .md-button.md-THEME_NAME-theme.md-fab:not([disabled]).md-focused {    background-color: '{{accent-A700}}'; }.md-button.md-THEME_NAME-theme.md-primary {  color: '{{primary-color}}'; }  .md-button.md-THEME_NAME-theme.md-primary.md-raised, .md-button.md-THEME_NAME-theme.md-primary.md-fab {    color: '{{primary-contrast}}';    background-color: '{{primary-color}}'; }    .md-button.md-THEME_NAME-theme.md-primary.md-raised:not([disabled]) md-icon, .md-button.md-THEME_NAME-theme.md-primary.md-fab:not([disabled]) md-icon {      color: '{{primary-contrast}}'; }    .md-button.md-THEME_NAME-theme.md-primary.md-raised:not([disabled]):hover, .md-button.md-THEME_NAME-theme.md-primary.md-fab:not([disabled]):hover {      background-color: '{{primary-600}}'; }    .md-button.md-THEME_NAME-theme.md-primary.md-raised:not([disabled]).md-focused, .md-button.md-THEME_NAME-theme.md-primary.md-fab:not([disabled]).md-focused {      background-color: '{{primary-600}}'; }  .md-button.md-THEME_NAME-theme.md-primary:not([disabled]) md-icon {    color: '{{primary-color}}'; }.md-button.md-THEME_NAME-theme.md-fab {  background-color: '{{accent-color}}';  color: '{{accent-contrast}}'; }  .md-button.md-THEME_NAME-theme.md-fab:not([disabled]) .md-icon {    color: '{{accent-contrast}}'; }  .md-button.md-THEME_NAME-theme.md-fab:not([disabled]):hover {    background-color: '{{accent-A700}}'; }  .md-button.md-THEME_NAME-theme.md-fab:not([disabled]).md-focused {    background-color: '{{accent-A700}}'; }.md-button.md-THEME_NAME-theme.md-raised {  color: '{{background-900}}';  background-color: '{{background-50}}'; }  .md-button.md-THEME_NAME-theme.md-raised:not([disabled]) md-icon {    color: '{{background-900}}'; }  .md-button.md-THEME_NAME-theme.md-raised:not([disabled]):hover {    background-color: '{{background-50}}'; }  .md-button.md-THEME_NAME-theme.md-raised:not([disabled]).md-focused {    background-color: '{{background-200}}'; }.md-button.md-THEME_NAME-theme.md-warn {  color: '{{warn-color}}'; }  .md-button.md-THEME_NAME-theme.md-warn.md-raised, .md-button.md-THEME_NAME-theme.md-warn.md-fab {    color: '{{warn-contrast}}';    background-color: '{{warn-color}}'; }    .md-button.md-THEME_NAME-theme.md-warn.md-raised:not([disabled]) md-icon, .md-button.md-THEME_NAME-theme.md-warn.md-fab:not([disabled]) md-icon {      color: '{{warn-contrast}}'; }    .md-button.md-THEME_NAME-theme.md-warn.md-raised:not([disabled]):hover, .md-button.md-THEME_NAME-theme.md-warn.md-fab:not([disabled]):hover {      background-color: '{{warn-600}}'; }    .md-button.md-THEME_NAME-theme.md-warn.md-raised:not([disabled]).md-focused, .md-button.md-THEME_NAME-theme.md-warn.md-fab:not([disabled]).md-focused {      background-color: '{{warn-600}}'; }  .md-button.md-THEME_NAME-theme.md-warn:not([disabled]) md-icon {    color: '{{warn-color}}'; }.md-button.md-THEME_NAME-theme.md-accent {  color: '{{accent-color}}'; }  .md-button.md-THEME_NAME-theme.md-accent.md-raised, .md-button.md-THEME_NAME-theme.md-accent.md-fab {    color: '{{accent-contrast}}';    background-color: '{{accent-color}}'; }    .md-button.md-THEME_NAME-theme.md-accent.md-raised:not([disabled]) md-icon, .md-button.md-THEME_NAME-theme.md-accent.md-fab:not([disabled]) md-icon {      color: '{{accent-contrast}}'; }    .md-button.md-THEME_NAME-theme.md-accent.md-raised:not([disabled]):hover, .md-button.md-THEME_NAME-theme.md-accent.md-fab:not([disabled]):hover {      background-color: '{{accent-A700}}'; }    .md-button.md-THEME_NAME-theme.md-accent.md-raised:not([disabled]).md-focused, .md-button.md-THEME_NAME-theme.md-accent.md-fab:not([disabled]).md-focused {      background-color: '{{accent-A700}}'; }  .md-button.md-THEME_NAME-theme.md-accent:not([disabled]) md-icon {    color: '{{accent-color}}'; }.md-button.md-THEME_NAME-theme[disabled], .md-button.md-THEME_NAME-theme.md-raised[disabled], .md-button.md-THEME_NAME-theme.md-fab[disabled], .md-button.md-THEME_NAME-theme.md-accent[disabled], .md-button.md-THEME_NAME-theme.md-warn[disabled] {  color: '{{foreground-3}}';  cursor: default; }  .md-button.md-THEME_NAME-theme[disabled] md-icon, .md-button.md-THEME_NAME-theme.md-raised[disabled] md-icon, .md-button.md-THEME_NAME-theme.md-fab[disabled] md-icon, .md-button.md-THEME_NAME-theme.md-accent[disabled] md-icon, .md-button.md-THEME_NAME-theme.md-warn[disabled] md-icon {    color: '{{foreground-3}}'; }.md-button.md-THEME_NAME-theme.md-raised[disabled], .md-button.md-THEME_NAME-theme.md-fab[disabled] {  background-color: '{{foreground-4}}'; }.md-button.md-THEME_NAME-theme[disabled] {  background-color: transparent; }._md a.md-THEME_NAME-theme:not(.md-button).md-primary {  color: '{{primary-color}}'; }  ._md a.md-THEME_NAME-theme:not(.md-button).md-primary:hover {    color: '{{primary-700}}'; }._md a.md-THEME_NAME-theme:not(.md-button).md-accent {  color: '{{accent-color}}'; }  ._md a.md-THEME_NAME-theme:not(.md-button).md-accent:hover {    color: '{{accent-700}}'; }._md a.md-THEME_NAME-theme:not(.md-button).md-accent {  color: '{{accent-color}}'; }  ._md a.md-THEME_NAME-theme:not(.md-button).md-accent:hover {    color: '{{accent-A700}}'; }._md a.md-THEME_NAME-theme:not(.md-button).md-warn {  color: '{{warn-color}}'; }  ._md a.md-THEME_NAME-theme:not(.md-button).md-warn:hover {    color: '{{warn-700}}'; }md-dialog.md-THEME_NAME-theme {  border-radius: 4px;  background-color: '{{background-hue-1}}';  color: '{{foreground-1}}'; }  md-dialog.md-THEME_NAME-theme.md-content-overflow .md-actions, md-dialog.md-THEME_NAME-theme.md-content-overflow md-dialog-actions {    border-top-color: '{{foreground-4}}'; }md-autocomplete.md-THEME_NAME-theme {  background: '{{background-A100}}'; }  md-autocomplete.md-THEME_NAME-theme[disabled]:not([md-floating-label]) {    background: '{{background-100}}'; }  md-autocomplete.md-THEME_NAME-theme button md-icon path {    fill: '{{background-600}}'; }  md-autocomplete.md-THEME_NAME-theme button:after {    background: '{{background-600-0.3}}'; }.md-autocomplete-suggestions-container.md-THEME_NAME-theme {  background: '{{background-A100}}'; }  .md-autocomplete-suggestions-container.md-THEME_NAME-theme li {    color: '{{background-900}}'; }    .md-autocomplete-suggestions-container.md-THEME_NAME-theme li .highlight {      color: '{{background-600}}'; }    .md-autocomplete-suggestions-container.md-THEME_NAME-theme li:hover, .md-autocomplete-suggestions-container.md-THEME_NAME-theme li.selected {      background: '{{background-200}}'; }md-content.md-THEME_NAME-theme {  color: '{{foreground-1}}';  background-color: '{{background-default}}'; }md-icon.md-THEME_NAME-theme {  color: '{{foreground-2}}'; }  md-icon.md-THEME_NAME-theme.md-primary {    color: '{{primary-color}}'; }  md-icon.md-THEME_NAME-theme.md-accent {    color: '{{accent-color}}'; }  md-icon.md-THEME_NAME-theme.md-warn {    color: '{{warn-color}}'; }md-slider.md-THEME_NAME-theme .md-track {  background-color: '{{foreground-3}}'; }md-slider.md-THEME_NAME-theme .md-track-ticks {  color: '{{background-contrast}}'; }md-slider.md-THEME_NAME-theme .md-focus-ring {  background-color: '{{accent-A200-0.2}}'; }md-slider.md-THEME_NAME-theme .md-disabled-thumb {  border-color: '{{background-color}}';  background-color: '{{background-color}}'; }md-slider.md-THEME_NAME-theme.md-min .md-thumb:after {  background-color: '{{background-color}}';  border-color: '{{foreground-3}}'; }md-slider.md-THEME_NAME-theme.md-min .md-focus-ring {  background-color: '{{foreground-3-0.38}}'; }md-slider.md-THEME_NAME-theme.md-min[md-discrete] .md-thumb:after {  background-color: '{{background-contrast}}';  border-color: transparent; }md-slider.md-THEME_NAME-theme.md-min[md-discrete] .md-sign {  background-color: '{{background-400}}'; }  md-slider.md-THEME_NAME-theme.md-min[md-discrete] .md-sign:after {    border-top-color: '{{background-400}}'; }md-slider.md-THEME_NAME-theme.md-min[md-discrete][md-vertical] .md-sign:after {  border-top-color: transparent;  border-left-color: '{{background-400}}'; }md-slider.md-THEME_NAME-theme .md-track.md-track-fill {  background-color: '{{accent-color}}'; }md-slider.md-THEME_NAME-theme .md-thumb:after {  border-color: '{{accent-color}}';  background-color: '{{accent-color}}'; }md-slider.md-THEME_NAME-theme .md-sign {  background-color: '{{accent-color}}'; }  md-slider.md-THEME_NAME-theme .md-sign:after {    border-top-color: '{{accent-color}}'; }md-slider.md-THEME_NAME-theme[md-vertical] .md-sign:after {  border-top-color: transparent;  border-left-color: '{{accent-color}}'; }md-slider.md-THEME_NAME-theme .md-thumb-text {  color: '{{accent-contrast}}'; }md-slider.md-THEME_NAME-theme.md-warn .md-focus-ring {  background-color: '{{warn-200-0.38}}'; }md-slider.md-THEME_NAME-theme.md-warn .md-track.md-track-fill {  background-color: '{{warn-color}}'; }md-slider.md-THEME_NAME-theme.md-warn .md-thumb:after {  border-color: '{{warn-color}}';  background-color: '{{warn-color}}'; }md-slider.md-THEME_NAME-theme.md-warn .md-sign {  background-color: '{{warn-color}}'; }  md-slider.md-THEME_NAME-theme.md-warn .md-sign:after {    border-top-color: '{{warn-color}}'; }md-slider.md-THEME_NAME-theme.md-warn[md-vertical] .md-sign:after {  border-top-color: transparent;  border-left-color: '{{warn-color}}'; }md-slider.md-THEME_NAME-theme.md-warn .md-thumb-text {  color: '{{warn-contrast}}'; }md-slider.md-THEME_NAME-theme.md-primary .md-focus-ring {  background-color: '{{primary-200-0.38}}'; }md-slider.md-THEME_NAME-theme.md-primary .md-track.md-track-fill {  background-color: '{{primary-color}}'; }md-slider.md-THEME_NAME-theme.md-primary .md-thumb:after {  border-color: '{{primary-color}}';  background-color: '{{primary-color}}'; }md-slider.md-THEME_NAME-theme.md-primary .md-sign {  background-color: '{{primary-color}}'; }  md-slider.md-THEME_NAME-theme.md-primary .md-sign:after {    border-top-color: '{{primary-color}}'; }md-slider.md-THEME_NAME-theme.md-primary[md-vertical] .md-sign:after {  border-top-color: transparent;  border-left-color: '{{primary-color}}'; }md-slider.md-THEME_NAME-theme.md-primary .md-thumb-text {  color: '{{primary-contrast}}'; }md-slider.md-THEME_NAME-theme[disabled] .md-thumb:after {  border-color: transparent; }md-slider.md-THEME_NAME-theme[disabled]:not(.md-min) .md-thumb:after, md-slider.md-THEME_NAME-theme[disabled][md-discrete] .md-thumb:after {  background-color: '{{foreground-3}}';  border-color: transparent; }md-slider.md-THEME_NAME-theme[disabled][readonly] .md-sign {  background-color: '{{background-400}}'; }  md-slider.md-THEME_NAME-theme[disabled][readonly] .md-sign:after {    border-top-color: '{{background-400}}'; }md-slider.md-THEME_NAME-theme[disabled][readonly][md-vertical] .md-sign:after {  border-top-color: transparent;  border-left-color: '{{background-400}}'; }md-slider.md-THEME_NAME-theme[disabled][readonly] .md-disabled-thumb {  border-color: transparent;  background-color: transparent; }md-slider-container[disabled] > *:first-child:not(md-slider),md-slider-container[disabled] > *:last-child:not(md-slider) {  color: '{{foreground-3}}'; }md-switch.md-THEME_NAME-theme .md-ink-ripple {  color: '{{background-500}}'; }md-switch.md-THEME_NAME-theme .md-thumb {  background-color: '{{background-50}}'; }md-switch.md-THEME_NAME-theme .md-bar {  background-color: '{{background-500}}'; }md-switch.md-THEME_NAME-theme.md-checked .md-ink-ripple {  color: '{{accent-color}}'; }md-switch.md-THEME_NAME-theme.md-checked .md-thumb {  background-color: '{{accent-color}}'; }md-switch.md-THEME_NAME-theme.md-checked .md-bar {  background-color: '{{accent-color-0.5}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-focused .md-thumb:before {  background-color: '{{accent-color-0.26}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-primary .md-ink-ripple {  color: '{{primary-color}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-primary .md-thumb {  background-color: '{{primary-color}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-primary .md-bar {  background-color: '{{primary-color-0.5}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-primary.md-focused .md-thumb:before {  background-color: '{{primary-color-0.26}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-warn .md-ink-ripple {  color: '{{warn-color}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-warn .md-thumb {  background-color: '{{warn-color}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-warn .md-bar {  background-color: '{{warn-color-0.5}}'; }md-switch.md-THEME_NAME-theme.md-checked.md-warn.md-focused .md-thumb:before {  background-color: '{{warn-color-0.26}}'; }md-switch.md-THEME_NAME-theme[disabled] .md-thumb {  background-color: '{{background-400}}'; }md-switch.md-THEME_NAME-theme[disabled] .md-bar {  background-color: '{{foreground-4}}'; }md-tabs.md-THEME_NAME-theme md-tabs-wrapper {  background-color: transparent;  border-color: '{{foreground-4}}'; }md-tabs.md-THEME_NAME-theme .md-paginator md-icon {  color: '{{primary-color}}'; }md-tabs.md-THEME_NAME-theme md-ink-bar {  color: '{{accent-color}}';  background: '{{accent-color}}'; }md-tabs.md-THEME_NAME-theme .md-tab {  color: '{{foreground-2}}'; }  md-tabs.md-THEME_NAME-theme .md-tab[disabled], md-tabs.md-THEME_NAME-theme .md-tab[disabled] md-icon {    color: '{{foreground-3}}'; }  md-tabs.md-THEME_NAME-theme .md-tab.md-active, md-tabs.md-THEME_NAME-theme .md-tab.md-active md-icon, md-tabs.md-THEME_NAME-theme .md-tab.md-focused, md-tabs.md-THEME_NAME-theme .md-tab.md-focused md-icon {    color: '{{primary-color}}'; }  md-tabs.md-THEME_NAME-theme .md-tab.md-focused {    background: '{{primary-color-0.1}}'; }  md-tabs.md-THEME_NAME-theme .md-tab .md-ripple-container {    color: '{{accent-A100}}'; }md-tabs.md-THEME_NAME-theme.md-accent > md-tabs-wrapper {  background-color: '{{accent-color}}'; }  md-tabs.md-THEME_NAME-theme.md-accent > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]) {    color: '{{accent-A100}}'; }    md-tabs.md-THEME_NAME-theme.md-accent > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active, md-tabs.md-THEME_NAME-theme.md-accent > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active md-icon, md-tabs.md-THEME_NAME-theme.md-accent > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused, md-tabs.md-THEME_NAME-theme.md-accent > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused md-icon {      color: '{{accent-contrast}}'; }    md-tabs.md-THEME_NAME-theme.md-accent > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused {      background: '{{accent-contrast-0.1}}'; }  md-tabs.md-THEME_NAME-theme.md-accent > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-ink-bar {    color: '{{primary-600-1}}';    background: '{{primary-600-1}}'; }md-tabs.md-THEME_NAME-theme.md-primary > md-tabs-wrapper {  background-color: '{{primary-color}}'; }  md-tabs.md-THEME_NAME-theme.md-primary > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]) {    color: '{{primary-100}}'; }    md-tabs.md-THEME_NAME-theme.md-primary > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active, md-tabs.md-THEME_NAME-theme.md-primary > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active md-icon, md-tabs.md-THEME_NAME-theme.md-primary > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused, md-tabs.md-THEME_NAME-theme.md-primary > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused md-icon {      color: '{{primary-contrast}}'; }    md-tabs.md-THEME_NAME-theme.md-primary > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused {      background: '{{primary-contrast-0.1}}'; }md-tabs.md-THEME_NAME-theme.md-warn > md-tabs-wrapper {  background-color: '{{warn-color}}'; }  md-tabs.md-THEME_NAME-theme.md-warn > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]) {    color: '{{warn-100}}'; }    md-tabs.md-THEME_NAME-theme.md-warn > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active, md-tabs.md-THEME_NAME-theme.md-warn > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active md-icon, md-tabs.md-THEME_NAME-theme.md-warn > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused, md-tabs.md-THEME_NAME-theme.md-warn > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused md-icon {      color: '{{warn-contrast}}'; }    md-tabs.md-THEME_NAME-theme.md-warn > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused {      background: '{{warn-contrast-0.1}}'; }md-toolbar > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper {  background-color: '{{primary-color}}'; }  md-toolbar > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]) {    color: '{{primary-100}}'; }    md-toolbar > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active, md-toolbar > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active md-icon, md-toolbar > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused, md-toolbar > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused md-icon {      color: '{{primary-contrast}}'; }    md-toolbar > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused {      background: '{{primary-contrast-0.1}}'; }md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper {  background-color: '{{accent-color}}'; }  md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]) {    color: '{{accent-A100}}'; }    md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active, md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active md-icon, md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused, md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused md-icon {      color: '{{accent-contrast}}'; }    md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused {      background: '{{accent-contrast-0.1}}'; }  md-toolbar.md-accent > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-ink-bar {    color: '{{primary-600-1}}';    background: '{{primary-600-1}}'; }md-toolbar.md-warn > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper {  background-color: '{{warn-color}}'; }  md-toolbar.md-warn > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]) {    color: '{{warn-100}}'; }    md-toolbar.md-warn > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active, md-toolbar.md-warn > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-active md-icon, md-toolbar.md-warn > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused, md-toolbar.md-warn > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused md-icon {      color: '{{warn-contrast}}'; }    md-toolbar.md-warn > md-tabs.md-THEME_NAME-theme > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:not([disabled]).md-focused {      background: '{{warn-contrast-0.1}}'; }md-toast.md-THEME_NAME-theme .md-toast-content {  background-color: #323232;  color: '{{background-50}}'; }  md-toast.md-THEME_NAME-theme .md-toast-content .md-button {    color: '{{background-50}}'; }    md-toast.md-THEME_NAME-theme .md-toast-content .md-button.md-highlight {      color: '{{accent-color}}'; }      md-toast.md-THEME_NAME-theme .md-toast-content .md-button.md-highlight.md-primary {        color: '{{primary-color}}'; }      md-toast.md-THEME_NAME-theme .md-toast-content .md-button.md-highlight.md-warn {        color: '{{warn-color}}'; }md-toolbar.md-THEME_NAME-theme:not(.md-menu-toolbar) {  background-color: '{{primary-color}}';  color: '{{primary-contrast}}'; }  md-toolbar.md-THEME_NAME-theme:not(.md-menu-toolbar) md-icon {    color: '{{primary-contrast}}';    fill: '{{primary-contrast}}'; }  md-toolbar.md-THEME_NAME-theme:not(.md-menu-toolbar) .md-button[disabled] md-icon {    color: '{{primary-contrast-0.26}}';    fill: '{{primary-contrast-0.26}}'; }  md-toolbar.md-THEME_NAME-theme:not(.md-menu-toolbar).md-accent {    background-color: '{{accent-color}}';    color: '{{accent-contrast}}'; }    md-toolbar.md-THEME_NAME-theme:not(.md-menu-toolbar).md-accent .md-ink-ripple {      color: '{{accent-contrast}}'; }    md-toolbar.md-THEME_NAME-theme:not(.md-menu-toolbar).md-accent md-icon {      color: '{{accent-contrast}}';      fill: '{{accent-contrast}}'; }    md-toolbar.md-THEME_NAME-theme:not(.md-menu-toolbar).md-accent .md-button[disabled] md-icon {      color: '{{accent-contrast-0.26}}';      fill: '{{accent-contrast-0.26}}'; }  md-toolbar.md-THEME_NAME-theme:not(.md-menu-toolbar).md-warn {    background-color: '{{warn-color}}';    color: '{{warn-contrast}}'; }md-tooltip.md-THEME_NAME-theme {  color: '{{background-A100}}'; }  md-tooltip.md-THEME_NAME-theme .md-content {    background-color: '{{foreground-2}}'; }md-checkbox.md-THEME_NAME-theme .md-ripple {  color: '{{accent-A700}}'; }md-checkbox.md-THEME_NAME-theme.md-checked .md-ripple {  color: '{{background-600}}'; }md-checkbox.md-THEME_NAME-theme.md-checked.md-focused .md-container:before {  background-color: '{{accent-color-0.26}}'; }md-checkbox.md-THEME_NAME-theme .md-ink-ripple {  color: '{{foreground-2}}'; }md-checkbox.md-THEME_NAME-theme.md-checked .md-ink-ripple {  color: '{{accent-color-0.87}}'; }md-checkbox.md-THEME_NAME-theme:not(.md-checked) .md-icon {  border-color: '{{foreground-2}}'; }md-checkbox.md-THEME_NAME-theme.md-checked .md-icon {  background-color: '{{accent-color-0.87}}'; }md-checkbox.md-THEME_NAME-theme.md-checked .md-icon:after {  border-color: '{{accent-contrast-0.87}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary .md-ripple {  color: '{{primary-600}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-ripple {  color: '{{background-600}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary .md-ink-ripple {  color: '{{foreground-2}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-ink-ripple {  color: '{{primary-color-0.87}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary:not(.md-checked) .md-icon {  border-color: '{{foreground-2}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-icon {  background-color: '{{primary-color-0.87}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked.md-focused .md-container:before {  background-color: '{{primary-color-0.26}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.md-checked .md-icon:after {  border-color: '{{primary-contrast-0.87}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary .md-indeterminate[disabled] .md-container {  color: '{{foreground-3}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn .md-ripple {  color: '{{warn-600}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn .md-ink-ripple {  color: '{{foreground-2}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked .md-ink-ripple {  color: '{{warn-color-0.87}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn:not(.md-checked) .md-icon {  border-color: '{{foreground-2}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked .md-icon {  background-color: '{{warn-color-0.87}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked.md-focused:not([disabled]) .md-container:before {  background-color: '{{warn-color-0.26}}'; }md-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn.md-checked .md-icon:after {  border-color: '{{background-200}}'; }md-checkbox.md-THEME_NAME-theme[disabled]:not(.md-checked) .md-icon {  border-color: '{{foreground-3}}'; }md-checkbox.md-THEME_NAME-theme[disabled].md-checked .md-icon {  background-color: '{{foreground-3}}'; }md-checkbox.md-THEME_NAME-theme[disabled].md-checked .md-icon:after {  border-color: '{{background-200}}'; }md-checkbox.md-THEME_NAME-theme[disabled] .md-icon:after {  border-color: '{{foreground-3}}'; }md-checkbox.md-THEME_NAME-theme[disabled] .md-label {  color: '{{foreground-3}}'; }md-list.md-THEME_NAME-theme md-list-item.md-2-line .md-list-item-text h3, md-list.md-THEME_NAME-theme md-list-item.md-2-line .md-list-item-text h4,md-list.md-THEME_NAME-theme md-list-item.md-3-line .md-list-item-text h3,md-list.md-THEME_NAME-theme md-list-item.md-3-line .md-list-item-text h4 {  color: '{{foreground-1}}'; }md-list.md-THEME_NAME-theme md-list-item.md-2-line .md-list-item-text p,md-list.md-THEME_NAME-theme md-list-item.md-3-line .md-list-item-text p {  color: '{{foreground-2}}'; }md-list.md-THEME_NAME-theme .md-proxy-focus.md-focused div.md-no-style {  background-color: '{{background-100}}'; }md-list.md-THEME_NAME-theme md-list-item .md-avatar-icon {  background-color: '{{foreground-3}}';  color: '{{background-color}}'; }md-list.md-THEME_NAME-theme md-list-item > md-icon {  color: '{{foreground-2}}'; }  md-list.md-THEME_NAME-theme md-list-item > md-icon.md-highlight {    color: '{{primary-color}}'; }    md-list.md-THEME_NAME-theme md-list-item > md-icon.md-highlight.md-accent {      color: '{{accent-color}}'; }/*  Only used with Theme processes */html.md-THEME_NAME-theme, body.md-THEME_NAME-theme {  color: '{{foreground-1}}';  background-color: '{{background-color}}'; }md-backdrop {  background-color: '{{background-900-0.0}}'; }  md-backdrop.md-opaque.md-THEME_NAME-theme {    background-color: '{{background-900-1.0}}'; }md-input-container.md-THEME_NAME-theme .md-input {  color: '{{foreground-1}}';  border-color: '{{foreground-4}}'; }  md-input-container.md-THEME_NAME-theme .md-input::-webkit-input-placeholder {    color: '{{foreground-3}}'; }  md-input-container.md-THEME_NAME-theme .md-input:-moz-placeholder {    color: '{{foreground-3}}'; }  md-input-container.md-THEME_NAME-theme .md-input::-moz-placeholder {    color: '{{foreground-3}}'; }  md-input-container.md-THEME_NAME-theme .md-input:-ms-input-placeholder {    color: '{{foreground-3}}'; }  md-input-container.md-THEME_NAME-theme .md-input::-webkit-input-placeholder {    color: '{{foreground-3}}'; }md-input-container.md-THEME_NAME-theme > md-icon {  color: '{{foreground-1}}'; }md-input-container.md-THEME_NAME-theme label,md-input-container.md-THEME_NAME-theme .md-placeholder {  color: '{{foreground-3}}'; }md-input-container.md-THEME_NAME-theme label.md-required:after {  color: '{{warn-A700}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-focused):not(.md-input-invalid) label.md-required:after {  color: '{{foreground-2}}'; }md-input-container.md-THEME_NAME-theme .md-input-messages-animation, md-input-container.md-THEME_NAME-theme .md-input-message-animation {  color: '{{warn-A700}}'; }  md-input-container.md-THEME_NAME-theme .md-input-messages-animation .md-char-counter, md-input-container.md-THEME_NAME-theme .md-input-message-animation .md-char-counter {    color: '{{foreground-1}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-has-value label {  color: '{{foreground-2}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused .md-input, md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-resized .md-input {  border-color: '{{primary-color}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused label,md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused md-icon {  color: '{{primary-color}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-accent .md-input {  border-color: '{{accent-color}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-accent label,md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-accent md-icon {  color: '{{accent-color}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-warn .md-input {  border-color: '{{warn-A700}}'; }md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-warn label,md-input-container.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-warn md-icon {  color: '{{warn-A700}}'; }md-input-container.md-THEME_NAME-theme.md-input-invalid .md-input {  border-color: '{{warn-A700}}'; }md-input-container.md-THEME_NAME-theme.md-input-invalid label,md-input-container.md-THEME_NAME-theme.md-input-invalid .md-input-message-animation,md-input-container.md-THEME_NAME-theme.md-input-invalid .md-char-counter {  color: '{{warn-A700}}'; }md-input-container.md-THEME_NAME-theme .md-input[disabled],[disabled] md-input-container.md-THEME_NAME-theme .md-input {  border-bottom-color: transparent;  color: '{{foreground-3}}';  background-image: linear-gradient(to right, \"{{foreground-3}}\" 0%, \"{{foreground-3}}\" 33%, transparent 0%);  background-image: -ms-linear-gradient(left, transparent 0%, \"{{foreground-3}}\" 100%); }"); 
})();


})(window, window.angular);;window.ngMaterial={version:{full: "1.1.0"}};