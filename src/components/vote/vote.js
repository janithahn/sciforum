import React from 'react';
import { CircularProgress, Typography } from '@material-ui/core';
import { fetchAnswerVotes, fetchAnswerVotesDirect, fetchPostVotesDirect } from '../../redux/ActionCreators';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles } from './styles/voteStyles';

export function LikeVotes({answerId, postId, likeCount, setLikeCount}) {

    //console.log(answerId, postId, likeCount, setLikeCount);

    const classes = useStyles();

    const answerVotes = useSelector(state => state.answerVotes);
    const dispatch = useDispatch();

    React.useEffect(() => {
        //dispatch(fetchAnswerVotes(answerId, 'LIKE'));
        if(answerId) (dispatch(fetchAnswerVotesDirect(answerId, "LIKE", setLikeCount)));
        if(postId) (dispatch(fetchPostVotesDirect(postId, "LIKE", setLikeCount)));
    }, [dispatch]);

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

export function DislikeVotes({answerId, postId, dislikeCount, setDislikeCount}) {

    const classes = useStyles();

    const answerVotes = useSelector(state => state.answerVotes);
    const dispatch = useDispatch();

    React.useEffect(() => {
        //dispatch(fetchAnswerVotes(answerId, 'DISLIKE'));
        if(answerId) (dispatch(fetchAnswerVotesDirect(answerId, "DISLIKE", setDislikeCount)));
        if(postId) (dispatch(fetchPostVotesDirect(postId, "DISLIKE", setDislikeCount)));
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