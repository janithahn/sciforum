import * as ActionTypes from './ActionTypes';
import axios from 'axios';

//POSTS
export const fetchPosts = () => async (dispatch) => {
    dispatch(postLoading());

    axios.get('http://localhost:8000/api/')
    .then(response => {
        //console.log(response);
        return response;
    })
    .then(posts => dispatch(addPost(posts.data)))
    .catch(error => {
        console.log(error);
        dispatch(postFailed(error));
    });
}

export const postLoading = () => ({
    type: ActionTypes.POST_LOADING
});

export const postFailed = (errmess) => ({
    type: ActionTypes.POST_FAILED,
    payload: errmess
});

export const addPost = (post) => ({
    type: ActionTypes.ADD_POST,
    payload: post
});

export const postPost = (post) => (dispatch, getState) => {
    console.log(post.title);
    console.log(post.body);
    console.log(getState());
    axios.post('http://localhost:8000/api/', {
        title: post.title,
        body: post.body
    })
    .then(res => {
        console.log(res);
        console.log("Question submitted successfully!");
        dispatch(fetchPosts());
    })
    .catch(error => console.log(error));
};

export const editPost = (post) => (dispatch, getState) => {
    console.log(post);
    axios.put(`http://localhost:8000/api/${post.id}/`, {
        title: post.title,
        body: post.body
    })
    .then(res => {
        console.log(res);
        console.log("Question updated successfully!");
        dispatch(fetchPosts());
    })
    .catch(error => console.log(error));
};

export const deletePost = (post, history) => (dispatch, getState) => {
    axios.delete(`http://localhost:8000/api/${post.id}/`)
    .then(res => {
        console.log(res);
        console.log("Question deleted successfully!");
        dispatch(fetchPosts());
        history.push('/questions');
    })
    .catch(error => console.log(error));
};

// AUTHENTICATION
export const requestLogin = (creds) => {
    return ({
        type: ActionTypes.LOGIN_REQUEST,
        creds
    });
}

export const loginSuccess = (response) => {
    return({
        type: ActionTypes.LOGIN_SUCCESS,
        token: response.token
    });
}

export const loginError = (loginErrMessage) => {
    return({
        type: ActionTypes.LOGIN_FAILURE,
        loginErrMessage
    });
}

const checkAuthTimeout = expirationTime => dispatch => {
    dispatch(
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000)
    );
}

export const loginUser = (creds) => (dispatch) => {
    dispatch(requestLogin(creds));

    axios.post('http://localhost:8000/rest-auth/login/', {
        username: creds.username,
        password: creds.password
    })
    .then(res => {
        const token = res.data.key;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(loginSuccess(res));
        dispatch(checkAuthTimeout(3600));
    })
    .catch(error => {
        dispatch(loginError(error));
    });
}

export const requestLogout = () => {
    return {
      type: ActionTypes.LOGOUT_REQUEST
    }
}
  
export const logoutSuccess = () => {
    return {
      type: ActionTypes.LOGOUT_SUCCESS
    }
}

export const logout = () => (dispatch) => {
    dispatch(requestLogout());
    localStorage.removeItem('user');
    localStorage.removeItem('expirationDate');
    dispatch(logoutSuccess());
}

//SIGNUP
export const signupUser = (creds) => (dispatch) => {
    dispatch(requestLogin(creds));

    axios.post('http://localhost:8000/rest-auth/register/', {
        username: creds.username,
        password1: creds.password1,
        password2: creds.password2,
        email: creds.email
    })
    .then(res => {
        const token = res.data.key;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(loginSuccess(res));
        dispatch(checkAuthTimeout(3600));
    })
    .catch(error => {
        dispatch(loginError(error));
    });
}