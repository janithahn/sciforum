import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  ThemeProvider,
  FormHelperText
} from '@material-ui/core';
import { theme, useStyles } from './styles/styles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { createRoom, editRoom } from './actionCreators';

export default function AddRoomModal({ handleModalClose, type, currentRoomname, currentDescription, currentRoomKey }) {
  const classes = useStyles();
  const auth = useSelector(state => state.Auth);
  const createChatRoom = useSelector(state => state.CreateChatRoom);
  const dispatch = useDispatch();

  const [credentialError, setCredentialError] = React.useState('');

  React.useEffect(() => {
    if(createChatRoom.status === 'failed') {
      if(createChatRoom.errMess) {
        setCredentialError(createChatRoom.errMess.message);
      } else {
        setCredentialError('Server error! Please try again!');
      }  
    }else {
      setCredentialError('');
    }
  }, [createChatRoom, setCredentialError]);

  const schema = Yup.object().shape({
    roomname: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    description: Yup.string()
      .min(2, 'Too Short!')
      .max(250, 'Too Long!')
      .required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      roomname: currentRoomname ? currentRoomname: '', 
      description: currentDescription ? currentDescription: '',
    },
    initialErrors: {

    },
    onSubmit: (values) => {
      const roomVal = {
        roomname: values.roomname,
        description: values.description,
        owner: auth.currentUser,
        ownerId: auth.currentUserId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const roomUpdateVal = {
        roomname: values.roomname,
        description: values.description,
        owner: auth.currentUser,
        ownerId: auth.currentUserId,
        updated_at: new Date().toISOString(),
      };
      if(type === "create") dispatch(createRoom(roomVal, handleModalClose));
      if(type === "edit") dispatch(editRoom(roomUpdateVal, currentRoomKey, currentRoomname, handleModalClose));
    },
    validationSchema: schema,
  });

  const handleFocus = () => {
    setCredentialError('');
  };

  return (
    <ThemeProvider theme={theme}>
      <form className={classes.root} onSubmit={formik.handleSubmit}>
        <Card className={classes.cardRoot}>
          <CardHeader
            subheader="Add Room"
          />
          <Divider />
          <FormHelperText error={true} variant="outlined">{credentialError}</FormHelperText>
          <CardContent>
            <TextField
                className={classes.modalTextField}
                fullWidth
                error={formik.touched.roomname && formik.errors.roomname}
                helperText={(formik.errors.roomname && formik.touched.roomname) && formik.errors.roomname}
                id="roomname"
                label="Room Name"
                name="roomname"
                onChange={formik.handleChange}
                onFocus={handleFocus}
                value={formik.values.roomname}
                variant="outlined"
                size="small"
            />
            <TextField
                className={classes.modalTextField}
                fullWidth
                error={formik.touched.description && formik.errors.description}
                helperText={(formik.errors.description && formik.touched.description) && formik.errors.description}
                label="Description"
                id="description"
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
                variant="outlined"
                size="small"
            />
          </CardContent>
          <Divider />
          <Box
            display="flex"
            justifyContent="flex-end"
            p={0}
          >
            <Button
              onClick={() => handleModalClose()}
              color="primary"
              variant="outlined"
              className={classes.submit}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="outlined"
              className={classes.submit}
            >
              Add
            </Button>
          </Box>
        </Card>
      </form>
    </ThemeProvider>
  );
};
