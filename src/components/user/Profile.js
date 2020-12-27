import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
//import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Card,
  CardContent,
  Divider,
  Typography,
  ThemeProvider,
  Link,
  Modal,
  Backdrop,
  Fade,
  Grid,
} from '@material-ui/core';
import { theme, useStyles, CustomTooltip } from './styles/profileStyles';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from '../../redux/ActionCreators';
import UpdateName from './UpdateName';
import UpdateAboutMe from './UpdateAboutMe';
import UpdateProfileImage from './UpdateProfileImage';
import ProfileTabs from './ProfileVerticleTabs';

/*function EditModal({openModal, className, handleModalClose, name, setName}) {
  return(
      <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={className}
          open={openModal}
          onClose={handleModalClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
              timeout: 500,
          }}
      >
      <Fade in={openModal}>
        <UpdateName name={name} setName={setName}/>
      </Fade>
    </Modal>
  );
}*/

const Profile = ({ className, ...rest }) => {

  const classes = useStyles();

  const user = useSelector(state => state.User);
  const auth = useSelector(state => state.Auth);

  const credentialsLoadingState = useSelector(state => [state.UserEducation.status, state.UserLanguages.status, state.UserSkills.status].includes('loading'))

  const dispatch = useDispatch();

  const [openModal, setOpenModal] = React.useState(false);
  const [modalSelection, setModalSelection] = React.useState(null);

  const usernameFromTheUrl = rest.match.params.username;

  const [name, setName] = React.useState({
    firstname: user.user ? user.user.first_name: null,
    lastname: user.user ? user.user.last_name: null,
  });
  const [aboutMe, setAboutMe] = React.useState( user.user && user.user.profile ? user.user.profile.aboutMe: null);
  const [profileImage, setProfileImage] = React.useState(user.user && user.user.profile ? user.user.profile.profileImg: null);

  React.useEffect(() => {
    if(user.status === 'idle') {
      dispatch(fetchUser(auth.token, usernameFromTheUrl));
    }
  }, [user, dispatch, auth.token, usernameFromTheUrl]);

  React.useEffect(() => {
    if(user.user && user.user.profile) {
      handleUserInfo(
        user.user.first_name, 
        user.user.last_name, 
        user.user.profile.aboutMe, 
        user.user.profile.profileImg
      );
    }
  }, [user]);

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

  const EditTooltip = ({selectionType, handleModalOpen, ...rest}) => (
    <CustomTooltip
      {...rest}
      className={classes.tooltip}
      title={
        auth.isAuthenticated && auth.currentUser === usernameFromTheUrl ?
        <Link 
          component="button"
          style={{textDecoration: 'none', color: 'white', fontSize: 12}} 
          onClick={() => handleModalOpen(selectionType)}
        >
          {selectionType === 'profileImage' ? "change": "edit"}
        </Link>
        : ""
      }
      interactive 
      placement={selectionType === 'profileImage' ? "bottom": "top-start"}
    />
  );

  const handleUserInfo = (firstname, lastname, aboutMe, profileImage) => {
    setName({
      firstname,
      lastname,
    });
    setAboutMe(aboutMe);
    setProfileImage(profileImage);
  }
  
  if(user.status === 'loading' || user.status === 'idle') {
    //return <CircularProgress color="secondary" size={15}/>
    return(<div></div>);
  }else if(user.status === 'failed') {
    return <h2>Error loading!</h2>
  }else {
    
    //console.log(name);
    //console.log(user.user);
    //console.log(profileImage);

    return (
      <React.Fragment>
        <ThemeProvider theme={theme}>
          <Card className={clsx(classes.root, className)} {...rest} elevation={0}>
            <CardContent>

              <Grid container direction="row" alignItems="center" justify="center" spacing={3}>

                <Grid item>
                  <EditTooltip selectionType={"profileImage"} handleModalOpen={handleModalOpen}>
                    <Avatar className={classes.avatar} src={profileImage}/>
                  </EditTooltip>
                </Grid>

                <Grid item >
                  <Grid container justify="center" alignItems="center" direction="column" spacing={0}>
                    <Grid item>
                      <EditTooltip selectionType={"name"} handleModalOpen={handleModalOpen}>
                        <Typography color="textPrimary" gutterBottom variant="h5">
                          {name.firstname === '' && name.lastname === '' && auth.isAuthenticated && usernameFromTheUrl === auth.currentUser ? 
                            <Link style={{color: 'gray'}}>Name</Link>
                            : `${name.firstname} ${name.lastname}`
                          }
                        </Typography>
                      </EditTooltip>
                    </Grid>

                    <Grid item>
                      <EditTooltip selectionType={"aboutMe"} handleModalOpen={handleModalOpen}>
                        <Typography color="textPrimary" variant="body1">
                          {aboutMe === '' && auth.isAuthenticated && usernameFromTheUrl === auth.currentUser ? 
                            <Link style={{color: 'gray'}}>Title</Link>
                            : aboutMe
                          }
                        </Typography>
                      </EditTooltip>
                    </Grid>

                    {/*auth.isAuthenticated && auth.currentUser === usernameFromTheUrl ? <Grid item>
                      <Hidden smUp>
                        <Box marginTop={3}>
                          <Button style={{textTransform: 'none', padding: (0, 2, 0)}} color="primary" variant="outlined" size="small">Edit Profile</Button>
                        </Box>
                      </Hidden>
                    </Grid>: undefined*/}
                  </Grid>
                </Grid>

                <EditModal>
                  <Fade in={openModal}>
                    {
                      modalSelection === 'name' ? 
                        <UpdateName name={name} setName={setName} handleModalClose={handleModalClose}/>: 
                      modalSelection === 'aboutMe' ?
                        <UpdateAboutMe aboutMe={aboutMe} setAboutMe={setAboutMe} handleModalClose={handleModalClose}/>:
                      modalSelection === 'profileImage' ?
                        <UpdateProfileImage usernameFromTheUrl={usernameFromTheUrl} profileImage={profileImage} setProfileImage={setProfileImage} handleModalClose={handleModalClose}/>:
                      undefined
                    }
                  </Fade>
                </EditModal>

              </Grid>

            </CardContent>
          </Card>
          <Divider className={classes.divider}/>
          <ProfileTabs credentialsLoadingState={credentialsLoadingState}/>
        </ThemeProvider>
      </React.Fragment>
    );
  }
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
