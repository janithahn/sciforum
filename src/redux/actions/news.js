import * as ActionTypes from '../ActionTypes';

export const events = (state = {
        status: 'idle',
        errMess: null,
        events: []
    }, action) => {
    switch(action.type) {

        case ActionTypes.ADD_EVENTS:
            return {...state, status: 'succeeded', errMess: null, events: action.payload}

        case ActionTypes.EVENTS_LOADING:
            return {...state, status: 'loading', errMess: null, events: [...state.events]}
        
        case ActionTypes.EVENTS_FAILED:
            return {...state, status: 'failed', errMess: action.payload, events: [...state.events]}

        default:
            return state;
    }
}

export const webinars = (state = {
        status: 'idle',
        errMess: null,
        webinars: []
    }, action) => {
    switch(action.type) {

        case ActionTypes.ADD_WEBINARS:
            return {...state, status: 'succeeded', errMess: null, webinars: action.payload}

        case ActionTypes.WEBINARS_LOADING:
            return {...state, status: 'loading', errMess: null, webinars: [...state.webinars]}
        
        case ActionTypes.WEBINARS_FAILED:
            return {...state, status: 'failed', errMess: action.payload, webinars: [...state.webinars]}

        default:
            return state;
    }
}