import React from 'react';
import { Button, ThemeProvider, Grid, Modal, Backdrop, Fade, Chip, Divider, Typography } from '@material-ui/core';
import { Link as RouterLink, useParams } from 'react-router-dom';
import AlertDialogSlide from './AlertComponent';
//import NotFound from '../alert/NotFoundComponent';
//import PostViewer from './PostViewerComponent';
import { theme, useStyles } from './styles/postsStyles';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPostDetail, createPostComments } from '../../redux/ActionCreators';
import AnswerModalCard from '../answer/answerModalCard';
import VoteButtons from '../vote/postVoteButtons';
import RenderCard from './RenderCard';
import Article from './skeletons/post';
import { PostCommentInput, PostCommentRender } from './comment/comment';
import { EditorState } from 'draft-js';

function AnswerModal({openModal, answerContent, setAnswerContent, handleModalClose, classes, postId, ...rest}) {
    return(
        <Modal {...rest}
            open={openModal} 
            className={classes.modal}
            onClose={handleModalClose}
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >  
            <Fade in={openModal}>
                <AnswerModalCard 
                    answerContent={answerContent} 
                    setAnswerContent={setAnswerContent} 
                    postId={postId} 
                    handleModalClose={handleModalClose}
                    answerType={"create"}
                />
            </Fade>
        </Modal>
    );
}

export default function PostDetail() {

    const classes = useStyles();
    const auth = useSelector(state => state.Auth);
    const post = useSelector(state => state.Post);
    //const postComments = useSelector(state => state.PostComments);

    const dispatch = useDispatch();

    const { postId } = useParams(); //another way of approaching for getting the postId from the url other than match.params

    const [open, setOpen] = React.useState(false);

    const [openCommentBox, setOpenCommentBox] = React.useState(false);
    const [showAddComment, setShowAddComment] = React.useState(true);

    const [openModal, setOpenModal] = React.useState(false);
    const [answerContent, setAnswerContent] = React.useState('');

    /*const [postInfo, setPostInfo] = React.useState({
        title: post.post.title,
        body: post.post.body,
    });*/
    const postInfo = {
        title: post.post.title,
        body: post.post.body,
    };
    const id = post.post.id;
    const owner = post.post.owner;
    const viewCount = post.post.viewCount;
    const created_at = post.post.created_at;
    const updated_at = post.post.updated_at;
    const postTags = post.post.tags;
    const likes = post.post.likes;
    const dislikes = post.post.dislikes;

    React.useEffect(() => {
        if(post.status === 'idle') {
            dispatch(fetchPostDetail(postId));
        }
    }, [post.status, dispatch, postId]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleModalOpen = () => {
        setOpenModal(true);
    };
  
    const handleModalClose = () => {
        setOpenModal(false);
    };
    
    const handleCommentBoxOpen = () => {
        setOpenCommentBox(true);
        handleShowAddComment();
    };

    const handleShowAddComment = () => {
        setShowAddComment(false);
    };

    const handleCommentSubmit = React.useCallback(({ submitVal, setEditorState, setSubmitVal, text }) => {
        if(text.length !== 0) {
            dispatch(createPostComments(submitVal, postId));
        }
        setEditorState(() => EditorState.createEmpty());
        setSubmitVal({});
    }, [dispatch, postId]);

    if(post.status === 'loading') {
        return(<div><Article/></div>);
    }else if(post.errMess) {
        return(<h4>Error loading...!</h4>);
    } else {

        const RenderPostTags = postTags ? postTags.map((tag, key) => 
            <Grid item key={key} >
                <Chip className={classes.chip} color="primary" size="small" variant="outlined" label={tag} key={key} component="a" href={`/questions/tagged/${tag}`} clickable/>
            </Grid>): [];

        return(
            <div className={classes.root}>
                <ThemeProvider theme={theme}>
                    <RenderCard 
                        title={postInfo.title} 
                        body={postInfo.body} 
                        viewCount={viewCount}
                        created_at={created_at}
                        updated_at={updated_at}
                        owner={owner}
                        classes={classes}
                        handleModalOpen={handleModalOpen}
                    />
                    <AnswerModal 
                        classes={classes}
                        openModal={openModal}
                        answerContent={answerContent}
                        setAnswerContent={setAnswerContent}
                        handleModalClose={handleModalClose}
                        postId={postId}
                    />
                    <Grid container direction="row" justify="flex-start" alignItems="center" spacing={1}>
                        {RenderPostTags}
                    </Grid>
                    <Grid container justify="space-between" alignItems="center" spacing={0}>
                        <Grid item>
                            <Grid container justify="center" alignItems="center" spacing={0}>
                                <VoteButtons
                                    likes={likes}
                                    dislikes={dislikes}
                                />
                            </Grid>
                        </Grid>
                        {auth.isAuthenticated && auth.currentUser === owner ?
                            <Grid item>
                                <Grid container justify="center" alignItems="center" spacing={0}>
                                    <Grid item>
                                        <RouterLink to={`/posts/${postId}/edit/`} style={{textDecoration: 'none'}}>
                                            <Button
                                                className={classes.submit}
                                                color="primary"
                                                size="small"
                                            >
                                            Edit
                                            </Button>
                                        </RouterLink>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            className={classes.submit}
                                            color="secondary"
                                            onClick={handleClickOpen}
                                            size="small"
                                        >
                                            Delete
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            : undefined
                        }
                    </Grid>
                    <Divider/>
                    {
                        auth.isAuthenticated && showAddComment ? 
                            <Button variant="text" size="small" style={{textTransform: "none"}} color="inherit" onClick={handleCommentBoxOpen}>
                                <Typography variant="subtitle2" color="primary">Add comment</Typography>
                            </Button>: 
                        undefined
                    }
                    {
                        auth.isAuthenticated && openCommentBox ? 
                            <PostCommentInput handleCommentSubmit={handleCommentSubmit} currentUserProfileImg={auth.currentUserProfileImg} postId={postId}/>: 
                        undefined
                    }
                    {/*
                        postComments.status === 'succeeded' && postComments.postComments !== [] ?
                            <PostCommentRender/>:
                        undefined
                    */}
                    <PostCommentRender/>
                    <AlertDialogSlide open={open} handleClose={handleClose} postId={id}/>
                </ThemeProvider>
            </div>
        );
    }
}