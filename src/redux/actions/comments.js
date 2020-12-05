import * as ActionTypes from '../ActionTypes';

export const PostComments = (state = {
        status: 'idle',
        errMess: null,
        postComments: null
    }, action) => {
    switch(action.type) {

        case ActionTypes.ADD_POST_COMMENTS:
            return {...state, status: 'succeeded', errMess: null, postComments: action.payload}

        case ActionTypes.POST_COMMENTS_LOADING:
            return {...state, status: 'loading', errMess: null, postComments: null}
        
        case ActionTypes.POST_COMMENTS_FAILED:
            return {...state, status: 'failed', errMess: action.payload, postComments: null}

        default:
            return state;
    }
}

export const AnswerComments = (state = {
    status: 'idle',
    errMess: null,
    answerComments: null
}, action) => {
switch(action.type) {

    case ActionTypes.ADD_POST_COMMENTS:
        return {...state, status: 'succeeded', errMess: null, answerComments: action.payload}

    case ActionTypes.POST_COMMENTS_LOADING:
        return {...state, status: 'loading', errMess: null, answerComments: null}
    
    case ActionTypes.POST_COMMENTS_FAILED:
        return {...state, status: 'failed', errMess: action.payload, answerComments: null}

    default:
        return state;
}
}