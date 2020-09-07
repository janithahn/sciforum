import * as ActionTypes from './ActionTypes';
import axios from 'axios';

export const fetchPosts = () => async (dispatch) => {
    dispatch(postLoading());

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

export const postPost = (post) => (dispatch, getState) => {
    console.log(post.title);
    console.log(post.body);
    console.log(getState());
    axios.post('http://localhost:8000/api/', {
        title: post.title,
        body: post.body
    })
    .then(res => {
        console.log(res);
        console.log("Question submitted successfully!");
        dispatch(fetchPosts());
    })
    .catch(error => console.log(error));
};

export const editPost = (post) => (dispatch, getState) => {
    console.log(post);
    axios.put(`http://localhost:8000/api/${post.id}/`, {
        title: post.title,
        body: post.body
    })
    .then(res => {
        console.log(res);
        console.log("Question updated successfully!");
        dispatch(fetchPosts());
    })
    .catch(error => console.log(error));
};

export const deletePost = (post, history) => (dispatch, getState) => {
    axios.delete(`http://localhost:8000/api/${post.id}/`)
    .then(res => {
        console.log(res);
        console.log("Question deleted successfully!");
        dispatch(fetchPosts());
        history.push('/questions');
    })
    .catch(error => console.log(error));
};