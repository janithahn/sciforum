import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { ThemeProvider } from '@material-ui/core';
import { theme, useStylesSignin as useStyles } from '../styles/signinSignupStyles';
import { Formik } from 'formik';
import { DisplayFormikState } from '../shared/DisplayFormikState';
import * as Yup from 'yup';
import { loginUser } from '../redux/ActionCreators';
import { useDispatch } from 'react-redux';

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

const signinSchema = Yup.object().shape({
  /*username: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),*/
  email: Yup.string()
    .email()
    .required('Required'),
  password: Yup.string()
    .required('Required'),
});

export default function SignIn() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isRememberMe, setRememberMe] = React.useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" className={classes.content}>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Formik
            initialValues={{username: '', email: '', password: '', rememberMe: false}}
            onSubmit={(values, {isSubmitting}) => {
              alert(JSON.stringify(values));
              dispatch(loginUser(values));
            }}
            validationSchema={signinSchema}
          >
            {(props) => {
            //console.log(props);
            const {
              values, touched, errors, dirty, isSubmitting, handleChange,
              handleBlur, handleSubmit, handleReset, setFieldValue
            } = props;
              return(
                <form className={classes.form} onSubmit={handleSubmit}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={values.email}
                    error={errors.email && touched.email}
                    helperText={(errors.email && touched.email) && errors.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={values.password}
                    aria-describedby="password-errors"
                    error={errors.password && touched.password}
                    helperText={(errors.password && touched.password) && errors.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" onChange={(event) => setFieldValue('rememberMe', event.target.checked)}/>}
                    label="Remember me"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link href="#" variant="body2">
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link href="/signup" variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                  {<DisplayFormikState {...props}/>}
                </form>
                );
              }}
          </Formik>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </ThemeProvider>
  );
}