import React from 'react';
import { Grid, Typography, Avatar, Button, Box, Link } from '@material-ui/core';
import { Preview } from './answerPreview';
import { useSelector, useDispatch } from 'react-redux';
import TimeAgo from 'react-timeago';
import { useStyles } from './styles/answerStyles';
import VoteButtons from '../vote/answerVoteButtons';
import { AnswerCommentInput, AnswerCommentRender } from './comment/comment';
import { EditorState } from 'draft-js';
import { createAnswerComments } from '../../redux/ActionCreators';
import { useParams } from 'react-router-dom';

export default function AnswerViewCard({answer, handleModalOpen, handleDeleteModalOpen}) {

    const classes = useStyles();

    const { postId } = useParams();

    const dispatch = useDispatch();

    const auth = useSelector(state => state.Auth);

    const isAuthenticated = auth.isAuthenticated;
    const currentUserId = auth.currentUserId;

    const [openCommentBox, setOpenCommentBox] = React.useState(false);
    const [showAddComment, setShowAddComment] = React.useState(true);

    const handleCommentBoxOpen = () => {
        setOpenCommentBox(true);
        handleShowAddComment();
    };

    const handleShowAddComment = () => {
        setShowAddComment(false);
    };

    const handleCommentSubmit = React.useCallback(({ submitVal, setEditorState, setSubmitVal, text }) => {
        if(text.length !== 0) {
            dispatch(createAnswerComments(submitVal));
        }
        setEditorState(() => EditorState.createEmpty());
        setSubmitVal({});
    }, [dispatch, postId]);

    return(
        <React.Fragment>
            <Box>
                <Grid container direction="column" spacing={0}>
                    <Grid item>
                        <Grid container direction="column" spacing={2}>
                            <Grid item>
                                <Grid container direction="row" justify="flex-start" alignItems="center" spacing={1}>
                                    <Grid item>
                                        <Avatar alt={answer.ownerAvatar} src={answer.ownerAvatar} />
                                    </Grid>
                                    <Grid item>
                                        <Grid container direction="column" alignItems="flex-start" justify="flex-start" spacing={0}>
                                            <Grid item>
                                                <Typography style={{fontSize: 13}} variant="body2" color="textSecondary">
                                                    <Link style={{textDecoration: 'none', fontSize: 14}} href={`/profile/${answer.ownerDisplayName}/`} >{answer.ownerDisplayName}</Link>
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography style={{fontSize: 13}} variant="body2" color="textSecondary">
                                                    <TimeAgo live={false} date={answer.created_at} />
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Preview source={answer.answerContent}/>
                            </Grid>
                            <Grid item>
                                <Grid container justify="space-between" alignItems="center" spacing={2}>
                                    <Grid item>
                                        <VoteButtons 
                                            answerId={answer.id} 
                                            likes={answer.likes}
                                            dislikes={answer.dislikes}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Grid container justify="center" alignItems="center" spacing={1}>
                                            <Grid item>
                                                <Grid container justify="center" alignItems="center" spacing={0}>
                                                    <Grid item>
                                                        {isAuthenticated && answer.owner && answer.owner.toString() === currentUserId.toString() ?
                                                        <Grid item>
                                                            <Button color="primary" className={classes.editButton} onClick={() => handleModalOpen(answer)}>
                                                                <Typography className={classes.iconWrap} variant="body2">
                                                                    {"Edit"}
                                                                </Typography>
                                                            </Button>
                                                        </Grid>: 
                                                        undefined}
                                                    </Grid>
                                                    <Grid item>
                                                        {isAuthenticated && answer.owner && answer.owner.toString() === currentUserId.toString() ?
                                                        <Grid item>
                                                            <Button color="secondary" className={classes.editButton} onClick={() => handleDeleteModalOpen(answer)}>
                                                                <Typography className={classes.iconWrap} variant="body2">
                                                                    {"Delete"}
                                                                </Typography>
                                                            </Button>
                                                        </Grid>: 
                                                        undefined}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Typography style={{fontSize: 13}} variant="body2" color="textSecondary">
                                                    {"Updated "}<TimeAgo live={false} date={answer.updated_at} />
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        {
                            auth.isAuthenticated && showAddComment ? 
                                <Button variant="text" size="small" style={{textTransform: "none"}} color="inherit" onClick={handleCommentBoxOpen}>
                                    <Typography variant="body2" color="primary">Add comment</Typography>
                                </Button>: 
                            undefined
                        }
                        {
                            auth.isAuthenticated && openCommentBox ? 
                                <AnswerCommentInput handleCommentSubmit={handleCommentSubmit} currentUserProfileImg={auth.currentUserProfileImg} answerId={answer.id}/>: 
                            undefined
                        }
                    </Grid>
                    <Grid item>
                        {<AnswerCommentRender answerId={answer.id}/>}
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment>
    );
};