import React from 'react';
import { ThemeProvider, Grid, Typography, Divider, Modal, Backdrop, Fade } from '@material-ui/core';
import { fetchAnswers } from '../../redux/ActionCreators';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { useStyles, theme } from './styles/answerStyles';
import AnswerModalCard from './answerModalCard';
import AlertDialogSlide from './alert';
import AnswerViewCard from './answerViewCard';
import AnswerSkel from './skeletons/answer';

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

export default function Answer() {

    const answers = useSelector(state => state.Answers)
    const auth = useSelector(state => state.Auth);
    const answerVotesLoading = useSelector(state => state.answerVotes.status)

    const votesStatus = useSelector(state => (state.answerVotes.status === 'succeeded' && state.postVotes.status === 'succeeded'));

    const [answersCompList, setAnswersCompList] = React.useState(answers.answers ? answers.answers: []);

    const handleAnswersCompList = (answers) => {
        setAnswersCompList(answers);
    };

    React.useEffect(() => {
        if(answers.answers) handleAnswersCompList(answers.answers);
    }, [answers]);

    const classes = useStyles();
    const location = useLocation();

    const { postId } = useParams();

    const hash = location.hash.substring(1);

    const [openModal, setOpenModal] = React.useState(false);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

    const [selectedAnswerContent, setSelectedAnswerContent] = React.useState('');
    const [selectedAnswerId, setSelectedAnswerId] = React.useState(null);
    const [selectedAnswerPostBelong, setSelectedAnswerPostBelong] = React.useState(null);

    const dispatch = useDispatch();

    let refs = null;

    if(answers.status === 'succeeded') {
        refs = answers.answers.reduce((acc, value) => {
            acc[value.id] = React.createRef();
            return acc;
        }, {});
    }

    const scrollTo = (id) =>
    refs[id].current.scrollIntoView({
        //behavior: 'smooth',
        block: 'center',
    });

    React.useEffect(() => {
        if(answers.status === 'idle') dispatch(fetchAnswers(postId));
    }, [dispatch]);

    React.useEffect(() => {
        if(auth.isAuthenticated) {
            if(votesStatus) {   
                if(refs && refs[Number(hash)]) {
                    scrollTo(Number(hash)); 
                    refs[Number(hash)].current.style.animation = 'answer-background-fade 8s';
                }
            }
        }else {
            if(refs && refs[Number(hash)]) {
                scrollTo(Number(hash)); 
                refs[Number(hash)].current.style.animation = 'answer-background-fade 8s';
            }
        }
    }, []);

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

    const AnswersList = answersCompList && answersCompList !== [] ? answersCompList.map((answer) =>
        <Grid item innerRef={refs[answer.id]} key={answer.id}> 
            <AnswerViewCard 
                answer={answer} 
                handleModalOpen={handleModalOpen}
                handleDeleteModalOpen={handleDeleteModalOpen}
                isAuthenticated={auth.isAuthenticated}
                currentUserId={auth.currentUserId}
            />
        </Grid>
    ): undefined;

    if(answers.status === 'loading' || answerVotesLoading === 'loading') {
        return(
            <div>
                <AnswerSkel/>
                <AnswerSkel/>
            </div>
        );
    }else if(answers.status === 'failed') {
        return(<h4>Error loading...!</h4>);
    }else {

        return(
            <div className={classes.root}>
                <ThemeProvider theme={theme}>
                    <Grid container direction="column" spacing={3}>
                        {answersCompList.length !== 0 ? 
                            <Grid item>
                                <Grid item>
                                    <Typography variant="h6">Answers</Typography>
                                </Grid>
                                <Divider/>
                            </Grid>: 
                        undefined}
                        <Grid item>
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
                    <AlertDialogSlide 
                        openDeleteModal={openDeleteModal} 
                        handleDeleteModalClose={handleDeleteModalClose} 
                        answerId={selectedAnswerId} 
                        postBelong={selectedAnswerPostBelong}
                    />
                </ThemeProvider>
            </div>
        );
    }
}