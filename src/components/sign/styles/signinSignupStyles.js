import { createMuiTheme, makeStyles, withStyles, TextField, OutlinedInput } from '@material-ui/core';
import { deepPurple } from '@material-ui/core/colors';

export const theme = createMuiTheme({
    typography: {
        fontFamily: 'Open Sans',
        fontSize: 14,
    },
    palette: {
      primary: deepPurple,
    },
  });

export  const useStylesSignUp = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(3),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.light,
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
    }
  }));

  


export const useStylesSignin = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(3),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(3),
      backgroundColor: '#fafafa',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.light,
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