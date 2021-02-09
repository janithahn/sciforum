import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Grid } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { fetchMyPosts } from '../../redux/ActionCreators';
import QuestionViewCard from '../post/QuestionViewCardComponent'
import Pagination from '@material-ui/lab/Pagination';
import { useStyles } from './styles/mypostsStyles';
import MyPostsLoader from './skeletons/mypostsSkels';

export default function MyPosts() {

    const classes = useStyles();

    const myposts = useSelector(state => state.MyPosts);
    const auth = useSelector(state => state.Auth)
    const dispatch = useDispatch();

    React.useEffect(() => {
        if(myposts.status === 'idle' && auth.isAuthenticated) {
            dispatch(fetchMyPosts(auth.currentUserId, 1));
        }
    }, [myposts, dispatch, auth]);

    const handlePages = (event, page) => {
        event.dispatchConfig = dispatch(fetchMyPosts(auth.currentUserId, page))
    };

    if(myposts.status === 'loading' || myposts.status === 'idle') {
        return(<MyPostsLoader/>);
    }else if(myposts.status === 'failed') {
        return(<h4>Error loading...!</h4>);
    } else {
        const PostsList = myposts.myposts.results ? myposts.myposts.results.map((post) => <QuestionViewCard key={post.id} item={post}/>): undefined;
        const total_pages = myposts.myposts.total_pages;
        const current_page = myposts.myposts.current_page;

        return(
            <React.Fragment>
                <Grid container direction="column" justify="center" alignItems="flex-end">
                    <RouterLink to="/ask" style={{textDecoration: 'none'}}>
                        <Button style={{margin: 4}} color='secondary' variant="outlined">Ask a Question</Button>
                    </RouterLink>
                </Grid>
                {PostsList}
                {myposts.myposts.count !== 0 && total_pages > 1 ? <Grid container direction="column" justify="center" alignItems="flex-end">
                    <Pagination className={classes.pagination} page={current_page} count={total_pages} shape="rounded" onChange={(event, page) => handlePages(event, page)}/>
                </Grid>: undefined} 
            </React.Fragment>
        );
    }
}