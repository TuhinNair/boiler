import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import React, { useState, useEffect } from 'react';

export let openSnackbarExternal;

const Notifier = () => {
  const [state, setState] = useState({ open: false, message: '' });

  const handleSnackbarClose = () => {
    setState({ open: false, message: '' });
  };

  const openSnackbar = ({ message }) => {
    setState({ open: true, message });
  };

  useEffect(() => {
    openSnackbarExternal = openSnackbar;
  }, []);

  const message = (
    <span id="snackbar-message-id" dangerouslySetInnerHTML={{ __html: state.message }} />
  );

  return (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        message={message}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        open={state.open}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
      />
    </React.Fragment>
  );
};

export default Notifier;
