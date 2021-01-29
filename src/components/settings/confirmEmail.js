import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useSelector, useDispatch } from 'react-redux';
import { sendConfirmationEmail } from './actionCreators';
import ConfirmationEmailAfterSnack from './afterSnack';

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  title: {
    //fontSize: 14,
  },
  button: {
    color: '#304ffe'
  },
});

export default function ConfirmEmail() {
  const classes = useStyles();

  const auth = useSelector(state => state.Auth);
  const dispatch = useDispatch();

  const handleConfirm = () => {
    dispatch(sendConfirmationEmail(auth.currentUserEmail));
  };

  if(auth.currentUserEmailVerified === "false") {
    return (
        <div>
            <Card className={classes.root} variant="outlined">
                <CardContent>
                    <Typography className={classes.title} variant="h5" color="inherit" gutterBottom>
                        Confirm Email
                    </Typography>
                    <Typography variant="body1" component="h2">
                        <strong>You have not confirmed your email yet.</strong>
                    </Typography>
                    <br/>
                    <Typography variant="body1" component="h2" color="inherit">
                        Click the button below to send the email verification link to your email.
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button onClick={() => handleConfirm()} className={classes.button} size="small" variant="outlined" >Send</Button>
                </CardActions>
            </Card>
        </div>
    );
  }else {
      return(<div></div>)
  }
}
