import * as ActionTypes from '../ActionTypes';

export const DeleteUser = (state = {
        status: 'idle',
        errMess: null,
        deleteUser: {}
    }, action) => {
    switch(action.type) {

        case ActionTypes.DELETE_USER_SUCCESS:
            return {...state, status: 'succeeded', errMess: null, deleteUser: action.payload}

        case ActionTypes.DELETE_USER_LOADING:
            return {...state, status: 'loading', errMess: null, deleteUser: {...state.deleteUser}}
        
        case ActionTypes.DELETE_USER_FAILED:
            return {...state, status: 'failed', errMess: action.payload, deleteUser: {...state.deleteUser}}

        default:
            return state;
    }
}