import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { deleteAnswer } from '../../redux/ActionCreators';
import { useDispatch } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
    const dispatch = useDispatch();

    function handleDeleteAnswer() {
        dispatch(deleteAnswer(props.answerId, props.postBelong));
        props.handleDeleteModalClose();
    }

    return (
        <div>
        <Dialog
            open={props.openDeleteModal}
            TransitionComponent={Transition}
            keepMounted
            onClose={props.handleDeleteModalClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{"Delete Answer"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                Are you sure about deleteting this answer?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={props.handleDeleteModalClose} color="primary">
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