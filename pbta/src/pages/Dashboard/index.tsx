import { useState } from 'react';
import Transactions from './components/Transactions';
import TransactionSummary from './components/TransactionSummary';
import './Dashboard.css'
import useGetTransactions from '../../hooks/useGetTransactions';



const Dashboard: React.FC = () => {
    const [month, setMonth] = useState('2025-05-01');
    const {
        transactions,
        loading,
        numPages,
        currentPage,
        setCurrentPage,
        refetchTrans
    } = useGetTransactions(month, 1);

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
                <TransactionSummary month={month} setMonth={setMonth} refetchTrans={refetchTrans} />
                <Transactions
                    transactions={transactions}
                    loading={loading}
                    numPages={numPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />

            </div>
        </>
    )

}

export default Dashboard;