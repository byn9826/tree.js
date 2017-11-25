new Tree('tree', '#root');

tree.initState({
  title: 'Study List',
	lists: data,
	showList: true
});

tree.singleBuilder(function() {
  return `
    <div class="alert alert-dark col-md-4" role="alert">
      ${tree.states.title}
    </div>
  `
}, 'title');

tree.states.lists.mapBuilder(function(list, index) {
  if (tree.states.showList) {
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
      <input id="task-editor" type="text" class="form-control" placeholder="List Name" value="${tree.states.title}" />
    </div>
    <div class="col-md-4">
      <div class="input-group">
        <input id="task-name" type="text" class="form-control" placeholder="Add new task">
        <span id="task-creator" class="input-group-btn">
          <button class="btn btn-secondary" type="button">Create</button>
        </span>
      </div>
    </div>
  </section>
  <section class="row">
    <ul class="list-group col-md-4">
      <li class="list-group-item active">
        All Tasks
        <button id="list-toggle" class="btn btn-light" type="button" style="margin-left: 30px">
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

$('#task-editor').keyup(function() {
  tree.setNormalState({title: event.target.value});
});

$('#list-toggle').click(function() {
  tree.setNormalState({showList: !tree.states.showList});
});

$('#task-creator').click(function() {
  var data = $('#task-name').val().trim();
  if (data === '') {
    return;
  }
  var content = {
    content: data,
		status: "0"
  }
  tree.setArrayState('lists', false, 0, content);
  $('#task-name').val('');
});