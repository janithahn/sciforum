import React from 'react';
import { ThemeProvider, CircularProgress, Grid, Typography, Divider, Modal, Backdrop, Fade, Button } from '@material-ui/core';
import { fetchAnswers } from '../../redux/ActionCreators';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles, theme } from './styles/answerStyles';
import AnswerModalCard from './answerModalCard';
import AlertDialogSlide from './alert';
import AnswerViewCard from './answerViewCard';
import { useLocation } from 'react-router';

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

export default function Answer({postId, refs}) {

    const answers = useSelector(state => state.Answers)
    const auth = useSelector(state => state.Auth);
    const location = useLocation();

    const classes = useStyles();

    const [openModal, setOpenModal] = React.useState(false);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

    const [selectedAnswerContent, setSelectedAnswerContent] = React.useState('');
    const [selectedAnswerId, setSelectedAnswerId] = React.useState(null);
    const [selectedAnswerPostBelong, setSelectedAnswerPostBelong] = React.useState(null);
    
    const hash = location.hash.substring(1);

    const dispatch = useDispatch();

    React.useEffect(() => {
        if(answers.status === 'idle') {
            dispatch(fetchAnswers(postId));
        }
    }, [answers, dispatch]);

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
        return(<h4>Error loading...!</h4>);
    }else {

        const AnswersList = answers.answers.map((answer, key) =>
            <Grid item innerRef={refs[answer.id]} key={key}> 
                <AnswerViewCard 
                    answer={answer} 
                    handleModalOpen={handleModalOpen}
                    handleDeleteModalOpen={handleDeleteModalOpen}
                    isAuthenticated={auth.isAuthenticated}
                    currentUserId={auth.currentUserId}
                />
            </Grid>
        );

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