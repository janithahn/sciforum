import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  ThemeProvider,
  Tooltip,
  Link,
  Modal,
  Backdrop,
  Fade,
  CircularProgress,
} from '@material-ui/core';
import { theme, useStyles } from './styles/profileStyles';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from '../../redux/ActionCreators';
import UpdateName from './UpdateName';
import UpdateAboutMe from './UpdateAboutMe';

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

  const [openModal, setOpenModal] = React.useState(false);
  const [modalSelection, setModalSelection] = React.useState(null);

  const dispatch = useDispatch();

  const usernameFromTheUrl = rest.match.params.username;
  
  console.log(user);
  //console.log(auth);

  React.useEffect(() => {
    if(user.status === 'idle') {
      dispatch(fetchUser(null, usernameFromTheUrl));
    }
  }, [user.status, dispatch]);

  const [name, setName] = React.useState({
    firstname: user.user ? user.user.data.first_name: null,
    lastname: user.user ? user.user.data.last_name: null,
  });
  const [aboutMe, setAboutMe] = React.useState( user.user ? user.user.data.profile.aboutMe: null);

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
    <Tooltip
      {...rest}
      title={
        auth.isAuthenticated && auth.currentUser === usernameFromTheUrl ?
        <Link 
          component="button"
          style={{textDecoration: 'none', color: 'white', fontSize: 12}} 
          onClick={() => handleModalOpen(selectionType)}
        >
          edit
        </Link>
        : ""
      }
      interactive 
      placement="right"
    />
  );

  const handleUserInfo = (firstname, lastname, aboutMe) => {
    setName({
      firstname,
      lastname,
    });
    setAboutMe(aboutMe);
  }

  React.useEffect(() => {
    if(user.user) {
      handleUserInfo(user.user.data.first_name, user.user.data.last_name, user.user.data.profile.aboutMe);
    }
  }, [user]);
  
  if(user.status === 'loading' || user.status === 'idle') {
    return <CircularProgress color="secondary" size={15}/>
  }else if(user.status === 'failed') {
    return <h2>Error loading!</h2>
  }else {
    
    console.log(name);
    console.log(user.user);

    const displayName = {
      firstname: user.user.data.first_name,
      lastname: user.user.data.last_name,
    };
    const displayAboutMe = user.user.data.profile.aboutMe;

    return (
      <ThemeProvider theme={theme}>
        <Card
          className={clsx(classes.root, className)}
          {...rest}
        >
          <CardContent>
            <Box
              alignItems="center"
              display="flex"
              flexDirection="column"
            >
              <Avatar
                className={classes.avatar}
                src={'/static/images/avatars/avatar_6.png'}
              />

              <EditTooltip selectionType={"name"} handleModalOpen={handleModalOpen}>
                <Typography color="textPrimary" gutterBottom variant="h5">
                  {`${name.firstname} ${name.lastname}`}
                </Typography>
              </EditTooltip>

              <EditTooltip selectionType={"aboutMe"} handleModalOpen={handleModalOpen}>
                <Typography color="textPrimary" variant="body1">
                  {aboutMe}
                </Typography>
              </EditTooltip>

              <EditModal>
                <Fade in={openModal}>
                  {
                    modalSelection === 'name' ? 
                      <UpdateName name={name} setName={setName} handleModalClose={handleModalClose}/>: 
                    modalSelection === 'aboutMe' ?
                      <UpdateAboutMe aboutMe={name} setAboutMe={setAboutMe} handleModalClose={handleModalClose}/>:
                    undefined
                  }
                </Fade>
              </EditModal>

            </Box>
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              color="primary"
              fullWidth
              variant="text"
            >
              Upload picture
            </Button>
          </CardActions>
        </Card>
      </ThemeProvider>
    );
  }
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
