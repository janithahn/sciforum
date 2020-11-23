import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Grid, Link } from '@material-ui/core';
import { fetchMyPosts } from '../../redux/ActionCreators';
import QuestionViewCard from '../post/QuestionViewCardComponent'
import Pagination from '@material-ui/lab/Pagination';
import { useStyles } from './styles/mypostsStyles';

export default function Home() {

    const classes = useStyles();

    const myposts = useSelector(state => state.MyPosts);
    const auth = useSelector(state => state.Auth)
    const dispatch = useDispatch();

    React.useEffect(() => {
        if(myposts.status === 'idle' && auth.isAuthenticated) {
            dispatch(fetchMyPosts(auth.currentUserId, 1))
        }
    }, [myposts, dispatch, auth]);

    const handlePages = (event, page) => {
        console.log(event);
        console.log(page);
        event.dispatchConfig = dispatch(fetchMyPosts(auth.currentUserId, page))
    };

    console.log(myposts);

    if(myposts.status === 'loading' || myposts.status === 'idle') {
        return(<div></div>);
    }else if(myposts.status === 'failed') {
        return(<h4>Error loading...!</h4>);
    } else {
        const PostsList = myposts.myposts.results.map((post, key) => <QuestionViewCard key={key} item={post}/>);
        const total_pages = myposts.myposts.total_pages;
        const current_page = myposts.myposts.current_page;

        
        return(
            <React.Fragment>
                <Grid container direction="column" justify="center" alignItems="flex-end">
                    <Link href="/ask" style={{textDecoration: 'none'}}>
                        <Button style={{margin: 4}} color='secondary' variant="outlined">Ask a Question</Button>
                    </Link>
                </Grid>
                {PostsList}
                <Grid container direction="column" justify="center" alignItems="flex-end">
                    <Pagination className={classes.pagination} page={current_page} count={total_pages} shape="rounded" onChange={(event, page) => handlePages(event, page)}/>
                </Grid>
            </React.Fragment>
        );
    }
}