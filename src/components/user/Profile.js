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
  Fade
} from '@material-ui/core';
import { theme, useStyles } from './styles/profileStyles';
import { useSelector } from 'react-redux';
import UpdateName from './UpdateName';
import UpdateAboutMe from './UpdateAboutMe';

function EditModal({openModal, className, handleModalClose, name, setName}) {
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
}

const Profile = ({ className, ...rest }) => {
  const classes = useStyles();
  const user = useSelector(state => state.User);
  const auth = useSelector(state => state.Auth);

  const [openModal, setOpenModal] = React.useState(false);
  const [modalSelection, setModalSelection] = React.useState(null);

  const [name, setName] = React.useState({
    firstname: user.user.data.first_name,
    lastname: user.user.data.last_name,
  });
  const [aboutMe, setAboutMe] = React.useState(user.user.data.profile.aboutMe);

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
        auth.isAuthenticated ?
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
                    <UpdateAboutMe aboutMe={aboutMe} setAboutMe={setAboutMe} handleModalClose={handleModalClose}/>:
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
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
