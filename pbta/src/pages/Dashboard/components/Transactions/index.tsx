import './Transactions.css';

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
}

const Transactions: React.FC<TransactionsProps> = ({
    transactions,
    loading,
    numPages,
    currentPage,
    setCurrentPage
}) => {
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
