import * as ActionTypes from './ActionTypes';
import axios from 'axios';
import { baseUrl } from '../shared/baseUrl';
import { isJWTExpired } from '../shared/AdditionalFunctions';
import { db, auth } from '../firebase/config';
import { fetchUnreadNotifications } from '../components/header/actions';

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

export const postPost = (post, setSnackMessage, setSnackOpen) => (dispatch, getState) => {
    console.log(getState());
    axios.post(baseUrl + '/api/post/create/', 
    post,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        dispatch(fetchPosts());
        dispatch(fetchMyPosts(localStorage.getItem('currentUserId'), 1));
        console.log("Question submitted successfully!");
        setSnackMessage("Question submitted successfully");
        setSnackOpen(true);
    })
    .catch(error => {
        console.log(error);
        setSnackMessage("Error submitting question");
        setSnackOpen(true);
    });
};

export const editPost = (post, setSnackMessage, setSnackOpen) => (dispatch, getState) => {
    console.log(post);
    axios.patch(baseUrl + `/api/post/${post.id}/update/`, {
        title: post.title,
        body: post.body,
        tags: post.tags,
    },{
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        console.log("Question updated successfully!");
        setSnackMessage("Question updated successfully");
        setSnackOpen(true);
        dispatch(fetchPostDetail(post.id));
    })
    .catch(error => {
        console.log(error);
        setSnackMessage("Error updating the quesition!");
        setSnackOpen(true);
    });
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

    await axios.get(baseUrl + `/api/${postId}/`)
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

export const postReset = () => ({
    type: ActionTypes.POST_RESET,
});

//POST_IMAGES
export const UploadPostImages = (imgData)  => async (dispatch) => {
    const url = 'https://api.imgur.com/3/image';
    const clientId = 'a178005f2b29b10';

    dispatch(postImagesLoading());

    return axios.post(url, imgData, {
        "headers": {Authorization: `Client-ID ${clientId}`}
    })
    .then(res => dispatch(addPostImages(res.data.data)))
    .catch(error => {
        console.log(error);
        dispatch(postImagesFailed(error));
    });

}

export const postImagesLoading = () => ({
    type: ActionTypes.POST_IMAGES_LOADING
});

export const postImagesFailed = (errmess) => ({
    type: ActionTypes.POST_IMAGES_FAILED,
    payload: errmess
});

export const addPostImages = (images) => ({
    type: ActionTypes.ADD_POST_IMAGES,
    payload: images
});

export const postImagesReset = () => ({
    type: ActionTypes.POST_IMAGES_RESET,
});

//MY POSTS
export const fetchMyPosts = (ownerId, page) => async (dispatch) => {
    dispatch(myPostsLoading());

    axios.get(baseUrl + `/api/?ordering=-created_at&owner=${ownerId}&page=${page}`)
    .then(response => {
        //console.log(response);
        return response;
    })
    .then(myposts => dispatch(addMyPosts(myposts.data)))
    .catch(error => {
        console.log(error);
        dispatch(myPostsFailed(error));
    });
}

export const myPostsLoading = () => ({
    type: ActionTypes.MYPOSTS_LOADING
});

export const myPostsFailed = (errmess) => ({
    type: ActionTypes.MYPOSTS_FAILED,
    payload: errmess
});

export const addMyPosts = (posts) => ({
    type: ActionTypes.ADD_MYPOSTS,
    payload: posts
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

export const loginSuccess = (token, firebase_token, currentUser, currentUserId, currentUserEmail, currentUserProfileImg) => {
    return({
        type: ActionTypes.LOGIN_SUCCESS,
        token,
        firebase_token,
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

export const loginUser = (creds, history, from) => async (dispatch) => {

    dispatch(requestLogin(creds));

    return await axios.post(baseUrl + '/jwtlogin/', {
        username: creds.username,
        password: creds.password,
        //rememberMe: creds.rememberMe,
    })
    .then(res => {
        console.log(res);
        const token = res.data.token;
        const firebase_token = res.data.firebase_token;
        const currentUser = res.data.user.username;
        const currentUserId = res.data.user.id;
        const currentUserEmail = res.data.user.email;
        const currentUserProfileImg = res.data.user.profile.profileImg;

        localStorage.setItem('token', token);
        localStorage.setItem('firebase_token', firebase_token);
        localStorage.setItem('currentUser', currentUser);
        localStorage.setItem('currentUserId', currentUserId);
        localStorage.setItem('currentUserEmail', currentUserEmail);
        localStorage.setItem('currentUserProfileImg', currentUserProfileImg);
        localStorage.setItem('currentUserRoomKeys', "[]");
        dispatch(loginSuccess(token, firebase_token, currentUser, currentUserId, currentUserEmail, currentUserProfileImg));
        history.replace(from); //redirecting back to where it was
        //dispatch(fetchUser(token, currentUser));
    })
    .then(() => {
        window.location.reload();
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

//START FIREBASE AUTH
export const requestFirebaseLogin = () => {
    return ({
        type: ActionTypes.FIREBASE_LOGIN_REQUEST,
    });
}

export const firebaseLoginSuccess = (firebase_user) => {
    return({
        type: ActionTypes.FIREBASE_LOGIN_SUCCESS,
        firebase_user,
    });
}

export const firebaseLoginError = (loginErrMessage) => {
    return({
        type: ActionTypes.FIREBASE_LOGIN_FAILURE,
        errMess: loginErrMessage
    });
}

export const firebaseLoginUser = (access_token) => async (dispatch) => {

    dispatch(requestFirebaseLogin());

    auth().signInWithCustomToken(access_token)
    .then((user) => {
        console.log("FIREBASE_SUCCESS:", user);
        dispatch(firebaseLoginSuccess(user));
        localStorage.setItem('firebase_user', user)
    })
    .catch((error) => {
        console.log("FIREBASE_ERROR:", error);
        dispatch(firebaseLoginError(error));
    });

}

export const requestFirebaseLogout = () => {
    return {
      type: ActionTypes.FIREBASE_LOGOUT_REQUEST
    }
}
  
export const firebaseLogoutSuccess = () => {
    return {
      type: ActionTypes.FIREBASE_LOGOUT_SUCCESS
    }
}

export const firebaseLogoutFailure = (error) => {
    return {
      type: ActionTypes.FIREBASE_LOGOUT_FAILURE,
      errMess: error
    }
}
//END FIREBASE AUTH

const snapshotToArray = (snapshot) => {
    const returnArr = [];

    snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });

    return returnArr;
}

const roomsReset = () => ({
    type: ActionTypes.RESET_ROOMS,
});

export const logout = () => (dispatch) => {
    dispatch(requestLogout());

    const currentUserRoomKeys = JSON.parse(localStorage.getItem('currentUserRoomKeys'));
    if(currentUserRoomKeys) {
        let len = currentUserRoomKeys.length;
        
        if(len === 0) { 
            dispatch(requestFirebaseLogout());   
            auth().signOut()
            .then(() => {
                console.log("Sign out firebase successfull");
                dispatch(firebaseLogoutSuccess());
            })
            .catch((error) => {
                console.log("Sign out firebase error");
                dispatch(firebaseLogoutFailure(error));
            });
            localStorage.clear();
        }else {
            for(let roomKey of currentUserRoomKeys) {
                db.ref('roomusers/').orderByChild('roomKey').equalTo(roomKey.toString()).once('value', (resp) => {
                    let roomuser = [];
                    roomuser = snapshotToArray(resp);

                    for(let user of roomuser) {
                        if(user !== undefined){
                            const userRef = db.ref('roomusers/').child(user.key);
                            userRef.update({status: "offline"})
                            .then(() => {
                                console.log("Status updated successfully!");
                            })
                            .catch(() => {
                                console.log("Status update failed!");
                            });
                        }
                        len = len - 1;
                        if(len === 0) { 
                            dispatch(requestFirebaseLogout());   
                            auth().signOut()
                            .then(() => {
                                console.log("Sign out firebase successfull");
                                dispatch(firebaseLogoutSuccess());
                            })
                            .catch((error) => {
                                console.log("Sign out firebase error");
                                dispatch(firebaseLogoutFailure(error));
                            });
                            localStorage.clear();
                        }
                    }
                });
            }
        }
    }

    //localStorage.clear();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('token');
    localStorage.removeItem('firebase_token');
    localStorage.removeItem('currentUserProfileImg');
    dispatch(resetPostVotes());
    dispatch(resetAnswersVotes());
    dispatch(roomsReset());
    dispatch(logoutSuccess());
}

//SIGNUP
export const signupUser = (creds) => async (dispatch) => {
    //console.log(creds);
    dispatch(requestLogin(creds));

    await axios.post(baseUrl + '/jwtregister/', {
        username: creds.username,
        password1: creds.password1,
        password2: creds.password2,
        email: creds.email
    })
    .then(res => {
        console.log(res);
        const token = res.data.token;
        const firebase_token = res.data.firebase_token;
        const currentUser = res.data.user.username;
        const currentUserId = res.data.user.id;
        const currentUserEmail = res.data.user.email;

        localStorage.setItem('token', token);
        localStorage.setItem('firebase_token', firebase_token);
        localStorage.setItem('currentUser', currentUser);
        localStorage.setItem('currentUserId', currentUserId);
        localStorage.setItem('currentUserEmail', currentUserEmail);
        localStorage.setItem('currentUserRoomKeys', "[]");
        dispatch(loginSuccess(token, firebase_token, currentUser, currentUserId, currentUserEmail));
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
export const loginUserWithGoogle = (creds, history, from) => async (dispatch) => {
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
        const firebase_token = res.data.firebase_token;
        const currentUser = res.data.user.username;
        const currentUserId = res.data.user.id;
        const currentUserEmail = res.data.user.email;
        const currentUserProfileImg = creds.profileObj.imageUrl;

        localStorage.setItem('googleToken', googleToken);
        localStorage.setItem('token', token);
        localStorage.setItem('firebase_token', firebase_token);
        localStorage.setItem('currentUser', currentUser);
        localStorage.setItem('currentUserId', currentUserId);
        localStorage.setItem('currentUserEmail', currentUserEmail);
        localStorage.setItem('currentUserProfileImg', currentUserProfileImg);
        localStorage.setItem('currentUserRoomKeys', "[]");
        dispatch(loginSuccess(token, firebase_token, currentUser, currentUserId, currentUserEmail, currentUserProfileImg));
        history.replace(from); //redirecting back to where it was
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

    //console.log(localStorage.getItem('token'));

    return axios.get(baseUrl + `/users/${currentUser}/`, {
        "headers": localStorage.getItem('token') && isJWTExpired(localStorage.getItem('token')) ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res.data);
        dispatch(addUser(res.data));
        //localStorage.setItem("currentUserProfileImg", res.data.profile.profileImg);
    })
    .catch(error => {
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
        }
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

export const updateUserContact = (auth, contact) => (dispatch) => {
    axios.patch(baseUrl + `/users/${auth.currentUser}/update/`, {
        contact
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

//USER_EMPLOYMENT
export const fetchUserEmployment = (requestUsername) => (dispatch) => {
    dispatch(userEmploymentLoading());

    axios.get(baseUrl + `/profile_api/user_employment/viewset/?username=${requestUsername}`,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(addUserEmployment(res.data));
    })
    .catch(error => {
        console.log(error);
        dispatch(userEmploymentFailed(error));
    })
} 

export const userEmploymentLoading = () => ({
    type: ActionTypes.USER_EMPLOYMENT_LOADING
});

export const userEmploymentFailed = (errmess) => ({
    type: ActionTypes.USER_EMPLOYMENT_FAILED,
    payload: errmess
});

export const addUserEmployment = (userEmployment) => ({
    type: ActionTypes.ADD_USER_EMPLOYMENT,
    payload: userEmployment
});

export const updateUserEmployment = (employment, id) => (dispatch) => {
    
    axios.patch(baseUrl + `/profile_api/user_employment_edit/viewset/${id}/`, employment,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(fetchUserEmployment(localStorage.getItem('currentUser')));
    })
    .catch(error => {
        console.log(error);
    })
}

export const createUserEmployment = (employment) => (dispatch) => {
    
    axios.post(baseUrl + `/profile_api/user_employment_edit/viewset/`, employment,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(fetchUserEmployment(localStorage.getItem('currentUser')));
    })
    .catch(error => {
        console.log(error);
    })
}

export const deleteUserEmployment = (employmentId) => (dispatch) => {
    
    axios.delete(baseUrl + `/profile_api/user_employment_edit/viewset/${employmentId}/`,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(fetchUserEmployment(localStorage.getItem('currentUser')));
    })
    .catch(error => {
        console.log(error);
    })
}

//USER_EDUCATION
export const fetchUserEducation = (requestUsername) => (dispatch) => {
    dispatch(userEducationLoading());

    axios.get(baseUrl + `/profile_api/user_education/viewset/?username=${requestUsername}`,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(addUserEducation(res.data));
    })
    .catch(error => {
        console.log(error);
        dispatch(userEducationFailed(error));
    })
} 

export const userEducationLoading = () => ({
    type: ActionTypes.USER_EDUCATION_LOADING
});

export const userEducationFailed = (errmess) => ({
    type: ActionTypes.USER_EDUCATION_FAILED,
    payload: errmess
});

export const addUserEducation = (userEducation) => ({
    type: ActionTypes.ADD_USER_EDUCATION,
    payload: userEducation
});

export const updateUserEducation = (education, id) => (dispatch) => {
    
    axios.patch(baseUrl + `/profile_api/user_education_edit/viewset/${id}/`, education,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(fetchUserEducation(localStorage.getItem('currentUser')));
    })
    .catch(error => {
        console.log(error);
    })
}

export const createUserEducation = (education) => (dispatch) => {
    
    axios.post(baseUrl + `/profile_api/user_education_edit/viewset/`, education,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(fetchUserEducation(localStorage.getItem('currentUser')));
    })
    .catch(error => {
        console.log(error);
    })
}

export const deleteUserEducation = (educationId) => (dispatch) => {
    
    axios.delete(baseUrl + `/profile_api/user_education_edit/viewset/${educationId}/`,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(fetchUserEducation(localStorage.getItem('currentUser')));
    })
    .catch(error => {
        console.log(error);
    })
}

//USER_SKILLS
export const fetchUserSkills = (requestUsername) => (dispatch) => {
    dispatch(userSkillsLoading());

    axios.get(baseUrl + `/profile_api/user_skills/viewset/?username=${requestUsername}`,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(addUserSkills(res.data));
    })
    .catch(error => {
        console.log(error);
        dispatch(userSkillsFailed(error));
    })
} 

export const userSkillsLoading = () => ({
    type: ActionTypes.USER_SKILLS_LOADING
});

export const userSkillsFailed = (errmess) => ({
    type: ActionTypes.USER_SKILLS_FAILED,
    payload: errmess
});

export const addUserSkills = (userSkills) => ({
    type: ActionTypes.ADD_USER_SKILLS,
    payload: userSkills
});

export const updateUserSkills = (skills, id) => (dispatch) => {
    
    axios.patch(baseUrl + `/profile_api/user_skills_edit/viewset/${id}/`, skills,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(fetchUserSkills(localStorage.getItem('currentUser')));
    })
    .catch(error => {
        console.log(error);
    })
}

export const createUserSkills = (skills) => (dispatch) => {
    
    axios.post(baseUrl + `/profile_api/user_skills_edit/viewset/`, skills,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(fetchUserSkills(localStorage.getItem('currentUser')));
    })
    .catch(error => {
        console.log(error);
    })
}

export const deleteUserSkills = (skillId) => (dispatch) => {
    
    axios.delete(baseUrl + `/profile_api/user_skills_edit/viewset/${skillId}/`,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(fetchUserSkills(localStorage.getItem('currentUser')));
    })
    .catch(error => {
        console.log(error);
    })
}

//USER_CONTACT
/*export const fetchUserContact = (requestUsername) => (dispatch) => {
    dispatch(userContactLoading());

    axios.get(baseUrl + `/profile_api/user_contact/viewset/?username=${requestUsername}`,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(addUserContact(res.data));
    })
    .catch(error => {
        console.log(error);
        dispatch(userContactFailed(error));
    })
} 

export const userContactLoading = () => ({
    type: ActionTypes.USER_EDUCATION_LOADING
});

export const userContactFailed = (errmess) => ({
    type: ActionTypes.USER_EDUCATION_FAILED,
    payload: errmess
});

export const addUserContact = (userContact) => ({
    type: ActionTypes.ADD_USER_EDUCATION,
    payload: userContact
});

export const updateUserContact = (contact, id) => (dispatch) => {
    
    axios.patch(baseUrl + `/profile_api/user_contact_edit/viewset/${id}/`, contact,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(fetchUserContact(localStorage.getItem('currentUser')));
    })
    .catch(error => {
        console.log(error);
    })
}

export const createUserContact = (contact) => (dispatch) => {
    
    axios.post(baseUrl + `/profile_api/user_contact_edit/viewset/`, contact,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(fetchUserContact(localStorage.getItem('currentUser')));
    })
    .catch(error => {
        console.log(error);
    })
}

export const deleteUserContact = (contactId) => (dispatch) => {
    
    axios.delete(baseUrl + `/profile_api/user_contact_edit/viewset/${contactId}/`,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(fetchUserContact(localStorage.getItem('currentUser')));
    })
    .catch(error => {
        console.log(error);
    })
}*/

//USER_LANGUAGES
export const fetchUserLanguages = (requestUsername) => (dispatch) => {
    dispatch(userLanguagesLoading());

    axios.get(baseUrl + `/profile_api/user_languages/viewset/?username=${requestUsername}`,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(addUserLanguages(res.data));
    })
    .catch(error => {
        console.log(error);
        dispatch(userLanguagesFailed(error));
    })
} 

export const userLanguagesLoading = () => ({
    type: ActionTypes.USER_LANGUAGES_LOADING
});

export const userLanguagesFailed = (errmess) => ({
    type: ActionTypes.USER_LANGUAGES_FAILED,
    payload: errmess
});

export const addUserLanguages = (userLanguages) => ({
    type: ActionTypes.ADD_USER_LANGUAGES,
    payload: userLanguages
});

export const updateUserLanguages = (languages, id) => (dispatch) => {
    
    axios.patch(baseUrl + `/profile_api/user_languages_edit/viewset/${id}/`, languages,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(fetchUserLanguages(localStorage.getItem('currentUser')));
    })
    .catch(error => {
        console.log(error);
    })
}

export const createUserLanguages = (languages) => (dispatch) => {
    
    axios.post(baseUrl + `/profile_api/user_languages_edit/viewset/`, languages,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(fetchUserLanguages(localStorage.getItem('currentUser')));
    })
    .catch(error => {
        console.log(error);
    })
}

export const deleteUserLanguages = (languageId) => (dispatch) => {
    
    axios.delete(baseUrl + `/profile_api/user_languages_edit/viewset/${languageId}/`,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(fetchUserLanguages(localStorage.getItem('currentUser')));
    })
    .catch(error => {
        console.log(error);
    })
}

//POST COMMENTS
export const fetchPostComments = (postId) => (dispatch) => {

    dispatch(postCommentsLoading());

    axios.get(baseUrl + `/comment_api/post_comment/?post=${postId}`, {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(addPostComments(res.data));
    })
    .catch(error => {
        console.log(error);
        dispatch(postCommentsFailed(error));
    });
}

export const postCommentsLoading = () => ({
    type: ActionTypes.POST_COMMENTS_LOADING
});

export const postCommentsFailed = (errmess) => ({
    type: ActionTypes.POST_COMMENTS_FAILED,
    payload: errmess
});

export const addPostComments = (postComments) => ({
    type: ActionTypes.ADD_POST_COMMENTS,
    payload: postComments
});

export const updatePostComments = (comment, commetId, postId) => (dispatch) => {
    
    axios.patch(baseUrl + `/comment_api/post_comment_create/${commetId}/`, comment,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(fetchPostComments(postId));
    })
    .catch(error => {
        console.log(error);
    })
}

export const createPostComments = (comment, postId) => (dispatch) => {
    
    axios.post(baseUrl + `/comment_api/post_comment_create/`, comment,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(fetchPostComments(postId));
    })
    .catch(error => {
        console.log(error);
    })
}

export const deletePostComments = (commentId, postId) => (dispatch) => {
    
    axios.delete(baseUrl + `/comment_api/post_comment_create/${commentId}/`,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(fetchPostComments(postId));
    })
    .catch(error => {
        console.log(error);
    })
}

//ANSWER COMMENTS
export const fetchAnswerComments = (id) => (dispatch) => {

    dispatch(answerCommentsLoading());

    axios.get(baseUrl + `/comment_api/answer_comment/?post=${id}`, {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(addAnswerComments(res.data));
    })
    .catch(error => {
        console.log(error);
        dispatch(answerCommentsFailed(error));
    });
}

export const fetchAnswerCommentsDirect = (answerId, handleComments) => (dispatch) => {

    axios.get(baseUrl + `/comment_api/answer_comment/?answer=${answerId}`, {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        handleComments(res.data);
    })
    .catch(error => {
        console.log(error);
    });
}

export const answerCommentsLoading = () => ({
    type: ActionTypes.ANSWER_COMMENTS_LOADING,
});

export const answerCommentsFailed = (errmess, answerId) => ({
    type: ActionTypes.ANSWER_COMMENTS_FAILED,
    payload: errmess,
    answerId
});

export const addAnswerComments = (answerComments) => ({
    type: ActionTypes.ADD_ANSWER_COMMENTS,
    payload: answerComments,
});

export const updateAnswerComments = (comment, commetId, id) => (dispatch) => {
    
    axios.patch(baseUrl + `/comment_api/answer_comment_create/${commetId}/`, comment,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(fetchAnswerComments(id));
    })
    .catch(error => {
        console.log(error);
    })
}

export const createAnswerComments = (comment, id) => (dispatch) => {
    
    axios.post(baseUrl + `/comment_api/answer_comment_create/`, comment,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(fetchAnswerComments(id));
    })
    .catch(error => {
        console.log(error);
    })
}

export const deleteAnswerComments = (commentId, id) => (dispatch) => {
    
    axios.delete(baseUrl + `/comment_api/answer_comment_create/${commentId}/`,
    {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(res => {
        console.log(res);
        dispatch(fetchAnswerComments(id));
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
export const fetchAnswers = (postId) => (dispatch) => {
    dispatch(answersLoading());

    axios.get(baseUrl + `/answer_api/?postBelong=${postId}`, {
        "headers": localStorage.getItem('token') ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
    })
    .then(answers => 
        dispatch(addAnswers(answers.data))
    )
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

//ANSWER COMMENT VOTES
export const fetchAnswerCommentVotes = (commentId, voteType) => async (dispatch) => {
    dispatch(answerCommentVotesLoading());

    axios.get(baseUrl + `/vote_api/answercommentvote/?comment=${commentId}&voteType=${voteType}`)
    .then(response => {
        console.log(response);
        return response;
    })
    .then(votes => dispatch(addAnswerCommentVotes(votes.data)))
    .catch(error => {
        console.log(error);
        dispatch(answerCommentVotesFailed(error));
    });
}

export const fetchAnswerCommentVotesByLoggedInUser = (owner, comment) => (dispatch) => {
    dispatch(answerCommentVotesLoading());

    axios.get(baseUrl + `/vote_api/answercommentvote/?owner=${owner}&comment=${comment}`)
    .then(response => {
        console.log(response.data);
        dispatch(addAnswerCommentVotes(response.data));
        return response;
    })
    .catch(error => {
        console.log(error);
        dispatch(answerCommentVotesFailed());
    });
}

export const answerCommentVotesLoading = () => ({
    type: ActionTypes.ANSWER_COMMENT_VOTE_LIST_LOADING
});

export const answerCommentVotesFailed = (errmess) => ({
    type: ActionTypes.ANSWER_COMMENT_VOTE_LIST_FAILED,
    payload: errmess
});

export const resetAnswersCommentVotes = () => ({
    type: ActionTypes.RESET_ANSWER_COMMENT_VOTE_LIST
});

export const addAnswerCommentVotes = (votes) => ({
    type: ActionTypes.ADD_ANSWER_COMMENT_VOTE_LIST,
    payload: votes
});

export const postAnswerCommentVote = (comment, voteType, owner) => (dispatch) => {
    axios.post(baseUrl + `/vote_api/answercommentvote/vote/create/`, {
        comment,
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

export const updateAnswerCommentVote = (comment, newVoteType, owner) => (dispatch) => {
    axios.patch(baseUrl + `/vote_api/answercommentvote/vote/comment=${comment}&owner=${owner}/update/`, {
        voteType: newVoteType,
    }, headerWithToken)
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    });
}

export const deleteAnswerCommentVote = (comment, voteType, owner) => (dispatch) => {
    axios.delete(baseUrl + `/vote_api/answercommentvote/vote/answer=${comment}&voteType=${voteType}&owner=${owner}/delete/`, headerWithToken)
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

//POST COMMENT VOTES
export const fetchPostCommentVotes = (commentId, voteType) => async (dispatch) => {
    dispatch(postCommentVotesLoading());

    axios.get(baseUrl + `/vote_api/postcommentvote/?comment=${commentId}&voteType=${voteType}`)
    .then(response => {
        console.log(response);
        return response;
    })
    .then(votes => dispatch(addPostCommentVotes(votes.data)))
    .catch(error => {
        console.log(error);
        dispatch(postCommentVotesFailed(error));
    });
}

export const fetchPostCommentVotesByLoggedInUser = (owner, comment) => (dispatch) => {
    dispatch(postCommentVotesLoading());

    axios.get(baseUrl + `/vote_api/postcommentvote/?owner=${owner}&comment=${comment}`)
    .then(response => {
        console.log(response.data);
        dispatch(addPostCommentVotes(response.data));
        return response;
    })
    .catch(error => {
        console.log(error);
        dispatch(postCommentVotesFailed());
    });
}

export const postCommentVotesLoading = () => ({
    type: ActionTypes.POST_COMMENT_VOTE_LIST_LOADING
});

export const postCommentVotesFailed = (errmess) => ({
    type: ActionTypes.POST_COMMENT_VOTE_LIST_FAILED,
    payload: errmess
});

export const resetPostCommentVotes = () => ({
    type: ActionTypes.RESET_POST_COMMENT_VOTE_LIST
});

export const addPostCommentVotes = (votes) => ({
    type: ActionTypes.ADD_POST_COMMENT_VOTE_LIST,
    payload: votes
});

export const postPostCommentVote = (comment, voteType, owner) => (dispatch) => {
    axios.post(baseUrl + `/vote_api/postcommentvote/vote/create/`, {
        comment,
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

export const updatePostCommentVote = (comment, newVoteType, owner) => (dispatch) => {
    axios.patch(baseUrl + `/vote_api/postcommentvote/vote/comment=${comment}&owner=${owner}/update/`, {
        voteType: newVoteType,
    }, headerWithToken)
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    });
}

export const deletePostCommentVote = (comment, voteType, owner) => (dispatch) => {
    axios.delete(baseUrl + `/vote_api/postcommentvote/vote/comment=${comment}&voteType=${voteType}&owner=${owner}/delete/`, headerWithToken)
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
        dispatch(fetchUnreadNotifications(localStorage.getItem("currentUserId")));
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
        dispatch(fetchUnreadNotifications(localStorage.getItem("currentUserId")));
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