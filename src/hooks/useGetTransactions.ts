import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants/constants';

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

const useGetTransactions = (month: string, page: number) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [currentPage, setCurrentPage] = useState(page);
    const [numPages, setNumPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get<TransactionResponse>(
                `${API_BASE_URL}/api/expense-tracker/get-transactions/`,
                {
                    params: {
                        month,
                        page: currentPage,
                    },
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            setTransactions(response.data.transactions);
            setNumPages(response.data.num_pages);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [month, currentPage]);
    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return {
        transactions,
        loading,
        error,
        numPages,
        currentPage,
        setCurrentPage,
        refetchTrans: fetchTransactions,
    };
};

export default useGetTransactions;
