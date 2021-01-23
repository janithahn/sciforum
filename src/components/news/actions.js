import * as ActionTypes from '../../redux/ActionTypes';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl';

const eventsUrl = `${baseUrl}/news/events/?ordering=-created_at`;
const webinarsUrl = `${baseUrl}/news/webinars/?ordering=-created_at`;

const addEvents = (data) => ({
    type: ActionTypes.ADD_EVENTS,
    payload: data
});

const eventsLoading = () => ({
    type: ActionTypes.EVENTS_LOADING,
});

const eventsFailed = (error) => ({
    type: ActionTypes.EVENTS_FAILED,
    payload: error
});

export const fetchEvents = () => (dispatch) => {
    dispatch(eventsLoading());

    axios.get(eventsUrl)
    .then((res) => {
        dispatch(addEvents(res.data.results));
    })
    .catch((error) => {
        dispatch(eventsFailed(error))
    });
}

const addWebinars = (data) => ({
    type: ActionTypes.ADD_WEBINARS,
    payload: data
});

const webinarsLoading = () => ({
    type: ActionTypes.WEBINARS_LOADING,
});

const webinarsFailed = (error) => ({
    type: ActionTypes.WEBINARS_FAILED,
    payload: error
});

export const fetchwebinars = () => (dispatch) => {
    dispatch(webinarsLoading());

    axios.get(webinarsUrl)
    .then((res) => {
        dispatch(addWebinars(res.data.results));
    })
    .catch((error) => {
        dispatch(webinarsFailed(error))
    });
}