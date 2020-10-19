import React from 'react';
import ThumbDownRoundedIcon from '@material-ui/icons/ThumbDownRounded';
import ThumbUpRoundedIcon from '@material-ui/icons/ThumbUpRounded';
import { IconButton, Grid, ThemeProvider, Fade, Modal, Backdrop } from '@material-ui/core';
import { LikeVotes, DislikeVotes } from '../vote/vote';
import SignIn from '../sign/SignInComponent';
import { useStyles, themeVote } from './styles/voteStyles';

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

 export default function VoteButtons({answerId, isAuthenticated, currentUserId}) {

    const classes = useStyles();

    const [likeColorChange, setLikeColorChange] = React.useState("secondary");
    const [dislikeColorChange, setDislikeColorChange] = React.useState("secondary");

    const [likeCount, setLikeCount] = React.useState(0);
    const [dislikeCount, setDislikeCount] = React.useState(0);

    const [likedUser, setLikedUser] = React.useState('');
    const [dislikedUser, setDislikedUser] = React.useState('');

    const [openModal, setOpenModal] = React.useState(false);

    const handleModalOpen = () => {
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
    };

    const handleLike = () => {
        /*if(likeColorChange === "secondary") setLikeColorChange("primary");
        if(likeColorChange === "primary") setLikeColorChange("secondary");*/
        if(isAuthenticated) {
            if(dislikeColorChange === "primary") setDislikeColorChange("secondary");

            if(likedUser == currentUserId) {
                setLikeColorChange("secondary");
                setLikedUser('');
                setLikeCount(likeCount - 1);
                //setDislikeCount(dislikeCount - 1);
            }
            if(likedUser != currentUserId) {
                setLikeColorChange("primary");
                setLikedUser(currentUserId);
                setLikeCount(likeCount + 1);
                if(dislikedUser == currentUserId) {
                    setDislikedUser('');
                    setDislikeCount(dislikeCount - 1);
                }
            }
        }else {
            handleModalOpen();
        }
    }

    const handleDislike = () => {
        /*if(dislikeColorChange === "secondary") setDislikeColorChange("primary");
        if(dislikeColorChange === "primary") setDislikeColorChange("secondary");*/
        if(isAuthenticated) {
            if(likeColorChange === "primary") setLikeColorChange("secondary");
            
            if(dislikedUser == currentUserId) {
                setDislikeColorChange("secondary");
                setDislikedUser('');
                setDislikeCount(dislikeCount - 1);
                //setLikeCount(likeCount - 1);
            }
            if(dislikedUser != currentUserId) {
                setDislikeColorChange("primary");
                setDislikedUser(currentUserId);
                setDislikeCount(dislikeCount + 1);
                if(likedUser == currentUserId) {
                    setLikedUser('');
                    setLikeCount(likeCount - 1);
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
                            <LikeVotes answerId={answerId} likeCount={likeCount} setLikeCount={setLikeCount}/>
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
                            <DislikeVotes answerId={answerId} dislikeCount={dislikeCount} setDislikeCount={setDislikeCount}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <LoginModal openModal={openModal} classes={classes} handleModalClose={handleModalClose}/>
        </ThemeProvider>
    );
}