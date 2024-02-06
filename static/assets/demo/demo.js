type = ['primary', 'info', 'success', 'warning', 'danger'];
tableError = document.getElementById("tableError");
tableLog = document.getElementById("tableLog");
tableProcess = document.getElementById("tableProcess");
tableCurrentProcess = document.getElementById("tableCurrentProcess");

demo = {
  initPickColor: function() {
    $('.pick-class-label').click(function() {
      var new_class = $(this).attr('new-class');
      var old_class = $('#display-buttons').attr('data-class');
      var display_div = $('#display-buttons');
      if (display_div.length) {
        var display_buttons = display_div.find('.btn');
        display_buttons.removeClass(old_class);
        display_buttons.addClass(new_class);
        display_div.attr('data-class', new_class);
      }
    });
  },

  initDashboardPageCharts: function() {
    const source = new EventSource("/chart-data");
      source.onmessage = function (event) {
        const data = JSON.parse(event.data);
        var machine_name = document.getElementById("machine_name");
          machine_name.innerHTML = data.machine_name;
        var status = document.getElementById("status");
          if (data.status == "no Connection") {
              status.style.backgroundColor = "red";
          }
          if (data.status == "Connected") {
              status.style.backgroundColor = "#4CAF50";
              if (MemoryChart.data.labels.length === 20) {
                  MemoryChart.data.labels.shift();
                  MemoryChart.data.datasets[0].data.shift();
                  MemoryChart.data.datasets[1].data.shift();
                  MemoryChart.data.datasets[2].data.shift();
              }
              MemoryChart.data.labels.push(data.time);
              MemoryChart.data.datasets[0].data.push(data.totalMem);
              MemoryChart.data.datasets[1].data.push(data.usedMem);
              MemoryChart.data.datasets[2].data.push(data.freeMem);
              MemoryChart.update();

              if (MemorySharedChart.data.labels.length === 20) {
                  MemorySharedChart.data.labels.shift();
                  MemorySharedChart.data.datasets[0].data.shift();
              }
              MemorySharedChart.data.labels.push(data.time);
              MemorySharedChart.data.datasets[0].data.push(data.sharedMem);
              MemorySharedChart.update();
              if (MemoryBuffChart.data.labels.length === 20) {
                  MemoryBuffChart.data.labels.shift();
                  MemoryBuffChart.data.datasets[0].data.shift();
              }
              MemoryBuffChart.data.labels.push(data.time);
              MemoryBuffChart.data.datasets[0].data.push(data.buffCacheMem);
              MemoryBuffChart.update();

              MemoryAvailableChart.data.datasets[0].data.shift();
              MemoryAvailableChart.data.datasets[0].data.shift();
              MemoryAvailableChart.data.datasets[0].data.push(data.totalMem - data.availableMem);
              MemoryAvailableChart.data.datasets[0].data.push(data.availableMem);
              MemoryAvailableChart.update();

              if (SwapInChart.data.labels.length === 20) {
                  SwapInChart.data.labels.shift();
                  SwapInChart.data.datasets[0].data.shift();
              }
              SwapInChart.data.labels.push(data.time);
              SwapInChart.data.datasets[0].data.push(data.swapIn);
              SwapInChart.update();

              if (SwapOutChart.data.labels.length === 20) {
                  SwapOutChart.data.labels.shift();
                  SwapOutChart.data.datasets[0].data.shift();
              }
              SwapOutChart.data.labels.push(data.time);
              SwapOutChart.data.datasets[0].data.push(data.swapOut);
              SwapOutChart.update();

              if (BlockInChart.data.labels.length === 20) {
                  BlockInChart.data.labels.shift();
                  BlockInChart.data.datasets[0].data.shift();
              }
              BlockInChart.data.labels.push(data.time);
              BlockInChart.data.datasets[0].data.push(data.blockIn);
              BlockInChart.update();

              if (BlockOutChart.data.labels.length === 20) {
                  BlockOutChart.data.labels.shift();
                  BlockOutChart.data.datasets[0].data.shift();
              }
              BlockOutChart.data.labels.push(data.time);
              BlockOutChart.data.datasets[0].data.push(data.blockOut);
              BlockOutChart.update();

              if (CPUChart.data.labels.length === 20) {
                  CPUChart.data.labels.shift();
                  CPUChart.data.datasets[0].data.shift();
                  CPUChart.data.datasets[1].data.shift();
              }
              CPUChart.data.labels.push(data.time);
              CPUChart.data.datasets[0].data.push(data.userTime);
              CPUChart.data.datasets[1].data.push(data.sysTime);
              CPUChart.update();

              if (data.error) {
                  while (tableError.firstChild) {
                      tableError.removeChild(tableError.firstChild);
                  }
                  data.error.forEach(elem => tableError.innerHTML += "<tr><td>" + elem.date + "</td><td>" + elem.pid + "</td></tr>");
              }
              if (data.access_log) {
                  while (tableLog.firstChild) {
                      tableLog.removeChild(tableLog.firstChild);
                  }
                  data.access_log.forEach(elem => tableLog.innerHTML += "<tr><td>" + elem.ip + "</td><td></td><td></td><td>" + elem.path + "</td></tr>");
              }
              if (data.processes) {
                  while (tableProcess.firstChild) {
                      tableProcess.removeChild(tableProcess.firstChild);
                  }
                  data.processes.forEach(elem => tableProcess.innerHTML += "<tr><td>" + elem + "</td></tr>");
              }
              if (data.current_processes) {
                  while (tableCurrentProcess.firstChild) {
                      tableCurrentProcess.removeChild(tableCurrentProcess.firstChild);
                  }
                  data.current_processes.forEach(elem => tableCurrentProcess.innerHTML += "<tr><td>" + elem + "</td></tr>");
              }
          }
    }

    gradientChartOptionsConfigurationWithTooltipBlue = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 125,
            padding: 20,
            fontColor: "#2380f7"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#2380f7"
          }
        }]
      }
    };

    gradientChartOptionsConfigurationWithTooltipPurple = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(225,78,202,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }]
      }
    };

    gradientChartOptionsConfigurationWithTooltipOrange = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 50,
            suggestedMax: 110,
            padding: 20,
            fontColor: "#ff8a76"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(220,53,69,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#ff8a76"
          }
        }]
      }
    };

    gradientChartOptionsConfigurationWithTooltipGreen = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 50,
            suggestedMax: 125,
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(0,242,195,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }]
      }
    };


    gradientBarChartConfiguration = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{

          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 120,
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }],

        xAxes: [{

          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }]
      }
    };

    // memory chart with used, free and total memory
    var chart_labels = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    var ctx = document.getElementById("MemoryChart").getContext("2d");
    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
    gradientStroke.addColorStop(1, 'rgba(72,72,176,0.2)');
    gradientStroke.addColorStop(0.2, 'rgba(72,72,176,0.0)');
    gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors

    var data = {
        labels: chart_labels,
        datasets: [{
            label: "Memory Total",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#d346b1',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#d346b1',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#d346b1',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            label: "Memory used",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#ff6384',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#ff6384',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#ff6384',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            label: "Memory free",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#36a2eb',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#36a2eb',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#36a2eb',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }]
    };
    var MemoryChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: gradientChartOptionsConfigurationWithTooltipPurple
    });

    // Memory Swap chart 
    var ctx = document.getElementById("SwapInChart").getContext("2d");
    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
    gradientStroke.addColorStop(1, 'rgba(72,72,176,0.2)');
    gradientStroke.addColorStop(0.2, 'rgba(72,72,176,0.0)');
    gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors

    var data = {
        labels: chart_labels,
        datasets: [{
            label: "Swap In",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#faac10',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#faac10',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#faac10',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }]
    };
      var SwapInChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: gradientChartOptionsConfigurationWithTooltipPurple
    });

    var ctx = document.getElementById("SwapOutChart").getContext("2d");
    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
    gradientStroke.addColorStop(1, 'rgba(72,72,176,0.2)');
    gradientStroke.addColorStop(0.2, 'rgba(72,72,176,0.0)');
    gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors

    var data = {
        labels: chart_labels,
        datasets: [{
            label: "Swap Out",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#00d6b4',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#00d6b4',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#00d6b4',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }]
    };
    var SwapOutChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: gradientChartOptionsConfigurationWithTooltipPurple
    });

    // Disk Block chart 
    var ctx = document.getElementById("BlockInChart").getContext("2d");
    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
    gradientStroke.addColorStop(1, 'rgba(72,72,176,0.2)');
    gradientStroke.addColorStop(0.2, 'rgba(72,72,176,0.0)');
    gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors

    var data = {
        labels: chart_labels,
        datasets: [{
            label: "Block In",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#1f8ef1',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#1f8ef1',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#1f8ef1',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }]
    };
    var BlockInChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: gradientChartOptionsConfigurationWithTooltipPurple
    });

    var ctx = document.getElementById("BlockOutChart").getContext("2d");
    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
    gradientStroke.addColorStop(1, 'rgba(72,72,176,0.2)');
    gradientStroke.addColorStop(0.2, 'rgba(72,72,176,0.0)');
    gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors

    var data = {
        labels: chart_labels,
        datasets: [{
            label: "Block Out",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#d346b1',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#d346b1',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#d346b1',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }]
    };
    var BlockOutChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: gradientChartOptionsConfigurationWithTooltipPurple
    });

    var ctx = document.getElementById("CPUChart").getContext("2d");
    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
    var data = {
        labels: chart_labels,
        datasets: [{
            label: "User Time",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#d346b1',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#d346b1',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#d346b1',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            label: "System Time",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#ff6384',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#ff6384',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#ff6384',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }]
    };
    var CPUChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: gradientChartOptionsConfigurationWithTooltipPurple
    });

    // Memory buffer cache
    var ctxGreen = document.getElementById("MemoryBuffChart").getContext("2d");
    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
    gradientStroke.addColorStop(1, 'rgba(66,134,121,0.15)');
    gradientStroke.addColorStop(0.4, 'rgba(66,134,121,0.0)'); //green colors
    gradientStroke.addColorStop(0, 'rgba(66,134,121,0)'); //green colors
    var data = {
      labels: ['', '', '', '', '', ''],
      datasets: [{
        label: "Memory Buffer Cache",
        fill: true,
        backgroundColor: gradientStroke,
        borderColor: '#00d6b4',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: '#00d6b4',
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: '#00d6b4',
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: [0, 0, 0, 0, 0, 0],
      }]
    };

    var MemoryBuffChart = new Chart(ctxGreen, {
      type: 'line',
      data: data,
      options: gradientChartOptionsConfigurationWithTooltipGreen

    });

      var ctx = document.getElementById("MemorySharedChart").getContext("2d");
      var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
      gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
      gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
      gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors
      var MemorySharedChart = new Chart(ctx, {
          type: 'bar',
          responsive: true,
          legend: {
              display: false
          },
          data: {
              labels: ['', '', '', '', '', ''],
              datasets: [{
                  label: "Memory shared",
                  fill: true,
                  backgroundColor: gradientStroke,
                  hoverBackgroundColor: gradientStroke,
                  borderColor: '#1f8ef1',
                  borderWidth: 2,
                  borderDash: [],
                  borderDashOffset: 0.0,
                  data: [0, 0, 0, 0, 0, 0],
              }]
          },
          options: gradientBarChartConfiguration
      });

    // Memory available
    var ctx = document.getElementById("MemoryAvailableChart").getContext('2d');
    var config = {
      type: 'pie',
      data: {
        labels: ['used memory','available memory'],
        datasets: [{
          label: "Memory available",
          fill: true,
          backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
          borderColor: '#d346b1',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: '#d346b1',
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: '#d346b1',
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: 0,
        }]
      },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Pie Chart'
                }
            }
        },
    };
    var MemoryAvailableChart = new Chart(ctx, config);
    
  },

  initGoogleMaps: function() {
    var myLatlng = new google.maps.LatLng(40.748817, -73.985428);
    var mapOptions = {
      zoom: 13,
      center: myLatlng,
      scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
      styles: [{
          "elementType": "geometry",
          "stylers": [{
            "color": "#1d2c4d"
          }]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#8ec3b9"
          }]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#1a3646"
          }]
        },
        {
          "featureType": "administrative.country",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#4b6878"
          }]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#64779e"
          }]
        },
        {
          "featureType": "administrative.province",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#4b6878"
          }]
        },
        {
          "featureType": "landscape.man_made",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#334e87"
          }]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [{
            "color": "#023e58"
          }]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [{
            "color": "#283d6a"
          }]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#6f9ba5"
          }]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#1d2c4d"
          }]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#023e58"
          }]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#3C7680"
          }]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{
            "color": "#304a7d"
          }]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#98a5be"
          }]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#1d2c4d"
          }]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{
            "color": "#2c6675"
          }]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#9d2a80"
          }]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#9d2a80"
          }]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#b0d5ce"
          }]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#023e58"
          }]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#98a5be"
          }]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#1d2c4d"
          }]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#283d6a"
          }]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [{
            "color": "#3a4762"
          }]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{
            "color": "#0e1626"
          }]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#4e6d70"
          }]
        }
      ]
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var marker = new google.maps.Marker({
      position: myLatlng,
      title: "Hello World!"
    });

    // To add the marker to the map, call setMap();
    marker.setMap(map);
  },

  showNotification: function(from, align) {
    color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "tim-icons icon-bell-55",
      message: "Welcome to <b>Black Dashboard</b> - a beautiful freebie for every web developer."

    }, {
      type: type[color],
      timer: 8000,
      placement: {
        from: from,
        align: align
      }
    });
  }

};