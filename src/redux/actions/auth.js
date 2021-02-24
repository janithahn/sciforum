import * as ActionTypes from '../ActionTypes';

export const Auth = (state = {
        status: 'idle',
        isAuthenticated: localStorage.getItem('token') ? true: false,
        token: localStorage.getItem('token'),
        firebase_token: localStorage.getItem('firebase_token'),
        currentUser: localStorage.getItem('currentUser'),
        currentUserId: localStorage.getItem('currentUserId'),
        currentUserEmail: localStorage.getItem('currentUserEmail'),
        currentUserEmailVerified: localStorage.getItem('currentUserEmailVerified'),
        is_email_subscribed: localStorage.getItem('is_email_subscribed'),
        has_interests: localStorage.getItem('has_interests'),
        currentUserProfileImg: localStorage.getItem('currentUserProfileImg'),
        currentUserRole: localStorage.getItem('currentUserRole'),
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
                token: action.token,
                firebase_token: action.firebase_token,
                currentUser: action.currentUser,
                currentUserId: action.currentUserId,
                currentUserEmail: action.currentUserEmail,
                currentUserEmailVerified: action.currentUserEmailVerified,
                is_email_subscribed: action.is_email_subscribed,
                has_interests: action.has_interests,
                currentUserProfileImg: action.currentUserProfileImg,
                currentUserRole: action.currentUserRole,
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
                firebase_token: '',
            };

        default:
            return state

    }
}