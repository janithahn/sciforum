import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  ThemeProvider,
  Input,
} from '@material-ui/core';
import { theme, useStyles } from './styles/profileStyles';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfileImage } from '../../redux/ActionCreators';
import ImageUploader from 'react-images-upload';

export default function UpdateProfileImage(props) {

    const { usernameFromTheUrl, handleModalClose } = props;

    const classes = useStyles();
    const auth = useSelector(state => state.Auth);
    //const user = useSelector(state => state.User);
    const dispatch = useDispatch();

    const [pictures, setPictures] = useState([]);
    const [image, setImage] = useState(null);

    console.log(pictures);

    const onDrop = picture => {
        setPictures([...pictures, picture]);
    };

    const handleImage = (event) => {
        setImage(event.target.files[0]);
        console.log(event.target.files[0]);
        //console.log(image);
    }

    const handleImageUpload = () => {
        const formData = new FormData();
        formData.append('profileImg', image, image.name);
        dispatch(updateUserProfileImage(auth, formData, usernameFromTheUrl));
        //dispatch(fetchUser(null, usernameFromTheUrl));
        handleModalClose();
    }

    const formik = useFormik({
        initialValues: {
        profileImage: image
        },
        onSubmit: (values) => {
            //console.log(values);
            //console.log(pictures[0]);
            console.log(image);
            //formData.append('profileImg', image, image.name);
            //console.log(formData.values);
            dispatch(updateUserProfileImage(auth, image));
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
                <Input type="file"
                    id="profileImage"
                    aria-label="Profile Image"
                    name="profileImage"
                    onChange={handleImage}
                />
                {/*<Button onClick={handleUpload}>Upload</Button>*/}
                <ImageUploader
                    {...props}
                    withIcon={true}
                    onChange={onDrop}
                    imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                    maxFileSize={5242880}
                    withPreview={true}
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
