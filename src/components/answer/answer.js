import React from 'react';
import { ThemeProvider, Grid, Typography, Divider, Modal, Backdrop, Fade, 
    Tooltip, IconButton, Popper, Grow, Paper, ClickAwayListener, MenuItem, MenuList } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { FilterList } from '@material-ui/icons';
import { fetchAnswers, fetchAnswersForPagination, resetAnswerChangeStatus } from '../../redux/ActionCreators';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams, useHistory } from 'react-router-dom';
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

const Answer = () => {

    const classes = useStyles();

    const answers = useSelector(state => state.Answers);
    const auth = useSelector(state => state.Auth);
    const answerVotesLoading = useSelector(state => state.answerVotes.status)
    const votesStatus = useSelector(state => (state.answerVotes.status === 'succeeded' && state.postVotes.status === 'succeeded'));

    const dispatch = useDispatch();

    const location = useLocation();
    const { push } = useHistory();
    const hash = location.hash.substring(1);

    const { postId, answerId } = useParams();

    //get the answer page number
    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }
    let answerPageNum = useQuery().get('page');

    React.useEffect(() => {
        if(answers.status === 'idle') {
            if(answerPageNum)
                dispatch(fetchAnswersForPagination(postId, "-vote_count", answerPageNum));
            else
                dispatch(fetchAnswers(postId, "-vote_count", answerId));
        }
    }, [dispatch, answers.status, postId]);

    React.useEffect(() => {
        if(answers.changedAnswer) {
            dispatch(fetchAnswers(postId, "-vote_count", answers.changedAnswer));
            push(`/questions/${postId}/${answers.changedAnswer}#${answers.changedAnswer}`);
        }
    }, [answers.changedAnswer, postId, push]);

    React.useEffect(() => {
        if(answers.changeStatus === 'deleted') {
            dispatch(fetchAnswers(postId, "-vote_count"));
            push(`/questions/${postId}/`);
            //dispatch(resetAnswerChangeStatus());
        }
    }, [answers.changeStatus, push, postId, dispatch]);

    const [openModal, setOpenModal] = React.useState(false);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

    const [selectedAnswerContent, setSelectedAnswerContent] = React.useState('');
    const [selectedAnswerId, setSelectedAnswerId] = React.useState(null);
    const [selectedAnswerPostBelong, setSelectedAnswerPostBelong] = React.useState(null);

    //scroll down and highlight the selected answer
    let refs = answers.answers.results ? answers.answers.results.reduce((acc, value) => {
        acc[value.id] = React.createRef();
        return acc;
    }, {}): {};

    const scrollTo = React.useCallback((id) => {
        if(refs[id].current)
            return refs[id].current.scrollIntoView({
                //behavior: 'smooth',
                block: 'center',
            })
    }, [refs]);

    React.useEffect(() => {
        if(auth.isAuthenticated) {
            if(votesStatus) {   
                if(refs && refs[Number(hash)] && refs[Number(hash)].current) {
                    scrollTo(Number(hash)); 
                    refs[Number(hash)].current.style.animation = 'answer-background-fade 8s';
                }
            }
        }else {
            if(refs && refs[Number(hash)] && refs[Number(hash)].current) {
                scrollTo(Number(hash)); 
                refs[Number(hash)].current.style.animation = 'answer-background-fade 8s';
            }
        }
        if(answers.status === 'succeeded') {
            if(refs && refs[Number(hash)] && refs[Number(hash)].current) {
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

    //filter list
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const filterByDate = (event) => {
        dispatch(fetchAnswers(postId, "created_at"));
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const filterByActive = (event) => {
        dispatch(fetchAnswers(postId, "-updated_at"));
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const filterByDefault = (event) => {
        dispatch(fetchAnswers(postId, "-vote_count"));
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
    //end filter list

    const AnswersList =  answers.answers.results ? answers.answers.results.map((answer) => (
        <Grid item innerRef={refs[answer.id]} key={answer.id}> 
            <AnswerViewCard
                answer={answer} 
                handleModalOpen={handleModalOpen}
                handleDeleteModalOpen={handleDeleteModalOpen}
            />
        </Grid>
    )): undefined;

    //pagination
    const total_pages = answers.answers.total_pages;
    const current_page = answers.answers.current_page;

    const handlePages = (event, page) => {
        event.dispatchConfig = dispatch(fetchAnswersForPagination(postId, "-vote_count", page));
        push(`/questions/${postId}/?page=${page}`);
    };
    //end pagination

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
                        {answers.answers.count !== 0 ? 
                            <Grid item>
                                <Grid item>
                                    <Grid container justify="space-between" alignItems="center">
                                        <Grid item>
                                            <Grid container alignItems="center" justify="flex-start">
                                                <Grid item>
                                                    <Typography variant="h6">{`${answers.answers.count} Answers`}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    {answers.answers.count !== 0 && total_pages > 1 ? 
                                                        <Grid container direction="column" justify="center" alignItems="flex-end">
                                                            <Pagination 
                                                                className={classes.pagination} 
                                                                page={current_page} 
                                                                count={total_pages} 
                                                                variant="outlined"
                                                                shape="rounded" 
                                                                size="small"
                                                                onChange={(event, page) => handlePages(event, page)}
                                                            />
                                                        </Grid>: 
                                                    undefined}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Tooltip title="Filter Answers By">
                                                <IconButton size="small"
                                                    ref={anchorRef}
                                                    aria-controls={open ? 'menu-list-grow' : undefined}
                                                    aria-haspopup="true"
                                                    onClick={handleToggle}
                                                >
                                                    <FilterList/>
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Divider/>
                            </Grid>: 
                        undefined}
                        <Grid item>
                            <Grid container direction="column" spacing={4}>
                                {AnswersList}
                                <Grid item>
                                    {answers.answers.count !== 0 && total_pages > 1 ? 
                                        <Grid container direction="column" justify="center" alignItems="flex-end">
                                            <Pagination 
                                                className={classes.pagination} 
                                                page={current_page} 
                                                count={total_pages} 
                                                variant="outlined"
                                                shape="rounded" 
                                                size="small"
                                                onChange={(event, page) => handlePages(event, page)}
                                            />
                                        </Grid>: 
                                    undefined}
                                </Grid>
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
                <FilterMenu 
                    open={open} 
                    setOpen={setOpen} 
                    anchorRef={anchorRef}
                    filterByDate={filterByDate}
                    filterByActive={filterByActive}
                    filterByDefault={filterByDefault}
                />
            </div>
        );
    }
}

export default Answer;

const FilterMenu = ({ open, setOpen, anchorRef, filterByDate, filterByActive, filterByDefault }) => {

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
        event.preventDefault();
        setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
        anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return(
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <MenuItem onClick={(event) => filterByDate(event)}>Date Created</MenuItem>
                    <MenuItem onClick={(event) => filterByActive(event)}>Last Active</MenuItem>
                    <MenuItem onClick={(event) => filterByDefault(event)}>Most Voted</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
    );
}