import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Grid, Link } from '@material-ui/core';
import { fetchMyPosts } from '../../redux/ActionCreators';
import QuestionViewCard from '../post/QuestionViewCardComponent'

export default function Home() {
    const myposts = useSelector(state => state.MyPosts);
    const auth = useSelector(state => state.Auth)
    const dispatch = useDispatch();

    React.useEffect(() => {
        if(myposts.status === 'idle' && auth.isAuthenticated) {
            dispatch(fetchMyPosts(auth.currentUserId))
        }
    }, [myposts, dispatch, auth]);

    if(myposts.status === 'loading' || myposts.status === 'idle') {
        return(<div></div>);
    }else if(myposts.status === 'failed') {
        return(<h4>Error loading...!</h4>);
    } else {
        const PostsList = myposts.myposts.results.map((post, key) => <QuestionViewCard key={key} item={post}/>);
        
        return(
            <React.Fragment>
                <Grid container direction="column" justify="center" alignItems="flex-end">
                    <Link href="/ask" style={{textDecoration: 'none'}}>
                        <Button style={{margin: 4}} color='secondary' variant="outlined">Ask a Question</Button>
                    </Link>
                </Grid>
                {PostsList}
            </React.Fragment>
        );
    }
}