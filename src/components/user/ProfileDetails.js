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
  ThemeProvider
} from '@material-ui/core';
import { theme, useStyles } from './styles/profileStyles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../redux/ActionCreators';

export default function ProfileDetails() {
  const classes = useStyles();
  const auth = useSelector(state => state.Auth);
  const user = useSelector(state => state.User);
  const dispatch = useDispatch();

  //console.log(user.user.data.first_name);

  const [values, setValues] = useState({
    firstName: user.user.data.first_name,
    lastName: user.user.data.last_name,
    email: user.user.data.email,
    username: user.user.data.username,
    aboutMe: user.user.data.profile.aboutMe,
  });

  const profileSchema = Yup.object().shape({
    /*username: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),*/
    firstname: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    lastname: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    /*email: Yup.string()
      .email()
      .required('Required'),
    password: Yup.string()
      .required('Required'),*/
  });

  const formik = useFormik({
    initialValues: {
      username: values.username, 
      email: values.email, 
      firstname: values.firstName, 
      lastname: values.lastName, 
      aboutMe: values.aboutMe
    },
    onSubmit: (values) => {
      //console.log(values);
      dispatch(updateUser(auth, values.firstname, values.lastname, values.aboutMe));
    },
    validationSchema: profileSchema,
  });

  return (
    <ThemeProvider theme={theme}>
      <form className={classes.root} onSubmit={formik.handleSubmit}>
        <Card>
          <CardHeader
            subheader="The information can be edited"
            title="Profile"
          />
          <Divider />
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                md={6}
                xs={12}
              >
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
              <Grid
                item
                md={6}
                xs={12}
              >
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
              {/*<Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  error={formik.touched.email && formik.errors.email}
                  helperText={(formik.errors.email && formik.touched.email) && formik.errors.email}
                  label="Email"
                  id="email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  error={formik.touched.username && formik.errors.username}
                  helperText={(formik.errors.username && formik.touched.username) && formik.errors.username}
                  label="Username"
                  id="username"
                  name="username"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type="text"
                  value={formik.values.username}
                  variant="outlined"
                />
              </Grid>*/}
              <Grid
                item
                md={6}
                xs={12}
              >
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
              <Grid
                item
                md={6}
                xs={12}
              >
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <Box
            display="flex"
            justifyContent="flex-end"
            p={2}
          >
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
      </form>
    </ThemeProvider>
  );
};
