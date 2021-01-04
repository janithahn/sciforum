import { createMuiTheme, makeStyles } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

export const theme = createMuiTheme({
    typography: {
        fontSize: 14
    },
    palette: {
      primary: blue,
    },
    //shadows: ['none']
  });

export const profileDetailTheme = createMuiTheme({
  typography: {
      fontSize: 12
  },
  palette: {
    primary: blue,
  },
  //shadows: ['none']
});

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: 'inherit',
  },
  cardRoot: {
    width: 450,
    [theme.breakpoints.down("sm")] : {
      width: 350,
    },
    [theme.breakpoints.down("xs")] : {
      width: 300,
    },
  },
  cardContent: {
    paddingTop: 0
  },
  cardHeader: {
    paddingBottom: 5,
  },
  textField: {
    width: '100%',
  },
  submit: {
    padding: theme.spacing(0, 1, 0),
    margin: theme.spacing(1, 1, 1),
    textTransform: 'none'
  },
  typo: {
    marginTop: '20px',
  },
  avatar: {
    height: 100,
    width: 100
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTextField: {
    margin: theme.spacing(2, 0, 1),
  },
  divider: {
    background: 'gray'
  },
  iconWrap: {
    verticalAlign: 'middle',
    display: 'inline-flex'
  },
  formControl: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(3),
  },
}));