import React from 'react';
import { Grid, Paper, Typography, Link, Divider } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLikedPosts } from './actions';

export default function Liked() {

    const dispatch = useDispatch();
    const auth = useSelector(state => state.Auth);
    const likedPosts = useSelector(state => state.LikedPosts);

    React.useEffect(() => {
       if(likedPosts.status === 'idle') dispatch(fetchLikedPosts(auth.currentUserId));
    }, [dispatch, likedPosts, auth]);

    const postsList = likedPosts.posts.map(item => (
        <Grid item key={item.id}>
            <Paper variant="elevation" style={{padding: 4}} elevation={0}>
                <Link href={`/questions/${item.post}`} underline="none" color="inherit">
                    <Typography variant="subtitle1" color="textPrimary">{item.postTitle}</Typography>
                </Link>
            </Paper>
            <Divider/>
        </Grid>
    ));

    if(likedPosts.status === 'loading') {
        return(<div></div>);
    }else if(likedPosts.status === 'failed'){
        return(<p>Error loading liked posts</p>);
    }else {
        return(
            <Grid container direction="column" alignItems="flex-start" justify="center" spacing={1}>
                {postsList.length === 0 ? <Typography variant="subtitle1" color="textPrimary">{"You haven't liked any post yet"}</Typography>: postsList}
            </Grid>
        );
    }
}