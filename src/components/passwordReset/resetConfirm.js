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
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputLabel from '@material-ui/core/InputLabel';
import { ThemeProvider, FormHelperText, FormControl } from '@material-ui/core';
import { theme, useStylesSignUp as useStyles, ValidationTextField, ValidationOutlinedInput } from './styles/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PasswordStrengthBar from 'react-password-strength-bar';
//import { DisplayFormikState } from '../shared/DisplayFormikState';
import { useParams } from 'react-router-dom';
import ResetConfirmMessage from './messages/resetConfirmMessage';
import ResetErrorMessage from './messages/resetErrorMessage';
import { useSelector, useDispatch } from 'react-redux';
import { sendNewPassword } from './actionsCreators';

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

export default function ResetConfirm() {
  const classes = useStyles();
  const { token } = useParams();

  const dispatch = useDispatch();
  const resetPassword = useSelector(state => state.ResetPassword);

  const [isPasswordFocused, setPasswordFocus] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const signupSchema = Yup.object().shape({
    password1: Yup.string()
      .required('Required')
      .min(4, 'Too Short!'),
    password2: Yup.string()
      .test('passwords-match', 'Passwords must match', function(value) {
        return this.parent.password1 === value;
      })
      .required('Required')
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  if(resetPassword.status === 'succeeded'){
    return(<ResetConfirmMessage/>);
  }

  if(resetPassword.status === 'failed'){
    return(<ResetErrorMessage/>);
  }

    return (
        <Container component="main" maxWidth="xs" className={classes.content}>
        <CssBaseline />
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h6">
                Reset your password
            </Typography>
            <ThemeProvider theme={theme}>
            
            <Formik
            initialValues={{password1: '', password2: ''}}
            onSubmit={(values) => {
                const submitVal = {
                    password: values.password1,
                    token: token,
                }
                dispatch(sendNewPassword(submitVal));
            }}
            validationSchema={signupSchema}
            >
            {(props) => {
                const {
                values, touched, errors, handleChange,
                handleBlur, handleSubmit,
                } = props;
                return(
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                    <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel error={errors.password1 && touched.password1} htmlFor="outlined-adornment-password">New Password</InputLabel>
                        <ValidationOutlinedInput
                            id="password1"
                            name="password1"
                            label="New Password"
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            value={values.password1}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={() => setPasswordFocus(true)}
                            error={errors.password1 && touched.password1}
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
                        <FormHelperText error={true} variant="outlined">{(errors.password1 && touched.password1) && errors.password1}</FormHelperText>
                    </FormControl>
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
                    Reset
                    </Button>
                    <Grid container justify="flex-end">
                    <Grid item>
                        <Link href="/signin" variant="body2">
                        Do you remember the password? Sign in
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