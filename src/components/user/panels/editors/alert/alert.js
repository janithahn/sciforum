import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { useDispatch } from 'react-redux';
import { deleteUserEmployment, deleteUserEducation, deleteUserSkills, deleteUserLanguages } from '../../../../../redux/ActionCreators';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({ open, handleClose, id, handleCredentialModalClose, type }) {
    const dispatch = useDispatch();

    function handleDelete() {
        switch(type) {
            case "employment":
                dispatch(deleteUserEmployment(id));
                handleCredentialModalClose();
                break;

            case "education":
                dispatch(deleteUserEducation(id));
                handleCredentialModalClose();
                break;

            case "skills":
                dispatch(deleteUserSkills(id));
                handleCredentialModalClose();
                break;

            case "languages":
                dispatch(deleteUserLanguages(id));
                handleCredentialModalClose();
                break;

            default:
                handleCredentialModalClose();
        }
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
            <DialogTitle id="alert-dialog-slide-title">{"Delete Post"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                Are you sure about deleteting this credential?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button  onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleDelete} color="secondary">
                Delete
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}