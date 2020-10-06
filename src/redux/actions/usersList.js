import * as ActionTypes from '../ActionTypes';

export const UserList = (state = {
        status: 'idle',
        errMess: null,
        users: null
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_USER_LIST:
            return {...state, status: 'succeeded', errMess: null, users: action.payload}
            //...state is the spread operator from the ES6 and whatever the state is coming from the state above.
            //whatever else that is passed after the {...state, *here}, is added as modification to the state
            //hense state is not immutable here

        case ActionTypes.USER_LIST_LOADING:
            return {...state, status: 'loading', errMess: null, users: null}
        
        case ActionTypes.USER_LIST_FAILED:
            return {...state, status: 'failed', errMess: action.payload, users: null}

        default:
            return state;
    }
}