import * as ActionTypes from './ActionTypes';

export const Posts = (state = {
        status: 'idle',
        errMess: null,
        posts: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_POST:
            return {...state, status: 'succeeded', errMess: null, posts: action.payload}

        case ActionTypes.POST_LOADING:
            return {...state, status: 'loading', errMess: null, posts: []}
        
        case ActionTypes.POST_FAILED:
            return {...state, status: 'falied', errMess: action.payload, posts: []}

        default:
            return state;
    }
}