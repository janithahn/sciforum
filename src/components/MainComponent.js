import React, { useEffect } from 'react';
import Header from './header/HeaderComponent';
import Home from './home/HomeComponent';
import Sample from './SampleComponent';
import { Switch, Route, Redirect, withRouter, useLocation } from 'react-router-dom';
import { useStyles } from './../styles/styles';
import { useSelector, useDispatch, useStore } from 'react-redux';
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
//import MDBCustomFooter from './footer/MDBFooterComponent';
//import ProfileDetails from './user/ProfileComponent';
import Account from './user/index';
import Notifications from './notifications/index';
import { Loading } from './loading/LoadingComponent';
import jwt_decode from 'jwt-decode';
import GoogleSocialAuth from './GoogleLoginComponent';
import { isLoading } from '../shared/AdditionalFunctions';

function Main(props) {
    const post = useSelector(state => state.Post);
    const auth = useSelector(state => state.Auth);
    const location = useLocation();
    const dispatch = useDispatch();

    //loading states of all actions
    const authLoading = useSelector(state => state.Auth.status);
    const answersLoading = useSelector(state => state.Answers.status);
    const notificationsLoading = useSelector(state => state.Notifications.status);
    const postLoading = useSelector(state => state.Post.status);
    const postsLoading = useSelector(state => state.Posts.status);
    const userLoading = useSelector(state => state.User.status);
    const answerVotesLoading = useSelector(state => state.answerVotes.status);
    const postVotesLoading = useSelector(state => state.postVotes.status);

    const [showProgressBar, setShowProgressBar] = React.useState(false);

    useEffect(() => {
        setShowProgressBar(isLoading(authLoading, answersLoading, notificationsLoading, postLoading, postsLoading, userLoading, answerVotesLoading, postVotesLoading));
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
            return (<Loading/>)
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

    return (
        <div>
            <Header classes={classes} handleDrawerOpen={handleDrawerOpen} open={open} showProgressBar={showProgressBar}/>
            {location.pathname !== '/signup' && location.pathname !== '/signin' && <MainDrawer open={open} classes={classes} handleDrawerClose={handleDrawerClose}/>}
            <main className={(location.pathname !== '/signup' && location.pathname !== '/signin') ? classes.content: undefined}>
                <Switch>
                    <Route exact path="/" component={() => <Home classes={classes}/>} />
                    <Route exact path="/questions" component={() => <Home classes={classes}/>}/>
                    <Route path="/questions/:postId" component={() => <PostView/>}/>
                    <PrivateRoutPostEdit path="/posts/:postId/edit" component={() => <EditPost/>}/>
                    <Route exact path="/sample" component={Sample}/>
                    <PrivateRoute exact path="/signup" component={() => <SignUp/>} />
                    <PrivateRoute exact path="/signin" component={() => <SignIn/>}/>
                    <PrivateRoutPostCreate exact path="/ask" component={() => <CreatePost postPost={(post) => dispatch(postPost(post))}/>}/>
                    <Route path="/profile/:username" component={AccountView}/>
                    <PrivateRouteNotifications path="/notifications" component={() => <Notifications currentUserId={auth.currentUserId}/>}/>
                    <Route exact path="/googlelogin" component={() => <GoogleSocialAuth/>}/>
                    <Route component={NotFound}/>
                    <Redirect to="/"/>
                </Switch>
            </main>
            {(location.pathname !== '/signup' && location.pathname !== '/signin') ? <Footer/>: undefined}
        </div>
    );
}

export default withRouter(Main);