import React from 'react';
import { IconButton, Drawer, Hidden, List, Divider, ListItemIcon, ListItemText, MenuItem, Link, useTheme } from '@material-ui/core';
import { Inbox, ChevronLeft, Home } from '@material-ui/icons';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchPosts } from '../redux/ActionCreators';

function RenderDrawer({ handleDrawerClose, classes, open, variant, handleSelectedItem, selected }) {

    return (
        <Drawer
            className={classes.drawer}
            variant={variant}
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
                    {[{text: 'Home', url: '/', icon: <Home/>}, {text: 'Sample', url: '/sample', icon: <Inbox/>}].map((item, index) => (
                        <Link to={item.url} component={NavLink} underline='none' color='inherit' key={index}>
                            <MenuItem button key={index} onClick={() => handleSelectedItem(item.url)} selected={selected === item.url}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </MenuItem>
                        </Link>
                    ))}
                </List>
            </div>
        </Drawer>
    );
}

export default function MainDrawer(props) {
    const theme = useTheme();
    const location = useLocation();
    const [selected, setLocation] = React.useState(location.pathname);

    const dispatch = useDispatch();

    const handleSelectedItem = (val) => {
        setLocation(val);
        if(selected === '/') {
            dispatch(fetchPosts('From the Drawer'));
        }
    }

    return(
        <div>
            <Hidden smDown>
                <RenderDrawer variant="permanent" selected={selected} handleSelectedItem={handleSelectedItem} handleDrawerClose={props.handleDrawerClose} classes={props.classes} theme={theme} open={props.open}/>
            </Hidden>
            <Hidden mdUp>
                <RenderDrawer variant="persistent" selected={selected} handleSelectedItem={handleSelectedItem} handleDrawerClose={props.handleDrawerClose} classes={props.classes} theme={theme} open={props.open}/>
            </Hidden>
        </div>
    );
}