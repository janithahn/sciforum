import * as ActionTypes from '../../ActionTypes';

export const UpdateProfileImage = (state = {
        status: 'idle',
        errMess: null,
        response: {}
    }, action) => {
    switch(action.type) {
        case ActionTypes.UPDATE_PROFILE_IMAGE_SUCCESS:
            return {...state, status: 'succeeded', errMess: null, response: action.payload}

        case ActionTypes.UPDATE_PROFILE_IMAGE_LOADING:
            return {...state, status: 'loading', errMess: null, response: state.response}
        
        case ActionTypes.UPDATE_PROFILE_IMAGE_FAILED:
            return {...state, status: 'failed', errMess: action.payload, response: state.response}

        default:
            return state;
    }
}