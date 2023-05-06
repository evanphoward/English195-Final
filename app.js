// using d3 for convenience
var main = d3.select("main");
var step = main.selectAll(".step");
var visualizations = main.selectAll(".visualization");

// generic window resize listener event
function handleResize() {
    // 1. update height of step elements
    var stepH = Math.floor(window.innerHeight * 0.75);
    step.style("height", stepH + "px");

    d3.selectAll(".scrolly figure")
        .style("height", (window.innerHeight / 2) + "px")
        .style("top", ((window.innerHeight - window.innerHeight / 2) / 2) + "px");

    // 3. tell scrollama to update new element dimensions
    d3.selectAll(".scrolly").each(function() {
        if (this.scrollerInstance) {
            this.scrollerInstance.resize();
        }
    });
}


// scrollama event handlers
function handleStepEnter(response) {
    console.log(response);
    // response = { element, direction, index }

    // add color to current step only
    response.element.classList.add("is-active");

    // update graphic based on step
    updateVisualization(response.element);
}

function handleStepExit(response) {
    console.log(response);
    // response = { element, direction, index }

    response.element.classList.remove("is-active");
}

function updateVisualization(element) {
    // Update the visualization based on the index
    // For now, just display the index number
    var currentScrolly = d3.select(element.parentNode.parentNode);
    var currentVisualization = currentScrolly.select(".visualization");
    currentVisualization.text("Visualization for step " + element.id);

    if(element.id == "1") {
        d3.csv("datasets/climate-change_yem.csv").then(data => {
            const nestedData = d3.group(data, d => d["Indicator Name"]);
          
            // Task 2: Create line charts for each group
            const charts = Array.from(nestedData, ([key, values]) => {
              return {
                indicatorName: key,
                chartData: values.map(d => ({
                  year: +d.Year,
                  value: +d.Value
                })).sort((a, b) => a.year - b.year)
              };
            });
          
            // Task 3: Arrange the line charts in a grid
            const grid = currentVisualization.append("div")
              .attr("class", "grid");
          
            const gridSize = 200;
            const margin = {top: 20, right: 20, bottom: 30, left: 50};
            const width = gridSize - margin.left - margin.right;
            const height = gridSize - margin.top - margin.bottom;
          
            const x = d3.scaleLinear().range([0, width]);
            const y = d3.scaleLinear().range([height, 0]);
          
            charts.forEach(chart => {
              const div = grid.append("div")
                .attr("class", "chart-container")
                .style("width", `${gridSize}px`)
                .style("height", `${gridSize}px`);
          
              const svg = div.append("svg")
                .attr("width", gridSize)
                .attr("height", gridSize)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);
          
              x.domain(d3.extent(chart.chartData, d => d.year));
              y.domain([0, d3.max(chart.chartData, d => d.value)]);
          
              const line = d3.line()
                .x(d => x(d.year))
                .y(d => y(d.value));
          
              svg.append("path")
                .datum(chart.chartData)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", line);
          
              svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x).ticks(5));
          
              svg.append("g")
                .call(d3.axisLeft(y).ticks(5));
            });
          
            // Task 4: Implement click events to zoom in and out of the charts
            container.selectAll(".chart-container")
              .on("click", function() {
                d3.select(this)
                  .classed("zoomed", d => !d3.select(this).classed("zoomed"));
              });
          
            container.append("style")
              .html(`
                .grid {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 10px;
                }
                .chart-container {
                  position: relative;
                  cursor: pointer;
                }
                .chart-container.zoomed {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 100;
                  }
                  .chart-container.zoomed svg {
                    width: 100%;
                    height: 100%;
                  }
              `);
          
          });
    }
}

function init() {

    // 2. setup the scroller passing options
    //    this will also initialize trigger observations
    // 3. bind scrollama event handlers (this can be chained like below)
    d3.selectAll(".scrolly").each(function () {
        var scrolly = d3.select(this);
        var scrollerInstance = scrollama();
        scrollerInstance
            .setup({
                step: scrolly.selectAll(".step").nodes(),
                offset: 0.33,
                debug: false
            })
            .onStepEnter(handleStepEnter)
            .onStepExit(handleStepExit);

        // store the scroller instance in the DOM element
        this.scrollerInstance = scrollerInstance;
    });

    // 1. force a resize on load to ensure proper dimensions are sent to scrollama
    handleResize();
}

// kick things off
init();
