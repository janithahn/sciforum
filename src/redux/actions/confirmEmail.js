import * as ActionTypes from '../ActionTypes';

export const ConfirmEmail = (state = {
        status: 'idle',
        errMess: null,
        message: null
    }, action) => {
    switch(action.type) {

        case ActionTypes.RESET_CONFIRM_EMAIL:
            return {...state, status: 'idle', errMess: null, message: null}

        case ActionTypes.SEND_CONFIRM_EMAIL_SUCCESS:
            return {...state, status: 'succeeded', errMess: null, message: action.payload}

        case ActionTypes.SEND_CONFIRM_EMAIL_REQUEST:
            return {...state, status: 'loading', errMess: null, message: {...state.message}}
        
        case ActionTypes.SEND_CONFIRM_EMAIL_FAILURE:
            return {...state, status: 'failed', errMess: action.payload, message: {...state.message}}

        default:
            return state;
    }
}