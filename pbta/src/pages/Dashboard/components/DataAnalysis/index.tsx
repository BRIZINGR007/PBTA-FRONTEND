import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import D3BarChart from '../../../../components/Charts/BarChart';

interface BudgetComparisonProps {
    monthlyBudget?: number;
    actualExpense?: number;
}

const BudgetComparisonChart: React.FC<BudgetComparisonProps> = ({
    monthlyBudget = 20000.00,
    actualExpense = 315000.00
}) => {

    return (
        <div className="data-analysis-container">
            <h2>Budget Management</h2>
            <D3BarChart
                monthlyBudget={monthlyBudget}
                actualExpense={actualExpense}
            />
        </div>
    );
};

export default BudgetComparisonChart;