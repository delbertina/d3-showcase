import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import './Tab2.css';
import * as d3 from 'd3';

const Tab2: React.FC = () => {
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

  const color = d3.interpolateRgbBasis(["lime", "forest"]);  

  useIonViewDidLeave(() => {
    d3.select("#chart-tab2").selectAll("*").remove();
  })

  useIonViewDidEnter(() => {
    const svg = d3.select("#chart-tab2")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container", true) 
    .append("svg")
    // Responsive SVG needs these 2 attributes and no width and height attr.
    // .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 500 500")
    // Class to make it responsive.
    .classed("svg-content-responsive", true)
    .on("click", reset);

    const g = svg.append("g");

    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", zoomed);
    
    svg.call(zoom);

    var mouseover = function() {
      tooltip
        .transition()
        .duration(500)
        .style("opacity", 1);
      tooltip
        .html("<h6>Annotations</h6><p>- annotation 1<br>- annotation 2<br>- annotation 3</p><button>Add Annotation</button>")
        .style("top", (window.innerHeight/2)-80+"px")
        .style("left",(window.innerWidth/2)+100+"px");
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1);
    }

    var mouseleave = function() {
      tooltip
        .transition()
        .duration(500)
        .style("opacity", 0);
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8);
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
      .on("click", clicked);

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
      mouseleave();
      circles.transition().style("stroke", null);
      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform((svg?.node() ?? {}) as Element).invert([width / 2, height / 2])
      );
    }
  
    function clicked(event: any, d: any) {
      const [[x0, y0], [x1, y1]] = [[d[0], d[1]], [d[0], d[1]]];
      event.stopPropagation();
      circles.transition().style("stroke", null);
      d3.select(this).transition().style("stroke", "white");
      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        d3.pointer(event, svg.node())
      ).on('end',() => mouseover());
    }
  
    function zoomed(event: any) {
      const {transform} = event;
      g.attr("transform", transform);
      g.attr("stroke-width", 1 / transform.k);
    }
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
        <div id="chart-tab2"></div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
