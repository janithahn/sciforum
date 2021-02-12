import React from 'react';
import TextField from '@material-ui/core/TextField';
import { ThemeProvider, Typography, Grid, FormHelperText, Hidden } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { theme, useStyles } from './styles/postsStyles';
//import Editor from './EditorComponent';
import MDEditor from './MDE';
import Tags from './tags';
import TopPosts from './TopPosts';
import QuestionLabels from './labels';
import { useSelector, useDispatch } from 'react-redux';
import { postPost } from '../../redux/ActionCreators';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function CreatePost({setSnackMessage, setSnackOpen}) {
  const classes = useStyles();

  const [title, setTitle] = React.useState('');
  const [body, setQuestion] = React.useState('');
  
  const [answerSubmitError, setAnswerSubmitError] = React.useState('');

  const history = useHistory();
  const auth = useSelector(state => state.Auth);

  const dispatch = useDispatch();

  const schema = Yup.object().shape({
    title: Yup.string()
      .min(2, 'Too Short!')
      .required('Required'),
    tags: Yup.array()
      .min(2, 'Please at least put 2 tags related to your question')
      .max(5, 'Not more than 5 tags')
      .required('Please at least put 2 tags related to your question'),
    label: Yup.array()
      .min(1, 'It is required to label your question')
      .required('It is required to label your question'),
  });

  const formik = useFormik({
    initialValues: {
      title: title,
      tags: [],
      label: [],
    },
    onSubmit: (values) => {
      setAnswerSubmitError('');
      if(body.length === 0) {
        setAnswerSubmitError("Question cannot be blank!");
      }else {
        setAnswerSubmitError("");
        dispatch(postPost({owner: auth.currentUserId, title: values.title, body, tags: values.tags, label: values.label[0].name}, setSnackMessage, setSnackOpen));
        history.push('/myposts');
      }
    },
    validationSchema: schema,
  });

  function handleCancel() {
    //history.push("/questions");
    history.goBack();
  }

  /*React.useEffect(() => {
    fetchTags(setTagList);
  }, []);*/

  return (
    <div className={classes.root}>
        <ThemeProvider theme={theme}>
          <Grid container direction="row" alignItems="flex-start" justify="space-between" spacing={2}>
            <Grid item lg={8} sm xs={12}>
              <Grid container direction="column" justify="center" spacing={2}>
                <form onSubmit={formik.handleSubmit}>
                  <Grid item>
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
                  <Grid item>
                    <Typography className={classes.typo} variant="h6" gutterBottom>
                      Question
                    </Typography>
                    <MDEditor setText={setQuestion} data={body}/>
                    <FormHelperText error={true}>{answerSubmitError}</FormHelperText>
                  </Grid>
                  <Grid item>
                    <QuestionLabels
                      value={formik.values.label}
                      setValue={formik.setFieldValue} 
                      error={formik.errors.label && formik.touched.label}
                      helperText={(formik.errors.label && formik.touched.label) && formik.errors.label}
                    />
                  </Grid>
                  <Grid item>
                    <Tags 
                      classes={classes} 
                      value={formik.values.tags}
                      error={formik.errors.tags && formik.touched.tags}
                      helperText={(formik.errors.tags && formik.touched.tags) && formik.errors.tags}
                      setFieldValue={formik.setFieldValue}
                    />
                  </Grid>
                  <Grid item>
                    <Grid container direction="row" justify="flex-end" spacing={2}>
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
            </Grid>

            <Grid item>
              <Hidden smDown>
                <TopPosts/>
              </Hidden>
            </Grid>
          </Grid>
        </ThemeProvider>
    </div>
  );
}