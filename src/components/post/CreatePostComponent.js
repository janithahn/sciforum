import React from 'react';
import TextField from '@material-ui/core/TextField';
import { ThemeProvider, Typography, Grid, FormHelperText, Chip } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { theme, useStyles } from './styles/postsStyles';
//import Editor from './EditorComponent';
import MDEditor from './MDE';
import { useSelector, useDispatch } from 'react-redux';
import { postPost, fetchMyPosts } from '../../redux/ActionCreators';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'

const tagUrl = 'http://localhost:8000/tag_api/tags/';

function Tags({classes, value, setValue, tagList, setTagList}) {

  const handleKeyDown = (event) => {
    console.log(value);
    switch (event.key) {
      case "Enter":
      case ",":
      case " ": {
        event.preventDefault();
        event.stopPropagation();
        if(event.target.value.length > 0) {
          if(!value.includes(event.target.value)) setValue([...value, event.target.value]); else setValue([...value]);
          if(!tagList.includes(event.target.value)) setTagList([...tagList, event.target.value]);
        }
        break;
      }
      default:
    }
  };

  const handleRenderTags = (value, getTagProps) => {
    return value.map((option, index) => (
      <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" color="primary"/>
    ))
  };

  return(
    <div className={classes.tags}>
      <Autocomplete
        id="tags-filled"
        multiple
        freeSolo
        filterSelectedOptions
        value={value}
        options={tagList}
        renderTags={(value, getTagProps) => handleRenderTags(value, getTagProps)}
        onChange={(event, newValue) => setValue(newValue)}
        renderInput={(params) => {
          params.inputProps.onKeyDown = handleKeyDown;
          return <TextField {...params} variant="outlined" /*label="Tags"*/ placeholder="Tags"/>
        }}
        size="small"
      />
    </div>
  );
}

function fetchTags(tagList, setTagList) {
  axios.get(tagUrl)
  .then(tags => {
    const tempTags = [];
    tags.data.map(item => {
      tempTags.push(item.name);
    });
    setTagList(tempTags);
  })
  .catch(error => {
    console.log(error);
  });
}

export default function CreatePost(props) {
  const classes = useStyles();

  const [title, setTitle] = React.useState('');
  const [body, setQuestion] = React.useState('');

  const [tagList, setTagList] = React.useState([]);
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
        dispatch(postPost({owner: auth.currentUserId, title: values.title, body, tags: tagValue}));
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

  React.useEffect(() => {
    fetchTags(tagList, setTagList);
  }, []);

  return (
    <div className={classes.root}>
        <ThemeProvider theme={theme}>
          <Grid container direction="column" justify="center" spacing={2}>
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
                <MDEditor setText={setQuestion} data={body}/>
                <FormHelperText error={true}>{answerSubmitError}</FormHelperText>
              </Grid>
              <Grid item lg={8} sm xs={12}>
                <Tags 
                  classes={classes} 
                  value={tagValue} 
                  setValue={setTagValue} 
                  tagList={tagList} 
                  setTagList={setTagList}
                />
              </Grid>
              <Grid item lg={8} sm xs={12}>
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
        </ThemeProvider>
    </div>
  );
}