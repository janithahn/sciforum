import * as ActionTypes from '../../../redux/ActionTypes';
import axios from 'axios';
import { baseUrl } from '../../../shared/baseUrl';
import { isJWTExpired } from '../../../shared/AdditionalFunctions';

const headers = {
    "headers": localStorage.getItem('token') && isJWTExpired(localStorage.getItem('token')) ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
}

const addLikedPosts = (data) => ({
    type: ActionTypes.ADD_LIKED_POSTS,
    payload: data
});

const likedPostsLoading = () => ({
    type: ActionTypes.LIKED_POSTS_LOADING,
});

const likedPostsFailed = (error) => ({
    type: ActionTypes.LIKED_POSTS_FAILED,
    payload: error
});

export const fetchLikedPosts = (ownerId) => (dispatch) => {
    dispatch(likedPostsLoading());

    axios.get(baseUrl + `/vote_api/postvote/?id=&post=&owner=${ownerId}&voteType=LIKE`, headers)
    .then((res) => {
        dispatch(addLikedPosts(res.data));
    })
    .catch((error) => {
        dispatch(likedPostsFailed(error))
    });
}