import * as ActionTypes from '../ActionTypes';

export const SubscribeEmail = (state = {
        subscribe_status: 'idle',
        unsubscribe_status: 'idle',
        errMess: null,
        subscription: {},
    }, action) => {
    switch(action.type) {

        //subscribing
        case ActionTypes.SUBSCRIBE_EMAIL_SUCCESS:
            return {...state, subscribe_status: 'succeeded', errMess: null, subscription: action.payload}

        case ActionTypes.SUBSCRIBE_EMAIL_LOADING:
            return {...state, subscribe_status: 'loading', errMess: null, subscription: state.subscription}
        
        case ActionTypes.SUBSCRIBE_EMAIL_FAILED:
            return {...state, subscribe_status: 'failed', errMess: action.payload, subscription: state.subscription}

        //unsubscribing
        case ActionTypes.UNSUBSCRIBE_EMAIL_SUCCESS:
            return {...state, unsubscribe_status: 'succeeded', errMess: null, subscription: action.payload}

        case ActionTypes.UNSUBSCRIBE_EMAIL_LOADING:
            return {...state, unsubscribe_status: 'loading', errMess: null, subscription: state.subscription}
        
        case ActionTypes.UNSUBSCRIBE_EMAIL_FAILED:
            return {...state, unsubscribe_status: 'failed', errMess: action.payload, subscription: state.subscription}

        default:
            return state;
    }
}
