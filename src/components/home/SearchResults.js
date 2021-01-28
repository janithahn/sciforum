import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Button, Grid, Hidden } from '@material-ui/core';
import QuestionViewCard from '../post/QuestionViewCardComponent';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl'
import HomeLoader from './skeletons/homeSkels';
import News from '../news/news';
import RenderPosts from './RenderPosts';

export default function Search() {

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery().get('q');

    const [postData, setPostData] = React.useState([]);
    const [hasMoreItems, setHasMoreItems] = React.useState(true);
    const [nextHref, setNextHref] = React.useState(null);

    const fetchPostInfinite = (pageNum) => {

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
        <RenderPosts 
            PostsList={PostsList} 
            fetchPostInfinite={fetchPostInfinite} 
            hasMoreItems={hasMoreItems} 
        />
    );

}