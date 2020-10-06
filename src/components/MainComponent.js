import React, { useEffect } from 'react';
import Header from './header/HeaderComponent';
import Home from './home/HomeComponent';
import Sample from './SampleComponent';
import { Switch, Route, Redirect, withRouter, useLocation } from 'react-router-dom';
import { useStyles } from './../styles/styles';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, postPost, editPost } from '../redux/ActionCreators';
import Footer from './footer/FooterComponent';
import SignUp from './sign/SignUpComponent';
import SignIn from './sign/SignInComponent';
import MainDrawer from './drawer/DrawerComponent';
import PostDetail from './post/PostDetailComponent';
import CreatePost from  './post/CreatePostComponent';
import EditPost from './post/EditPostComponent';
import NotFound from './alert/NotFoundComponent';
//import MDBCustomFooter from './footer/MDBFooterComponent';
//import ProfileDetails from './user/ProfileComponent';
import Account from './user/index';
import { Loading } from './loading/LoadingComponent';

function Main(props) {
    const posts = useSelector(state => state.Posts);
    const auth = useSelector(state => state.Auth);
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        /*if(auth.isAuthenticated) {
            dispatch(fetchUser(auth.token, auth.currentUser));
        }*/
        //dispatch(fetchUser(null, "janithahn"));
        dispatch(fetchPosts());
    }, [dispatch]);

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const PostDetailView = ({match}) => {
        //console.log(posts);
        //console.log(auth);
        return(
            <PostDetail
                post={posts.posts.filter((post) => post.id === parseInt(match.params.postId))[0]}
                postLoading={posts.status}
                postFailed={posts.errMess}
                classes={classes}
                match={match}
            />
        );
    };

    const AccountView = ({match}) => {
        return(
            <Account match={match}/>
        );
    };

    const PostEditView = ({postId}) => {
        return(
            <EditPost 
                post={posts.posts.filter((post) => post.id === parseInt(postId))[0]}
                postLoading={posts.status}
                postFailed={posts.errMess}
                classes={classes}
                editPost={(post) => dispatch(editPost(post))}
            />
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
        const postId = rest.computedMatch.params.postId;
        const post = posts.posts.filter((post) => post.id === parseInt(postId))[0]

        if(post !== undefined) {
            return (<Route {...rest} render={() => (
                auth.isAuthenticated && post.owner == auth.currentUserId
                ? <Component postId={post.id}/>
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

    const ProfileRoute = ({component: Component, ...rest}) => {
        //console.log(rest.computedMatch.params.username);
        //setCurrentUser(rest.computedMatch.params.username);
        return <Route {...rest}/>
    };

    return (
        <div>
            <Header classes={classes} handleDrawerOpen={handleDrawerOpen} open={open}/>
            {location.pathname !== '/signup' && location.pathname !== '/signin' && <MainDrawer open={open} classes={classes} handleDrawerClose={handleDrawerClose}/>}
            <main className={(location.pathname !== '/signup' && location.pathname !== '/signin') ? classes.content: undefined}>
                <Switch>
                    <Route exact path="/" component={() => <Home classes={classes}/>} />
                    <Route exact path="/questions" component={() => <Home classes={classes}/>}/>
                    <Route path="/questions/:postId" component={PostDetailView}/>
                    <PrivateRoutPostEdit path="/posts/:postId/edit" component={PostEditView}/>
                    <Route exact path="/sample" component={Sample}/>
                    <PrivateRoute exact path="/signup" component={() => <SignUp/>} />
                    <PrivateRoute exact path="/signin" component={() => <SignIn/>}/>
                    <PrivateRoutPostCreate exact path="/ask" component={() => <CreatePost postPost={(post) => dispatch(postPost(post))}/>}/>
                    <Route path="/profile/:username" component={AccountView}/>
                    <Route component={NotFound}/>
                    <Redirect to="/"/>
                </Switch>
            </main>
            {(location.pathname !== '/signup' && location.pathname !== '/signin') ? <Footer/>: undefined}
        </div>
    );
}

export default withRouter(Main);