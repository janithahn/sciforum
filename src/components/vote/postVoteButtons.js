import React from 'react';
import ThumbDownRoundedIcon from '@material-ui/icons/ThumbDownRounded';
import ThumbUpRoundedIcon from '@material-ui/icons/ThumbUpRounded';
import { IconButton, Grid, ThemeProvider } from '@material-ui/core';
import { LikeVotes, DislikeVotes } from './vote';
import LoginModal from '../sign/LoginModal';
import { useStyles, themeVote } from './styles/voteStyles';
import { useDispatch } from 'react-redux';
import { postPostVote, updatePostVote } from '../../redux/ActionCreators';

 export default function VoteButtons({postId, isAuthenticated, currentUserId, currentUserVote}) {

    const classes = useStyles();

    const dispatch = useDispatch();

    const [openModal, setOpenModal] = React.useState(false);

    const [likeCount, setLikeCount] = React.useState(0);
    const [dislikeCount, setDislikeCount] = React.useState(0);

    const [likedUser, setLikedUser] = React.useState('');
    const [dislikedUser, setDislikedUser] = React.useState('');

    const [likeColorChange, setLikeColorChange] = React.useState("secondary");
    const [dislikeColorChange, setDislikeColorChange] = React.useState("secondary");

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
    }, [currentUserVote, isAuthenticated, postId]);

    const handleModalOpen = () => {
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
    };

    const handleLike = () => {
        if(isAuthenticated) {
            if(dislikeColorChange === "primary") setDislikeColorChange("secondary");

            if(likedUser == currentUserId) {
                setLikeColorChange("secondary");
                setLikedUser('');
                setLikeCount(likeCount - 1);
                dispatch(updatePostVote(postId, 'EMPTY', currentUserId));
            }
            if(likedUser != currentUserId) {
                setLikeColorChange("primary");
                setLikedUser(currentUserId);
                setLikeCount(likeCount + 1);
                dispatch(postPostVote(postId, 'LIKE', currentUserId));
                if(dislikedUser == currentUserId) {
                    setDislikedUser('');
                    setDislikeCount(dislikeCount - 1);
                    dispatch(updatePostVote(postId, 'LIKE', currentUserId));
                }
            }
        }else {
            handleModalOpen();
        }
    }

    const handleDislike = () => {
        if(isAuthenticated) {
            if(likeColorChange === "primary") setLikeColorChange("secondary");
            
            if(dislikedUser == currentUserId) {
                setDislikeColorChange("secondary");
                setDislikedUser('');
                setDislikeCount(dislikeCount - 1);
                dispatch(updatePostVote(postId, 'EMPTY', currentUserId));
            }
            if(dislikedUser != currentUserId) {
                setDislikeColorChange("primary");
                setDislikedUser(currentUserId);
                setDislikeCount(dislikeCount + 1);
                dispatch(postPostVote(postId, 'DISLIKE', currentUserId));
                if(likedUser == currentUserId) {
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
                            <LikeVotes postId={postId} likeCount={likeCount} setLikeCount={setLikeCount}/>
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
                            <DislikeVotes postId={postId} dislikeCount={dislikeCount} setDislikeCount={setDislikeCount}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <LoginModal openModal={openModal} classes={classes} handleModalClose={handleModalClose}/>
        </ThemeProvider>
    );
}