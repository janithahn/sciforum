import React from 'react';
import {
  Container,
  Grid,
  makeStyles,
  Hidden
} from '@material-ui/core';
import Profile from './Profile';
import Highlights from './Highlights';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Account = (props) => {
  const classes = useStyles();

  return (
    <Container className={classes.root} maxWidth="lg">
      <Grid container spacing={3}>
        <Grid
          item
          lg={8}
          md={6}
          xs={12}
        >
          <Profile match={props.match}/>
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xs={12}
        >
          <Hidden smDown>
            <Highlights match={props.match}/>
          </Hidden>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Account;
