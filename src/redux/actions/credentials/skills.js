import * as ActionTypes from '../../ActionTypes';

export const UserSkills = (state = {
        status: 'idle',
        errMess: null,
        userSkills: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_USER_SKILLS:
            return {...state, status: 'succeeded', errMess: null, userSkills: action.payload}
            //...state is the spread operator from the ES6 and whatever the state is coming from the state above.
            //whatever else that is passed after the {...state, *here}, is added as modification to the state
            //hense state is not immutable here

        case ActionTypes.USER_SKILLS_LOADING:
            return {...state, status: 'loading', errMess: null, userSkills: [...state.userSkills]}
        
        case ActionTypes.USER_SKILLS_FAILED:
            return {...state, status: 'failed', errMess: action.payload, userSkills: [...state.userSkills]}

        default:
            return state;
    }
}