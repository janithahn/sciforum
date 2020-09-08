import React from 'react';
import TextField from '@material-ui/core/TextField';
import { ThemeProvider, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { theme, useStyles } from '../styles/postsStyles';
import Editor from './EditorComponent';

export default function CreatePost(props) {
  const classes = useStyles();

  const [title, setTitle] = React.useState('');
  const [body, setQuestion] = React.useState('');

  const history = useHistory();

  function handleSubmit(event) {
        //event.preventDefault();
        props.postPost({title, body});
        history.push('/questions');
        //alert("Title: " + event.target.elements.title.value + "\n" + "Question: " + body);
  }

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
                placeholder='Enter question title here'
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
            </form>
        </ThemeProvider>
    </div>
  );
}
