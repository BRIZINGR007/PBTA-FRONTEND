import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem
} from '@mui/material';
import './TransactionSummary.css';
import axios from 'axios';
import { API_BASE_URL } from '../../../../constants/constants';
import TransactionSummarySkeleton from './TransactionSummarySkeleton';
import AddTransactionDialog from '../../../../components/Dialog/AddTransaction';



interface TransactionSummaryProps {
    month: string;
    setMonth: React.Dispatch<React.SetStateAction<string>>;
    refetchTrans: () => Promise<void>;
    summaryData: any;
    loading: boolean;
    error: any;
    refetchTransSummary: () => Promise<void>;
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({ month, setMonth, refetchTrans, summaryData, loading, error, refetchTransSummary }) => {
    const [showBudgetDialog, setShowBudgetDialog] = useState(false);
    const [showTransactionDialog, setShowTransactionDialog] = useState(false);
    const [budgetInput, setBudgetInput] = useState('');
    const [transactionData, setTransactionData] = useState({
        transaction_type: '',
        amount: '',
        description: '',
    });


    const handleAddMonthlyBudget = async () => {
        try {
            await axios.patch(
                `${API_BASE_URL}/api/expense-tracker/add-monthly-budget/`,
                { amount: parseFloat(budgetInput), month },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            setShowBudgetDialog(false);
            setBudgetInput('');
            await refetchTransSummary();
        } catch (err: any) {
            alert(`Failed to add budget: ${err.message}`);
        }
    };

    const handleAddTransaction = async () => {
        try {
            console.log("Month", { ...transactionData, amount: parseFloat(transactionData.amount), month },);
            await axios.post(
                `${API_BASE_URL}/api/expense-tracker/add-transaction/`,
                { ...transactionData, amount: parseFloat(transactionData.amount), month },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            setShowTransactionDialog(false);
            setTransactionData({
                transaction_type: '',
                amount: '',
                description: '',

            });
            await refetchTransSummary();
            await refetchTrans();
        } catch (err: any) {
            alert(`Failed to add transaction: ${err.message}`);
        }
    };

    const handlePreviousMonth = () => {
        const prevMonth = new Date(month);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        setMonth(prevMonth.toISOString().slice(0, 10));
    };

    const handleNextMonth = () => {
        const nextMonth = new Date(month);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        setMonth(nextMonth.toISOString().slice(0, 10));
    };

    const formatDisplayMonth = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const monthName = date.toLocaleString('default', { month: 'long' });
        return `${year} ${monthName}`;
    };


    if (loading) return <TransactionSummarySkeleton handlePreviousMonth={handlePreviousMonth} handleNextMonth={handleNextMonth} />;

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!summaryData) return <p>No data available</p>;

    return (
        <div className="transaction-summary">
            <button className="nav-button" onClick={handlePreviousMonth}>&lt;</button>
            <div className="summary-content">
                <div className="month-display">
                    <div className="month-box">{formatDisplayMonth(month)}</div>
                    <div className="info-box">Income: {parseFloat(summaryData.total_income).toLocaleString()}</div>
                    <div className="info-box">Balance: {parseFloat(summaryData.balance).toLocaleString()}</div>
                    <div className="info-box">Expenses: {parseFloat(summaryData.total_expense).toLocaleString()}</div>
                    <div className="info-box">Monthly Budget: {parseFloat(summaryData.monthly_budget).toLocaleString()}</div>
                </div>
            </div>
            <div className="action-panel">
                <button className="action-button" onClick={() => setShowBudgetDialog(true)}>Add Monthly Budget</button>
                <button className="action-button" onClick={() => setShowTransactionDialog(true)}>Add Transaction</button>
            </div>
            <button className="nav-button" onClick={handleNextMonth}>&gt;</button>

            {/* Add Monthly Budget Dialog */}
            <Dialog open={showBudgetDialog} onClose={() => setShowBudgetDialog(false)}>
                <DialogTitle>Add Monthly Budget</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Budget Amount"
                        type="number"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={budgetInput}
                        onChange={(e) => setBudgetInput(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowBudgetDialog(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleAddMonthlyBudget} variant="contained" color="primary">Submit</Button>
                </DialogActions>
            </Dialog>

            {/* Add Transaction Dialog */}
            <AddTransactionDialog
                open={showTransactionDialog}
                onClose={() => setShowTransactionDialog(false)}
                onSubmit={handleAddTransaction}
                transactionData={transactionData}
                setTransactionData={setTransactionData}
            />
        </div>
    );
};

export default TransactionSummary;
