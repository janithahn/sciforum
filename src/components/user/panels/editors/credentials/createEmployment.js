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
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from '@material-ui/core';
import { theme, useStyles } from '../../../styles/profileStyles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserEmployment, createUserEmployment } from '../../../../../redux/ActionCreators';
import AlertDialogSlide from '../alert/alert';

export default function CreateEmployment({ employment, handleModalClose, varient, selectedEmploymentItem }) {

  const classes = useStyles();
  
  const auth = useSelector(state => state.Auth);
  const dispatch = useDispatch();

  const range = (min, max) => [...Array(max - min + 1).keys()].map(i => <MenuItem key={i} value={i + min}>{i + min}</MenuItem>);

  const profileSchema = Yup.object().shape({
    position: Yup.string()
        .required()
        .min(1, 'Too Short!'),
    company: Yup.string()
        .required()
        .min(1, 'Too Short!'),
    start_year: Yup.date(),
    end_year: Yup.date(),
  });

  const formik = useFormik({
    initialValues: {
      position: varient === "create" ? "": selectedEmploymentItem.position, 
      company: varient === "create" ? "": selectedEmploymentItem.company,
      start_year: varient === "create" || selectedEmploymentItem.start_year === null ? "": selectedEmploymentItem.start_year,
      end_year: varient === "create" || selectedEmploymentItem.end_year === null ? "": selectedEmploymentItem.end_year,
      currently_work: varient === "create" ? false: selectedEmploymentItem.currently_work,
    },
    onSubmit: (values) => {
        const submitVal = {
            user: auth.currentUserId,
            position: values.position, 
            company: values.company,
            start_year: values.start_year === "" ? null: values.start_year,
            end_year: values.currently_work || values.end_year === "" ? null: values.end_year,
            currently_work: values.currently_work,
        }
        if(employment.includes(selectedEmploymentItem)) {
            dispatch(updateUserEmployment(submitVal, selectedEmploymentItem.id));
        }else {
            dispatch(createUserEmployment(submitVal));
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
                            subheader="Edit Employment"
                        />
                        <Divider />
                        <CardContent>
                            <TextField
                                fullWidth
                                className={classes.modalTextField}
                                error={formik.touched.position && formik.errors.position}
                                helperText={(formik.errors.position && formik.touched.position) && formik.errors.position}
                                label="Position"
                                id="position"
                                name="position"
                                onChange={formik.handleChange}
                                value={formik.values.position}
                                variant="outlined"
                                size="small"
                            />
                            <TextField
                                fullWidth
                                className={classes.modalTextField}
                                error={formik.touched.company && formik.errors.company}
                                helperText={(formik.errors.company && formik.touched.company) && formik.errors.company}
                                id="company"
                                label="Company"
                                name="company"
                                onChange={formik.handleChange}
                                value={formik.values.company}
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
                            <FormControlLabel
                                style={{margin: 3}}
                                control={<Checkbox checked={formik.values.currently_work} value="currently_work" color="primary" onChange={(event) => formik.setFieldValue('currently_work', event.target.checked)}/>}
                                label="Currently work here"
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
                            id={varient === "update" ? selectedEmploymentItem.id: undefined} 
                            handleClose={handleAlertModalClose}
                            handleCredentialModalClose={handleModalClose}
                            type="employment"
                        />
                    </Card>
                </form>
        </ThemeProvider>
  );
};
