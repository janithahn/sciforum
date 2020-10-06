import React from 'react';
import TextField from '@material-ui/core/TextField';
import { ThemeProvider, CircularProgress, Typography, Grid, Divider } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import NotFound from '../alert/NotFoundComponent';
import { useHistory, Redirect, useParams } from 'react-router-dom';
import Editor from './EditorComponent';
//import EditorDraft from './EditorDraftComponent';
import { theme, useStyles } from './styles/postsStyles';
import { fetchPostDetail, editPost } from '../../redux/ActionCreators';
import { useDispatch, useSelector } from 'react-redux';
import MDEditor from './MDE';

export default function EditPost(props) {
  const classes = useStyles();
  const history = useHistory();

  const dispatch = useDispatch();

  const post = useSelector(state => state.Post);

  const [title, setTitle] = React.useState(post.post ? post.post.title: '');
  const [body, setQuestion] = React.useState(post.post ? post.post.body: '');
  const id = post.post ? post.post.id: null;
  const owner = post.post ? post.post.owner: null;
  const viewCount = post.post ? post.post.viewCount: null;

  const {postId} = useParams();

  console.log({title, body});

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
      setTitle(title);
      setQuestion(body);
      id = id;
      owner = owner;
      viewCount = viewCount;
  }

  function handleSubmit(event) {
    dispatch(editPost({
      id,
      owner,
      title,
      body,
    }));
    //dispatch(fetchPosts());
    history.push(`/questions/${id}/`);
  }

  function handleCancel() {
    history.push(`/questions/${id}/`);
  }

  if(post.status === 'loading' || post.status === 'idle') {
    return(<CircularProgress color="secondary" size={15}/>);
  }else if(post.errMess) {
      return(<h4>Error loading!</h4>);
  } else {
    if(post.post !== undefined) {
      return (
        <div className={classes.root}>
            <ThemeProvider theme={theme}>
              <Grid container lg={8} sm xs={12} direction="column" justify="center">
                <form onSubmit={handleSubmit}>
                  <Grid item>
                    <Typography variant="h6" gutterBottom>
                      Title
                    </Typography>
                    <TextField
                      className={classes.textField}
                      id="title"
                      value={title}
                      name="title"
                      onInput={e => setTitle(e.target.value)}
                      margin="none"
                      size="small"
                      InputLabelProps={{
                          shrink: true,
                      }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item>
                    <Typography className={classes.typo} variant="h6" gutterBottom>
                      Question
                    </Typography>
                    {/*<Editor setQuestion={(values) => setQuestion(values)} data={body}/>*/}
                    <MDEditor setQuestion={setQuestion} data={body}/>
                  </Grid>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        size="small"
                        variant="outlined"
                    >
                    Submit
                  </Button>
                  <Button
                        onClick={handleCancel}
                        variant="contained"
                        color="secondary"
                        className={classes.submit}
                        size="small"
                        variant="outlined"
                    >
                    Cancel
                  </Button>
                </form>
              </Grid>
            </ThemeProvider>
        </div>
      );
    }else {
      return(<NotFound/>);
    }
  }
}