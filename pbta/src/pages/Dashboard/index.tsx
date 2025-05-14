import TransactionSummary from './components/TransactionSummary';
import './Dashboard.css'
const Dashboard: React.FC = () => {
    const handleLogout = () => {
        // Add your logout logic here
        console.log("Logged out");
    };
    const handleAddBudget = () => alert('Add Budget Clicked');
    const handleAddTransaction = () => alert('Add Transaction Clicked');
    const handlePreviousMonth = () => alert('Previous Month Clicked');
    const handleNextMonth = () => alert('Next Month Clicked');
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
                />
            </div>
        </>
    )

}

export default Dashboard;