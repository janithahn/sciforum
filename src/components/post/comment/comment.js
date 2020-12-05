import React from 'react';
import { Grid, Divider, TextField, Avatar, makeStyles, Paper, InputBase, IconButton } from '@material-ui/core';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { useSelector } from 'react-redux';
import MarkdownPreview from '@uiw/react-markdown-preview';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
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

export function PostCommentInput({ currentUserProfileImg }) {

    const classes = useStyles();

    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );

    console.log(editorState);

    const editor = React.useRef(null);
    function focusEditor() {
        editor.current.focus();
    }

    return(
        <Grid className={classes.inputContainer} container direction="column" spacing={1}>
            <Grid item>
                <Divider/>
            </Grid>
            <Grid item> 
                <Paper component="form" className={classes.root} elevation={0} variant="outlined" onClick={focusEditor}>
                    <Avatar style={{height: 25, width: 25}} src={currentUserProfileImg} />
                    {/*<InputBase
                        //aria-setsize={2}
                        className={classes.input}
                        placeholder="comment"
                        inputProps={{ 'aria-label': 'post-comment-input' }}
                        fullWidth
                    />*/}
                    <div className={classes.input}>
                        <Editor ref={editor} editorState={editorState} onChange={setEditorState} placeholder="comment"/>
                    </div>
                </Paper>
            </Grid>
        </Grid>
    );
}

export function PostCommentRender() {
    const classes = useStyles();

    const postComments = useSelector(state => state.PostComments);

    const CommentsList = postComments.postComments.map(item => 
        <Grid item key={item.id}> 
            <Paper component="form" className={classes.root} elevation={0} variant="outlined">
                <Avatar style={{height: 25, width: 25}} src={item.ownerAvatar} />
                <div className={classes.input}>
                    <MarkdownPreview source={item.comment}/>
                </div>
            </Paper>
        </Grid>
    );

    console.log(postComments);

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