import { createMuiTheme, makeStyles } from '@material-ui/core';

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
  },
  iconWrap: {
    verticalAlign: 'middle',
    display: 'inline-flex',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));