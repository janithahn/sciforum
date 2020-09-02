import React, { useEffect } from 'react';
import Header from './HeaderComponent';
import Home from './HomeComponent';
import Sample from './SampleComponent';
import { Switch, Route, Redirect, withRouter, useLocation } from 'react-router-dom';
import { useStyles } from '../styles/styles';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../redux/ActionCreators';
import Footer from './FooterComponent';
import SignUp from './SignUpComponent';
import SignIn from './SignInComponent';
import MainDrawer from './DrawerComponent';
import PostDetail from './PostDetailComponent';

function Main() {
    const posts = useSelector(state => state.Posts);
    const dispatch = useDispatch();
    const location = useLocation();

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

    const HomePage = () => {
        return(
            <Home
                posts={posts.posts}
                postsLoading={posts.isLoading}
                postsFailed={posts.errMess}
                classes={classes}
            />
        );
    };

    const PostDetailView = ({match}) => {
        return(
            <PostDetail 
                post={posts.posts.filter((post) => post.id === parseInt(match.params.postId))[0]}
                postLoading={posts.isLoading}
                postFailed={posts.errMess}
                classes={classes}
            />
        );
    };

    return (
        <div>
            <Header classes={classes} handleDrawerOpen={handleDrawerOpen} open={open}/>
            {location.pathname !== '/signup' && location.pathname !== '/signin' && <MainDrawer open={open} classes={classes} handleDrawerClose={handleDrawerClose}/>}
            <main className={location.pathname !== '/signup' && location.pathname !== '/signin' && classes.content}>
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/questions/:postId" component={PostDetailView}/>
                    <Route exact path="/sample" component={Sample}/>
                    <Route exact path="/signup" component={() => <SignUp/>} />
                    <Route exact path="/signin" component={() => <SignIn/>}/>
                    <Redirect to="/" />
                </Switch>
            </main>
            <Footer/>
        </div>
    );
}

export default withRouter(Main);