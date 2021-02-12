import React, { useEffect } from 'react';
import Header from './header/HeaderComponent';
import Home from './home/HomeComponent';
import MyPosts from './myposts/MyPosts';
import { Switch, Route, Redirect, withRouter, useLocation } from 'react-router-dom';
import { useStyles } from './../styles/styles';
import { useSelector, useDispatch } from 'react-redux';
import { postPost, logout, getNewToken, firebaseLoginUser } from '../redux/ActionCreators';
import Footer from './footer/FooterComponent';
import SignUp from './sign/SignUpComponent';
import SignIn from './sign/SignInComponent';
import PasswordReset from './passwordReset/passwordReset';
//import PostDetail from './post/PostDetailComponent';
import PostView from './post/index';
import CreatePost from  './post/CreatePostComponent';
import EditPost from './post/EditPostComponent';
import NotFound from './alert/NotFoundComponent';
import PageNotFound from './alert/PageNotFound/PageNotFound';
import Search from './home/SearchResults';
import SearchByTag from './home/SearchByTagResults';
import SearchByLabel from './home/SearchByLabels';
import FilterByDate from './home/FilterByDate';
import FilterByVote from './home/FilterByVote';
import FilterByHot from './home/FilterByHot';
//import MDBCustomFooter from './footer/MDBFooterComponent';
//import ProfileDetails from './user/ProfileComponent';
import Account from './user/index';
import MyPostsAccount from './user/panels/myPosts';
import Notifications from './notifications/index';
import UserSettings from './settings/settings';
import jwt_decode from 'jwt-decode';
import GoogleSocialAuth from './GoogleLoginComponent';
import ResetConfirm from './passwordReset/resetConfirm';
import ConfirmEmailRedirect from './settings/confirmEmailRedirect';
// Chat App
import RoomList from './chat/roomList';
import ChatRoom from './chat/chatRoom';

function Main(props) {
    const classes = useStyles();
    
    const post = useSelector(state => state.Post);
    const auth = useSelector(state => state.Auth);
    const authFirebase = useSelector(state => state.AuthFirebase);
    const location = useLocation();
    const dispatch = useDispatch();

    //console.log(firebaseAuth().currentUser);

    const isLoading = useSelector(state => [
        state.Auth.status, state.Answers.status, state.Notifications.status, 
        state.Post.status, state.Posts.status, state.MyPosts.status, state.User.status, 
        state.answerVotes.status, state.postVotes.status, state.PostComments.status,
        state.AnswerComments.status, state.SendResetPassword.status, state.ChatRooms.status,
        state.ChatMessages.status, state.events.status, state.webinars.status, state.AuthFirebase.status, 
        state.ConfirmEmail.status, state.VerifyAccount.status, state.MyPostsProfile.status, state.MyAnswers.status,
        state.UpdateProfileImage.status,
    ].includes('loading'));

    const [showProgressBar, setShowProgressBar] = React.useState(false);

    //posts snackbar
    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState('');

    //login user into firebase if already not
    useEffect(() => {
        if(auth.isAuthenticated && authFirebase.status === 'idle' && authFirebase.isAuthenticated === false)
            dispatch(firebaseLoginUser(auth.firebase_token));
    }, [dispatch, authFirebase, auth]);

    //showing the progress bar under the appbar
    useEffect(() => {
        setShowProgressBar(isLoading);
    }, [isLoading]);

    useEffect(() => {
        //dispatch(fetchPosts());
        if(localStorage.getItem('token')) {
            try {
                let tokenDecode = jwt_decode(localStorage.getItem('token'));
                let expDate = (tokenDecode.exp * 1000) - 60000
                if (expDate <= Date.now()) {
                    localStorage.clear();
                    dispatch(logout());
                }else{
                    dispatch(getNewToken(localStorage.getItem('token')));
                }
            } catch (error) {
                console.log(error);
            }
        }else {
            dispatch(logout());
        }
    }, [dispatch]);

    const AccountView = ({match}) => {
        return(
            <Account match={match}/>
        );
    };

    const PrivateRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={() => (
            !auth.isAuthenticated
            ? <Component />
            : <Redirect to={{
                pathname: '/',
                state: { from: location.pathname }
                }} />
        )} />
    );

    const PrivateRoutPostEdit = ({ component: Component, ...rest }) => {
        //const postId = rest.computedMatch.params.postId;
        //const post = posts.posts.filter((post) => post.id === parseInt(postId))[0]

        if(post.post) {
            return (<Route {...rest} render={({location}) => (
                auth.isAuthenticated && post.post.owner && post.post.owner.toString() === auth.currentUser.toString()
                ? <Component postId={post.post.id}/>
                : <Redirect to={{
                    pathname: '/',
                    state: { from: location }
                }}
                />
            )} />)
        } else {
            return (<NotFound/>)
        }
    };

    const PrivateRoutPostCreate = ({ component: Component, ...rest }) => (
        <Route {...rest} render={({location}) => (
            auth.isAuthenticated
            ? <Component/>
            : <Redirect to={{
                pathname: '/signin',
                state: { from: location }
            }}
            /> //or you can add props.history.push('/signin') here
        )} />
    );

    const PrivateRouteNotifications = ({ component: Component, ...rest}) => (
        <Route {...rest} render={({location}) => (
            auth.isAuthenticated
            ? <Component/>
            : <Redirect to={{
                pathname: '/signin',
                state: { from: location }
            }}
            />
        )} />
    );

    const PrivateRouteSettings = ({ component: Component, ...rest}) => (
        <Route {...rest} render={({location}) => (
            auth.isAuthenticated
            ? <Component/>
            : <Redirect to={{
                pathname: '/signin',
                state: { from: location }
            }}
            />
        )} />
    );

    const PrivateRouteMyPosts = ({ component: Component, ...rest}) => (
        <Route {...rest} render={({location}) => (
            auth.isAuthenticated
            ? <Component/>
            : <Redirect to={{
                pathname: '/signin',
                state: { from: location }
            }}
            />
        )} />
    );

    /*function requireAuth(nextState, replace, next) {
        if (!auth.isAuthenticated) {
          replace({
            pathname: "/signin",
            state: {nextPathname: nextState.location.pathname}
          });
        }
        next();
    }*/
    
    const PrivateChatRoute = ({ component: Component, ...rest}) => (
        <Route {...rest} render={({location}) => (
            auth.isAuthenticated
            ? <Component/>
            : <Redirect to={{
                pathname: '/signin',
                state: { from: location }
            }}
            />
        )} />
    );

    const PrivateAccountConfirmRoute = ({ component: Component, ...rest}) => (
        <Route {...rest} render={({location}) => (
            auth.isAuthenticated
            ? <Component/>
            : <Redirect to={{
                pathname: '/signin',
                state: { from: location }
            }}
            />
        )} />
    );

    return (
        <div>
            <Header classes={classes} showProgressBar={showProgressBar} snackOpen={snackOpen} setSnackOpen={setSnackOpen} snackMessage={snackMessage}/>
            <main className={(location.pathname !== '/signup' && location.pathname !== '/signin') ? classes.content: undefined}>
                <Switch>
                    <Route exact path="/" component={() => <Home classes={classes}/>} />
                    <Route exact path="/questions" component={() => <Home classes={classes}/>}/>
                    <Route path="/search" component={() => <Search/>}/>
                    <Route exact path="/questions/:postId/:answerId?" component={PostView}/>

                    <Route exact path="/tagged/:tagname" component={() => <SearchByTag/>}/>
                    <Route exact path="/labeled/:label" component={() => <SearchByLabel/>}/>

                    <Route exact path="/home/filter/latest" component={() => <FilterByDate/>}/>
                    <Route exact path="/home/filter/by_vote" component={() => <FilterByVote/>}/>
                    <Route exact path="/home/filter/by_hot" component={() => <FilterByHot/>}/>

                    <PrivateRoutPostEdit path="/posts/:postId/edit" component={() => <EditPost setSnackMessage={setSnackMessage} setSnackOpen={setSnackOpen}/>}/>
                    <PrivateRouteMyPosts exact path="/myposts" component={() => <MyPosts/>}/>
                    <PrivateRoute exact path="/signup" component={() => <SignUp/>} />
                    <PrivateRoute exact path="/signin" component={() => <SignIn/>}/>
                    <PrivateRoutPostCreate exact path="/ask" component={() => <CreatePost setSnackMessage={setSnackMessage} setSnackOpen={setSnackOpen} postPost={(post) => dispatch(postPost(post))}/>}/>
                    
                    <Redirect exact from="/profile/:username" to="/profile/:username/index"/>
                    <Route exact path="/profile/:username/:tabname?" component={AccountView}/>

                    <PrivateRouteNotifications path="/notifications" component={() => <Notifications currentUserId={auth.currentUserId}/>}/>
                    <PrivateRouteSettings path="/settings" component={() => <UserSettings/>}/>
                    <Route exact path="/googlelogin" component={() => <GoogleSocialAuth/>}/>
                    
                    <PrivateAccountConfirmRoute exact path="/password/reset" component={() => <PasswordReset/>}/>
                    <PrivateAccountConfirmRoute exact path="/users/profile/password_reset/confirm/:token" component={() => <ResetConfirm/>}/>
                    <PrivateAccountConfirmRoute exact path="/verify-email/:token" component={() => <ConfirmEmailRedirect/>}/>

                    <PrivateChatRoute exact path="/chatrooms" component={() => <RoomList/>}/>
                    <PrivateChatRoute exact path="/chatroom/:roomKey" component={() => <ChatRoom/>}/>

                    <Route component={PageNotFound}/>
                    <Redirect to="/"/>
                </Switch>
            </main>
            {(location.pathname !== '/signup' && location.pathname !== '/signin') ? <Footer/>: undefined}
        </div>
    );
}

export default withRouter(Main);