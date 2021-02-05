import React from 'react';
import TextField from '@material-ui/core/TextField';
import { ThemeProvider, Typography, Grid, FormHelperText } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import NotFound from '../alert/NotFoundComponent';
import { useHistory, useParams } from 'react-router-dom';
import { theme, useStyles } from './styles/postsStyles';
import { fetchPostDetail, editPost } from '../../redux/ActionCreators';
import { useDispatch, useSelector } from 'react-redux';
import MDEditor from './MDE';
import Tags from './tags';
import QuestionLabels from './labels';
import { labels } from './styles/labelStyles';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function EditPost({setSnackMessage, setSnackOpen}) {
  const classes = useStyles();
  const history = useHistory();

  const dispatch = useDispatch();

  const post = useSelector(state => state.Post);

  const [title, setTitle] = React.useState(post.post ? post.post.title: '');
  const [body, setQuestion] = React.useState(post.post ? post.post.body: '');
  const [id, setId] = React.useState(post.post ? post.post.id: null);
  const [owner, setOwner] = React.useState(post.post ? post.post.owner: null);

  const [tagValue, setTagValue] = React.useState(post.post ? post.post.tags: []);
  const [labelValue, setLabelValue] = React.useState(post.post ? labels.filter(l => l.name === post.post.label): []);
  
  const [answerSubmitError, setAnswerSubmitError] = React.useState('');

  const { postId } = useParams();

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

  function handleCancel() {
    history.push(`/questions/${id}/`);
  }

  const schema = Yup.object().shape({
    title: Yup.string()
      .min(2, 'Too Short!')
      .required('Required'),
    tags: Yup.array()
      .min(3, 'Please at least put 3 tags related to your question')
      .required('Please at least put 3 tags related to your question'),
    label: Yup.array()
      .min(1, 'It is required to label your question')
      .required('It is required to label your question'),
  });

  const formik = useFormik({
    initialValues: {
      title: title,
      tags: tagValue,
      label: labelValue,
    },
    onSubmit: (values) => {
      setAnswerSubmitError('');
      if(body.length === 0) {
        setAnswerSubmitError("Question cannot be blank!");
      }else {
        setAnswerSubmitError("");
        dispatch(editPost({id, owner, title: values.title, body, tags: values.tags, label: values.label[0].name}, setSnackMessage, setSnackOpen));
        history.push(`/questions/${id}/`);
      }
    },
    validationSchema: schema,
  });

  if(post.status === 'loading' || post.status === 'idle') {
    return(<div></div>);
  }else if(post.errMess) {
      return(<h4>Error loading!</h4>);
  } else {
    if(post.post !== undefined) {
      return (
        <div className={classes.root}>
            <ThemeProvider theme={theme}>
              <Grid container direction="column" justify="center">
                <form onSubmit={formik.handleSubmit}>
                  <Grid item lg={8} sm xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Title
                    </Typography>
                    <TextField
                      error={formik.errors.title && formik.touched.title}
                      helperText={(formik.errors.title && formik.touched.title) && formik.errors.title}
                      onChange={formik.handleChange}
                      //onBlur={formik.handleBlur}
                      className={classes.textField}
                      id="title"
                      value={formik.values.title}
                      placeholder='Question title'
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
                    <FormHelperText error={true}>{answerSubmitError}</FormHelperText>
                  </Grid>
                  <Grid item lg={8} sm xs={12}>
                    <QuestionLabels
                      value={formik.values.label}
                      setValue={formik.setFieldValue} 
                      error={formik.errors.label && formik.touched.label}
                      helperText={(formik.errors.label && formik.touched.label) && formik.errors.label}
                    />
                  </Grid>
                  <Grid item lg={8} sm xs={12}>
                    <Tags 
                      classes={classes} 
                      value={formik.values.tags}
                      error={formik.errors.tags && formik.touched.tags}
                      helperText={(formik.errors.tags && formik.touched.tags) && formik.errors.tags}
                      setFieldValue={formik.setFieldValue}
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
