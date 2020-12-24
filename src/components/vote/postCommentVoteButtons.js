import React from 'react';
import ThumbDownRoundedIcon from '@material-ui/icons/ThumbDownRounded';
import ThumbUpRoundedIcon from '@material-ui/icons/ThumbUpRounded';
import { IconButton, Grid, ThemeProvider } from '@material-ui/core';
import { LikeVotes, DislikeVotes } from './vote';
import LoginModal from '../sign/LoginModal';
import { useStyles, themeVote } from './styles/voteStyles';
import { useDispatch, useSelector } from 'react-redux';
import { postPostCommentVote, updatePostCommentVote, fetchPostCommentVotesByLoggedInUser } from '../../redux/ActionCreators';

 export default function VoteButtons({commentId, likes, dislikes}) {

    const classes = useStyles();

    const dispatch = useDispatch();

    const auth = useSelector(state => state.Auth);
    const postCommentVotes = useSelector(state => state.postCommentVotes);

    const isAuthenticated = auth.isAuthenticated;

    const [currentUserVote, setCurrentUserVote] = React.useState({
        type: '',
        comment: null,
    });

    React.useEffect(() => {
        if(auth.isAuthenticated && postCommentVotes.status === 'idle') {
            if(commentId) dispatch(fetchPostCommentVotesByLoggedInUser(auth.currentUserId, commentId));
        }
    }, [dispatch, auth, commentId, postCommentVotes.status]);

    React.useEffect(() => {
        if(postCommentVotes.votes && postCommentVotes.votes.length !== 0) handleCurrentUserVote({type: postCommentVotes.votes[0].voteType, comment: postCommentVotes.votes[0].comment});
    }, [postCommentVotes]);

    const handleCurrentUserVote = (vote) => {
        setCurrentUserVote(vote);
    };

    const [openModal, setOpenModal] = React.useState(false);

    const [likeCount, setLikeCount] = React.useState(likes);
    const [dislikeCount, setDislikeCount] = React.useState(dislikes);

    const [likedUser, setLikedUser] = React.useState('');
    const [dislikedUser, setDislikedUser] = React.useState('');

    const [likeColorChange, setLikeColorChange] = React.useState("secondary");
    const [dislikeColorChange, setDislikeColorChange] = React.useState("secondary");

    React.useEffect(() => {
        if(isAuthenticated) {
            if(currentUserVote.comment === commentId) {
                if(currentUserVote.type === 'LIKE') {
                    setLikeColorChange("primary");
                    setLikedUser(auth.currentUserId);
                }
                if(currentUserVote.type === 'DISLIKE') {
                    setDislikeColorChange("primary");
                    setDislikedUser(auth.currentUserId);
                }
                if(currentUserVote.type === 'EMPTY') {
                    setDislikeColorChange("secondary");
                }
            }
        }
    }, [currentUserVote, isAuthenticated, commentId, auth]);

    const handleModalOpen = () => {
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
    };

    const handleLike = () => {
        if(isAuthenticated) {
            if(dislikeColorChange === "primary") setDislikeColorChange("secondary");

            if(likedUser.toString() === auth.currentUserId.toString()) {
                setLikeColorChange("secondary");
                setLikedUser('');
                setLikeCount(likeCount - 1);
                dispatch(updatePostCommentVote(commentId, 'EMPTY', auth.currentUserId));
            }
            if(likedUser.toString() !== auth.currentUserId.toString()) {
                setLikeColorChange("primary");
                setLikedUser(auth.currentUserId);
                setLikeCount(likeCount + 1);
                dispatch(postPostCommentVote(commentId, 'LIKE', auth.currentUserId));
                if(dislikedUser.toString() === auth.currentUserId.toString()) {
                    setDislikedUser('');
                    setDislikeCount(dislikeCount - 1);
                    dispatch(updatePostCommentVote(commentId, 'LIKE', auth.currentUserId));
                }
            }
        }else {
            handleModalOpen();
        }
    }

    const handleDislike = () => {
        if(isAuthenticated) {
            if(likeColorChange === "primary") setLikeColorChange("secondary");
            
            if(dislikedUser.toString() === auth.currentUserId.toString()) {
                setDislikeColorChange("secondary");
                setDislikedUser('');
                setDislikeCount(dislikeCount - 1);
                dispatch(updatePostCommentVote(commentId, 'EMPTY', auth.currentUserId));
            }
            if(dislikedUser.toString() !== auth.currentUserId.toString()) {
                setDislikeColorChange("primary");
                setDislikedUser(auth.currentUserId);
                setDislikeCount(dislikeCount + 1);
                dispatch(postPostCommentVote(commentId, 'DISLIKE', auth.currentUserId));
                if(likedUser.toString() === auth.currentUserId.toString()) {
                    setLikedUser('');
                    setLikeCount(likeCount - 1);
                    dispatch(updatePostCommentVote(commentId, 'DISLIKE', auth.currentUserId));
                }
            }
        }else {
            handleModalOpen();
        }
    }

    return(
        <ThemeProvider theme={themeVote}>
            <Grid container justify="center" alignItems="center" spacing={1} style={{padding: 3}}>
                <Grid item>
                    <Grid container justify="center" alignItems="center" spacing={0}>
                        <Grid item>
                            <IconButton onClick={() => handleLike()} size="small">
                                <ThumbUpRoundedIcon fontSize="small" color={likeColorChange}/>
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
                                <ThumbDownRoundedIcon fontSize="small" color={dislikeColorChange}/>
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <DislikeVotes dislikeCount={dislikeCount}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <LoginModal openModal={openModal} classes={classes} handleModalClose={handleModalClose}/>
        </ThemeProvider>
    );
}