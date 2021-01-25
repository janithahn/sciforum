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
import { useSelector, useDispatch } from 'react-redux';
import { postPost } from '../../redux/ActionCreators';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function CreatePost({setSnackMessage, setSnackOpen}) {
  const classes = useStyles();

  const [title, setTitle] = React.useState('');
  const [body, setQuestion] = React.useState('');

  //const [tagList, setTagList] = React.useState([]);
  const [tagValue, setTagValue] = React.useState([]);
  
  const [answerSubmitError, setAnswerSubmitError] = React.useState('');

  const history = useHistory();
  const auth = useSelector(state => state.Auth);

  const dispatch = useDispatch();

  const profileSchema = Yup.object().shape({
    title: Yup.string()
      .min(2, 'Too Short!')
      .required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      title: title,
    },
    onSubmit: (values) => {
      if(body.length === 0) {
        setAnswerSubmitError("Question cannot be blank!");
      }else {
        setAnswerSubmitError("");
        dispatch(postPost({owner: auth.currentUserId, title: values.title, body, tags: tagValue}, setSnackMessage, setSnackOpen));
        history.push('/myposts');
        //history.goBack();
      }
    },
    validationSchema: profileSchema,
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
                    <Tags 
                      classes={classes} 
                      value={tagValue} 
                      setValue={setTagValue} 
                      //tagList={tagList} 
                      //setTagList={setTagList}
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