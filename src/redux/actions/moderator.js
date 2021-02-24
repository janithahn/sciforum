import * as ActionTypes from '../ActionTypes';

export const BecomeModerator = (state = {
        subscribe_status: 'idle',
        unsubscribe_status: 'idle',
        errMess: null,
        moderator: {},
    }, action) => {
    switch(action.type) {

        //subscribing
        case ActionTypes.BECOME_MODERATOR_SUCCESS:
            return {...state, subscribe_status: 'succeeded', errMess: null, moderator: action.payload}

        case ActionTypes.BECOME_MODERATOR_LOADING:
            return {...state, subscribe_status: 'loading', errMess: null, moderator: state.moderator}
        
        case ActionTypes.BECOME_MODERATOR_FAILED:
            return {...state, subscribe_status: 'failed', errMess: action.payload, moderator: state.moderator}

        //unsubscribing
        case ActionTypes.UNSUBSCRIBE_MODERATOR_SUCCESS:
            return {...state, unsubscribe_status: 'succeeded', errMess: null, moderator: action.payload}

        case ActionTypes.UNSUBSCRIBE_MODERATOR_LOADING:
            return {...state, unsubscribe_status: 'loading', errMess: null, moderator: state.moderator}
        
        case ActionTypes.UNSUBSCRIBE_MODERATOR_FAILED:
            return {...state, unsubscribe_status: 'failed', errMess: action.payload, moderator: state.moderator}

        default:
            return state;
    }
}
