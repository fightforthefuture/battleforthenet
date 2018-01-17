'use strict';

function InternetHealthTest(historicalDataString) {
    var historicalData = this.unpackageShareableResults(historicalDataString);
    var historicalInformation = this.processShareableResults(historicalData);

    this.notifyShareableResults(historicalInformation);
    this.createChart(historicalData);
}

InternetHealthTest.prototype.processShareableResults = function (shareableResults) {
  var that = this;
  var allResults = [];
  var shareableInformation = {
    'high': undefined,
    'median': undefined,
    'mean': undefined,
    'low': undefined,
    'rsdeviation': undefined,
    'consistency': undefined,
    'slow_links': [],
    'time_run': shareableResults.time_run,
  };
  
  shareableResults.results.forEach(function (sharedResult) {
    if (shareableInformation.high === undefined ||
        sharedResult.s2cRate > shareableInformation.high) {
      shareableInformation.high = sharedResult.s2cRate;
    }
    if (shareableInformation.low === undefined ||
        sharedResult.s2cRate < shareableInformation.low) {
      shareableInformation.low = sharedResult.s2cRate;
    }
    allResults.push(sharedResult.s2cRate);
  });
  
  shareableInformation.mean = (allResults.reduce(function(a, b) { return a + b; }) / allResults.length);
  shareableInformation.median = findMedian(allResults);
  shareableInformation.rsdeviation = (standardDeviation(allResults) / shareableInformation.mean);
  
  if (shareableInformation.rsdeviation > 0.6) {
    shareableInformation.consistency = 'poor';
  } else if (shareableInformation.rsdeviation > 0.3) {
    shareableInformation.consistency = 'fair';
  } else if (shareableInformation.rsdeviation > 0.1) {
    shareableInformation.consistency = 'good';
  } else {
    shareableInformation.consistency = 'high';
  }
  
  shareableResults.results.forEach(function (sharedResult, index) {
    if (sharedResult.s2cRate < (shareableInformation.mean * .6) ) {
      shareableInformation.slow_links.push(sharedResult.siteId);
    }
  });

  return shareableInformation;
}

InternetHealthTest.prototype.unpackageShareableResults = function (passedString) {
  var sharedResultObject;
  
  if (passedString.slice(-1) === '/') {
    passedString = passedString.slice(0, (passedString.length - 1))
  }
  try {
    sharedResultObject = JSON.parse(decodeURIComponent(escape(window.atob(passedString))));
  } catch (error) {
    return {};
  }
  return sharedResultObject;
};


InternetHealthTest.prototype.notifyShareableResults = function (shareableInformation, introOverlay) {
  introOverlay = introOverlay || false;
  var targetOverlay, targetOverlayResults;

  document.getElementById('consistency').getElementsByClassName('result')[0].innerHTML = shareableInformation.consistency;
  document.getElementById('high').getElementsByClassName('result')[0].innerHTML = this.formatMeasurementResult('c2sRate', shareableInformation.high);
  document.getElementById('low').getElementsByClassName('result')[0].innerHTML = this.formatMeasurementResult('c2sRate', shareableInformation.low);
  
  if (shareableInformation.slow_links.length === 0) {
    document.getElementById('slow_links').style.display = "none";
  } else if (shareableInformation.slow_links.length === 1) {
    document.getElementById('slow_links').getElementsByClassName('result')[0].innerHTML = 'Potential slow down found on one connection.';
  } else if (shareableInformation.slow_links.length > 1) {
    document.getElementById('slow_links').getElementsByClassName('result')[0].innerHTML = 'Potential slow downs found on ' + shareableInformation.slow_links.length + ' connections.';
  }
  document.getElementById('historicalData').style.display = "block";
};

InternetHealthTest.prototype.createChart = function (shareableResults, introOverlay) {
  introOverlay = introOverlay || false;
  var chartContext, chartObject, chartDatasets, chartOptions, chartData, chartLabels;

    
  chartLabels = [];
  shareableResults.results.forEach( function (shareableResult, index) {
    chartLabels.push(''); //"Test " + index;
  });
  
  chartData = [];
  shareableResults.results.forEach( function (shareableResult, index) {
    chartData.push( Number(shareableResult.s2cRate / 1000).toFixed(2) );
  });
  
  chartContext = document.getElementById("test_series_chart").getContext("2d");
  chartData = {
      labels: chartLabels,
      datasets: [
          {
              label: "Measurements",
              fillColor: "rgba(39, 162, 124, 0.4)",
              strokeColor: "rgba(48, 201, 153, 1)",
              pointColor: "rgba(151,187,205,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(151,187,205,1)",
              data: chartData
          }
      ]
  };
  chartOptions = {
    responsive: false,
    scaleBeginAtZero: true,
    scaleShowVerticalLines: false,
    scaleShowLabels: true,
    scaleFontSize: 9,
    scaleFontColor: "#FEFEFE",
    scaleLabel: "<%=value%> Mbps",
    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %> Mbps",
  };
  this.chartObject = new Chart(chartContext).Line(chartData, chartOptions);
};

InternetHealthTest.prototype.formatMeasurementResult = function (resultType,
    resultValue) {
  var temporaryValue;
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  if (resultType === 's2cRate' || resultType === 'c2sRate') {
    return Number(resultValue / 1000).toFixed(2) + ' Mbps';
  } else if (resultType === 'MinRTT') {
    return Number(resultValue).toFixed(2) + ' ms';
  } else if (resultType === 'packetRetransmissions') {
    return Number(resultValue*100).toFixed(2) + '%';
  } else if (resultType === 'timestamp') {
    temporaryValue = new Date(resultValue);
    return months[temporaryValue.getMonth()] + " " + temporaryValue.getDate() +
      " " + temporaryValue.getFullYear() + ", " + temporaryValue.getHours() + ":" +
      (temporaryValue.getMinutes() < 10 ? '0' + temporaryValue.getMinutes() : temporaryValue.getMinutes());
  }
  return undefined;
};

function findMedian(data) {
    // extract the .values field and sort the resulting array
    var m = data.map(function(v) {
        return v;
    }).sort(function(a, b) {
        return a - b;
    });
    var middle = Math.floor((m.length - 1) / 2); // NB: operator precedence
    if (m.length % 2) {
        return m[middle];
    } else {
        return (m[middle] + m[middle + 1]) / 2.0;
    }
}

function standardDeviation(values){
  var avg = average(values);
  
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  
  var avgSquareDiff = average(squareDiffs);
 
  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}
 
function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);
 
  var avg = sum / data.length;
  return avg;
}
