import * as ActionTypes from '../ActionTypes';

export const User = (state = {
        status: 'idle',
        errMess: null,
        user: {}
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_USER:
            return {...state, status: 'succeeded', errMess: null, user: action.payload}
            //...state is the spread operator from the ES6 and whatever the state is coming from the state above.
            //whatever else that is passed after the {...state, *here}, is added as modification to the state
            //hense state is not immutable here

        case ActionTypes.USER_LOADING:
            return {...state, status: 'loading', errMess: null, user: {...state.user}}
        
        case ActionTypes.USER_FAILED:
            return {...state, status: 'failed', errMess: action.payload, user: {...state.user}}

        default:
            return state;
    }
}