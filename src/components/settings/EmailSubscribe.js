import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { EmailSubscribeAlert, EmailUnsubscribeAlert } from './alert'
import { useSelector } from 'react-redux';

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

export default function EmailSubscribe() {
  const classes = useStyles();

  const auth = useSelector(state => state.Auth);
  const subscribeEmail = useSelector(state => state.SubscribeEmail);

  const [open, setOpen] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(auth.is_email_subscribed);

  const handleDialogSlideOpen = () => {
      setOpen(true);
  };

  const handleClose = () => {
      setOpen(false);
  };

  React.useEffect(() => {
    if(subscribeEmail.subscribe_status === "succeeded") {
        setIsSubscribed(true);
    }
    if(subscribeEmail.unsubscribe_status === "succeeded") {
        setIsSubscribed(false);
    }
  }, [subscribeEmail]);

  if(auth.currentUserEmailVerified.toString() === 'true' && isSubscribed.toString() === 'false') {
    return (
        <React.Fragment>
        <Card className={classes.root} variant="outlined">
            <CardContent>
            <Typography className={classes.title} variant="h5" color="inherit" gutterBottom>
                Subscribe for Email Notifications
            </Typography>
            <Typography variant="body1" component="h2">
                You will receive email notifications for your post activities.
            </Typography>
            <br/>
            <Typography variant="body1" component="h2" color="inherit">
                Along with the notification panel, you will receive notifications to your email as well.
            </Typography>
            </CardContent>
            <CardActions>
                <Button onClick={handleDialogSlideOpen} className={classes.button} size="small" variant="outlined">Subscribe</Button>
            </CardActions>
        </Card>
        <EmailSubscribeAlert open={open} handleClose={handleClose} userId={auth.currentUserId}/>
        </React.Fragment>
    );
  }else if(auth.currentUserEmailVerified.toString() === 'true' && isSubscribed.toString() === 'true') {
    return (
        <React.Fragment>
        <Card className={classes.root} variant="outlined">
            <CardContent>
            <Typography className={classes.title} variant="h5" color="inherit" gutterBottom>
                Unsubscribe from Email Notifications
            </Typography>
            <br/>
            <Typography variant="body1" component="h2" color="inherit">
                Unsubscribe from email notifications, if you don't want to receive emails for your post changes.
            </Typography>
            </CardContent>
            <CardActions>
                <Button onClick={handleDialogSlideOpen} className={classes.button} size="small" variant="outlined">Unsubscribe</Button>
            </CardActions>
        </Card>
        <EmailUnsubscribeAlert open={open} handleClose={handleClose} userId={auth.currentUserId}/>
        </React.Fragment>
    );
  }else {
      return <div></div>
  }
}
