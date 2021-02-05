import React from 'react';
import { useParams } from 'react-router-dom';
import QuestionViewCard from '../post/QuestionViewCardComponent';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl'
import RenderPosts from './RenderPosts';

export default function SearchByTag() {

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

    const PostsList = postData.map((post, key) => <div key={post.id}><QuestionViewCard item={post}/></div>);

    return(
        <RenderPosts 
            PostsList={PostsList} 
            fetchPostInfinite={fetchPostInfinite} 
            hasMoreItems={hasMoreItems} 
        />
    );
}