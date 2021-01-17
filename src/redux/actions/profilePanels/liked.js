import * as ActionTypes from '../../ActionTypes';

export const LikedPosts = (state = {
        status: 'idle',
        errMess: null,
        posts: []
    }, action) => {
    switch(action.type) {

        case ActionTypes.ADD_LIKED_POSTS:
            return {...state, status: 'succeeded', errMess: null, posts: action.payload}

        case ActionTypes.LIKED_POSTS_LOADING:
            return {...state, status: 'loading', errMess: null, posts: [...state.posts]}
        
        case ActionTypes.LIKED_POSTS_FAILED:
            return {...state, status: 'failed', errMess: action.payload, posts: [...state.posts]}

        default:
            return state;
    }
}