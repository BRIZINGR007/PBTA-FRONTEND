import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface D3BarChartProps {
    leftValue: number;
    rightValue: number;
    leftLabel?: string;
    rightLabel?: string;
    title?: string;
    subtitle?: string;
    width?: number;
    height?: number;
}

const D3BarChart: React.FC<D3BarChartProps> = ({
    leftValue,
    rightValue,
    leftLabel = 'Monthly Budget',
    rightLabel = 'Actual Expense',
    title = 'Budget vs. Actual Expense Comparison',
    subtitle = '(Indian Rupees)',
    width = 600,
    height = 400
}) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        // Clear any existing chart
        d3.select(svgRef.current).selectAll('*').remove();

        // Chart dimensions with improved spacing
        const margin = { top: 60, right: 60, bottom: 80, left: 90 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Format numbers for better readability
        const formatCurrency = (value: number) =>
            new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            }).format(value);

        // Create SVG with responsive attributes
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('style', 'max-width: 100%; height: auto; font-family: Arial, sans-serif;');

        // Add a subtle background for better visual appeal
        svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', '#f9f9f9')
            .attr('rx', 8)
            .attr('ry', 8);

        // Create chart group
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Data preparation
        const data = [
            { category: leftLabel, value: leftValue },
            { category: rightLabel, value: rightValue }
        ];

        // Scales
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.category))
            .range([0, innerWidth])
            .padding(0.3); // Increased padding for wider spacing between bars

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value) as number * 1.2]) // Increased headroom
            .range([innerHeight, 0]);

        // Add grid lines for better readability
        g.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(
                d3.axisBottom(xScale)
                    .tickSize(-innerHeight)
                    .tickFormat(() => '')
            )
            .attr('stroke-opacity', 0.1)
            .select('.domain')
            .attr('stroke-opacity', 0);

        g.append('g')
            .attr('class', 'grid')
            .call(
                d3.axisLeft(yScale)
                    .tickSize(-innerWidth)
                    .tickFormat(() => '')
            )
            .attr('stroke-opacity', 0.1)
            .select('.domain')
            .attr('stroke-opacity', 0);

        // X-axis with styled text
        g.append('g')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(xScale))
            .attr('font-size', '13px')
            .attr('font-weight', 'bold')
            .selectAll('text')
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('font-weight', 'bold');

        // Y-axis with improved styling
        g.append('g')
            .call(d3.axisLeft(yScale)
                .tickFormat(d => formatCurrency(d as number))
                .ticks(8)) // More ticks for better readability
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .selectAll('text')
            .style('font-weight', 'bold');

        // Enhance axis paths and ticks
        svg.selectAll('.domain, .tick line')
            .attr('stroke-width', 1.5)
            .attr('stroke', '#888');

        // Y-axis label with improved styling
        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -margin.left + 25)
            .attr('x', -innerHeight / 2)
            .attr('text-anchor', 'middle')
            .attr('font-size', '15px')
            .attr('font-weight', 'bold')
            .attr('fill', '#333')
            .text('Amount');

        // Title with enhanced styling
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', margin.top / 2)
            .attr('text-anchor', 'middle')
            .attr('font-size', '20px')
            .attr('font-weight', 'bold')
            .attr('fill', '#333')
            .text(title);

        // Subtitle with currency indicator
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', margin.top / 2 + 25)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('font-style', 'italic')
            .attr('fill', '#555')
            .text(subtitle);

        // Calculate percentage difference for the appropriate comparison context
        const percentDiff = ((rightValue - leftValue) / leftValue * 100).toFixed(1);

        // Dynamic difference text based on the labels
        let diffText = '';
        let diffColor = '';

        // For Budget vs Expense comparison
        if (leftLabel.toLowerCase().includes('budget') && rightLabel.toLowerCase().includes('expense')) {
            diffText = rightValue > leftValue
                ? `Actual is ${percentDiff}% over budget`
                : rightValue < leftValue
                    ? `Actual is ${Math.abs(Number(percentDiff))}% under budget`
                    : 'Actual expense matches budget exactly';
            diffColor = rightValue > leftValue ? '#d32f2f' : '#0277bd';
        }
        // For Income vs Expense comparison
        else if (leftLabel.toLowerCase().includes('income') && rightLabel.toLowerCase().includes('expense')) {
            diffText = rightValue > leftValue
                ? `Expenses exceed income by ${percentDiff}%`
                : rightValue < leftValue
                    ? `${Math.abs(Number(percentDiff))}% of income saved`
                    : 'Expenses equal income';
            diffColor = rightValue > leftValue ? '#d32f2f' : '#0277bd';
        }
        // Default comparison
        else {
            diffText = rightValue > leftValue
                ? `${rightLabel} is ${percentDiff}% higher than ${leftLabel}`
                : rightValue < leftValue
                    ? `${rightLabel} is ${Math.abs(Number(percentDiff))}% lower than ${leftLabel}`
                    : `${rightLabel} equals ${leftLabel}`;
            diffColor = rightValue > leftValue ? '#d32f2f' : '#0277bd';
        }

        // Add annotation about the difference with better positioning and styling
        svg.append('rect')
            .attr('x', width / 2 - 150)
            .attr('y', height - margin.bottom / 2 - 15)
            .attr('width', 300)
            .attr('height', 30)
            .attr('rx', 15)
            .attr('ry', 15)
            .attr('fill', rightValue > leftValue ? '#ffecec' : '#e6f7ff')
            .attr('stroke', rightValue > leftValue ? '#ffcdd2' : '#b3e5fc')
            .attr('stroke-width', 1);

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height - margin.bottom / 2 + 5)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .attr('fill', diffColor)
            .text(diffText);

        // Dynamic color for the second bar based on the comparison result
        const rightBarColor =
            leftLabel.toLowerCase().includes('budget') && rightValue > leftValue ? '#f44336' :
                leftLabel.toLowerCase().includes('income') && rightValue > leftValue ? '#f44336' :
                    '#2196F3';

        // Enhanced color scale with better colors
        const colorScale = d3.scaleOrdinal<string>()
            .domain(data.map(d => d.category))
            .range(['#4CAF50', rightBarColor]);

        // Drop shadow filter for 3D effect
        const defs = svg.append('defs');
        const filter = defs.append('filter')
            .attr('id', 'drop-shadow')
            .attr('height', '130%');

        filter.append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', 3)
            .attr('result', 'blur');

        filter.append('feOffset')
            .attr('in', 'blur')
            .attr('dx', 2)
            .attr('dy', 2)
            .attr('result', 'offsetBlur');

        const feComponentTransfer = filter.append('feComponentTransfer')
            .attr('in', 'offsetBlur')
            .attr('result', 'offsetBlurAlpha');

        feComponentTransfer.append('feFuncA')
            .attr('type', 'linear')
            .attr('slope', 0.3);

        const feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode')
            .attr('in', 'offsetBlurAlpha');
        feMerge.append('feMergeNode')
            .attr('in', 'SourceGraphic');

        // Bars with enhanced styling
        g.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.category) as number)
            .attr('y', d => yScale(d.value))
            .attr('width', xScale.bandwidth())
            .attr('height', d => innerHeight - yScale(d.value))
            .attr('fill', d => colorScale(d.category))
            .attr('rx', 6) // Increased rounded corners
            .attr('ry', 6)
            .attr('filter', 'url(#drop-shadow)') // Apply shadow
            .attr('opacity', 0.9)
            .on('mouseover', function () {
                d3.select(this)
                    .attr('opacity', 1)
                    .attr('stroke', '#333')
                    .attr('stroke-width', 2);
            })
            .on('mouseout', function () {
                d3.select(this)
                    .attr('opacity', 0.9)
                    .attr('stroke', 'none');
            });

        // Add value labels on top of bars with improved styling
        g.selectAll('.label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', d => (xScale(d.category) as number) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d.value) - 15)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .attr('fill', '#333')
            .text(d => formatCurrency(d.value))
            .attr('filter', 'url(#drop-shadow)');

        // Add small icons or indicators on the bars
        g.selectAll('.icon')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'icon')
            .attr('x', d => (xScale(d.category) as number) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d.value) + 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '16px')
            .attr('fill', '#fff')
            .text('₹');

    }, [leftValue, rightValue, leftLabel, rightLabel, title, subtitle, width, height]);

    return <svg ref={svgRef} className="w-full"></svg>;
};

export default D3BarChart;