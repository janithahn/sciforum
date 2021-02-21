import * as ActionTypes from '../../redux/ActionTypes';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl';
import { isJWTExpired } from '../../shared/AdditionalFunctions';

const headerWithToken = {
    "headers": localStorage.getItem('token') && isJWTExpired(localStorage.getItem('token')) ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
};

const updateProfileInterestsLoading = () => ({
    type: ActionTypes.UPDATE_PROFILE_INTERESTS_LOADING
});

const updateProfileInterestsSuccess = (data) => ({
    type: ActionTypes.UPDATE_PROFILE_INTERESTS_SUCCESS,
    payload: data
});

const updateProfileInterestsFailed = (data) => ({
    type: ActionTypes.UPDATE_PROFILE_INTERESTS_FAILED,
    payload: data
});

export const updateProfileInterestsReset = () => ({
    type: ActionTypes.UPDATE_PROFILE_INTERESTS_RESET
});

export const updateInterests = (username, interests) => (dispatch) => {
    dispatch(updateProfileInterestsLoading());

    axios.patch(`${baseUrl}/users/${username}/update/`, {interests}, headerWithToken)
    .then((res) => {
        dispatch(updateProfileInterestsSuccess(res.data));
        localStorage.setItem('has_interests', true);
        window.location.reload();
    })
    .catch((error) => {
        dispatch(updateProfileInterestsFailed(error.message));
    });
};