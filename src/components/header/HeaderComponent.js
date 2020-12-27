import React from 'react';
import { AppBar, Toolbar, InputBase,  IconButton, Typography, Button, 
    CssBaseline, Modal, Backdrop, Fade, Link, Menu, MenuItem, Avatar, LinearProgress } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
//import LoginModal from '../sign/SignInComponent';
import SignIn from '../sign/SignInComponent';
import AlertSnackbar from '../alert/snackbar';
import { useLocation, Link as RouterLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/ActionCreators';
import { useStyles } from './styles/headerStyle';

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

const DropDown = ({username, profileImage, anchorEl, setAnchorEl, handleLogOut, handleClick}) => {

    return(
        <div>
            <IconButton size="small" color="inherit" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} style={{textTransform: 'none'}}>
                <Avatar src={profileImage}/>
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
                <RouterLink style={{textDecoration: 'none', color: 'inherit'}} to={`/profile/${username}/`}>
                    <MenuItem>Profile</MenuItem>
                </RouterLink>
                <RouterLink style={{textDecoration: 'none', color: 'inherit'}} to={`/notifications`}>
                    <MenuItem>Notifications</MenuItem>
                </RouterLink>
                <MenuItem onClick={handleLogOut}>Logout</MenuItem>
            </Menu>
        </div>
    );
}

const Header = (props) => {

    const classes = useStyles();

    const auth = useSelector(state => state.Auth);
    const currentUserProfileImg = useSelector(state => state.User.user.profile ? state.User.user.profile.profileImg: null);
    const [openModal, setOpenModal] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const location = useLocation();
    const dispatch = useDispatch();

    const history = useHistory();

    const [searchParams, setSearchParams] = React.useState('');

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

    return (
        <div className={props.classes.root}>
            <CssBaseline/>
            <AppBar position='fixed'
                className={clsx(props.classes.appBar, {
                    [props.classes.appBarShift]: props.open,
                })}
            >
                <Toolbar>
                    {location.pathname !== '/signup' && location.pathname !== '/signin' && <IconButton edge="start" className={clsx(props.classes.menuButton, props.open && props.classes.hide)} onClick={props.handleDrawerOpen} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>}
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
                            placeholder="Search…"
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
                        <DropDown username={auth.currentUser} profileImage={currentUserProfileImg} handleLogOut={handleLogOut} handleClick={handleClick} anchorEl={anchorEl} setAnchorEl={setAnchorEl}/>)
                    }
                    <LoginModal openModal={openModal} classes={props.classes} handleModalClose={handleModalClose}/>
                </Toolbar>
                {props.showProgressBar ? <LinearProgress className={classes.progressBar}/>: undefined}
            </AppBar>
            <AlertSnackbar open={props.snackOpen} setOpen={props.setSnackOpen} message={props.snackMessage}/>
        </div>
    );
}

export default Header;