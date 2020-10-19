import React from 'react';
import { CircularProgress, Typography } from '@material-ui/core';
import { fetchAnswerVotes, fetchAnswerVotesDirect } from '../../redux/ActionCreators';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles } from './styles/voteStyles';

export function LikeVotes({answerId, likeCount, setLikeCount}) {

    const classes = useStyles();

    const answerVotes = useSelector(state => state.answerVotes);
    const dispatch = useDispatch();

    React.useEffect(() => {
        //dispatch(fetchAnswerVotes(answerId, 'LIKE'));
        dispatch(fetchAnswerVotesDirect(answerId, "LIKE", setLikeCount));
    }, []);

    if(answerVotes.state === 'idle' || answerVotes.state === 'loading') {
        return(<CircularProgress/>);
    }else if (answerVotes.state === 'failed') {
        return(<p>Error loading</p>);
    }else {
        return(
            <Typography className={classes.iconWrap} variant="body2">{likeCount}</Typography>
        );
    }
}

export function DislikeVotes({answerId, dislikeCount, setDislikeCount}) {

    const classes = useStyles();

    const answerVotes = useSelector(state => state.answerVotes);
    const dispatch = useDispatch();

    React.useEffect(() => {
        //dispatch(fetchAnswerVotes(answerId, 'DISLIKE'));
        dispatch(fetchAnswerVotesDirect(answerId, "DISLIKE", setDislikeCount));
    }, [dispatch]);

    if(answerVotes.state === 'idle' || answerVotes.state === 'loading') {
        return(<CircularProgress/>);
    }else if (answerVotes.state === 'failed') {
        return(<p>Error loading</p>);
    }else {
        return(
            <Typography className={classes.iconWrap} variant="body2">{dislikeCount}</Typography>
        );
    }
}