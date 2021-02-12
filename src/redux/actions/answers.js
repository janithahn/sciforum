import * as ActionTypes from '../ActionTypes';

export const Answers = (state = {
        status: 'idle',
        changeStatus: 'idle',
        errMess: null,
        answers: [],
        changedAnswer: null,
    }, action) => {
    switch(action.type) {

        case ActionTypes.RESET_ANSWER_LIST:
            return { status: 'idle', changeStatus: 'idle', errMess: null, changedAnswer: null, answers: [] }

        case ActionTypes.ADD_ANSWER_LIST:
            return {...state, status: 'succeeded', changeStatus: 'idle', errMess: null, changedAnswer: null, answers: action.payload }

        case ActionTypes.ANSWER_CREATED:
            return {...state, status: 'idle', changeStatus: 'created', errMess: null, changedAnswer: action.payload, answers: state.answers}
            
        case ActionTypes.ANSWER_UPDATED:
            return {...state, status: 'idle', changeStatus: 'updated', errMess: null, changedAnswer: action.payload, answers: state.answers}
                
        case ActionTypes.ANSWER_DELETED:
            return {...state, status: 'idle', changeStatus: 'deleted', errMess: null, changedAnswer: null, answers: state.answers}

        case ActionTypes.ANSWER_LIST_LOADING:
            return {...state, status: 'loading', changeStatus: 'idle', errMess: null, changedAnswer: null, answers: state.answers }
        
        case ActionTypes.ANSWER_LIST_FAILED:
            return {...state, status: 'failed', changeStatus: 'idle', errMess: action.payload, changedAnswer: null, answers: state.answers }

        default:
            return state;
    }
}