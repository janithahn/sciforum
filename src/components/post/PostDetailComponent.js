import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button, Typography, ThemeProvider } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AlertDialogSlide from './AlertComponent';
import NotFound from '../alert/NotFoundComponent';
import PostViewer from './PostViewerComponent';
import { theme, useStyles } from './styles/postsStyles';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

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

    const {postId} = useParams(); //another way of approaching the postId from the url other than match.params
    const post = posts.posts.filter((post) => post.id === parseInt(postId))[0];

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if(props.postLoading === 'loading') {
        return(<CircularProgress color="secondary" size={15}/>);
    }else if(props.postFailed) {
        return(<h4>Error loading...!</h4>);
    } else {
        if(post !== undefined) {
            return(
                <div>
                    <ThemeProvider theme={theme}>
                        <RenderCard title={props.post === undefined ? '': props.post.title} body={props.post === undefined ? '': props.post.body}/>
                        {auth.isAuthenticated && auth.currentUserId == post.owner ?
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
                                <AlertDialogSlide open={open} handleClose={handleClose} post={props.post}/>
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