import * as ActionTypes from './ActionTypes';
import axios from 'axios';
import { baseUrl } from '../shared/baseUrl';
import { useDispatch } from 'react-redux';

//POSTS
export const fetchPosts = () => async (dispatch) => {
    dispatch(postsLoading());

    axios.get(baseUrl + '/api/')
    .then(response => {
        //console.log(response);
        return response;
    })
    .then(posts => dispatch(addPosts(posts.data)))
    .catch(error => {
        console.log(error);
        dispatch(postsFailed(error));
    });
}

export const postsLoading = () => ({
    type: ActionTypes.POST_LIST_LOADING
});

export const postsFailed = (errmess) => ({
    type: ActionTypes.POST_LIST_FAILED,
    payload: errmess
});

export const resetPosts = () => ({
    type: ActionTypes.RESET_POST_LIST
});

export const addPosts = (posts) => ({
    type: ActionTypes.ADD_POST_LIST,
    payload: posts
});

export const postPost = (post) => (dispatch, getState) => {
    console.log(post.title);
    console.log(post.body);
    console.log(getState());
    axios.post(baseUrl + '/api/post/create/', {
        title: post.title,
        body: post.body,
        owner: post.owner,
    },{
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        dispatch(fetchPosts());
        console.log(res);
        console.log("Question submitted successfully!");
    })
    .catch(error => console.log(error));
};

export const editPost = (post) => (dispatch, getState) => {
    console.log(post);
    axios.patch(baseUrl + `/api/post/${post.id}/update/`, {
        title: post.title,
        body: post.body,
    },{
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        console.log("Question updated successfully!");
        dispatch(fetchPostDetail(post.id));
    })
    .catch(error => console.log(error));
};

export const deletePost = (postId, history) => (dispatch, getState) => {
    axios.delete(baseUrl + `/api/${postId}/`)
    .then(res => {
        dispatch(fetchPosts());
        console.log(res);
        console.log("Question deleted successfully!");
        history.push('/questions');
    })
    .catch(error => console.log(error));
};

//SINGLE_POST
export const fetchPostDetail = (postId) => async (dispatch) => {
    dispatch(postLoading());

    axios.get(baseUrl + `/api/${postId}/`)
    .then(response => {
        //console.log(response);
        return response;
    })
    .then(post => dispatch(addPost(post.data)))
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

//REFRESH TOKEN
export const getNewToken = (currentToken) => (dispatch) => {

    console.log({token: currentToken});

    axios.post(baseUrl + '/api-jwt-token-refresh/', {
        token: currentToken
    })
    .then(res => {
        console.log(res);
        localStorage.setItem('token', res.data.token);
    })
    .catch(error => {
        console.log(error);
        dispatch(logout());
    });
}

// AUTHENTICATION
export const requestLogin = (creds) => {
    return ({
        type: ActionTypes.LOGIN_REQUEST,
        creds
    });
}

export const loginSuccess = (token, currentUser, currentUserId, currentUserEmail) => {
    return({
        type: ActionTypes.LOGIN_SUCCESS,
        token,
        currentUser,
        currentUserId,
        currentUserEmail,
    });
}

export const loginError = (loginErrMessage) => {
    return({
        type: ActionTypes.LOGIN_FAILURE,
        errMess: loginErrMessage
    });
}

export const loginUser = (creds) => async (dispatch) => {
    dispatch(requestLogin(creds));

    return await axios.post(baseUrl + '/jwtlogin/', {
        username: creds.username,
        password: creds.password,
        //rememberMe: creds.rememberMe,
    })
    .then(res => {
        console.log(res);
        const token = res.data.token;
        const currentUser = res.data.user.username;
        const currentUserId = res.data.user.id;
        const currentUserEmail = res.data.user.email;
        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', currentUser);
        localStorage.setItem('currentUserId', currentUserId);
        localStorage.setItem('currentUserEmail', currentUserEmail);
        dispatch(loginSuccess(token, currentUser, currentUserId, currentUserEmail));
        //dispatch(fetchUser(token, currentUser));
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
    localStorage.clear();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('token');
    dispatch(logoutSuccess());
}

//SIGNUP
export const signupUser = (creds) => (dispatch) => {
    //console.log(creds);
    dispatch(requestLogin(creds));

    axios.post(baseUrl + '/jwtregister/', {
        username: creds.username,
        password1: creds.password1,
        password2: creds.password2,
        email: creds.email
    })
    .then(res => {
        console.log(res);
        const token = res.data.token;
        const currentUser = res.data.user.username;
        const currentUserId = res.data.user.id;
        const currentUserEmail = res.data.user.email;
        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', currentUser);
        localStorage.setItem('currentUserId', currentUserId);
        localStorage.setItem('currentUserEmail', currentUserEmail);
        dispatch(loginSuccess(token, currentUser, currentUserId, currentUserEmail));
        //dispatch(fetchUser(token, currentUser));
        //dispatch(checkAuthTimeout(3600));
    })
    .catch(error => {
        console.log(error);
        dispatch(loginError(error));
    });
}

//GOOGLE AUTHENTICATION
export const loginUserWithGoogle = (creds) => async (dispatch) => {
    dispatch(requestLogin(creds));

    return await axios.post(baseUrl + '/rest-auth/google/', {
        access_token: creds.tokenObj.access_token,
        //rememberMe: creds.rememberMe,
    })
    .then(res => {
        console.log(res);
        const key = res.data.key;
        localStorage.setItem('key', key);
        const googleToken = creds.tokenObj.access_token;
        const token = res.data.token;
        const currentUser = res.data.user.username;
        const currentUserId = res.data.user.id;
        const currentUserEmail = res.data.user.email;
        localStorage.setItem('googleToken', googleToken);
        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', currentUser);
        localStorage.setItem('currentUserId', currentUserId);
        localStorage.setItem('currentUserEmail', currentUserEmail);
        dispatch(loginSuccess(token, currentUser, currentUserId, currentUserEmail));
        //dispatch(fetchUser(token, currentUser));
    })
    .catch(error => {
        dispatch(loginError(error));
    });
}

//RETREIVING USER INFORMATION
export const fetchUser = (token, currentUser) => (dispatch) => {
    dispatch(userLoading());

    //dispatch(getNewToken(localStorage.getItem('token')));

    console.log(localStorage.getItem('token'));

    return axios.get(baseUrl + `/users/${currentUser}/`, {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
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

export const updateUser = (auth, firstname, lastname, aboutMe) => (dispatch) => {
    axios.patch(baseUrl + `/users/${auth.currentUser}/update/`, {
        first_name: firstname,
        last_name: lastname,
        profile: {
            aboutMe: aboutMe,
        },
    },
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
    })
    .catch(error => {
        console.log(error);
    })
}

export const updateUserAboutMe = (auth, aboutMe) => (dispatch) => {
    axios.patch(baseUrl + `/users/${auth.currentUser}/update/`, {
        profile: {
            aboutMe: aboutMe,
        },
    },
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
    })
    .catch(error => {
        console.log(error);
    })
}

export const updateUserProfileImage = (auth, profileImage, usernameFromTheUrl) => (dispatch) => {
    const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem('token') !== null ? "JWT " + localStorage.getItem('token'): undefined
    }

    axios.patch(baseUrl + `/profile_api/${auth.currentUserId}/`, profileImage,
    {
        "headers": headers
    })
    .then(res => {
        console.log(res);
        dispatch(fetchUser(null, usernameFromTheUrl));
    })
    .catch(error => {
        console.log(error);
    })
}

//RETREIVING USER PROFILE
export const fetchUserProfile = (token, currentUserId) => (dispatch) => {
    dispatch(userProfileLoading());

    axios.get(baseUrl + `/profile_api/${currentUserId}/`, {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(addUserProfile(res));
    })
    .catch(error => {
        console.log(error);
        dispatch(userProfileFailed(error));
    })
}

export const userProfileLoading = () => ({
    type: ActionTypes.USER_PROFILE_LOADING
});

export const userProfileFailed = (errmess) => ({
    type: ActionTypes.USER_PROFILE_FAILED,
    payload: errmess
});

export const addUserProfile = (user) => ({
    type: ActionTypes.ADD_USER_PROFILE,
    payload: user
});

export const updateUserProfile = (auth, aboutMe) => (dispatch) => {
    axios.patch(baseUrl + `/users/${auth.currentUser}/`, {
        user: auth.currentUserId,
        aboutMe: aboutMe,
    },
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
    })
    .catch(error => {
        console.log(error);
    })
}