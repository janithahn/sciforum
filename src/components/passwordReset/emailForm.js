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
import { ThemeProvider, FormHelperText } from '@material-ui/core';
import { theme, useStylesSignUp as useStyles, ValidationTextField } from './styles/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
//import { DisplayFormikState } from '../shared/DisplayFormikState';
import { useSelector } from 'react-redux';

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

export default function EmailForm({ sendLink, setResponseMessage }) {
    const classes = useStyles();
    const auth = useSelector(state => state.Auth);
    const [credentialError, setCredentialError] = React.useState('');
  
    const signupSchema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required('Required'),
    });
  
    return (
      <Container component="main" maxWidth="xs" className={classes.content}>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h6">
            Send password reset link to your email
          </Typography>
          <FormHelperText error variant="outlined">{credentialError}</FormHelperText>
          <ThemeProvider theme={theme}>
          
          <Formik
            initialValues={{email: ''}}
            onSubmit={(values) => {
              sendLink(values, setCredentialError, setResponseMessage);
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
                        size="small"
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    size="small"
                  >
                    Send
                  </Button>
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