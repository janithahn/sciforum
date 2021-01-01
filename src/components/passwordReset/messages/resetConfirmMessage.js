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

export default function ResetConfirmMessage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        Your password has successfully been reset — <Link href="/signin" color="inherit" underline="none"><strong>login back!</strong></Link>
      </Alert>
    </div>
  );
}