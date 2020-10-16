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
            <Grid container direction="column">
                <PostDetail/>
                <Grid m={10} item>
                    <Answer postId={postId}/>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}