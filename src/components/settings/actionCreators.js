import * as ActionTypes from '../../redux/ActionTypes';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl';
import { isJWTExpired } from '../../shared/AdditionalFunctions';
import { db } from '../../firebase/config';

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

const deleteChatDetails = (username) => {
    db.ref('roomusers/').orderByChild('username').equalTo(username.toString()).once('value', (resp) => {
        resp.forEach((child) => {
            child.ref.remove();
        });
    });

    db.ref('rooms/').orderByChild('owner').equalTo(username.toString()).once('value', (resp) => {
        resp.forEach((child) => {
            child.ref.remove();
        })
    });

    db.ref('chats/').orderByChild('username').equalTo(username.toString()).once('value', (resp) => {
        resp.forEach((child) => {
            child.ref.remove();
        });
    });
};

export const deleteUser = (username) => dispatch => {

    dispatch(deleteUserLoading());

    axios.delete(baseUrl + `/users/${username}/delete/`, headerWithToken)
    .then((res) => {
        dispatch(deleteUserSuccess(res));
        deleteChatDetails(username);
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

//verify account with confirmation token
export const accountVerified = (data) => ({
    type: ActionTypes.SEND_CONFIRM_TOKEN_SUCCESS,
    payload: data
});

export const accountVerifing = () => ({
    type: ActionTypes.SEND_CONFIRM_TOKEN_REQUEST
});

export const accountVerifyFailed = (data) => ({
    type: ActionTypes.SEND_CONFIRM_TOKEN_FAILURE,
    payload: data
});

export const resetAccountVerify = () => ({
    type: ActionTypes.RESET_CONFIRM_TOKEN
});

export const sendConfirmationToken = (key) => dispatch => {

    dispatch(accountVerifing());

    axios.post(baseUrl + `/rest-auth/account-confirm-email/`, {key}, headerWithToken)
    .then((res) => {
        dispatch(accountVerified(res.data.detail));
        localStorage.setItem('currentUserEmailVerified', true);
        //dispatch(resetAccountVerify()); //if needed
    })
    .catch((error) => {
        dispatch(accountVerifyFailed(error.message));
        //dispatch(resetAccountVerify());
    });
};