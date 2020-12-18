import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  ThemeProvider,
  Typography,
} from '@material-ui/core';
import { QuestionAnswer, Visibility, Inbox } from '@material-ui/icons';
import { profileDetailTheme, useStyles } from './styles/profileStyles';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from '../../redux/ActionCreators';

export default function Highlights(props) {

  const classes = useStyles();

  const user = useSelector(state => state.User);

  const dispatch = useDispatch();

  const usernameFromTheUrl = props.match.params.username;

  const [values, setValues] = useState({
    posts: user.user && user.user.profile ? user.user.profile.location: null,
    answers: user.user ? user.user.answers: null,
    postViews: user.user && user.user.profile ? user.user.profile.postViews: null,
  });

  React.useEffect(() => {
    if(user.status === 'idle') {
      dispatch(fetchUser(null, usernameFromTheUrl));
    }
  }, [user, usernameFromTheUrl, dispatch]);

  React.useEffect(() => {
    if(user.user && user.user.profile) {
      handleUserInfo(user.user.posts, user.user.answers, user.user.profile.postViews);
    }
  }, [user]);

  const handleUserInfo = (posts, answers, postViews) => {
    setValues({
      posts,
      answers,
      postViews,
    });
  }

  if(user.status === 'loading' || user.status === 'idle') {
    return(<div></div>);
  }else if(user.status === 'failed') {
    return <h2>Error loading!</h2>
  }else {
    return (
      <ThemeProvider theme={profileDetailTheme}>
        <Card className={classes.root} elevation={1}>
          <Grid container direction="column" justify="flex-start" alignItems="flex-start" spacing={1}>
            <Grid item>
              <CardHeader className={classes.cardHeader} title="Highlights"/>
            </Grid>
            <Divider className={classes.divider}/>
            <Grid item>
              <CardContent className={classes.cardContent}>
                <Grid container direction="column" justify="center" alignItems="flex-start" spacing={1}>
                  <Grid item>
                    <Typography className={classes.iconWrap}><Inbox style={{marginRight: 8, fill: "gray"}}/>{values.posts}{values.posts === 1 ? " Question": " Questions"}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography className={classes.iconWrap}><QuestionAnswer style={{marginRight: 8, fill: "gray"}}/>{values.answers}{values.answers === 1 ? " Answer": " Answers"}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography className={classes.iconWrap}><Visibility style={{marginRight: 8, fill: "gray"}}/>{values.postViews == null ? 0 + " Total Question Views": values.postViews + " Total Question Views"}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </ThemeProvider>
    );
  }
};
