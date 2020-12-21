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
import { theme, useStyles } from '../../styles/profileStyles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserContact } from '../../../../redux/ActionCreators';

export default function EditContact(props) {
  const classes = useStyles();

  const auth = useSelector(state => state.Auth);
  const dispatch = useDispatch();

  const { setContact, contact, handleModalClose } = props;

  const profileSchema = Yup.object().shape({
    github: Yup.string().url()
        .min(5, 'Too Short!'),
    linkedIn: Yup.string().url()
        .min(5, 'Too Short!'),
    facebook: Yup.string().url()
        .min(5, 'Too Short!'),
  });

  const formik = useFormik({
    initialValues: {
      github: contact.github ? contact.github: '', 
      linkedIn: contact.linkedIn ? contact.linkedIn: '',
      facebook: contact.facebook ? contact.facebook: '',
    },
    onSubmit: (values) => {
        dispatch(updateUserContact(auth, {
            github: values.github,
            linkedIn: values.linkedIn,
            facebook: values.facebook
        }));
        setContact({
            github: values.github,
            linkedIn: values.linkedIn,
            facebook: values.facebook
        });
        handleModalClose();
    },
    validationSchema: profileSchema,
  });

  return (
    <Box>
        <ThemeProvider theme={theme}>
            <form className={classes.root} onSubmit={formik.handleSubmit}>
                <Card className={classes.cardRoot}>
                    <CardHeader
                        subheader="Edit Contact"
                    />
                    <Divider />
                    <CardContent>
                        <TextField
                            className={classes.modalTextField}
                            fullWidth
                            error={formik.touched.github && formik.errors.github}
                            helperText={(formik.errors.github && formik.touched.github) && formik.errors.github}
                            id="github"
                            label="Github"
                            name="github"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.github}
                            variant="outlined"
                            size="small"
                        />
                        <TextField
                            className={classes.modalTextField}
                            fullWidth
                            error={formik.touched.linkedIn && formik.errors.linkedIn}
                            helperText={(formik.errors.linkedIn && formik.touched.linkedIn) && formik.errors.linkedIn}
                            label="LinkedIn"
                            id="linkedIn"
                            name="linkedIn"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.linkedIn}
                            variant="outlined"
                            size="small"
                        />
                        <TextField
                            className={classes.modalTextField}
                            fullWidth
                            error={formik.touched.facebook && formik.errors.facebook}
                            helperText={(formik.errors.facebook && formik.touched.facebook) && formik.errors.facebook}
                            label="Facebook"
                            id="facebook"
                            name="facebook"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.facebook}
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
                            size="small"
                            className={classes.submit}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            size="small"
                            variant="contained"
                            className={classes.submit}
                        >
                            Save
                        </Button>
                    </Box>
                </Card>
            </form>
        </ThemeProvider>
    </Box>
  );
};
