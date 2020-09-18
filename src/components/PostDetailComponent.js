import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button, Typography, ThemeProvider } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AlertDialogSlide from './AlertComponent';
import NotFound from './NotFoundComponent';
import PostViewer from './PostViewerComponent';
import { theme, useStyles } from '../styles/postsStyles';

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
        if(props.post !== undefined) {
            return(
                <div>
                    <ThemeProvider theme={theme}>
                        <RenderCard title={props.post === undefined ? '': props.post.title} body={props.post === undefined ? '': props.post.body}/>
                        <Link to={`/posts/${props.match.params.postId}/edit/`} style={{textDecoration: 'none'}}>
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
                    </ThemeProvider>
                </div>
            );
        }else {
            return(<NotFound/>);
        }
    }
}