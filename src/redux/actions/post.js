import * as ActionTypes from '../ActionTypes';

export const Post = (state = {
        status: 'idle',
        errMess: null,
        post: {}
    }, action) => {
    switch(action.type) {

        case ActionTypes.POST_RESET:
            return {...state, status: 'idle', errMess: null, post: {...state.post}}

        case ActionTypes.ADD_POST:
            return {...state, status: 'succeeded', errMess: null, post: action.payload}
            //...state is the spread operator from the ES6 and whatever the state is coming from the state above.
            //whatever else that is passed after the {...state, *here}, is added as modification to the state
            //hense state is not immutable here

        case ActionTypes.POST_LOADING:
            return {...state, status: 'loading', errMess: null, post: {...state.post}}
        
        case ActionTypes.POST_FAILED:
            return {...state, status: 'failed', errMess: action.payload, post: {...state.post}}

        default:
            return state;
    }
}