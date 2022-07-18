import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import './Tab2.css';
import * as d3 from 'd3';

const Tab2: React.FC = () => {
  const width = 500;
  const height = 500;
  const theta = 2.399963229728653;
  const step = 12;
  const radius = 6;
  // let view: any;

  const data = Array.from({length: 200}, (_, i) => {
    const r = step * Math.sqrt(i += 0.5), a = theta * i;
    return [
      width / 2 + r * Math.cos(a),
      height / 2 + r * Math.sin(a)
    ];
  })

  const color = d3.interpolateRgbBasis(["lime", "forest"]);  

  useIonViewDidEnter(() => {
    const svg = d3.select("#chart")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container", true) 
    .append("svg")
    // Responsive SVG needs these 2 attributes and no width and height attr.
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 600 400")
    // Class to make it responsive.
    .classed("svg-content-responsive", true)
    // Fill with a rectangle for visualization.
    // .append("rect")
    // .classed("rect", true)
    // .attr("width", 600)
    // .attr("height", 400)
    // .append("svg:svg")
    // .attr("viewBox", [0, 0, width, height])
    .on("click", reset);

    const g = svg.append("g");

    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", zoomed);
    
    svg.call(zoom);

    var mouseover = function(d) {
      tooltip
        .transition()
        .duration(500)
        .style("opacity", 1);
      tooltip
        .html("<h6>Annotations</h6><p>- annotation 1<br>- annotation 2<br>- annotation 3</p><button>Add Annotation</button>")
        // .html("The exact value of<br>this cell is: " + 0)
        .style("top", (height/2)+"px")
        .style("left",(width/2)+"px")
        // .style("top", (d.pageY)+"px")
        // .style("left",(d.pageX)+"px")
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    // var mousemove = function(event, d) {
    //   tooltip
    //     .html("The exact value of<br>this cell is: " + 0)
    //     // .style("top", (100)+"px")
    //     // .style("left",(100)+"px")
    //     .style("top", (event.pageY)+"px")
    //     .style("left",(event.pageX)+"px")
    //     // .style("top", d3.select(this).attr("cy") + "px")
    //     // .style("left", d3.select(this).attr("cx") + "px")
    //     // .style("left", (d3.pointer(d)[0]+70) + "px")
    //     // .style("top", (d3.pointer(d)[1]) + "px")
    // }
    var mouseleave = function() {
      tooltip
        .transition()
        .duration(500)
        .style("opacity", 0)
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
    }

    const circles = g.append("g")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", ([x]) => x)
      .attr("cy", ([,y]) => y)
      .attr("r", radius)
      .attr("fill", (d, i) => color(i / 250))
      .attr("cursor", "pointer")
      .on("click", clicked)
      // .on("mouseover", mouseover)
      // .on("mousemove", mousemove)
      // .on("mouseleave", mouseleave);

    const tooltip = d3.select("#chart")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("color", "black")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");    

    function reset() {
      console.log('reset');
      mouseleave();
      circles.transition().style("stroke", null);
      svg.transition().duration(750).call(
        /* @ts-ignore */
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform((svg?.node() ?? {}) as Element).invert([width / 2, height / 2])
      );
    }
  
    function clicked(event: any, d: any) {
      console.log('clicked', event, d);
      const [[x0, y0], [x1, y1]] = [[d[0], d[1]], [d[0], d[1]]];
      event.stopPropagation();
      circles.transition().style("stroke", null);
      d3.select(this).transition().style("stroke", "white");
      svg.transition().duration(750).call(
        /* @ts-ignore */
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        d3.pointer(event, svg.node())
      ).on('end',() => {console.log('After Click', event, svg.node()); mouseover(event);});
    }
  
    function zoomed(event: any) {
      const {transform} = event;
      g.attr("transform", transform);
      g.attr("stroke-width", 1 / transform.k);
    }

    // zoomTo([root.x, root.y, root.r * 2]);

    // function zoomTo(v: any) {
    //   console.log('Zoom to', v, data);
    //   const k = width / v[2];
  
    //   view = v;
  
    //   // label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    //   g.attr("transform", (d: any) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    //   g.attr("r", (d: any) => d.r * k);
    // }
  
    // function zoom(event: any) {  
    //   console.log('Zoom', event);
    //   // focus = d;
  
    //   const transition = svg.transition()
    //       .duration(event.altKey ? 7500 : 750)
    //       .tween("zoom", d => {
    //         const i = d3.interpolateZoom(view, [event.x, event.y, 2]);
    //         return t => zoomTo(i(t));
    //       });
    // }
  
      // label
        // .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        // .transition(transition)
        //   .style("fill-opacity", d => d.parent === focus ? 1 : 0)
          // .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
          // .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
      // }

    // function transition() {
    //   const d = data[Math.floor(Math.random() * data.length)];
    //   const i = d3.interpolateZoom(currentTransform, [...d, radius * 2 + 1] as ZoomView);
  
    //   g.transition()
    //       .delay(2500)
    //       .duration(i.duration)
    //       .attrTween("transform", () => t => transform(currentTransform = i(t)))
    //       .on("end", transition);
    // }
  
    // function transform([x, y, r]: ZoomView) {
    //   return `
    //     translate(${width / 2}, ${height / 2})
    //     scale(${height / r})
    //     translate(${-x}, ${-y})
    //   `;
    // }
    // g.call(transition).node();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div id="chart"></div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
