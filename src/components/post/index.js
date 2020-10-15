import React from 'react';
import PostDetail from './PostDetailComponent';
import Answer from '../answer/answer';
import { useParams } from 'react-router-dom';

export default function PostView() {

    const { postId } = useParams();

    return(
        <React.Fragment>
            <PostDetail/>
            <Answer postId={postId}/>
        </React.Fragment>
    );
}