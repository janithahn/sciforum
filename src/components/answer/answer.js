import React from 'react';
import { CircularProgress, Grid, Typography, Divider, Avatar } from '@material-ui/core';
import { Preview } from './answerPreview';
import { fetchAnswers } from '../../redux/ActionCreators';
import { useDispatch, useSelector } from 'react-redux';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';

export default function Answer(props) {

    const answers = useSelector(state => state.Answers)

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

        const AnswersList = answers.answers.map((answer, key) => 
            <React.Fragment>
                <Grid item>
                    <Grid container direction="column" spacing={1}>
                        <Grid item>
                            <Grid container direction="row" justify="flex-start" alignItems="center" spacing={1}>
                                <Grid item>
                                    <Avatar alt={answer.ownerAvatar} src={answer.ownerAvatar} />
                                </Grid>
                                <Grid item>
                                    <Grid container direction="column" alignItems="flex-start" justify="flex-start" spacing={0}>
                                        <Grid item>
                                            <Typography style={{fontSize: 13}} variant="body2" color="textSecondary">
                                                <Link style={{textDecoration: 'none', fontSize: 14}} to={`/profile/${answer.ownerDisplayName}/`}>{answer.ownerDisplayName}</Link>
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography style={{fontSize: 13}} variant="body2" color="textSecondary">
                                                <TimeAgo live={false} date={answer.created_at} />
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Preview key={key} source={answer.answerContent}/>
                        </Grid>
                        <Grid item>
                            <Grid container justify="flex-end">
                                <Typography style={{fontSize: 13}} variant="body2" color="textSecondary">
                                    {"Updated "}<TimeAgo live={false} date={answer.updated_at} />
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Divider/>
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
        );

        //console.log(answers.answers.length);

        return(
            <React.Fragment>
                <Grid container direction="column" spacing={3}>
                    {answers.answers.length !== 0 ? 
                        <Grid item lg={8} sm xs={12}>
                            <Grid item>
                                <Typography variant="h6">Answers</Typography>
                            </Grid>
                            <Divider/>
                        </Grid>: 
                    undefined}
                    <Grid item lg={8} sm xs={12}>
                        <Grid container direction="column" spacing={4}>
                            {AnswersList}
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}