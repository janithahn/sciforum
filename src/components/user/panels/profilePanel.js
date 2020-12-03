import React from 'react';
import { Grid, Typography, Link, Divider, IconButton, Modal, Fade, Backdrop, Box } from '@material-ui/core';
import { Facebook, LinkedIn, GitHub, Edit, AddCircleOutline, School, Work, Language, Build } from '@material-ui/icons';
import EditContact from './editors/editContact';
import EditCredentials from './editors/editCredentials';
import CreateEmployment from './editors/credentials/createEmployment';
import CreateEducation from './editors/credentials/createEducation';
import { useStyles } from '../styles/profileStyles';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUserEmployment, fetchUserEducation } from '../../../redux/ActionCreators';

export default function ProfilePanel() {

    const classes = useStyles();

    const dispatch = useDispatch();

    const { username } = useParams();

    const user = useSelector(state => state.User);
    const auth = useSelector(state => state.Auth);
    const userEmployment = useSelector(state => state.UserEmployment);
    const userEducation = useSelector(state => state.UserEducation);

    React.useEffect(() => {
        if(userEmployment.status === 'idle') dispatch(fetchUserEmployment(username));
    }, [dispatch]);

    React.useEffect(() => {
        if(userEducation.status === 'idle') dispatch(fetchUserEducation(username));
    }, [dispatch]);

    React.useEffect(() => {
        if(userEmployment.userEmployment) handleUserEmployment(userEmployment.userEmployment);
    }, [userEmployment]);

    React.useEffect(() => {
        if(userEducation.userEducation) handleUserEducation(userEducation.userEducation);
    }, [userEducation]);

    const [contact, setContact] = React.useState(user.user ? user.user.data.contact: null);
    const [employment, setEmployment] = React.useState(userEmployment.userEmployment ? userEmployment.userEmployment: []);
    const [education, setEducation] = React.useState(userEducation.userEducation ? userEducation.userEducation: []);
    const [languages, setLanguages] = React.useState(user.user ? user.user.data.languages: []);
    const [skills, setSkills] = React.useState(user.user ? user.user.data.skills: []);

    const handleUserEmployment = (employment) => {
        setEmployment(employment);
    };

    const handleUserEducation = (education) => {
        setEducation(education);
    };

    const [selectedEmploymentItem, setSelectedEmploymentItem] = React.useState();
    const [selectedEducationItem, setSelectedEducationItem] = React.useState();

    const [openModal, setOpenModal] = React.useState(false);
    const [modalSelection, setModalSelection] = React.useState(null);
  
    const handleModalOpen = (modal) => {
      setOpenModal(true);
      setModalSelection(modal);
    };
  
    const handleModalClose = () => {
      setOpenModal(false);
      setModalSelection(null);
    };

    const EditModal = ({...rest}) => (
        <Modal {...rest}
          open={openModal} 
          className={classes.modal} 
          onClose={handleModalClose}
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
              timeout: 500,
          }}
        />
    );

    function GithubLink({link}) {
        return(
            <Link underline="none" href={link}>
                <Grid container direction="row" alignItems="center" justify="flex-start" spacing={0}>
                    <Grid item>
                        <GitHub fontSize="small"/>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2" >{"Github"}</Typography>
                    </Grid>
                </Grid>
            </Link>
        );
    }

    function LinkedInLink({link}) {
        return(
            <Link underline="none" href={link}>
                <Grid container direction="row" alignItems="center" justify="flex-start" spacing={0}>
                    <Grid item>
                        <LinkedIn fontSize="small"/>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2" >{"LinkedIn"}</Typography>
                    </Grid>
                </Grid>
            </Link>
        );
    }

    function FacebookLink({link}) {
        return(
            <Link underline="none" href={link}>
                <Grid container direction="row" alignItems="center" justify="flex-start" spacing={0}>
                    <Grid item>
                        <Facebook fontSize="small"/>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2">{"Facebook"}</Typography>
                    </Grid>
                </Grid>
            </Link>
        );
    }

    const EmploymentTypo = employment && employment !== [] ? employment.map(item => 
        <Grid item key={item.id}>
            <Grid container direction="row" alignItems="center" justify="center" spacing={1}>
                <Grid item>
                    <Work fontSize="small" style={{fill: "gray"}}/>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle2">{item.position + " at " + item.company}</Typography>
                </Grid>
            </Grid>
        </Grid>
    ): undefined;

    const EducationTypo = education && education !== [] ? education.map(item => 
        <Grid item key={item.id}>
            <Grid container direction="row" alignItems="center" justify="center" spacing={1}>
                <Grid item>
                    <School fontSize="small" style={{fill: "gray"}}/>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle2">{item.degree + " at " + item.school}</Typography>
                </Grid>
            </Grid>
        </Grid>
    ): undefined;

    console.log(userEducation);

    return(
        <React.Fragment>
            <Grid container direction="column" alignItems="flex-start" justify="flex-start" spacing={2}>
                <Grid item>
                    <Grid container direction="column" alignItems="flex-start" justify="flex-start" spacing={1}>
                        <Grid item>
                            <Grid container direction="row" alignItems="center" justify="flex-start" spacing={1}>
                                <Grid item>
                                    <Typography variant="h6" style={{fontSize: 16}}>Credentials</Typography>
                                    <Divider/>
                                </Grid>
                                {auth.isAuthenticated && auth.currentUser === username ? <Grid item>
                                    <IconButton size="small" onClick={() => handleModalOpen("credentials")}>
                                        <Edit fontSize="small"/>
                                    </IconButton>
                                </Grid>: undefined}
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Box m={0}>
                                <Grid container direction="column" alignItems="baseline" justify="center" spacing={1}>
                                    {EmploymentTypo}
                                    {EducationTypo}
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container direction="column" alignItems="flex-start" justify="flex-start" spacing={2}>
                        <Grid item>
                            <Grid container direction="row" alignItems="center" justify="flex-start" spacing={1}>
                                <Grid item>
                                    <Typography variant="h6" style={{fontSize: 16}}>Contact</Typography>
                                    <Divider/>
                                </Grid>
                                {auth.isAuthenticated && auth.currentUser === username ? <Grid item>
                                    <IconButton size="small" onClick={() => handleModalOpen("contact")}>
                                        <Edit fontSize="small"/>
                                    </IconButton>
                                </Grid>: undefined}
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container direction="row" alignItems="center" justify="flex-start" spacing={2}>
                                <Grid item>
                                    {contact ? contact.github !== "" ? <GithubLink link={contact.github}/>: undefined: undefined}
                                </Grid>
                                <Grid item>
                                    {contact ? contact.linkedIn !== "" ? <LinkedInLink link={contact.linkedIn}/>: undefined: undefined}
                                </Grid>
                                <Grid item>
                                    {contact ? contact.facebook !== "" ? <FacebookLink link={contact.facebook}/>: undefined: undefined}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <EditModal>
                <Fade in={openModal}>
                {
                    modalSelection === 'contact' ? 
                        <EditContact contact={contact} setContact={setContact} handleModalClose={handleModalClose}/>: 
                    modalSelection === 'credentials' ? 
                        <EditCredentials 
                            handleModalClose={handleModalClose}
                            setModalSelection={setModalSelection}
                            setOpenModal={setOpenModal}
                            employment={employment}
                            setSelectedEmploymentItem={setSelectedEmploymentItem}
                            education={education}
                            setSelectedEducationItem={setSelectedEducationItem}
                        />:
                    modalSelection === 'employmentCreate' ?
                        <CreateEmployment
                            employment={employment}
                            handleModalClose={handleModalClose}
                            varient="create"
                        />:
                    modalSelection === 'employmentUpdate' ?
                        <CreateEmployment
                            employment={employment}
                            handleModalClose={handleModalClose}
                            selectedEmploymentItem={selectedEmploymentItem}
                            varient="update"
                        />:
                    modalSelection === 'educationCreate' ?
                        <CreateEducation
                            education={education}
                            handleModalClose={handleModalClose}
                            varient="create"
                        />:
                    modalSelection === 'educationUpdate' ?
                        <CreateEducation
                            education={education}
                            handleModalClose={handleModalClose}
                            selectedEducationItem={selectedEducationItem}
                            varient="update"
                        />:
                    undefined
                }
                </Fade>
            </EditModal>
        </React.Fragment>
    );
}