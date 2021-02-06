import * as ActionTypes from '../../ActionTypes';

export const RoomUsers = (state = {
        status: 'idle',
        errMess: null,
        users: []
    }, action) => {
    switch(action.type) {
        
        case ActionTypes.RESET_ROOMUSERS:
            return {...state, status: 'idle', errMess: null, users: []}

        case ActionTypes.ADD_ROOMUSERS:
            return {...state, status: 'succeeded', errMess: null, users: action.payload}

        case ActionTypes.ROOMUSERS_LOADING:
            return {...state, status: 'loading', errMess: null, users: [...state.users]}
        
        case ActionTypes.ROOMUSERS_FAILED:
            return {...state, status: 'failed', errMess: action.payload, users: [...state.users]}

        default:
            return state;
    }
}