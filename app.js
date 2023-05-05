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
