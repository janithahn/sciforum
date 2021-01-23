import * as ActionTypes from '../../redux/ActionTypes';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl';

const url = `${baseUrl}/api/top/posts/?ordering=-vote_count`;

const addTopPosts = (data) => ({
    type: ActionTypes.ADD_TOP_POSTS,
    payload: data
});

const topPostsLoading = () => ({
    type: ActionTypes.TOP_POSTS_LOADING,
});

const topPostsFailed = (error) => ({
    type: ActionTypes.TOP_POSTS_FAILED,
    payload: error
});

export const fetchTopPosts = () => (dispatch) => {
    dispatch(topPostsLoading());

    axios.get(url)
    .then((res) => {
        dispatch(addTopPosts(res.data.results));
    })
    .catch((error) => {
        dispatch(topPostsFailed(error))
    });
}