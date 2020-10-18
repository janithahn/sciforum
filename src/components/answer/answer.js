import React from 'react';
import { ThemeProvider, CircularProgress, Grid, Typography, Divider, Avatar, Button, Modal, Backdrop, Fade } from '@material-ui/core';
import { Preview } from './answerPreview';
import { fetchAnswers } from '../../redux/ActionCreators';
import { useDispatch, useSelector } from 'react-redux';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import { useStyles, theme } from './styles/answerStyles';
import AnswerModalCard from './answerModalCard';
import AlertDialogSlide from './alert';

function AnswerEditModal({openModal, answerContent, setAnswerContent, handleModalClose, classes, answerId, postId, ...rest}) {
    return(
        <Modal {...rest}
            open={openModal} 
            className={classes.modal}
            onClose={handleModalClose}
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 300,
            }}
        >  
            <Fade in={openModal}>
                <AnswerModalCard 
                    answerContent={answerContent} 
                    setAnswerContent={setAnswerContent} 
                    answerId={answerId}
                    postId={postId} 
                    handleModalClose={handleModalClose}
                    answerType={"update"}
                />
            </Fade>
        </Modal>
    );
}

function AnswerViewCard({answer, key, handleModalOpen, handleDeleteModalOpen, isAuthenticated, currentUserId}) {

    //console.log(isAuthenticated, currentUserId, answer.owner);

    const classes = useStyles();

    return(
        <React.Fragment>
            <Grid item>
                <Grid container direction="column" spacing={1}>
                    <Grid item>
                        <Grid container direction="column" spacing={2}>
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
                                <Grid container justify="flex-end" alignItems="center" spacing={2}>
                                    <Grid item>
                                        <Grid container justify="center" alignItems="center" spacing={0}>
                                            <Grid item>
                                                {isAuthenticated && answer.owner == currentUserId ?
                                                <Grid item>
                                                    <Button color="primary" className={classes.editButton} onClick={() => handleModalOpen(answer)}>
                                                        <Typography className={classes.iconWrap} variant="body2">
                                                            {"Edit"}
                                                        </Typography>
                                                    </Button>
                                                </Grid>: 
                                                undefined}
                                            </Grid>
                                            <Grid item>
                                                {isAuthenticated && answer.owner == currentUserId ?
                                                <Grid item>
                                                    <Button color="secondary" className={classes.editButton} onClick={() => handleDeleteModalOpen(answer)}>
                                                        <Typography className={classes.iconWrap} variant="body2">
                                                            {"Delete"}
                                                        </Typography>
                                                    </Button>
                                                </Grid>: 
                                                undefined}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Typography style={{fontSize: 13}} variant="body2" color="textSecondary">
                                            {"Updated "}<TimeAgo live={false} date={answer.updated_at} />
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Divider/>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default function Answer(props) {

    const answers = useSelector(state => state.Answers)
    const auth = useSelector(state => state.Auth);

    const classes = useStyles();

    const [openModal, setOpenModal] = React.useState(false);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

    const [selectedAnswerContent, setSelectedAnswerContent] = React.useState('');
    const [selectedAnswerId, setSelectedAnswerId] = React.useState(null);
    const [selectedAnswerPostBelong, setSelectedAnswerPostBelong] = React.useState(null);

    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(fetchAnswers(props.postId));
    }, [dispatch]);

    const handleModalOpen = (answer) => {
        setSelectedAnswerContent(answer.answerContent);
        setSelectedAnswerId(answer.id);
        setSelectedAnswerPostBelong(answer.postBelong);
        setOpenModal(true);
    };
    
    const handleModalClose = () => {
        setOpenModal(false);
    };

    const handleDeleteModalOpen = (answer) => {
        setSelectedAnswerContent(answer.answerContent);
        setSelectedAnswerId(answer.id);
        setSelectedAnswerPostBelong(answer.postBelong);
        setOpenDeleteModal(true);
    };
    
    const handleDeleteModalClose = () => {
        setOpenDeleteModal(false);
    };

    if(answers.status === 'loading') {
        return(<CircularProgress color="secondary" size={15}/>);
    }else if(answers.status === 'failed') {
        //console.log(posts.errMess);
        return(<h4>Error loading...!</h4>);
    }else {

        const AnswersList = answers.answers.map((answer, key) => 
            <AnswerViewCard 
                answer={answer} 
                key={key} 
                handleModalOpen={handleModalOpen}
                handleDeleteModalOpen={handleDeleteModalOpen}
                isAuthenticated={auth.isAuthenticated}
                currentUserId={auth.currentUserId}
            />
        );

        return(
            <React.Fragment>
                <ThemeProvider theme={theme}>
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
                    <AnswerEditModal
                        classes={classes}
                        openModal={openModal}
                        answerContent={selectedAnswerContent}
                        setAnswerContent={setSelectedAnswerContent}
                        handleModalClose={handleModalClose}
                        answerId={selectedAnswerId}
                        postId={selectedAnswerPostBelong}
                    />
                    <AlertDialogSlide openDeleteModal={openDeleteModal} handleDeleteModalClose={handleDeleteModalClose} answerId={selectedAnswerId} postBelong={selectedAnswerPostBelong}/>
                </ThemeProvider>
            </React.Fragment>
        );
    }
}