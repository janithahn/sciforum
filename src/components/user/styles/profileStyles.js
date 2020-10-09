import { createMuiTheme, makeStyles, withStyles, Tooltip } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

export const theme = createMuiTheme({
    typography: {
        fontFamily: 'Open Sans',
        fontSize: 14
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
  cardContent: {
    padding: 0
  },
  textField: {
    width: '100%',
  },
  submit: {
    margin: theme.spacing(3, 2, 2),
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
    backgroundColor: 'gray'
  },
  iconWrap: {
    verticalAlign: 'middle',
    display: 'inline-flex'
  },
}));

export const CustomTooltip = withStyles({
  tooltipPlacementTop: {
    margin: "0",
  },
  tooltipPlacementBottom: {
    margin: 6,
  },
})(Tooltip);