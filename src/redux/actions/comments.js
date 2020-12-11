import * as ActionTypes from '../ActionTypes';

export const PostComments = (state = {
        status: 'idle',
        errMess: null,
        postComments: []
    }, action) => {
    switch(action.type) {

        case ActionTypes.ADD_POST_COMMENTS:
            return {...state, status: 'succeeded', errMess: null, postComments: action.payload}

        case ActionTypes.POST_COMMENTS_LOADING:
            return {...state, status: 'loading', errMess: null, postComments: [...state.postComments]}
        
        case ActionTypes.POST_COMMENTS_FAILED:
            return {...state, status: 'failed', errMess: action.payload, postComments: [...state.postComments]}

        default:
            return state;
    }
}

export const AnswerComments = (state = {
    status: 'idle',
    errMess: null,
    answerComments: []
}, action) => {
    switch(action.type) {

        case ActionTypes.ADD_ANSWER_COMMENTS:
            return {...state, status: 'succeeded', errMess: null, answerComments: [...state.answerComments, action.payload]}

        case ActionTypes.ANSWER_COMMENTS_LOADING:
            return {...state, status: 'loading', errMess: null, answerComments: [...state.answerComments]}
        
        case ActionTypes.ANSWER_COMMENTS_FAILED:
            return {...state, status: 'failed', errMess: action.payload, answerComments: [...state.answerComments]}

        default:
            return state;
    }
}