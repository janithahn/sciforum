import React from 'react';
import { Grid, Paper, Typography, Link, Divider } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyAnswers } from './actions';

export default function MyAnswes() {

    const dispatch = useDispatch();
    const auth = useSelector(state => state.Auth);
    const myAnswers = useSelector(state => state.MyAnswers);

    React.useEffect(() => {
       if(myAnswers.status === 'idle') dispatch(fetchMyAnswers(auth.currentUserId));
    }, [dispatch, myAnswers, auth]);

    const postsList = myAnswers.answers.map(item => (
        <Grid item key={item.id}>
            <Paper variant="elevation" style={{padding: 4}} elevation={0}>
                <Link href={`/questions/${item.postBelong}/#${item.id}`} underline="none" color="inherit">
                    <Typography variant="subtitle1" color="textPrimary">{item.answerContent}</Typography>
                </Link>
            </Paper>
            <Divider/>
        </Grid>
    ));

    if(myAnswers.status === 'loading') {
        return(<div></div>);
    }else if(myAnswers.status === 'failed'){
        return(<p>Error loading my answers</p>);
    }else {
        return(
            <Grid container direction="column" alignItems="flex-start" justify="center" spacing={1}>
                {postsList.length === 0 ? <Typography variant="subtitle1" color="textPrimary">{"You haven't answered any question yet"}</Typography>: postsList}
            </Grid>
        );
    }
}