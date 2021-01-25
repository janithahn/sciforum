import * as ActionTypes from '../../redux/ActionTypes';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl';
import { isJWTExpired } from '../../shared/AdditionalFunctions';

const headerWithToken = {
    "headers": localStorage.getItem('token') && isJWTExpired(localStorage.getItem('token')) ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
};

const notificationsLoading = () => ({
    type: ActionTypes.UNREAD_NOTIFICATIONS_LIST_LOADING
});

const notificationsFailed = (errmess) => ({
    type: ActionTypes.UNREAD_NOTIFICATIONS_LIST_FAILED,
    payload: errmess
});

const addNotifications = (notifications) => ({
    type: ActionTypes.ADD_UNREAD_NOTIFICATIONS_LIST,
    payload: notifications
});

export const fetchUnreadNotifications = (recipient) => (dispatch) => {
    dispatch(notificationsLoading());

    axios.get(baseUrl + `/inbox/notifications/unread/count/?recipient=${recipient}&unread=true`, headerWithToken)
    .then((res) => {
        dispatch(addNotifications(res.data.length));
    })
    .catch((error) => {
        dispatch(notificationsFailed(error.message));
    });
}