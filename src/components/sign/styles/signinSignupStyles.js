import { createMuiTheme, makeStyles, withStyles, TextField, OutlinedInput } from '@material-ui/core';
import { deepPurple } from '@material-ui/core/colors';

export const theme = createMuiTheme({
    typography: {
        fontSize: 14,
    },
    palette: {
      primary: deepPurple,
      secondary: {
        //main: "#616161",
        main: "#757575",
        light: "#9e9e9e",
      },
    },
  });

export  const useStylesSignUp = makeStyles(() => ({
    paper: {
      marginTop: theme.spacing(3),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    logo: {
      margin: theme.spacing(1),
      //backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    multilineColor: {
      color:'red'
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      paddingLeft: theme.spacing(3),
      paddingTop: theme.spacing(10),
      [theme.breakpoints.up('md')]: {
          paddingLeft: theme.spacing(3),
          paddingTop: theme.spacing(10),
      },
    },
    googleButton: {
      backgroundColor: '#FFFFFF',
      padding: 0,
      margin: theme.spacing(0, 0, 2),
    },
  }));

  


export const useStylesSignin = makeStyles(() => ({
    paper: {
      marginTop: theme.spacing(3),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(3),
      backgroundColor: '#fafafa',
    },
    logo: {
      margin: theme.spacing(1),
      //backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      paddingLeft: theme.spacing(3),
      paddingTop: theme.spacing(10),
      [theme.breakpoints.up('md')]: {
          paddingLeft: theme.spacing(3),
          paddingTop: theme.spacing(10),
      },
    },
    googleButton: {
      backgroundColor: '#FFFFFF',
      padding: 0,
      margin: theme.spacing(0, 0, 2),
    },
  }));

export  const ValidationTextField = withStyles({
    root: {
        '& input:valid + fieldset': {
        borderColor: 'gray',
        borderWidth: 0.5,
        },
        '& input:after:invalid + fieldset': {
        borderColor: 'red',
        borderWidth: 2,
        },
        '& input:valid:focus + fieldset': {
        borderLeftWidth: 4,
        padding: '4px !important', // override inline-style
        },
    },
})(TextField);

export  const ValidationOutlinedInput = withStyles({
  root: {
      '& input:valid + fieldset': {
      borderColor: 'gray',
      borderWidth: 0.5,
      },
      '& input:after:invalid + fieldset': {
      borderColor: 'red',
      borderWidth: 2,
      },
      '& input:valid:focus + fieldset': {
      borderLeftWidth: 4,
      padding: '4px !important', // override inline-style
      },
  },
})(OutlinedInput);