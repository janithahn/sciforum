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

export const useRoomListStyles = makeStyles(theme => ({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    position: 'relative',
    backgroundColor: '#f5f5f5',
    borderRadius: theme.shape.borderRadius,
    marginRight: theme.spacing(2),
    marginLeft: 10,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#757575'
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
      '&:focus': {
        width: '40ch',
      },
    },
  },
  avatars: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
}));