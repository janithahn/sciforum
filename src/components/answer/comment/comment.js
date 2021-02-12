import React from 'react';
import { Grid, Divider, Avatar, makeStyles, Paper, Button, Typography, Tooltip, Link } from '@material-ui/core';
import { EditorState, convertFromRaw, convertToRaw, CompositeDecorator } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, { defaultSuggestionsFilter } from '@draft-js-plugins/mention';
import './plugin.css'
import { useSelector, useDispatch } from 'react-redux';
import { fetchAnswerComments, updateAnswerComments } from '../../../redux/ActionCreators';
import TimeAgo from 'react-timeago';
import VoteButtons from '../../vote/answerCommentVoteButtons';
import AlertDialogSlide from './alertComment';
import { useParams, useLocation } from 'react-router-dom';
import { fetchMentions } from './Mentions';
import _ from 'lodash';

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

export const AnswerCommentInput = React.memo(({ currentUserProfileImg, answerId, handleCommentSubmit, displayContent, editCommentId }) => {

    const classes = useStyles();

    const { postId } = useParams();

    const [content, setContent] = React.useState();
    const [text, setText] = React.useState('');
    const [editorState, setEditorState] = React.useState(
        displayContent ? displayContent: content ? () => EditorState.createWithContent(convertFromRaw(JSON.parse(content))): () => EditorState.createEmpty()
    );
    const [submitVal, setSubmitVal] = React.useState({});
    const [mentionedUsers, setMentionedUsers] = React.useState([]);

    const editor = React.useRef(null);
    function focusEditor() {
        editor.current.focus();
    }

    //mentions
    let mentions = [];
    const [open, setOpen] = React.useState(true);
    const [suggestions, setSuggestions] = React.useState(mentions);

    React.useEffect(() => {
        fetchMentions()
        .then((res) => {
            mentions = res;
            console.log(res)
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);

    const { MentionSuggestions, plugins } = React.useMemo(() => {
        const mentionPlugin = createMentionPlugin();
        const { MentionSuggestions } = mentionPlugin;
        const plugins = [mentionPlugin];
        return { plugins, MentionSuggestions };
    }, []);

    const onOpenChange = React.useCallback((_open) => {
        setOpen(_open);
    }, []);
    const onSearchChange = React.useCallback(({ value }) => {
        setSuggestions(defaultSuggestionsFilter(value, mentions));
    }, []);
    //end mentions

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
        setSubmitVal({
            answer: answerId,
            post: postId,
            owner: localStorage.getItem('currentUserId'),
            comment: content,
            answer_comment_mentions: mentionedUsers,
        });
        //mentions
        const entityMap = convertToRaw(contentState).entityMap;
        const tempMentionedUsers = [];
        for(const entity in entityMap) {
            if(entityMap[entity].type === "mention") {
                const userObj = {user: entityMap[entity].data.mention.id};
                tempMentionedUsers.push(userObj);
            }
        }
        setMentionedUsers(tempMentionedUsers);
    };
    console.log(mentionedUsers);

    const handleSubmit = (event) => {
        event.preventDefault();
        handleCommentSubmit({ submitVal, setEditorState, setSubmitVal, text, editCommentId });
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
                                <Editor plugins={plugins} ref={editor} editorState={editorState} onChange={onEditorChange} placeholder="comment"/>
                                <MentionSuggestions
                                    open={open}
                                    onOpenChange={onOpenChange}
                                    suggestions={suggestions}
                                    onSearchChange={onSearchChange}
                                    onAddMention={(elem) => {
                                        // get the mention object selected
                                        console.log(elem);
                                    }}
                                />
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item lg={1} sm={1} md={1} xs={1}>
                        <Button size="small" style={{textTransform: 'none'}} onClick={handleSubmit} color="primary">Add</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
});

export function AnswerCommentRender({ answerId }) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const auth = useSelector(state => state.Auth);
    const answerComments = useSelector(state => state.AnswerComments);
    const answerCommentVotes = useSelector(state => state.answerCommentVotes.status === 'succeeded');
    
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

    const [edit, setEdit] = React.useState(false);
    const [editCommentId, setEditCommentId] = React.useState();

    const [selectedCommentId, setSelectedCommentId] = React.useState(null);
    const [selectedCommentAnswerBelong, setSelectedCommentAnswerBelong] = React.useState(null);

    const { postId } = useParams();

    const handleDeleteModalOpen = (comment) => {
        setSelectedCommentId(comment.id);
        setSelectedCommentAnswerBelong(comment.answer);
        setOpenDeleteModal(true);
    };
    
    const handleDeleteModalClose = () => {
        setOpenDeleteModal(false);
    };

    React.useEffect(() => {
        if(answerComments.status === 'idle') dispatch(fetchAnswerComments(postId));
    }, [dispatch, answerComments, postId]);

    const handleEditComment = (comment) => {
        setEdit(true);
        setEditCommentId(comment.id);
    };

    const handleEditCommentSubmit = React.useCallback(({ submitVal, setEditorState, setSubmitVal, text, editCommentId }) => {
        if(text.length !== 0) {
            dispatch(updateAnswerComments(submitVal, editCommentId));
        }
        setEditorState(() => EditorState.createEmpty());
        setSubmitVal({});
        setEdit(false);
        setEditCommentId(undefined);
    }, [dispatch, postId]);

    //Scrolling function
    const location = useLocation();
    const hash = location.hash;

    let refs = answerComments.answerComments.reduce((acc, value) => {
        acc["#ac" + value.id] = React.createRef();
        return acc;
    }, {});

    const scrollTo = React.useCallback((id) =>
        refs[id].current.scrollIntoView({
            //behavior: 'smooth',
            block: 'center',
    }), [refs]);

    React.useEffect(() => {
        if(auth.isAuthenticated) {
            if(answerCommentVotes) {   
                if(refs && refs[hash] && refs[hash].current) {
                    scrollTo(hash); 
                    refs[hash].current.style.animation = 'answer-background-fade 8s';
                }
            }
        }else {
            if(refs && refs[hash] && refs[hash].current) {
                scrollTo(hash); 
                refs[hash].current.style.animation = 'answer-background-fade 8s';
            }
        }
    }, [auth.isAuthenticated, refs, hash, scrollTo, answerCommentVotes]);

    //mentions 
    //mention plugins and decorations
    const mentionPlugin = createMentionPlugin();
    const plugins = [mentionPlugin];
    const decorators = _.flattenDeep(plugins.map((plugin) => plugin.decorators));
    const decorator = new CompositeDecorator( decorators.filter((decorator, index) => index !== 1) );

    const [editorState, setEditorState] = React.useState(EditorState.createEmpty());   

    const onEditorChange = (editorState) => {
        setEditorState(editorState);
    };
      
    function AvatarTooltip(props) {
        const classes = useStyles();
        return <Tooltip arrow classes={classes} {...props} />;
    }

    function TooltipDetails({ username }) {
        return(
            <React.Fragment>
                <Link href={`/profile/${username}/`} underline="none" color="inherit">
                    <Typography color="inherit" variant="body2">{username}</Typography>
                </Link>
            </React.Fragment>
        );
    }

    const CommentsList = answerComments.answerComments.map(item => item.answer === answerId ?

        <Grid item key={item.id} innerRef={refs["#ac" + item.id]}>
            <Grid container direction="column">
                <Grid item>
                    {editCommentId !== item.id ?
                        <Paper component="form" className={classes.root} elevation={0} variant="outlined">
                            <AvatarTooltip title={<TooltipDetails username={item.ownerDisplayName}/>} disableFocusListener interactive>
                                <Avatar style={{height: 25, width: 25}} src={item.ownerAvatar} />
                            </AvatarTooltip>
                            <div className={classes.input}>
                                <Editor readOnly plugins={plugins} onChange={state => onEditorChange(state)} editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(item.comment)), decorator)}/>
                            </div>
                        </Paper>:
                        undefined
                    }
                    {edit &&  editCommentId === item.id? 
                        <AnswerCommentInput 
                            currentUserProfileImg={item.ownerAvatar} 
                            answerId={item.answer} 
                            displayContent={EditorState.createWithContent(convertFromRaw(JSON.parse(item.comment)))} 
                            handleCommentSubmit={handleEditCommentSubmit}
                            editCommentId={editCommentId}
                        />:
                        undefined
                    }
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
                        {auth.isAuthenticated && auth.currentUserId.toString() === item.owner.toString() && editCommentId !== item.id ? <Grid item>
                            <Button color="secondary" size="small" className={classes.deleteButton} onClick={() => handleEditComment(item)}>
                                <Typography variant="body2">
                                    {"Edit"}
                                </Typography>
                            </Button>
                        </Grid>: undefined}
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
    : undefined);

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
                {answerComments.answerComments.length !== 0 ? <Grid item>
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