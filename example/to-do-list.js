new Tree('tree');

tree.initState({
	lists: data,
	content: {
	  tag: 'No.'
	},
	showFullList: true
});

tree.states.lists.loopBuilder(function(list, index) {
  if (tree.states.showFullList) {
    return `
      <div style="color: ${list.status === '0' ? 'red' : 'green'}">
        ${tree.states.content.tag} ${index + 1}: ${list.content} 
      </div>
    `;
  }
}, 'all');

tree.render('#root', `
  <header>All Tasks</header>
  <input id="taskName" type="text" />
  <input id="createTask" type="button" value="Create" />
  {{all}}
`);

$('#createTask').click(function() {
  var content = {
    content: $('#taskName').val(),
		status: "0"
  }
  tree.setArrayState('lists', false, 0, content);
  $('#taskName').val('');
});