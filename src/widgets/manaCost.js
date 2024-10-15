import * as d3 from 'd3';

class ManaCost {
    build(data, element) {
        const margin = { top: 30, right: 30, bottom: 70, left: 60 };
        const width = 300 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        d3.select(element).select("svg").remove();

        const svg = d3.select(element)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xAxis = d3.scaleBand()
            .range([0, width])
            .domain(data.map(d => d.cost))
            .padding(0.2);

        svg.append('g')
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xAxis))
            .selectAll("text")
            .style("text-anchor", "end");

        const yAxis = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([height, 0]);

        svg.append('g')
            .call(d3.axisLeft(yAxis));

        const bars = svg.selectAll("rect")
            .data(data, d => d.cost);

        bars.enter()
            .append('rect')
            .attr('x', d => xAxis(d.cost))
            .attr('y', d => yAxis(0))
            .attr('width', xAxis.bandwidth())
            .attr('height', 0)
            .attr('fill', "#69b3a2")
            .transition()
            .duration(800)
            .attr('y', d => yAxis(d.count))
            .attr('height', d => height - yAxis(d.count));

        bars.transition()
            .duration(800)
            .attr('y', d => yAxis(d.count))
            .attr('height', d => height - yAxis(d.count));

        bars.exit().remove();
    }
}

export { ManaCost };
