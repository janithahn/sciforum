import * as ActionTypes from '../../ActionTypes';

export const UserInterests = (state = {
        status: 'idle',
        errMess: null,
        interests: []
    }, action) => {
    switch(action.type) {
        
        case ActionTypes.ADD_USER_INTERESTS:
            return {...state, status: 'succeeded', errMess: null, interests: action.payload}

        case ActionTypes.USER_INTERESTS_LOADING:
            return {...state, status: 'loading', errMess: null, interests: state.interests}
        
        case ActionTypes.USER_INTERESTS_FAILED:
            return {...state, status: 'failed', errMess: action.payload, interests: state.interests}

        default:
            return state;
    }
}