import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AlertDialogSlide from './alert'
import { useSelector } from 'react-redux';

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  title: {
    //fontSize: 14,
  },
  button: {
    color: '#e53935'
  },
});

export default function DeleteAccount() {
  const classes = useStyles();

  const auth = useSelector(state => state.Auth)

  const [open, setOpen] = React.useState(false);

  const handleDialogSlideOpen = () => {
      setOpen(true);
  };

  const handleClose = () => {
      setOpen(false);
  };

  return (
    <React.Fragment>
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Typography className={classes.title} variant="h5" color="inherit" gutterBottom>
            Delete Account
          </Typography>
          <Typography variant="body1" component="h2">
            This deletes all your sciForum data.
          </Typography>
          <br/>
          <Typography variant="body1" component="h2" color="inherit">
            <strong>Note: Once you delete your account, it cannot be undone.</strong>
          </Typography>
        </CardContent>
        <CardActions>
          <Button onClick={handleDialogSlideOpen} className={classes.button} size="small" variant="outlined">Delete</Button>
        </CardActions>
      </Card>
      <AlertDialogSlide open={open} handleClose={handleClose} username={auth.currentUser}/>
    </React.Fragment>
  );
}
