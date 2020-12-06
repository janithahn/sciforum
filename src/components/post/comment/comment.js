import React from 'react';
import { Grid, Divider, TextField, Avatar, makeStyles, Paper, InputBase, IconButton, FormHelperText } from '@material-ui/core';
import { Publish } from '@material-ui/icons';
import { Editor, EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createPostComments, fetchPostComments } from '../../../redux/ActionCreators';

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
        fontSize: 14,
    },
    inputContainer: {
        marginBottom: 4,
    },
}));

export function PostCommentInput({ currentUserProfileImg, postId }) {

    const classes = useStyles();
    const dispatch = useDispatch();

    const [content, setContent] = React.useState();
    const [text, setText] = React.useState('');
    const [editorState, setEditorState] = React.useState(
        content ? () => EditorState.createWithContent(convertFromRaw(JSON.parse(content))): () => EditorState.createEmpty()
    );
    const submitVal = {
        post: postId,
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
            dispatch(createPostComments(submitVal, postId));
        }
        setEditorState(() => EditorState.createEmpty());
    };

    return(
        <Grid className={classes.inputContainer} container direction="column" spacing={1}>
            <Grid item>
                <Divider/>
            </Grid>
            <Grid item> 
                <Grid container directin="row" justify="space-evenly" alignItems="center" spacing={1}>
                    <Grid item lg={11} sm={11} md={11} xs={11}> 
                        <Paper component="form" className={classes.root} elevation={0} variant="outlined" onClick={focusEditor}>
                            <Avatar style={{height: 25, width: 25}} src={currentUserProfileImg} />
                            <div className={classes.input}>
                                <Editor ref={editor} editorState={editorState} onChange={onEditorChange} placeholder="comment"/>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item lg={1} sm={1} md={1} xs={1}>
                        <IconButton size="small" onClick={handleCommentSubmit}><Publish/></IconButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export function PostCommentRender() {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { postId } = useParams();

    const postComments = useSelector(state => state.PostComments);

    const [comments, setComments] = React.useState(postComments.postComments ? postComments.postComments: []);

    React.useEffect(() => {
        if(postComments.status === 'idle') dispatch(fetchPostComments(postId));
    }, [dispatch]);

    React.useEffect(() => {
        if(postComments.postComments) handleComments(postComments.postComments);
    }, [postComments]);

    const handleComments = (comments) => {
        setComments(comments);
    };

    const CommentsList = comments && comments !== [] ? comments.map(item => {

        const displayContent = EditorState.createWithContent(convertFromRaw(JSON.parse(item.comment)));

        return(
            <Grid item key={item.id}> 
                <Paper component="form" className={classes.root} elevation={0} variant="outlined">
                    <Avatar style={{height: 25, width: 25}} src={item.ownerAvatar} />
                    <div className={classes.input}>
                        <Editor readOnly editorState={displayContent}/>
                    </div>
                </Paper>
            </Grid>
        );
    }): undefined;

    return(
        <Grid container direction="column" spacing={2}>
            <Grid item>
                <Divider/>
            </Grid>
            <Grid item> 
                <Grid container direction="column" alignItems="flex-start" justify="center" spacing={2}>
                    {CommentsList}
                </Grid>
            </Grid>
            <Grid item>
                <Divider/>
            </Grid>
        </Grid>
    );
}