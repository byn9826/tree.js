var _tree_version = '0.0.1';

var Tree = function(app, root) {
  window[app] = this;
  
  this._root = root;
  this._self = this;
  
  this.dom = {};
  this._domMarker = 0;
  this._domWatcher = {};
  this._domGenerator = new Map();
  
  this._push = function (root, param, value) {
    root[param] ? root[param].push(value) : root[param] = [value];
  }
  
  this._detector = function(method, marker) {
    var _regStates = /(?<=\.states\.)(.*?)(?=\s|\)|\}|\?|\=|\+|\-|\*|\/|\%)/g;
    var statesIncluded = method.toString().match(_regStates);
    if (statesIncluded === null) {return;}
    statesIncluded.forEach(function(state) {
      this._push(this._domWatcher, state, marker);
    }.bind(this));
  }
  
  this._mapBuilder = function (method, param) {
    var _marker = this._root._domMarker++;
    var results = this._root._mapBuilderResult(this, method, _marker);
    this._root._domGenerator.set(_marker, [this._name, 'map', method]);
    this._root.dom[param] = jQuery(this._root._root).append(results).html();
    jQuery(this._root._root).empty();
    this._root._push(this._root._domWatcher, this._name, _marker);
    this._root._detector(method, _marker);
  }
  
  this._mapBuilderResult = function (data, method, marker) {
    var results = Array.prototype.map.call(data, method);
    results = results.filter(function(result) {
      return result !== undefined;
    });
    return results.map(function(result, index) {
      var element = jQuery(jQuery.parseHTML(result.trim()));
      element.addClass('_tree' + marker);
      return element;
    }.bind(this));
  }
  
  this._forEachBuilder = function (method, ...params) {
    this._root._domHolderCreator(this, params, method);
    var markers = []
    params.forEach(function(param) {
      var _marker = this._root._domMarker++;
      markers.push(_marker);
      this._root.dom[param] = this._root.dom[param].map(function(element) {
        var el = jQuery(jQuery.parseHTML(element.trim()));
        el.addClass('_tree' + _marker);
        return el;
      })
      this._root.dom[param] = jQuery(this._root._root).append(this._root.dom[param]).html();
      jQuery(this._root._root).empty();
    }.bind(this));
    this._root._push(this._root._domWatcher, this._name, markers);
    this._root._detector(method, markers);
    this._root._domGenerator.set(markers, [this._name, 'forEach', method, params]);
  }

  this._domHolderCreator = function(data, params, method) {
    params.forEach(function(param) {
      this.dom[param] = [];
    }.bind(this));
    data.forEach(method.bind(this.dom));
  }
  
  this._domReplacer = function(code, newDom) {
    var holder = jQuery('._tree' + code);
    holder.eq(holder.length - 1).after(newDom);
    if (newDom.length === 0) {
      holder.replaceWith('<emptyTree class="_tree' + code + '"></emptyTree>');
    } else {
      holder.replaceWith();
    }
  }
  this._watchWorker = function(state) {
    this._domWatcher[state].forEach(function(code) {
      var memory = this._domGenerator.get(code);
      if (memory[1] === 'map') {
        var newDom = this._mapBuilderResult(this.states[memory[0]], memory[2], code);
        this._domReplacer(code, newDom);
      } else if (memory[1] === 'forEach') {
        this._domHolderCreator(this.states[memory[0]], memory[3], memory[2]);
        memory[3].forEach(function(param, index) {
          this.dom[param] = this.dom[param].map(function(element) {
            var el = jQuery(jQuery.parseHTML(element.trim()));
            el.addClass('_tree' + code[index]);
            return el;
          })
          this._domReplacer(code[index], this.dom[param]);
        }.bind(this));
        this.dom = {};
      }
    }.bind(this));
  }

}

Tree.prototype.initState = function(data) {
  this.states = {};
  for (state in data) {
    this.states[state] = data[state];
    if (this.states[state].constructor === Array) {
      this.states[state].mapBuilder = this._mapBuilder;
      this.states[state].forEachBuilder = this._forEachBuilder;
      this.states[state]._root = this._self;
      this.states[state]._name = state;
    }
  }
  Object.preventExtensions(this.states);
}

Tree.prototype.singleBuilder = function(method, param) {
  //var result = method.bind(this.states)();
  var result = method();
  result = jQuery(jQuery.parseHTML(result.trim()));
  var marker = this._domMarker++;
  result.addClass('_tree' + marker);
  this.dom[param] = jQuery(this._root).append(result).html();
  jQuery(this._root).empty();
  this._detector(method, marker);
  this._domGenerator.set(marker, [param, 'single', method]);
}

Tree.prototype.setNormalState = function(states) {
  for (var state in states) {
    this.states[state] = states[state];
    this._watchWorker(state);
  }
}

Tree.prototype.setArrayState = function(state, pin, replace, value) {
  if (pin === false) {
    pin = this.states[state].length;
  }
  this.states[state].splice(pin, replace, value);
  this._watchWorker(state);
}

Tree.prototype.render = function(elements) {
  jQuery(this._root).append(elements)
  this.dom = {};
}

Tree.prototype.jQuery = function(selector, context) {
  return new jQuery.fn.init(selector, context);
}