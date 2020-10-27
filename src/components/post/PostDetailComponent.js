import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button, ThemeProvider, Grid, Modal, Backdrop, Fade } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AlertDialogSlide from './AlertComponent';
import NotFound from '../alert/NotFoundComponent';
//import PostViewer from './PostViewerComponent';
import { theme, useStyles } from './styles/postsStyles';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchPostDetail, fetchPostVotesByLoggedInUser } from '../../redux/ActionCreators';
import AnswerModalCard from '../answer/answerModalCard';
import VoteButtons from '../vote/postVoteButtons';
import RenderCard from './RenderCard';

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

    const dispatch = useDispatch();

    const {postId} = useParams(); //another way of approaching for getting the postId from the url other than match.params

    const [open, setOpen] = React.useState(false);

    const [openModal, setOpenModal] = React.useState(false);
    const [answerContent, setAnswerContent] = React.useState('');

    const [postInfo, setPostInfo] = React.useState({
        title: post.post ? post.post.title: null,
        body: post.post ? post.post.body: null,
    });
    const id = post.post ? post.post.id: null;
    const owner = post.post ? post.post.owner: null;
    const viewCount = post.post ? post.post.viewCount: null;
    const created_at = post.post ? post.post.created_at: null;
    const updated_at = post.post ? post.post.updated_at: null;
    
    const postVotes = useSelector(state => state.postVotes);

    console.log(postVotes);

    const [currentUserVote, setCurrentUserVote] = React.useState({
        type: '',
        post: null,
    });

    React.useEffect(() => {
        if(auth.isAuthenticated) {
            console.log(auth);
            if(id) dispatch(fetchPostVotesByLoggedInUser(auth.currentUserId, id));
        }
    }, [dispatch, auth, id]);

    React.useEffect(() => {
        if(postVotes.votes.length !== 0) setCurrentUserVote({type: postVotes.votes[0].voteType, post: postVotes.votes[0].post});
    }, [postVotes.votes]);

    React.useEffect(() => {
        if(post.status === 'idle') {
            dispatch(fetchPostDetail(postId));
        }
    }, [post, dispatch]);
    
    React.useEffect(() => {
        if(post.post) {
            handlePostInfo(post.post.id, post.post.owner, post.post.title, post.post.body, post.post.viewCount, post.post.created_at, post.post.updated_at);
        }
    }, [post]);

    const handlePostInfo = (id, owner, title, body, viewCount, created_at, updated_at) => {
        setPostInfo({
            title,
            body,
        });
        id = id;
        owner = owner;
        viewCount = viewCount;
        created_at = created_at;
        updated_at = updated_at;
    }

    //console.log(answerContent);

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

    if(post.status === 'loading' || post.status === 'idle') {
        return(<CircularProgress color="secondary" size={15}/>);
    }else if(post.errMess) {
        return(<h4>Error loading...!</h4>);
    } else {
        if(post !== undefined) {
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
                        <React.Fragment>
                            <Grid container justify="space-between" alignItems="center" spacing={0}>
                                <Grid item>
                                    <Grid container justify="center" alignItems="center" spacing={0}>
                                        <VoteButtons 
                                            postId={id} 
                                            isAuthenticated={auth.isAuthenticated} 
                                            currentUserId={auth.currentUserId}
                                            currentUserVote={currentUserVote}
                                        />
                                    </Grid>
                                </Grid>
                                {auth.isAuthenticated && auth.currentUser == owner ?
                                    <Grid item>
                                        <Grid container justify="center" alignItems="center" spacing={0}>
                                            <Grid item>
                                                <Link to={`/posts/${postId}/edit/`} style={{textDecoration: 'none'}}>
                                                    <Button
                                                        className={classes.submit}
                                                        color="primary"
                                                        size="small"
                                                    >
                                                    Edit
                                                    </Button>
                                                </Link>
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
                            <AlertDialogSlide open={open} handleClose={handleClose} postId={id}/>
                        </React.Fragment>
                    </ThemeProvider>
                </div>
            );
        }else {
            return(<NotFound/>);
        }
    }
}