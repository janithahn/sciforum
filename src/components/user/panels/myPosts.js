import React from 'react';
import { Grid, Paper, Typography, Link, Divider } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyPostsByUsername } from './actions';
import { useStyles } from './styles';

export default function MyPostsAccount({ usernameFromTheUrl }) {

    const classes = useStyles();

    const dispatch = useDispatch();
    const auth = useSelector(state => state.Auth);
    const myPosts = useSelector(state => state.MyPostsProfile);

    React.useEffect(() => {
       if(myPosts.status === 'idle' && auth.isAuthenticated) dispatch(fetchMyPostsByUsername(usernameFromTheUrl, 1));
    }, [dispatch, myPosts, auth]);

    const postsList = myPosts.myposts.results ? myPosts.myposts.results.map(item => (
        <Grid item key={item.id}>
            <Paper variant="elevation" style={{padding: 4}} elevation={0}>
                <Link href={`/questions/${item.postBelong}/#${item.id}`} underline="none" color="inherit">
                    <Grid container justify="flex-start" alignItems="center" spacing={2}>
                        <Grid item>
                            <Typography variant="subtitle1" color="textPrimary" style={{fontWeight: 'bold'}}>{item.title}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body2" color="textPrimary">{item.answers === 1 ? `${item.answers} Answer`: `${item.answers} Answers`}</Typography>
                        </Grid> 
                        <Grid item>
                            <Typography variant="body2" color="textPrimary">{item.likes === 1 ? `${item.likes} Like`: `${item.likes} Likes`}</Typography>
                        </Grid> 
                        <Grid item>
                            <Typography variant="body2" color="textPrimary">{item.likes === 1 ? `${item.viewCount} View`: `${item.viewCount} Views`}</Typography>
                        </Grid> 
                    </Grid>
                </Link>
            </Paper>
            <Divider/>
        </Grid>
    )): undefined;

    //pagination
    const total_pages = myPosts.myposts.total_pages;
    const current_page = myPosts.myposts.current_page;

    const handlePages = (event, page) => {
        event.dispatchConfig = dispatch(fetchMyPostsByUsername(usernameFromTheUrl, page));
    };
    //end pagination

    if(myPosts.status === 'loading') {
        return(<div></div>);
    }else if(myPosts.status === 'failed'){
        return(<p>Error loading</p>);
    }else {
        return(
            <Grid container direction="column" alignItems="flex-start" justify="center" spacing={2}>
                {myPosts.myposts.count === 0 ? <Typography variant="subtitle1" color="textPrimary">{"No posts have been posted"}</Typography>: postsList}
                <Grid item>
                    {myPosts.myposts.count !== 0 && total_pages > 1 ? 
                        <Grid container direction="column" justify="center" alignItems="flex-end">
                            <Pagination 
                                className={classes.pagination} 
                                page={current_page} 
                                count={total_pages} 
                                variant="outlined"
                                shape="rounded" 
                                size="small"
                                onChange={(event, page) => handlePages(event, page)}
                            />
                        </Grid>: 
                    undefined}
                </Grid>
            </Grid>
        );
    }
}