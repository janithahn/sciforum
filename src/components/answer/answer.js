import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { Preview } from './answerPreview';
import { fetchAnswers } from '../../redux/ActionCreators';
import { useDispatch, useSelector } from 'react-redux';

export default function Answer(props) {

    const answers = useSelector(state => state.Answers)

    //console.log(answers);

    const [answerContent, setAnswerContent] = React.useState([]);

    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(fetchAnswers(props.postId));
    }, [dispatch]);

    if(answers.status === 'loading') {
        return(<CircularProgress color="secondary" size={15}/>);
    }else if(answers.status === 'failed') {
        //console.log(posts.errMess);
        return(<h4>Error loading...!</h4>);
    }else {

        const AnswersList = answers.answers.map((answer, key) => <Preview key={key} source={answer.answerContent}/>);

        console.log(AnswersList);

        return(
            <React.Fragment>
                {AnswersList}
            </React.Fragment>
        );
    }
}