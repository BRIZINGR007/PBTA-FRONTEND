import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem
} from '@mui/material';

interface AddTransactionDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    transactionData: {
        transaction_type: string;
        amount: string;
        description: string;
    };
    setTransactionData: React.Dispatch<React.SetStateAction<{
        transaction_type: string;
        amount: string;
        description: string;
    }>>;
}

const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({
    open,
    onClose,
    onSubmit,
    transactionData,
    setTransactionData
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogContent>
                <TextField
                    select
                    label="Transaction Type"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={transactionData.transaction_type}
                    onChange={(e) => setTransactionData({ ...transactionData, transaction_type: e.target.value })}
                >
                    <MenuItem value="Salary">Salary</MenuItem>
                    <MenuItem value="Grocery">Grocery</MenuItem>
                    <MenuItem value="Entertainment">Entertainment</MenuItem>
                </TextField>
                <TextField
                    label="Amount"
                    type="number"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={transactionData.amount}
                    onChange={(e) => setTransactionData({ ...transactionData, amount: e.target.value })}
                />
                <TextField
                    label="Description"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={transactionData.description}
                    onChange={(e) => setTransactionData({ ...transactionData, description: e.target.value })}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={onSubmit} variant="contained" color="primary">Submit</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddTransactionDialog;
