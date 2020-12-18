import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  ThemeProvider,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { QuestionAnswer, Visibility, Inbox } from '@material-ui/icons';
import { profileDetailTheme, useStyles } from './styles/profileStyles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, fetchUser } from '../../redux/ActionCreators';

export default function Highlights(props) {

  const classes = useStyles();
  const auth = useSelector(state => state.Auth);
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

  const profileSchema = Yup.object().shape({
    location: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!'),
  });

  const formik = useFormik({
    initialValues: {
      location: values.location,
    },
    onSubmit: (values) => {
      //console.log(values);
      dispatch(updateUser(auth, values.firstname, values.lastname, values.aboutMe));
    },
    validationSchema: profileSchema,
  });

  //console.log(values.location);

  if(user.status === 'loading' || user.status === 'idle') {
    //return <CircularProgress color="secondary" size={15}/>
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
        {/*<form className={classes.root} onSubmit={formik.handleSubmit}>
          <Card className={classes.root} elevation={1}>
            <CardHeader title="Profile"/>
            <Divider className={classes.divider} style={{backgroundColor: 'inherit'}}/>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={formik.touched.firstname && formik.errors.firstname}
                    helperText={(formik.errors.firstname && formik.touched.firstname) && formik.errors.firstname}
                    id="firstname"
                    label="First name"
                    name="firstname"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstname}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    error={formik.touched.lastname && formik.errors.lastname}
                    helperText={(formik.errors.lastname && formik.touched.lastname) && formik.errors.lastname}
                    label="Last name"
                    id="lastname"
                    name="lastname"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastname}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="About Me"
                    id="aboutMe"
                    name="aboutMe"
                    onChange={formik.handleChange}
                    value={formik.values.aboutMe}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <Box display="flex" justifyContent="flex-end" p={2} >
              <Button
                type="submit"
                color="primary"
                variant="contained"
                className={classes.submit}
              >
                Save
              </Button>
            </Box>
          </Card>
        </form>*/}
      </ThemeProvider>
    );
  }
};
