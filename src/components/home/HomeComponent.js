import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Grid } from '@material-ui/core';
//import { addPosts, postsFailed, postsLoading, resetPosts } from '../../redux/ActionCreators';
import QuestionViewCard from '../post/QuestionViewCardComponent';
import InfiniteScroll from 'react-infinite-scroller';
import HomeLoader from './skeletons/homeSkels';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl'

export default function Home() {
    const posts = useSelector(state => state.Posts);
    const dispatch = useDispatch();

    const [postData, setPostData] = React.useState([]);
    const [hasMoreItems, setHasMoreItems] = React.useState(true);
    const [nextHref, setNextHref] = React.useState(null);

    /*React.useEffect(() => {
        if(postsStatus === 'idle') {
            dispatch(fetchPosts())
        }
    }, [postsStatus, dispatch]);*/

    /*React.useEffect(() => {
        let isMouted = true;
        axios.get(baseUrl + '/api/')
        .then(response => {
            //console.log(response);
            return response;
        })
        .then(posts => {
            if(isMouted)
                setData(posts.data);
        })
        .catch(error => {
            console.log(error);
        });
        return () => { isMouted = false }
    }, []);*/

    const fetchPostInfinite = (pageNum) => {

        var url = baseUrl + `/api/?page=${pageNum}`;
        if(nextHref) {
            url = nextHref;
        }

        console.log(pageNum);
        axios.get(url)
        .then(posts => {
            console.log(posts);
            if(posts.data) {
                let tempData = postData;
                posts.data.results.map((post) => {
                    tempData.push(post);
                });

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


    if(posts.status === 'loading') {
        return(<HomeLoader/>);
    }else if(posts.status === 'failed') {
        return(<h4>Error loading...!</h4>);
    } else {
        return(
            <React.Fragment>
                <Grid container direction="column" justify="center" alignItems="flex-end">
                    <RouterLink to="/ask" style={{textDecoration: 'none'}}>
                        <Button style={{margin: 4}} color='secondary' variant="outlined">Ask a Question</Button>
                    </RouterLink>
                </Grid>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={fetchPostInfinite}
                    hasMore={hasMoreItems}
                    loader={<HomeLoader/>}
                    threshold={900}
                >
                    {PostsList}
                </InfiniteScroll>
            </React.Fragment>
        );
    }
}