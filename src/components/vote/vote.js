import React from 'react';
import { Typography, Box } from '@material-ui/core';
import { fetchAnswerVotesDirect, fetchPostVotesDirect } from '../../redux/ActionCreators';
import { useDispatch } from 'react-redux';
import { useStyles } from './styles/voteStyles';

export function LikeVotes({answerId, postId, likeCount, setLikeCount}) {

    const classes = useStyles();

    const dispatch = useDispatch();

    React.useEffect(() => {
        //dispatch(fetchAnswerVotes(answerId, 'LIKE'));
        if(answerId) (dispatch(fetchAnswerVotesDirect(answerId, "LIKE", setLikeCount)));
        if(postId) (dispatch(fetchPostVotesDirect(postId, "LIKE", setLikeCount)));
    }, [dispatch, answerId, postId, setLikeCount]);

    return(
        <Typography className={classes.iconWrap} color="secondary">
            <Box fontWeight="fontWeightBold" fontSize={13}>
                {likeCount}
            </Box>
        </Typography>
    );
}

export function DislikeVotes({answerId, postId, dislikeCount, setDislikeCount}) {

    const classes = useStyles();

    const dispatch = useDispatch();

    React.useEffect(() => {
        //dispatch(fetchAnswerVotes(answerId, 'DISLIKE'));
        if(answerId) (dispatch(fetchAnswerVotesDirect(answerId, "DISLIKE", setDislikeCount)));
        if(postId) (dispatch(fetchPostVotesDirect(postId, "DISLIKE", setDislikeCount)));
    }, [dispatch, answerId, postId, setDislikeCount]);

    return(
        <Typography className={classes.iconWrap} color="secondary">
            <Box fontWeight="fontWeightBold" fontSize={13}>
                {dislikeCount}
            </Box>
        </Typography>
    );
}