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
        body: post.body,
        owner: post.owner,
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
        body: post.body,
        owner: post.owner
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
        token: response.data.token,
        currentUserId: response.data.user_id,
        currentUserEmail: response.data.email,
    });
}

export const loginError = (loginErrMessage) => {
    return({
        type: ActionTypes.LOGIN_FAILURE,
        errMess: loginErrMessage
    });
}

const checkAuthTimeout = expirationTime => dispatch => (
    dispatch(
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000)
    )
);

export const loginUser = (creds) => (dispatch) => {
    dispatch(requestLogin(creds));

    return axios.post('http://localhost:8000/user/login/', {
        username: creds.username,
        password: creds.password,
        //rememberMe: creds.rememberMe,
    })
    .then(res => {
        console.log(res);
        const token = res.data.token;
        const currentUserId = res.data.user_id;
        const currentUserEmail = res.data.email;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem('token', token);
        localStorage.setItem('userId', currentUserId);
        localStorage.setItem('userEmail', currentUserEmail);
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(loginSuccess(res));
        //dispatch(checkAuthTimeout(3600));
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
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    dispatch(logoutSuccess());
}

//SIGNUP
export const signupUser = (creds) => (dispatch) => {
    //console.log(creds);
    dispatch(requestLogin(creds));

    axios.post('http://localhost:8000/user/register/', {
        username: creds.username,
        password1: creds.password1,
        password2: creds.password2,
        email: creds.email
    })
    .then(res => {
        console.log(res);
        const token = res.data.token;
        const currentUserId = res.data.user_id;
        const currentUserEmail = res.data.email;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem('token', token);
        localStorage.setItem('userId', currentUserId);
        localStorage.setItem('userEmail', currentUserEmail);
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(loginSuccess(res));
        //dispatch(checkAuthTimeout(3600));
    })
    .catch(error => {
        console.log(error);
        dispatch(loginError(error));
    });
}

//RETRIVE USER INFO
export const fetchUser = (auth) => (dispatch) => {
    dispatch(userLoading());

    axios.get(`http://localhost:8000/users/${auth.currentUserId}/`, {
        "headers": auth.token !== null ? {Authorization: "Token " + auth.token}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(addUser(res));
    })
    .catch(error => {
        console.log(error);
        dispatch(userFailed(error));
    })
}

export const userLoading = () => ({
    type: ActionTypes.USER_LOADING
});

export const userFailed = (errmess) => ({
    type: ActionTypes.USER_FAILED,
    payload: errmess
});

export const addUser = (user) => ({
    type: ActionTypes.ADD_USER,
    payload: user
});

export const updateUser = (auth, username, firstname) => (dispatch) => {
    axios.put(`http://localhost:8000/users/${auth.currentUserId}/update/`, {
        username,
        first_name: firstname,
    },
    {
        "headers": auth.token !== null ? {Authorization: "Token " + auth.token}: undefined
    })
    .then(res => {
        console.log(res);
    })
    .catch(error => {
        console.log(error);
    })
}