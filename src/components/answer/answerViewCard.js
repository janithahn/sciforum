import React from 'react';
import { Grid, Typography, Divider, Avatar, Button, Box } from '@material-ui/core';
import { Preview } from './answerPreview';
import { fetchAnswerVotesByLoggedInUser } from '../../redux/ActionCreators';
import { useDispatch, useSelector } from 'react-redux';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import { useStyles } from './styles/answerStyles';
import VoteButtons from '../vote/answerVoteButtons';

export default function AnswerViewCard({answer, handleModalOpen, handleDeleteModalOpen, isAuthenticated, currentUserId}) {

    const classes = useStyles();

    const dispatch = useDispatch();
    const answerVotes = useSelector(state => state.answerVotes);

    const [currentUserVote, setCurrentUserVote] = React.useState({
        type: '',
        answer: null,
    });

    React.useEffect(() => {
        if(isAuthenticated && answerVotes.status === 'idle') {
            dispatch(fetchAnswerVotesByLoggedInUser(currentUserId, answer.id));
        }
    }, [dispatch, isAuthenticated, currentUserId, answer]);

    React.useEffect(() => {
        if(answerVotes.votes.length !== 0) setCurrentUserVote({type: answerVotes.votes[0].voteType, answer: answerVotes.votes[0].answer});
    }, [answerVotes.votes]);

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
                                                    <Link style={{textDecoration: 'none', fontSize: 14}} to={`/profile/${answer.ownerDisplayName}/`}>{answer.ownerDisplayName}</Link>
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
                                            isAuthenticated={isAuthenticated} 
                                            currentUserId={currentUserId}
                                            currentUserVote={currentUserVote}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Grid container justify="center" alignItems="center" spacing={1}>
                                            <Grid item>
                                                <Grid container justify="center" alignItems="center" spacing={0}>
                                                    <Grid item>
                                                        {isAuthenticated && answer.owner == currentUserId ?
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
                                                        {isAuthenticated && answer.owner == currentUserId ?
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
                        <Divider/>
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment>
    );
}