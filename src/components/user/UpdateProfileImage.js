import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  ThemeProvider,
  //Input,
} from '@material-ui/core';
import { theme, useStyles } from './styles/profileStyles';
import { useFormik } from 'formik';
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

    const [pictures, setPictures] = useState([]);
    const [image, setImage] = useState(null);

    const onDrop = picture => {
        setPictures(picture);
    };

    /*const handleImage = (event) => {
        setImage(event.target.files[0]);
    }*/

    //upload image
    const handleImageUpload = () => {

        const originalFileSize = pictures[0].size / 1024 / 1024;

        //image compression before upload
        //console.log('originalFile instanceof Blob', pictures[0] instanceof Blob); // true
        console.log(`originalFile size ${pictures[0].size / 1024 / 1024} MB`);
      
        var options = {
          maxSizeMB: 8,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          maxIteration: originalFileSize > 4 ? 2: 1,
          onProgress: () => dispatch(profileImageUpateLoading()),
        }

        imageCompression(pictures[0], options)
        .then(function (compressedFile) {
            //console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
            console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
    
            const formData = new FormData();
            //formData.append('profileImg', image, image.name);
            if(pictures.length !== 0) formData.append('profileImg', compressedFile, pictures[0].name);
            dispatch(updateUserProfileImage(auth, formData, usernameFromTheUrl));
            handleModalClose();
        })
        .catch(function (error) {
            console.log(error.message);
        });

        /*const formData = new FormData();
        //formData.append('profileImg', image, image.name);
        if(pictures.length !== 0) formData.append('profileImg', pictures[0], pictures[0].name);
        //dispatch(updateUserProfileImage(auth, formData, usernameFromTheUrl));
        handleModalClose();*/
    }

    const formik = useFormik({
        initialValues: {
        profileImage: image
        },
        onSubmit: (values) => {
            //formData.append('profileImg', image, image.name);
            //dispatch(updateUserProfileImage(auth, image));
            setImage(values.image);
            handleModalClose();
        },
    });

    return (
        <ThemeProvider theme={theme}>
        <form className={classes.root} onSubmit={formik.handleSubmit}>
            <Card>
            <CardHeader
                subheader="Change your profile image"
            />
            <Divider />
            <CardContent>
                {/*<Input type="file"
                    id="profileImage"
                    aria-label="Profile Image"
                    name="profileImage"
                    onChange={handleImage}
                />*/}
                {/*<Button onClick={handleUpload}>Upload</Button>*/}
                <Box maxWidth={450} maxHeight={450}>
                    <ImageUploader
                        {...props}
                        singleImage
                        withIcon={true}
                        onChange={onDrop}
                        imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                        maxFileSize={5242880}
                        withPreview={true}
                    />
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
                    onClick={handleImageUpload}
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
