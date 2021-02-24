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

//Become a Moderator
const moderatorLoading = () => ({
    type: ActionTypes.BECOME_MODERATOR_LOADING
});

const moderatorSuccess = (data) => ({
    type: ActionTypes.BECOME_MODERATOR_SUCCESS,
    payload: data
});

const moderatorFailed = (error) => ({
    type: ActionTypes.BECOME_MODERATOR_FAILED,
    payload: error
});

export const becomeModerator = (userId) => (dispatch) => {
    dispatch(moderatorLoading());

    axios.patch(`${baseUrl}/profile_api/users/viewset/${userId}/`, {
        profile: {
            userRole: "MODERATOR"
        }
    }, headerWithToken)
    .then((res) => {
        dispatch(moderatorSuccess(res.data));
    })
    .catch((error) => {
        dispatch(moderatorFailed(error.message));
    });
};

//unsubscribe moderator
const unsubscribemoderatorLoading = () => ({
    type: ActionTypes.UNSUBSCRIBE_MODERATOR_LOADING
});

const unsubscribemoderatorSuccess = (data) => ({
    type: ActionTypes.UNSUBSCRIBE_MODERATOR_SUCCESS,
    payload: data
});

const unsubscribemoderatorFailed = (error) => ({
    type: ActionTypes.UNSUBSCRIBE_MODERATOR_FAILED,
    payload: error
});

export const unsubscribeModerator = (userId) => (dispatch) => {
    dispatch(unsubscribemoderatorLoading());

    axios.patch(`${baseUrl}/profile_api/users/viewset/${userId}/`, {
        profile: {
            userRole: "USER"
        }
    }, headerWithToken)
    .then((res) => {
        dispatch(unsubscribemoderatorSuccess(res.data));
    })
    .catch((error) => {
        dispatch(unsubscribemoderatorFailed(error.message));
    });
};

//Subscribe for emails
const subscriptionLoading = () => ({
    type: ActionTypes.SUBSCRIBE_EMAIL_LOADING
});

const subscriptionSuccess = (data) => ({
    type: ActionTypes.SUBSCRIBE_EMAIL_SUCCESS,
    payload: data
});

const subscriptionFailed = (error) => ({
    type: ActionTypes.SUBSCRIBE_EMAIL_FAILED,
    payload: error
});

export const subscribeForEmails = (userId) => (dispatch) => {
    dispatch(subscriptionLoading());

    axios.patch(`${baseUrl}/profile_api/users/viewset/${userId}/`, {
        profile: {
            is_email_subscribed: true
        }
    }, headerWithToken)
    .then((res) => {
        dispatch(subscriptionSuccess(res.data));
    })
    .catch((error) => {
        dispatch(subscriptionFailed(error.message));
    });
};

//Unsubscribe from emails
const unsubscriptionLoading = () => ({
    type: ActionTypes.UNSUBSCRIBE_EMAIL_LOADING
});

const unsubscriptionSuccess = (data) => ({
    type: ActionTypes.UNSUBSCRIBE_EMAIL_SUCCESS,
    payload: data
});

const unsubscriptionFailed = (error) => ({
    type: ActionTypes.UNSUBSCRIBE_EMAIL_FAILED,
    payload: error
});

export const unsubscribeFromEMails = (userId) => (dispatch) => {
    dispatch(unsubscriptionLoading());

    axios.patch(`${baseUrl}/profile_api/users/viewset/${userId}/`, {
        profile: {
            is_email_subscribed: false
        }
    }, headerWithToken)
    .then((res) => {
        dispatch(unsubscriptionSuccess(res.data));
    })
    .catch((error) => {
        dispatch(unsubscriptionFailed(error.message));
    });
};