import React from 'react';
import TextField from '@material-ui/core/TextField';
import { ThemeProvider, Typography, Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import NotFound from '../alert/NotFoundComponent';
import { useHistory, useParams } from 'react-router-dom';
//import Editor from './EditorComponent';
//import EditorDraft from './EditorDraftComponent';
import { theme, useStyles } from './styles/postsStyles';
import { fetchPostDetail, editPost } from '../../redux/ActionCreators';
import { useDispatch, useSelector } from 'react-redux';
import MDEditor from './MDE';
import Tags from './tags';

export default function EditPost({setSnackMessage, setSnackOpen}) {
  const classes = useStyles();
  const history = useHistory();

  const dispatch = useDispatch();

  const post = useSelector(state => state.Post);

  const [title, setTitle] = React.useState(post.post ? post.post.title: '');
  const [body, setQuestion] = React.useState(post.post ? post.post.body: '');
  const [id, setId] = React.useState(post.post ? post.post.id: null);
  const [owner, setOwner] = React.useState(post.post ? post.post.owner: null);
  //let id = post.post ? post.post.id: null;
  //let owner = post.post ? post.post.owner: null;

  const [tagValue, setTagValue] = React.useState(post.post ? post.post.tags: []);

  const { postId } = useParams();

  console.log({title, body});

  const handlePostInfo = React.useCallback((postId, postOwner, title, body) => {
    setTitle(title);
    setQuestion(body);
    setId(postId);
    setOwner(postOwner);
  }, []);

  React.useEffect(() => {
    if(post.status === 'idle') {
        dispatch(fetchPostDetail(postId));
    }
  }, [post.status, dispatch, postId]);

  React.useEffect(() => {
    if(post.post) {
      handlePostInfo(post.post.id, post.post.owner, post.post.title, post.post.body);
    }
  }, [post, handlePostInfo]);

  function handleSubmit(event) {
    dispatch(editPost({
      id,
      owner,
      title,
      body,
      tags: tagValue,
    }, setSnackMessage, setSnackOpen));
    //dispatch(fetchPosts());
    history.push(`/questions/${id}/`);
  }

  function handleCancel() {
    history.push(`/questions/${id}/`);
  }

  if(post.status === 'loading' || post.status === 'idle') {
    //return(<CircularProgress color="secondary" size={15}/>);
    return(<div></div>);
  }else if(post.errMess) {
      return(<h4>Error loading!</h4>);
  } else {
    if(post.post !== undefined) {
      return (
        <div className={classes.root}>
            <ThemeProvider theme={theme}>
              <Grid container direction="column" justify="center">
                <form onSubmit={handleSubmit}>
                  <Grid item lg={8} sm xs={12}>
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
                  <Grid item lg={8} sm xs={12}>
                    <Typography className={classes.typo} variant="h6" gutterBottom>
                      Question
                    </Typography>
                    {/*<Editor setQuestion={(values) => setQuestion(values)} data={body}/>*/}
                    <MDEditor setText={setQuestion} data={body}/>
                  </Grid>
                  <Grid item lg={8} sm xs={12}>
                    <Tags 
                      classes={classes} 
                      value={tagValue} 
                      setValue={setTagValue}
                    />
                  </Grid>
                  <Grid item lg={8} sm xs={12}>
                    <Grid container justify="flex-end" alignItems="center" spacing={2}>
                      <Grid item>
                        <Button
                            type="submit"
                            color="primary"
                            className={classes.submit}
                            size="small"
                            variant="outlined"
                        >
                          Submit
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                            onClick={handleCancel}
                            color="secondary"
                            className={classes.submit}
                            size="small"
                            variant="outlined"
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
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
