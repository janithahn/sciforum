import { createMuiTheme, makeStyles, withStyles, Tooltip } from '@material-ui/core';
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
    background: 'gray'
  },
  iconWrap: {
    verticalAlign: 'middle',
    display: 'inline-flex'
  },
  formControl: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(3),
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