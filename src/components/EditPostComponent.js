import React from 'react';
import TextField from '@material-ui/core/TextField';
import { ThemeProvider, CircularProgress, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import NotFound from './NotFoundComponent';
import { useHistory } from 'react-router-dom';
import Editor from './EditorComponent';
import EditorDraft from './EditorDraftComponent';
import { theme, useStyles } from '../styles/postsStyles';

export default function EditPost(props) {
  const classes = useStyles();
  const [title, setTitle] = React.useState(props.post === undefined ? '': props.post.title);
  const [body, setQuestion] = React.useState(props.post === undefined ? '': props.post.body);
  const id = props.post === undefined ? null: props.post.id;

  const history = useHistory();

  function handleSubmit(event) {
        props.editPost({id, title, body});
        history.push(`/questions/${id}/`);
        //alert("Title: " + event.target.elements.title.value + "\n" + "Question: " + body);
  }

  function handleCancel() {
    history.push(`/questions/${id}/`);
  }

  if(props.postLoading === 'loading') {
    return(<CircularProgress color="secondary" size={15}/>);
  }else if(props.postFailed) {
      return(<h4>Error loading!</h4>);
  } else {
    if(props.post !== undefined) {
      return (
        <div className={classes.root}>
            <ThemeProvider theme={theme}>
                <form onSubmit={handleSubmit}>
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
                    <Typography className={classes.typo} variant="h6" gutterBottom>
                      Question
                    </Typography>
                    <Editor setQuestion={setQuestion} data={body}/>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                    Submit
                  </Button>
                  <Button
                        onClick={handleCancel}
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                    Cancel
                  </Button>
                </form>
            </ThemeProvider>
        </div>
      );
    }else {
      return(<NotFound/>);
    }
  }
}
