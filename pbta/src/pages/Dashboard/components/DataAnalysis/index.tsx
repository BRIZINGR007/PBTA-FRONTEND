import React from 'react';
import D3BarChart from '../../../../components/Charts/BarChart';
import "./DataAnalysis.css"
interface BudgetComparisonProps {
    monthlyBudget?: number;
    actualExpense?: number;
    totalIncome?: number;
}

const BudgetComparisonChart: React.FC<BudgetComparisonProps> = ({
    monthlyBudget = 0.0,
    actualExpense = 0.0,
    totalIncome = 0.0,
}) => {
    return (
        <div className="budget-comparison-container">
            <h2 className="budget-comparison-heading">Budget Management</h2>
            <div className="chart-row">
                <div className="chart-wrapper">
                    <D3BarChart
                        leftValue={monthlyBudget}
                        rightValue={actualExpense}
                        leftLabel="Monthly Budget"
                        rightLabel="Actual Expense"
                        title="Budget vs. Actual Expense Comparison"
                        subtitle="(Indian Rupees)"
                    />
                </div>
                <div className="chart-wrapper">
                    <D3BarChart
                        leftValue={totalIncome}
                        rightValue={actualExpense}
                        leftLabel="Total Income"
                        rightLabel="Actual Expense"
                        title="Income vs. Expense Comparison"
                        subtitle="(Indian Rupees)"
                    />
                </div>
            </div>
        </div>
    );
};

export default BudgetComparisonChart;
