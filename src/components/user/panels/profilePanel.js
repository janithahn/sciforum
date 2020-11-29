import React from 'react';
import { Grid, Typography, Link, Divider, IconButton, Modal, Fade, Backdrop } from '@material-ui/core';
import { Facebook, LinkedIn, GitHub, Edit } from '@material-ui/icons';
import EditContact from './editors/editContact';
import EditCredentials from './editors/editCredentials';
import EditEmployment from './editors/credentials//editEmployment';
import { useStyles } from '../styles/profileStyles';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export default function ProfilePanel() {

    const classes = useStyles();

    const { username } = useParams();

    const user = useSelector(state => state.User);
    const auth = useSelector(state => state.Auth);

    const [contact, setContact] = React.useState(user.user ? user.user.data.contact: null);
    const [employment, setEmployment] = React.useState(user.user ? user.user.data.employment: null);
    const [education, setEducation] = React.useState(user.user ? user.user.data.education: null);
    const [languages, setLanguages] = React.useState(user.user ? user.user.data.languages: null);
    const [skills, setSkills] = React.useState(user.user ? user.user.data.skills: null);

    console.log(employment);

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
                        <GitHub/>
                    </Grid>
                    <Grid item>
                        <Typography className={classes.iconWrap}>{"Github"}</Typography>
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
                        <LinkedIn/>
                    </Grid>
                    <Grid item>
                        <Typography className={classes.iconWrap}>{"LinkedIn"}</Typography>
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
                        <Facebook/>
                    </Grid>
                    <Grid item>
                        <Typography className={classes.iconWrap}>{"Facebook"}</Typography>
                    </Grid>
                </Grid>
            </Link>
        );
    }

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
                <Grid item>
                    <Grid container direction="column" alignItems="flex-start" justify="flex-start" spacing={1}>
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
                {/*
                    modalSelection === 'contact' ? 
                        <EditContact contact={contact} setContact={setContact} handleModalClose={handleModalClose}/>: 
                    modalSelection === 'aboutMe' ?
                        <UpdateAboutMe aboutMe={aboutMe} setAboutMe={setAboutMe} handleModalClose={handleModalClose}/>:
                    modalSelection === 'profileImage' ?
                        <UpdateProfileImage usernameFromTheUrl={usernameFromTheUrl} profileImage={profileImage} setProfileImage={setProfileImage} handleModalClose={handleModalClose}/>:
                    undefined
                */}
                {
                    modalSelection === 'contact' ? 
                        <EditContact contact={contact} setContact={setContact} handleModalClose={handleModalClose}/>: 
                    modalSelection === 'credentials' ? 
                        <EditCredentials 
                            handleModalClose={handleModalClose}
                            setModalSelection={setModalSelection}
                            setOpenModal={setOpenModal}
                        />:
                    modalSelection === 'employment' ?
                        <EditEmployment
                            employment={employment}
                            setEmployment={setEmployment}
                            handleModalClose={handleModalClose}
                        />:
                    undefined
                }
                </Fade>
            </EditModal>
        </React.Fragment>
    );
}