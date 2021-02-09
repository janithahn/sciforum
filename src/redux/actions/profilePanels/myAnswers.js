import * as ActionTypes from '../../ActionTypes';

export const MyAnswers = (state = {
        status: 'idle',
        errMess: null,
        answers: []
    }, action) => {
    switch(action.type) {

        case ActionTypes.ADD_MYANSWERS:
            return {...state, status: 'succeeded', errMess: null, answers: action.payload}

        case ActionTypes.MYANSWERS_LOADING:
            return {...state, status: 'loading', errMess: null, answers: state.answers}
        
        case ActionTypes.MYANSWERS_FAILED:
            return {...state, status: 'failed', errMess: action.payload, answers: state.answers}

        default:
            return state;
    }
}