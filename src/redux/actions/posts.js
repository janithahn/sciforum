import * as ActionTypes from '../ActionTypes';

export const Posts = (state = {
        status: 'idle',
        errMess: null,
        posts: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.RESET_POST_LIST:
            return { status: 'idle', errMess: null, posts: state.posts }

        case ActionTypes.ADD_POST_LIST:
            return {...state, status: 'succeeded', errMess: null, posts: action.payload}
            //...state is the spread operator from the ES6 and whatever the state is coming from the state above.
            //whatever else that is passed after the {...state, *here}, is added as modification to the state
            //hense state is not immutable here

        case ActionTypes.POST_LIST_LOADING:
            return {...state, status: 'loading', errMess: null, posts: state.posts}
        
        case ActionTypes.POST_LIST_FAILED:
            return {...state, status: 'failed', errMess: action.payload, posts: state.posts}

        default:
            return state;
    }
}