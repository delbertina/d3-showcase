import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import './Tab1.css';
import * as d3 from 'd3';

const Tab1: React.FC = () => {
  const chartID = "chart-tab1";

  useIonViewDidLeave(() => {
    d3.select("#" + chartID).selectAll("*").remove();
  })

  useIonViewDidEnter(() => {
    const svg = d3.select("#" + chartID)
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container", true) 
    .append("svg")
    // Responsive SVG needs these 2 attributes and no width and height attr.
    // .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 500 500")
    // Class to make it responsive.
    .classed("svg-content-responsive", true)
    
    function gridData() {
      let xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
      let ypos = 250;
      const widthSpacing = 30;
      const width = 50;
      const height = 50;
      const bluePipe = "https://i.imgur.com/M2Bl8yK.png";
      const yellowPipe = "https://i.imgur.com/J1d6i60.png";
      const orangePipe = "https://i.imgur.com/jezxggE.png";
      const redPipe = "https://i.imgur.com/sp0gL0f.png";
      var data = [];
  
      // iterate for rows 
      for (var row = 0; row < 1; row++) {
          data.push( [] );
  
          // iterate for cells/columns inside rows
          for (var column = 0; column < 16; column++) {
              data[row].push({
                  x: xpos,
                  y: ypos,
                  width: width,
                  height: height,
                  url: column % 4 === 0 ? yellowPipe : column % 5 === 0 ? orangePipe : column % 6 === 0 ? redPipe : bluePipe
              })
              // increment the x position. I.e. move it over by 50 (width variable)
              xpos += widthSpacing;
          }
          // reset the x position after a row is complete
          xpos = 1;
          // increment the y position for the next row. Move it down 50 (height variable)
          ypos += height; 
      }
      return data;
    }
    const gridItems = gridData();

    const g = svg.append("g");

    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", zoomed);
    
    svg.call(zoom);

    function zoomed(event: any) {
      const {transform} = event;
      g.attr("transform", transform);
      g.attr("stroke-width", 1 / transform.k);
    }

    const row = g.selectAll(".row")
      .data(gridItems)
      .enter().append("g")
      .attr("class", "row");

    row.selectAll(".square")
      .data((d) => d).enter()
      .append("svg:image")
      .attr("x", (d: any) => d.x)
      .attr("y", (d: any) => d.y)
      .attr('width', 50)
      .attr('height', 50)
      .attr("xlink:href", (d: any) => d.url)
  });

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
        <div id={chartID}></div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
