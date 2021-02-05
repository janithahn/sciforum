import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputLabel from '@material-ui/core/InputLabel';
import { ThemeProvider, FormHelperText, OutlinedInput, FormControl } from '@material-ui/core';
import { theme, useStylesSignin as useStyles } from './styles/signinSignupStyles';
import btn_google_light_normal_ios from './styles/btn_google_light_normal_ios.svg';
import community from './styles/community.svg';
import { useFormik } from 'formik';
//import { DisplayFormikState } from '../shared/DisplayFormikState';
import * as Yup from 'yup';
import { loginUser, loginUserWithGoogle } from '../../redux/ActionCreators';
import { useDispatch, useSelector } from 'react-redux';
import { useGoogleLogin } from 'react-google-login';
import { clientId } from '../../shared/googleApiClientId';
import { useHistory, useLocation } from 'react-router-dom';

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
  username: Yup.string()
    .required('Required'),
  /*email: Yup.string()
    .email()
    .required('Required'),*/
  password: Yup.string()
    .required('Required'),
});

export default function SignIn(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.Auth);
  const [credentialError, setCredentialError] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  
  //these are used to redirect back to where it was when the user logs in
  let history = useHistory();
  let location = useLocation();
  let { from } = location.state || { from: { pathname: history.location.pathname } };
  
  React.useEffect(() => {
    if(auth.status === 'failed' && auth.errMess) {
      if(auth.errMess.response) {
        setCredentialError(auth.errMess.response.data.non_field_errors[0]);
      } else {
        setCredentialError('Server error! Please try again!');
      }  
    }else {
      setCredentialError('');
    }
    if(auth.isAuthenticated) {
      //setCredentialError('');
      props.handleModalClose();
    }
  }, [auth, setCredentialError, props]);

  const formik = useFormik({
    initialValues: {username: '', email: '', password: '', rememberMe: false},
    onSubmit: (values) => {
      dispatch(loginUser(values, history, from));
      /*if(auth.isAuthenticated) {
        return(<Redirect to="/questions"/>);
      }*/
    },
    validationSchema: signinSchema
  });

  const handleClickShowPassword = () => {
    //setValues({ ...values, showPassword: !values.showPassword });
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const googleResponse = (response) => {
    console.log(response);
    dispatch(loginUserWithGoogle(response, history, from));
  }

  const googleResponseOnFailure = (response) => {
    console.log(response);
  }

  const { signIn, loaded } = useGoogleLogin({
    onSuccess: googleResponse,
    onFailure: googleResponseOnFailure,
    clientId: clientId,
  });

  console.log(loaded);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" className={classes.content}>
        <CssBaseline />
        <div className={classes.paper}>
          <img className={classes.logo} alt="sciforum_logo" src={community}/>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <FormHelperText error={true} variant="outlined">{credentialError}</FormHelperText>
          <form className={classes.form} onSubmit={formik.handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="username"
              label="Username or Email"
              name="username"
              autoComplete="username"
              autoFocus
              value={formik.values.username}
              error={formik.errors.username && formik.touched.username}
              helperText={(formik.errors.username && formik.touched.username) && formik.errors.username}
              onChange={formik.handleChange}
              //onBlur={formik.handleBlur}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel error={formik.errors.password && formik.touched.password} htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="password"
                name="password"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.errors.password && formik.touched.password}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={70}
              />
              <FormHelperText error={true} variant="outlined">{(formik.errors.password && formik.touched.password) && formik.errors.password}</FormHelperText>
            </FormControl>
            {/*<FormControlLabel
              control={<Checkbox value="remember" color="primary" onChange={(event) => formik.setFieldValue('rememberMe', event.target.checked)}/>}
              label="Remember me"
            />*/}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Button
              type="button"
              onClick={signIn}
              fullWidth
              variant="contained"
              className={classes.googleButton}
            >
              <img alt="google_button" src={btn_google_light_normal_ios}/>
              Sign in with Google
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/password/reset" variant="body2">
                  {"Forgot password?"}
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            {/*<DisplayFormikState {...props}/>*/}
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </ThemeProvider>
  );
}