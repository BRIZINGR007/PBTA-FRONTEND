import { useState } from 'react';
import Transactions from './components/Transactions';
import TransactionSummary from './components/TransactionSummary';
import './Dashboard.css'
import useGetTransactions from '../../hooks/useGetTransactions';
import BudgetComparisonChart from './components/DataAnalysis';
import useGetTransactionSummary from '../../hooks/useGetTransactionSummary';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../constants/constants';



const Dashboard: React.FC = () => {
    const [month, setMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    });
    const navigate = useNavigate();

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

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(`${API_BASE_URL}/api/users/logout/`, {}, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                withCredentials: true
            }
            );
            localStorage.removeItem('authToken');
            console.log('Token removed from localStorage');
            console.log("Succesfully  Logged Out :", response.data);
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
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
                    totalIncome={parseFloat(summaryData?.total_income || '0')}
                />

            </div>
        </>
    )

}

export default Dashboard;