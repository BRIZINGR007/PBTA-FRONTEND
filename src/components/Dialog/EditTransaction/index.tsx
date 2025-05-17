import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem
} from '@mui/material';
import { useState, useEffect } from 'react';

interface Transaction {
    transaction_id: string;
    created_at: string;
    transaction_type: string;
    transaction_category: string;
    description: string;
    amount: string;
}

interface EditTransactionDialogProps {
    open: boolean;
    onClose: () => void;
    transaction: Transaction | null;
    onSave: (updatedTransaction: Transaction) => void;
}

const EditTransactionDialog: React.FC<EditTransactionDialogProps> = ({
    open,
    onClose,
    transaction,
    onSave
}) => {
    const [editedTransaction, setEditedTransaction] = useState<Transaction | null>(null);

    useEffect(() => {
        if (transaction) {
            setEditedTransaction({ ...transaction });
        }
    }, [transaction]);

    const handleChange = (field: keyof Transaction) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (editedTransaction) {
            setEditedTransaction({
                ...editedTransaction,
                [field]: event.target.value
            });
        }
    };

    const handleSubmit = () => {
        if (editedTransaction) {
            onSave(editedTransaction);
            onClose();
        }
    };

    if (!editedTransaction) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogContent>
                <TextField
                    select
                    label="Transaction Type"
                    value={editedTransaction.transaction_type}
                    onChange={handleChange('transaction_type')}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="Salary">Salary</MenuItem>
                    <MenuItem value="Grocery">Grocery</MenuItem>
                    <MenuItem value="Entertainment">Entertainment</MenuItem>

                </TextField>

                <TextField
                    label="Description"
                    value={editedTransaction.description}
                    onChange={handleChange('description')}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Amount"
                    value={editedTransaction.amount}
                    onChange={handleChange('amount')}
                    fullWidth
                    margin="normal"
                    type="number"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditTransactionDialog;