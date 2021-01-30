import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/ActionCreators';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function AfterMessage() {
  const classes = useStyles();
  const deleteUser = useSelector(state => state.DeleteUser)

  const dispatch = useDispatch();

  React.useEffect(() => {
    if(deleteUser.status === 'succeeded') {
      setTimeout(
        function() {
          handleProceed()
      }, 3000);
    }
  }, [deleteUser]);

  const handleProceed = () => {
    dispatch(logout());
  };

  return (
    <div className={classes.root}>
      <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        Your sciForum account has successfully been deleted — <Button style={{textTransform: "none"}} onClick={handleProceed} color="inherit"><strong>you will be redirected!</strong></Button>
      </Alert>
    </div>
  );
}