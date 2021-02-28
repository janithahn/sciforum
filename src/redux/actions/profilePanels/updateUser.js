import * as ActionTypes from '../../ActionTypes';

export const UpdateUser = (state = {
        status: 'idle',
        errMess: null,
        response: {}
    }, action) => {
    switch(action.type) {
        case ActionTypes.UPDATE_USER_SUCCESS:
            return {...state, status: 'succeeded', errMess: null, response: action.payload}

        case ActionTypes.UPDATE_USER_LOADING:
            return {...state, status: 'loading', errMess: null, response: state.response}
        
        case ActionTypes.UPDATE_USER_FAILED:
            return {...state, status: 'failed', errMess: action.payload, response: state.response}

        default:
            return state;
    }
}