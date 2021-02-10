import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  ThemeProvider,
  FormHelperText,
  //Input,
} from '@material-ui/core';
import { theme, useStyles } from './styles/profileStyles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfileImage, profileImageUpateLoading } from '../../redux/ActionCreators';
import ImageUploader from 'react-images-upload';
import imageCompression from 'browser-image-compression';

export default function UpdateProfileImage(props) {

    const { usernameFromTheUrl, handleModalClose } = props;

    const classes = useStyles();
    const auth = useSelector(state => state.Auth);
    //const user = useSelector(state => state.User);
    const dispatch = useDispatch();

    const schema = Yup.object().shape({
        profileImage: Yup.array()
          .min(1, 'Please select an image to upload')
          .max(1, 'Only one image can be uploaded')
          .required('Please select an image to upload'),
    });

    const formik = useFormik({
        initialValues: {
            profileImage: [],
        },
        onSubmit: (values) => {
            //handling the image compression before upload it to the server
            const originalFileSize = values.profileImage[0] ? values.profileImage[0].size / 1024 / 1024: 0;

            console.log(`originalFile size ${originalFileSize} MB`);
        
            var options = {
                maxSizeMB: 8,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                maxIteration: originalFileSize > 4 ? 2: 1,
                onProgress: () => dispatch(profileImageUpateLoading()),
            }

            if(values.profileImage[0])
                imageCompression(values.profileImage[0], options)
                .then(function (compressedFile) {
                    console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
            
                    const formData = new FormData();
                    if(values.profileImage.length !== 0) formData.append('profileImg', compressedFile, values.profileImage[0].name);
                    dispatch(updateUserProfileImage(auth, formData, usernameFromTheUrl));
                    handleModalClose();
                })
                .catch(function (error) {
                    console.log(error.message);
                });
        },
        validationSchema: schema,
    });

    const onDrop = picture => {
        formik.setFieldValue("profileImage", picture);
    };

    return (
        <ThemeProvider theme={theme}>
        <form className={classes.root} onSubmit={formik.handleSubmit}>
            <Card>
            <CardHeader
                subheader="Change your profile image"
            />
            <Divider />
            <CardContent>
                <Box maxWidth={450} maxHeight={450}>
                    <ImageUploader
                        {...props}
                        singleImage
                        withIcon={false}
                        onChange={onDrop}
                        imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                        maxFileSize={5242880}
                        withPreview={true}
                    />
                    <FormHelperText 
                        error={formik.errors.profileImage && formik.touched.profileImage}
                    >
                        {(formik.errors.profileImage && formik.touched.profileImage) && formik.errors.profileImage}
                    </FormHelperText>
                </Box>
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
                    onClick={formik.handleSubmit}
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
