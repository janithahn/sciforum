import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchData } from './actionCreators';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const RoomDeleteAlert = ({ handleDeleteModalClose, openDeleteModal, deleteRoom }) => {

  const dispatch = useDispatch();
  const history = useHistory();

  function handleDeleteAnswer() {
    deleteRoom();
    dispatch(fetchData());
    handleDeleteModalClose();
    history.push('/chatrooms');
  }

  return (
      <div>
        <Dialog
            open={openDeleteModal}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleDeleteModalClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{"Delete Room"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                Are you sure about deleting this chat room? This cannot be undone!
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleDeleteModalClose} color="secondary">
                Cancel
            </Button>
            <Button onClick={handleDeleteAnswer} color="secondary">
                Delete
            </Button>
            </DialogActions>
        </Dialog>
      </div>
  );
}

export const MessageDeleteAlert = ({ handleDeleteModalClose, openDeleteModal, deleteMessage }) => {

  function handleDeleteAnswer() {
    deleteMessage();
    handleDeleteModalClose();
  }

  return (
      <div>
        <Dialog
            open={openDeleteModal}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleDeleteModalClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{"Delete Message"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                Are you sure about deleting this message ?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleDeleteModalClose} color="secondary">
                Cancel
            </Button>
            <Button onClick={handleDeleteAnswer} color="secondary">
                Delete
            </Button>
            </DialogActions>
        </Dialog>
      </div>
  );
}

export function ChatRoomAlertError({ primaryMessage, strongMessage }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
            {primaryMessage} — <strong>{strongMessage}</strong>
      </Alert>
    </div>
  );
}

export function ChatRoomAlertSuccess({ primaryMessage, strongMessage }) {
    const classes = useStyles();
  
    return (
      <div className={classes.root}>
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
            {primaryMessage} — <strong>{strongMessage}</strong>
        </Alert>
      </div>
    );
  }