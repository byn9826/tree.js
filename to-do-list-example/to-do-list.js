new Tree('tree', '#root');

tree.initState({
  title: 'Study List',
	lists: data,
	showFullList: true
});

tree.singleBuilder(function() {
  return `
    <div class="alert alert-dark col-md-4" role="alert">
      ${tree.states.title}
    </div>
  `
}, 'title')

tree.states.lists.mapBuilder(function(list, index) {
  if (tree.states.showFullList) {
    return `
      <li class="list-group-item" style="color: ${list.status === '0' ? 'red' : 'green'}">
        No. ${index + 1}: ${list.content} 
      </li>
    `;
  }
}, 'all');

tree.states.lists.forEachBuilder(function (list, index) {
  if (list.status === '0') {
    this.doing.push(`<li class="list-group-item list-group-item-warning">${list.content}</li>`);
  } else {
    this.done.push(`<li class="list-group-item list-group-item-success">${list.content}</li>`);
  }
}, 'doing', 'done');


tree.render(`
  <section class="row" style="margin-bottom: 50px;">
    ${tree.dom.title}
    <div class="col-md-4">
      <div class="input-group">
        <input id="taskName" type="text" class="form-control" placeholder="Add new task">
        <span id="createTask" class="input-group-btn">
          <button class="btn btn-secondary" type="button">Create</button>
        </span>
      </div>
    </div>
  </section>
  <section class="row">
    <ul class="list-group col-md-4">
      <li class="list-group-item active">
        All Tasks
        <button id="toggle-button" class="btn btn-light" type="button" style="margin-left: 30px">
          Toggle
        </button>
      </li>
      ${tree.dom.all}
    </ul>
    <ul class="list-group col-md-4">
      <li class="list-group-item active">Doing</li>
      ${tree.dom.doing}
    </ul>
    <ul class="list-group col-md-4">
      <li class="list-group-item active">Done</li>
      ${tree.dom.done}
    </ul>
  </section>
`);

$('#toggle-button').click(function() {
  tree.setNormalState({showFullList: !tree.states.showFullList});
});

$('#createTask').click(function() {
  var content = {
    content: $('#taskName').val(),
		status: "0"
  }
  tree.setArrayState('lists', false, 0, content);
  $('#taskName').val('');
});

