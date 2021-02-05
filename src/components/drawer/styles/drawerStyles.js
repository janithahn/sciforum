import { createMuiTheme, makeStyles } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

export const theme = createMuiTheme({
    typography: {
        fontFamily: 'Open Sans'
    },
    palette: {
        primary: blue,
    },
});

const drawerWidth = 240;

export const useStyles = makeStyles((theme) => ({
    drawer: {
        [theme.breakpoints.up('md')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    drawerPaper: {
        width: drawerWidth,
        //background: '#eeeeee'
        background: '#f5f5f5',
    },
    drawerContainer: {
        overflow: 'auto'
    },
    drawerLabelsContainer: {
        overflow: 'auto',
        marginLeft: 1
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    labelColor: {
      width: 14,
      height: 14,
      flexShrink: 0,
      borderRadius: 3,
      marginRight: 8,
      marginTop: 2,
    },
    labelText: {
      flexGrow: 1,
    },
}));