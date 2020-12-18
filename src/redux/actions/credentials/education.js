import * as ActionTypes from '../../ActionTypes';

export const UserEducation = (state = {
        status: 'idle',
        errMess: null,
        userEducation: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_USER_EDUCATION:
            return {...state, status: 'succeeded', errMess: null, userEducation: action.payload}
            //...state is the spread operator from the ES6 and whatever the state is coming from the state above.
            //whatever else that is passed after the {...state, *here}, is added as modification to the state
            //hense state is not immutable here

        case ActionTypes.USER_EDUCATION_LOADING:
            return {...state, status: 'loading', errMess: null, userEducation: [...state.userEducation]}
        
        case ActionTypes.USER_EDUCATION_FAILED:
            return {...state, status: 'failed', errMess: action.payload, userEducation: [...state.userEducation]}

        default:
            return state;
    }
}