import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sendConfirmationToken } from './actionCreators';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function ConfirmEmailRedirect() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const verifyAccount = useSelector(state => state.VerifyAccount)
  const auth = useSelector(state => state.Auth);

  const { token } = useParams();
  const history = useHistory();

  React.useEffect(() => {
    if(verifyAccount.status === 'idle') dispatch(sendConfirmationToken(token));
  }, [dispatch, verifyAccount.status]);

  React.useEffect(() => {
    if(verifyAccount.status === 'succeeded') {
        setTimeout(function() {
            history.push("/");
            window.location.reload();
        }, 4000);
    }
  }, [verifyAccount.status, history]);

  if(verifyAccount.status === 'loading'){
      return <div className={classes.root}>
          <Alert severity="success">
          <AlertTitle>Please wait...</AlertTitle>
              Your account is being confirmed
          </Alert>
      </div>
  } else if(verifyAccount.status === 'failed') {
      return <div className={classes.root}>
          <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
              Error occurred while verifying your account!
          </Alert>
      </div>
  } else {
    if(verifyAccount.message === 'ok') {
      return (
          <div className={classes.root}>
              <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  Thank you for confirming your email — <Link style={{textDecoration: "none", color: "inherit"}} to="/"><strong>you will be redirected!</strong></Link>
              </Alert>
          </div>
      );
    }else {
      return (
        <div className={classes.root}>
            <Alert severity="success">
                <AlertTitle>Already Verified</AlertTitle>
                Your account has already been verified! — <Link style={{textDecoration: "none", color: "inherit"}} to="/"><strong>you will be redirected!</strong></Link>
            </Alert>
        </div>
      );
    }
  }
}