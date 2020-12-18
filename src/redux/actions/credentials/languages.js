import * as ActionTypes from '../../ActionTypes';

export const UserLanguages = (state = {
        status: 'idle',
        errMess: null,
        userLanguages: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_USER_LANGUAGES:
            return {...state, status: 'succeeded', errMess: null, userLanguages: action.payload}
            //...state is the spread operator from the ES6 and whatever the state is coming from the state above.
            //whatever else that is passed after the {...state, *here}, is added as modification to the state
            //hense state is not immutable here

        case ActionTypes.USER_LANGUAGES_LOADING:
            return {...state, status: 'loading', errMess: null, userLanguages: [...state.userLanguages]}
        
        case ActionTypes.USER_LANGUAGES_FAILED:
            return {...state, status: 'failed', errMess: action.payload, userLanguages: [...state.userLanguages]}

        default:
            return state;
    }
}