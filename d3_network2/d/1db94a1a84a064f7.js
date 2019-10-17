// https://observablehq.com/@gustavo/les-miserables@85
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Les Miserables

`
)});
  main.variable(observer("buildvis")).define("buildvis", ["d3","DOM","dataset","forceSimulation","nodeConectionsCount","drag"], function(d3,DOM,dataset,forceSimulation,nodeConectionsCount,drag)
{
  const width = 960
  const height = 800
  
  const svg = d3.select(DOM.svg(width, height))
                .attr("viewBox", [-width / 2, -height / 2, width, height])
  
  // Configure os nodes e os links
  const nodes = dataset.nodes
  const links = dataset.links
  
  
  // Crie a constante simulation usando a função forceSimulation definida em outra célula
  const simulation = forceSimulation(nodes, links).on("tick", ticked)
  
  let color = d3.scaleQuantize()
  .domain([1,36])
  .range(d3.schemeGreens[9].slice(3,9)); 
 
  
  //Crie os elementos svg para os links e guarde-os em link
  const link = svg.append("g")
                  .selectAll("line")
                  .data(links)
                  .enter()
                  .append("line")
                  .attr("class","link")
  
   //Crie os elementos svg para os nodes e guarde-os em node
   const node = svg.append("g")
                  .selectAll("circle")
                  .data(nodes)
                  .enter()
                  .append("circle")
                  .attr("class", "node")
                  .attr("fill",d => color(nodeConectionsCount(links, d)) )
                  .attr("r",  d => nodeConectionsCount(links, d) )
                   .call(drag(simulation));
  
     node.append("title").text(d =>{ 
            return d.id + "/" + nodeConectionsCount(links, d);
     })
  
  // Defina a função ticked
  function ticked(){
    link.attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
    
    node.attr("cx", d => d.x)
    node.attr("cy", d => d.y)
  }
  
  // Once we append the vis elments to it, we return the DOM element for Observable to display above.
  return svg.node()
}
);
  main.variable(observer("nodeConectionsCount")).define("nodeConectionsCount", function(){return(
function nodeConectionsCount(links, node) {
  let value = 0; 
  links.forEach(function(l){
    if(node.id == l.source.id || node.id == l.target.id)
      value ++; 
  });
  
  return  value + 2;
}
)});
  main.variable(observer("dataset")).define("dataset", ["d3"], function(d3){return(
d3.json("https://gist.githubusercontent.com/emanueles/1dc73efc65b830f111723e7b877efdd5/raw/2c7a42b5d27789d74c8708e13ed327dc52802ec6/lesmiserables.json")
)});
  main.variable(observer("drag")).define("drag", ["d3"], function(d3){return(
function drag(simulation){
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }
  function dragged(d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }
  return d3.drag()
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended)
}
)});
  main.variable(observer("forceSimulation")).define("forceSimulation", ["d3"], function(d3){return(
function forceSimulation(nodes, links) {
  return d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(100))
  .force("charge", d3.forceManyBody().strength(-50).distanceMax(570))
  .force("center", d3.forceCenter())
}
)});
  main.variable(observer()).define(["html"], function(html){return(
html`Esta célula contém os estilos da visualização.
<style>
line.link {
  fill: none;
  stroke: #ddd;
  stroke-opacity: 0.8;
  stroke-width: 1.5px;
}
<style>`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3')
)});
  return main;
}
