import React from 'react';
import { Grid, Typography, Link, Divider, IconButton, Modal, Fade, Backdrop, Box } from '@material-ui/core';
import { Facebook, LinkedIn, GitHub, Edit, School, Work, Language, Build } from '@material-ui/icons';
import EditContact from './editors/editContact';
import EditCredentials from './editors/editCredentials';
import CreateEmployment from './editors/credentials/createEmployment';
import CreateEducation from './editors/credentials/createEducation';
import CreateSkills from './editors/credentials/createSkills';
import CreateLanguages from './editors/credentials/createLanguages';
import { useStyles } from '../styles/profileStyles';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUserEmployment, fetchUserEducation, fetchUserSkills, fetchUserLanguages } from '../../../redux/ActionCreators';

export default function ProfilePanel() {

    const classes = useStyles();

    const dispatch = useDispatch();

    const { username } = useParams();

    const user = useSelector(state => state.User);
    const auth = useSelector(state => state.Auth);
    const userEmployment = useSelector(state => state.UserEmployment);
    const userEducation = useSelector(state => state.UserEducation);
    const userSkills = useSelector(state => state.UserSkills);
    const userLanguages = useSelector(state => state.UserLanguages);

    const employment = userEmployment.userEmployment;
    const education = userEducation.userEducation;
    const skills = userSkills.userSkills;
    const languages = userLanguages.userLanguages;

    //fetching user credentials
    React.useEffect(() => {
        if(userEmployment.status === 'idle') dispatch(fetchUserEmployment(username));
    }, [dispatch, userEmployment.status, username]);

    React.useEffect(() => {
        if(userEducation.status === 'idle') dispatch(fetchUserEducation(username));
    }, [dispatch, userEducation.status, username]);

    React.useEffect(() => {
        if(userSkills.status === 'idle') dispatch(fetchUserSkills(username));
    }, [dispatch, userSkills.status, username]);

    React.useEffect(() => {
        if(userLanguages.status === 'idle') dispatch(fetchUserLanguages(username));
    }, [dispatch, userLanguages.status, username]);

    //relevant credential states
    const [contact, setContact] = React.useState(user.user ? user.user.contact: null);

    const [selectedCredentialItem, setSelectedCredentialItem] = React.useState();

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

    const EmploymentTypo = employment.map(item => 
        <Grid item key={item.id}>
            <Grid container direction="row" alignItems="center" justify="center" spacing={1}>
                <Grid item>
                    <Typography variant="subtitle2" className={classes.iconWrap}>
                        <Work fontSize="small" style={{fill: "gray", marginRight: 8}}/>{item.position + " at " + item.company}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );

    const EducationTypo = education.map(item => 
        <Grid item key={item.id}>
            <Grid container direction="row" alignItems="center" justify="center" spacing={1}>
                <Grid item>
                    <Typography variant="subtitle2" className={classes.iconWrap}>
                        <School fontSize="small" style={{fill: "gray", marginRight: 8}}/>{item.degree + " in "}{item.field_of_study !== "" ? item.field_of_study: ""}{", " + item.school}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );

    const SkillsTypo = skills.map(item => 
        <Grid item key={item.id}>
            <Grid container direction="row" alignItems="center" justify="center" spacing={1}>
                <Grid item>
                    <Typography variant="subtitle2">{item.skill}</Typography>
                </Grid>
            </Grid>
        </Grid>
    );

    const LanguagesTypo = languages.map(item => 
        <Grid item key={item.id}>
            <Grid container direction="row" alignItems="center" justify="center" spacing={1}>
                <Grid item>
                    <Typography variant="subtitle2">{item.language}</Typography>
                </Grid>
            </Grid>
        </Grid>
    );

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
                                    <Grid item>
                                        <Divider className={classes.divider}/>
                                    </Grid>

                                    {EducationTypo}
                                    <Divider/>

                                    {languages.length !== 0 ? <Grid item>
                                        <Grid container direction="row" alignItems="center" justify="center" spacing={1}>
                                            <Grid item>
                                                <Language fontSize="small" style={{fill: "gray"}}/>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle2">Languages</Typography>
                                                <Divider/>
                                            </Grid>
                                        </Grid>
                                    </Grid>: undefined}
                                    <Box marginLeft={4}>
                                        <Grid container direction="column" alignItems="baseline" justify="center" spacing={0}>
                                            {LanguagesTypo}
                                        </Grid>
                                    </Box>
                                    <Grid item>
                                        <Divider className={classes.divider}/>
                                    </Grid>

                                    {skills.length !== 0 ? <Grid item>
                                        <Grid container direction="row" alignItems="center" justify="center" spacing={1}>
                                            <Grid item>
                                                <Build fontSize="small" style={{fill: "gray"}}/>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle2">Skills</Typography>
                                                <Divider/>
                                            </Grid>
                                        </Grid>
                                    </Grid>: undefined}
                                    <Box marginLeft={4}>
                                        <Grid container direction="column" alignItems="baseline" justify="center" spacing={0}>
                                            {SkillsTypo}
                                        </Grid>
                                    </Box>
                                    <Grid item>
                                        <Divider className={classes.divider}/>
                                    </Grid>

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
                            education={education}
                            skills={skills}
                            languages={languages}
                            setSelectedCredentialItem={setSelectedCredentialItem}
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
                            selectedEmploymentItem={selectedCredentialItem}
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
                            selectedEducationItem={selectedCredentialItem}
                            varient="update"
                        />:
                    modalSelection === 'skillCreate' ?
                        <CreateSkills
                            skills={skills}
                            handleModalClose={handleModalClose}
                            varient="create"
                        />:
                    modalSelection === 'skillUpdate' ?
                        <CreateSkills
                            skills={skills}
                            handleModalClose={handleModalClose}
                            selectedSkillItem={selectedCredentialItem}
                            varient="update"
                        />:
                    modalSelection === 'languageCreate' ?
                        <CreateLanguages
                            languages={languages}
                            handleModalClose={handleModalClose}
                            varient="create"
                        />:
                    modalSelection === 'languageUpdate' ?
                        <CreateLanguages
                            languages={languages}
                            handleModalClose={handleModalClose}
                            selectedLanguageItem={selectedCredentialItem}
                            varient="update"
                        />:
                    undefined
                }
                </Fade>
            </EditModal>
        </React.Fragment>
    );
}