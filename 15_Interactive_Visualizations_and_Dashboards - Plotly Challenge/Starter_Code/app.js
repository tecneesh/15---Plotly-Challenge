
function getPlot(id) {
    //grab data
    d3.json("Data/samples.json").then((data)=> {
        console.log(data)
  
        var wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Freq: ${wfreq}`)
        
        //filter
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        
        console.log(samples);
  
        //retrieve top 10
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
  
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        
        var OTU_id = OTU_top.map(d => "OTU " + d)
  
        //retrieve labels
        var labels = samples.otu_labels.slice(0, 10);
  
        //create trace, data, and layout variable
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'rgb(142,124,195)'},
            type:"bar",
            orientation: "h",
        };
  
        var data = [trace];
  
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
  
        //bar plot
        Plotly.newPlot("bar", data, layout);
  
      
        //bubble chart
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };
  
        //create layout and data variables for bubble
        var layout_b = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };
  
        var data1 = [trace1];
  
        Plotly.newPlot("bubble", data1, layout_b); 
  

      });
  }  
//get necessary data
function getInfo(id) {
    //read json
    d3.json("Data/samples.json").then((data)=> {
        
        var metadata = data.metadata;

        console.log(metadata)

        //filter
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        
        var demographicInfo = d3.select("#sample-metadata");
        
        
        demographicInfo.html("");

        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

//create change function 
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

//init function
function init() {
    
    var dropdown = d3.select("#selDataset");

    
    d3.json("Data/samples.json").then((data)=> {
        console.log(data)

        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();