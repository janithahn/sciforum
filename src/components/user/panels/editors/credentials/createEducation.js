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
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from '@material-ui/core';
import { theme, useStyles } from '../../../styles/profileStyles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserEducation, createUserEducation } from '../../../../../redux/ActionCreators';
import AlertDialogSlide from '../alert/alert';

export default function CreateEducation({ education, handleModalClose, varient, selectedEducationItem }) {

  const classes = useStyles();
  
  const auth = useSelector(state => state.Auth);
  const dispatch = useDispatch();

  const range = (min, max) => [...Array(max - min + 1).keys()].map(i => <MenuItem key={i} value={i + min}>{i + min}</MenuItem>);

  const profileSchema = Yup.object().shape({
    school: Yup.string()
        .required()
        .min(1, 'Too Short!')
        .max(120, 'Not more than 120 characters'),
    degree: Yup.string()
        .required()
        .max(35, 'Not more than 35 characters')
        .min(1, 'Too Short!'),
    field_of_study: Yup.string()
        .required()
        .max(120, 'Not more than 120 characters')
        .min(1, 'Too Short!'),
  });

  const formik = useFormik({
    initialValues: {
      school: varient === "create" ? "": selectedEducationItem.school, 
      degree: varient === "create" ? "": selectedEducationItem.degree,
      field_of_study: varient === "create" ? "": selectedEducationItem.field_of_study,
      description: varient === "create" ? "": selectedEducationItem.description,
      start_year: varient === "create" || selectedEducationItem.start_year === null ? "": selectedEducationItem.start_year,
      end_year: varient === "create" || selectedEducationItem.end_year === null ? "": selectedEducationItem.end_year,
    },
    onSubmit: (values) => {
        const submitVal = {
            user: auth.currentUserId,
            school: values.school, 
            degree: values.degree,
            field_of_study: values.field_of_study,
            description: values.description,
            start_year: values.start_year === "" ? null: values.start_year,
            end_year: values.currently_work || values.end_year === "" ? null: values.end_year,
        }
        if(education.includes(selectedEducationItem)) {
            dispatch(updateUserEducation(submitVal, selectedEducationItem.id));
        }else {
            dispatch(createUserEducation(submitVal));
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
                            subheader="Edit Education"
                        />
                        <Divider />
                        <CardContent>
                            <TextField
                                fullWidth
                                className={classes.modalTextField}
                                error={formik.touched.school && formik.errors.school}
                                helperText={(formik.errors.school && formik.touched.school) && formik.errors.school}
                                label="School"
                                id="school"
                                name="school"
                                onChange={formik.handleChange}
                                value={formik.values.school}
                                variant="outlined"
                                size="small"
                            />
                            <TextField
                                fullWidth
                                className={classes.modalTextField}
                                error={formik.touched.degree && formik.errors.degree}
                                helperText={(formik.errors.degree && formik.touched.degree) && formik.errors.degree}
                                id="degree"
                                label="Degree"
                                name="degree"
                                onChange={formik.handleChange}
                                value={formik.values.degree}
                                variant="outlined"
                                size="small"
                            />
                            <TextField
                                fullWidth
                                className={classes.modalTextField}
                                error={formik.touched.field_of_study && formik.errors.field_of_study}
                                helperText={(formik.errors.field_of_study && formik.touched.field_of_study) && formik.errors.field_of_study}
                                id="field_of_study"
                                label="Field of Study"
                                name="field_of_study"
                                onChange={formik.handleChange}
                                value={formik.values.field_of_study}
                                variant="outlined"
                                size="small"
                            />
                            <TextField
                                fullWidth
                                className={classes.modalTextField}
                                error={formik.touched.description && formik.errors.description}
                                helperText={(formik.errors.description && formik.touched.description) && formik.errors.description}
                                id="description"
                                label="Description"
                                name="description"
                                onChange={formik.handleChange}
                                value={formik.values.description}
                                variant="outlined"
                                size="small"
                            />
                            <FormControl variant="outlined" className={classes.formControl} size="small">
                                <InputLabel id="start_year">Start Year</InputLabel>
                                <Select
                                    labelId="start_year"
                                    id="start_year"
                                    name="start_year"
                                    value={formik.values.start_year !== undefined ? formik.values.start_year: ""}
                                    onChange={formik.handleChange}
                                    label="Start Year"
                                >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {range(1970, 2050)}
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" className={classes.formControl} size="small">
                                <InputLabel id="end_year">End Year</InputLabel>
                                <Select
                                    disabled={formik.values.currently_work}
                                    labelId="end_year"
                                    id="end_year"
                                    name="end_year"
                                    value={formik.values.end_year}
                                    onChange={formik.handleChange}
                                    label="End Year"
                                >
                                <MenuItem value="">
                                    None
                                </MenuItem>
                                {range(1970, 2050)}
                                </Select>
                            </FormControl>
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
                            id={varient === "update" ? selectedEducationItem.id: undefined} 
                            handleClose={handleAlertModalClose}
                            handleCredentialModalClose={handleModalClose}
                            type="education"
                        />
                    </Card>
                </form>
        </ThemeProvider>
  );
};
