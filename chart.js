anychart.onDocumentReady(function () {
    // set stage
	var stage = anychart.graphics.create("container");

	// create variable for custom theme
	var customTheme = {
		"defaultFontSettings": {
			"fontSize": 9
		},
		"chart": {
			"title": false,
			"legend": false
		}
	};

	// apply custom theme
	anychart.theme(customTheme);

	// set data
	var data_1 = anychart.data.set([
		inzidenzenMannheim[0],
        inzidenzenMannheim[1],
        inzidenzenMannheim[2],
        inzidenzenMannheim[3],
        inzidenzenMannheim[4],
        inzidenzenMannheim[5],
        inzidenzenMannheim[6],
        inzidenzenMannheim[7],
        inzidenzenMannheim[8],
        inzidenzenMannheim[9],
	]);

	// set data
	var seriesData_1 = data_1.mapAs({x: 0, value: 1});
	var seriesData_2 = data_1.mapAs({x: 0, value: 2});

	// set chart_1
	var chart_1 = anychart.column();
	
	chart_1.column(seriesData_1);
	
	//create scale for line series and extraYAxis
	//it force line series to not stuck values with over series
	var scale = anychart.scales.linear();
	scale.minimum(0);
	scale.maximum(100);

	//create line series and set scale for it
	var lineSeries = chart_1.spline(seriesData_2);
	lineSeries.yScale(scale);

	//create extra axis on the right side of chart
	var extraYAxis = chart_1.yAxis(1);
	extraYAxis.title("Customers under 20 years old");
	extraYAxis.orientation("right");
	extraYAxis.scale(scale);
	extraYAxis.labels().format("{%value}%");

	// axis name
	chart_1.yAxis().title("Sales (.oz)");

	// set chart title
	chart_1.title("Popular Tea Types in the Tea House");

	// chart size and position
	chart_1.bounds(0, 0, "60%", "100%");

	// draw
	chart_1.container(stage);
	chart_1.draw();


});