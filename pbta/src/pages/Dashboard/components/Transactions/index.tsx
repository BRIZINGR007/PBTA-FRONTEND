import axios from 'axios';
import './Transactions.css';
import { useState } from 'react';
import EditTransactionDialog from '../../../../components/Dialog/EditTransaction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

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
    const handleDelete = async (transactionId: string) => {
        try {
            await axios.delete(
                `http://localhost:8000/api/expense-tracker/delete-transaction/`,
                {
                    params: { transaction_id: transactionId },
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
            await axios.patch(
                `http://localhost:8000/api/expense-tracker/edit-transaction/`,
                updatedTransaction,
                {
                    params: { transaction_id: updatedTransaction.transaction_id },
                    headers: {
                        'Content-Type': 'application/json'
                    },
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
                            {transactions.map((tx) => (
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
