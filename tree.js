var _tree_version = '0.0.1';

var Tree = function(app) {
  window[app] = this;
  this._self = this;
  this._domMarker = 0;
  this._domWatcher = {};
  this._domGenerator = new Map();
  this._domStorage = {}
}

Tree.prototype.dom = function(selector, context) {
  return new jQuery.fn.init(selector, context);
}

Tree.prototype.initState = function(data) {
  this.states = {};
  for (state in data) {
    this.states[state] = data[state];
    if (this.states[state].constructor === Array) {
      this.states[state].loopBuilder = loopBuilder;
      this.states[state]._root = this._self;
      this.states[state]._name = state;
    }
  }
  Object.preventExtensions(this.states);
}

function loopBuilder(method, param) {
  this._marker = this._root._domMarker++;
  var results = _loopBuilderResult(this, method, this._marker);
  this._root._domGenerator.set(this._marker, method);
  this._root._domStorage[param] = results;
  _push(this._root._domWatcher, this._name, this._marker);
  var statesIncluded = method.toString().match(_regStates);
  statesIncluded.forEach(function(state) {
    _push(this._root._domWatcher, state, this._marker);
  }.bind(this));
}

Tree.prototype.setArrayState = function(state, pin, replace, value) {
  if (pin === false) {
    pin = this.states[state].length;
  }
  this.states[state].splice(pin, replace, value);
  this._domWatcher[state].forEach(function(code) {
    var newDoms = _loopBuilderResult(this.states[state], this._domGenerator.get(code), code);
    var holder = jQuery('._tree' + code);
    holder.eq(holder.length - 1).after(newDoms);
    holder.replaceWith();
  }.bind(this));
}

Tree.prototype.render = function(root, elements) {
  elements = elements.split(/{{(.*)}}/g);
  elements.forEach(function(element) {
    element = element.trim();
    if (element !== '') {
      if (element[0] === '<') {
        jQuery(root).append(element);
      } else {
        jQuery(root).append(this._domStorage[element]);
      }
    }
  }.bind(this))
  this._domStorage = null;
}

function _loopBuilderResult(data, method, marker) {
  var results = Array.prototype.map.call(data, method);
  return results.map(function(result, index) {
    var element = jQuery(jQuery.parseHTML(result.trim()));
    element.addClass('_tree' + marker);
    return element;
  }.bind(this));
}

function _push(root, param, value) {
  if (root[param]) {
    root[param].push(value);
  } else {
    root[param] = [value];
  }
}

var _regStates = /(?<=\.states\.)(.*?)(?=\s|\)|\}|\?|\=|\+|\-|\*|\/|\%)/g;