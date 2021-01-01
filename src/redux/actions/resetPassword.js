import * as ActionTypes from '../ActionTypes';

export const ResetPassword = (state = {
        status: 'idle',
        errMess: null,
        passwordReset: {}
    }, action) => {
    switch(action.type) {

        case ActionTypes.PASSWORD_RESET_SUCCESS:
            return {...state, status: 'succeeded', errMess: null, passwordReset: action.payload}
            
        case ActionTypes.PASSWORD_RESET_REQUEST:
            return {...state, status: 'loading', errMess: null, passwordReset: {...state.passwordReset}}
        
        case ActionTypes.PASSWORD_RESET_FAILURE:
            return {...state, status: 'failed', errMess: action.payload, passwordReset: {...state.passwordReset}}

        default:
            return state;
    }
}

export const SendResetPassword = (state = {
    status: 'idle',
    errMess: null,
    passwordReset: {}
}, action) => {
switch(action.type) {

    case ActionTypes.SEND_PASSWORD_RESET_SUCCESS:
        return {...state, status: 'succeeded', errMess: null, passwordReset: action.payload}
        
    case ActionTypes.SEND_PASSWORD_RESET_REQUEST:
        return {...state, status: 'loading', errMess: null, passwordReset: {...state.passwordReset}}
    
    case ActionTypes.SEND_PASSWORD_RESET_FAILURE:
        return {...state, status: 'failed', errMess: action.payload, passwordReset: {...state.passwordReset}}

    default:
        return state;
}
}