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
        <span class="col-md-10">No. ${index + 1}: ${list.content}</span>
        <span onclick="deleteTask(${index})" class="col-md-2" style="cursor: pointer">&#10007;</span>
      </li>
    `;
  }
}, 'all');

tree.states.lists.forEachBuilder(function (list, index) {
  if (list.status === '0') {
    tree.dom.doing.push(`
      <li class="list-group-item list-group-item-warning">
        <span class="col-md-10">${list.content}</span>
        <span class="col-md-2" style="cursor: pointer" onclick="changeStatus(${index}, '1')">&#9872;</span>
      </li>
    `);
  } else {
    tree.dom.done.push(`
      <li class="list-group-item list-group-item-success">
        <span class="col-md-10">${list.content}</span>
        <span class="col-md-2" style="cursor: pointer" onclick="changeStatus(${index}, '0')">&#9735;</span>
      </li>
    `);
  }
}, 'doing', 'done');

tree.render(`
  <section class="row" style="margin-bottom: 40px;">
    ${tree.dom.title}
    <div class="col-md-4">
      <input onkeyup="editTitle()" type="text" class="form-control" placeholder="List Name" value="${tree.states.title}" />
    </div>
    <div class="col-md-4">
      <div class="input-group">
        <input id="task-name" type="text" class="form-control" placeholder="Add new task">
        <span onclick="createNew()" class="input-group-btn">
          <button class="btn btn-secondary" type="button">Create</button>
        </span>
      </div>
    </div>
  </section>
  <section class="row">
    <ul class="list-group col-md-4">
      <li class="list-group-item active">
        All Tasks
        <button onclick="toggleList()" class="btn btn-light" type="button" style="margin-left: 30px">
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

function editTitle() {
  tree.updateStates({title: event.target.value.trim()});
}

function toggleList() {
  tree.updateStates({showList: !tree.states.showList});
}

function createNew() {
  var data = $('#task-name').val().trim();
  if (data === '') {return;}
  tree.states.lists.push({
    content: data,
		status: "0"
  });
  tree.updateStates({lists: tree.states.lists});
  $('#task-name').val('');
}

function deleteTask(index) {
  tree.states.lists.splice(index, 1);
  tree.updateStates({lists: tree.states.lists});
}

function changeStatus(index, value) {
  tree.states.lists[index].status = value;
  tree.updateStates({lists: tree.states.lists});
}