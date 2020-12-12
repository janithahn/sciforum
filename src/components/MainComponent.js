import React, { useEffect } from 'react';
import Header from './header/HeaderComponent';
import Home from './home/HomeComponent';
import MyPosts from './myposts/MyPosts';
import { Switch, Route, Redirect, withRouter, useLocation } from 'react-router-dom';
import { useStyles } from './../styles/styles';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, postPost, editPost, logout, getNewToken } from '../redux/ActionCreators';
import Footer from './footer/FooterComponent';
import SignUp from './sign/SignUpComponent';
import SignIn from './sign/SignInComponent';
import MainDrawer from './drawer/DrawerComponent';
//import PostDetail from './post/PostDetailComponent';
import PostView from './post/index';
import CreatePost from  './post/CreatePostComponent';
import EditPost from './post/EditPostComponent';
import NotFound from './alert/NotFoundComponent';
import PageNotFound from './alert/PageNotFound/PageNotFound';
import Search from './home/SearchResults';
import SearchByTag from './home/SearchByTagResults';
//import MDBCustomFooter from './footer/MDBFooterComponent';
//import ProfileDetails from './user/ProfileComponent';
import Account from './user/index';
import Notifications from './notifications/index';
import jwt_decode from 'jwt-decode';
import GoogleSocialAuth from './GoogleLoginComponent';

function Main(props) {
    const post = useSelector(state => state.Post);
    const auth = useSelector(state => state.Auth);
    const location = useLocation();
    const dispatch = useDispatch();

    const isLoading = useSelector(state => [
        state.Auth.status, state.Answers.status, state.Notifications.status, 
        state.Post.status, state.Posts.status, state.MyPosts.status, state.User.status, 
        state.answerVotes.status, state.postVotes.status, state.PostComments.status,
        state.AnswerComments.status
    ].includes('loading'));

    const [showProgressBar, setShowProgressBar] = React.useState(false);

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState('');

    useEffect(() => {
        setShowProgressBar(isLoading);
    });

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

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

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
            return (<Route {...rest} render={() => (
                auth.isAuthenticated && post.post.owner == auth.currentUser
                ? <Component postId={post.post.id}/>
                : <Redirect to='/' />
            )} />)
        } else {
            return (<NotFound/>)
        }
    };

    const PrivateRoutPostCreate = ({ component: Component, ...rest }) => (
        <Route {...rest} render={() => (
            auth.isAuthenticated
            ? <Component/>
            : <Redirect to="/signin"/> //or you can add props.history.push('/signin') here
        )} />
    );

    const PrivateRouteNotifications = ({ component: Component, ...rest}) => (
        <Route {...rest} render={() => (
            auth.isAuthenticated
            ? <Component/>
            : <Redirect to="/signin"/>
        )} />
    );

    const PrivateRouteMyPosts = ({ component: Component, ...rest}) => (
        <Route {...rest} render={() => (
            auth.isAuthenticated
            ? <Component/>
            : <Redirect to="/signin"/>
        )} />
    );

    return (
        <div>
            <Header classes={classes} handleDrawerOpen={handleDrawerOpen} open={open} showProgressBar={showProgressBar} snackOpen={snackOpen} setSnackOpen={setSnackOpen} snackMessage={snackMessage}/>
            {location.pathname !== '/signup' && location.pathname !== '/signin' && <MainDrawer open={open} classes={classes} handleDrawerClose={handleDrawerClose}/>}
            <main className={(location.pathname !== '/signup' && location.pathname !== '/signin') ? classes.content: undefined}>
                <Switch>
                    <Route exact path="/" component={() => <Home classes={classes}/>} />
                    <Route exact path="/questions" component={() => <Home classes={classes}/>}/>
                    <Route path="/search" component={() => <Search/>}/>
                    <Route exact path="/questions/:postId" component={() => <PostView/>}/>
                    <Route exact path="/questions/tagged/:tagname" component={() => <SearchByTag/>}/>
                    <PrivateRoutPostEdit path="/posts/:postId/edit" component={() => <EditPost setSnackMessage={setSnackMessage} setSnackOpen={setSnackOpen}/>}/>
                    <PrivateRouteMyPosts exact path="/myposts" component={() => <MyPosts/>}/>
                    <PrivateRoute exact path="/signup" component={() => <SignUp/>} />
                    <PrivateRoute exact path="/signin" component={() => <SignIn/>}/>
                    <PrivateRoutPostCreate exact path="/ask" component={() => <CreatePost setSnackMessage={setSnackMessage} setSnackOpen={setSnackOpen} postPost={(post) => dispatch(postPost(post))}/>}/>
                    <Route path="/profile/:username" component={AccountView}/>
                    <PrivateRouteNotifications path="/notifications" component={() => <Notifications currentUserId={auth.currentUserId}/>}/>
                    <Route exact path="/googlelogin" component={() => <GoogleSocialAuth/>}/>
                    <Route component={PageNotFound}/>
                    <Redirect to="/"/>
                </Switch>
            </main>
            {(location.pathname !== '/signup' && location.pathname !== '/signin') ? <Footer/>: undefined}
        </div>
    );
}

export default withRouter(Main);