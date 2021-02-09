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

    axios.get(baseUrl + `/vote_api/postvote/?owner=${ownerId}&voteType=LIKE`, headers)
    .then((res) => {
        dispatch(addLikedPosts(res.data));
    })
    .catch((error) => {
        dispatch(likedPostsFailed(error))
    });
}

const addMyAnswers = (data) => ({
    type: ActionTypes.ADD_MYANSWERS,
    payload: data
});

const myAnswersLoading = () => ({
    type: ActionTypes.MYANSWERS_LOADING,
});

const myAnswersFailed = (error) => ({
    type: ActionTypes.MYANSWERS_FAILED,
    payload: error
});

export const fetchMyAnswers = (ownerId, page) => (dispatch) => {
    dispatch(myAnswersLoading());

    axios.get(baseUrl + `/answer_api/?owner=${ownerId}&page=${page}`, headers)
    .then((res) => {
        dispatch(addMyAnswers(res.data));
    })
    .catch((error) => {
        dispatch(myAnswersFailed(error))
    });
}

//my posts in profile panel
const addMyPosts = (data) => ({
    type: ActionTypes.ADD_PROFILE_MYPOSTS,
    payload: data
});

const myPostsLoading = () => ({
    type: ActionTypes.PROFILE_MYPOSTS_LOADING,
});

const myPostsFailed = (error) => ({
    type: ActionTypes.PROFILE_MYPOSTS_FAILED,
    payload: error
});

export const fetchMyPostsByUsername = (username, page) => (dispatch) => {
    dispatch(myPostsLoading());

    axios.get(baseUrl + `/api/?ordering=-created_at&owner__username=${username}&page=${page}`, headers)
    .then((res) => {
        dispatch(addMyPosts(res.data));
    })
    .catch((error) => {
        dispatch(myPostsFailed(error))
    });
}
