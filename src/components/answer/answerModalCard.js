import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  ThemeProvider,
  FormHelperText,
} from '@material-ui/core';
import { theme, useStyles } from './styles/answerStyles';
import { useSelector, useDispatch } from 'react-redux';
import { postAnswer, updateAnswer } from '../../redux/ActionCreators';
import MDEditor from '../post/MDE';

export default function AnswerModalCard({answerContent, setAnswerContent, postId, answerId, handleModalClose, answerType}) {

  const classes = useStyles();
  const auth = useSelector(state => state.Auth);
  const dispatch = useDispatch();

  const [answerSubmitError, setAnswerSubmitError] = React.useState('');

  const handleSubmit = () => {
    if(answerContent.length > 0) {
        setAnswerSubmitError("");
        if(answerType === "create") dispatch(postAnswer(postId, auth.currentUserId, answerContent));
        if(answerType === "update") dispatch(updateAnswer(answerId, postId, answerContent));
        handleModalClose();
    }else {
        setAnswerSubmitError("Your answer cannot be blank!");
    }
    setAnswerContent('');
}

  return (
    <ThemeProvider theme={theme}>
        <Card>
            <CardHeader
                title="Drop your answer"
            />
            <Divider />
            <CardContent>
                <MDEditor data={answerContent} setText={setAnswerContent}/>
                <FormHelperText error={true}>{answerSubmitError}</FormHelperText>
            </CardContent>
            <Divider />
            <Box
                display="flex"
                justifyContent="flex-end"
                p={0}
            >
                <Button
                    onClick={() => handleModalClose()}
                    color="primary"
                    variant="contained"
                    className={classes.submit}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    variant="contained"
                    className={classes.submit}
                >
                    Submit
                </Button>
            </Box>
        </Card>
    </ThemeProvider>
  );
};
