import { createMuiTheme, makeStyles } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

export const theme = createMuiTheme({
    typography: {
        fontFamily: 'Open Sans',
    },
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
    margin: theme.spacing(3, 1, 2),
  },
  typo: {
    marginTop: '20px',
  },
}));