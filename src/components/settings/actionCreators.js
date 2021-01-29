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
        dispatch(deleteUserSuccess(res));
    })
    .catch((error) => {
        dispatch(deleteUserFailed(error.response));
    });
};

//Email confirmation
export const emailSent = (data) => ({
    type: ActionTypes.SEND_CONFIRM_EMAIL_SUCCESS,
    payload: data
});

export const emailSending = () => ({
    type: ActionTypes.SEND_CONFIRM_EMAIL_REQUEST
});

export const emailSendingFailed = (data) => ({
    type: ActionTypes.SEND_CONFIRM_EMAIL_FAILURE,
    payload: data
});

export const resetEmailConfirm = () => ({
    type: ActionTypes.RESET_CONFIRM_EMAIL
});

export const sendConfirmationEmail = (email) => dispatch => {

    dispatch(emailSending());

    axios.post(baseUrl + `/users/profile/account-confirm-email/`, {email}, headerWithToken)
    .then((res) => {
        dispatch(emailSent(res.data.message));
        dispatch(resetEmailConfirm());
    })
    .catch((error) => {
        console.log(error.response);
        dispatch(emailSendingFailed(error.message));
        dispatch(resetEmailConfirm());
    });
};