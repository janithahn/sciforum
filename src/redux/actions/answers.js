import * as ActionTypes from '../ActionTypes';

export const Answers = (state = {
        status: 'idle',
        errMess: null,
        answers: [],
    }, action) => {
    switch(action.type) {

        case ActionTypes.RESET_ANSWER_LIST:
            return { status: 'idle', errMess: null, answers: [...state.answers] }

        case ActionTypes.ADD_ANSWER_LIST:
            return {...state, status: 'succeeded', errMess: null, answers: action.payload }

        case ActionTypes.ANSWER_LIST_LOADING:
            return {...state, status: 'loading', errMess: null, answers: [...state.answers] }
        
        case ActionTypes.ANSWER_LIST_FAILED:
            return {...state, status: 'failed', errMess: action.payload, answers: [...state.answers] }

        default:
            return state;
    }
}