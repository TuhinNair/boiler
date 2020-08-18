import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useState, useEffect } from 'react';

export let openConfirmDialogExternal;

const Confirmer = () => {
  const [state, setState] = useState({
    open: false,
    title: 'Are you sure?',
    message: '',
    onAnswer: null,
  });

  const handleClose = () => {
    setState({ ...state, open: false });
    state.onAnswer(false);
  };

  const handleYes = () => {
    setState({ ...state, open: false });
    state.onAnswer(true);
  };

  useEffect(() => {
    openConfirmDialogExternal = openConfirmDialog;
  }, []);

  const openConfirmDialog = ({ title, message, onAnswer }) => {
    setState({ open: true, title, message, onAnswer });
  };

  return (
    <Dialog
      open={state.open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{state.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{state.message}</DialogContentText>
      </DialogContent>
      <DialogActions style={{ padding: '10px' }}>
        <Button onClick={handleClose} variant="outlined" color="primary" autoFocus>
          Cancel
        </Button>
        <Button onClick={handleYes} variant="contained" color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Confirmer;
