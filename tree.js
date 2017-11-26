/*global $*/
var Tree = function(app, root) {
  this._version = '0.0.1';
  window[app] = this;
  
  this._root = root;
  this._self = this;
  
  this.dom = {};
  this._domMarker = 0;
  this._domWatcher = {};
  this._domGenerator = new Map();
  
  this._waitQueue = new Set();
  this._taskQueue = null;
  
  this._lifeCycle = 'init',
  this._beforeRender = null;
  
  this._push = function (root, param, value) {
    root[param] ? root[param].push(value) : root[param] = [value];
  };
  
  this._detector = function(method, marker) {
    var _regStates = /(?<=\.states\.)(.*?)(?=\s|\)|\}|\?|\=|\+|\-|\*|\/|\%)/g;
    var statesIncluded = method.toString().match(_regStates);
    if (statesIncluded === null) {return;}
    statesIncluded.forEach(function(state) {
      this._push(this._domWatcher, state, marker);
    }.bind(this));
  };
  
  this._singleBuilder = function(method, marker) {
    var result = method();
    if (result !== undefined) {
      result = $($.parseHTML(result.trim()));
      result.addClass('_tree' + marker);
    }
    return result;
  };
  
  this._mapBuilder = function (method, param) {
    var _marker = this._root._domMarker++;
    var results = this._root._mapBuilderResult(this, method, _marker);
    this._root._domGenerator.set(_marker, [this._name, 'map', method]);
    this._root._domIniter(param, results);
    this._root._push(this._root._domWatcher, this._name, _marker);
    this._root._detector(method, _marker);
  };
  
  this._mapBuilderResult = function (data, method, marker) {
    var results = Array.prototype.map.call(data, method);
    results = results.filter(function(result) {
      return result !== undefined;
    });
    return results.map(function(result, index) {
      var element = $($.parseHTML(result.trim()));
      element.addClass('_tree' + marker);
      return element;
    }.bind(this));
  };
  
  this._forEachBuilder = function (method, ...params) {
    this._root._domHolderCreator(this, params, method);
    var markers = [];
    params.forEach(function(param) {
      var _marker = this._root._domMarker++;
      markers.push(_marker);
      this._root.dom[param] = this._root.dom[param].map(function(element) {
        var el = $($.parseHTML(element.trim()));
        el.addClass('_tree' + _marker);
        return el;
      });
      this._root._domIniter(param, this._root.dom[param]);
    }.bind(this));
    this._root._push(this._root._domWatcher, this._name, markers);
    this._root._detector(method, markers);
    this._root._domGenerator.set(markers, [this._name, 'forEach', method, params]);
  };

  this._domHolderCreator = function(data, params, method) {
    params.forEach(function(param) {
      this.dom[param] = [];
    }.bind(this));
    data.forEach(method);
  };
  
  this._domIniter = function(param, result) {
    this.dom[param] = $(this._root).append(result).html();
    $(this._root).empty();
  };
  
  this._domReplacer = function(code, newDom) {
    var holder = $('._tree' + code);
    holder.eq(holder.length - 1).after(newDom);
    if (newDom.length === 0 || newDom === undefined) {
      holder.replaceWith('<emptyTree class="_tree' + code + '"></emptyTree>');
    } else {
      holder.replaceWith();
    }
  };
  
  this._updateWaitQueue = function(state) {
    this._domWatcher[state].forEach(function(code) {
      this._waitQueue.add(code);
    }.bind(this));
  }
  
  this._queueWorker = function(state) {
    while(this._waitQueue.size !== 0) {
      this._workQueue = Array.from(this._waitQueue);
      this._waitQueue = new Set();
      this._workQueue.forEach(function(code) {
        var memory = this._domGenerator.get(code);
        switch(memory[1]) {
          case 'map':
            var newDom = this._mapBuilderResult(this.states[memory[0]], memory[2], code);
            this._domReplacer(code, newDom);
            break;
          case 'forEach':
            this._domHolderCreator(this.states[memory[0]], memory[3], memory[2]);
            memory[3].forEach(function(param, index) {
              this.dom[param] = this.dom[param].map(function(element) {
                var el = $($.parseHTML(element.trim()));
                el.addClass('_tree' + code[index]);
                return el;
              });
              this._domReplacer(code[index], this.dom[param]);
            }.bind(this));
            this.dom = {};
            break;
          case 'single':
            var result = this._singleBuilder(memory[2], code);
            this._domReplacer(code, result);
            break;
        }
      }.bind(this));
    }
    this._workQueue = null;
  };
};

Tree.prototype.initState = function(data) {
  this.states = {};
  for (var state in data) {
    this.states[state] = data[state];
    if (this.states[state].constructor === Array) {
      this.states[state].mapBuilder = this._mapBuilder;
      this.states[state].forEachBuilder = this._forEachBuilder;
      this.states[state]._root = this._self;
      this.states[state]._name = state;
    }
  }
  Object.preventExtensions(this.states);
};

Tree.prototype.singleBuilder = function(method, param) {
  var marker = this._domMarker++;
  var result = this._singleBuilder(method, marker);
  this._domIniter(param, result);
  this._detector(method, marker);
  this._domGenerator.set(marker, [param, 'single', method]);
};

Tree.prototype.updateStates = function(states) {
  for (var state in states) {
    this.states[state] = states[state];
    this._updateWaitQueue(state);
  }
  //Temporary solution for input replacement
  var focused = document.activeElement;
  if (focused !== undefined && focused.tagName === 'INPUT') {
    focused = $(focused).attr('class');
    focused = focused.split(' ');
    var code = focused.find(function(name) {
      return name.search(/\_tree/) !== -1;
    });
  }
  this._queueWorker();
  if (code !== undefined) {
    $('.' + code).focus();
    var last = $('.' + code).val().length;
    $('.' + code)[0].setSelectionRange(last, last);
  }
};

Tree.prototype.render = function(elements) {
  this._lifeCycle = 'beforeRender';
  if (this._beforeRender !== null) {
    this._beforeRender();
  }
  $(this._root).append(elements);
  this.dom = {};
  this._lifeCycle = 'afterRender';
  if (this._afterRender !== null) {
    this._afterRender();
  }
};

Tree.prototype.beforeRender = function(method) {
  this._beforeRender = method;
};

Tree.prototype.afterRender = function(method) {
  this._afterRender = method;
};

//API used to perform high efficiency array type state update
//
// Tree.prototype.setArrayState = function(state, pin, replace, value) {
//   if (pin === false) {
//     pin = this.states[state].length;
//   }
//   value === undefined ? this.states[state].splice(pin, replace) : this.states[state].splice(pin, replace, value);
//   this._watchWorker(state);
// };