import * as ActionTypes from '../ActionTypes';

export const PostComments = (state = {
        status: 'idle',
        errMess: null,
        postComments: [],
        changedComment: null
    }, action) => {
    switch(action.type) {

        case ActionTypes.ADD_POST_COMMENTS:
            return {...state, status: 'succeeded', errMess: null, changedComment: null, postComments: action.payload}

        case ActionTypes.POST_COMMENT_CHANGE:
            return {...state, status: 'idle', errMess: null, changedComment: action.payload, postComments: state.postComments}

        case ActionTypes.POST_COMMENTS_LOADING:
            return {...state, status: 'loading', errMess: null, changedComment: null, postComments: state.postComments}
        
        case ActionTypes.POST_COMMENTS_FAILED:
            return {...state, status: 'failed', errMess: action.payload, changedComment: null, postComments: state.postComments}

        default:
            return state;
    }
}

/*function removeDuplicates(data) {
    return data.filter((value, index) => data.indexOf(value) === index);
}*/

export const AnswerComments = (state = {
    status: 'idle',
    errMess: null,
    answerComments: [],
    changedComment: null,
}, action) => {
    switch(action.type) {
        case ActionTypes.ADD_ANSWER_COMMENTS:
            /*let index = state.answerComments.findIndex(el => el.answerId === action.answerId);
            if(index === -1)*/ //this is to avoid duplicates
            return { ...state, status: 'succeeded', errMess: null, answerComments: action.payload }

        case ActionTypes.ANSWER_COMMENT_CHANGE:
            return {...state, status: 'idle', errMess: null, changedComment: action.payload, answerComments: state.answerComments}
            
        case ActionTypes.ANSWER_COMMENTS_LOADING:
            return { ...state, status: 'loading', errMess: null, answerComments: state.answerComments }
        
        case ActionTypes.ANSWER_COMMENTS_FAILED:
            return { ...state, status: 'failed', errMess: action.payload, answerComments: state.answerComments }

        default:
            return state;
    }
}