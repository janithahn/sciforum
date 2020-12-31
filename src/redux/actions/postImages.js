import * as ActionTypes from '../ActionTypes';

export const PostImages = (state = {
        status: 'idle',
        errMess: null,
        postImages: {}
    }, action) => {
    switch(action.type) {

        case ActionTypes.POST_IMAGES_RESET:
            return {...state, status: 'idle', errMess: null, postImages: {...state.postImages}}

        case ActionTypes.ADD_POST_IMAGES:
            return {...state, status: 'succeeded', errMess: null, postImages: action.payload}
            
        case ActionTypes.POST_IMAGES_LOADING:
            return {...state, status: 'loading', errMess: null, postImages: {...state.postImages}}
        
        case ActionTypes.POST_IMAGES_FAILED:
            return {...state, status: 'failed', errMess: action.payload, postImages: {...state.postImages}}

        default:
            return state;
    }
}