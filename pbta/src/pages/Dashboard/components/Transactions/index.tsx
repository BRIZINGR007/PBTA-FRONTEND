import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Transactions.css';
import { API_BASE_URL } from '../../../../constants/constants';

type Transaction = {
    id: number;
    transaction_id: string;
    transaction_type: string;
    transaction_category: string;
    amount: string;
    description: string;
    month: string;
    created_at: string;
    user: string;
};

type TransactionResponse = {
    transactions: Transaction[];
    total: number;
    num_pages: number;
    current_page: number;
};
interface TransactionsProps {
    month: string;
}

const Transactions: React.FC<TransactionsProps> = ({ month }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [numPages, setNumPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchTransactions = async (page = 1) => {
        try {
            setLoading(true);
            const response = await axios.get<TransactionResponse>(
                `${API_BASE_URL}/api/expense-tracker/get-transactions/`,
                {
                    params: {
                        page,
                        month,
                    },
                    withCredentials: true,
                }
            );
            setTransactions(response.data.transactions);
            setNumPages(response.data.num_pages);
            setCurrentPage(response.data.current_page);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions(currentPage);
    }, [currentPage, month]);
    return (
        <div className="transactions-container">
            <h2>Transactions</h2>
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
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.transaction_id}>
                                    <td>{new Date(tx.created_at).toLocaleDateString()}</td>
                                    <td>{tx.transaction_type}</td>
                                    <td>{tx.transaction_category}</td>
                                    <td>{tx.description}</td>
                                    <td>₹ {parseFloat(tx.amount).toLocaleString()}</td>
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
        </div>
    );

};

export default Transactions;
