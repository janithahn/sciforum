import React from 'react';
import { AppBar, Toolbar, InputBase,  IconButton, Typography, Button, 
    CssBaseline, Modal, Backdrop, Fade, Link, Menu, MenuItem, Avatar, LinearProgress, Badge } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
//import LoginModal from '../sign/SignInComponent';
import SignIn from '../sign/SignInComponent';
import AlertSnackbar from '../alert/snackbar';
import { useLocation, Link as RouterLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, fetchUser, fetchUserEmployment, fetchUserEducation, fetchUserSkills, fetchUserLanguages } from '../../redux/ActionCreators';
import { useStyles } from './styles/headerStyle';
import { fetchUnreadNotifications } from './actions';
import community from './styles/community.svg';
import MainDrawer from '../drawer/DrawerComponent';
import ConfirmationEmailAfterSnack from '../settings/afterSnack';
//import { resetEmailConfirm } from '../settings/actionCreators';

function LoginModal({openModal, classes, handleModalClose}) {
    return(
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openModal}
            onClose={handleModalClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
        <Fade in={openModal}>
          <SignIn handleModalClose={handleModalClose}/>
        </Fade>
      </Modal>
    );
}

const DropDown = ({ username, profileImage, anchorEl, setAnchorEl, handleLogOut, handleClick, unreadNotifications }) => {

    const dispatch = useDispatch();
    
    const handleProfile = () => {
        dispatch(fetchUser('', username));
        dispatch(fetchUserEmployment(username));
        dispatch(fetchUserEducation(username));
        dispatch(fetchUserSkills(username));
        dispatch(fetchUserLanguages(username));
    }

    return(
        <div>
            <IconButton size="small" color="inherit" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} style={{textTransform: 'none'}}>
                <Badge color="error" variant="dot" overlap="circle" badgeContent={unreadNotifications}>
                    <Avatar alt={username} src={profileImage}/>
                </Badge>
            </IconButton>
            <Menu
                elevation={2}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={Boolean(anchorEl)}
                keepMounted
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}   
            >
                <RouterLink onClick={handleProfile} style={{textDecoration: 'none', color: 'inherit'}} to={`/profile/${username}/`}>
                    <MenuItem>Profile</MenuItem>
                </RouterLink>
                <RouterLink style={{textDecoration: 'none', color: 'inherit'}} to={`/notifications`}>
                    <Badge color="error" variant="standard" max={999} overlap="circle" badgeContent={unreadNotifications}>
                        <MenuItem>Notifications</MenuItem>
                    </Badge>
                </RouterLink>
                <RouterLink style={{textDecoration: 'none', color: 'inherit'}} to={`/settings`}>
                    <MenuItem>Settings</MenuItem>
                </RouterLink>
                <MenuItem onClick={handleLogOut}>Logout</MenuItem>
            </Menu>
        </div>
    );
}

const Header = (props) => {

    const classes = useStyles();

    const auth = useSelector(state => state.Auth);
    const unreadNotifications = useSelector(state => state.UnreadNotifications.count);
    const [openModal, setOpenModal] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const location = useLocation();
    const dispatch = useDispatch();

    const history = useHistory();

    const [searchParams, setSearchParams] = React.useState('');

    //fetch unread notifications
    React.useEffect(() => {
        dispatch(fetchUnreadNotifications(auth.currentUserId));
    }, []);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            //navigate(`/search?q=${searchParams}`);
            history.push(`/search?q=${searchParams}`);
        }
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleModalOpen = () => {
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
    };

    const handleLogOut = () => {
        setAnchorEl(null);
        dispatch(logout());
    }
    
    //Drawer
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(!open);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    //After snack settings
    const emailConfirm = useSelector(state => state.ConfirmEmail);
    const [openSnack, setOpenSnack] = React.useState(false);
    const [snackAfterMessage, setSnackAfterMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState("");
    const handleOpenSnack = () => {
        setOpenSnack(true);
    };
    React.useEffect(() => {
        if(emailConfirm.status === "succeeded") {
            handleOpenSnack();
            setSnackAfterMessage(emailConfirm.message);
            setSnackSeverity("success");
        }else if(emailConfirm.status === "failed") {
            handleOpenSnack();
            setSnackAfterMessage(emailConfirm.errMess.toString());
            setSnackSeverity("error");
        }
    }, [emailConfirm])

    return (
        <div className={props.classes.root}>
            <CssBaseline/>
            <AppBar position='fixed'
                className={clsx(props.classes.appBar, {
                    [props.classes.appBarShift]: props.open,
                })}
            >
                <Toolbar>
                    {location.pathname !== '/signup' && location.pathname !== '/signin' && <IconButton edge="start" className={clsx(props.classes.menuButton, props.open && props.classes.hide)} onClick={handleDrawerOpen} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>}
                    <img alt="sciforum_logo" src={community} style={{margin: 2}}/>
                    <Typography className={props.classes.title}>
                        <Link href="/" color="inherit" underline="none" variant="h6">
                            sciForum
                        </Link>
                    </Typography>
                    <div className={props.classes.search}>
                        <div className={props.classes.searchIcon}>
                            <Search />
                        </div>
                        <InputBase
                            placeholder="Search Questions…"
                            classes={{
                                root: props.classes.inputRoot,
                                input: props.classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={(event) => {
                                setSearchParams(event.target.value)
                            }}
                            onKeyDown={(event) => handleKeyDown(event)}
                        />
                    </div>
                    {location.pathname !== '/signup' && location.pathname !== '/signin' && (!auth.isAuthenticated ? 
                        <Button variant="text" color="inherit" onClick={() => handleModalOpen()} style={{textTransform: 'none'}}>
                            <Typography variant="body1">
                                Login
                            </Typography>
                        </Button>: 
                        <DropDown 
                            username={auth.currentUser} 
                            profileImage={auth.currentUserProfileImg} 
                            handleLogOut={handleLogOut} 
                            handleClick={handleClick} 
                            anchorEl={anchorEl} 
                            setAnchorEl={setAnchorEl}
                            unreadNotifications={unreadNotifications}
                        />)
                    }
                    <LoginModal openModal={openModal} classes={props.classes} handleModalClose={handleModalClose}/>
                </Toolbar>
                {props.showProgressBar ? <LinearProgress className={classes.progressBar}/>: undefined}
            </AppBar>
            <AlertSnackbar open={props.snackOpen} setOpen={props.setSnackOpen} message={props.snackMessage}/>
            <ConfirmationEmailAfterSnack 
                open={openSnack} 
                setOpen={setOpenSnack} 
                message={snackAfterMessage}
                severity={snackSeverity}
            />
            {location.pathname !== '/signup' && location.pathname !== '/signin' && <MainDrawer open={open} classes={classes} handleDrawerClose={handleDrawerClose}/>}
        </div>
    );
}

export default Header;