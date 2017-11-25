#tree.js
A light data driven jQuery library just for fun  

App Init APIs
--
1. Create New Tree Instance    
<b>new Tree(appName, rootDom)</b>   
appName is the name you want to use to call Tree APIs, this will be the appName for all other APIs    
rootDom is the dom elment you want to render app you created  
```
<div id="root"></div>
<script>
  new Tree('app', '#root');  
</script>
```
   
2. Init States
<b>appName.initState(object)</b>   
object is any object you created to store states  
states could be called by ${appName.states.param} in your Dom builder template    
```
app.initState({
  name: 'tree.js',
	base: 'jQuery',
	type: 'data driven',
	builderAPIs: ['singleBuilder', 'mapBuilder', 'forEachBuilder']
});
```
  
States binding dom element builder APIs  
--
1. Create a single Element
<b>appName.singleBuilder(function, domName)</b>  
function should return a dom element based on template and states params   
domName is the params you want to use to store this dom element    
The created dom could be called by ${appName.dom.param}     
```
appName.singleBuilder(function() {return `
  <div>${tree.states.name}, a light ${tree.states.type} ${tree.states.base} lib</div>
`}, 'desc');
```
  
2. Create Element Use Map-Like Loop   
<b>appName.states.param.mapBuilder(function, domName)</b>  
function should return a dom element based on template and states params   
domName is the params you want to use to store this dom element    
The created dom could be called by ${appName.dom.param}   
```
appName.states.builderAPIs.mapBuilder(function(api, index) {return `
  <li>${index + 1} states binding dom Api: ${api} from {appName.states.title}</li>
`;}}, 'APIs');
``` 
  
3. Create Elements Use forEach-Like Loop  
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
1. Render  
<b>appName.render(template)</b>   
template contains your html template for this App  
```
appName.render(`
  <header>Description: ${appName.dom.desc}</header>
  <div>
    Dom Builder APIs:
    <ul>${appName.dom.APIs}<ul>
    <button onclick="changeName()">Change Name</button>
  </div>
`);
```

2. Update States  
<b>appName.updateStates({param1: value, ...})</b>  
Put state and new value pair inside  
```
appName.updateStates({name: 'Just_For_Fun.js'});
```
  
Just For Fun  
--
![For fun](src="https://raw.githubusercontent.com/byn9826/tree.js/raw/master/example/fun.jpg")