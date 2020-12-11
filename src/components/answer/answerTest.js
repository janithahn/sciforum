import React from 'react';
import { Grid, Divider, Avatar, makeStyles, Paper, Button, Typography, TextField } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchAnswers, postAnswer } from '../../redux/ActionCreators';
import { Editor, EditorState, convertFromRaw, convertToRaw } from 'draft-js';
//import { createSelectItemById } from '../../redux/selectors/answerSelectors';
import { createSelector } from 'reselect';

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
}));

function areEqual(prevProps, nextProps) {
    //return prevProps.contacts === nextProps.contacts;
    console.log(prevProps);
    console.log(nextProps);
}

export function PostAnswerInput({ currentUserProfileImg, postId }) {

    const classes = useStyles();
    const dispatch = useDispatch();

    const [content, setContent] = React.useState();
    const [text, setText] = React.useState('');
    const [editorState, setEditorState] = React.useState(
        content ? () => EditorState.createWithContent(convertFromRaw(JSON.parse(content))): () => EditorState.createEmpty()
    );
    const submitVal = {
        postBelong: postId,
        owner: localStorage.getItem('currentUserId'),
        answerContent: content,
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

    const handleAnswersubmit = () => {
        if(text.length !== 0) {
            dispatch(postAnswer(4, localStorage.getItem('currentUserId'), 'test'));
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
                        <Button size="small" style={{textTransform: 'none'}} onClick={handleAnswersubmit} color="primary">Add</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

const Item = React.memo(function Item({ item }) {
    const rendered = React.useRef(0);
    rendered.current++;
    return (
      <li>
        rendered:{rendered.current} times, item:{' '}
        {JSON.stringify(item)}
      </li>
    );
});

/*const ItemContainer = ({ id }) => {
    const selectItem = React.useMemo(
      () => createSelectItemById(id),
      [id]
    );
    const item = useSelector(selectItem);
    return <Item item={item} />;
};

const ItemList = () => {
    const items = useSelector(state => state.Answers);
    return (
      <ul>
        {items.map(({ id }) => (
          <ItemContainer key={id} id={id} />
        ))}
      </ul>
    );
  };*/

export function Answer() {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { postId } = useParams();

    const postAnswers = useSelector(state => state.Answers);

    const [answers, setAnswers] = React.useState(postAnswers.answers ? postAnswers.answers: []);

    React.useEffect(() => {
        if(postAnswers.status === 'idle') dispatch(fetchAnswers(postId));
    }, [dispatch]);

    React.useEffect(() => {
        if(postAnswers.answers) handleAnswers(postAnswers.answers);
    }, [postAnswers]);

    const handleAnswers = (answers) => {
        setAnswers(answers);
    };

    const selectItems = (state) => state.Answers.answers;

    const selectItemById = createSelector(
        [selectItems, (_, id) => id],
        (items, id) => items.find((item) => item.id === id)
    );

    const createSelectItemAsJSON = (id) =>
    createSelector(
        [(state) => selectItemById(state, id)],
        //return the item as primitive (string)
        (item) => JSON.stringify(item)
    );

    const createSelectItemById = (id) =>
    createSelector(
        [createSelectItemAsJSON(id)],
        //return the json item as object
        (item) => JSON.parse(item ? item: null)
    );

    const ItemContainer = ({ id }) => {
        const selectItem = React.useMemo(
          () => createSelectItemById(id),
          [id]
        );
        const item = useSelector(selectItem);
        return <Item item={item} />;
    };

    const AList = () => {
        return (
          <ul>
            {answers.map(({ id }) => (
              <ItemContainer key={id} id={id} />
            ))}
          </ul>
        );
      };

    const AnswersList = answers ? answers.map(item => {

        const displayContent = item.answerContent;

        return(
            <Grid item key={item.id}> 
                <Grid container direction="column" key={item.id}>
                    <Grid item key={item.id}>
                        <Paper key={item.id} component="form" className={classes.root} elevation={0} variant="outlined" >
                            <div className={classes.input} key={item.id}>
                                <Typography key={item.id}>{displayContent}</Typography>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
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
                    <AList/>
                </Grid>
            </Grid>
            <Grid item>
                <Divider/>
            </Grid>
        </Grid>
    );
}