// set up url
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// get the data with D3
d3.json(url).then(function(data) {
    console.log(data);

    // create dropdown menu
    let dropdown = d3.select("#selDataset");
    // Populate the dropdown with options using a for loop
    for (let i = 0; i < data.names.length; i++) {
        let option = dropdown.append("option");
        option.text(data.names[i]);
    }

        // initial plot and metadata display
    let initialSample = data.samples[0];
    barChart(initialSample);
    bubbleChart(initialSample);

    // event listener for dropdown change
    dropdown.on("change", function() {
        let selectedValue = dropdown.property("value");
        let selectedSample = data.samples.find(sample => sample.id === selectedValue);

        // update plots and metadata display
        barChart(selectedSample);
        bubbleChart(selectedSample);
        displayData(selectedSample);
    });
  // call the displaySampleMetadata function here
  displayData(initialSample);
});

//get data from the top 10 values and make bar chart
function barChart(sample) {
    let sampleData = {
        otu_ids: sample.otu_ids.slice(0, 10).reverse(),
        sample_values: sample.sample_values.slice(0, 10).reverse(),
        otu_labels: sample.otu_labels.slice(0, 10).reverse()
    };
    let trace = {
        x: sampleData.sample_values,
        y: sampleData.otu_ids.map(id => `OTU ${id}`),
        text: sampleData.otu_labels,
        type: "bar",
        orientation: "h"
    };

    let layout = {
        title: `Top 10 OTUs for Test Subject ID ${sample.id}`,
        margin:{
            l: 100,
            r: 100,
            t: 100,
            b: 100
        }
    };
    let data = [trace];
    Plotly.newPlot("bar", data, layout);
};

// make bubble chart
function bubbleChart(sample) {
    let trace1 = {
        x: sample.otu_ids,
        y: sample.sample_values,
        text: sample.otu_labels,
        mode: "markers",
        marker: {
            size: sample.sample_values,
            color: sample.otu_ids,
            colorscale: "Earth",
            opacity: 0.7
        }
    };

    let layout1 = {
        title: `Bubble Chart for Test Subject ID ${sample.id}`,
        xaxis: {title: "OTU ID"},
        yaxis: {title:"Sample Values"}
    };

    let data1 = [trace1];
    Plotly.newPlot("bubble", data1, layout1);
};

// create a function to display the selected sample
function displayData(selectedSample) {
    d3.json(url).then(function(data) {
        // This code is executed after the data is loaded
        let metadata = d3.select("#sample-metadata");
        // Use selectedSample.id to get the ID and find the corresponding metadata
        let selectedMetadata = data.metadata.find(metadata => metadata.id === parseInt(selectedSample.id));

        // Clear any existing metadata
        metadata.html("");

        // Display each key-value pair from the metadata JSON object using a for loop.
        let entries = Object.entries(selectedMetadata);
        for (let i = 0; i < entries.length; i++) {
            let key = entries[i][0];
            let value = entries[i][1];
            metadata.append("p").text(`${key}: ${value}`);
        }
    });
}

// function for handling the dropdown change
function optionChanged(selectedValue) {
    console.log("Selected value:", selectedValue);
  };