import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Grid } from '@material-ui/core';
//import { addPosts, postsFailed, postsLoading, resetPosts } from '../../redux/ActionCreators';
import QuestionViewCard from '../post/QuestionViewCardComponent';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl'

export default function Search() {
    const posts = useSelector(state => state.Posts);
    //const dispatch = useDispatch();

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery().get('q');
    //console.log(query.get("q"));

    const [postData, setPostData] = React.useState([]);
    const [hasMoreItems, setHasMoreItems] = React.useState(true);
    const [nextHref, setNextHref] = React.useState(null);

    //const [postList, setPostList] = React.useState(posts.posts.map((post) => <RenderCard key={post.id} item={post}/>));

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

        //dispatch(postsLoading());

        var url = baseUrl + `/api/?page=${pageNum}&search=${query}`;
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
                    //dispatch(addPosts(tempData));
                    setNextHref(posts.data.next);
                } else {
                    //dispatch(resetPosts());
                    setHasMoreItems(false);
                }
            }
        })
        .catch(error => {
            console.log(error);
            //dispatch(postsFailed(error));
        });
    }

    //const PostsList = posts.posts.map((post, key) => <QuestionViewCard key={key} item={post}/>);
    const PostsList = postData.map((post, key) => <QuestionViewCard key={key} item={post}/>);


    if(posts.status === 'loading') {
        return(<CircularProgress color="secondary" size={15}/>);
    }else if(posts.status === 'failed') {
        //console.log(posts.errMess);
        return(<h4>Error loading...!</h4>);
    } else {
        return(
            <React.Fragment>
                <Grid container direction="column" justify="center" alignItems="flex-end">
                    <Link to="/ask" style={{textDecoration: 'none'}}>
                        <Button style={{margin: 4}} color='secondary' variant="outlined">Ask a Question</Button>
                    </Link>
                </Grid>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={fetchPostInfinite}
                    hasMore={hasMoreItems}
                    loader={<CircularProgress color="secondary" size={15}/>}
                >
                    {PostsList}
                </InfiniteScroll>
            </React.Fragment>
        );
    }
}