import * as ActionTypes from './ActionTypes';
import axios from 'axios';
import { baseUrl } from '../shared/baseUrl';
import { isJWTExpired } from '../shared/AdditionalFunctions';

const headerWithToken = {
    "headers": localStorage.getItem('token') && isJWTExpired(localStorage.getItem('token')) ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
};

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
    console.log(getState());
    axios.post(baseUrl + '/api/post/create/', 
    post,
    {
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
    axios.delete(baseUrl + `/api/post/${postId}/delete/`, headerWithToken)
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

export const loginSuccess = (token, currentUser, currentUserId, currentUserEmail, currentUserProfileImg) => {
    return({
        type: ActionTypes.LOGIN_SUCCESS,
        token,
        currentUser,
        currentUserId,
        currentUserEmail,
        currentUserProfileImg,
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
        const currentUserProfileImg = res.data.user.profile.profileImg;
        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', currentUser);
        localStorage.setItem('currentUserId', currentUserId);
        localStorage.setItem('currentUserEmail', currentUserEmail);
        localStorage.setItem('currentUserProfileImg', currentUserProfileImg);
        dispatch(loginSuccess(token, currentUser, currentUserId, currentUserEmail, currentUserProfileImg));
        window.location.reload();
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
    localStorage.removeItem('currentUserProfileImg');
    dispatch(resetPostVotes());
    dispatch(resetAnswersVotes());
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
        window.location.reload();
        //dispatch(fetchUser(token, currentUser));
        //dispatch(checkAuthTimeout(3600));
    })
    .catch(error => {
        console.log(error);
        dispatch(loginError(error));
    });
}

const getTokenByKey = (obj, label, results=[]) => {
    const r = results;
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        if(key === label && typeof value !== 'object') {
            r.push(value);
        }else if(typeof value === 'object') {
            getTokenByKey(value, label, r);
        }
    });
    return r[0];
};

//GOOGLE AUTHENTICATION
export const loginUserWithGoogle = (creds) => async (dispatch) => {
    dispatch(requestLogin(creds));

    const access_token = getTokenByKey(creds, 'access_token');

    return await axios.post(baseUrl + '/rest-auth/google/', {
        access_token: creds.accessToken ? creds.accessToken: access_token,
        //rememberMe: creds.rememberMe,
    })
    .then(res => {
        console.log(res);
        const googleToken = creds.tokenObj.access_token;
        const token = res.data.token;
        const currentUser = res.data.user.username;
        const currentUserId = res.data.user.id;
        const currentUserEmail = res.data.user.email;
        const currentUserProfileImg = creds.profileObj.imageUrl;
        localStorage.setItem('googleToken', googleToken);
        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', currentUser);
        localStorage.setItem('currentUserId', currentUserId);
        localStorage.setItem('currentUserEmail', currentUserEmail);
        localStorage.setItem('currentUserProfileImg', currentUserProfileImg);
        dispatch(loginSuccess(token, currentUser, currentUserId, currentUserEmail, currentUserProfileImg));
        window.location.reload();
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
        "headers": localStorage.getItem('token') && isJWTExpired(localStorage.getItem('token')) ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
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

//ANSWER
export const fetchAnswers = (postId) => async (dispatch) => {
    dispatch(answersLoading());

    axios.get(baseUrl + `/answer_api/?postBelong=${postId}`)
    .then(response => {
        console.log(response);
        return response;
    })
    .then(answers => dispatch(addAnswers(answers.data)))
    .catch(error => {
        console.log(error);
        dispatch(answersFailed(error));
    });
}

export const answersLoading = () => ({
    type: ActionTypes.ANSWER_LIST_LOADING
});

export const answersFailed = (errmess) => ({
    type: ActionTypes.ANSWER_LIST_FAILED,
    payload: errmess
});

export const resetAnswers = () => ({
    type: ActionTypes.RESET_ANSWER_LIST
});

export const addAnswers = (answers) => ({
    type: ActionTypes.ADD_ANSWER_LIST,
    payload: answers
});

export const postAnswer = (postBelong, owner, answerContent) => (dispatch) => {
    axios.post(baseUrl + `/answer_api/answer/create/`, {
        postBelong: postBelong,
        owner: owner,
        answerContent: answerContent,
    }, headerWithToken)
    .then(response => {
        console.log(response);
        dispatch(fetchAnswers(postBelong));
    })
    .catch(error => {
        console.log(error);
        //dispatch(answersFailed(error));
    });
}

export const updateAnswer = (id, postBelong, answerContent) => (dispatch) => {
    axios.patch(baseUrl + `/answer_api/answer/${id}/update/`, {
        answerContent,
    }, headerWithToken)
    .then(response => {
        console.log(response);
        dispatch(fetchAnswers(postBelong));
    })
    .catch(error => {
        console.log(error);
        //dispatch(answersFailed(error));
    });
}

export const deleteAnswer = (id, postBelong) => (dispatch) => {
    axios.delete(baseUrl + `/answer_api/answer/${id}/delete/`, headerWithToken)
    .then(response => {
        console.log(response);
        dispatch(fetchAnswers(postBelong));
    })
    .catch(error => {
        console.log(error);
        //dispatch(answersFailed(error));
    });
}

//ANSWER VOTES
export const fetchAnswerVotes = (answerId, voteType) => async (dispatch) => {
    dispatch(answerVotesLoading());

    axios.get(baseUrl + `/vote_api/answervote/?answer=${answerId}&voteType=${voteType}`)
    .then(response => {
        console.log(response);
        return response;
    })
    .then(votes => dispatch(addAnswerVotes(votes.data)))
    .catch(error => {
        console.log(error);
        dispatch(answerVotesFailed(error));
    });
}

export const fetchAnswerVotesDirect = (answerId, voteType, setCount) => (dispatch) => {

    axios.get(baseUrl + `/vote_api/answervote/?answer=${answerId}&voteType=${voteType}`)
    .then(response => {
        //console.log(response.data);
        setCount(response.data.length);
        return response;
    })
    .catch(error => {
        console.log(error);
    });
}

export const fetchAnswerVotesByLoggedInUser = (owner, answer) => (dispatch) => {
    dispatch(answerVotesLoading());

    axios.get(baseUrl + `/vote_api/answervote/?owner=${owner}&answer=${answer}`)
    .then(response => {
        console.log(response.data);
        dispatch(addAnswerVotes(response.data));
        return response;
    })
    .catch(error => {
        console.log(error);
        dispatch(answerVotesFailed());
    });
}

export const answerVotesLoading = () => ({
    type: ActionTypes.ANSWER_VOTE_LIST_LOADING
});

export const answerVotesFailed = (errmess) => ({
    type: ActionTypes.ANSWER_VOTE_LIST_FAILED,
    payload: errmess
});

export const resetAnswersVotes = () => ({
    type: ActionTypes.RESET_ANSWER_VOTE_LIST
});

export const addAnswerVotes = (votes) => ({
    type: ActionTypes.ADD_ANSWER_VOTE_LIST,
    payload: votes
});

export const postAnswerVote = (answer, voteType, owner) => (dispatch) => {
    axios.post(baseUrl + `/vote_api/answervote/vote/create/`, {
        answer,
        voteType,
        owner
    }, headerWithToken)
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
        //dispatch(updateAnswerVote(answer, voteType, owner));
    });
}

export const updateAnswerVote = (answer, newVoteType, owner) => (dispatch) => {
    axios.patch(baseUrl + `/vote_api/answervote/vote/answer=${answer}&owner=${owner}/update/`, {
        voteType: newVoteType,
    }, headerWithToken)
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    });
}

export const deleteAnswerVote = (answer, voteType, owner) => (dispatch) => {
    axios.delete(baseUrl + `/vote_api/answervote/vote/answer=${answer}&voteType=${voteType}&owner=${owner}/delete/`, headerWithToken)
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    });
}

//POST VOTES
export const fetchPostVotes = (postId, voteType) => async (dispatch) => {
    dispatch(postVotesLoading());

    axios.get(baseUrl + `/vote_api/postvote/?post=${postId}&voteType=${voteType}`)
    .then(response => {
        console.log(response);
        return response;
    })
    .then(votes => dispatch(addPostVotes(votes.data)))
    .catch(error => {
        console.log(error);
        dispatch(postVotesFailed(error));
    });
}

export const fetchPostVotesDirect = (postId, voteType, setCount) => (dispatch) => {

    axios.get(baseUrl + `/vote_api/postvote/?post=${postId}&voteType=${voteType}`)
    .then(response => {
        //console.log(response.data);
        setCount(response.data.length);
        return response;
    })
    .catch(error => {
        console.log(error);
    });
}

export const fetchPostVotesByLoggedInUser = (owner, post) => (dispatch) => {
    dispatch(postVotesLoading());

    axios.get(baseUrl + `/vote_api/postvote/?owner=${owner}&post=${post}`)
    .then(response => {
        console.log(response.data);
        dispatch(addPostVotes(response.data));
        return response;
    })
    .catch(error => {
        console.log(error);
        dispatch(postVotesFailed());
    });
}

export const postVotesLoading = () => ({
    type: ActionTypes.POST_VOTE_LIST_LOADING
});

export const postVotesFailed = (errmess) => ({
    type: ActionTypes.POST_VOTE_LIST_FAILED,
    payload: errmess
});

export const resetPostVotes = () => ({
    type: ActionTypes.RESET_POST_VOTE_LIST
});

export const addPostVotes = (votes) => ({
    type: ActionTypes.ADD_POST_VOTE_LIST,
    payload: votes
});

export const postPostVote = (post, voteType, owner) => (dispatch) => {
    axios.post(baseUrl + `/vote_api/postvote/vote/create/`, {
        post,
        voteType,
        owner
    }, headerWithToken)
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
        //dispatch(updatePostVote(post, voteType, owner));
    });
}

export const updatePostVote = (post, newVoteType, owner) => (dispatch) => {
    axios.patch(baseUrl + `/vote_api/postvote/vote/post=${post}&owner=${owner}/update/`, {
        voteType: newVoteType,
    }, headerWithToken)
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    });
}

export const deletePostVote = (post, voteType, owner) => (dispatch) => {
    axios.delete(baseUrl + `/vote_api/postvote/vote/post=${post}&voteType=${voteType}&owner=${owner}/delete/`, headerWithToken)
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    });
}


// USER NOTIFICATIONS

export const fetchNotifications = (recipient) => async (dispatch) => {
    dispatch(notificationsLoading());

    axios.get(baseUrl + `/inbox/notifications/?recipient=${recipient}`, headerWithToken)
    .then(response => {
        console.log(response);
        return response;
    })
    .then(votes => dispatch(addNotifications(votes.data)))
    .catch(error => {
        console.log(error);
        dispatch(notificationsFailed(error));
    });
}

export const deleteNotifications = (id) => (dispatch) => {
    axios.delete(baseUrl + `/inbox/notifications/${id}/`, headerWithToken)
    .then(res => {
        console.log(res);
    })
    .catch(error => {
        console.log(error);
    });
}

export const patchNotifications = (id, unread) => (dispatch) => {
    axios.patch(baseUrl + `/inbox/notifications/${id}/`, {
        unread
    }, headerWithToken)
    .then(res => {
        console.log(res);
    })
    .catch(error => {
        console.log(error);
    });
}

export const notificationsLoading = () => ({
    type: ActionTypes.NOTIFICATIONS_LIST_LOADING
});

export const notificationsFailed = (errmess) => ({
    type: ActionTypes.NOTIFICATIONS_LIST_FAILED,
    payload: errmess
});

export const resetNotifications = () => ({
    type: ActionTypes.RESET_NOTIFICATIONS_LIST
});

export const addNotifications = (notifications) => ({
    type: ActionTypes.ADD_NOTIFICATIONS_LIST,
    payload: notifications
});