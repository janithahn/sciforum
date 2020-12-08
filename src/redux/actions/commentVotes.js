import * as ActionTypes from '../ActionTypes';

export const answerCommentVotes = (state = {
        status: 'idle',
        errMess: null,
        votes: []
    }, action) => {
    switch(action.type) {

        case ActionTypes.RESET_ANSWER_COMMENT_VOTE_LIST:
            return { status: 'idle', errMess: null, votes: [] }

        case ActionTypes.ADD_ANSWER_COMMENT_VOTE_LIST:
            return {...state, status: 'succeeded', errMess: null, votes: action.payload}

        case ActionTypes.ANSWER_COMMENT_VOTE_LIST_LOADING:
            return {...state, status: 'loading', errMess: null, votes: []}
        
        case ActionTypes.ANSWER_COMMENT_VOTE_LIST_FAILED:
            return {...state, status: 'failed', errMess: action.payload, votes: []}

        default:
            return state;
    }
}

export const postCommentVotes = (state = {
    status: 'idle',
    errMess: null,
    votes: []
}, action) => {
switch(action.type) {
    
    case ActionTypes.RESET_POST_COMMENT_VOTE_LIST:
        return { status: 'idle', errMess: null, votes: [] }

    case ActionTypes.ADD_POST_COMMENT_VOTE_LIST:
        return {...state, status: 'succeeded', errMess: null, votes: action.payload}

    case ActionTypes.POST_COMMENT_VOTE_LIST_LOADING:
        return {...state, status: 'loading', errMess: null, votes: []}
    
    case ActionTypes.POST_COMMENT_VOTE_LIST_FAILED:
        return {...state, status: 'failed', errMess: action.payload, votes: []}

    default:
        return state;
}
}