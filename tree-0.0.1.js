var version = '0.0.1';

var Tree = function(app) {
  window.app = this;
  this._watcher = {};
  // this._id = 0;
}

Tree.prototype.dom = function(selector, context) {
  return new jQuery.fn.init(selector, context);
}

Tree.prototype.initState = function(data) {
  this.states = {};
  for (state in data) {
    this.states[state] = data[state];
    this._watcher[state] = new Map();
  }
  Object.preventExtensions(this.states);
  console.log(this.states);
}

Tree.prototype.mapState = function(name, method) {
  return this.states[name].map(function(single, index) {
    return method(single, index);
  }).join("");
}

Tree.prototype.render = function(root, elements) {
  jQuery(root).append(elements);
}


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