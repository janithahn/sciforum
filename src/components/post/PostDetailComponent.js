import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button, Typography, ThemeProvider } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AlertDialogSlide from './AlertComponent';
import NotFound from '../alert/NotFoundComponent';
import PostViewer from './PostViewerComponent';
import { theme, useStyles } from './styles/postsStyles';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchPostDetail } from '../../redux/ActionCreators';

function RenderCard({title, body}) {
    return(
       <div>
           <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <PostViewer data={body}/>
       </div>
    );
    
}

export default function PostDetail(props) {
    const classes = useStyles();
    const auth = useSelector(state => state.Auth);
    const posts = useSelector(state => state.Posts);
    const post = useSelector(state => state.Post);

    const dispatch = useDispatch();

    const {postId} = useParams(); //another way of approaching for getting the postId from the url other than match.params
    //const postDetails = posts.posts.filter((post) => post.id === parseInt(postId))[0];

    const [open, setOpen] = React.useState(false);

    const [postInfo, setPostInfo] = React.useState({
        title: post.post ? post.post.title: null,
        body: post.post ? post.post.body: null,
    });
    const id = post.post ? post.post.id: null;
    const owner = post.post ? post.post.owner: null;
    const viewCount = post.post ? post.post.viewCount: null;

    React.useEffect(() => {
        if(post.status === 'idle') {
            dispatch(fetchPostDetail(postId));
        }
    }, [post, dispatch]);
    
    React.useEffect(() => {
    if(post.post) {
        handlePostInfo(post.post.id, post.post.owner, post.post.title, post.post.body, post.post.viewCount);
    }
    }, [post]);

    const handlePostInfo = (id, owner, title, body, viewCount) => {
        setPostInfo({
            title,
            body,
        });
        id = id;
        owner = owner;
        viewCount = viewCount;
    }

    console.log(postInfo);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if(post.status === 'loading') {
        return(<CircularProgress color="secondary" size={15}/>);
    }else if(post.errMess) {
        return(<h4>Error loading...!</h4>);
    } else {
        if(post !== undefined) {
            return(
                <div>
                    <ThemeProvider theme={theme}>
                        <RenderCard title={postInfo.title} body={postInfo.body}/>
                        {auth.isAuthenticated && auth.currentUserId == owner ?
                            <React.Fragment>
                                <Link to={`/posts/${postId}/edit/`} style={{textDecoration: 'none'}}>
                                    <Button
                                        className={classes.submit}
                                        type="submit"
                                        variant="contained"
                                        color="primary"  
                                    >
                                    Edit
                                    </Button>
                                </Link>
                                <Button
                                        className={classes.submit}
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        onClick={handleClickOpen}
                                    >
                                    Delete
                                </Button>
                                <AlertDialogSlide open={open} handleClose={handleClose} post={postInfo}/>
                            </React.Fragment>
                            : undefined
                        }
                    </ThemeProvider>
                </div>
            );
        }else {
            return(<NotFound/>);
        }
    }
}