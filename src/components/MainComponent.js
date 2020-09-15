import React, { useEffect } from 'react';
import Header from './HeaderComponent';
import Home from './HomeComponent';
import Sample from './SampleComponent';
import { Switch, Route, Redirect, withRouter, useLocation } from 'react-router-dom';
import { useStyles } from '../styles/styles';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, postPost, editPost } from '../redux/ActionCreators';
import Footer from './FooterComponent';
import SignUp from './SignUpComponent';
import SignIn from './SignInComponent';
import MainDrawer from './DrawerComponent';
import PostDetail from './PostDetailComponent';
import CreatePost from  './CreatePostComponent';
import EditPost from './EditPostComponent';
import NotFound from './NotFoundComponent';
import MDBCustomFooter from './MDBFooterComponent';

function Main() {
    const posts = useSelector(state => state.Posts);
    const auth = useSelector(state => state.Auth);
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPosts())
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
        console.log(posts);
        console.log(auth);
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

    const PostEditView = ({match}) => {
        return(
            <EditPost 
                post={posts.posts.filter((post) => post.id === parseInt(match.params.postId))[0]}
                postLoading={posts.status}
                postFailed={posts.errMess}
                classes={classes}
                editPost={(post) => dispatch(editPost(post))}
            />
        );
    };

    return (
        <div>
            <Header classes={classes} handleDrawerOpen={handleDrawerOpen} open={open}/>
            {location.pathname !== '/signup' && location.pathname !== '/signin' && <MainDrawer open={open} classes={classes} handleDrawerClose={handleDrawerClose}/>}
            <main className={location.pathname !== '/signup' && location.pathname !== '/signin' && classes.content}>
                <Switch>
                    <Route exact path="/" component={() => <Home classes={classes}/>} />
                    <Route exact path="/questions" component={() => <Home classes={classes}/>}/>
                    <Route path="/questions/:postId" component={PostDetailView}/>
                    <Route path="/posts/:postId/edit" component={PostEditView}/>
                    <Route exact path="/sample" component={Sample}/>
                    <Route exact path="/signup" component={() => <SignUp/>} />
                    <Route exact path="/signin" component={() => <SignIn/>}/>
                    <Route exact path="/ask" component={() => <CreatePost postPost={(post) => dispatch(postPost(post))}/>}/>
                    <Route component={NotFound}/>
                    <Redirect to="/"/>
                </Switch>
            </main>
            <Footer/>
        </div>
    );
}

export default withRouter(Main);