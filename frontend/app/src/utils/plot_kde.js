import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-basic-dist';
import React from 'react';

const plot_kde = (data, layout, name, mean) => {
  const Plot = createPlotlyComponent(Plotly);
  return React.createElement(Plot, {
    data: data,
    layout: {
      ...layout,
      width: undefined,
      height: undefined,
      autosize: true,
      responsive: true,
      shapes: [...layout.shapes, {
          type: 'line',
          x0: mean,
          y0: 0,
          x1: mean,
          y1: Math.max(...data[0].y) + 0.01,
          line: {color: 'blue', width: 2},
          name: `${name} Average Course Rating`,
          showlegend: true
      }]
    },
    useResizeHandler: true,
    style: {width: '100%', height: '100%'}
  })
}

export default plot_kde;