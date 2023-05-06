var main = d3.select("main");
var step = main.selectAll(".step");
var visualizations = main.selectAll(".visualization");
var pastCaption = main.select("#past-pictures");
var countrySelect = document.getElementById("country-select");

let selectedCountry = countrySelect.value;
let captions = {"som": ["Somalia's climate is influenced by factors such as the Inter-Tropical Convergence Zone, monsoonal winds, ocean currents, and the El Niño Southern Oscillation. The country is generally arid and semi-arid, with two seasonal rainfall seasons, the Gu (April to June) and the Deyr (October to November). Annual mean temperatures hover around 30°C, and precipitation is generally low and highly variable. The climate ranges from arid desert in the northeastern and central regions to semiarid steppe in the south and northwest, with some areas experiencing tropical savanna or cold steppe climates.",
                "Temperatures in Somalia can reach extremes, especially in the north, where they can surpass 45°C in July and drop below freezing in December. Rainfall is also highly variable, with some regions receiving less than 100 mm annually and others up to 610 mm. The coastal areas are hot and humid, while inland regions are typically dry and hot. Four main seasons revolve around shifts in wind patterns, affecting pastoral and agricultural life: Jilal (harshest dry season, December to March), Gu (main rainy season, April to June), Xagaa (second dry season, July to September), and Dayr (shortest rainy season, October to December).",
                "The unique culture, traditions, and practices of the Somali people are deeply rooted in the climate of Somalia, but this unique climate is poised to be drastically affected by climate change, while the government of Somalia lacks the stability and resources to properly address the effects of climate change."],
                "yem": ["Yemen is a largely arid, sub-tropical country with temperatures that depend on elevation and, in coastal areas, distance from the sea. In the highlands, mean temperatures range from below 15°C in winter to 25°C in summer, while coastal lowlands see temperatures from 22.5°C in winter to up to 35°C in summer.",
                        "Rainfall patterns differ between the highlands and coastal areas, with the center of the country receiving relatively little rainfall. Coastal areas receive 80% of their annual rainfall during winter months, whereas the highlands experience two distinct rainy seasons: the saif (April-May) and the kharif (July-September), governed by the north-west trade winds and mechanisms of the Inter-Tropical Convergence Zone, respectively. Kharif rains typically fall in short events.",
                        "Most of Yemen experiences lower temperatures and higher rainfall than other parts of the Arab world due to its high elevation. The highlands enjoy a temperate, rainy summer and a cool, moderately dry winter. The Tihamah coastal plain experiences a tropical climate, with temperatures occasionally exceeding 54°C and humidity ranging from 50 to 70%. Rainfall in the form of heavy torrents averages 130 mm annually. Some areas of the western highlands receive up to 1,000-1,500 mm of rain per year, while other parts of the country may not receive rain for five years or more.",
                        "Yemen's unique climate contributes to the culture, traditions, and practices of its people. However, climate change is poised to significantly impact this delicate balance, while the country faces ongoing challenges to address its effects due to limited resources and stability."],
                "bgd": ["Bangladesh has a humid, warm climate influenced by pre-monsoon, monsoon, and post-monsoon circulations, with heavy precipitation and frequent tropical cyclones. Average temperatures historically hover around 26°C but can range from 15°C to 34°C throughout the year. The warmest months coincide with the rainy season (April-September), while the winter season (December-February) is colder and drier. The country is exceptionally wet, receiving about 2,200 millimeters of rainfall annually, with some northeastern border regions experiencing as much as 5,000 millimeters. High humidity is present year-round, peaking during the monsoon season (June to October), driven by the Southwest monsoon that originates over the Indian Ocean.",
                        "Bangladesh is critically vulnerable to climate change due to a combination of geographical factors, such as its flat, low-lying, and delta-exposed topography, as well as socio-economic factors, including high population density, poverty, and reliance on agriculture. The country ranked seventh in the list of countries most affected by climate calamities during 1999-2018, according to Germanwatch's Climate Risk Index.",
                        "Frequent natural disasters, inadequate infrastructure, a high population density of 166 million people in an area of 147,570 km², an extractivist economy, and social disparities exacerbate the country's vulnerability to changing climatic conditions. Almost every year, large regions of Bangladesh suffer from intensified events like cyclones, floods, and erosion, which hinder the country's development by straining socio-economic and environmental systems.",
                        "Climate change is expected to increase natural hazards, including increased rainfall, rising sea levels, and tropical cyclones, all of which pose serious threats to agriculture, water and food security, human health, and shelter. Sea levels in Bangladesh are predicted to rise by up to 0.30 meters by 2050, displacing 0.9 million people, and by up to 0.74 meters by 2100, displacing 2.1 million people.",
                        "The unique culture, traditions, and practices of the Bangladeshi people are deeply rooted in the country's climate, but the increasing threat of climate change poses significant challenges to the country's ability to adapt and mitigate its effects, further jeopardizing the well-being of its population and environment."]};
let heights = {"som": "1300px", "yem": "1400px", "bgd": "1600px"};
document.getElementById("country-select").addEventListener("change", (event) => {
    selectedCountry = event.target.value;

    updateVisualization(document.getElementById("graph-grid"));

    pastCaption.selectAll("*").remove()
    captions[selectedCountry].forEach(paragraph => {
        pastCaption.append("p").text(paragraph)
    })
    d3.select(pastCaption.node().parentNode).style("height", heights[selectedCountry])
});

function handleResize() {
    // update height of step elements
    var stepH = Math.floor(window.innerHeight * 0.75);
    step.style("height", stepH + "px");

    d3.selectAll(".scrolly figure")
        .style("height", (window.innerHeight / 2) + "px")
        .style("top", ((window.innerHeight - window.innerHeight / 2) / 2) + "px");

    // tell scrollama to update new element dimensions
    d3.selectAll(".scrolly").each(function() {
        if (this.scrollerInstance) {
            this.scrollerInstance.resize();
        }
    });
}


// scrollama event handlers
function handleStepEnter(response) {
    // response = { element, direction, index }

    // add color to current step only
    response.element.classList.add("is-active");

    // update graphic based on step
    updateVisualization(response.element);
}

function handleStepExit(response) {
    // response = { element, direction, index }

    response.element.classList.remove("is-active");
}

function createChart(chart, svg, width, height, zoomed) {
    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    x.domain(d3.extent(chart.chartData, d => d.year));
    y.domain([0, d3.max(chart.chartData, d => d.value)]);

    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.value));

    svg.selectAll("*").remove();

    svg.append("path")
        .datum(chart.chartData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    if (zoomed) {
        svg.append("text")
            .attr("transform", `translate(${width/2}, 50)`)
            .style("fill", "white")
            .style("text-anchor", "middle")
            .style("font-size", "20px")
            .text(chart.indicatorName);

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("fill", "white")
            .style("text-anchor", "middle")
            .style("font-size", "20px")
            .text(chart.unitName);

        svg.append("text")
            .attr("transform", `translate(${width/2}, ${height + 50})`)
            .style("fill", "white")
            .style("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Year");

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).ticks(15).tickFormat(d3.format("d")));

        svg.append("g")
            .call(d3.axisLeft(y).ticks(20));
    } else {
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).ticks(0));

        svg.append("g")
            .call(d3.axisLeft(y).ticks(0));
    }
}

function updateVisualization(element) {
    var currentScrolly = d3.select(element.parentNode.parentNode);
    var currentVisualization = currentScrolly.select(".visualization");
    currentVisualization.text(selectedCountry + ": Visualization for step " + element.id);

    if (element.id == "graph-grid") {
        currentVisualization.text("");
        d3.csv("datasets/climate-change_" + selectedCountry + ".csv").then(data => {
            const nestedData = d3.group(data, d => d["Indicator Name"]);

            // Create line charts for each group
            const charts = Array.from(nestedData, ([key, values]) => {
                return {
                    indicatorName: key.split(" (")[0],
                    unitName: key.split(" (")[1].slice(0, -1),
                    chartData: values.map(d => ({
                        year: +d.Year,
                        value: +d.Value
                    })).sort((a, b) => a.year - b.year)
                };
            });

            // Arrange the line charts in a grid
            const gridSize = 150;
            const margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 50
            };
            const width = gridSize - margin.left - margin.right;
            const height = gridSize - margin.top - margin.bottom;

            const x = d3.scaleLinear().range([0, width]);
            const y = d3.scaleLinear().range([height, 0]);

            const grid = currentVisualization.append("div")
                .attr("class", "grid")
                .style("width", `${(gridSize + 20) * 4}px`)
                .style("height", `${(gridSize + 10) * 4}px`);

            charts.forEach(chart => {
                const div = grid.append("div")
                    .attr("class", "chart-container")
                    .style("width", `${gridSize}px`)
                    .style("height", `${gridSize}px`);

                const svg = div.append("svg")
                    .attr("id", chart.indicatorName + "##" + chart.unitName)
                    .attr("width", gridSize)
                    .attr("height", gridSize)
                    .append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);

                createChart(chart, svg, width, height, false)
            });

            // Implement click events to zoom in and out of the charts
            currentVisualization.selectAll(".chart-container")
                .on("click", function(d) {
                    var chart_obj = charts.find(obj => obj.indicatorName + "##" + obj.unitName === d.target.id);

                    const zoomed = d3.select(this).classed("zoomed");

                    currentVisualization.selectAll(".chart-container")
                        .classed("not-zoomed", !zoomed);

                    d3.select(this).attr("class", "chart-container");
                    d3.select(this).classed("zoomed", !zoomed);

                    if (!zoomed) {
                        // Transition to expand and center the clicked chart-container
                        d3.select(this)
                            .transition()
                            .duration(0)
                            .style("width", "100%")
                            .style("height", "100%")
                            .style("top", 0)
                            .style("left", 0)
                            .on("end", () => createChart(chart_obj, d3.select(this).select("svg").select("g"), parseInt(grid.style("width")) - 100, parseInt(grid.style("height")) - 100, true));
                    } else {
                        // Reset the clicked chart-container
                        d3.select(this)
                            .transition()
                            .duration(0)
                            .style("width", `${gridSize}px`)
                            .style("height", `${gridSize}px`)
                            .style("top", null)
                            .style("left", null)
                            .on("end", () => createChart(chart_obj, d3.select(this).select("svg").select("g"), width, height, false));
                    }
                });
        });
    } else if(element.id == "past-pictures") {
        currentVisualization.text("");

        currentVisualization.append("img")
            .attr("src", "images/past-pictures/" + selectedCountry + ".png")
            .style("width", "704px")
            .style("height", "400px");
    }
}

function init() {
    d3.selectAll(".scrolly").each(function() {
        var scrolly = d3.select(this);
        var scrollerInstance = scrollama();
        scrollerInstance
            .setup({
                step: scrolly.selectAll(".step").nodes(),
                offset: 0.5,
                debug: false
            })
            .onStepEnter(handleStepEnter)
            .onStepExit(handleStepExit);

        // store the scroller instance in the DOM element
        this.scrollerInstance = scrollerInstance;
    });

    handleResize();
}

init();