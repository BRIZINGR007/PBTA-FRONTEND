import React from 'react';
import { Skeleton } from '@mui/material';
import './TransactionSummary.css';

interface SkeletonProps {
    handlePreviousMonth: () => void;
    handleNextMonth: () => void;
}

const TransactionSummarySkeleton: React.FC<SkeletonProps> = ({ handlePreviousMonth, handleNextMonth }) => {
    return (
        <div className="transaction-summary">
            <button className="nav-button" onClick={handlePreviousMonth}>&lt;</button>
            <div className="summary-content">
                <div className="month-display">
                    <div className="month-box">
                        <Skeleton variant="rectangular" width="100%" height={30} animation="wave" />
                    </div>
                    <div className="info-box">
                        <Skeleton variant="text" width="60%" height={24} animation="wave" />
                    </div>
                    <div className="info-box">
                        <Skeleton variant="text" width="60%" height={24} animation="wave" />
                    </div>
                    <div className="info-box">
                        <Skeleton variant="text" width="60%" height={24} animation="wave" />
                    </div>
                    <div className="info-box">
                        <Skeleton variant="text" width="60%" height={24} animation="wave" />
                    </div>
                </div>
            </div>
            <div className="action-panel">
                <Skeleton variant="rectangular" width={150} height={40} animation="wave" style={{ marginRight: '10px' }} />
                <Skeleton variant="rectangular" width={150} height={40} animation="wave" />
            </div>
            <button className="nav-button" onClick={handleNextMonth}>&gt;</button>
        </div>
    );
};

export default TransactionSummarySkeleton;
