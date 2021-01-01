import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

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

export default function ResetPassword() {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} variant="h5" color="inherit" gutterBottom>
          Reset Password
        </Typography>
        <Typography variant="body1" component="h2">
          Reset the password for your sciForum account.
        </Typography>
        <br/>
        <Typography variant="body1" component="h2" color="inherit">
          This will send a password reset link to your email related to your sciForum account for confirmation. The link will direct you to the password reset page.
        </Typography>
      </CardContent>
      <CardActions>
        <Link to="/password/reset" style={{textDecoration: "none"}}>
            <Button className={classes.button} size="small" variant="outlined" >Reset Password</Button>
        </Link>
      </CardActions>
    </Card>
  );
}
