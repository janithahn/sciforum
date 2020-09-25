import * as ActionTypes from './ActionTypes';

export const Auth = (state = {
        status: 'idle',
        isAuthenticated: localStorage.getItem('token') ? true: false,
        token: localStorage.getItem('token'),
        currentUserId: localStorage.getItem('userId'),
        currentUser: localStorage.getItem('username'),
        currentUserEmail: localStorage.getItem('userEmail'),
        errMess: null,
    }, action) => {
    switch (action.type) {

        case ActionTypes.LOGIN_REQUEST:
            return {...state,
                status: 'loading',
                isAuthenticated: false,
            };

        case ActionTypes.LOGIN_SUCCESS:
            return {...state,
                status: 'succeeded',
                isAuthenticated: true,
                errMess: null,
                token: action,
                currentUserId: action.currentUserId,
                currentUser: action.currentUser,
                currentUserEmail: action.currentUserEmail,
            };

        case ActionTypes.LOGIN_FAILURE:
            return {...state,
                status: 'failed',
                isAuthenticated: false,
                errMess: action.errMess
            };

        case ActionTypes.LOGOUT_REQUEST:
            return {...state,
                status: 'loading',
                isAuthenticated: true,
            };

        case ActionTypes.LOGOUT_SUCCESS:
            return {...state,
                status: 'succeeded',
                isAuthenticated: false,
                token: '',
            };

        default:
            return state

    }
}