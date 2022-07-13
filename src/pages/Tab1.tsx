import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import './Tab1.css';
import * as d3 from 'd3';
// import { ZoomView } from 'd3';

const Tab1: React.FC = () => {

  const width = 500;
  const height = 500;
  const theta = 2.399963229728653;
  const step = 12;
  const radius = 6;

  const data = Array.from({length: 200}, (_, i) => {
    const r = step * Math.sqrt(i += 0.5), a = theta * i;
    return [
      width / 2 + r * Math.cos(a),
      height / 2 + r * Math.sin(a)
    ];
  })

  const pack = (data: any) => d3.pack()
    .size([width, height])
    .padding(3)
  (d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0)))

  // let currentTransform = [width / 2, height / 2, height] as ZoomView;
  const root = pack(data);
  let focus = root;
  let view: any;
  // const color = d3.scaleLinear()
  //   .domain([0, 5])
  //   .range(['red', 'blue'])
  //   .interpolate(d3.interpolateRgb)
  const color = d3.interpolateRgbBasis(["lime", "forest"]);
  

  useIonViewDidEnter(() => {
    const svg = d3.select("#chart").append("svg:svg")
    .attr("viewBox", [0, 0, width, height])

    const g = svg.append("g");

    g.selectAll("circle")
      .data(data)
      .join("circle")
        .attr("cx", ([x]) => x)
        .attr("cy", ([, y]) => y)
        .attr("r", radius)
        .attr("fill", (d, i) => color(i / 250));

    const node = svg.append("g")
      .selectAll("circle")
      .data(root.descendants().slice(1))
      .join("circle")
        .attr("fill", d => d.children ? color(d.depth) : "white")
        .attr("pointer-events", d => !d.children ? "none" : null)
        .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
        .on("mouseout", function() { d3.select(this).attr("stroke", null); })
        .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));
    
    const label = svg.append("g")
        .style("font", "10px sans-serif")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
        .style("fill-opacity", d => d.parent === root ? 1 : 0)
        .style("display", d => d.parent === root ? "inline" : "none")
        .text((d: any) => d.data.name);

    zoomTo([root.x, root.y, root.r * 2]);

    function zoomTo(v: any) {
      const k = width / v[2];
  
      view = v;
  
      label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("r", d => d.r * k);
    }
  
    function zoom(event: any, d: any) {  
      focus = d;
  
      const transition = svg.transition()
          .duration(event.altKey ? 7500 : 750)
          .tween("zoom", d => {
            const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
            return t => zoomTo(i(t));
          });
  
      label
        // .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .transition(transition)
          .style("fill-opacity", d => d.parent === focus ? 1 : 0)
          // .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
          // .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
      }

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
  

  // const svg = d3.select('#chart')
  //   .append("svg:svg")
  //   .attr('width', 500)
  //   .attr('height', 500)
  //   .append("svg:g");
  //   // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  //   // .call(zoom);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div id="chart"></div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
