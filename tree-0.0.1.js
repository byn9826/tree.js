var version = '0.0.1';

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
      this.states[state].stateMap = stateMap;
      this.states[state]._root = this._self;
      this.states[state]._name = state;
    }
  }
  Object.preventExtensions(this.states);
}

function stateMap(param, method) {
  console.log(method.toString());
  console.log(method.toString().match(/(?<=\${)(.*?)(?=})/g));
  var results = Array.prototype.map.call(this, method);
  this._marker = this._root._domMarker++;
  results = results.map(function(result, index) {
    var element = jQuery(jQuery.parseHTML(result));
    element.addClass('_tree' + this._marker);
    return element;
  }.bind(this));
  this._root._domGenerator.set(this._marker, method);
  this._root._domStorage[param] = results;
  _push(this._root._domWatcher, this._name, this._marker);
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
}

function _push(root, param, value) {
  if (root[param]) {
    root[param].push(value);
  } else {
    root[param] = [value];
  }
}



// Tree.prototype.mapState = function(name, single, index, template) {
//   console.log(template.match(/(?<={{)(.*?)(?=}})/g));
//   return this.states[name].map(function(a, b) {
//     var reg1 = new RegExp(single, 'g');
//     var reg2 = new RegExp(index, 'g');
//     var replaced = template.replace(/{{/g, '${').replace(/}}/g, '}').replace(reg1, 'a').replace(reg2, 'b');
//     return eval('`' + replaced + '`');
//   }).join("");
// }



// Tree.prototype.initMethod = function(data) {
//   this.method = {};
//   this.method = data;
// }

// Tree.prototype.singleDom = function(element) {
//   this._watcher["input"][this._id] = element;
//   this._watcher["input"].set(this._id, element)
//   element = element.replace('{{state.input}}', this.state.input);
//   var dom = jQuery(jQuery.parseHTML(element))[0];
//   jQuery(dom).addClass('_tree' + this._id++);
//   return dom;
// }

// Tree.prototype.changeState = function(state) {
//   this.state.input = 234;
//   for (var item of this._watcher.input.entries()) {
//     item[1] = item[1].replace('{{state.input}}', 234);
//     jQuery('._tree' + item[0]).replaceWith(item[1]);
//   }
  
// }