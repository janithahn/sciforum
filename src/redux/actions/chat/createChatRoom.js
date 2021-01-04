import * as ActionTypes from '../../ActionTypes';

export const CreateChatRoom = (state = {
        status: 'idle',
        errMess: null,
        roomCreation: {}
    }, action) => {
    switch(action.type) {
        case ActionTypes.ROOM_CREATION_SUCCESS:
            return {...state, status: 'succeeded', errMess: null, roomCreation: action.payload}

        case ActionTypes.ROOM_CREATION_LOADING:
            return {...state, status: 'loading', errMess: null, roomCreation: {...state.roomCreation}}
        
        case ActionTypes.ROOM_CREATION_FAILED:
            return {...state, status: 'failed', errMess: action.payload, roomCreation: {...state.roomCreation}}

        default:
            return state;
    }
}