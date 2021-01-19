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

    const classes = useStyles();

    const answers = useSelector(state => state.Answers)
    const auth = useSelector(state => state.Auth);
    const answerVotesLoading = useSelector(state => state.answerVotes.status)
    const votesStatus = useSelector(state => (state.answerVotes.status === 'succeeded' && state.postVotes.status === 'succeeded'));

    const dispatch = useDispatch();

    //console.log(answers);

    const location = useLocation();
    const hash = location.hash.substring(1);

    const { postId } = useParams();

    React.useEffect(() => {
        if(answers.status === 'idle') dispatch(fetchAnswers(postId));
    }, [dispatch, answers.status, postId]);

    const [openModal, setOpenModal] = React.useState(false);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

    const [selectedAnswerContent, setSelectedAnswerContent] = React.useState('');
    const [selectedAnswerId, setSelectedAnswerId] = React.useState(null);
    const [selectedAnswerPostBelong, setSelectedAnswerPostBelong] = React.useState(null);

    let refs = answers.answers.reduce((acc, value) => {
        acc[value.id] = React.createRef();
        return acc;
    }, {});

    const scrollTo = React.useCallback((id) =>
        refs[id].current.scrollIntoView({
            //behavior: 'smooth',
            block: 'center',
    }), [refs]);

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
    }, [auth.isAuthenticated, refs, hash, scrollTo, votesStatus]);
    
    /*React.useEffect(() => {
        if(refs && refs[Number(hash)]) {
            scrollTo(Number(hash)); 
            refs[Number(hash)].current.style.animation = 'answer-background-fade 8s';
        }
    }, [refs, hash, scrollTo]);*/

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

    const AnswersList =  answers.answers.map((answer) => (
        <Grid item innerRef={refs[answer.id]} key={answer.id}> 
            <AnswerViewCard
                answer={answer} 
                handleModalOpen={handleModalOpen}
                handleDeleteModalOpen={handleDeleteModalOpen}
            />
        </Grid>
    ));

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
                        {answers.answers.length !== 0 ? 
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