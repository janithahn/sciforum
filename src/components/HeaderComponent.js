import React from 'react';
import { AppBar, Toolbar, InputBase,  IconButton, Typography, Button, makeStyles, useTheme, Drawer, CssBaseline, List, Divider, ListItemIcon, ListItemText, ListItem, createMuiTheme } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Inbox, Mail, ChevronLeft, Search } from '@material-ui/icons';
import clsx from 'clsx';

const drawerWidth = 240;

function MainDrawer({ handleDrawerClose, classes, open, theme }) {

    return (
        <Drawer
            className={classes.drawer}
            variant='persistent'
            anchor="left"
            open={open}
            classes={{ paper: classes.drawerPaper }}
        >
            <div className={classes.drawerHeader}>
                <IconButton onClick={handleDrawerClose}>
                    <ChevronLeft/>
                </IconButton>
            </div>
            <Divider />
            <div className={classes.drawerContainer}>
                <List>
                    {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                        <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <Inbox/> : <Mail />}</ListItemIcon>
                        <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <Inbox /> : <Mail />}</ListItemIcon>
                        <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </div>
        </Drawer>
    );
}

export default function Header(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position='dense'
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton edge="start" className={clsx(classes.menuButton, open && classes.hide)} onClick={handleDrawerOpen} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography  variant="h6" className={classes.title}>
                        sciForum
                    </Typography>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <Search />
                        </div>
                        <InputBase
                        placeholder="Search…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <MainDrawer handleDrawerClose={handleDrawerClose} classes={classes} theme={theme} open={open}/>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
          display: 'flex',
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
      },
          hide: {
              display: 'none',
      },
          drawer: {
              width: drawerWidth,
              flexShrink: 0,
      },
          drawerPaper: {
              width: drawerWidth,
              background: '#eeeeee'
      },
          drawerContainer: {
              overflow: 'auto'
      },
          drawerHeader: {
              display: 'flex',
              alignItems: 'center',
              padding: theme.spacing(0, 1),
              // necessary for content to be below app bar
              ...theme.mixins.toolbar,
              justifyContent: 'flex-end',
      },
          content: {
          flexGrow: 1,
          padding: theme.spacing(3),
          transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
      }),
          
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
      },
  }));