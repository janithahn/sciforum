import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import { deepPurple } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Recursive'
    },
    palette: {
      primary: deepPurple,
    },
  });

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

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
      <div>
        <ThemeProvider theme={theme}>
            <form onSubmit={handleSubmit}>
                <TextField
                id="title"
                label="Title"
                value={title}
                name="title"
                onInput={e => setTitle(e.target.value)}
                style={{ margin: 8 }}
                placeholder="Enter title here"
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
                />
                <TextField
                id="body"
                label="Question"
                value={body}
                name="body"
                onInput={e => setQuestion(e.target.value)}
                style={{ margin: 8 }}
                placeholder="Body of the question"
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
                />
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
    </div>
  );
}
