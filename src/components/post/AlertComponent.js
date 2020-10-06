import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { deletePost } from '../../redux/ActionCreators';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
//import { fetchPosts } from '../redux/ActionCreators';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
    const dispatch = useDispatch();
    const history = useHistory();
    //const location = useLocation();

    //React.useEffect(history.push('/questions'), [location]);

    function handleDeletePost() {
        dispatch(deletePost(props.postId, history));
        //history.push('/questions');
        props.handleClose();
    }

    return (
        <div>
        <Dialog
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{"Delete Post"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                Are you sure about deleteting this post?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={props.handleClose} color="secondary">
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