import * as ActionTypes from './ActionTypes';

export const Posts = (state = {
        isLoading: true,
        errMess: null,
        posts: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_POST:
            return {...state, isLoading: false, errMess: null, posts: action.payload}

        case ActionTypes.POST_LOADING:
            return {...state, isLoading: true, errMess: null, posts: []}
        
        case ActionTypes.POST_FAILED:
            return {...state, isLoading: false, errMess: action.payload, posts: []}

        default:
            return state;
    }
}