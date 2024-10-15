import * as d3 from 'd3';

class ManaColor {
    build(data, element) {
        const width = 300;
        const height = 300;
        const radius = Math.min(width, height) / 2;

        console.log("Data for pie chart:", data);

        if (data.length < 2) {
            data.push({ color: "None", count: 0 });
        }

        const colorMapping = {
            "White": "#ffffff",
            "Blue": "#4682B4",
            "Black": "#000000",
            "Red": "#B22222",
            "Green": "#228B22",
            "Colorless": "#A9A9A9",
            "None": "#d3d3d3"
        };

        const color = d3.scaleOrdinal()
            .domain(Object.keys(colorMapping))
            .range(Object.values(colorMapping));

        const pie = d3.pie()
            .value(d => d.count)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        d3.select(element).select("svg").remove();

        const svg = d3.select(element)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const arcs = svg.selectAll('arc')
            .data(pie(data))
            .enter()
            .append('g')
            .attr('class', 'arc');

        arcs.append('path')
            .attr('d', arc)
            .attr('fill', d => {
                console.log(`Assigning color ${d.data.color} to count ${d.data.count}`);
                return color(d.data.color);
            })
            .attr('stroke', "#000000")
            .attr('stroke-width', 1);
    }
}

export { ManaColor };
