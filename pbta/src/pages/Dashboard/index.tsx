import { useState } from 'react';
import Transactions from './components/Transactions';
import TransactionSummary from './components/TransactionSummary';
import './Dashboard.css'
import useGetTransactions from '../../hooks/useGetTransactions';
import BudgetComparisonChart from './components/DataAnalysis';
import useGetTransactionSummary from '../../hooks/useGetTransactionSummary';



const Dashboard: React.FC = () => {
    const [month, setMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    });

    const {
        transactions,
        loading,
        numPages,
        currentPage,
        setCurrentPage,
        refetchTrans
    } = useGetTransactions(month, 1);
    const { summaryData,
        loading: transactionSummaryLoading,
        error: transactionSummaryError,
        refetch: refetchTransSummary } = useGetTransactionSummary(month);

    const handleLogout = () => {
        // Add your logout logic here
        console.log("Logged out");
    };
    return (
        <>
            <nav className="navbar">
                <div className="navbar-title">Dashboard</div>
                <div className="logout-icon" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                </div>
            </nav>
            <div className="dashboard-content">
                <TransactionSummary
                    month={month}
                    setMonth={setMonth}
                    refetchTrans={refetchTrans}
                    summaryData={summaryData}
                    loading={transactionSummaryLoading}
                    error={transactionSummaryError}
                    refetchTransSummary={refetchTransSummary}
                />
                <Transactions
                    transactions={transactions}
                    loading={loading}
                    numPages={numPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    refetchTransactions={refetchTrans}
                    refetchTransSummary={refetchTransSummary}
                />
                <BudgetComparisonChart
                    monthlyBudget={parseFloat(summaryData?.monthly_budget || '0')}
                    actualExpense={parseFloat(summaryData?.total_expense || '0')}
                />

            </div>
        </>
    )

}

export default Dashboard;