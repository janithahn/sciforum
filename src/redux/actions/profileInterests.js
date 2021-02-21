import * as ActionTypes from '../ActionTypes';

export const ProfileInterests = (state = {
        status: 'idle',
        errMess: null,
        interests: null
    }, action) => {
    switch(action.type) {
        case ActionTypes.UPDATE_PROFILE_INTERESTS_RESET:
            return { status: 'idle', errMess: null, interests: null }

        case ActionTypes.UPDATE_PROFILE_INTERESTS_SUCCESS:
            return {...state, status: 'succeeded', errMess: null, interests: action.payload}

        case ActionTypes.UPDATE_PROFILE_INTERESTS_LOADING:
            return {...state, status: 'loading', errMess: null, posts: state.interests}
        
        case ActionTypes.UPDATE_PROFILE_INTERESTS_FAILED:
            return {...state, status: 'failed', errMess: action.payload, interests: state.interests}

        default:
            return state;
    }
}