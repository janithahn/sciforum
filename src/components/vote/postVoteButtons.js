import React from 'react';
import ThumbDownRoundedIcon from '@material-ui/icons/ThumbDownRounded';
import ThumbUpRoundedIcon from '@material-ui/icons/ThumbUpRounded';
import { IconButton, Grid, ThemeProvider } from '@material-ui/core';
import { LikeVotes, DislikeVotes } from './vote';
import LoginModal from '../sign/LoginModal';
import { useStyles, themeVote } from './styles/voteStyles';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { postPostVote, updatePostVote, fetchPostVotesByLoggedInUser } from '../../redux/ActionCreators';
import AlertSnackbar from '../alert/snackbar';

 export default function VoteButtons({ likes, dislikes }) {

    const classes = useStyles();

    const auth = useSelector(state => state.Auth);
    const postVotes = useSelector(state => state.postVotes);

    const [snackbar, setSnackbar] = React.useState(false);

    const [currentUserVote, setCurrentUserVote] = React.useState({
        type: '',
        post: null,
    });

    //console.log(currentUserVote);

    const isAuthenticated = auth.isAuthenticated;
    const currentUserId = auth.currentUserId;

    const { postId } = useParams();

    const dispatch = useDispatch();

    const [openModal, setOpenModal] = React.useState(false);

    const [likeCount, setLikeCount] = React.useState(likes);
    const [dislikeCount, setDislikeCount] = React.useState(dislikes);

    const [likedUser, setLikedUser] = React.useState('');
    const [dislikedUser, setDislikedUser] = React.useState('');

    const [likeColorChange, setLikeColorChange] = React.useState("secondary");
    const [dislikeColorChange, setDislikeColorChange] = React.useState("secondary");

    React.useEffect(() => {
        if(isAuthenticated && postVotes.status === 'idle') {
            if(postId) dispatch(fetchPostVotesByLoggedInUser(currentUserId, postId));
        }
    }, [dispatch, isAuthenticated, currentUserId, postVotes, postId]);

    React.useEffect(() => {
        if(postVotes.votes && postVotes.votes.length !== 0) handleCurrentUserVote({type: postVotes.votes[0].voteType, post: postVotes.votes[0].post.toString()});
    }, [postVotes]);

    const handleCurrentUserVote = (vote) => {
        setCurrentUserVote(vote);
    };

    React.useEffect(() => {
        if(isAuthenticated) {
            if(currentUserVote.post === postId) {
                if(currentUserVote.type === 'LIKE') {
                    setLikeColorChange("primary");
                    setLikedUser(currentUserId);
                }
                if(currentUserVote.type === 'DISLIKE') {
                    setDislikeColorChange("primary");
                    setDislikedUser(currentUserId);
                }
                if(currentUserVote.type === 'EMPTY') {
                    setDislikeColorChange("secondary");
                }
            }
        }
    }, [currentUserVote, isAuthenticated, currentUserId, postId]);

    const handleModalOpen = () => {
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
    };

    const handleSnackbar = () => {
        setSnackbar(true)
    };

    const handleLike = () => {
        if(isAuthenticated) {
            if(dislikeColorChange === "primary") setDislikeColorChange("secondary");

            if(likedUser.toString() === currentUserId.toString()) {
                setLikeColorChange("secondary");
                setLikedUser('');
                setLikeCount(likeCount - 1);
                dispatch(updatePostVote(postId, 'EMPTY', currentUserId));
            }
            if(likedUser.toString() !== currentUserId.toString()) {
                setLikeColorChange("primary");
                setLikedUser(currentUserId);
                setLikeCount(likeCount + 1);
                dispatch(postPostVote(postId, 'LIKE', currentUserId));
                handleSnackbar();
                if(dislikedUser.toString() === currentUserId.toString()) {
                    setDislikedUser('');
                    setDislikeCount(dislikeCount - 1);
                    dispatch(updatePostVote(postId, 'LIKE', currentUserId));
                    handleSnackbar();
                }
            }
        }else {
            handleModalOpen();
        }
    }

    const handleDislike = () => {
        if(isAuthenticated) {
            if(likeColorChange === "primary") setLikeColorChange("secondary");
            
            if(dislikedUser.toString() === currentUserId.toString()) {
                setDislikeColorChange("secondary");
                setDislikedUser('');
                setDislikeCount(dislikeCount - 1);
                dispatch(updatePostVote(postId, 'EMPTY', currentUserId));
            }
            if(dislikedUser.toString() !== currentUserId.toString()) {
                setDislikeColorChange("primary");
                setDislikedUser(currentUserId);
                setDislikeCount(dislikeCount + 1);
                dispatch(postPostVote(postId, 'DISLIKE', currentUserId));
                if(likedUser.toString() === currentUserId.toString()) {
                    setLikedUser('');
                    setLikeCount(likeCount - 1);
                    dispatch(updatePostVote(postId, 'DISLIKE', currentUserId));
                }
            }
        }else {
            handleModalOpen();
        }
    }

    return(
        <ThemeProvider theme={themeVote}>
            <Grid container justify="center" alignItems="center" spacing={3} style={{padding: 3}}>
                <Grid item>
                    <Grid container justify="center" alignItems="center" spacing={0}>
                        <Grid item>
                            <IconButton onClick={() => handleLike()} size="small">
                                <ThumbUpRoundedIcon color={likeColorChange}/>
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <LikeVotes likeCount={likeCount}/>
                        </Grid>
                    </Grid>    
                </Grid>
                <Grid item>
                    <Grid container justify="center" alignItems="center" spacing={0}>
                        <Grid item>
                            <IconButton onClick={() => handleDislike()} size="small">
                                <ThumbDownRoundedIcon color={dislikeColorChange}/>
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <DislikeVotes dislikeCount={dislikeCount}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <LoginModal openModal={openModal} classes={classes} handleModalClose={handleModalClose}/>
            <AlertSnackbar message={"Added to liked posts"} setOpen={setSnackbar} open={snackbar}/>
        </ThemeProvider>
    );
}