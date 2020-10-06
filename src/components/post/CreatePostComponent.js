import React from 'react';
import TextField from '@material-ui/core/TextField';
import { ThemeProvider, Typography, Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { theme, useStyles } from './styles/postsStyles';
//import Editor from './EditorComponent';
import MDEditor from './MDE';
import { useSelector, useDispatch } from 'react-redux';
import { postPost } from '../../redux/ActionCreators';

export default function CreatePost(props) {
  const classes = useStyles();

  const [title, setTitle] = React.useState('');
  const [body, setQuestion] = React.useState('');

  const history = useHistory();
  const auth = useSelector(state => state.Auth);

  const dispatch = useDispatch();

  function handleSubmit(event) {
        dispatch(postPost({title, body, owner: auth.currentUserId}));
        history.push('/questions');
  }

  function handleCancel() {
    history.push("/questions");
  }

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
            </Grid>
            <Grid item>
              <Typography className={classes.typo} variant="h6" gutterBottom>
                Question
              </Typography>
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
}
