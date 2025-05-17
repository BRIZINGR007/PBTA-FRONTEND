import axios from 'axios';
import './Transactions.css';
import { useState } from 'react';
import EditTransactionDialog from '../../../../components/Dialog/EditTransaction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faFilter, faCalendarAlt, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from '../../../../constants/constants';

interface Transaction {
    transaction_id: string;
    created_at: string;
    transaction_type: string;
    transaction_category: string;
    description: string;
    amount: string;
}

interface TransactionsProps {
    transactions: Transaction[];
    loading: boolean;
    numPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    refetchTransactions: () => void;
    refetchTransSummary: () => void;
}

const Transactions: React.FC<TransactionsProps> = ({
    transactions,
    loading,
    numPages,
    currentPage,
    setCurrentPage,
    refetchTransactions,
    refetchTransSummary
}) => {
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
    const [filterCategory, setFilterCategory] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterAmount, setFilterAmount] = useState('');
    const [showFilters, setShowFilters] = useState(true);

    const handleDelete = async (transactionId: string) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(
                `${API_BASE_URL}/api/expense-tracker/delete-transaction/`,
                {
                    params: { transaction_id: transactionId },
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    withCredentials: true // includes JWT from cookies
                }
            );
            refetchTransactions();
            refetchTransSummary();

        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const openEditDialog = (transaction: Transaction) => {
        setCurrentTransaction(transaction);
        setShowEditDialog(true);
    };

    const handleEdit = async (updatedTransaction: Transaction) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.patch(
                `${API_BASE_URL}/api/expense-tracker/edit-transaction/`,
                updatedTransaction,
                {
                    params: { transaction_id: updatedTransaction.transaction_id },
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    withCredentials: true
                }
            );
            refetchTransactions();
            refetchTransSummary();
        } catch (error) {
            console.error('Error editing transaction:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const resetFilters = () => {
        setFilterCategory('');
        setFilterDate('');
        setFilterAmount('');
    };

    const filteredTransactions = transactions.filter((tx) => {
        const matchCategory = filterCategory ? tx.transaction_category === filterCategory || tx.transaction_type === filterCategory : true;
        const matchDate = filterDate ? new Date(tx.created_at).toISOString().split('T')[0] === filterDate : true;
        const matchAmount = filterAmount ? parseFloat(tx.amount) >= parseFloat(filterAmount) : true;
        return matchCategory && matchDate && matchAmount;
    });

    return (
        <div className="transactions-container">
            <h2>Transaction Overview</h2>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner" />
                    <p>Loading Transactions...</p>
                </div>
            ) : transactions.length === 0 ? (
                <p className="empty-message">Add transactions to track your budget.</p>
            ) : (
                <>
                    <div className="filters-container">
                        <div className="filters-header">
                            <h3 className="filters-title">
                                <FontAwesomeIcon icon={faFilter} className="filter-icon" /> Filter Transactions
                            </h3>
                            <button
                                className="filter-toggle"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </button>
                        </div>

                        {showFilters && (
                            <div className="filters-grid">
                                <div className="filter-item">
                                    <label htmlFor="date-filter">
                                        <FontAwesomeIcon icon={faCalendarAlt} /> Date
                                    </label>
                                    <input
                                        id="date-filter"
                                        type="date"
                                        value={filterDate}
                                        onChange={(e) => setFilterDate(e.target.value)}
                                        className="filter-input date-input"
                                    />
                                </div>

                                <div className="filter-item">
                                    <label htmlFor="category-filter">Category</label>
                                    <select
                                        id="category-filter"
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                        className="filter-input select-input"
                                    >
                                        <option value="">All Categories</option>
                                        <option value="Income">Income</option>
                                        <option value="Expenses">Expenses</option>
                                    </select>
                                </div>

                                <div className="filter-item">
                                    <label htmlFor="amount-filter">
                                        <FontAwesomeIcon icon={faMoneyBillWave} /> Min Amount (₹)
                                    </label>
                                    <input
                                        id="amount-filter"
                                        type="number"
                                        value={filterAmount}
                                        onChange={(e) => setFilterAmount(e.target.value)}
                                        placeholder="0"
                                        className="filter-input amount-input"
                                    />
                                </div>

                                <div className="filter-item">
                                    <button
                                        className="filter-reset"
                                        onClick={resetFilters}
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="filter-results">
                            Showing {filteredTransactions.length} of {transactions.length} transactions
                        </div>
                    </div>

                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((tx) => (
                                <tr key={tx.transaction_id}>
                                    <td>{formatDate(tx.created_at)}</td>
                                    <td>{tx.transaction_type}</td>
                                    <td>{tx.transaction_category}</td>
                                    <td>{tx.description}</td>
                                    <td>₹ {parseFloat(tx.amount).toLocaleString()}</td>
                                    <td>
                                        <button onClick={() => openEditDialog(tx)}><FontAwesomeIcon icon={faEdit} /> Edit</button>
                                        <button onClick={() => handleDelete(tx.transaction_id)}><FontAwesomeIcon icon={faTrashAlt} /> Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        {Array.from({ length: numPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={currentPage === i + 1 ? 'active' : ''}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}
            <EditTransactionDialog
                open={showEditDialog}
                onClose={() => setShowEditDialog(false)}
                transaction={currentTransaction}
                onSave={handleEdit}
            />
        </div>
    );
};

export default Transactions;