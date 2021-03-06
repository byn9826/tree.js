# Tree.js
A light data driven jQuery library just for fun   

Example
--
[To Do List](https://byn9826.github.io/tree.js/)   
  
Prerequisite
--
<script type="text/javascript" src="jquery-3.2.1.min.js"></script>    
<script type="text/javascript" src="tree.js"></script>  
  
Initial APP
--
1. <b>Create New Instance</b>  
<b>new Tree(appName, rootDom)</b>  
appName is the name you want to use to call Tree APIs, this will be the appName for all other APIs    
rootDom is the dom elment you want to render app you created  
```
<div id="root"></div>
<script>
  new Tree('appName', '#root');  
</script>
```
   
2. <b>Init States</b>  
<b>appName.initState(object)</b>  
object is any object you created to store states  
states could be called by ${appName.states.param} in your Dom builder template    
```
appName.initState({
  name: 'tree.js',
  base: 'jQuery',
  type: 'data driven',
  builderAPIs: ['singleBuilder', 'mapBuilder', 'forEachBuilder'],
  time: new Date()
});
```
  
Data Binding Dom Builder 
--
1. <b>Create a single Element</b>   
<b>appName.singleBuilder(function, domName)</b>   
function should return a dom element based on template and states params   
domName is the params you want to use to store this dom element    
The created dom could be called by ${appName.dom.param}     
```
appName.singleBuilder(function() {return `
  <div>${tree.states.name}, a light ${tree.states.type} ${tree.states.base} lib</div>
`}, 'desc');
```
  
2. <b>Create Element Use Map-Like Loop</b>   
<b>appName.states.param.mapBuilder(function, domName)</b>   
function should return a dom element based on template and states params   
domName is the params you want to use to store this dom element    
The created dom could be called by ${appName.dom.param}   
```
appName.states.builderAPIs.mapBuilder(function(api, index) {return `
  <li>${index + 1} states binding dom Api: ${api} from {appName.states.title}</li>
`;}}, 'APIs');
``` 
  
3. <b>Create Elements Use forEach-Like Loop</b>   
<b>appName.states.param.forEachBuilder(function, domName1, domName2 ...)</b>   
function should return a dom element based on template and states params  
domName is the params you want to use to store this dom element    
You could use any numbers of domNames in this function  
The created dom could be called by ${appName.dom.param}  
```
appName.states.builderAPIs.forEachBuilder(function (api, index) {
  if (index % 2 === 1) {
    tree.dom.oddAPIs.push(`<li>odd APIs: ${api}</li>`);
  } else {
    tree.dom.evenAPIs.push(`<li>even APIs: ${api}</li>`);
  }
}, 'oddAPIs', 'evenAPIs');
``` 
  
Render & Update
--
1. <b>Render Root</b>  
<b>appName.initRouter(template, base)</b>  
<b>appName.render()</b>    
template contains your html template for this App  
if base is not defined, the root address will be '/'  
if base defined, the root address will be '/base/'  
```
var indexPage = `
  <header>Description: ${appName.dom.desc}</header>
  <div>
    Dom Builder APIs:
    <ul>${appName.dom.APIs}<ul>
    <button onclick="changeName()">Change Name</button>
  </div>
`
appName.initRouter(indexPage);  
appName.render();
```
  
2. <b>Update States</b>   
<b>appName.updateStates({param1: value, ...})</b>   
Put state and new value pair inside  
```
appName.updateStates({name: 'Just_For_Fun.js'});
```
  
Lifecycle
--
<b>beforeRender, afterRender, beforeUpdate, afterUpdate</b>   
<b>appName.beforeRender(function)</b>  
<b>appName.afterRender(function)</b>  
<b>appName.beforeUpdate(function)</b>  
<b>appName.afterUpdate(function)</b>  
```
tree.afterRender(function() {
  console.log('Everything rendered');
});
```

Router
--
1. Register Router  
<b>appName.addRouter(template, address)</b>   
template is the dom element will be rendered for the assigned address  
```
var aboutPage = `<h5>about page</h5>`;
appName.addRouter(aboutPage, '/about');
var timePage = `<h5>${appName.states.time}</h5>`;
appName.addRouter(timePage, '/time');
```
2. redirect to a route  
<b>appName.reDirect(data, address);</b>   
Data should be an object or null,   
If data is an object, it will be used to update the state while redirect to the address   
If data is null, it means no states will be updated   
if address is '/' or not registered by addRouter function, will redirect to root page   
```
<div onclick="goToHome()">Home</div>
<div onclick="goToAbout()">About</div>
<div onclick="goToTime()">Time</div>

<script>
function goToHome() {
  appName.reDirect(null, '/');
}
function goToAbout() {
  appName.reDirect(null, '/about');
}
function goToTime() {
  appName.reDirect({time: new Date()}, '/time');
}
</script>

```
   
Just For Fun  
--
![For fun](https://github.com/byn9826/tree.js/blob/master/to-do-list-example/fun.jpg)