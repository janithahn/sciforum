import * as ActionTypes from '../../ActionTypes';

export const ChatRooms = (state = {
        status: 'idle',
        errMess: null,
        rooms: []
    }, action) => {
    switch(action.type) {
        
        case ActionTypes.RESET_ROOMS:
            return {...state, status: 'idle', errMess: null, rooms: []}

        case ActionTypes.ADD_ROOMS:
            return {...state, status: 'succeeded', errMess: null, rooms: action.payload}

        case ActionTypes.ROOMS_LOADING:
            return {...state, status: 'loading', errMess: null, rooms: [...state.rooms]}
        
        case ActionTypes.ROOMS_FAILED:
            return {...state, status: 'failed', errMess: action.payload, rooms: [...state.rooms]}

        default:
            return state;
    }
}