import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Grid } from '@material-ui/core';
import { fetchPosts } from '../../redux/ActionCreators';
import QuestionViewCard from '../post/QuestionViewCardComponent';

export default function Home(props) {
    const posts = useSelector(state => state.Posts);
    const postsStatus = useSelector(state => state.Posts.status);
    const dispatch = useDispatch();

    //const [postList, setPostList] = React.useState(posts.posts.map((post) => <RenderCard key={post.id} item={post}/>));

    React.useEffect(() => {
        if(postsStatus === 'idle') {
            dispatch(fetchPosts())
        }
    }, [postsStatus, dispatch]);

    const PostsList = posts.posts.map((post) => <QuestionViewCard key={post.id} item={post}/>);

    if(posts.status === 'loading') {
        return(<CircularProgress color="secondary" size={15}/>);
    }else if(posts.status === 'failed') {
        //console.log(posts.errMess);
        return(<h4>Error loading...!</h4>);
    } else {
        return(
            <React.Fragment>
                <Grid container direction="column" justify="center" alignItems="flex-end">
                    <Link to="/ask" style={{textDecoration: 'none'}}>
                        <Button style={{margin: 4}} color='secondary' variant="outlined">Ask a Question</Button>
                    </Link>
                </Grid>
                {PostsList}
            </React.Fragment>
        );
    }
}