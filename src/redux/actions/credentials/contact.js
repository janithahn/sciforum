import * as ActionTypes from '../../ActionTypes';

export const UserContact = (state = {
        status: 'idle',
        errMess: null,
        userContact: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_USER_CONTACT:
            return {...state, status: 'succeeded', errMess: null, userContact: action.payload}
            //...state is the spread operator from the ES6 and whatever the state is coming from the state above.
            //whatever else that is passed after the {...state, *here}, is added as modification to the state
            //hense state is not immutable here

        case ActionTypes.USER_CONTACT_LOADING:
            return {...state, status: 'loading', errMess: null, userContact: [...state.userContact]}
        
        case ActionTypes.USER_CONTACT_FAILED:
            return {...state, status: 'failed', errMess: action.payload, userContact: [...state.userContact]}

        default:
            return state;
    }
}