export const chart1Data = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');

  return {
    data: {
      datasets: [
        {
          data: [54, 20, 24],
          backgroundColor: ['#CA0303', '#0000FF', 'green'],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--green-400'),
          ],
        },
      ],
      labels: ['Vendors', 'Customer', 'Branches'],
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom', // Position the legend at the bottom
          labels: {
            usePointStyle: true,
            color: textColor,
            paddingBottom: 70,
          },
        },
      },
    },
  };
};

// Component for the second chart
export const chart2Data = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue(
    '--text-color-secondary'
  );
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],

    datasets: [
      {
        label: 'Bookings',

        fill: false,
        borderColor: '#0000FF',
        yAxisID: 'y',
        tension: 0.4,
        data: [65, 59, 80, 81, 56, 55, 10],
      },
      {
        label: 'Vendor',
        fill: false,
        borderColor: '#622CAD',
        tension: 0.4,
        data: [28, 48, 40, 19, 86, 27, 90],
      },
    ],
  };
  const options = {
    stacked: false,
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        // labels: {
        //   color: textColor
        // }
        labels: {
          usePointStyle: true,
          color: textColor,
          paddingBottom: 70,
        },
      },
      // Add the custom plugin here
      customPlugin: {
        afterDraw: function (chart: any, easing: any) {
          const ctx = chart.ctx;
          ctx.save();

          // Get the data for the chart
          const data = chart.data;
          const datasets = data.datasets;
          const meta = chart.getDatasetMeta(0);

          // Loop through each data point
          for (let i = 0; i < datasets[0].data.length; i++) {
            // Get the data point coordinates
            const model = meta.data[i]._model;
            const x = model.x;
            const y = model.y;

            // Draw the circle
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.stroke();

            // Draw the arrow
            const arrowWidth = 10;
            const arrowHeight = 5;
            const arrowX = x + 5;
            const arrowY = y - arrowHeight;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(arrowX, arrowY);
            ctx.lineTo(arrowX + arrowWidth / 2, arrowY + arrowHeight);
            ctx.lineTo(x, y);
            ctx.fillStyle = 'black';
            ctx.fill();
          }

          ctx.restore();
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
          display: false,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          display: false,
          color: surfaceBorder,
        },
      },
      y1: {
        type: 'linear',
        display: false,
        position: 'right',
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          display: false,
          drawOnChartArea: false,
          color: surfaceBorder,
        },
      },
    },
  };

  return { data, options };
};
export const chart3Data = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue(
    '--text-color-secondary'
  );

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        width: 10,
        label: 'My First dataset',
        backgroundColor: '#0000FF',
        borderColor: documentStyle.getPropertyValue('--blue'),
        data: [25, 29, 40, 41, 46, 45, 40],
        fill: true,
        // borderRadius: 50,
        barPercentage: 0.3,
      },
      {
        label: 'My Second dataset',
        backgroundColor: '#622CAD',
        // backgroundColor: documentStyle.getPropertyValue('--purple'),
        borderColor: documentStyle.getPropertyValue('--purple'),
        data: [28, 28, 40, 19, 46, 27, 20],
        fill: true,
        barPercentage: 0.3,
        // borderRadius: 50,
      },
    ],
  };

  const options = {
    cornerRadius: 20,
    // layout: {
    //     padding: {
    //         left: 0,
    //         right: 0,
    //         top: 10, // Adjust top padding
    //         bottom: 10 // Adjust bottom padding
    //     },
    //     margin: {
    //         left: 0,
    //         right: 0,
    //         top: 10, // Adjust top margin
    //         bottom: 0 // Adjust bottom margin
    //     },
    // },
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    position: 'center',
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
        },
      },

      //     roundedBorders: {
      //         radius: 60
      // },
    },
    scales: {
      x: {
        borderColor: false,
        ticks: {
          color: textColorSecondary,
          font: {
            weight: 500,
          },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          drawBorder: false,
          display: false,
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 50,
        barSpacing: 0,
        clip: false,
      },
      line: {
        tension: 0.4,
        borderWidth: 1,
        borderColor: documentStyle.getPropertyValue('--blue'),
        backgroundColor: documentStyle.getPropertyValue('--blue'),
        // borderRadius: 15,
        fill: true,
      },
    },
  };
  const annotations = [
    {
      type: 'line',
      mode: 'horizontal',
      scaleID: 'y',
      value: 40, // y-axis value to draw the line
      borderColor: 'red',
      borderWidth: 2,
    },
  ];

  return { data, options };
};
