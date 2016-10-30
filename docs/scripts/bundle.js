/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/docs/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	// オブザーバーをグローバルに登録
	window.obs = riot.observable();
	
	// ルーティングの設定を呼び出し、起動
	var router = __webpack_require__(3);
	router.start();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Riot v2.6.4, @license MIT */
	
	;(function(window, undefined) {
	  'use strict';
	var riot = { version: 'v2.6.4', settings: {} },
	  // be aware, internal usage
	  // ATTENTION: prefix the global dynamic variables with `__`
	
	  // counter to give a unique id to all the Tag instances
	  __uid = 0,
	  // tags instances cache
	  __virtualDom = [],
	  // tags implementation cache
	  __tagImpl = {},
	
	  /**
	   * Const
	   */
	  GLOBAL_MIXIN = '__global_mixin',
	
	  // riot specific prefixes
	  RIOT_PREFIX = 'riot-',
	  RIOT_TAG = RIOT_PREFIX + 'tag',
	  RIOT_TAG_IS = 'data-is',
	
	  // for typeof == '' comparisons
	  T_STRING = 'string',
	  T_OBJECT = 'object',
	  T_UNDEF  = 'undefined',
	  T_FUNCTION = 'function',
	  XLINK_NS = 'http://www.w3.org/1999/xlink',
	  XLINK_REGEX = /^xlink:(\w+)/,
	  // special native tags that cannot be treated like the others
	  SPECIAL_TAGS_REGEX = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?|opt(?:ion|group))$/,
	  RESERVED_WORDS_BLACKLIST = /^(?:_(?:item|id|parent)|update|root|(?:un)?mount|mixin|is(?:Mounted|Loop)|tags|parent|opts|trigger|o(?:n|ff|ne))$/,
	  // SVG tags list https://www.w3.org/TR/SVG/attindex.html#PresentationAttributes
	  SVG_TAGS_LIST = ['altGlyph', 'animate', 'animateColor', 'circle', 'clipPath', 'defs', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence', 'filter', 'font', 'foreignObject', 'g', 'glyph', 'glyphRef', 'image', 'line', 'linearGradient', 'marker', 'mask', 'missing-glyph', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'switch', 'symbol', 'text', 'textPath', 'tref', 'tspan', 'use'],
	
	  // version# for IE 8-11, 0 for others
	  IE_VERSION = (window && window.document || {}).documentMode | 0,
	
	  // detect firefox to fix #1374
	  FIREFOX = window && !!window.InstallTrigger
	/* istanbul ignore next */
	riot.observable = function(el) {
	
	  /**
	   * Extend the original object or create a new empty one
	   * @type { Object }
	   */
	
	  el = el || {}
	
	  /**
	   * Private variables
	   */
	  var callbacks = {},
	    slice = Array.prototype.slice
	
	  /**
	   * Private Methods
	   */
	
	  /**
	   * Helper function needed to get and loop all the events in a string
	   * @param   { String }   e - event string
	   * @param   {Function}   fn - callback
	   */
	  function onEachEvent(e, fn) {
	    var es = e.split(' '), l = es.length, i = 0
	    for (; i < l; i++) {
	      var name = es[i]
	      if (name) fn(name, i)
	    }
	  }
	
	  /**
	   * Public Api
	   */
	
	  // extend the el object adding the observable methods
	  Object.defineProperties(el, {
	    /**
	     * Listen to the given space separated list of `events` and
	     * execute the `callback` each time an event is triggered.
	     * @param  { String } events - events ids
	     * @param  { Function } fn - callback function
	     * @returns { Object } el
	     */
	    on: {
	      value: function(events, fn) {
	        if (typeof fn != 'function')  return el
	
	        onEachEvent(events, function(name, pos) {
	          (callbacks[name] = callbacks[name] || []).push(fn)
	          fn.typed = pos > 0
	        })
	
	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },
	
	    /**
	     * Removes the given space separated list of `events` listeners
	     * @param   { String } events - events ids
	     * @param   { Function } fn - callback function
	     * @returns { Object } el
	     */
	    off: {
	      value: function(events, fn) {
	        if (events == '*' && !fn) callbacks = {}
	        else {
	          onEachEvent(events, function(name, pos) {
	            if (fn) {
	              var arr = callbacks[name]
	              for (var i = 0, cb; cb = arr && arr[i]; ++i) {
	                if (cb == fn) arr.splice(i--, 1)
	              }
	            } else delete callbacks[name]
	          })
	        }
	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },
	
	    /**
	     * Listen to the given space separated list of `events` and
	     * execute the `callback` at most once
	     * @param   { String } events - events ids
	     * @param   { Function } fn - callback function
	     * @returns { Object } el
	     */
	    one: {
	      value: function(events, fn) {
	        function on() {
	          el.off(events, on)
	          fn.apply(el, arguments)
	        }
	        return el.on(events, on)
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },
	
	    /**
	     * Execute all callback functions that listen to
	     * the given space separated list of `events`
	     * @param   { String } events - events ids
	     * @returns { Object } el
	     */
	    trigger: {
	      value: function(events) {
	
	        // getting the arguments
	        var arglen = arguments.length - 1,
	          args = new Array(arglen),
	          fns
	
	        for (var i = 0; i < arglen; i++) {
	          args[i] = arguments[i + 1] // skip first argument
	        }
	
	        onEachEvent(events, function(name, pos) {
	
	          fns = slice.call(callbacks[name] || [], 0)
	
	          for (var i = 0, fn; fn = fns[i]; ++i) {
	            if (fn.busy) continue
	            fn.busy = 1
	            fn.apply(el, fn.typed ? [name].concat(args) : args)
	            if (fns[i] !== fn) { i-- }
	            fn.busy = 0
	          }
	
	          if (callbacks['*'] && name != '*')
	            el.trigger.apply(el, ['*', name].concat(args))
	
	        })
	
	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    }
	  })
	
	  return el
	
	}
	/* istanbul ignore next */
	;(function(riot) {
	
	/**
	 * Simple client-side router
	 * @module riot-route
	 */
	
	
	var RE_ORIGIN = /^.+?\/\/+[^\/]+/,
	  EVENT_LISTENER = 'EventListener',
	  REMOVE_EVENT_LISTENER = 'remove' + EVENT_LISTENER,
	  ADD_EVENT_LISTENER = 'add' + EVENT_LISTENER,
	  HAS_ATTRIBUTE = 'hasAttribute',
	  REPLACE = 'replace',
	  POPSTATE = 'popstate',
	  HASHCHANGE = 'hashchange',
	  TRIGGER = 'trigger',
	  MAX_EMIT_STACK_LEVEL = 3,
	  win = typeof window != 'undefined' && window,
	  doc = typeof document != 'undefined' && document,
	  hist = win && history,
	  loc = win && (hist.location || win.location), // see html5-history-api
	  prot = Router.prototype, // to minify more
	  clickEvent = doc && doc.ontouchstart ? 'touchstart' : 'click',
	  started = false,
	  central = riot.observable(),
	  routeFound = false,
	  debouncedEmit,
	  base, current, parser, secondParser, emitStack = [], emitStackLevel = 0
	
	/**
	 * Default parser. You can replace it via router.parser method.
	 * @param {string} path - current path (normalized)
	 * @returns {array} array
	 */
	function DEFAULT_PARSER(path) {
	  return path.split(/[/?#]/)
	}
	
	/**
	 * Default parser (second). You can replace it via router.parser method.
	 * @param {string} path - current path (normalized)
	 * @param {string} filter - filter string (normalized)
	 * @returns {array} array
	 */
	function DEFAULT_SECOND_PARSER(path, filter) {
	  var re = new RegExp('^' + filter[REPLACE](/\*/g, '([^/?#]+?)')[REPLACE](/\.\./, '.*') + '$'),
	    args = path.match(re)
	
	  if (args) return args.slice(1)
	}
	
	/**
	 * Simple/cheap debounce implementation
	 * @param   {function} fn - callback
	 * @param   {number} delay - delay in seconds
	 * @returns {function} debounced function
	 */
	function debounce(fn, delay) {
	  var t
	  return function () {
	    clearTimeout(t)
	    t = setTimeout(fn, delay)
	  }
	}
	
	/**
	 * Set the window listeners to trigger the routes
	 * @param {boolean} autoExec - see route.start
	 */
	function start(autoExec) {
	  debouncedEmit = debounce(emit, 1)
	  win[ADD_EVENT_LISTENER](POPSTATE, debouncedEmit)
	  win[ADD_EVENT_LISTENER](HASHCHANGE, debouncedEmit)
	  doc[ADD_EVENT_LISTENER](clickEvent, click)
	  if (autoExec) emit(true)
	}
	
	/**
	 * Router class
	 */
	function Router() {
	  this.$ = []
	  riot.observable(this) // make it observable
	  central.on('stop', this.s.bind(this))
	  central.on('emit', this.e.bind(this))
	}
	
	function normalize(path) {
	  return path[REPLACE](/^\/|\/$/, '')
	}
	
	function isString(str) {
	  return typeof str == 'string'
	}
	
	/**
	 * Get the part after domain name
	 * @param {string} href - fullpath
	 * @returns {string} path from root
	 */
	function getPathFromRoot(href) {
	  return (href || loc.href)[REPLACE](RE_ORIGIN, '')
	}
	
	/**
	 * Get the part after base
	 * @param {string} href - fullpath
	 * @returns {string} path from base
	 */
	function getPathFromBase(href) {
	  return base[0] == '#'
	    ? (href || loc.href || '').split(base)[1] || ''
	    : (loc ? getPathFromRoot(href) : href || '')[REPLACE](base, '')
	}
	
	function emit(force) {
	  // the stack is needed for redirections
	  var isRoot = emitStackLevel == 0, first
	  if (MAX_EMIT_STACK_LEVEL <= emitStackLevel) return
	
	  emitStackLevel++
	  emitStack.push(function() {
	    var path = getPathFromBase()
	    if (force || path != current) {
	      central[TRIGGER]('emit', path)
	      current = path
	    }
	  })
	  if (isRoot) {
	    while (first = emitStack.shift()) first() // stack increses within this call
	    emitStackLevel = 0
	  }
	}
	
	function click(e) {
	  if (
	    e.which != 1 // not left click
	    || e.metaKey || e.ctrlKey || e.shiftKey // or meta keys
	    || e.defaultPrevented // or default prevented
	  ) return
	
	  var el = e.target
	  while (el && el.nodeName != 'A') el = el.parentNode
	
	  if (
	    !el || el.nodeName != 'A' // not A tag
	    || el[HAS_ATTRIBUTE]('download') // has download attr
	    || !el[HAS_ATTRIBUTE]('href') // has no href attr
	    || el.target && el.target != '_self' // another window or frame
	    || el.href.indexOf(loc.href.match(RE_ORIGIN)[0]) == -1 // cross origin
	  ) return
	
	  if (el.href != loc.href
	    && (
	      el.href.split('#')[0] == loc.href.split('#')[0] // internal jump
	      || base[0] != '#' && getPathFromRoot(el.href).indexOf(base) !== 0 // outside of base
	      || base[0] == '#' && el.href.split(base)[0] != loc.href.split(base)[0] // outside of #base
	      || !go(getPathFromBase(el.href), el.title || doc.title) // route not found
	    )) return
	
	  e.preventDefault()
	}
	
	/**
	 * Go to the path
	 * @param {string} path - destination path
	 * @param {string} title - page title
	 * @param {boolean} shouldReplace - use replaceState or pushState
	 * @returns {boolean} - route not found flag
	 */
	function go(path, title, shouldReplace) {
	  // Server-side usage: directly execute handlers for the path
	  if (!hist) return central[TRIGGER]('emit', getPathFromBase(path))
	
	  path = base + normalize(path)
	  title = title || doc.title
	  // browsers ignores the second parameter `title`
	  shouldReplace
	    ? hist.replaceState(null, title, path)
	    : hist.pushState(null, title, path)
	  // so we need to set it manually
	  doc.title = title
	  routeFound = false
	  emit()
	  return routeFound
	}
	
	/**
	 * Go to path or set action
	 * a single string:                go there
	 * two strings:                    go there with setting a title
	 * two strings and boolean:        replace history with setting a title
	 * a single function:              set an action on the default route
	 * a string/RegExp and a function: set an action on the route
	 * @param {(string|function)} first - path / action / filter
	 * @param {(string|RegExp|function)} second - title / action
	 * @param {boolean} third - replace flag
	 */
	prot.m = function(first, second, third) {
	  if (isString(first) && (!second || isString(second))) go(first, second, third || false)
	  else if (second) this.r(first, second)
	  else this.r('@', first)
	}
	
	/**
	 * Stop routing
	 */
	prot.s = function() {
	  this.off('*')
	  this.$ = []
	}
	
	/**
	 * Emit
	 * @param {string} path - path
	 */
	prot.e = function(path) {
	  this.$.concat('@').some(function(filter) {
	    var args = (filter == '@' ? parser : secondParser)(normalize(path), normalize(filter))
	    if (typeof args != 'undefined') {
	      this[TRIGGER].apply(null, [filter].concat(args))
	      return routeFound = true // exit from loop
	    }
	  }, this)
	}
	
	/**
	 * Register route
	 * @param {string} filter - filter for matching to url
	 * @param {function} action - action to register
	 */
	prot.r = function(filter, action) {
	  if (filter != '@') {
	    filter = '/' + normalize(filter)
	    this.$.push(filter)
	  }
	  this.on(filter, action)
	}
	
	var mainRouter = new Router()
	var route = mainRouter.m.bind(mainRouter)
	
	/**
	 * Create a sub router
	 * @returns {function} the method of a new Router object
	 */
	route.create = function() {
	  var newSubRouter = new Router()
	  // assign sub-router's main method
	  var router = newSubRouter.m.bind(newSubRouter)
	  // stop only this sub-router
	  router.stop = newSubRouter.s.bind(newSubRouter)
	  return router
	}
	
	/**
	 * Set the base of url
	 * @param {(str|RegExp)} arg - a new base or '#' or '#!'
	 */
	route.base = function(arg) {
	  base = arg || '#'
	  current = getPathFromBase() // recalculate current path
	}
	
	/** Exec routing right now **/
	route.exec = function() {
	  emit(true)
	}
	
	/**
	 * Replace the default router to yours
	 * @param {function} fn - your parser function
	 * @param {function} fn2 - your secondParser function
	 */
	route.parser = function(fn, fn2) {
	  if (!fn && !fn2) {
	    // reset parser for testing...
	    parser = DEFAULT_PARSER
	    secondParser = DEFAULT_SECOND_PARSER
	  }
	  if (fn) parser = fn
	  if (fn2) secondParser = fn2
	}
	
	/**
	 * Helper function to get url query as an object
	 * @returns {object} parsed query
	 */
	route.query = function() {
	  var q = {}
	  var href = loc.href || current
	  href[REPLACE](/[?&](.+?)=([^&]*)/g, function(_, k, v) { q[k] = v })
	  return q
	}
	
	/** Stop routing **/
	route.stop = function () {
	  if (started) {
	    if (win) {
	      win[REMOVE_EVENT_LISTENER](POPSTATE, debouncedEmit)
	      win[REMOVE_EVENT_LISTENER](HASHCHANGE, debouncedEmit)
	      doc[REMOVE_EVENT_LISTENER](clickEvent, click)
	    }
	    central[TRIGGER]('stop')
	    started = false
	  }
	}
	
	/**
	 * Start routing
	 * @param {boolean} autoExec - automatically exec after starting if true
	 */
	route.start = function (autoExec) {
	  if (!started) {
	    if (win) {
	      if (document.readyState == 'complete') start(autoExec)
	      // the timeout is needed to solve
	      // a weird safari bug https://github.com/riot/route/issues/33
	      else win[ADD_EVENT_LISTENER]('load', function() {
	        setTimeout(function() { start(autoExec) }, 1)
	      })
	    }
	    started = true
	  }
	}
	
	/** Prepare the router **/
	route.base()
	route.parser()
	
	riot.route = route
	})(riot)
	/* istanbul ignore next */
	
	/**
	 * The riot template engine
	 * @version v2.4.2
	 */
	/**
	 * riot.util.brackets
	 *
	 * - `brackets    ` - Returns a string or regex based on its parameter
	 * - `brackets.set` - Change the current riot brackets
	 *
	 * @module
	 */
	
	var brackets = (function (UNDEF) {
	
	  var
	    REGLOB = 'g',
	
	    R_MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g,
	
	    R_STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'/g,
	
	    S_QBLOCKS = R_STRINGS.source + '|' +
	      /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' +
	      /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?(\/)[gim]*/.source,
	
	    UNSUPPORTED = RegExp('[\\' + 'x00-\\x1F<>a-zA-Z0-9\'",;\\\\]'),
	
	    NEED_ESCAPE = /(?=[[\]()*+?.^$|])/g,
	
	    FINDBRACES = {
	      '(': RegExp('([()])|'   + S_QBLOCKS, REGLOB),
	      '[': RegExp('([[\\]])|' + S_QBLOCKS, REGLOB),
	      '{': RegExp('([{}])|'   + S_QBLOCKS, REGLOB)
	    },
	
	    DEFAULT = '{ }'
	
	  var _pairs = [
	    '{', '}',
	    '{', '}',
	    /{[^}]*}/,
	    /\\([{}])/g,
	    /\\({)|{/g,
	    RegExp('\\\\(})|([[({])|(})|' + S_QBLOCKS, REGLOB),
	    DEFAULT,
	    /^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S.*)\s*}/,
	    /(^|[^\\]){=[\S\s]*?}/
	  ]
	
	  var
	    cachedBrackets = UNDEF,
	    _regex,
	    _cache = [],
	    _settings
	
	  function _loopback (re) { return re }
	
	  function _rewrite (re, bp) {
	    if (!bp) bp = _cache
	    return new RegExp(
	      re.source.replace(/{/g, bp[2]).replace(/}/g, bp[3]), re.global ? REGLOB : ''
	    )
	  }
	
	  function _create (pair) {
	    if (pair === DEFAULT) return _pairs
	
	    var arr = pair.split(' ')
	
	    if (arr.length !== 2 || UNSUPPORTED.test(pair)) {
	      throw new Error('Unsupported brackets "' + pair + '"')
	    }
	    arr = arr.concat(pair.replace(NEED_ESCAPE, '\\').split(' '))
	
	    arr[4] = _rewrite(arr[1].length > 1 ? /{[\S\s]*?}/ : _pairs[4], arr)
	    arr[5] = _rewrite(pair.length > 3 ? /\\({|})/g : _pairs[5], arr)
	    arr[6] = _rewrite(_pairs[6], arr)
	    arr[7] = RegExp('\\\\(' + arr[3] + ')|([[({])|(' + arr[3] + ')|' + S_QBLOCKS, REGLOB)
	    arr[8] = pair
	    return arr
	  }
	
	  function _brackets (reOrIdx) {
	    return reOrIdx instanceof RegExp ? _regex(reOrIdx) : _cache[reOrIdx]
	  }
	
	  _brackets.split = function split (str, tmpl, _bp) {
	    // istanbul ignore next: _bp is for the compiler
	    if (!_bp) _bp = _cache
	
	    var
	      parts = [],
	      match,
	      isexpr,
	      start,
	      pos,
	      re = _bp[6]
	
	    isexpr = start = re.lastIndex = 0
	
	    while ((match = re.exec(str))) {
	
	      pos = match.index
	
	      if (isexpr) {
	
	        if (match[2]) {
	          re.lastIndex = skipBraces(str, match[2], re.lastIndex)
	          continue
	        }
	        if (!match[3]) {
	          continue
	        }
	      }
	
	      if (!match[1]) {
	        unescapeStr(str.slice(start, pos))
	        start = re.lastIndex
	        re = _bp[6 + (isexpr ^= 1)]
	        re.lastIndex = start
	      }
	    }
	
	    if (str && start < str.length) {
	      unescapeStr(str.slice(start))
	    }
	
	    return parts
	
	    function unescapeStr (s) {
	      if (tmpl || isexpr) {
	        parts.push(s && s.replace(_bp[5], '$1'))
	      } else {
	        parts.push(s)
	      }
	    }
	
	    function skipBraces (s, ch, ix) {
	      var
	        match,
	        recch = FINDBRACES[ch]
	
	      recch.lastIndex = ix
	      ix = 1
	      while ((match = recch.exec(s))) {
	        if (match[1] &&
	          !(match[1] === ch ? ++ix : --ix)) break
	      }
	      return ix ? s.length : recch.lastIndex
	    }
	  }
	
	  _brackets.hasExpr = function hasExpr (str) {
	    return _cache[4].test(str)
	  }
	
	  _brackets.loopKeys = function loopKeys (expr) {
	    var m = expr.match(_cache[9])
	
	    return m
	      ? { key: m[1], pos: m[2], val: _cache[0] + m[3].trim() + _cache[1] }
	      : { val: expr.trim() }
	  }
	
	  _brackets.array = function array (pair) {
	    return pair ? _create(pair) : _cache
	  }
	
	  function _reset (pair) {
	    if ((pair || (pair = DEFAULT)) !== _cache[8]) {
	      _cache = _create(pair)
	      _regex = pair === DEFAULT ? _loopback : _rewrite
	      _cache[9] = _regex(_pairs[9])
	    }
	    cachedBrackets = pair
	  }
	
	  function _setSettings (o) {
	    var b
	
	    o = o || {}
	    b = o.brackets
	    Object.defineProperty(o, 'brackets', {
	      set: _reset,
	      get: function () { return cachedBrackets },
	      enumerable: true
	    })
	    _settings = o
	    _reset(b)
	  }
	
	  Object.defineProperty(_brackets, 'settings', {
	    set: _setSettings,
	    get: function () { return _settings }
	  })
	
	  /* istanbul ignore next: in the browser riot is always in the scope */
	  _brackets.settings = typeof riot !== 'undefined' && riot.settings || {}
	  _brackets.set = _reset
	
	  _brackets.R_STRINGS = R_STRINGS
	  _brackets.R_MLCOMMS = R_MLCOMMS
	  _brackets.S_QBLOCKS = S_QBLOCKS
	
	  return _brackets
	
	})()
	
	/**
	 * @module tmpl
	 *
	 * tmpl          - Root function, returns the template value, render with data
	 * tmpl.hasExpr  - Test the existence of a expression inside a string
	 * tmpl.loopKeys - Get the keys for an 'each' loop (used by `_each`)
	 */
	
	var tmpl = (function () {
	
	  var _cache = {}
	
	  function _tmpl (str, data) {
	    if (!str) return str
	
	    return (_cache[str] || (_cache[str] = _create(str))).call(data, _logErr)
	  }
	
	  _tmpl.haveRaw = brackets.hasRaw
	
	  _tmpl.hasExpr = brackets.hasExpr
	
	  _tmpl.loopKeys = brackets.loopKeys
	
	  // istanbul ignore next
	  _tmpl.clearCache = function () { _cache = {} }
	
	  _tmpl.errorHandler = null
	
	  function _logErr (err, ctx) {
	
	    if (_tmpl.errorHandler) {
	
	      err.riotData = {
	        tagName: ctx && ctx.root && ctx.root.tagName,
	        _riot_id: ctx && ctx._riot_id  //eslint-disable-line camelcase
	      }
	      _tmpl.errorHandler(err)
	    }
	  }
	
	  function _create (str) {
	    var expr = _getTmpl(str)
	
	    if (expr.slice(0, 11) !== 'try{return ') expr = 'return ' + expr
	
	    return new Function('E', expr + ';')    // eslint-disable-line no-new-func
	  }
	
	  var
	    CH_IDEXPR = String.fromCharCode(0x2057),
	    RE_CSNAME = /^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\u2057(\d+)~):/,
	    RE_QBLOCK = RegExp(brackets.S_QBLOCKS, 'g'),
	    RE_DQUOTE = /\u2057/g,
	    RE_QBMARK = /\u2057(\d+)~/g
	
	  function _getTmpl (str) {
	    var
	      qstr = [],
	      expr,
	      parts = brackets.split(str.replace(RE_DQUOTE, '"'), 1)
	
	    if (parts.length > 2 || parts[0]) {
	      var i, j, list = []
	
	      for (i = j = 0; i < parts.length; ++i) {
	
	        expr = parts[i]
	
	        if (expr && (expr = i & 1
	
	            ? _parseExpr(expr, 1, qstr)
	
	            : '"' + expr
	                .replace(/\\/g, '\\\\')
	                .replace(/\r\n?|\n/g, '\\n')
	                .replace(/"/g, '\\"') +
	              '"'
	
	          )) list[j++] = expr
	
	      }
	
	      expr = j < 2 ? list[0]
	           : '[' + list.join(',') + '].join("")'
	
	    } else {
	
	      expr = _parseExpr(parts[1], 0, qstr)
	    }
	
	    if (qstr[0]) {
	      expr = expr.replace(RE_QBMARK, function (_, pos) {
	        return qstr[pos]
	          .replace(/\r/g, '\\r')
	          .replace(/\n/g, '\\n')
	      })
	    }
	    return expr
	  }
	
	  var
	    RE_BREND = {
	      '(': /[()]/g,
	      '[': /[[\]]/g,
	      '{': /[{}]/g
	    }
	
	  function _parseExpr (expr, asText, qstr) {
	
	    expr = expr
	          .replace(RE_QBLOCK, function (s, div) {
	            return s.length > 2 && !div ? CH_IDEXPR + (qstr.push(s) - 1) + '~' : s
	          })
	          .replace(/\s+/g, ' ').trim()
	          .replace(/\ ?([[\({},?\.:])\ ?/g, '$1')
	
	    if (expr) {
	      var
	        list = [],
	        cnt = 0,
	        match
	
	      while (expr &&
	            (match = expr.match(RE_CSNAME)) &&
	            !match.index
	        ) {
	        var
	          key,
	          jsb,
	          re = /,|([[{(])|$/g
	
	        expr = RegExp.rightContext
	        key  = match[2] ? qstr[match[2]].slice(1, -1).trim().replace(/\s+/g, ' ') : match[1]
	
	        while (jsb = (match = re.exec(expr))[1]) skipBraces(jsb, re)
	
	        jsb  = expr.slice(0, match.index)
	        expr = RegExp.rightContext
	
	        list[cnt++] = _wrapExpr(jsb, 1, key)
	      }
	
	      expr = !cnt ? _wrapExpr(expr, asText)
	           : cnt > 1 ? '[' + list.join(',') + '].join(" ").trim()' : list[0]
	    }
	    return expr
	
	    function skipBraces (ch, re) {
	      var
	        mm,
	        lv = 1,
	        ir = RE_BREND[ch]
	
	      ir.lastIndex = re.lastIndex
	      while (mm = ir.exec(expr)) {
	        if (mm[0] === ch) ++lv
	        else if (!--lv) break
	      }
	      re.lastIndex = lv ? expr.length : ir.lastIndex
	    }
	  }
	
	  // istanbul ignore next: not both
	  var // eslint-disable-next-line max-len
	    JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').',
	    JS_VARNAME = /[,{][\$\w]+(?=:)|(^ *|[^$\w\.{])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g,
	    JS_NOPROPS = /^(?=(\.[$\w]+))\1(?:[^.[(]|$)/
	
	  function _wrapExpr (expr, asText, key) {
	    var tb
	
	    expr = expr.replace(JS_VARNAME, function (match, p, mvar, pos, s) {
	      if (mvar) {
	        pos = tb ? 0 : pos + match.length
	
	        if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
	          match = p + '("' + mvar + JS_CONTEXT + mvar
	          if (pos) tb = (s = s[pos]) === '.' || s === '(' || s === '['
	        } else if (pos) {
	          tb = !JS_NOPROPS.test(s.slice(pos))
	        }
	      }
	      return match
	    })
	
	    if (tb) {
	      expr = 'try{return ' + expr + '}catch(e){E(e,this)}'
	    }
	
	    if (key) {
	
	      expr = (tb
	          ? 'function(){' + expr + '}.call(this)' : '(' + expr + ')'
	        ) + '?"' + key + '":""'
	
	    } else if (asText) {
	
	      expr = 'function(v){' + (tb
	          ? expr.replace('return ', 'v=') : 'v=(' + expr + ')'
	        ) + ';return v||v===0?v:""}.call(this)'
	    }
	
	    return expr
	  }
	
	  _tmpl.version = brackets.version = 'v2.4.2'
	
	  return _tmpl
	
	})()
	
	/*
	  lib/browser/tag/mkdom.js
	
	  Includes hacks needed for the Internet Explorer version 9 and below
	  See: http://kangax.github.io/compat-table/es5/#ie8
	       http://codeplanet.io/dropping-ie8/
	*/
	var mkdom = (function _mkdom() {
	  var
	    reHasYield  = /<yield\b/i,
	    reYieldAll  = /<yield\s*(?:\/>|>([\S\s]*?)<\/yield\s*>|>)/ig,
	    reYieldSrc  = /<yield\s+to=['"]([^'">]*)['"]\s*>([\S\s]*?)<\/yield\s*>/ig,
	    reYieldDest = /<yield\s+from=['"]?([-\w]+)['"]?\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/ig
	  var
	    rootEls = { tr: 'tbody', th: 'tr', td: 'tr', col: 'colgroup' },
	    tblTags = IE_VERSION && IE_VERSION < 10
	      ? SPECIAL_TAGS_REGEX : /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?)$/
	
	  /**
	   * Creates a DOM element to wrap the given content. Normally an `DIV`, but can be
	   * also a `TABLE`, `SELECT`, `TBODY`, `TR`, or `COLGROUP` element.
	   *
	   * @param   {string} templ  - The template coming from the custom tag definition
	   * @param   {string} [html] - HTML content that comes from the DOM element where you
	   *           will mount the tag, mostly the original tag in the page
	   * @returns {HTMLElement} DOM element with _templ_ merged through `YIELD` with the _html_.
	   */
	  function _mkdom(templ, html) {
	    var
	      match   = templ && templ.match(/^\s*<([-\w]+)/),
	      tagName = match && match[1].toLowerCase(),
	      el = mkEl('div', isSVGTag(tagName))
	
	    // replace all the yield tags with the tag inner html
	    templ = replaceYield(templ, html)
	
	    /* istanbul ignore next */
	    if (tblTags.test(tagName))
	      el = specialTags(el, templ, tagName)
	    else
	      setInnerHTML(el, templ)
	
	    el.stub = true
	
	    return el
	  }
	
	  /*
	    Creates the root element for table or select child elements:
	    tr/th/td/thead/tfoot/tbody/caption/col/colgroup/option/optgroup
	  */
	  function specialTags(el, templ, tagName) {
	    var
	      select = tagName[0] === 'o',
	      parent = select ? 'select>' : 'table>'
	
	    // trim() is important here, this ensures we don't have artifacts,
	    // so we can check if we have only one element inside the parent
	    el.innerHTML = '<' + parent + templ.trim() + '</' + parent
	    parent = el.firstChild
	
	    // returns the immediate parent if tr/th/td/col is the only element, if not
	    // returns the whole tree, as this can include additional elements
	    if (select) {
	      parent.selectedIndex = -1  // for IE9, compatible w/current riot behavior
	    } else {
	      // avoids insertion of cointainer inside container (ex: tbody inside tbody)
	      var tname = rootEls[tagName]
	      if (tname && parent.childElementCount === 1) parent = $(tname, parent)
	    }
	    return parent
	  }
	
	  /*
	    Replace the yield tag from any tag template with the innerHTML of the
	    original tag in the page
	  */
	  function replaceYield(templ, html) {
	    // do nothing if no yield
	    if (!reHasYield.test(templ)) return templ
	
	    // be careful with #1343 - string on the source having `$1`
	    var src = {}
	
	    html = html && html.replace(reYieldSrc, function (_, ref, text) {
	      src[ref] = src[ref] || text   // preserve first definition
	      return ''
	    }).trim()
	
	    return templ
	      .replace(reYieldDest, function (_, ref, def) {  // yield with from - to attrs
	        return src[ref] || def || ''
	      })
	      .replace(reYieldAll, function (_, def) {        // yield without any "from"
	        return html || def || ''
	      })
	  }
	
	  return _mkdom
	
	})()
	
	/**
	 * Convert the item looped into an object used to extend the child tag properties
	 * @param   { Object } expr - object containing the keys used to extend the children tags
	 * @param   { * } key - value to assign to the new object returned
	 * @param   { * } val - value containing the position of the item in the array
	 * @returns { Object } - new object containing the values of the original item
	 *
	 * The variables 'key' and 'val' are arbitrary.
	 * They depend on the collection type looped (Array, Object)
	 * and on the expression used on the each tag
	 *
	 */
	function mkitem(expr, key, val) {
	  var item = {}
	  item[expr.key] = key
	  if (expr.pos) item[expr.pos] = val
	  return item
	}
	
	/**
	 * Unmount the redundant tags
	 * @param   { Array } items - array containing the current items to loop
	 * @param   { Array } tags - array containing all the children tags
	 */
	function unmountRedundant(items, tags) {
	
	  var i = tags.length,
	    j = items.length,
	    t
	
	  while (i > j) {
	    t = tags[--i]
	    tags.splice(i, 1)
	    t.unmount()
	  }
	}
	
	/**
	 * Move the nested custom tags in non custom loop tags
	 * @param   { Object } child - non custom loop tag
	 * @param   { Number } i - current position of the loop tag
	 */
	function moveNestedTags(child, i) {
	  Object.keys(child.tags).forEach(function(tagName) {
	    var tag = child.tags[tagName]
	    if (isArray(tag))
	      each(tag, function (t) {
	        moveChildTag(t, tagName, i)
	      })
	    else
	      moveChildTag(tag, tagName, i)
	  })
	}
	
	/**
	 * Adds the elements for a virtual tag
	 * @param { Tag } tag - the tag whose root's children will be inserted or appended
	 * @param { Node } src - the node that will do the inserting or appending
	 * @param { Tag } target - only if inserting, insert before this tag's first child
	 */
	function addVirtual(tag, src, target) {
	  var el = tag._root, sib
	  tag._virts = []
	  while (el) {
	    sib = el.nextSibling
	    if (target)
	      src.insertBefore(el, target._root)
	    else
	      src.appendChild(el)
	
	    tag._virts.push(el) // hold for unmounting
	    el = sib
	  }
	}
	
	/**
	 * Move virtual tag and all child nodes
	 * @param { Tag } tag - first child reference used to start move
	 * @param { Node } src  - the node that will do the inserting
	 * @param { Tag } target - insert before this tag's first child
	 * @param { Number } len - how many child nodes to move
	 */
	function moveVirtual(tag, src, target, len) {
	  var el = tag._root, sib, i = 0
	  for (; i < len; i++) {
	    sib = el.nextSibling
	    src.insertBefore(el, target._root)
	    el = sib
	  }
	}
	
	
	/**
	 * Manage tags having the 'each'
	 * @param   { Object } dom - DOM node we need to loop
	 * @param   { Tag } parent - parent tag instance where the dom node is contained
	 * @param   { String } expr - string contained in the 'each' attribute
	 */
	function _each(dom, parent, expr) {
	
	  // remove the each property from the original tag
	  remAttr(dom, 'each')
	
	  var mustReorder = typeof getAttr(dom, 'no-reorder') !== T_STRING || remAttr(dom, 'no-reorder'),
	    tagName = getTagName(dom),
	    impl = __tagImpl[tagName] || { tmpl: getOuterHTML(dom) },
	    useRoot = SPECIAL_TAGS_REGEX.test(tagName),
	    root = dom.parentNode,
	    ref = document.createTextNode(''),
	    child = getTag(dom),
	    isOption = tagName.toLowerCase() === 'option', // the option tags must be treated differently
	    tags = [],
	    oldItems = [],
	    hasKeys,
	    isVirtual = dom.tagName == 'VIRTUAL'
	
	  // parse the each expression
	  expr = tmpl.loopKeys(expr)
	
	  // insert a marked where the loop tags will be injected
	  root.insertBefore(ref, dom)
	
	  // clean template code
	  parent.one('before-mount', function () {
	
	    // remove the original DOM node
	    dom.parentNode.removeChild(dom)
	    if (root.stub) root = parent.root
	
	  }).on('update', function () {
	    // get the new items collection
	    var items = tmpl(expr.val, parent),
	      // create a fragment to hold the new DOM nodes to inject in the parent tag
	      frag = document.createDocumentFragment()
	
	    // object loop. any changes cause full redraw
	    if (!isArray(items)) {
	      hasKeys = items || false
	      items = hasKeys ?
	        Object.keys(items).map(function (key) {
	          return mkitem(expr, key, items[key])
	        }) : []
	    }
	
	    // loop all the new items
	    var i = 0,
	      itemsLength = items.length
	
	    for (; i < itemsLength; i++) {
	      // reorder only if the items are objects
	      var
	        item = items[i],
	        _mustReorder = mustReorder && typeof item == T_OBJECT && !hasKeys,
	        oldPos = oldItems.indexOf(item),
	        pos = ~oldPos && _mustReorder ? oldPos : i,
	        // does a tag exist in this position?
	        tag = tags[pos]
	
	      item = !hasKeys && expr.key ? mkitem(expr, item, i) : item
	
	      // new tag
	      if (
	        !_mustReorder && !tag // with no-reorder we just update the old tags
	        ||
	        _mustReorder && !~oldPos || !tag // by default we always try to reorder the DOM elements
	      ) {
	
	        tag = new Tag(impl, {
	          parent: parent,
	          isLoop: true,
	          hasImpl: !!__tagImpl[tagName],
	          root: useRoot ? root : dom.cloneNode(),
	          item: item
	        }, dom.innerHTML)
	
	        tag.mount()
	
	        if (isVirtual) tag._root = tag.root.firstChild // save reference for further moves or inserts
	        // this tag must be appended
	        if (i == tags.length || !tags[i]) { // fix 1581
	          if (isVirtual)
	            addVirtual(tag, frag)
	          else frag.appendChild(tag.root)
	        }
	        // this tag must be insert
	        else {
	          if (isVirtual)
	            addVirtual(tag, root, tags[i])
	          else root.insertBefore(tag.root, tags[i].root) // #1374 some browsers reset selected here
	          oldItems.splice(i, 0, item)
	        }
	
	        tags.splice(i, 0, tag)
	        pos = i // handled here so no move
	      } else tag.update(item, true)
	
	      // reorder the tag if it's not located in its previous position
	      if (
	        pos !== i && _mustReorder &&
	        tags[i] // fix 1581 unable to reproduce it in a test!
	      ) {
	        // update the DOM
	        if (isVirtual)
	          moveVirtual(tag, root, tags[i], dom.childNodes.length)
	        else if (tags[i].root.parentNode) root.insertBefore(tag.root, tags[i].root)
	        // update the position attribute if it exists
	        if (expr.pos)
	          tag[expr.pos] = i
	        // move the old tag instance
	        tags.splice(i, 0, tags.splice(pos, 1)[0])
	        // move the old item
	        oldItems.splice(i, 0, oldItems.splice(pos, 1)[0])
	        // if the loop tags are not custom
	        // we need to move all their custom tags into the right position
	        if (!child && tag.tags) moveNestedTags(tag, i)
	      }
	
	      // cache the original item to use it in the events bound to this node
	      // and its children
	      tag._item = item
	      // cache the real parent tag internally
	      defineProperty(tag, '_parent', parent)
	    }
	
	    // remove the redundant tags
	    unmountRedundant(items, tags)
	
	    // insert the new nodes
	    root.insertBefore(frag, ref)
	    if (isOption) {
	
	      // #1374 FireFox bug in <option selected={expression}>
	      if (FIREFOX && !root.multiple) {
	        for (var n = 0; n < root.length; n++) {
	          if (root[n].__riot1374) {
	            root.selectedIndex = n  // clear other options
	            delete root[n].__riot1374
	            break
	          }
	        }
	      }
	    }
	
	    // set the 'tags' property of the parent tag
	    // if child is 'undefined' it means that we don't need to set this property
	    // for example:
	    // we don't need store the `myTag.tags['div']` property if we are looping a div tag
	    // but we need to track the `myTag.tags['child']` property looping a custom child node named `child`
	    if (child) parent.tags[tagName] = tags
	
	    // clone the items array
	    oldItems = items.slice()
	
	  })
	
	}
	/**
	 * Object that will be used to inject and manage the css of every tag instance
	 */
	var styleManager = (function(_riot) {
	
	  if (!window) return { // skip injection on the server
	    add: function () {},
	    inject: function () {}
	  }
	
	  var styleNode = (function () {
	    // create a new style element with the correct type
	    var newNode = mkEl('style')
	    setAttr(newNode, 'type', 'text/css')
	
	    // replace any user node or insert the new one into the head
	    var userNode = $('style[type=riot]')
	    if (userNode) {
	      if (userNode.id) newNode.id = userNode.id
	      userNode.parentNode.replaceChild(newNode, userNode)
	    }
	    else document.getElementsByTagName('head')[0].appendChild(newNode)
	
	    return newNode
	  })()
	
	  // Create cache and shortcut to the correct property
	  var cssTextProp = styleNode.styleSheet,
	    stylesToInject = ''
	
	  // Expose the style node in a non-modificable property
	  Object.defineProperty(_riot, 'styleNode', {
	    value: styleNode,
	    writable: true
	  })
	
	  /**
	   * Public api
	   */
	  return {
	    /**
	     * Save a tag style to be later injected into DOM
	     * @param   { String } css [description]
	     */
	    add: function(css) {
	      stylesToInject += css
	    },
	    /**
	     * Inject all previously saved tag styles into DOM
	     * innerHTML seems slow: http://jsperf.com/riot-insert-style
	     */
	    inject: function() {
	      if (stylesToInject) {
	        if (cssTextProp) cssTextProp.cssText += stylesToInject
	        else styleNode.innerHTML += stylesToInject
	        stylesToInject = ''
	      }
	    }
	  }
	
	})(riot)
	
	
	function parseNamedElements(root, tag, childTags, forceParsingNamed) {
	
	  walk(root, function(dom) {
	    if (dom.nodeType == 1) {
	      dom.isLoop = dom.isLoop ||
	                  (dom.parentNode && dom.parentNode.isLoop || getAttr(dom, 'each'))
	                    ? 1 : 0
	
	      // custom child tag
	      if (childTags) {
	        var child = getTag(dom)
	
	        if (child && !dom.isLoop)
	          childTags.push(initChildTag(child, {root: dom, parent: tag}, dom.innerHTML, tag))
	      }
	
	      if (!dom.isLoop || forceParsingNamed)
	        setNamed(dom, tag, [])
	    }
	
	  })
	
	}
	
	function parseExpressions(root, tag, expressions) {
	
	  function addExpr(dom, val, extra) {
	    if (tmpl.hasExpr(val)) {
	      expressions.push(extend({ dom: dom, expr: val }, extra))
	    }
	  }
	
	  walk(root, function(dom) {
	    var type = dom.nodeType,
	      attr
	
	    // text node
	    if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue)
	    if (type != 1) return
	
	    /* element */
	
	    // loop
	    attr = getAttr(dom, 'each')
	
	    if (attr) { _each(dom, tag, attr); return false }
	
	    // attribute expressions
	    each(dom.attributes, function(attr) {
	      var name = attr.name,
	        bool = name.split('__')[1]
	
	      addExpr(dom, attr.value, { attr: bool || name, bool: bool })
	      if (bool) { remAttr(dom, name); return false }
	
	    })
	
	    // skip custom tags
	    if (getTag(dom)) return false
	
	  })
	
	}
	function Tag(impl, conf, innerHTML) {
	
	  var self = riot.observable(this),
	    opts = inherit(conf.opts) || {},
	    parent = conf.parent,
	    isLoop = conf.isLoop,
	    hasImpl = conf.hasImpl,
	    item = cleanUpData(conf.item),
	    expressions = [],
	    childTags = [],
	    root = conf.root,
	    tagName = root.tagName.toLowerCase(),
	    attr = {},
	    propsInSyncWithParent = [],
	    dom
	
	  // only call unmount if we have a valid __tagImpl (has name property)
	  if (impl.name && root._tag) root._tag.unmount(true)
	
	  // not yet mounted
	  this.isMounted = false
	  root.isLoop = isLoop
	
	  // keep a reference to the tag just created
	  // so we will be able to mount this tag multiple times
	  root._tag = this
	
	  // create a unique id to this tag
	  // it could be handy to use it also to improve the virtual dom rendering speed
	  defineProperty(this, '_riot_id', ++__uid) // base 1 allows test !t._riot_id
	
	  extend(this, { parent: parent, root: root, opts: opts}, item)
	  // protect the "tags" property from being overridden
	  defineProperty(this, 'tags', {})
	
	  // grab attributes
	  each(root.attributes, function(el) {
	    var val = el.value
	    // remember attributes with expressions only
	    if (tmpl.hasExpr(val)) attr[el.name] = val
	  })
	
	  dom = mkdom(impl.tmpl, innerHTML)
	
	  // options
	  function updateOpts() {
	    var ctx = hasImpl && isLoop ? self : parent || self
	
	    // update opts from current DOM attributes
	    each(root.attributes, function(el) {
	      var val = el.value
	      opts[toCamel(el.name)] = tmpl.hasExpr(val) ? tmpl(val, ctx) : val
	    })
	    // recover those with expressions
	    each(Object.keys(attr), function(name) {
	      opts[toCamel(name)] = tmpl(attr[name], ctx)
	    })
	  }
	
	  function normalizeData(data) {
	    for (var key in item) {
	      if (typeof self[key] !== T_UNDEF && isWritable(self, key))
	        self[key] = data[key]
	    }
	  }
	
	  function inheritFrom(target) {
	    each(Object.keys(target), function(k) {
	      // some properties must be always in sync with the parent tag
	      var mustSync = !RESERVED_WORDS_BLACKLIST.test(k) && contains(propsInSyncWithParent, k)
	
	      if (typeof self[k] === T_UNDEF || mustSync) {
	        // track the property to keep in sync
	        // so we can keep it updated
	        if (!mustSync) propsInSyncWithParent.push(k)
	        self[k] = target[k]
	      }
	    })
	  }
	
	  /**
	   * Update the tag expressions and options
	   * @param   { * }  data - data we want to use to extend the tag properties
	   * @param   { Boolean } isInherited - is this update coming from a parent tag?
	   * @returns { self }
	   */
	  defineProperty(this, 'update', function(data, isInherited) {
	
	    // make sure the data passed will not override
	    // the component core methods
	    data = cleanUpData(data)
	    // inherit properties from the parent in loop
	    if (isLoop) {
	      inheritFrom(self.parent)
	    }
	    // normalize the tag properties in case an item object was initially passed
	    if (data && isObject(item)) {
	      normalizeData(data)
	      item = data
	    }
	    extend(self, data)
	    updateOpts()
	    self.trigger('update', data)
	    update(expressions, self)
	
	    // the updated event will be triggered
	    // once the DOM will be ready and all the re-flows are completed
	    // this is useful if you want to get the "real" root properties
	    // 4 ex: root.offsetWidth ...
	    if (isInherited && self.parent)
	      // closes #1599
	      self.parent.one('updated', function() { self.trigger('updated') })
	    else rAF(function() { self.trigger('updated') })
	
	    return this
	  })
	
	  defineProperty(this, 'mixin', function() {
	    each(arguments, function(mix) {
	      var instance,
	        props = [],
	        obj
	
	      mix = typeof mix === T_STRING ? riot.mixin(mix) : mix
	
	      // check if the mixin is a function
	      if (isFunction(mix)) {
	        // create the new mixin instance
	        instance = new mix()
	      } else instance = mix
	
	      var proto = Object.getPrototypeOf(instance)
	
	      // build multilevel prototype inheritance chain property list
	      do props = props.concat(Object.getOwnPropertyNames(obj || instance))
	      while (obj = Object.getPrototypeOf(obj || instance))
	
	      // loop the keys in the function prototype or the all object keys
	      each(props, function(key) {
	        // bind methods to self
	        // allow mixins to override other properties/parent mixins
	        if (key != 'init') {
	          // check for getters/setters
	          var descriptor = Object.getOwnPropertyDescriptor(instance, key) || Object.getOwnPropertyDescriptor(proto, key)
	          var hasGetterSetter = descriptor && (descriptor.get || descriptor.set)
	
	          // apply method only if it does not already exist on the instance
	          if (!self.hasOwnProperty(key) && hasGetterSetter) {
	            Object.defineProperty(self, key, descriptor)
	          } else {
	            self[key] = isFunction(instance[key]) ?
	              instance[key].bind(self) :
	              instance[key]
	          }
	        }
	      })
	
	      // init method will be called automatically
	      if (instance.init) instance.init.bind(self)()
	    })
	    return this
	  })
	
	  defineProperty(this, 'mount', function() {
	
	    updateOpts()
	
	    // add global mixins
	    var globalMixin = riot.mixin(GLOBAL_MIXIN)
	
	    if (globalMixin)
	      for (var i in globalMixin)
	        if (globalMixin.hasOwnProperty(i))
	          self.mixin(globalMixin[i])
	
	    // children in loop should inherit from true parent
	    if (self._parent && self._parent.root.isLoop) {
	      inheritFrom(self._parent)
	    }
	
	    // initialiation
	    if (impl.fn) impl.fn.call(self, opts)
	
	    // parse layout after init. fn may calculate args for nested custom tags
	    parseExpressions(dom, self, expressions)
	
	    // mount the child tags
	    toggle(true)
	
	    // update the root adding custom attributes coming from the compiler
	    // it fixes also #1087
	    if (impl.attrs)
	      walkAttributes(impl.attrs, function (k, v) { setAttr(root, k, v) })
	    if (impl.attrs || hasImpl)
	      parseExpressions(self.root, self, expressions)
	
	    if (!self.parent || isLoop) self.update(item)
	
	    // internal use only, fixes #403
	    self.trigger('before-mount')
	
	    if (isLoop && !hasImpl) {
	      // update the root attribute for the looped elements
	      root = dom.firstChild
	    } else {
	      while (dom.firstChild) root.appendChild(dom.firstChild)
	      if (root.stub) root = parent.root
	    }
	
	    defineProperty(self, 'root', root)
	
	    // parse the named dom nodes in the looped child
	    // adding them to the parent as well
	    if (isLoop)
	      parseNamedElements(self.root, self.parent, null, true)
	
	    // if it's not a child tag we can trigger its mount event
	    if (!self.parent || self.parent.isMounted) {
	      self.isMounted = true
	      self.trigger('mount')
	    }
	    // otherwise we need to wait that the parent event gets triggered
	    else self.parent.one('mount', function() {
	      // avoid to trigger the `mount` event for the tags
	      // not visible included in an if statement
	      if (!isInStub(self.root)) {
	        self.parent.isMounted = self.isMounted = true
	        self.trigger('mount')
	      }
	    })
	  })
	
	
	  defineProperty(this, 'unmount', function(keepRootTag) {
	    var el = root,
	      p = el.parentNode,
	      ptag,
	      tagIndex = __virtualDom.indexOf(self)
	
	    self.trigger('before-unmount')
	
	    // remove this tag instance from the global virtualDom variable
	    if (~tagIndex)
	      __virtualDom.splice(tagIndex, 1)
	
	    if (p) {
	
	      if (parent) {
	        ptag = getImmediateCustomParentTag(parent)
	        // remove this tag from the parent tags object
	        // if there are multiple nested tags with same name..
	        // remove this element form the array
	        if (isArray(ptag.tags[tagName]))
	          each(ptag.tags[tagName], function(tag, i) {
	            if (tag._riot_id == self._riot_id)
	              ptag.tags[tagName].splice(i, 1)
	          })
	        else
	          // otherwise just delete the tag instance
	          ptag.tags[tagName] = undefined
	      }
	
	      else
	        while (el.firstChild) el.removeChild(el.firstChild)
	
	      if (!keepRootTag)
	        p.removeChild(el)
	      else {
	        // the riot-tag and the data-is attributes aren't needed anymore, remove them
	        remAttr(p, RIOT_TAG_IS)
	        remAttr(p, RIOT_TAG) // this will be removed in riot 3.0.0
	      }
	
	    }
	
	    if (this._virts) {
	      each(this._virts, function(v) {
	        if (v.parentNode) v.parentNode.removeChild(v)
	      })
	    }
	
	    self.trigger('unmount')
	    toggle()
	    self.off('*')
	    self.isMounted = false
	    delete root._tag
	
	  })
	
	  // proxy function to bind updates
	  // dispatched from a parent tag
	  function onChildUpdate(data) { self.update(data, true) }
	
	  function toggle(isMount) {
	
	    // mount/unmount children
	    each(childTags, function(child) { child[isMount ? 'mount' : 'unmount']() })
	
	    // listen/unlisten parent (events flow one way from parent to children)
	    if (!parent) return
	    var evt = isMount ? 'on' : 'off'
	
	    // the loop tags will be always in sync with the parent automatically
	    if (isLoop)
	      parent[evt]('unmount', self.unmount)
	    else {
	      parent[evt]('update', onChildUpdate)[evt]('unmount', self.unmount)
	    }
	  }
	
	
	  // named elements available for fn
	  parseNamedElements(dom, this, childTags)
	
	}
	/**
	 * Attach an event to a DOM node
	 * @param { String } name - event name
	 * @param { Function } handler - event callback
	 * @param { Object } dom - dom node
	 * @param { Tag } tag - tag instance
	 */
	function setEventHandler(name, handler, dom, tag) {
	
	  dom[name] = function(e) {
	
	    var ptag = tag._parent,
	      item = tag._item,
	      el
	
	    if (!item)
	      while (ptag && !item) {
	        item = ptag._item
	        ptag = ptag._parent
	      }
	
	    // cross browser event fix
	    e = e || window.event
	
	    // override the event properties
	    if (isWritable(e, 'currentTarget')) e.currentTarget = dom
	    if (isWritable(e, 'target')) e.target = e.srcElement
	    if (isWritable(e, 'which')) e.which = e.charCode || e.keyCode
	
	    e.item = item
	
	    // prevent default behaviour (by default)
	    if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
	      if (e.preventDefault) e.preventDefault()
	      e.returnValue = false
	    }
	
	    if (!e.preventUpdate) {
	      el = item ? getImmediateCustomParentTag(ptag) : tag
	      el.update()
	    }
	
	  }
	
	}
	
	
	/**
	 * Insert a DOM node replacing another one (used by if- attribute)
	 * @param   { Object } root - parent node
	 * @param   { Object } node - node replaced
	 * @param   { Object } before - node added
	 */
	function insertTo(root, node, before) {
	  if (!root) return
	  root.insertBefore(before, node)
	  root.removeChild(node)
	}
	
	/**
	 * Update the expressions in a Tag instance
	 * @param   { Array } expressions - expression that must be re evaluated
	 * @param   { Tag } tag - tag instance
	 */
	function update(expressions, tag) {
	
	  each(expressions, function(expr, i) {
	
	    var dom = expr.dom,
	      attrName = expr.attr,
	      value = tmpl(expr.expr, tag),
	      parent = expr.parent || expr.dom.parentNode
	
	    if (expr.bool) {
	      value = !!value
	    } else if (value == null) {
	      value = ''
	    }
	
	    // #1638: regression of #1612, update the dom only if the value of the
	    // expression was changed
	    if (expr.value === value) {
	      return
	    }
	    expr.value = value
	
	    // textarea and text nodes has no attribute name
	    if (!attrName) {
	      // about #815 w/o replace: the browser converts the value to a string,
	      // the comparison by "==" does too, but not in the server
	      value += ''
	      // test for parent avoids error with invalid assignment to nodeValue
	      if (parent) {
	        // cache the parent node because somehow it will become null on IE
	        // on the next iteration
	        expr.parent = parent
	        if (parent.tagName === 'TEXTAREA') {
	          parent.value = value                    // #1113
	          if (!IE_VERSION) dom.nodeValue = value  // #1625 IE throws here, nodeValue
	        }                                         // will be available on 'updated'
	        else dom.nodeValue = value
	      }
	      return
	    }
	
	    // ~~#1612: look for changes in dom.value when updating the value~~
	    if (attrName === 'value') {
	      if (dom.value !== value) {
	        dom.value = value
	        setAttr(dom, attrName, value)
	      }
	      return
	    } else {
	      // remove original attribute
	      remAttr(dom, attrName)
	    }
	
	    // event handler
	    if (isFunction(value)) {
	      setEventHandler(attrName, value, dom, tag)
	
	    // if- conditional
	    } else if (attrName == 'if') {
	      var stub = expr.stub,
	        add = function() { insertTo(stub.parentNode, stub, dom) },
	        remove = function() { insertTo(dom.parentNode, dom, stub) }
	
	      // add to DOM
	      if (value) {
	        if (stub) {
	          add()
	          dom.inStub = false
	          // avoid to trigger the mount event if the tags is not visible yet
	          // maybe we can optimize this avoiding to mount the tag at all
	          if (!isInStub(dom)) {
	            walk(dom, function(el) {
	              if (el._tag && !el._tag.isMounted)
	                el._tag.isMounted = !!el._tag.trigger('mount')
	            })
	          }
	        }
	      // remove from DOM
	      } else {
	        stub = expr.stub = stub || document.createTextNode('')
	        // if the parentNode is defined we can easily replace the tag
	        if (dom.parentNode)
	          remove()
	        // otherwise we need to wait the updated event
	        else (tag.parent || tag).one('updated', remove)
	
	        dom.inStub = true
	      }
	    // show / hide
	    } else if (attrName === 'show') {
	      dom.style.display = value ? '' : 'none'
	
	    } else if (attrName === 'hide') {
	      dom.style.display = value ? 'none' : ''
	
	    } else if (expr.bool) {
	      dom[attrName] = value
	      if (value) setAttr(dom, attrName, attrName)
	      if (FIREFOX && attrName === 'selected' && dom.tagName === 'OPTION') {
	        dom.__riot1374 = value   // #1374
	      }
	
	    } else if (value === 0 || value && typeof value !== T_OBJECT) {
	      // <img src="{ expr }">
	      if (startsWith(attrName, RIOT_PREFIX) && attrName != RIOT_TAG) {
	        attrName = attrName.slice(RIOT_PREFIX.length)
	      }
	      setAttr(dom, attrName, value)
	    }
	
	  })
	
	}
	/**
	 * Specialized function for looping an array-like collection with `each={}`
	 * @param   { Array } els - collection of items
	 * @param   {Function} fn - callback function
	 * @returns { Array } the array looped
	 */
	function each(els, fn) {
	  var len = els ? els.length : 0
	
	  for (var i = 0, el; i < len; i++) {
	    el = els[i]
	    // return false -> current item was removed by fn during the loop
	    if (el != null && fn(el, i) === false) i--
	  }
	  return els
	}
	
	/**
	 * Detect if the argument passed is a function
	 * @param   { * } v - whatever you want to pass to this function
	 * @returns { Boolean } -
	 */
	function isFunction(v) {
	  return typeof v === T_FUNCTION || false   // avoid IE problems
	}
	
	/**
	 * Get the outer html of any DOM node SVGs included
	 * @param   { Object } el - DOM node to parse
	 * @returns { String } el.outerHTML
	 */
	function getOuterHTML(el) {
	  if (el.outerHTML) return el.outerHTML
	  // some browsers do not support outerHTML on the SVGs tags
	  else {
	    var container = mkEl('div')
	    container.appendChild(el.cloneNode(true))
	    return container.innerHTML
	  }
	}
	
	/**
	 * Set the inner html of any DOM node SVGs included
	 * @param { Object } container - DOM node where we will inject the new html
	 * @param { String } html - html to inject
	 */
	function setInnerHTML(container, html) {
	  if (typeof container.innerHTML != T_UNDEF) container.innerHTML = html
	  // some browsers do not support innerHTML on the SVGs tags
	  else {
	    var doc = new DOMParser().parseFromString(html, 'application/xml')
	    container.appendChild(
	      container.ownerDocument.importNode(doc.documentElement, true)
	    )
	  }
	}
	
	/**
	 * Checks wether a DOM node must be considered part of an svg document
	 * @param   { String }  name - tag name
	 * @returns { Boolean } -
	 */
	function isSVGTag(name) {
	  return ~SVG_TAGS_LIST.indexOf(name)
	}
	
	/**
	 * Detect if the argument passed is an object, exclude null.
	 * NOTE: Use isObject(x) && !isArray(x) to excludes arrays.
	 * @param   { * } v - whatever you want to pass to this function
	 * @returns { Boolean } -
	 */
	function isObject(v) {
	  return v && typeof v === T_OBJECT         // typeof null is 'object'
	}
	
	/**
	 * Remove any DOM attribute from a node
	 * @param   { Object } dom - DOM node we want to update
	 * @param   { String } name - name of the property we want to remove
	 */
	function remAttr(dom, name) {
	  dom.removeAttribute(name)
	}
	
	/**
	 * Convert a string containing dashes to camel case
	 * @param   { String } string - input string
	 * @returns { String } my-string -> myString
	 */
	function toCamel(string) {
	  return string.replace(/-(\w)/g, function(_, c) {
	    return c.toUpperCase()
	  })
	}
	
	/**
	 * Get the value of any DOM attribute on a node
	 * @param   { Object } dom - DOM node we want to parse
	 * @param   { String } name - name of the attribute we want to get
	 * @returns { String | undefined } name of the node attribute whether it exists
	 */
	function getAttr(dom, name) {
	  return dom.getAttribute(name)
	}
	
	/**
	 * Set any DOM/SVG attribute
	 * @param { Object } dom - DOM node we want to update
	 * @param { String } name - name of the property we want to set
	 * @param { String } val - value of the property we want to set
	 */
	function setAttr(dom, name, val) {
	  var xlink = XLINK_REGEX.exec(name)
	  if (xlink && xlink[1])
	    dom.setAttributeNS(XLINK_NS, xlink[1], val)
	  else
	    dom.setAttribute(name, val)
	}
	
	/**
	 * Detect the tag implementation by a DOM node
	 * @param   { Object } dom - DOM node we need to parse to get its tag implementation
	 * @returns { Object } it returns an object containing the implementation of a custom tag (template and boot function)
	 */
	function getTag(dom) {
	  return dom.tagName && __tagImpl[getAttr(dom, RIOT_TAG_IS) ||
	    getAttr(dom, RIOT_TAG) || dom.tagName.toLowerCase()]
	}
	/**
	 * Add a child tag to its parent into the `tags` object
	 * @param   { Object } tag - child tag instance
	 * @param   { String } tagName - key where the new tag will be stored
	 * @param   { Object } parent - tag instance where the new child tag will be included
	 */
	function addChildTag(tag, tagName, parent) {
	  var cachedTag = parent.tags[tagName]
	
	  // if there are multiple children tags having the same name
	  if (cachedTag) {
	    // if the parent tags property is not yet an array
	    // create it adding the first cached tag
	    if (!isArray(cachedTag))
	      // don't add the same tag twice
	      if (cachedTag !== tag)
	        parent.tags[tagName] = [cachedTag]
	    // add the new nested tag to the array
	    if (!contains(parent.tags[tagName], tag))
	      parent.tags[tagName].push(tag)
	  } else {
	    parent.tags[tagName] = tag
	  }
	}
	
	/**
	 * Move the position of a custom tag in its parent tag
	 * @param   { Object } tag - child tag instance
	 * @param   { String } tagName - key where the tag was stored
	 * @param   { Number } newPos - index where the new tag will be stored
	 */
	function moveChildTag(tag, tagName, newPos) {
	  var parent = tag.parent,
	    tags
	  // no parent no move
	  if (!parent) return
	
	  tags = parent.tags[tagName]
	
	  if (isArray(tags))
	    tags.splice(newPos, 0, tags.splice(tags.indexOf(tag), 1)[0])
	  else addChildTag(tag, tagName, parent)
	}
	
	/**
	 * Create a new child tag including it correctly into its parent
	 * @param   { Object } child - child tag implementation
	 * @param   { Object } opts - tag options containing the DOM node where the tag will be mounted
	 * @param   { String } innerHTML - inner html of the child node
	 * @param   { Object } parent - instance of the parent tag including the child custom tag
	 * @returns { Object } instance of the new child tag just created
	 */
	function initChildTag(child, opts, innerHTML, parent) {
	  var tag = new Tag(child, opts, innerHTML),
	    tagName = getTagName(opts.root),
	    ptag = getImmediateCustomParentTag(parent)
	  // fix for the parent attribute in the looped elements
	  tag.parent = ptag
	  // store the real parent tag
	  // in some cases this could be different from the custom parent tag
	  // for example in nested loops
	  tag._parent = parent
	
	  // add this tag to the custom parent tag
	  addChildTag(tag, tagName, ptag)
	  // and also to the real parent tag
	  if (ptag !== parent)
	    addChildTag(tag, tagName, parent)
	  // empty the child node once we got its template
	  // to avoid that its children get compiled multiple times
	  opts.root.innerHTML = ''
	
	  return tag
	}
	
	/**
	 * Loop backward all the parents tree to detect the first custom parent tag
	 * @param   { Object } tag - a Tag instance
	 * @returns { Object } the instance of the first custom parent tag found
	 */
	function getImmediateCustomParentTag(tag) {
	  var ptag = tag
	  while (!getTag(ptag.root)) {
	    if (!ptag.parent) break
	    ptag = ptag.parent
	  }
	  return ptag
	}
	
	/**
	 * Helper function to set an immutable property
	 * @param   { Object } el - object where the new property will be set
	 * @param   { String } key - object key where the new property will be stored
	 * @param   { * } value - value of the new property
	* @param   { Object } options - set the propery overriding the default options
	 * @returns { Object } - the initial object
	 */
	function defineProperty(el, key, value, options) {
	  Object.defineProperty(el, key, extend({
	    value: value,
	    enumerable: false,
	    writable: false,
	    configurable: true
	  }, options))
	  return el
	}
	
	/**
	 * Get the tag name of any DOM node
	 * @param   { Object } dom - DOM node we want to parse
	 * @returns { String } name to identify this dom node in riot
	 */
	function getTagName(dom) {
	  var child = getTag(dom),
	    namedTag = getAttr(dom, 'name'),
	    tagName = namedTag && !tmpl.hasExpr(namedTag) ?
	                namedTag :
	              child ? child.name : dom.tagName.toLowerCase()
	
	  return tagName
	}
	
	/**
	 * Extend any object with other properties
	 * @param   { Object } src - source object
	 * @returns { Object } the resulting extended object
	 *
	 * var obj = { foo: 'baz' }
	 * extend(obj, {bar: 'bar', foo: 'bar'})
	 * console.log(obj) => {bar: 'bar', foo: 'bar'}
	 *
	 */
	function extend(src) {
	  var obj, args = arguments
	  for (var i = 1; i < args.length; ++i) {
	    if (obj = args[i]) {
	      for (var key in obj) {
	        // check if this property of the source object could be overridden
	        if (isWritable(src, key))
	          src[key] = obj[key]
	      }
	    }
	  }
	  return src
	}
	
	/**
	 * Check whether an array contains an item
	 * @param   { Array } arr - target array
	 * @param   { * } item - item to test
	 * @returns { Boolean } Does 'arr' contain 'item'?
	 */
	function contains(arr, item) {
	  return ~arr.indexOf(item)
	}
	
	/**
	 * Check whether an object is a kind of array
	 * @param   { * } a - anything
	 * @returns {Boolean} is 'a' an array?
	 */
	function isArray(a) { return Array.isArray(a) || a instanceof Array }
	
	/**
	 * Detect whether a property of an object could be overridden
	 * @param   { Object }  obj - source object
	 * @param   { String }  key - object property
	 * @returns { Boolean } is this property writable?
	 */
	function isWritable(obj, key) {
	  var props = Object.getOwnPropertyDescriptor(obj, key)
	  return typeof obj[key] === T_UNDEF || props && props.writable
	}
	
	
	/**
	 * With this function we avoid that the internal Tag methods get overridden
	 * @param   { Object } data - options we want to use to extend the tag instance
	 * @returns { Object } clean object without containing the riot internal reserved words
	 */
	function cleanUpData(data) {
	  if (!(data instanceof Tag) && !(data && typeof data.trigger == T_FUNCTION))
	    return data
	
	  var o = {}
	  for (var key in data) {
	    if (!RESERVED_WORDS_BLACKLIST.test(key)) o[key] = data[key]
	  }
	  return o
	}
	
	/**
	 * Walk down recursively all the children tags starting dom node
	 * @param   { Object }   dom - starting node where we will start the recursion
	 * @param   { Function } fn - callback to transform the child node just found
	 */
	function walk(dom, fn) {
	  if (dom) {
	    // stop the recursion
	    if (fn(dom) === false) return
	    else {
	      dom = dom.firstChild
	
	      while (dom) {
	        walk(dom, fn)
	        dom = dom.nextSibling
	      }
	    }
	  }
	}
	
	/**
	 * Minimize risk: only zero or one _space_ between attr & value
	 * @param   { String }   html - html string we want to parse
	 * @param   { Function } fn - callback function to apply on any attribute found
	 */
	function walkAttributes(html, fn) {
	  var m,
	    re = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g
	
	  while (m = re.exec(html)) {
	    fn(m[1].toLowerCase(), m[2] || m[3] || m[4])
	  }
	}
	
	/**
	 * Check whether a DOM node is in stub mode, useful for the riot 'if' directive
	 * @param   { Object }  dom - DOM node we want to parse
	 * @returns { Boolean } -
	 */
	function isInStub(dom) {
	  while (dom) {
	    if (dom.inStub) return true
	    dom = dom.parentNode
	  }
	  return false
	}
	
	/**
	 * Create a generic DOM node
	 * @param   { String } name - name of the DOM node we want to create
	 * @param   { Boolean } isSvg - should we use a SVG as parent node?
	 * @returns { Object } DOM node just created
	 */
	function mkEl(name, isSvg) {
	  return isSvg ?
	    document.createElementNS('http://www.w3.org/2000/svg', 'svg') :
	    document.createElement(name)
	}
	
	/**
	 * Shorter and fast way to select multiple nodes in the DOM
	 * @param   { String } selector - DOM selector
	 * @param   { Object } ctx - DOM node where the targets of our search will is located
	 * @returns { Object } dom nodes found
	 */
	function $$(selector, ctx) {
	  return (ctx || document).querySelectorAll(selector)
	}
	
	/**
	 * Shorter and fast way to select a single node in the DOM
	 * @param   { String } selector - unique dom selector
	 * @param   { Object } ctx - DOM node where the target of our search will is located
	 * @returns { Object } dom node found
	 */
	function $(selector, ctx) {
	  return (ctx || document).querySelector(selector)
	}
	
	/**
	 * Simple object prototypal inheritance
	 * @param   { Object } parent - parent object
	 * @returns { Object } child instance
	 */
	function inherit(parent) {
	  return Object.create(parent || null)
	}
	
	/**
	 * Get the name property needed to identify a DOM node in riot
	 * @param   { Object } dom - DOM node we need to parse
	 * @returns { String | undefined } give us back a string to identify this dom node
	 */
	function getNamedKey(dom) {
	  return getAttr(dom, 'id') || getAttr(dom, 'name')
	}
	
	/**
	 * Set the named properties of a tag element
	 * @param { Object } dom - DOM node we need to parse
	 * @param { Object } parent - tag instance where the named dom element will be eventually added
	 * @param { Array } keys - list of all the tag instance properties
	 */
	function setNamed(dom, parent, keys) {
	  // get the key value we want to add to the tag instance
	  var key = getNamedKey(dom),
	    isArr,
	    // add the node detected to a tag instance using the named property
	    add = function(value) {
	      // avoid to override the tag properties already set
	      if (contains(keys, key)) return
	      // check whether this value is an array
	      isArr = isArray(value)
	      // if the key was never set
	      if (!value)
	        // set it once on the tag instance
	        parent[key] = dom
	      // if it was an array and not yet set
	      else if (!isArr || isArr && !contains(value, dom)) {
	        // add the dom node into the array
	        if (isArr)
	          value.push(dom)
	        else
	          parent[key] = [value, dom]
	      }
	    }
	
	  // skip the elements with no named properties
	  if (!key) return
	
	  // check whether this key has been already evaluated
	  if (tmpl.hasExpr(key))
	    // wait the first updated event only once
	    parent.one('mount', function() {
	      key = getNamedKey(dom)
	      add(parent[key])
	    })
	  else
	    add(parent[key])
	
	}
	
	/**
	 * Faster String startsWith alternative
	 * @param   { String } src - source string
	 * @param   { String } str - test string
	 * @returns { Boolean } -
	 */
	function startsWith(src, str) {
	  return src.slice(0, str.length) === str
	}
	
	/**
	 * requestAnimationFrame function
	 * Adapted from https://gist.github.com/paulirish/1579671, license MIT
	 */
	var rAF = (function (w) {
	  var raf = w.requestAnimationFrame    ||
	            w.mozRequestAnimationFrame || w.webkitRequestAnimationFrame
	
	  if (!raf || /iP(ad|hone|od).*OS 6/.test(w.navigator.userAgent)) {  // buggy iOS6
	    var lastTime = 0
	
	    raf = function (cb) {
	      var nowtime = Date.now(), timeout = Math.max(16 - (nowtime - lastTime), 0)
	      setTimeout(function () { cb(lastTime = nowtime + timeout) }, timeout)
	    }
	  }
	  return raf
	
	})(window || {})
	
	/**
	 * Mount a tag creating new Tag instance
	 * @param   { Object } root - dom node where the tag will be mounted
	 * @param   { String } tagName - name of the riot tag we want to mount
	 * @param   { Object } opts - options to pass to the Tag instance
	 * @returns { Tag } a new Tag instance
	 */
	function mountTo(root, tagName, opts) {
	  var tag = __tagImpl[tagName],
	    // cache the inner HTML to fix #855
	    innerHTML = root._innerHTML = root._innerHTML || root.innerHTML
	
	  // clear the inner html
	  root.innerHTML = ''
	
	  if (tag && root) tag = new Tag(tag, { root: root, opts: opts }, innerHTML)
	
	  if (tag && tag.mount) {
	    tag.mount()
	    // add this tag to the virtualDom variable
	    if (!contains(__virtualDom, tag)) __virtualDom.push(tag)
	  }
	
	  return tag
	}
	/**
	 * Riot public api
	 */
	
	// share methods for other riot parts, e.g. compiler
	riot.util = { brackets: brackets, tmpl: tmpl }
	
	/**
	 * Create a mixin that could be globally shared across all the tags
	 */
	riot.mixin = (function() {
	  var mixins = {},
	    globals = mixins[GLOBAL_MIXIN] = {},
	    _id = 0
	
	  /**
	   * Create/Return a mixin by its name
	   * @param   { String }  name - mixin name (global mixin if object)
	   * @param   { Object }  mixin - mixin logic
	   * @param   { Boolean } g - is global?
	   * @returns { Object }  the mixin logic
	   */
	  return function(name, mixin, g) {
	    // Unnamed global
	    if (isObject(name)) {
	      riot.mixin('__unnamed_'+_id++, name, true)
	      return
	    }
	
	    var store = g ? globals : mixins
	
	    // Getter
	    if (!mixin) {
	      if (typeof store[name] === T_UNDEF) {
	        throw new Error('Unregistered mixin: ' + name)
	      }
	      return store[name]
	    }
	    // Setter
	    if (isFunction(mixin)) {
	      extend(mixin.prototype, store[name] || {})
	      store[name] = mixin
	    }
	    else {
	      store[name] = extend(store[name] || {}, mixin)
	    }
	  }
	
	})()
	
	/**
	 * Create a new riot tag implementation
	 * @param   { String }   name - name/id of the new riot tag
	 * @param   { String }   html - tag template
	 * @param   { String }   css - custom tag css
	 * @param   { String }   attrs - root tag attributes
	 * @param   { Function } fn - user function
	 * @returns { String } name/id of the tag just created
	 */
	riot.tag = function(name, html, css, attrs, fn) {
	  if (isFunction(attrs)) {
	    fn = attrs
	    if (/^[\w\-]+\s?=/.test(css)) {
	      attrs = css
	      css = ''
	    } else attrs = ''
	  }
	  if (css) {
	    if (isFunction(css)) fn = css
	    else styleManager.add(css)
	  }
	  name = name.toLowerCase()
	  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
	  return name
	}
	
	/**
	 * Create a new riot tag implementation (for use by the compiler)
	 * @param   { String }   name - name/id of the new riot tag
	 * @param   { String }   html - tag template
	 * @param   { String }   css - custom tag css
	 * @param   { String }   attrs - root tag attributes
	 * @param   { Function } fn - user function
	 * @returns { String } name/id of the tag just created
	 */
	riot.tag2 = function(name, html, css, attrs, fn) {
	  if (css) styleManager.add(css)
	  //if (bpair) riot.settings.brackets = bpair
	  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
	  return name
	}
	
	/**
	 * Mount a tag using a specific tag implementation
	 * @param   { String } selector - tag DOM selector
	 * @param   { String } tagName - tag implementation name
	 * @param   { Object } opts - tag logic
	 * @returns { Array } new tags instances
	 */
	riot.mount = function(selector, tagName, opts) {
	
	  var els,
	    allTags,
	    tags = []
	
	  // helper functions
	
	  function addRiotTags(arr) {
	    var list = ''
	    each(arr, function (e) {
	      if (!/[^-\w]/.test(e)) {
	        e = e.trim().toLowerCase()
	        list += ',[' + RIOT_TAG_IS + '="' + e + '"],[' + RIOT_TAG + '="' + e + '"]'
	      }
	    })
	    return list
	  }
	
	  function selectAllTags() {
	    var keys = Object.keys(__tagImpl)
	    return keys + addRiotTags(keys)
	  }
	
	  function pushTags(root) {
	    if (root.tagName) {
	      var riotTag = getAttr(root, RIOT_TAG_IS) || getAttr(root, RIOT_TAG)
	
	      // have tagName? force riot-tag to be the same
	      if (tagName && riotTag !== tagName) {
	        riotTag = tagName
	        setAttr(root, RIOT_TAG_IS, tagName)
	        setAttr(root, RIOT_TAG, tagName) // this will be removed in riot 3.0.0
	      }
	      var tag = mountTo(root, riotTag || root.tagName.toLowerCase(), opts)
	
	      if (tag) tags.push(tag)
	    } else if (root.length) {
	      each(root, pushTags)   // assume nodeList
	    }
	  }
	
	  // ----- mount code -----
	
	  // inject styles into DOM
	  styleManager.inject()
	
	  if (isObject(tagName)) {
	    opts = tagName
	    tagName = 0
	  }
	
	  // crawl the DOM to find the tag
	  if (typeof selector === T_STRING) {
	    if (selector === '*')
	      // select all the tags registered
	      // and also the tags found with the riot-tag attribute set
	      selector = allTags = selectAllTags()
	    else
	      // or just the ones named like the selector
	      selector += addRiotTags(selector.split(/, */))
	
	    // make sure to pass always a selector
	    // to the querySelectorAll function
	    els = selector ? $$(selector) : []
	  }
	  else
	    // probably you have passed already a tag or a NodeList
	    els = selector
	
	  // select all the registered and mount them inside their root elements
	  if (tagName === '*') {
	    // get all custom tags
	    tagName = allTags || selectAllTags()
	    // if the root els it's just a single tag
	    if (els.tagName)
	      els = $$(tagName, els)
	    else {
	      // select all the children for all the different root elements
	      var nodeList = []
	      each(els, function (_el) {
	        nodeList.push($$(tagName, _el))
	      })
	      els = nodeList
	    }
	    // get rid of the tagName
	    tagName = 0
	  }
	
	  pushTags(els)
	
	  return tags
	}
	
	/**
	 * Update all the tags instances created
	 * @returns { Array } all the tags instances
	 */
	riot.update = function() {
	  return each(__virtualDom, function(tag) {
	    tag.update()
	  })
	}
	
	/**
	 * Export the Virtual DOM
	 */
	riot.vdom = __virtualDom
	
	/**
	 * Export the Tag constructor
	 */
	riot.Tag = Tag
	  // support CommonJS, AMD & browser
	  /* istanbul ignore next */
	  if (typeof exports === T_OBJECT)
	    module.exports = riot
	  else if ("function" === T_FUNCTION && typeof __webpack_require__(2) !== T_UNDEF)
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return riot }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  else
	    window.riot = riot
	
	})(typeof window != 'undefined' ? window : void 0);


/***/ },
/* 2 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;
	
	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	// Tagファイルを呼び出し
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);
	
	// navbarをマウント
	var navbar = riot.mount('navbar')[0];
	
	/*
	 * Routerを設定
	 */
	// Access: / - ホーム
	riot.route('/', function () {
		__webpack_require__(7);
	
		navbar.setTitle('Home');
		// routeタグにhomeをマウント
		riot.mount('route', 'home');
	});
	
	// Access: /rec - おすすめ
	riot.route('/rec', function () {
		__webpack_require__(8);
		__webpack_require__(17);
	
		navbar.setTitle('おすすめ');
		// routeタグにrecommendをマウント
		riot.mount('route', 'recommend');
	});
	
	// Access: /menu - お品書き
	riot.route('/menu', function () {
		__webpack_require__(18);
		__webpack_require__(17);
	
		navbar.setTitle('お品書き');
		// routeタグにmenuをマウント
		riot.mount('route', 'menu');
	});
	
	// News: /news - おしらせ
	riot.route('/news', function () {
		__webpack_require__(19);
		__webpack_require__(20);
	
		navbar.setTitle('おしらせ');
		// routeタグにnewsをマウント
		riot.mount('route', 'news');
	});
	
	// News: /news/editor/:id - エディタ
	riot.route('/news/editor/*', function (id) {
		__webpack_require__(21);
		__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./tags/news-editor-body\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
		navbar.setTitle('エディタ');
		riot.mount('route', 'news-editor');
	});
	
	riot.route(function () {
		__webpack_require__(7);
	
		navbar.setTitle('myAdmin for 村村村');
		riot.mount('route', 'home');
	});
	
	// Router起動用Moduleを用意
	module.exports = {
		start: function start() {
			// Riot routerを起動
			riot.route.start(true);
		}
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('navbar', '<div class="navbar"> <div class="left"> <button onclick="{openMenu}" class="btn-icon"><span class="ion-navicon"></span></button> </div> <div class="center"> <h1>{title}</h1> </div> </div> <slide-menu is-open="{isOpen}"></slide-menu>', 'navbar .navbar,[riot-tag="navbar"] .navbar,[data-is="navbar"] .navbar{ position: fixed; top: 0; left: 0; right: 0; width: 100%; height: 50px; box-sizing: border-box; border-bottom: 1px solid #ccc; background: #fff; line-height: 50px; z-index: 9999; } navbar .navbar .left,[riot-tag="navbar"] .navbar .left,[data-is="navbar"] .navbar .left{ position: absolute; left: 0; } navbar .navbar .center,[riot-tag="navbar"] .navbar .center,[data-is="navbar"] .navbar .center{ margin: 0 auto; text-align: center; } navbar .navbar h1,[riot-tag="navbar"] .navbar h1,[data-is="navbar"] .navbar h1{ font-size: 16px; } navbar .navbar .btn-icon,[riot-tag="navbar"] .navbar .btn-icon,[data-is="navbar"] .navbar .btn-icon{ width: 50px; height: 50px; border: none; background: none; font-size: 30px; }', '', function (opts) {
	    var self = this;
	
	    self.mixin({
	        setTitle: function setTitle(title) {
	            self.title = title;
	            self.update();
	        }
	    });
	
	    self.isOpen = false;
	    self.openMenu = function () {
	        self.isOpen = ~self.isOpen;
	    };
	    obs.on('sildeMenu:close', function () {
	        self.isOpen = false;
	        self.update();
	    });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('slide-menu', '<div class="slide-menu {open: opts.isOpen}"> <ul class="menu-list"> <li class="block"><img src="./images/logo.svg" class="logo"></li> <li each="{item in menu}" class="list-item"><a if="{!item._blank}" href="#" onclick="{close(item.href)}" class="anchor"><span class="title">{item.title}</span><span class="icon {item.icon}"></span></a><a if="{item._blank}" href="{item.href}" target="_blank" class="anchor"><span class="icon {item.icon}"></span><span class="title">{item.title}</span></a></li> </ul> </div>', 'slide-menu .slide-menu,[riot-tag="slide-menu"] .slide-menu,[data-is="slide-menu"] .slide-menu{ position: fixed; top: 50px; bottom: 0; left: -240px; width: 240px; background: #fff; z-index: 999; transition: left .3s ease; } slide-menu .slide-menu.open,[riot-tag="slide-menu"] .slide-menu.open,[data-is="slide-menu"] .slide-menu.open{ left: 0; } slide-menu .slide-menu .menu-list,[riot-tag="slide-menu"] .slide-menu .menu-list,[data-is="slide-menu"] .slide-menu .menu-list{ overflow-y: scroll; position: absolute; top: 0; left: 0; bottom: 0; right: 0; } slide-menu .slide-menu .menu-list .block,[riot-tag="slide-menu"] .slide-menu .menu-list .block,[data-is="slide-menu"] .slide-menu .menu-list .block{ display: -webkit-flex; display: -moz-flex; display: -ms-flex; display: -o-flex; display: flex; align-items: center; justify-content: center; height: 120px; background: #111; } slide-menu .slide-menu .menu-list .block .logo,[riot-tag="slide-menu"] .slide-menu .menu-list .block .logo,[data-is="slide-menu"] .slide-menu .menu-list .block .logo{ width: 80px; } slide-menu .slide-menu .menu-list .list-item,[riot-tag="slide-menu"] .slide-menu .menu-list .list-item,[data-is="slide-menu"] .slide-menu .menu-list .list-item{ border-bottom: 1px solid #ccc; } slide-menu .slide-menu .menu-list .list-item .anchor,[riot-tag="slide-menu"] .slide-menu .menu-list .list-item .anchor,[data-is="slide-menu"] .slide-menu .menu-list .list-item .anchor{ position: relative; display: block; height: 60px; line-height: 60px; color: #222; text-decoration: none; transition: background .2s ease; } slide-menu .slide-menu .menu-list .list-item .anchor:hover,[riot-tag="slide-menu"] .slide-menu .menu-list .list-item .anchor:hover,[data-is="slide-menu"] .slide-menu .menu-list .list-item .anchor:hover{ background: #ccc; } slide-menu .slide-menu .menu-list .list-item .anchor .icon,[riot-tag="slide-menu"] .slide-menu .menu-list .list-item .anchor .icon,[data-is="slide-menu"] .slide-menu .menu-list .list-item .anchor .icon{ position: absolute; top: 0; left: 5px; display: block; width: 40px; margin-right: 10px; font-size: 20px; text-align: center; } slide-menu .slide-menu .menu-list .list-item .anchor .title,[riot-tag="slide-menu"] .slide-menu .menu-list .list-item .anchor .title,[data-is="slide-menu"] .slide-menu .menu-list .list-item .anchor .title{ display: block; margin-left: 10px; letter-spacing: 0.1em; text-align: center; font-size: 14px; } slide-menu .slide-menu .copyright,[riot-tag="slide-menu"] .slide-menu .copyright,[data-is="slide-menu"] .slide-menu .copyright{ position: absolute; bottom: 10px; left: 0; right: 0; text-align: center; font-size: 10px; color: #333; }', '', function (opts) {
	    this.close = function (href) {
	        return function (e) {
	            location.href = href;
	            obs.trigger('sildeMenu:close');
	        };
	    };
	    this.menu = [{
	        title: 'サイトを開く',
	        icon: 'ion-android-home',
	        href: 'http://村村村.com',
	        _blank: true
	    }, {
	        title: 'おしらせ',
	        icon: 'ion-edit',
	        href: '#/news'
	    }, {
	        title: 'お品書き',
	        icon: 'ion-ios-list-outline',
	        href: '#/menu'
	    }, {
	        title: 'おすすめ',
	        icon: 'ion-wineglass',
	        href: '#/rec'
	    }, {
	        title: '営業日',
	        icon: 'ion-android-calendar',
	        href: '#/bus'
	    }, {
	        title: 'アクセス',
	        icon: 'ion-arrow-graph-up-right',
	        href: 'http://analytics.google.com/analytics/web/',
	        _blank: true
	    }];
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('btn', '<button onclick="{callback: typeof(callback === \'function\')}" class="btn btn-{size} btn-{type} btn-{color}"></button>', '', '', function (opts) {
	  this.size = opts.size || 'normal';
	  this.type = opts.type || 'fill';
	  this.color = opts.color || 'primary';
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('home', '<a href="http://村村村.com" target="_blank" class="home-logo"><img src="./images/logo.svg"></a>', 'home .home-logo,[riot-tag="home"] .home-logo,[data-is="home"] .home-logo{ position: absolute; top: 50%; left: 50%; display: block; width: 150px; height: 150px; margin: -75px; background: #111; text-align: center; } home .home-logo img,[riot-tag="home"] .home-logo img,[data-is="home"] .home-logo img{ height: 40px; margin: 55px 0; }', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('recommend', '<div class="{edit ? \'edit\' : \'display\'}"> <div class="header"> <h2> <div class="input large"> <input value="{data.title}" __readonly="{!edit}" class="input-form"> </div> </h2> <button type="button" onclick="{toggleMode}" class="btn btn-small btn-{edit ? \'danger\' : \'safety\'}">{edit ? \'保存\' : \'編集\'}</button> </div> <div class="thumb"> <div if="{data.pic == \'non-pic\'}" class="dummy">画像がありません</div> <div if="{data.pic != \'non-pic\'}" class="body {disactive: !usePicture}"><img riot-src="./images/menu/{data.pic}" class="picture"> <div class="onhover"> <div class="overlay"> <button onclick="{toggleUsePic}" class="btn btn-warning btn-large {btn-outline: !usePicture}">{usePicture ? \'画像を使用する\' : \'画像を使用しない\'}</button> </div> </div> </div> </div> <div class="info"> <ul class="input-group"> <li class="menu-name"> <div class="input large"> <input value="{data.name}" __readonly="{!edit}" class="input-form"> </div> </li> <li class="menu-price"> <div class="input normal"> <input value="{data.price}" __readonly="{!edit}" class="input-form"> </div> </li> <li class="menu-comment"> <div class="input normal"> <textarea id="comment" value="{data.comment}" placeholder="コメントを掲載しません" __readonly="{!edit}" class="input-form"></textarea> </div> </li> </ul> </div> <div if="{edit}" class="openList"> <button onclick="{toggleMenuList}" class="btn btn-large btn-primary btn-block">選択</button> </div> </div> <div id="menuList" class="modal"> <button onclick="{toggleMenuList}" class="btn btn-normal btn-danger btn-block">閉じる</button> <menu-list></menu-list> </div>', '@charset "UTF-8"; .header { display: -webkit-flex; display: -moz-flex; display: -ms-flex; display: -o-flex; display: flex; align-items: center; justify-content: space-between; margin: 10px 15px; } recommend .header h2,[riot-tag="recommend"] .header h2,[data-is="recommend"] .header h2{ flex: 1; margin-right: 10px; } recommend .input .input-form,[riot-tag="recommend"] .input .input-form,[data-is="recommend"] .input .input-form{ width: 100%; padding: 0 5px; box-sizing: border-box; border: none; } recommend .input textarea.input-form,[riot-tag="recommend"] .input textarea.input-form,[data-is="recommend"] .input textarea.input-form{ resize: none; } recommend .input.large .input-form,[riot-tag="recommend"] .input.large .input-form,[data-is="recommend"] .input.large .input-form{ font-size: 20px; line-height: 40px; } recommend .input.normal .input-form,[riot-tag="recommend"] .input.normal .input-form,[data-is="recommend"] .input.normal .input-form{ font-size: 16px; line-height: 30px; } recommend .input.small .input-form,[riot-tag="recommend"] .input.small .input-form,[data-is="recommend"] .input.small .input-form{ font-size: 14px; line-height: 20px; } recommend .thumb,[riot-tag="recommend"] .thumb,[data-is="recommend"] .thumb{ position: relative; width: 95%; margin: 10px auto 0; } recommend .thumb .picture,[riot-tag="recommend"] .thumb .picture,[data-is="recommend"] .thumb .picture{ width: 100%; } recommend .thumb .dummy,[riot-tag="recommend"] .thumb .dummy,[data-is="recommend"] .thumb .dummy{ width: 100%; height: 250px; background: #eee; text-align: center; line-height: 250px; font-size: 18px; color: #999; } recommend .thumb .body .onhover,[riot-tag="recommend"] .thumb .body .onhover,[data-is="recommend"] .thumb .body .onhover{ display: none; } recommend .thumb .body .onhover .overlay,[riot-tag="recommend"] .thumb .body .onhover .overlay,[data-is="recommend"] .thumb .body .onhover .overlay{ position: absolute; top: 0; left: 0; bottom: 0; right: 0; display: -webkit-flex; display: -moz-flex; display: -ms-flex; display: -o-flex; display: flex; align-items: center; justify-content: center; } recommend .thumb .body .onhover .overlay .btn,[riot-tag="recommend"] .thumb .body .onhover .overlay .btn,[data-is="recommend"] .thumb .body .onhover .overlay .btn{ position: relative; z-index: 1; } recommend .thumb .body.disactive,[riot-tag="recommend"] .thumb .body.disactive,[data-is="recommend"] .thumb .body.disactive{ position: relative; } recommend .thumb .body.disactive::after,[riot-tag="recommend"] .thumb .body.disactive::after,[data-is="recommend"] .thumb .body.disactive::after{ content: \'\'; position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: rgba(255, 255, 255, 0.7); } recommend .thumb .body.disactive .onhover,[riot-tag="recommend"] .thumb .body.disactive .onhover,[data-is="recommend"] .thumb .body.disactive .onhover{ display: block; } recommend .info,[riot-tag="recommend"] .info,[data-is="recommend"] .info{ margin-top: 10px; } recommend .info .input-group .menu-name,[riot-tag="recommend"] .info .input-group .menu-name,[data-is="recommend"] .info .input-group .menu-name{ padding: 10px 10px; } recommend .info .input-group .menu-price,[riot-tag="recommend"] .info .input-group .menu-price,[data-is="recommend"] .info .input-group .menu-price{ position: relative; width: 80px; padding: 0 20px; } recommend .info .input-group .menu-price::before,[riot-tag="recommend"] .info .input-group .menu-price::before,[data-is="recommend"] .info .input-group .menu-price::before{ content: "￥"; position: absolute; left: 20px; width: 30px; height: 30px; line-height: 30px; text-align: center; z-index: 1; } recommend .info .input-group .menu-price .input-form,[riot-tag="recommend"] .info .input-group .menu-price .input-form,[data-is="recommend"] .info .input-group .menu-price .input-form{ padding-left: 34px; } recommend .info .input-group .menu-comment,[riot-tag="recommend"] .info .input-group .menu-comment,[data-is="recommend"] .info .input-group .menu-comment{ padding: 10px 20px; } recommend .openList,[riot-tag="recommend"] .openList,[data-is="recommend"] .openList{ margin: 20px 15px 0; } recommend .edit .thumb .body:not(.disactive) .onhover,[riot-tag="recommend"] .edit .thumb .body:not(.disactive) .onhover,[data-is="recommend"] .edit .thumb .body:not(.disactive) .onhover{ display: none; } recommend .edit .thumb .body:not(.disactive):hover .onhover,[riot-tag="recommend"] .edit .thumb .body:not(.disactive):hover .onhover,[data-is="recommend"] .edit .thumb .body:not(.disactive):hover .onhover{ display: block; } recommend .edit .input,[riot-tag="recommend"] .edit .input,[data-is="recommend"] .edit .input{ position: relative; } recommend .edit .input::before,[riot-tag="recommend"] .edit .input::before,[data-is="recommend"] .edit .input::before{ content: ""; position: absolute; left: 0; bottom: 0; display: block; width: 100%; height: 2px; border-top: 0; border-left: 1px solid #aaa; border-bottom: 1px solid #aaa; border-right: 1px solid #aaa; } recommend .display .input .input-form,[riot-tag="recommend"] .display .input .input-form,[data-is="recommend"] .display .input .input-form{ outline: 0; } recommend .display .input .input-form:not(textarea),[riot-tag="recommend"] .display .input .input-form:not(textarea),[data-is="recommend"] .display .input .input-form:not(textarea){ overflow: hidden; white-space: nowrap; text-overflow: ellipsis; } recommend .modal,[riot-tag="recommend"] .modal,[data-is="recommend"] .modal{ position: fixed; top: 50px; left: 0; bottom: 0; right: 0; overflow-y: auto; display: none; background: #fff; box-sizing: border-box; opacity: 0; z-index: 99; } recommend .btn,[riot-tag="recommend"] .btn,[data-is="recommend"] .btn{ border: none; } recommend .btn.btn-small,[riot-tag="recommend"] .btn.btn-small,[data-is="recommend"] .btn.btn-small{ height: 30px; padding: 0 15px; font-size: 14px; line-height: 30px; } recommend .btn.btn-normal,[riot-tag="recommend"] .btn.btn-normal,[data-is="recommend"] .btn.btn-normal{ height: 40px; padding: 0 20px; font-size: 16px; line-height: 40px; } recommend .btn.btn-large,[riot-tag="recommend"] .btn.btn-large,[data-is="recommend"] .btn.btn-large{ height: 50px; padding: 0 30px; font-size: 18px; line-height: 50px; background: #009688; color: #fff; } recommend .btn.btn-block,[riot-tag="recommend"] .btn.btn-block,[data-is="recommend"] .btn.btn-block{ display: block; width: 100%; } recommend .btn.btn-primary,[riot-tag="recommend"] .btn.btn-primary,[data-is="recommend"] .btn.btn-primary{ background: #02aedc; color: #fff; } recommend .btn.btn-danger,[riot-tag="recommend"] .btn.btn-danger,[data-is="recommend"] .btn.btn-danger{ background: #eb2142; color: #fff; } recommend .btn.btn-warning,[riot-tag="recommend"] .btn.btn-warning,[data-is="recommend"] .btn.btn-warning{ background: #d35400; color: #fff; } recommend .btn.btn-safety,[riot-tag="recommend"] .btn.btn-safety,[data-is="recommend"] .btn.btn-safety{ background: #2fcdb4; color: #fff; } recommend .btn.btn-outline,[riot-tag="recommend"] .btn.btn-outline,[data-is="recommend"] .btn.btn-outline{ box-sizing: border-box; background: transparent; border: 2px solid; } recommend .btn.btn-outline.btn-warning,[riot-tag="recommend"] .btn.btn-outline.btn-warning,[data-is="recommend"] .btn.btn-outline.btn-warning{ border-color: #d35400; color: #d35400; } recommend .btn.btn-outline.btn-danger,[riot-tag="recommend"] .btn.btn-outline.btn-danger,[data-is="recommend"] .btn.btn-outline.btn-danger{ border-color: #eb2142; color: #eb2142; } recommend .btn.btn-outline.btn-normal,[riot-tag="recommend"] .btn.btn-outline.btn-normal,[data-is="recommend"] .btn.btn-outline.btn-normal{ border-color: #111; color: #111; }', '', function (opts) {
	    var store = __webpack_require__(9);
	    var utils = __webpack_require__(15);
	    var anime = __webpack_require__(16);
	    var self = this;
	
	    self.edit = false;
	    self.toggleMode = function () {
	        if (self.edit) {
	            self.update();
	            store.getRecommend().then(function (data) {
	                console.log(data, self.data);
	                if (JSON.stringify(data) !== JSON.stringify(self.data)) {
	                    console.log('データが更新されたよ！');
	                } else {
	                    console.log('でーたがかわってないよ！');
	                }
	            });
	        }
	        self.edit = ~self.edit;
	    };
	
	    self.usePicture = -1;
	    self.toggleUsePic = function () {
	        if (!self.edit) return;
	        self.usePicture = ~self.usePicture;
	    };
	
	    var isModalOpen = false;
	    self.toggleMenuList = function () {
	        var $ele = document.getElementById('menuList');
	        if (isModalOpen) {
	            isModalOpen = false;
	            anime({
	                targets: $ele,
	                duration: 300,
	                easing: 'easeOutCubic',
	                translateY: '40px',
	                opacity: 0,
	                complete: function complete() {
	                    $ele.style.display = 'none';
	                }
	            });
	        } else {
	            isModalOpen = true;
	            $ele.style.transform = 'translateY(40px)';
	            $ele.style.display = 'block';
	            anime({
	                targets: $ele,
	                duration: 450,
	                easing: 'easeOutCubic',
	                translateY: 0,
	                opacity: 1
	            });
	        }
	    };
	
	    obs.on('changeRecommend', function (data) {
	        self.data = {
	            title: self.data.title,
	            name: data.name,
	            price: data.price,
	            comment: data.comment,
	            pic: data.image || 'non-pic'
	        };
	        self.update();
	        self.toggleMenuList();
	    });
	
	    self.on('mount', function () {
	        utils.autoResize(document.getElementById('comment'));
	    });
	
	    store.getRecommend('getRec').then(function (data) {
	        self.data = data;
	        self.update();
	    });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/*
	 * JSONを参照して保持するモジュールSQUIRE
	 * シングルトンで管理するためアクセスを抑えられる（はず）
	 */
	
	var request = __webpack_require__(10);
	
	var dataStore = {
		rec: null,
		menu: null
	};
	
	var updated = {
		rec: false
	};
	
	module.exports = {
		getRecommend: function getRecommend() {
			return new Promise(function (resolve, reject) {
				// 取得済みの場合
				if (dataStore.rec) {
					resolve(dataStore.rec);
				}
				// 取得されていない場合
				else {
						request.get('./store/recommend.json').end(function (err, res) {
							if (err) {
								reject(err);
								return;
							}
							dataStore.rec = res.body;
							resolve(res.body);
						});
					}
			});
		},
		getMenuList: function getMenuList() {
			return new Promise(function (resolve, reject) {
				// 取得済みの場合
				if (dataStore.menu) {
					resolve(dataStore.menu);
				}
				// 取得されていない場合
				else {
						request.get('./store/menu-list.json').end(function (err, res) {
							if (err) {
								reject(err);
								return;
							}
							dataStore.menu = res.body;
							resolve(res.body);
						});
					}
			});
		}
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Root reference for iframes.
	 */
	
	var root;
	if (typeof window !== 'undefined') { // Browser window
	  root = window;
	} else if (typeof self !== 'undefined') { // Web Worker
	  root = self;
	} else { // Other environments
	  console.warn("Using browser-only version of superagent in non-browser environment");
	  root = this;
	}
	
	var Emitter = __webpack_require__(11);
	var requestBase = __webpack_require__(12);
	var isObject = __webpack_require__(13);
	
	/**
	 * Noop.
	 */
	
	function noop(){};
	
	/**
	 * Expose `request`.
	 */
	
	var request = module.exports = __webpack_require__(14).bind(null, Request);
	
	/**
	 * Determine XHR.
	 */
	
	request.getXHR = function () {
	  if (root.XMLHttpRequest
	      && (!root.location || 'file:' != root.location.protocol
	          || !root.ActiveXObject)) {
	    return new XMLHttpRequest;
	  } else {
	    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
	  }
	  throw Error("Browser-only verison of superagent could not find XHR");
	};
	
	/**
	 * Removes leading and trailing whitespace, added to support IE.
	 *
	 * @param {String} s
	 * @return {String}
	 * @api private
	 */
	
	var trim = ''.trim
	  ? function(s) { return s.trim(); }
	  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };
	
	/**
	 * Serialize the given `obj`.
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api private
	 */
	
	function serialize(obj) {
	  if (!isObject(obj)) return obj;
	  var pairs = [];
	  for (var key in obj) {
	    pushEncodedKeyValuePair(pairs, key, obj[key]);
	  }
	  return pairs.join('&');
	}
	
	/**
	 * Helps 'serialize' with serializing arrays.
	 * Mutates the pairs array.
	 *
	 * @param {Array} pairs
	 * @param {String} key
	 * @param {Mixed} val
	 */
	
	function pushEncodedKeyValuePair(pairs, key, val) {
	  if (val != null) {
	    if (Array.isArray(val)) {
	      val.forEach(function(v) {
	        pushEncodedKeyValuePair(pairs, key, v);
	      });
	    } else if (isObject(val)) {
	      for(var subkey in val) {
	        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
	      }
	    } else {
	      pairs.push(encodeURIComponent(key)
	        + '=' + encodeURIComponent(val));
	    }
	  } else if (val === null) {
	    pairs.push(encodeURIComponent(key));
	  }
	}
	
	/**
	 * Expose serialization method.
	 */
	
	 request.serializeObject = serialize;
	
	 /**
	  * Parse the given x-www-form-urlencoded `str`.
	  *
	  * @param {String} str
	  * @return {Object}
	  * @api private
	  */
	
	function parseString(str) {
	  var obj = {};
	  var pairs = str.split('&');
	  var pair;
	  var pos;
	
	  for (var i = 0, len = pairs.length; i < len; ++i) {
	    pair = pairs[i];
	    pos = pair.indexOf('=');
	    if (pos == -1) {
	      obj[decodeURIComponent(pair)] = '';
	    } else {
	      obj[decodeURIComponent(pair.slice(0, pos))] =
	        decodeURIComponent(pair.slice(pos + 1));
	    }
	  }
	
	  return obj;
	}
	
	/**
	 * Expose parser.
	 */
	
	request.parseString = parseString;
	
	/**
	 * Default MIME type map.
	 *
	 *     superagent.types.xml = 'application/xml';
	 *
	 */
	
	request.types = {
	  html: 'text/html',
	  json: 'application/json',
	  xml: 'application/xml',
	  urlencoded: 'application/x-www-form-urlencoded',
	  'form': 'application/x-www-form-urlencoded',
	  'form-data': 'application/x-www-form-urlencoded'
	};
	
	/**
	 * Default serialization map.
	 *
	 *     superagent.serialize['application/xml'] = function(obj){
	 *       return 'generated xml here';
	 *     };
	 *
	 */
	
	 request.serialize = {
	   'application/x-www-form-urlencoded': serialize,
	   'application/json': JSON.stringify
	 };
	
	 /**
	  * Default parsers.
	  *
	  *     superagent.parse['application/xml'] = function(str){
	  *       return { object parsed from str };
	  *     };
	  *
	  */
	
	request.parse = {
	  'application/x-www-form-urlencoded': parseString,
	  'application/json': JSON.parse
	};
	
	/**
	 * Parse the given header `str` into
	 * an object containing the mapped fields.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */
	
	function parseHeader(str) {
	  var lines = str.split(/\r?\n/);
	  var fields = {};
	  var index;
	  var line;
	  var field;
	  var val;
	
	  lines.pop(); // trailing CRLF
	
	  for (var i = 0, len = lines.length; i < len; ++i) {
	    line = lines[i];
	    index = line.indexOf(':');
	    field = line.slice(0, index).toLowerCase();
	    val = trim(line.slice(index + 1));
	    fields[field] = val;
	  }
	
	  return fields;
	}
	
	/**
	 * Check if `mime` is json or has +json structured syntax suffix.
	 *
	 * @param {String} mime
	 * @return {Boolean}
	 * @api private
	 */
	
	function isJSON(mime) {
	  return /[\/+]json\b/.test(mime);
	}
	
	/**
	 * Return the mime type for the given `str`.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */
	
	function type(str){
	  return str.split(/ *; */).shift();
	};
	
	/**
	 * Return header field parameters.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */
	
	function params(str){
	  return str.split(/ *; */).reduce(function(obj, str){
	    var parts = str.split(/ *= */),
	        key = parts.shift(),
	        val = parts.shift();
	
	    if (key && val) obj[key] = val;
	    return obj;
	  }, {});
	};
	
	/**
	 * Initialize a new `Response` with the given `xhr`.
	 *
	 *  - set flags (.ok, .error, etc)
	 *  - parse header
	 *
	 * Examples:
	 *
	 *  Aliasing `superagent` as `request` is nice:
	 *
	 *      request = superagent;
	 *
	 *  We can use the promise-like API, or pass callbacks:
	 *
	 *      request.get('/').end(function(res){});
	 *      request.get('/', function(res){});
	 *
	 *  Sending data can be chained:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' })
	 *        .end(function(res){});
	 *
	 *  Or passed to `.send()`:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' }, function(res){});
	 *
	 *  Or passed to `.post()`:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' })
	 *        .end(function(res){});
	 *
	 * Or further reduced to a single call for simple cases:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' }, function(res){});
	 *
	 * @param {XMLHTTPRequest} xhr
	 * @param {Object} options
	 * @api private
	 */
	
	function Response(req, options) {
	  options = options || {};
	  this.req = req;
	  this.xhr = this.req.xhr;
	  // responseText is accessible only if responseType is '' or 'text' and on older browsers
	  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
	     ? this.xhr.responseText
	     : null;
	  this.statusText = this.req.xhr.statusText;
	  this._setStatusProperties(this.xhr.status);
	  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
	  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
	  // getResponseHeader still works. so we get content-type even if getting
	  // other headers fails.
	  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
	  this._setHeaderProperties(this.header);
	  this.body = this.req.method != 'HEAD'
	    ? this._parseBody(this.text ? this.text : this.xhr.response)
	    : null;
	}
	
	/**
	 * Get case-insensitive `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */
	
	Response.prototype.get = function(field){
	  return this.header[field.toLowerCase()];
	};
	
	/**
	 * Set header related properties:
	 *
	 *   - `.type` the content type without params
	 *
	 * A response of "Content-Type: text/plain; charset=utf-8"
	 * will provide you with a `.type` of "text/plain".
	 *
	 * @param {Object} header
	 * @api private
	 */
	
	Response.prototype._setHeaderProperties = function(header){
	  // content-type
	  var ct = this.header['content-type'] || '';
	  this.type = type(ct);
	
	  // params
	  var obj = params(ct);
	  for (var key in obj) this[key] = obj[key];
	};
	
	/**
	 * Parse the given body `str`.
	 *
	 * Used for auto-parsing of bodies. Parsers
	 * are defined on the `superagent.parse` object.
	 *
	 * @param {String} str
	 * @return {Mixed}
	 * @api private
	 */
	
	Response.prototype._parseBody = function(str){
	  var parse = request.parse[this.type];
	  if (!parse && isJSON(this.type)) {
	    parse = request.parse['application/json'];
	  }
	  return parse && str && (str.length || str instanceof Object)
	    ? parse(str)
	    : null;
	};
	
	/**
	 * Set flags such as `.ok` based on `status`.
	 *
	 * For example a 2xx response will give you a `.ok` of __true__
	 * whereas 5xx will be __false__ and `.error` will be __true__. The
	 * `.clientError` and `.serverError` are also available to be more
	 * specific, and `.statusType` is the class of error ranging from 1..5
	 * sometimes useful for mapping respond colors etc.
	 *
	 * "sugar" properties are also defined for common cases. Currently providing:
	 *
	 *   - .noContent
	 *   - .badRequest
	 *   - .unauthorized
	 *   - .notAcceptable
	 *   - .notFound
	 *
	 * @param {Number} status
	 * @api private
	 */
	
	Response.prototype._setStatusProperties = function(status){
	  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
	  if (status === 1223) {
	    status = 204;
	  }
	
	  var type = status / 100 | 0;
	
	  // status / class
	  this.status = this.statusCode = status;
	  this.statusType = type;
	
	  // basics
	  this.info = 1 == type;
	  this.ok = 2 == type;
	  this.clientError = 4 == type;
	  this.serverError = 5 == type;
	  this.error = (4 == type || 5 == type)
	    ? this.toError()
	    : false;
	
	  // sugar
	  this.accepted = 202 == status;
	  this.noContent = 204 == status;
	  this.badRequest = 400 == status;
	  this.unauthorized = 401 == status;
	  this.notAcceptable = 406 == status;
	  this.notFound = 404 == status;
	  this.forbidden = 403 == status;
	};
	
	/**
	 * Return an `Error` representative of this response.
	 *
	 * @return {Error}
	 * @api public
	 */
	
	Response.prototype.toError = function(){
	  var req = this.req;
	  var method = req.method;
	  var url = req.url;
	
	  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
	  var err = new Error(msg);
	  err.status = this.status;
	  err.method = method;
	  err.url = url;
	
	  return err;
	};
	
	/**
	 * Expose `Response`.
	 */
	
	request.Response = Response;
	
	/**
	 * Initialize a new `Request` with the given `method` and `url`.
	 *
	 * @param {String} method
	 * @param {String} url
	 * @api public
	 */
	
	function Request(method, url) {
	  var self = this;
	  this._query = this._query || [];
	  this.method = method;
	  this.url = url;
	  this.header = {}; // preserves header name case
	  this._header = {}; // coerces header names to lowercase
	  this.on('end', function(){
	    var err = null;
	    var res = null;
	
	    try {
	      res = new Response(self);
	    } catch(e) {
	      err = new Error('Parser is unable to parse the response');
	      err.parse = true;
	      err.original = e;
	      // issue #675: return the raw response if the response parsing fails
	      err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
	      // issue #876: return the http status code if the response parsing fails
	      err.statusCode = self.xhr && self.xhr.status ? self.xhr.status : null;
	      return self.callback(err);
	    }
	
	    self.emit('response', res);
	
	    var new_err;
	    try {
	      if (res.status < 200 || res.status >= 300) {
	        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
	        new_err.original = err;
	        new_err.response = res;
	        new_err.status = res.status;
	      }
	    } catch(e) {
	      new_err = e; // #985 touching res may cause INVALID_STATE_ERR on old Android
	    }
	
	    // #1000 don't catch errors from the callback to avoid double calling it
	    if (new_err) {
	      self.callback(new_err, res);
	    } else {
	      self.callback(null, res);
	    }
	  });
	}
	
	/**
	 * Mixin `Emitter` and `requestBase`.
	 */
	
	Emitter(Request.prototype);
	for (var key in requestBase) {
	  Request.prototype[key] = requestBase[key];
	}
	
	/**
	 * Set Content-Type to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.xml = 'application/xml';
	 *
	 *      request.post('/')
	 *        .type('xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 *      request.post('/')
	 *        .type('application/xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 * @param {String} type
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.type = function(type){
	  this.set('Content-Type', request.types[type] || type);
	  return this;
	};
	
	/**
	 * Set responseType to `val`. Presently valid responseTypes are 'blob' and
	 * 'arraybuffer'.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .responseType('blob')
	 *        .end(callback);
	 *
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.responseType = function(val){
	  this._responseType = val;
	  return this;
	};
	
	/**
	 * Set Accept to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.json = 'application/json';
	 *
	 *      request.get('/agent')
	 *        .accept('json')
	 *        .end(callback);
	 *
	 *      request.get('/agent')
	 *        .accept('application/json')
	 *        .end(callback);
	 *
	 * @param {String} accept
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.accept = function(type){
	  this.set('Accept', request.types[type] || type);
	  return this;
	};
	
	/**
	 * Set Authorization field value with `user` and `pass`.
	 *
	 * @param {String} user
	 * @param {String} pass
	 * @param {Object} options with 'type' property 'auto' or 'basic' (default 'basic')
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.auth = function(user, pass, options){
	  if (!options) {
	    options = {
	      type: 'basic'
	    }
	  }
	
	  switch (options.type) {
	    case 'basic':
	      var str = btoa(user + ':' + pass);
	      this.set('Authorization', 'Basic ' + str);
	    break;
	
	    case 'auto':
	      this.username = user;
	      this.password = pass;
	    break;
	  }
	  return this;
	};
	
	/**
	* Add query-string `val`.
	*
	* Examples:
	*
	*   request.get('/shoes')
	*     .query('size=10')
	*     .query({ color: 'blue' })
	*
	* @param {Object|String} val
	* @return {Request} for chaining
	* @api public
	*/
	
	Request.prototype.query = function(val){
	  if ('string' != typeof val) val = serialize(val);
	  if (val) this._query.push(val);
	  return this;
	};
	
	/**
	 * Queue the given `file` as an attachment to the specified `field`,
	 * with optional `filename`.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} field
	 * @param {Blob|File} file
	 * @param {String} filename
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.attach = function(field, file, filename){
	  this._getFormData().append(field, file, filename || file.name);
	  return this;
	};
	
	Request.prototype._getFormData = function(){
	  if (!this._formData) {
	    this._formData = new root.FormData();
	  }
	  return this._formData;
	};
	
	/**
	 * Invoke the callback with `err` and `res`
	 * and handle arity check.
	 *
	 * @param {Error} err
	 * @param {Response} res
	 * @api private
	 */
	
	Request.prototype.callback = function(err, res){
	  var fn = this._callback;
	  this.clearTimeout();
	  fn(err, res);
	};
	
	/**
	 * Invoke callback with x-domain error.
	 *
	 * @api private
	 */
	
	Request.prototype.crossDomainError = function(){
	  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
	  err.crossDomain = true;
	
	  err.status = this.status;
	  err.method = this.method;
	  err.url = this.url;
	
	  this.callback(err);
	};
	
	/**
	 * Invoke callback with timeout error.
	 *
	 * @api private
	 */
	
	Request.prototype._timeoutError = function(){
	  var timeout = this._timeout;
	  var err = new Error('timeout of ' + timeout + 'ms exceeded');
	  err.timeout = timeout;
	  this.callback(err);
	};
	
	/**
	 * Compose querystring to append to req.url
	 *
	 * @api private
	 */
	
	Request.prototype._appendQueryString = function(){
	  var query = this._query.join('&');
	  if (query) {
	    this.url += ~this.url.indexOf('?')
	      ? '&' + query
	      : '?' + query;
	  }
	};
	
	/**
	 * Initiate request, invoking callback `fn(res)`
	 * with an instanceof `Response`.
	 *
	 * @param {Function} fn
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.end = function(fn){
	  var self = this;
	  var xhr = this.xhr = request.getXHR();
	  var timeout = this._timeout;
	  var data = this._formData || this._data;
	
	  // store callback
	  this._callback = fn || noop;
	
	  // state change
	  xhr.onreadystatechange = function(){
	    if (4 != xhr.readyState) return;
	
	    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
	    // result in the error "Could not complete the operation due to error c00c023f"
	    var status;
	    try { status = xhr.status } catch(e) { status = 0; }
	
	    if (0 == status) {
	      if (self.timedout) return self._timeoutError();
	      if (self._aborted) return;
	      return self.crossDomainError();
	    }
	    self.emit('end');
	  };
	
	  // progress
	  var handleProgress = function(direction, e) {
	    if (e.total > 0) {
	      e.percent = e.loaded / e.total * 100;
	    }
	    e.direction = direction;
	    self.emit('progress', e);
	  }
	  if (this.hasListeners('progress')) {
	    try {
	      xhr.onprogress = handleProgress.bind(null, 'download');
	      if (xhr.upload) {
	        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
	      }
	    } catch(e) {
	      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
	      // Reported here:
	      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
	    }
	  }
	
	  // timeout
	  if (timeout && !this._timer) {
	    this._timer = setTimeout(function(){
	      self.timedout = true;
	      self.abort();
	    }, timeout);
	  }
	
	  // querystring
	  this._appendQueryString();
	
	  // initiate request
	  if (this.username && this.password) {
	    xhr.open(this.method, this.url, true, this.username, this.password);
	  } else {
	    xhr.open(this.method, this.url, true);
	  }
	
	  // CORS
	  if (this._withCredentials) xhr.withCredentials = true;
	
	  // body
	  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
	    // serialize stuff
	    var contentType = this._header['content-type'];
	    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
	    if (!serialize && isJSON(contentType)) serialize = request.serialize['application/json'];
	    if (serialize) data = serialize(data);
	  }
	
	  // set header fields
	  for (var field in this.header) {
	    if (null == this.header[field]) continue;
	    xhr.setRequestHeader(field, this.header[field]);
	  }
	
	  if (this._responseType) {
	    xhr.responseType = this._responseType;
	  }
	
	  // send stuff
	  this.emit('request', this);
	
	  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
	  // We need null here if data is undefined
	  xhr.send(typeof data !== 'undefined' ? data : null);
	  return this;
	};
	
	
	/**
	 * Expose `Request`.
	 */
	
	request.Request = Request;
	
	/**
	 * GET `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.get = function(url, data, fn){
	  var req = request('GET', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.query(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * HEAD `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.head = function(url, data, fn){
	  var req = request('HEAD', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * OPTIONS query to `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.options = function(url, data, fn){
	  var req = request('OPTIONS', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * DELETE `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	function del(url, fn){
	  var req = request('DELETE', url);
	  if (fn) req.end(fn);
	  return req;
	};
	
	request['del'] = del;
	request['delete'] = del;
	
	/**
	 * PATCH `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} [data]
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.patch = function(url, data, fn){
	  var req = request('PATCH', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * POST `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} [data]
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.post = function(url, data, fn){
	  var req = request('POST', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * PUT `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.put = function(url, data, fn){
	  var req = request('PUT', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `Emitter`.
	 */
	
	if (true) {
	  module.exports = Emitter;
	}
	
	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */
	
	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};
	
	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */
	
	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}
	
	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};
	
	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }
	
	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};
	
	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	
	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }
	
	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;
	
	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }
	
	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};
	
	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */
	
	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];
	
	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }
	
	  return this;
	};
	
	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */
	
	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};
	
	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */
	
	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module of mixed-in functions shared between node and client code
	 */
	var isObject = __webpack_require__(13);
	
	/**
	 * Clear previous timeout.
	 *
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.clearTimeout = function _clearTimeout(){
	  this._timeout = 0;
	  clearTimeout(this._timer);
	  return this;
	};
	
	/**
	 * Override default response body parser
	 *
	 * This function will be called to convert incoming data into request.body
	 *
	 * @param {Function}
	 * @api public
	 */
	
	exports.parse = function parse(fn){
	  this._parser = fn;
	  return this;
	};
	
	/**
	 * Override default request body serializer
	 *
	 * This function will be called to convert data set via .send or .attach into payload to send
	 *
	 * @param {Function}
	 * @api public
	 */
	
	exports.serialize = function serialize(fn){
	  this._serializer = fn;
	  return this;
	};
	
	/**
	 * Set timeout to `ms`.
	 *
	 * @param {Number} ms
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.timeout = function timeout(ms){
	  this._timeout = ms;
	  return this;
	};
	
	/**
	 * Promise support
	 *
	 * @param {Function} resolve
	 * @param {Function} reject
	 * @return {Request}
	 */
	
	exports.then = function then(resolve, reject) {
	  if (!this._fullfilledPromise) {
	    var self = this;
	    this._fullfilledPromise = new Promise(function(innerResolve, innerReject){
	      self.end(function(err, res){
	        if (err) innerReject(err); else innerResolve(res);
	      });
	    });
	  }
	  return this._fullfilledPromise.then(resolve, reject);
	}
	
	exports.catch = function(cb) {
	  return this.then(undefined, cb);
	};
	
	/**
	 * Allow for extension
	 */
	
	exports.use = function use(fn) {
	  fn(this);
	  return this;
	}
	
	
	/**
	 * Get request header `field`.
	 * Case-insensitive.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */
	
	exports.get = function(field){
	  return this._header[field.toLowerCase()];
	};
	
	/**
	 * Get case-insensitive header `field` value.
	 * This is a deprecated internal API. Use `.get(field)` instead.
	 *
	 * (getHeader is no longer used internally by the superagent code base)
	 *
	 * @param {String} field
	 * @return {String}
	 * @api private
	 * @deprecated
	 */
	
	exports.getHeader = exports.get;
	
	/**
	 * Set header `field` to `val`, or multiple fields with one object.
	 * Case-insensitive.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .set('Accept', 'application/json')
	 *        .set('X-API-Key', 'foobar')
	 *        .end(callback);
	 *
	 *      req.get('/')
	 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
	 *        .end(callback);
	 *
	 * @param {String|Object} field
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.set = function(field, val){
	  if (isObject(field)) {
	    for (var key in field) {
	      this.set(key, field[key]);
	    }
	    return this;
	  }
	  this._header[field.toLowerCase()] = val;
	  this.header[field] = val;
	  return this;
	};
	
	/**
	 * Remove header `field`.
	 * Case-insensitive.
	 *
	 * Example:
	 *
	 *      req.get('/')
	 *        .unset('User-Agent')
	 *        .end(callback);
	 *
	 * @param {String} field
	 */
	exports.unset = function(field){
	  delete this._header[field.toLowerCase()];
	  delete this.header[field];
	  return this;
	};
	
	/**
	 * Write the field `name` and `val`, or multiple fields with one object
	 * for "multipart/form-data" request bodies.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .field('foo', 'bar')
	 *   .end(callback);
	 *
	 * request.post('/upload')
	 *   .field({ foo: 'bar', baz: 'qux' })
	 *   .end(callback);
	 * ```
	 *
	 * @param {String|Object} name
	 * @param {String|Blob|File|Buffer|fs.ReadStream} val
	 * @return {Request} for chaining
	 * @api public
	 */
	exports.field = function(name, val) {
	
	  // name should be either a string or an object.
	  if (null === name ||  undefined === name) {
	    throw new Error('.field(name, val) name can not be empty');
	  }
	
	  if (isObject(name)) {
	    for (var key in name) {
	      this.field(key, name[key]);
	    }
	    return this;
	  }
	
	  // val should be defined now
	  if (null === val || undefined === val) {
	    throw new Error('.field(name, val) val can not be empty');
	  }
	  this._getFormData().append(name, val);
	  return this;
	};
	
	/**
	 * Abort the request, and clear potential timeout.
	 *
	 * @return {Request}
	 * @api public
	 */
	exports.abort = function(){
	  if (this._aborted) {
	    return this;
	  }
	  this._aborted = true;
	  this.xhr && this.xhr.abort(); // browser
	  this.req && this.req.abort(); // node
	  this.clearTimeout();
	  this.emit('abort');
	  return this;
	};
	
	/**
	 * Enable transmission of cookies with x-domain requests.
	 *
	 * Note that for this to work the origin must not be
	 * using "Access-Control-Allow-Origin" with a wildcard,
	 * and also must set "Access-Control-Allow-Credentials"
	 * to "true".
	 *
	 * @api public
	 */
	
	exports.withCredentials = function(){
	  // This is browser-only functionality. Node side is no-op.
	  this._withCredentials = true;
	  return this;
	};
	
	/**
	 * Set the max redirects to `n`. Does noting in browser XHR implementation.
	 *
	 * @param {Number} n
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.redirects = function(n){
	  this._maxRedirects = n;
	  return this;
	};
	
	/**
	 * Convert to a plain javascript object (not JSON string) of scalar properties.
	 * Note as this method is designed to return a useful non-this value,
	 * it cannot be chained.
	 *
	 * @return {Object} describing method, url, and data of this request
	 * @api public
	 */
	
	exports.toJSON = function(){
	  return {
	    method: this.method,
	    url: this.url,
	    data: this._data,
	    headers: this._header
	  };
	};
	
	/**
	 * Check if `obj` is a host object,
	 * we don't want to serialize these :)
	 *
	 * TODO: future proof, move to compoent land
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */
	
	exports._isHost = function _isHost(obj) {
	  var str = {}.toString.call(obj);
	
	  switch (str) {
	    case '[object File]':
	    case '[object Blob]':
	    case '[object FormData]':
	      return true;
	    default:
	      return false;
	  }
	}
	
	/**
	 * Send `data` as the request body, defaulting the `.type()` to "json" when
	 * an object is given.
	 *
	 * Examples:
	 *
	 *       // manual json
	 *       request.post('/user')
	 *         .type('json')
	 *         .send('{"name":"tj"}')
	 *         .end(callback)
	 *
	 *       // auto json
	 *       request.post('/user')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // manual x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send('name=tj')
	 *         .end(callback)
	 *
	 *       // auto x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // defaults to x-www-form-urlencoded
	 *      request.post('/user')
	 *        .send('name=tobi')
	 *        .send('species=ferret')
	 *        .end(callback)
	 *
	 * @param {String|Object} data
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.send = function(data){
	  var obj = isObject(data);
	  var type = this._header['content-type'];
	
	  // merge
	  if (obj && isObject(this._data)) {
	    for (var key in data) {
	      this._data[key] = data[key];
	    }
	  } else if ('string' == typeof data) {
	    // default to x-www-form-urlencoded
	    if (!type) this.type('form');
	    type = this._header['content-type'];
	    if ('application/x-www-form-urlencoded' == type) {
	      this._data = this._data
	        ? this._data + '&' + data
	        : data;
	    } else {
	      this._data = (this._data || '') + data;
	    }
	  } else {
	    this._data = data;
	  }
	
	  if (!obj || this._isHost(data)) return this;
	
	  // default to json
	  if (!type) this.type('json');
	  return this;
	};


/***/ },
/* 13 */
/***/ function(module, exports) {

	/**
	 * Check if `obj` is an object.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */
	
	function isObject(obj) {
	  return null !== obj && 'object' === typeof obj;
	}
	
	module.exports = isObject;


/***/ },
/* 14 */
/***/ function(module, exports) {

	// The node and browser modules expose versions of this with the
	// appropriate constructor function bound as first argument
	/**
	 * Issue a request:
	 *
	 * Examples:
	 *
	 *    request('GET', '/users').end(callback)
	 *    request('/users').end(callback)
	 *    request('/users', callback)
	 *
	 * @param {String} method
	 * @param {String|Function} url or callback
	 * @return {Request}
	 * @api public
	 */
	
	function request(RequestConstructor, method, url) {
	  // callback
	  if ('function' == typeof url) {
	    return new RequestConstructor('GET', method).end(url);
	  }
	
	  // url first
	  if (2 == arguments.length) {
	    return new RequestConstructor('GET', method);
	  }
	
	  return new RequestConstructor(method, url);
	}
	
	module.exports = request;


/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
		// テキストエリアの自動リサイズ
		// @ http://qiita.com/YoshiyukiKato/items/507b8022e6df5e996a59
		autoResize: function autoResize(target) {
			var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 25;
			var lh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 25;
	
			target.style.height = h + 'px';
			target.style.lineHeight = lh + 'px';
			target.addEventListener('input', function (e) {
				// 中身とTextareaの大きさを比較して高さを付与
				if (e.target.scrollHeight > e.target.offsetHeight) {
					e.target.style.height = e.target.scrollHeight + 'px';
				} else {
					var height = void 0,
					    lineHeight = void 0;
					while (true) {
						// 外側の高さを取得
						height = +e.target.style.height.split('px')[0];
						// lineHeighの値を取得
						lineHeight = +e.target.style.lineHeight.split('px')[0];
						e.target.style.height = height - lineHeight + 'px';
						if (e.target.scrollHeight > e.target.offsetHeight) {
							e.target.style.height = e.target.scrollHeight + 'px';
							break;
						}
					}
				}
			});
		}
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * Anime v1.1.1
	 * http://anime-js.com
	 * JavaScript animation engine
	 * Copyright (c) 2016 Julian Garnier
	 * http://juliangarnier.com
	 * Released under the MIT license
	 */
	
	(function (root, factory) {
	  if (true) {
	    // AMD. Register as an anonymous module.
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof module === 'object' && module.exports) {
	    // Node. Does not work with strict CommonJS, but
	    // only CommonJS-like environments that support module.exports,
	    // like Node.
	    module.exports = factory();
	  } else {
	    // Browser globals (root is window)
	    root.anime = factory();
	  }
	}(this, function () {
	
	  var version = '1.1.1';
	
	  // Defaults
	
	  var defaultSettings = {
	    duration: 1000,
	    delay: 0,
	    loop: false,
	    autoplay: true,
	    direction: 'normal',
	    easing: 'easeOutElastic',
	    elasticity: 400,
	    round: false,
	    begin: undefined,
	    update: undefined,
	    complete: undefined
	  }
	
	  // Transforms
	
	  var validTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skewX', 'skewY'];
	  var transform, transformStr = 'transform';
	
	  // Utils
	
	  var is = {
	    arr: function(a) { return Array.isArray(a) },
	    obj: function(a) { return Object.prototype.toString.call(a).indexOf('Object') > -1 },
	    svg: function(a) { return a instanceof SVGElement },
	    dom: function(a) { return a.nodeType || is.svg(a) },
	    num: function(a) { return !isNaN(parseInt(a)) },
	    str: function(a) { return typeof a === 'string' },
	    fnc: function(a) { return typeof a === 'function' },
	    und: function(a) { return typeof a === 'undefined' },
	    nul: function(a) { return typeof a === 'null' },
	    hex: function(a) { return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a) },
	    rgb: function(a) { return /^rgb/.test(a) },
	    hsl: function(a) { return /^hsl/.test(a) },
	    col: function(a) { return (is.hex(a) || is.rgb(a) || is.hsl(a)) }
	  }
	
	  // Easings functions adapted from http://jqueryui.com/
	
	  var easings = (function() {
	    var eases = {};
	    var names = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];
	    var functions = {
	      Sine: function(t) { return 1 - Math.cos( t * Math.PI / 2 ); },
	      Circ: function(t) { return 1 - Math.sqrt( 1 - t * t ); },
	      Elastic: function(t, m) {
	        if( t === 0 || t === 1 ) return t;
	        var p = (1 - Math.min(m, 998) / 1000), st = t / 1, st1 = st - 1, s = p / ( 2 * Math.PI ) * Math.asin( 1 );
	        return -( Math.pow( 2, 10 * st1 ) * Math.sin( ( st1 - s ) * ( 2 * Math.PI ) / p ) );
	      },
	      Back: function(t) { return t * t * ( 3 * t - 2 ); },
	      Bounce: function(t) {
	        var pow2, bounce = 4;
	        while ( t < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
	        return 1 / Math.pow( 4, 3 - bounce ) - 7.5625 * Math.pow( ( pow2 * 3 - 2 ) / 22 - t, 2 );
	      }
	    }
	    names.forEach(function(name, i) {
	      functions[name] = function(t) {
	        return Math.pow( t, i + 2 );
	      }
	    });
	    Object.keys(functions).forEach(function(name) {
	      var easeIn = functions[name];
	      eases['easeIn' + name] = easeIn;
	      eases['easeOut' + name] = function(t, m) { return 1 - easeIn(1 - t, m); };
	      eases['easeInOut' + name] = function(t, m) { return t < 0.5 ? easeIn(t * 2, m) / 2 : 1 - easeIn(t * -2 + 2, m) / 2; };
	      eases['easeOutIn' + name] = function(t, m) { return t < 0.5 ? (1 - easeIn(1 - 2 * t, m)) / 2 : (easeIn(t * 2 - 1, m) + 1) / 2; };
	    });
	    eases.linear = function(t) { return t; };
	    return eases;
	  })();
	
	  // Strings
	
	  var numberToString = function(val) {
	    return (is.str(val)) ? val : val + '';
	  }
	
	  var stringToHyphens = function(str) {
	    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	  }
	
	  var selectString = function(str) {
	    if (is.col(str)) return false;
	    try {
	      var nodes = document.querySelectorAll(str);
	      return nodes;
	    } catch(e) {
	      return false;
	    }
	  }
	
	  // Numbers
	
	  var random = function(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	  }
	
	  // Arrays
	
	  var flattenArray = function(arr) {
	    return arr.reduce(function(a, b) {
	      return a.concat(is.arr(b) ? flattenArray(b) : b);
	    }, []);
	  }
	
	  var toArray = function(o) {
	    if (is.arr(o)) return o;
	    if (is.str(o)) o = selectString(o) || o;
	    if (o instanceof NodeList || o instanceof HTMLCollection) return [].slice.call(o);
	    return [o];
	  }
	
	  var arrayContains = function(arr, val) {
	    return arr.some(function(a) { return a === val; });
	  }
	
	  var groupArrayByProps = function(arr, propsArr) {
	    var groups = {};
	    arr.forEach(function(o) {
	      var group = JSON.stringify(propsArr.map(function(p) { return o[p]; }));
	      groups[group] = groups[group] || [];
	      groups[group].push(o);
	    });
	    return Object.keys(groups).map(function(group) {
	      return groups[group];
	    });
	  }
	
	  var removeArrayDuplicates = function(arr) {
	    return arr.filter(function(item, pos, self) {
	      return self.indexOf(item) === pos;
	    });
	  }
	
	  // Objects
	
	  var cloneObject = function(o) {
	    var newObject = {};
	    for (var p in o) newObject[p] = o[p];
	    return newObject;
	  }
	
	  var mergeObjects = function(o1, o2) {
	    for (var p in o2) o1[p] = !is.und(o1[p]) ? o1[p] : o2[p];
	    return o1;
	  }
	
	  // Colors
	
	  var hexToRgb = function(hex) {
	    var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	    var hex = hex.replace(rgx, function(m, r, g, b) { return r + r + g + g + b + b; });
	    var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    var r = parseInt(rgb[1], 16);
	    var g = parseInt(rgb[2], 16);
	    var b = parseInt(rgb[3], 16);
	    return 'rgb(' + r + ',' + g + ',' + b + ')';
	  }
	
	  var hslToRgb = function(hsl) {
	    var hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hsl);
	    var h = parseInt(hsl[1]) / 360;
	    var s = parseInt(hsl[2]) / 100;
	    var l = parseInt(hsl[3]) / 100;
	    var hue2rgb = function(p, q, t) {
	      if (t < 0) t += 1;
	      if (t > 1) t -= 1;
	      if (t < 1/6) return p + (q - p) * 6 * t;
	      if (t < 1/2) return q;
	      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	      return p;
	    }
	    var r, g, b;
	    if (s == 0) {
	      r = g = b = l;
	    } else {
	      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	      var p = 2 * l - q;
	      r = hue2rgb(p, q, h + 1/3);
	      g = hue2rgb(p, q, h);
	      b = hue2rgb(p, q, h - 1/3);
	    }
	    return 'rgb(' + r * 255 + ',' + g * 255 + ',' + b * 255 + ')';
	  }
	
	  var colorToRgb = function(val) {
	    if (is.rgb(val)) return val;
	    if (is.hex(val)) return hexToRgb(val);
	    if (is.hsl(val)) return hslToRgb(val);
	  }
	
	  // Units
	
	  var getUnit = function(val) {
	    return /([\+\-]?[0-9|auto\.]+)(%|px|pt|em|rem|in|cm|mm|ex|pc|vw|vh|deg)?/.exec(val)[2];
	  }
	
	  var addDefaultTransformUnit = function(prop, val, intialVal) {
	    if (getUnit(val)) return val;
	    if (prop.indexOf('translate') > -1) return getUnit(intialVal) ? val + getUnit(intialVal) : val + 'px';
	    if (prop.indexOf('rotate') > -1 || prop.indexOf('skew') > -1) return val + 'deg';
	    return val;
	  }
	
	  // Values
	
	  var getCSSValue = function(el, prop) {
	    // First check if prop is a valid CSS property
	    if (prop in el.style) {
	      // Then return the property value or fallback to '0' when getPropertyValue fails
	      return getComputedStyle(el).getPropertyValue(stringToHyphens(prop)) || '0';
	    }
	  }
	
	  var getTransformValue = function(el, prop) {
	    var defaultVal = prop.indexOf('scale') > -1 ? 1 : 0;
	    var str = el.style.transform;
	    if (!str) return defaultVal;
	    var rgx = /(\w+)\((.+?)\)/g;
	    var match = [];
	    var props = [];
	    var values = [];
	    while (match = rgx.exec(str)) {
	      props.push(match[1]);
	      values.push(match[2]);
	    }
	    var val = values.filter(function(f, i) { return props[i] === prop; });
	    return val.length ? val[0] : defaultVal;
	  }
	
	  var getAnimationType = function(el, prop) {
	    if ( is.dom(el) && arrayContains(validTransforms, prop)) return 'transform';
	    if ( is.dom(el) && (el.getAttribute(prop) || (is.svg(el) && el[prop]))) return 'attribute';
	    if ( is.dom(el) && (prop !== 'transform' && getCSSValue(el, prop))) return 'css';
	    if (!is.nul(el[prop]) && !is.und(el[prop])) return 'object';
	  }
	
	  var getInitialTargetValue = function(target, prop) {
	    switch (getAnimationType(target, prop)) {
	      case 'transform': return getTransformValue(target, prop);
	      case 'css': return getCSSValue(target, prop);
	      case 'attribute': return target.getAttribute(prop);
	    }
	    return target[prop] || 0;
	  }
	
	  var getValidValue = function(values, val, originalCSS) {
	    if (is.col(val)) return colorToRgb(val);
	    if (getUnit(val)) return val;
	    var unit = getUnit(values.to) ? getUnit(values.to) : getUnit(values.from);
	    if (!unit && originalCSS) unit = getUnit(originalCSS);
	    return unit ? val + unit : val;
	  }
	
	  var decomposeValue = function(val) {
	    var rgx = /-?\d*\.?\d+/g;
	    return {
	      original: val,
	      numbers: numberToString(val).match(rgx) ? numberToString(val).match(rgx).map(Number) : [0],
	      strings: numberToString(val).split(rgx)
	    }
	  }
	
	  var recomposeValue = function(numbers, strings, initialStrings) {
	    return strings.reduce(function(a, b, i) {
	      var b = (b ? b : initialStrings[i - 1]);
	      return a + numbers[i - 1] + b;
	    });
	  }
	
	  // Animatables
	
	  var getAnimatables = function(targets) {
	    var targets = targets ? (flattenArray(is.arr(targets) ? targets.map(toArray) : toArray(targets))) : [];
	    return targets.map(function(t, i) {
	      return { target: t, id: i };
	    });
	  }
	
	  // Properties
	
	  var getProperties = function(params, settings) {
	    var props = [];
	    for (var p in params) {
	      if (!defaultSettings.hasOwnProperty(p) && p !== 'targets') {
	        var prop = is.obj(params[p]) ? cloneObject(params[p]) : {value: params[p]};
	        prop.name = p;
	        props.push(mergeObjects(prop, settings));
	      }
	    }
	    return props;
	  }
	
	  var getPropertiesValues = function(target, prop, value, i) {
	    var values = toArray( is.fnc(value) ? value(target, i) : value);
	    return {
	      from: (values.length > 1) ? values[0] : getInitialTargetValue(target, prop),
	      to: (values.length > 1) ? values[1] : values[0]
	    }
	  }
	
	  // Tweens
	
	  var getTweenValues = function(prop, values, type, target) {
	    var valid = {};
	    if (type === 'transform') {
	      valid.from = prop + '(' + addDefaultTransformUnit(prop, values.from, values.to) + ')';
	      valid.to = prop + '(' + addDefaultTransformUnit(prop, values.to) + ')';
	    } else {
	      var originalCSS = (type === 'css') ? getCSSValue(target, prop) : undefined;
	      valid.from = getValidValue(values, values.from, originalCSS);
	      valid.to = getValidValue(values, values.to, originalCSS);
	    }
	    return { from: decomposeValue(valid.from), to: decomposeValue(valid.to) };
	  }
	
	  var getTweensProps = function(animatables, props) {
	    var tweensProps = [];
	    animatables.forEach(function(animatable, i) {
	      var target = animatable.target;
	      return props.forEach(function(prop) {
	        var animType = getAnimationType(target, prop.name);
	        if (animType) {
	          var values = getPropertiesValues(target, prop.name, prop.value, i);
	          var tween = cloneObject(prop);
	          tween.animatables = animatable;
	          tween.type = animType;
	          tween.from = getTweenValues(prop.name, values, tween.type, target).from;
	          tween.to = getTweenValues(prop.name, values, tween.type, target).to;
	          tween.round = (is.col(values.from) || tween.round) ? 1 : 0;
	          tween.delay = (is.fnc(tween.delay) ? tween.delay(target, i, animatables.length) : tween.delay) / animation.speed;
	          tween.duration = (is.fnc(tween.duration) ? tween.duration(target, i, animatables.length) : tween.duration) / animation.speed;
	          tweensProps.push(tween);
	        }
	      });
	    });
	    return tweensProps;
	  }
	
	  var getTweens = function(animatables, props) {
	    var tweensProps = getTweensProps(animatables, props);
	    var splittedProps = groupArrayByProps(tweensProps, ['name', 'from', 'to', 'delay', 'duration']);
	    return splittedProps.map(function(tweenProps) {
	      var tween = cloneObject(tweenProps[0]);
	      tween.animatables = tweenProps.map(function(p) { return p.animatables });
	      tween.totalDuration = tween.delay + tween.duration;
	      return tween;
	    });
	  }
	
	  var reverseTweens = function(anim, delays) {
	    anim.tweens.forEach(function(tween) {
	      var toVal = tween.to;
	      var fromVal = tween.from;
	      var delayVal = anim.duration - (tween.delay + tween.duration);
	      tween.from = toVal;
	      tween.to = fromVal;
	      if (delays) tween.delay = delayVal;
	    });
	    anim.reversed = anim.reversed ? false : true;
	  }
	
	  var getTweensDuration = function(tweens) {
	    if (tweens.length) return Math.max.apply(Math, tweens.map(function(tween){ return tween.totalDuration; }));
	  }
	
	  // will-change
	
	  var getWillChange = function(anim) {
	    var props = [];
	    var els = [];
	    anim.tweens.forEach(function(tween) {
	      if (tween.type === 'css' || tween.type === 'transform' ) {
	        props.push(tween.type === 'css' ? stringToHyphens(tween.name) : 'transform');
	        tween.animatables.forEach(function(animatable) { els.push(animatable.target); });
	      }
	    });
	    return {
	      properties: removeArrayDuplicates(props).join(', '),
	      elements: removeArrayDuplicates(els)
	    }
	  }
	
	  var setWillChange = function(anim) {
	    var willChange = getWillChange(anim);
	    willChange.elements.forEach(function(element) {
	      element.style.willChange = willChange.properties;
	    });
	  }
	
	  var removeWillChange = function(anim) {
	    var willChange = getWillChange(anim);
	    willChange.elements.forEach(function(element) {
	      element.style.removeProperty('will-change');
	    });
	  }
	
	  /* Svg path */
	
	  var getPathProps = function(path) {
	    var el = is.str(path) ? selectString(path)[0] : path;
	    return {
	      path: el,
	      value: el.getTotalLength()
	    }
	  }
	
	  var snapProgressToPath = function(tween, progress) {
	    var pathEl = tween.path;
	    var pathProgress = tween.value * progress;
	    var point = function(offset) {
	      var o = offset || 0;
	      var p = progress > 1 ? tween.value + o : pathProgress + o;
	      return pathEl.getPointAtLength(p);
	    }
	    var p = point();
	    var p0 = point(-1);
	    var p1 = point(+1);
	    switch (tween.name) {
	      case 'translateX': return p.x;
	      case 'translateY': return p.y;
	      case 'rotate': return Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
	    }
	  }
	
	  // Progress
	
	  var getTweenProgress = function(tween, time) {
	    var elapsed = Math.min(Math.max(time - tween.delay, 0), tween.duration);
	    var percent = elapsed / tween.duration;
	    var progress = tween.to.numbers.map(function(number, p) {
	      var start = tween.from.numbers[p];
	      var eased = easings[tween.easing](percent, tween.elasticity);
	      var val = tween.path ? snapProgressToPath(tween, eased) : start + eased * (number - start);
	      val = tween.round ? Math.round(val * tween.round) / tween.round : val;
	      return val;
	    });
	    return recomposeValue(progress, tween.to.strings, tween.from.strings);
	  }
	
	  var setAnimationProgress = function(anim, time) {
	    var transforms;
	    anim.currentTime = time;
	    anim.progress = (time / anim.duration) * 100;
	    for (var t = 0; t < anim.tweens.length; t++) {
	      var tween = anim.tweens[t];
	      tween.currentValue = getTweenProgress(tween, time);
	      var progress = tween.currentValue;
	      for (var a = 0; a < tween.animatables.length; a++) {
	        var animatable = tween.animatables[a];
	        var id = animatable.id;
	        var target = animatable.target;
	        var name = tween.name;
	        switch (tween.type) {
	          case 'css': target.style[name] = progress; break;
	          case 'attribute': target.setAttribute(name, progress); break;
	          case 'object': target[name] = progress; break;
	          case 'transform':
	          if (!transforms) transforms = {};
	          if (!transforms[id]) transforms[id] = [];
	          transforms[id].push(progress);
	          break;
	        }
	      }
	    }
	    if (transforms) {
	      if (!transform) transform = (getCSSValue(document.body, transformStr) ? '' : '-webkit-') + transformStr;
	      for (var t in transforms) {
	        anim.animatables[t].target.style[transform] = transforms[t].join(' ');
	      }
	    }
	    if (anim.settings.update) anim.settings.update(anim);
	  }
	
	  // Animation
	
	  var createAnimation = function(params) {
	    var anim = {};
	    anim.animatables = getAnimatables(params.targets);
	    anim.settings = mergeObjects(params, defaultSettings);
	    anim.properties = getProperties(params, anim.settings);
	    anim.tweens = getTweens(anim.animatables, anim.properties);
	    anim.duration = getTweensDuration(anim.tweens) || params.duration;
	    anim.currentTime = 0;
	    anim.progress = 0;
	    anim.ended = false;
	    return anim;
	  }
	
	  // Public
	
	  var animations = [];
	  var raf = 0;
	
	  var engine = (function() {
	    var play = function() { raf = requestAnimationFrame(step); };
	    var step = function(t) {
	      if (animations.length) {
	        for (var i = 0; i < animations.length; i++) animations[i].tick(t);
	        play();
	      } else {
	        cancelAnimationFrame(raf);
	        raf = 0;
	      }
	    }
	    return play;
	  })();
	
	  var animation = function(params) {
	
	    var anim = createAnimation(params);
	    var time = {};
	
	    anim.tick = function(now) {
	      anim.ended = false;
	      if (!time.start) time.start = now;
	      time.current = Math.min(Math.max(time.last + now - time.start, 0), anim.duration);
	      setAnimationProgress(anim, time.current);
	      var s = anim.settings;
	      if (s.begin && time.current >= s.delay) { s.begin(anim); s.begin = undefined; };
	      if (time.current >= anim.duration) {
	        if (s.loop) {
	          time.start = now;
	          if (s.direction === 'alternate') reverseTweens(anim, true);
	          if (is.num(s.loop)) s.loop--;
	        } else {
	          anim.ended = true;
	          anim.pause();
	          if (s.complete) s.complete(anim);
	        }
	        time.last = 0;
	      }
	    }
	
	    anim.seek = function(progress) {
	      setAnimationProgress(anim, (progress / 100) * anim.duration);
	    }
	
	    anim.pause = function() {
	      removeWillChange(anim);
	      var i = animations.indexOf(anim);
	      if (i > -1) animations.splice(i, 1);
	    }
	
	    anim.play = function(params) {
	      anim.pause();
	      if (params) anim = mergeObjects(createAnimation(mergeObjects(params, anim.settings)), anim);
	      time.start = 0;
	      time.last = anim.ended ? 0 : anim.currentTime;
	      var s = anim.settings;
	      if (s.direction === 'reverse') reverseTweens(anim);
	      if (s.direction === 'alternate' && !s.loop) s.loop = 1;
	      setWillChange(anim);
	      animations.push(anim);
	      if (!raf) engine();
	    }
	
	    anim.restart = function() {
	      if (anim.reversed) reverseTweens(anim);
	      anim.pause();
	      anim.seek(0);
	      anim.play();
	    }
	
	    if (anim.settings.autoplay) anim.play();
	
	    return anim;
	
	  }
	
	  // Remove one or multiple targets from all active animations.
	
	  var remove = function(elements) {
	    var targets = flattenArray(is.arr(elements) ? elements.map(toArray) : toArray(elements));
	    for (var i = animations.length-1; i >= 0; i--) {
	      var animation = animations[i];
	      var tweens = animation.tweens;
	      for (var t = tweens.length-1; t >= 0; t--) {
	        var animatables = tweens[t].animatables;
	        for (var a = animatables.length-1; a >= 0; a--) {
	          if (arrayContains(targets, animatables[a].target)) {
	            animatables.splice(a, 1);
	            if (!animatables.length) tweens.splice(t, 1);
	            if (!tweens.length) animation.pause();
	          }
	        }
	      }
	    }
	  }
	
	  animation.version = version;
	  animation.speed = 1;
	  animation.list = animations;
	  animation.remove = remove;
	  animation.easings = easings;
	  animation.getValue = getInitialTargetValue;
	  animation.path = getPathProps;
	  animation.random = random;
	
	  return animation;
	
	}));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('menu-list', '<ol class="menu-list-wrapper"> <li each="{type in data}"> <ol class="menu-list"> <li each="{cat in type.list}"> <div onclick="{openItems}" class="category test sample what">{cat.ja}</div> <ol class="menu-item"> <li each="{item in cat.menu}" onclick="{changeItem(item)}"> <div class="left"> <div riot-style="background-image: url(./images/menu/{item.image})" class="thumb"></div> </div> <div class="right"> <div class="name">{item.name}</div> <div class="price">{item.price}円</div> <div class="comment">{item.comment}</div> </div> </li> </ol> </li> </ol> </li> </ol>', 'menu-list .menu-list-wrapper .menu-list .category,[riot-tag="menu-list"] .menu-list-wrapper .menu-list .category,[data-is="menu-list"] .menu-list-wrapper .menu-list .category{ position: relative; width: 100%; height: 40px; border-bottom: 1px solid #ccc; line-height: 40px; text-align: center; transition: background-color .4 ease; } menu-list .menu-list-wrapper .menu-list .category::before,[riot-tag="menu-list"] .menu-list-wrapper .menu-list .category::before,[data-is="menu-list"] .menu-list-wrapper .menu-list .category::before{ content: "\\f123"; position: absolute; left: 0; display: block; width: 40px; height: 40px; text-align: center; line-height: 40px; font-family: \'Ionicons\'; font-size: 13px; transform: rotate(-90deg); } menu-list .menu-list-wrapper .menu-list .category:hover,[riot-tag="menu-list"] .menu-list-wrapper .menu-list .category:hover,[data-is="menu-list"] .menu-list-wrapper .menu-list .category:hover{ background: #ccc; } menu-list .menu-list-wrapper .menu-list .category.open::before,[riot-tag="menu-list"] .menu-list-wrapper .menu-list .category.open::before,[data-is="menu-list"] .menu-list-wrapper .menu-list .category.open::before{ transform: rotate(0); } menu-list .menu-list-wrapper .menu-list .category.open + .menu-item,[riot-tag="menu-list"] .menu-list-wrapper .menu-list .category.open + .menu-item,[data-is="menu-list"] .menu-list-wrapper .menu-list .category.open + .menu-item{ display: block; } menu-list .menu-list-wrapper .menu-list .menu-item,[riot-tag="menu-list"] .menu-list-wrapper .menu-list .menu-item,[data-is="menu-list"] .menu-list-wrapper .menu-list .menu-item{ display: none; } menu-list .menu-list-wrapper .menu-list .menu-item li,[riot-tag="menu-list"] .menu-list-wrapper .menu-list .menu-item li,[data-is="menu-list"] .menu-list-wrapper .menu-list .menu-item li{ overflow: hidden; clear: both; height: 80px; border-bottom: 1px solid #ccc; } menu-list .menu-list-wrapper .menu-list .menu-item li:hover,[riot-tag="menu-list"] .menu-list-wrapper .menu-list .menu-item li:hover,[data-is="menu-list"] .menu-list-wrapper .menu-list .menu-item li:hover{ background: #ddd; } menu-list .menu-list-wrapper .menu-list .menu-item li .left,[riot-tag="menu-list"] .menu-list-wrapper .menu-list .menu-item li .left,[data-is="menu-list"] .menu-list-wrapper .menu-list .menu-item li .left{ float: left; width: 120px; } menu-list .menu-list-wrapper .menu-list .menu-item li .left .thumb,[riot-tag="menu-list"] .menu-list-wrapper .menu-list .menu-item li .left .thumb,[data-is="menu-list"] .menu-list-wrapper .menu-list .menu-item li .left .thumb{ width: 100px; height: 70px; margin: 5px 10px; background: center center no-repeat #eee; background-size: cover; } menu-list .menu-list-wrapper .menu-list .menu-item li .right,[riot-tag="menu-list"] .menu-list-wrapper .menu-list .menu-item li .right,[data-is="menu-list"] .menu-list-wrapper .menu-list .menu-item li .right{ margin-left: 120px; padding: 15px 5px 0 0; } menu-list .menu-list-wrapper .menu-list .menu-item li .right > div,[riot-tag="menu-list"] .menu-list-wrapper .menu-list .menu-item li .right > div,[data-is="menu-list"] .menu-list-wrapper .menu-list .menu-item li .right > div{ overflow: hidden; white-space: nowrap; text-overflow: ellipsis; } menu-list .menu-list-wrapper .menu-list .menu-item li .right .name,[riot-tag="menu-list"] .menu-list-wrapper .menu-list .menu-item li .right .name,[data-is="menu-list"] .menu-list-wrapper .menu-list .menu-item li .right .name{ height: 20px; line-height: 20px; font-size: 16px; } menu-list .menu-list-wrapper .menu-list .menu-item li .right .price,[riot-tag="menu-list"] .menu-list-wrapper .menu-list .menu-item li .right .price,[data-is="menu-list"] .menu-list-wrapper .menu-list .menu-item li .right .price{ height: 15px; line-height: 15px; font-size: 10px; } menu-list .menu-list-wrapper .menu-list .menu-item li .right .comment,[riot-tag="menu-list"] .menu-list-wrapper .menu-list .menu-item li .right .comment,[data-is="menu-list"] .menu-list-wrapper .menu-list .menu-item li .right .comment{ height: 20px; line-height: 20px; font-size: 12px; }', '', function (opts) {
	    var store = __webpack_require__(9);
	    var self = this;
	
	    self.toggleItem = function (_this) {
	        return function () {
	            console.log(_this);
	            _this.cat.isOpen = ~_this.cat.isOpen;
	            self.update();
	        };
	    };
	
	    self.changeItem = function (data) {
	        return function () {
	            obs.trigger('changeRecommend', data);
	        };
	    };
	
	    self.openItems = function (e) {
	        var $elem = e.target;
	
	        if (~$elem.classList.value.indexOf('open')) {
	            $elem.classList.remove('open');
	        } else {
	            $elem.classList.add('open');
	        }
	    };
	
	    store.getMenuList().then(function (data) {
	        self.data = data;
	        console.log(data);
	        self.update();
	    });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('menu', '<menu-list></menu-list>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('news', '<news-list></news-list>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('news-list', '<a href="#/news/editor/new" class="btn btn-danger btn-block btn-large">記事を書く</a>', '', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	riot.tag2('news-editor', '<div class="news-editor"> <ul class="input-group"> <li><span class="label">タイトル</span> <div class="input large"> <textarea id="inputTitle" class="input-form"></textarea> </div> </li> <li><span class="label">記事ID（半角英数と-のみ）</span> <div class="input small"> <input placeholder="省略した場合はentry+date" class="input-form"> </div><span class="note note-danger"><span class="ion-alert-circled icon"></span>半角英数字と - (ハイフン)のみ入力可能です</span> </li> <li> <news-editor-body></news-editor-body> </li> </ul> </div>', '.input-group { padding: 8px 12px; } .input-group li { margin-bottom: 15px; } .input-group li .label { margin-bottom: 5px; font-size: 12px; font-weight: bold; } .input-group li .note { display: block; margin: 4px 10px; font-size: 12px; font-weight: bold; visibility: hidden; } .input-group li .note.note-danger { color: #eb2142; } .input-group li .note .icon { margin-right: 5px; } .input { position: relative; } .input::before { content: ""; position: absolute; left: 0; bottom: 0; display: block; width: 100%; height: 2px; border-top: 0; border-left: 1px solid #aaa; border-bottom: 1px solid #aaa; border-right: 1px solid #aaa; } .input .input-form { width: 100%; padding: 0 5px; box-sizing: border-box; border: none; } .input textarea.input-form { resize: none; } .input.large .input-form { font-size: 20px; line-height: 40px; } .input.normal .input-form { font-size: 16px; line-height: 30px; } .input.small .input-form { font-size: 14px; line-height: 20px; }', '', function (opts) {
	    var utils = __webpack_require__(15);
	
	    this.on('mount', function () {
	        utils.autoResize(document.getElementById('inputTitle'));
	    });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYzQxMjY5OTNiNzY0MGVmMTA2ZGQiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvZW50cnkuanMiLCJ3ZWJwYWNrOi8vLy4vfi9yaW90L3Jpb3QuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2FtZC1vcHRpb25zLmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL3JvdXRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NyaXB0cy90YWdzL2NvbW1vbi9uYXZiYXIudGFnIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL3RhZ3MvY29tbW9uL3NsaWRlLW1lbnUudGFnIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL3RhZ3MvY29tbW9uL2J0bi50YWciLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvdGFncy9ob21lLnRhZyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NyaXB0cy90YWdzL3JlY29tbWVuZC50YWciLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvc3RvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9zdXBlcmFnZW50L2xpYi9jbGllbnQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jb21wb25lbnQtZW1pdHRlci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3N1cGVyYWdlbnQvbGliL3JlcXVlc3QtYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3N1cGVyYWdlbnQvbGliL2lzLW9iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9+L3N1cGVyYWdlbnQvbGliL3JlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbmltZWpzL2FuaW1lLmpzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL3RhZ3MvbWVudS1saXN0LnRhZyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NyaXB0cy90YWdzL21lbnUudGFnIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL3RhZ3MvbmV3cy50YWciLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdHMvdGFncy9uZXdzLWxpc3QudGFnIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHRzL3RhZ3MvbmV3cy1lZGl0b3IudGFnIl0sIm5hbWVzIjpbIndpbmRvdyIsIm9icyIsInJpb3QiLCJvYnNlcnZhYmxlIiwicm91dGVyIiwicmVxdWlyZSIsInN0YXJ0IiwibmF2YmFyIiwibW91bnQiLCJyb3V0ZSIsInNldFRpdGxlIiwiaWQiLCJtb2R1bGUiLCJleHBvcnRzIiwidGFnMiIsIm9wdHMiLCJzZWxmIiwibWl4aW4iLCJ0aXRsZSIsInVwZGF0ZSIsImlzT3BlbiIsIm9wZW5NZW51Iiwib24iLCJjbG9zZSIsImhyZWYiLCJlIiwibG9jYXRpb24iLCJ0cmlnZ2VyIiwibWVudSIsImljb24iLCJfYmxhbmsiLCJzaXplIiwidHlwZSIsImNvbG9yIiwic3RvcmUiLCJ1dGlscyIsImFuaW1lIiwiZWRpdCIsInRvZ2dsZU1vZGUiLCJnZXRSZWNvbW1lbmQiLCJ0aGVuIiwiZGF0YSIsImNvbnNvbGUiLCJsb2ciLCJKU09OIiwic3RyaW5naWZ5IiwidXNlUGljdHVyZSIsInRvZ2dsZVVzZVBpYyIsImlzTW9kYWxPcGVuIiwidG9nZ2xlTWVudUxpc3QiLCIkZWxlIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInRhcmdldHMiLCJkdXJhdGlvbiIsImVhc2luZyIsInRyYW5zbGF0ZVkiLCJvcGFjaXR5IiwiY29tcGxldGUiLCJzdHlsZSIsImRpc3BsYXkiLCJ0cmFuc2Zvcm0iLCJuYW1lIiwicHJpY2UiLCJjb21tZW50IiwicGljIiwiaW1hZ2UiLCJhdXRvUmVzaXplIiwicmVxdWVzdCIsImRhdGFTdG9yZSIsInJlYyIsInVwZGF0ZWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImdldCIsImVuZCIsImVyciIsInJlcyIsImJvZHkiLCJnZXRNZW51TGlzdCIsInRhcmdldCIsImgiLCJsaCIsImhlaWdodCIsImxpbmVIZWlnaHQiLCJhZGRFdmVudExpc3RlbmVyIiwic2Nyb2xsSGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0Iiwic3BsaXQiLCJ0b2dnbGVJdGVtIiwiX3RoaXMiLCJjYXQiLCJjaGFuZ2VJdGVtIiwib3Blbkl0ZW1zIiwiJGVsZW0iLCJjbGFzc0xpc3QiLCJ2YWx1ZSIsImluZGV4T2YiLCJyZW1vdmUiLCJhZGQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUN0Q0E7QUFDQUEsUUFBT0MsR0FBUCxHQUFhQyxLQUFLQyxVQUFMLEVBQWI7O0FBRUE7QUFDQSxLQUFNQyxTQUFTLG1CQUFBQyxDQUFRLENBQVIsQ0FBZjtBQUNBRCxRQUFPRSxLQUFQLEc7Ozs7Ozs7QUNMQTs7QUFFQSxFQUFDO0FBQ0Q7QUFDQSxhQUFZLGdDQUFnQyxFQUFFO0FBQzlDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjs7QUFFaEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0RBQStDOztBQUUvQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBWTtBQUNaOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFCQUFvQjtBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFlLFNBQVM7QUFDeEIsZ0JBQWUsU0FBUztBQUN4QjtBQUNBO0FBQ0E7QUFDQSxXQUFVLE9BQU87QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFD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QUFDQSxjQUFhLFNBQVM7QUFDdEIsY0FBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYSxTQUFTO0FBQ3RCLGNBQWEsU0FBUztBQUN0QixjQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFhLFNBQVM7QUFDdEIsY0FBYSxTQUFTO0FBQ3RCLGNBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWEsU0FBUztBQUN0QixjQUFhLFNBQVM7QUFDdEIsY0FBYSxTQUFTO0FBQ3RCLGNBQWEsU0FBUztBQUN0QixjQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWEsU0FBUztBQUN0QixjQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFhLFNBQVM7QUFDdEIsY0FBYSxTQUFTO0FBQ3RCLGNBQWEsSUFBSTtBQUNqQixhQUFZLFNBQVM7QUFDckIsY0FBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWEsU0FBUztBQUN0QixjQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYSxTQUFTO0FBQ3RCLGNBQWEsU0FBUztBQUN0QjtBQUNB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RUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxNQUFNO0FBQ2pCLFlBQVcsU0FBUztBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxTQUFTO0FBQ3BCLGFBQVksUUFBUTtBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBUyxzQkFBc0IsV0FBVyxZQUFZOztBQUV0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2RkFBNEY7QUFDNUY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsT0FBTztBQUNsQixZQUFXLGVBQWU7QUFDMUIsWUFBVyxTQUFTO0FBQ3BCLGFBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsT0FBTztBQUNsQixZQUFXLGVBQWU7QUFDMUIsWUFBVyxTQUFTO0FBQ3BCLGFBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsT0FBTztBQUNsQixZQUFXLGVBQWU7QUFDMUIsWUFBVyxTQUFTO0FBQ3BCLGFBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsT0FBTztBQUNsQixZQUFXLFNBQVM7QUFDcEIsYUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsT0FBTztBQUNsQixZQUFXLE1BQU07QUFDakIsWUFBVyxTQUFTO0FBQ3BCLGFBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsT0FBTztBQUNsQixZQUFXLE1BQU07QUFDakIsWUFBVyxTQUFTO0FBQ3BCLGFBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsT0FBTztBQUNsQixZQUFXLGVBQWU7QUFDMUIsWUFBVyxTQUFTO0FBQ3BCLGFBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQzk4QkE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNB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QTJCLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRTtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE0QywwQkFBMEIsRUFBRTtBQUN4RTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBYztBQUNkLE1BQUs7QUFDTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtFQUFpRTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQVk7QUFDWjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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Q2pJLENBREQsRTs7Ozs7Ozs7O0FDQUFiLE1BQUtZLElBQUwsQ0FBVSxhQUFWLEVBQXlCLCtlQUF6QixFQUEwZ0IsbThCQUExZ0IsRUFBKzhDLEVBQS84QyxFQUFtOUMsVUFBU0MsSUFBVCxFQUFlO0FBQ2wrQyxTQUFJb0IsUUFBUSxtQkFBQTlCLENBQVEsRUFBUixDQUFaOztBQUVBLFVBQUtpQixFQUFMLENBQVEsT0FBUixFQUFpQixZQUFZO0FBQ3pCYSxlQUFNZ0MsVUFBTixDQUFpQmhCLFNBQVNDLGNBQVQsQ0FBd0IsWUFBeEIsQ0FBakI7QUFDSCxNQUZEO0FBR0MsRUFORCxFIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9kb2NzL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgYzQxMjY5OTNiNzY0MGVmMTA2ZGRcbiAqKi8iLCIvLyDjgqrjg5bjgrbjg7zjg5Djg7zjgpLjgrDjg63jg7zjg5Djg6vjgavnmbvpjLJcbndpbmRvdy5vYnMgPSByaW90Lm9ic2VydmFibGUoKTtcblxuLy8g44Or44O844OG44Kj44Oz44Kw44Gu6Kit5a6a44KS5ZG844Gz5Ye644GX44CB6LW35YuVXG5jb25zdCByb3V0ZXIgPSByZXF1aXJlKCcuL3JvdXRlcicpO1xucm91dGVyLnN0YXJ0KCk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvc2NyaXB0cy9lbnRyeS5qc1xuICoqLyIsIi8qIFJpb3QgdjIuNi40LCBAbGljZW5zZSBNSVQgKi9cblxuOyhmdW5jdGlvbih3aW5kb3csIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG52YXIgcmlvdCA9IHsgdmVyc2lvbjogJ3YyLjYuNCcsIHNldHRpbmdzOiB7fSB9LFxuICAvLyBiZSBhd2FyZSwgaW50ZXJuYWwgdXNhZ2VcbiAgLy8gQVRURU5USU9OOiBwcmVmaXggdGhlIGdsb2JhbCBkeW5hbWljIHZhcmlhYmxlcyB3aXRoIGBfX2BcblxuICAvLyBjb3VudGVyIHRvIGdpdmUgYSB1bmlxdWUgaWQgdG8gYWxsIHRoZSBUYWcgaW5zdGFuY2VzXG4gIF9fdWlkID0gMCxcbiAgLy8gdGFncyBpbnN0YW5jZXMgY2FjaGVcbiAgX192aXJ0dWFsRG9tID0gW10sXG4gIC8vIHRhZ3MgaW1wbGVtZW50YXRpb24gY2FjaGVcbiAgX190YWdJbXBsID0ge30sXG5cbiAgLyoqXG4gICAqIENvbnN0XG4gICAqL1xuICBHTE9CQUxfTUlYSU4gPSAnX19nbG9iYWxfbWl4aW4nLFxuXG4gIC8vIHJpb3Qgc3BlY2lmaWMgcHJlZml4ZXNcbiAgUklPVF9QUkVGSVggPSAncmlvdC0nLFxuICBSSU9UX1RBRyA9IFJJT1RfUFJFRklYICsgJ3RhZycsXG4gIFJJT1RfVEFHX0lTID0gJ2RhdGEtaXMnLFxuXG4gIC8vIGZvciB0eXBlb2YgPT0gJycgY29tcGFyaXNvbnNcbiAgVF9TVFJJTkcgPSAnc3RyaW5nJyxcbiAgVF9PQkpFQ1QgPSAnb2JqZWN0JyxcbiAgVF9VTkRFRiAgPSAndW5kZWZpbmVkJyxcbiAgVF9GVU5DVElPTiA9ICdmdW5jdGlvbicsXG4gIFhMSU5LX05TID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLFxuICBYTElOS19SRUdFWCA9IC9eeGxpbms6KFxcdyspLyxcbiAgLy8gc3BlY2lhbCBuYXRpdmUgdGFncyB0aGF0IGNhbm5vdCBiZSB0cmVhdGVkIGxpa2UgdGhlIG90aGVyc1xuICBTUEVDSUFMX1RBR1NfUkVHRVggPSAvXig/OnQoPzpib2R5fGhlYWR8Zm9vdHxbcmhkXSl8Y2FwdGlvbnxjb2woPzpncm91cCk/fG9wdCg/Omlvbnxncm91cCkpJC8sXG4gIFJFU0VSVkVEX1dPUkRTX0JMQUNLTElTVCA9IC9eKD86Xyg/Oml0ZW18aWR8cGFyZW50KXx1cGRhdGV8cm9vdHwoPzp1bik/bW91bnR8bWl4aW58aXMoPzpNb3VudGVkfExvb3ApfHRhZ3N8cGFyZW50fG9wdHN8dHJpZ2dlcnxvKD86bnxmZnxuZSkpJC8sXG4gIC8vIFNWRyB0YWdzIGxpc3QgaHR0cHM6Ly93d3cudzMub3JnL1RSL1NWRy9hdHRpbmRleC5odG1sI1ByZXNlbnRhdGlvbkF0dHJpYnV0ZXNcbiAgU1ZHX1RBR1NfTElTVCA9IFsnYWx0R2x5cGgnLCAnYW5pbWF0ZScsICdhbmltYXRlQ29sb3InLCAnY2lyY2xlJywgJ2NsaXBQYXRoJywgJ2RlZnMnLCAnZWxsaXBzZScsICdmZUJsZW5kJywgJ2ZlQ29sb3JNYXRyaXgnLCAnZmVDb21wb25lbnRUcmFuc2ZlcicsICdmZUNvbXBvc2l0ZScsICdmZUNvbnZvbHZlTWF0cml4JywgJ2ZlRGlmZnVzZUxpZ2h0aW5nJywgJ2ZlRGlzcGxhY2VtZW50TWFwJywgJ2ZlRmxvb2QnLCAnZmVHYXVzc2lhbkJsdXInLCAnZmVJbWFnZScsICdmZU1lcmdlJywgJ2ZlTW9ycGhvbG9neScsICdmZU9mZnNldCcsICdmZVNwZWN1bGFyTGlnaHRpbmcnLCAnZmVUaWxlJywgJ2ZlVHVyYnVsZW5jZScsICdmaWx0ZXInLCAnZm9udCcsICdmb3JlaWduT2JqZWN0JywgJ2cnLCAnZ2x5cGgnLCAnZ2x5cGhSZWYnLCAnaW1hZ2UnLCAnbGluZScsICdsaW5lYXJHcmFkaWVudCcsICdtYXJrZXInLCAnbWFzaycsICdtaXNzaW5nLWdseXBoJywgJ3BhdGgnLCAncGF0dGVybicsICdwb2x5Z29uJywgJ3BvbHlsaW5lJywgJ3JhZGlhbEdyYWRpZW50JywgJ3JlY3QnLCAnc3RvcCcsICdzdmcnLCAnc3dpdGNoJywgJ3N5bWJvbCcsICd0ZXh0JywgJ3RleHRQYXRoJywgJ3RyZWYnLCAndHNwYW4nLCAndXNlJ10sXG5cbiAgLy8gdmVyc2lvbiMgZm9yIElFIDgtMTEsIDAgZm9yIG90aGVyc1xuICBJRV9WRVJTSU9OID0gKHdpbmRvdyAmJiB3aW5kb3cuZG9jdW1lbnQgfHwge30pLmRvY3VtZW50TW9kZSB8IDAsXG5cbiAgLy8gZGV0ZWN0IGZpcmVmb3ggdG8gZml4ICMxMzc0XG4gIEZJUkVGT1ggPSB3aW5kb3cgJiYgISF3aW5kb3cuSW5zdGFsbFRyaWdnZXJcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5yaW90Lm9ic2VydmFibGUgPSBmdW5jdGlvbihlbCkge1xuXG4gIC8qKlxuICAgKiBFeHRlbmQgdGhlIG9yaWdpbmFsIG9iamVjdCBvciBjcmVhdGUgYSBuZXcgZW1wdHkgb25lXG4gICAqIEB0eXBlIHsgT2JqZWN0IH1cbiAgICovXG5cbiAgZWwgPSBlbCB8fCB7fVxuXG4gIC8qKlxuICAgKiBQcml2YXRlIHZhcmlhYmxlc1xuICAgKi9cbiAgdmFyIGNhbGxiYWNrcyA9IHt9LFxuICAgIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlXG5cbiAgLyoqXG4gICAqIFByaXZhdGUgTWV0aG9kc1xuICAgKi9cblxuICAvKipcbiAgICogSGVscGVyIGZ1bmN0aW9uIG5lZWRlZCB0byBnZXQgYW5kIGxvb3AgYWxsIHRoZSBldmVudHMgaW4gYSBzdHJpbmdcbiAgICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIGUgLSBldmVudCBzdHJpbmdcbiAgICogQHBhcmFtICAge0Z1bmN0aW9ufSAgIGZuIC0gY2FsbGJhY2tcbiAgICovXG4gIGZ1bmN0aW9uIG9uRWFjaEV2ZW50KGUsIGZuKSB7XG4gICAgdmFyIGVzID0gZS5zcGxpdCgnICcpLCBsID0gZXMubGVuZ3RoLCBpID0gMFxuICAgIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIgbmFtZSA9IGVzW2ldXG4gICAgICBpZiAobmFtZSkgZm4obmFtZSwgaSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHVibGljIEFwaVxuICAgKi9cblxuICAvLyBleHRlbmQgdGhlIGVsIG9iamVjdCBhZGRpbmcgdGhlIG9ic2VydmFibGUgbWV0aG9kc1xuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhlbCwge1xuICAgIC8qKlxuICAgICAqIExpc3RlbiB0byB0aGUgZ2l2ZW4gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgYGV2ZW50c2AgYW5kXG4gICAgICogZXhlY3V0ZSB0aGUgYGNhbGxiYWNrYCBlYWNoIHRpbWUgYW4gZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgICAqIEBwYXJhbSAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXG4gICAgICogQHBhcmFtICB7IEZ1bmN0aW9uIH0gZm4gLSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZWxcbiAgICAgKi9cbiAgICBvbjoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGV2ZW50cywgZm4pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmbiAhPSAnZnVuY3Rpb24nKSAgcmV0dXJuIGVsXG5cbiAgICAgICAgb25FYWNoRXZlbnQoZXZlbnRzLCBmdW5jdGlvbihuYW1lLCBwb3MpIHtcbiAgICAgICAgICAoY2FsbGJhY2tzW25hbWVdID0gY2FsbGJhY2tzW25hbWVdIHx8IFtdKS5wdXNoKGZuKVxuICAgICAgICAgIGZuLnR5cGVkID0gcG9zID4gMFxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBlbFxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHRoZSBnaXZlbiBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBgZXZlbnRzYCBsaXN0ZW5lcnNcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IGV2ZW50cyAtIGV2ZW50cyBpZHNcbiAgICAgKiBAcGFyYW0gICB7IEZ1bmN0aW9uIH0gZm4gLSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZWxcbiAgICAgKi9cbiAgICBvZmY6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihldmVudHMsIGZuKSB7XG4gICAgICAgIGlmIChldmVudHMgPT0gJyonICYmICFmbikgY2FsbGJhY2tzID0ge31cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgb25FYWNoRXZlbnQoZXZlbnRzLCBmdW5jdGlvbihuYW1lLCBwb3MpIHtcbiAgICAgICAgICAgIGlmIChmbikge1xuICAgICAgICAgICAgICB2YXIgYXJyID0gY2FsbGJhY2tzW25hbWVdXG4gICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBjYjsgY2IgPSBhcnIgJiYgYXJyW2ldOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2IgPT0gZm4pIGFyci5zcGxpY2UoaS0tLCAxKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgZGVsZXRlIGNhbGxiYWNrc1tuYW1lXVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIExpc3RlbiB0byB0aGUgZ2l2ZW4gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgYGV2ZW50c2AgYW5kXG4gICAgICogZXhlY3V0ZSB0aGUgYGNhbGxiYWNrYCBhdCBtb3N0IG9uY2VcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IGV2ZW50cyAtIGV2ZW50cyBpZHNcbiAgICAgKiBAcGFyYW0gICB7IEZ1bmN0aW9uIH0gZm4gLSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZWxcbiAgICAgKi9cbiAgICBvbmU6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihldmVudHMsIGZuKSB7XG4gICAgICAgIGZ1bmN0aW9uIG9uKCkge1xuICAgICAgICAgIGVsLm9mZihldmVudHMsIG9uKVxuICAgICAgICAgIGZuLmFwcGx5KGVsLCBhcmd1bWVudHMpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsLm9uKGV2ZW50cywgb24pXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgYWxsIGNhbGxiYWNrIGZ1bmN0aW9ucyB0aGF0IGxpc3RlbiB0b1xuICAgICAqIHRoZSBnaXZlbiBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBgZXZlbnRzYFxuICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xuICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZWxcbiAgICAgKi9cbiAgICB0cmlnZ2VyOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24oZXZlbnRzKSB7XG5cbiAgICAgICAgLy8gZ2V0dGluZyB0aGUgYXJndW1lbnRzXG4gICAgICAgIHZhciBhcmdsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMSxcbiAgICAgICAgICBhcmdzID0gbmV3IEFycmF5KGFyZ2xlbiksXG4gICAgICAgICAgZm5zXG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdsZW47IGkrKykge1xuICAgICAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDFdIC8vIHNraXAgZmlyc3QgYXJndW1lbnRcbiAgICAgICAgfVxuXG4gICAgICAgIG9uRWFjaEV2ZW50KGV2ZW50cywgZnVuY3Rpb24obmFtZSwgcG9zKSB7XG5cbiAgICAgICAgICBmbnMgPSBzbGljZS5jYWxsKGNhbGxiYWNrc1tuYW1lXSB8fCBbXSwgMClcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBmbjsgZm4gPSBmbnNbaV07ICsraSkge1xuICAgICAgICAgICAgaWYgKGZuLmJ1c3kpIGNvbnRpbnVlXG4gICAgICAgICAgICBmbi5idXN5ID0gMVxuICAgICAgICAgICAgZm4uYXBwbHkoZWwsIGZuLnR5cGVkID8gW25hbWVdLmNvbmNhdChhcmdzKSA6IGFyZ3MpXG4gICAgICAgICAgICBpZiAoZm5zW2ldICE9PSBmbikgeyBpLS0gfVxuICAgICAgICAgICAgZm4uYnVzeSA9IDBcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY2FsbGJhY2tzWycqJ10gJiYgbmFtZSAhPSAnKicpXG4gICAgICAgICAgICBlbC50cmlnZ2VyLmFwcGx5KGVsLCBbJyonLCBuYW1lXS5jb25jYXQoYXJncykpXG5cbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gZWxcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIGVsXG5cbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG47KGZ1bmN0aW9uKHJpb3QpIHtcblxuLyoqXG4gKiBTaW1wbGUgY2xpZW50LXNpZGUgcm91dGVyXG4gKiBAbW9kdWxlIHJpb3Qtcm91dGVcbiAqL1xuXG5cbnZhciBSRV9PUklHSU4gPSAvXi4rP1xcL1xcLytbXlxcL10rLyxcbiAgRVZFTlRfTElTVEVORVIgPSAnRXZlbnRMaXN0ZW5lcicsXG4gIFJFTU9WRV9FVkVOVF9MSVNURU5FUiA9ICdyZW1vdmUnICsgRVZFTlRfTElTVEVORVIsXG4gIEFERF9FVkVOVF9MSVNURU5FUiA9ICdhZGQnICsgRVZFTlRfTElTVEVORVIsXG4gIEhBU19BVFRSSUJVVEUgPSAnaGFzQXR0cmlidXRlJyxcbiAgUkVQTEFDRSA9ICdyZXBsYWNlJyxcbiAgUE9QU1RBVEUgPSAncG9wc3RhdGUnLFxuICBIQVNIQ0hBTkdFID0gJ2hhc2hjaGFuZ2UnLFxuICBUUklHR0VSID0gJ3RyaWdnZXInLFxuICBNQVhfRU1JVF9TVEFDS19MRVZFTCA9IDMsXG4gIHdpbiA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LFxuICBkb2MgPSB0eXBlb2YgZG9jdW1lbnQgIT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnQsXG4gIGhpc3QgPSB3aW4gJiYgaGlzdG9yeSxcbiAgbG9jID0gd2luICYmIChoaXN0LmxvY2F0aW9uIHx8IHdpbi5sb2NhdGlvbiksIC8vIHNlZSBodG1sNS1oaXN0b3J5LWFwaVxuICBwcm90ID0gUm91dGVyLnByb3RvdHlwZSwgLy8gdG8gbWluaWZ5IG1vcmVcbiAgY2xpY2tFdmVudCA9IGRvYyAmJiBkb2Mub250b3VjaHN0YXJ0ID8gJ3RvdWNoc3RhcnQnIDogJ2NsaWNrJyxcbiAgc3RhcnRlZCA9IGZhbHNlLFxuICBjZW50cmFsID0gcmlvdC5vYnNlcnZhYmxlKCksXG4gIHJvdXRlRm91bmQgPSBmYWxzZSxcbiAgZGVib3VuY2VkRW1pdCxcbiAgYmFzZSwgY3VycmVudCwgcGFyc2VyLCBzZWNvbmRQYXJzZXIsIGVtaXRTdGFjayA9IFtdLCBlbWl0U3RhY2tMZXZlbCA9IDBcblxuLyoqXG4gKiBEZWZhdWx0IHBhcnNlci4gWW91IGNhbiByZXBsYWNlIGl0IHZpYSByb3V0ZXIucGFyc2VyIG1ldGhvZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gY3VycmVudCBwYXRoIChub3JtYWxpemVkKVxuICogQHJldHVybnMge2FycmF5fSBhcnJheVxuICovXG5mdW5jdGlvbiBERUZBVUxUX1BBUlNFUihwYXRoKSB7XG4gIHJldHVybiBwYXRoLnNwbGl0KC9bLz8jXS8pXG59XG5cbi8qKlxuICogRGVmYXVsdCBwYXJzZXIgKHNlY29uZCkuIFlvdSBjYW4gcmVwbGFjZSBpdCB2aWEgcm91dGVyLnBhcnNlciBtZXRob2QuXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIGN1cnJlbnQgcGF0aCAobm9ybWFsaXplZClcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWx0ZXIgLSBmaWx0ZXIgc3RyaW5nIChub3JtYWxpemVkKVxuICogQHJldHVybnMge2FycmF5fSBhcnJheVxuICovXG5mdW5jdGlvbiBERUZBVUxUX1NFQ09ORF9QQVJTRVIocGF0aCwgZmlsdGVyKSB7XG4gIHZhciByZSA9IG5ldyBSZWdFeHAoJ14nICsgZmlsdGVyW1JFUExBQ0VdKC9cXCovZywgJyhbXi8/I10rPyknKVtSRVBMQUNFXSgvXFwuXFwuLywgJy4qJykgKyAnJCcpLFxuICAgIGFyZ3MgPSBwYXRoLm1hdGNoKHJlKVxuXG4gIGlmIChhcmdzKSByZXR1cm4gYXJncy5zbGljZSgxKVxufVxuXG4vKipcbiAqIFNpbXBsZS9jaGVhcCBkZWJvdW5jZSBpbXBsZW1lbnRhdGlvblxuICogQHBhcmFtICAge2Z1bmN0aW9ufSBmbiAtIGNhbGxiYWNrXG4gKiBAcGFyYW0gICB7bnVtYmVyfSBkZWxheSAtIGRlbGF5IGluIHNlY29uZHNcbiAqIEByZXR1cm5zIHtmdW5jdGlvbn0gZGVib3VuY2VkIGZ1bmN0aW9uXG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGZuLCBkZWxheSkge1xuICB2YXIgdFxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGNsZWFyVGltZW91dCh0KVxuICAgIHQgPSBzZXRUaW1lb3V0KGZuLCBkZWxheSlcbiAgfVxufVxuXG4vKipcbiAqIFNldCB0aGUgd2luZG93IGxpc3RlbmVycyB0byB0cmlnZ2VyIHRoZSByb3V0ZXNcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYXV0b0V4ZWMgLSBzZWUgcm91dGUuc3RhcnRcbiAqL1xuZnVuY3Rpb24gc3RhcnQoYXV0b0V4ZWMpIHtcbiAgZGVib3VuY2VkRW1pdCA9IGRlYm91bmNlKGVtaXQsIDEpXG4gIHdpbltBRERfRVZFTlRfTElTVEVORVJdKFBPUFNUQVRFLCBkZWJvdW5jZWRFbWl0KVxuICB3aW5bQUREX0VWRU5UX0xJU1RFTkVSXShIQVNIQ0hBTkdFLCBkZWJvdW5jZWRFbWl0KVxuICBkb2NbQUREX0VWRU5UX0xJU1RFTkVSXShjbGlja0V2ZW50LCBjbGljaylcbiAgaWYgKGF1dG9FeGVjKSBlbWl0KHRydWUpXG59XG5cbi8qKlxuICogUm91dGVyIGNsYXNzXG4gKi9cbmZ1bmN0aW9uIFJvdXRlcigpIHtcbiAgdGhpcy4kID0gW11cbiAgcmlvdC5vYnNlcnZhYmxlKHRoaXMpIC8vIG1ha2UgaXQgb2JzZXJ2YWJsZVxuICBjZW50cmFsLm9uKCdzdG9wJywgdGhpcy5zLmJpbmQodGhpcykpXG4gIGNlbnRyYWwub24oJ2VtaXQnLCB0aGlzLmUuYmluZCh0aGlzKSlcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGhbUkVQTEFDRV0oL15cXC98XFwvJC8sICcnKVxufVxuXG5mdW5jdGlvbiBpc1N0cmluZyhzdHIpIHtcbiAgcmV0dXJuIHR5cGVvZiBzdHIgPT0gJ3N0cmluZydcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHBhcnQgYWZ0ZXIgZG9tYWluIG5hbWVcbiAqIEBwYXJhbSB7c3RyaW5nfSBocmVmIC0gZnVsbHBhdGhcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHBhdGggZnJvbSByb290XG4gKi9cbmZ1bmN0aW9uIGdldFBhdGhGcm9tUm9vdChocmVmKSB7XG4gIHJldHVybiAoaHJlZiB8fCBsb2MuaHJlZilbUkVQTEFDRV0oUkVfT1JJR0lOLCAnJylcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHBhcnQgYWZ0ZXIgYmFzZVxuICogQHBhcmFtIHtzdHJpbmd9IGhyZWYgLSBmdWxscGF0aFxuICogQHJldHVybnMge3N0cmluZ30gcGF0aCBmcm9tIGJhc2VcbiAqL1xuZnVuY3Rpb24gZ2V0UGF0aEZyb21CYXNlKGhyZWYpIHtcbiAgcmV0dXJuIGJhc2VbMF0gPT0gJyMnXG4gICAgPyAoaHJlZiB8fCBsb2MuaHJlZiB8fCAnJykuc3BsaXQoYmFzZSlbMV0gfHwgJydcbiAgICA6IChsb2MgPyBnZXRQYXRoRnJvbVJvb3QoaHJlZikgOiBocmVmIHx8ICcnKVtSRVBMQUNFXShiYXNlLCAnJylcbn1cblxuZnVuY3Rpb24gZW1pdChmb3JjZSkge1xuICAvLyB0aGUgc3RhY2sgaXMgbmVlZGVkIGZvciByZWRpcmVjdGlvbnNcbiAgdmFyIGlzUm9vdCA9IGVtaXRTdGFja0xldmVsID09IDAsIGZpcnN0XG4gIGlmIChNQVhfRU1JVF9TVEFDS19MRVZFTCA8PSBlbWl0U3RhY2tMZXZlbCkgcmV0dXJuXG5cbiAgZW1pdFN0YWNrTGV2ZWwrK1xuICBlbWl0U3RhY2sucHVzaChmdW5jdGlvbigpIHtcbiAgICB2YXIgcGF0aCA9IGdldFBhdGhGcm9tQmFzZSgpXG4gICAgaWYgKGZvcmNlIHx8IHBhdGggIT0gY3VycmVudCkge1xuICAgICAgY2VudHJhbFtUUklHR0VSXSgnZW1pdCcsIHBhdGgpXG4gICAgICBjdXJyZW50ID0gcGF0aFxuICAgIH1cbiAgfSlcbiAgaWYgKGlzUm9vdCkge1xuICAgIHdoaWxlIChmaXJzdCA9IGVtaXRTdGFjay5zaGlmdCgpKSBmaXJzdCgpIC8vIHN0YWNrIGluY3Jlc2VzIHdpdGhpbiB0aGlzIGNhbGxcbiAgICBlbWl0U3RhY2tMZXZlbCA9IDBcbiAgfVxufVxuXG5mdW5jdGlvbiBjbGljayhlKSB7XG4gIGlmIChcbiAgICBlLndoaWNoICE9IDEgLy8gbm90IGxlZnQgY2xpY2tcbiAgICB8fCBlLm1ldGFLZXkgfHwgZS5jdHJsS2V5IHx8IGUuc2hpZnRLZXkgLy8gb3IgbWV0YSBrZXlzXG4gICAgfHwgZS5kZWZhdWx0UHJldmVudGVkIC8vIG9yIGRlZmF1bHQgcHJldmVudGVkXG4gICkgcmV0dXJuXG5cbiAgdmFyIGVsID0gZS50YXJnZXRcbiAgd2hpbGUgKGVsICYmIGVsLm5vZGVOYW1lICE9ICdBJykgZWwgPSBlbC5wYXJlbnROb2RlXG5cbiAgaWYgKFxuICAgICFlbCB8fCBlbC5ub2RlTmFtZSAhPSAnQScgLy8gbm90IEEgdGFnXG4gICAgfHwgZWxbSEFTX0FUVFJJQlVURV0oJ2Rvd25sb2FkJykgLy8gaGFzIGRvd25sb2FkIGF0dHJcbiAgICB8fCAhZWxbSEFTX0FUVFJJQlVURV0oJ2hyZWYnKSAvLyBoYXMgbm8gaHJlZiBhdHRyXG4gICAgfHwgZWwudGFyZ2V0ICYmIGVsLnRhcmdldCAhPSAnX3NlbGYnIC8vIGFub3RoZXIgd2luZG93IG9yIGZyYW1lXG4gICAgfHwgZWwuaHJlZi5pbmRleE9mKGxvYy5ocmVmLm1hdGNoKFJFX09SSUdJTilbMF0pID09IC0xIC8vIGNyb3NzIG9yaWdpblxuICApIHJldHVyblxuXG4gIGlmIChlbC5ocmVmICE9IGxvYy5ocmVmXG4gICAgJiYgKFxuICAgICAgZWwuaHJlZi5zcGxpdCgnIycpWzBdID09IGxvYy5ocmVmLnNwbGl0KCcjJylbMF0gLy8gaW50ZXJuYWwganVtcFxuICAgICAgfHwgYmFzZVswXSAhPSAnIycgJiYgZ2V0UGF0aEZyb21Sb290KGVsLmhyZWYpLmluZGV4T2YoYmFzZSkgIT09IDAgLy8gb3V0c2lkZSBvZiBiYXNlXG4gICAgICB8fCBiYXNlWzBdID09ICcjJyAmJiBlbC5ocmVmLnNwbGl0KGJhc2UpWzBdICE9IGxvYy5ocmVmLnNwbGl0KGJhc2UpWzBdIC8vIG91dHNpZGUgb2YgI2Jhc2VcbiAgICAgIHx8ICFnbyhnZXRQYXRoRnJvbUJhc2UoZWwuaHJlZiksIGVsLnRpdGxlIHx8IGRvYy50aXRsZSkgLy8gcm91dGUgbm90IGZvdW5kXG4gICAgKSkgcmV0dXJuXG5cbiAgZS5wcmV2ZW50RGVmYXVsdCgpXG59XG5cbi8qKlxuICogR28gdG8gdGhlIHBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gZGVzdGluYXRpb24gcGF0aFxuICogQHBhcmFtIHtzdHJpbmd9IHRpdGxlIC0gcGFnZSB0aXRsZVxuICogQHBhcmFtIHtib29sZWFufSBzaG91bGRSZXBsYWNlIC0gdXNlIHJlcGxhY2VTdGF0ZSBvciBwdXNoU3RhdGVcbiAqIEByZXR1cm5zIHtib29sZWFufSAtIHJvdXRlIG5vdCBmb3VuZCBmbGFnXG4gKi9cbmZ1bmN0aW9uIGdvKHBhdGgsIHRpdGxlLCBzaG91bGRSZXBsYWNlKSB7XG4gIC8vIFNlcnZlci1zaWRlIHVzYWdlOiBkaXJlY3RseSBleGVjdXRlIGhhbmRsZXJzIGZvciB0aGUgcGF0aFxuICBpZiAoIWhpc3QpIHJldHVybiBjZW50cmFsW1RSSUdHRVJdKCdlbWl0JywgZ2V0UGF0aEZyb21CYXNlKHBhdGgpKVxuXG4gIHBhdGggPSBiYXNlICsgbm9ybWFsaXplKHBhdGgpXG4gIHRpdGxlID0gdGl0bGUgfHwgZG9jLnRpdGxlXG4gIC8vIGJyb3dzZXJzIGlnbm9yZXMgdGhlIHNlY29uZCBwYXJhbWV0ZXIgYHRpdGxlYFxuICBzaG91bGRSZXBsYWNlXG4gICAgPyBoaXN0LnJlcGxhY2VTdGF0ZShudWxsLCB0aXRsZSwgcGF0aClcbiAgICA6IGhpc3QucHVzaFN0YXRlKG51bGwsIHRpdGxlLCBwYXRoKVxuICAvLyBzbyB3ZSBuZWVkIHRvIHNldCBpdCBtYW51YWxseVxuICBkb2MudGl0bGUgPSB0aXRsZVxuICByb3V0ZUZvdW5kID0gZmFsc2VcbiAgZW1pdCgpXG4gIHJldHVybiByb3V0ZUZvdW5kXG59XG5cbi8qKlxuICogR28gdG8gcGF0aCBvciBzZXQgYWN0aW9uXG4gKiBhIHNpbmdsZSBzdHJpbmc6ICAgICAgICAgICAgICAgIGdvIHRoZXJlXG4gKiB0d28gc3RyaW5nczogICAgICAgICAgICAgICAgICAgIGdvIHRoZXJlIHdpdGggc2V0dGluZyBhIHRpdGxlXG4gKiB0d28gc3RyaW5ncyBhbmQgYm9vbGVhbjogICAgICAgIHJlcGxhY2UgaGlzdG9yeSB3aXRoIHNldHRpbmcgYSB0aXRsZVxuICogYSBzaW5nbGUgZnVuY3Rpb246ICAgICAgICAgICAgICBzZXQgYW4gYWN0aW9uIG9uIHRoZSBkZWZhdWx0IHJvdXRlXG4gKiBhIHN0cmluZy9SZWdFeHAgYW5kIGEgZnVuY3Rpb246IHNldCBhbiBhY3Rpb24gb24gdGhlIHJvdXRlXG4gKiBAcGFyYW0geyhzdHJpbmd8ZnVuY3Rpb24pfSBmaXJzdCAtIHBhdGggLyBhY3Rpb24gLyBmaWx0ZXJcbiAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHB8ZnVuY3Rpb24pfSBzZWNvbmQgLSB0aXRsZSAvIGFjdGlvblxuICogQHBhcmFtIHtib29sZWFufSB0aGlyZCAtIHJlcGxhY2UgZmxhZ1xuICovXG5wcm90Lm0gPSBmdW5jdGlvbihmaXJzdCwgc2Vjb25kLCB0aGlyZCkge1xuICBpZiAoaXNTdHJpbmcoZmlyc3QpICYmICghc2Vjb25kIHx8IGlzU3RyaW5nKHNlY29uZCkpKSBnbyhmaXJzdCwgc2Vjb25kLCB0aGlyZCB8fCBmYWxzZSlcbiAgZWxzZSBpZiAoc2Vjb25kKSB0aGlzLnIoZmlyc3QsIHNlY29uZClcbiAgZWxzZSB0aGlzLnIoJ0AnLCBmaXJzdClcbn1cblxuLyoqXG4gKiBTdG9wIHJvdXRpbmdcbiAqL1xucHJvdC5zID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMub2ZmKCcqJylcbiAgdGhpcy4kID0gW11cbn1cblxuLyoqXG4gKiBFbWl0XG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIHBhdGhcbiAqL1xucHJvdC5lID0gZnVuY3Rpb24ocGF0aCkge1xuICB0aGlzLiQuY29uY2F0KCdAJykuc29tZShmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICB2YXIgYXJncyA9IChmaWx0ZXIgPT0gJ0AnID8gcGFyc2VyIDogc2Vjb25kUGFyc2VyKShub3JtYWxpemUocGF0aCksIG5vcm1hbGl6ZShmaWx0ZXIpKVxuICAgIGlmICh0eXBlb2YgYXJncyAhPSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpc1tUUklHR0VSXS5hcHBseShudWxsLCBbZmlsdGVyXS5jb25jYXQoYXJncykpXG4gICAgICByZXR1cm4gcm91dGVGb3VuZCA9IHRydWUgLy8gZXhpdCBmcm9tIGxvb3BcbiAgICB9XG4gIH0sIHRoaXMpXG59XG5cbi8qKlxuICogUmVnaXN0ZXIgcm91dGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWx0ZXIgLSBmaWx0ZXIgZm9yIG1hdGNoaW5nIHRvIHVybFxuICogQHBhcmFtIHtmdW5jdGlvbn0gYWN0aW9uIC0gYWN0aW9uIHRvIHJlZ2lzdGVyXG4gKi9cbnByb3QuciA9IGZ1bmN0aW9uKGZpbHRlciwgYWN0aW9uKSB7XG4gIGlmIChmaWx0ZXIgIT0gJ0AnKSB7XG4gICAgZmlsdGVyID0gJy8nICsgbm9ybWFsaXplKGZpbHRlcilcbiAgICB0aGlzLiQucHVzaChmaWx0ZXIpXG4gIH1cbiAgdGhpcy5vbihmaWx0ZXIsIGFjdGlvbilcbn1cblxudmFyIG1haW5Sb3V0ZXIgPSBuZXcgUm91dGVyKClcbnZhciByb3V0ZSA9IG1haW5Sb3V0ZXIubS5iaW5kKG1haW5Sb3V0ZXIpXG5cbi8qKlxuICogQ3JlYXRlIGEgc3ViIHJvdXRlclxuICogQHJldHVybnMge2Z1bmN0aW9ufSB0aGUgbWV0aG9kIG9mIGEgbmV3IFJvdXRlciBvYmplY3RcbiAqL1xucm91dGUuY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBuZXdTdWJSb3V0ZXIgPSBuZXcgUm91dGVyKClcbiAgLy8gYXNzaWduIHN1Yi1yb3V0ZXIncyBtYWluIG1ldGhvZFxuICB2YXIgcm91dGVyID0gbmV3U3ViUm91dGVyLm0uYmluZChuZXdTdWJSb3V0ZXIpXG4gIC8vIHN0b3Agb25seSB0aGlzIHN1Yi1yb3V0ZXJcbiAgcm91dGVyLnN0b3AgPSBuZXdTdWJSb3V0ZXIucy5iaW5kKG5ld1N1YlJvdXRlcilcbiAgcmV0dXJuIHJvdXRlclxufVxuXG4vKipcbiAqIFNldCB0aGUgYmFzZSBvZiB1cmxcbiAqIEBwYXJhbSB7KHN0cnxSZWdFeHApfSBhcmcgLSBhIG5ldyBiYXNlIG9yICcjJyBvciAnIyEnXG4gKi9cbnJvdXRlLmJhc2UgPSBmdW5jdGlvbihhcmcpIHtcbiAgYmFzZSA9IGFyZyB8fCAnIydcbiAgY3VycmVudCA9IGdldFBhdGhGcm9tQmFzZSgpIC8vIHJlY2FsY3VsYXRlIGN1cnJlbnQgcGF0aFxufVxuXG4vKiogRXhlYyByb3V0aW5nIHJpZ2h0IG5vdyAqKi9cbnJvdXRlLmV4ZWMgPSBmdW5jdGlvbigpIHtcbiAgZW1pdCh0cnVlKVxufVxuXG4vKipcbiAqIFJlcGxhY2UgdGhlIGRlZmF1bHQgcm91dGVyIHRvIHlvdXJzXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiAtIHlvdXIgcGFyc2VyIGZ1bmN0aW9uXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbjIgLSB5b3VyIHNlY29uZFBhcnNlciBmdW5jdGlvblxuICovXG5yb3V0ZS5wYXJzZXIgPSBmdW5jdGlvbihmbiwgZm4yKSB7XG4gIGlmICghZm4gJiYgIWZuMikge1xuICAgIC8vIHJlc2V0IHBhcnNlciBmb3IgdGVzdGluZy4uLlxuICAgIHBhcnNlciA9IERFRkFVTFRfUEFSU0VSXG4gICAgc2Vjb25kUGFyc2VyID0gREVGQVVMVF9TRUNPTkRfUEFSU0VSXG4gIH1cbiAgaWYgKGZuKSBwYXJzZXIgPSBmblxuICBpZiAoZm4yKSBzZWNvbmRQYXJzZXIgPSBmbjJcbn1cblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gZ2V0IHVybCBxdWVyeSBhcyBhbiBvYmplY3RcbiAqIEByZXR1cm5zIHtvYmplY3R9IHBhcnNlZCBxdWVyeVxuICovXG5yb3V0ZS5xdWVyeSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcSA9IHt9XG4gIHZhciBocmVmID0gbG9jLmhyZWYgfHwgY3VycmVudFxuICBocmVmW1JFUExBQ0VdKC9bPyZdKC4rPyk9KFteJl0qKS9nLCBmdW5jdGlvbihfLCBrLCB2KSB7IHFba10gPSB2IH0pXG4gIHJldHVybiBxXG59XG5cbi8qKiBTdG9wIHJvdXRpbmcgKiovXG5yb3V0ZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICBpZiAoc3RhcnRlZCkge1xuICAgIGlmICh3aW4pIHtcbiAgICAgIHdpbltSRU1PVkVfRVZFTlRfTElTVEVORVJdKFBPUFNUQVRFLCBkZWJvdW5jZWRFbWl0KVxuICAgICAgd2luW1JFTU9WRV9FVkVOVF9MSVNURU5FUl0oSEFTSENIQU5HRSwgZGVib3VuY2VkRW1pdClcbiAgICAgIGRvY1tSRU1PVkVfRVZFTlRfTElTVEVORVJdKGNsaWNrRXZlbnQsIGNsaWNrKVxuICAgIH1cbiAgICBjZW50cmFsW1RSSUdHRVJdKCdzdG9wJylcbiAgICBzdGFydGVkID0gZmFsc2VcbiAgfVxufVxuXG4vKipcbiAqIFN0YXJ0IHJvdXRpbmdcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYXV0b0V4ZWMgLSBhdXRvbWF0aWNhbGx5IGV4ZWMgYWZ0ZXIgc3RhcnRpbmcgaWYgdHJ1ZVxuICovXG5yb3V0ZS5zdGFydCA9IGZ1bmN0aW9uIChhdXRvRXhlYykge1xuICBpZiAoIXN0YXJ0ZWQpIHtcbiAgICBpZiAod2luKSB7XG4gICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PSAnY29tcGxldGUnKSBzdGFydChhdXRvRXhlYylcbiAgICAgIC8vIHRoZSB0aW1lb3V0IGlzIG5lZWRlZCB0byBzb2x2ZVxuICAgICAgLy8gYSB3ZWlyZCBzYWZhcmkgYnVnIGh0dHBzOi8vZ2l0aHViLmNvbS9yaW90L3JvdXRlL2lzc3Vlcy8zM1xuICAgICAgZWxzZSB3aW5bQUREX0VWRU5UX0xJU1RFTkVSXSgnbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBzdGFydChhdXRvRXhlYykgfSwgMSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHN0YXJ0ZWQgPSB0cnVlXG4gIH1cbn1cblxuLyoqIFByZXBhcmUgdGhlIHJvdXRlciAqKi9cbnJvdXRlLmJhc2UoKVxucm91dGUucGFyc2VyKClcblxucmlvdC5yb3V0ZSA9IHJvdXRlXG59KShyaW90KVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblxuLyoqXG4gKiBUaGUgcmlvdCB0ZW1wbGF0ZSBlbmdpbmVcbiAqIEB2ZXJzaW9uIHYyLjQuMlxuICovXG4vKipcbiAqIHJpb3QudXRpbC5icmFja2V0c1xuICpcbiAqIC0gYGJyYWNrZXRzICAgIGAgLSBSZXR1cm5zIGEgc3RyaW5nIG9yIHJlZ2V4IGJhc2VkIG9uIGl0cyBwYXJhbWV0ZXJcbiAqIC0gYGJyYWNrZXRzLnNldGAgLSBDaGFuZ2UgdGhlIGN1cnJlbnQgcmlvdCBicmFja2V0c1xuICpcbiAqIEBtb2R1bGVcbiAqL1xuXG52YXIgYnJhY2tldHMgPSAoZnVuY3Rpb24gKFVOREVGKSB7XG5cbiAgdmFyXG4gICAgUkVHTE9CID0gJ2cnLFxuXG4gICAgUl9NTENPTU1TID0gL1xcL1xcKlteKl0qXFwqKyg/OlteKlxcL11bXipdKlxcKispKlxcLy9nLFxuXG4gICAgUl9TVFJJTkdTID0gL1wiW15cIlxcXFxdKig/OlxcXFxbXFxTXFxzXVteXCJcXFxcXSopKlwifCdbXidcXFxcXSooPzpcXFxcW1xcU1xcc11bXidcXFxcXSopKicvZyxcblxuICAgIFNfUUJMT0NLUyA9IFJfU1RSSU5HUy5zb3VyY2UgKyAnfCcgK1xuICAgICAgLyg/OlxcYnJldHVyblxccyt8KD86WyRcXHdcXClcXF1dfFxcK1xcK3wtLSlcXHMqKFxcLykoPyFbKlxcL10pKS8uc291cmNlICsgJ3wnICtcbiAgICAgIC9cXC8oPz1bXipcXC9dKVteW1xcL1xcXFxdKig/Oig/OlxcWyg/OlxcXFwufFteXFxdXFxcXF0qKSpcXF18XFxcXC4pW15bXFwvXFxcXF0qKSo/KFxcLylbZ2ltXSovLnNvdXJjZSxcblxuICAgIFVOU1VQUE9SVEVEID0gUmVnRXhwKCdbXFxcXCcgKyAneDAwLVxcXFx4MUY8PmEtekEtWjAtOVxcJ1wiLDtcXFxcXFxcXF0nKSxcblxuICAgIE5FRURfRVNDQVBFID0gLyg/PVtbXFxdKCkqKz8uXiR8XSkvZyxcblxuICAgIEZJTkRCUkFDRVMgPSB7XG4gICAgICAnKCc6IFJlZ0V4cCgnKFsoKV0pfCcgICArIFNfUUJMT0NLUywgUkVHTE9CKSxcbiAgICAgICdbJzogUmVnRXhwKCcoW1tcXFxcXV0pfCcgKyBTX1FCTE9DS1MsIFJFR0xPQiksXG4gICAgICAneyc6IFJlZ0V4cCgnKFt7fV0pfCcgICArIFNfUUJMT0NLUywgUkVHTE9CKVxuICAgIH0sXG5cbiAgICBERUZBVUxUID0gJ3sgfSdcblxuICB2YXIgX3BhaXJzID0gW1xuICAgICd7JywgJ30nLFxuICAgICd7JywgJ30nLFxuICAgIC97W159XSp9LyxcbiAgICAvXFxcXChbe31dKS9nLFxuICAgIC9cXFxcKHspfHsvZyxcbiAgICBSZWdFeHAoJ1xcXFxcXFxcKH0pfChbWyh7XSl8KH0pfCcgKyBTX1FCTE9DS1MsIFJFR0xPQiksXG4gICAgREVGQVVMVCxcbiAgICAvXlxccyp7XFxeP1xccyooWyRcXHddKykoPzpcXHMqLFxccyooXFxTKykpP1xccytpblxccysoXFxTLiopXFxzKn0vLFxuICAgIC8oXnxbXlxcXFxdKXs9W1xcU1xcc10qP30vXG4gIF1cblxuICB2YXJcbiAgICBjYWNoZWRCcmFja2V0cyA9IFVOREVGLFxuICAgIF9yZWdleCxcbiAgICBfY2FjaGUgPSBbXSxcbiAgICBfc2V0dGluZ3NcblxuICBmdW5jdGlvbiBfbG9vcGJhY2sgKHJlKSB7IHJldHVybiByZSB9XG5cbiAgZnVuY3Rpb24gX3Jld3JpdGUgKHJlLCBicCkge1xuICAgIGlmICghYnApIGJwID0gX2NhY2hlXG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoXG4gICAgICByZS5zb3VyY2UucmVwbGFjZSgvey9nLCBicFsyXSkucmVwbGFjZSgvfS9nLCBicFszXSksIHJlLmdsb2JhbCA/IFJFR0xPQiA6ICcnXG4gICAgKVxuICB9XG5cbiAgZnVuY3Rpb24gX2NyZWF0ZSAocGFpcikge1xuICAgIGlmIChwYWlyID09PSBERUZBVUxUKSByZXR1cm4gX3BhaXJzXG5cbiAgICB2YXIgYXJyID0gcGFpci5zcGxpdCgnICcpXG5cbiAgICBpZiAoYXJyLmxlbmd0aCAhPT0gMiB8fCBVTlNVUFBPUlRFRC50ZXN0KHBhaXIpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIGJyYWNrZXRzIFwiJyArIHBhaXIgKyAnXCInKVxuICAgIH1cbiAgICBhcnIgPSBhcnIuY29uY2F0KHBhaXIucmVwbGFjZShORUVEX0VTQ0FQRSwgJ1xcXFwnKS5zcGxpdCgnICcpKVxuXG4gICAgYXJyWzRdID0gX3Jld3JpdGUoYXJyWzFdLmxlbmd0aCA+IDEgPyAve1tcXFNcXHNdKj99LyA6IF9wYWlyc1s0XSwgYXJyKVxuICAgIGFycls1XSA9IF9yZXdyaXRlKHBhaXIubGVuZ3RoID4gMyA/IC9cXFxcKHt8fSkvZyA6IF9wYWlyc1s1XSwgYXJyKVxuICAgIGFycls2XSA9IF9yZXdyaXRlKF9wYWlyc1s2XSwgYXJyKVxuICAgIGFycls3XSA9IFJlZ0V4cCgnXFxcXFxcXFwoJyArIGFyclszXSArICcpfChbWyh7XSl8KCcgKyBhcnJbM10gKyAnKXwnICsgU19RQkxPQ0tTLCBSRUdMT0IpXG4gICAgYXJyWzhdID0gcGFpclxuICAgIHJldHVybiBhcnJcbiAgfVxuXG4gIGZ1bmN0aW9uIF9icmFja2V0cyAocmVPcklkeCkge1xuICAgIHJldHVybiByZU9ySWR4IGluc3RhbmNlb2YgUmVnRXhwID8gX3JlZ2V4KHJlT3JJZHgpIDogX2NhY2hlW3JlT3JJZHhdXG4gIH1cblxuICBfYnJhY2tldHMuc3BsaXQgPSBmdW5jdGlvbiBzcGxpdCAoc3RyLCB0bXBsLCBfYnApIHtcbiAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogX2JwIGlzIGZvciB0aGUgY29tcGlsZXJcbiAgICBpZiAoIV9icCkgX2JwID0gX2NhY2hlXG5cbiAgICB2YXJcbiAgICAgIHBhcnRzID0gW10sXG4gICAgICBtYXRjaCxcbiAgICAgIGlzZXhwcixcbiAgICAgIHN0YXJ0LFxuICAgICAgcG9zLFxuICAgICAgcmUgPSBfYnBbNl1cblxuICAgIGlzZXhwciA9IHN0YXJ0ID0gcmUubGFzdEluZGV4ID0gMFxuXG4gICAgd2hpbGUgKChtYXRjaCA9IHJlLmV4ZWMoc3RyKSkpIHtcblxuICAgICAgcG9zID0gbWF0Y2guaW5kZXhcblxuICAgICAgaWYgKGlzZXhwcikge1xuXG4gICAgICAgIGlmIChtYXRjaFsyXSkge1xuICAgICAgICAgIHJlLmxhc3RJbmRleCA9IHNraXBCcmFjZXMoc3RyLCBtYXRjaFsyXSwgcmUubGFzdEluZGV4KVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtYXRjaFszXSkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFtYXRjaFsxXSkge1xuICAgICAgICB1bmVzY2FwZVN0cihzdHIuc2xpY2Uoc3RhcnQsIHBvcykpXG4gICAgICAgIHN0YXJ0ID0gcmUubGFzdEluZGV4XG4gICAgICAgIHJlID0gX2JwWzYgKyAoaXNleHByIF49IDEpXVxuICAgICAgICByZS5sYXN0SW5kZXggPSBzdGFydFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdHIgJiYgc3RhcnQgPCBzdHIubGVuZ3RoKSB7XG4gICAgICB1bmVzY2FwZVN0cihzdHIuc2xpY2Uoc3RhcnQpKVxuICAgIH1cblxuICAgIHJldHVybiBwYXJ0c1xuXG4gICAgZnVuY3Rpb24gdW5lc2NhcGVTdHIgKHMpIHtcbiAgICAgIGlmICh0bXBsIHx8IGlzZXhwcikge1xuICAgICAgICBwYXJ0cy5wdXNoKHMgJiYgcy5yZXBsYWNlKF9icFs1XSwgJyQxJykpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJ0cy5wdXNoKHMpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2tpcEJyYWNlcyAocywgY2gsIGl4KSB7XG4gICAgICB2YXJcbiAgICAgICAgbWF0Y2gsXG4gICAgICAgIHJlY2NoID0gRklOREJSQUNFU1tjaF1cblxuICAgICAgcmVjY2gubGFzdEluZGV4ID0gaXhcbiAgICAgIGl4ID0gMVxuICAgICAgd2hpbGUgKChtYXRjaCA9IHJlY2NoLmV4ZWMocykpKSB7XG4gICAgICAgIGlmIChtYXRjaFsxXSAmJlxuICAgICAgICAgICEobWF0Y2hbMV0gPT09IGNoID8gKytpeCA6IC0taXgpKSBicmVha1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl4ID8gcy5sZW5ndGggOiByZWNjaC5sYXN0SW5kZXhcbiAgICB9XG4gIH1cblxuICBfYnJhY2tldHMuaGFzRXhwciA9IGZ1bmN0aW9uIGhhc0V4cHIgKHN0cikge1xuICAgIHJldHVybiBfY2FjaGVbNF0udGVzdChzdHIpXG4gIH1cblxuICBfYnJhY2tldHMubG9vcEtleXMgPSBmdW5jdGlvbiBsb29wS2V5cyAoZXhwcikge1xuICAgIHZhciBtID0gZXhwci5tYXRjaChfY2FjaGVbOV0pXG5cbiAgICByZXR1cm4gbVxuICAgICAgPyB7IGtleTogbVsxXSwgcG9zOiBtWzJdLCB2YWw6IF9jYWNoZVswXSArIG1bM10udHJpbSgpICsgX2NhY2hlWzFdIH1cbiAgICAgIDogeyB2YWw6IGV4cHIudHJpbSgpIH1cbiAgfVxuXG4gIF9icmFja2V0cy5hcnJheSA9IGZ1bmN0aW9uIGFycmF5IChwYWlyKSB7XG4gICAgcmV0dXJuIHBhaXIgPyBfY3JlYXRlKHBhaXIpIDogX2NhY2hlXG4gIH1cblxuICBmdW5jdGlvbiBfcmVzZXQgKHBhaXIpIHtcbiAgICBpZiAoKHBhaXIgfHwgKHBhaXIgPSBERUZBVUxUKSkgIT09IF9jYWNoZVs4XSkge1xuICAgICAgX2NhY2hlID0gX2NyZWF0ZShwYWlyKVxuICAgICAgX3JlZ2V4ID0gcGFpciA9PT0gREVGQVVMVCA/IF9sb29wYmFjayA6IF9yZXdyaXRlXG4gICAgICBfY2FjaGVbOV0gPSBfcmVnZXgoX3BhaXJzWzldKVxuICAgIH1cbiAgICBjYWNoZWRCcmFja2V0cyA9IHBhaXJcbiAgfVxuXG4gIGZ1bmN0aW9uIF9zZXRTZXR0aW5ncyAobykge1xuICAgIHZhciBiXG5cbiAgICBvID0gbyB8fCB7fVxuICAgIGIgPSBvLmJyYWNrZXRzXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sICdicmFja2V0cycsIHtcbiAgICAgIHNldDogX3Jlc2V0LFxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBjYWNoZWRCcmFja2V0cyB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0pXG4gICAgX3NldHRpbmdzID0gb1xuICAgIF9yZXNldChiKVxuICB9XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9icmFja2V0cywgJ3NldHRpbmdzJywge1xuICAgIHNldDogX3NldFNldHRpbmdzLFxuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gX3NldHRpbmdzIH1cbiAgfSlcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogaW4gdGhlIGJyb3dzZXIgcmlvdCBpcyBhbHdheXMgaW4gdGhlIHNjb3BlICovXG4gIF9icmFja2V0cy5zZXR0aW5ncyA9IHR5cGVvZiByaW90ICE9PSAndW5kZWZpbmVkJyAmJiByaW90LnNldHRpbmdzIHx8IHt9XG4gIF9icmFja2V0cy5zZXQgPSBfcmVzZXRcblxuICBfYnJhY2tldHMuUl9TVFJJTkdTID0gUl9TVFJJTkdTXG4gIF9icmFja2V0cy5SX01MQ09NTVMgPSBSX01MQ09NTVNcbiAgX2JyYWNrZXRzLlNfUUJMT0NLUyA9IFNfUUJMT0NLU1xuXG4gIHJldHVybiBfYnJhY2tldHNcblxufSkoKVxuXG4vKipcbiAqIEBtb2R1bGUgdG1wbFxuICpcbiAqIHRtcGwgICAgICAgICAgLSBSb290IGZ1bmN0aW9uLCByZXR1cm5zIHRoZSB0ZW1wbGF0ZSB2YWx1ZSwgcmVuZGVyIHdpdGggZGF0YVxuICogdG1wbC5oYXNFeHByICAtIFRlc3QgdGhlIGV4aXN0ZW5jZSBvZiBhIGV4cHJlc3Npb24gaW5zaWRlIGEgc3RyaW5nXG4gKiB0bXBsLmxvb3BLZXlzIC0gR2V0IHRoZSBrZXlzIGZvciBhbiAnZWFjaCcgbG9vcCAodXNlZCBieSBgX2VhY2hgKVxuICovXG5cbnZhciB0bXBsID0gKGZ1bmN0aW9uICgpIHtcblxuICB2YXIgX2NhY2hlID0ge31cblxuICBmdW5jdGlvbiBfdG1wbCAoc3RyLCBkYXRhKSB7XG4gICAgaWYgKCFzdHIpIHJldHVybiBzdHJcblxuICAgIHJldHVybiAoX2NhY2hlW3N0cl0gfHwgKF9jYWNoZVtzdHJdID0gX2NyZWF0ZShzdHIpKSkuY2FsbChkYXRhLCBfbG9nRXJyKVxuICB9XG5cbiAgX3RtcGwuaGF2ZVJhdyA9IGJyYWNrZXRzLmhhc1Jhd1xuXG4gIF90bXBsLmhhc0V4cHIgPSBicmFja2V0cy5oYXNFeHByXG5cbiAgX3RtcGwubG9vcEtleXMgPSBicmFja2V0cy5sb29wS2V5c1xuXG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gIF90bXBsLmNsZWFyQ2FjaGUgPSBmdW5jdGlvbiAoKSB7IF9jYWNoZSA9IHt9IH1cblxuICBfdG1wbC5lcnJvckhhbmRsZXIgPSBudWxsXG5cbiAgZnVuY3Rpb24gX2xvZ0VyciAoZXJyLCBjdHgpIHtcblxuICAgIGlmIChfdG1wbC5lcnJvckhhbmRsZXIpIHtcblxuICAgICAgZXJyLnJpb3REYXRhID0ge1xuICAgICAgICB0YWdOYW1lOiBjdHggJiYgY3R4LnJvb3QgJiYgY3R4LnJvb3QudGFnTmFtZSxcbiAgICAgICAgX3Jpb3RfaWQ6IGN0eCAmJiBjdHguX3Jpb3RfaWQgIC8vZXNsaW50LWRpc2FibGUtbGluZSBjYW1lbGNhc2VcbiAgICAgIH1cbiAgICAgIF90bXBsLmVycm9ySGFuZGxlcihlcnIpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2NyZWF0ZSAoc3RyKSB7XG4gICAgdmFyIGV4cHIgPSBfZ2V0VG1wbChzdHIpXG5cbiAgICBpZiAoZXhwci5zbGljZSgwLCAxMSkgIT09ICd0cnl7cmV0dXJuICcpIGV4cHIgPSAncmV0dXJuICcgKyBleHByXG5cbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdFJywgZXhwciArICc7JykgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctZnVuY1xuICB9XG5cbiAgdmFyXG4gICAgQ0hfSURFWFBSID0gU3RyaW5nLmZyb21DaGFyQ29kZSgweDIwNTcpLFxuICAgIFJFX0NTTkFNRSA9IC9eKD86KC0/W19BLVphLXpcXHhBMC1cXHhGRl1bLVxcd1xceEEwLVxceEZGXSopfFxcdTIwNTcoXFxkKyl+KTovLFxuICAgIFJFX1FCTE9DSyA9IFJlZ0V4cChicmFja2V0cy5TX1FCTE9DS1MsICdnJyksXG4gICAgUkVfRFFVT1RFID0gL1xcdTIwNTcvZyxcbiAgICBSRV9RQk1BUksgPSAvXFx1MjA1NyhcXGQrKX4vZ1xuXG4gIGZ1bmN0aW9uIF9nZXRUbXBsIChzdHIpIHtcbiAgICB2YXJcbiAgICAgIHFzdHIgPSBbXSxcbiAgICAgIGV4cHIsXG4gICAgICBwYXJ0cyA9IGJyYWNrZXRzLnNwbGl0KHN0ci5yZXBsYWNlKFJFX0RRVU9URSwgJ1wiJyksIDEpXG5cbiAgICBpZiAocGFydHMubGVuZ3RoID4gMiB8fCBwYXJ0c1swXSkge1xuICAgICAgdmFyIGksIGosIGxpc3QgPSBbXVxuXG4gICAgICBmb3IgKGkgPSBqID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgKytpKSB7XG5cbiAgICAgICAgZXhwciA9IHBhcnRzW2ldXG5cbiAgICAgICAgaWYgKGV4cHIgJiYgKGV4cHIgPSBpICYgMVxuXG4gICAgICAgICAgICA/IF9wYXJzZUV4cHIoZXhwciwgMSwgcXN0cilcblxuICAgICAgICAgICAgOiAnXCInICsgZXhwclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcclxcbj98XFxuL2csICdcXFxcbicpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKSArXG4gICAgICAgICAgICAgICdcIidcblxuICAgICAgICAgICkpIGxpc3RbaisrXSA9IGV4cHJcblxuICAgICAgfVxuXG4gICAgICBleHByID0gaiA8IDIgPyBsaXN0WzBdXG4gICAgICAgICAgIDogJ1snICsgbGlzdC5qb2luKCcsJykgKyAnXS5qb2luKFwiXCIpJ1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgZXhwciA9IF9wYXJzZUV4cHIocGFydHNbMV0sIDAsIHFzdHIpXG4gICAgfVxuXG4gICAgaWYgKHFzdHJbMF0pIHtcbiAgICAgIGV4cHIgPSBleHByLnJlcGxhY2UoUkVfUUJNQVJLLCBmdW5jdGlvbiAoXywgcG9zKSB7XG4gICAgICAgIHJldHVybiBxc3RyW3Bvc11cbiAgICAgICAgICAucmVwbGFjZSgvXFxyL2csICdcXFxccicpXG4gICAgICAgICAgLnJlcGxhY2UoL1xcbi9nLCAnXFxcXG4nKVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIGV4cHJcbiAgfVxuXG4gIHZhclxuICAgIFJFX0JSRU5EID0ge1xuICAgICAgJygnOiAvWygpXS9nLFxuICAgICAgJ1snOiAvW1tcXF1dL2csXG4gICAgICAneyc6IC9be31dL2dcbiAgICB9XG5cbiAgZnVuY3Rpb24gX3BhcnNlRXhwciAoZXhwciwgYXNUZXh0LCBxc3RyKSB7XG5cbiAgICBleHByID0gZXhwclxuICAgICAgICAgIC5yZXBsYWNlKFJFX1FCTE9DSywgZnVuY3Rpb24gKHMsIGRpdikge1xuICAgICAgICAgICAgcmV0dXJuIHMubGVuZ3RoID4gMiAmJiAhZGl2ID8gQ0hfSURFWFBSICsgKHFzdHIucHVzaChzKSAtIDEpICsgJ34nIDogc1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnJlcGxhY2UoL1xccysvZywgJyAnKS50cmltKClcbiAgICAgICAgICAucmVwbGFjZSgvXFwgPyhbW1xcKHt9LD9cXC46XSlcXCA/L2csICckMScpXG5cbiAgICBpZiAoZXhwcikge1xuICAgICAgdmFyXG4gICAgICAgIGxpc3QgPSBbXSxcbiAgICAgICAgY250ID0gMCxcbiAgICAgICAgbWF0Y2hcblxuICAgICAgd2hpbGUgKGV4cHIgJiZcbiAgICAgICAgICAgIChtYXRjaCA9IGV4cHIubWF0Y2goUkVfQ1NOQU1FKSkgJiZcbiAgICAgICAgICAgICFtYXRjaC5pbmRleFxuICAgICAgICApIHtcbiAgICAgICAgdmFyXG4gICAgICAgICAga2V5LFxuICAgICAgICAgIGpzYixcbiAgICAgICAgICByZSA9IC8sfChbW3soXSl8JC9nXG5cbiAgICAgICAgZXhwciA9IFJlZ0V4cC5yaWdodENvbnRleHRcbiAgICAgICAga2V5ICA9IG1hdGNoWzJdID8gcXN0clttYXRjaFsyXV0uc2xpY2UoMSwgLTEpLnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csICcgJykgOiBtYXRjaFsxXVxuXG4gICAgICAgIHdoaWxlIChqc2IgPSAobWF0Y2ggPSByZS5leGVjKGV4cHIpKVsxXSkgc2tpcEJyYWNlcyhqc2IsIHJlKVxuXG4gICAgICAgIGpzYiAgPSBleHByLnNsaWNlKDAsIG1hdGNoLmluZGV4KVxuICAgICAgICBleHByID0gUmVnRXhwLnJpZ2h0Q29udGV4dFxuXG4gICAgICAgIGxpc3RbY250KytdID0gX3dyYXBFeHByKGpzYiwgMSwga2V5KVxuICAgICAgfVxuXG4gICAgICBleHByID0gIWNudCA/IF93cmFwRXhwcihleHByLCBhc1RleHQpXG4gICAgICAgICAgIDogY250ID4gMSA/ICdbJyArIGxpc3Quam9pbignLCcpICsgJ10uam9pbihcIiBcIikudHJpbSgpJyA6IGxpc3RbMF1cbiAgICB9XG4gICAgcmV0dXJuIGV4cHJcblxuICAgIGZ1bmN0aW9uIHNraXBCcmFjZXMgKGNoLCByZSkge1xuICAgICAgdmFyXG4gICAgICAgIG1tLFxuICAgICAgICBsdiA9IDEsXG4gICAgICAgIGlyID0gUkVfQlJFTkRbY2hdXG5cbiAgICAgIGlyLmxhc3RJbmRleCA9IHJlLmxhc3RJbmRleFxuICAgICAgd2hpbGUgKG1tID0gaXIuZXhlYyhleHByKSkge1xuICAgICAgICBpZiAobW1bMF0gPT09IGNoKSArK2x2XG4gICAgICAgIGVsc2UgaWYgKCEtLWx2KSBicmVha1xuICAgICAgfVxuICAgICAgcmUubGFzdEluZGV4ID0gbHYgPyBleHByLmxlbmd0aCA6IGlyLmxhc3RJbmRleFxuICAgIH1cbiAgfVxuXG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBub3QgYm90aFxuICB2YXIgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICBKU19DT05URVhUID0gJ1wiaW4gdGhpcz90aGlzOicgKyAodHlwZW9mIHdpbmRvdyAhPT0gJ29iamVjdCcgPyAnZ2xvYmFsJyA6ICd3aW5kb3cnKSArICcpLicsXG4gICAgSlNfVkFSTkFNRSA9IC9bLHtdW1xcJFxcd10rKD89Oil8KF4gKnxbXiRcXHdcXC57XSkoPyEoPzp0eXBlb2Z8dHJ1ZXxmYWxzZXxudWxsfHVuZGVmaW5lZHxpbnxpbnN0YW5jZW9mfGlzKD86RmluaXRlfE5hTil8dm9pZHxOYU58bmV3fERhdGV8UmVnRXhwfE1hdGgpKD8hWyRcXHddKSkoWyRfQS1aYS16XVskXFx3XSopL2csXG4gICAgSlNfTk9QUk9QUyA9IC9eKD89KFxcLlskXFx3XSspKVxcMSg/OlteLlsoXXwkKS9cblxuICBmdW5jdGlvbiBfd3JhcEV4cHIgKGV4cHIsIGFzVGV4dCwga2V5KSB7XG4gICAgdmFyIHRiXG5cbiAgICBleHByID0gZXhwci5yZXBsYWNlKEpTX1ZBUk5BTUUsIGZ1bmN0aW9uIChtYXRjaCwgcCwgbXZhciwgcG9zLCBzKSB7XG4gICAgICBpZiAobXZhcikge1xuICAgICAgICBwb3MgPSB0YiA/IDAgOiBwb3MgKyBtYXRjaC5sZW5ndGhcblxuICAgICAgICBpZiAobXZhciAhPT0gJ3RoaXMnICYmIG12YXIgIT09ICdnbG9iYWwnICYmIG12YXIgIT09ICd3aW5kb3cnKSB7XG4gICAgICAgICAgbWF0Y2ggPSBwICsgJyhcIicgKyBtdmFyICsgSlNfQ09OVEVYVCArIG12YXJcbiAgICAgICAgICBpZiAocG9zKSB0YiA9IChzID0gc1twb3NdKSA9PT0gJy4nIHx8IHMgPT09ICcoJyB8fCBzID09PSAnWydcbiAgICAgICAgfSBlbHNlIGlmIChwb3MpIHtcbiAgICAgICAgICB0YiA9ICFKU19OT1BST1BTLnRlc3Qocy5zbGljZShwb3MpKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbWF0Y2hcbiAgICB9KVxuXG4gICAgaWYgKHRiKSB7XG4gICAgICBleHByID0gJ3RyeXtyZXR1cm4gJyArIGV4cHIgKyAnfWNhdGNoKGUpe0UoZSx0aGlzKX0nXG4gICAgfVxuXG4gICAgaWYgKGtleSkge1xuXG4gICAgICBleHByID0gKHRiXG4gICAgICAgICAgPyAnZnVuY3Rpb24oKXsnICsgZXhwciArICd9LmNhbGwodGhpcyknIDogJygnICsgZXhwciArICcpJ1xuICAgICAgICApICsgJz9cIicgKyBrZXkgKyAnXCI6XCJcIidcblxuICAgIH0gZWxzZSBpZiAoYXNUZXh0KSB7XG5cbiAgICAgIGV4cHIgPSAnZnVuY3Rpb24odil7JyArICh0YlxuICAgICAgICAgID8gZXhwci5yZXBsYWNlKCdyZXR1cm4gJywgJ3Y9JykgOiAndj0oJyArIGV4cHIgKyAnKSdcbiAgICAgICAgKSArICc7cmV0dXJuIHZ8fHY9PT0wP3Y6XCJcIn0uY2FsbCh0aGlzKSdcbiAgICB9XG5cbiAgICByZXR1cm4gZXhwclxuICB9XG5cbiAgX3RtcGwudmVyc2lvbiA9IGJyYWNrZXRzLnZlcnNpb24gPSAndjIuNC4yJ1xuXG4gIHJldHVybiBfdG1wbFxuXG59KSgpXG5cbi8qXG4gIGxpYi9icm93c2VyL3RhZy9ta2RvbS5qc1xuXG4gIEluY2x1ZGVzIGhhY2tzIG5lZWRlZCBmb3IgdGhlIEludGVybmV0IEV4cGxvcmVyIHZlcnNpb24gOSBhbmQgYmVsb3dcbiAgU2VlOiBodHRwOi8va2FuZ2F4LmdpdGh1Yi5pby9jb21wYXQtdGFibGUvZXM1LyNpZThcbiAgICAgICBodHRwOi8vY29kZXBsYW5ldC5pby9kcm9wcGluZy1pZTgvXG4qL1xudmFyIG1rZG9tID0gKGZ1bmN0aW9uIF9ta2RvbSgpIHtcbiAgdmFyXG4gICAgcmVIYXNZaWVsZCAgPSAvPHlpZWxkXFxiL2ksXG4gICAgcmVZaWVsZEFsbCAgPSAvPHlpZWxkXFxzKig/OlxcLz58PihbXFxTXFxzXSo/KTxcXC95aWVsZFxccyo+fD4pL2lnLFxuICAgIHJlWWllbGRTcmMgID0gLzx5aWVsZFxccyt0bz1bJ1wiXShbXidcIj5dKilbJ1wiXVxccyo+KFtcXFNcXHNdKj8pPFxcL3lpZWxkXFxzKj4vaWcsXG4gICAgcmVZaWVsZERlc3QgPSAvPHlpZWxkXFxzK2Zyb209WydcIl0/KFstXFx3XSspWydcIl0/XFxzKig/OlxcLz58PihbXFxTXFxzXSo/KTxcXC95aWVsZFxccyo+KS9pZ1xuICB2YXJcbiAgICByb290RWxzID0geyB0cjogJ3Rib2R5JywgdGg6ICd0cicsIHRkOiAndHInLCBjb2w6ICdjb2xncm91cCcgfSxcbiAgICB0YmxUYWdzID0gSUVfVkVSU0lPTiAmJiBJRV9WRVJTSU9OIDwgMTBcbiAgICAgID8gU1BFQ0lBTF9UQUdTX1JFR0VYIDogL14oPzp0KD86Ym9keXxoZWFkfGZvb3R8W3JoZF0pfGNhcHRpb258Y29sKD86Z3JvdXApPykkL1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgRE9NIGVsZW1lbnQgdG8gd3JhcCB0aGUgZ2l2ZW4gY29udGVudC4gTm9ybWFsbHkgYW4gYERJVmAsIGJ1dCBjYW4gYmVcbiAgICogYWxzbyBhIGBUQUJMRWAsIGBTRUxFQ1RgLCBgVEJPRFlgLCBgVFJgLCBvciBgQ09MR1JPVVBgIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSAgIHtzdHJpbmd9IHRlbXBsICAtIFRoZSB0ZW1wbGF0ZSBjb21pbmcgZnJvbSB0aGUgY3VzdG9tIHRhZyBkZWZpbml0aW9uXG4gICAqIEBwYXJhbSAgIHtzdHJpbmd9IFtodG1sXSAtIEhUTUwgY29udGVudCB0aGF0IGNvbWVzIGZyb20gdGhlIERPTSBlbGVtZW50IHdoZXJlIHlvdVxuICAgKiAgICAgICAgICAgd2lsbCBtb3VudCB0aGUgdGFnLCBtb3N0bHkgdGhlIG9yaWdpbmFsIHRhZyBpbiB0aGUgcGFnZVxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IERPTSBlbGVtZW50IHdpdGggX3RlbXBsXyBtZXJnZWQgdGhyb3VnaCBgWUlFTERgIHdpdGggdGhlIF9odG1sXy5cbiAgICovXG4gIGZ1bmN0aW9uIF9ta2RvbSh0ZW1wbCwgaHRtbCkge1xuICAgIHZhclxuICAgICAgbWF0Y2ggICA9IHRlbXBsICYmIHRlbXBsLm1hdGNoKC9eXFxzKjwoWy1cXHddKykvKSxcbiAgICAgIHRhZ05hbWUgPSBtYXRjaCAmJiBtYXRjaFsxXS50b0xvd2VyQ2FzZSgpLFxuICAgICAgZWwgPSBta0VsKCdkaXYnLCBpc1NWR1RhZyh0YWdOYW1lKSlcblxuICAgIC8vIHJlcGxhY2UgYWxsIHRoZSB5aWVsZCB0YWdzIHdpdGggdGhlIHRhZyBpbm5lciBodG1sXG4gICAgdGVtcGwgPSByZXBsYWNlWWllbGQodGVtcGwsIGh0bWwpXG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmICh0YmxUYWdzLnRlc3QodGFnTmFtZSkpXG4gICAgICBlbCA9IHNwZWNpYWxUYWdzKGVsLCB0ZW1wbCwgdGFnTmFtZSlcbiAgICBlbHNlXG4gICAgICBzZXRJbm5lckhUTUwoZWwsIHRlbXBsKVxuXG4gICAgZWwuc3R1YiA9IHRydWVcblxuICAgIHJldHVybiBlbFxuICB9XG5cbiAgLypcbiAgICBDcmVhdGVzIHRoZSByb290IGVsZW1lbnQgZm9yIHRhYmxlIG9yIHNlbGVjdCBjaGlsZCBlbGVtZW50czpcbiAgICB0ci90aC90ZC90aGVhZC90Zm9vdC90Ym9keS9jYXB0aW9uL2NvbC9jb2xncm91cC9vcHRpb24vb3B0Z3JvdXBcbiAgKi9cbiAgZnVuY3Rpb24gc3BlY2lhbFRhZ3MoZWwsIHRlbXBsLCB0YWdOYW1lKSB7XG4gICAgdmFyXG4gICAgICBzZWxlY3QgPSB0YWdOYW1lWzBdID09PSAnbycsXG4gICAgICBwYXJlbnQgPSBzZWxlY3QgPyAnc2VsZWN0PicgOiAndGFibGU+J1xuXG4gICAgLy8gdHJpbSgpIGlzIGltcG9ydGFudCBoZXJlLCB0aGlzIGVuc3VyZXMgd2UgZG9uJ3QgaGF2ZSBhcnRpZmFjdHMsXG4gICAgLy8gc28gd2UgY2FuIGNoZWNrIGlmIHdlIGhhdmUgb25seSBvbmUgZWxlbWVudCBpbnNpZGUgdGhlIHBhcmVudFxuICAgIGVsLmlubmVySFRNTCA9ICc8JyArIHBhcmVudCArIHRlbXBsLnRyaW0oKSArICc8LycgKyBwYXJlbnRcbiAgICBwYXJlbnQgPSBlbC5maXJzdENoaWxkXG5cbiAgICAvLyByZXR1cm5zIHRoZSBpbW1lZGlhdGUgcGFyZW50IGlmIHRyL3RoL3RkL2NvbCBpcyB0aGUgb25seSBlbGVtZW50LCBpZiBub3RcbiAgICAvLyByZXR1cm5zIHRoZSB3aG9sZSB0cmVlLCBhcyB0aGlzIGNhbiBpbmNsdWRlIGFkZGl0aW9uYWwgZWxlbWVudHNcbiAgICBpZiAoc2VsZWN0KSB7XG4gICAgICBwYXJlbnQuc2VsZWN0ZWRJbmRleCA9IC0xICAvLyBmb3IgSUU5LCBjb21wYXRpYmxlIHcvY3VycmVudCByaW90IGJlaGF2aW9yXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGF2b2lkcyBpbnNlcnRpb24gb2YgY29pbnRhaW5lciBpbnNpZGUgY29udGFpbmVyIChleDogdGJvZHkgaW5zaWRlIHRib2R5KVxuICAgICAgdmFyIHRuYW1lID0gcm9vdEVsc1t0YWdOYW1lXVxuICAgICAgaWYgKHRuYW1lICYmIHBhcmVudC5jaGlsZEVsZW1lbnRDb3VudCA9PT0gMSkgcGFyZW50ID0gJCh0bmFtZSwgcGFyZW50KVxuICAgIH1cbiAgICByZXR1cm4gcGFyZW50XG4gIH1cblxuICAvKlxuICAgIFJlcGxhY2UgdGhlIHlpZWxkIHRhZyBmcm9tIGFueSB0YWcgdGVtcGxhdGUgd2l0aCB0aGUgaW5uZXJIVE1MIG9mIHRoZVxuICAgIG9yaWdpbmFsIHRhZyBpbiB0aGUgcGFnZVxuICAqL1xuICBmdW5jdGlvbiByZXBsYWNlWWllbGQodGVtcGwsIGh0bWwpIHtcbiAgICAvLyBkbyBub3RoaW5nIGlmIG5vIHlpZWxkXG4gICAgaWYgKCFyZUhhc1lpZWxkLnRlc3QodGVtcGwpKSByZXR1cm4gdGVtcGxcblxuICAgIC8vIGJlIGNhcmVmdWwgd2l0aCAjMTM0MyAtIHN0cmluZyBvbiB0aGUgc291cmNlIGhhdmluZyBgJDFgXG4gICAgdmFyIHNyYyA9IHt9XG5cbiAgICBodG1sID0gaHRtbCAmJiBodG1sLnJlcGxhY2UocmVZaWVsZFNyYywgZnVuY3Rpb24gKF8sIHJlZiwgdGV4dCkge1xuICAgICAgc3JjW3JlZl0gPSBzcmNbcmVmXSB8fCB0ZXh0ICAgLy8gcHJlc2VydmUgZmlyc3QgZGVmaW5pdGlvblxuICAgICAgcmV0dXJuICcnXG4gICAgfSkudHJpbSgpXG5cbiAgICByZXR1cm4gdGVtcGxcbiAgICAgIC5yZXBsYWNlKHJlWWllbGREZXN0LCBmdW5jdGlvbiAoXywgcmVmLCBkZWYpIHsgIC8vIHlpZWxkIHdpdGggZnJvbSAtIHRvIGF0dHJzXG4gICAgICAgIHJldHVybiBzcmNbcmVmXSB8fCBkZWYgfHwgJydcbiAgICAgIH0pXG4gICAgICAucmVwbGFjZShyZVlpZWxkQWxsLCBmdW5jdGlvbiAoXywgZGVmKSB7ICAgICAgICAvLyB5aWVsZCB3aXRob3V0IGFueSBcImZyb21cIlxuICAgICAgICByZXR1cm4gaHRtbCB8fCBkZWYgfHwgJydcbiAgICAgIH0pXG4gIH1cblxuICByZXR1cm4gX21rZG9tXG5cbn0pKClcblxuLyoqXG4gKiBDb252ZXJ0IHRoZSBpdGVtIGxvb3BlZCBpbnRvIGFuIG9iamVjdCB1c2VkIHRvIGV4dGVuZCB0aGUgY2hpbGQgdGFnIHByb3BlcnRpZXNcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gZXhwciAtIG9iamVjdCBjb250YWluaW5nIHRoZSBrZXlzIHVzZWQgdG8gZXh0ZW5kIHRoZSBjaGlsZHJlbiB0YWdzXG4gKiBAcGFyYW0gICB7ICogfSBrZXkgLSB2YWx1ZSB0byBhc3NpZ24gdG8gdGhlIG5ldyBvYmplY3QgcmV0dXJuZWRcbiAqIEBwYXJhbSAgIHsgKiB9IHZhbCAtIHZhbHVlIGNvbnRhaW5pbmcgdGhlIHBvc2l0aW9uIG9mIHRoZSBpdGVtIGluIHRoZSBhcnJheVxuICogQHJldHVybnMgeyBPYmplY3QgfSAtIG5ldyBvYmplY3QgY29udGFpbmluZyB0aGUgdmFsdWVzIG9mIHRoZSBvcmlnaW5hbCBpdGVtXG4gKlxuICogVGhlIHZhcmlhYmxlcyAna2V5JyBhbmQgJ3ZhbCcgYXJlIGFyYml0cmFyeS5cbiAqIFRoZXkgZGVwZW5kIG9uIHRoZSBjb2xsZWN0aW9uIHR5cGUgbG9vcGVkIChBcnJheSwgT2JqZWN0KVxuICogYW5kIG9uIHRoZSBleHByZXNzaW9uIHVzZWQgb24gdGhlIGVhY2ggdGFnXG4gKlxuICovXG5mdW5jdGlvbiBta2l0ZW0oZXhwciwga2V5LCB2YWwpIHtcbiAgdmFyIGl0ZW0gPSB7fVxuICBpdGVtW2V4cHIua2V5XSA9IGtleVxuICBpZiAoZXhwci5wb3MpIGl0ZW1bZXhwci5wb3NdID0gdmFsXG4gIHJldHVybiBpdGVtXG59XG5cbi8qKlxuICogVW5tb3VudCB0aGUgcmVkdW5kYW50IHRhZ3NcbiAqIEBwYXJhbSAgIHsgQXJyYXkgfSBpdGVtcyAtIGFycmF5IGNvbnRhaW5pbmcgdGhlIGN1cnJlbnQgaXRlbXMgdG8gbG9vcFxuICogQHBhcmFtICAgeyBBcnJheSB9IHRhZ3MgLSBhcnJheSBjb250YWluaW5nIGFsbCB0aGUgY2hpbGRyZW4gdGFnc1xuICovXG5mdW5jdGlvbiB1bm1vdW50UmVkdW5kYW50KGl0ZW1zLCB0YWdzKSB7XG5cbiAgdmFyIGkgPSB0YWdzLmxlbmd0aCxcbiAgICBqID0gaXRlbXMubGVuZ3RoLFxuICAgIHRcblxuICB3aGlsZSAoaSA+IGopIHtcbiAgICB0ID0gdGFnc1stLWldXG4gICAgdGFncy5zcGxpY2UoaSwgMSlcbiAgICB0LnVubW91bnQoKVxuICB9XG59XG5cbi8qKlxuICogTW92ZSB0aGUgbmVzdGVkIGN1c3RvbSB0YWdzIGluIG5vbiBjdXN0b20gbG9vcCB0YWdzXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGNoaWxkIC0gbm9uIGN1c3RvbSBsb29wIHRhZ1xuICogQHBhcmFtICAgeyBOdW1iZXIgfSBpIC0gY3VycmVudCBwb3NpdGlvbiBvZiB0aGUgbG9vcCB0YWdcbiAqL1xuZnVuY3Rpb24gbW92ZU5lc3RlZFRhZ3MoY2hpbGQsIGkpIHtcbiAgT2JqZWN0LmtleXMoY2hpbGQudGFncykuZm9yRWFjaChmdW5jdGlvbih0YWdOYW1lKSB7XG4gICAgdmFyIHRhZyA9IGNoaWxkLnRhZ3NbdGFnTmFtZV1cbiAgICBpZiAoaXNBcnJheSh0YWcpKVxuICAgICAgZWFjaCh0YWcsIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIG1vdmVDaGlsZFRhZyh0LCB0YWdOYW1lLCBpKVxuICAgICAgfSlcbiAgICBlbHNlXG4gICAgICBtb3ZlQ2hpbGRUYWcodGFnLCB0YWdOYW1lLCBpKVxuICB9KVxufVxuXG4vKipcbiAqIEFkZHMgdGhlIGVsZW1lbnRzIGZvciBhIHZpcnR1YWwgdGFnXG4gKiBAcGFyYW0geyBUYWcgfSB0YWcgLSB0aGUgdGFnIHdob3NlIHJvb3QncyBjaGlsZHJlbiB3aWxsIGJlIGluc2VydGVkIG9yIGFwcGVuZGVkXG4gKiBAcGFyYW0geyBOb2RlIH0gc3JjIC0gdGhlIG5vZGUgdGhhdCB3aWxsIGRvIHRoZSBpbnNlcnRpbmcgb3IgYXBwZW5kaW5nXG4gKiBAcGFyYW0geyBUYWcgfSB0YXJnZXQgLSBvbmx5IGlmIGluc2VydGluZywgaW5zZXJ0IGJlZm9yZSB0aGlzIHRhZydzIGZpcnN0IGNoaWxkXG4gKi9cbmZ1bmN0aW9uIGFkZFZpcnR1YWwodGFnLCBzcmMsIHRhcmdldCkge1xuICB2YXIgZWwgPSB0YWcuX3Jvb3QsIHNpYlxuICB0YWcuX3ZpcnRzID0gW11cbiAgd2hpbGUgKGVsKSB7XG4gICAgc2liID0gZWwubmV4dFNpYmxpbmdcbiAgICBpZiAodGFyZ2V0KVxuICAgICAgc3JjLmluc2VydEJlZm9yZShlbCwgdGFyZ2V0Ll9yb290KVxuICAgIGVsc2VcbiAgICAgIHNyYy5hcHBlbmRDaGlsZChlbClcblxuICAgIHRhZy5fdmlydHMucHVzaChlbCkgLy8gaG9sZCBmb3IgdW5tb3VudGluZ1xuICAgIGVsID0gc2liXG4gIH1cbn1cblxuLyoqXG4gKiBNb3ZlIHZpcnR1YWwgdGFnIGFuZCBhbGwgY2hpbGQgbm9kZXNcbiAqIEBwYXJhbSB7IFRhZyB9IHRhZyAtIGZpcnN0IGNoaWxkIHJlZmVyZW5jZSB1c2VkIHRvIHN0YXJ0IG1vdmVcbiAqIEBwYXJhbSB7IE5vZGUgfSBzcmMgIC0gdGhlIG5vZGUgdGhhdCB3aWxsIGRvIHRoZSBpbnNlcnRpbmdcbiAqIEBwYXJhbSB7IFRhZyB9IHRhcmdldCAtIGluc2VydCBiZWZvcmUgdGhpcyB0YWcncyBmaXJzdCBjaGlsZFxuICogQHBhcmFtIHsgTnVtYmVyIH0gbGVuIC0gaG93IG1hbnkgY2hpbGQgbm9kZXMgdG8gbW92ZVxuICovXG5mdW5jdGlvbiBtb3ZlVmlydHVhbCh0YWcsIHNyYywgdGFyZ2V0LCBsZW4pIHtcbiAgdmFyIGVsID0gdGFnLl9yb290LCBzaWIsIGkgPSAwXG4gIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBzaWIgPSBlbC5uZXh0U2libGluZ1xuICAgIHNyYy5pbnNlcnRCZWZvcmUoZWwsIHRhcmdldC5fcm9vdClcbiAgICBlbCA9IHNpYlxuICB9XG59XG5cblxuLyoqXG4gKiBNYW5hZ2UgdGFncyBoYXZpbmcgdGhlICdlYWNoJ1xuICogQHBhcmFtICAgeyBPYmplY3QgfSBkb20gLSBET00gbm9kZSB3ZSBuZWVkIHRvIGxvb3BcbiAqIEBwYXJhbSAgIHsgVGFnIH0gcGFyZW50IC0gcGFyZW50IHRhZyBpbnN0YW5jZSB3aGVyZSB0aGUgZG9tIG5vZGUgaXMgY29udGFpbmVkXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IGV4cHIgLSBzdHJpbmcgY29udGFpbmVkIGluIHRoZSAnZWFjaCcgYXR0cmlidXRlXG4gKi9cbmZ1bmN0aW9uIF9lYWNoKGRvbSwgcGFyZW50LCBleHByKSB7XG5cbiAgLy8gcmVtb3ZlIHRoZSBlYWNoIHByb3BlcnR5IGZyb20gdGhlIG9yaWdpbmFsIHRhZ1xuICByZW1BdHRyKGRvbSwgJ2VhY2gnKVxuXG4gIHZhciBtdXN0UmVvcmRlciA9IHR5cGVvZiBnZXRBdHRyKGRvbSwgJ25vLXJlb3JkZXInKSAhPT0gVF9TVFJJTkcgfHwgcmVtQXR0cihkb20sICduby1yZW9yZGVyJyksXG4gICAgdGFnTmFtZSA9IGdldFRhZ05hbWUoZG9tKSxcbiAgICBpbXBsID0gX190YWdJbXBsW3RhZ05hbWVdIHx8IHsgdG1wbDogZ2V0T3V0ZXJIVE1MKGRvbSkgfSxcbiAgICB1c2VSb290ID0gU1BFQ0lBTF9UQUdTX1JFR0VYLnRlc3QodGFnTmFtZSksXG4gICAgcm9vdCA9IGRvbS5wYXJlbnROb2RlLFxuICAgIHJlZiA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKSxcbiAgICBjaGlsZCA9IGdldFRhZyhkb20pLFxuICAgIGlzT3B0aW9uID0gdGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnb3B0aW9uJywgLy8gdGhlIG9wdGlvbiB0YWdzIG11c3QgYmUgdHJlYXRlZCBkaWZmZXJlbnRseVxuICAgIHRhZ3MgPSBbXSxcbiAgICBvbGRJdGVtcyA9IFtdLFxuICAgIGhhc0tleXMsXG4gICAgaXNWaXJ0dWFsID0gZG9tLnRhZ05hbWUgPT0gJ1ZJUlRVQUwnXG5cbiAgLy8gcGFyc2UgdGhlIGVhY2ggZXhwcmVzc2lvblxuICBleHByID0gdG1wbC5sb29wS2V5cyhleHByKVxuXG4gIC8vIGluc2VydCBhIG1hcmtlZCB3aGVyZSB0aGUgbG9vcCB0YWdzIHdpbGwgYmUgaW5qZWN0ZWRcbiAgcm9vdC5pbnNlcnRCZWZvcmUocmVmLCBkb20pXG5cbiAgLy8gY2xlYW4gdGVtcGxhdGUgY29kZVxuICBwYXJlbnQub25lKCdiZWZvcmUtbW91bnQnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAvLyByZW1vdmUgdGhlIG9yaWdpbmFsIERPTSBub2RlXG4gICAgZG9tLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZG9tKVxuICAgIGlmIChyb290LnN0dWIpIHJvb3QgPSBwYXJlbnQucm9vdFxuXG4gIH0pLm9uKCd1cGRhdGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgLy8gZ2V0IHRoZSBuZXcgaXRlbXMgY29sbGVjdGlvblxuICAgIHZhciBpdGVtcyA9IHRtcGwoZXhwci52YWwsIHBhcmVudCksXG4gICAgICAvLyBjcmVhdGUgYSBmcmFnbWVudCB0byBob2xkIHRoZSBuZXcgRE9NIG5vZGVzIHRvIGluamVjdCBpbiB0aGUgcGFyZW50IHRhZ1xuICAgICAgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXG4gICAgLy8gb2JqZWN0IGxvb3AuIGFueSBjaGFuZ2VzIGNhdXNlIGZ1bGwgcmVkcmF3XG4gICAgaWYgKCFpc0FycmF5KGl0ZW1zKSkge1xuICAgICAgaGFzS2V5cyA9IGl0ZW1zIHx8IGZhbHNlXG4gICAgICBpdGVtcyA9IGhhc0tleXMgP1xuICAgICAgICBPYmplY3Qua2V5cyhpdGVtcykubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICByZXR1cm4gbWtpdGVtKGV4cHIsIGtleSwgaXRlbXNba2V5XSlcbiAgICAgICAgfSkgOiBbXVxuICAgIH1cblxuICAgIC8vIGxvb3AgYWxsIHRoZSBuZXcgaXRlbXNcbiAgICB2YXIgaSA9IDAsXG4gICAgICBpdGVtc0xlbmd0aCA9IGl0ZW1zLmxlbmd0aFxuXG4gICAgZm9yICg7IGkgPCBpdGVtc0xlbmd0aDsgaSsrKSB7XG4gICAgICAvLyByZW9yZGVyIG9ubHkgaWYgdGhlIGl0ZW1zIGFyZSBvYmplY3RzXG4gICAgICB2YXJcbiAgICAgICAgaXRlbSA9IGl0ZW1zW2ldLFxuICAgICAgICBfbXVzdFJlb3JkZXIgPSBtdXN0UmVvcmRlciAmJiB0eXBlb2YgaXRlbSA9PSBUX09CSkVDVCAmJiAhaGFzS2V5cyxcbiAgICAgICAgb2xkUG9zID0gb2xkSXRlbXMuaW5kZXhPZihpdGVtKSxcbiAgICAgICAgcG9zID0gfm9sZFBvcyAmJiBfbXVzdFJlb3JkZXIgPyBvbGRQb3MgOiBpLFxuICAgICAgICAvLyBkb2VzIGEgdGFnIGV4aXN0IGluIHRoaXMgcG9zaXRpb24/XG4gICAgICAgIHRhZyA9IHRhZ3NbcG9zXVxuXG4gICAgICBpdGVtID0gIWhhc0tleXMgJiYgZXhwci5rZXkgPyBta2l0ZW0oZXhwciwgaXRlbSwgaSkgOiBpdGVtXG5cbiAgICAgIC8vIG5ldyB0YWdcbiAgICAgIGlmIChcbiAgICAgICAgIV9tdXN0UmVvcmRlciAmJiAhdGFnIC8vIHdpdGggbm8tcmVvcmRlciB3ZSBqdXN0IHVwZGF0ZSB0aGUgb2xkIHRhZ3NcbiAgICAgICAgfHxcbiAgICAgICAgX211c3RSZW9yZGVyICYmICF+b2xkUG9zIHx8ICF0YWcgLy8gYnkgZGVmYXVsdCB3ZSBhbHdheXMgdHJ5IHRvIHJlb3JkZXIgdGhlIERPTSBlbGVtZW50c1xuICAgICAgKSB7XG5cbiAgICAgICAgdGFnID0gbmV3IFRhZyhpbXBsLCB7XG4gICAgICAgICAgcGFyZW50OiBwYXJlbnQsXG4gICAgICAgICAgaXNMb29wOiB0cnVlLFxuICAgICAgICAgIGhhc0ltcGw6ICEhX190YWdJbXBsW3RhZ05hbWVdLFxuICAgICAgICAgIHJvb3Q6IHVzZVJvb3QgPyByb290IDogZG9tLmNsb25lTm9kZSgpLFxuICAgICAgICAgIGl0ZW06IGl0ZW1cbiAgICAgICAgfSwgZG9tLmlubmVySFRNTClcblxuICAgICAgICB0YWcubW91bnQoKVxuXG4gICAgICAgIGlmIChpc1ZpcnR1YWwpIHRhZy5fcm9vdCA9IHRhZy5yb290LmZpcnN0Q2hpbGQgLy8gc2F2ZSByZWZlcmVuY2UgZm9yIGZ1cnRoZXIgbW92ZXMgb3IgaW5zZXJ0c1xuICAgICAgICAvLyB0aGlzIHRhZyBtdXN0IGJlIGFwcGVuZGVkXG4gICAgICAgIGlmIChpID09IHRhZ3MubGVuZ3RoIHx8ICF0YWdzW2ldKSB7IC8vIGZpeCAxNTgxXG4gICAgICAgICAgaWYgKGlzVmlydHVhbClcbiAgICAgICAgICAgIGFkZFZpcnR1YWwodGFnLCBmcmFnKVxuICAgICAgICAgIGVsc2UgZnJhZy5hcHBlbmRDaGlsZCh0YWcucm9vdClcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzIHRhZyBtdXN0IGJlIGluc2VydFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAoaXNWaXJ0dWFsKVxuICAgICAgICAgICAgYWRkVmlydHVhbCh0YWcsIHJvb3QsIHRhZ3NbaV0pXG4gICAgICAgICAgZWxzZSByb290Lmluc2VydEJlZm9yZSh0YWcucm9vdCwgdGFnc1tpXS5yb290KSAvLyAjMTM3NCBzb21lIGJyb3dzZXJzIHJlc2V0IHNlbGVjdGVkIGhlcmVcbiAgICAgICAgICBvbGRJdGVtcy5zcGxpY2UoaSwgMCwgaXRlbSlcbiAgICAgICAgfVxuXG4gICAgICAgIHRhZ3Muc3BsaWNlKGksIDAsIHRhZylcbiAgICAgICAgcG9zID0gaSAvLyBoYW5kbGVkIGhlcmUgc28gbm8gbW92ZVxuICAgICAgfSBlbHNlIHRhZy51cGRhdGUoaXRlbSwgdHJ1ZSlcblxuICAgICAgLy8gcmVvcmRlciB0aGUgdGFnIGlmIGl0J3Mgbm90IGxvY2F0ZWQgaW4gaXRzIHByZXZpb3VzIHBvc2l0aW9uXG4gICAgICBpZiAoXG4gICAgICAgIHBvcyAhPT0gaSAmJiBfbXVzdFJlb3JkZXIgJiZcbiAgICAgICAgdGFnc1tpXSAvLyBmaXggMTU4MSB1bmFibGUgdG8gcmVwcm9kdWNlIGl0IGluIGEgdGVzdCFcbiAgICAgICkge1xuICAgICAgICAvLyB1cGRhdGUgdGhlIERPTVxuICAgICAgICBpZiAoaXNWaXJ0dWFsKVxuICAgICAgICAgIG1vdmVWaXJ0dWFsKHRhZywgcm9vdCwgdGFnc1tpXSwgZG9tLmNoaWxkTm9kZXMubGVuZ3RoKVxuICAgICAgICBlbHNlIGlmICh0YWdzW2ldLnJvb3QucGFyZW50Tm9kZSkgcm9vdC5pbnNlcnRCZWZvcmUodGFnLnJvb3QsIHRhZ3NbaV0ucm9vdClcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBwb3NpdGlvbiBhdHRyaWJ1dGUgaWYgaXQgZXhpc3RzXG4gICAgICAgIGlmIChleHByLnBvcylcbiAgICAgICAgICB0YWdbZXhwci5wb3NdID0gaVxuICAgICAgICAvLyBtb3ZlIHRoZSBvbGQgdGFnIGluc3RhbmNlXG4gICAgICAgIHRhZ3Muc3BsaWNlKGksIDAsIHRhZ3Muc3BsaWNlKHBvcywgMSlbMF0pXG4gICAgICAgIC8vIG1vdmUgdGhlIG9sZCBpdGVtXG4gICAgICAgIG9sZEl0ZW1zLnNwbGljZShpLCAwLCBvbGRJdGVtcy5zcGxpY2UocG9zLCAxKVswXSlcbiAgICAgICAgLy8gaWYgdGhlIGxvb3AgdGFncyBhcmUgbm90IGN1c3RvbVxuICAgICAgICAvLyB3ZSBuZWVkIHRvIG1vdmUgYWxsIHRoZWlyIGN1c3RvbSB0YWdzIGludG8gdGhlIHJpZ2h0IHBvc2l0aW9uXG4gICAgICAgIGlmICghY2hpbGQgJiYgdGFnLnRhZ3MpIG1vdmVOZXN0ZWRUYWdzKHRhZywgaSlcbiAgICAgIH1cblxuICAgICAgLy8gY2FjaGUgdGhlIG9yaWdpbmFsIGl0ZW0gdG8gdXNlIGl0IGluIHRoZSBldmVudHMgYm91bmQgdG8gdGhpcyBub2RlXG4gICAgICAvLyBhbmQgaXRzIGNoaWxkcmVuXG4gICAgICB0YWcuX2l0ZW0gPSBpdGVtXG4gICAgICAvLyBjYWNoZSB0aGUgcmVhbCBwYXJlbnQgdGFnIGludGVybmFsbHlcbiAgICAgIGRlZmluZVByb3BlcnR5KHRhZywgJ19wYXJlbnQnLCBwYXJlbnQpXG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIHRoZSByZWR1bmRhbnQgdGFnc1xuICAgIHVubW91bnRSZWR1bmRhbnQoaXRlbXMsIHRhZ3MpXG5cbiAgICAvLyBpbnNlcnQgdGhlIG5ldyBub2Rlc1xuICAgIHJvb3QuaW5zZXJ0QmVmb3JlKGZyYWcsIHJlZilcbiAgICBpZiAoaXNPcHRpb24pIHtcblxuICAgICAgLy8gIzEzNzQgRmlyZUZveCBidWcgaW4gPG9wdGlvbiBzZWxlY3RlZD17ZXhwcmVzc2lvbn0+XG4gICAgICBpZiAoRklSRUZPWCAmJiAhcm9vdC5tdWx0aXBsZSkge1xuICAgICAgICBmb3IgKHZhciBuID0gMDsgbiA8IHJvb3QubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgICBpZiAocm9vdFtuXS5fX3Jpb3QxMzc0KSB7XG4gICAgICAgICAgICByb290LnNlbGVjdGVkSW5kZXggPSBuICAvLyBjbGVhciBvdGhlciBvcHRpb25zXG4gICAgICAgICAgICBkZWxldGUgcm9vdFtuXS5fX3Jpb3QxMzc0XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNldCB0aGUgJ3RhZ3MnIHByb3BlcnR5IG9mIHRoZSBwYXJlbnQgdGFnXG4gICAgLy8gaWYgY2hpbGQgaXMgJ3VuZGVmaW5lZCcgaXQgbWVhbnMgdGhhdCB3ZSBkb24ndCBuZWVkIHRvIHNldCB0aGlzIHByb3BlcnR5XG4gICAgLy8gZm9yIGV4YW1wbGU6XG4gICAgLy8gd2UgZG9uJ3QgbmVlZCBzdG9yZSB0aGUgYG15VGFnLnRhZ3NbJ2RpdiddYCBwcm9wZXJ0eSBpZiB3ZSBhcmUgbG9vcGluZyBhIGRpdiB0YWdcbiAgICAvLyBidXQgd2UgbmVlZCB0byB0cmFjayB0aGUgYG15VGFnLnRhZ3NbJ2NoaWxkJ11gIHByb3BlcnR5IGxvb3BpbmcgYSBjdXN0b20gY2hpbGQgbm9kZSBuYW1lZCBgY2hpbGRgXG4gICAgaWYgKGNoaWxkKSBwYXJlbnQudGFnc1t0YWdOYW1lXSA9IHRhZ3NcblxuICAgIC8vIGNsb25lIHRoZSBpdGVtcyBhcnJheVxuICAgIG9sZEl0ZW1zID0gaXRlbXMuc2xpY2UoKVxuXG4gIH0pXG5cbn1cbi8qKlxuICogT2JqZWN0IHRoYXQgd2lsbCBiZSB1c2VkIHRvIGluamVjdCBhbmQgbWFuYWdlIHRoZSBjc3Mgb2YgZXZlcnkgdGFnIGluc3RhbmNlXG4gKi9cbnZhciBzdHlsZU1hbmFnZXIgPSAoZnVuY3Rpb24oX3Jpb3QpIHtcblxuICBpZiAoIXdpbmRvdykgcmV0dXJuIHsgLy8gc2tpcCBpbmplY3Rpb24gb24gdGhlIHNlcnZlclxuICAgIGFkZDogZnVuY3Rpb24gKCkge30sXG4gICAgaW5qZWN0OiBmdW5jdGlvbiAoKSB7fVxuICB9XG5cbiAgdmFyIHN0eWxlTm9kZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgLy8gY3JlYXRlIGEgbmV3IHN0eWxlIGVsZW1lbnQgd2l0aCB0aGUgY29ycmVjdCB0eXBlXG4gICAgdmFyIG5ld05vZGUgPSBta0VsKCdzdHlsZScpXG4gICAgc2V0QXR0cihuZXdOb2RlLCAndHlwZScsICd0ZXh0L2NzcycpXG5cbiAgICAvLyByZXBsYWNlIGFueSB1c2VyIG5vZGUgb3IgaW5zZXJ0IHRoZSBuZXcgb25lIGludG8gdGhlIGhlYWRcbiAgICB2YXIgdXNlck5vZGUgPSAkKCdzdHlsZVt0eXBlPXJpb3RdJylcbiAgICBpZiAodXNlck5vZGUpIHtcbiAgICAgIGlmICh1c2VyTm9kZS5pZCkgbmV3Tm9kZS5pZCA9IHVzZXJOb2RlLmlkXG4gICAgICB1c2VyTm9kZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdOb2RlLCB1c2VyTm9kZSlcbiAgICB9XG4gICAgZWxzZSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKG5ld05vZGUpXG5cbiAgICByZXR1cm4gbmV3Tm9kZVxuICB9KSgpXG5cbiAgLy8gQ3JlYXRlIGNhY2hlIGFuZCBzaG9ydGN1dCB0byB0aGUgY29ycmVjdCBwcm9wZXJ0eVxuICB2YXIgY3NzVGV4dFByb3AgPSBzdHlsZU5vZGUuc3R5bGVTaGVldCxcbiAgICBzdHlsZXNUb0luamVjdCA9ICcnXG5cbiAgLy8gRXhwb3NlIHRoZSBzdHlsZSBub2RlIGluIGEgbm9uLW1vZGlmaWNhYmxlIHByb3BlcnR5XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfcmlvdCwgJ3N0eWxlTm9kZScsIHtcbiAgICB2YWx1ZTogc3R5bGVOb2RlLFxuICAgIHdyaXRhYmxlOiB0cnVlXG4gIH0pXG5cbiAgLyoqXG4gICAqIFB1YmxpYyBhcGlcbiAgICovXG4gIHJldHVybiB7XG4gICAgLyoqXG4gICAgICogU2F2ZSBhIHRhZyBzdHlsZSB0byBiZSBsYXRlciBpbmplY3RlZCBpbnRvIERPTVxuICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gY3NzIFtkZXNjcmlwdGlvbl1cbiAgICAgKi9cbiAgICBhZGQ6IGZ1bmN0aW9uKGNzcykge1xuICAgICAgc3R5bGVzVG9JbmplY3QgKz0gY3NzXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBJbmplY3QgYWxsIHByZXZpb3VzbHkgc2F2ZWQgdGFnIHN0eWxlcyBpbnRvIERPTVxuICAgICAqIGlubmVySFRNTCBzZWVtcyBzbG93OiBodHRwOi8vanNwZXJmLmNvbS9yaW90LWluc2VydC1zdHlsZVxuICAgICAqL1xuICAgIGluamVjdDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoc3R5bGVzVG9JbmplY3QpIHtcbiAgICAgICAgaWYgKGNzc1RleHRQcm9wKSBjc3NUZXh0UHJvcC5jc3NUZXh0ICs9IHN0eWxlc1RvSW5qZWN0XG4gICAgICAgIGVsc2Ugc3R5bGVOb2RlLmlubmVySFRNTCArPSBzdHlsZXNUb0luamVjdFxuICAgICAgICBzdHlsZXNUb0luamVjdCA9ICcnXG4gICAgICB9XG4gICAgfVxuICB9XG5cbn0pKHJpb3QpXG5cblxuZnVuY3Rpb24gcGFyc2VOYW1lZEVsZW1lbnRzKHJvb3QsIHRhZywgY2hpbGRUYWdzLCBmb3JjZVBhcnNpbmdOYW1lZCkge1xuXG4gIHdhbGsocm9vdCwgZnVuY3Rpb24oZG9tKSB7XG4gICAgaWYgKGRvbS5ub2RlVHlwZSA9PSAxKSB7XG4gICAgICBkb20uaXNMb29wID0gZG9tLmlzTG9vcCB8fFxuICAgICAgICAgICAgICAgICAgKGRvbS5wYXJlbnROb2RlICYmIGRvbS5wYXJlbnROb2RlLmlzTG9vcCB8fCBnZXRBdHRyKGRvbSwgJ2VhY2gnKSlcbiAgICAgICAgICAgICAgICAgICAgPyAxIDogMFxuXG4gICAgICAvLyBjdXN0b20gY2hpbGQgdGFnXG4gICAgICBpZiAoY2hpbGRUYWdzKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IGdldFRhZyhkb20pXG5cbiAgICAgICAgaWYgKGNoaWxkICYmICFkb20uaXNMb29wKVxuICAgICAgICAgIGNoaWxkVGFncy5wdXNoKGluaXRDaGlsZFRhZyhjaGlsZCwge3Jvb3Q6IGRvbSwgcGFyZW50OiB0YWd9LCBkb20uaW5uZXJIVE1MLCB0YWcpKVxuICAgICAgfVxuXG4gICAgICBpZiAoIWRvbS5pc0xvb3AgfHwgZm9yY2VQYXJzaW5nTmFtZWQpXG4gICAgICAgIHNldE5hbWVkKGRvbSwgdGFnLCBbXSlcbiAgICB9XG5cbiAgfSlcblxufVxuXG5mdW5jdGlvbiBwYXJzZUV4cHJlc3Npb25zKHJvb3QsIHRhZywgZXhwcmVzc2lvbnMpIHtcblxuICBmdW5jdGlvbiBhZGRFeHByKGRvbSwgdmFsLCBleHRyYSkge1xuICAgIGlmICh0bXBsLmhhc0V4cHIodmFsKSkge1xuICAgICAgZXhwcmVzc2lvbnMucHVzaChleHRlbmQoeyBkb206IGRvbSwgZXhwcjogdmFsIH0sIGV4dHJhKSlcbiAgICB9XG4gIH1cblxuICB3YWxrKHJvb3QsIGZ1bmN0aW9uKGRvbSkge1xuICAgIHZhciB0eXBlID0gZG9tLm5vZGVUeXBlLFxuICAgICAgYXR0clxuXG4gICAgLy8gdGV4dCBub2RlXG4gICAgaWYgKHR5cGUgPT0gMyAmJiBkb20ucGFyZW50Tm9kZS50YWdOYW1lICE9ICdTVFlMRScpIGFkZEV4cHIoZG9tLCBkb20ubm9kZVZhbHVlKVxuICAgIGlmICh0eXBlICE9IDEpIHJldHVyblxuXG4gICAgLyogZWxlbWVudCAqL1xuXG4gICAgLy8gbG9vcFxuICAgIGF0dHIgPSBnZXRBdHRyKGRvbSwgJ2VhY2gnKVxuXG4gICAgaWYgKGF0dHIpIHsgX2VhY2goZG9tLCB0YWcsIGF0dHIpOyByZXR1cm4gZmFsc2UgfVxuXG4gICAgLy8gYXR0cmlidXRlIGV4cHJlc3Npb25zXG4gICAgZWFjaChkb20uYXR0cmlidXRlcywgZnVuY3Rpb24oYXR0cikge1xuICAgICAgdmFyIG5hbWUgPSBhdHRyLm5hbWUsXG4gICAgICAgIGJvb2wgPSBuYW1lLnNwbGl0KCdfXycpWzFdXG5cbiAgICAgIGFkZEV4cHIoZG9tLCBhdHRyLnZhbHVlLCB7IGF0dHI6IGJvb2wgfHwgbmFtZSwgYm9vbDogYm9vbCB9KVxuICAgICAgaWYgKGJvb2wpIHsgcmVtQXR0cihkb20sIG5hbWUpOyByZXR1cm4gZmFsc2UgfVxuXG4gICAgfSlcblxuICAgIC8vIHNraXAgY3VzdG9tIHRhZ3NcbiAgICBpZiAoZ2V0VGFnKGRvbSkpIHJldHVybiBmYWxzZVxuXG4gIH0pXG5cbn1cbmZ1bmN0aW9uIFRhZyhpbXBsLCBjb25mLCBpbm5lckhUTUwpIHtcblxuICB2YXIgc2VsZiA9IHJpb3Qub2JzZXJ2YWJsZSh0aGlzKSxcbiAgICBvcHRzID0gaW5oZXJpdChjb25mLm9wdHMpIHx8IHt9LFxuICAgIHBhcmVudCA9IGNvbmYucGFyZW50LFxuICAgIGlzTG9vcCA9IGNvbmYuaXNMb29wLFxuICAgIGhhc0ltcGwgPSBjb25mLmhhc0ltcGwsXG4gICAgaXRlbSA9IGNsZWFuVXBEYXRhKGNvbmYuaXRlbSksXG4gICAgZXhwcmVzc2lvbnMgPSBbXSxcbiAgICBjaGlsZFRhZ3MgPSBbXSxcbiAgICByb290ID0gY29uZi5yb290LFxuICAgIHRhZ05hbWUgPSByb290LnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICBhdHRyID0ge30sXG4gICAgcHJvcHNJblN5bmNXaXRoUGFyZW50ID0gW10sXG4gICAgZG9tXG5cbiAgLy8gb25seSBjYWxsIHVubW91bnQgaWYgd2UgaGF2ZSBhIHZhbGlkIF9fdGFnSW1wbCAoaGFzIG5hbWUgcHJvcGVydHkpXG4gIGlmIChpbXBsLm5hbWUgJiYgcm9vdC5fdGFnKSByb290Ll90YWcudW5tb3VudCh0cnVlKVxuXG4gIC8vIG5vdCB5ZXQgbW91bnRlZFxuICB0aGlzLmlzTW91bnRlZCA9IGZhbHNlXG4gIHJvb3QuaXNMb29wID0gaXNMb29wXG5cbiAgLy8ga2VlcCBhIHJlZmVyZW5jZSB0byB0aGUgdGFnIGp1c3QgY3JlYXRlZFxuICAvLyBzbyB3ZSB3aWxsIGJlIGFibGUgdG8gbW91bnQgdGhpcyB0YWcgbXVsdGlwbGUgdGltZXNcbiAgcm9vdC5fdGFnID0gdGhpc1xuXG4gIC8vIGNyZWF0ZSBhIHVuaXF1ZSBpZCB0byB0aGlzIHRhZ1xuICAvLyBpdCBjb3VsZCBiZSBoYW5keSB0byB1c2UgaXQgYWxzbyB0byBpbXByb3ZlIHRoZSB2aXJ0dWFsIGRvbSByZW5kZXJpbmcgc3BlZWRcbiAgZGVmaW5lUHJvcGVydHkodGhpcywgJ19yaW90X2lkJywgKytfX3VpZCkgLy8gYmFzZSAxIGFsbG93cyB0ZXN0ICF0Ll9yaW90X2lkXG5cbiAgZXh0ZW5kKHRoaXMsIHsgcGFyZW50OiBwYXJlbnQsIHJvb3Q6IHJvb3QsIG9wdHM6IG9wdHN9LCBpdGVtKVxuICAvLyBwcm90ZWN0IHRoZSBcInRhZ3NcIiBwcm9wZXJ0eSBmcm9tIGJlaW5nIG92ZXJyaWRkZW5cbiAgZGVmaW5lUHJvcGVydHkodGhpcywgJ3RhZ3MnLCB7fSlcblxuICAvLyBncmFiIGF0dHJpYnV0ZXNcbiAgZWFjaChyb290LmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGVsKSB7XG4gICAgdmFyIHZhbCA9IGVsLnZhbHVlXG4gICAgLy8gcmVtZW1iZXIgYXR0cmlidXRlcyB3aXRoIGV4cHJlc3Npb25zIG9ubHlcbiAgICBpZiAodG1wbC5oYXNFeHByKHZhbCkpIGF0dHJbZWwubmFtZV0gPSB2YWxcbiAgfSlcblxuICBkb20gPSBta2RvbShpbXBsLnRtcGwsIGlubmVySFRNTClcblxuICAvLyBvcHRpb25zXG4gIGZ1bmN0aW9uIHVwZGF0ZU9wdHMoKSB7XG4gICAgdmFyIGN0eCA9IGhhc0ltcGwgJiYgaXNMb29wID8gc2VsZiA6IHBhcmVudCB8fCBzZWxmXG5cbiAgICAvLyB1cGRhdGUgb3B0cyBmcm9tIGN1cnJlbnQgRE9NIGF0dHJpYnV0ZXNcbiAgICBlYWNoKHJvb3QuYXR0cmlidXRlcywgZnVuY3Rpb24oZWwpIHtcbiAgICAgIHZhciB2YWwgPSBlbC52YWx1ZVxuICAgICAgb3B0c1t0b0NhbWVsKGVsLm5hbWUpXSA9IHRtcGwuaGFzRXhwcih2YWwpID8gdG1wbCh2YWwsIGN0eCkgOiB2YWxcbiAgICB9KVxuICAgIC8vIHJlY292ZXIgdGhvc2Ugd2l0aCBleHByZXNzaW9uc1xuICAgIGVhY2goT2JqZWN0LmtleXMoYXR0ciksIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIG9wdHNbdG9DYW1lbChuYW1lKV0gPSB0bXBsKGF0dHJbbmFtZV0sIGN0eClcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplRGF0YShkYXRhKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGl0ZW0pIHtcbiAgICAgIGlmICh0eXBlb2Ygc2VsZltrZXldICE9PSBUX1VOREVGICYmIGlzV3JpdGFibGUoc2VsZiwga2V5KSlcbiAgICAgICAgc2VsZltrZXldID0gZGF0YVtrZXldXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5oZXJpdEZyb20odGFyZ2V0KSB7XG4gICAgZWFjaChPYmplY3Qua2V5cyh0YXJnZXQpLCBmdW5jdGlvbihrKSB7XG4gICAgICAvLyBzb21lIHByb3BlcnRpZXMgbXVzdCBiZSBhbHdheXMgaW4gc3luYyB3aXRoIHRoZSBwYXJlbnQgdGFnXG4gICAgICB2YXIgbXVzdFN5bmMgPSAhUkVTRVJWRURfV09SRFNfQkxBQ0tMSVNULnRlc3QoaykgJiYgY29udGFpbnMocHJvcHNJblN5bmNXaXRoUGFyZW50LCBrKVxuXG4gICAgICBpZiAodHlwZW9mIHNlbGZba10gPT09IFRfVU5ERUYgfHwgbXVzdFN5bmMpIHtcbiAgICAgICAgLy8gdHJhY2sgdGhlIHByb3BlcnR5IHRvIGtlZXAgaW4gc3luY1xuICAgICAgICAvLyBzbyB3ZSBjYW4ga2VlcCBpdCB1cGRhdGVkXG4gICAgICAgIGlmICghbXVzdFN5bmMpIHByb3BzSW5TeW5jV2l0aFBhcmVudC5wdXNoKGspXG4gICAgICAgIHNlbGZba10gPSB0YXJnZXRba11cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgdGFnIGV4cHJlc3Npb25zIGFuZCBvcHRpb25zXG4gICAqIEBwYXJhbSAgIHsgKiB9ICBkYXRhIC0gZGF0YSB3ZSB3YW50IHRvIHVzZSB0byBleHRlbmQgdGhlIHRhZyBwcm9wZXJ0aWVzXG4gICAqIEBwYXJhbSAgIHsgQm9vbGVhbiB9IGlzSW5oZXJpdGVkIC0gaXMgdGhpcyB1cGRhdGUgY29taW5nIGZyb20gYSBwYXJlbnQgdGFnP1xuICAgKiBAcmV0dXJucyB7IHNlbGYgfVxuICAgKi9cbiAgZGVmaW5lUHJvcGVydHkodGhpcywgJ3VwZGF0ZScsIGZ1bmN0aW9uKGRhdGEsIGlzSW5oZXJpdGVkKSB7XG5cbiAgICAvLyBtYWtlIHN1cmUgdGhlIGRhdGEgcGFzc2VkIHdpbGwgbm90IG92ZXJyaWRlXG4gICAgLy8gdGhlIGNvbXBvbmVudCBjb3JlIG1ldGhvZHNcbiAgICBkYXRhID0gY2xlYW5VcERhdGEoZGF0YSlcbiAgICAvLyBpbmhlcml0IHByb3BlcnRpZXMgZnJvbSB0aGUgcGFyZW50IGluIGxvb3BcbiAgICBpZiAoaXNMb29wKSB7XG4gICAgICBpbmhlcml0RnJvbShzZWxmLnBhcmVudClcbiAgICB9XG4gICAgLy8gbm9ybWFsaXplIHRoZSB0YWcgcHJvcGVydGllcyBpbiBjYXNlIGFuIGl0ZW0gb2JqZWN0IHdhcyBpbml0aWFsbHkgcGFzc2VkXG4gICAgaWYgKGRhdGEgJiYgaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIG5vcm1hbGl6ZURhdGEoZGF0YSlcbiAgICAgIGl0ZW0gPSBkYXRhXG4gICAgfVxuICAgIGV4dGVuZChzZWxmLCBkYXRhKVxuICAgIHVwZGF0ZU9wdHMoKVxuICAgIHNlbGYudHJpZ2dlcigndXBkYXRlJywgZGF0YSlcbiAgICB1cGRhdGUoZXhwcmVzc2lvbnMsIHNlbGYpXG5cbiAgICAvLyB0aGUgdXBkYXRlZCBldmVudCB3aWxsIGJlIHRyaWdnZXJlZFxuICAgIC8vIG9uY2UgdGhlIERPTSB3aWxsIGJlIHJlYWR5IGFuZCBhbGwgdGhlIHJlLWZsb3dzIGFyZSBjb21wbGV0ZWRcbiAgICAvLyB0aGlzIGlzIHVzZWZ1bCBpZiB5b3Ugd2FudCB0byBnZXQgdGhlIFwicmVhbFwiIHJvb3QgcHJvcGVydGllc1xuICAgIC8vIDQgZXg6IHJvb3Qub2Zmc2V0V2lkdGggLi4uXG4gICAgaWYgKGlzSW5oZXJpdGVkICYmIHNlbGYucGFyZW50KVxuICAgICAgLy8gY2xvc2VzICMxNTk5XG4gICAgICBzZWxmLnBhcmVudC5vbmUoJ3VwZGF0ZWQnLCBmdW5jdGlvbigpIHsgc2VsZi50cmlnZ2VyKCd1cGRhdGVkJykgfSlcbiAgICBlbHNlIHJBRihmdW5jdGlvbigpIHsgc2VsZi50cmlnZ2VyKCd1cGRhdGVkJykgfSlcblxuICAgIHJldHVybiB0aGlzXG4gIH0pXG5cbiAgZGVmaW5lUHJvcGVydHkodGhpcywgJ21peGluJywgZnVuY3Rpb24oKSB7XG4gICAgZWFjaChhcmd1bWVudHMsIGZ1bmN0aW9uKG1peCkge1xuICAgICAgdmFyIGluc3RhbmNlLFxuICAgICAgICBwcm9wcyA9IFtdLFxuICAgICAgICBvYmpcblxuICAgICAgbWl4ID0gdHlwZW9mIG1peCA9PT0gVF9TVFJJTkcgPyByaW90Lm1peGluKG1peCkgOiBtaXhcblxuICAgICAgLy8gY2hlY2sgaWYgdGhlIG1peGluIGlzIGEgZnVuY3Rpb25cbiAgICAgIGlmIChpc0Z1bmN0aW9uKG1peCkpIHtcbiAgICAgICAgLy8gY3JlYXRlIHRoZSBuZXcgbWl4aW4gaW5zdGFuY2VcbiAgICAgICAgaW5zdGFuY2UgPSBuZXcgbWl4KClcbiAgICAgIH0gZWxzZSBpbnN0YW5jZSA9IG1peFxuXG4gICAgICB2YXIgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoaW5zdGFuY2UpXG5cbiAgICAgIC8vIGJ1aWxkIG11bHRpbGV2ZWwgcHJvdG90eXBlIGluaGVyaXRhbmNlIGNoYWluIHByb3BlcnR5IGxpc3RcbiAgICAgIGRvIHByb3BzID0gcHJvcHMuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaiB8fCBpbnN0YW5jZSkpXG4gICAgICB3aGlsZSAob2JqID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaiB8fCBpbnN0YW5jZSkpXG5cbiAgICAgIC8vIGxvb3AgdGhlIGtleXMgaW4gdGhlIGZ1bmN0aW9uIHByb3RvdHlwZSBvciB0aGUgYWxsIG9iamVjdCBrZXlzXG4gICAgICBlYWNoKHByb3BzLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgLy8gYmluZCBtZXRob2RzIHRvIHNlbGZcbiAgICAgICAgLy8gYWxsb3cgbWl4aW5zIHRvIG92ZXJyaWRlIG90aGVyIHByb3BlcnRpZXMvcGFyZW50IG1peGluc1xuICAgICAgICBpZiAoa2V5ICE9ICdpbml0Jykge1xuICAgICAgICAgIC8vIGNoZWNrIGZvciBnZXR0ZXJzL3NldHRlcnNcbiAgICAgICAgICB2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaW5zdGFuY2UsIGtleSkgfHwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywga2V5KVxuICAgICAgICAgIHZhciBoYXNHZXR0ZXJTZXR0ZXIgPSBkZXNjcmlwdG9yICYmIChkZXNjcmlwdG9yLmdldCB8fCBkZXNjcmlwdG9yLnNldClcblxuICAgICAgICAgIC8vIGFwcGx5IG1ldGhvZCBvbmx5IGlmIGl0IGRvZXMgbm90IGFscmVhZHkgZXhpc3Qgb24gdGhlIGluc3RhbmNlXG4gICAgICAgICAgaWYgKCFzZWxmLmhhc093blByb3BlcnR5KGtleSkgJiYgaGFzR2V0dGVyU2V0dGVyKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2VsZiwga2V5LCBkZXNjcmlwdG9yKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxmW2tleV0gPSBpc0Z1bmN0aW9uKGluc3RhbmNlW2tleV0pID9cbiAgICAgICAgICAgICAgaW5zdGFuY2Vba2V5XS5iaW5kKHNlbGYpIDpcbiAgICAgICAgICAgICAgaW5zdGFuY2Vba2V5XVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgLy8gaW5pdCBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgYXV0b21hdGljYWxseVxuICAgICAgaWYgKGluc3RhbmNlLmluaXQpIGluc3RhbmNlLmluaXQuYmluZChzZWxmKSgpXG4gICAgfSlcbiAgICByZXR1cm4gdGhpc1xuICB9KVxuXG4gIGRlZmluZVByb3BlcnR5KHRoaXMsICdtb3VudCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgdXBkYXRlT3B0cygpXG5cbiAgICAvLyBhZGQgZ2xvYmFsIG1peGluc1xuICAgIHZhciBnbG9iYWxNaXhpbiA9IHJpb3QubWl4aW4oR0xPQkFMX01JWElOKVxuXG4gICAgaWYgKGdsb2JhbE1peGluKVxuICAgICAgZm9yICh2YXIgaSBpbiBnbG9iYWxNaXhpbilcbiAgICAgICAgaWYgKGdsb2JhbE1peGluLmhhc093blByb3BlcnR5KGkpKVxuICAgICAgICAgIHNlbGYubWl4aW4oZ2xvYmFsTWl4aW5baV0pXG5cbiAgICAvLyBjaGlsZHJlbiBpbiBsb29wIHNob3VsZCBpbmhlcml0IGZyb20gdHJ1ZSBwYXJlbnRcbiAgICBpZiAoc2VsZi5fcGFyZW50ICYmIHNlbGYuX3BhcmVudC5yb290LmlzTG9vcCkge1xuICAgICAgaW5oZXJpdEZyb20oc2VsZi5fcGFyZW50KVxuICAgIH1cblxuICAgIC8vIGluaXRpYWxpYXRpb25cbiAgICBpZiAoaW1wbC5mbikgaW1wbC5mbi5jYWxsKHNlbGYsIG9wdHMpXG5cbiAgICAvLyBwYXJzZSBsYXlvdXQgYWZ0ZXIgaW5pdC4gZm4gbWF5IGNhbGN1bGF0ZSBhcmdzIGZvciBuZXN0ZWQgY3VzdG9tIHRhZ3NcbiAgICBwYXJzZUV4cHJlc3Npb25zKGRvbSwgc2VsZiwgZXhwcmVzc2lvbnMpXG5cbiAgICAvLyBtb3VudCB0aGUgY2hpbGQgdGFnc1xuICAgIHRvZ2dsZSh0cnVlKVxuXG4gICAgLy8gdXBkYXRlIHRoZSByb290IGFkZGluZyBjdXN0b20gYXR0cmlidXRlcyBjb21pbmcgZnJvbSB0aGUgY29tcGlsZXJcbiAgICAvLyBpdCBmaXhlcyBhbHNvICMxMDg3XG4gICAgaWYgKGltcGwuYXR0cnMpXG4gICAgICB3YWxrQXR0cmlidXRlcyhpbXBsLmF0dHJzLCBmdW5jdGlvbiAoaywgdikgeyBzZXRBdHRyKHJvb3QsIGssIHYpIH0pXG4gICAgaWYgKGltcGwuYXR0cnMgfHwgaGFzSW1wbClcbiAgICAgIHBhcnNlRXhwcmVzc2lvbnMoc2VsZi5yb290LCBzZWxmLCBleHByZXNzaW9ucylcblxuICAgIGlmICghc2VsZi5wYXJlbnQgfHwgaXNMb29wKSBzZWxmLnVwZGF0ZShpdGVtKVxuXG4gICAgLy8gaW50ZXJuYWwgdXNlIG9ubHksIGZpeGVzICM0MDNcbiAgICBzZWxmLnRyaWdnZXIoJ2JlZm9yZS1tb3VudCcpXG5cbiAgICBpZiAoaXNMb29wICYmICFoYXNJbXBsKSB7XG4gICAgICAvLyB1cGRhdGUgdGhlIHJvb3QgYXR0cmlidXRlIGZvciB0aGUgbG9vcGVkIGVsZW1lbnRzXG4gICAgICByb290ID0gZG9tLmZpcnN0Q2hpbGRcbiAgICB9IGVsc2Uge1xuICAgICAgd2hpbGUgKGRvbS5maXJzdENoaWxkKSByb290LmFwcGVuZENoaWxkKGRvbS5maXJzdENoaWxkKVxuICAgICAgaWYgKHJvb3Quc3R1Yikgcm9vdCA9IHBhcmVudC5yb290XG4gICAgfVxuXG4gICAgZGVmaW5lUHJvcGVydHkoc2VsZiwgJ3Jvb3QnLCByb290KVxuXG4gICAgLy8gcGFyc2UgdGhlIG5hbWVkIGRvbSBub2RlcyBpbiB0aGUgbG9vcGVkIGNoaWxkXG4gICAgLy8gYWRkaW5nIHRoZW0gdG8gdGhlIHBhcmVudCBhcyB3ZWxsXG4gICAgaWYgKGlzTG9vcClcbiAgICAgIHBhcnNlTmFtZWRFbGVtZW50cyhzZWxmLnJvb3QsIHNlbGYucGFyZW50LCBudWxsLCB0cnVlKVxuXG4gICAgLy8gaWYgaXQncyBub3QgYSBjaGlsZCB0YWcgd2UgY2FuIHRyaWdnZXIgaXRzIG1vdW50IGV2ZW50XG4gICAgaWYgKCFzZWxmLnBhcmVudCB8fCBzZWxmLnBhcmVudC5pc01vdW50ZWQpIHtcbiAgICAgIHNlbGYuaXNNb3VudGVkID0gdHJ1ZVxuICAgICAgc2VsZi50cmlnZ2VyKCdtb3VudCcpXG4gICAgfVxuICAgIC8vIG90aGVyd2lzZSB3ZSBuZWVkIHRvIHdhaXQgdGhhdCB0aGUgcGFyZW50IGV2ZW50IGdldHMgdHJpZ2dlcmVkXG4gICAgZWxzZSBzZWxmLnBhcmVudC5vbmUoJ21vdW50JywgZnVuY3Rpb24oKSB7XG4gICAgICAvLyBhdm9pZCB0byB0cmlnZ2VyIHRoZSBgbW91bnRgIGV2ZW50IGZvciB0aGUgdGFnc1xuICAgICAgLy8gbm90IHZpc2libGUgaW5jbHVkZWQgaW4gYW4gaWYgc3RhdGVtZW50XG4gICAgICBpZiAoIWlzSW5TdHViKHNlbGYucm9vdCkpIHtcbiAgICAgICAgc2VsZi5wYXJlbnQuaXNNb3VudGVkID0gc2VsZi5pc01vdW50ZWQgPSB0cnVlXG4gICAgICAgIHNlbGYudHJpZ2dlcignbW91bnQnKVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG5cblxuICBkZWZpbmVQcm9wZXJ0eSh0aGlzLCAndW5tb3VudCcsIGZ1bmN0aW9uKGtlZXBSb290VGFnKSB7XG4gICAgdmFyIGVsID0gcm9vdCxcbiAgICAgIHAgPSBlbC5wYXJlbnROb2RlLFxuICAgICAgcHRhZyxcbiAgICAgIHRhZ0luZGV4ID0gX192aXJ0dWFsRG9tLmluZGV4T2Yoc2VsZilcblxuICAgIHNlbGYudHJpZ2dlcignYmVmb3JlLXVubW91bnQnKVxuXG4gICAgLy8gcmVtb3ZlIHRoaXMgdGFnIGluc3RhbmNlIGZyb20gdGhlIGdsb2JhbCB2aXJ0dWFsRG9tIHZhcmlhYmxlXG4gICAgaWYgKH50YWdJbmRleClcbiAgICAgIF9fdmlydHVhbERvbS5zcGxpY2UodGFnSW5kZXgsIDEpXG5cbiAgICBpZiAocCkge1xuXG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIHB0YWcgPSBnZXRJbW1lZGlhdGVDdXN0b21QYXJlbnRUYWcocGFyZW50KVxuICAgICAgICAvLyByZW1vdmUgdGhpcyB0YWcgZnJvbSB0aGUgcGFyZW50IHRhZ3Mgb2JqZWN0XG4gICAgICAgIC8vIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBuZXN0ZWQgdGFncyB3aXRoIHNhbWUgbmFtZS4uXG4gICAgICAgIC8vIHJlbW92ZSB0aGlzIGVsZW1lbnQgZm9ybSB0aGUgYXJyYXlcbiAgICAgICAgaWYgKGlzQXJyYXkocHRhZy50YWdzW3RhZ05hbWVdKSlcbiAgICAgICAgICBlYWNoKHB0YWcudGFnc1t0YWdOYW1lXSwgZnVuY3Rpb24odGFnLCBpKSB7XG4gICAgICAgICAgICBpZiAodGFnLl9yaW90X2lkID09IHNlbGYuX3Jpb3RfaWQpXG4gICAgICAgICAgICAgIHB0YWcudGFnc1t0YWdOYW1lXS5zcGxpY2UoaSwgMSlcbiAgICAgICAgICB9KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgLy8gb3RoZXJ3aXNlIGp1c3QgZGVsZXRlIHRoZSB0YWcgaW5zdGFuY2VcbiAgICAgICAgICBwdGFnLnRhZ3NbdGFnTmFtZV0gPSB1bmRlZmluZWRcbiAgICAgIH1cblxuICAgICAgZWxzZVxuICAgICAgICB3aGlsZSAoZWwuZmlyc3RDaGlsZCkgZWwucmVtb3ZlQ2hpbGQoZWwuZmlyc3RDaGlsZClcblxuICAgICAgaWYgKCFrZWVwUm9vdFRhZylcbiAgICAgICAgcC5yZW1vdmVDaGlsZChlbClcbiAgICAgIGVsc2Uge1xuICAgICAgICAvLyB0aGUgcmlvdC10YWcgYW5kIHRoZSBkYXRhLWlzIGF0dHJpYnV0ZXMgYXJlbid0IG5lZWRlZCBhbnltb3JlLCByZW1vdmUgdGhlbVxuICAgICAgICByZW1BdHRyKHAsIFJJT1RfVEFHX0lTKVxuICAgICAgICByZW1BdHRyKHAsIFJJT1RfVEFHKSAvLyB0aGlzIHdpbGwgYmUgcmVtb3ZlZCBpbiByaW90IDMuMC4wXG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fdmlydHMpIHtcbiAgICAgIGVhY2godGhpcy5fdmlydHMsIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgaWYgKHYucGFyZW50Tm9kZSkgdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHYpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHNlbGYudHJpZ2dlcigndW5tb3VudCcpXG4gICAgdG9nZ2xlKClcbiAgICBzZWxmLm9mZignKicpXG4gICAgc2VsZi5pc01vdW50ZWQgPSBmYWxzZVxuICAgIGRlbGV0ZSByb290Ll90YWdcblxuICB9KVxuXG4gIC8vIHByb3h5IGZ1bmN0aW9uIHRvIGJpbmQgdXBkYXRlc1xuICAvLyBkaXNwYXRjaGVkIGZyb20gYSBwYXJlbnQgdGFnXG4gIGZ1bmN0aW9uIG9uQ2hpbGRVcGRhdGUoZGF0YSkgeyBzZWxmLnVwZGF0ZShkYXRhLCB0cnVlKSB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xlKGlzTW91bnQpIHtcblxuICAgIC8vIG1vdW50L3VubW91bnQgY2hpbGRyZW5cbiAgICBlYWNoKGNoaWxkVGFncywgZnVuY3Rpb24oY2hpbGQpIHsgY2hpbGRbaXNNb3VudCA/ICdtb3VudCcgOiAndW5tb3VudCddKCkgfSlcblxuICAgIC8vIGxpc3Rlbi91bmxpc3RlbiBwYXJlbnQgKGV2ZW50cyBmbG93IG9uZSB3YXkgZnJvbSBwYXJlbnQgdG8gY2hpbGRyZW4pXG4gICAgaWYgKCFwYXJlbnQpIHJldHVyblxuICAgIHZhciBldnQgPSBpc01vdW50ID8gJ29uJyA6ICdvZmYnXG5cbiAgICAvLyB0aGUgbG9vcCB0YWdzIHdpbGwgYmUgYWx3YXlzIGluIHN5bmMgd2l0aCB0aGUgcGFyZW50IGF1dG9tYXRpY2FsbHlcbiAgICBpZiAoaXNMb29wKVxuICAgICAgcGFyZW50W2V2dF0oJ3VubW91bnQnLCBzZWxmLnVubW91bnQpXG4gICAgZWxzZSB7XG4gICAgICBwYXJlbnRbZXZ0XSgndXBkYXRlJywgb25DaGlsZFVwZGF0ZSlbZXZ0XSgndW5tb3VudCcsIHNlbGYudW5tb3VudClcbiAgICB9XG4gIH1cblxuXG4gIC8vIG5hbWVkIGVsZW1lbnRzIGF2YWlsYWJsZSBmb3IgZm5cbiAgcGFyc2VOYW1lZEVsZW1lbnRzKGRvbSwgdGhpcywgY2hpbGRUYWdzKVxuXG59XG4vKipcbiAqIEF0dGFjaCBhbiBldmVudCB0byBhIERPTSBub2RlXG4gKiBAcGFyYW0geyBTdHJpbmcgfSBuYW1lIC0gZXZlbnQgbmFtZVxuICogQHBhcmFtIHsgRnVuY3Rpb24gfSBoYW5kbGVyIC0gZXZlbnQgY2FsbGJhY2tcbiAqIEBwYXJhbSB7IE9iamVjdCB9IGRvbSAtIGRvbSBub2RlXG4gKiBAcGFyYW0geyBUYWcgfSB0YWcgLSB0YWcgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gc2V0RXZlbnRIYW5kbGVyKG5hbWUsIGhhbmRsZXIsIGRvbSwgdGFnKSB7XG5cbiAgZG9tW25hbWVdID0gZnVuY3Rpb24oZSkge1xuXG4gICAgdmFyIHB0YWcgPSB0YWcuX3BhcmVudCxcbiAgICAgIGl0ZW0gPSB0YWcuX2l0ZW0sXG4gICAgICBlbFxuXG4gICAgaWYgKCFpdGVtKVxuICAgICAgd2hpbGUgKHB0YWcgJiYgIWl0ZW0pIHtcbiAgICAgICAgaXRlbSA9IHB0YWcuX2l0ZW1cbiAgICAgICAgcHRhZyA9IHB0YWcuX3BhcmVudFxuICAgICAgfVxuXG4gICAgLy8gY3Jvc3MgYnJvd3NlciBldmVudCBmaXhcbiAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnRcblxuICAgIC8vIG92ZXJyaWRlIHRoZSBldmVudCBwcm9wZXJ0aWVzXG4gICAgaWYgKGlzV3JpdGFibGUoZSwgJ2N1cnJlbnRUYXJnZXQnKSkgZS5jdXJyZW50VGFyZ2V0ID0gZG9tXG4gICAgaWYgKGlzV3JpdGFibGUoZSwgJ3RhcmdldCcpKSBlLnRhcmdldCA9IGUuc3JjRWxlbWVudFxuICAgIGlmIChpc1dyaXRhYmxlKGUsICd3aGljaCcpKSBlLndoaWNoID0gZS5jaGFyQ29kZSB8fCBlLmtleUNvZGVcblxuICAgIGUuaXRlbSA9IGl0ZW1cblxuICAgIC8vIHByZXZlbnQgZGVmYXVsdCBiZWhhdmlvdXIgKGJ5IGRlZmF1bHQpXG4gICAgaWYgKGhhbmRsZXIuY2FsbCh0YWcsIGUpICE9PSB0cnVlICYmICEvcmFkaW98Y2hlY2svLnRlc3QoZG9tLnR5cGUpKSB7XG4gICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCkgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnJldHVyblZhbHVlID0gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoIWUucHJldmVudFVwZGF0ZSkge1xuICAgICAgZWwgPSBpdGVtID8gZ2V0SW1tZWRpYXRlQ3VzdG9tUGFyZW50VGFnKHB0YWcpIDogdGFnXG4gICAgICBlbC51cGRhdGUoKVxuICAgIH1cblxuICB9XG5cbn1cblxuXG4vKipcbiAqIEluc2VydCBhIERPTSBub2RlIHJlcGxhY2luZyBhbm90aGVyIG9uZSAodXNlZCBieSBpZi0gYXR0cmlidXRlKVxuICogQHBhcmFtICAgeyBPYmplY3QgfSByb290IC0gcGFyZW50IG5vZGVcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gbm9kZSAtIG5vZGUgcmVwbGFjZWRcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gYmVmb3JlIC0gbm9kZSBhZGRlZFxuICovXG5mdW5jdGlvbiBpbnNlcnRUbyhyb290LCBub2RlLCBiZWZvcmUpIHtcbiAgaWYgKCFyb290KSByZXR1cm5cbiAgcm9vdC5pbnNlcnRCZWZvcmUoYmVmb3JlLCBub2RlKVxuICByb290LnJlbW92ZUNoaWxkKG5vZGUpXG59XG5cbi8qKlxuICogVXBkYXRlIHRoZSBleHByZXNzaW9ucyBpbiBhIFRhZyBpbnN0YW5jZVxuICogQHBhcmFtICAgeyBBcnJheSB9IGV4cHJlc3Npb25zIC0gZXhwcmVzc2lvbiB0aGF0IG11c3QgYmUgcmUgZXZhbHVhdGVkXG4gKiBAcGFyYW0gICB7IFRhZyB9IHRhZyAtIHRhZyBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiB1cGRhdGUoZXhwcmVzc2lvbnMsIHRhZykge1xuXG4gIGVhY2goZXhwcmVzc2lvbnMsIGZ1bmN0aW9uKGV4cHIsIGkpIHtcblxuICAgIHZhciBkb20gPSBleHByLmRvbSxcbiAgICAgIGF0dHJOYW1lID0gZXhwci5hdHRyLFxuICAgICAgdmFsdWUgPSB0bXBsKGV4cHIuZXhwciwgdGFnKSxcbiAgICAgIHBhcmVudCA9IGV4cHIucGFyZW50IHx8IGV4cHIuZG9tLnBhcmVudE5vZGVcblxuICAgIGlmIChleHByLmJvb2wpIHtcbiAgICAgIHZhbHVlID0gISF2YWx1ZVxuICAgIH0gZWxzZSBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgdmFsdWUgPSAnJ1xuICAgIH1cblxuICAgIC8vICMxNjM4OiByZWdyZXNzaW9uIG9mICMxNjEyLCB1cGRhdGUgdGhlIGRvbSBvbmx5IGlmIHRoZSB2YWx1ZSBvZiB0aGVcbiAgICAvLyBleHByZXNzaW9uIHdhcyBjaGFuZ2VkXG4gICAgaWYgKGV4cHIudmFsdWUgPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgZXhwci52YWx1ZSA9IHZhbHVlXG5cbiAgICAvLyB0ZXh0YXJlYSBhbmQgdGV4dCBub2RlcyBoYXMgbm8gYXR0cmlidXRlIG5hbWVcbiAgICBpZiAoIWF0dHJOYW1lKSB7XG4gICAgICAvLyBhYm91dCAjODE1IHcvbyByZXBsYWNlOiB0aGUgYnJvd3NlciBjb252ZXJ0cyB0aGUgdmFsdWUgdG8gYSBzdHJpbmcsXG4gICAgICAvLyB0aGUgY29tcGFyaXNvbiBieSBcIj09XCIgZG9lcyB0b28sIGJ1dCBub3QgaW4gdGhlIHNlcnZlclxuICAgICAgdmFsdWUgKz0gJydcbiAgICAgIC8vIHRlc3QgZm9yIHBhcmVudCBhdm9pZHMgZXJyb3Igd2l0aCBpbnZhbGlkIGFzc2lnbm1lbnQgdG8gbm9kZVZhbHVlXG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIC8vIGNhY2hlIHRoZSBwYXJlbnQgbm9kZSBiZWNhdXNlIHNvbWVob3cgaXQgd2lsbCBiZWNvbWUgbnVsbCBvbiBJRVxuICAgICAgICAvLyBvbiB0aGUgbmV4dCBpdGVyYXRpb25cbiAgICAgICAgZXhwci5wYXJlbnQgPSBwYXJlbnRcbiAgICAgICAgaWYgKHBhcmVudC50YWdOYW1lID09PSAnVEVYVEFSRUEnKSB7XG4gICAgICAgICAgcGFyZW50LnZhbHVlID0gdmFsdWUgICAgICAgICAgICAgICAgICAgIC8vICMxMTEzXG4gICAgICAgICAgaWYgKCFJRV9WRVJTSU9OKSBkb20ubm9kZVZhbHVlID0gdmFsdWUgIC8vICMxNjI1IElFIHRocm93cyBoZXJlLCBub2RlVmFsdWVcbiAgICAgICAgfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2lsbCBiZSBhdmFpbGFibGUgb24gJ3VwZGF0ZWQnXG4gICAgICAgIGVsc2UgZG9tLm5vZGVWYWx1ZSA9IHZhbHVlXG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyB+fiMxNjEyOiBsb29rIGZvciBjaGFuZ2VzIGluIGRvbS52YWx1ZSB3aGVuIHVwZGF0aW5nIHRoZSB2YWx1ZX5+XG4gICAgaWYgKGF0dHJOYW1lID09PSAndmFsdWUnKSB7XG4gICAgICBpZiAoZG9tLnZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICBkb20udmFsdWUgPSB2YWx1ZVxuICAgICAgICBzZXRBdHRyKGRvbSwgYXR0ck5hbWUsIHZhbHVlKVxuICAgICAgfVxuICAgICAgcmV0dXJuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHJlbW92ZSBvcmlnaW5hbCBhdHRyaWJ1dGVcbiAgICAgIHJlbUF0dHIoZG9tLCBhdHRyTmFtZSlcbiAgICB9XG5cbiAgICAvLyBldmVudCBoYW5kbGVyXG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICBzZXRFdmVudEhhbmRsZXIoYXR0ck5hbWUsIHZhbHVlLCBkb20sIHRhZylcblxuICAgIC8vIGlmLSBjb25kaXRpb25hbFxuICAgIH0gZWxzZSBpZiAoYXR0ck5hbWUgPT0gJ2lmJykge1xuICAgICAgdmFyIHN0dWIgPSBleHByLnN0dWIsXG4gICAgICAgIGFkZCA9IGZ1bmN0aW9uKCkgeyBpbnNlcnRUbyhzdHViLnBhcmVudE5vZGUsIHN0dWIsIGRvbSkgfSxcbiAgICAgICAgcmVtb3ZlID0gZnVuY3Rpb24oKSB7IGluc2VydFRvKGRvbS5wYXJlbnROb2RlLCBkb20sIHN0dWIpIH1cblxuICAgICAgLy8gYWRkIHRvIERPTVxuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIGlmIChzdHViKSB7XG4gICAgICAgICAgYWRkKClcbiAgICAgICAgICBkb20uaW5TdHViID0gZmFsc2VcbiAgICAgICAgICAvLyBhdm9pZCB0byB0cmlnZ2VyIHRoZSBtb3VudCBldmVudCBpZiB0aGUgdGFncyBpcyBub3QgdmlzaWJsZSB5ZXRcbiAgICAgICAgICAvLyBtYXliZSB3ZSBjYW4gb3B0aW1pemUgdGhpcyBhdm9pZGluZyB0byBtb3VudCB0aGUgdGFnIGF0IGFsbFxuICAgICAgICAgIGlmICghaXNJblN0dWIoZG9tKSkge1xuICAgICAgICAgICAgd2Fsayhkb20sIGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICAgIGlmIChlbC5fdGFnICYmICFlbC5fdGFnLmlzTW91bnRlZClcbiAgICAgICAgICAgICAgICBlbC5fdGFnLmlzTW91bnRlZCA9ICEhZWwuX3RhZy50cmlnZ2VyKCdtb3VudCcpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgLy8gcmVtb3ZlIGZyb20gRE9NXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHViID0gZXhwci5zdHViID0gc3R1YiB8fCBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJylcbiAgICAgICAgLy8gaWYgdGhlIHBhcmVudE5vZGUgaXMgZGVmaW5lZCB3ZSBjYW4gZWFzaWx5IHJlcGxhY2UgdGhlIHRhZ1xuICAgICAgICBpZiAoZG9tLnBhcmVudE5vZGUpXG4gICAgICAgICAgcmVtb3ZlKClcbiAgICAgICAgLy8gb3RoZXJ3aXNlIHdlIG5lZWQgdG8gd2FpdCB0aGUgdXBkYXRlZCBldmVudFxuICAgICAgICBlbHNlICh0YWcucGFyZW50IHx8IHRhZykub25lKCd1cGRhdGVkJywgcmVtb3ZlKVxuXG4gICAgICAgIGRvbS5pblN0dWIgPSB0cnVlXG4gICAgICB9XG4gICAgLy8gc2hvdyAvIGhpZGVcbiAgICB9IGVsc2UgaWYgKGF0dHJOYW1lID09PSAnc2hvdycpIHtcbiAgICAgIGRvbS5zdHlsZS5kaXNwbGF5ID0gdmFsdWUgPyAnJyA6ICdub25lJ1xuXG4gICAgfSBlbHNlIGlmIChhdHRyTmFtZSA9PT0gJ2hpZGUnKSB7XG4gICAgICBkb20uc3R5bGUuZGlzcGxheSA9IHZhbHVlID8gJ25vbmUnIDogJydcblxuICAgIH0gZWxzZSBpZiAoZXhwci5ib29sKSB7XG4gICAgICBkb21bYXR0ck5hbWVdID0gdmFsdWVcbiAgICAgIGlmICh2YWx1ZSkgc2V0QXR0cihkb20sIGF0dHJOYW1lLCBhdHRyTmFtZSlcbiAgICAgIGlmIChGSVJFRk9YICYmIGF0dHJOYW1lID09PSAnc2VsZWN0ZWQnICYmIGRvbS50YWdOYW1lID09PSAnT1BUSU9OJykge1xuICAgICAgICBkb20uX19yaW90MTM3NCA9IHZhbHVlICAgLy8gIzEzNzRcbiAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IDAgfHwgdmFsdWUgJiYgdHlwZW9mIHZhbHVlICE9PSBUX09CSkVDVCkge1xuICAgICAgLy8gPGltZyBzcmM9XCJ7IGV4cHIgfVwiPlxuICAgICAgaWYgKHN0YXJ0c1dpdGgoYXR0ck5hbWUsIFJJT1RfUFJFRklYKSAmJiBhdHRyTmFtZSAhPSBSSU9UX1RBRykge1xuICAgICAgICBhdHRyTmFtZSA9IGF0dHJOYW1lLnNsaWNlKFJJT1RfUFJFRklYLmxlbmd0aClcbiAgICAgIH1cbiAgICAgIHNldEF0dHIoZG9tLCBhdHRyTmFtZSwgdmFsdWUpXG4gICAgfVxuXG4gIH0pXG5cbn1cbi8qKlxuICogU3BlY2lhbGl6ZWQgZnVuY3Rpb24gZm9yIGxvb3BpbmcgYW4gYXJyYXktbGlrZSBjb2xsZWN0aW9uIHdpdGggYGVhY2g9e31gXG4gKiBAcGFyYW0gICB7IEFycmF5IH0gZWxzIC0gY29sbGVjdGlvbiBvZiBpdGVtc1xuICogQHBhcmFtICAge0Z1bmN0aW9ufSBmbiAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7IEFycmF5IH0gdGhlIGFycmF5IGxvb3BlZFxuICovXG5mdW5jdGlvbiBlYWNoKGVscywgZm4pIHtcbiAgdmFyIGxlbiA9IGVscyA/IGVscy5sZW5ndGggOiAwXG5cbiAgZm9yICh2YXIgaSA9IDAsIGVsOyBpIDwgbGVuOyBpKyspIHtcbiAgICBlbCA9IGVsc1tpXVxuICAgIC8vIHJldHVybiBmYWxzZSAtPiBjdXJyZW50IGl0ZW0gd2FzIHJlbW92ZWQgYnkgZm4gZHVyaW5nIHRoZSBsb29wXG4gICAgaWYgKGVsICE9IG51bGwgJiYgZm4oZWwsIGkpID09PSBmYWxzZSkgaS0tXG4gIH1cbiAgcmV0dXJuIGVsc1xufVxuXG4vKipcbiAqIERldGVjdCBpZiB0aGUgYXJndW1lbnQgcGFzc2VkIGlzIGEgZnVuY3Rpb25cbiAqIEBwYXJhbSAgIHsgKiB9IHYgLSB3aGF0ZXZlciB5b3Ugd2FudCB0byBwYXNzIHRvIHRoaXMgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2KSB7XG4gIHJldHVybiB0eXBlb2YgdiA9PT0gVF9GVU5DVElPTiB8fCBmYWxzZSAgIC8vIGF2b2lkIElFIHByb2JsZW1zXG59XG5cbi8qKlxuICogR2V0IHRoZSBvdXRlciBodG1sIG9mIGFueSBET00gbm9kZSBTVkdzIGluY2x1ZGVkXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGVsIC0gRE9NIG5vZGUgdG8gcGFyc2VcbiAqIEByZXR1cm5zIHsgU3RyaW5nIH0gZWwub3V0ZXJIVE1MXG4gKi9cbmZ1bmN0aW9uIGdldE91dGVySFRNTChlbCkge1xuICBpZiAoZWwub3V0ZXJIVE1MKSByZXR1cm4gZWwub3V0ZXJIVE1MXG4gIC8vIHNvbWUgYnJvd3NlcnMgZG8gbm90IHN1cHBvcnQgb3V0ZXJIVE1MIG9uIHRoZSBTVkdzIHRhZ3NcbiAgZWxzZSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IG1rRWwoJ2RpdicpXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGVsLmNsb25lTm9kZSh0cnVlKSlcbiAgICByZXR1cm4gY29udGFpbmVyLmlubmVySFRNTFxuICB9XG59XG5cbi8qKlxuICogU2V0IHRoZSBpbm5lciBodG1sIG9mIGFueSBET00gbm9kZSBTVkdzIGluY2x1ZGVkXG4gKiBAcGFyYW0geyBPYmplY3QgfSBjb250YWluZXIgLSBET00gbm9kZSB3aGVyZSB3ZSB3aWxsIGluamVjdCB0aGUgbmV3IGh0bWxcbiAqIEBwYXJhbSB7IFN0cmluZyB9IGh0bWwgLSBodG1sIHRvIGluamVjdFxuICovXG5mdW5jdGlvbiBzZXRJbm5lckhUTUwoY29udGFpbmVyLCBodG1sKSB7XG4gIGlmICh0eXBlb2YgY29udGFpbmVyLmlubmVySFRNTCAhPSBUX1VOREVGKSBjb250YWluZXIuaW5uZXJIVE1MID0gaHRtbFxuICAvLyBzb21lIGJyb3dzZXJzIGRvIG5vdCBzdXBwb3J0IGlubmVySFRNTCBvbiB0aGUgU1ZHcyB0YWdzXG4gIGVsc2Uge1xuICAgIHZhciBkb2MgPSBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKGh0bWwsICdhcHBsaWNhdGlvbi94bWwnKVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChcbiAgICAgIGNvbnRhaW5lci5vd25lckRvY3VtZW50LmltcG9ydE5vZGUoZG9jLmRvY3VtZW50RWxlbWVudCwgdHJ1ZSlcbiAgICApXG4gIH1cbn1cblxuLyoqXG4gKiBDaGVja3Mgd2V0aGVyIGEgRE9NIG5vZGUgbXVzdCBiZSBjb25zaWRlcmVkIHBhcnQgb2YgYW4gc3ZnIGRvY3VtZW50XG4gKiBAcGFyYW0gICB7IFN0cmluZyB9ICBuYW1lIC0gdGFnIG5hbWVcbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZnVuY3Rpb24gaXNTVkdUYWcobmFtZSkge1xuICByZXR1cm4gflNWR19UQUdTX0xJU1QuaW5kZXhPZihuYW1lKVxufVxuXG4vKipcbiAqIERldGVjdCBpZiB0aGUgYXJndW1lbnQgcGFzc2VkIGlzIGFuIG9iamVjdCwgZXhjbHVkZSBudWxsLlxuICogTk9URTogVXNlIGlzT2JqZWN0KHgpICYmICFpc0FycmF5KHgpIHRvIGV4Y2x1ZGVzIGFycmF5cy5cbiAqIEBwYXJhbSAgIHsgKiB9IHYgLSB3aGF0ZXZlciB5b3Ugd2FudCB0byBwYXNzIHRvIHRoaXMgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZnVuY3Rpb24gaXNPYmplY3Qodikge1xuICByZXR1cm4gdiAmJiB0eXBlb2YgdiA9PT0gVF9PQkpFQ1QgICAgICAgICAvLyB0eXBlb2YgbnVsbCBpcyAnb2JqZWN0J1xufVxuXG4vKipcbiAqIFJlbW92ZSBhbnkgRE9NIGF0dHJpYnV0ZSBmcm9tIGEgbm9kZVxuICogQHBhcmFtICAgeyBPYmplY3QgfSBkb20gLSBET00gbm9kZSB3ZSB3YW50IHRvIHVwZGF0ZVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBuYW1lIC0gbmFtZSBvZiB0aGUgcHJvcGVydHkgd2Ugd2FudCB0byByZW1vdmVcbiAqL1xuZnVuY3Rpb24gcmVtQXR0cihkb20sIG5hbWUpIHtcbiAgZG9tLnJlbW92ZUF0dHJpYnV0ZShuYW1lKVxufVxuXG4vKipcbiAqIENvbnZlcnQgYSBzdHJpbmcgY29udGFpbmluZyBkYXNoZXMgdG8gY2FtZWwgY2FzZVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBzdHJpbmcgLSBpbnB1dCBzdHJpbmdcbiAqIEByZXR1cm5zIHsgU3RyaW5nIH0gbXktc3RyaW5nIC0+IG15U3RyaW5nXG4gKi9cbmZ1bmN0aW9uIHRvQ2FtZWwoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZSgvLShcXHcpL2csIGZ1bmN0aW9uKF8sIGMpIHtcbiAgICByZXR1cm4gYy50b1VwcGVyQ2FzZSgpXG4gIH0pXG59XG5cbi8qKlxuICogR2V0IHRoZSB2YWx1ZSBvZiBhbnkgRE9NIGF0dHJpYnV0ZSBvbiBhIG5vZGVcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gZG9tIC0gRE9NIG5vZGUgd2Ugd2FudCB0byBwYXJzZVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBuYW1lIC0gbmFtZSBvZiB0aGUgYXR0cmlidXRlIHdlIHdhbnQgdG8gZ2V0XG4gKiBAcmV0dXJucyB7IFN0cmluZyB8IHVuZGVmaW5lZCB9IG5hbWUgb2YgdGhlIG5vZGUgYXR0cmlidXRlIHdoZXRoZXIgaXQgZXhpc3RzXG4gKi9cbmZ1bmN0aW9uIGdldEF0dHIoZG9tLCBuYW1lKSB7XG4gIHJldHVybiBkb20uZ2V0QXR0cmlidXRlKG5hbWUpXG59XG5cbi8qKlxuICogU2V0IGFueSBET00vU1ZHIGF0dHJpYnV0ZVxuICogQHBhcmFtIHsgT2JqZWN0IH0gZG9tIC0gRE9NIG5vZGUgd2Ugd2FudCB0byB1cGRhdGVcbiAqIEBwYXJhbSB7IFN0cmluZyB9IG5hbWUgLSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB3ZSB3YW50IHRvIHNldFxuICogQHBhcmFtIHsgU3RyaW5nIH0gdmFsIC0gdmFsdWUgb2YgdGhlIHByb3BlcnR5IHdlIHdhbnQgdG8gc2V0XG4gKi9cbmZ1bmN0aW9uIHNldEF0dHIoZG9tLCBuYW1lLCB2YWwpIHtcbiAgdmFyIHhsaW5rID0gWExJTktfUkVHRVguZXhlYyhuYW1lKVxuICBpZiAoeGxpbmsgJiYgeGxpbmtbMV0pXG4gICAgZG9tLnNldEF0dHJpYnV0ZU5TKFhMSU5LX05TLCB4bGlua1sxXSwgdmFsKVxuICBlbHNlXG4gICAgZG9tLnNldEF0dHJpYnV0ZShuYW1lLCB2YWwpXG59XG5cbi8qKlxuICogRGV0ZWN0IHRoZSB0YWcgaW1wbGVtZW50YXRpb24gYnkgYSBET00gbm9kZVxuICogQHBhcmFtICAgeyBPYmplY3QgfSBkb20gLSBET00gbm9kZSB3ZSBuZWVkIHRvIHBhcnNlIHRvIGdldCBpdHMgdGFnIGltcGxlbWVudGF0aW9uXG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IGl0IHJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGltcGxlbWVudGF0aW9uIG9mIGEgY3VzdG9tIHRhZyAodGVtcGxhdGUgYW5kIGJvb3QgZnVuY3Rpb24pXG4gKi9cbmZ1bmN0aW9uIGdldFRhZyhkb20pIHtcbiAgcmV0dXJuIGRvbS50YWdOYW1lICYmIF9fdGFnSW1wbFtnZXRBdHRyKGRvbSwgUklPVF9UQUdfSVMpIHx8XG4gICAgZ2V0QXR0cihkb20sIFJJT1RfVEFHKSB8fCBkb20udGFnTmFtZS50b0xvd2VyQ2FzZSgpXVxufVxuLyoqXG4gKiBBZGQgYSBjaGlsZCB0YWcgdG8gaXRzIHBhcmVudCBpbnRvIHRoZSBgdGFnc2Agb2JqZWN0XG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IHRhZyAtIGNoaWxkIHRhZyBpbnN0YW5jZVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSB0YWdOYW1lIC0ga2V5IHdoZXJlIHRoZSBuZXcgdGFnIHdpbGwgYmUgc3RvcmVkXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IHBhcmVudCAtIHRhZyBpbnN0YW5jZSB3aGVyZSB0aGUgbmV3IGNoaWxkIHRhZyB3aWxsIGJlIGluY2x1ZGVkXG4gKi9cbmZ1bmN0aW9uIGFkZENoaWxkVGFnKHRhZywgdGFnTmFtZSwgcGFyZW50KSB7XG4gIHZhciBjYWNoZWRUYWcgPSBwYXJlbnQudGFnc1t0YWdOYW1lXVxuXG4gIC8vIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBjaGlsZHJlbiB0YWdzIGhhdmluZyB0aGUgc2FtZSBuYW1lXG4gIGlmIChjYWNoZWRUYWcpIHtcbiAgICAvLyBpZiB0aGUgcGFyZW50IHRhZ3MgcHJvcGVydHkgaXMgbm90IHlldCBhbiBhcnJheVxuICAgIC8vIGNyZWF0ZSBpdCBhZGRpbmcgdGhlIGZpcnN0IGNhY2hlZCB0YWdcbiAgICBpZiAoIWlzQXJyYXkoY2FjaGVkVGFnKSlcbiAgICAgIC8vIGRvbid0IGFkZCB0aGUgc2FtZSB0YWcgdHdpY2VcbiAgICAgIGlmIChjYWNoZWRUYWcgIT09IHRhZylcbiAgICAgICAgcGFyZW50LnRhZ3NbdGFnTmFtZV0gPSBbY2FjaGVkVGFnXVxuICAgIC8vIGFkZCB0aGUgbmV3IG5lc3RlZCB0YWcgdG8gdGhlIGFycmF5XG4gICAgaWYgKCFjb250YWlucyhwYXJlbnQudGFnc1t0YWdOYW1lXSwgdGFnKSlcbiAgICAgIHBhcmVudC50YWdzW3RhZ05hbWVdLnB1c2godGFnKVxuICB9IGVsc2Uge1xuICAgIHBhcmVudC50YWdzW3RhZ05hbWVdID0gdGFnXG4gIH1cbn1cblxuLyoqXG4gKiBNb3ZlIHRoZSBwb3NpdGlvbiBvZiBhIGN1c3RvbSB0YWcgaW4gaXRzIHBhcmVudCB0YWdcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gdGFnIC0gY2hpbGQgdGFnIGluc3RhbmNlXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHRhZ05hbWUgLSBrZXkgd2hlcmUgdGhlIHRhZyB3YXMgc3RvcmVkXG4gKiBAcGFyYW0gICB7IE51bWJlciB9IG5ld1BvcyAtIGluZGV4IHdoZXJlIHRoZSBuZXcgdGFnIHdpbGwgYmUgc3RvcmVkXG4gKi9cbmZ1bmN0aW9uIG1vdmVDaGlsZFRhZyh0YWcsIHRhZ05hbWUsIG5ld1Bvcykge1xuICB2YXIgcGFyZW50ID0gdGFnLnBhcmVudCxcbiAgICB0YWdzXG4gIC8vIG5vIHBhcmVudCBubyBtb3ZlXG4gIGlmICghcGFyZW50KSByZXR1cm5cblxuICB0YWdzID0gcGFyZW50LnRhZ3NbdGFnTmFtZV1cblxuICBpZiAoaXNBcnJheSh0YWdzKSlcbiAgICB0YWdzLnNwbGljZShuZXdQb3MsIDAsIHRhZ3Muc3BsaWNlKHRhZ3MuaW5kZXhPZih0YWcpLCAxKVswXSlcbiAgZWxzZSBhZGRDaGlsZFRhZyh0YWcsIHRhZ05hbWUsIHBhcmVudClcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgY2hpbGQgdGFnIGluY2x1ZGluZyBpdCBjb3JyZWN0bHkgaW50byBpdHMgcGFyZW50XG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGNoaWxkIC0gY2hpbGQgdGFnIGltcGxlbWVudGF0aW9uXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IG9wdHMgLSB0YWcgb3B0aW9ucyBjb250YWluaW5nIHRoZSBET00gbm9kZSB3aGVyZSB0aGUgdGFnIHdpbGwgYmUgbW91bnRlZFxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBpbm5lckhUTUwgLSBpbm5lciBodG1sIG9mIHRoZSBjaGlsZCBub2RlXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IHBhcmVudCAtIGluc3RhbmNlIG9mIHRoZSBwYXJlbnQgdGFnIGluY2x1ZGluZyB0aGUgY2hpbGQgY3VzdG9tIHRhZ1xuICogQHJldHVybnMgeyBPYmplY3QgfSBpbnN0YW5jZSBvZiB0aGUgbmV3IGNoaWxkIHRhZyBqdXN0IGNyZWF0ZWRcbiAqL1xuZnVuY3Rpb24gaW5pdENoaWxkVGFnKGNoaWxkLCBvcHRzLCBpbm5lckhUTUwsIHBhcmVudCkge1xuICB2YXIgdGFnID0gbmV3IFRhZyhjaGlsZCwgb3B0cywgaW5uZXJIVE1MKSxcbiAgICB0YWdOYW1lID0gZ2V0VGFnTmFtZShvcHRzLnJvb3QpLFxuICAgIHB0YWcgPSBnZXRJbW1lZGlhdGVDdXN0b21QYXJlbnRUYWcocGFyZW50KVxuICAvLyBmaXggZm9yIHRoZSBwYXJlbnQgYXR0cmlidXRlIGluIHRoZSBsb29wZWQgZWxlbWVudHNcbiAgdGFnLnBhcmVudCA9IHB0YWdcbiAgLy8gc3RvcmUgdGhlIHJlYWwgcGFyZW50IHRhZ1xuICAvLyBpbiBzb21lIGNhc2VzIHRoaXMgY291bGQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGN1c3RvbSBwYXJlbnQgdGFnXG4gIC8vIGZvciBleGFtcGxlIGluIG5lc3RlZCBsb29wc1xuICB0YWcuX3BhcmVudCA9IHBhcmVudFxuXG4gIC8vIGFkZCB0aGlzIHRhZyB0byB0aGUgY3VzdG9tIHBhcmVudCB0YWdcbiAgYWRkQ2hpbGRUYWcodGFnLCB0YWdOYW1lLCBwdGFnKVxuICAvLyBhbmQgYWxzbyB0byB0aGUgcmVhbCBwYXJlbnQgdGFnXG4gIGlmIChwdGFnICE9PSBwYXJlbnQpXG4gICAgYWRkQ2hpbGRUYWcodGFnLCB0YWdOYW1lLCBwYXJlbnQpXG4gIC8vIGVtcHR5IHRoZSBjaGlsZCBub2RlIG9uY2Ugd2UgZ290IGl0cyB0ZW1wbGF0ZVxuICAvLyB0byBhdm9pZCB0aGF0IGl0cyBjaGlsZHJlbiBnZXQgY29tcGlsZWQgbXVsdGlwbGUgdGltZXNcbiAgb3B0cy5yb290LmlubmVySFRNTCA9ICcnXG5cbiAgcmV0dXJuIHRhZ1xufVxuXG4vKipcbiAqIExvb3AgYmFja3dhcmQgYWxsIHRoZSBwYXJlbnRzIHRyZWUgdG8gZGV0ZWN0IHRoZSBmaXJzdCBjdXN0b20gcGFyZW50IHRhZ1xuICogQHBhcmFtICAgeyBPYmplY3QgfSB0YWcgLSBhIFRhZyBpbnN0YW5jZVxuICogQHJldHVybnMgeyBPYmplY3QgfSB0aGUgaW5zdGFuY2Ugb2YgdGhlIGZpcnN0IGN1c3RvbSBwYXJlbnQgdGFnIGZvdW5kXG4gKi9cbmZ1bmN0aW9uIGdldEltbWVkaWF0ZUN1c3RvbVBhcmVudFRhZyh0YWcpIHtcbiAgdmFyIHB0YWcgPSB0YWdcbiAgd2hpbGUgKCFnZXRUYWcocHRhZy5yb290KSkge1xuICAgIGlmICghcHRhZy5wYXJlbnQpIGJyZWFrXG4gICAgcHRhZyA9IHB0YWcucGFyZW50XG4gIH1cbiAgcmV0dXJuIHB0YWdcbn1cblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gdG8gc2V0IGFuIGltbXV0YWJsZSBwcm9wZXJ0eVxuICogQHBhcmFtICAgeyBPYmplY3QgfSBlbCAtIG9iamVjdCB3aGVyZSB0aGUgbmV3IHByb3BlcnR5IHdpbGwgYmUgc2V0XG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IGtleSAtIG9iamVjdCBrZXkgd2hlcmUgdGhlIG5ldyBwcm9wZXJ0eSB3aWxsIGJlIHN0b3JlZFxuICogQHBhcmFtICAgeyAqIH0gdmFsdWUgLSB2YWx1ZSBvZiB0aGUgbmV3IHByb3BlcnR5XG4qIEBwYXJhbSAgIHsgT2JqZWN0IH0gb3B0aW9ucyAtIHNldCB0aGUgcHJvcGVyeSBvdmVycmlkaW5nIHRoZSBkZWZhdWx0IG9wdGlvbnNcbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gLSB0aGUgaW5pdGlhbCBvYmplY3RcbiAqL1xuZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoZWwsIGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsLCBrZXksIGV4dGVuZCh7XG4gICAgdmFsdWU6IHZhbHVlLFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSwgb3B0aW9ucykpXG4gIHJldHVybiBlbFxufVxuXG4vKipcbiAqIEdldCB0aGUgdGFnIG5hbWUgb2YgYW55IERPTSBub2RlXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGRvbSAtIERPTSBub2RlIHdlIHdhbnQgdG8gcGFyc2VcbiAqIEByZXR1cm5zIHsgU3RyaW5nIH0gbmFtZSB0byBpZGVudGlmeSB0aGlzIGRvbSBub2RlIGluIHJpb3RcbiAqL1xuZnVuY3Rpb24gZ2V0VGFnTmFtZShkb20pIHtcbiAgdmFyIGNoaWxkID0gZ2V0VGFnKGRvbSksXG4gICAgbmFtZWRUYWcgPSBnZXRBdHRyKGRvbSwgJ25hbWUnKSxcbiAgICB0YWdOYW1lID0gbmFtZWRUYWcgJiYgIXRtcGwuaGFzRXhwcihuYW1lZFRhZykgP1xuICAgICAgICAgICAgICAgIG5hbWVkVGFnIDpcbiAgICAgICAgICAgICAgY2hpbGQgPyBjaGlsZC5uYW1lIDogZG9tLnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuXG4gIHJldHVybiB0YWdOYW1lXG59XG5cbi8qKlxuICogRXh0ZW5kIGFueSBvYmplY3Qgd2l0aCBvdGhlciBwcm9wZXJ0aWVzXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IHNyYyAtIHNvdXJjZSBvYmplY3RcbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gdGhlIHJlc3VsdGluZyBleHRlbmRlZCBvYmplY3RcbiAqXG4gKiB2YXIgb2JqID0geyBmb286ICdiYXonIH1cbiAqIGV4dGVuZChvYmosIHtiYXI6ICdiYXInLCBmb286ICdiYXInfSlcbiAqIGNvbnNvbGUubG9nKG9iaikgPT4ge2JhcjogJ2JhcicsIGZvbzogJ2Jhcid9XG4gKlxuICovXG5mdW5jdGlvbiBleHRlbmQoc3JjKSB7XG4gIHZhciBvYmosIGFyZ3MgPSBhcmd1bWVudHNcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmdzLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKG9iaiA9IGFyZ3NbaV0pIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgLy8gY2hlY2sgaWYgdGhpcyBwcm9wZXJ0eSBvZiB0aGUgc291cmNlIG9iamVjdCBjb3VsZCBiZSBvdmVycmlkZGVuXG4gICAgICAgIGlmIChpc1dyaXRhYmxlKHNyYywga2V5KSlcbiAgICAgICAgICBzcmNba2V5XSA9IG9ialtrZXldXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBzcmNcbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIGFuIGFycmF5IGNvbnRhaW5zIGFuIGl0ZW1cbiAqIEBwYXJhbSAgIHsgQXJyYXkgfSBhcnIgLSB0YXJnZXQgYXJyYXlcbiAqIEBwYXJhbSAgIHsgKiB9IGl0ZW0gLSBpdGVtIHRvIHRlc3RcbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IERvZXMgJ2FycicgY29udGFpbiAnaXRlbSc/XG4gKi9cbmZ1bmN0aW9uIGNvbnRhaW5zKGFyciwgaXRlbSkge1xuICByZXR1cm4gfmFyci5pbmRleE9mKGl0ZW0pXG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhbiBvYmplY3QgaXMgYSBraW5kIG9mIGFycmF5XG4gKiBAcGFyYW0gICB7ICogfSBhIC0gYW55dGhpbmdcbiAqIEByZXR1cm5zIHtCb29sZWFufSBpcyAnYScgYW4gYXJyYXk/XG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXkoYSkgeyByZXR1cm4gQXJyYXkuaXNBcnJheShhKSB8fCBhIGluc3RhbmNlb2YgQXJyYXkgfVxuXG4vKipcbiAqIERldGVjdCB3aGV0aGVyIGEgcHJvcGVydHkgb2YgYW4gb2JqZWN0IGNvdWxkIGJlIG92ZXJyaWRkZW5cbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gIG9iaiAtIHNvdXJjZSBvYmplY3RcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gIGtleSAtIG9iamVjdCBwcm9wZXJ0eVxuICogQHJldHVybnMgeyBCb29sZWFuIH0gaXMgdGhpcyBwcm9wZXJ0eSB3cml0YWJsZT9cbiAqL1xuZnVuY3Rpb24gaXNXcml0YWJsZShvYmosIGtleSkge1xuICB2YXIgcHJvcHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KVxuICByZXR1cm4gdHlwZW9mIG9ialtrZXldID09PSBUX1VOREVGIHx8IHByb3BzICYmIHByb3BzLndyaXRhYmxlXG59XG5cblxuLyoqXG4gKiBXaXRoIHRoaXMgZnVuY3Rpb24gd2UgYXZvaWQgdGhhdCB0aGUgaW50ZXJuYWwgVGFnIG1ldGhvZHMgZ2V0IG92ZXJyaWRkZW5cbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gZGF0YSAtIG9wdGlvbnMgd2Ugd2FudCB0byB1c2UgdG8gZXh0ZW5kIHRoZSB0YWcgaW5zdGFuY2VcbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gY2xlYW4gb2JqZWN0IHdpdGhvdXQgY29udGFpbmluZyB0aGUgcmlvdCBpbnRlcm5hbCByZXNlcnZlZCB3b3Jkc1xuICovXG5mdW5jdGlvbiBjbGVhblVwRGF0YShkYXRhKSB7XG4gIGlmICghKGRhdGEgaW5zdGFuY2VvZiBUYWcpICYmICEoZGF0YSAmJiB0eXBlb2YgZGF0YS50cmlnZ2VyID09IFRfRlVOQ1RJT04pKVxuICAgIHJldHVybiBkYXRhXG5cbiAgdmFyIG8gPSB7fVxuICBmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xuICAgIGlmICghUkVTRVJWRURfV09SRFNfQkxBQ0tMSVNULnRlc3Qoa2V5KSkgb1trZXldID0gZGF0YVtrZXldXG4gIH1cbiAgcmV0dXJuIG9cbn1cblxuLyoqXG4gKiBXYWxrIGRvd24gcmVjdXJzaXZlbHkgYWxsIHRoZSBjaGlsZHJlbiB0YWdzIHN0YXJ0aW5nIGRvbSBub2RlXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9ICAgZG9tIC0gc3RhcnRpbmcgbm9kZSB3aGVyZSB3ZSB3aWxsIHN0YXJ0IHRoZSByZWN1cnNpb25cbiAqIEBwYXJhbSAgIHsgRnVuY3Rpb24gfSBmbiAtIGNhbGxiYWNrIHRvIHRyYW5zZm9ybSB0aGUgY2hpbGQgbm9kZSBqdXN0IGZvdW5kXG4gKi9cbmZ1bmN0aW9uIHdhbGsoZG9tLCBmbikge1xuICBpZiAoZG9tKSB7XG4gICAgLy8gc3RvcCB0aGUgcmVjdXJzaW9uXG4gICAgaWYgKGZuKGRvbSkgPT09IGZhbHNlKSByZXR1cm5cbiAgICBlbHNlIHtcbiAgICAgIGRvbSA9IGRvbS5maXJzdENoaWxkXG5cbiAgICAgIHdoaWxlIChkb20pIHtcbiAgICAgICAgd2Fsayhkb20sIGZuKVxuICAgICAgICBkb20gPSBkb20ubmV4dFNpYmxpbmdcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBNaW5pbWl6ZSByaXNrOiBvbmx5IHplcm8gb3Igb25lIF9zcGFjZV8gYmV0d2VlbiBhdHRyICYgdmFsdWVcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICBodG1sIC0gaHRtbCBzdHJpbmcgd2Ugd2FudCB0byBwYXJzZVxuICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gYXBwbHkgb24gYW55IGF0dHJpYnV0ZSBmb3VuZFxuICovXG5mdW5jdGlvbiB3YWxrQXR0cmlidXRlcyhodG1sLCBmbikge1xuICB2YXIgbSxcbiAgICByZSA9IC8oWy1cXHddKykgPz0gPyg/OlwiKFteXCJdKil8JyhbXiddKil8KHtbXn1dKn0pKS9nXG5cbiAgd2hpbGUgKG0gPSByZS5leGVjKGh0bWwpKSB7XG4gICAgZm4obVsxXS50b0xvd2VyQ2FzZSgpLCBtWzJdIHx8IG1bM10gfHwgbVs0XSlcbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYSBET00gbm9kZSBpcyBpbiBzdHViIG1vZGUsIHVzZWZ1bCBmb3IgdGhlIHJpb3QgJ2lmJyBkaXJlY3RpdmVcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gIGRvbSAtIERPTSBub2RlIHdlIHdhbnQgdG8gcGFyc2VcbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZnVuY3Rpb24gaXNJblN0dWIoZG9tKSB7XG4gIHdoaWxlIChkb20pIHtcbiAgICBpZiAoZG9tLmluU3R1YikgcmV0dXJuIHRydWVcbiAgICBkb20gPSBkb20ucGFyZW50Tm9kZVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIENyZWF0ZSBhIGdlbmVyaWMgRE9NIG5vZGVcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gbmFtZSAtIG5hbWUgb2YgdGhlIERPTSBub2RlIHdlIHdhbnQgdG8gY3JlYXRlXG4gKiBAcGFyYW0gICB7IEJvb2xlYW4gfSBpc1N2ZyAtIHNob3VsZCB3ZSB1c2UgYSBTVkcgYXMgcGFyZW50IG5vZGU/XG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IERPTSBub2RlIGp1c3QgY3JlYXRlZFxuICovXG5mdW5jdGlvbiBta0VsKG5hbWUsIGlzU3ZnKSB7XG4gIHJldHVybiBpc1N2ZyA/XG4gICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKSA6XG4gICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKVxufVxuXG4vKipcbiAqIFNob3J0ZXIgYW5kIGZhc3Qgd2F5IHRvIHNlbGVjdCBtdWx0aXBsZSBub2RlcyBpbiB0aGUgRE9NXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHNlbGVjdG9yIC0gRE9NIHNlbGVjdG9yXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGN0eCAtIERPTSBub2RlIHdoZXJlIHRoZSB0YXJnZXRzIG9mIG91ciBzZWFyY2ggd2lsbCBpcyBsb2NhdGVkXG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IGRvbSBub2RlcyBmb3VuZFxuICovXG5mdW5jdGlvbiAkJChzZWxlY3RvciwgY3R4KSB7XG4gIHJldHVybiAoY3R4IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKVxufVxuXG4vKipcbiAqIFNob3J0ZXIgYW5kIGZhc3Qgd2F5IHRvIHNlbGVjdCBhIHNpbmdsZSBub2RlIGluIHRoZSBET01cbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gc2VsZWN0b3IgLSB1bmlxdWUgZG9tIHNlbGVjdG9yXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGN0eCAtIERPTSBub2RlIHdoZXJlIHRoZSB0YXJnZXQgb2Ygb3VyIHNlYXJjaCB3aWxsIGlzIGxvY2F0ZWRcbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZG9tIG5vZGUgZm91bmRcbiAqL1xuZnVuY3Rpb24gJChzZWxlY3RvciwgY3R4KSB7XG4gIHJldHVybiAoY3R4IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxufVxuXG4vKipcbiAqIFNpbXBsZSBvYmplY3QgcHJvdG90eXBhbCBpbmhlcml0YW5jZVxuICogQHBhcmFtICAgeyBPYmplY3QgfSBwYXJlbnQgLSBwYXJlbnQgb2JqZWN0XG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IGNoaWxkIGluc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIGluaGVyaXQocGFyZW50KSB7XG4gIHJldHVybiBPYmplY3QuY3JlYXRlKHBhcmVudCB8fCBudWxsKVxufVxuXG4vKipcbiAqIEdldCB0aGUgbmFtZSBwcm9wZXJ0eSBuZWVkZWQgdG8gaWRlbnRpZnkgYSBET00gbm9kZSBpbiByaW90XG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGRvbSAtIERPTSBub2RlIHdlIG5lZWQgdG8gcGFyc2VcbiAqIEByZXR1cm5zIHsgU3RyaW5nIHwgdW5kZWZpbmVkIH0gZ2l2ZSB1cyBiYWNrIGEgc3RyaW5nIHRvIGlkZW50aWZ5IHRoaXMgZG9tIG5vZGVcbiAqL1xuZnVuY3Rpb24gZ2V0TmFtZWRLZXkoZG9tKSB7XG4gIHJldHVybiBnZXRBdHRyKGRvbSwgJ2lkJykgfHwgZ2V0QXR0cihkb20sICduYW1lJylcbn1cblxuLyoqXG4gKiBTZXQgdGhlIG5hbWVkIHByb3BlcnRpZXMgb2YgYSB0YWcgZWxlbWVudFxuICogQHBhcmFtIHsgT2JqZWN0IH0gZG9tIC0gRE9NIG5vZGUgd2UgbmVlZCB0byBwYXJzZVxuICogQHBhcmFtIHsgT2JqZWN0IH0gcGFyZW50IC0gdGFnIGluc3RhbmNlIHdoZXJlIHRoZSBuYW1lZCBkb20gZWxlbWVudCB3aWxsIGJlIGV2ZW50dWFsbHkgYWRkZWRcbiAqIEBwYXJhbSB7IEFycmF5IH0ga2V5cyAtIGxpc3Qgb2YgYWxsIHRoZSB0YWcgaW5zdGFuY2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBzZXROYW1lZChkb20sIHBhcmVudCwga2V5cykge1xuICAvLyBnZXQgdGhlIGtleSB2YWx1ZSB3ZSB3YW50IHRvIGFkZCB0byB0aGUgdGFnIGluc3RhbmNlXG4gIHZhciBrZXkgPSBnZXROYW1lZEtleShkb20pLFxuICAgIGlzQXJyLFxuICAgIC8vIGFkZCB0aGUgbm9kZSBkZXRlY3RlZCB0byBhIHRhZyBpbnN0YW5jZSB1c2luZyB0aGUgbmFtZWQgcHJvcGVydHlcbiAgICBhZGQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgLy8gYXZvaWQgdG8gb3ZlcnJpZGUgdGhlIHRhZyBwcm9wZXJ0aWVzIGFscmVhZHkgc2V0XG4gICAgICBpZiAoY29udGFpbnMoa2V5cywga2V5KSkgcmV0dXJuXG4gICAgICAvLyBjaGVjayB3aGV0aGVyIHRoaXMgdmFsdWUgaXMgYW4gYXJyYXlcbiAgICAgIGlzQXJyID0gaXNBcnJheSh2YWx1ZSlcbiAgICAgIC8vIGlmIHRoZSBrZXkgd2FzIG5ldmVyIHNldFxuICAgICAgaWYgKCF2YWx1ZSlcbiAgICAgICAgLy8gc2V0IGl0IG9uY2Ugb24gdGhlIHRhZyBpbnN0YW5jZVxuICAgICAgICBwYXJlbnRba2V5XSA9IGRvbVxuICAgICAgLy8gaWYgaXQgd2FzIGFuIGFycmF5IGFuZCBub3QgeWV0IHNldFxuICAgICAgZWxzZSBpZiAoIWlzQXJyIHx8IGlzQXJyICYmICFjb250YWlucyh2YWx1ZSwgZG9tKSkge1xuICAgICAgICAvLyBhZGQgdGhlIGRvbSBub2RlIGludG8gdGhlIGFycmF5XG4gICAgICAgIGlmIChpc0FycilcbiAgICAgICAgICB2YWx1ZS5wdXNoKGRvbSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBhcmVudFtrZXldID0gW3ZhbHVlLCBkb21dXG4gICAgICB9XG4gICAgfVxuXG4gIC8vIHNraXAgdGhlIGVsZW1lbnRzIHdpdGggbm8gbmFtZWQgcHJvcGVydGllc1xuICBpZiAoIWtleSkgcmV0dXJuXG5cbiAgLy8gY2hlY2sgd2hldGhlciB0aGlzIGtleSBoYXMgYmVlbiBhbHJlYWR5IGV2YWx1YXRlZFxuICBpZiAodG1wbC5oYXNFeHByKGtleSkpXG4gICAgLy8gd2FpdCB0aGUgZmlyc3QgdXBkYXRlZCBldmVudCBvbmx5IG9uY2VcbiAgICBwYXJlbnQub25lKCdtb3VudCcsIGZ1bmN0aW9uKCkge1xuICAgICAga2V5ID0gZ2V0TmFtZWRLZXkoZG9tKVxuICAgICAgYWRkKHBhcmVudFtrZXldKVxuICAgIH0pXG4gIGVsc2VcbiAgICBhZGQocGFyZW50W2tleV0pXG5cbn1cblxuLyoqXG4gKiBGYXN0ZXIgU3RyaW5nIHN0YXJ0c1dpdGggYWx0ZXJuYXRpdmVcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gc3JjIC0gc291cmNlIHN0cmluZ1xuICogQHBhcmFtICAgeyBTdHJpbmcgfSBzdHIgLSB0ZXN0IHN0cmluZ1xuICogQHJldHVybnMgeyBCb29sZWFuIH0gLVxuICovXG5mdW5jdGlvbiBzdGFydHNXaXRoKHNyYywgc3RyKSB7XG4gIHJldHVybiBzcmMuc2xpY2UoMCwgc3RyLmxlbmd0aCkgPT09IHN0clxufVxuXG4vKipcbiAqIHJlcXVlc3RBbmltYXRpb25GcmFtZSBmdW5jdGlvblxuICogQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC8xNTc5NjcxLCBsaWNlbnNlIE1JVFxuICovXG52YXIgckFGID0gKGZ1bmN0aW9uICh3KSB7XG4gIHZhciByYWYgPSB3LnJlcXVlc3RBbmltYXRpb25GcmFtZSAgICB8fFxuICAgICAgICAgICAgdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcblxuICBpZiAoIXJhZiB8fCAvaVAoYWR8aG9uZXxvZCkuKk9TIDYvLnRlc3Qody5uYXZpZ2F0b3IudXNlckFnZW50KSkgeyAgLy8gYnVnZ3kgaU9TNlxuICAgIHZhciBsYXN0VGltZSA9IDBcblxuICAgIHJhZiA9IGZ1bmN0aW9uIChjYikge1xuICAgICAgdmFyIG5vd3RpbWUgPSBEYXRlLm5vdygpLCB0aW1lb3V0ID0gTWF0aC5tYXgoMTYgLSAobm93dGltZSAtIGxhc3RUaW1lKSwgMClcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjYihsYXN0VGltZSA9IG5vd3RpbWUgKyB0aW1lb3V0KSB9LCB0aW1lb3V0KVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmFmXG5cbn0pKHdpbmRvdyB8fCB7fSlcblxuLyoqXG4gKiBNb3VudCBhIHRhZyBjcmVhdGluZyBuZXcgVGFnIGluc3RhbmNlXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IHJvb3QgLSBkb20gbm9kZSB3aGVyZSB0aGUgdGFnIHdpbGwgYmUgbW91bnRlZFxuICogQHBhcmFtICAgeyBTdHJpbmcgfSB0YWdOYW1lIC0gbmFtZSBvZiB0aGUgcmlvdCB0YWcgd2Ugd2FudCB0byBtb3VudFxuICogQHBhcmFtICAgeyBPYmplY3QgfSBvcHRzIC0gb3B0aW9ucyB0byBwYXNzIHRvIHRoZSBUYWcgaW5zdGFuY2VcbiAqIEByZXR1cm5zIHsgVGFnIH0gYSBuZXcgVGFnIGluc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIG1vdW50VG8ocm9vdCwgdGFnTmFtZSwgb3B0cykge1xuICB2YXIgdGFnID0gX190YWdJbXBsW3RhZ05hbWVdLFxuICAgIC8vIGNhY2hlIHRoZSBpbm5lciBIVE1MIHRvIGZpeCAjODU1XG4gICAgaW5uZXJIVE1MID0gcm9vdC5faW5uZXJIVE1MID0gcm9vdC5faW5uZXJIVE1MIHx8IHJvb3QuaW5uZXJIVE1MXG5cbiAgLy8gY2xlYXIgdGhlIGlubmVyIGh0bWxcbiAgcm9vdC5pbm5lckhUTUwgPSAnJ1xuXG4gIGlmICh0YWcgJiYgcm9vdCkgdGFnID0gbmV3IFRhZyh0YWcsIHsgcm9vdDogcm9vdCwgb3B0czogb3B0cyB9LCBpbm5lckhUTUwpXG5cbiAgaWYgKHRhZyAmJiB0YWcubW91bnQpIHtcbiAgICB0YWcubW91bnQoKVxuICAgIC8vIGFkZCB0aGlzIHRhZyB0byB0aGUgdmlydHVhbERvbSB2YXJpYWJsZVxuICAgIGlmICghY29udGFpbnMoX192aXJ0dWFsRG9tLCB0YWcpKSBfX3ZpcnR1YWxEb20ucHVzaCh0YWcpXG4gIH1cblxuICByZXR1cm4gdGFnXG59XG4vKipcbiAqIFJpb3QgcHVibGljIGFwaVxuICovXG5cbi8vIHNoYXJlIG1ldGhvZHMgZm9yIG90aGVyIHJpb3QgcGFydHMsIGUuZy4gY29tcGlsZXJcbnJpb3QudXRpbCA9IHsgYnJhY2tldHM6IGJyYWNrZXRzLCB0bXBsOiB0bXBsIH1cblxuLyoqXG4gKiBDcmVhdGUgYSBtaXhpbiB0aGF0IGNvdWxkIGJlIGdsb2JhbGx5IHNoYXJlZCBhY3Jvc3MgYWxsIHRoZSB0YWdzXG4gKi9cbnJpb3QubWl4aW4gPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBtaXhpbnMgPSB7fSxcbiAgICBnbG9iYWxzID0gbWl4aW5zW0dMT0JBTF9NSVhJTl0gPSB7fSxcbiAgICBfaWQgPSAwXG5cbiAgLyoqXG4gICAqIENyZWF0ZS9SZXR1cm4gYSBtaXhpbiBieSBpdHMgbmFtZVxuICAgKiBAcGFyYW0gICB7IFN0cmluZyB9ICBuYW1lIC0gbWl4aW4gbmFtZSAoZ2xvYmFsIG1peGluIGlmIG9iamVjdClcbiAgICogQHBhcmFtICAgeyBPYmplY3QgfSAgbWl4aW4gLSBtaXhpbiBsb2dpY1xuICAgKiBAcGFyYW0gICB7IEJvb2xlYW4gfSBnIC0gaXMgZ2xvYmFsP1xuICAgKiBAcmV0dXJucyB7IE9iamVjdCB9ICB0aGUgbWl4aW4gbG9naWNcbiAgICovXG4gIHJldHVybiBmdW5jdGlvbihuYW1lLCBtaXhpbiwgZykge1xuICAgIC8vIFVubmFtZWQgZ2xvYmFsXG4gICAgaWYgKGlzT2JqZWN0KG5hbWUpKSB7XG4gICAgICByaW90Lm1peGluKCdfX3VubmFtZWRfJytfaWQrKywgbmFtZSwgdHJ1ZSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHZhciBzdG9yZSA9IGcgPyBnbG9iYWxzIDogbWl4aW5zXG5cbiAgICAvLyBHZXR0ZXJcbiAgICBpZiAoIW1peGluKSB7XG4gICAgICBpZiAodHlwZW9mIHN0b3JlW25hbWVdID09PSBUX1VOREVGKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5yZWdpc3RlcmVkIG1peGluOiAnICsgbmFtZSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdG9yZVtuYW1lXVxuICAgIH1cbiAgICAvLyBTZXR0ZXJcbiAgICBpZiAoaXNGdW5jdGlvbihtaXhpbikpIHtcbiAgICAgIGV4dGVuZChtaXhpbi5wcm90b3R5cGUsIHN0b3JlW25hbWVdIHx8IHt9KVxuICAgICAgc3RvcmVbbmFtZV0gPSBtaXhpblxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHN0b3JlW25hbWVdID0gZXh0ZW5kKHN0b3JlW25hbWVdIHx8IHt9LCBtaXhpbilcbiAgICB9XG4gIH1cblxufSkoKVxuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyByaW90IHRhZyBpbXBsZW1lbnRhdGlvblxuICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIG5hbWUgLSBuYW1lL2lkIG9mIHRoZSBuZXcgcmlvdCB0YWdcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICBodG1sIC0gdGFnIHRlbXBsYXRlXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9ICAgY3NzIC0gY3VzdG9tIHRhZyBjc3NcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICBhdHRycyAtIHJvb3QgdGFnIGF0dHJpYnV0ZXNcbiAqIEBwYXJhbSAgIHsgRnVuY3Rpb24gfSBmbiAtIHVzZXIgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHsgU3RyaW5nIH0gbmFtZS9pZCBvZiB0aGUgdGFnIGp1c3QgY3JlYXRlZFxuICovXG5yaW90LnRhZyA9IGZ1bmN0aW9uKG5hbWUsIGh0bWwsIGNzcywgYXR0cnMsIGZuKSB7XG4gIGlmIChpc0Z1bmN0aW9uKGF0dHJzKSkge1xuICAgIGZuID0gYXR0cnNcbiAgICBpZiAoL15bXFx3XFwtXStcXHM/PS8udGVzdChjc3MpKSB7XG4gICAgICBhdHRycyA9IGNzc1xuICAgICAgY3NzID0gJydcbiAgICB9IGVsc2UgYXR0cnMgPSAnJ1xuICB9XG4gIGlmIChjc3MpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihjc3MpKSBmbiA9IGNzc1xuICAgIGVsc2Ugc3R5bGVNYW5hZ2VyLmFkZChjc3MpXG4gIH1cbiAgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKVxuICBfX3RhZ0ltcGxbbmFtZV0gPSB7IG5hbWU6IG5hbWUsIHRtcGw6IGh0bWwsIGF0dHJzOiBhdHRycywgZm46IGZuIH1cbiAgcmV0dXJuIG5hbWVcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgcmlvdCB0YWcgaW1wbGVtZW50YXRpb24gKGZvciB1c2UgYnkgdGhlIGNvbXBpbGVyKVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIG5hbWUgLSBuYW1lL2lkIG9mIHRoZSBuZXcgcmlvdCB0YWdcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICBodG1sIC0gdGFnIHRlbXBsYXRlXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9ICAgY3NzIC0gY3VzdG9tIHRhZyBjc3NcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICBhdHRycyAtIHJvb3QgdGFnIGF0dHJpYnV0ZXNcbiAqIEBwYXJhbSAgIHsgRnVuY3Rpb24gfSBmbiAtIHVzZXIgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHsgU3RyaW5nIH0gbmFtZS9pZCBvZiB0aGUgdGFnIGp1c3QgY3JlYXRlZFxuICovXG5yaW90LnRhZzIgPSBmdW5jdGlvbihuYW1lLCBodG1sLCBjc3MsIGF0dHJzLCBmbikge1xuICBpZiAoY3NzKSBzdHlsZU1hbmFnZXIuYWRkKGNzcylcbiAgLy9pZiAoYnBhaXIpIHJpb3Quc2V0dGluZ3MuYnJhY2tldHMgPSBicGFpclxuICBfX3RhZ0ltcGxbbmFtZV0gPSB7IG5hbWU6IG5hbWUsIHRtcGw6IGh0bWwsIGF0dHJzOiBhdHRycywgZm46IGZuIH1cbiAgcmV0dXJuIG5hbWVcbn1cblxuLyoqXG4gKiBNb3VudCBhIHRhZyB1c2luZyBhIHNwZWNpZmljIHRhZyBpbXBsZW1lbnRhdGlvblxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBzZWxlY3RvciAtIHRhZyBET00gc2VsZWN0b3JcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gdGFnTmFtZSAtIHRhZyBpbXBsZW1lbnRhdGlvbiBuYW1lXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IG9wdHMgLSB0YWcgbG9naWNcbiAqIEByZXR1cm5zIHsgQXJyYXkgfSBuZXcgdGFncyBpbnN0YW5jZXNcbiAqL1xucmlvdC5tb3VudCA9IGZ1bmN0aW9uKHNlbGVjdG9yLCB0YWdOYW1lLCBvcHRzKSB7XG5cbiAgdmFyIGVscyxcbiAgICBhbGxUYWdzLFxuICAgIHRhZ3MgPSBbXVxuXG4gIC8vIGhlbHBlciBmdW5jdGlvbnNcblxuICBmdW5jdGlvbiBhZGRSaW90VGFncyhhcnIpIHtcbiAgICB2YXIgbGlzdCA9ICcnXG4gICAgZWFjaChhcnIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoIS9bXi1cXHddLy50ZXN0KGUpKSB7XG4gICAgICAgIGUgPSBlLnRyaW0oKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxpc3QgKz0gJyxbJyArIFJJT1RfVEFHX0lTICsgJz1cIicgKyBlICsgJ1wiXSxbJyArIFJJT1RfVEFHICsgJz1cIicgKyBlICsgJ1wiXSdcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBsaXN0XG4gIH1cblxuICBmdW5jdGlvbiBzZWxlY3RBbGxUYWdzKCkge1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoX190YWdJbXBsKVxuICAgIHJldHVybiBrZXlzICsgYWRkUmlvdFRhZ3Moa2V5cylcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1c2hUYWdzKHJvb3QpIHtcbiAgICBpZiAocm9vdC50YWdOYW1lKSB7XG4gICAgICB2YXIgcmlvdFRhZyA9IGdldEF0dHIocm9vdCwgUklPVF9UQUdfSVMpIHx8IGdldEF0dHIocm9vdCwgUklPVF9UQUcpXG5cbiAgICAgIC8vIGhhdmUgdGFnTmFtZT8gZm9yY2UgcmlvdC10YWcgdG8gYmUgdGhlIHNhbWVcbiAgICAgIGlmICh0YWdOYW1lICYmIHJpb3RUYWcgIT09IHRhZ05hbWUpIHtcbiAgICAgICAgcmlvdFRhZyA9IHRhZ05hbWVcbiAgICAgICAgc2V0QXR0cihyb290LCBSSU9UX1RBR19JUywgdGFnTmFtZSlcbiAgICAgICAgc2V0QXR0cihyb290LCBSSU9UX1RBRywgdGFnTmFtZSkgLy8gdGhpcyB3aWxsIGJlIHJlbW92ZWQgaW4gcmlvdCAzLjAuMFxuICAgICAgfVxuICAgICAgdmFyIHRhZyA9IG1vdW50VG8ocm9vdCwgcmlvdFRhZyB8fCByb290LnRhZ05hbWUudG9Mb3dlckNhc2UoKSwgb3B0cylcblxuICAgICAgaWYgKHRhZykgdGFncy5wdXNoKHRhZylcbiAgICB9IGVsc2UgaWYgKHJvb3QubGVuZ3RoKSB7XG4gICAgICBlYWNoKHJvb3QsIHB1c2hUYWdzKSAgIC8vIGFzc3VtZSBub2RlTGlzdFxuICAgIH1cbiAgfVxuXG4gIC8vIC0tLS0tIG1vdW50IGNvZGUgLS0tLS1cblxuICAvLyBpbmplY3Qgc3R5bGVzIGludG8gRE9NXG4gIHN0eWxlTWFuYWdlci5pbmplY3QoKVxuXG4gIGlmIChpc09iamVjdCh0YWdOYW1lKSkge1xuICAgIG9wdHMgPSB0YWdOYW1lXG4gICAgdGFnTmFtZSA9IDBcbiAgfVxuXG4gIC8vIGNyYXdsIHRoZSBET00gdG8gZmluZCB0aGUgdGFnXG4gIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09IFRfU1RSSU5HKSB7XG4gICAgaWYgKHNlbGVjdG9yID09PSAnKicpXG4gICAgICAvLyBzZWxlY3QgYWxsIHRoZSB0YWdzIHJlZ2lzdGVyZWRcbiAgICAgIC8vIGFuZCBhbHNvIHRoZSB0YWdzIGZvdW5kIHdpdGggdGhlIHJpb3QtdGFnIGF0dHJpYnV0ZSBzZXRcbiAgICAgIHNlbGVjdG9yID0gYWxsVGFncyA9IHNlbGVjdEFsbFRhZ3MoKVxuICAgIGVsc2VcbiAgICAgIC8vIG9yIGp1c3QgdGhlIG9uZXMgbmFtZWQgbGlrZSB0aGUgc2VsZWN0b3JcbiAgICAgIHNlbGVjdG9yICs9IGFkZFJpb3RUYWdzKHNlbGVjdG9yLnNwbGl0KC8sICovKSlcblxuICAgIC8vIG1ha2Ugc3VyZSB0byBwYXNzIGFsd2F5cyBhIHNlbGVjdG9yXG4gICAgLy8gdG8gdGhlIHF1ZXJ5U2VsZWN0b3JBbGwgZnVuY3Rpb25cbiAgICBlbHMgPSBzZWxlY3RvciA/ICQkKHNlbGVjdG9yKSA6IFtdXG4gIH1cbiAgZWxzZVxuICAgIC8vIHByb2JhYmx5IHlvdSBoYXZlIHBhc3NlZCBhbHJlYWR5IGEgdGFnIG9yIGEgTm9kZUxpc3RcbiAgICBlbHMgPSBzZWxlY3RvclxuXG4gIC8vIHNlbGVjdCBhbGwgdGhlIHJlZ2lzdGVyZWQgYW5kIG1vdW50IHRoZW0gaW5zaWRlIHRoZWlyIHJvb3QgZWxlbWVudHNcbiAgaWYgKHRhZ05hbWUgPT09ICcqJykge1xuICAgIC8vIGdldCBhbGwgY3VzdG9tIHRhZ3NcbiAgICB0YWdOYW1lID0gYWxsVGFncyB8fCBzZWxlY3RBbGxUYWdzKClcbiAgICAvLyBpZiB0aGUgcm9vdCBlbHMgaXQncyBqdXN0IGEgc2luZ2xlIHRhZ1xuICAgIGlmIChlbHMudGFnTmFtZSlcbiAgICAgIGVscyA9ICQkKHRhZ05hbWUsIGVscylcbiAgICBlbHNlIHtcbiAgICAgIC8vIHNlbGVjdCBhbGwgdGhlIGNoaWxkcmVuIGZvciBhbGwgdGhlIGRpZmZlcmVudCByb290IGVsZW1lbnRzXG4gICAgICB2YXIgbm9kZUxpc3QgPSBbXVxuICAgICAgZWFjaChlbHMsIGZ1bmN0aW9uIChfZWwpIHtcbiAgICAgICAgbm9kZUxpc3QucHVzaCgkJCh0YWdOYW1lLCBfZWwpKVxuICAgICAgfSlcbiAgICAgIGVscyA9IG5vZGVMaXN0XG4gICAgfVxuICAgIC8vIGdldCByaWQgb2YgdGhlIHRhZ05hbWVcbiAgICB0YWdOYW1lID0gMFxuICB9XG5cbiAgcHVzaFRhZ3MoZWxzKVxuXG4gIHJldHVybiB0YWdzXG59XG5cbi8qKlxuICogVXBkYXRlIGFsbCB0aGUgdGFncyBpbnN0YW5jZXMgY3JlYXRlZFxuICogQHJldHVybnMgeyBBcnJheSB9IGFsbCB0aGUgdGFncyBpbnN0YW5jZXNcbiAqL1xucmlvdC51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGVhY2goX192aXJ0dWFsRG9tLCBmdW5jdGlvbih0YWcpIHtcbiAgICB0YWcudXBkYXRlKClcbiAgfSlcbn1cblxuLyoqXG4gKiBFeHBvcnQgdGhlIFZpcnR1YWwgRE9NXG4gKi9cbnJpb3QudmRvbSA9IF9fdmlydHVhbERvbVxuXG4vKipcbiAqIEV4cG9ydCB0aGUgVGFnIGNvbnN0cnVjdG9yXG4gKi9cbnJpb3QuVGFnID0gVGFnXG4gIC8vIHN1cHBvcnQgQ29tbW9uSlMsIEFNRCAmIGJyb3dzZXJcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSBUX09CSkVDVClcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHJpb3RcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gVF9GVU5DVElPTiAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gVF9VTkRFRilcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiByaW90IH0pXG4gIGVsc2VcbiAgICB3aW5kb3cucmlvdCA9IHJpb3RcblxufSkodHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHZvaWQgMCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9yaW90L3Jpb3QuanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19hbWRfb3B0aW9uc19fO1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqICh3ZWJwYWNrKS9idWlsZGluL2FtZC1vcHRpb25zLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLy8gVGFn44OV44Kh44Kk44Or44KS5ZG844Gz5Ye644GXXG5yZXF1aXJlKCcuL3RhZ3MvY29tbW9uL25hdmJhcicpO1xucmVxdWlyZSgnLi90YWdzL2NvbW1vbi9zbGlkZS1tZW51Jyk7XG5yZXF1aXJlKCcuL3RhZ3MvY29tbW9uL2J0bicpO1xuXG4vLyBuYXZiYXLjgpLjg57jgqbjg7Pjg4hcbmNvbnN0IG5hdmJhciA9IHJpb3QubW91bnQoJ25hdmJhcicpWzBdO1xuXG4vKlxuICogUm91dGVy44KS6Kit5a6aXG4gKi9cbi8vIEFjY2VzczogLyAtIOODm+ODvOODoFxucmlvdC5yb3V0ZSgnLycsICgpID0+IHtcblx0cmVxdWlyZSgnLi90YWdzL2hvbWUnKTtcblxuXHRuYXZiYXIuc2V0VGl0bGUoJ0hvbWUnKVxuXHQvLyByb3V0ZeOCv+OCsOOBq2hvbWXjgpLjg57jgqbjg7Pjg4hcblx0cmlvdC5tb3VudCgncm91dGUnLCAnaG9tZScpO1xufSk7XG5cbi8vIEFjY2VzczogL3JlYyAtIOOBiuOBmeOBmeOCgVxucmlvdC5yb3V0ZSgnL3JlYycsICgpID0+IHtcblx0cmVxdWlyZSgnLi90YWdzL3JlY29tbWVuZCcpO1xuXHRyZXF1aXJlKCcuL3RhZ3MvbWVudS1saXN0Jyk7XG5cblx0bmF2YmFyLnNldFRpdGxlKCfjgYrjgZnjgZnjgoEnKTtcblx0Ly8gcm91dGXjgr/jgrDjgatyZWNvbW1lbmTjgpLjg57jgqbjg7Pjg4hcblx0cmlvdC5tb3VudCgncm91dGUnLCAncmVjb21tZW5kJylcbn0pO1xuXG4vLyBBY2Nlc3M6IC9tZW51IC0g44GK5ZOB5pu444GNXG5yaW90LnJvdXRlKCcvbWVudScsICgpID0+IHtcblx0cmVxdWlyZSgnLi90YWdzL21lbnUnKTtcblx0cmVxdWlyZSgnLi90YWdzL21lbnUtbGlzdCcpO1xuXG5cdG5hdmJhci5zZXRUaXRsZSgn44GK5ZOB5pu444GNJyk7XG5cdC8vIHJvdXRl44K/44Kw44GrbWVudeOCkuODnuOCpuODs+ODiFxuXHRyaW90Lm1vdW50KCdyb3V0ZScsICdtZW51Jyk7XG59KTtcblxuLy8gTmV3czogL25ld3MgLSDjgYrjgZfjgonjgZtcbnJpb3Qucm91dGUoJy9uZXdzJywgKCkgPT4ge1xuXHRyZXF1aXJlKCcuL3RhZ3MvbmV3cycpO1xuXHRyZXF1aXJlKCcuL3RhZ3MvbmV3cy1saXN0Jyk7XG5cblx0bmF2YmFyLnNldFRpdGxlKCfjgYrjgZfjgonjgZsnKTtcblx0Ly8gcm91dGXjgr/jgrDjgatuZXdz44KS44Oe44Km44Oz44OIXG5cdHJpb3QubW91bnQoJ3JvdXRlJywgJ25ld3MnKTtcbn0pO1xuXG4vLyBOZXdzOiAvbmV3cy9lZGl0b3IvOmlkIC0g44Ko44OH44Kj44K/XG5yaW90LnJvdXRlKCcvbmV3cy9lZGl0b3IvKicsIChpZCkgPT4ge1xuXHRyZXF1aXJlKCcuL3RhZ3MvbmV3cy1lZGl0b3InKTtcblx0cmVxdWlyZSgnLi90YWdzL25ld3MtZWRpdG9yLWJvZHknKVxuXG5cdG5hdmJhci5zZXRUaXRsZSgn44Ko44OH44Kj44K/Jyk7XG5cdHJpb3QubW91bnQoJ3JvdXRlJywgJ25ld3MtZWRpdG9yJyk7XG59KTtcblxucmlvdC5yb3V0ZSgoKSA9PiB7XG5cdHJlcXVpcmUoJy4vdGFncy9ob21lJyk7XG5cblx0bmF2YmFyLnNldFRpdGxlKCdteUFkbWluIGZvciDmnZHmnZHmnZEnKTtcblx0cmlvdC5tb3VudCgncm91dGUnLCAnaG9tZScpO1xufSlcblxuLy8gUm91dGVy6LW35YuV55SoTW9kdWxl44KS55So5oSPXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0c3RhcnQ6ICgpID0+IHtcblx0XHQvLyBSaW90IHJvdXRlcuOCkui1t+WLlVxuXHRcdHJpb3Qucm91dGUuc3RhcnQodHJ1ZSk7XG5cdH1cbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9zY3JpcHRzL3JvdXRlci5qc1xuICoqLyIsIlxucmlvdC50YWcyKCduYXZiYXInLCAnPGRpdiBjbGFzcz1cIm5hdmJhclwiPiA8ZGl2IGNsYXNzPVwibGVmdFwiPiA8YnV0dG9uIG9uY2xpY2s9XCJ7b3Blbk1lbnV9XCIgY2xhc3M9XCJidG4taWNvblwiPjxzcGFuIGNsYXNzPVwiaW9uLW5hdmljb25cIj48L3NwYW4+PC9idXR0b24+IDwvZGl2PiA8ZGl2IGNsYXNzPVwiY2VudGVyXCI+IDxoMT57dGl0bGV9PC9oMT4gPC9kaXY+IDwvZGl2PiA8c2xpZGUtbWVudSBpcy1vcGVuPVwie2lzT3Blbn1cIj48L3NsaWRlLW1lbnU+JywgJ25hdmJhciAubmF2YmFyLFtyaW90LXRhZz1cIm5hdmJhclwiXSAubmF2YmFyLFtkYXRhLWlzPVwibmF2YmFyXCJdIC5uYXZiYXJ7IHBvc2l0aW9uOiBmaXhlZDsgdG9wOiAwOyBsZWZ0OiAwOyByaWdodDogMDsgd2lkdGg6IDEwMCU7IGhlaWdodDogNTBweDsgYm94LXNpemluZzogYm9yZGVyLWJveDsgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNjY2M7IGJhY2tncm91bmQ6ICNmZmY7IGxpbmUtaGVpZ2h0OiA1MHB4OyB6LWluZGV4OiA5OTk5OyB9IG5hdmJhciAubmF2YmFyIC5sZWZ0LFtyaW90LXRhZz1cIm5hdmJhclwiXSAubmF2YmFyIC5sZWZ0LFtkYXRhLWlzPVwibmF2YmFyXCJdIC5uYXZiYXIgLmxlZnR7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgfSBuYXZiYXIgLm5hdmJhciAuY2VudGVyLFtyaW90LXRhZz1cIm5hdmJhclwiXSAubmF2YmFyIC5jZW50ZXIsW2RhdGEtaXM9XCJuYXZiYXJcIl0gLm5hdmJhciAuY2VudGVyeyBtYXJnaW46IDAgYXV0bzsgdGV4dC1hbGlnbjogY2VudGVyOyB9IG5hdmJhciAubmF2YmFyIGgxLFtyaW90LXRhZz1cIm5hdmJhclwiXSAubmF2YmFyIGgxLFtkYXRhLWlzPVwibmF2YmFyXCJdIC5uYXZiYXIgaDF7IGZvbnQtc2l6ZTogMTZweDsgfSBuYXZiYXIgLm5hdmJhciAuYnRuLWljb24sW3Jpb3QtdGFnPVwibmF2YmFyXCJdIC5uYXZiYXIgLmJ0bi1pY29uLFtkYXRhLWlzPVwibmF2YmFyXCJdIC5uYXZiYXIgLmJ0bi1pY29ueyB3aWR0aDogNTBweDsgaGVpZ2h0OiA1MHB4OyBib3JkZXI6IG5vbmU7IGJhY2tncm91bmQ6IG5vbmU7IGZvbnQtc2l6ZTogMzBweDsgfScsICcnLCBmdW5jdGlvbihvcHRzKSB7XG52YXIgc2VsZiA9IHRoaXM7XG5cbnNlbGYubWl4aW4oe1xuICAgIHNldFRpdGxlOiBmdW5jdGlvbiAodGl0bGUpIHtcbiAgICAgICAgc2VsZi50aXRsZSA9IHRpdGxlO1xuICAgICAgICBzZWxmLnVwZGF0ZSgpO1xuICAgIH1cbn0pO1xuXG5zZWxmLmlzT3BlbiA9IGZhbHNlO1xuc2VsZi5vcGVuTWVudSA9IGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLmlzT3BlbiA9IH5zZWxmLmlzT3Blbjtcbn07XG5vYnMub24oJ3NpbGRlTWVudTpjbG9zZScsIGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLmlzT3BlbiA9IGZhbHNlO1xuICAgIHNlbGYudXBkYXRlKCk7XG59KTtcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3NjcmlwdHMvdGFncy9jb21tb24vbmF2YmFyLnRhZ1xuICoqLyIsIlxucmlvdC50YWcyKCdzbGlkZS1tZW51JywgJzxkaXYgY2xhc3M9XCJzbGlkZS1tZW51IHtvcGVuOiBvcHRzLmlzT3Blbn1cIj4gPHVsIGNsYXNzPVwibWVudS1saXN0XCI+IDxsaSBjbGFzcz1cImJsb2NrXCI+PGltZyBzcmM9XCIuL2ltYWdlcy9sb2dvLnN2Z1wiIGNsYXNzPVwibG9nb1wiPjwvbGk+IDxsaSBlYWNoPVwie2l0ZW0gaW4gbWVudX1cIiBjbGFzcz1cImxpc3QtaXRlbVwiPjxhIGlmPVwieyFpdGVtLl9ibGFua31cIiBocmVmPVwiI1wiIG9uY2xpY2s9XCJ7Y2xvc2UoaXRlbS5ocmVmKX1cIiBjbGFzcz1cImFuY2hvclwiPjxzcGFuIGNsYXNzPVwidGl0bGVcIj57aXRlbS50aXRsZX08L3NwYW4+PHNwYW4gY2xhc3M9XCJpY29uIHtpdGVtLmljb259XCI+PC9zcGFuPjwvYT48YSBpZj1cIntpdGVtLl9ibGFua31cIiBocmVmPVwie2l0ZW0uaHJlZn1cIiB0YXJnZXQ9XCJfYmxhbmtcIiBjbGFzcz1cImFuY2hvclwiPjxzcGFuIGNsYXNzPVwiaWNvbiB7aXRlbS5pY29ufVwiPjwvc3Bhbj48c3BhbiBjbGFzcz1cInRpdGxlXCI+e2l0ZW0udGl0bGV9PC9zcGFuPjwvYT48L2xpPiA8L3VsPiA8L2Rpdj4nLCAnc2xpZGUtbWVudSAuc2xpZGUtbWVudSxbcmlvdC10YWc9XCJzbGlkZS1tZW51XCJdIC5zbGlkZS1tZW51LFtkYXRhLWlzPVwic2xpZGUtbWVudVwiXSAuc2xpZGUtbWVudXsgcG9zaXRpb246IGZpeGVkOyB0b3A6IDUwcHg7IGJvdHRvbTogMDsgbGVmdDogLTI0MHB4OyB3aWR0aDogMjQwcHg7IGJhY2tncm91bmQ6ICNmZmY7IHotaW5kZXg6IDk5OTsgdHJhbnNpdGlvbjogbGVmdCAuM3MgZWFzZTsgfSBzbGlkZS1tZW51IC5zbGlkZS1tZW51Lm9wZW4sW3Jpb3QtdGFnPVwic2xpZGUtbWVudVwiXSAuc2xpZGUtbWVudS5vcGVuLFtkYXRhLWlzPVwic2xpZGUtbWVudVwiXSAuc2xpZGUtbWVudS5vcGVueyBsZWZ0OiAwOyB9IHNsaWRlLW1lbnUgLnNsaWRlLW1lbnUgLm1lbnUtbGlzdCxbcmlvdC10YWc9XCJzbGlkZS1tZW51XCJdIC5zbGlkZS1tZW51IC5tZW51LWxpc3QsW2RhdGEtaXM9XCJzbGlkZS1tZW51XCJdIC5zbGlkZS1tZW51IC5tZW51LWxpc3R7IG92ZXJmbG93LXk6IHNjcm9sbDsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IGJvdHRvbTogMDsgcmlnaHQ6IDA7IH0gc2xpZGUtbWVudSAuc2xpZGUtbWVudSAubWVudS1saXN0IC5ibG9jayxbcmlvdC10YWc9XCJzbGlkZS1tZW51XCJdIC5zbGlkZS1tZW51IC5tZW51LWxpc3QgLmJsb2NrLFtkYXRhLWlzPVwic2xpZGUtbWVudVwiXSAuc2xpZGUtbWVudSAubWVudS1saXN0IC5ibG9ja3sgZGlzcGxheTogLXdlYmtpdC1mbGV4OyBkaXNwbGF5OiAtbW96LWZsZXg7IGRpc3BsYXk6IC1tcy1mbGV4OyBkaXNwbGF5OiAtby1mbGV4OyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjsgaGVpZ2h0OiAxMjBweDsgYmFja2dyb3VuZDogIzExMTsgfSBzbGlkZS1tZW51IC5zbGlkZS1tZW51IC5tZW51LWxpc3QgLmJsb2NrIC5sb2dvLFtyaW90LXRhZz1cInNsaWRlLW1lbnVcIl0gLnNsaWRlLW1lbnUgLm1lbnUtbGlzdCAuYmxvY2sgLmxvZ28sW2RhdGEtaXM9XCJzbGlkZS1tZW51XCJdIC5zbGlkZS1tZW51IC5tZW51LWxpc3QgLmJsb2NrIC5sb2dveyB3aWR0aDogODBweDsgfSBzbGlkZS1tZW51IC5zbGlkZS1tZW51IC5tZW51LWxpc3QgLmxpc3QtaXRlbSxbcmlvdC10YWc9XCJzbGlkZS1tZW51XCJdIC5zbGlkZS1tZW51IC5tZW51LWxpc3QgLmxpc3QtaXRlbSxbZGF0YS1pcz1cInNsaWRlLW1lbnVcIl0gLnNsaWRlLW1lbnUgLm1lbnUtbGlzdCAubGlzdC1pdGVteyBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2NjYzsgfSBzbGlkZS1tZW51IC5zbGlkZS1tZW51IC5tZW51LWxpc3QgLmxpc3QtaXRlbSAuYW5jaG9yLFtyaW90LXRhZz1cInNsaWRlLW1lbnVcIl0gLnNsaWRlLW1lbnUgLm1lbnUtbGlzdCAubGlzdC1pdGVtIC5hbmNob3IsW2RhdGEtaXM9XCJzbGlkZS1tZW51XCJdIC5zbGlkZS1tZW51IC5tZW51LWxpc3QgLmxpc3QtaXRlbSAuYW5jaG9yeyBwb3NpdGlvbjogcmVsYXRpdmU7IGRpc3BsYXk6IGJsb2NrOyBoZWlnaHQ6IDYwcHg7IGxpbmUtaGVpZ2h0OiA2MHB4OyBjb2xvcjogIzIyMjsgdGV4dC1kZWNvcmF0aW9uOiBub25lOyB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kIC4ycyBlYXNlOyB9IHNsaWRlLW1lbnUgLnNsaWRlLW1lbnUgLm1lbnUtbGlzdCAubGlzdC1pdGVtIC5hbmNob3I6aG92ZXIsW3Jpb3QtdGFnPVwic2xpZGUtbWVudVwiXSAuc2xpZGUtbWVudSAubWVudS1saXN0IC5saXN0LWl0ZW0gLmFuY2hvcjpob3ZlcixbZGF0YS1pcz1cInNsaWRlLW1lbnVcIl0gLnNsaWRlLW1lbnUgLm1lbnUtbGlzdCAubGlzdC1pdGVtIC5hbmNob3I6aG92ZXJ7IGJhY2tncm91bmQ6ICNjY2M7IH0gc2xpZGUtbWVudSAuc2xpZGUtbWVudSAubWVudS1saXN0IC5saXN0LWl0ZW0gLmFuY2hvciAuaWNvbixbcmlvdC10YWc9XCJzbGlkZS1tZW51XCJdIC5zbGlkZS1tZW51IC5tZW51LWxpc3QgLmxpc3QtaXRlbSAuYW5jaG9yIC5pY29uLFtkYXRhLWlzPVwic2xpZGUtbWVudVwiXSAuc2xpZGUtbWVudSAubWVudS1saXN0IC5saXN0LWl0ZW0gLmFuY2hvciAuaWNvbnsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDVweDsgZGlzcGxheTogYmxvY2s7IHdpZHRoOiA0MHB4OyBtYXJnaW4tcmlnaHQ6IDEwcHg7IGZvbnQtc2l6ZTogMjBweDsgdGV4dC1hbGlnbjogY2VudGVyOyB9IHNsaWRlLW1lbnUgLnNsaWRlLW1lbnUgLm1lbnUtbGlzdCAubGlzdC1pdGVtIC5hbmNob3IgLnRpdGxlLFtyaW90LXRhZz1cInNsaWRlLW1lbnVcIl0gLnNsaWRlLW1lbnUgLm1lbnUtbGlzdCAubGlzdC1pdGVtIC5hbmNob3IgLnRpdGxlLFtkYXRhLWlzPVwic2xpZGUtbWVudVwiXSAuc2xpZGUtbWVudSAubWVudS1saXN0IC5saXN0LWl0ZW0gLmFuY2hvciAudGl0bGV7IGRpc3BsYXk6IGJsb2NrOyBtYXJnaW4tbGVmdDogMTBweDsgbGV0dGVyLXNwYWNpbmc6IDAuMWVtOyB0ZXh0LWFsaWduOiBjZW50ZXI7IGZvbnQtc2l6ZTogMTRweDsgfSBzbGlkZS1tZW51IC5zbGlkZS1tZW51IC5jb3B5cmlnaHQsW3Jpb3QtdGFnPVwic2xpZGUtbWVudVwiXSAuc2xpZGUtbWVudSAuY29weXJpZ2h0LFtkYXRhLWlzPVwic2xpZGUtbWVudVwiXSAuc2xpZGUtbWVudSAuY29weXJpZ2h0eyBwb3NpdGlvbjogYWJzb2x1dGU7IGJvdHRvbTogMTBweDsgbGVmdDogMDsgcmlnaHQ6IDA7IHRleHQtYWxpZ246IGNlbnRlcjsgZm9udC1zaXplOiAxMHB4OyBjb2xvcjogIzMzMzsgfScsICcnLCBmdW5jdGlvbihvcHRzKSB7XG50aGlzLmNsb3NlID0gZnVuY3Rpb24gKGhyZWYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgbG9jYXRpb24uaHJlZiA9IGhyZWY7XG4gICAgICAgIG9icy50cmlnZ2VyKCdzaWxkZU1lbnU6Y2xvc2UnKTtcbiAgICB9O1xufTtcbnRoaXMubWVudSA9IFt7XG4gICAgdGl0bGU6ICfjgrXjgqTjg4jjgpLplovjgY8nLFxuICAgIGljb246ICdpb24tYW5kcm9pZC1ob21lJyxcbiAgICBocmVmOiAnaHR0cDovL+adkeadkeadkS5jb20nLFxuICAgIF9ibGFuazogdHJ1ZVxufSwge1xuICAgIHRpdGxlOiAn44GK44GX44KJ44GbJyxcbiAgICBpY29uOiAnaW9uLWVkaXQnLFxuICAgIGhyZWY6ICcjL25ld3MnXG59LCB7XG4gICAgdGl0bGU6ICfjgYrlk4Hmm7jjgY0nLFxuICAgIGljb246ICdpb24taW9zLWxpc3Qtb3V0bGluZScsXG4gICAgaHJlZjogJyMvbWVudSdcbn0sIHtcbiAgICB0aXRsZTogJ+OBiuOBmeOBmeOCgScsXG4gICAgaWNvbjogJ2lvbi13aW5lZ2xhc3MnLFxuICAgIGhyZWY6ICcjL3JlYydcbn0sIHtcbiAgICB0aXRsZTogJ+WWtualreaXpScsXG4gICAgaWNvbjogJ2lvbi1hbmRyb2lkLWNhbGVuZGFyJyxcbiAgICBocmVmOiAnIy9idXMnXG59LCB7XG4gICAgdGl0bGU6ICfjgqLjgq/jgrvjgrknLFxuICAgIGljb246ICdpb24tYXJyb3ctZ3JhcGgtdXAtcmlnaHQnLFxuICAgIGhyZWY6ICdodHRwOi8vYW5hbHl0aWNzLmdvb2dsZS5jb20vYW5hbHl0aWNzL3dlYi8nLFxuICAgIF9ibGFuazogdHJ1ZVxufV07XG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9zY3JpcHRzL3RhZ3MvY29tbW9uL3NsaWRlLW1lbnUudGFnXG4gKiovIiwiXG5yaW90LnRhZzIoJ2J0bicsICc8YnV0dG9uIG9uY2xpY2s9XCJ7Y2FsbGJhY2s6IHR5cGVvZihjYWxsYmFjayA9PT0gXFwnZnVuY3Rpb25cXCcpfVwiIGNsYXNzPVwiYnRuIGJ0bi17c2l6ZX0gYnRuLXt0eXBlfSBidG4te2NvbG9yfVwiPjwvYnV0dG9uPicsICcnLCAnJywgZnVuY3Rpb24ob3B0cykge1xudGhpcy5zaXplID0gb3B0cy5zaXplIHx8ICdub3JtYWwnO1xudGhpcy50eXBlID0gb3B0cy50eXBlIHx8ICdmaWxsJztcbnRoaXMuY29sb3IgPSBvcHRzLmNvbG9yIHx8ICdwcmltYXJ5Jztcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3NjcmlwdHMvdGFncy9jb21tb24vYnRuLnRhZ1xuICoqLyIsIlxucmlvdC50YWcyKCdob21lJywgJzxhIGhyZWY9XCJodHRwOi8v5p2R5p2R5p2RLmNvbVwiIHRhcmdldD1cIl9ibGFua1wiIGNsYXNzPVwiaG9tZS1sb2dvXCI+PGltZyBzcmM9XCIuL2ltYWdlcy9sb2dvLnN2Z1wiPjwvYT4nLCAnaG9tZSAuaG9tZS1sb2dvLFtyaW90LXRhZz1cImhvbWVcIl0gLmhvbWUtbG9nbyxbZGF0YS1pcz1cImhvbWVcIl0gLmhvbWUtbG9nb3sgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDUwJTsgbGVmdDogNTAlOyBkaXNwbGF5OiBibG9jazsgd2lkdGg6IDE1MHB4OyBoZWlnaHQ6IDE1MHB4OyBtYXJnaW46IC03NXB4OyBiYWNrZ3JvdW5kOiAjMTExOyB0ZXh0LWFsaWduOiBjZW50ZXI7IH0gaG9tZSAuaG9tZS1sb2dvIGltZyxbcmlvdC10YWc9XCJob21lXCJdIC5ob21lLWxvZ28gaW1nLFtkYXRhLWlzPVwiaG9tZVwiXSAuaG9tZS1sb2dvIGltZ3sgaGVpZ2h0OiA0MHB4OyBtYXJnaW46IDU1cHggMDsgfScsICcnLCBmdW5jdGlvbihvcHRzKSB7XG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9zY3JpcHRzL3RhZ3MvaG9tZS50YWdcbiAqKi8iLCJcbnJpb3QudGFnMigncmVjb21tZW5kJywgJzxkaXYgY2xhc3M9XCJ7ZWRpdCA/IFxcJ2VkaXRcXCcgOiBcXCdkaXNwbGF5XFwnfVwiPiA8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+IDxoMj4gPGRpdiBjbGFzcz1cImlucHV0IGxhcmdlXCI+IDxpbnB1dCB2YWx1ZT1cIntkYXRhLnRpdGxlfVwiIF9fcmVhZG9ubHk9XCJ7IWVkaXR9XCIgY2xhc3M9XCJpbnB1dC1mb3JtXCI+IDwvZGl2PiA8L2gyPiA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbmNsaWNrPVwie3RvZ2dsZU1vZGV9XCIgY2xhc3M9XCJidG4gYnRuLXNtYWxsIGJ0bi17ZWRpdCA/IFxcJ2RhbmdlclxcJyA6IFxcJ3NhZmV0eVxcJ31cIj57ZWRpdCA/IFxcJ+S/neWtmFxcJyA6IFxcJ+e3qOmbhlxcJ308L2J1dHRvbj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJ0aHVtYlwiPiA8ZGl2IGlmPVwie2RhdGEucGljID09IFxcJ25vbi1waWNcXCd9XCIgY2xhc3M9XCJkdW1teVwiPueUu+WDj+OBjOOBguOCiuOBvuOBm+OCkzwvZGl2PiA8ZGl2IGlmPVwie2RhdGEucGljICE9IFxcJ25vbi1waWNcXCd9XCIgY2xhc3M9XCJib2R5IHtkaXNhY3RpdmU6ICF1c2VQaWN0dXJlfVwiPjxpbWcgcmlvdC1zcmM9XCIuL2ltYWdlcy9tZW51L3tkYXRhLnBpY31cIiBjbGFzcz1cInBpY3R1cmVcIj4gPGRpdiBjbGFzcz1cIm9uaG92ZXJcIj4gPGRpdiBjbGFzcz1cIm92ZXJsYXlcIj4gPGJ1dHRvbiBvbmNsaWNrPVwie3RvZ2dsZVVzZVBpY31cIiBjbGFzcz1cImJ0biBidG4td2FybmluZyBidG4tbGFyZ2Uge2J0bi1vdXRsaW5lOiAhdXNlUGljdHVyZX1cIj57dXNlUGljdHVyZSA/IFxcJ+eUu+WDj+OCkuS9v+eUqOOBmeOCi1xcJyA6IFxcJ+eUu+WDj+OCkuS9v+eUqOOBl+OBquOBhFxcJ308L2J1dHRvbj4gPC9kaXY+IDwvZGl2PiA8L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9XCJpbmZvXCI+IDx1bCBjbGFzcz1cImlucHV0LWdyb3VwXCI+IDxsaSBjbGFzcz1cIm1lbnUtbmFtZVwiPiA8ZGl2IGNsYXNzPVwiaW5wdXQgbGFyZ2VcIj4gPGlucHV0IHZhbHVlPVwie2RhdGEubmFtZX1cIiBfX3JlYWRvbmx5PVwieyFlZGl0fVwiIGNsYXNzPVwiaW5wdXQtZm9ybVwiPiA8L2Rpdj4gPC9saT4gPGxpIGNsYXNzPVwibWVudS1wcmljZVwiPiA8ZGl2IGNsYXNzPVwiaW5wdXQgbm9ybWFsXCI+IDxpbnB1dCB2YWx1ZT1cIntkYXRhLnByaWNlfVwiIF9fcmVhZG9ubHk9XCJ7IWVkaXR9XCIgY2xhc3M9XCJpbnB1dC1mb3JtXCI+IDwvZGl2PiA8L2xpPiA8bGkgY2xhc3M9XCJtZW51LWNvbW1lbnRcIj4gPGRpdiBjbGFzcz1cImlucHV0IG5vcm1hbFwiPiA8dGV4dGFyZWEgaWQ9XCJjb21tZW50XCIgdmFsdWU9XCJ7ZGF0YS5jb21tZW50fVwiIHBsYWNlaG9sZGVyPVwi44Kz44Oh44Oz44OI44KS5o6y6LyJ44GX44G+44Gb44KTXCIgX19yZWFkb25seT1cInshZWRpdH1cIiBjbGFzcz1cImlucHV0LWZvcm1cIj48L3RleHRhcmVhPiA8L2Rpdj4gPC9saT4gPC91bD4gPC9kaXY+IDxkaXYgaWY9XCJ7ZWRpdH1cIiBjbGFzcz1cIm9wZW5MaXN0XCI+IDxidXR0b24gb25jbGljaz1cInt0b2dnbGVNZW51TGlzdH1cIiBjbGFzcz1cImJ0biBidG4tbGFyZ2UgYnRuLXByaW1hcnkgYnRuLWJsb2NrXCI+6YG45oqePC9idXR0b24+IDwvZGl2PiA8L2Rpdj4gPGRpdiBpZD1cIm1lbnVMaXN0XCIgY2xhc3M9XCJtb2RhbFwiPiA8YnV0dG9uIG9uY2xpY2s9XCJ7dG9nZ2xlTWVudUxpc3R9XCIgY2xhc3M9XCJidG4gYnRuLW5vcm1hbCBidG4tZGFuZ2VyIGJ0bi1ibG9ja1wiPumWieOBmOOCizwvYnV0dG9uPiA8bWVudS1saXN0PjwvbWVudS1saXN0PiA8L2Rpdj4nLCAnQGNoYXJzZXQgXCJVVEYtOFwiOyAuaGVhZGVyIHsgZGlzcGxheTogLXdlYmtpdC1mbGV4OyBkaXNwbGF5OiAtbW96LWZsZXg7IGRpc3BsYXk6IC1tcy1mbGV4OyBkaXNwbGF5OiAtby1mbGV4OyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47IG1hcmdpbjogMTBweCAxNXB4OyB9IHJlY29tbWVuZCAuaGVhZGVyIGgyLFtyaW90LXRhZz1cInJlY29tbWVuZFwiXSAuaGVhZGVyIGgyLFtkYXRhLWlzPVwicmVjb21tZW5kXCJdIC5oZWFkZXIgaDJ7IGZsZXg6IDE7IG1hcmdpbi1yaWdodDogMTBweDsgfSByZWNvbW1lbmQgLmlucHV0IC5pbnB1dC1mb3JtLFtyaW90LXRhZz1cInJlY29tbWVuZFwiXSAuaW5wdXQgLmlucHV0LWZvcm0sW2RhdGEtaXM9XCJyZWNvbW1lbmRcIl0gLmlucHV0IC5pbnB1dC1mb3JteyB3aWR0aDogMTAwJTsgcGFkZGluZzogMCA1cHg7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7IGJvcmRlcjogbm9uZTsgfSByZWNvbW1lbmQgLmlucHV0IHRleHRhcmVhLmlucHV0LWZvcm0sW3Jpb3QtdGFnPVwicmVjb21tZW5kXCJdIC5pbnB1dCB0ZXh0YXJlYS5pbnB1dC1mb3JtLFtkYXRhLWlzPVwicmVjb21tZW5kXCJdIC5pbnB1dCB0ZXh0YXJlYS5pbnB1dC1mb3JteyByZXNpemU6IG5vbmU7IH0gcmVjb21tZW5kIC5pbnB1dC5sYXJnZSAuaW5wdXQtZm9ybSxbcmlvdC10YWc9XCJyZWNvbW1lbmRcIl0gLmlucHV0LmxhcmdlIC5pbnB1dC1mb3JtLFtkYXRhLWlzPVwicmVjb21tZW5kXCJdIC5pbnB1dC5sYXJnZSAuaW5wdXQtZm9ybXsgZm9udC1zaXplOiAyMHB4OyBsaW5lLWhlaWdodDogNDBweDsgfSByZWNvbW1lbmQgLmlucHV0Lm5vcm1hbCAuaW5wdXQtZm9ybSxbcmlvdC10YWc9XCJyZWNvbW1lbmRcIl0gLmlucHV0Lm5vcm1hbCAuaW5wdXQtZm9ybSxbZGF0YS1pcz1cInJlY29tbWVuZFwiXSAuaW5wdXQubm9ybWFsIC5pbnB1dC1mb3JteyBmb250LXNpemU6IDE2cHg7IGxpbmUtaGVpZ2h0OiAzMHB4OyB9IHJlY29tbWVuZCAuaW5wdXQuc21hbGwgLmlucHV0LWZvcm0sW3Jpb3QtdGFnPVwicmVjb21tZW5kXCJdIC5pbnB1dC5zbWFsbCAuaW5wdXQtZm9ybSxbZGF0YS1pcz1cInJlY29tbWVuZFwiXSAuaW5wdXQuc21hbGwgLmlucHV0LWZvcm17IGZvbnQtc2l6ZTogMTRweDsgbGluZS1oZWlnaHQ6IDIwcHg7IH0gcmVjb21tZW5kIC50aHVtYixbcmlvdC10YWc9XCJyZWNvbW1lbmRcIl0gLnRodW1iLFtkYXRhLWlzPVwicmVjb21tZW5kXCJdIC50aHVtYnsgcG9zaXRpb246IHJlbGF0aXZlOyB3aWR0aDogOTUlOyBtYXJnaW46IDEwcHggYXV0byAwOyB9IHJlY29tbWVuZCAudGh1bWIgLnBpY3R1cmUsW3Jpb3QtdGFnPVwicmVjb21tZW5kXCJdIC50aHVtYiAucGljdHVyZSxbZGF0YS1pcz1cInJlY29tbWVuZFwiXSAudGh1bWIgLnBpY3R1cmV7IHdpZHRoOiAxMDAlOyB9IHJlY29tbWVuZCAudGh1bWIgLmR1bW15LFtyaW90LXRhZz1cInJlY29tbWVuZFwiXSAudGh1bWIgLmR1bW15LFtkYXRhLWlzPVwicmVjb21tZW5kXCJdIC50aHVtYiAuZHVtbXl7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDI1MHB4OyBiYWNrZ3JvdW5kOiAjZWVlOyB0ZXh0LWFsaWduOiBjZW50ZXI7IGxpbmUtaGVpZ2h0OiAyNTBweDsgZm9udC1zaXplOiAxOHB4OyBjb2xvcjogIzk5OTsgfSByZWNvbW1lbmQgLnRodW1iIC5ib2R5IC5vbmhvdmVyLFtyaW90LXRhZz1cInJlY29tbWVuZFwiXSAudGh1bWIgLmJvZHkgLm9uaG92ZXIsW2RhdGEtaXM9XCJyZWNvbW1lbmRcIl0gLnRodW1iIC5ib2R5IC5vbmhvdmVyeyBkaXNwbGF5OiBub25lOyB9IHJlY29tbWVuZCAudGh1bWIgLmJvZHkgLm9uaG92ZXIgLm92ZXJsYXksW3Jpb3QtdGFnPVwicmVjb21tZW5kXCJdIC50aHVtYiAuYm9keSAub25ob3ZlciAub3ZlcmxheSxbZGF0YS1pcz1cInJlY29tbWVuZFwiXSAudGh1bWIgLmJvZHkgLm9uaG92ZXIgLm92ZXJsYXl7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAwOyBsZWZ0OiAwOyBib3R0b206IDA7IHJpZ2h0OiAwOyBkaXNwbGF5OiAtd2Via2l0LWZsZXg7IGRpc3BsYXk6IC1tb3otZmxleDsgZGlzcGxheTogLW1zLWZsZXg7IGRpc3BsYXk6IC1vLWZsZXg7IGRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGp1c3RpZnktY29udGVudDogY2VudGVyOyB9IHJlY29tbWVuZCAudGh1bWIgLmJvZHkgLm9uaG92ZXIgLm92ZXJsYXkgLmJ0bixbcmlvdC10YWc9XCJyZWNvbW1lbmRcIl0gLnRodW1iIC5ib2R5IC5vbmhvdmVyIC5vdmVybGF5IC5idG4sW2RhdGEtaXM9XCJyZWNvbW1lbmRcIl0gLnRodW1iIC5ib2R5IC5vbmhvdmVyIC5vdmVybGF5IC5idG57IHBvc2l0aW9uOiByZWxhdGl2ZTsgei1pbmRleDogMTsgfSByZWNvbW1lbmQgLnRodW1iIC5ib2R5LmRpc2FjdGl2ZSxbcmlvdC10YWc9XCJyZWNvbW1lbmRcIl0gLnRodW1iIC5ib2R5LmRpc2FjdGl2ZSxbZGF0YS1pcz1cInJlY29tbWVuZFwiXSAudGh1bWIgLmJvZHkuZGlzYWN0aXZleyBwb3NpdGlvbjogcmVsYXRpdmU7IH0gcmVjb21tZW5kIC50aHVtYiAuYm9keS5kaXNhY3RpdmU6OmFmdGVyLFtyaW90LXRhZz1cInJlY29tbWVuZFwiXSAudGh1bWIgLmJvZHkuZGlzYWN0aXZlOjphZnRlcixbZGF0YS1pcz1cInJlY29tbWVuZFwiXSAudGh1bWIgLmJvZHkuZGlzYWN0aXZlOjphZnRlcnsgY29udGVudDogXFwnXFwnOyBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgbGVmdDogMDsgYm90dG9tOiAwOyByaWdodDogMDsgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjcpOyB9IHJlY29tbWVuZCAudGh1bWIgLmJvZHkuZGlzYWN0aXZlIC5vbmhvdmVyLFtyaW90LXRhZz1cInJlY29tbWVuZFwiXSAudGh1bWIgLmJvZHkuZGlzYWN0aXZlIC5vbmhvdmVyLFtkYXRhLWlzPVwicmVjb21tZW5kXCJdIC50aHVtYiAuYm9keS5kaXNhY3RpdmUgLm9uaG92ZXJ7IGRpc3BsYXk6IGJsb2NrOyB9IHJlY29tbWVuZCAuaW5mbyxbcmlvdC10YWc9XCJyZWNvbW1lbmRcIl0gLmluZm8sW2RhdGEtaXM9XCJyZWNvbW1lbmRcIl0gLmluZm97IG1hcmdpbi10b3A6IDEwcHg7IH0gcmVjb21tZW5kIC5pbmZvIC5pbnB1dC1ncm91cCAubWVudS1uYW1lLFtyaW90LXRhZz1cInJlY29tbWVuZFwiXSAuaW5mbyAuaW5wdXQtZ3JvdXAgLm1lbnUtbmFtZSxbZGF0YS1pcz1cInJlY29tbWVuZFwiXSAuaW5mbyAuaW5wdXQtZ3JvdXAgLm1lbnUtbmFtZXsgcGFkZGluZzogMTBweCAxMHB4OyB9IHJlY29tbWVuZCAuaW5mbyAuaW5wdXQtZ3JvdXAgLm1lbnUtcHJpY2UsW3Jpb3QtdGFnPVwicmVjb21tZW5kXCJdIC5pbmZvIC5pbnB1dC1ncm91cCAubWVudS1wcmljZSxbZGF0YS1pcz1cInJlY29tbWVuZFwiXSAuaW5mbyAuaW5wdXQtZ3JvdXAgLm1lbnUtcHJpY2V7IHBvc2l0aW9uOiByZWxhdGl2ZTsgd2lkdGg6IDgwcHg7IHBhZGRpbmc6IDAgMjBweDsgfSByZWNvbW1lbmQgLmluZm8gLmlucHV0LWdyb3VwIC5tZW51LXByaWNlOjpiZWZvcmUsW3Jpb3QtdGFnPVwicmVjb21tZW5kXCJdIC5pbmZvIC5pbnB1dC1ncm91cCAubWVudS1wcmljZTo6YmVmb3JlLFtkYXRhLWlzPVwicmVjb21tZW5kXCJdIC5pbmZvIC5pbnB1dC1ncm91cCAubWVudS1wcmljZTo6YmVmb3JleyBjb250ZW50OiBcIu+/pVwiOyBwb3NpdGlvbjogYWJzb2x1dGU7IGxlZnQ6IDIwcHg7IHdpZHRoOiAzMHB4OyBoZWlnaHQ6IDMwcHg7IGxpbmUtaGVpZ2h0OiAzMHB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7IHotaW5kZXg6IDE7IH0gcmVjb21tZW5kIC5pbmZvIC5pbnB1dC1ncm91cCAubWVudS1wcmljZSAuaW5wdXQtZm9ybSxbcmlvdC10YWc9XCJyZWNvbW1lbmRcIl0gLmluZm8gLmlucHV0LWdyb3VwIC5tZW51LXByaWNlIC5pbnB1dC1mb3JtLFtkYXRhLWlzPVwicmVjb21tZW5kXCJdIC5pbmZvIC5pbnB1dC1ncm91cCAubWVudS1wcmljZSAuaW5wdXQtZm9ybXsgcGFkZGluZy1sZWZ0OiAzNHB4OyB9IHJlY29tbWVuZCAuaW5mbyAuaW5wdXQtZ3JvdXAgLm1lbnUtY29tbWVudCxbcmlvdC10YWc9XCJyZWNvbW1lbmRcIl0gLmluZm8gLmlucHV0LWdyb3VwIC5tZW51LWNvbW1lbnQsW2RhdGEtaXM9XCJyZWNvbW1lbmRcIl0gLmluZm8gLmlucHV0LWdyb3VwIC5tZW51LWNvbW1lbnR7IHBhZGRpbmc6IDEwcHggMjBweDsgfSByZWNvbW1lbmQgLm9wZW5MaXN0LFtyaW90LXRhZz1cInJlY29tbWVuZFwiXSAub3Blbkxpc3QsW2RhdGEtaXM9XCJyZWNvbW1lbmRcIl0gLm9wZW5MaXN0eyBtYXJnaW46IDIwcHggMTVweCAwOyB9IHJlY29tbWVuZCAuZWRpdCAudGh1bWIgLmJvZHk6bm90KC5kaXNhY3RpdmUpIC5vbmhvdmVyLFtyaW90LXRhZz1cInJlY29tbWVuZFwiXSAuZWRpdCAudGh1bWIgLmJvZHk6bm90KC5kaXNhY3RpdmUpIC5vbmhvdmVyLFtkYXRhLWlzPVwicmVjb21tZW5kXCJdIC5lZGl0IC50aHVtYiAuYm9keTpub3QoLmRpc2FjdGl2ZSkgLm9uaG92ZXJ7IGRpc3BsYXk6IG5vbmU7IH0gcmVjb21tZW5kIC5lZGl0IC50aHVtYiAuYm9keTpub3QoLmRpc2FjdGl2ZSk6aG92ZXIgLm9uaG92ZXIsW3Jpb3QtdGFnPVwicmVjb21tZW5kXCJdIC5lZGl0IC50aHVtYiAuYm9keTpub3QoLmRpc2FjdGl2ZSk6aG92ZXIgLm9uaG92ZXIsW2RhdGEtaXM9XCJyZWNvbW1lbmRcIl0gLmVkaXQgLnRodW1iIC5ib2R5Om5vdCguZGlzYWN0aXZlKTpob3ZlciAub25ob3ZlcnsgZGlzcGxheTogYmxvY2s7IH0gcmVjb21tZW5kIC5lZGl0IC5pbnB1dCxbcmlvdC10YWc9XCJyZWNvbW1lbmRcIl0gLmVkaXQgLmlucHV0LFtkYXRhLWlzPVwicmVjb21tZW5kXCJdIC5lZGl0IC5pbnB1dHsgcG9zaXRpb246IHJlbGF0aXZlOyB9IHJlY29tbWVuZCAuZWRpdCAuaW5wdXQ6OmJlZm9yZSxbcmlvdC10YWc9XCJyZWNvbW1lbmRcIl0gLmVkaXQgLmlucHV0OjpiZWZvcmUsW2RhdGEtaXM9XCJyZWNvbW1lbmRcIl0gLmVkaXQgLmlucHV0OjpiZWZvcmV7IGNvbnRlbnQ6IFwiXCI7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgYm90dG9tOiAwOyBkaXNwbGF5OiBibG9jazsgd2lkdGg6IDEwMCU7IGhlaWdodDogMnB4OyBib3JkZXItdG9wOiAwOyBib3JkZXItbGVmdDogMXB4IHNvbGlkICNhYWE7IGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjYWFhOyBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjYWFhOyB9IHJlY29tbWVuZCAuZGlzcGxheSAuaW5wdXQgLmlucHV0LWZvcm0sW3Jpb3QtdGFnPVwicmVjb21tZW5kXCJdIC5kaXNwbGF5IC5pbnB1dCAuaW5wdXQtZm9ybSxbZGF0YS1pcz1cInJlY29tbWVuZFwiXSAuZGlzcGxheSAuaW5wdXQgLmlucHV0LWZvcm17IG91dGxpbmU6IDA7IH0gcmVjb21tZW5kIC5kaXNwbGF5IC5pbnB1dCAuaW5wdXQtZm9ybTpub3QodGV4dGFyZWEpLFtyaW90LXRhZz1cInJlY29tbWVuZFwiXSAuZGlzcGxheSAuaW5wdXQgLmlucHV0LWZvcm06bm90KHRleHRhcmVhKSxbZGF0YS1pcz1cInJlY29tbWVuZFwiXSAuZGlzcGxheSAuaW5wdXQgLmlucHV0LWZvcm06bm90KHRleHRhcmVhKXsgb3ZlcmZsb3c6IGhpZGRlbjsgd2hpdGUtc3BhY2U6IG5vd3JhcDsgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7IH0gcmVjb21tZW5kIC5tb2RhbCxbcmlvdC10YWc9XCJyZWNvbW1lbmRcIl0gLm1vZGFsLFtkYXRhLWlzPVwicmVjb21tZW5kXCJdIC5tb2RhbHsgcG9zaXRpb246IGZpeGVkOyB0b3A6IDUwcHg7IGxlZnQ6IDA7IGJvdHRvbTogMDsgcmlnaHQ6IDA7IG92ZXJmbG93LXk6IGF1dG87IGRpc3BsYXk6IG5vbmU7IGJhY2tncm91bmQ6ICNmZmY7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7IG9wYWNpdHk6IDA7IHotaW5kZXg6IDk5OyB9IHJlY29tbWVuZCAuYnRuLFtyaW90LXRhZz1cInJlY29tbWVuZFwiXSAuYnRuLFtkYXRhLWlzPVwicmVjb21tZW5kXCJdIC5idG57IGJvcmRlcjogbm9uZTsgfSByZWNvbW1lbmQgLmJ0bi5idG4tc21hbGwsW3Jpb3QtdGFnPVwicmVjb21tZW5kXCJdIC5idG4uYnRuLXNtYWxsLFtkYXRhLWlzPVwicmVjb21tZW5kXCJdIC5idG4uYnRuLXNtYWxseyBoZWlnaHQ6IDMwcHg7IHBhZGRpbmc6IDAgMTVweDsgZm9udC1zaXplOiAxNHB4OyBsaW5lLWhlaWdodDogMzBweDsgfSByZWNvbW1lbmQgLmJ0bi5idG4tbm9ybWFsLFtyaW90LXRhZz1cInJlY29tbWVuZFwiXSAuYnRuLmJ0bi1ub3JtYWwsW2RhdGEtaXM9XCJyZWNvbW1lbmRcIl0gLmJ0bi5idG4tbm9ybWFseyBoZWlnaHQ6IDQwcHg7IHBhZGRpbmc6IDAgMjBweDsgZm9udC1zaXplOiAxNnB4OyBsaW5lLWhlaWdodDogNDBweDsgfSByZWNvbW1lbmQgLmJ0bi5idG4tbGFyZ2UsW3Jpb3QtdGFnPVwicmVjb21tZW5kXCJdIC5idG4uYnRuLWxhcmdlLFtkYXRhLWlzPVwicmVjb21tZW5kXCJdIC5idG4uYnRuLWxhcmdleyBoZWlnaHQ6IDUwcHg7IHBhZGRpbmc6IDAgMzBweDsgZm9udC1zaXplOiAxOHB4OyBsaW5lLWhlaWdodDogNTBweDsgYmFja2dyb3VuZDogIzAwOTY4ODsgY29sb3I6ICNmZmY7IH0gcmVjb21tZW5kIC5idG4uYnRuLWJsb2NrLFtyaW90LXRhZz1cInJlY29tbWVuZFwiXSAuYnRuLmJ0bi1ibG9jayxbZGF0YS1pcz1cInJlY29tbWVuZFwiXSAuYnRuLmJ0bi1ibG9ja3sgZGlzcGxheTogYmxvY2s7IHdpZHRoOiAxMDAlOyB9IHJlY29tbWVuZCAuYnRuLmJ0bi1wcmltYXJ5LFtyaW90LXRhZz1cInJlY29tbWVuZFwiXSAuYnRuLmJ0bi1wcmltYXJ5LFtkYXRhLWlzPVwicmVjb21tZW5kXCJdIC5idG4uYnRuLXByaW1hcnl7IGJhY2tncm91bmQ6ICMwMmFlZGM7IGNvbG9yOiAjZmZmOyB9IHJlY29tbWVuZCAuYnRuLmJ0bi1kYW5nZXIsW3Jpb3QtdGFnPVwicmVjb21tZW5kXCJdIC5idG4uYnRuLWRhbmdlcixbZGF0YS1pcz1cInJlY29tbWVuZFwiXSAuYnRuLmJ0bi1kYW5nZXJ7IGJhY2tncm91bmQ6ICNlYjIxNDI7IGNvbG9yOiAjZmZmOyB9IHJlY29tbWVuZCAuYnRuLmJ0bi13YXJuaW5nLFtyaW90LXRhZz1cInJlY29tbWVuZFwiXSAuYnRuLmJ0bi13YXJuaW5nLFtkYXRhLWlzPVwicmVjb21tZW5kXCJdIC5idG4uYnRuLXdhcm5pbmd7IGJhY2tncm91bmQ6ICNkMzU0MDA7IGNvbG9yOiAjZmZmOyB9IHJlY29tbWVuZCAuYnRuLmJ0bi1zYWZldHksW3Jpb3QtdGFnPVwicmVjb21tZW5kXCJdIC5idG4uYnRuLXNhZmV0eSxbZGF0YS1pcz1cInJlY29tbWVuZFwiXSAuYnRuLmJ0bi1zYWZldHl7IGJhY2tncm91bmQ6ICMyZmNkYjQ7IGNvbG9yOiAjZmZmOyB9IHJlY29tbWVuZCAuYnRuLmJ0bi1vdXRsaW5lLFtyaW90LXRhZz1cInJlY29tbWVuZFwiXSAuYnRuLmJ0bi1vdXRsaW5lLFtkYXRhLWlzPVwicmVjb21tZW5kXCJdIC5idG4uYnRuLW91dGxpbmV7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7IGJhY2tncm91bmQ6IHRyYW5zcGFyZW50OyBib3JkZXI6IDJweCBzb2xpZDsgfSByZWNvbW1lbmQgLmJ0bi5idG4tb3V0bGluZS5idG4td2FybmluZyxbcmlvdC10YWc9XCJyZWNvbW1lbmRcIl0gLmJ0bi5idG4tb3V0bGluZS5idG4td2FybmluZyxbZGF0YS1pcz1cInJlY29tbWVuZFwiXSAuYnRuLmJ0bi1vdXRsaW5lLmJ0bi13YXJuaW5neyBib3JkZXItY29sb3I6ICNkMzU0MDA7IGNvbG9yOiAjZDM1NDAwOyB9IHJlY29tbWVuZCAuYnRuLmJ0bi1vdXRsaW5lLmJ0bi1kYW5nZXIsW3Jpb3QtdGFnPVwicmVjb21tZW5kXCJdIC5idG4uYnRuLW91dGxpbmUuYnRuLWRhbmdlcixbZGF0YS1pcz1cInJlY29tbWVuZFwiXSAuYnRuLmJ0bi1vdXRsaW5lLmJ0bi1kYW5nZXJ7IGJvcmRlci1jb2xvcjogI2ViMjE0MjsgY29sb3I6ICNlYjIxNDI7IH0gcmVjb21tZW5kIC5idG4uYnRuLW91dGxpbmUuYnRuLW5vcm1hbCxbcmlvdC10YWc9XCJyZWNvbW1lbmRcIl0gLmJ0bi5idG4tb3V0bGluZS5idG4tbm9ybWFsLFtkYXRhLWlzPVwicmVjb21tZW5kXCJdIC5idG4uYnRuLW91dGxpbmUuYnRuLW5vcm1hbHsgYm9yZGVyLWNvbG9yOiAjMTExOyBjb2xvcjogIzExMTsgfScsICcnLCBmdW5jdGlvbihvcHRzKSB7XG52YXIgc3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZScpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcbnZhciBhbmltZSA9IHJlcXVpcmUoJ2FuaW1lanMnKTtcbnZhciBzZWxmID0gdGhpcztcblxuc2VsZi5lZGl0ID0gZmFsc2U7XG5zZWxmLnRvZ2dsZU1vZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHNlbGYuZWRpdCkge1xuICAgICAgICBzZWxmLnVwZGF0ZSgpO1xuICAgICAgICBzdG9yZS5nZXRSZWNvbW1lbmQoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLCBzZWxmLmRhdGEpO1xuICAgICAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KGRhdGEpICE9PSBKU09OLnN0cmluZ2lmeShzZWxmLmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+ODh+ODvOOCv+OBjOabtOaWsOOBleOCjOOBn+OCiO+8gScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn44Gn44O844Gf44GM44GL44KP44Gj44Gm44Gq44GE44KI77yBJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzZWxmLmVkaXQgPSB+c2VsZi5lZGl0O1xufTtcblxuc2VsZi51c2VQaWN0dXJlID0gLTE7XG5zZWxmLnRvZ2dsZVVzZVBpYyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXNlbGYuZWRpdCkgcmV0dXJuO1xuICAgIHNlbGYudXNlUGljdHVyZSA9IH5zZWxmLnVzZVBpY3R1cmU7XG59O1xuXG52YXIgaXNNb2RhbE9wZW4gPSBmYWxzZTtcbnNlbGYudG9nZ2xlTWVudUxpc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRlbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVudUxpc3QnKTtcbiAgICBpZiAoaXNNb2RhbE9wZW4pIHtcbiAgICAgICAgaXNNb2RhbE9wZW4gPSBmYWxzZTtcbiAgICAgICAgYW5pbWUoe1xuICAgICAgICAgICAgdGFyZ2V0czogJGVsZSxcbiAgICAgICAgICAgIGR1cmF0aW9uOiAzMDAsXG4gICAgICAgICAgICBlYXNpbmc6ICdlYXNlT3V0Q3ViaWMnLFxuICAgICAgICAgICAgdHJhbnNsYXRlWTogJzQwcHgnLFxuICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJGVsZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpc01vZGFsT3BlbiA9IHRydWU7XG4gICAgICAgICRlbGUuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoNDBweCknO1xuICAgICAgICAkZWxlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBhbmltZSh7XG4gICAgICAgICAgICB0YXJnZXRzOiAkZWxlLFxuICAgICAgICAgICAgZHVyYXRpb246IDQ1MCxcbiAgICAgICAgICAgIGVhc2luZzogJ2Vhc2VPdXRDdWJpYycsXG4gICAgICAgICAgICB0cmFuc2xhdGVZOiAwLFxuICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5vYnMub24oJ2NoYW5nZVJlY29tbWVuZCcsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgc2VsZi5kYXRhID0ge1xuICAgICAgICB0aXRsZTogc2VsZi5kYXRhLnRpdGxlLFxuICAgICAgICBuYW1lOiBkYXRhLm5hbWUsXG4gICAgICAgIHByaWNlOiBkYXRhLnByaWNlLFxuICAgICAgICBjb21tZW50OiBkYXRhLmNvbW1lbnQsXG4gICAgICAgIHBpYzogZGF0YS5pbWFnZSB8fCAnbm9uLXBpYydcbiAgICB9O1xuICAgIHNlbGYudXBkYXRlKCk7XG4gICAgc2VsZi50b2dnbGVNZW51TGlzdCgpO1xufSk7XG5cbnNlbGYub24oJ21vdW50JywgZnVuY3Rpb24gKCkge1xuICAgIHV0aWxzLmF1dG9SZXNpemUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbW1lbnQnKSk7XG59KTtcblxuc3RvcmUuZ2V0UmVjb21tZW5kKCdnZXRSZWMnKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgc2VsZi5kYXRhID0gZGF0YTtcbiAgICBzZWxmLnVwZGF0ZSgpO1xufSk7XG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9zY3JpcHRzL3RhZ3MvcmVjb21tZW5kLnRhZ1xuICoqLyIsIi8qXG4gKiBKU09O44KS5Y+C54Wn44GX44Gm5L+d5oyB44GZ44KL44Oi44K444Ol44O844OrU1FVSVJFXG4gKiDjgrfjg7PjgrDjg6vjg4jjg7PjgafnrqHnkIbjgZnjgovjgZ/jgoHjgqLjgq/jgrvjgrnjgpLmipHjgYjjgonjgozjgovvvIjjga/jgZrvvIlcbiAqL1xuXG5jb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgnc3VwZXJhZ2VudCcpO1xuXG5jb25zdCBkYXRhU3RvcmUgPSB7XG5cdHJlYzogbnVsbCxcblx0bWVudTogbnVsbFxufVxuXG5jb25zdCB1cGRhdGVkID0ge1xuXHRyZWM6IGZhbHNlXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRnZXRSZWNvbW1lbmQ6ICgpID0+IHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0Ly8g5Y+W5b6X5riI44G/44Gu5aC05ZCIXG5cdFx0XHRpZihkYXRhU3RvcmUucmVjKSB7XG5cdFx0XHRcdHJlc29sdmUoZGF0YVN0b3JlLnJlYyk7XG5cdFx0XHR9XG5cdFx0XHQvLyDlj5blvpfjgZXjgozjgabjgYTjgarjgYTloLTlkIhcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRyZXF1ZXN0XG5cdFx0XHRcdFx0LmdldCgnLi9zdG9yZS9yZWNvbW1lbmQuanNvbicpXG5cdFx0XHRcdFx0LmVuZCgoZXJyLCByZXMpID0+IHtcblx0XHRcdFx0XHRcdGlmKGVycikge1xuXHRcdFx0XHRcdFx0XHRyZWplY3QoZXJyKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZGF0YVN0b3JlLnJlYyA9IHJlcy5ib2R5O1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShyZXMuYm9keSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9KTtcblx0fSxcblx0Z2V0TWVudUxpc3Q6ICgpID0+IHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0Ly8g5Y+W5b6X5riI44G/44Gu5aC05ZCIXG5cdFx0XHRpZihkYXRhU3RvcmUubWVudSkge1xuXHRcdFx0XHRyZXNvbHZlKGRhdGFTdG9yZS5tZW51KTtcblx0XHRcdH1cblx0XHRcdC8vIOWPluW+l+OBleOCjOOBpuOBhOOBquOBhOWgtOWQiFxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHJlcXVlc3Rcblx0XHRcdFx0XHQuZ2V0KCcuL3N0b3JlL21lbnUtbGlzdC5qc29uJylcblx0XHRcdFx0XHQuZW5kKChlcnIsIHJlcykgPT4ge1xuXHRcdFx0XHRcdFx0aWYoZXJyKSB7XG5cdFx0XHRcdFx0XHRcdHJlamVjdChlcnIpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRkYXRhU3RvcmUubWVudSA9IHJlcy5ib2R5O1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShyZXMuYm9keSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9zY3JpcHRzL3N0b3JlLmpzXG4gKiovIiwiLyoqXG4gKiBSb290IHJlZmVyZW5jZSBmb3IgaWZyYW1lcy5cbiAqL1xuXG52YXIgcm9vdDtcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgeyAvLyBCcm93c2VyIHdpbmRvd1xuICByb290ID0gd2luZG93O1xufSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHsgLy8gV2ViIFdvcmtlclxuICByb290ID0gc2VsZjtcbn0gZWxzZSB7IC8vIE90aGVyIGVudmlyb25tZW50c1xuICBjb25zb2xlLndhcm4oXCJVc2luZyBicm93c2VyLW9ubHkgdmVyc2lvbiBvZiBzdXBlcmFnZW50IGluIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuICByb290ID0gdGhpcztcbn1cblxudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCdlbWl0dGVyJyk7XG52YXIgcmVxdWVzdEJhc2UgPSByZXF1aXJlKCcuL3JlcXVlc3QtYmFzZScpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pcy1vYmplY3QnKTtcblxuLyoqXG4gKiBOb29wLlxuICovXG5cbmZ1bmN0aW9uIG5vb3AoKXt9O1xuXG4vKipcbiAqIEV4cG9zZSBgcmVxdWVzdGAuXG4gKi9cblxudmFyIHJlcXVlc3QgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vcmVxdWVzdCcpLmJpbmQobnVsbCwgUmVxdWVzdCk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIFhIUi5cbiAqL1xuXG5yZXF1ZXN0LmdldFhIUiA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHJvb3QuWE1MSHR0cFJlcXVlc3RcbiAgICAgICYmICghcm9vdC5sb2NhdGlvbiB8fCAnZmlsZTonICE9IHJvb3QubG9jYXRpb24ucHJvdG9jb2xcbiAgICAgICAgICB8fCAhcm9vdC5BY3RpdmVYT2JqZWN0KSkge1xuICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3Q7XG4gIH0gZWxzZSB7XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpOyB9IGNhdGNoKGUpIHt9XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUC42LjAnKTsgfSBjYXRjaChlKSB7fVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAuMy4wJyk7IH0gY2F0Y2goZSkge31cbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQJyk7IH0gY2F0Y2goZSkge31cbiAgfVxuICB0aHJvdyBFcnJvcihcIkJyb3dzZXItb25seSB2ZXJpc29uIG9mIHN1cGVyYWdlbnQgY291bGQgbm90IGZpbmQgWEhSXCIpO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UsIGFkZGVkIHRvIHN1cHBvcnQgSUUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbnZhciB0cmltID0gJycudHJpbVxuICA/IGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHMudHJpbSgpOyB9XG4gIDogZnVuY3Rpb24ocykgeyByZXR1cm4gcy5yZXBsYWNlKC8oXlxccyp8XFxzKiQpL2csICcnKTsgfTtcblxuLyoqXG4gKiBTZXJpYWxpemUgdGhlIGdpdmVuIGBvYmpgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZShvYmopIHtcbiAgaWYgKCFpc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICB2YXIgcGFpcnMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIHB1c2hFbmNvZGVkS2V5VmFsdWVQYWlyKHBhaXJzLCBrZXksIG9ialtrZXldKTtcbiAgfVxuICByZXR1cm4gcGFpcnMuam9pbignJicpO1xufVxuXG4vKipcbiAqIEhlbHBzICdzZXJpYWxpemUnIHdpdGggc2VyaWFsaXppbmcgYXJyYXlzLlxuICogTXV0YXRlcyB0aGUgcGFpcnMgYXJyYXkuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gcGFpcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuICovXG5cbmZ1bmN0aW9uIHB1c2hFbmNvZGVkS2V5VmFsdWVQYWlyKHBhaXJzLCBrZXksIHZhbCkge1xuICBpZiAodmFsICE9IG51bGwpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICB2YWwuZm9yRWFjaChmdW5jdGlvbih2KSB7XG4gICAgICAgIHB1c2hFbmNvZGVkS2V5VmFsdWVQYWlyKHBhaXJzLCBrZXksIHYpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChpc09iamVjdCh2YWwpKSB7XG4gICAgICBmb3IodmFyIHN1YmtleSBpbiB2YWwpIHtcbiAgICAgICAgcHVzaEVuY29kZWRLZXlWYWx1ZVBhaXIocGFpcnMsIGtleSArICdbJyArIHN1YmtleSArICddJywgdmFsW3N1YmtleV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwYWlycy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpXG4gICAgICAgICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkpO1xuICAgIH1cbiAgfSBlbHNlIGlmICh2YWwgPT09IG51bGwpIHtcbiAgICBwYWlycy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpKTtcbiAgfVxufVxuXG4vKipcbiAqIEV4cG9zZSBzZXJpYWxpemF0aW9uIG1ldGhvZC5cbiAqL1xuXG4gcmVxdWVzdC5zZXJpYWxpemVPYmplY3QgPSBzZXJpYWxpemU7XG5cbiAvKipcbiAgKiBQYXJzZSB0aGUgZ2l2ZW4geC13d3ctZm9ybS11cmxlbmNvZGVkIGBzdHJgLlxuICAqXG4gICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAqIEByZXR1cm4ge09iamVjdH1cbiAgKiBAYXBpIHByaXZhdGVcbiAgKi9cblxuZnVuY3Rpb24gcGFyc2VTdHJpbmcoc3RyKSB7XG4gIHZhciBvYmogPSB7fTtcbiAgdmFyIHBhaXJzID0gc3RyLnNwbGl0KCcmJyk7XG4gIHZhciBwYWlyO1xuICB2YXIgcG9zO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBwYWlycy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIHBhaXIgPSBwYWlyc1tpXTtcbiAgICBwb3MgPSBwYWlyLmluZGV4T2YoJz0nKTtcbiAgICBpZiAocG9zID09IC0xKSB7XG4gICAgICBvYmpbZGVjb2RlVVJJQ29tcG9uZW50KHBhaXIpXSA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmpbZGVjb2RlVVJJQ29tcG9uZW50KHBhaXIuc2xpY2UoMCwgcG9zKSldID1cbiAgICAgICAgZGVjb2RlVVJJQ29tcG9uZW50KHBhaXIuc2xpY2UocG9zICsgMSkpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogRXhwb3NlIHBhcnNlci5cbiAqL1xuXG5yZXF1ZXN0LnBhcnNlU3RyaW5nID0gcGFyc2VTdHJpbmc7XG5cbi8qKlxuICogRGVmYXVsdCBNSU1FIHR5cGUgbWFwLlxuICpcbiAqICAgICBzdXBlcmFnZW50LnR5cGVzLnhtbCA9ICdhcHBsaWNhdGlvbi94bWwnO1xuICpcbiAqL1xuXG5yZXF1ZXN0LnR5cGVzID0ge1xuICBodG1sOiAndGV4dC9odG1sJyxcbiAganNvbjogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICB4bWw6ICdhcHBsaWNhdGlvbi94bWwnLFxuICB1cmxlbmNvZGVkOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgJ2Zvcm0nOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgJ2Zvcm0tZGF0YSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG4vKipcbiAqIERlZmF1bHQgc2VyaWFsaXphdGlvbiBtYXAuXG4gKlxuICogICAgIHN1cGVyYWdlbnQuc2VyaWFsaXplWydhcHBsaWNhdGlvbi94bWwnXSA9IGZ1bmN0aW9uKG9iail7XG4gKiAgICAgICByZXR1cm4gJ2dlbmVyYXRlZCB4bWwgaGVyZSc7XG4gKiAgICAgfTtcbiAqXG4gKi9cblxuIHJlcXVlc3Quc2VyaWFsaXplID0ge1xuICAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc6IHNlcmlhbGl6ZSxcbiAgICdhcHBsaWNhdGlvbi9qc29uJzogSlNPTi5zdHJpbmdpZnlcbiB9O1xuXG4gLyoqXG4gICogRGVmYXVsdCBwYXJzZXJzLlxuICAqXG4gICogICAgIHN1cGVyYWdlbnQucGFyc2VbJ2FwcGxpY2F0aW9uL3htbCddID0gZnVuY3Rpb24oc3RyKXtcbiAgKiAgICAgICByZXR1cm4geyBvYmplY3QgcGFyc2VkIGZyb20gc3RyIH07XG4gICogICAgIH07XG4gICpcbiAgKi9cblxucmVxdWVzdC5wYXJzZSA9IHtcbiAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc6IHBhcnNlU3RyaW5nLFxuICAnYXBwbGljYXRpb24vanNvbic6IEpTT04ucGFyc2Vcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGhlYWRlciBgc3RyYCBpbnRvXG4gKiBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgbWFwcGVkIGZpZWxkcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZUhlYWRlcihzdHIpIHtcbiAgdmFyIGxpbmVzID0gc3RyLnNwbGl0KC9cXHI/XFxuLyk7XG4gIHZhciBmaWVsZHMgPSB7fTtcbiAgdmFyIGluZGV4O1xuICB2YXIgbGluZTtcbiAgdmFyIGZpZWxkO1xuICB2YXIgdmFsO1xuXG4gIGxpbmVzLnBvcCgpOyAvLyB0cmFpbGluZyBDUkxGXG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgbGluZSA9IGxpbmVzW2ldO1xuICAgIGluZGV4ID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAgZmllbGQgPSBsaW5lLnNsaWNlKDAsIGluZGV4KS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IHRyaW0obGluZS5zbGljZShpbmRleCArIDEpKTtcbiAgICBmaWVsZHNbZmllbGRdID0gdmFsO1xuICB9XG5cbiAgcmV0dXJuIGZpZWxkcztcbn1cblxuLyoqXG4gKiBDaGVjayBpZiBgbWltZWAgaXMganNvbiBvciBoYXMgK2pzb24gc3RydWN0dXJlZCBzeW50YXggc3VmZml4LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtaW1lXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaXNKU09OKG1pbWUpIHtcbiAgcmV0dXJuIC9bXFwvK11qc29uXFxiLy50ZXN0KG1pbWUpO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgbWltZSB0eXBlIGZvciB0aGUgZ2l2ZW4gYHN0cmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gdHlwZShzdHIpe1xuICByZXR1cm4gc3RyLnNwbGl0KC8gKjsgKi8pLnNoaWZ0KCk7XG59O1xuXG4vKipcbiAqIFJldHVybiBoZWFkZXIgZmllbGQgcGFyYW1ldGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJhbXMoc3RyKXtcbiAgcmV0dXJuIHN0ci5zcGxpdCgvICo7ICovKS5yZWR1Y2UoZnVuY3Rpb24ob2JqLCBzdHIpe1xuICAgIHZhciBwYXJ0cyA9IHN0ci5zcGxpdCgvICo9ICovKSxcbiAgICAgICAga2V5ID0gcGFydHMuc2hpZnQoKSxcbiAgICAgICAgdmFsID0gcGFydHMuc2hpZnQoKTtcblxuICAgIGlmIChrZXkgJiYgdmFsKSBvYmpba2V5XSA9IHZhbDtcbiAgICByZXR1cm4gb2JqO1xuICB9LCB7fSk7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlc3BvbnNlYCB3aXRoIHRoZSBnaXZlbiBgeGhyYC5cbiAqXG4gKiAgLSBzZXQgZmxhZ3MgKC5vaywgLmVycm9yLCBldGMpXG4gKiAgLSBwYXJzZSBoZWFkZXJcbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgQWxpYXNpbmcgYHN1cGVyYWdlbnRgIGFzIGByZXF1ZXN0YCBpcyBuaWNlOlxuICpcbiAqICAgICAgcmVxdWVzdCA9IHN1cGVyYWdlbnQ7XG4gKlxuICogIFdlIGNhbiB1c2UgdGhlIHByb21pc2UtbGlrZSBBUEksIG9yIHBhc3MgY2FsbGJhY2tzOlxuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nKS5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nLCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqICBTZW5kaW5nIGRhdGEgY2FuIGJlIGNoYWluZWQ6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogIE9yIHBhc3NlZCB0byBgLnNlbmQoKWA6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiAgT3IgcGFzc2VkIHRvIGAucG9zdCgpYDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogT3IgZnVydGhlciByZWR1Y2VkIHRvIGEgc2luZ2xlIGNhbGwgZm9yIHNpbXBsZSBjYXNlczpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiBAcGFyYW0ge1hNTEhUVFBSZXF1ZXN0fSB4aHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBSZXNwb25zZShyZXEsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHRoaXMucmVxID0gcmVxO1xuICB0aGlzLnhociA9IHRoaXMucmVxLnhocjtcbiAgLy8gcmVzcG9uc2VUZXh0IGlzIGFjY2Vzc2libGUgb25seSBpZiByZXNwb25zZVR5cGUgaXMgJycgb3IgJ3RleHQnIGFuZCBvbiBvbGRlciBicm93c2Vyc1xuICB0aGlzLnRleHQgPSAoKHRoaXMucmVxLm1ldGhvZCAhPSdIRUFEJyAmJiAodGhpcy54aHIucmVzcG9uc2VUeXBlID09PSAnJyB8fCB0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JykpIHx8IHR5cGVvZiB0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICd1bmRlZmluZWQnKVxuICAgICA/IHRoaXMueGhyLnJlc3BvbnNlVGV4dFxuICAgICA6IG51bGw7XG4gIHRoaXMuc3RhdHVzVGV4dCA9IHRoaXMucmVxLnhoci5zdGF0dXNUZXh0O1xuICB0aGlzLl9zZXRTdGF0dXNQcm9wZXJ0aWVzKHRoaXMueGhyLnN0YXR1cyk7XG4gIHRoaXMuaGVhZGVyID0gdGhpcy5oZWFkZXJzID0gcGFyc2VIZWFkZXIodGhpcy54aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpO1xuICAvLyBnZXRBbGxSZXNwb25zZUhlYWRlcnMgc29tZXRpbWVzIGZhbHNlbHkgcmV0dXJucyBcIlwiIGZvciBDT1JTIHJlcXVlc3RzLCBidXRcbiAgLy8gZ2V0UmVzcG9uc2VIZWFkZXIgc3RpbGwgd29ya3MuIHNvIHdlIGdldCBjb250ZW50LXR5cGUgZXZlbiBpZiBnZXR0aW5nXG4gIC8vIG90aGVyIGhlYWRlcnMgZmFpbHMuXG4gIHRoaXMuaGVhZGVyWydjb250ZW50LXR5cGUnXSA9IHRoaXMueGhyLmdldFJlc3BvbnNlSGVhZGVyKCdjb250ZW50LXR5cGUnKTtcbiAgdGhpcy5fc2V0SGVhZGVyUHJvcGVydGllcyh0aGlzLmhlYWRlcik7XG4gIHRoaXMuYm9keSA9IHRoaXMucmVxLm1ldGhvZCAhPSAnSEVBRCdcbiAgICA/IHRoaXMuX3BhcnNlQm9keSh0aGlzLnRleHQgPyB0aGlzLnRleHQgOiB0aGlzLnhoci5yZXNwb25zZSlcbiAgICA6IG51bGw7XG59XG5cbi8qKlxuICogR2V0IGNhc2UtaW5zZW5zaXRpdmUgYGZpZWxkYCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGZpZWxkKXtcbiAgcmV0dXJuIHRoaXMuaGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xufTtcblxuLyoqXG4gKiBTZXQgaGVhZGVyIHJlbGF0ZWQgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gYC50eXBlYCB0aGUgY29udGVudCB0eXBlIHdpdGhvdXQgcGFyYW1zXG4gKlxuICogQSByZXNwb25zZSBvZiBcIkNvbnRlbnQtVHlwZTogdGV4dC9wbGFpbjsgY2hhcnNldD11dGYtOFwiXG4gKiB3aWxsIHByb3ZpZGUgeW91IHdpdGggYSBgLnR5cGVgIG9mIFwidGV4dC9wbGFpblwiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5fc2V0SGVhZGVyUHJvcGVydGllcyA9IGZ1bmN0aW9uKGhlYWRlcil7XG4gIC8vIGNvbnRlbnQtdHlwZVxuICB2YXIgY3QgPSB0aGlzLmhlYWRlclsnY29udGVudC10eXBlJ10gfHwgJyc7XG4gIHRoaXMudHlwZSA9IHR5cGUoY3QpO1xuXG4gIC8vIHBhcmFtc1xuICB2YXIgb2JqID0gcGFyYW1zKGN0KTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikgdGhpc1trZXldID0gb2JqW2tleV07XG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBib2R5IGBzdHJgLlxuICpcbiAqIFVzZWQgZm9yIGF1dG8tcGFyc2luZyBvZiBib2RpZXMuIFBhcnNlcnNcbiAqIGFyZSBkZWZpbmVkIG9uIHRoZSBgc3VwZXJhZ2VudC5wYXJzZWAgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge01peGVkfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLl9wYXJzZUJvZHkgPSBmdW5jdGlvbihzdHIpe1xuICB2YXIgcGFyc2UgPSByZXF1ZXN0LnBhcnNlW3RoaXMudHlwZV07XG4gIGlmICghcGFyc2UgJiYgaXNKU09OKHRoaXMudHlwZSkpIHtcbiAgICBwYXJzZSA9IHJlcXVlc3QucGFyc2VbJ2FwcGxpY2F0aW9uL2pzb24nXTtcbiAgfVxuICByZXR1cm4gcGFyc2UgJiYgc3RyICYmIChzdHIubGVuZ3RoIHx8IHN0ciBpbnN0YW5jZW9mIE9iamVjdClcbiAgICA/IHBhcnNlKHN0cilcbiAgICA6IG51bGw7XG59O1xuXG4vKipcbiAqIFNldCBmbGFncyBzdWNoIGFzIGAub2tgIGJhc2VkIG9uIGBzdGF0dXNgLlxuICpcbiAqIEZvciBleGFtcGxlIGEgMnh4IHJlc3BvbnNlIHdpbGwgZ2l2ZSB5b3UgYSBgLm9rYCBvZiBfX3RydWVfX1xuICogd2hlcmVhcyA1eHggd2lsbCBiZSBfX2ZhbHNlX18gYW5kIGAuZXJyb3JgIHdpbGwgYmUgX190cnVlX18uIFRoZVxuICogYC5jbGllbnRFcnJvcmAgYW5kIGAuc2VydmVyRXJyb3JgIGFyZSBhbHNvIGF2YWlsYWJsZSB0byBiZSBtb3JlXG4gKiBzcGVjaWZpYywgYW5kIGAuc3RhdHVzVHlwZWAgaXMgdGhlIGNsYXNzIG9mIGVycm9yIHJhbmdpbmcgZnJvbSAxLi41XG4gKiBzb21ldGltZXMgdXNlZnVsIGZvciBtYXBwaW5nIHJlc3BvbmQgY29sb3JzIGV0Yy5cbiAqXG4gKiBcInN1Z2FyXCIgcHJvcGVydGllcyBhcmUgYWxzbyBkZWZpbmVkIGZvciBjb21tb24gY2FzZXMuIEN1cnJlbnRseSBwcm92aWRpbmc6XG4gKlxuICogICAtIC5ub0NvbnRlbnRcbiAqICAgLSAuYmFkUmVxdWVzdFxuICogICAtIC51bmF1dGhvcml6ZWRcbiAqICAgLSAubm90QWNjZXB0YWJsZVxuICogICAtIC5ub3RGb3VuZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5fc2V0U3RhdHVzUHJvcGVydGllcyA9IGZ1bmN0aW9uKHN0YXR1cyl7XG4gIC8vIGhhbmRsZSBJRTkgYnVnOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwMDQ2OTcyL21zaWUtcmV0dXJucy1zdGF0dXMtY29kZS1vZi0xMjIzLWZvci1hamF4LXJlcXVlc3RcbiAgaWYgKHN0YXR1cyA9PT0gMTIyMykge1xuICAgIHN0YXR1cyA9IDIwNDtcbiAgfVxuXG4gIHZhciB0eXBlID0gc3RhdHVzIC8gMTAwIHwgMDtcblxuICAvLyBzdGF0dXMgLyBjbGFzc1xuICB0aGlzLnN0YXR1cyA9IHRoaXMuc3RhdHVzQ29kZSA9IHN0YXR1cztcbiAgdGhpcy5zdGF0dXNUeXBlID0gdHlwZTtcblxuICAvLyBiYXNpY3NcbiAgdGhpcy5pbmZvID0gMSA9PSB0eXBlO1xuICB0aGlzLm9rID0gMiA9PSB0eXBlO1xuICB0aGlzLmNsaWVudEVycm9yID0gNCA9PSB0eXBlO1xuICB0aGlzLnNlcnZlckVycm9yID0gNSA9PSB0eXBlO1xuICB0aGlzLmVycm9yID0gKDQgPT0gdHlwZSB8fCA1ID09IHR5cGUpXG4gICAgPyB0aGlzLnRvRXJyb3IoKVxuICAgIDogZmFsc2U7XG5cbiAgLy8gc3VnYXJcbiAgdGhpcy5hY2NlcHRlZCA9IDIwMiA9PSBzdGF0dXM7XG4gIHRoaXMubm9Db250ZW50ID0gMjA0ID09IHN0YXR1cztcbiAgdGhpcy5iYWRSZXF1ZXN0ID0gNDAwID09IHN0YXR1cztcbiAgdGhpcy51bmF1dGhvcml6ZWQgPSA0MDEgPT0gc3RhdHVzO1xuICB0aGlzLm5vdEFjY2VwdGFibGUgPSA0MDYgPT0gc3RhdHVzO1xuICB0aGlzLm5vdEZvdW5kID0gNDA0ID09IHN0YXR1cztcbiAgdGhpcy5mb3JiaWRkZW4gPSA0MDMgPT0gc3RhdHVzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYW4gYEVycm9yYCByZXByZXNlbnRhdGl2ZSBvZiB0aGlzIHJlc3BvbnNlLlxuICpcbiAqIEByZXR1cm4ge0Vycm9yfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUudG9FcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciByZXEgPSB0aGlzLnJlcTtcbiAgdmFyIG1ldGhvZCA9IHJlcS5tZXRob2Q7XG4gIHZhciB1cmwgPSByZXEudXJsO1xuXG4gIHZhciBtc2cgPSAnY2Fubm90ICcgKyBtZXRob2QgKyAnICcgKyB1cmwgKyAnICgnICsgdGhpcy5zdGF0dXMgKyAnKSc7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IobXNnKTtcbiAgZXJyLnN0YXR1cyA9IHRoaXMuc3RhdHVzO1xuICBlcnIubWV0aG9kID0gbWV0aG9kO1xuICBlcnIudXJsID0gdXJsO1xuXG4gIHJldHVybiBlcnI7XG59O1xuXG4vKipcbiAqIEV4cG9zZSBgUmVzcG9uc2VgLlxuICovXG5cbnJlcXVlc3QuUmVzcG9uc2UgPSBSZXNwb25zZTtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBSZXF1ZXN0YCB3aXRoIHRoZSBnaXZlbiBgbWV0aG9kYCBhbmQgYHVybGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBSZXF1ZXN0KG1ldGhvZCwgdXJsKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5fcXVlcnkgPSB0aGlzLl9xdWVyeSB8fCBbXTtcbiAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gIHRoaXMudXJsID0gdXJsO1xuICB0aGlzLmhlYWRlciA9IHt9OyAvLyBwcmVzZXJ2ZXMgaGVhZGVyIG5hbWUgY2FzZVxuICB0aGlzLl9oZWFkZXIgPSB7fTsgLy8gY29lcmNlcyBoZWFkZXIgbmFtZXMgdG8gbG93ZXJjYXNlXG4gIHRoaXMub24oJ2VuZCcsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIGVyciA9IG51bGw7XG4gICAgdmFyIHJlcyA9IG51bGw7XG5cbiAgICB0cnkge1xuICAgICAgcmVzID0gbmV3IFJlc3BvbnNlKHNlbGYpO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgZXJyID0gbmV3IEVycm9yKCdQYXJzZXIgaXMgdW5hYmxlIHRvIHBhcnNlIHRoZSByZXNwb25zZScpO1xuICAgICAgZXJyLnBhcnNlID0gdHJ1ZTtcbiAgICAgIGVyci5vcmlnaW5hbCA9IGU7XG4gICAgICAvLyBpc3N1ZSAjNjc1OiByZXR1cm4gdGhlIHJhdyByZXNwb25zZSBpZiB0aGUgcmVzcG9uc2UgcGFyc2luZyBmYWlsc1xuICAgICAgZXJyLnJhd1Jlc3BvbnNlID0gc2VsZi54aHIgJiYgc2VsZi54aHIucmVzcG9uc2VUZXh0ID8gc2VsZi54aHIucmVzcG9uc2VUZXh0IDogbnVsbDtcbiAgICAgIC8vIGlzc3VlICM4NzY6IHJldHVybiB0aGUgaHR0cCBzdGF0dXMgY29kZSBpZiB0aGUgcmVzcG9uc2UgcGFyc2luZyBmYWlsc1xuICAgICAgZXJyLnN0YXR1c0NvZGUgPSBzZWxmLnhociAmJiBzZWxmLnhoci5zdGF0dXMgPyBzZWxmLnhoci5zdGF0dXMgOiBudWxsO1xuICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soZXJyKTtcbiAgICB9XG5cbiAgICBzZWxmLmVtaXQoJ3Jlc3BvbnNlJywgcmVzKTtcblxuICAgIHZhciBuZXdfZXJyO1xuICAgIHRyeSB7XG4gICAgICBpZiAocmVzLnN0YXR1cyA8IDIwMCB8fCByZXMuc3RhdHVzID49IDMwMCkge1xuICAgICAgICBuZXdfZXJyID0gbmV3IEVycm9yKHJlcy5zdGF0dXNUZXh0IHx8ICdVbnN1Y2Nlc3NmdWwgSFRUUCByZXNwb25zZScpO1xuICAgICAgICBuZXdfZXJyLm9yaWdpbmFsID0gZXJyO1xuICAgICAgICBuZXdfZXJyLnJlc3BvbnNlID0gcmVzO1xuICAgICAgICBuZXdfZXJyLnN0YXR1cyA9IHJlcy5zdGF0dXM7XG4gICAgICB9XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBuZXdfZXJyID0gZTsgLy8gIzk4NSB0b3VjaGluZyByZXMgbWF5IGNhdXNlIElOVkFMSURfU1RBVEVfRVJSIG9uIG9sZCBBbmRyb2lkXG4gICAgfVxuXG4gICAgLy8gIzEwMDAgZG9uJ3QgY2F0Y2ggZXJyb3JzIGZyb20gdGhlIGNhbGxiYWNrIHRvIGF2b2lkIGRvdWJsZSBjYWxsaW5nIGl0XG4gICAgaWYgKG5ld19lcnIpIHtcbiAgICAgIHNlbGYuY2FsbGJhY2sobmV3X2VyciwgcmVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5jYWxsYmFjayhudWxsLCByZXMpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogTWl4aW4gYEVtaXR0ZXJgIGFuZCBgcmVxdWVzdEJhc2VgLlxuICovXG5cbkVtaXR0ZXIoUmVxdWVzdC5wcm90b3R5cGUpO1xuZm9yICh2YXIga2V5IGluIHJlcXVlc3RCYXNlKSB7XG4gIFJlcXVlc3QucHJvdG90eXBlW2tleV0gPSByZXF1ZXN0QmFzZVtrZXldO1xufVxuXG4vKipcbiAqIFNldCBDb250ZW50LVR5cGUgdG8gYHR5cGVgLCBtYXBwaW5nIHZhbHVlcyBmcm9tIGByZXF1ZXN0LnR5cGVzYC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHN1cGVyYWdlbnQudHlwZXMueG1sID0gJ2FwcGxpY2F0aW9uL3htbCc7XG4gKlxuICogICAgICByZXF1ZXN0LnBvc3QoJy8nKVxuICogICAgICAgIC50eXBlKCd4bWwnKVxuICogICAgICAgIC5zZW5kKHhtbHN0cmluZylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcXVlc3QucG9zdCgnLycpXG4gKiAgICAgICAgLnR5cGUoJ2FwcGxpY2F0aW9uL3htbCcpXG4gKiAgICAgICAgLnNlbmQoeG1sc3RyaW5nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudHlwZSA9IGZ1bmN0aW9uKHR5cGUpe1xuICB0aGlzLnNldCgnQ29udGVudC1UeXBlJywgcmVxdWVzdC50eXBlc1t0eXBlXSB8fCB0eXBlKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCByZXNwb25zZVR5cGUgdG8gYHZhbGAuIFByZXNlbnRseSB2YWxpZCByZXNwb25zZVR5cGVzIGFyZSAnYmxvYicgYW5kXG4gKiAnYXJyYXlidWZmZXInLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnJlc3BvbnNlVHlwZSgnYmxvYicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnJlc3BvbnNlVHlwZSA9IGZ1bmN0aW9uKHZhbCl7XG4gIHRoaXMuX3Jlc3BvbnNlVHlwZSA9IHZhbDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBBY2NlcHQgdG8gYHR5cGVgLCBtYXBwaW5nIHZhbHVlcyBmcm9tIGByZXF1ZXN0LnR5cGVzYC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHN1cGVyYWdlbnQudHlwZXMuanNvbiA9ICdhcHBsaWNhdGlvbi9qc29uJztcbiAqXG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvYWdlbnQnKVxuICogICAgICAgIC5hY2NlcHQoJ2pzb24nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy9hZ2VudCcpXG4gKiAgICAgICAgLmFjY2VwdCgnYXBwbGljYXRpb24vanNvbicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFjY2VwdFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmFjY2VwdCA9IGZ1bmN0aW9uKHR5cGUpe1xuICB0aGlzLnNldCgnQWNjZXB0JywgcmVxdWVzdC50eXBlc1t0eXBlXSB8fCB0eXBlKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBBdXRob3JpemF0aW9uIGZpZWxkIHZhbHVlIHdpdGggYHVzZXJgIGFuZCBgcGFzc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVzZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyB3aXRoICd0eXBlJyBwcm9wZXJ0eSAnYXV0bycgb3IgJ2Jhc2ljJyAoZGVmYXVsdCAnYmFzaWMnKVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmF1dGggPSBmdW5jdGlvbih1c2VyLCBwYXNzLCBvcHRpb25zKXtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIHR5cGU6ICdiYXNpYydcbiAgICB9XG4gIH1cblxuICBzd2l0Y2ggKG9wdGlvbnMudHlwZSkge1xuICAgIGNhc2UgJ2Jhc2ljJzpcbiAgICAgIHZhciBzdHIgPSBidG9hKHVzZXIgKyAnOicgKyBwYXNzKTtcbiAgICAgIHRoaXMuc2V0KCdBdXRob3JpemF0aW9uJywgJ0Jhc2ljICcgKyBzdHIpO1xuICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnYXV0byc6XG4gICAgICB0aGlzLnVzZXJuYW1lID0gdXNlcjtcbiAgICAgIHRoaXMucGFzc3dvcmQgPSBwYXNzO1xuICAgIGJyZWFrO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4qIEFkZCBxdWVyeS1zdHJpbmcgYHZhbGAuXG4qXG4qIEV4YW1wbGVzOlxuKlxuKiAgIHJlcXVlc3QuZ2V0KCcvc2hvZXMnKVxuKiAgICAgLnF1ZXJ5KCdzaXplPTEwJylcbiogICAgIC5xdWVyeSh7IGNvbG9yOiAnYmx1ZScgfSlcbipcbiogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSB2YWxcbiogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4qIEBhcGkgcHVibGljXG4qL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uKHZhbCl7XG4gIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgdmFsKSB2YWwgPSBzZXJpYWxpemUodmFsKTtcbiAgaWYgKHZhbCkgdGhpcy5fcXVlcnkucHVzaCh2YWwpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUXVldWUgdGhlIGdpdmVuIGBmaWxlYCBhcyBhbiBhdHRhY2htZW50IHRvIHRoZSBzcGVjaWZpZWQgYGZpZWxkYCxcbiAqIHdpdGggb3B0aW9uYWwgYGZpbGVuYW1lYC5cbiAqXG4gKiBgYGAganNcbiAqIHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gKiAgIC5hdHRhY2goJ2NvbnRlbnQnLCBuZXcgQmxvYihbJzxhIGlkPVwiYVwiPjxiIGlkPVwiYlwiPmhleSE8L2I+PC9hPiddLCB7IHR5cGU6IFwidGV4dC9odG1sXCJ9KSlcbiAqICAgLmVuZChjYWxsYmFjayk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEBwYXJhbSB7QmxvYnxGaWxlfSBmaWxlXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWVcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hdHRhY2ggPSBmdW5jdGlvbihmaWVsZCwgZmlsZSwgZmlsZW5hbWUpe1xuICB0aGlzLl9nZXRGb3JtRGF0YSgpLmFwcGVuZChmaWVsZCwgZmlsZSwgZmlsZW5hbWUgfHwgZmlsZS5uYW1lKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5fZ2V0Rm9ybURhdGEgPSBmdW5jdGlvbigpe1xuICBpZiAoIXRoaXMuX2Zvcm1EYXRhKSB7XG4gICAgdGhpcy5fZm9ybURhdGEgPSBuZXcgcm9vdC5Gb3JtRGF0YSgpO1xuICB9XG4gIHJldHVybiB0aGlzLl9mb3JtRGF0YTtcbn07XG5cbi8qKlxuICogSW52b2tlIHRoZSBjYWxsYmFjayB3aXRoIGBlcnJgIGFuZCBgcmVzYFxuICogYW5kIGhhbmRsZSBhcml0eSBjaGVjay5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7UmVzcG9uc2V9IHJlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY2FsbGJhY2sgPSBmdW5jdGlvbihlcnIsIHJlcyl7XG4gIHZhciBmbiA9IHRoaXMuX2NhbGxiYWNrO1xuICB0aGlzLmNsZWFyVGltZW91dCgpO1xuICBmbihlcnIsIHJlcyk7XG59O1xuXG4vKipcbiAqIEludm9rZSBjYWxsYmFjayB3aXRoIHgtZG9tYWluIGVycm9yLlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmNyb3NzRG9tYWluRXJyb3IgPSBmdW5jdGlvbigpe1xuICB2YXIgZXJyID0gbmV3IEVycm9yKCdSZXF1ZXN0IGhhcyBiZWVuIHRlcm1pbmF0ZWRcXG5Qb3NzaWJsZSBjYXVzZXM6IHRoZSBuZXR3b3JrIGlzIG9mZmxpbmUsIE9yaWdpbiBpcyBub3QgYWxsb3dlZCBieSBBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4sIHRoZSBwYWdlIGlzIGJlaW5nIHVubG9hZGVkLCBldGMuJyk7XG4gIGVyci5jcm9zc0RvbWFpbiA9IHRydWU7XG5cbiAgZXJyLnN0YXR1cyA9IHRoaXMuc3RhdHVzO1xuICBlcnIubWV0aG9kID0gdGhpcy5tZXRob2Q7XG4gIGVyci51cmwgPSB0aGlzLnVybDtcblxuICB0aGlzLmNhbGxiYWNrKGVycik7XG59O1xuXG4vKipcbiAqIEludm9rZSBjYWxsYmFjayB3aXRoIHRpbWVvdXQgZXJyb3IuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuX3RpbWVvdXRFcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciB0aW1lb3V0ID0gdGhpcy5fdGltZW91dDtcbiAgdmFyIGVyciA9IG5ldyBFcnJvcigndGltZW91dCBvZiAnICsgdGltZW91dCArICdtcyBleGNlZWRlZCcpO1xuICBlcnIudGltZW91dCA9IHRpbWVvdXQ7XG4gIHRoaXMuY2FsbGJhY2soZXJyKTtcbn07XG5cbi8qKlxuICogQ29tcG9zZSBxdWVyeXN0cmluZyB0byBhcHBlbmQgdG8gcmVxLnVybFxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLl9hcHBlbmRRdWVyeVN0cmluZyA9IGZ1bmN0aW9uKCl7XG4gIHZhciBxdWVyeSA9IHRoaXMuX3F1ZXJ5LmpvaW4oJyYnKTtcbiAgaWYgKHF1ZXJ5KSB7XG4gICAgdGhpcy51cmwgKz0gfnRoaXMudXJsLmluZGV4T2YoJz8nKVxuICAgICAgPyAnJicgKyBxdWVyeVxuICAgICAgOiAnPycgKyBxdWVyeTtcbiAgfVxufTtcblxuLyoqXG4gKiBJbml0aWF0ZSByZXF1ZXN0LCBpbnZva2luZyBjYWxsYmFjayBgZm4ocmVzKWBcbiAqIHdpdGggYW4gaW5zdGFuY2VvZiBgUmVzcG9uc2VgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oZm4pe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciB4aHIgPSB0aGlzLnhociA9IHJlcXVlc3QuZ2V0WEhSKCk7XG4gIHZhciB0aW1lb3V0ID0gdGhpcy5fdGltZW91dDtcbiAgdmFyIGRhdGEgPSB0aGlzLl9mb3JtRGF0YSB8fCB0aGlzLl9kYXRhO1xuXG4gIC8vIHN0b3JlIGNhbGxiYWNrXG4gIHRoaXMuX2NhbGxiYWNrID0gZm4gfHwgbm9vcDtcblxuICAvLyBzdGF0ZSBjaGFuZ2VcbiAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCl7XG4gICAgaWYgKDQgIT0geGhyLnJlYWR5U3RhdGUpIHJldHVybjtcblxuICAgIC8vIEluIElFOSwgcmVhZHMgdG8gYW55IHByb3BlcnR5IChlLmcuIHN0YXR1cykgb2ZmIG9mIGFuIGFib3J0ZWQgWEhSIHdpbGxcbiAgICAvLyByZXN1bHQgaW4gdGhlIGVycm9yIFwiQ291bGQgbm90IGNvbXBsZXRlIHRoZSBvcGVyYXRpb24gZHVlIHRvIGVycm9yIGMwMGMwMjNmXCJcbiAgICB2YXIgc3RhdHVzO1xuICAgIHRyeSB7IHN0YXR1cyA9IHhoci5zdGF0dXMgfSBjYXRjaChlKSB7IHN0YXR1cyA9IDA7IH1cblxuICAgIGlmICgwID09IHN0YXR1cykge1xuICAgICAgaWYgKHNlbGYudGltZWRvdXQpIHJldHVybiBzZWxmLl90aW1lb3V0RXJyb3IoKTtcbiAgICAgIGlmIChzZWxmLl9hYm9ydGVkKSByZXR1cm47XG4gICAgICByZXR1cm4gc2VsZi5jcm9zc0RvbWFpbkVycm9yKCk7XG4gICAgfVxuICAgIHNlbGYuZW1pdCgnZW5kJyk7XG4gIH07XG5cbiAgLy8gcHJvZ3Jlc3NcbiAgdmFyIGhhbmRsZVByb2dyZXNzID0gZnVuY3Rpb24oZGlyZWN0aW9uLCBlKSB7XG4gICAgaWYgKGUudG90YWwgPiAwKSB7XG4gICAgICBlLnBlcmNlbnQgPSBlLmxvYWRlZCAvIGUudG90YWwgKiAxMDA7XG4gICAgfVxuICAgIGUuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgIHNlbGYuZW1pdCgncHJvZ3Jlc3MnLCBlKTtcbiAgfVxuICBpZiAodGhpcy5oYXNMaXN0ZW5lcnMoJ3Byb2dyZXNzJykpIHtcbiAgICB0cnkge1xuICAgICAgeGhyLm9ucHJvZ3Jlc3MgPSBoYW5kbGVQcm9ncmVzcy5iaW5kKG51bGwsICdkb3dubG9hZCcpO1xuICAgICAgaWYgKHhoci51cGxvYWQpIHtcbiAgICAgICAgeGhyLnVwbG9hZC5vbnByb2dyZXNzID0gaGFuZGxlUHJvZ3Jlc3MuYmluZChudWxsLCAndXBsb2FkJyk7XG4gICAgICB9XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICAvLyBBY2Nlc3NpbmcgeGhyLnVwbG9hZCBmYWlscyBpbiBJRSBmcm9tIGEgd2ViIHdvcmtlciwgc28ganVzdCBwcmV0ZW5kIGl0IGRvZXNuJ3QgZXhpc3QuXG4gICAgICAvLyBSZXBvcnRlZCBoZXJlOlxuICAgICAgLy8gaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2svZGV0YWlscy84MzcyNDUveG1saHR0cHJlcXVlc3QtdXBsb2FkLXRocm93cy1pbnZhbGlkLWFyZ3VtZW50LXdoZW4tdXNlZC1mcm9tLXdlYi13b3JrZXItY29udGV4dFxuICAgIH1cbiAgfVxuXG4gIC8vIHRpbWVvdXRcbiAgaWYgKHRpbWVvdXQgJiYgIXRoaXMuX3RpbWVyKSB7XG4gICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICBzZWxmLnRpbWVkb3V0ID0gdHJ1ZTtcbiAgICAgIHNlbGYuYWJvcnQoKTtcbiAgICB9LCB0aW1lb3V0KTtcbiAgfVxuXG4gIC8vIHF1ZXJ5c3RyaW5nXG4gIHRoaXMuX2FwcGVuZFF1ZXJ5U3RyaW5nKCk7XG5cbiAgLy8gaW5pdGlhdGUgcmVxdWVzdFxuICBpZiAodGhpcy51c2VybmFtZSAmJiB0aGlzLnBhc3N3b3JkKSB7XG4gICAgeGhyLm9wZW4odGhpcy5tZXRob2QsIHRoaXMudXJsLCB0cnVlLCB0aGlzLnVzZXJuYW1lLCB0aGlzLnBhc3N3b3JkKTtcbiAgfSBlbHNlIHtcbiAgICB4aHIub3Blbih0aGlzLm1ldGhvZCwgdGhpcy51cmwsIHRydWUpO1xuICB9XG5cbiAgLy8gQ09SU1xuICBpZiAodGhpcy5fd2l0aENyZWRlbnRpYWxzKSB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcblxuICAvLyBib2R5XG4gIGlmICgnR0VUJyAhPSB0aGlzLm1ldGhvZCAmJiAnSEVBRCcgIT0gdGhpcy5tZXRob2QgJiYgJ3N0cmluZycgIT0gdHlwZW9mIGRhdGEgJiYgIXRoaXMuX2lzSG9zdChkYXRhKSkge1xuICAgIC8vIHNlcmlhbGl6ZSBzdHVmZlxuICAgIHZhciBjb250ZW50VHlwZSA9IHRoaXMuX2hlYWRlclsnY29udGVudC10eXBlJ107XG4gICAgdmFyIHNlcmlhbGl6ZSA9IHRoaXMuX3NlcmlhbGl6ZXIgfHwgcmVxdWVzdC5zZXJpYWxpemVbY29udGVudFR5cGUgPyBjb250ZW50VHlwZS5zcGxpdCgnOycpWzBdIDogJyddO1xuICAgIGlmICghc2VyaWFsaXplICYmIGlzSlNPTihjb250ZW50VHlwZSkpIHNlcmlhbGl6ZSA9IHJlcXVlc3Quc2VyaWFsaXplWydhcHBsaWNhdGlvbi9qc29uJ107XG4gICAgaWYgKHNlcmlhbGl6ZSkgZGF0YSA9IHNlcmlhbGl6ZShkYXRhKTtcbiAgfVxuXG4gIC8vIHNldCBoZWFkZXIgZmllbGRzXG4gIGZvciAodmFyIGZpZWxkIGluIHRoaXMuaGVhZGVyKSB7XG4gICAgaWYgKG51bGwgPT0gdGhpcy5oZWFkZXJbZmllbGRdKSBjb250aW51ZTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihmaWVsZCwgdGhpcy5oZWFkZXJbZmllbGRdKTtcbiAgfVxuXG4gIGlmICh0aGlzLl9yZXNwb25zZVR5cGUpIHtcbiAgICB4aHIucmVzcG9uc2VUeXBlID0gdGhpcy5fcmVzcG9uc2VUeXBlO1xuICB9XG5cbiAgLy8gc2VuZCBzdHVmZlxuICB0aGlzLmVtaXQoJ3JlcXVlc3QnLCB0aGlzKTtcblxuICAvLyBJRTExIHhoci5zZW5kKHVuZGVmaW5lZCkgc2VuZHMgJ3VuZGVmaW5lZCcgc3RyaW5nIGFzIFBPU1QgcGF5bG9hZCAoaW5zdGVhZCBvZiBub3RoaW5nKVxuICAvLyBXZSBuZWVkIG51bGwgaGVyZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICB4aHIuc2VuZCh0eXBlb2YgZGF0YSAhPT0gJ3VuZGVmaW5lZCcgPyBkYXRhIDogbnVsbCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIEV4cG9zZSBgUmVxdWVzdGAuXG4gKi9cblxucmVxdWVzdC5SZXF1ZXN0ID0gUmVxdWVzdDtcblxuLyoqXG4gKiBHRVQgYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gW2RhdGFdIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LmdldCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnR0VUJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEucXVlcnkoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIEhFQUQgYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gW2RhdGFdIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LmhlYWQgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ0hFQUQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBPUFRJT05TIHF1ZXJ5IHRvIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IFtkYXRhXSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXVxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5vcHRpb25zID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdPUFRJT05TJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogREVMRVRFIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbl1cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGRlbCh1cmwsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ0RFTEVURScsIHVybCk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG5yZXF1ZXN0WydkZWwnXSA9IGRlbDtcbnJlcXVlc3RbJ2RlbGV0ZSddID0gZGVsO1xuXG4vKipcbiAqIFBBVENIIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZH0gW2RhdGFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LnBhdGNoID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQQVRDSCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIFBPU1QgYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfSBbZGF0YV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbl1cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QucG9zdCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnUE9TVCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIFBVVCBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IFtkYXRhXSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXVxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5wdXQgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKXtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ1BVVCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vc3VwZXJhZ2VudC9saWIvY2xpZW50LmpzXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIlxyXG4vKipcclxuICogRXhwb3NlIGBFbWl0dGVyYC5cclxuICovXHJcblxyXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICBtb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cclxuICpcclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xyXG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE1peGluIHRoZSBlbWl0dGVyIHByb3BlcnRpZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcclxuICogQHJldHVybiB7T2JqZWN0fVxyXG4gKiBAYXBpIHByaXZhdGVcclxuICovXHJcblxyXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcclxuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcclxuICAgIG9ialtrZXldID0gRW1pdHRlci5wcm90b3R5cGVba2V5XTtcclxuICB9XHJcbiAgcmV0dXJuIG9iajtcclxufVxyXG5cclxuLyoqXHJcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxyXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cclxuRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG4gICh0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSB8fCBbXSlcclxuICAgIC5wdXNoKGZuKTtcclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcclxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XHJcbiAgZnVuY3Rpb24gb24oKSB7XHJcbiAgICB0aGlzLm9mZihldmVudCwgb24pO1xyXG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICB9XHJcblxyXG4gIG9uLmZuID0gZm47XHJcbiAgdGhpcy5vbihldmVudCwgb24pO1xyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXHJcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cclxuICogQHJldHVybiB7RW1pdHRlcn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxyXG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XHJcbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XHJcbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xyXG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcclxuXHJcbiAgLy8gYWxsXHJcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHNwZWNpZmljIGV2ZW50XHJcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XHJcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xyXG5cclxuICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXHJcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXHJcbiAgdmFyIGNiO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjYiA9IGNhbGxiYWNrc1tpXTtcclxuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XHJcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxyXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXHJcbiAgICAsIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XHJcblxyXG4gIGlmIChjYWxsYmFja3MpIHtcclxuICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcclxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJuIGFycmF5IG9mIGNhbGxiYWNrcyBmb3IgYGV2ZW50YC5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEByZXR1cm4ge0FycmF5fVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XHJcbiAgcmV0dXJuIHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gfHwgW107XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XHJcbiAgcmV0dXJuICEhIHRoaXMubGlzdGVuZXJzKGV2ZW50KS5sZW5ndGg7XHJcbn07XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2NvbXBvbmVudC1lbWl0dGVyL2luZGV4LmpzXG4gKiogbW9kdWxlIGlkID0gMTFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuICogTW9kdWxlIG9mIG1peGVkLWluIGZ1bmN0aW9ucyBzaGFyZWQgYmV0d2VlbiBub2RlIGFuZCBjbGllbnQgY29kZVxuICovXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzLW9iamVjdCcpO1xuXG4vKipcbiAqIENsZWFyIHByZXZpb3VzIHRpbWVvdXQuXG4gKlxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMuY2xlYXJUaW1lb3V0ID0gZnVuY3Rpb24gX2NsZWFyVGltZW91dCgpe1xuICB0aGlzLl90aW1lb3V0ID0gMDtcbiAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIE92ZXJyaWRlIGRlZmF1bHQgcmVzcG9uc2UgYm9keSBwYXJzZXJcbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHRvIGNvbnZlcnQgaW5jb21pbmcgZGF0YSBpbnRvIHJlcXVlc3QuYm9keVxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiBwYXJzZShmbil7XG4gIHRoaXMuX3BhcnNlciA9IGZuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogT3ZlcnJpZGUgZGVmYXVsdCByZXF1ZXN0IGJvZHkgc2VyaWFsaXplclxuICpcbiAqIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgdG8gY29udmVydCBkYXRhIHNldCB2aWEgLnNlbmQgb3IgLmF0dGFjaCBpbnRvIHBheWxvYWQgdG8gc2VuZFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMuc2VyaWFsaXplID0gZnVuY3Rpb24gc2VyaWFsaXplKGZuKXtcbiAgdGhpcy5fc2VyaWFsaXplciA9IGZuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IHRpbWVvdXQgdG8gYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnRpbWVvdXQgPSBmdW5jdGlvbiB0aW1lb3V0KG1zKXtcbiAgdGhpcy5fdGltZW91dCA9IG1zO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUHJvbWlzZSBzdXBwb3J0XG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0XG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICovXG5cbmV4cG9ydHMudGhlbiA9IGZ1bmN0aW9uIHRoZW4ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gIGlmICghdGhpcy5fZnVsbGZpbGxlZFByb21pc2UpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5fZnVsbGZpbGxlZFByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihpbm5lclJlc29sdmUsIGlubmVyUmVqZWN0KXtcbiAgICAgIHNlbGYuZW5kKGZ1bmN0aW9uKGVyciwgcmVzKXtcbiAgICAgICAgaWYgKGVycikgaW5uZXJSZWplY3QoZXJyKTsgZWxzZSBpbm5lclJlc29sdmUocmVzKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiB0aGlzLl9mdWxsZmlsbGVkUHJvbWlzZS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG59XG5cbmV4cG9ydHMuY2F0Y2ggPSBmdW5jdGlvbihjYikge1xuICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgY2IpO1xufTtcblxuLyoqXG4gKiBBbGxvdyBmb3IgZXh0ZW5zaW9uXG4gKi9cblxuZXhwb3J0cy51c2UgPSBmdW5jdGlvbiB1c2UoZm4pIHtcbiAgZm4odGhpcyk7XG4gIHJldHVybiB0aGlzO1xufVxuXG5cbi8qKlxuICogR2V0IHJlcXVlc3QgaGVhZGVyIGBmaWVsZGAuXG4gKiBDYXNlLWluc2Vuc2l0aXZlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLmdldCA9IGZ1bmN0aW9uKGZpZWxkKXtcbiAgcmV0dXJuIHRoaXMuX2hlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXTtcbn07XG5cbi8qKlxuICogR2V0IGNhc2UtaW5zZW5zaXRpdmUgaGVhZGVyIGBmaWVsZGAgdmFsdWUuXG4gKiBUaGlzIGlzIGEgZGVwcmVjYXRlZCBpbnRlcm5hbCBBUEkuIFVzZSBgLmdldChmaWVsZClgIGluc3RlYWQuXG4gKlxuICogKGdldEhlYWRlciBpcyBubyBsb25nZXIgdXNlZCBpbnRlcm5hbGx5IGJ5IHRoZSBzdXBlcmFnZW50IGNvZGUgYmFzZSlcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICogQGRlcHJlY2F0ZWRcbiAqL1xuXG5leHBvcnRzLmdldEhlYWRlciA9IGV4cG9ydHMuZ2V0O1xuXG4vKipcbiAqIFNldCBoZWFkZXIgYGZpZWxkYCB0byBgdmFsYCwgb3IgbXVsdGlwbGUgZmllbGRzIHdpdGggb25lIG9iamVjdC5cbiAqIENhc2UtaW5zZW5zaXRpdmUuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAuc2V0KCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpXG4gKiAgICAgICAgLnNldCgnWC1BUEktS2V5JywgJ2Zvb2JhcicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAuc2V0KHsgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsICdYLUFQSS1LZXknOiAnZm9vYmFyJyB9KVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gZmllbGRcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnNldCA9IGZ1bmN0aW9uKGZpZWxkLCB2YWwpe1xuICBpZiAoaXNPYmplY3QoZmllbGQpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGZpZWxkKSB7XG4gICAgICB0aGlzLnNldChrZXksIGZpZWxkW2tleV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICB0aGlzLl9oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV0gPSB2YWw7XG4gIHRoaXMuaGVhZGVyW2ZpZWxkXSA9IHZhbDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBoZWFkZXIgYGZpZWxkYC5cbiAqIENhc2UtaW5zZW5zaXRpdmUuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC51bnNldCgnVXNlci1BZ2VudCcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKi9cbmV4cG9ydHMudW5zZXQgPSBmdW5jdGlvbihmaWVsZCl7XG4gIGRlbGV0ZSB0aGlzLl9oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV07XG4gIGRlbGV0ZSB0aGlzLmhlYWRlcltmaWVsZF07XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBXcml0ZSB0aGUgZmllbGQgYG5hbWVgIGFuZCBgdmFsYCwgb3IgbXVsdGlwbGUgZmllbGRzIHdpdGggb25lIG9iamVjdFxuICogZm9yIFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiIHJlcXVlc3QgYm9kaWVzLlxuICpcbiAqIGBgYCBqc1xuICogcmVxdWVzdC5wb3N0KCcvdXBsb2FkJylcbiAqICAgLmZpZWxkKCdmb28nLCAnYmFyJylcbiAqICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogcmVxdWVzdC5wb3N0KCcvdXBsb2FkJylcbiAqICAgLmZpZWxkKHsgZm9vOiAnYmFyJywgYmF6OiAncXV4JyB9KVxuICogICAuZW5kKGNhbGxiYWNrKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gbmFtZVxuICogQHBhcmFtIHtTdHJpbmd8QmxvYnxGaWxlfEJ1ZmZlcnxmcy5SZWFkU3RyZWFtfSB2YWxcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0cy5maWVsZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbCkge1xuXG4gIC8vIG5hbWUgc2hvdWxkIGJlIGVpdGhlciBhIHN0cmluZyBvciBhbiBvYmplY3QuXG4gIGlmIChudWxsID09PSBuYW1lIHx8ICB1bmRlZmluZWQgPT09IG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJy5maWVsZChuYW1lLCB2YWwpIG5hbWUgY2FuIG5vdCBiZSBlbXB0eScpO1xuICB9XG5cbiAgaWYgKGlzT2JqZWN0KG5hbWUpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG5hbWUpIHtcbiAgICAgIHRoaXMuZmllbGQoa2V5LCBuYW1lW2tleV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHZhbCBzaG91bGQgYmUgZGVmaW5lZCBub3dcbiAgaWYgKG51bGwgPT09IHZhbCB8fCB1bmRlZmluZWQgPT09IHZhbCkge1xuICAgIHRocm93IG5ldyBFcnJvcignLmZpZWxkKG5hbWUsIHZhbCkgdmFsIGNhbiBub3QgYmUgZW1wdHknKTtcbiAgfVxuICB0aGlzLl9nZXRGb3JtRGF0YSgpLmFwcGVuZChuYW1lLCB2YWwpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWJvcnQgdGhlIHJlcXVlc3QsIGFuZCBjbGVhciBwb3RlbnRpYWwgdGltZW91dC5cbiAqXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0cy5hYm9ydCA9IGZ1bmN0aW9uKCl7XG4gIGlmICh0aGlzLl9hYm9ydGVkKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgdGhpcy5fYWJvcnRlZCA9IHRydWU7XG4gIHRoaXMueGhyICYmIHRoaXMueGhyLmFib3J0KCk7IC8vIGJyb3dzZXJcbiAgdGhpcy5yZXEgJiYgdGhpcy5yZXEuYWJvcnQoKTsgLy8gbm9kZVxuICB0aGlzLmNsZWFyVGltZW91dCgpO1xuICB0aGlzLmVtaXQoJ2Fib3J0Jyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbmFibGUgdHJhbnNtaXNzaW9uIG9mIGNvb2tpZXMgd2l0aCB4LWRvbWFpbiByZXF1ZXN0cy5cbiAqXG4gKiBOb3RlIHRoYXQgZm9yIHRoaXMgdG8gd29yayB0aGUgb3JpZ2luIG11c3Qgbm90IGJlXG4gKiB1c2luZyBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiIHdpdGggYSB3aWxkY2FyZCxcbiAqIGFuZCBhbHNvIG11c3Qgc2V0IFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHNcIlxuICogdG8gXCJ0cnVlXCIuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLndpdGhDcmVkZW50aWFscyA9IGZ1bmN0aW9uKCl7XG4gIC8vIFRoaXMgaXMgYnJvd3Nlci1vbmx5IGZ1bmN0aW9uYWxpdHkuIE5vZGUgc2lkZSBpcyBuby1vcC5cbiAgdGhpcy5fd2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgbWF4IHJlZGlyZWN0cyB0byBgbmAuIERvZXMgbm90aW5nIGluIGJyb3dzZXIgWEhSIGltcGxlbWVudGF0aW9uLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy5yZWRpcmVjdHMgPSBmdW5jdGlvbihuKXtcbiAgdGhpcy5fbWF4UmVkaXJlY3RzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIENvbnZlcnQgdG8gYSBwbGFpbiBqYXZhc2NyaXB0IG9iamVjdCAobm90IEpTT04gc3RyaW5nKSBvZiBzY2FsYXIgcHJvcGVydGllcy5cbiAqIE5vdGUgYXMgdGhpcyBtZXRob2QgaXMgZGVzaWduZWQgdG8gcmV0dXJuIGEgdXNlZnVsIG5vbi10aGlzIHZhbHVlLFxuICogaXQgY2Fubm90IGJlIGNoYWluZWQuXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSBkZXNjcmliaW5nIG1ldGhvZCwgdXJsLCBhbmQgZGF0YSBvZiB0aGlzIHJlcXVlc3RcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZXhwb3J0cy50b0pTT04gPSBmdW5jdGlvbigpe1xuICByZXR1cm4ge1xuICAgIG1ldGhvZDogdGhpcy5tZXRob2QsXG4gICAgdXJsOiB0aGlzLnVybCxcbiAgICBkYXRhOiB0aGlzLl9kYXRhLFxuICAgIGhlYWRlcnM6IHRoaXMuX2hlYWRlclxuICB9O1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhIGhvc3Qgb2JqZWN0LFxuICogd2UgZG9uJ3Qgd2FudCB0byBzZXJpYWxpemUgdGhlc2UgOilcbiAqXG4gKiBUT0RPOiBmdXR1cmUgcHJvb2YsIG1vdmUgdG8gY29tcG9lbnQgbGFuZFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLl9pc0hvc3QgPSBmdW5jdGlvbiBfaXNIb3N0KG9iaikge1xuICB2YXIgc3RyID0ge30udG9TdHJpbmcuY2FsbChvYmopO1xuXG4gIHN3aXRjaCAoc3RyKSB7XG4gICAgY2FzZSAnW29iamVjdCBGaWxlXSc6XG4gICAgY2FzZSAnW29iamVjdCBCbG9iXSc6XG4gICAgY2FzZSAnW29iamVjdCBGb3JtRGF0YV0nOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIFNlbmQgYGRhdGFgIGFzIHRoZSByZXF1ZXN0IGJvZHksIGRlZmF1bHRpbmcgdGhlIGAudHlwZSgpYCB0byBcImpzb25cIiB3aGVuXG4gKiBhbiBvYmplY3QgaXMgZ2l2ZW4uXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICAgLy8gbWFudWFsIGpzb25cbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnanNvbicpXG4gKiAgICAgICAgIC5zZW5kKCd7XCJuYW1lXCI6XCJ0alwifScpXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gYXV0byBqc29uXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gbWFudWFsIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdmb3JtJylcbiAqICAgICAgICAgLnNlbmQoJ25hbWU9dGonKVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGF1dG8geC13d3ctZm9ybS11cmxlbmNvZGVkXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnR5cGUoJ2Zvcm0nKVxuICogICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBkZWZhdWx0cyB0byB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAqICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgLnNlbmQoJ25hbWU9dG9iaScpXG4gKiAgICAgICAgLnNlbmQoJ3NwZWNpZXM9ZmVycmV0JylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gZGF0YVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMuc2VuZCA9IGZ1bmN0aW9uKGRhdGEpe1xuICB2YXIgb2JqID0gaXNPYmplY3QoZGF0YSk7XG4gIHZhciB0eXBlID0gdGhpcy5faGVhZGVyWydjb250ZW50LXR5cGUnXTtcblxuICAvLyBtZXJnZVxuICBpZiAob2JqICYmIGlzT2JqZWN0KHRoaXMuX2RhdGEpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcbiAgICAgIHRoaXMuX2RhdGFba2V5XSA9IGRhdGFba2V5XTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIGRhdGEpIHtcbiAgICAvLyBkZWZhdWx0IHRvIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICAgIGlmICghdHlwZSkgdGhpcy50eXBlKCdmb3JtJyk7XG4gICAgdHlwZSA9IHRoaXMuX2hlYWRlclsnY29udGVudC10eXBlJ107XG4gICAgaWYgKCdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnID09IHR5cGUpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSB0aGlzLl9kYXRhXG4gICAgICAgID8gdGhpcy5fZGF0YSArICcmJyArIGRhdGFcbiAgICAgICAgOiBkYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kYXRhID0gKHRoaXMuX2RhdGEgfHwgJycpICsgZGF0YTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gIH1cblxuICBpZiAoIW9iaiB8fCB0aGlzLl9pc0hvc3QoZGF0YSkpIHJldHVybiB0aGlzO1xuXG4gIC8vIGRlZmF1bHQgdG8ganNvblxuICBpZiAoIXR5cGUpIHRoaXMudHlwZSgnanNvbicpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9zdXBlcmFnZW50L2xpYi9yZXF1ZXN0LWJhc2UuanNcbiAqKiBtb2R1bGUgaWQgPSAxMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICByZXR1cm4gbnVsbCAhPT0gb2JqICYmICdvYmplY3QnID09PSB0eXBlb2Ygb2JqO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vc3VwZXJhZ2VudC9saWIvaXMtb2JqZWN0LmpzXG4gKiogbW9kdWxlIGlkID0gMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8vIFRoZSBub2RlIGFuZCBicm93c2VyIG1vZHVsZXMgZXhwb3NlIHZlcnNpb25zIG9mIHRoaXMgd2l0aCB0aGVcbi8vIGFwcHJvcHJpYXRlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIGJvdW5kIGFzIGZpcnN0IGFyZ3VtZW50XG4vKipcbiAqIElzc3VlIGEgcmVxdWVzdDpcbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICByZXF1ZXN0KCdHRVQnLCAnL3VzZXJzJykuZW5kKGNhbGxiYWNrKVxuICogICAgcmVxdWVzdCgnL3VzZXJzJykuZW5kKGNhbGxiYWNrKVxuICogICAgcmVxdWVzdCgnL3VzZXJzJywgY2FsbGJhY2spXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb259IHVybCBvciBjYWxsYmFja1xuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gcmVxdWVzdChSZXF1ZXN0Q29uc3RydWN0b3IsIG1ldGhvZCwgdXJsKSB7XG4gIC8vIGNhbGxiYWNrXG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiB1cmwpIHtcbiAgICByZXR1cm4gbmV3IFJlcXVlc3RDb25zdHJ1Y3RvcignR0VUJywgbWV0aG9kKS5lbmQodXJsKTtcbiAgfVxuXG4gIC8vIHVybCBmaXJzdFxuICBpZiAoMiA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0Q29uc3RydWN0b3IoJ0dFVCcsIG1ldGhvZCk7XG4gIH1cblxuICByZXR1cm4gbmV3IFJlcXVlc3RDb25zdHJ1Y3RvcihtZXRob2QsIHVybCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWVzdDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3N1cGVyYWdlbnQvbGliL3JlcXVlc3QuanNcbiAqKiBtb2R1bGUgaWQgPSAxNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdC8vIOODhuOCreOCueODiOOCqOODquOCouOBruiHquWLleODquOCteOCpOOCulxuXHQvLyBAIGh0dHA6Ly9xaWl0YS5jb20vWW9zaGl5dWtpS2F0by9pdGVtcy81MDdiODAyMmU2ZGY1ZTk5NmE1OVxuXHRhdXRvUmVzaXplOiAodGFyZ2V0LCBoID0gMjUsIGxoID0gMjUpID0+IHtcblx0XHR0YXJnZXQuc3R5bGUuaGVpZ2h0ID0gYCR7aH1weGA7XG5cdFx0dGFyZ2V0LnN0eWxlLmxpbmVIZWlnaHQgPSBgJHtsaH1weGA7XG5cdFx0dGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24oZSkge1xuXHRcdFx0Ly8g5Lit6Lqr44GoVGV4dGFyZWHjga7lpKfjgY3jgZXjgpLmr5TovIPjgZfjgabpq5jjgZXjgpLku5jkuI5cblx0XHRcdGlmKGUudGFyZ2V0LnNjcm9sbEhlaWdodCA+IGUudGFyZ2V0Lm9mZnNldEhlaWdodCkge1xuXHRcdFx0XHRlLnRhcmdldC5zdHlsZS5oZWlnaHQgPSBgJHtlLnRhcmdldC5zY3JvbGxIZWlnaHR9cHhgO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bGV0IGhlaWdodCwgbGluZUhlaWdodDtcblx0XHRcdFx0d2hpbGUodHJ1ZSkge1xuXHRcdFx0XHRcdC8vIOWkluWBtOOBrumrmOOBleOCkuWPluW+l1xuXHRcdFx0XHRcdGhlaWdodCA9ICsoZS50YXJnZXQuc3R5bGUuaGVpZ2h0LnNwbGl0KCdweCcpWzBdKTtcblx0XHRcdFx0XHQvLyBsaW5lSGVpZ2jjga7lgKTjgpLlj5blvpdcblx0XHRcdFx0XHRsaW5lSGVpZ2h0ID0gKyhlLnRhcmdldC5zdHlsZS5saW5lSGVpZ2h0LnNwbGl0KCdweCcpWzBdKTtcblx0XHRcdFx0XHRlLnRhcmdldC5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgLSBsaW5lSGVpZ2h0ICsgJ3B4Jztcblx0XHRcdFx0XHRpZihlLnRhcmdldC5zY3JvbGxIZWlnaHQgPiBlLnRhcmdldC5vZmZzZXRIZWlnaHQpIHtcblx0XHRcdFx0XHRcdGUudGFyZ2V0LnN0eWxlLmhlaWdodCA9IGUudGFyZ2V0LnNjcm9sbEhlaWdodCArICdweCc7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3NjcmlwdHMvdXRpbHMuanNcbiAqKi8iLCIvKlxuICogQW5pbWUgdjEuMS4xXG4gKiBodHRwOi8vYW5pbWUtanMuY29tXG4gKiBKYXZhU2NyaXB0IGFuaW1hdGlvbiBlbmdpbmVcbiAqIENvcHlyaWdodCAoYykgMjAxNiBKdWxpYW4gR2FybmllclxuICogaHR0cDovL2p1bGlhbmdhcm5pZXIuY29tXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgLy8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUywgYnV0XG4gICAgLy8gb25seSBDb21tb25KUy1saWtlIGVudmlyb25tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXG4gICAgLy8gbGlrZSBOb2RlLlxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgcm9vdC5hbmltZSA9IGZhY3RvcnkoKTtcbiAgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIHZlcnNpb24gPSAnMS4xLjEnO1xuXG4gIC8vIERlZmF1bHRzXG5cbiAgdmFyIGRlZmF1bHRTZXR0aW5ncyA9IHtcbiAgICBkdXJhdGlvbjogMTAwMCxcbiAgICBkZWxheTogMCxcbiAgICBsb29wOiBmYWxzZSxcbiAgICBhdXRvcGxheTogdHJ1ZSxcbiAgICBkaXJlY3Rpb246ICdub3JtYWwnLFxuICAgIGVhc2luZzogJ2Vhc2VPdXRFbGFzdGljJyxcbiAgICBlbGFzdGljaXR5OiA0MDAsXG4gICAgcm91bmQ6IGZhbHNlLFxuICAgIGJlZ2luOiB1bmRlZmluZWQsXG4gICAgdXBkYXRlOiB1bmRlZmluZWQsXG4gICAgY29tcGxldGU6IHVuZGVmaW5lZFxuICB9XG5cbiAgLy8gVHJhbnNmb3Jtc1xuXG4gIHZhciB2YWxpZFRyYW5zZm9ybXMgPSBbJ3RyYW5zbGF0ZVgnLCAndHJhbnNsYXRlWScsICd0cmFuc2xhdGVaJywgJ3JvdGF0ZScsICdyb3RhdGVYJywgJ3JvdGF0ZVknLCAncm90YXRlWicsICdzY2FsZScsICdzY2FsZVgnLCAnc2NhbGVZJywgJ3NjYWxlWicsICdza2V3WCcsICdza2V3WSddO1xuICB2YXIgdHJhbnNmb3JtLCB0cmFuc2Zvcm1TdHIgPSAndHJhbnNmb3JtJztcblxuICAvLyBVdGlsc1xuXG4gIHZhciBpcyA9IHtcbiAgICBhcnI6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuIEFycmF5LmlzQXJyYXkoYSkgfSxcbiAgICBvYmo6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhKS5pbmRleE9mKCdPYmplY3QnKSA+IC0xIH0sXG4gICAgc3ZnOiBmdW5jdGlvbihhKSB7IHJldHVybiBhIGluc3RhbmNlb2YgU1ZHRWxlbWVudCB9LFxuICAgIGRvbTogZnVuY3Rpb24oYSkgeyByZXR1cm4gYS5ub2RlVHlwZSB8fCBpcy5zdmcoYSkgfSxcbiAgICBudW06IGZ1bmN0aW9uKGEpIHsgcmV0dXJuICFpc05hTihwYXJzZUludChhKSkgfSxcbiAgICBzdHI6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuIHR5cGVvZiBhID09PSAnc3RyaW5nJyB9LFxuICAgIGZuYzogZnVuY3Rpb24oYSkgeyByZXR1cm4gdHlwZW9mIGEgPT09ICdmdW5jdGlvbicgfSxcbiAgICB1bmQ6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuIHR5cGVvZiBhID09PSAndW5kZWZpbmVkJyB9LFxuICAgIG51bDogZnVuY3Rpb24oYSkgeyByZXR1cm4gdHlwZW9mIGEgPT09ICdudWxsJyB9LFxuICAgIGhleDogZnVuY3Rpb24oYSkgeyByZXR1cm4gLyheI1swLTlBLUZdezZ9JCl8KF4jWzAtOUEtRl17M30kKS9pLnRlc3QoYSkgfSxcbiAgICByZ2I6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuIC9ecmdiLy50ZXN0KGEpIH0sXG4gICAgaHNsOiBmdW5jdGlvbihhKSB7IHJldHVybiAvXmhzbC8udGVzdChhKSB9LFxuICAgIGNvbDogZnVuY3Rpb24oYSkgeyByZXR1cm4gKGlzLmhleChhKSB8fCBpcy5yZ2IoYSkgfHwgaXMuaHNsKGEpKSB9XG4gIH1cblxuICAvLyBFYXNpbmdzIGZ1bmN0aW9ucyBhZGFwdGVkIGZyb20gaHR0cDovL2pxdWVyeXVpLmNvbS9cblxuICB2YXIgZWFzaW5ncyA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgZWFzZXMgPSB7fTtcbiAgICB2YXIgbmFtZXMgPSBbJ1F1YWQnLCAnQ3ViaWMnLCAnUXVhcnQnLCAnUXVpbnQnLCAnRXhwbyddO1xuICAgIHZhciBmdW5jdGlvbnMgPSB7XG4gICAgICBTaW5lOiBmdW5jdGlvbih0KSB7IHJldHVybiAxIC0gTWF0aC5jb3MoIHQgKiBNYXRoLlBJIC8gMiApOyB9LFxuICAgICAgQ2lyYzogZnVuY3Rpb24odCkgeyByZXR1cm4gMSAtIE1hdGguc3FydCggMSAtIHQgKiB0ICk7IH0sXG4gICAgICBFbGFzdGljOiBmdW5jdGlvbih0LCBtKSB7XG4gICAgICAgIGlmKCB0ID09PSAwIHx8IHQgPT09IDEgKSByZXR1cm4gdDtcbiAgICAgICAgdmFyIHAgPSAoMSAtIE1hdGgubWluKG0sIDk5OCkgLyAxMDAwKSwgc3QgPSB0IC8gMSwgc3QxID0gc3QgLSAxLCBzID0gcCAvICggMiAqIE1hdGguUEkgKSAqIE1hdGguYXNpbiggMSApO1xuICAgICAgICByZXR1cm4gLSggTWF0aC5wb3coIDIsIDEwICogc3QxICkgKiBNYXRoLnNpbiggKCBzdDEgLSBzICkgKiAoIDIgKiBNYXRoLlBJICkgLyBwICkgKTtcbiAgICAgIH0sXG4gICAgICBCYWNrOiBmdW5jdGlvbih0KSB7IHJldHVybiB0ICogdCAqICggMyAqIHQgLSAyICk7IH0sXG4gICAgICBCb3VuY2U6IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgdmFyIHBvdzIsIGJvdW5jZSA9IDQ7XG4gICAgICAgIHdoaWxlICggdCA8ICggKCBwb3cyID0gTWF0aC5wb3coIDIsIC0tYm91bmNlICkgKSAtIDEgKSAvIDExICkge31cbiAgICAgICAgcmV0dXJuIDEgLyBNYXRoLnBvdyggNCwgMyAtIGJvdW5jZSApIC0gNy41NjI1ICogTWF0aC5wb3coICggcG93MiAqIDMgLSAyICkgLyAyMiAtIHQsIDIgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbmFtZXMuZm9yRWFjaChmdW5jdGlvbihuYW1lLCBpKSB7XG4gICAgICBmdW5jdGlvbnNbbmFtZV0gPSBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiBNYXRoLnBvdyggdCwgaSArIDIgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3Qua2V5cyhmdW5jdGlvbnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIGVhc2VJbiA9IGZ1bmN0aW9uc1tuYW1lXTtcbiAgICAgIGVhc2VzWydlYXNlSW4nICsgbmFtZV0gPSBlYXNlSW47XG4gICAgICBlYXNlc1snZWFzZU91dCcgKyBuYW1lXSA9IGZ1bmN0aW9uKHQsIG0pIHsgcmV0dXJuIDEgLSBlYXNlSW4oMSAtIHQsIG0pOyB9O1xuICAgICAgZWFzZXNbJ2Vhc2VJbk91dCcgKyBuYW1lXSA9IGZ1bmN0aW9uKHQsIG0pIHsgcmV0dXJuIHQgPCAwLjUgPyBlYXNlSW4odCAqIDIsIG0pIC8gMiA6IDEgLSBlYXNlSW4odCAqIC0yICsgMiwgbSkgLyAyOyB9O1xuICAgICAgZWFzZXNbJ2Vhc2VPdXRJbicgKyBuYW1lXSA9IGZ1bmN0aW9uKHQsIG0pIHsgcmV0dXJuIHQgPCAwLjUgPyAoMSAtIGVhc2VJbigxIC0gMiAqIHQsIG0pKSAvIDIgOiAoZWFzZUluKHQgKiAyIC0gMSwgbSkgKyAxKSAvIDI7IH07XG4gICAgfSk7XG4gICAgZWFzZXMubGluZWFyID0gZnVuY3Rpb24odCkgeyByZXR1cm4gdDsgfTtcbiAgICByZXR1cm4gZWFzZXM7XG4gIH0pKCk7XG5cbiAgLy8gU3RyaW5nc1xuXG4gIHZhciBudW1iZXJUb1N0cmluZyA9IGZ1bmN0aW9uKHZhbCkge1xuICAgIHJldHVybiAoaXMuc3RyKHZhbCkpID8gdmFsIDogdmFsICsgJyc7XG4gIH1cblxuICB2YXIgc3RyaW5nVG9IeXBoZW5zID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgdmFyIHNlbGVjdFN0cmluZyA9IGZ1bmN0aW9uKHN0cikge1xuICAgIGlmIChpcy5jb2woc3RyKSkgcmV0dXJuIGZhbHNlO1xuICAgIHRyeSB7XG4gICAgICB2YXIgbm9kZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHN0cik7XG4gICAgICByZXR1cm4gbm9kZXM7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gTnVtYmVyc1xuXG4gIHZhciByYW5kb20gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xuICB9XG5cbiAgLy8gQXJyYXlzXG5cbiAgdmFyIGZsYXR0ZW5BcnJheSA9IGZ1bmN0aW9uKGFycikge1xuICAgIHJldHVybiBhcnIucmVkdWNlKGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBhLmNvbmNhdChpcy5hcnIoYikgPyBmbGF0dGVuQXJyYXkoYikgOiBiKTtcbiAgICB9LCBbXSk7XG4gIH1cblxuICB2YXIgdG9BcnJheSA9IGZ1bmN0aW9uKG8pIHtcbiAgICBpZiAoaXMuYXJyKG8pKSByZXR1cm4gbztcbiAgICBpZiAoaXMuc3RyKG8pKSBvID0gc2VsZWN0U3RyaW5nKG8pIHx8IG87XG4gICAgaWYgKG8gaW5zdGFuY2VvZiBOb2RlTGlzdCB8fCBvIGluc3RhbmNlb2YgSFRNTENvbGxlY3Rpb24pIHJldHVybiBbXS5zbGljZS5jYWxsKG8pO1xuICAgIHJldHVybiBbb107XG4gIH1cblxuICB2YXIgYXJyYXlDb250YWlucyA9IGZ1bmN0aW9uKGFyciwgdmFsKSB7XG4gICAgcmV0dXJuIGFyci5zb21lKGZ1bmN0aW9uKGEpIHsgcmV0dXJuIGEgPT09IHZhbDsgfSk7XG4gIH1cblxuICB2YXIgZ3JvdXBBcnJheUJ5UHJvcHMgPSBmdW5jdGlvbihhcnIsIHByb3BzQXJyKSB7XG4gICAgdmFyIGdyb3VwcyA9IHt9O1xuICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHZhciBncm91cCA9IEpTT04uc3RyaW5naWZ5KHByb3BzQXJyLm1hcChmdW5jdGlvbihwKSB7IHJldHVybiBvW3BdOyB9KSk7XG4gICAgICBncm91cHNbZ3JvdXBdID0gZ3JvdXBzW2dyb3VwXSB8fCBbXTtcbiAgICAgIGdyb3Vwc1tncm91cF0ucHVzaChvKTtcbiAgICB9KTtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZ3JvdXBzKS5tYXAoZnVuY3Rpb24oZ3JvdXApIHtcbiAgICAgIHJldHVybiBncm91cHNbZ3JvdXBdO1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIHJlbW92ZUFycmF5RHVwbGljYXRlcyA9IGZ1bmN0aW9uKGFycikge1xuICAgIHJldHVybiBhcnIuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0sIHBvcywgc2VsZikge1xuICAgICAgcmV0dXJuIHNlbGYuaW5kZXhPZihpdGVtKSA9PT0gcG9zO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gT2JqZWN0c1xuXG4gIHZhciBjbG9uZU9iamVjdCA9IGZ1bmN0aW9uKG8pIHtcbiAgICB2YXIgbmV3T2JqZWN0ID0ge307XG4gICAgZm9yICh2YXIgcCBpbiBvKSBuZXdPYmplY3RbcF0gPSBvW3BdO1xuICAgIHJldHVybiBuZXdPYmplY3Q7XG4gIH1cblxuICB2YXIgbWVyZ2VPYmplY3RzID0gZnVuY3Rpb24obzEsIG8yKSB7XG4gICAgZm9yICh2YXIgcCBpbiBvMikgbzFbcF0gPSAhaXMudW5kKG8xW3BdKSA/IG8xW3BdIDogbzJbcF07XG4gICAgcmV0dXJuIG8xO1xuICB9XG5cbiAgLy8gQ29sb3JzXG5cbiAgdmFyIGhleFRvUmdiID0gZnVuY3Rpb24oaGV4KSB7XG4gICAgdmFyIHJneCA9IC9eIz8oW2EtZlxcZF0pKFthLWZcXGRdKShbYS1mXFxkXSkkL2k7XG4gICAgdmFyIGhleCA9IGhleC5yZXBsYWNlKHJneCwgZnVuY3Rpb24obSwgciwgZywgYikgeyByZXR1cm4gciArIHIgKyBnICsgZyArIGIgKyBiOyB9KTtcbiAgICB2YXIgcmdiID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleCk7XG4gICAgdmFyIHIgPSBwYXJzZUludChyZ2JbMV0sIDE2KTtcbiAgICB2YXIgZyA9IHBhcnNlSW50KHJnYlsyXSwgMTYpO1xuICAgIHZhciBiID0gcGFyc2VJbnQocmdiWzNdLCAxNik7XG4gICAgcmV0dXJuICdyZ2IoJyArIHIgKyAnLCcgKyBnICsgJywnICsgYiArICcpJztcbiAgfVxuXG4gIHZhciBoc2xUb1JnYiA9IGZ1bmN0aW9uKGhzbCkge1xuICAgIHZhciBoc2wgPSAvaHNsXFwoKFxcZCspLFxccyooW1xcZC5dKyklLFxccyooW1xcZC5dKyklXFwpL2cuZXhlYyhoc2wpO1xuICAgIHZhciBoID0gcGFyc2VJbnQoaHNsWzFdKSAvIDM2MDtcbiAgICB2YXIgcyA9IHBhcnNlSW50KGhzbFsyXSkgLyAxMDA7XG4gICAgdmFyIGwgPSBwYXJzZUludChoc2xbM10pIC8gMTAwO1xuICAgIHZhciBodWUycmdiID0gZnVuY3Rpb24ocCwgcSwgdCkge1xuICAgICAgaWYgKHQgPCAwKSB0ICs9IDE7XG4gICAgICBpZiAodCA+IDEpIHQgLT0gMTtcbiAgICAgIGlmICh0IDwgMS82KSByZXR1cm4gcCArIChxIC0gcCkgKiA2ICogdDtcbiAgICAgIGlmICh0IDwgMS8yKSByZXR1cm4gcTtcbiAgICAgIGlmICh0IDwgMi8zKSByZXR1cm4gcCArIChxIC0gcCkgKiAoMi8zIC0gdCkgKiA2O1xuICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICAgIHZhciByLCBnLCBiO1xuICAgIGlmIChzID09IDApIHtcbiAgICAgIHIgPSBnID0gYiA9IGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBxID0gbCA8IDAuNSA/IGwgKiAoMSArIHMpIDogbCArIHMgLSBsICogcztcbiAgICAgIHZhciBwID0gMiAqIGwgLSBxO1xuICAgICAgciA9IGh1ZTJyZ2IocCwgcSwgaCArIDEvMyk7XG4gICAgICBnID0gaHVlMnJnYihwLCBxLCBoKTtcbiAgICAgIGIgPSBodWUycmdiKHAsIHEsIGggLSAxLzMpO1xuICAgIH1cbiAgICByZXR1cm4gJ3JnYignICsgciAqIDI1NSArICcsJyArIGcgKiAyNTUgKyAnLCcgKyBiICogMjU1ICsgJyknO1xuICB9XG5cbiAgdmFyIGNvbG9yVG9SZ2IgPSBmdW5jdGlvbih2YWwpIHtcbiAgICBpZiAoaXMucmdiKHZhbCkpIHJldHVybiB2YWw7XG4gICAgaWYgKGlzLmhleCh2YWwpKSByZXR1cm4gaGV4VG9SZ2IodmFsKTtcbiAgICBpZiAoaXMuaHNsKHZhbCkpIHJldHVybiBoc2xUb1JnYih2YWwpO1xuICB9XG5cbiAgLy8gVW5pdHNcblxuICB2YXIgZ2V0VW5pdCA9IGZ1bmN0aW9uKHZhbCkge1xuICAgIHJldHVybiAvKFtcXCtcXC1dP1swLTl8YXV0b1xcLl0rKSglfHB4fHB0fGVtfHJlbXxpbnxjbXxtbXxleHxwY3x2d3x2aHxkZWcpPy8uZXhlYyh2YWwpWzJdO1xuICB9XG5cbiAgdmFyIGFkZERlZmF1bHRUcmFuc2Zvcm1Vbml0ID0gZnVuY3Rpb24ocHJvcCwgdmFsLCBpbnRpYWxWYWwpIHtcbiAgICBpZiAoZ2V0VW5pdCh2YWwpKSByZXR1cm4gdmFsO1xuICAgIGlmIChwcm9wLmluZGV4T2YoJ3RyYW5zbGF0ZScpID4gLTEpIHJldHVybiBnZXRVbml0KGludGlhbFZhbCkgPyB2YWwgKyBnZXRVbml0KGludGlhbFZhbCkgOiB2YWwgKyAncHgnO1xuICAgIGlmIChwcm9wLmluZGV4T2YoJ3JvdGF0ZScpID4gLTEgfHwgcHJvcC5pbmRleE9mKCdza2V3JykgPiAtMSkgcmV0dXJuIHZhbCArICdkZWcnO1xuICAgIHJldHVybiB2YWw7XG4gIH1cblxuICAvLyBWYWx1ZXNcblxuICB2YXIgZ2V0Q1NTVmFsdWUgPSBmdW5jdGlvbihlbCwgcHJvcCkge1xuICAgIC8vIEZpcnN0IGNoZWNrIGlmIHByb3AgaXMgYSB2YWxpZCBDU1MgcHJvcGVydHlcbiAgICBpZiAocHJvcCBpbiBlbC5zdHlsZSkge1xuICAgICAgLy8gVGhlbiByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9yIGZhbGxiYWNrIHRvICcwJyB3aGVuIGdldFByb3BlcnR5VmFsdWUgZmFpbHNcbiAgICAgIHJldHVybiBnZXRDb21wdXRlZFN0eWxlKGVsKS5nZXRQcm9wZXJ0eVZhbHVlKHN0cmluZ1RvSHlwaGVucyhwcm9wKSkgfHwgJzAnO1xuICAgIH1cbiAgfVxuXG4gIHZhciBnZXRUcmFuc2Zvcm1WYWx1ZSA9IGZ1bmN0aW9uKGVsLCBwcm9wKSB7XG4gICAgdmFyIGRlZmF1bHRWYWwgPSBwcm9wLmluZGV4T2YoJ3NjYWxlJykgPiAtMSA/IDEgOiAwO1xuICAgIHZhciBzdHIgPSBlbC5zdHlsZS50cmFuc2Zvcm07XG4gICAgaWYgKCFzdHIpIHJldHVybiBkZWZhdWx0VmFsO1xuICAgIHZhciByZ3ggPSAvKFxcdyspXFwoKC4rPylcXCkvZztcbiAgICB2YXIgbWF0Y2ggPSBbXTtcbiAgICB2YXIgcHJvcHMgPSBbXTtcbiAgICB2YXIgdmFsdWVzID0gW107XG4gICAgd2hpbGUgKG1hdGNoID0gcmd4LmV4ZWMoc3RyKSkge1xuICAgICAgcHJvcHMucHVzaChtYXRjaFsxXSk7XG4gICAgICB2YWx1ZXMucHVzaChtYXRjaFsyXSk7XG4gICAgfVxuICAgIHZhciB2YWwgPSB2YWx1ZXMuZmlsdGVyKGZ1bmN0aW9uKGYsIGkpIHsgcmV0dXJuIHByb3BzW2ldID09PSBwcm9wOyB9KTtcbiAgICByZXR1cm4gdmFsLmxlbmd0aCA/IHZhbFswXSA6IGRlZmF1bHRWYWw7XG4gIH1cblxuICB2YXIgZ2V0QW5pbWF0aW9uVHlwZSA9IGZ1bmN0aW9uKGVsLCBwcm9wKSB7XG4gICAgaWYgKCBpcy5kb20oZWwpICYmIGFycmF5Q29udGFpbnModmFsaWRUcmFuc2Zvcm1zLCBwcm9wKSkgcmV0dXJuICd0cmFuc2Zvcm0nO1xuICAgIGlmICggaXMuZG9tKGVsKSAmJiAoZWwuZ2V0QXR0cmlidXRlKHByb3ApIHx8IChpcy5zdmcoZWwpICYmIGVsW3Byb3BdKSkpIHJldHVybiAnYXR0cmlidXRlJztcbiAgICBpZiAoIGlzLmRvbShlbCkgJiYgKHByb3AgIT09ICd0cmFuc2Zvcm0nICYmIGdldENTU1ZhbHVlKGVsLCBwcm9wKSkpIHJldHVybiAnY3NzJztcbiAgICBpZiAoIWlzLm51bChlbFtwcm9wXSkgJiYgIWlzLnVuZChlbFtwcm9wXSkpIHJldHVybiAnb2JqZWN0JztcbiAgfVxuXG4gIHZhciBnZXRJbml0aWFsVGFyZ2V0VmFsdWUgPSBmdW5jdGlvbih0YXJnZXQsIHByb3ApIHtcbiAgICBzd2l0Y2ggKGdldEFuaW1hdGlvblR5cGUodGFyZ2V0LCBwcm9wKSkge1xuICAgICAgY2FzZSAndHJhbnNmb3JtJzogcmV0dXJuIGdldFRyYW5zZm9ybVZhbHVlKHRhcmdldCwgcHJvcCk7XG4gICAgICBjYXNlICdjc3MnOiByZXR1cm4gZ2V0Q1NTVmFsdWUodGFyZ2V0LCBwcm9wKTtcbiAgICAgIGNhc2UgJ2F0dHJpYnV0ZSc6IHJldHVybiB0YXJnZXQuZ2V0QXR0cmlidXRlKHByb3ApO1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0W3Byb3BdIHx8IDA7XG4gIH1cblxuICB2YXIgZ2V0VmFsaWRWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlcywgdmFsLCBvcmlnaW5hbENTUykge1xuICAgIGlmIChpcy5jb2wodmFsKSkgcmV0dXJuIGNvbG9yVG9SZ2IodmFsKTtcbiAgICBpZiAoZ2V0VW5pdCh2YWwpKSByZXR1cm4gdmFsO1xuICAgIHZhciB1bml0ID0gZ2V0VW5pdCh2YWx1ZXMudG8pID8gZ2V0VW5pdCh2YWx1ZXMudG8pIDogZ2V0VW5pdCh2YWx1ZXMuZnJvbSk7XG4gICAgaWYgKCF1bml0ICYmIG9yaWdpbmFsQ1NTKSB1bml0ID0gZ2V0VW5pdChvcmlnaW5hbENTUyk7XG4gICAgcmV0dXJuIHVuaXQgPyB2YWwgKyB1bml0IDogdmFsO1xuICB9XG5cbiAgdmFyIGRlY29tcG9zZVZhbHVlID0gZnVuY3Rpb24odmFsKSB7XG4gICAgdmFyIHJneCA9IC8tP1xcZCpcXC4/XFxkKy9nO1xuICAgIHJldHVybiB7XG4gICAgICBvcmlnaW5hbDogdmFsLFxuICAgICAgbnVtYmVyczogbnVtYmVyVG9TdHJpbmcodmFsKS5tYXRjaChyZ3gpID8gbnVtYmVyVG9TdHJpbmcodmFsKS5tYXRjaChyZ3gpLm1hcChOdW1iZXIpIDogWzBdLFxuICAgICAgc3RyaW5nczogbnVtYmVyVG9TdHJpbmcodmFsKS5zcGxpdChyZ3gpXG4gICAgfVxuICB9XG5cbiAgdmFyIHJlY29tcG9zZVZhbHVlID0gZnVuY3Rpb24obnVtYmVycywgc3RyaW5ncywgaW5pdGlhbFN0cmluZ3MpIHtcbiAgICByZXR1cm4gc3RyaW5ncy5yZWR1Y2UoZnVuY3Rpb24oYSwgYiwgaSkge1xuICAgICAgdmFyIGIgPSAoYiA/IGIgOiBpbml0aWFsU3RyaW5nc1tpIC0gMV0pO1xuICAgICAgcmV0dXJuIGEgKyBudW1iZXJzW2kgLSAxXSArIGI7XG4gICAgfSk7XG4gIH1cblxuICAvLyBBbmltYXRhYmxlc1xuXG4gIHZhciBnZXRBbmltYXRhYmxlcyA9IGZ1bmN0aW9uKHRhcmdldHMpIHtcbiAgICB2YXIgdGFyZ2V0cyA9IHRhcmdldHMgPyAoZmxhdHRlbkFycmF5KGlzLmFycih0YXJnZXRzKSA/IHRhcmdldHMubWFwKHRvQXJyYXkpIDogdG9BcnJheSh0YXJnZXRzKSkpIDogW107XG4gICAgcmV0dXJuIHRhcmdldHMubWFwKGZ1bmN0aW9uKHQsIGkpIHtcbiAgICAgIHJldHVybiB7IHRhcmdldDogdCwgaWQ6IGkgfTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFByb3BlcnRpZXNcblxuICB2YXIgZ2V0UHJvcGVydGllcyA9IGZ1bmN0aW9uKHBhcmFtcywgc2V0dGluZ3MpIHtcbiAgICB2YXIgcHJvcHMgPSBbXTtcbiAgICBmb3IgKHZhciBwIGluIHBhcmFtcykge1xuICAgICAgaWYgKCFkZWZhdWx0U2V0dGluZ3MuaGFzT3duUHJvcGVydHkocCkgJiYgcCAhPT0gJ3RhcmdldHMnKSB7XG4gICAgICAgIHZhciBwcm9wID0gaXMub2JqKHBhcmFtc1twXSkgPyBjbG9uZU9iamVjdChwYXJhbXNbcF0pIDoge3ZhbHVlOiBwYXJhbXNbcF19O1xuICAgICAgICBwcm9wLm5hbWUgPSBwO1xuICAgICAgICBwcm9wcy5wdXNoKG1lcmdlT2JqZWN0cyhwcm9wLCBzZXR0aW5ncykpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcHJvcHM7XG4gIH1cblxuICB2YXIgZ2V0UHJvcGVydGllc1ZhbHVlcyA9IGZ1bmN0aW9uKHRhcmdldCwgcHJvcCwgdmFsdWUsIGkpIHtcbiAgICB2YXIgdmFsdWVzID0gdG9BcnJheSggaXMuZm5jKHZhbHVlKSA/IHZhbHVlKHRhcmdldCwgaSkgOiB2YWx1ZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZyb206ICh2YWx1ZXMubGVuZ3RoID4gMSkgPyB2YWx1ZXNbMF0gOiBnZXRJbml0aWFsVGFyZ2V0VmFsdWUodGFyZ2V0LCBwcm9wKSxcbiAgICAgIHRvOiAodmFsdWVzLmxlbmd0aCA+IDEpID8gdmFsdWVzWzFdIDogdmFsdWVzWzBdXG4gICAgfVxuICB9XG5cbiAgLy8gVHdlZW5zXG5cbiAgdmFyIGdldFR3ZWVuVmFsdWVzID0gZnVuY3Rpb24ocHJvcCwgdmFsdWVzLCB0eXBlLCB0YXJnZXQpIHtcbiAgICB2YXIgdmFsaWQgPSB7fTtcbiAgICBpZiAodHlwZSA9PT0gJ3RyYW5zZm9ybScpIHtcbiAgICAgIHZhbGlkLmZyb20gPSBwcm9wICsgJygnICsgYWRkRGVmYXVsdFRyYW5zZm9ybVVuaXQocHJvcCwgdmFsdWVzLmZyb20sIHZhbHVlcy50bykgKyAnKSc7XG4gICAgICB2YWxpZC50byA9IHByb3AgKyAnKCcgKyBhZGREZWZhdWx0VHJhbnNmb3JtVW5pdChwcm9wLCB2YWx1ZXMudG8pICsgJyknO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgb3JpZ2luYWxDU1MgPSAodHlwZSA9PT0gJ2NzcycpID8gZ2V0Q1NTVmFsdWUodGFyZ2V0LCBwcm9wKSA6IHVuZGVmaW5lZDtcbiAgICAgIHZhbGlkLmZyb20gPSBnZXRWYWxpZFZhbHVlKHZhbHVlcywgdmFsdWVzLmZyb20sIG9yaWdpbmFsQ1NTKTtcbiAgICAgIHZhbGlkLnRvID0gZ2V0VmFsaWRWYWx1ZSh2YWx1ZXMsIHZhbHVlcy50bywgb3JpZ2luYWxDU1MpO1xuICAgIH1cbiAgICByZXR1cm4geyBmcm9tOiBkZWNvbXBvc2VWYWx1ZSh2YWxpZC5mcm9tKSwgdG86IGRlY29tcG9zZVZhbHVlKHZhbGlkLnRvKSB9O1xuICB9XG5cbiAgdmFyIGdldFR3ZWVuc1Byb3BzID0gZnVuY3Rpb24oYW5pbWF0YWJsZXMsIHByb3BzKSB7XG4gICAgdmFyIHR3ZWVuc1Byb3BzID0gW107XG4gICAgYW5pbWF0YWJsZXMuZm9yRWFjaChmdW5jdGlvbihhbmltYXRhYmxlLCBpKSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gYW5pbWF0YWJsZS50YXJnZXQ7XG4gICAgICByZXR1cm4gcHJvcHMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICAgIHZhciBhbmltVHlwZSA9IGdldEFuaW1hdGlvblR5cGUodGFyZ2V0LCBwcm9wLm5hbWUpO1xuICAgICAgICBpZiAoYW5pbVR5cGUpIHtcbiAgICAgICAgICB2YXIgdmFsdWVzID0gZ2V0UHJvcGVydGllc1ZhbHVlcyh0YXJnZXQsIHByb3AubmFtZSwgcHJvcC52YWx1ZSwgaSk7XG4gICAgICAgICAgdmFyIHR3ZWVuID0gY2xvbmVPYmplY3QocHJvcCk7XG4gICAgICAgICAgdHdlZW4uYW5pbWF0YWJsZXMgPSBhbmltYXRhYmxlO1xuICAgICAgICAgIHR3ZWVuLnR5cGUgPSBhbmltVHlwZTtcbiAgICAgICAgICB0d2Vlbi5mcm9tID0gZ2V0VHdlZW5WYWx1ZXMocHJvcC5uYW1lLCB2YWx1ZXMsIHR3ZWVuLnR5cGUsIHRhcmdldCkuZnJvbTtcbiAgICAgICAgICB0d2Vlbi50byA9IGdldFR3ZWVuVmFsdWVzKHByb3AubmFtZSwgdmFsdWVzLCB0d2Vlbi50eXBlLCB0YXJnZXQpLnRvO1xuICAgICAgICAgIHR3ZWVuLnJvdW5kID0gKGlzLmNvbCh2YWx1ZXMuZnJvbSkgfHwgdHdlZW4ucm91bmQpID8gMSA6IDA7XG4gICAgICAgICAgdHdlZW4uZGVsYXkgPSAoaXMuZm5jKHR3ZWVuLmRlbGF5KSA/IHR3ZWVuLmRlbGF5KHRhcmdldCwgaSwgYW5pbWF0YWJsZXMubGVuZ3RoKSA6IHR3ZWVuLmRlbGF5KSAvIGFuaW1hdGlvbi5zcGVlZDtcbiAgICAgICAgICB0d2Vlbi5kdXJhdGlvbiA9IChpcy5mbmModHdlZW4uZHVyYXRpb24pID8gdHdlZW4uZHVyYXRpb24odGFyZ2V0LCBpLCBhbmltYXRhYmxlcy5sZW5ndGgpIDogdHdlZW4uZHVyYXRpb24pIC8gYW5pbWF0aW9uLnNwZWVkO1xuICAgICAgICAgIHR3ZWVuc1Byb3BzLnB1c2godHdlZW4pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdHdlZW5zUHJvcHM7XG4gIH1cblxuICB2YXIgZ2V0VHdlZW5zID0gZnVuY3Rpb24oYW5pbWF0YWJsZXMsIHByb3BzKSB7XG4gICAgdmFyIHR3ZWVuc1Byb3BzID0gZ2V0VHdlZW5zUHJvcHMoYW5pbWF0YWJsZXMsIHByb3BzKTtcbiAgICB2YXIgc3BsaXR0ZWRQcm9wcyA9IGdyb3VwQXJyYXlCeVByb3BzKHR3ZWVuc1Byb3BzLCBbJ25hbWUnLCAnZnJvbScsICd0bycsICdkZWxheScsICdkdXJhdGlvbiddKTtcbiAgICByZXR1cm4gc3BsaXR0ZWRQcm9wcy5tYXAoZnVuY3Rpb24odHdlZW5Qcm9wcykge1xuICAgICAgdmFyIHR3ZWVuID0gY2xvbmVPYmplY3QodHdlZW5Qcm9wc1swXSk7XG4gICAgICB0d2Vlbi5hbmltYXRhYmxlcyA9IHR3ZWVuUHJvcHMubWFwKGZ1bmN0aW9uKHApIHsgcmV0dXJuIHAuYW5pbWF0YWJsZXMgfSk7XG4gICAgICB0d2Vlbi50b3RhbER1cmF0aW9uID0gdHdlZW4uZGVsYXkgKyB0d2Vlbi5kdXJhdGlvbjtcbiAgICAgIHJldHVybiB0d2VlbjtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciByZXZlcnNlVHdlZW5zID0gZnVuY3Rpb24oYW5pbSwgZGVsYXlzKSB7XG4gICAgYW5pbS50d2VlbnMuZm9yRWFjaChmdW5jdGlvbih0d2Vlbikge1xuICAgICAgdmFyIHRvVmFsID0gdHdlZW4udG87XG4gICAgICB2YXIgZnJvbVZhbCA9IHR3ZWVuLmZyb207XG4gICAgICB2YXIgZGVsYXlWYWwgPSBhbmltLmR1cmF0aW9uIC0gKHR3ZWVuLmRlbGF5ICsgdHdlZW4uZHVyYXRpb24pO1xuICAgICAgdHdlZW4uZnJvbSA9IHRvVmFsO1xuICAgICAgdHdlZW4udG8gPSBmcm9tVmFsO1xuICAgICAgaWYgKGRlbGF5cykgdHdlZW4uZGVsYXkgPSBkZWxheVZhbDtcbiAgICB9KTtcbiAgICBhbmltLnJldmVyc2VkID0gYW5pbS5yZXZlcnNlZCA/IGZhbHNlIDogdHJ1ZTtcbiAgfVxuXG4gIHZhciBnZXRUd2VlbnNEdXJhdGlvbiA9IGZ1bmN0aW9uKHR3ZWVucykge1xuICAgIGlmICh0d2VlbnMubGVuZ3RoKSByZXR1cm4gTWF0aC5tYXguYXBwbHkoTWF0aCwgdHdlZW5zLm1hcChmdW5jdGlvbih0d2Vlbil7IHJldHVybiB0d2Vlbi50b3RhbER1cmF0aW9uOyB9KSk7XG4gIH1cblxuICAvLyB3aWxsLWNoYW5nZVxuXG4gIHZhciBnZXRXaWxsQ2hhbmdlID0gZnVuY3Rpb24oYW5pbSkge1xuICAgIHZhciBwcm9wcyA9IFtdO1xuICAgIHZhciBlbHMgPSBbXTtcbiAgICBhbmltLnR3ZWVucy5mb3JFYWNoKGZ1bmN0aW9uKHR3ZWVuKSB7XG4gICAgICBpZiAodHdlZW4udHlwZSA9PT0gJ2NzcycgfHwgdHdlZW4udHlwZSA9PT0gJ3RyYW5zZm9ybScgKSB7XG4gICAgICAgIHByb3BzLnB1c2godHdlZW4udHlwZSA9PT0gJ2NzcycgPyBzdHJpbmdUb0h5cGhlbnModHdlZW4ubmFtZSkgOiAndHJhbnNmb3JtJyk7XG4gICAgICAgIHR3ZWVuLmFuaW1hdGFibGVzLmZvckVhY2goZnVuY3Rpb24oYW5pbWF0YWJsZSkgeyBlbHMucHVzaChhbmltYXRhYmxlLnRhcmdldCk7IH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICBwcm9wZXJ0aWVzOiByZW1vdmVBcnJheUR1cGxpY2F0ZXMocHJvcHMpLmpvaW4oJywgJyksXG4gICAgICBlbGVtZW50czogcmVtb3ZlQXJyYXlEdXBsaWNhdGVzKGVscylcbiAgICB9XG4gIH1cblxuICB2YXIgc2V0V2lsbENoYW5nZSA9IGZ1bmN0aW9uKGFuaW0pIHtcbiAgICB2YXIgd2lsbENoYW5nZSA9IGdldFdpbGxDaGFuZ2UoYW5pbSk7XG4gICAgd2lsbENoYW5nZS5lbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgIGVsZW1lbnQuc3R5bGUud2lsbENoYW5nZSA9IHdpbGxDaGFuZ2UucHJvcGVydGllcztcbiAgICB9KTtcbiAgfVxuXG4gIHZhciByZW1vdmVXaWxsQ2hhbmdlID0gZnVuY3Rpb24oYW5pbSkge1xuICAgIHZhciB3aWxsQ2hhbmdlID0gZ2V0V2lsbENoYW5nZShhbmltKTtcbiAgICB3aWxsQ2hhbmdlLmVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnd2lsbC1jaGFuZ2UnKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qIFN2ZyBwYXRoICovXG5cbiAgdmFyIGdldFBhdGhQcm9wcyA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICB2YXIgZWwgPSBpcy5zdHIocGF0aCkgPyBzZWxlY3RTdHJpbmcocGF0aClbMF0gOiBwYXRoO1xuICAgIHJldHVybiB7XG4gICAgICBwYXRoOiBlbCxcbiAgICAgIHZhbHVlOiBlbC5nZXRUb3RhbExlbmd0aCgpXG4gICAgfVxuICB9XG5cbiAgdmFyIHNuYXBQcm9ncmVzc1RvUGF0aCA9IGZ1bmN0aW9uKHR3ZWVuLCBwcm9ncmVzcykge1xuICAgIHZhciBwYXRoRWwgPSB0d2Vlbi5wYXRoO1xuICAgIHZhciBwYXRoUHJvZ3Jlc3MgPSB0d2Vlbi52YWx1ZSAqIHByb2dyZXNzO1xuICAgIHZhciBwb2ludCA9IGZ1bmN0aW9uKG9mZnNldCkge1xuICAgICAgdmFyIG8gPSBvZmZzZXQgfHwgMDtcbiAgICAgIHZhciBwID0gcHJvZ3Jlc3MgPiAxID8gdHdlZW4udmFsdWUgKyBvIDogcGF0aFByb2dyZXNzICsgbztcbiAgICAgIHJldHVybiBwYXRoRWwuZ2V0UG9pbnRBdExlbmd0aChwKTtcbiAgICB9XG4gICAgdmFyIHAgPSBwb2ludCgpO1xuICAgIHZhciBwMCA9IHBvaW50KC0xKTtcbiAgICB2YXIgcDEgPSBwb2ludCgrMSk7XG4gICAgc3dpdGNoICh0d2Vlbi5uYW1lKSB7XG4gICAgICBjYXNlICd0cmFuc2xhdGVYJzogcmV0dXJuIHAueDtcbiAgICAgIGNhc2UgJ3RyYW5zbGF0ZVknOiByZXR1cm4gcC55O1xuICAgICAgY2FzZSAncm90YXRlJzogcmV0dXJuIE1hdGguYXRhbjIocDEueSAtIHAwLnksIHAxLnggLSBwMC54KSAqIDE4MCAvIE1hdGguUEk7XG4gICAgfVxuICB9XG5cbiAgLy8gUHJvZ3Jlc3NcblxuICB2YXIgZ2V0VHdlZW5Qcm9ncmVzcyA9IGZ1bmN0aW9uKHR3ZWVuLCB0aW1lKSB7XG4gICAgdmFyIGVsYXBzZWQgPSBNYXRoLm1pbihNYXRoLm1heCh0aW1lIC0gdHdlZW4uZGVsYXksIDApLCB0d2Vlbi5kdXJhdGlvbik7XG4gICAgdmFyIHBlcmNlbnQgPSBlbGFwc2VkIC8gdHdlZW4uZHVyYXRpb247XG4gICAgdmFyIHByb2dyZXNzID0gdHdlZW4udG8ubnVtYmVycy5tYXAoZnVuY3Rpb24obnVtYmVyLCBwKSB7XG4gICAgICB2YXIgc3RhcnQgPSB0d2Vlbi5mcm9tLm51bWJlcnNbcF07XG4gICAgICB2YXIgZWFzZWQgPSBlYXNpbmdzW3R3ZWVuLmVhc2luZ10ocGVyY2VudCwgdHdlZW4uZWxhc3RpY2l0eSk7XG4gICAgICB2YXIgdmFsID0gdHdlZW4ucGF0aCA/IHNuYXBQcm9ncmVzc1RvUGF0aCh0d2VlbiwgZWFzZWQpIDogc3RhcnQgKyBlYXNlZCAqIChudW1iZXIgLSBzdGFydCk7XG4gICAgICB2YWwgPSB0d2Vlbi5yb3VuZCA/IE1hdGgucm91bmQodmFsICogdHdlZW4ucm91bmQpIC8gdHdlZW4ucm91bmQgOiB2YWw7XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH0pO1xuICAgIHJldHVybiByZWNvbXBvc2VWYWx1ZShwcm9ncmVzcywgdHdlZW4udG8uc3RyaW5ncywgdHdlZW4uZnJvbS5zdHJpbmdzKTtcbiAgfVxuXG4gIHZhciBzZXRBbmltYXRpb25Qcm9ncmVzcyA9IGZ1bmN0aW9uKGFuaW0sIHRpbWUpIHtcbiAgICB2YXIgdHJhbnNmb3JtcztcbiAgICBhbmltLmN1cnJlbnRUaW1lID0gdGltZTtcbiAgICBhbmltLnByb2dyZXNzID0gKHRpbWUgLyBhbmltLmR1cmF0aW9uKSAqIDEwMDtcbiAgICBmb3IgKHZhciB0ID0gMDsgdCA8IGFuaW0udHdlZW5zLmxlbmd0aDsgdCsrKSB7XG4gICAgICB2YXIgdHdlZW4gPSBhbmltLnR3ZWVuc1t0XTtcbiAgICAgIHR3ZWVuLmN1cnJlbnRWYWx1ZSA9IGdldFR3ZWVuUHJvZ3Jlc3ModHdlZW4sIHRpbWUpO1xuICAgICAgdmFyIHByb2dyZXNzID0gdHdlZW4uY3VycmVudFZhbHVlO1xuICAgICAgZm9yICh2YXIgYSA9IDA7IGEgPCB0d2Vlbi5hbmltYXRhYmxlcy5sZW5ndGg7IGErKykge1xuICAgICAgICB2YXIgYW5pbWF0YWJsZSA9IHR3ZWVuLmFuaW1hdGFibGVzW2FdO1xuICAgICAgICB2YXIgaWQgPSBhbmltYXRhYmxlLmlkO1xuICAgICAgICB2YXIgdGFyZ2V0ID0gYW5pbWF0YWJsZS50YXJnZXQ7XG4gICAgICAgIHZhciBuYW1lID0gdHdlZW4ubmFtZTtcbiAgICAgICAgc3dpdGNoICh0d2Vlbi50eXBlKSB7XG4gICAgICAgICAgY2FzZSAnY3NzJzogdGFyZ2V0LnN0eWxlW25hbWVdID0gcHJvZ3Jlc3M7IGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2F0dHJpYnV0ZSc6IHRhcmdldC5zZXRBdHRyaWJ1dGUobmFtZSwgcHJvZ3Jlc3MpOyBicmVhaztcbiAgICAgICAgICBjYXNlICdvYmplY3QnOiB0YXJnZXRbbmFtZV0gPSBwcm9ncmVzczsgYnJlYWs7XG4gICAgICAgICAgY2FzZSAndHJhbnNmb3JtJzpcbiAgICAgICAgICBpZiAoIXRyYW5zZm9ybXMpIHRyYW5zZm9ybXMgPSB7fTtcbiAgICAgICAgICBpZiAoIXRyYW5zZm9ybXNbaWRdKSB0cmFuc2Zvcm1zW2lkXSA9IFtdO1xuICAgICAgICAgIHRyYW5zZm9ybXNbaWRdLnB1c2gocHJvZ3Jlc3MpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0cmFuc2Zvcm1zKSB7XG4gICAgICBpZiAoIXRyYW5zZm9ybSkgdHJhbnNmb3JtID0gKGdldENTU1ZhbHVlKGRvY3VtZW50LmJvZHksIHRyYW5zZm9ybVN0cikgPyAnJyA6ICctd2Via2l0LScpICsgdHJhbnNmb3JtU3RyO1xuICAgICAgZm9yICh2YXIgdCBpbiB0cmFuc2Zvcm1zKSB7XG4gICAgICAgIGFuaW0uYW5pbWF0YWJsZXNbdF0udGFyZ2V0LnN0eWxlW3RyYW5zZm9ybV0gPSB0cmFuc2Zvcm1zW3RdLmpvaW4oJyAnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGFuaW0uc2V0dGluZ3MudXBkYXRlKSBhbmltLnNldHRpbmdzLnVwZGF0ZShhbmltKTtcbiAgfVxuXG4gIC8vIEFuaW1hdGlvblxuXG4gIHZhciBjcmVhdGVBbmltYXRpb24gPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICB2YXIgYW5pbSA9IHt9O1xuICAgIGFuaW0uYW5pbWF0YWJsZXMgPSBnZXRBbmltYXRhYmxlcyhwYXJhbXMudGFyZ2V0cyk7XG4gICAgYW5pbS5zZXR0aW5ncyA9IG1lcmdlT2JqZWN0cyhwYXJhbXMsIGRlZmF1bHRTZXR0aW5ncyk7XG4gICAgYW5pbS5wcm9wZXJ0aWVzID0gZ2V0UHJvcGVydGllcyhwYXJhbXMsIGFuaW0uc2V0dGluZ3MpO1xuICAgIGFuaW0udHdlZW5zID0gZ2V0VHdlZW5zKGFuaW0uYW5pbWF0YWJsZXMsIGFuaW0ucHJvcGVydGllcyk7XG4gICAgYW5pbS5kdXJhdGlvbiA9IGdldFR3ZWVuc0R1cmF0aW9uKGFuaW0udHdlZW5zKSB8fCBwYXJhbXMuZHVyYXRpb247XG4gICAgYW5pbS5jdXJyZW50VGltZSA9IDA7XG4gICAgYW5pbS5wcm9ncmVzcyA9IDA7XG4gICAgYW5pbS5lbmRlZCA9IGZhbHNlO1xuICAgIHJldHVybiBhbmltO1xuICB9XG5cbiAgLy8gUHVibGljXG5cbiAgdmFyIGFuaW1hdGlvbnMgPSBbXTtcbiAgdmFyIHJhZiA9IDA7XG5cbiAgdmFyIGVuZ2luZSA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgcGxheSA9IGZ1bmN0aW9uKCkgeyByYWYgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7IH07XG4gICAgdmFyIHN0ZXAgPSBmdW5jdGlvbih0KSB7XG4gICAgICBpZiAoYW5pbWF0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbmltYXRpb25zLmxlbmd0aDsgaSsrKSBhbmltYXRpb25zW2ldLnRpY2sodCk7XG4gICAgICAgIHBsYXkoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZik7XG4gICAgICAgIHJhZiA9IDA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwbGF5O1xuICB9KSgpO1xuXG4gIHZhciBhbmltYXRpb24gPSBmdW5jdGlvbihwYXJhbXMpIHtcblxuICAgIHZhciBhbmltID0gY3JlYXRlQW5pbWF0aW9uKHBhcmFtcyk7XG4gICAgdmFyIHRpbWUgPSB7fTtcblxuICAgIGFuaW0udGljayA9IGZ1bmN0aW9uKG5vdykge1xuICAgICAgYW5pbS5lbmRlZCA9IGZhbHNlO1xuICAgICAgaWYgKCF0aW1lLnN0YXJ0KSB0aW1lLnN0YXJ0ID0gbm93O1xuICAgICAgdGltZS5jdXJyZW50ID0gTWF0aC5taW4oTWF0aC5tYXgodGltZS5sYXN0ICsgbm93IC0gdGltZS5zdGFydCwgMCksIGFuaW0uZHVyYXRpb24pO1xuICAgICAgc2V0QW5pbWF0aW9uUHJvZ3Jlc3MoYW5pbSwgdGltZS5jdXJyZW50KTtcbiAgICAgIHZhciBzID0gYW5pbS5zZXR0aW5ncztcbiAgICAgIGlmIChzLmJlZ2luICYmIHRpbWUuY3VycmVudCA+PSBzLmRlbGF5KSB7IHMuYmVnaW4oYW5pbSk7IHMuYmVnaW4gPSB1bmRlZmluZWQ7IH07XG4gICAgICBpZiAodGltZS5jdXJyZW50ID49IGFuaW0uZHVyYXRpb24pIHtcbiAgICAgICAgaWYgKHMubG9vcCkge1xuICAgICAgICAgIHRpbWUuc3RhcnQgPSBub3c7XG4gICAgICAgICAgaWYgKHMuZGlyZWN0aW9uID09PSAnYWx0ZXJuYXRlJykgcmV2ZXJzZVR3ZWVucyhhbmltLCB0cnVlKTtcbiAgICAgICAgICBpZiAoaXMubnVtKHMubG9vcCkpIHMubG9vcC0tO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFuaW0uZW5kZWQgPSB0cnVlO1xuICAgICAgICAgIGFuaW0ucGF1c2UoKTtcbiAgICAgICAgICBpZiAocy5jb21wbGV0ZSkgcy5jb21wbGV0ZShhbmltKTtcbiAgICAgICAgfVxuICAgICAgICB0aW1lLmxhc3QgPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFuaW0uc2VlayA9IGZ1bmN0aW9uKHByb2dyZXNzKSB7XG4gICAgICBzZXRBbmltYXRpb25Qcm9ncmVzcyhhbmltLCAocHJvZ3Jlc3MgLyAxMDApICogYW5pbS5kdXJhdGlvbik7XG4gICAgfVxuXG4gICAgYW5pbS5wYXVzZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVtb3ZlV2lsbENoYW5nZShhbmltKTtcbiAgICAgIHZhciBpID0gYW5pbWF0aW9ucy5pbmRleE9mKGFuaW0pO1xuICAgICAgaWYgKGkgPiAtMSkgYW5pbWF0aW9ucy5zcGxpY2UoaSwgMSk7XG4gICAgfVxuXG4gICAgYW5pbS5wbGF5ID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICBhbmltLnBhdXNlKCk7XG4gICAgICBpZiAocGFyYW1zKSBhbmltID0gbWVyZ2VPYmplY3RzKGNyZWF0ZUFuaW1hdGlvbihtZXJnZU9iamVjdHMocGFyYW1zLCBhbmltLnNldHRpbmdzKSksIGFuaW0pO1xuICAgICAgdGltZS5zdGFydCA9IDA7XG4gICAgICB0aW1lLmxhc3QgPSBhbmltLmVuZGVkID8gMCA6IGFuaW0uY3VycmVudFRpbWU7XG4gICAgICB2YXIgcyA9IGFuaW0uc2V0dGluZ3M7XG4gICAgICBpZiAocy5kaXJlY3Rpb24gPT09ICdyZXZlcnNlJykgcmV2ZXJzZVR3ZWVucyhhbmltKTtcbiAgICAgIGlmIChzLmRpcmVjdGlvbiA9PT0gJ2FsdGVybmF0ZScgJiYgIXMubG9vcCkgcy5sb29wID0gMTtcbiAgICAgIHNldFdpbGxDaGFuZ2UoYW5pbSk7XG4gICAgICBhbmltYXRpb25zLnB1c2goYW5pbSk7XG4gICAgICBpZiAoIXJhZikgZW5naW5lKCk7XG4gICAgfVxuXG4gICAgYW5pbS5yZXN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoYW5pbS5yZXZlcnNlZCkgcmV2ZXJzZVR3ZWVucyhhbmltKTtcbiAgICAgIGFuaW0ucGF1c2UoKTtcbiAgICAgIGFuaW0uc2VlaygwKTtcbiAgICAgIGFuaW0ucGxheSgpO1xuICAgIH1cblxuICAgIGlmIChhbmltLnNldHRpbmdzLmF1dG9wbGF5KSBhbmltLnBsYXkoKTtcblxuICAgIHJldHVybiBhbmltO1xuXG4gIH1cblxuICAvLyBSZW1vdmUgb25lIG9yIG11bHRpcGxlIHRhcmdldHMgZnJvbSBhbGwgYWN0aXZlIGFuaW1hdGlvbnMuXG5cbiAgdmFyIHJlbW92ZSA9IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XG4gICAgdmFyIHRhcmdldHMgPSBmbGF0dGVuQXJyYXkoaXMuYXJyKGVsZW1lbnRzKSA/IGVsZW1lbnRzLm1hcCh0b0FycmF5KSA6IHRvQXJyYXkoZWxlbWVudHMpKTtcbiAgICBmb3IgKHZhciBpID0gYW5pbWF0aW9ucy5sZW5ndGgtMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHZhciBhbmltYXRpb24gPSBhbmltYXRpb25zW2ldO1xuICAgICAgdmFyIHR3ZWVucyA9IGFuaW1hdGlvbi50d2VlbnM7XG4gICAgICBmb3IgKHZhciB0ID0gdHdlZW5zLmxlbmd0aC0xOyB0ID49IDA7IHQtLSkge1xuICAgICAgICB2YXIgYW5pbWF0YWJsZXMgPSB0d2VlbnNbdF0uYW5pbWF0YWJsZXM7XG4gICAgICAgIGZvciAodmFyIGEgPSBhbmltYXRhYmxlcy5sZW5ndGgtMTsgYSA+PSAwOyBhLS0pIHtcbiAgICAgICAgICBpZiAoYXJyYXlDb250YWlucyh0YXJnZXRzLCBhbmltYXRhYmxlc1thXS50YXJnZXQpKSB7XG4gICAgICAgICAgICBhbmltYXRhYmxlcy5zcGxpY2UoYSwgMSk7XG4gICAgICAgICAgICBpZiAoIWFuaW1hdGFibGVzLmxlbmd0aCkgdHdlZW5zLnNwbGljZSh0LCAxKTtcbiAgICAgICAgICAgIGlmICghdHdlZW5zLmxlbmd0aCkgYW5pbWF0aW9uLnBhdXNlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYW5pbWF0aW9uLnZlcnNpb24gPSB2ZXJzaW9uO1xuICBhbmltYXRpb24uc3BlZWQgPSAxO1xuICBhbmltYXRpb24ubGlzdCA9IGFuaW1hdGlvbnM7XG4gIGFuaW1hdGlvbi5yZW1vdmUgPSByZW1vdmU7XG4gIGFuaW1hdGlvbi5lYXNpbmdzID0gZWFzaW5ncztcbiAgYW5pbWF0aW9uLmdldFZhbHVlID0gZ2V0SW5pdGlhbFRhcmdldFZhbHVlO1xuICBhbmltYXRpb24ucGF0aCA9IGdldFBhdGhQcm9wcztcbiAgYW5pbWF0aW9uLnJhbmRvbSA9IHJhbmRvbTtcblxuICByZXR1cm4gYW5pbWF0aW9uO1xuXG59KSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9hbmltZWpzL2FuaW1lLmpzXG4gKiogbW9kdWxlIGlkID0gMTZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIlxucmlvdC50YWcyKCdtZW51LWxpc3QnLCAnPG9sIGNsYXNzPVwibWVudS1saXN0LXdyYXBwZXJcIj4gPGxpIGVhY2g9XCJ7dHlwZSBpbiBkYXRhfVwiPiA8b2wgY2xhc3M9XCJtZW51LWxpc3RcIj4gPGxpIGVhY2g9XCJ7Y2F0IGluIHR5cGUubGlzdH1cIj4gPGRpdiBvbmNsaWNrPVwie29wZW5JdGVtc31cIiBjbGFzcz1cImNhdGVnb3J5IHRlc3Qgc2FtcGxlIHdoYXRcIj57Y2F0LmphfTwvZGl2PiA8b2wgY2xhc3M9XCJtZW51LWl0ZW1cIj4gPGxpIGVhY2g9XCJ7aXRlbSBpbiBjYXQubWVudX1cIiBvbmNsaWNrPVwie2NoYW5nZUl0ZW0oaXRlbSl9XCI+IDxkaXYgY2xhc3M9XCJsZWZ0XCI+IDxkaXYgcmlvdC1zdHlsZT1cImJhY2tncm91bmQtaW1hZ2U6IHVybCguL2ltYWdlcy9tZW51L3tpdGVtLmltYWdlfSlcIiBjbGFzcz1cInRodW1iXCI+PC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPVwicmlnaHRcIj4gPGRpdiBjbGFzcz1cIm5hbWVcIj57aXRlbS5uYW1lfTwvZGl2PiA8ZGl2IGNsYXNzPVwicHJpY2VcIj57aXRlbS5wcmljZX3lhoY8L2Rpdj4gPGRpdiBjbGFzcz1cImNvbW1lbnRcIj57aXRlbS5jb21tZW50fTwvZGl2PiA8L2Rpdj4gPC9saT4gPC9vbD4gPC9saT4gPC9vbD4gPC9saT4gPC9vbD4nLCAnbWVudS1saXN0IC5tZW51LWxpc3Qtd3JhcHBlciAubWVudS1saXN0IC5jYXRlZ29yeSxbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdC13cmFwcGVyIC5tZW51LWxpc3QgLmNhdGVnb3J5LFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3Qtd3JhcHBlciAubWVudS1saXN0IC5jYXRlZ29yeXsgcG9zaXRpb246IHJlbGF0aXZlOyB3aWR0aDogMTAwJTsgaGVpZ2h0OiA0MHB4OyBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2NjYzsgbGluZS1oZWlnaHQ6IDQwcHg7IHRleHQtYWxpZ246IGNlbnRlcjsgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAuNCBlYXNlOyB9IG1lbnUtbGlzdCAubWVudS1saXN0LXdyYXBwZXIgLm1lbnUtbGlzdCAuY2F0ZWdvcnk6OmJlZm9yZSxbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdC13cmFwcGVyIC5tZW51LWxpc3QgLmNhdGVnb3J5OjpiZWZvcmUsW2RhdGEtaXM9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdC13cmFwcGVyIC5tZW51LWxpc3QgLmNhdGVnb3J5OjpiZWZvcmV7IGNvbnRlbnQ6IFwiXFxcXGYxMjNcIjsgcG9zaXRpb246IGFic29sdXRlOyBsZWZ0OiAwOyBkaXNwbGF5OiBibG9jazsgd2lkdGg6IDQwcHg7IGhlaWdodDogNDBweDsgdGV4dC1hbGlnbjogY2VudGVyOyBsaW5lLWhlaWdodDogNDBweDsgZm9udC1mYW1pbHk6IFxcJ0lvbmljb25zXFwnOyBmb250LXNpemU6IDEzcHg7IHRyYW5zZm9ybTogcm90YXRlKC05MGRlZyk7IH0gbWVudS1saXN0IC5tZW51LWxpc3Qtd3JhcHBlciAubWVudS1saXN0IC5jYXRlZ29yeTpob3ZlcixbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdC13cmFwcGVyIC5tZW51LWxpc3QgLmNhdGVnb3J5OmhvdmVyLFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3Qtd3JhcHBlciAubWVudS1saXN0IC5jYXRlZ29yeTpob3ZlcnsgYmFja2dyb3VuZDogI2NjYzsgfSBtZW51LWxpc3QgLm1lbnUtbGlzdC13cmFwcGVyIC5tZW51LWxpc3QgLmNhdGVnb3J5Lm9wZW46OmJlZm9yZSxbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdC13cmFwcGVyIC5tZW51LWxpc3QgLmNhdGVnb3J5Lm9wZW46OmJlZm9yZSxbZGF0YS1pcz1cIm1lbnUtbGlzdFwiXSAubWVudS1saXN0LXdyYXBwZXIgLm1lbnUtbGlzdCAuY2F0ZWdvcnkub3Blbjo6YmVmb3JleyB0cmFuc2Zvcm06IHJvdGF0ZSgwKTsgfSBtZW51LWxpc3QgLm1lbnUtbGlzdC13cmFwcGVyIC5tZW51LWxpc3QgLmNhdGVnb3J5Lm9wZW4gKyAubWVudS1pdGVtLFtyaW90LXRhZz1cIm1lbnUtbGlzdFwiXSAubWVudS1saXN0LXdyYXBwZXIgLm1lbnUtbGlzdCAuY2F0ZWdvcnkub3BlbiArIC5tZW51LWl0ZW0sW2RhdGEtaXM9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdC13cmFwcGVyIC5tZW51LWxpc3QgLmNhdGVnb3J5Lm9wZW4gKyAubWVudS1pdGVteyBkaXNwbGF5OiBibG9jazsgfSBtZW51LWxpc3QgLm1lbnUtbGlzdC13cmFwcGVyIC5tZW51LWxpc3QgLm1lbnUtaXRlbSxbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdC13cmFwcGVyIC5tZW51LWxpc3QgLm1lbnUtaXRlbSxbZGF0YS1pcz1cIm1lbnUtbGlzdFwiXSAubWVudS1saXN0LXdyYXBwZXIgLm1lbnUtbGlzdCAubWVudS1pdGVteyBkaXNwbGF5OiBub25lOyB9IG1lbnUtbGlzdCAubWVudS1saXN0LXdyYXBwZXIgLm1lbnUtbGlzdCAubWVudS1pdGVtIGxpLFtyaW90LXRhZz1cIm1lbnUtbGlzdFwiXSAubWVudS1saXN0LXdyYXBwZXIgLm1lbnUtbGlzdCAubWVudS1pdGVtIGxpLFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3Qtd3JhcHBlciAubWVudS1saXN0IC5tZW51LWl0ZW0gbGl7IG92ZXJmbG93OiBoaWRkZW47IGNsZWFyOiBib3RoOyBoZWlnaHQ6IDgwcHg7IGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjY2NjOyB9IG1lbnUtbGlzdCAubWVudS1saXN0LXdyYXBwZXIgLm1lbnUtbGlzdCAubWVudS1pdGVtIGxpOmhvdmVyLFtyaW90LXRhZz1cIm1lbnUtbGlzdFwiXSAubWVudS1saXN0LXdyYXBwZXIgLm1lbnUtbGlzdCAubWVudS1pdGVtIGxpOmhvdmVyLFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3Qtd3JhcHBlciAubWVudS1saXN0IC5tZW51LWl0ZW0gbGk6aG92ZXJ7IGJhY2tncm91bmQ6ICNkZGQ7IH0gbWVudS1saXN0IC5tZW51LWxpc3Qtd3JhcHBlciAubWVudS1saXN0IC5tZW51LWl0ZW0gbGkgLmxlZnQsW3Jpb3QtdGFnPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3Qtd3JhcHBlciAubWVudS1saXN0IC5tZW51LWl0ZW0gbGkgLmxlZnQsW2RhdGEtaXM9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdC13cmFwcGVyIC5tZW51LWxpc3QgLm1lbnUtaXRlbSBsaSAubGVmdHsgZmxvYXQ6IGxlZnQ7IHdpZHRoOiAxMjBweDsgfSBtZW51LWxpc3QgLm1lbnUtbGlzdC13cmFwcGVyIC5tZW51LWxpc3QgLm1lbnUtaXRlbSBsaSAubGVmdCAudGh1bWIsW3Jpb3QtdGFnPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3Qtd3JhcHBlciAubWVudS1saXN0IC5tZW51LWl0ZW0gbGkgLmxlZnQgLnRodW1iLFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3Qtd3JhcHBlciAubWVudS1saXN0IC5tZW51LWl0ZW0gbGkgLmxlZnQgLnRodW1ieyB3aWR0aDogMTAwcHg7IGhlaWdodDogNzBweDsgbWFyZ2luOiA1cHggMTBweDsgYmFja2dyb3VuZDogY2VudGVyIGNlbnRlciBuby1yZXBlYXQgI2VlZTsgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjsgfSBtZW51LWxpc3QgLm1lbnUtbGlzdC13cmFwcGVyIC5tZW51LWxpc3QgLm1lbnUtaXRlbSBsaSAucmlnaHQsW3Jpb3QtdGFnPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3Qtd3JhcHBlciAubWVudS1saXN0IC5tZW51LWl0ZW0gbGkgLnJpZ2h0LFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3Qtd3JhcHBlciAubWVudS1saXN0IC5tZW51LWl0ZW0gbGkgLnJpZ2h0eyBtYXJnaW4tbGVmdDogMTIwcHg7IHBhZGRpbmc6IDE1cHggNXB4IDAgMDsgfSBtZW51LWxpc3QgLm1lbnUtbGlzdC13cmFwcGVyIC5tZW51LWxpc3QgLm1lbnUtaXRlbSBsaSAucmlnaHQgPiBkaXYsW3Jpb3QtdGFnPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3Qtd3JhcHBlciAubWVudS1saXN0IC5tZW51LWl0ZW0gbGkgLnJpZ2h0ID4gZGl2LFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3Qtd3JhcHBlciAubWVudS1saXN0IC5tZW51LWl0ZW0gbGkgLnJpZ2h0ID4gZGl2eyBvdmVyZmxvdzogaGlkZGVuOyB3aGl0ZS1zcGFjZTogbm93cmFwOyB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpczsgfSBtZW51LWxpc3QgLm1lbnUtbGlzdC13cmFwcGVyIC5tZW51LWxpc3QgLm1lbnUtaXRlbSBsaSAucmlnaHQgLm5hbWUsW3Jpb3QtdGFnPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3Qtd3JhcHBlciAubWVudS1saXN0IC5tZW51LWl0ZW0gbGkgLnJpZ2h0IC5uYW1lLFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3Qtd3JhcHBlciAubWVudS1saXN0IC5tZW51LWl0ZW0gbGkgLnJpZ2h0IC5uYW1leyBoZWlnaHQ6IDIwcHg7IGxpbmUtaGVpZ2h0OiAyMHB4OyBmb250LXNpemU6IDE2cHg7IH0gbWVudS1saXN0IC5tZW51LWxpc3Qtd3JhcHBlciAubWVudS1saXN0IC5tZW51LWl0ZW0gbGkgLnJpZ2h0IC5wcmljZSxbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdC13cmFwcGVyIC5tZW51LWxpc3QgLm1lbnUtaXRlbSBsaSAucmlnaHQgLnByaWNlLFtkYXRhLWlzPVwibWVudS1saXN0XCJdIC5tZW51LWxpc3Qtd3JhcHBlciAubWVudS1saXN0IC5tZW51LWl0ZW0gbGkgLnJpZ2h0IC5wcmljZXsgaGVpZ2h0OiAxNXB4OyBsaW5lLWhlaWdodDogMTVweDsgZm9udC1zaXplOiAxMHB4OyB9IG1lbnUtbGlzdCAubWVudS1saXN0LXdyYXBwZXIgLm1lbnUtbGlzdCAubWVudS1pdGVtIGxpIC5yaWdodCAuY29tbWVudCxbcmlvdC10YWc9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdC13cmFwcGVyIC5tZW51LWxpc3QgLm1lbnUtaXRlbSBsaSAucmlnaHQgLmNvbW1lbnQsW2RhdGEtaXM9XCJtZW51LWxpc3RcIl0gLm1lbnUtbGlzdC13cmFwcGVyIC5tZW51LWxpc3QgLm1lbnUtaXRlbSBsaSAucmlnaHQgLmNvbW1lbnR7IGhlaWdodDogMjBweDsgbGluZS1oZWlnaHQ6IDIwcHg7IGZvbnQtc2l6ZTogMTJweDsgfScsICcnLCBmdW5jdGlvbihvcHRzKSB7XG52YXIgc3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZScpO1xudmFyIHNlbGYgPSB0aGlzO1xuXG5zZWxmLnRvZ2dsZUl0ZW0gPSBmdW5jdGlvbiAoX3RoaXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhfdGhpcyk7XG4gICAgICAgIF90aGlzLmNhdC5pc09wZW4gPSB+X3RoaXMuY2F0LmlzT3BlbjtcbiAgICAgICAgc2VsZi51cGRhdGUoKTtcbiAgICB9O1xufTtcblxuc2VsZi5jaGFuZ2VJdGVtID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBvYnMudHJpZ2dlcignY2hhbmdlUmVjb21tZW5kJywgZGF0YSk7XG4gICAgfTtcbn07XG5cbnNlbGYub3Blbkl0ZW1zID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJGVsZW0gPSBlLnRhcmdldDtcblxuICAgIGlmICh+JGVsZW0uY2xhc3NMaXN0LnZhbHVlLmluZGV4T2YoJ29wZW4nKSkge1xuICAgICAgICAkZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJGVsZW0uY2xhc3NMaXN0LmFkZCgnb3BlbicpO1xuICAgIH1cbn07XG5cbnN0b3JlLmdldE1lbnVMaXN0KCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIHNlbGYuZGF0YSA9IGRhdGE7XG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgc2VsZi51cGRhdGUoKTtcbn0pO1xufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvc2NyaXB0cy90YWdzL21lbnUtbGlzdC50YWdcbiAqKi8iLCJcbnJpb3QudGFnMignbWVudScsICc8bWVudS1saXN0PjwvbWVudS1saXN0PicsICcnLCAnJywgZnVuY3Rpb24ob3B0cykge1xufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvc2NyaXB0cy90YWdzL21lbnUudGFnXG4gKiovIiwiXG5yaW90LnRhZzIoJ25ld3MnLCAnPG5ld3MtbGlzdD48L25ld3MtbGlzdD4nLCAnJywgJycsIGZ1bmN0aW9uKG9wdHMpIHtcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3NjcmlwdHMvdGFncy9uZXdzLnRhZ1xuICoqLyIsIlxucmlvdC50YWcyKCduZXdzLWxpc3QnLCAnPGEgaHJlZj1cIiMvbmV3cy9lZGl0b3IvbmV3XCIgY2xhc3M9XCJidG4gYnRuLWRhbmdlciBidG4tYmxvY2sgYnRuLWxhcmdlXCI+6KiY5LqL44KS5pu444GPPC9hPicsICcnLCAnJywgZnVuY3Rpb24ob3B0cykge1xufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvc2NyaXB0cy90YWdzL25ld3MtbGlzdC50YWdcbiAqKi8iLCJcbnJpb3QudGFnMignbmV3cy1lZGl0b3InLCAnPGRpdiBjbGFzcz1cIm5ld3MtZWRpdG9yXCI+IDx1bCBjbGFzcz1cImlucHV0LWdyb3VwXCI+IDxsaT48c3BhbiBjbGFzcz1cImxhYmVsXCI+44K/44Kk44OI44OrPC9zcGFuPiA8ZGl2IGNsYXNzPVwiaW5wdXQgbGFyZ2VcIj4gPHRleHRhcmVhIGlkPVwiaW5wdXRUaXRsZVwiIGNsYXNzPVwiaW5wdXQtZm9ybVwiPjwvdGV4dGFyZWE+IDwvZGl2PiA8L2xpPiA8bGk+PHNwYW4gY2xhc3M9XCJsYWJlbFwiPuiomOS6i0lE77yI5Y2K6KeS6Iux5pWw44GoLeOBruOBv++8iTwvc3Bhbj4gPGRpdiBjbGFzcz1cImlucHV0IHNtYWxsXCI+IDxpbnB1dCBwbGFjZWhvbGRlcj1cIuecgeeVpeOBl+OBn+WgtOWQiOOBr2VudHJ5K2RhdGVcIiBjbGFzcz1cImlucHV0LWZvcm1cIj4gPC9kaXY+PHNwYW4gY2xhc3M9XCJub3RlIG5vdGUtZGFuZ2VyXCI+PHNwYW4gY2xhc3M9XCJpb24tYWxlcnQtY2lyY2xlZCBpY29uXCI+PC9zcGFuPuWNiuinkuiLseaVsOWtl+OBqCAtICjjg4/jgqTjg5Xjg7Mp44Gu44G/5YWl5Yqb5Y+v6IO944Gn44GZPC9zcGFuPiA8L2xpPiA8bGk+IDxuZXdzLWVkaXRvci1ib2R5PjwvbmV3cy1lZGl0b3ItYm9keT4gPC9saT4gPC91bD4gPC9kaXY+JywgJy5pbnB1dC1ncm91cCB7IHBhZGRpbmc6IDhweCAxMnB4OyB9IC5pbnB1dC1ncm91cCBsaSB7IG1hcmdpbi1ib3R0b206IDE1cHg7IH0gLmlucHV0LWdyb3VwIGxpIC5sYWJlbCB7IG1hcmdpbi1ib3R0b206IDVweDsgZm9udC1zaXplOiAxMnB4OyBmb250LXdlaWdodDogYm9sZDsgfSAuaW5wdXQtZ3JvdXAgbGkgLm5vdGUgeyBkaXNwbGF5OiBibG9jazsgbWFyZ2luOiA0cHggMTBweDsgZm9udC1zaXplOiAxMnB4OyBmb250LXdlaWdodDogYm9sZDsgdmlzaWJpbGl0eTogaGlkZGVuOyB9IC5pbnB1dC1ncm91cCBsaSAubm90ZS5ub3RlLWRhbmdlciB7IGNvbG9yOiAjZWIyMTQyOyB9IC5pbnB1dC1ncm91cCBsaSAubm90ZSAuaWNvbiB7IG1hcmdpbi1yaWdodDogNXB4OyB9IC5pbnB1dCB7IHBvc2l0aW9uOiByZWxhdGl2ZTsgfSAuaW5wdXQ6OmJlZm9yZSB7IGNvbnRlbnQ6IFwiXCI7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgbGVmdDogMDsgYm90dG9tOiAwOyBkaXNwbGF5OiBibG9jazsgd2lkdGg6IDEwMCU7IGhlaWdodDogMnB4OyBib3JkZXItdG9wOiAwOyBib3JkZXItbGVmdDogMXB4IHNvbGlkICNhYWE7IGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjYWFhOyBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjYWFhOyB9IC5pbnB1dCAuaW5wdXQtZm9ybSB7IHdpZHRoOiAxMDAlOyBwYWRkaW5nOiAwIDVweDsgYm94LXNpemluZzogYm9yZGVyLWJveDsgYm9yZGVyOiBub25lOyB9IC5pbnB1dCB0ZXh0YXJlYS5pbnB1dC1mb3JtIHsgcmVzaXplOiBub25lOyB9IC5pbnB1dC5sYXJnZSAuaW5wdXQtZm9ybSB7IGZvbnQtc2l6ZTogMjBweDsgbGluZS1oZWlnaHQ6IDQwcHg7IH0gLmlucHV0Lm5vcm1hbCAuaW5wdXQtZm9ybSB7IGZvbnQtc2l6ZTogMTZweDsgbGluZS1oZWlnaHQ6IDMwcHg7IH0gLmlucHV0LnNtYWxsIC5pbnB1dC1mb3JtIHsgZm9udC1zaXplOiAxNHB4OyBsaW5lLWhlaWdodDogMjBweDsgfScsICcnLCBmdW5jdGlvbihvcHRzKSB7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG50aGlzLm9uKCdtb3VudCcsIGZ1bmN0aW9uICgpIHtcbiAgICB1dGlscy5hdXRvUmVzaXplKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnB1dFRpdGxlJykpO1xufSk7XG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9zY3JpcHRzL3RhZ3MvbmV3cy1lZGl0b3IudGFnXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==