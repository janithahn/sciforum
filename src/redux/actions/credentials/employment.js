import * as ActionTypes from '../../ActionTypes';

export const UserEmployment = (state = {
        status: 'idle',
        errMess: null,
        userEmployment: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_USER_EMPLOYMENT:
            return {...state, status: 'succeeded', errMess: null, userEmployment: action.payload}
            //...state is the spread operator from the ES6 and whatever the state is coming from the state above.
            //whatever else that is passed after the {...state, *here}, is added as modification to the state
            //hense state is not immutable here

        case ActionTypes.USER_EMPLOYMENT_LOADING:
            return {...state, status: 'loading', errMess: null, userEmployment: [...state.userEmployment]}
        
        case ActionTypes.USER_EMPLOYMENT_FAILED:
            return {...state, status: 'failed', errMess: action.payload, userEmployment: [...state.userEmployment]}

        default:
            return state;
    }
}