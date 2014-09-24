var bardata = [];

d3.csv('data.csv',function(data){

	console.log(data);

	for(key in data){
		bardata.push(data[key].value)
	}

	var margin = { top: 30, right: 30, bottom: 40, left:50 }

	var svgWidth = 600 - margin.left - margin.right,
		svgHeight = 400 - margin.top - margin.bottom,
		barWidth = 30,
		barOffset = 5;

	var yScale = d3.scale.linear()
		.domain([0,d3.max(bardata)])
		.range([0,svgHeight])

	var xScale = d3.scale.ordinal()
		.domain(d3.range(0,bardata.length))
		.rangeBands([0,svgWidth],0.2,0) //Number 0.2 is to specify the distance between bars (valid values between 0 and 1). First number 0 represents the offset of the first bar start from the origin of the graph.

	//vary the color of the bar based on the value. More the height of the bar, more pink it will be.

	var colors = d3.scale.linear()
		.domain([0,bardata.length*.33,bardata.length*.66,bardata.length])
		//.range(['#FFB832','#C61C6F'])
		.range(['#B58929','#C61C6F', '#268BD2', '#85992C']) //Orange to Green.

	var tempcolor; //tempcolor to modify color on mouseover

	//Creat a tooltip to show the height of the bar on mouseover
	var tooltip = d3.select('body').append('div')
		.style('position','absolute') //To allow d3 to follow the position absolute to the relationship to the page
		.style('padding','0 10px') //To do padding on the toop tip. 0 on the top and bottom and 10px on each side
		.style('background','white')
		.style('opacity',0) // 0 as we don't want to show when the graphic first loads up

	var myChart = d3.select('#chart').append('svg')
		.style('background','#E7E0CB')
		.attr('width',svgWidth + margin.left + margin.right)
		.attr('height',svgHeight + margin.top + margin.bottom)
		.append('g') //append a group element
		.attr('transform','translate(' + margin.left + ', ' + margin.top+')')
		.selectAll('rect').data(bardata)
		.enter().append('rect')
		.style('fill',function(d,i){
			return colors(i)
		})
		.attr('width',xScale.rangeBand())
		.attr('x',function(d,i){
		//return i * (barWidth + barOffset);
			return xScale(i);
		})
		.attr('height',0) //set the height to 0. Later set in the transition function below to create animation
		.attr('y',0) //set the y position to 0. Later set in the transition function below to create animation

	//To change the color to yellow on mouse over and to set the opactiy to 0.5
	.on('mouseover',function(d){
		tooltip.transition()
		.style('opacity',.9)

	tooltip.html(d)
		.style('left',(d3.event.pageX - 20)+ 'px') //position of the tooltip
		.style('top',(d3.event.pageY + 15) + 'px') 

	tempcolor = this.style.fill
	
	d3.select(this)
		.style('fill','yellow')
		.style('opacity',.5)
	})
	//To reset the color, hence opacity = 1
	.on('mouseout',function(d){
		d3.select(this)
			.style('opacity',1)
			.style('fill',tempcolor)
	})


	myChart.transition()
		.attr('height',function(d){
			return yScale(d);
		})
		.attr('y',function(d){
			return svgHeight - yScale(d);
		})
		.delay(function(d,i){
			return i * 10;
		})
	//add ease 
		.ease('elastic')
	//add delay duration of 1 second inaddtion to the default 2.5s
		.duration(1000)

	//create y axis with tick marks

	var vGuideScale = d3.scale.linear()
		.domain([0,d3.max(bardata)])
		.range([svgHeight,0]) //Notice height,0 and not 0,height

	var vAxis = d3.svg.axis()
		.scale(vGuideScale)
		.orient('left')
		.ticks(10)

	var vGuide = d3.select('svg').append('g')
		vAxis(vGuide)
		vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
		vGuide.selectAll('path')
			.style({ fill: 'none', stroke: "#000"})
		vGuide.selectAll('line')
			.style({ stroke: "#000"})

	var hAxis = d3.svg.axis()
		.scale(xScale)
		.orient('bottom')
		.tickValues(xScale.domain().filter(function(d, i) {
			return !(i % (bardata.length/5));
		}))

	var hGuide = d3.select('svg').append('g')
		hAxis(hGuide)
		hGuide.attr('transform', 'translate(' + margin.left + ', ' + (svgHeight + margin.top) + ')')
		hGuide.selectAll('path')
			.style({ fill: 'none', stroke: "#000"})
		hGuide.selectAll('line')
			.style({ stroke: "#000"})

})	

/*
	for(var i=0; i<50;i++){
	//Minimum 10 and maximum 40
	bardata.push(Math.round(Math.random()*30)+10);
	}
	

	//To sort the bardata elements
	bardata.sort(function compare(a,b){
	return a - b;
	}) 

*/



