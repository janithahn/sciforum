import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { ThemeProvider, createMuiTheme, CircularProgress } from '@material-ui/core';
import { deepPurple } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import NotFound from './NotFoundComponent';
import { useHistory } from 'react-router-dom';
import Editor from './EditorComponent';
import EditorDraft from './EditorDraftComponent';

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

  if(props.postLoading === 'loading') {
    return(<CircularProgress color="secondary" size={15}/>);
  }else if(props.postFailed) {
      return(<h4>Error loading!</h4>);
  } else {
    if(props.post !== undefined) {
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
          <EditorDraft body={body}/>
        </div>
      );
    }else {
      return(<NotFound/>);
    }
  }
}
