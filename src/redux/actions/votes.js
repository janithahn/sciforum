import * as ActionTypes from '../ActionTypes';

export const answerVotes = (state = {
        status: 'idle',
        errMess: null,
        votes: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.RESET_ANSWER_VOTE_LIST:
            return { status: 'idle', errMess: null, votes: [] }

        case ActionTypes.ADD_ANSWER_VOTE_LIST:
            return {...state, status: 'succeeded', errMess: null, votes: action.payload}
            //...state is the spread operator from the ES6 and whatever the state is coming from the state above.
            //whatever else that is passed after the {...state, *here}, is added as modification to the state
            //hense state is not immutable here

        case ActionTypes.ANSWER_VOTE_LIST_LOADING:
            return {...state, status: 'loading', errMess: null, votes: []}
        
        case ActionTypes.ANSWER_VOTE_LIST_FAILED:
            return {...state, status: 'failed', errMess: action.payload, votes: []}

        default:
            return state;
    }
}

export const postVotes = (state = {
    status: 'idle',
    errMess: null,
    votes: []
}, action) => {
switch(action.type) {
    case ActionTypes.RESET_POST_VOTE_LIST:
        return { status: 'idle', errMess: null, votes: [] }

    case ActionTypes.ADD_POST_VOTE_LIST:
        return {...state, status: 'succeeded', errMess: null, votes: action.payload}
        //...state is the spread operator from the ES6 and whatever the state is coming from the state above.
        //whatever else that is passed after the {...state, *here}, is added as modification to the state
        //hense state is not immutable here

    case ActionTypes.POST_VOTE_LIST_LOADING:
        return {...state, status: 'loading', errMess: null, votes: []}
    
    case ActionTypes.POST_VOTE_LIST_FAILED:
        return {...state, status: 'failed', errMess: action.payload, votes: []}

    default:
        return state;
}
}