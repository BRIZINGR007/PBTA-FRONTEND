// src/hooks/useTransactionSummary.ts

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants/constants';

interface SummaryData {
    id: number;
    month: string;
    total_expense: string;
    total_income: string;
    balance: string;
    monthly_budget: string;
    user: string;
}


const useGetTransactionSummary = (month: string) => {
    const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSummaryData = useCallback(async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${API_BASE_URL}/api/expense-tracker/get-transaction-summary-by-month/?month=${month}`, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                withCredentials: true
            });
            setSummaryData(response.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [month]); // ✅ depends on `month`

    useEffect(() => {
        fetchSummaryData();
    }, [fetchSummaryData]); // ✅ now warning is gone

    return { summaryData, loading, error, refetch: fetchSummaryData };
};

export default useGetTransactionSummary;
