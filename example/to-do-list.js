new Tree('tree');

tree.initState({
	lists: data,
	tag: 'No.'
});

tree.states.lists.stateMap('all', function(list, index) {
  return `<div>${tree.states.tag} ${index + 1}: ${list.content}</div>`;
});

var elements = `
  <header>To do list</header>
  <div>
    {{all}}
  </div>
`;

tree.render('#root', elements);



// var container = app.singleDom(`<div>{{state.input}}</div>`);
// var input = app.singleDom(`<input type="button" value="click" />`);
// input.onclick = function() {
// 	app.changeState({input: 234});
// }
//var elements = [container, input];
//app.render('#root', elements);