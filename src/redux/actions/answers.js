import * as ActionTypes from '../ActionTypes';

export const Answers = (state = {
        status: 'idle',
        errMess: null,
        answers: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.RESET_ANSWER_LIST:
            return { status: 'idle', errMess: null, answers: [] }

        case ActionTypes.ADD_ANSWER_LIST:
            return {...state, status: 'succeeded', errMess: null, answers: action.payload}
            //...state is the spread operator from the ES6 and whatever the state is coming from the state above.
            //whatever else that is passed after the {...state, *here}, is added as modification to the state
            //hense state is not immutable here

        case ActionTypes.ANSWER_LIST_LOADING:
            return {...state, status: 'loading', errMess: null, answers: []}
        
        case ActionTypes.ANSWER_LIST_FAILED:
            return {...state, status: 'failed', errMess: action.payload, answers: []}

        default:
            return state;
    }
}