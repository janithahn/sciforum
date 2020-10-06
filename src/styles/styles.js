import { makeStyles } from '@material-ui/core';

const drawerWidth = 240;

export const useStyles = makeStyles((theme) => ({
    root: {
          flexGrow: 1,
      },
          appBar: {
              zIndex: theme.zIndex.drawer + 1,
              transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
              }),
      },
          appBarShift: {
              width: `calc(100% - ${drawerWidth}px)`,
              marginLeft: drawerWidth,
              transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
              }),
      },
          menuButton: {
              marginRight: theme.spacing(2),
              [theme.breakpoints.up('md')]: {
                display: 'none',
              },
      },
          hide: {
              display: 'none',
      },
          content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            paddingLeft: theme.spacing(3),
            paddingTop: theme.spacing(10),
            [theme.breakpoints.up('md')]: {
                paddingLeft: theme.spacing(33.33),
                paddingTop: theme.spacing(10),
            },
          /*transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),*/
          
      },
          contentShift: {
              transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
              }),
              marginLeft: 0,
      },
          title: {
              flexGrow: 1,
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
      },modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
      backDrop: {
        background: '#5e92f3',
        opacity: 1,
      }
  }));