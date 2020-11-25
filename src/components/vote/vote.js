import React from 'react';
import { Typography, Box } from '@material-ui/core';
import { useStyles } from './styles/voteStyles';

export function LikeVotes({ likeCount }) {

    const classes = useStyles();

    return(
        <Typography component={'div'} className={classes.iconWrap} color="secondary">
            <Box fontWeight="fontWeightBold" fontSize={13}>
                {likeCount}
            </Box>
        </Typography>
    );
}

export function DislikeVotes({ dislikeCount }) {

    const classes = useStyles();

    return(
        <Typography component={'div'} className={classes.iconWrap} color="secondary">
            <Box fontWeight="fontWeightBold" fontSize={13}>
                {dislikeCount}
            </Box>
        </Typography>
    );
}