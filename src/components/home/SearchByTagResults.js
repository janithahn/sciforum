import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Grid, Hidden } from '@material-ui/core';
import QuestionViewCard from '../post/QuestionViewCardComponent';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl'
import HomeLoader from './skeletons/homeSkels';
import News from '../news/news';

export default function SearchByTag() {
    const posts = useSelector(state => state.Posts);

    const { tagname } = useParams();

    const [postData, setPostData] = React.useState([]);
    const [hasMoreItems, setHasMoreItems] = React.useState(true);
    const [nextHref, setNextHref] = React.useState(null);

    const fetchPostInfinite = (pageNum) => {

        var url = baseUrl + `/api/?page=${pageNum}&tags=${tagname}`;
        if(nextHref) {
            url = nextHref;
        }

        console.log(pageNum);
        axios.get(url)
        .then(posts => {
            console.log(posts);
            if(posts.data) {
                let tempData = postData;
                posts.data.results.map((post) => 
                    tempData.push(post)
                );

                if(posts.data.next) {
                    setPostData(tempData);
                    setNextHref(posts.data.next);
                } else {
                    setHasMoreItems(false);
                }
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    const PostsList = postData.map((post, key) => <QuestionViewCard key={key} item={post}/>);

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