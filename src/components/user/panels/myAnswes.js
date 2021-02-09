import React from 'react';
import { Grid, Paper, Typography, Link, Divider } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyAnswers } from './actions';
import { useStyles } from './styles';

export default function MyAnswes() {

    const classes = useStyles();

    const dispatch = useDispatch();
    const auth = useSelector(state => state.Auth);
    const myAnswers = useSelector(state => state.MyAnswers);

    React.useEffect(() => {
       if(myAnswers.status === 'idle') dispatch(fetchMyAnswers(auth.currentUserId, 1));
    }, [dispatch, myAnswers, auth]);

    const postsList = myAnswers.answers.results ? myAnswers.answers.results.map(item => (
        <Grid item key={item.id}>
            <Paper variant="elevation" style={{padding: 4}} elevation={0}>
                <Link href={`/questions/${item.postBelong}/#${item.id}`} underline="none" color="inherit">
                    <Typography variant="subtitle1" color="textPrimary">{item.answerContent}</Typography>
                </Link>
            </Paper>
            <Divider/>
        </Grid>
    )): undefined;

    //pagination
    const total_pages = myAnswers.answers.total_pages;
    const current_page = myAnswers.answers.current_page;

    const handlePages = (event, page) => {
        event.dispatchConfig = dispatch(fetchMyAnswers(auth.currentUserId, page));
    };
    //end pagination

    if(myAnswers.status === 'loading') {
        return(<div></div>);
    }else if(myAnswers.status === 'failed'){
        return(<p>Error loading your answers</p>);
    }else {
        return(
            <Grid container direction="column" alignItems="flex-start" justify="center" spacing={1}>
                {myAnswers.answers.count === 0 ? <Typography variant="subtitle1" color="textPrimary">{"You haven't answered any questions yet"}</Typography>: postsList}
                <Grid item>
                    {myAnswers.answers.count !== 0 && total_pages > 1 ? 
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