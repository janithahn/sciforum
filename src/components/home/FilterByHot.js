import React from 'react';
import QuestionViewCard from '../post/QuestionViewCardComponent';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl'
import RenderPosts from './RenderPosts';
import { headerWithToken } from './headerWithToken';
import { Helmet } from 'react-helmet';

export default function FilterByHot() {

    const [postData, setPostData] = React.useState([]);
    const [hasMoreItems, setHasMoreItems] = React.useState(true);
    const [nextHref, setNextHref] = React.useState(null);

    const fetchPostInfinite = (pageNum) => {

        var url = baseUrl + `/api/hot/posts/?page=${pageNum}`;
        if(nextHref) {
            url = nextHref;
        }

        axios.get(url, headerWithToken)
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

    const PostsList = postData.map((post) => <div key={post.id}><QuestionViewCard item={post}/></div>);

    return(
        <React.Fragment>
            <Helmet>
                <title>{`sciForum - Filtered by hotness`}</title>
            </Helmet>
            <RenderPosts 
                PostsList={PostsList} 
                fetchPostInfinite={fetchPostInfinite} 
                hasMoreItems={hasMoreItems} 
            />
        </React.Fragment>
    );
}