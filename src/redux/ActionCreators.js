import * as ActionTypes from './ActionTypes';
import axios from 'axios';

export const fetchPosts = () => (dispatch) => {
    dispatch(postLoading(true));

    axios.get('http://localhost:8000/api/')
    .then(response => {
        //console.log(response);
        return response;
    })
    .then(posts => dispatch(addPost(posts.data)))
    .catch(error => {
        console.log(error);
        dispatch(postFailed(error));
    });
}

export const postLoading = () => ({
    type: ActionTypes.POST_LOADING
});

export const postFailed = (errmess) => ({
    type: ActionTypes.POST_FAILED,
    payload: errmess
});

export const addPost = (post) => ({
    type: ActionTypes.ADD_POST,
    payload: post
});