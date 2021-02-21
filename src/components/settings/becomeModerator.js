import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
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

export default function BecomeModerator() {
  const classes = useStyles();
  const auth = useSelector(state => state.Auth);

  if(auth.currentUserRole !== 'MODERATOR') {
    return (
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
            <Link to="/settings" style={{textDecoration: "none"}}>
            <Button className={classes.button} size="small" variant="outlined" >Proceed</Button>
            </Link>
        </CardActions>
        </Card>
    );
  }else {
      return(<div></div>)
  }
}
