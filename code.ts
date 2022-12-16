// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
 import fetch from 'node-fetch';


// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { themeColors: true });

figma.ui.resize(400, 250);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

 async function fetchApi<T>(url: string): Promise<T> {
    const response = await fetch(url, {
          method: 'POST',
          headers: {
              Accept: 'application/json',
          },
          body:{}
      });
      if (!response.ok) {
          throw new Error(response.statusText);
      }
      const data = await (response.json() as Promise<{ data: T; }>);
      return data.data;
  }
figma.ui.onmessage = async numbers => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  // if (msg.type === 'create-chart') {
  // const nodes: SceneNode[] = [];

  const api_url = "wdwf";



  const selection = figma.currentPage.selection;
  const WIDTH = selection[0].width;
  const HEIGHT = selection[0].height;
  const x = selection[0].x;
  const y = selection[0].y + HEIGHT;

  // Figma coordinates start from top left corner of the selection
  //      x->
  //   y  >>>>>>>>>>>>>>>>>>>>>
  //   |  >                   >
  //   v  >                   >
  //      >                   >
  //      >>>>>>>>>>>>>>>>>>>>>

  const chart = figma.createVector();
  // numbers = numbers.map((val: number) => Math.max(0, val))

  // console.log(`NUmbers: ${numbers}`);

  type Series = {
    key: string;
    name: string;
    data: number[];
  }

  type Data = {
    series: Series[]
  }
  var response = await fetchApi<Data>(api_url);
  console.log(response);
  // var data = response.series[0].data;
  var data = numbers;

  // var MAX_VALUE = Math.max(...numbers);
  // var MIN_VALUE = Math.min(...numbers);
  var MAX_VALUE = Math.max(...data);
  var MIN_VALUE = Math.min(...data);


  const STEP_X = WIDTH / (data.length - 1);
  const STEP_Y = (HEIGHT / (MAX_VALUE - MIN_VALUE))

  const vertices = data.map((value: number, index: number) => ({
    x: x + (STEP_X * index),
    y: y - value * STEP_Y,
    cornerRadius: 5
  }));

  vertices.push(({
    x: x + WIDTH,
    y: y + 1,
    cornerRadius: 5
  }), ({
    x: x,
    y: y + 1,
    cornerRadius: 5

  }))


  chart.vectorNetwork = {
    vertices: vertices,
    segments: vertices.map((v: any, index: number) => {
      return ({
        start: index,
        end: index == vertices.length - 1 ? 0 : index + 1,

      })
    }),
  }
  figma.currentPage.selection = figma.currentPage.selection.concat(chart);
  figma.viewport.scrollAndZoomIntoView(selection);
  // }
  // #a29bfe


  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  //  figma.closePlugin();
}

