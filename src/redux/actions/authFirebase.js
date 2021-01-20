import * as ActionTypes from '../ActionTypes';

export const AuthFirebase = (state = {
        status: 'idle',
        isAuthenticated: localStorage.getItem('firebase_user') ? true: false,
        firebase_user: localStorage.getItem('firebase_user'),
        errMess: null,
    }, action) => {
    switch (action.type) {

        case ActionTypes.FIREBASE_LOGIN_REQUEST:
            return {...state,
                status: 'loading',
                isAuthenticated: false,
            };

        case ActionTypes.FIREBASE_LOGIN_SUCCESS:
            return {...state,
                status: 'succeeded',
                isAuthenticated: true,
                firebase_user: action.firebase_user,
                errMess: null,
            };

        case ActionTypes.FIREBASE_LOGIN_FAILURE:
            return {...state,
                status: 'failed',
                isAuthenticated: false,
                errMess: action.errMess
            };

        case ActionTypes.FIREBASE_LOGOUT_REQUEST:
            return {...state,
                status: 'loading',
                isAuthenticated: true,
            };

        case ActionTypes.FIREBASE_LOGOUT_SUCCESS:
            return {...state,
                status: 'succeeded',
                isAuthenticated: false,
            };

        case ActionTypes.FIREBASE_LOGOUT_FAILURE:
            return {...state,
                status: 'failed',
                isAuthenticated: true,
                errMess: action.errMess,
            };

        default:
            return state

    }
}