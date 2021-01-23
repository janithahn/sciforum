import * as ActionTypes from '../ActionTypes';

export const TopPosts = (state = {
        status: 'idle',
        errMess: null,
        posts: []
    }, action) => {
    switch(action.type) {

        case ActionTypes.ADD_TOP_POSTS:
            return {...state, status: 'succeeded', errMess: null, posts: action.payload}

        case ActionTypes.TOP_POSTS_LOADING:
            return {...state, status: 'loading', errMess: null, posts: [...state.posts]}
        
        case ActionTypes.TOP_POSTS_FAILED:
            return {...state, status: 'failed', errMess: action.payload, posts: [...state.posts]}

        default:
            return state;
    }
}