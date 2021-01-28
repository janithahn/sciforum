import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Grid, Hidden } from '@material-ui/core';
import InfiniteScroll from 'react-infinite-scroller';
import HomeLoader from './skeletons/homeSkels';
import News from '../news/news';

export default function RenderPosts({ fetchPostInfinite, hasMoreItems, PostsList }) {
    return(
        <React.Fragment>
            <Grid container direction="row" spacing={2} justify="space-between" alignItems="flex-start">
                <Grid item lg={8} sm xs={12}>
                    <Grid container direction="column" justify="center" alignItems="flex-end">
                        <RouterLink to="/ask" style={{textDecoration: 'none'}}>
                            <Button style={{margin: 4}} color='secondary' variant="outlined">Ask a Question</Button>
                        </RouterLink>
                    </Grid>
                    {<InfiniteScroll
                        pageStart={0}
                        loadMore={fetchPostInfinite}
                        hasMore={hasMoreItems}
                        loader={<HomeLoader/>}
                        threshold={900}
                    >
                        {PostsList}
                    </InfiniteScroll>}
                </Grid>
                <Grid item lg={4}>
                    <Hidden smDown>
                        <News/>
                    </Hidden>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}