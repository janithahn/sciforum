import { createMuiTheme, makeStyles } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

export const theme = createMuiTheme({
    typography: {
        fontFamily: 'Open Sans',
    },
    palette: {
      primary: blue,
    },
    //shadows: ['none']
  });

  export const themeVote = createMuiTheme({
    typography: {
        fontFamily: 'Open Sans',
    },
    palette: {
      secondary: {
        main: "#9e9e9e",
      },
    },
  });

  export const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      flexGrow: 1,
      backgroundColor: 'inherit',
    },
    cardContent: {
      paddingTop: 0
    },
    cardHeader: {
      paddingBottom: 5,
    },
    submit: {
      margin: theme.spacing(3, 2, 2),
    },
    editButton: {
      textTransform: 'none',
      padding: (0, 3, 0, 3),
    },
    iconWrap: {
      verticalAlign: 'middle',
      display: 'inline-flex'
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }));
  