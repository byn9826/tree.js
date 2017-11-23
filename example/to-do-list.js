new Tree('app');

app.initState({
	lists: data
});

var all = app.mapState('lists', function(list, index) {
  return `<div>No. ${index + 1}: ${list.content}</div>`;
});



var elements = `
  <header>To do list</header>
  ${all}
`;
app.render('#root', elements);

// app.states.lists.forEach(function(list) {
//   if (list.status === '0') {
    
//   }
// });

// var container = app.singleDom(`<div>{{state.input}}</div>`);
// var input = app.singleDom(`<input type="button" value="click" />`);
// input.onclick = function() {
// 	app.changeState({input: 234});
// }
//var elements = [container, input];
//app.render('#root', elements);