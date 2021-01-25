import { createMuiTheme, makeStyles } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

export const theme = createMuiTheme({
    palette: {
      primary: blue,
    },
  });

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: '100%',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    textTransform: 'none',
  },
  typo: {
    marginTop: '20px',
  },
  iconWrap: {
    verticalAlign: 'middle',
    display: 'inline-flex'
  },
  answerButton: {
    textTransform: 'none',
    padding: (1, 3),

  },
  alertButton: {
    textTransform: 'none',
    padding: (1, 3),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTextField: {
    margin: theme.spacing(0, 1),
  },
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
    backgroundColor: '#fafafa',
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
  tags: {
    width: '100%',
  },
  chip: {
    marginTop: theme.spacing(1),
    height: 20,
  }
}));