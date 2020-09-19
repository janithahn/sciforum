import React from 'react';
import { AppBar, Toolbar, InputBase,  IconButton, Typography, Button, CssBaseline, Modal, Backdrop, Fade, Link } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import SignIn from './SignInComponent';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/ActionCreators';

function LoginModal({openModal, classes, handleModalClose, ref}) {
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

const Header = (props) => {

    const dispatch = useDispatch();
    const auth = useSelector(state => state.Auth);
    const [openModal, setOpenModal] = React.useState(false);
    const location = useLocation();

    console.log(auth);

    const handleModalOpen = () => {
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
    };

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
                    <Link href="/" color="inherit" underline="none" variant="body2" className={props.classes.title}>
                        <Typography variant="h6" className={props.classes.title}>
                            sciForum
                        </Typography>
                    </Link>
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
                        />
                    </div>
                    {location.pathname !== '/signup' && location.pathname !== '/signin' && (!auth.isAuthenticated ? <Button color="inherit" onClick={() => handleModalOpen()}>Login</Button>: <Button color="inherit" onClick={() => dispatch(logout())}>Logout</Button>)}
                    <LoginModal openModal={openModal} classes={props.classes} handleModalClose={handleModalClose}/>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;