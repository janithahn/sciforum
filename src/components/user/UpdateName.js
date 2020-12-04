import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  ThemeProvider
} from '@material-ui/core';
import { theme, useStyles } from './styles/profileStyles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../redux/ActionCreators';

export default function UpdateName(props) {
  const classes = useStyles();
  const auth = useSelector(state => state.Auth);
  //const user = useSelector(state => state.User);
  const dispatch = useDispatch();

  //console.log(user.user.data.first_name);

  const { setName, name, handleModalClose } = props;

  const profileSchema = Yup.object().shape({
    firstname: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!'),
      //.required('Required'),
    lastname: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!'),
      //.required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      firstname: name.firstname, 
      lastname: name.lastname,
    },
    onSubmit: (values) => {
      //console.log(values);
      dispatch(updateUser(auth, values.firstname, values.lastname));
      setName({
          firstname: values.firstname,
          lastname: values.lastname,
      });
      handleModalClose();
    },
    validationSchema: profileSchema,
  });

  return (
    <ThemeProvider theme={theme}>
      <form className={classes.root} onSubmit={formik.handleSubmit}>
        <Card className={classes.cardRoot}>
          <CardHeader
            subheader="Update Name"
          />
          <Divider />
          <CardContent>
            <TextField
                className={classes.modalTextField}
                fullWidth
                error={formik.touched.firstname && formik.errors.firstname}
                helperText={(formik.errors.firstname && formik.touched.firstname) && formik.errors.firstname}
                id="firstname"
                label="First name"
                name="firstname"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstname}
                variant="outlined"
                size="small"
            />
            <TextField
                className={classes.modalTextField}
                fullWidth
                error={formik.touched.lastname && formik.errors.lastname}
                helperText={(formik.errors.lastname && formik.touched.lastname) && formik.errors.lastname}
                label="Last name"
                id="lastname"
                name="lastname"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastname}
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
