import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { deleteUser, subscribeForEmails, unsubscribeFromEMails, becomeModerator, unsubscribeModerator } from './actionCreators';
import { useDispatch } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({ username, handleClose, open }) {
    const dispatch = useDispatch();

    function handleDeletePost() {
        dispatch(deleteUser(username));
        handleClose();
    }

    return (
        <div>
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{"Delete Account"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                Are you sure about deleteting your account?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button  onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleDeletePost} color="secondary">
                Delete
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}

//email subscription
export function EmailSubscribeAlert({ userId, handleClose, open }) {
    const dispatch = useDispatch();

    function handleSubscription() {
        dispatch(subscribeForEmails(userId));
        handleClose();
    }

    return (
        <div>
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{"Subscribe"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                Please confirm to proceed.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button  onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleSubscription} color="secondary">
                Confirm
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}

export function EmailUnsubscribeAlert({ userId, handleClose, open }) {
    const dispatch = useDispatch();

    function handleUnsubscription() {
        dispatch(unsubscribeFromEMails(userId));
        handleClose();
    }

    return (
        <div>
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{"Unsubscribe"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                Please confirm to proceed.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button  onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleUnsubscription} color="secondary">
                Confirm
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}
//end email subscription

//moderator subscription
export function ModeratorSubscribeAlert({ userId, handleClose, open }) {
    const dispatch = useDispatch();

    function handleSubscription() {
        dispatch(becomeModerator(userId));
        handleClose();
    }

    return (
        <div>
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{"Subscribe"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                Please confirm to proceed.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button  onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleSubscription} color="secondary">
                Confirm
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}

export function ModeratorUnsubscribeAlert({ userId, handleClose, open }) {
    const dispatch = useDispatch();

    function handleUnsubscription() {
        dispatch(unsubscribeModerator(userId));
        handleClose();
    }

    return (
        <div>
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{"Unsubscribe"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                Please confirm to proceed.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button  onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleUnsubscription} color="secondary">
                Confirm
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}
//end moderator subscription