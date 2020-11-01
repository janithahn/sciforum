import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

export default function AlertSnackbar({ message, open, setOpen }) {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        open={open}
        onClose={handleClose}
        TransitionComponent={Slide}
        autoHideDuration={3000}
        message={message}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      />
    </div>
  );
}
