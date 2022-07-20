import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import './Tab1.css';
import * as d3 from 'd3';

const Tab1: React.FC = () => {
  const color = d3.interpolateRgbBasis(["lime", "forest"]);  

  useIonViewDidEnter(() => {
    const svg = d3.select("#chart")
    .append("div")
    // Container class to make it responsive.
    .classed("svg-container", true) 
    .append("svg")
    // Responsive SVG needs these 2 attributes and no width and height attr.
    // .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 500 500")
    // Class to make it responsive.
    .classed("svg-content-responsive", true)

    //
    // ------------------------
    //
    // d3.xml("./person.svg",  "image/svg+xml", (error, frag) => {
    //   var node = frag.getElementsByTagName("g")[0];
    //   icon = function(){
    //     return node.cloneNode(true);
    //   }
    //   //use plain Javascript to extract the node
    //   update();
    // });
    
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
      var data = new Array();
  
      // iterate for rows 
      for (var row = 0; row < 1; row++) {
          data.push( new Array() );
  
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

    const row = svg.selectAll(".row")
      .data(gridItems)
      .enter().append("g")
      .attr("class", "row");
    
    // var column = row.selectAll(".square")
    //   .data((d) => { return d; })
    //   .enter().append("rect")
    //   .attr("class","square")
    //   .attr("x", (d: any) => { return d.x; })
    //   .attr("y", (d: any) => { return d.y; })
    //   .attr("width", (d: any) => { return d.width; })
    //   .attr("height", (d: any) => { return d.height; })
    //   // .style("fill", "#fff")
    //   .style("stroke", "#222");

    var column = row.selectAll(".square")
      .data((d) => d).enter()
      .append("svg:image")
      .attr("x", (d: any) => d.x)
      .attr("y", (d: any) => d.y)
      // .attr('x', -9)
      // .attr('y', -12)
      .attr('width', 50)
      .attr('height', 50)
      .attr("xlink:href", (d: any) => d.url)
      // .attr("xlink:href", `${process.env.PUBLIC_URL}/assets/square-solid.svg`)
    // column.append("image")
    //   .attr("xlink:href", () => "https://i.imgur.com/f2tcdIW.png")
    //   .attr("x", "-12px")
    //   .attr("y", "-12px")
    //   .attr("width", "24px")
    //   .attr("height", "24px");
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
        <div id="chart"></div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
