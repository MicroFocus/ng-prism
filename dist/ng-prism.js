/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var angular_1 = __webpack_require__(1);
	var highlight_directive_1 = __webpack_require__(2);
	var insert_element_service_1 = __webpack_require__(4);
	var repeat_as_code_directive_1 = __webpack_require__(5);
	var repeat_as_code_service_1 = __webpack_require__(6);
	var toggleable_code_directive_1 = __webpack_require__(9);
	var toggle_repeat_code_directive_1 = __webpack_require__(11);
	angular_1.module('ng-prism', [])
	    .directive('highlight', highlight_directive_1.default)
	    .directive('repeatAsCode', repeat_as_code_directive_1.default)
	    .directive('toggleableCode', toggleable_code_directive_1.default)
	    .directive('toggleRepeatCode', toggle_repeat_code_directive_1.default)
	    .factory('RepeatAsCodeService', repeat_as_code_service_1.default)
	    .service('InsertElementService', insert_element_service_1.default);
	

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = angular;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Prism = __webpack_require__(3);
	exports.default = [
	    function () {
	        return {
	            priority: 1000,
	            restrict: 'A',
	            compile: function (element, attr) {
	                element.removeAttr('highlight');
	                element.parent().attr('dir', 'ltr');
	                var language = attr.highlight || 'javascript';
	                element.addClass("language-" + language);
	                Prism.highlightElement(element[0]);
	            }
	        };
	    }
	];
	

/***/ },
/* 3 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/* **********************************************
	     Begin prism-core.js
	********************************************** */

	var _self = (typeof window !== 'undefined')
		? window   // if in browser
		: (
			(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
			? self // if in worker
			: {}   // if in node js
		);

	/**
	 * Prism: Lightweight, robust, elegant syntax highlighting
	 * MIT license http://www.opensource.org/licenses/mit-license.php/
	 * @author Lea Verou http://lea.verou.me
	 */

	var Prism = (function(){

	// Private helper vars
	var lang = /\blang(?:uage)?-(\w+)\b/i;
	var uniqueId = 0;

	var _ = _self.Prism = {
		util: {
			encode: function (tokens) {
				if (tokens instanceof Token) {
					return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
				} else if (_.util.type(tokens) === 'Array') {
					return tokens.map(_.util.encode);
				} else {
					return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
				}
			},

			type: function (o) {
				return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
			},

			objId: function (obj) {
				if (!obj['__id']) {
					Object.defineProperty(obj, '__id', { value: ++uniqueId });
				}
				return obj['__id'];
			},

			// Deep clone a language definition (e.g. to extend it)
			clone: function (o) {
				var type = _.util.type(o);

				switch (type) {
					case 'Object':
						var clone = {};

						for (var key in o) {
							if (o.hasOwnProperty(key)) {
								clone[key] = _.util.clone(o[key]);
							}
						}

						return clone;

					case 'Array':
						// Check for existence for IE8
						return o.map && o.map(function(v) { return _.util.clone(v); });
				}

				return o;
			}
		},

		languages: {
			extend: function (id, redef) {
				var lang = _.util.clone(_.languages[id]);

				for (var key in redef) {
					lang[key] = redef[key];
				}

				return lang;
			},

			/**
			 * Insert a token before another token in a language literal
			 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
			 * we cannot just provide an object, we need anobject and a key.
			 * @param inside The key (or language id) of the parent
			 * @param before The key to insert before. If not provided, the function appends instead.
			 * @param insert Object with the key/value pairs to insert
			 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
			 */
			insertBefore: function (inside, before, insert, root) {
				root = root || _.languages;
				var grammar = root[inside];

				if (arguments.length == 2) {
					insert = arguments[1];

					for (var newToken in insert) {
						if (insert.hasOwnProperty(newToken)) {
							grammar[newToken] = insert[newToken];
						}
					}

					return grammar;
				}

				var ret = {};

				for (var token in grammar) {

					if (grammar.hasOwnProperty(token)) {

						if (token == before) {

							for (var newToken in insert) {

								if (insert.hasOwnProperty(newToken)) {
									ret[newToken] = insert[newToken];
								}
							}
						}

						ret[token] = grammar[token];
					}
				}

				// Update references in other language definitions
				_.languages.DFS(_.languages, function(key, value) {
					if (value === root[inside] && key != inside) {
						this[key] = ret;
					}
				});

				return root[inside] = ret;
			},

			// Traverse a language definition with Depth First Search
			DFS: function(o, callback, type, visited) {
				visited = visited || {};
				for (var i in o) {
					if (o.hasOwnProperty(i)) {
						callback.call(o, i, o[i], type || i);

						if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
							visited[_.util.objId(o[i])] = true;
							_.languages.DFS(o[i], callback, null, visited);
						}
						else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
							visited[_.util.objId(o[i])] = true;
							_.languages.DFS(o[i], callback, i, visited);
						}
					}
				}
			}
		},
		plugins: {},

		highlightAll: function(async, callback) {
			var env = {
				callback: callback,
				selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
			};

			_.hooks.run("before-highlightall", env);

			var elements = env.elements || document.querySelectorAll(env.selector);

			for (var i=0, element; element = elements[i++];) {
				_.highlightElement(element, async === true, env.callback);
			}
		},

		highlightElement: function(element, async, callback) {
			// Find language
			var language, grammar, parent = element;

			while (parent && !lang.test(parent.className)) {
				parent = parent.parentNode;
			}

			if (parent) {
				language = (parent.className.match(lang) || [,''])[1].toLowerCase();
				grammar = _.languages[language];
			}

			// Set language on the element, if not present
			element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

			// Set language on the parent, for styling
			parent = element.parentNode;

			if (/pre/i.test(parent.nodeName)) {
				parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
			}

			var code = element.textContent;

			var env = {
				element: element,
				language: language,
				grammar: grammar,
				code: code
			};

			_.hooks.run('before-sanity-check', env);

			if (!env.code || !env.grammar) {
				if (env.code) {
					env.element.textContent = env.code;
				}
				_.hooks.run('complete', env);
				return;
			}

			_.hooks.run('before-highlight', env);

			if (async && _self.Worker) {
				var worker = new Worker(_.filename);

				worker.onmessage = function(evt) {
					env.highlightedCode = evt.data;

					_.hooks.run('before-insert', env);

					env.element.innerHTML = env.highlightedCode;

					callback && callback.call(env.element);
					_.hooks.run('after-highlight', env);
					_.hooks.run('complete', env);
				};

				worker.postMessage(JSON.stringify({
					language: env.language,
					code: env.code,
					immediateClose: true
				}));
			}
			else {
				env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(element);

				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			}
		},

		highlight: function (text, grammar, language) {
			var tokens = _.tokenize(text, grammar);
			return Token.stringify(_.util.encode(tokens), language);
		},

		tokenize: function(text, grammar, language) {
			var Token = _.Token;

			var strarr = [text];

			var rest = grammar.rest;

			if (rest) {
				for (var token in rest) {
					grammar[token] = rest[token];
				}

				delete grammar.rest;
			}

			tokenloop: for (var token in grammar) {
				if(!grammar.hasOwnProperty(token) || !grammar[token]) {
					continue;
				}

				var patterns = grammar[token];
				patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

				for (var j = 0; j < patterns.length; ++j) {
					var pattern = patterns[j],
						inside = pattern.inside,
						lookbehind = !!pattern.lookbehind,
						greedy = !!pattern.greedy,
						lookbehindLength = 0,
						alias = pattern.alias;

					if (greedy && !pattern.pattern.global) {
						// Without the global flag, lastIndex won't work
						var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
						pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
					}

					pattern = pattern.pattern || pattern;

					// Don’t cache length as it changes during the loop
					for (var i=0, pos = 0; i<strarr.length; pos += strarr[i].length, ++i) {

						var str = strarr[i];

						if (strarr.length > text.length) {
							// Something went terribly wrong, ABORT, ABORT!
							break tokenloop;
						}

						if (str instanceof Token) {
							continue;
						}

						pattern.lastIndex = 0;

						var match = pattern.exec(str),
						    delNum = 1;

						// Greedy patterns can override/remove up to two previously matched tokens
						if (!match && greedy && i != strarr.length - 1) {
							pattern.lastIndex = pos;
							match = pattern.exec(text);
							if (!match) {
								break;
							}

							var from = match.index + (lookbehind ? match[1].length : 0),
							    to = match.index + match[0].length,
							    k = i,
							    p = pos;

							for (var len = strarr.length; k < len && p < to; ++k) {
								p += strarr[k].length;
								// Move the index i to the element in strarr that is closest to from
								if (from >= p) {
									++i;
									pos = p;
								}
							}

							/*
							 * If strarr[i] is a Token, then the match starts inside another Token, which is invalid
							 * If strarr[k - 1] is greedy we are in conflict with another greedy pattern
							 */
							if (strarr[i] instanceof Token || strarr[k - 1].greedy) {
								continue;
							}

							// Number of tokens to delete and replace with the new match
							delNum = k - i;
							str = text.slice(pos, p);
							match.index -= pos;
						}

						if (!match) {
							continue;
						}

						if(lookbehind) {
							lookbehindLength = match[1].length;
						}

						var from = match.index + lookbehindLength,
						    match = match[0].slice(lookbehindLength),
						    to = from + match.length,
						    before = str.slice(0, from),
						    after = str.slice(to);

						var args = [i, delNum];

						if (before) {
							args.push(before);
						}

						var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

						args.push(wrapped);

						if (after) {
							args.push(after);
						}

						Array.prototype.splice.apply(strarr, args);
					}
				}
			}

			return strarr;
		},

		hooks: {
			all: {},

			add: function (name, callback) {
				var hooks = _.hooks.all;

				hooks[name] = hooks[name] || [];

				hooks[name].push(callback);
			},

			run: function (name, env) {
				var callbacks = _.hooks.all[name];

				if (!callbacks || !callbacks.length) {
					return;
				}

				for (var i=0, callback; callback = callbacks[i++];) {
					callback(env);
				}
			}
		}
	};

	var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
		this.type = type;
		this.content = content;
		this.alias = alias;
		// Copy of the full string this token was created from
		this.length = (matchedStr || "").length|0;
		this.greedy = !!greedy;
	};

	Token.stringify = function(o, language, parent) {
		if (typeof o == 'string') {
			return o;
		}

		if (_.util.type(o) === 'Array') {
			return o.map(function(element) {
				return Token.stringify(element, language, o);
			}).join('');
		}

		var env = {
			type: o.type,
			content: Token.stringify(o.content, language, parent),
			tag: 'span',
			classes: ['token', o.type],
			attributes: {},
			language: language,
			parent: parent
		};

		if (env.type == 'comment') {
			env.attributes['spellcheck'] = 'true';
		}

		if (o.alias) {
			var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
			Array.prototype.push.apply(env.classes, aliases);
		}

		_.hooks.run('wrap', env);

		var attributes = Object.keys(env.attributes).map(function(name) {
			return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
		}).join(' ');

		return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';

	};

	if (!_self.document) {
		if (!_self.addEventListener) {
			// in Node.js
			return _self.Prism;
		}
	 	// In worker
		_self.addEventListener('message', function(evt) {
			var message = JSON.parse(evt.data),
			    lang = message.language,
			    code = message.code,
			    immediateClose = message.immediateClose;

			_self.postMessage(_.highlight(code, _.languages[lang], lang));
			if (immediateClose) {
				_self.close();
			}
		}, false);

		return _self.Prism;
	}

	//Get current script and highlight
	var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

	if (script) {
		_.filename = script.src;

		if (document.addEventListener && !script.hasAttribute('data-manual')) {
			if(document.readyState !== "loading") {
				if (window.requestAnimationFrame) {
					window.requestAnimationFrame(_.highlightAll);
				} else {
					window.setTimeout(_.highlightAll, 16);
				}
			}
			else {
				document.addEventListener('DOMContentLoaded', _.highlightAll);
			}
		}
	}

	return _self.Prism;

	})();

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = Prism;
	}

	// hack for components to work correctly in node.js
	if (typeof global !== 'undefined') {
		global.Prism = Prism;
	}


	/* **********************************************
	     Begin prism-markup.js
	********************************************** */

	Prism.languages.markup = {
		'comment': /<!--[\w\W]*?-->/,
		'prolog': /<\?[\w\W]+?\?>/,
		'doctype': /<!DOCTYPE[\w\W]+?>/i,
		'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
		'tag': {
			pattern: /<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
			inside: {
				'tag': {
					pattern: /^<\/?[^\s>\/]+/i,
					inside: {
						'punctuation': /^<\/?/,
						'namespace': /^[^\s>\/:]+:/
					}
				},
				'attr-value': {
					pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
					inside: {
						'punctuation': /[=>"']/
					}
				},
				'punctuation': /\/?>/,
				'attr-name': {
					pattern: /[^\s>\/]+/,
					inside: {
						'namespace': /^[^\s>\/:]+:/
					}
				}

			}
		},
		'entity': /&#?[\da-z]{1,8};/i
	};

	// Plugin to make entity title show the real entity, idea by Roman Komarov
	Prism.hooks.add('wrap', function(env) {

		if (env.type === 'entity') {
			env.attributes['title'] = env.content.replace(/&amp;/, '&');
		}
	});

	Prism.languages.xml = Prism.languages.markup;
	Prism.languages.html = Prism.languages.markup;
	Prism.languages.mathml = Prism.languages.markup;
	Prism.languages.svg = Prism.languages.markup;


	/* **********************************************
	     Begin prism-css.js
	********************************************** */

	Prism.languages.css = {
		'comment': /\/\*[\w\W]*?\*\//,
		'atrule': {
			pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
			inside: {
				'rule': /@[\w-]+/
				// See rest below
			}
		},
		'url': /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
		'selector': /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
		'string': {
			pattern: /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
			greedy: true
		},
		'property': /(\b|\B)[\w-]+(?=\s*:)/i,
		'important': /\B!important\b/i,
		'function': /[-a-z0-9]+(?=\()/i,
		'punctuation': /[(){};:]/
	};

	Prism.languages.css['atrule'].inside.rest = Prism.util.clone(Prism.languages.css);

	if (Prism.languages.markup) {
		Prism.languages.insertBefore('markup', 'tag', {
			'style': {
				pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
				lookbehind: true,
				inside: Prism.languages.css,
				alias: 'language-css'
			}
		});
		
		Prism.languages.insertBefore('inside', 'attr-value', {
			'style-attr': {
				pattern: /\s*style=("|').*?\1/i,
				inside: {
					'attr-name': {
						pattern: /^\s*style/i,
						inside: Prism.languages.markup.tag.inside
					},
					'punctuation': /^\s*=\s*['"]|['"]\s*$/,
					'attr-value': {
						pattern: /.+/i,
						inside: Prism.languages.css
					}
				},
				alias: 'language-css'
			}
		}, Prism.languages.markup.tag);
	}

	/* **********************************************
	     Begin prism-clike.js
	********************************************** */

	Prism.languages.clike = {
		'comment': [
			{
				pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
				lookbehind: true
			},
			{
				pattern: /(^|[^\\:])\/\/.*/,
				lookbehind: true
			}
		],
		'string': {
			pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
			greedy: true
		},
		'class-name': {
			pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
			lookbehind: true,
			inside: {
				punctuation: /(\.|\\)/
			}
		},
		'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
		'boolean': /\b(true|false)\b/,
		'function': /[a-z0-9_]+(?=\()/i,
		'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
		'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
		'punctuation': /[{}[\];(),.:]/
	};


	/* **********************************************
	     Begin prism-javascript.js
	********************************************** */

	Prism.languages.javascript = Prism.languages.extend('clike', {
		'keyword': /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
		'number': /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
		// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
		'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,
		'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/
	});

	Prism.languages.insertBefore('javascript', 'keyword', {
		'regex': {
			pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
			lookbehind: true,
			greedy: true
		}
	});

	Prism.languages.insertBefore('javascript', 'string', {
		'template-string': {
			pattern: /`(?:\\\\|\\?[^\\])*?`/,
			greedy: true,
			inside: {
				'interpolation': {
					pattern: /\$\{[^}]+\}/,
					inside: {
						'interpolation-punctuation': {
							pattern: /^\$\{|\}$/,
							alias: 'punctuation'
						},
						rest: Prism.languages.javascript
					}
				},
				'string': /[\s\S]+/
			}
		}
	});

	if (Prism.languages.markup) {
		Prism.languages.insertBefore('markup', 'tag', {
			'script': {
				pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
				lookbehind: true,
				inside: Prism.languages.javascript,
				alias: 'language-javascript'
			}
		});
	}

	Prism.languages.js = Prism.languages.javascript;

	/* **********************************************
	     Begin prism-file-highlight.js
	********************************************** */

	(function () {
		if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
			return;
		}

		self.Prism.fileHighlight = function() {

			var Extensions = {
				'js': 'javascript',
				'py': 'python',
				'rb': 'ruby',
				'ps1': 'powershell',
				'psm1': 'powershell',
				'sh': 'bash',
				'bat': 'batch',
				'h': 'c',
				'tex': 'latex'
			};

			if(Array.prototype.forEach) { // Check to prevent error in IE8
				Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
					var src = pre.getAttribute('data-src');

					var language, parent = pre;
					var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
					while (parent && !lang.test(parent.className)) {
						parent = parent.parentNode;
					}

					if (parent) {
						language = (pre.className.match(lang) || [, ''])[1];
					}

					if (!language) {
						var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
						language = Extensions[extension] || extension;
					}

					var code = document.createElement('code');
					code.className = 'language-' + language;

					pre.textContent = '';

					code.textContent = 'Loading…';

					pre.appendChild(code);

					var xhr = new XMLHttpRequest();

					xhr.open('GET', src, true);

					xhr.onreadystatechange = function () {
						if (xhr.readyState == 4) {

							if (xhr.status < 400 && xhr.responseText) {
								code.textContent = xhr.responseText;

								Prism.highlightElement(code);
							}
							else if (xhr.status >= 400) {
								code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
							}
							else {
								code.textContent = '✖ Error: File does not exist or is empty';
							}
						}
					};

					xhr.send(null);
				});
			}

		};

		document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);

	})();

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var InsertElementService = (function () {
	    function InsertElementService() {
	    }
	    InsertElementService.prototype.removeAttributes = function (element) {
	        element.removeAttr('prism-insert-id');
	    };
	    InsertElementService.prototype.insert = function (element, defaultPrevSibling, attr) {
	        if (attr.prismInsertId) {
	            var parentElement = document.getElementById(attr.prismInsertId);
	            parentElement.insertBefore(element[0], parentElement.firstElementChild);
	        }
	        else {
	            defaultPrevSibling.after(element);
	        }
	    };
	    ;
	    return InsertElementService;
	}());
	exports.default = InsertElementService;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ['InsertElementService', 'RepeatAsCodeService',
	    function (InsertElementService, RepeatAsCodeService) {
	        return {
	            priority: 1000,
	            restrict: 'A',
	            compile: function (element, attr) {
	                element.removeAttr('repeat-as-code');
	                InsertElementService.removeAttributes(element);
	                var code = RepeatAsCodeService(element, attr.repeatAsCode);
	                InsertElementService.insert(code, element, attr);
	            }
	        };
	    }
	];
	

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var highlight_1 = __webpack_require__(7);
	exports.default = RepeatAsCodeService;
	function RepeatAsCodeService() {
	    return function (element, type) {
	        var code = null;
	        if (type === 'inner') {
	            code = element[0].innerHTML;
	        }
	        else {
	            code = highlight_1.normalizeOuterHTML(element[0].outerHTML);
	        }
	        var highlightedCode = highlight_1.highlight(code, 'markup');
	        return highlightedCode;
	    };
	}
	

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var angular_1 = __webpack_require__(1);
	var Prism = __webpack_require__(3);
	__webpack_require__(8);
	var whitespacePlugin = Prism.plugins.NormalizeWhitespace;
	whitespacePlugin.setDefaults({
	    'tabs-to-spaces': 4
	});
	function getWhitespaceLength(line) {
	    var matches = line.match(/^\s+/);
	    if (matches) {
	        return matches[0].length;
	    }
	    else {
	        return 0;
	    }
	}
	function normalizeOuterHTML(code) {
	    var lines = code.split('\n');
	    var lastLine = lines[lines.length - 1];
	    var lastLineIndent = getWhitespaceLength(lastLine);
	    lines[0] = lastLine.substr(0, lastLineIndent).concat(lines[0]);
	    code = lines.join('\n');
	    return code;
	}
	exports.normalizeOuterHTML = normalizeOuterHTML;
	function highlight(code, language) {
	    code = whitespacePlugin.normalize(code);
	    var highlightedCode = Prism.highlight(code, Prism.languages[language]);
	    var template = "<pre class=\"language-" + language + "\" dir=\"ltr\"><code class=\"language-" + language + "\"></code></pre>";
	    var markup = angular_1.element(template);
	    markup.find('code').html(highlightedCode);
	    return markup;
	}
	exports.highlight = highlight;
	

/***/ },
/* 8 */
/***/ function(module, exports) {

	(function() {

	if (typeof self === 'undefined' || !self.Prism || !self.document) {
		return;
	}

	var assign = Object.assign || function (obj1, obj2) {
		for (var name in obj2) {
			if (obj2.hasOwnProperty(name))
				obj1[name] = obj2[name];
		}
		return obj1;
	}

	function NormalizeWhitespace(defaults) {
		this.defaults = assign({}, defaults);
	}

	function toCamelCase(value) {
		return value.replace(/-(\w)/g, function(match, firstChar) {
			return firstChar.toUpperCase();
		});
	}

	function tabLen(str) {
		var res = 0;
		for (var i = 0; i < str.length; ++i) {
			if (str.charCodeAt(i) == '\t'.charCodeAt(0))
				res += 3;
		}
		return str.length + res;
	}

	NormalizeWhitespace.prototype = {
		setDefaults: function (defaults) {
			this.defaults = assign(this.defaults, defaults);
		},
		normalize: function (input, settings) {
			settings = assign(this.defaults, settings);

			for (var name in settings) {
				var methodName = toCamelCase(name);
				if (name !== "normalize" && methodName !== 'setDefaults' &&
						settings[name] && this[methodName]) {
					input = this[methodName].call(this, input, settings[name]);
				}
			}

			return input;
		},

		/*
		 * Normalization methods
		 */
		leftTrim: function (input) {
			return input.replace(/^\s+/, '');
		},
		rightTrim: function (input) {
			return input.replace(/\s+$/, '');
		},
		tabsToSpaces: function (input, spaces) {
			spaces = spaces|0 || 4;
			return input.replace(/\t/g, new Array(++spaces).join(' '));
		},
		spacesToTabs: function (input, spaces) {
			spaces = spaces|0 || 4;
			return input.replace(new RegExp(' {' + spaces + '}', 'g'), '\t');
		},
		removeTrailing: function (input) {
			return input.replace(/\s*?$/gm, '');
		},
		// Support for deprecated plugin remove-initial-line-feed
		removeInitialLineFeed: function (input) {
			return input.replace(/^(?:\r?\n|\r)/, '');
		},
		removeIndent: function (input) {
			var indents = input.match(/^[^\S\n\r]*(?=\S)/gm);

			if (!indents || !indents[0].length)
				return input;

			indents.sort(function(a, b){return a.length - b.length; });

			if (!indents[0].length)
				return input;

			return input.replace(new RegExp('^' + indents[0], 'gm'), '');
		},
		indent: function (input, tabs) {
			return input.replace(/^[^\S\n\r]*(?=\S)/gm, new Array(++tabs).join('\t') + '$&');
		},
		breakLines: function (input, characters) {
			characters = (characters === true) ? 80 : characters|0 || 80;

			var lines = input.split('\n');
			for (var i = 0; i < lines.length; ++i) {
				if (tabLen(lines[i]) <= characters)
					continue;

				var line = lines[i].split(/(\s+)/g),
				    len = 0;

				for (var j = 0; j < line.length; ++j) {
					var tl = tabLen(line[j]);
					len += tl;
					if (len > characters) {
						line[j] = '\n' + line[j];
						len = tl;
					}
				}
				lines[i] = line.join('');
			}
			return lines.join('\n');
		}
	};

	Prism.plugins.NormalizeWhitespace = new NormalizeWhitespace({
		'remove-trailing': true,
		'remove-indent': true,
		'left-trim': true,
		'right-trim': true,
		/*'break-lines': 80,
		'indent': 2,
		'remove-initial-line-feed': false,
		'tabs-to-spaces': 4,
		'spaces-to-tabs': 4*/
	});

	Prism.hooks.add('before-sanity-check', function (env) {
		var pre = env.element.parentNode;
		var clsReg = /\bno-whitespace-normalization\b/;
		if (!env.code || !pre || pre.nodeName.toLowerCase() !== 'pre' ||
				(env.settings && env.settings['whitespace-normalization'] === false) ||
				clsReg.test(pre.className) || clsReg.test(env.element.className))
			return;

		var children = pre.childNodes,
		    before = '',
		    after = '',
		    codeFound = false,
		    Normalizer = Prism.plugins.NormalizeWhitespace;

		// Move surrounding whitespace from the <pre> tag into the <code> tag
		for (var i = 0; i < children.length; ++i) {
			var node = children[i];

			if (node == env.element) {
				codeFound = true;
			} else if (node.nodeName === "#text") {
				if (codeFound) {
					after += node.nodeValue;
				} else {
					before += node.nodeValue;
				}

				pre.removeChild(node);
				--i;
			}
		}

		if (!env.element.children.length || !Prism.plugins.KeepMarkup) {
			env.code = before + env.code + after;
			env.code = Normalizer.normalize(env.code, env.settings);
		} else {
			// Preserve markup for keep-markup plugin
			var html = before + env.element.innerHTML + after;
			env.element.innerHTML = Normalizer.normalize(html, env.settings);
			env.code = env.element.textContent;
		}
	});

	}());

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var templateUrl = __webpack_require__(10);
	var ToggleableCodeController = (function () {
	    function ToggleableCodeController() {
	        this.visible = false;
	    }
	    ToggleableCodeController.prototype.toggleCode = function () {
	        if (this.visible) {
	            this.hide();
	        }
	        else {
	            this.show();
	        }
	    };
	    ToggleableCodeController.prototype.show = function () {
	        this.codeWrapper.style.height = this.code.offsetHeight + 'px';
	        this.visible = true;
	    };
	    ToggleableCodeController.prototype.hide = function () {
	        this.codeWrapper.style.height = '0';
	        this.visible = false;
	    };
	    return ToggleableCodeController;
	}());
	exports.ToggleableCodeController = ToggleableCodeController;
	exports.default = [ToggleableCodeDirective];
	function ToggleableCodeDirective() {
	    return {
	        controller: ToggleableCodeController,
	        controllerAs: '$ctrl',
	        restrict: 'E',
	        scope: {},
	        templateUrl: templateUrl,
	        transclude: true,
	        link: function (scope, iElement, iAttrs, controller) {
	            var children = iElement.children();
	            for (var childIndex = 0; childIndex < children.length; childIndex++) {
	                var child = children[childIndex];
	                if (child.className.indexOf('prism-toggleable-code') !== -1) {
	                    controller.codeWrapper = child;
	                    controller.code = (child.firstElementChild);
	                }
	            }
	        }
	    };
	}
	exports.ToggleableCodeDirective = ToggleableCodeDirective;
	

/***/ },
/* 10 */
/***/ function(module, exports) {

	var path = 'directives/toggleable-code.directive.html';
	var html = "<div class=\"toggle-show\">\r\n    <div class=\"show-code\" dir=\"ltr\">\r\n        <button class=\"ias-button ias-icon-button\" ng-click=\"$ctrl.toggleCode()\" type=\"button\" title=\"Toggle Code\">\r\n            <svg viewBox=\"0 0 24 24\">\r\n                <path fill=\"currentColor\" d=\"M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z\"></path>\r\n            </svg>\r\n        </button>\r\n    </div>\r\n</div>\r\n<div class=\"prism-toggleable-code\" ng-class=\"{'prism-visible': $ctrl.visible}\">\r\n    <div ng-transclude></div>\r\n</div>\r\n";
	window.angular.module('ng').run(['$templateCache', function(c) { c.put(path, html) }]);
	module.exports = path;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var angular_1 = __webpack_require__(1);
	exports.default = ['RepeatAsCodeService', ToggleRepeatDirective];
	function ToggleRepeatDirective(RepeatAsCodeService) {
	    return {
	        priority: 1000,
	        restrict: 'A',
	        compile: function (tElement, attr) {
	            tElement.removeAttr('toggle-repeat-code');
	            var code = RepeatAsCodeService(tElement, attr.toggleRepeatCode);
	            var toggleableCode = angular_1.element("<toggleable-code></toggleable-code>").append(code);
	            tElement.after(toggleableCode);
	        }
	    };
	}
	exports.ToggleRepeatDirective = ToggleRepeatDirective;
	

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctcHJpc20uanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjk0ZTU5OTVhNjdiOTljYTE1YjgiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYW5ndWxhclwiIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL2hpZ2hsaWdodC5kaXJlY3RpdmUudHMiLCJ3ZWJwYWNrOi8vLy4vfi9wcmlzbWpzL3ByaXNtLmpzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2aWNlcy9pbnNlcnQtZWxlbWVudC5zZXJ2aWNlLnRzIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL3JlcGVhdC1hcy1jb2RlLmRpcmVjdGl2ZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmljZXMvcmVwZWF0LWFzLWNvZGUuc2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaGlnaGxpZ2h0LnRzIiwid2VicGFjazovLy8uL34vcHJpc21qcy9wbHVnaW5zL25vcm1hbGl6ZS13aGl0ZXNwYWNlL3ByaXNtLW5vcm1hbGl6ZS13aGl0ZXNwYWNlLmpzIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL3RvZ2dsZWFibGUtY29kZS5kaXJlY3RpdmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpcmVjdGl2ZXMvdG9nZ2xlYWJsZS1jb2RlLmRpcmVjdGl2ZS5odG1sIiwid2VicGFjazovLy8uL3NyYy9kaXJlY3RpdmVzL3RvZ2dsZS1yZXBlYXQtY29kZS5kaXJlY3RpdmUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA2OTRlNTk5NWE2N2I5OWNhMTViOFxuICoqLyIsImltcG9ydCB7IG1vZHVsZSB9IGZyb20gJ2FuZ3VsYXInO1xyXG5pbXBvcnQgSGlnaGxpZ2h0IGZyb20gJy4vZGlyZWN0aXZlcy9oaWdobGlnaHQuZGlyZWN0aXZlJztcclxuaW1wb3J0IEluc2VydEVsZW1lbnRTZXJ2aWNlIGZyb20gJy4vc2VydmljZXMvaW5zZXJ0LWVsZW1lbnQuc2VydmljZSc7XHJcbmltcG9ydCBSZXBlYXRBc0NvZGUgZnJvbSAnLi9kaXJlY3RpdmVzL3JlcGVhdC1hcy1jb2RlLmRpcmVjdGl2ZSc7XHJcbmltcG9ydCBSZXBlYXRBc0NvZGVTZXJ2aWNlIGZyb20gJy4vc2VydmljZXMvcmVwZWF0LWFzLWNvZGUuc2VydmljZSc7XHJcbmltcG9ydCBUb2dnbGVhYmxlQ29kZSBmcm9tICcuL2RpcmVjdGl2ZXMvdG9nZ2xlYWJsZS1jb2RlLmRpcmVjdGl2ZSc7XHJcbmltcG9ydCBUb2dnbGVSZXBlYXRDb2RlIGZyb20gJy4vZGlyZWN0aXZlcy90b2dnbGUtcmVwZWF0LWNvZGUuZGlyZWN0aXZlJztcclxuXHJcbm1vZHVsZSgnbmctcHJpc20nLCBbXSlcclxuICAgIC5kaXJlY3RpdmUoJ2hpZ2hsaWdodCcsIEhpZ2hsaWdodClcclxuICAgIC5kaXJlY3RpdmUoJ3JlcGVhdEFzQ29kZScsIFJlcGVhdEFzQ29kZSlcclxuICAgIC5kaXJlY3RpdmUoJ3RvZ2dsZWFibGVDb2RlJywgVG9nZ2xlYWJsZUNvZGUpXHJcbiAgICAuZGlyZWN0aXZlKCd0b2dnbGVSZXBlYXRDb2RlJywgVG9nZ2xlUmVwZWF0Q29kZSlcclxuXHJcbiAgICAuZmFjdG9yeSgnUmVwZWF0QXNDb2RlU2VydmljZScsIFJlcGVhdEFzQ29kZVNlcnZpY2UpXHJcblxyXG4gICAgLnNlcnZpY2UoJ0luc2VydEVsZW1lbnRTZXJ2aWNlJywgSW5zZXJ0RWxlbWVudFNlcnZpY2UpO1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9tYWluLnRzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJhbmd1bGFyXCJcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKlxyXG4gKiBTdGF0aWMgc3ludGF4IGhpZ2hsaWdodGluZ1xyXG4gKi9cclxuaW1wb3J0IHtJQXR0cmlidXRlcywgSUF1Z21lbnRlZEpRdWVyeX0gZnJvbSAnYW5ndWxhcic7XHJcbmxldCBQcmlzbSA9IHJlcXVpcmUoJ3ByaXNtanMnKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFtcclxuICAgICgpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBwcmlvcml0eTogMTAwMCxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICAgICAgY29tcGlsZTogKGVsZW1lbnQ6IElBdWdtZW50ZWRKUXVlcnksIGF0dHI6IElBdHRyaWJ1dGVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHIoJ2hpZ2hsaWdodCcpO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5wYXJlbnQoKS5hdHRyKCdkaXInLCAnbHRyJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGFuZ3VhZ2UgPSBhdHRyLmhpZ2hsaWdodCB8fCAnamF2YXNjcmlwdCc7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKGBsYW5ndWFnZS0ke2xhbmd1YWdlfWApO1xyXG4gICAgICAgICAgICAgICAgUHJpc20uaGlnaGxpZ2h0RWxlbWVudChlbGVtZW50WzBdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbl07XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2RpcmVjdGl2ZXMvaGlnaGxpZ2h0LmRpcmVjdGl2ZS50c1xuICoqLyIsIlxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICBCZWdpbiBwcmlzbS1jb3JlLmpzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cbnZhciBfc2VsZiA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJylcblx0PyB3aW5kb3cgICAvLyBpZiBpbiBicm93c2VyXG5cdDogKFxuXHRcdCh0eXBlb2YgV29ya2VyR2xvYmFsU2NvcGUgIT09ICd1bmRlZmluZWQnICYmIHNlbGYgaW5zdGFuY2VvZiBXb3JrZXJHbG9iYWxTY29wZSlcblx0XHQ/IHNlbGYgLy8gaWYgaW4gd29ya2VyXG5cdFx0OiB7fSAgIC8vIGlmIGluIG5vZGUganNcblx0KTtcblxuLyoqXG4gKiBQcmlzbTogTGlnaHR3ZWlnaHQsIHJvYnVzdCwgZWxlZ2FudCBzeW50YXggaGlnaGxpZ2h0aW5nXG4gKiBNSVQgbGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocC9cbiAqIEBhdXRob3IgTGVhIFZlcm91IGh0dHA6Ly9sZWEudmVyb3UubWVcbiAqL1xuXG52YXIgUHJpc20gPSAoZnVuY3Rpb24oKXtcblxuLy8gUHJpdmF0ZSBoZWxwZXIgdmFyc1xudmFyIGxhbmcgPSAvXFxibGFuZyg/OnVhZ2UpPy0oXFx3KylcXGIvaTtcbnZhciB1bmlxdWVJZCA9IDA7XG5cbnZhciBfID0gX3NlbGYuUHJpc20gPSB7XG5cdHV0aWw6IHtcblx0XHRlbmNvZGU6IGZ1bmN0aW9uICh0b2tlbnMpIHtcblx0XHRcdGlmICh0b2tlbnMgaW5zdGFuY2VvZiBUb2tlbikge1xuXHRcdFx0XHRyZXR1cm4gbmV3IFRva2VuKHRva2Vucy50eXBlLCBfLnV0aWwuZW5jb2RlKHRva2Vucy5jb250ZW50KSwgdG9rZW5zLmFsaWFzKTtcblx0XHRcdH0gZWxzZSBpZiAoXy51dGlsLnR5cGUodG9rZW5zKSA9PT0gJ0FycmF5Jykge1xuXHRcdFx0XHRyZXR1cm4gdG9rZW5zLm1hcChfLnV0aWwuZW5jb2RlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB0b2tlbnMucmVwbGFjZSgvJi9nLCAnJmFtcDsnKS5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvXFx1MDBhMC9nLCAnICcpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHR0eXBlOiBmdW5jdGlvbiAobykge1xuXHRcdFx0cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5tYXRjaCgvXFxbb2JqZWN0IChcXHcrKVxcXS8pWzFdO1xuXHRcdH0sXG5cblx0XHRvYmpJZDogZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0aWYgKCFvYmpbJ19faWQnXSkge1xuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCAnX19pZCcsIHsgdmFsdWU6ICsrdW5pcXVlSWQgfSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb2JqWydfX2lkJ107XG5cdFx0fSxcblxuXHRcdC8vIERlZXAgY2xvbmUgYSBsYW5ndWFnZSBkZWZpbml0aW9uIChlLmcuIHRvIGV4dGVuZCBpdClcblx0XHRjbG9uZTogZnVuY3Rpb24gKG8pIHtcblx0XHRcdHZhciB0eXBlID0gXy51dGlsLnR5cGUobyk7XG5cblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlICdPYmplY3QnOlxuXHRcdFx0XHRcdHZhciBjbG9uZSA9IHt9O1xuXG5cdFx0XHRcdFx0Zm9yICh2YXIga2V5IGluIG8pIHtcblx0XHRcdFx0XHRcdGlmIChvLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdFx0XHRcdFx0Y2xvbmVba2V5XSA9IF8udXRpbC5jbG9uZShvW2tleV0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBjbG9uZTtcblxuXHRcdFx0XHRjYXNlICdBcnJheSc6XG5cdFx0XHRcdFx0Ly8gQ2hlY2sgZm9yIGV4aXN0ZW5jZSBmb3IgSUU4XG5cdFx0XHRcdFx0cmV0dXJuIG8ubWFwICYmIG8ubWFwKGZ1bmN0aW9uKHYpIHsgcmV0dXJuIF8udXRpbC5jbG9uZSh2KTsgfSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvO1xuXHRcdH1cblx0fSxcblxuXHRsYW5ndWFnZXM6IHtcblx0XHRleHRlbmQ6IGZ1bmN0aW9uIChpZCwgcmVkZWYpIHtcblx0XHRcdHZhciBsYW5nID0gXy51dGlsLmNsb25lKF8ubGFuZ3VhZ2VzW2lkXSk7XG5cblx0XHRcdGZvciAodmFyIGtleSBpbiByZWRlZikge1xuXHRcdFx0XHRsYW5nW2tleV0gPSByZWRlZltrZXldO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbGFuZztcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogSW5zZXJ0IGEgdG9rZW4gYmVmb3JlIGFub3RoZXIgdG9rZW4gaW4gYSBsYW5ndWFnZSBsaXRlcmFsXG5cdFx0ICogQXMgdGhpcyBuZWVkcyB0byByZWNyZWF0ZSB0aGUgb2JqZWN0ICh3ZSBjYW5ub3QgYWN0dWFsbHkgaW5zZXJ0IGJlZm9yZSBrZXlzIGluIG9iamVjdCBsaXRlcmFscyksXG5cdFx0ICogd2UgY2Fubm90IGp1c3QgcHJvdmlkZSBhbiBvYmplY3QsIHdlIG5lZWQgYW5vYmplY3QgYW5kIGEga2V5LlxuXHRcdCAqIEBwYXJhbSBpbnNpZGUgVGhlIGtleSAob3IgbGFuZ3VhZ2UgaWQpIG9mIHRoZSBwYXJlbnRcblx0XHQgKiBAcGFyYW0gYmVmb3JlIFRoZSBrZXkgdG8gaW5zZXJ0IGJlZm9yZS4gSWYgbm90IHByb3ZpZGVkLCB0aGUgZnVuY3Rpb24gYXBwZW5kcyBpbnN0ZWFkLlxuXHRcdCAqIEBwYXJhbSBpbnNlcnQgT2JqZWN0IHdpdGggdGhlIGtleS92YWx1ZSBwYWlycyB0byBpbnNlcnRcblx0XHQgKiBAcGFyYW0gcm9vdCBUaGUgb2JqZWN0IHRoYXQgY29udGFpbnMgYGluc2lkZWAuIElmIGVxdWFsIHRvIFByaXNtLmxhbmd1YWdlcywgaXQgY2FuIGJlIG9taXR0ZWQuXG5cdFx0ICovXG5cdFx0aW5zZXJ0QmVmb3JlOiBmdW5jdGlvbiAoaW5zaWRlLCBiZWZvcmUsIGluc2VydCwgcm9vdCkge1xuXHRcdFx0cm9vdCA9IHJvb3QgfHwgXy5sYW5ndWFnZXM7XG5cdFx0XHR2YXIgZ3JhbW1hciA9IHJvb3RbaW5zaWRlXTtcblxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMikge1xuXHRcdFx0XHRpbnNlcnQgPSBhcmd1bWVudHNbMV07XG5cblx0XHRcdFx0Zm9yICh2YXIgbmV3VG9rZW4gaW4gaW5zZXJ0KSB7XG5cdFx0XHRcdFx0aWYgKGluc2VydC5oYXNPd25Qcm9wZXJ0eShuZXdUb2tlbikpIHtcblx0XHRcdFx0XHRcdGdyYW1tYXJbbmV3VG9rZW5dID0gaW5zZXJ0W25ld1Rva2VuXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gZ3JhbW1hcjtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHJldCA9IHt9O1xuXG5cdFx0XHRmb3IgKHZhciB0b2tlbiBpbiBncmFtbWFyKSB7XG5cblx0XHRcdFx0aWYgKGdyYW1tYXIuaGFzT3duUHJvcGVydHkodG9rZW4pKSB7XG5cblx0XHRcdFx0XHRpZiAodG9rZW4gPT0gYmVmb3JlKSB7XG5cblx0XHRcdFx0XHRcdGZvciAodmFyIG5ld1Rva2VuIGluIGluc2VydCkge1xuXG5cdFx0XHRcdFx0XHRcdGlmIChpbnNlcnQuaGFzT3duUHJvcGVydHkobmV3VG9rZW4pKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0W25ld1Rva2VuXSA9IGluc2VydFtuZXdUb2tlbl07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXRbdG9rZW5dID0gZ3JhbW1hclt0b2tlbl07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gVXBkYXRlIHJlZmVyZW5jZXMgaW4gb3RoZXIgbGFuZ3VhZ2UgZGVmaW5pdGlvbnNcblx0XHRcdF8ubGFuZ3VhZ2VzLkRGUyhfLmxhbmd1YWdlcywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuXHRcdFx0XHRpZiAodmFsdWUgPT09IHJvb3RbaW5zaWRlXSAmJiBrZXkgIT0gaW5zaWRlKSB7XG5cdFx0XHRcdFx0dGhpc1trZXldID0gcmV0O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHJvb3RbaW5zaWRlXSA9IHJldDtcblx0XHR9LFxuXG5cdFx0Ly8gVHJhdmVyc2UgYSBsYW5ndWFnZSBkZWZpbml0aW9uIHdpdGggRGVwdGggRmlyc3QgU2VhcmNoXG5cdFx0REZTOiBmdW5jdGlvbihvLCBjYWxsYmFjaywgdHlwZSwgdmlzaXRlZCkge1xuXHRcdFx0dmlzaXRlZCA9IHZpc2l0ZWQgfHwge307XG5cdFx0XHRmb3IgKHZhciBpIGluIG8pIHtcblx0XHRcdFx0aWYgKG8uaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdFx0XHRjYWxsYmFjay5jYWxsKG8sIGksIG9baV0sIHR5cGUgfHwgaSk7XG5cblx0XHRcdFx0XHRpZiAoXy51dGlsLnR5cGUob1tpXSkgPT09ICdPYmplY3QnICYmICF2aXNpdGVkW18udXRpbC5vYmpJZChvW2ldKV0pIHtcblx0XHRcdFx0XHRcdHZpc2l0ZWRbXy51dGlsLm9iaklkKG9baV0pXSA9IHRydWU7XG5cdFx0XHRcdFx0XHRfLmxhbmd1YWdlcy5ERlMob1tpXSwgY2FsbGJhY2ssIG51bGwsIHZpc2l0ZWQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmIChfLnV0aWwudHlwZShvW2ldKSA9PT0gJ0FycmF5JyAmJiAhdmlzaXRlZFtfLnV0aWwub2JqSWQob1tpXSldKSB7XG5cdFx0XHRcdFx0XHR2aXNpdGVkW18udXRpbC5vYmpJZChvW2ldKV0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0Xy5sYW5ndWFnZXMuREZTKG9baV0sIGNhbGxiYWNrLCBpLCB2aXNpdGVkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdHBsdWdpbnM6IHt9LFxuXG5cdGhpZ2hsaWdodEFsbDogZnVuY3Rpb24oYXN5bmMsIGNhbGxiYWNrKSB7XG5cdFx0dmFyIGVudiA9IHtcblx0XHRcdGNhbGxiYWNrOiBjYWxsYmFjayxcblx0XHRcdHNlbGVjdG9yOiAnY29kZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl0sIFtjbGFzcyo9XCJsYW5ndWFnZS1cIl0gY29kZSwgY29kZVtjbGFzcyo9XCJsYW5nLVwiXSwgW2NsYXNzKj1cImxhbmctXCJdIGNvZGUnXG5cdFx0fTtcblxuXHRcdF8uaG9va3MucnVuKFwiYmVmb3JlLWhpZ2hsaWdodGFsbFwiLCBlbnYpO1xuXG5cdFx0dmFyIGVsZW1lbnRzID0gZW52LmVsZW1lbnRzIHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZW52LnNlbGVjdG9yKTtcblxuXHRcdGZvciAodmFyIGk9MCwgZWxlbWVudDsgZWxlbWVudCA9IGVsZW1lbnRzW2krK107KSB7XG5cdFx0XHRfLmhpZ2hsaWdodEVsZW1lbnQoZWxlbWVudCwgYXN5bmMgPT09IHRydWUsIGVudi5jYWxsYmFjayk7XG5cdFx0fVxuXHR9LFxuXG5cdGhpZ2hsaWdodEVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQsIGFzeW5jLCBjYWxsYmFjaykge1xuXHRcdC8vIEZpbmQgbGFuZ3VhZ2Vcblx0XHR2YXIgbGFuZ3VhZ2UsIGdyYW1tYXIsIHBhcmVudCA9IGVsZW1lbnQ7XG5cblx0XHR3aGlsZSAocGFyZW50ICYmICFsYW5nLnRlc3QocGFyZW50LmNsYXNzTmFtZSkpIHtcblx0XHRcdHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlO1xuXHRcdH1cblxuXHRcdGlmIChwYXJlbnQpIHtcblx0XHRcdGxhbmd1YWdlID0gKHBhcmVudC5jbGFzc05hbWUubWF0Y2gobGFuZykgfHwgWywnJ10pWzFdLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRncmFtbWFyID0gXy5sYW5ndWFnZXNbbGFuZ3VhZ2VdO1xuXHRcdH1cblxuXHRcdC8vIFNldCBsYW5ndWFnZSBvbiB0aGUgZWxlbWVudCwgaWYgbm90IHByZXNlbnRcblx0XHRlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lLnJlcGxhY2UobGFuZywgJycpLnJlcGxhY2UoL1xccysvZywgJyAnKSArICcgbGFuZ3VhZ2UtJyArIGxhbmd1YWdlO1xuXG5cdFx0Ly8gU2V0IGxhbmd1YWdlIG9uIHRoZSBwYXJlbnQsIGZvciBzdHlsaW5nXG5cdFx0cGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuXG5cdFx0aWYgKC9wcmUvaS50ZXN0KHBhcmVudC5ub2RlTmFtZSkpIHtcblx0XHRcdHBhcmVudC5jbGFzc05hbWUgPSBwYXJlbnQuY2xhc3NOYW1lLnJlcGxhY2UobGFuZywgJycpLnJlcGxhY2UoL1xccysvZywgJyAnKSArICcgbGFuZ3VhZ2UtJyArIGxhbmd1YWdlO1xuXHRcdH1cblxuXHRcdHZhciBjb2RlID0gZWxlbWVudC50ZXh0Q29udGVudDtcblxuXHRcdHZhciBlbnYgPSB7XG5cdFx0XHRlbGVtZW50OiBlbGVtZW50LFxuXHRcdFx0bGFuZ3VhZ2U6IGxhbmd1YWdlLFxuXHRcdFx0Z3JhbW1hcjogZ3JhbW1hcixcblx0XHRcdGNvZGU6IGNvZGVcblx0XHR9O1xuXG5cdFx0Xy5ob29rcy5ydW4oJ2JlZm9yZS1zYW5pdHktY2hlY2snLCBlbnYpO1xuXG5cdFx0aWYgKCFlbnYuY29kZSB8fCAhZW52LmdyYW1tYXIpIHtcblx0XHRcdGlmIChlbnYuY29kZSkge1xuXHRcdFx0XHRlbnYuZWxlbWVudC50ZXh0Q29udGVudCA9IGVudi5jb2RlO1xuXHRcdFx0fVxuXHRcdFx0Xy5ob29rcy5ydW4oJ2NvbXBsZXRlJywgZW52KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRfLmhvb2tzLnJ1bignYmVmb3JlLWhpZ2hsaWdodCcsIGVudik7XG5cblx0XHRpZiAoYXN5bmMgJiYgX3NlbGYuV29ya2VyKSB7XG5cdFx0XHR2YXIgd29ya2VyID0gbmV3IFdvcmtlcihfLmZpbGVuYW1lKTtcblxuXHRcdFx0d29ya2VyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2dCkge1xuXHRcdFx0XHRlbnYuaGlnaGxpZ2h0ZWRDb2RlID0gZXZ0LmRhdGE7XG5cblx0XHRcdFx0Xy5ob29rcy5ydW4oJ2JlZm9yZS1pbnNlcnQnLCBlbnYpO1xuXG5cdFx0XHRcdGVudi5lbGVtZW50LmlubmVySFRNTCA9IGVudi5oaWdobGlnaHRlZENvZGU7XG5cblx0XHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2suY2FsbChlbnYuZWxlbWVudCk7XG5cdFx0XHRcdF8uaG9va3MucnVuKCdhZnRlci1oaWdobGlnaHQnLCBlbnYpO1xuXHRcdFx0XHRfLmhvb2tzLnJ1bignY29tcGxldGUnLCBlbnYpO1xuXHRcdFx0fTtcblxuXHRcdFx0d29ya2VyLnBvc3RNZXNzYWdlKEpTT04uc3RyaW5naWZ5KHtcblx0XHRcdFx0bGFuZ3VhZ2U6IGVudi5sYW5ndWFnZSxcblx0XHRcdFx0Y29kZTogZW52LmNvZGUsXG5cdFx0XHRcdGltbWVkaWF0ZUNsb3NlOiB0cnVlXG5cdFx0XHR9KSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0ZW52LmhpZ2hsaWdodGVkQ29kZSA9IF8uaGlnaGxpZ2h0KGVudi5jb2RlLCBlbnYuZ3JhbW1hciwgZW52Lmxhbmd1YWdlKTtcblxuXHRcdFx0Xy5ob29rcy5ydW4oJ2JlZm9yZS1pbnNlcnQnLCBlbnYpO1xuXG5cdFx0XHRlbnYuZWxlbWVudC5pbm5lckhUTUwgPSBlbnYuaGlnaGxpZ2h0ZWRDb2RlO1xuXG5cdFx0XHRjYWxsYmFjayAmJiBjYWxsYmFjay5jYWxsKGVsZW1lbnQpO1xuXG5cdFx0XHRfLmhvb2tzLnJ1bignYWZ0ZXItaGlnaGxpZ2h0JywgZW52KTtcblx0XHRcdF8uaG9va3MucnVuKCdjb21wbGV0ZScsIGVudik7XG5cdFx0fVxuXHR9LFxuXG5cdGhpZ2hsaWdodDogZnVuY3Rpb24gKHRleHQsIGdyYW1tYXIsIGxhbmd1YWdlKSB7XG5cdFx0dmFyIHRva2VucyA9IF8udG9rZW5pemUodGV4dCwgZ3JhbW1hcik7XG5cdFx0cmV0dXJuIFRva2VuLnN0cmluZ2lmeShfLnV0aWwuZW5jb2RlKHRva2VucyksIGxhbmd1YWdlKTtcblx0fSxcblxuXHR0b2tlbml6ZTogZnVuY3Rpb24odGV4dCwgZ3JhbW1hciwgbGFuZ3VhZ2UpIHtcblx0XHR2YXIgVG9rZW4gPSBfLlRva2VuO1xuXG5cdFx0dmFyIHN0cmFyciA9IFt0ZXh0XTtcblxuXHRcdHZhciByZXN0ID0gZ3JhbW1hci5yZXN0O1xuXG5cdFx0aWYgKHJlc3QpIHtcblx0XHRcdGZvciAodmFyIHRva2VuIGluIHJlc3QpIHtcblx0XHRcdFx0Z3JhbW1hclt0b2tlbl0gPSByZXN0W3Rva2VuXTtcblx0XHRcdH1cblxuXHRcdFx0ZGVsZXRlIGdyYW1tYXIucmVzdDtcblx0XHR9XG5cblx0XHR0b2tlbmxvb3A6IGZvciAodmFyIHRva2VuIGluIGdyYW1tYXIpIHtcblx0XHRcdGlmKCFncmFtbWFyLmhhc093blByb3BlcnR5KHRva2VuKSB8fCAhZ3JhbW1hclt0b2tlbl0pIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBwYXR0ZXJucyA9IGdyYW1tYXJbdG9rZW5dO1xuXHRcdFx0cGF0dGVybnMgPSAoXy51dGlsLnR5cGUocGF0dGVybnMpID09PSBcIkFycmF5XCIpID8gcGF0dGVybnMgOiBbcGF0dGVybnNdO1xuXG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IHBhdHRlcm5zLmxlbmd0aDsgKytqKSB7XG5cdFx0XHRcdHZhciBwYXR0ZXJuID0gcGF0dGVybnNbal0sXG5cdFx0XHRcdFx0aW5zaWRlID0gcGF0dGVybi5pbnNpZGUsXG5cdFx0XHRcdFx0bG9va2JlaGluZCA9ICEhcGF0dGVybi5sb29rYmVoaW5kLFxuXHRcdFx0XHRcdGdyZWVkeSA9ICEhcGF0dGVybi5ncmVlZHksXG5cdFx0XHRcdFx0bG9va2JlaGluZExlbmd0aCA9IDAsXG5cdFx0XHRcdFx0YWxpYXMgPSBwYXR0ZXJuLmFsaWFzO1xuXG5cdFx0XHRcdGlmIChncmVlZHkgJiYgIXBhdHRlcm4ucGF0dGVybi5nbG9iYWwpIHtcblx0XHRcdFx0XHQvLyBXaXRob3V0IHRoZSBnbG9iYWwgZmxhZywgbGFzdEluZGV4IHdvbid0IHdvcmtcblx0XHRcdFx0XHR2YXIgZmxhZ3MgPSBwYXR0ZXJuLnBhdHRlcm4udG9TdHJpbmcoKS5tYXRjaCgvW2ltdXldKiQvKVswXTtcblx0XHRcdFx0XHRwYXR0ZXJuLnBhdHRlcm4gPSBSZWdFeHAocGF0dGVybi5wYXR0ZXJuLnNvdXJjZSwgZmxhZ3MgKyBcImdcIik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRwYXR0ZXJuID0gcGF0dGVybi5wYXR0ZXJuIHx8IHBhdHRlcm47XG5cblx0XHRcdFx0Ly8gRG9u4oCZdCBjYWNoZSBsZW5ndGggYXMgaXQgY2hhbmdlcyBkdXJpbmcgdGhlIGxvb3Bcblx0XHRcdFx0Zm9yICh2YXIgaT0wLCBwb3MgPSAwOyBpPHN0cmFyci5sZW5ndGg7IHBvcyArPSBzdHJhcnJbaV0ubGVuZ3RoLCArK2kpIHtcblxuXHRcdFx0XHRcdHZhciBzdHIgPSBzdHJhcnJbaV07XG5cblx0XHRcdFx0XHRpZiAoc3RyYXJyLmxlbmd0aCA+IHRleHQubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHQvLyBTb21ldGhpbmcgd2VudCB0ZXJyaWJseSB3cm9uZywgQUJPUlQsIEFCT1JUIVxuXHRcdFx0XHRcdFx0YnJlYWsgdG9rZW5sb29wO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChzdHIgaW5zdGFuY2VvZiBUb2tlbikge1xuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cGF0dGVybi5sYXN0SW5kZXggPSAwO1xuXG5cdFx0XHRcdFx0dmFyIG1hdGNoID0gcGF0dGVybi5leGVjKHN0ciksXG5cdFx0XHRcdFx0ICAgIGRlbE51bSA9IDE7XG5cblx0XHRcdFx0XHQvLyBHcmVlZHkgcGF0dGVybnMgY2FuIG92ZXJyaWRlL3JlbW92ZSB1cCB0byB0d28gcHJldmlvdXNseSBtYXRjaGVkIHRva2Vuc1xuXHRcdFx0XHRcdGlmICghbWF0Y2ggJiYgZ3JlZWR5ICYmIGkgIT0gc3RyYXJyLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0XHRcdHBhdHRlcm4ubGFzdEluZGV4ID0gcG9zO1xuXHRcdFx0XHRcdFx0bWF0Y2ggPSBwYXR0ZXJuLmV4ZWModGV4dCk7XG5cdFx0XHRcdFx0XHRpZiAoIW1hdGNoKSB7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR2YXIgZnJvbSA9IG1hdGNoLmluZGV4ICsgKGxvb2tiZWhpbmQgPyBtYXRjaFsxXS5sZW5ndGggOiAwKSxcblx0XHRcdFx0XHRcdCAgICB0byA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoLFxuXHRcdFx0XHRcdFx0ICAgIGsgPSBpLFxuXHRcdFx0XHRcdFx0ICAgIHAgPSBwb3M7XG5cblx0XHRcdFx0XHRcdGZvciAodmFyIGxlbiA9IHN0cmFyci5sZW5ndGg7IGsgPCBsZW4gJiYgcCA8IHRvOyArK2spIHtcblx0XHRcdFx0XHRcdFx0cCArPSBzdHJhcnJba10ubGVuZ3RoO1xuXHRcdFx0XHRcdFx0XHQvLyBNb3ZlIHRoZSBpbmRleCBpIHRvIHRoZSBlbGVtZW50IGluIHN0cmFyciB0aGF0IGlzIGNsb3Nlc3QgdG8gZnJvbVxuXHRcdFx0XHRcdFx0XHRpZiAoZnJvbSA+PSBwKSB7XG5cdFx0XHRcdFx0XHRcdFx0KytpO1xuXHRcdFx0XHRcdFx0XHRcdHBvcyA9IHA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Lypcblx0XHRcdFx0XHRcdCAqIElmIHN0cmFycltpXSBpcyBhIFRva2VuLCB0aGVuIHRoZSBtYXRjaCBzdGFydHMgaW5zaWRlIGFub3RoZXIgVG9rZW4sIHdoaWNoIGlzIGludmFsaWRcblx0XHRcdFx0XHRcdCAqIElmIHN0cmFycltrIC0gMV0gaXMgZ3JlZWR5IHdlIGFyZSBpbiBjb25mbGljdCB3aXRoIGFub3RoZXIgZ3JlZWR5IHBhdHRlcm5cblx0XHRcdFx0XHRcdCAqL1xuXHRcdFx0XHRcdFx0aWYgKHN0cmFycltpXSBpbnN0YW5jZW9mIFRva2VuIHx8IHN0cmFycltrIC0gMV0uZ3JlZWR5KSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBOdW1iZXIgb2YgdG9rZW5zIHRvIGRlbGV0ZSBhbmQgcmVwbGFjZSB3aXRoIHRoZSBuZXcgbWF0Y2hcblx0XHRcdFx0XHRcdGRlbE51bSA9IGsgLSBpO1xuXHRcdFx0XHRcdFx0c3RyID0gdGV4dC5zbGljZShwb3MsIHApO1xuXHRcdFx0XHRcdFx0bWF0Y2guaW5kZXggLT0gcG9zO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICghbWF0Y2gpIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmKGxvb2tiZWhpbmQpIHtcblx0XHRcdFx0XHRcdGxvb2tiZWhpbmRMZW5ndGggPSBtYXRjaFsxXS5sZW5ndGg7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dmFyIGZyb20gPSBtYXRjaC5pbmRleCArIGxvb2tiZWhpbmRMZW5ndGgsXG5cdFx0XHRcdFx0ICAgIG1hdGNoID0gbWF0Y2hbMF0uc2xpY2UobG9va2JlaGluZExlbmd0aCksXG5cdFx0XHRcdFx0ICAgIHRvID0gZnJvbSArIG1hdGNoLmxlbmd0aCxcblx0XHRcdFx0XHQgICAgYmVmb3JlID0gc3RyLnNsaWNlKDAsIGZyb20pLFxuXHRcdFx0XHRcdCAgICBhZnRlciA9IHN0ci5zbGljZSh0byk7XG5cblx0XHRcdFx0XHR2YXIgYXJncyA9IFtpLCBkZWxOdW1dO1xuXG5cdFx0XHRcdFx0aWYgKGJlZm9yZSkge1xuXHRcdFx0XHRcdFx0YXJncy5wdXNoKGJlZm9yZSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dmFyIHdyYXBwZWQgPSBuZXcgVG9rZW4odG9rZW4sIGluc2lkZT8gXy50b2tlbml6ZShtYXRjaCwgaW5zaWRlKSA6IG1hdGNoLCBhbGlhcywgbWF0Y2gsIGdyZWVkeSk7XG5cblx0XHRcdFx0XHRhcmdzLnB1c2god3JhcHBlZCk7XG5cblx0XHRcdFx0XHRpZiAoYWZ0ZXIpIHtcblx0XHRcdFx0XHRcdGFyZ3MucHVzaChhZnRlcik7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0QXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseShzdHJhcnIsIGFyZ3MpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHN0cmFycjtcblx0fSxcblxuXHRob29rczoge1xuXHRcdGFsbDoge30sXG5cblx0XHRhZGQ6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaykge1xuXHRcdFx0dmFyIGhvb2tzID0gXy5ob29rcy5hbGw7XG5cblx0XHRcdGhvb2tzW25hbWVdID0gaG9va3NbbmFtZV0gfHwgW107XG5cblx0XHRcdGhvb2tzW25hbWVdLnB1c2goY2FsbGJhY2spO1xuXHRcdH0sXG5cblx0XHRydW46IGZ1bmN0aW9uIChuYW1lLCBlbnYpIHtcblx0XHRcdHZhciBjYWxsYmFja3MgPSBfLmhvb2tzLmFsbFtuYW1lXTtcblxuXHRcdFx0aWYgKCFjYWxsYmFja3MgfHwgIWNhbGxiYWNrcy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKHZhciBpPTAsIGNhbGxiYWNrOyBjYWxsYmFjayA9IGNhbGxiYWNrc1tpKytdOykge1xuXHRcdFx0XHRjYWxsYmFjayhlbnYpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcblxudmFyIFRva2VuID0gXy5Ub2tlbiA9IGZ1bmN0aW9uKHR5cGUsIGNvbnRlbnQsIGFsaWFzLCBtYXRjaGVkU3RyLCBncmVlZHkpIHtcblx0dGhpcy50eXBlID0gdHlwZTtcblx0dGhpcy5jb250ZW50ID0gY29udGVudDtcblx0dGhpcy5hbGlhcyA9IGFsaWFzO1xuXHQvLyBDb3B5IG9mIHRoZSBmdWxsIHN0cmluZyB0aGlzIHRva2VuIHdhcyBjcmVhdGVkIGZyb21cblx0dGhpcy5sZW5ndGggPSAobWF0Y2hlZFN0ciB8fCBcIlwiKS5sZW5ndGh8MDtcblx0dGhpcy5ncmVlZHkgPSAhIWdyZWVkeTtcbn07XG5cblRva2VuLnN0cmluZ2lmeSA9IGZ1bmN0aW9uKG8sIGxhbmd1YWdlLCBwYXJlbnQpIHtcblx0aWYgKHR5cGVvZiBvID09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuIG87XG5cdH1cblxuXHRpZiAoXy51dGlsLnR5cGUobykgPT09ICdBcnJheScpIHtcblx0XHRyZXR1cm4gby5tYXAoZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIFRva2VuLnN0cmluZ2lmeShlbGVtZW50LCBsYW5ndWFnZSwgbyk7XG5cdFx0fSkuam9pbignJyk7XG5cdH1cblxuXHR2YXIgZW52ID0ge1xuXHRcdHR5cGU6IG8udHlwZSxcblx0XHRjb250ZW50OiBUb2tlbi5zdHJpbmdpZnkoby5jb250ZW50LCBsYW5ndWFnZSwgcGFyZW50KSxcblx0XHR0YWc6ICdzcGFuJyxcblx0XHRjbGFzc2VzOiBbJ3Rva2VuJywgby50eXBlXSxcblx0XHRhdHRyaWJ1dGVzOiB7fSxcblx0XHRsYW5ndWFnZTogbGFuZ3VhZ2UsXG5cdFx0cGFyZW50OiBwYXJlbnRcblx0fTtcblxuXHRpZiAoZW52LnR5cGUgPT0gJ2NvbW1lbnQnKSB7XG5cdFx0ZW52LmF0dHJpYnV0ZXNbJ3NwZWxsY2hlY2snXSA9ICd0cnVlJztcblx0fVxuXG5cdGlmIChvLmFsaWFzKSB7XG5cdFx0dmFyIGFsaWFzZXMgPSBfLnV0aWwudHlwZShvLmFsaWFzKSA9PT0gJ0FycmF5JyA/IG8uYWxpYXMgOiBbby5hbGlhc107XG5cdFx0QXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoZW52LmNsYXNzZXMsIGFsaWFzZXMpO1xuXHR9XG5cblx0Xy5ob29rcy5ydW4oJ3dyYXAnLCBlbnYpO1xuXG5cdHZhciBhdHRyaWJ1dGVzID0gT2JqZWN0LmtleXMoZW52LmF0dHJpYnV0ZXMpLm1hcChmdW5jdGlvbihuYW1lKSB7XG5cdFx0cmV0dXJuIG5hbWUgKyAnPVwiJyArIChlbnYuYXR0cmlidXRlc1tuYW1lXSB8fCAnJykucmVwbGFjZSgvXCIvZywgJyZxdW90OycpICsgJ1wiJztcblx0fSkuam9pbignICcpO1xuXG5cdHJldHVybiAnPCcgKyBlbnYudGFnICsgJyBjbGFzcz1cIicgKyBlbnYuY2xhc3Nlcy5qb2luKCcgJykgKyAnXCInICsgKGF0dHJpYnV0ZXMgPyAnICcgKyBhdHRyaWJ1dGVzIDogJycpICsgJz4nICsgZW52LmNvbnRlbnQgKyAnPC8nICsgZW52LnRhZyArICc+JztcblxufTtcblxuaWYgKCFfc2VsZi5kb2N1bWVudCkge1xuXHRpZiAoIV9zZWxmLmFkZEV2ZW50TGlzdGVuZXIpIHtcblx0XHQvLyBpbiBOb2RlLmpzXG5cdFx0cmV0dXJuIF9zZWxmLlByaXNtO1xuXHR9XG4gXHQvLyBJbiB3b3JrZXJcblx0X3NlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uKGV2dCkge1xuXHRcdHZhciBtZXNzYWdlID0gSlNPTi5wYXJzZShldnQuZGF0YSksXG5cdFx0ICAgIGxhbmcgPSBtZXNzYWdlLmxhbmd1YWdlLFxuXHRcdCAgICBjb2RlID0gbWVzc2FnZS5jb2RlLFxuXHRcdCAgICBpbW1lZGlhdGVDbG9zZSA9IG1lc3NhZ2UuaW1tZWRpYXRlQ2xvc2U7XG5cblx0XHRfc2VsZi5wb3N0TWVzc2FnZShfLmhpZ2hsaWdodChjb2RlLCBfLmxhbmd1YWdlc1tsYW5nXSwgbGFuZykpO1xuXHRcdGlmIChpbW1lZGlhdGVDbG9zZSkge1xuXHRcdFx0X3NlbGYuY2xvc2UoKTtcblx0XHR9XG5cdH0sIGZhbHNlKTtcblxuXHRyZXR1cm4gX3NlbGYuUHJpc207XG59XG5cbi8vR2V0IGN1cnJlbnQgc2NyaXB0IGFuZCBoaWdobGlnaHRcbnZhciBzY3JpcHQgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0IHx8IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIikpLnBvcCgpO1xuXG5pZiAoc2NyaXB0KSB7XG5cdF8uZmlsZW5hbWUgPSBzY3JpcHQuc3JjO1xuXG5cdGlmIChkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyICYmICFzY3JpcHQuaGFzQXR0cmlidXRlKCdkYXRhLW1hbnVhbCcpKSB7XG5cdFx0aWYoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gXCJsb2FkaW5nXCIpIHtcblx0XHRcdGlmICh3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG5cdFx0XHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoXy5oaWdobGlnaHRBbGwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0d2luZG93LnNldFRpbWVvdXQoXy5oaWdobGlnaHRBbGwsIDE2KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgXy5oaWdobGlnaHRBbGwpO1xuXHRcdH1cblx0fVxufVxuXG5yZXR1cm4gX3NlbGYuUHJpc207XG5cbn0pKCk7XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRtb2R1bGUuZXhwb3J0cyA9IFByaXNtO1xufVxuXG4vLyBoYWNrIGZvciBjb21wb25lbnRzIHRvIHdvcmsgY29ycmVjdGx5IGluIG5vZGUuanNcbmlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuXHRnbG9iYWwuUHJpc20gPSBQcmlzbTtcbn1cblxuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgIEJlZ2luIHByaXNtLW1hcmt1cC5qc1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5QcmlzbS5sYW5ndWFnZXMubWFya3VwID0ge1xuXHQnY29tbWVudCc6IC88IS0tW1xcd1xcV10qPy0tPi8sXG5cdCdwcm9sb2cnOiAvPFxcP1tcXHdcXFddKz9cXD8+Lyxcblx0J2RvY3R5cGUnOiAvPCFET0NUWVBFW1xcd1xcV10rPz4vaSxcblx0J2NkYXRhJzogLzwhXFxbQ0RBVEFcXFtbXFx3XFxXXSo/XV0+L2ksXG5cdCd0YWcnOiB7XG5cdFx0cGF0dGVybjogLzxcXC8/KD8hXFxkKVteXFxzPlxcLz0kPF0rKD86XFxzK1teXFxzPlxcLz1dKyg/Oj0oPzooXCJ8JykoPzpcXFxcXFwxfFxcXFw/KD8hXFwxKVtcXHdcXFddKSpcXDF8W15cXHMnXCI+PV0rKSk/KSpcXHMqXFwvPz4vaSxcblx0XHRpbnNpZGU6IHtcblx0XHRcdCd0YWcnOiB7XG5cdFx0XHRcdHBhdHRlcm46IC9ePFxcLz9bXlxccz5cXC9dKy9pLFxuXHRcdFx0XHRpbnNpZGU6IHtcblx0XHRcdFx0XHQncHVuY3R1YXRpb24nOiAvXjxcXC8/Lyxcblx0XHRcdFx0XHQnbmFtZXNwYWNlJzogL15bXlxccz5cXC86XSs6L1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0J2F0dHItdmFsdWUnOiB7XG5cdFx0XHRcdHBhdHRlcm46IC89KD86KCd8XCIpW1xcd1xcV10qPyhcXDEpfFteXFxzPl0rKS9pLFxuXHRcdFx0XHRpbnNpZGU6IHtcblx0XHRcdFx0XHQncHVuY3R1YXRpb24nOiAvWz0+XCInXS9cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdCdwdW5jdHVhdGlvbic6IC9cXC8/Pi8sXG5cdFx0XHQnYXR0ci1uYW1lJzoge1xuXHRcdFx0XHRwYXR0ZXJuOiAvW15cXHM+XFwvXSsvLFxuXHRcdFx0XHRpbnNpZGU6IHtcblx0XHRcdFx0XHQnbmFtZXNwYWNlJzogL15bXlxccz5cXC86XSs6L1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHR9XG5cdH0sXG5cdCdlbnRpdHknOiAvJiM/W1xcZGEtel17MSw4fTsvaVxufTtcblxuLy8gUGx1Z2luIHRvIG1ha2UgZW50aXR5IHRpdGxlIHNob3cgdGhlIHJlYWwgZW50aXR5LCBpZGVhIGJ5IFJvbWFuIEtvbWFyb3ZcblByaXNtLmhvb2tzLmFkZCgnd3JhcCcsIGZ1bmN0aW9uKGVudikge1xuXG5cdGlmIChlbnYudHlwZSA9PT0gJ2VudGl0eScpIHtcblx0XHRlbnYuYXR0cmlidXRlc1sndGl0bGUnXSA9IGVudi5jb250ZW50LnJlcGxhY2UoLyZhbXA7LywgJyYnKTtcblx0fVxufSk7XG5cblByaXNtLmxhbmd1YWdlcy54bWwgPSBQcmlzbS5sYW5ndWFnZXMubWFya3VwO1xuUHJpc20ubGFuZ3VhZ2VzLmh0bWwgPSBQcmlzbS5sYW5ndWFnZXMubWFya3VwO1xuUHJpc20ubGFuZ3VhZ2VzLm1hdGhtbCA9IFByaXNtLmxhbmd1YWdlcy5tYXJrdXA7XG5QcmlzbS5sYW5ndWFnZXMuc3ZnID0gUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cDtcblxuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgIEJlZ2luIHByaXNtLWNzcy5qc1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5QcmlzbS5sYW5ndWFnZXMuY3NzID0ge1xuXHQnY29tbWVudCc6IC9cXC9cXCpbXFx3XFxXXSo/XFwqXFwvLyxcblx0J2F0cnVsZSc6IHtcblx0XHRwYXR0ZXJuOiAvQFtcXHctXSs/Lio/KDt8KD89XFxzKlxceykpL2ksXG5cdFx0aW5zaWRlOiB7XG5cdFx0XHQncnVsZSc6IC9AW1xcdy1dKy9cblx0XHRcdC8vIFNlZSByZXN0IGJlbG93XG5cdFx0fVxuXHR9LFxuXHQndXJsJzogL3VybFxcKCg/OihbXCInXSkoXFxcXCg/OlxcclxcbnxbXFx3XFxXXSl8KD8hXFwxKVteXFxcXFxcclxcbl0pKlxcMXwuKj8pXFwpL2ksXG5cdCdzZWxlY3Rvcic6IC9bXlxce1xcfVxcc11bXlxce1xcfTtdKj8oPz1cXHMqXFx7KS8sXG5cdCdzdHJpbmcnOiB7XG5cdFx0cGF0dGVybjogLyhcInwnKShcXFxcKD86XFxyXFxufFtcXHdcXFddKXwoPyFcXDEpW15cXFxcXFxyXFxuXSkqXFwxLyxcblx0XHRncmVlZHk6IHRydWVcblx0fSxcblx0J3Byb3BlcnR5JzogLyhcXGJ8XFxCKVtcXHctXSsoPz1cXHMqOikvaSxcblx0J2ltcG9ydGFudCc6IC9cXEIhaW1wb3J0YW50XFxiL2ksXG5cdCdmdW5jdGlvbic6IC9bLWEtejAtOV0rKD89XFwoKS9pLFxuXHQncHVuY3R1YXRpb24nOiAvWygpe307Ol0vXG59O1xuXG5QcmlzbS5sYW5ndWFnZXMuY3NzWydhdHJ1bGUnXS5pbnNpZGUucmVzdCA9IFByaXNtLnV0aWwuY2xvbmUoUHJpc20ubGFuZ3VhZ2VzLmNzcyk7XG5cbmlmIChQcmlzbS5sYW5ndWFnZXMubWFya3VwKSB7XG5cdFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoJ21hcmt1cCcsICd0YWcnLCB7XG5cdFx0J3N0eWxlJzoge1xuXHRcdFx0cGF0dGVybjogLyg8c3R5bGVbXFx3XFxXXSo/PilbXFx3XFxXXSo/KD89PFxcL3N0eWxlPikvaSxcblx0XHRcdGxvb2tiZWhpbmQ6IHRydWUsXG5cdFx0XHRpbnNpZGU6IFByaXNtLmxhbmd1YWdlcy5jc3MsXG5cdFx0XHRhbGlhczogJ2xhbmd1YWdlLWNzcydcblx0XHR9XG5cdH0pO1xuXHRcblx0UHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgnaW5zaWRlJywgJ2F0dHItdmFsdWUnLCB7XG5cdFx0J3N0eWxlLWF0dHInOiB7XG5cdFx0XHRwYXR0ZXJuOiAvXFxzKnN0eWxlPShcInwnKS4qP1xcMS9pLFxuXHRcdFx0aW5zaWRlOiB7XG5cdFx0XHRcdCdhdHRyLW5hbWUnOiB7XG5cdFx0XHRcdFx0cGF0dGVybjogL15cXHMqc3R5bGUvaSxcblx0XHRcdFx0XHRpbnNpZGU6IFByaXNtLmxhbmd1YWdlcy5tYXJrdXAudGFnLmluc2lkZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHQncHVuY3R1YXRpb24nOiAvXlxccyo9XFxzKlsnXCJdfFsnXCJdXFxzKiQvLFxuXHRcdFx0XHQnYXR0ci12YWx1ZSc6IHtcblx0XHRcdFx0XHRwYXR0ZXJuOiAvLisvaSxcblx0XHRcdFx0XHRpbnNpZGU6IFByaXNtLmxhbmd1YWdlcy5jc3Ncblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGFsaWFzOiAnbGFuZ3VhZ2UtY3NzJ1xuXHRcdH1cblx0fSwgUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cC50YWcpO1xufVxuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgIEJlZ2luIHByaXNtLWNsaWtlLmpzXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG5cblByaXNtLmxhbmd1YWdlcy5jbGlrZSA9IHtcblx0J2NvbW1lbnQnOiBbXG5cdFx0e1xuXHRcdFx0cGF0dGVybjogLyhefFteXFxcXF0pXFwvXFwqW1xcd1xcV10qP1xcKlxcLy8sXG5cdFx0XHRsb29rYmVoaW5kOiB0cnVlXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRwYXR0ZXJuOiAvKF58W15cXFxcOl0pXFwvXFwvLiovLFxuXHRcdFx0bG9va2JlaGluZDogdHJ1ZVxuXHRcdH1cblx0XSxcblx0J3N0cmluZyc6IHtcblx0XHRwYXR0ZXJuOiAvKFtcIiddKShcXFxcKD86XFxyXFxufFtcXHNcXFNdKXwoPyFcXDEpW15cXFxcXFxyXFxuXSkqXFwxLyxcblx0XHRncmVlZHk6IHRydWVcblx0fSxcblx0J2NsYXNzLW5hbWUnOiB7XG5cdFx0cGF0dGVybjogLygoPzpcXGIoPzpjbGFzc3xpbnRlcmZhY2V8ZXh0ZW5kc3xpbXBsZW1lbnRzfHRyYWl0fGluc3RhbmNlb2Z8bmV3KVxccyspfCg/OmNhdGNoXFxzK1xcKCkpW2EtejAtOV9cXC5cXFxcXSsvaSxcblx0XHRsb29rYmVoaW5kOiB0cnVlLFxuXHRcdGluc2lkZToge1xuXHRcdFx0cHVuY3R1YXRpb246IC8oXFwufFxcXFwpL1xuXHRcdH1cblx0fSxcblx0J2tleXdvcmQnOiAvXFxiKGlmfGVsc2V8d2hpbGV8ZG98Zm9yfHJldHVybnxpbnxpbnN0YW5jZW9mfGZ1bmN0aW9ufG5ld3x0cnl8dGhyb3d8Y2F0Y2h8ZmluYWxseXxudWxsfGJyZWFrfGNvbnRpbnVlKVxcYi8sXG5cdCdib29sZWFuJzogL1xcYih0cnVlfGZhbHNlKVxcYi8sXG5cdCdmdW5jdGlvbic6IC9bYS16MC05X10rKD89XFwoKS9pLFxuXHQnbnVtYmVyJzogL1xcYi0/KD86MHhbXFxkYS1mXSt8XFxkKlxcLj9cXGQrKD86ZVsrLV0/XFxkKyk/KVxcYi9pLFxuXHQnb3BlcmF0b3InOiAvLS0/fFxcK1xcKz98IT0/PT98PD0/fD49P3w9PT89P3wmJj98XFx8XFx8P3xcXD98XFwqfFxcL3x+fFxcXnwlLyxcblx0J3B1bmN0dWF0aW9uJzogL1t7fVtcXF07KCksLjpdL1xufTtcblxuXG4vKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgIEJlZ2luIHByaXNtLWphdmFzY3JpcHQuanNcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuUHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHQgPSBQcmlzbS5sYW5ndWFnZXMuZXh0ZW5kKCdjbGlrZScsIHtcblx0J2tleXdvcmQnOiAvXFxiKGFzfGFzeW5jfGF3YWl0fGJyZWFrfGNhc2V8Y2F0Y2h8Y2xhc3N8Y29uc3R8Y29udGludWV8ZGVidWdnZXJ8ZGVmYXVsdHxkZWxldGV8ZG98ZWxzZXxlbnVtfGV4cG9ydHxleHRlbmRzfGZpbmFsbHl8Zm9yfGZyb218ZnVuY3Rpb258Z2V0fGlmfGltcGxlbWVudHN8aW1wb3J0fGlufGluc3RhbmNlb2Z8aW50ZXJmYWNlfGxldHxuZXd8bnVsbHxvZnxwYWNrYWdlfHByaXZhdGV8cHJvdGVjdGVkfHB1YmxpY3xyZXR1cm58c2V0fHN0YXRpY3xzdXBlcnxzd2l0Y2h8dGhpc3x0aHJvd3x0cnl8dHlwZW9mfHZhcnx2b2lkfHdoaWxlfHdpdGh8eWllbGQpXFxiLyxcblx0J251bWJlcic6IC9cXGItPygweFtcXGRBLUZhLWZdK3wwYlswMV0rfDBvWzAtN10rfFxcZCpcXC4/XFxkKyhbRWVdWystXT9cXGQrKT98TmFOfEluZmluaXR5KVxcYi8sXG5cdC8vIEFsbG93IGZvciBhbGwgbm9uLUFTQ0lJIGNoYXJhY3RlcnMgKFNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMDA4NDQ0KVxuXHQnZnVuY3Rpb24nOiAvW18kYS16QS1aXFx4QTAtXFx1RkZGRl1bXyRhLXpBLVowLTlcXHhBMC1cXHVGRkZGXSooPz1cXCgpL2ksXG5cdCdvcGVyYXRvcic6IC8tLT98XFwrXFwrP3whPT89P3w8PT98Pj0/fD09Pz0/fCYmP3xcXHxcXHw/fFxcP3xcXCpcXCo/fFxcL3x+fFxcXnwlfFxcLnszfS9cbn0pO1xuXG5QcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCdqYXZhc2NyaXB0JywgJ2tleXdvcmQnLCB7XG5cdCdyZWdleCc6IHtcblx0XHRwYXR0ZXJuOiAvKF58W14vXSlcXC8oPyFcXC8pKFxcWy4rP118XFxcXC58W14vXFxcXFxcclxcbl0pK1xcL1tnaW15dV17MCw1fSg/PVxccyooJHxbXFxyXFxuLC47fSldKSkvLFxuXHRcdGxvb2tiZWhpbmQ6IHRydWUsXG5cdFx0Z3JlZWR5OiB0cnVlXG5cdH1cbn0pO1xuXG5QcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCdqYXZhc2NyaXB0JywgJ3N0cmluZycsIHtcblx0J3RlbXBsYXRlLXN0cmluZyc6IHtcblx0XHRwYXR0ZXJuOiAvYCg/OlxcXFxcXFxcfFxcXFw/W15cXFxcXSkqP2AvLFxuXHRcdGdyZWVkeTogdHJ1ZSxcblx0XHRpbnNpZGU6IHtcblx0XHRcdCdpbnRlcnBvbGF0aW9uJzoge1xuXHRcdFx0XHRwYXR0ZXJuOiAvXFwkXFx7W159XStcXH0vLFxuXHRcdFx0XHRpbnNpZGU6IHtcblx0XHRcdFx0XHQnaW50ZXJwb2xhdGlvbi1wdW5jdHVhdGlvbic6IHtcblx0XHRcdFx0XHRcdHBhdHRlcm46IC9eXFwkXFx7fFxcfSQvLFxuXHRcdFx0XHRcdFx0YWxpYXM6ICdwdW5jdHVhdGlvbidcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHJlc3Q6IFByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHQnc3RyaW5nJzogL1tcXHNcXFNdKy9cblx0XHR9XG5cdH1cbn0pO1xuXG5pZiAoUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cCkge1xuXHRQcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCdtYXJrdXAnLCAndGFnJywge1xuXHRcdCdzY3JpcHQnOiB7XG5cdFx0XHRwYXR0ZXJuOiAvKDxzY3JpcHRbXFx3XFxXXSo/PilbXFx3XFxXXSo/KD89PFxcL3NjcmlwdD4pL2ksXG5cdFx0XHRsb29rYmVoaW5kOiB0cnVlLFxuXHRcdFx0aW5zaWRlOiBQcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdCxcblx0XHRcdGFsaWFzOiAnbGFuZ3VhZ2UtamF2YXNjcmlwdCdcblx0XHR9XG5cdH0pO1xufVxuXG5QcmlzbS5sYW5ndWFnZXMuanMgPSBQcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdDtcblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICBCZWdpbiBwcmlzbS1maWxlLWhpZ2hsaWdodC5qc1xuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXHRpZiAodHlwZW9mIHNlbGYgPT09ICd1bmRlZmluZWQnIHx8ICFzZWxmLlByaXNtIHx8ICFzZWxmLmRvY3VtZW50IHx8ICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0c2VsZi5QcmlzbS5maWxlSGlnaGxpZ2h0ID0gZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgRXh0ZW5zaW9ucyA9IHtcblx0XHRcdCdqcyc6ICdqYXZhc2NyaXB0Jyxcblx0XHRcdCdweSc6ICdweXRob24nLFxuXHRcdFx0J3JiJzogJ3J1YnknLFxuXHRcdFx0J3BzMSc6ICdwb3dlcnNoZWxsJyxcblx0XHRcdCdwc20xJzogJ3Bvd2Vyc2hlbGwnLFxuXHRcdFx0J3NoJzogJ2Jhc2gnLFxuXHRcdFx0J2JhdCc6ICdiYXRjaCcsXG5cdFx0XHQnaCc6ICdjJyxcblx0XHRcdCd0ZXgnOiAnbGF0ZXgnXG5cdFx0fTtcblxuXHRcdGlmKEFycmF5LnByb3RvdHlwZS5mb3JFYWNoKSB7IC8vIENoZWNrIHRvIHByZXZlbnQgZXJyb3IgaW4gSUU4XG5cdFx0XHRBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwcmVbZGF0YS1zcmNdJykpLmZvckVhY2goZnVuY3Rpb24gKHByZSkge1xuXHRcdFx0XHR2YXIgc3JjID0gcHJlLmdldEF0dHJpYnV0ZSgnZGF0YS1zcmMnKTtcblxuXHRcdFx0XHR2YXIgbGFuZ3VhZ2UsIHBhcmVudCA9IHByZTtcblx0XHRcdFx0dmFyIGxhbmcgPSAvXFxibGFuZyg/OnVhZ2UpPy0oPyFcXCopKFxcdyspXFxiL2k7XG5cdFx0XHRcdHdoaWxlIChwYXJlbnQgJiYgIWxhbmcudGVzdChwYXJlbnQuY2xhc3NOYW1lKSkge1xuXHRcdFx0XHRcdHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHBhcmVudCkge1xuXHRcdFx0XHRcdGxhbmd1YWdlID0gKHByZS5jbGFzc05hbWUubWF0Y2gobGFuZykgfHwgWywgJyddKVsxXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghbGFuZ3VhZ2UpIHtcblx0XHRcdFx0XHR2YXIgZXh0ZW5zaW9uID0gKHNyYy5tYXRjaCgvXFwuKFxcdyspJC8pIHx8IFssICcnXSlbMV07XG5cdFx0XHRcdFx0bGFuZ3VhZ2UgPSBFeHRlbnNpb25zW2V4dGVuc2lvbl0gfHwgZXh0ZW5zaW9uO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIGNvZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjb2RlJyk7XG5cdFx0XHRcdGNvZGUuY2xhc3NOYW1lID0gJ2xhbmd1YWdlLScgKyBsYW5ndWFnZTtcblxuXHRcdFx0XHRwcmUudGV4dENvbnRlbnQgPSAnJztcblxuXHRcdFx0XHRjb2RlLnRleHRDb250ZW50ID0gJ0xvYWRpbmfigKYnO1xuXG5cdFx0XHRcdHByZS5hcHBlbmRDaGlsZChjb2RlKTtcblxuXHRcdFx0XHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cblx0XHRcdFx0eGhyLm9wZW4oJ0dFVCcsIHNyYywgdHJ1ZSk7XG5cblx0XHRcdFx0eGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCkge1xuXG5cdFx0XHRcdFx0XHRpZiAoeGhyLnN0YXR1cyA8IDQwMCAmJiB4aHIucmVzcG9uc2VUZXh0KSB7XG5cdFx0XHRcdFx0XHRcdGNvZGUudGV4dENvbnRlbnQgPSB4aHIucmVzcG9uc2VUZXh0O1xuXG5cdFx0XHRcdFx0XHRcdFByaXNtLmhpZ2hsaWdodEVsZW1lbnQoY29kZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmICh4aHIuc3RhdHVzID49IDQwMCkge1xuXHRcdFx0XHRcdFx0XHRjb2RlLnRleHRDb250ZW50ID0gJ+KcliBFcnJvciAnICsgeGhyLnN0YXR1cyArICcgd2hpbGUgZmV0Y2hpbmcgZmlsZTogJyArIHhoci5zdGF0dXNUZXh0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGNvZGUudGV4dENvbnRlbnQgPSAn4pyWIEVycm9yOiBGaWxlIGRvZXMgbm90IGV4aXN0IG9yIGlzIGVtcHR5Jztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0eGhyLnNlbmQobnVsbCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0fTtcblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgc2VsZi5QcmlzbS5maWxlSGlnaGxpZ2h0KTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3ByaXNtanMvcHJpc20uanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKlxyXG4gKiBTZXJ2aWNlIHRoYXQgaW5zZXJ0cyBhbiBlbGVtZW50IGludG8gdGhlIERPTSB2aWEgaXRzICdpbnNlcnQnIG1ldGhvZDpcclxuICogLSBJZiBhdHRyLnByaXNtSW5zZXJ0SWQgaXMgc3BlY2lmaWVkLCBpbnNlcnRzIGl0IGFzIHRoZSBmaXJzdCBjaGlsZCBvZiB0aGUgaWRcclxuICogLSBPdGhlcndpc2UsIGluc2VydHMgaXQgYWZ0ZXIgZGVmYXVsdFByZXZTaWJsaW5nXHJcbiAqL1xyXG5cclxuXHJcbmltcG9ydCB7SUF0dHJpYnV0ZXMsIElBdWdtZW50ZWRKUXVlcnl9IGZyb20gJ2FuZ3VsYXInO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJSW5zZXJ0RWxlbWVudFNlcnZpY2Uge1xyXG4gICAgaW5zZXJ0KGVsZW1lbnQ6IElBdWdtZW50ZWRKUXVlcnksIGRlZmF1bHRQcmV2U2libGluZzogSUF1Z21lbnRlZEpRdWVyeSwgYXR0cjogSUF0dHJpYnV0ZXMpOiB2b2lkO1xyXG4gICAgcmVtb3ZlQXR0cmlidXRlcyhlbGVtZW50OiBJQXVnbWVudGVkSlF1ZXJ5KTogdm9pZDtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5zZXJ0RWxlbWVudFNlcnZpY2UgaW1wbGVtZW50cyBJSW5zZXJ0RWxlbWVudFNlcnZpY2Uge1xyXG4gICAgcmVtb3ZlQXR0cmlidXRlcyhlbGVtZW50OiBJQXVnbWVudGVkSlF1ZXJ5KSB7XHJcbiAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyKCdwcmlzbS1pbnNlcnQtaWQnKTtcclxuICAgIH1cclxuXHJcbiAgICBpbnNlcnQoZWxlbWVudDogSUF1Z21lbnRlZEpRdWVyeSwgZGVmYXVsdFByZXZTaWJsaW5nOiBJQXVnbWVudGVkSlF1ZXJ5LCBhdHRyOiBJQXR0cmlidXRlcyk6IHZvaWQge1xyXG4gICAgICAgIGlmIChhdHRyLnByaXNtSW5zZXJ0SWQpIHtcclxuICAgICAgICAgICAgbGV0IHBhcmVudEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhdHRyLnByaXNtSW5zZXJ0SWQpO1xyXG4gICAgICAgICAgICBwYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShlbGVtZW50WzBdLCBwYXJlbnRFbGVtZW50LmZpcnN0RWxlbWVudENoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGRlZmF1bHRQcmV2U2libGluZy5hZnRlcihlbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5cclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvc2VydmljZXMvaW5zZXJ0LWVsZW1lbnQuc2VydmljZS50c1xuICoqLyIsIi8qXHJcbiAqIER5bmFtaWNhbGx5IGluc2VydHMgYSBjb2RlIGJsb2NrIGNvbnRhaW5pbmcgdGhlIGNvZGUgdGhhdCBjcmVhdGVkIHRoaXMgZWxlbWVudFxyXG4gKiBJbnNlcnRzIHRoZSBjb2RlIGJsb2NrIGFjY29yZGluZyB0byBJbnNlcnRFbGVtZW50U2VydmljZVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IElBdHRyaWJ1dGVzLCBJQXVnbWVudGVkSlF1ZXJ5IH0gZnJvbSAnYW5ndWxhcic7XHJcbmltcG9ydCB7SUluc2VydEVsZW1lbnRTZXJ2aWNlfSBmcm9tICcuLi9zZXJ2aWNlcy9pbnNlcnQtZWxlbWVudC5zZXJ2aWNlJztcclxuaW1wb3J0IHtJUmVwZWF0QXNDb2RlU2VydmljZX0gZnJvbSAnLi4vc2VydmljZXMvcmVwZWF0LWFzLWNvZGUuc2VydmljZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBbJ0luc2VydEVsZW1lbnRTZXJ2aWNlJywgJ1JlcGVhdEFzQ29kZVNlcnZpY2UnLFxyXG4gICAgKEluc2VydEVsZW1lbnRTZXJ2aWNlOiBJSW5zZXJ0RWxlbWVudFNlcnZpY2UsXHJcbiAgICAgUmVwZWF0QXNDb2RlU2VydmljZTogSVJlcGVhdEFzQ29kZVNlcnZpY2UpID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBwcmlvcml0eTogMTAwMCxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICAgICAgY29tcGlsZTogKGVsZW1lbnQ6IElBdWdtZW50ZWRKUXVlcnksIGF0dHI6IElBdHRyaWJ1dGVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHIoJ3JlcGVhdC1hcy1jb2RlJyk7XHJcbiAgICAgICAgICAgICAgICBJbnNlcnRFbGVtZW50U2VydmljZS5yZW1vdmVBdHRyaWJ1dGVzKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvZGUgPSBSZXBlYXRBc0NvZGVTZXJ2aWNlKGVsZW1lbnQsIGF0dHIucmVwZWF0QXNDb2RlKTtcclxuICAgICAgICAgICAgICAgIEluc2VydEVsZW1lbnRTZXJ2aWNlLmluc2VydChjb2RlLCBlbGVtZW50LCBhdHRyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbl07XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2RpcmVjdGl2ZXMvcmVwZWF0LWFzLWNvZGUuZGlyZWN0aXZlLnRzXG4gKiovIiwiLypcclxuICogRHluYW1pY2FsbHkgY3JlYXRlcyBhIGNvZGUgYmxvY2sgZnJvbSB0aGUgZ2l2ZW4galF1ZXJ5IERPTSBlbGVtZW50XHJcbiAqL1xyXG5pbXBvcnQge0lBdWdtZW50ZWRKUXVlcnl9IGZyb20gJ2FuZ3VsYXInO1xyXG5pbXBvcnQgeyBoaWdobGlnaHQsIG5vcm1hbGl6ZU91dGVySFRNTCB9IGZyb20gJy4uL2hpZ2hsaWdodCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZXBlYXRBc0NvZGVTZXJ2aWNlO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUmVwZWF0QXNDb2RlU2VydmljZSB7XHJcbiAgICAoZWxlbWVudDogSUF1Z21lbnRlZEpRdWVyeSwgdHlwZTogc3RyaW5nKTogSUF1Z21lbnRlZEpRdWVyeTtcclxufVxyXG5cclxuZnVuY3Rpb24gUmVwZWF0QXNDb2RlU2VydmljZSgpOiBJUmVwZWF0QXNDb2RlU2VydmljZSB7XHJcbiAgICByZXR1cm4gKGVsZW1lbnQ6IElBdWdtZW50ZWRKUXVlcnksIHR5cGU6IHN0cmluZyk6IElBdWdtZW50ZWRKUXVlcnkgPT4ge1xyXG4gICAgICAgIGxldCBjb2RlID0gbnVsbDtcclxuICAgICAgICBpZiAodHlwZSA9PT0gJ2lubmVyJykge1xyXG4gICAgICAgICAgICBjb2RlID0gZWxlbWVudFswXS5pbm5lckhUTUw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb2RlID0gbm9ybWFsaXplT3V0ZXJIVE1MKGVsZW1lbnRbMF0ub3V0ZXJIVE1MKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGhpZ2hsaWdodGVkQ29kZSA9IGhpZ2hsaWdodChjb2RlLCAnbWFya3VwJyk7XHJcblxyXG4gICAgICAgIHJldHVybiBoaWdobGlnaHRlZENvZGU7XHJcbiAgICB9O1xyXG59XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL3NlcnZpY2VzL3JlcGVhdC1hcy1jb2RlLnNlcnZpY2UudHNcbiAqKi8iLCIvKlxyXG4gKiBGdW5jdGlvbnMgdG8gaGlnaGxpZ2h0IGEgZ2l2ZW4gY29kZSBibG9jay5cclxuICovXHJcblxyXG5pbXBvcnQge2VsZW1lbnQsIElBdWdtZW50ZWRKUXVlcnl9IGZyb20gJ2FuZ3VsYXInO1xyXG5pbXBvcnQgKiBhcyBQcmlzbSBmcm9tICdwcmlzbWpzJztcclxuXHJcbnJlcXVpcmUoJ3ByaXNtanMvcGx1Z2lucy9ub3JtYWxpemUtd2hpdGVzcGFjZS9wcmlzbS1ub3JtYWxpemUtd2hpdGVzcGFjZScpO1x0Ly8gQW5vbnltb3VzIGZ1bmN0aW9ucyB0byBsb2FkIHBsdWdpblxyXG5sZXQgd2hpdGVzcGFjZVBsdWdpbiA9IFByaXNtLnBsdWdpbnMuTm9ybWFsaXplV2hpdGVzcGFjZTtcdFx0XHRcdFx0Ly8gUHVibGljLWZhY2luZyBwbHVnaW4gb2JqZWN0XHJcblxyXG53aGl0ZXNwYWNlUGx1Z2luLnNldERlZmF1bHRzKHtcclxuICAgICd0YWJzLXRvLXNwYWNlcyc6IDRcclxufSk7XHJcblxyXG4vLyBEZXRlcm1pbmUgbGVuZ3RoIG9mIHdoaXRlc3BhY2UgYXQgYmVnaW5uaW5nIG9mIHN0cmluZ1xyXG5mdW5jdGlvbiBnZXRXaGl0ZXNwYWNlTGVuZ3RoKGxpbmU6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICBsZXQgbWF0Y2hlcyA9IGxpbmUubWF0Y2goL15cXHMrLyk7XHJcbiAgICBpZiAobWF0Y2hlcykge1xyXG4gICAgICAgIHJldHVybiBtYXRjaGVzWzBdLmxlbmd0aDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBJbmRlbnQgZmlyc3QgbGluZSBvZiBhbiBlbGVtZW50J3Mgb3V0ZXJIVE1MIHNpbmNlIHRoZSBET00gc3RyaXBzIG9mZiBpdHMgaW5kZW50YXRpb25cclxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZU91dGVySFRNTChjb2RlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgbGV0IGxpbmVzID0gY29kZS5zcGxpdCgnXFxuJyk7XHJcbiAgICBsZXQgbGFzdExpbmUgPSBsaW5lc1tsaW5lcy5sZW5ndGggLSAxXTtcclxuICAgIGxldCBsYXN0TGluZUluZGVudCA9IGdldFdoaXRlc3BhY2VMZW5ndGgobGFzdExpbmUpO1x0Ly8gSW5kZW50IGl0IGlkZW50aWNhbCB0byB0aGUgbGFzdCBsaW5lXHJcbiAgICBsaW5lc1swXSA9IGxhc3RMaW5lLnN1YnN0cigwLCBsYXN0TGluZUluZGVudCkuY29uY2F0KGxpbmVzWzBdKTtcclxuICAgIGNvZGUgPSBsaW5lcy5qb2luKCdcXG4nKTtcclxuICAgIHJldHVybiBjb2RlO1xyXG59XHJcblxyXG4vLyBIaWdobGlnaHQgY29kZSBpbiB0aGUgc3BlY2lmaWVkIFByaXNtSlMgbGFuZ3VhZ2VcclxuZXhwb3J0IGZ1bmN0aW9uIGhpZ2hsaWdodChjb2RlOiBzdHJpbmcsIGxhbmd1YWdlOiBzdHJpbmcpOiBJQXVnbWVudGVkSlF1ZXJ5IHtcclxuICAgIGNvZGUgPSB3aGl0ZXNwYWNlUGx1Z2luLm5vcm1hbGl6ZShjb2RlKTtcclxuICAgIGxldCBoaWdobGlnaHRlZENvZGUgPSBQcmlzbS5oaWdobGlnaHQoY29kZSwgUHJpc20ubGFuZ3VhZ2VzW2xhbmd1YWdlXSk7XHJcbiAgICBsZXQgdGVtcGxhdGUgPSBgPHByZSBjbGFzcz1cImxhbmd1YWdlLSR7bGFuZ3VhZ2V9XCIgZGlyPVwibHRyXCI+PGNvZGUgY2xhc3M9XCJsYW5ndWFnZS0ke2xhbmd1YWdlfVwiPjwvY29kZT48L3ByZT5gO1xyXG4gICAgbGV0IG1hcmt1cCA9IGVsZW1lbnQodGVtcGxhdGUpO1xyXG4gICAgbWFya3VwLmZpbmQoJ2NvZGUnKS5odG1sKGhpZ2hsaWdodGVkQ29kZSk7XHJcbiAgICByZXR1cm4gbWFya3VwO1xyXG59XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2hpZ2hsaWdodC50c1xuICoqLyIsIihmdW5jdGlvbigpIHtcblxuaWYgKHR5cGVvZiBzZWxmID09PSAndW5kZWZpbmVkJyB8fCAhc2VsZi5QcmlzbSB8fCAhc2VsZi5kb2N1bWVudCkge1xuXHRyZXR1cm47XG59XG5cbnZhciBhc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIChvYmoxLCBvYmoyKSB7XG5cdGZvciAodmFyIG5hbWUgaW4gb2JqMikge1xuXHRcdGlmIChvYmoyLmhhc093blByb3BlcnR5KG5hbWUpKVxuXHRcdFx0b2JqMVtuYW1lXSA9IG9iajJbbmFtZV07XG5cdH1cblx0cmV0dXJuIG9iajE7XG59XG5cbmZ1bmN0aW9uIE5vcm1hbGl6ZVdoaXRlc3BhY2UoZGVmYXVsdHMpIHtcblx0dGhpcy5kZWZhdWx0cyA9IGFzc2lnbih7fSwgZGVmYXVsdHMpO1xufVxuXG5mdW5jdGlvbiB0b0NhbWVsQ2FzZSh2YWx1ZSkge1xuXHRyZXR1cm4gdmFsdWUucmVwbGFjZSgvLShcXHcpL2csIGZ1bmN0aW9uKG1hdGNoLCBmaXJzdENoYXIpIHtcblx0XHRyZXR1cm4gZmlyc3RDaGFyLnRvVXBwZXJDYXNlKCk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiB0YWJMZW4oc3RyKSB7XG5cdHZhciByZXMgPSAwO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuXHRcdGlmIChzdHIuY2hhckNvZGVBdChpKSA9PSAnXFx0Jy5jaGFyQ29kZUF0KDApKVxuXHRcdFx0cmVzICs9IDM7XG5cdH1cblx0cmV0dXJuIHN0ci5sZW5ndGggKyByZXM7XG59XG5cbk5vcm1hbGl6ZVdoaXRlc3BhY2UucHJvdG90eXBlID0ge1xuXHRzZXREZWZhdWx0czogZnVuY3Rpb24gKGRlZmF1bHRzKSB7XG5cdFx0dGhpcy5kZWZhdWx0cyA9IGFzc2lnbih0aGlzLmRlZmF1bHRzLCBkZWZhdWx0cyk7XG5cdH0sXG5cdG5vcm1hbGl6ZTogZnVuY3Rpb24gKGlucHV0LCBzZXR0aW5ncykge1xuXHRcdHNldHRpbmdzID0gYXNzaWduKHRoaXMuZGVmYXVsdHMsIHNldHRpbmdzKTtcblxuXHRcdGZvciAodmFyIG5hbWUgaW4gc2V0dGluZ3MpIHtcblx0XHRcdHZhciBtZXRob2ROYW1lID0gdG9DYW1lbENhc2UobmFtZSk7XG5cdFx0XHRpZiAobmFtZSAhPT0gXCJub3JtYWxpemVcIiAmJiBtZXRob2ROYW1lICE9PSAnc2V0RGVmYXVsdHMnICYmXG5cdFx0XHRcdFx0c2V0dGluZ3NbbmFtZV0gJiYgdGhpc1ttZXRob2ROYW1lXSkge1xuXHRcdFx0XHRpbnB1dCA9IHRoaXNbbWV0aG9kTmFtZV0uY2FsbCh0aGlzLCBpbnB1dCwgc2V0dGluZ3NbbmFtZV0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBpbnB1dDtcblx0fSxcblxuXHQvKlxuXHQgKiBOb3JtYWxpemF0aW9uIG1ldGhvZHNcblx0ICovXG5cdGxlZnRUcmltOiBmdW5jdGlvbiAoaW5wdXQpIHtcblx0XHRyZXR1cm4gaW5wdXQucmVwbGFjZSgvXlxccysvLCAnJyk7XG5cdH0sXG5cdHJpZ2h0VHJpbTogZnVuY3Rpb24gKGlucHV0KSB7XG5cdFx0cmV0dXJuIGlucHV0LnJlcGxhY2UoL1xccyskLywgJycpO1xuXHR9LFxuXHR0YWJzVG9TcGFjZXM6IGZ1bmN0aW9uIChpbnB1dCwgc3BhY2VzKSB7XG5cdFx0c3BhY2VzID0gc3BhY2VzfDAgfHwgNDtcblx0XHRyZXR1cm4gaW5wdXQucmVwbGFjZSgvXFx0L2csIG5ldyBBcnJheSgrK3NwYWNlcykuam9pbignICcpKTtcblx0fSxcblx0c3BhY2VzVG9UYWJzOiBmdW5jdGlvbiAoaW5wdXQsIHNwYWNlcykge1xuXHRcdHNwYWNlcyA9IHNwYWNlc3wwIHx8IDQ7XG5cdFx0cmV0dXJuIGlucHV0LnJlcGxhY2UobmV3IFJlZ0V4cCgnIHsnICsgc3BhY2VzICsgJ30nLCAnZycpLCAnXFx0Jyk7XG5cdH0sXG5cdHJlbW92ZVRyYWlsaW5nOiBmdW5jdGlvbiAoaW5wdXQpIHtcblx0XHRyZXR1cm4gaW5wdXQucmVwbGFjZSgvXFxzKj8kL2dtLCAnJyk7XG5cdH0sXG5cdC8vIFN1cHBvcnQgZm9yIGRlcHJlY2F0ZWQgcGx1Z2luIHJlbW92ZS1pbml0aWFsLWxpbmUtZmVlZFxuXHRyZW1vdmVJbml0aWFsTGluZUZlZWQ6IGZ1bmN0aW9uIChpbnB1dCkge1xuXHRcdHJldHVybiBpbnB1dC5yZXBsYWNlKC9eKD86XFxyP1xcbnxcXHIpLywgJycpO1xuXHR9LFxuXHRyZW1vdmVJbmRlbnQ6IGZ1bmN0aW9uIChpbnB1dCkge1xuXHRcdHZhciBpbmRlbnRzID0gaW5wdXQubWF0Y2goL15bXlxcU1xcblxccl0qKD89XFxTKS9nbSk7XG5cblx0XHRpZiAoIWluZGVudHMgfHwgIWluZGVudHNbMF0ubGVuZ3RoKVxuXHRcdFx0cmV0dXJuIGlucHV0O1xuXG5cdFx0aW5kZW50cy5zb3J0KGZ1bmN0aW9uKGEsIGIpe3JldHVybiBhLmxlbmd0aCAtIGIubGVuZ3RoOyB9KTtcblxuXHRcdGlmICghaW5kZW50c1swXS5sZW5ndGgpXG5cdFx0XHRyZXR1cm4gaW5wdXQ7XG5cblx0XHRyZXR1cm4gaW5wdXQucmVwbGFjZShuZXcgUmVnRXhwKCdeJyArIGluZGVudHNbMF0sICdnbScpLCAnJyk7XG5cdH0sXG5cdGluZGVudDogZnVuY3Rpb24gKGlucHV0LCB0YWJzKSB7XG5cdFx0cmV0dXJuIGlucHV0LnJlcGxhY2UoL15bXlxcU1xcblxccl0qKD89XFxTKS9nbSwgbmV3IEFycmF5KCsrdGFicykuam9pbignXFx0JykgKyAnJCYnKTtcblx0fSxcblx0YnJlYWtMaW5lczogZnVuY3Rpb24gKGlucHV0LCBjaGFyYWN0ZXJzKSB7XG5cdFx0Y2hhcmFjdGVycyA9IChjaGFyYWN0ZXJzID09PSB0cnVlKSA/IDgwIDogY2hhcmFjdGVyc3wwIHx8IDgwO1xuXG5cdFx0dmFyIGxpbmVzID0gaW5wdXQuc3BsaXQoJ1xcbicpO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyArK2kpIHtcblx0XHRcdGlmICh0YWJMZW4obGluZXNbaV0pIDw9IGNoYXJhY3RlcnMpXG5cdFx0XHRcdGNvbnRpbnVlO1xuXG5cdFx0XHR2YXIgbGluZSA9IGxpbmVzW2ldLnNwbGl0KC8oXFxzKykvZyksXG5cdFx0XHQgICAgbGVuID0gMDtcblxuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBsaW5lLmxlbmd0aDsgKytqKSB7XG5cdFx0XHRcdHZhciB0bCA9IHRhYkxlbihsaW5lW2pdKTtcblx0XHRcdFx0bGVuICs9IHRsO1xuXHRcdFx0XHRpZiAobGVuID4gY2hhcmFjdGVycykge1xuXHRcdFx0XHRcdGxpbmVbal0gPSAnXFxuJyArIGxpbmVbal07XG5cdFx0XHRcdFx0bGVuID0gdGw7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGxpbmVzW2ldID0gbGluZS5qb2luKCcnKTtcblx0XHR9XG5cdFx0cmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xuXHR9XG59O1xuXG5QcmlzbS5wbHVnaW5zLk5vcm1hbGl6ZVdoaXRlc3BhY2UgPSBuZXcgTm9ybWFsaXplV2hpdGVzcGFjZSh7XG5cdCdyZW1vdmUtdHJhaWxpbmcnOiB0cnVlLFxuXHQncmVtb3ZlLWluZGVudCc6IHRydWUsXG5cdCdsZWZ0LXRyaW0nOiB0cnVlLFxuXHQncmlnaHQtdHJpbSc6IHRydWUsXG5cdC8qJ2JyZWFrLWxpbmVzJzogODAsXG5cdCdpbmRlbnQnOiAyLFxuXHQncmVtb3ZlLWluaXRpYWwtbGluZS1mZWVkJzogZmFsc2UsXG5cdCd0YWJzLXRvLXNwYWNlcyc6IDQsXG5cdCdzcGFjZXMtdG8tdGFicyc6IDQqL1xufSk7XG5cblByaXNtLmhvb2tzLmFkZCgnYmVmb3JlLXNhbml0eS1jaGVjaycsIGZ1bmN0aW9uIChlbnYpIHtcblx0dmFyIHByZSA9IGVudi5lbGVtZW50LnBhcmVudE5vZGU7XG5cdHZhciBjbHNSZWcgPSAvXFxibm8td2hpdGVzcGFjZS1ub3JtYWxpemF0aW9uXFxiLztcblx0aWYgKCFlbnYuY29kZSB8fCAhcHJlIHx8IHByZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9PSAncHJlJyB8fFxuXHRcdFx0KGVudi5zZXR0aW5ncyAmJiBlbnYuc2V0dGluZ3NbJ3doaXRlc3BhY2Utbm9ybWFsaXphdGlvbiddID09PSBmYWxzZSkgfHxcblx0XHRcdGNsc1JlZy50ZXN0KHByZS5jbGFzc05hbWUpIHx8IGNsc1JlZy50ZXN0KGVudi5lbGVtZW50LmNsYXNzTmFtZSkpXG5cdFx0cmV0dXJuO1xuXG5cdHZhciBjaGlsZHJlbiA9IHByZS5jaGlsZE5vZGVzLFxuXHQgICAgYmVmb3JlID0gJycsXG5cdCAgICBhZnRlciA9ICcnLFxuXHQgICAgY29kZUZvdW5kID0gZmFsc2UsXG5cdCAgICBOb3JtYWxpemVyID0gUHJpc20ucGx1Z2lucy5Ob3JtYWxpemVXaGl0ZXNwYWNlO1xuXG5cdC8vIE1vdmUgc3Vycm91bmRpbmcgd2hpdGVzcGFjZSBmcm9tIHRoZSA8cHJlPiB0YWcgaW50byB0aGUgPGNvZGU+IHRhZ1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XG5cdFx0dmFyIG5vZGUgPSBjaGlsZHJlbltpXTtcblxuXHRcdGlmIChub2RlID09IGVudi5lbGVtZW50KSB7XG5cdFx0XHRjb2RlRm91bmQgPSB0cnVlO1xuXHRcdH0gZWxzZSBpZiAobm9kZS5ub2RlTmFtZSA9PT0gXCIjdGV4dFwiKSB7XG5cdFx0XHRpZiAoY29kZUZvdW5kKSB7XG5cdFx0XHRcdGFmdGVyICs9IG5vZGUubm9kZVZhbHVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YmVmb3JlICs9IG5vZGUubm9kZVZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHRwcmUucmVtb3ZlQ2hpbGQobm9kZSk7XG5cdFx0XHQtLWk7XG5cdFx0fVxuXHR9XG5cblx0aWYgKCFlbnYuZWxlbWVudC5jaGlsZHJlbi5sZW5ndGggfHwgIVByaXNtLnBsdWdpbnMuS2VlcE1hcmt1cCkge1xuXHRcdGVudi5jb2RlID0gYmVmb3JlICsgZW52LmNvZGUgKyBhZnRlcjtcblx0XHRlbnYuY29kZSA9IE5vcm1hbGl6ZXIubm9ybWFsaXplKGVudi5jb2RlLCBlbnYuc2V0dGluZ3MpO1xuXHR9IGVsc2Uge1xuXHRcdC8vIFByZXNlcnZlIG1hcmt1cCBmb3Iga2VlcC1tYXJrdXAgcGx1Z2luXG5cdFx0dmFyIGh0bWwgPSBiZWZvcmUgKyBlbnYuZWxlbWVudC5pbm5lckhUTUwgKyBhZnRlcjtcblx0XHRlbnYuZWxlbWVudC5pbm5lckhUTUwgPSBOb3JtYWxpemVyLm5vcm1hbGl6ZShodG1sLCBlbnYuc2V0dGluZ3MpO1xuXHRcdGVudi5jb2RlID0gZW52LmVsZW1lbnQudGV4dENvbnRlbnQ7XG5cdH1cbn0pO1xuXG59KCkpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3ByaXNtanMvcGx1Z2lucy9ub3JtYWxpemUtd2hpdGVzcGFjZS9wcmlzbS1ub3JtYWxpemUtd2hpdGVzcGFjZS5qc1xuICoqIG1vZHVsZSBpZCA9IDhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qXHJcbiAqIFRvZ2dsZXMgc2hvdy9oaWRlIG9mIHRoZSBjb2RlIGJsb2NrIGluc2lkZSBpdFxyXG4gKi9cclxuXHJcbmxldCB0ZW1wbGF0ZVVybCA9IHJlcXVpcmUoJy4vdG9nZ2xlYWJsZS1jb2RlLmRpcmVjdGl2ZS5odG1sJyk7XHJcblxyXG5pbXBvcnQge0lBdHRyaWJ1dGVzLCBJQXVnbWVudGVkSlF1ZXJ5LCBJU2NvcGV9IGZyb20gJ2FuZ3VsYXInO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJVG9nZ2xlYWJsZUNvZGVDb250cm9sbGVyIHtcclxuICAgIGNvZGU6IEhUTUxFbGVtZW50O1xyXG4gICAgY29kZVdyYXBwZXI6IEhUTUxFbGVtZW50O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVG9nZ2xlYWJsZUNvZGVDb250cm9sbGVyIGltcGxlbWVudHMgSVRvZ2dsZWFibGVDb2RlQ29udHJvbGxlciB7XHJcbiAgICBjb2RlOiBIVE1MRWxlbWVudDtcclxuICAgIGNvZGVXcmFwcGVyOiBIVE1MRWxlbWVudDtcclxuICAgIHZpc2libGU6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlQ29kZSgpIHtcclxuICAgICAgICBpZiAodGhpcy52aXNpYmxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNob3coKSB7XHJcbiAgICAgICAgdGhpcy5jb2RlV3JhcHBlci5zdHlsZS5oZWlnaHQgPSB0aGlzLmNvZGUub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcclxuICAgICAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgdGhpcy5jb2RlV3JhcHBlci5zdHlsZS5oZWlnaHQgPSAnMCc7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFtUb2dnbGVhYmxlQ29kZURpcmVjdGl2ZV07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVG9nZ2xlYWJsZUNvZGVEaXJlY3RpdmUoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvbnRyb2xsZXI6IFRvZ2dsZWFibGVDb2RlQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICckY3RybCcsXHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICBzY29wZToge30sXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlVXJsLFxyXG4gICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGU6IElTY29wZSxcclxuICAgICAgICAgICAgICAgICAgICAgICBpRWxlbWVudDogSUF1Z21lbnRlZEpRdWVyeSxcclxuICAgICAgICAgICAgICAgICAgICAgICBpQXR0cnM6IElBdHRyaWJ1dGVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IElUb2dnbGVhYmxlQ29kZUNvbnRyb2xsZXIpIHtcclxuICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gaUVsZW1lbnQuY2hpbGRyZW4oKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGNoaWxkSW5kZXggPSAwOyBjaGlsZEluZGV4IDwgY2hpbGRyZW4ubGVuZ3RoOyBjaGlsZEluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IGNoaWxkcmVuW2NoaWxkSW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLmNsYXNzTmFtZS5pbmRleE9mKCdwcmlzbS10b2dnbGVhYmxlLWNvZGUnKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyLmNvZGVXcmFwcGVyID0gY2hpbGQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlci5jb2RlID0gPEhUTUxFbGVtZW50PihjaGlsZC5maXJzdEVsZW1lbnRDaGlsZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2RpcmVjdGl2ZXMvdG9nZ2xlYWJsZS1jb2RlLmRpcmVjdGl2ZS50c1xuICoqLyIsInZhciBwYXRoID0gJ2RpcmVjdGl2ZXMvdG9nZ2xlYWJsZS1jb2RlLmRpcmVjdGl2ZS5odG1sJztcbnZhciBodG1sID0gXCI8ZGl2IGNsYXNzPVxcXCJ0b2dnbGUtc2hvd1xcXCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcInNob3ctY29kZVxcXCIgZGlyPVxcXCJsdHJcXFwiPlxcclxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwiaWFzLWJ1dHRvbiBpYXMtaWNvbi1idXR0b25cXFwiIG5nLWNsaWNrPVxcXCIkY3RybC50b2dnbGVDb2RlKClcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgdGl0bGU9XFxcIlRvZ2dsZSBDb2RlXFxcIj5cXHJcXG4gICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XFxcIjAgMCAyNCAyNFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxwYXRoIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgZD1cXFwiTTE0LjYsMTYuNkwxOS4yLDEyTDE0LjYsNy40TDE2LDZMMjIsMTJMMTYsMThMMTQuNiwxNi42TTkuNCwxNi42TDQuOCwxMkw5LjQsNy40TDgsNkwyLDEyTDgsMThMOS40LDE2LjZaXFxcIj48L3BhdGg+XFxyXFxuICAgICAgICAgICAgPC9zdmc+XFxyXFxuICAgICAgICA8L2J1dHRvbj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuPC9kaXY+XFxyXFxuPGRpdiBjbGFzcz1cXFwicHJpc20tdG9nZ2xlYWJsZS1jb2RlXFxcIiBuZy1jbGFzcz1cXFwieydwcmlzbS12aXNpYmxlJzogJGN0cmwudmlzaWJsZX1cXFwiPlxcclxcbiAgICA8ZGl2IG5nLXRyYW5zY2x1ZGU+PC9kaXY+XFxyXFxuPC9kaXY+XFxyXFxuXCI7XG53aW5kb3cuYW5ndWxhci5tb2R1bGUoJ25nJykucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbihjKSB7IGMucHV0KHBhdGgsIGh0bWwpIH1dKTtcbm1vZHVsZS5leHBvcnRzID0gcGF0aDtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2RpcmVjdGl2ZXMvdG9nZ2xlYWJsZS1jb2RlLmRpcmVjdGl2ZS5odG1sXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qXHJcbiAqIER5bmFtaWNhbGx5IGluc2VydHMgYSBjb2RlIGJsb2NrIGNvbnRhaW5pbmcgdGhlIGNvZGUgdGhhdCBjcmVhdGVkIHRoaXMgZWxlbWVudFxyXG4gKiBJbmNsdWRlcyBhIFNob3cvSGlkZSBDb2RlIGJ1dHRvblxyXG4gKi9cclxuXHJcbmltcG9ydCB7ZWxlbWVudCwgSUF0dHJpYnV0ZXMsIElBdWdtZW50ZWRKUXVlcnl9IGZyb20gJ2FuZ3VsYXInO1xyXG5pbXBvcnQge0lSZXBlYXRBc0NvZGVTZXJ2aWNlfSBmcm9tICcuLi9zZXJ2aWNlcy9yZXBlYXQtYXMtY29kZS5zZXJ2aWNlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFsnUmVwZWF0QXNDb2RlU2VydmljZScsIFRvZ2dsZVJlcGVhdERpcmVjdGl2ZV07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVG9nZ2xlUmVwZWF0RGlyZWN0aXZlKFJlcGVhdEFzQ29kZVNlcnZpY2U6IElSZXBlYXRBc0NvZGVTZXJ2aWNlKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHByaW9yaXR5OiAxMDAwLFxyXG4gICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgY29tcGlsZTogKHRFbGVtZW50OiBJQXVnbWVudGVkSlF1ZXJ5LCBhdHRyOiBJQXR0cmlidXRlcykgPT4ge1xyXG4gICAgICAgICAgICB0RWxlbWVudC5yZW1vdmVBdHRyKCd0b2dnbGUtcmVwZWF0LWNvZGUnKTtcclxuICAgICAgICAgICAgbGV0IGNvZGUgPSBSZXBlYXRBc0NvZGVTZXJ2aWNlKHRFbGVtZW50LCBhdHRyLnRvZ2dsZVJlcGVhdENvZGUpO1xyXG4gICAgICAgICAgICBsZXQgdG9nZ2xlYWJsZUNvZGUgPSBlbGVtZW50KGA8dG9nZ2xlYWJsZS1jb2RlPjwvdG9nZ2xlYWJsZS1jb2RlPmApLmFwcGVuZChjb2RlKTtcclxuICAgICAgICAgICAgdEVsZW1lbnQuYWZ0ZXIodG9nZ2xlYWJsZUNvZGUpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvZGlyZWN0aXZlcy90b2dnbGUtcmVwZWF0LWNvZGUuZGlyZWN0aXZlLnRzXG4gKiovIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTs7Ozs7OztBQ2hCQTs7Ozs7Ozs7QUNJQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQzl3QkE7QUFBQTtBQWNBO0FBYkE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUFBOzs7Ozs7Ozs7O0FDbkJBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ25CQTtBQUVBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ3JCQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQQTtBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQQTs7Ozs7OztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUN2S0E7QUFTQTtBQUtBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQTNCQTtBQTZCQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF2QkE7Ozs7Ozs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDRUE7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVhBOzs7OyIsInNvdXJjZVJvb3QiOiIifQ==