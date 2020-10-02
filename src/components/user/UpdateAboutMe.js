import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextareaAutosize,
  ThemeProvider
} from '@material-ui/core';
import { theme, useStyles } from './styles/profileStyles';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserAboutMe } from '../../redux/ActionCreators';

export default function UpdateAboutMe(props) {
  const classes = useStyles();
  const auth = useSelector(state => state.Auth);
  const user = useSelector(state => state.User);
  const dispatch = useDispatch();

  //console.log(user.user.data.first_name);

  const { setAboutMe, aboutMe, handleModalClose } = props;

  const formik = useFormik({
    initialValues: {
      aboutMe: aboutMe
    },
    onSubmit: (values) => {
      console.log(values);
      dispatch(updateUserAboutMe(auth, values.aboutMe));
      setAboutMe(values.aboutMe);
      handleModalClose();
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <form className={classes.root} onSubmit={formik.handleSubmit}>
        <Card>
          <CardHeader
            title="Describe yourself"
          />
          <Divider />
          <CardContent>
            <TextareaAutosize
                className={classes.modalTextField}
                id="aboutMe"
                aria-label="About Me"
                name="aboutMe"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.aboutMe}
                rowsMin={5}
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
                variant="contained"
                className={classes.submit}
                >
                Cancel
            </Button>
            <Button
                type="submit"
                color="primary"
                variant="contained"
                className={classes.submit}
            >
              Save
            </Button>
          </Box>
        </Card>
      </form>
    </ThemeProvider>
  );
};
