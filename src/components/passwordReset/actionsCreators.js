import * as ActionTypes from '../../redux/ActionTypes';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl';
import { logout } from '../../redux/ActionCreators';

export const requestResetPassword = (data) => {
    return ({
        type: ActionTypes.PASSWORD_RESET_REQUEST,
        payload: data
    });
}

export const resetPasswordSuccess = (data) => {
    return({
        type: ActionTypes.PASSWORD_RESET_SUCCESS,
        payload: data
    });
}

export const resetPasswordError = (error) => {
    return({
        type: ActionTypes.PASSWORD_RESET_FAILURE,
        payload: error
    });
}

export const sendNewPassword = (data) => dispatch => {

    dispatch(requestResetPassword());

    axios.post(baseUrl + '/users/profile/password_reset/confirm/', data)
    .then((res) => {
        console.log(res.data);
        dispatch(resetPasswordSuccess(res.data));
        dispatch(logout());
    })
    .catch((error) => {
        console.log(error.response);
        dispatch(resetPasswordError(error.response));
    });
}

export const requestSendResetPassword = (data) => {
    return ({
        type: ActionTypes.SEND_PASSWORD_RESET_REQUEST,
        payload: data
    });
}

export const sendResetPasswordSuccess = (data) => {
    return({
        type: ActionTypes.SEND_PASSWORD_RESET_SUCCESS,
        payload: data
    });
}

export const sendResetPasswordError = (error) => {
    return({
        type: ActionTypes.SEND_PASSWORD_RESET_FAILURE,
        payload: error
    });
}

export const sendPasswordResetLink = (data) => dispatch => {

    dispatch(requestSendResetPassword());

    axios.post(baseUrl + '/users/profile/password_reset/', data)
    .then((res) => {
        console.log(res.data);
        dispatch(sendResetPasswordSuccess(res.data));
    })
    .catch((error) => {
        console.log(error.response);
        dispatch(sendResetPasswordError(error.response.data.email[0]));
    });
}