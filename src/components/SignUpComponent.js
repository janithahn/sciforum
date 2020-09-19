import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { ThemeProvider } from '@material-ui/core';
import { theme, useStylesSignUp as useStyles, ValidationTextField } from '../styles/signinSignupStyles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PasswordStrengthBar from 'react-password-strength-bar';
import { DisplayFormikState } from '../shared/DisplayFormikState';
import { signupUser } from '../redux/ActionCreators';
import { useDispatch, useSelector } from 'react-redux';

/*function handleSubmit(values) {
  alert("Current State is: " + JSON.stringify(values));
  //this.props.postFeedback(values);
  //this.props.resetFeedbackForm();
}*/

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/home">
        sciForum
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignUp() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isSubmitionCompleted, setSubmitionCompleted] = React.useState(false);
  const [isPasswordFocused, setPasswordFocus] = React.useState(false);

  const signupSchema = Yup.object().shape({
    username: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    /*firstname: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    lastname: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),*/
    email: Yup.string()
      .email()
      .required('Required'),
    password1: Yup.string()
      .required('Required')
      .min(4, 'Too Short!'),
      /*.matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),*/
    password2: Yup.string()
      .test('passwords-match', 'Passwords must match', function(value) {
        return this.parent.password1 === value;
      })
      .required('Required')
  });

  return (
    <Container component="main" maxWidth="xs" className={classes.content}>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <ThemeProvider theme={theme}>
        
        <Formik
          initialValues={{username: '', /*firstname: '', lastname: '',*/ email: '', password1: '', password2: ''}}
          onSubmit={(values) => {
            //setSubmitting(true);
            dispatch(signupUser(values))
          }}
          validationSchema={signupSchema}
        >
          {(props) => {
            //console.log(props);
            const {
              values, touched, errors, dirty, isSubmitting, handleChange,
              handleBlur, handleSubmit, handleReset
            } = props;
            return(
              <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/*<Grid item xs={12} sm={6}>
                    <ValidationTextField
                      autoComplete="fname"
                      name="firstname"
                      variant="outlined"
                      fullWidth
                      id="firstname"
                      label="First Name"
                      autoFocus
                      values={values.firstname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.firstname && touched.firstname}
                      helperText={(errors.firstname && touched.firstname) && errors.firstname}
                    />
                  </Grid>*/}
                  <Grid item xs={12}>
                    <ValidationTextField
                      variant="outlined"
                      fullWidth
                      id="username"
                      label="Username"
                      name="username"
                      autoComplete="uname"
                      aria-describedby="username-errors"
                      error={errors.username && touched.username}
                      values={values.username}
                      helperText={(errors.username && touched.username) && errors.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ValidationTextField
                      variant="outlined"
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      aria-describedby="email-errors"
                      error={errors.email && touched.email}
                      values={values.email}
                      helperText={(errors.email && touched.email) && errors.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ValidationTextField
                      variant="outlined"
                      fullWidth
                      name="password1"
                      label="Password"
                      type="password"
                      id="password1"
                      autoComplete="current-password"
                      aria-describedby="password1-errors"
                      error={errors.password1 && touched.password1}
                      values={values.password1}
                      helperText={(errors.password1 && touched.password1) && errors.password1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onFocus={() => setPasswordFocus(true)}
                    />
                    {isPasswordFocused && values.password1.length > 3 && <PasswordStrengthBar password={values.password1}/>}
                  </Grid>
                  <Grid item xs={12}>
                    <ValidationTextField
                      variant="outlined"
                      fullWidth
                      name="password2"
                      label="Confirm Password"
                      type="password"
                      id="password2"
                      autoComplete="current-password"
                      aria-describedby="password2-errors"
                      error={errors.password2 && touched.password2}
                      values={values.password2}
                      helperText={(errors.password2 && touched.password2) && errors.password2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Sign Up
                </Button>
                <Grid container justify="flex-end">
                  <Grid item>
                    <Link href="/signin" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
                {/*<DisplayFormikState {...props}/>*/}
              </form>
            );
          }}
        </Formik>

        
        </ThemeProvider>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}