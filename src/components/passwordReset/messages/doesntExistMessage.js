import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Link } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function ResetErrorMessage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Alert severity="error">
        <AlertTitle>Session Expired</AlertTitle>
        This session has been expired. Try requesting a new password reset link — <Link href="/password/reset" color="inherit" underline="none"><strong>click here!</strong></Link>
      </Alert>
    </div>
  );
}