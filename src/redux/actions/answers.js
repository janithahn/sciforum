import * as ActionTypes from '../ActionTypes';

export const Answers = (state = {
        status: 'idle',
        errMess: null,
        answers: null
    }, action) => {
    switch(action.type) {
        case ActionTypes.RESET_ANSWER_LIST:
            return { status: 'idle', errMess: null, answers: null }

        case ActionTypes.ADD_ANSWER_LIST:
            return {...state, status: 'succeeded', errMess: null, answers: action.payload}

        case ActionTypes.ANSWER_LIST_LOADING:
            return {...state, status: 'loading', errMess: null, answers: null}
        
        case ActionTypes.ANSWER_LIST_FAILED:
            return {...state, status: 'failed', errMess: action.payload, answers: null}

        default:
            return state;
    }
}