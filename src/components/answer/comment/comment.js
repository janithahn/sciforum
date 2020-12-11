import React from 'react';
import { Grid, Divider, Avatar, makeStyles, Paper, Button, Typography } from '@material-ui/core';
import { Editor, EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { useSelector, useDispatch } from 'react-redux';
import { createAnswerComments, fetchAnswerComments, fetchAnswerCommentsDirect } from '../../../redux/ActionCreators';
import TimeAgo from 'react-timeago';
import VoteButtons from '../../vote/answerCommentVoteButtons';
import AlertDialogSlide from './alertComment';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: "100%",
        
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        fontSize: 10,
    },
    inputContainer: {
        marginBottom: 4,
    },
    deleteButton: {
        textTransform: 'none',
        padding: 0,
        margin: 0,
    },
}));

export function AnswerCommentInput({ currentUserProfileImg, answerId }) {

    const classes = useStyles();
    const dispatch = useDispatch();

    const [content, setContent] = React.useState();
    const [text, setText] = React.useState('');
    const [editorState, setEditorState] = React.useState(
        content ? () => EditorState.createWithContent(convertFromRaw(JSON.parse(content))): () => EditorState.createEmpty()
    );
    const submitVal = {
        answer: answerId,
        owner: localStorage.getItem('currentUserId'),
        comment: content,
    };

    const editor = React.useRef(null);
    function focusEditor() {
        editor.current.focus();
    }

    const saveContent = (content) => {
        setContent(JSON.stringify(convertToRaw(content)));
    };

    const onEditorChange = (editorState) => {
        const contentState = editorState.getCurrentContent();
        const blocks = convertToRaw(contentState).blocks;
        const text = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
        setText(text.trim());
        saveContent(contentState);
        setEditorState(editorState);
    };

    const handleCommentSubmit = () => {
        if(text.length !== 0) {
            dispatch(createAnswerComments(submitVal, answerId));
        }
        setEditorState(() => EditorState.createEmpty());
    };

    return(
        <Grid className={classes.inputContainer} container direction="column" spacing={1}>
            <Grid item>
                <Divider/>
            </Grid>
            <Grid item> 
                <Grid container directin="row" justify="space-between" alignItems="center" spacing={0}>
                    <Grid item lg={11} sm={11} md={11} xs={11}> 
                        <Paper component="form" className={classes.root} elevation={0} variant="outlined" onClick={focusEditor}>
                            <Avatar style={{height: 25, width: 25}} src={currentUserProfileImg} />
                            <div className={classes.input}>
                                <Editor ref={editor} editorState={editorState} onChange={onEditorChange} placeholder="comment"/>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item lg={1} sm={1} md={1} xs={1}>
                        <Button size="small" style={{textTransform: 'none'}} onClick={handleCommentSubmit} color="primary">Add</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export function AnswerCommentRender({ answerId }) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const auth = useSelector(state => state.Auth);
    const answerComments = useSelector(state => state.AnswerComments);

    console.log(answerComments);

    const [comments, setComments] = React.useState(answerComments.answerComments ? answerComments.answerComments: []);

    React.useEffect(() => {
        if(answerComments.status === 'idle') dispatch(fetchAnswerComments(answerId));
    }, [dispatch]);

    React.useEffect(() => {
        if(answerComments.answerComments) handleComments(answerComments.answerComments);
    }, [answerComments]);

    const handleComments = (comments) => {
        setComments(comments);
    };
    
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

    const [selectedCommentId, setSelectedCommentId] = React.useState(null);
    const [selectedCommentAnswerBelong, setSelectedCommentAnswerBelong] = React.useState(null);

    const handleDeleteModalOpen = (comment) => {
        setSelectedCommentId(comment.id);
        setSelectedCommentAnswerBelong(comment.answer);
        setOpenDeleteModal(true);
    };
    
    const handleDeleteModalClose = () => {
        setOpenDeleteModal(false);
    };

    const CommentsList = comments && comments !== [] ? comments.map((arr, index) => arr.map(item => {

        const displayContent = EditorState.createWithContent(convertFromRaw(JSON.parse(item.comment)));

        return(
            <Grid item key={item.id}> 
                <Grid container direction="column">
                    <Grid item>
                        <Paper component="form" className={classes.root} elevation={0} variant="outlined">
                            <Avatar style={{height: 25, width: 25}} src={item.ownerAvatar} />
                            <div className={classes.input}>
                                <Editor readOnly editorState={displayContent}/>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Grid container direction="row" alignItems="center" justify="flex-end" spacing={1}>
                            <Grid item>
                                <Typography style={{fontSize: 13}} variant="body2" color="textSecondary">
                                    <TimeAgo live={false} date={item.updated_at}/>
                                </Typography>
                            </Grid>
                            <Grid item>
                                <VoteButtons commentId={item.id} likes={item.likes} dislikes={item.dislikes}/>
                            </Grid>
                            {auth.isAuthenticated && auth.currentUserId.toString() === item.owner.toString() ? <Grid item>
                                <Button color="secondary" size="small" className={classes.deleteButton} onClick={() => handleDeleteModalOpen(item)}>
                                    <Typography variant="body2">
                                        {"Delete"}
                                    </Typography>
                                </Button>
                            </Grid>: undefined}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    })): undefined;

    return(
        <React.Fragment>
            <Grid container direction="column" spacing={2}>
                <Grid item>
                    <Divider/>
                </Grid>
                <Grid item> 
                    <Grid container direction="column" alignItems="flex-start" justify="center" spacing={2}>
                        {CommentsList}
                    </Grid>
                </Grid>
                {comments.length !== 0 ? <Grid item>
                    <Divider/>
                </Grid>: undefined}
            </Grid>
            <AlertDialogSlide
                openDeleteModal={openDeleteModal} 
                handleDeleteModalClose={handleDeleteModalClose} 
                commentId={selectedCommentId} 
                answerBelong={selectedCommentAnswerBelong} 
            />
        </React.Fragment>
    );
}