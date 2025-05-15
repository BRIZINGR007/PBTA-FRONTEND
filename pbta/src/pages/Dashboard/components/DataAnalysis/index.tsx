import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface BudgetComparisonProps {
    monthlyBudget?: number;
    actualExpense?: number;
}

const BudgetComparisonChart: React.FC<BudgetComparisonProps> = ({
    monthlyBudget = 20000.00,
    actualExpense = 315000.00
}) => {
    const chartRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        // Clear any existing chart
        d3.select(chartRef.current).selectAll('*').remove();

        // Chart dimensions
        const width = 600;
        const height = 400;
        const margin = { top: 50, right: 50, bottom: 70, left: 80 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Format numbers for better readability
        const formatCurrency = (value: number) =>
            new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
            }).format(value);

        // Create SVG
        const svg = d3.select(chartRef.current)
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('style', 'max-width: 100%; height: auto;');

        // Create chart group
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Data preparation
        const data = [
            { category: 'Monthly Budget', value: monthlyBudget },
            { category: 'Actual Expense', value: actualExpense }
        ];

        // Scales
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.category))
            .range([0, innerWidth])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value) as number * 1.1])
            .range([innerHeight, 0]);

        // X-axis
        g.append('g')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold');

        // Y-axis
        g.append('g')
            .call(d3.axisLeft(yScale).tickFormat(d => formatCurrency(d as number)))
            .selectAll('text')
            .attr('font-size', '12px');

        // Y-axis label
        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -margin.left + 20)
            .attr('x', -innerHeight / 2)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .text('Amount (USD)');

        // Title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', margin.top / 2)
            .attr('text-anchor', 'middle')
            .attr('font-size', '18px')
            .attr('font-weight', 'bold')
            .text('Budget vs. Actual Expense Comparison');

        // Calculate percent over budget
        const percentOverBudget = ((actualExpense - monthlyBudget) / monthlyBudget * 100).toFixed(1);

        // Add annotation about the difference
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height - margin.bottom / 3)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('font-style', 'italic')
            .text(`Actual is ${percentOverBudget}% of monthly budget`);

        // Color scale
        const colorScale = d3.scaleOrdinal<string>()
            .domain(data.map(d => d.category))
            .range(['#4CAF50', actualExpense > monthlyBudget ? '#f44336' : '#2196F3']);

        // Bars
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
            .attr('rx', 4) // Rounded corners
            .attr('ry', 4);

        // Add value labels on top of bars
        g.selectAll('.label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', d => (xScale(d.category) as number) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d.value) - 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .text(d => formatCurrency(d.value));

    }, [monthlyBudget, actualExpense]);

    return (
        <div className="budget-comparison-chart w-full max-w-3xl mx-auto bg-white p-4 rounded-lg shadow-md">
            <svg ref={chartRef} className="w-full"></svg>
        </div>
    );
};

export default BudgetComparisonChart;