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
import { theme, useStyles } from '../../../styles/profileStyles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserLanguages, createUserLanguages } from '../../../../../redux/ActionCreators';
import AlertDialogSlide from '../alert/alert';

export default function CreateLanguages({ languages, handleModalClose, varient, selectedLanguageItem }) {

  const classes = useStyles();
  
  const auth = useSelector(state => state.Auth);
  const dispatch = useDispatch();

  const profileSchema = Yup.object().shape({
    language: Yup.string()
        .required()
        .min(1, 'Too Short!')
        .max(30, 'Not more that 30 characters'),
  });

  const formik = useFormik({
    initialValues: {
        language: varient === "create" ? "": selectedLanguageItem.language,
    },
    onSubmit: (values) => {
        const submitVal = {
            user: auth.currentUserId,
            language: values.language
        }
        if(languages.includes(selectedLanguageItem)) {
            dispatch(updateUserLanguages(submitVal, selectedLanguageItem.id));
        }else {
            dispatch(createUserLanguages(submitVal));
        }
        handleModalClose();
    },
    validationSchema: profileSchema,
  });

  const [alertModalOpen, setAlertModalOpen] = React.useState(false);

  const handleAlertModalOpen = () => {
    setAlertModalOpen(true);
  };

  const handleAlertModalClose = () => {
    setAlertModalOpen(false);
  };

  return (
        <ThemeProvider theme={theme}>
                <form className={classes.root} onSubmit={formik.handleSubmit}>
                    <Card className={classes.cardRoot}>
                        <CardHeader
                            subheader="Edit Languages"
                        />
                        <Divider />
                        <CardContent>
                            <TextField
                                fullWidth
                                className={classes.modalTextField}
                                error={formik.touched.language && formik.errors.language}
                                helperText={(formik.errors.language && formik.touched.language) && formik.errors.language}
                                label="Language"
                                id="language"
                                name="language"
                                onChange={formik.handleChange}
                                value={formik.values.language}
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
                                size="small"
                                color="primary"
                                variant="contained"
                                className={classes.submit}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="small"
                                color="primary"
                                variant="contained"
                                className={classes.submit}
                            >
                                Save
                            </Button>
                            {varient === "update" ? <Button
                                size="small"
                                color="secondary"
                                variant="contained"
                                onClick={handleAlertModalOpen}
                                className={classes.submit}
                            >
                                Delete
                            </Button>: undefined}
                        </Box>
                        <AlertDialogSlide 
                            open={alertModalOpen} 
                            id={varient === "update" ? selectedLanguageItem.id: undefined} 
                            handleClose={handleAlertModalClose}
                            handleCredentialModalClose={handleModalClose}
                            type="languages"
                        />
                    </Card>
                </form>
        </ThemeProvider>
  );
};
