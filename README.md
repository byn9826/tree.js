#tree.js
A light data driven jQuery library  


Example
--
1. Init  
```
new Tree('tree');
```
2. States  
```
tree.initState({
    lists: data,
    showFullList: true
});
```
3. Template   
```
tree.states.lists.loopBuilder(function(list, index) {
  if (tree.states.showFullList) {
    return `
      <div style="color: ${list.status === '0' ? 'red' : 'green'}">
        No. ${index + 1}: ${list.content} 
      </div>
    `;
  }
}, 'all');
```
4. Render  
```
tree.render('#root', `
  <header>Tasks List</header>
  <input id="taskName" type="text" />
  <input id="createTask" type="button" value="Create" />
  {{all}}
`);
```
5. Change States  
```
$('#createTask').click(function() {
  var content = {
    content: $('#taskName').val(),
	status: "0"
  }
  tree.setArrayState('lists', false, 0, content);
  $('#taskName').val('');
});
```

This library is just for fun  
--
![For fun](src="https://raw.githubusercontent.com/byn9826/tree.js/raw/master/example/fun.jpg")