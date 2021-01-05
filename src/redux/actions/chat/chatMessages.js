import * as ActionTypes from '../../ActionTypes';

export const ChatMessages = (state = {
        status: 'idle',
        errMess: null,
        messages: []
    }, action) => {
    switch(action.type) {

        case ActionTypes.RESET_MESSAGES:
            return {status: 'idle', errMess: null, messages: []}

        case ActionTypes.ADD_MESSAGES:
            return {...state, status: 'succeeded', errMess: null, messages: action.payload}

        case ActionTypes.MESSAGES_LOADING:
            return {...state, status: 'loading', errMess: null, messages: [...state.messages]}
        
        case ActionTypes.MESSAGES_FAILED:
            return {...state, status: 'failed', errMess: action.payload, messages: [...state.messages]}

        default:
            return state;
    }
}