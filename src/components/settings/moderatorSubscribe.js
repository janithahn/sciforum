import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { ModeratorSubscribeAlert, ModeratorUnsubscribeAlert } from './alert'
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

export default function ModeratorSubscribe() {
  const classes = useStyles();

  const auth = useSelector(state => state.Auth);
  const becomeModerator = useSelector(state => state.BecomeModerator);

  const [open, setOpen] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(auth.currentUserRole === 'MODERATOR');

  const handleDialogSlideOpen = () => {
      setOpen(true);
  };

  const handleClose = () => {
      setOpen(false);
  };

  React.useEffect(() => {
    if(becomeModerator.subscribe_status === "succeeded") {
        setIsSubscribed(true);
    }
    if(becomeModerator.unsubscribe_status === "succeeded") {
        setIsSubscribed(false);
    }
  }, [becomeModerator]);

  if(auth.currentUserEmailVerified.toString() === 'true' && isSubscribed.toString() === 'false') {
    return (
        <React.Fragment>
        <Card className={classes.root} variant="outlined">
            <CardContent>
            <Typography className={classes.title} variant="h5" color="inherit" gutterBottom>
                Become a Moderator
            </Typography>
            <Typography variant="body1" component="h2">
                If you want receive email notifications for subjects that you are interested in!
            </Typography>
            <br/>
            <Typography variant="body1" component="h2" color="inherit">
                After becoming a moderator, you will receive email notifications for the subjects that you are interested in. It helps you to keep updated about questions that people post here and you can answer those questions right away.
            </Typography>
            </CardContent>
            <CardActions>
                <Button onClick={handleDialogSlideOpen} className={classes.button} size="small" variant="outlined">Proceed</Button>
            </CardActions>
        </Card>
        <ModeratorSubscribeAlert open={open} handleClose={handleClose} userId={auth.currentUserId}/>
        </React.Fragment>
    );
  }else if(auth.currentUserEmailVerified.toString() === 'true' && isSubscribed.toString() === 'true') {
    return (
        <React.Fragment>
        <Card className={classes.root} variant="outlined">
            <CardContent>
            <Typography className={classes.title} variant="h5" color="inherit" gutterBottom>
                Unsubscribe from Moderator
            </Typography>
            <br/>
            <Typography variant="body1" component="h2" color="inherit">
                If you are no longer want to be a moderator, unsubscribe here.
            </Typography>
            </CardContent>
            <CardActions>
                <Button onClick={handleDialogSlideOpen} className={classes.button} size="small" variant="outlined">Proceed</Button>
            </CardActions>
        </Card>
        <ModeratorUnsubscribeAlert open={open} handleClose={handleClose} userId={auth.currentUserId}/>
        </React.Fragment>
    );
  }else {
      return <div></div>
  }
}
