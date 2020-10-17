import React from 'react';
import PostDetail from './PostDetailComponent';
import Answer from '../answer/answer';
import { Grid, ThemeProvider } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { theme } from './styles/postsStyles';

export default function PostView() {

    const { postId } = useParams();

    return(
        <React.Fragment>
            <Grid container direction="column" justify="flex-end" spacing={4}>
                <Grid item>
                    <PostDetail/>
                </Grid>
                <Grid item>
                    <Answer postId={postId}/>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}