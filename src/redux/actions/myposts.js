import * as ActionTypes from '../ActionTypes';

export const MyPosts = (state = {
        status: 'idle',
        errMess: null,
        myposts: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_MYPOSTS:
            return {...state, status: 'succeeded', errMess: null, myposts: action.payload}
            //...state is the spread operator from the ES6 and whatever the state is coming from the state above.
            //whatever else that is passed after the {...state, *here}, is added as modification to the state
            //hense state is not immutable here

        case ActionTypes.MYPOSTS_LOADING:
            return {...state, status: 'loading', errMess: null, myposts: state.myposts}
        
        case ActionTypes.MYPOSTS_FAILED:
            return {...state, status: 'failed', errMess: action.payload, myposts: state.myposts}

        default:
            return state;
    }
}