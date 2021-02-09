import * as ActionTypes from '../../ActionTypes';

export const MyPostsProfile = (state = {
        status: 'idle',
        errMess: null,
        myposts: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_PROFILE_MYPOSTS:
            return {...state, status: 'succeeded', errMess: null, myposts: action.payload}

        case ActionTypes.PROFILE_MYPOSTS_LOADING:
            return {...state, status: 'loading', errMess: null, myposts: state.myposts}
        
        case ActionTypes.PROFILE_MYPOSTS_FAILED:
            return {...state, status: 'failed', errMess: action.payload, myposts: state.myposts}

        default:
            return state;
    }
}