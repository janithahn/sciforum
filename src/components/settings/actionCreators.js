import * as ActionTypes from '../../redux/ActionTypes';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl';
import { isJWTExpired } from '../../shared/AdditionalFunctions';

const headerWithToken = {
    "headers": localStorage.getItem('token') && isJWTExpired(localStorage.getItem('token')) ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
};

export const deleteUserSuccess = (data) => ({
    type: ActionTypes.DELETE_USER_SUCCESS,
    payload: data
});

export const deleteUserLoading = () => ({
    type: ActionTypes.DELETE_USER_LOADING
});

export const deleteUserFailed = (data) => ({
    type: ActionTypes.DELETE_USER_FAILED,
    payload: data
});

export const deleteUser = (username) => dispatch => {

    dispatch(deleteUserLoading());

    axios.delete(baseUrl + `/users/${username}/delete/`, headerWithToken)
    .then((res) => {
        console.log(res);
        dispatch(deleteUserSuccess(res));
    })
    .catch((error) => {
        console.log(error.response);
        dispatch(deleteUserFailed(error.response));
    });
};