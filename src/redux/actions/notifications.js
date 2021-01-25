import * as ActionTypes from '../ActionTypes';

export const Notifications = (state = {
        status: 'idle',
        errMess: null,
        notifications: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.RESET_NOTIFICATIONS_LIST:
            return { status: 'idle', errMess: null, notifications: [] }

        case ActionTypes.ADD_NOTIFICATIONS_LIST:
            return {...state, status: 'succeeded', errMess: null, notifications: action.payload}
            //...state is the spread operator from the ES6 and whatever the state is coming from the state above.
            //whatever else that is passed after the {...state, *here}, is added as modification to the state
            //hense state is not immutable here

        case ActionTypes.NOTIFICATIONS_LIST_LOADING:
            return {...state, status: 'loading', errMess: null, notifications: []}
        
        case ActionTypes.NOTIFICATIONS_LIST_FAILED:
            return {...state, status: 'failed', errMess: action.payload, notifications: []}

        default:
            return state;
    }
}

export const UnreadNotifications = (state = {
    status: 'idle',
    errMess: null,
    count: 0
}, action) => {
switch(action.type) {
    case ActionTypes.RESET_UNREAD_NOTIFICATIONS_LIST:
        return { status: 'idle', errMess: null, count: 0 }

    case ActionTypes.ADD_UNREAD_NOTIFICATIONS_LIST:
        return {...state, status: 'succeeded', errMess: null, count: action.payload}

    case ActionTypes.UNREAD_NOTIFICATIONS_LIST_LOADING:
        return {...state, status: 'loading', errMess: null, count: state.count}
    
    case ActionTypes.UNREAD_NOTIFICATIONS_LIST_FAILED:
        return {...state, status: 'failed', errMess: action.payload, count: state.count}

    default:
        return state;
}
}